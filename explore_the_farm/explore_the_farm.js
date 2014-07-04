var game = new Phaser.Game(800, 600, Phaser.AUTO, "demo", {preload:preload, create:create, update:update, render:render});


var map;
var layer;
var scenery; // group
var sceneryLayer;
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
    game.load.image("fences", "assets/daneeklu_tilesets/fence.png");
    game.load.image("plants", "assets/daneeklu_tilesets/plants.png");
    game.load.image("farming", "assets/daneeklu_tilesets/farming_fishing.png");
    game.load.image("terrain", "assets/daneeklu_tilesets/terrain_atlas.png");
    game.load.image("terrain_base", "assets/daneeklu_tilesets/base_out_atlas.png");

    // char
    game.load.spritesheet("player", "assets/chars/mage_f.png", 32, 36);
}

function create() {

    game.stage.backgroundColor = '#2F8136';
    //game.stage.backgroundColor = "#80912b";
    game.physics.startSystem(Phaser.Physics.P2JS);

    map = game.add.tilemap("map");
    map.addTilesetImage("plowed_soil", "soil");
    map.addTilesetImage("fence", "fences");
    map.addTilesetImage("farming_fishing", "farming");
    map.addTilesetImage("terrain_atlas", "terrain");
    map.addTilesetImage("terrain_base_atlas", "terrain_base");

    layer = map.createLayer("farming_plots");
    layer.resizeWorld();

    scenery = game.add.group();

    // METHOD 1 of creating collision objects using Tiled
    // draw the collidable areas in an Object Layer using Polyline
    // doesn't work with Tiled.Rectangle etc, only Polyline
       // game.physics.p2.convertCollisionObjects(map, "fixed_collision");


    // METHOD 2 (see example P2 Physics -> Tilemap)
    // To find the tile indexses, I created a test_layer in Tiled and 
    // placed all the collidable tiles next to each other, then looked
    // at the .json file 
    map.setCollisionBetween(19,36);
    map.setCollisionBetween(245,251);
    game.physics.p2.convertTilemap(map, layer);


    // player

    cursorKeys = game.input.keyboard.createCursorKeys();
    speed = 200;
    lastKeyPressed = null;
    animRef = null;

    player = game.add.sprite(400,100,"player");
    
    var animSpeed = 8;
    player.animations.add("walkUp", [0,1,2,1], animSpeed, true);
    player.animations.add("walkDown", [6,7,8,7], animSpeed, true);
    player.animations.add("walkLeft", [9,10,11,10], animSpeed, true);
    player.animations.add("walkRight", [3,4,5,4], animSpeed, true);

    player.frame = 7;
    game.physics.p2.enable(player);
    player.body.fixedRotation = true;

    game.camera.follow(player);

    fps = game.add.text(50,50, 0);
    fps.fixedToCamera = true;
}



function update() {
    player.body.setZeroVelocity();
    
    if (cursorKeys.up.isDown) {
        animRef = player.animations.play("walkUp") || animRef;
        player.body.moveUp(speed);
        //player.position.y -= speed;
    }
    else if (cursorKeys.down.isDown) {
        animRef = player.animations.play("walkDown") || animRef;
        player.body.moveDown(speed);
        //player.position.y += speed;
    }
    else if (cursorKeys.left.isDown) {
        animRef = player.animations.play("walkLeft") || animRef;
        player.body.moveLeft(speed);
        //player.position.x -= speed;
    }
    else if (cursorKeys.right.isDown) {
        animRef = player.animations.play("walkRight") || animRef;
        player.body.moveRight(speed);
        //player.position.x += speed;
    }
    else if (animRef !== null ) {
        animRef.setFrame(1, true);
        animRef.stop();
        animRef = null;
    }

    game.time.advancedTiming = true;
    fps.setText(game.time.fps);
}

function render() {
    game.debug.body(player);
}
