
TilemapTowns.Game = function (game) {

    //	When a State is added to Phaser it automatically has the following properties set on it, 
    //  even if they already exist:

    this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager 
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;        //      the tween manager
    this.state;	        //	the state manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator

    //	You can use any of these from any function within this State.
    //	But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.
    
    this.player;
    this.cursorKeys;
    this.animRef;

    this.background;
    this.collidableScenery;
    this.scenery;

    this.fps;
};

TilemapTowns.Game.prototype = {

    create: function () {
        this.stage.backgroundColor = '#2F8136';

        var map = this.add.tilemap("map");

        map.addTilesetImage("terrain_atlas", "terrain");
        map.addTilesetImage("farming_fishing", "farming");
        map.addTilesetImage("fence", "fences");

        var layer = map.createLayer("background");
        layer.resizeWorld();

        this.background = this.add.group();
        convertLayerToGroup(map, layer, this.background);
        layer.destroy();

        this.scenery = this.add.group();

        // Arcade physics
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.scenery.enableBody = true;
        this.scenery.physicsBodyType = Phaser.Physics.ARCADE;
        layer = map.createLayer("collidables");
        convertLayerToGroup(map, layer, this.scenery);
        this.scenery.setAll("body.immovable", true);

        // P2 physics 
        /*
        this.physics.startSystem(Phaser.Physics.P2JS);
        var sceneryCollisionGroup = this.physics.p2.createCollisionGroup();
        var playerCollisionGroup = this.physics.p2.createCollisionGroup();

        this.physics.p2.setImpactEvents(true);
        this.scenery.enableBody = true;
        this.scenery.physicsBodyType = Phaser.Physics.P2JS;

        this.scenery.forEachExists(function(item) {
            item.body.setRectangle(32,32);
            item.body.setCollisionGroup(sceneryCollisionGroup);
            e.body.collides([playerCollisionGroup, sceneryCollisionGroup]);
        }, this, false, sceneryCollisionGroup, playerCollisionGroup);
        */
        // P2 physics end

        layer.destroy();
        layer = map.createLayer("background_overlay");
        convertLayerToGroup(map, layer, this.add.group());
        layer.destroy();
        
        // we don't need this anymore, all the layers have been destroyed
        map.destroy();

        // player controlled sprite
        this.player = this.add.sprite(448, 380, "player");
        this.cursorKeys = this.input.keyboard.createCursorKeys();

        this.animRef = null;
        var animSpeed = 8;
        this.player.animations.add("walkUp", [0,1,2,1], animSpeed, true);
        this.player.animations.add("walkDown", [6,7,8,7], animSpeed, true);
        this.player.animations.add("walkLeft", [9,10,11,10], animSpeed, true);
        this.player.animations.add("walkRight", [3,4,5,4], animSpeed, true);
        
        this.player.frame = 7;
        this.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.allowRotation = false;
        this.player.anchor.setTo(0.5, 1);
        this.player.body.setSize(16,8);

        //this.physics.p2.enable(this.player);
        //this.player.body.fixedRotation = true;
        //this.player.body.setCollisionGroup(playerCollisionGroup);
        
        this.camera.follow(this.player);

        // on screen text
        this.fps = this.add.text(50, 50, 0);
        this.fps.fixedToCamera = true;
    },

    update: function () {
        this.physics.arcade.collide(this.player, this.scenery);
 
        var speed = 200;
        //this.player.body.setZeroVelocity();
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;

        if (this.cursorKeys.up.isDown) {
            this.animRef = this.player.animations.play("walkUp") || this.animRef;
            this.player.body.velocity.y = -speed;
            //this.player.body.moveUp(speed);
        }
        else if (this.cursorKeys.down.isDown) {
            this.animRef = this.player.animations.play("walkDown") || this.animRef;
            this.player.body.velocity.y = speed;
            //this.player.body.moveDown(speed);
        }
        else if (this.cursorKeys.left.isDown) {
            this.animRef = this.player.animations.play("walkLeft") || this.animRef;
            this.player.body.velocity.x = -speed;
            //this.player.body.moveLeft(speed);
        }
        else if (this.cursorKeys.right.isDown) {
            this.animRef = this.player.animations.play("walkRight") || this.animRef;
            this.player.body.velocity.x = speed;
            //this.player.body.moveRight(speed);
        }
        else if (this.animRef !== null ) {
            this.animRef.setFrame(1, true);
            this.animRef.stop();
            this.animRef = null;
        }

        this.time.advancedTiming = true;
        this.fps.setText(this.time.fps);

    },

    render: function () {
        this.game.debug.body(this.player);
    },

    quitGame: function (pointer) {

	//	Here you should destroy anything you no longer need.
	//	Stop music, delete sprites, purge caches, free resources, all that good stuff.

	//	Then let's go back to the main menu.
	//this.state.start('MainMenu');

    }

};


function convertLayerToGroup(map, layer, group) {
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
            // i don't have the brain power to make this better right now
            for (k = 1; k < tilesets.length+1; k++) {
                if ( k === tilesets.length || tilesets[k].firstgid > tile.index) {
                    group.create(tile.worldX + 32, tile.worldY, 
                                 tilesets[k-1].image.name, tile.index - tilesets[k-1].firstgid, true);
                    break;
                }
            }

        }
    }
        
}
