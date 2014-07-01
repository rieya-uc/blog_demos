var game = new Phaser.Game(800, 600, Phaser.AUTO, "demo", {preload:preload, create:create, update:update, render:render});


var map;
var layer;
var player;
var cursorKeys;
var animRef;
var speed;

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
}

function create() {

    game.stage.backgroundColor = '#2F8136';

    map = game.add.tilemap("map");
    map.addTilesetImage("plowed_soil", "soil");
    map.addTilesetImage("plants", "plants");

    layer = map.createLayer("background");
    layer = map.createLayer("plants");
    
    //layer.resizeWorld();

    cursorKeys = game.input.keyboard.createCursorKeys();
    speed = 2;
    lastKeyPressed = null;
    animRef = null;

    player = game.add.sprite(100,100,"player");

    var animSpeed = 8;
    player.animations.add("walkUp", [0,1,2,1], animSpeed, true);
    player.animations.add("walkDown", [6,7,8,7], animSpeed, true);
    player.animations.add("walkLeft", [9,10,11,10], animSpeed, true);
    player.animations.add("walkRight", [3,4,5,4], animSpeed, true);

    player.frame = 7;
 

}



function update() {

    
    if (cursorKeys.up.isDown) {
        animRef = animRef || player.animations.play("walkUp");
        player.position.y -= speed;
    }
    else if (cursorKeys.down.isDown) {
        animRef = animRef || player.animations.play("walkDown");
        player.position.y += speed;
    }
    else if (cursorKeys.left.isDown) {
        animRef = animRef || player.animations.play("walkLeft");
        player.position.x -= speed;
    }
    else if (cursorKeys.right.isDown) {
        animRef = animRef || player.animations.play("walkRight");
        player.position.x += speed;
    }
    else if (animRef !== null ) {
        animRef.setFrame(1, true);
        animRef.stop();
        animRef = null;
    }

    
    

}

function render() {
}
