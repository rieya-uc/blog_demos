OneBrokenPixel = {};

OneBrokenPixel.UI = function (game) {
    Phaser.Group.call(this, game);

    // prevent the canvas from passing events to the web page
    // (right now, this is only important for scrollpanes)
    game.input.mouse.capture = true;

    return this;
};

OneBrokenPixel.UI.prototype = Object.create(Phaser.Group.prototype);
OneBrokenPixel.UI.prototype.constructor = OneBrokenPixel.UI;

OneBrokenPixel.UI.Pane = function (game, x, y, atlasKey, colour, borders) {
    OneBrokenPixel.UI.call(this, game);

    this.x = x || 0;
    this.y = y || 0;

    this.background = this.create(0,0, atlasKey, colour+"_background.png");

    this.borders = {top: 8, bottom: 8, left: 8, right: 8};

    if (borders) {
        this.borders.top = borders.top;
        this.borders.bottom = borders.bottom;
        this.borders.left = borders.left;
        this.borders.right = borders.right;
    }
    
    // useable pane area (i.e window_size - border_size)
    this.activeHeight = this.getActiveHeight();
    this.activeWidth = this.getActiveWidth();

    this.content = game.add.group();
    this.add(this.content);              // make Pane this.content's parent so that when
    this.content.x = this.borders.left;  // we move Pane, this.content is moved with it
    this.content.y = this.borders.top;

    this.atlasKey = atlasKey;

    // it might be better to make this optional, masks can be expensive
    var mask = new PIXI.Graphics();
    mask.beginFill();
    mask.drawRect(this.x+this.borders.top, this.y+this.borders.left, this.activeWidth, this.activeHeight);
    mask.endFill();
    this.content.mask = mask;

    return this;

};

OneBrokenPixel.UI.Pane.prototype = Object.create(OneBrokenPixel.UI.prototype);
OneBrokenPixel.UI.Pane.prototype.constructor = OneBrokenPixel.UI.Pane;

OneBrokenPixel.UI.Pane.prototype.getHeight = function () {
    return this.background.height;
};

OneBrokenPixel.UI.Pane.prototype.getWidth = function () {
    return this.background.width;
};

OneBrokenPixel.UI.Pane.prototype.move = function (newX, newY) {
    this.x = newX;
    this.y = newY;
};


OneBrokenPixel.UI.Pane.prototype.changeBackground = function (colour) {    
    this.background = this.create(0,0,this.atlasKey, colour+"_panel.png");
};

OneBrokenPixel.UI.Pane.prototype.addItem = function(x, y, item) {
    this.content.add(item);
    item.x = x;
    item.y = y;

    this.bringToTop(this.content);
    item.bringToTop();
};

// pane's useable height, with regards to top and bottom borders
OneBrokenPixel.UI.Pane.prototype.getActiveHeight = function () {
    return this.background.height - this.borders.top - this.borders.bottom;
};

// pane's useable width with regards to left and right borders
OneBrokenPixel.UI.Pane.prototype.getActiveWidth = function () {
    return this.background.width - this.borders.left - this.borders.right;
};

/*
  OneBrokenPixel.UI.Pane.getContentX = function () {
  return this.content.x;
  };

  OneBrokenPixel.UI.Pane.getContentY = function () {
  return this.content.y;
  };
*/

OneBrokenPixel.UI.Scrollpane = function (game, x, y, atlasKey, colour, borders) {
    OneBrokenPixel.UI.Pane.call(this, game, x, y, atlasKey, colour, borders);


    this.track = this.create(0, 0, atlasKey, colour+"_track.png");

    this.track.x = this.width - 55;
    this.track.y = Math.floor(this.getHeight()/2 - this.track.height/2);

    // account for the decorative part of the track the grip can't move over
    this.track.activeHeight = this.track.height - 4;
    this.track.activeY = this.track.y + 2;


    this._minGripHeight = 30;
    this._maxGripHeight = this.track.activeHeight;
    this._dragRatio = 0;

    // arbitrary, whatever feels right - amount to move per scroll wheel movement
    this._moveUnit = 50;  

    this.contentHeight = 30;

    this.grip = new Phaser.Image(this.game, 0, 0, atlasKey, colour+"_grip1.png");
    var gripmid = new Phaser.Image(this.game, 0, this.grip.height, atlasKey, colour+"_grip2.png");
    var gripbottom = new Phaser.Image(this.game, 0, this.grip.height+gripmid.height, atlasKey, colour+"_grip3.png");

    gripmid.smoothed = false;

    this.grip.addChildAt(gripmid,0);
    this.grip.addChildAt(gripbottom, 1);

    this.addChild(this.grip);
    
    this.grip.x = Math.floor((this.track.x + this.track.width/2) - (this.grip.width/2));
    this.grip.y = this.track.activeY;

    this.grip.inputEnabled = true;
    this.grip.input.allowHorizontalDrag = false;

    var childrenHeight = this.grip.getChildAt(0).height + this.grip.getChildAt(1).height;
    this.grip.input.enableDrag(false, false, false, 255,
                               new Phaser.Rectangle(this.grip.x, this.track.activeY,
                                                    this.grip.width, this.track.activeHeight-childrenHeight));

    this._setGripHeight(this._maxGripHeight);    

    // enable the mouse's scrollwheel
    if (game.device.desktop) { // (does this include laptops?)
        console.log("desktop");
        
        var paneArea = new Phaser.Rectangle(this.x, this.y, 
                                            this.background.width, 
                                            this.background.height);
        var that = this;
        
        game.input.mouse.mouseWheelCallback = function (event) {
            if (paneArea.contains(game.input.x, game.input.y)) {
                if (game.input.mouse.wheelDelta === 1) {
                    that._scrollWheelUp();
                }
                else if (game.input.mouse.wheelDelta === -1) {
                    that._scrollWheelDown();
                }
            }
        
        };

    }

    /*
      panelMask = game.add.image(0,0,"panelMask");
      panelMask.anchor.setTo(0.5, 0.5);
      panelMask.x = panel.x + panel.width/2;
      panelMask.y = panel.y + panel.height/2;
      panelMask.z = 1;
    */

    return this;
};



OneBrokenPixel.UI.Scrollpane.prototype = Object.create(OneBrokenPixel.UI.Pane.prototype);
OneBrokenPixel.UI.Scrollpane.prototype.constructor = OneBrokenPixel.UI.Scrollpane;

OneBrokenPixel.UI.Scrollpane.prototype.addItem =  function (x, y, item) {

    // add item to content group
    this.content.add(item);
    item.x = x;
    item.y = y;

    this.bringToTop(this.content);
    item.bringToTop();
    
    if (this.contentHeight < item.y + item.height + 20) {
        this.contentHeight = item.y + item.height + 20;        
    }

    // resize the grip
    var windowContentRatio = this.activeHeight / this.contentHeight;
    var newGripHeight =  this.track.activeHeight * windowContentRatio;
    this._setGripHeight(newGripHeight);

    var windowScrollAreaSize = this.contentHeight - this.activeHeight;
    var trackScrollAreaSize = this.track.activeHeight - this._getGripHeight();
    this._dragRatio = windowScrollAreaSize / trackScrollAreaSize;

    //console.log(item.events);
};

OneBrokenPixel.UI.Scrollpane.prototype._getGripHeight = function () {
    return this.grip.height + this.grip.getChildAt(0).height + this.grip.getChildAt(1).height;
};

OneBrokenPixel.UI.Scrollpane.prototype._getGripChildrenHeight = function () {
    return this.grip.getChildAt(0).height + this.grip.getChildAt(1).height;
};

OneBrokenPixel.UI.Scrollpane.prototype._setGripHeight = function (height) {
    var h;
    if (height < this._minGripHeight) {
        h = this._minGripHeight;
    }
    else if (height > this._maxGripHeight) {
        h = this._maxGripHeight;
    }
    else {
        h = height;
    }

    if (this._getGripHeight() !== h) {
        var gripmid = this.grip.getChildAt(0);
        var gripbottom = this.grip.getChildAt(1);
        h = h - this.grip.height - gripbottom.height;
        gripmid.height = h;
        gripbottom.y = gripmid.y + h;

        var childrenHeight = gripmid.height + gripbottom.height;
        this.grip.input.boundsRect = new Phaser.Rectangle(this.grip.x, this.track.activeY,
                                                          this.grip.width, this.track.activeHeight-childrenHeight);
    }
};

OneBrokenPixel.UI.Scrollpane.prototype.update = function () {
    // at max grip height, 
    if (this.grip.input.isDragged && this._getGripHeight() < this._maxGripHeight) {
        // move content group upwards by drag ratio
        this.content.y = this.borders.top - (this.grip.y-this.track.activeY) * this._dragRatio;
    }
};

OneBrokenPixel.UI.Scrollpane.prototype._scrollWheelUp = function () {
    var limit = this.borders.top; // how far upwards the content window is allowed to move

    if (this.content.y < limit) {
        var diff = limit - this.content.y;
        if (diff < this._moveUnit) {
            this.content.y = limit;
        }
        else {
            this.content.y += this._moveUnit;
        }
        this.grip.y = Math.floor(((this.borders.top - this.content.y) / this._dragRatio) 
                                 + this.track.activeY);
    }
};

OneBrokenPixel.UI.Scrollpane.prototype._scrollWheelDown = function () {

    var cb = this.content.y + this.contentHeight;  // position of the bottom of the content window
    var limit = this.getHeight() - this.borders.bottom;  // how far upwards cb is allowed to move

    if (cb > limit) {
        var diff = cb - limit;
        if (diff < this._moveUnit) {
            this.content.y = limit - this.contentHeight;
        }
        else {
            this.content.y -= this._moveUnit;
        }
        this.grip.y = Math.floor(((this.borders.top - this.content.y) / this._dragRatio) 
                                 + this.track.activeY);
    }
};
