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

    game.load.spritesheet("pixels", path+"assets/pixels.png", 4, 4);
}

var p1, p2, p3, p4;

function create() {
    //game.stage.backgroundColor = '#DDDDDD';
    
    /*
    var p2 = game.add.sprite(100,100, "pixels");
    p2.frame = 10;
    p2.width = 50;
    p2.height = 50;
    */
    game.stage.smoothing = false; 
    var j = 0;
    var k = 0;
    for (var i = 0; i < 21; i++) {
        if (i % 7 === 0) {
            j++;
            k = 0;
                
        }
        var p1 = game.add.sprite(100+(k*5), 100+(j*5), "pixels");
        p1.frame = i;
    
        //p1.width = 40;
        //p1.height = 40;
        k++;
    }

    var p2 = game.add.sprite(100,200,"pixels");
    p2.frame = 10;
    p2.width = 100;

    var p3 = game.add.sprite(50,100,"pixels");
    p3.frame = 9;
    p3.height = 100;
    p3.width = 10;
    
}

function update() {

}
