var game = new Phaser.Game(800, 600, Phaser.AUTO, "game", {preload:preload, create:create, update:update});

//  The Google WebFont Loader will look for this object, so create it before loading the script.
WebFontConfig = {

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['Roboto Slab']
    }

};

var onscreenText = null;

function preload() {

    // centre the canvas
    game.scale.pageAlignHorizontally = true;
    game.scale.refresh();

    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

    //scrollpane assets
    game.load.atlasJSONArray("ui_pack", "assets/ui/30x60_sugar_ui_pack.png", "assets/ui/30x60_sugar_ui_pack.json");
    game.load.spritesheet("square_people", "assets/chars/little_square_people.png", 32, 64, -1, 2, 2);

}


function create() {
    game.stage.backgroundColor = "#ffffff";
    game.antialias = false;

    //var sx = 
    var scrollpane = new OneBrokenPixel.UI.Scrollpane(game, 20, 50, "ui_pack", "green");
 
    var scrollAdd = addToScrollpane(scrollpane);
    var button = game.add.button(320, 100, "ui_pack", scrollAdd, this,
                                 "orange_button.png", "orange_button.png", 
                                 "orange_button_down.png", "orange_button.png");
    var btnText = game.add.text(0, 0, "Add button", {font:"22px Roboto Slab"});   
 
    button.scale.setTo(1.5, 1.5);

    btnText.anchor.setTo(0.5, 0.5);
    btnText.x = button.x + button.width/2;
    btnText.y = button.y + 40;

    scrollAdd();

    onscreenText = game.add.text(320, 250, "Hello", {font: "26px Roboto Slab"});
    displayMessage("Click the button to add a random villager.", 40);
}

function update() {
}

// My first attempt at a closure, I hope this is right!
function addToScrollpane(scrollpane) {
    var x = 20;
    var y = 20;

    function add() {

        var villager = createVillager();
        villager.x = 20;
        var job = new Phaser.Text(game, 75, 28, 
                                  villager.job.charAt(0).toUpperCase() + villager.job.slice(1), 
                                  {font: "16px Roboto Slab"});

        var scrollButton = createCompositeButton(0, 0, null, 
                                                 function() { displayMessage(villager.sayHello(), 40); }, 
                                                 [villager, false, true,
                                                  job, false, false]);

        scrollpane.addItem(x, y, scrollButton);

        y += scrollButton.height + 10;
    };

    return add;
}

function createVillager() {

    var frame = game.rnd.integerInRange(0,11);
    var villager = new Phaser.Image(game, 0, 0, "square_people", frame);
    villager.smoothed = false;
    villager.scale.setTo(0.5, 0.5);
  
    var job = "none";
    if (frame < 4) {
        job = "farmer";
    }
    else if (frame < 8) {
        job = "miner";
    }
    else if (frame < 12) {
        job = "woodcutter";
    }
    
    villager.job = job;

    villager.sayHello = function() {
       return "Hello, I am a " + villager.job + ".";
    }
    
    return villager;
}

// imagesArray - array of the sprites/images/text to be placed on top of the button
// should be organised thus [sprite1, booleanX, booleanY, sprite2, booleanX, booleanY, ....]
// booleanX/booleanY should be true if we want the sprite to be centered
// horizontally/vertically. Otherwise  use sprite.x, sprite.y to set position
// (I'll look at a proper commenting system for next time, I promise!)
function createCompositeButton(x, y, colour, callback, imagesArray) {
    

    //var c = (colour && colour != null) ? colour : game.rnd.pick(["green", "red", "yellow", "orange"]);
    var c = colour || game.rnd.pick(["green", "red", "yellow", "orange"]);
    var button = new Phaser.Button(game, x, y, "ui_pack",
                                   callback, this,
                                   c+"_button.png", c+"_button.png", 
                                   c+"_button_down.png", c+"_button.png");
    button.colour = c;

    if (imagesArray) {
        var i;
        for (i = 0; i < imagesArray.length; i+=3) {

            imagesArray[i].anchor.setTo(0.5, 0.5);
 
            // centre the images if requested
            if (imagesArray[i+1]) {
                imagesArray[i].x = button.width/2;
            }
            if (imagesArray[i+2]) {
                imagesArray[i].y = button.height/2;
            }

            button.addChild(imagesArray[i]);
        }
    }

    return button;
}

function displayMessage(msg, maxLength) {

    var formattedMsg = "";

    var lines = msg.split("\n");
    var i, j, llen = 0;

    for (i = 0; i < lines.length; i++) {
        var words = lines[i].split(" ");

        for (j = 0; j < words.length; j++) {
            var word = words[j];
           
            if (llen+word.length+1 <= maxLength) {
                formattedMsg += word + " ";
                llen += word.length+1;
            }
            else {
                formattedMsg += "\n" + word;
                llen = 0;
            }
        }

        formattedMsg += "\n";
    }

    onscreenText.setText(formattedMsg);
}
