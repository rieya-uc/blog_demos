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


    this.player;       // our player
    this.healthBar;
    this.healthText;   // player health
    this.dest;         // where our player is moving to

    this.target;       // shooting direction
    this.rotation;     // angle of target with respect to player
    this.dist;         // distance of target from player
    
    this.bullets;      // player's bullets group
    this.bulletTime;   // the time stamp of we can fire another bullet
    this.fireSpeed;    // how fast player can shoot bullets
    
    this.monsters;     // monsters group

    this.killCount;
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
        this.game.canvas.style.cursor = "none";

        // limit the fps, prevents physics errors, 1/60 = 60fps
        this.time.deltaCap = 1/60;
        
        // player
        this.player = this.add.sprite(400,300,"player");
        this.player.scale.setTo(0.5, 0.5);
        this.player.anchor.setTo(0.5, 0.5);
        this.player.health = 100;
        this.player.events.onKilled.add(this.playerDeath, this);

        this.healthBar = this.add.sprite(460, 35, "pixels");
        this.healthBar.frame = 1;
        this.healthBar.height = 15;
        this.healthBar.width = this.player.health;
        
        this.player.invincible = false;
                                                  
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
        
        // strafe when lmb down
        this.input.onDown.add(
            function() {
                this.rotation = this.physics.arcade.angleBetween(this.target, this.player);
                this.dist = this.physics.arcade.distanceBetween(this.target, this.player);
                this.dist = (this.dist > 60) ? 60 : this.dist;
            }, this);
        

        // monsters
        this.monsters = new MonsterSpawner(this, 300, 300, 300);
        this.killCount = this.add.text(30,30, "Killed: 0");
        this.killCount.font = "Handlee";
        this.killCount.fontSize = 30;

        // ui text
        this.add.text(360, 30, "Health: ", {font: "30px Handlee"});
        this.healthText = this.add.text(600, 30, this.player.health, {font: "30px Handlee"});       

        this.stage.backgroundColor = '#DDDDDD';
    },
    
    update: function () {
        var r = 60;  // how far the target sprite is from the player sprite

        // move the player to the mouse
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

        // strafe
        if (this.input.mousePointer.isDown) {
            this.target.position.x = this.player.position.x - this.dist*Math.cos(this.rotation);
            this.target.position.y = this.player.position.y - this.dist*Math.sin(this.rotation);
        }
        else if (this.physics.arcade.distanceToPointer(this.target) > r) {
            this.rotation = this.physics.arcade.angleToPointer(this.target);
            this.target.position.x = this.player.position.x - r*Math.cos(this.rotation);
            this.target.position.y = this.player.position.y - r*Math.sin(this.rotation);
        }
        
        // fire off a bullet
        if (this.time.now > this.bulletTime) {
            this.fire();
        }

        // update ui
        this.killCount.setText("Killed: " + this.monsters.killCount);
        this.healthText.setText(this.player.health);
        this.healthBar.width = this.player.health;

        // move monsters towards player
        this.monsters.moveTo(this.player.position.x, this.player.position.y);

        // check for collisions
        if (this.player.health > 0) {
            this.physics.arcade.collide(this.monsters, this.bullets, this.monsters.monsterHit, null, this);       
            this.physics.arcade.collide(this.player, this.monsters, this.playerHit, null, this);
        }

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

    /*
      render: function() {
      this.game.debug.body(this.player);
      },
    */

    playerHit: function(player, monster) {
        if (!player.invincible) {
            // make the player sprite flash red while invincible
            player.invincible = true;
            player.tint = 0xFF0000;
            player.tween = this.add.tween(player).to({alpha:0.2}, 300, null, true, 0, 3, false);
            player.tween.onComplete.add(this.tweenComplete, this);
            player.damage(5);
        }
        this.monsters.monsterHit(monster);
    },

    tweenComplete: function() {
        this.player.invincible = false;
        this.player.alpha = 1;
        this.player.tint = 0xFFFFFF;
    },

    getPlayerPosition: function() {
        return this.player.position;
    },

    playerDeath: function() {
        this.game.canvas.style.cursor = "default";
        this.game.canvas.onmouseover = null;

        this.dest.destroy();
        this.target.destroy();
        this.bullets.destroy();

        var text;
        text = this.add.text(400, 200, "Oh no, you died!", {font:"24px Handlee"});
        text.anchor.setTo(0.5, 0.5);
        text = this.add.text(400, 250,
                      "You managed to kill " + this.monsters.killCount + " monster(s)",
                      {font: "26px Handlee"});
        text.anchor.setTo(0.5, 0.5);
               
        // I really need to make a generic text button object
        var btn = this.add.button(400, 300, "buttons", this.restart, this,
                                  "green_button00.png", "green_button00.png", 
                                  "green_button02.png", "green_button00.png");
        btn.anchor.setTo(0.5, 0.5);
        text = this.add.text(btn.x, btn.y, "Restart");
        text.anchor.setTo(0.5, 0.5);
        
    },

    restart: function() {
        this.state.start(this.state.current);
    },

    quitGame: function (pointer) {
        
        
    }
};
