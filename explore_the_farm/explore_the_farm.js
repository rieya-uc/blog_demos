var game = new Phaser.Game(800, 600, Phaser.AUTO, "demo", {preload:preload, create:create, update:update, render:render});


var map;
var layer;
var plantsLayer;
var player;
var cursorKeys;
var animRef;
var speed;
var scenery;
var fps;

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
    game.load.image("farming", "assets/daneeklu_tilesets/farming_fishing.png");

    // char
    game.load.spritesheet("player", "assets/chars/mage_f.png", 32, 36);
}

function create() {
    // limit the fps, prevents physics errors, 1/60 = 60fps
    //game.time.deltaCap = 1/60;

    game.stage.backgroundColor = '#2F8136';

    map = game.add.tilemap("map");
    map.addTilesetImage("plowed_soil", "soil");
    map.addTilesetImage("plants", "plants");
    map.addTilesetImage("farming_fishing", "farming")

    layer = map.createLayer("background");
    //plantsLayer = new Phaser.Tilemap(game, map, 1, 40, 20);
    //layer = map.createLayer("plants");

    scenery = game.add.group();

    //layer = map.createLayer("objects");//, game.width, game.height, scenery);
    
    layer.resizeWorld();
    //game.physics.enable(scenery, Phaser.Physics.ARCADE);

    cursorKeys = game.input.keyboard.createCursorKeys();
    speed = 2;
    lastKeyPressed = null;
    animRef = null;

    player = game.add.sprite(400,100,"player");
    //game.physics.enable(player, Phaser.Physics.ARCADE);
    
    var animSpeed = 8;
    player.animations.add("walkUp", [0,1,2,1], animSpeed, true);
    player.animations.add("walkDown", [6,7,8,7], animSpeed, true);
    player.animations.add("walkLeft", [9,10,11,10], animSpeed, true);
    player.animations.add("walkRight", [3,4,5,4], animSpeed, true);

    player.frame = 7;
 
    game.camera.follow(player);

    fps = game.add.text(50,50, 0);
    fps.fixedToCamera = true;
}



function update() {

    
    if (cursorKeys.up.isDown) {
        animRef = player.animations.play("walkUp") || animRef;
        //player.body.velocity.y -= speed;
        player.position.y -= speed;
    }
    else if (cursorKeys.down.isDown) {
        animRef = player.animations.play("walkDown") || animRef;
        //player.body.velocity.y += speed;
        player.position.y += speed;
    }
    else if (cursorKeys.left.isDown) {
        animRef = player.animations.play("walkLeft") || animRef;
        player.position.x -= speed;
        //player.body.velocity.x -= speed;

    }
    else if (cursorKeys.right.isDown) {
        animRef = player.animations.play("walkRight") || animRef;
        //player.body.velocity.x += speed;
        player.position.x += speed;
    }
    else if (animRef !== null ) {
        //player.body.velocity.setTo(0,0);
        animRef.setFrame(1, true);
        animRef.stop();
        animRef = null;
    }

    game.time.advancedTiming = true;
    fps.setText(game.time.fps);
    //game.physics.arcade.collide(player, scenery, function() {console.log("collide");}, null, this);

}

function render() {
}
