var game = new Phaser.Game(800, 600, Phaser.AUTO, "game", {preload:preload, create:create, update:update});

function preload() {

    // centre the canvas
    game.scale.pageAlignHorizontally = true;
    game.scale.refresh();

    //game.load.image("btn", "assets/ui/my_button.png");

    //scrollpane assets
    game.load.atlasJSONArray("ui_pack", "assets/ui/30x60_sugar_ui_pack.png", "assets/ui/30x60_sugar_ui_pack.json");


    /*
    game.canvas.addEventListener('mousewheel',function(event){
        mouseController.wheel(event);
        return false;
    }, false);
    */

}

function create() {
    game.stage.backgroundColor = "#ffffff";
    game.antialias = false;


    var scrollpane = new OneBrokenPixel.UI.Scrollpane(game, 100, 40, "ui_pack", "green");
    for (var i = 0; i < 20; i++) {
        var colours = ["green", "red", "yellow", "orange"];
        var c = game.rnd.pick(colours);
        
        var item = new Phaser.Button(game, 0, 0, "ui_pack", null, null, 
                                     c+"_button.png", c+"_button.png", 
                                     c+"_button_pressed.png", c+"_button.png");
        scrollpane.addItem(20, 20+i*(item.height+10), item);
    }
}

function update() {
}
