
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

/* This is the P2 physics version */

TilemapTowns.Game.prototype = {

    create: function () {
        this.stage.backgroundColor = '#2F8136';
        this.physics.startSystem(Phaser.Physics.P2JS);
        this.time.deltaCap = 1/60;

        var map = this.add.tilemap("map");

        map.addTilesetImage("terrain_atlas", "terrain");
        map.addTilesetImage("farming_fishing", "farming");
        map.addTilesetImage("fence", "fences");
        map.addTilesetImage("magecity_0", "magecity");

        // In Tiled, put all the collidable tiles in one non-visible layer
        // - layer[0] in this case. Extract the tile indexes from the .json file
        // created by Tiled, and store in an array.
        // We can then use that array in map.setCollision(...).
        // In this instance, I've set the game to check for collisions on every layer,
        // but next time it may be more cost-effective to put all the collidable 
        // tiles on one or two layers, and keep the physics checking to only those layers.

        var jsonmap = JSON.parse(this.cache.getText("jsonmap"));
        var colIndexes = jsonmap.layers[0].data.filter(function(element) { 
            return element != 0; 
        });

        var layer1 = map.createLayer("background");
        layer1.resizeWorld();
        map.setCollision(colIndexes, true, 1, true);
        this.physics.p2.convertTilemap(map, layer1);
        //layer1.debug = true;

        var layer2 = map.createLayer("background_overlay");
        map.setCollision(colIndexes, true, 2, true);
        this.physics.p2.convertTilemap(map, layer2);
        //layer2.debug = true;

        var layer3 = map.createLayer("buildings");
        map.setCollision(colIndexes, true, 3, true);
        this.physics.p2.convertTilemap(map, layer3);
        //layer3.debug = true;

        var layer4 = map.createLayer("building_overlay");
        map.setCollision(colIndexes, true, 4, true);
        this.physics.p2.convertTilemap(map, layer4);

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
        
        this.physics.p2.enable(this.player);
        this.player.body.fixedRotation = true;

        this.player.anchor.setTo(0.5, 1);
        this.player.body.setSize(16,8);
        
        this.camera.follow(this.player);

        // on screen text
        this.fps = this.add.text(50, 50, 0);
        this.fps.fixedToCamera = true;
    },

    update: function () {
 
        var speed = 200;
        this.player.body.setZeroVelocity();

        if (this.cursorKeys.up.isDown) {
            this.animRef = this.player.animations.play("walkUp") || this.animRef;
            this.player.body.moveUp(speed);
        }
        else if (this.cursorKeys.down.isDown) {
            this.animRef = this.player.animations.play("walkDown") || this.animRef;
            this.player.body.moveDown(speed);
        }
        else if (this.cursorKeys.left.isDown) {
            this.animRef = this.player.animations.play("walkLeft") || this.animRef;
            this.player.body.moveLeft(speed);
        }
        else if (this.cursorKeys.right.isDown) {
            this.animRef = this.player.animations.play("walkRight") || this.animRef;
            this.player.body.moveRight(speed);
        }
        else if (this.animRef !== null ) {
            this.animRef.setFrame(1, true);
            this.animRef.stop();
            this.animRef = null;
        }

        this.time.advancedTiming = true;
        this.fps.setText("p2 " + this.time.fps);

    },

    quitGame: function (pointer) {

	//	Here you should destroy anything you no longer need.
	//	Stop music, delete sprites, purge caches, free resources, all that good stuff.

	//	Then let's go back to the main menu.
	//this.state.start('MainMenu');
    }

};
