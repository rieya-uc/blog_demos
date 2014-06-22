
ArenaShooter.Game = function (game) {

	//	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;    //  the tween manager
    this.state;	    //	the state manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator

    //	You can use any of these from any function within this State.
    //	But do consider them as being 'reserved words', 
    //  i.e. don't create a property for your own game called "world" or 
    //  you'll over-write the world reference.


    this.ninja;       // our player
    this.dest;        // where our player is moving to

    this.target;       // shooting direction
    this.rotation;     // angle of target with respect to player
    this.dist;         // distance of target from player
    
    this.bullets;      // player's bullets group
    this.bulletTime;   // time to fire another bullet
    this.fireSpeed;    // how fast player can shoot bullets
 
    this.monsters;     // monster group

    this.killCount;
};


//  The Google WebFont Loader will look for this object, so create it before loading the script.
WebFontConfig = {

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['Roboto Slab']
    }

};

ArenaShooter.Game.prototype = {
    
    create: function () {
        
        // hide the mouse cursor when it's over the game
        this.game.canvas.onmouseover = function(e) {
             this.style.cursor = "none";
        };
        this.game.canvas.onmouseout = function() {
             this.style.cursor = "default";
        };

        this.time.deltaCap = 1/60;
        
        this.player = this.add.sprite(100,100,"player");
        this.player.scale.setTo(0.5, 0.5);
        this.player.anchor.setTo(0.5, 0.5);
            
        // enable physics on our player
        this.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.allowRotation = false;
        
        // where the player is moving to
        this.dest = this.add.sprite(150, 150, "circle");
        this.dest.scale.setTo(0.4, 0.4);
        this.dest.anchor.setTo(0.5, 0.5);
        this.dest.position = this.input.position;
        
        // firing target
        this.target = this.add.sprite(0,0, "circle");
        this.target.scale.setTo(0.2, 0.2);
        this.target.anchor.setTo(0.5, 0.5);
        
        // bullets
        this.bullets = this.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        
        this.bullets.createMultiple(30, "bullet");
        this.bullets.setAll("scale.x", 0.5);
        this.bullets.setAll("scale.y", 0.5);
        this.bullets.setAll("anchor.x", 0.5);
        this.bullets.setAll("anchor.y", 0.5);
        this.bullets.setAll("outOfBoundsKill", true);
        this.bullets.setAll("checkWorldBounds", true);
        
        this.fireSpeed = 100;
        this.bulletTime = this.time.now + this.fireSpeed;
        
        this.input.onDown.add(
            function() {
                this.rotation = this.physics.arcade.angleBetween(this.target, this.player);
                this.dist = this.physics.arcade.distanceBetween(this.target, this.player);
                this.dist = (this.dist > 60) ? 60 : this.dist;
            }, this);
        


        this.monsters = new MonsterSpawner(this, 300, 300, 300);
        this.killCount = this.add.text(30,30, "Killed: 0");
        //this.killCount.font = "Roboto Slab";
        this.killCount.fontSize = 30;
        //this.killCount.fill = "#d3d3d3";

        this.stage.backgroundColor = '#DDDDDD';
    },
    
    update: function () {
        var r = 60;

        if (this.input.activePointer.circle.contains(this.player.x, this.player.y)) {
            this.player.body.velocity.setTo(0,0);
            // snap player's centre to mouse position,
            // compare how position is set here to how target.position
            // is set in create()
            this.player.position.x = this.input.position.x;
            this.player.position.y = this.input.position.y;
        }
        else {
            this.physics.arcade.moveToPointer(this.player, 800);
        }

        if (this.input.mousePointer.isDown) {
            this.target.position.x = this.player.position.x - this.dist*Math.cos(this.rotation);
            this.target.position.y = this.player.position.y - this.dist*Math.sin(this.rotation);
        }
        else if (this.physics.arcade.distanceToPointer(this.target) > r) {
            this.rotation = this.physics.arcade.angleToPointer(this.target);
            this.target.position.x = this.player.position.x - r*Math.cos(this.rotation);
            this.target.position.y = this.player.position.y - r*Math.sin(this.rotation);
        }
        

        //this.player.rotation = this.game.physics.arcade.angleBetween(this.player, this.target);

        if (this.time.now > this.bulletTime) {
            this.fire();
        }

        this.killCount.setText("Killed: " + this.monsters.killCount);
        this.monsters.moveTo(this.player.position.x, this.player.position.y);
        this.physics.arcade.collide(this.monsters, this.bullets, this.monsters.monsterHit, null, this);       
    },
    


    fire: function() {
        var b = this.bullets.getFirstExists(false);
        if (b !== null) {
            b.reset(this.player.position.x, this.player.position.y);
            b.body.setSize(33,33,-1,0);
            this.physics.arcade.moveToObject(b, this.target, 500);
        }
        this.bulletTime = this.time.now + this.fireSpeed;
    },

    getPlayerPosition: function() {
        return this.player.position;
    },

    quitGame: function (pointer) {
        
        
    }
    
};
