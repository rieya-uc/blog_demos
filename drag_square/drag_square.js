var game = new Phaser.Game(600, 400, Phaser.AUTO, "demo", {preload:preload, create:create, update:update});

// WebFont code taken from example Text -> Google Webfonts

//  The Google WebFont Loader will look for this object, so create it before loading the script.
WebFontConfig = {

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['Roboto Slab']
    }

};

function preload() {

    // centre the canvas
    // game.scale.pageAlignHorizontally = true;
    // game.scale.refresh();

    var path;
    if (typeof window.path === "undefined") {
        path = "";
    }
    else {
        path = window.path;
    }
    game.load.atlas("pixels", path+"assets/pixels.png", path+"assets/pixels.json");
}

var s2, square;
var p1, p2, p3, p4;

function create() {
    game.stage.smoothing = false; 
    square = new Square(game, 0, 0,  9, 10, 100, 100);
    s2 = new Square(game, 0, 100, 0, 0, 100, 100);

}

function update() {
}

function render() {
    /*
    game.debug.spriteBounds(s2.body);
    game.debug.spriteCorners(s2.body, true, true);
    game.debug.spriteInfo(s2.body,32,32);
    */
}
