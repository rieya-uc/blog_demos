/* This will probably be of use - http://csdgn.org/inform/scrollbar-mechanics
   The only difference is in Scrolling The Content, we don't have (or need)
   mousePositionDelta, and it can be simplified to a few lines in update()
*/
   
OneBrokenPixel.UI.Scrollpane = function (game, x, y, atlasKey, colour, borders) {
    OneBrokenPixel.UI.Pane.call(this, game, x, y, atlasKey, colour, borders);

    // the ui assets are pretty much hardcoded, if you want to use your own
    // you'll probably have to fiddle around with the code
    // (or use the same naming format in 30x60_sugar_ui_pack)
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

    // padding added to the bottom of the content window
    this.contentHeight = 30;

    // grip is made up of 3 images. The middle image's height is modified as the
    // grip grows and shrinks
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
    var newGripHeight =  Math.round(this.track.activeHeight * windowContentRatio);
    this._setGripHeight(newGripHeight);

    var windowScrollAreaSize = this.contentHeight - this.activeHeight;
    var trackScrollAreaSize = this.track.activeHeight - this._getGripHeight();
    this._dragRatio = windowScrollAreaSize / trackScrollAreaSize;

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

    // grow or shrink the middle section of this.grip, and reposition the bottom section
    if (this._getGripHeight() !== h) {
        var gripmid = this.grip.getChildAt(0);
        var gripbottom = this.grip.getChildAt(1);
        h = h - this.grip.height - gripbottom.height;
        gripmid.height = h;
        gripbottom.y = gripmid.y + h;

        var childrenHeight = gripmid.height + gripbottom.height;
        // grip can only be dragged inside this rectangle (i.e the track area)
        this.grip.input.boundsRect = new Phaser.Rectangle(this.grip.x, this.track.activeY,
                                                          this.grip.width, this.track.activeHeight-childrenHeight);
    }
};

OneBrokenPixel.UI.Scrollpane.prototype.update = function () {
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
