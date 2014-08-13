var game = new Phaser.Game(1024, 800, Phaser.AUTO, "game", {preload:preload, create:create, update:update});

function preload() {

    // centre the canvas
    game.scale.pageAlignHorizontally = true;
    game.scale.refresh();
    
    game.load.atlasXML("ui",  "assets/ui/greySheet.png", "assets/ui/greySheet.xml" );
    game.load.image("background", "assets/ui/background.png");
    game.load.image("panel", "assets/ui/panel.png");
    game.load.image("panel2", "assets/ui/panel2.png");
    //game.load.image("panelMask", "assets/ui/panelMask.png");
    game.load.image("grip", "assets/ui/grip.png.");

    game.load.image("btn", "assets/ui/my_button.png");

    game.load.image("hline", "assets/ui/hline.png");
    game.load.image("tab", "assets/ui/tab.png");

    //scrollpane assets
    game.load.atlasJSONArray("ui_pack", "assets/ui/sugar_ui_pack.png", "assets/ui/sugar_ui_pack.json");
}

function create() {
    game.stage.backgroundColor = "#ffffff";
    game.antialias = false;

    /*
    var pane = game.add.image(100, 40, "ui_pack", "green_panel.png");
    var track = game.add.image(0,0,"ui_pack", "green_track.png");
    track.x = pane.x + pane.width - 45;
    track.y = Math.floor((pane.y + pane.height/2) - (track.height/2));

    var grip = game.add.group();
    
    var griptop = grip.create(0,0,"ui_pack", "green_grip1.png");
    var gripmid = grip.create(0,griptop.height,"ui_pack", "green_grip2.png");
    gripmid.height *= 5;
    var gripbottom = grip.create(0, gripmid.y + gripmid.height, "ui_pack", "green_grip3.png");

    grip.setAll("smoothed", false);
    grip.x = Math.floor((track.x + track.width/2) - (grip.width/2));
    grip.y = track.y + 100;
    */

    var scrollpane = new OneBrokenPixel.UI.Pane(game, 100, 40, "ui_pack", "green");
    scrollpane.move(400, 280);
    scrollpane.changeBackground("red");

    
    /*
    this.scrollpane = new OneBrokenPixel.UI.Scrollpane(game, 20, 50, panel.width, panel.height, panel);

    for (i=0; i<100; i++) {
        var button = new Phaser.Button(game, 0, 0, "ui", buttonDown, this, 
                                       "grey_button00.png", "grey_button00.png", 
                                       "grey_button00.png", "grey_button00.png");
        button.width *= 0.85;
        this.scrollpane.addItem(button);
    }
    */
}

function update() {
}
