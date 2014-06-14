var game = new Phaser.Game(800, 600, Phaser.AUTO, "demo", {preload:preload, create:create, update:update});

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
}

var ninja;
function create() {
    ninja = game.add.sprite(100,100,"ninja");
    ninja.scale.setTo(0.5, 0.5);
    ninja.anchor.setTo(0.5, 0.5);
    
    // enable physics on our player
    game.physics.enable(ninja, Phaser.Physics.ARCADE);
    
    
    game.stage.backgroundColor = '#DDDDDD';

    
}

function update() {
    game.physics.arcade.moveToPointer(ninja, 400);
    //console.log(game.input.position);
    //  if it's overlapping the mouse, don't move any more
    if (Phaser.Rectangle.contains(ninja.body, game.input.x, game.input.y)) {
        //ninja.body.position = game.input.position;
        ninja.body.velocity.setTo(0, 0);
        //console.log("risnt");
    }
    
}
