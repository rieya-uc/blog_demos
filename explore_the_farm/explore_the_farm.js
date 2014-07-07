var game = new Phaser.Game(800, 600, Phaser.AUTO, "demo", {preload:preload, create:create, update:update, render:render});


var map;
var layer1, layer2;
var scenery; // group
var sceneryLayer;
var player;
var cursorKeys;
var animRef;
var speed;
var scenery;
var fps;
var jsonmap;

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

    game.load.tilemap("map", "assets/maps/explore_farm_map.json", null, Phaser.Tilemap.TILED_JSON);

    game.load.image("terrain_arghl", "assets/tilesets/lpc/terrain_atlas.png");
    game.load.image("farming", "assets/tilesets/daneeklu/farming_fishing.png");
    game.load.image("fences", "assets/tilesets/daneeklu/fence.png");

    // char
    game.load.spritesheet("player", "assets/chars/mage_f.png", 32, 36);

    // test read
    game.load.text("jsonmap", "assets/maps/explore_farm_map.json");
}

function create() {

    game.stage.backgroundColor = '#2F8136';
    //game.stage.backgroundColor = "#80912b";
    game.physics.startSystem(Phaser.Physics.P2JS);

    map = game.add.tilemap("map");
    map.addTilesetImage("terrain_atlas", "terrain_arghl");
    map.addTilesetImage("farming_fishing", "farming");
    map.addTilesetImage("fence", "fences");

    layer1 = map.createLayer("layout");
    layer2 = map.createLayer("produce");

    layer1.resizeWorld();

    scenery = game.add.group();
    console.log(map.tilesets);

    // METHOD 1 of creating collision objects using Tiled
    // draw the collidable areas in an Object Layer using Polyline
    // doesn't work with Tiled.Rectangle etc, only Polyline
       // game.physics.p2.convertCollisionObjects(map, "fixed_collision");


    // METHOD 2 (see example P2 Physics -> Tilemap)
    // To find the tile indexses, I created a test_layer in Tiled and 
    // placed all the collidable tiles next to each other, then looked
    // at the .json file 
    var jsonmap = JSON.parse(game.cache.getText("jsonmap"));
    var collidables = jsonmap.layers[0].data.filter(function(element) { return element != 0; });

    map.setCollision(collidables, true, layer1);
    game.physics.p2.convertTilemap(map, layer1);

    convertLayerToGroup(map, layer2, scenery);
    //console.log(layer2.layer.data[0][0]);
    //console.log(layer1.getTiles(0,0,60,60));
    //convertLayerToGroup(jsonmap.layers[2].data);
    //layer2.destroy();

    /*
    map.setCollision(collidables, true, layer2);
    game.physics.p2.convertTilemap(map, layer2);
    */


    // player

    cursorKeys = game.input.keyboard.createCursorKeys();
    speed = 200;
    lastKeyPressed = null;
    animRef = null;

    player = game.add.sprite(448,380,"player");
    
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
    }
    else if (cursorKeys.down.isDown) {
        animRef = player.animations.play("walkDown") || animRef;
        player.body.moveDown(speed);
    }
    else if (cursorKeys.left.isDown) {
        animRef = player.animations.play("walkLeft") || animRef;
        player.body.moveLeft(speed);
    }
    else if (cursorKeys.right.isDown) {
        animRef = player.animations.play("walkRight") || animRef;
        player.body.moveRight(speed);
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

function convertLayerToGroup(map, layer, group, collidable) {
    var collidable = collidable || false;
    var layerData = layer.layer.data;

    var tilesets = map.tilesets;
    tilesets.sort(function(a, b) {
        return a.firstgid - b.firstgid;
    });

    var sprite;
    var i, j;
    for (i = 0; i < layerData.length; i++) {
        for (j = 0; j < layerData[i].length; j++) {
            var tile = layerData[i][j];
            
            if (tile.index <= 0)
                continue;
            
            var k;
            for (k = 0; k < tilesets.length; k++) {
                if (tile.index > tilesets[k].firstgid) {
                    console.log(tilesets[k]);
                    console.log(tile);
                    group.create(tile.worldX + 32, tile.worldY, 
                                 tilesets[k].image.name, tile.index - tilesets[k].firstgid, true);
                    break;
                }
            }

        }
    }
                              

}
