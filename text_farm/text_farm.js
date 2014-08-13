var game = new Phaser.Game(800, 600, Phaser.AUTO, "demo", {preload:preload, create:create, update:update});

function preload() {
    
    var path;
    if (typeof window.path === "undefined") {
        path = "";
    }
    else {
        path = window.path;
    }

    game.load.atlasJSONArray("buttons", "assets/ui/buttons.png", "assets/ui/buttons.json");
    //game.load.image("b1", "assets/ui/rect3142.png");
    // centre the canvas
    game.scale.pageAlignHorizontally = true;
    game.scale.refresh();
}

// 2500-2570 (box drawing)
// 2600-26f0 (misc symbols)
var button;
var text;
//var sym = ["└", "│", "┤", "╡", "╢", "╕", "╣", "║", "",╗╝╜╛┐ "", ""];

//["
var map;
function create() {
    game.stage.backgroundColor = "#FFFFFF";
    b1 = game.add.sprite(20,20,"b1");
    
    button = game.add.button(150,150, "buttons", buttonDown, this,
                             "button.png", "button.png", 
                             "button_down.png", "button.png");

    button.anchor.setTo(0.5, 0.5);

    text = game.add.text(0,0, "Ҩ", {font:"22px Arial"});
    //text = game.add.text(0,0, "a", style={font:"26px"});
    text.anchor.setTo(0.5, 0.5);
    text.position.x = button.position.x+2;
    text.position.y = button.position.y;
    

    //sym.door = "
    console.log("Ҩ");

}

function update() {
 
}

function buttonDown() {
   // button.position.x -=
}


