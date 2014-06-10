var game = new Phaser.Game(600, 400, Phaser.AUTO, "demo", {preload:preload, create:create, update:update});

// WebFont code taken from example Text -> Google Webfonts

//  The Google WebFont Loader will look for this object, so create it before loading the script.
WebFontConfig = {

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['Roboto Slab', 'Ubuntu']
    }

};

function preload() {

    // centre the canvas
     game.scale.pageAlignHorizontally = true;
     game.scale.refresh();

    var path;
    if (typeof window.path === "undefined") {
        path = "";
    }
    else {
        path = window.path;
    }

    game.load.atlas("pixels", path+"assets/pixels.png", path+"assets/pixels.json");
    game.load.atlasXML("buttons", path+"assets/greenButtons.png", path+"assets/greenButtons.xml");
    game.load.script("webfont", "//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js");
}

function create() {
    var tbtn = new Phaser.Button(game, 210, 30, "buttons", addSquare, this, 
                                 "green_button00.png", "green_button00.png", 
                                 "green_button02.png", "green_button00.png");
    game.add.existing(tbtn);

    var text = new Phaser.Text(game, 0, 0, "CLICK ME");
    game.add.existing(text);

    text.x = tbtn.x+tbtn.width/2 - 35;
    text.y = tbtn.y + tbtn.height / 2 - 7;    

    text.fontSize = 14;
    text.fill = "#191970";
    
        
}

function update() {
}

function addSquare(minSize, maxSize) {
    var minSize = 30;
    var maxSize = 100;

    var w = game.rnd.integerInRange(minSize, maxSize);
    var h = game.rnd.integerInRange(minSize, maxSize);
    var x = game.rnd.integerInRange(0,600-w);
    var y = game.rnd.integerInRange(0,400-h);
    var bodyCol = game.rnd.integerInRange(0,20);
    var borderCol = game.rnd.integerInRange(0,20);
    
    new Square(game, x, y, bodyCol, borderCol, w, h);
}
