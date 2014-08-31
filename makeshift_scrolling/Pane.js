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

// get and set feels quite arcane, is there some Javascript convention I can use
// instead? Modifiying this.height properties is out, as Phaser uses that for its 
// own purposes, and it holds group height.

OneBrokenPixel.UI.Pane.prototype.getHeight = function () {
    return this.background.height;
};

OneBrokenPixel.UI.Pane.prototype.getWidth = function () {
    return this.background.width;
};

/*
OneBrokenPixel.UI.Pane.prototype.move = function (newX, newY) {
    this.x = newX;
    this.y = newY;
};

OneBrokenPixel.UI.Pane.prototype.changeBackground = function (colour) {    
    this.background = this.create(0,0,this.atlasKey, colour+"_panel.png");
};
*/

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
