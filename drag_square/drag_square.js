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

function create() {
    //var i;
    //for (i=0; i < 15; i++) {
        
}

function update() {
}
