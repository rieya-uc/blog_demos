var game = new Phaser.Game(800, 600, Phaser.AUTO, "game", {preload:preload, create:create, update:update});

function preload() {

    // centre the canvas
    game.scale.pageAlignHorizontally = true;
    game.scale.refresh();

    //game.load.image("btn", "assets/ui/my_button.png");

    //scrollpane assets
    game.load.atlasJSONArray("ui_pack", "assets/ui/ui_sugar_pack.png", "assets/ui/ui_sugar_pack.json");
}

function create() {
    game.stage.backgroundColor = "#ffffff";
    game.antialias = false;


    var scrollpane = new OneBrokenPixel.UI.Scrollpane(game, 100, 40, "ui_pack", "green");
    for (var i = 0; i < 300; i++) {
        var item = game.add.image(0, 0, "ui_pack", "green_button.png");
        //item.width *= 0.60;
        //item.height *= 0.85;
        scrollpane.addItem(20, 20+i*(item.height+10), item);
    }
}

function update() {
}
