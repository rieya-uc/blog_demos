Square = function (game, x, y, bodyColourIndex, borderColourIndex, width, height) {
    Phaser.Group.call(this, game);
    
    this.bsize = 4;
    this.width = width;
    this.height = height;
    
    this.body = this.create(x, y, "pixels");
    this.body.frame = bodyColourIndex;
    this.body.width = width;
    this.body.height = height;
    
    this.topBorder = this.create(x, y, "pixels");
    this.topBorder.frame = borderColourIndex;
    this.topBorder.width = width;
    this.topBorder.height = this.bsize;

    this.leftBorder = this.create(x, y, "pixels");
    this.leftBorder.frame = borderColourIndex;
    this.leftBorder.width = this.bsize;
    this.leftBorder.height = height;

    this.rightBorder = this.create(x+width-this.bsize, y, "pixels");
    this.rightBorder.frame = borderColourIndex;
    this.rightBorder.width = this.bsize;
    this.rightBorder.height = height;

    this.bottomBorder = this.create(x, y+height-this.bsize, "pixels");
    this.bottomBorder.frame = borderColourIndex;
    this.bottomBorder.width = width;
    this.bottomBorder.height = this.bsize;
    
    this.body.inputEnabled = true;
    this.body.input.enableDrag();

    this.body.events.onDragStop.add(function() {
        this.moveTo(this.body.position);  
    }, this);
    
};

Square.prototype = Object.create(Phaser.Group.prototype);
Square.prototype.constructor = Square;

Square.prototype.update = function() {
    if (this.body.input.isDragged) {
        this.moveTo(this.body.position);         
    }
};

Square.prototype.moveTo = function(pos) {
        this.topBorder.position = pos;
        this.leftBorder.position = pos
        this.bottomBorder.position.x = pos.x;
        this.bottomBorder.position.y = this.height + pos.y - this.bsize;
        this.rightBorder.position.x = this.width + pos.x - this.bsize;
        this.rightBorder.position.y = pos.y
};    


    
    
