var game = new Phaser.Game(600, 400, Phaser.AUTO, "demo", {preload:preload, create:create, update:update});

function preload() {

    // button sprites taken from opengameart.org/content/ui-pack
    // credit to Kenny.nl

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

    game.load.atlas("pixels", path+"assets/pixels.png", path+"assets/pixels.json");
    game.load.atlasXML("buttons", path+"assets/ui/greenButtons.png", path+"assets/ui/greenButtons.xml");
}

function create() {
    var tbtn = new Phaser.Button(game, game.width/2, 30, "buttons", addSquare, this, 
                                 "green_button00.png", "green_button00.png", 
                                 "green_button02.png", "green_button00.png");
    tbtn.anchor.setTo(0.5, 0.5);
    game.add.existing(tbtn);

    // no text buttons in phaser, used a sprite button
    // and overlaid text on top of it
    var text = new Phaser.Text(game, 0, 0, "CLICK ME");
    game.add.existing(text);

    text.anchor.setTo(0.5, 0.5);
    text.x = tbtn.x;
    text.y = tbtn.y;    

    text.fontSize = 14;
    text.fill = "#191970";
}

function update() {
}

// add a square at a random position on screen
function addSquare() {
    var minSize = 30;
    var maxSize = 150;

    var w = game.rnd.integerInRange(minSize, maxSize);
    var h = game.rnd.integerInRange(minSize, maxSize);
    var x = game.rnd.integerInRange(0,game.width-w);
    var y = game.rnd.integerInRange(0,game.height-h);
    var bodyCol = game.rnd.integerInRange(7,20);
    var borderCol = game.rnd.integerInRange(0,6);

    return new Square(game, x, y, bodyCol, borderCol, w, h);
}
