// S

Square = function (game, x, y, bodyColourIndex, borderColourIndex, width, height) {
    Phaser.Group.call(this, game);

    var bsz = 4;

    this.dx = 0;
    this.dy = 0;
    this.dragging = true;


    this.x = x;
    this.y = y;

    this.body = this.create(0, 0, "pixels");
    this.body.frame = bodyColourIndex;
    this.body.width = width;
    this.body.height = height;
    
    this.topBorder = this.create(0, 0, "pixels");
    this.topBorder.frame = borderColourIndex;
    this.topBorder.width = width;
    this.topBorder.height = bsz;

    this.leftBorder = this.create(0, 0, "pixels");
    this.leftBorder.frame = borderColourIndex;
    this.leftBorder.width = bsz;
    this.leftBorder.height = height;

    this.rightBorder = this.create(width-bsz, 0,"pixels");
    this.rightBorder.frame = borderColourIndex;
    this.rightBorder.width = bsz;
    this.rightBorder.height = height;

    this.bottomBorder = this.create(0, height-bsz, "pixels");
    this.bottomBorder.frame = borderColourIndex;
    this.bottomBorder.width = width;
    this.bottomBorder.height = bsz;

    this.body.inputEnabled = true;

    /*
    this.body.input.enableDrag(true);

    this.body.input.onDragStart(function() {
        this.dx = this.body.position.x;
        this.dy = this.body.position.y;
    });

    this.body.input.onDragEnd(function() {
        this.dx = 0;
        this.dy = 0;
    });
    */                            
    //this.body.

    
    this.body.events.onInputDown.add(function() {
        this.dx = this.body.input.pointerX();
        this.dy = this.body.input.pointerY();
    }, this);
    

};

Square.prototype = Object.create(Phaser.Group.prototype);
Square.prototype.constructor = Square;

Square.prototype.update = function() {
    if (this.body.input.pointerDown(0)) {
        //this.position.x = this.body.input.pointerX();
        //this.position.y = this.body.input.pointerY();
        
        this.position.x += (this.body.input.pointerX() - this.dx);
        this.position.y += (this.body.input.pointerY() - this.dy);
        this.dx = this.body.input.pointerX();
        this.dy = this.body.input.pointerY();
        
    }
};



    
    
