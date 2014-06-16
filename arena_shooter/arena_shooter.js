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


    // hide the target when it's over the game
    game.canvas.onmouseover = function() {
        game.canvas.style.target = "none";
    }
    game.canvas.onmouseout = function() {
        game.canvas.style.target = "default";
    }
}

var ninja, dest, target, perimeter;

function create() {

    game.time.deltaCap = 1/60;

    ninja = game.add.sprite(100,100,"ninja");
    ninja.scale.setTo(0.5, 0.5);
    ninja.anchor.setTo(0.5, 0.5);

    // enable physics on our player
    game.physics.enable(ninja, Phaser.Physics.ARCADE);
    ninja.body.allowRotation = false;

    // where the ninja is moving to
    dest = game.add.sprite(150, 150, "circle");
    dest.scale.setTo(0.4, 0.4);
    dest.anchor.setTo(0.5, 0.5);
    dest.position = game.input.position;

    // mouse target
    target = game.add.sprite(0,0, "circle");
    target.scale.setTo(0.2, 0.2);
    target.anchor.setTo(0.5, 0.5);
    //target.position = game.input.position;

    // test circle, mouse boundaries
    //perimeter = game.add.sprite(200,200,"circle");
    //perimeter.scale.setTo(1,1);
    //perimeter.anchor.setTo(0.5, 0.5);

    game.stage.backgroundColor = '#DDDDDD';

    
}
var rotation = 0;
function update() {
    var r = 60;

    if (game.input.activePointer.circle.contains(ninja.x, ninja.y)) {
        ninja.body.velocity.setTo(0,0);
        // snap ninja's centre to mouse position,
        // compare how position is set here to how target.position
        // is set in create()
        ninja.position.x = game.input.position.x;
        ninja.position.y = game.input.position.y;

        /*
        if (game.physics.arcade.distanceToPointer(target) > r) {
            rotation = game.physics.arcade.angleToPointer(target);
            target.position.x = ninja.position.x - r*Math.cos(rotation);
            target.position.y = ninja.position.y - r*Math.sin(rotation);
        }
        */
    }
    else {
        rotation = game.physics.arcade.moveToPointer(ninja, 800);
        /*
        target.position.x = ninja.position.x - r*Math.cos(rotation);
        target.position.y = ninja.position.y - r*Math.sin(rotation);
        */

    }

    if (game.physics.arcade.distanceToPointer(target) > r) {
        rotation = game.physics.arcade.angleToPointer(target);
        target.position.x = ninja.position.x - r*Math.cos(rotation);
        target.position.y = ninja.position.y - r*Math.sin(rotation);
    }
    //target.position.x = ninja.position.x;
    //target.position.y = ninja.position.y - d;
    //console.log(game.physics.arcade.angleToPointer(ninja));
}

function render() {
    //game.debug.body(ninja);
    //game.debug.body(dest);
}
