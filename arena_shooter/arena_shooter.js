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

function create() {
    var ninja = game.add.sprite(100,100,"ninja");
    ninja.scale.setTo(0.5, 0.5);
    ninja.anchor.setTo(0.5, 0.5);
    game.stage.backgroundColor = '#DDDDDD';
}

function update() {
}
