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

    // dice spritesheet taken from opengameart.org/content/boardgame-pack
    // credit to Kenney.nl
    // Blur scripts taken from example Filters -> Blur
    // credit to Mat Groves, matgroves.com
    
    var path;
    if (typeof window.path === "undefined") {
        path = "";
    }
    else {
        path = window.path;
    }

    // centre the canvas
    // game.scale.pageAlignHorizontally = true;
    // game.scale.refresh();

    game.load.spritesheet("dice", path + "assets/diceRed.png", 64, 64);
    game.load.script("BlurX", path + "assets/BlurX.js");
    game.load.script("BlurY", path + "assets/BlurY.js");
    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
}

var text;
var diceGroup;
function create() {

    diceGroup = game.add.group();

    var i;
    for (i=0; i < 5; i++) {
        var d = new Dice(game, i*100+90, 190);
        diceGroup.add(d);
    }

    // roll the dice when a mouse button is clicked
    game.input.onDown.add(
        function() {
            var total = 0;
            diceGroup.callAll("roll", null);
        });
     

    text = game.add.text(30,90, "Total: ");
    text.font = "Roboto Slab";
    text.fontSize = 30;
    text.fill = "#d3d3d3";

}

function update() {
    // I don't like having the foreach code run so often.
    // Ideally it would only be run when the dice have finished
    // rolling, but I haven't worked out how to do that yet.
    var total = 0;
    diceGroup.forEach(function(item) { total += item.value(); });
    text.setText("Total: " + total);
}
