var game = new Phaser.Game(800, 600, Phaser.AUTO, "demo", {preload:preload, create:create, update:update, render:render});


var map;
var layer;
var player;
var cursorKeys;

function preload() {

    var path;
    if (typeof window.path === "undefined") {
        path = "";
    }
    else {
        path = window.path;
    }

    // centre the canvas
    game.scale.pageAlignHorizontally = true;
    game.scale.refresh();

    game.load.tilemap("map", "assets/daneeklu_tilesets/map.json", null, Phaser.Tilemap.TILED_JSON);
    game.load.image("soil", "assets/daneeklu_tilesets/plowed_soil.png");
    game.load.image("plants", "assets/daneeklu_tilesets/plants.png");

    // char
    game.load.spritesheet("player", "assets/chars/mage_f.png", 32, 36);

    cursorKeys = game.input.keyboard.createCursorKeys();
}

function create() {

    game.stage.backgroundColor = '#2F8136';

    map = game.add.tilemap("map");
    map.addTilesetImage("plowed_soil", "soil");
    map.addTilesetImage("plants", "plants");

    layer = map.createLayer("background");
    layer = map.createLayer("plants");
    
    player = game.add.sprite(100,100,"player");
    player.animations.add("walkRight", [3,4,5,4], 7, true);
    player.animations.add("walkLeft", [9,10,11,9], 7, true);
    player.animations.add("walkUp", [0,1,2,1], 7, true);
    player.animations.add("walkDown", [6,7,8,7], 7, true);
    
    //layer.resizeWorld();
}



function update() {

    if (cursorKeys.up.isDown) {
        player.animations.play("walkUp");
    }
    else if (cursorKeys.down.isDown) {
        player.animations.play("walkDown");
    }
    else if (cursorKeys.left.isDown) {
        player.animations.play("walkLeft");
    }
    else if (cursorKeys.right.isDown) {
        player.animations.play("walkRight");
    }
    console.log(player.animations.isPlaying);

}

function render() {
}
