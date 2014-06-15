var game = new Phaser.Game(800, 600, Phaser.AUTO, "demo", {preload:preload, create:create, update:update, render:render});

function preload() {

    var path;
    if (typeof window.path === "undefined") {
        path = "";
    }
    else {
        path = window.path;
    }

    // centre the canvas
    game.scale.pageAlignHorizontally = true;
    game.scale.refresh();

    game.load.image("ninja", path+"assets/chars/ninja.png");
    game.load.image("circle", path+"assets/dashed_circle.png");


    // hide the cursor when it's over the game
    game.canvas.onmouseover = function() {
        game.canvas.style.cursor = "none";
    }
    game.canvas.onmouseout = function() {
        game.canvas.style.cursor = "default";
    }
}

var ninja, dcircle;

function create() {
    ninja = game.add.sprite(100,100,"ninja");
    ninja.scale.setTo(0.5, 0.5);
    ninja.anchor.setTo(0.5, 0.5);

    // enable physics on our player
    game.physics.enable(ninja, Phaser.Physics.ARCADE);
    ninja.body.allowRotation = false;
    dcircle = game.add.sprite(150, 150, "circle");
    dcircle.scale.setTo(0.5, 0.5);
    dcircle.anchor.setTo(0.5, 0.5);
    game.stage.backgroundColor = '#DDDDDD';

    
}

function update() {

    dcircle.position = game.input.position;
    ninja.rotation = game.physics.arcade.moveToPointer(ninja, 400, game.activePointer,50);


     /*


    //  if it's overlapping the mouse, don't move any more
    if (Phaser.Rectangle.contains(ninja.body, game.input.x, game.input.y)) {
        ninja.body.velocity.setTo(0, 0);

    }
    */
}

function render() {
    game.debug.body(ninja);
    game.debug.body(dcircle);
}
