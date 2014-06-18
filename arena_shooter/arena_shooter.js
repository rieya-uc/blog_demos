var game = new Phaser.Game(800, 600, Phaser.AUTO, "demo", {preload:preload, create:create, update:update, render:render});

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

    game.load.image("ninja", path+"assets/chars/ninja.png");
    game.load.image("circle", path+"assets/dashed_circle.png");
    game.load.image("bullet", path+"assets/chars/shuriken.png");
    game.load.image("monster", path+"assets/chars/blue_monster.png");
    
    // hide the mouse cursor when it's over the game
    game.canvas.onmouseover = function() {
       // game.canvas.style.cursor = "none";
    }
    game.canvas.onmouseout = function() {
       // game.canvas.style.cursor = "default";
    }
}

var ninja, dest, target, bullets, bulletTime, fireSpeed;
var testb;
var rotation = 0;
var dist = 0;
var monsters, monster, monsterTime;


function create() {

    game.time.deltaCap = 1/60;

    ninja = game.add.sprite(100,100,"ninja");
    ninja.scale.setTo(0.5, 0.5);
    ninja.anchor.setTo(0.5, 0.5);

    // enable physics on our player
    game.physics.enable(ninja, Phaser.Physics.ARCADE);
    ninja.body.allowRotation = false;

    // where the ninja is moving to
    dest = game.add.sprite(150, 150, "circle");
    dest.scale.setTo(0.4, 0.4);
    dest.anchor.setTo(0.5, 0.5);
    dest.position = game.input.position;

    // firing target
    target = game.add.sprite(0,0, "circle");
    target.scale.setTo(0.2, 0.2);
    target.anchor.setTo(0.5, 0.5);

    // bullets
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    bullets.createMultiple(30, "bullet");
    bullets.setAll("scale.x", 0.5);
    bullets.setAll("scale.y", 0.5);
    bullets.setAll("anchor.x", 0.5);
    bullets.setAll("anchor.y", 0.5);
    bullets.setAll("outOfBoundsKill", true);
    bullets.setAll("checkWorldBounds", true);

    fireSpeed = 100;
    bulletTime = game.time.now + fireSpeed;

    /*
    testb = game.add.sprite(200,200, "bullet");
    game.physics.enable(testb, Phaser.Physics.ARCADE);
    testb.anchor.setTo(0.5, 0.5);
    testb.scale.setTo(0.5, 0.5);
    testb.body.setSize(33,33,-1,0);
    */

    game.input.onDown.add(
        function() {
            rotation = game.physics.arcade.angleBetween(target, ninja);
            dist = game.physics.arcade.distanceBetween(target, ninja);
            dist = (dist > 60) ? 60 : dist;
        });

    // monsters
    monster = game.add.sprite(200,200, "monster");
    game.physics.enable(monster, Phaser.Physics.ARCADE);
    monster.anchor.setTo(0.5, 0.5);
    monster.scale.setTo(0.3, 0.3);
    monster.body.setSize(90, 98, 0, 0);
    monster.health = 100;
    monsterTime = game.time.now
    //monsters = game.add.group();
    
    game.stage.backgroundColor = '#DDDDDD';

}

function update() {
    var r = 60;

    if (game.input.activePointer.circle.contains(ninja.x, ninja.y)) {
        ninja.body.velocity.setTo(0,0);
        // snap ninja's centre to mouse position,
        // compare how position is set here to how target.position
        // is set in create()
        ninja.position.x = game.input.position.x;
        ninja.position.y = game.input.position.y;
    }
    else {
        game.physics.arcade.moveToPointer(ninja, 800);
    }

    if (game.input.mousePointer.isDown) {
        target.position.x = ninja.position.x - dist*Math.cos(rotation);
        target.position.y = ninja.position.y - dist*Math.sin(rotation);
    }
    else if (game.physics.arcade.distanceToPointer(target) > r) {
        rotation = game.physics.arcade.angleToPointer(target);
        target.position.x = ninja.position.x - r*Math.cos(rotation);
        target.position.y = ninja.position.y - r*Math.sin(rotation);
    }
    

    if (game.time.now > bulletTime) {
        fire();
    }

    if (game.time.now > monsterTime) {
        var m = game.add.sprite(200,200, "monster");
        game.physics.enable(m, Phaser.Physics.ARCADE);
        m.anchor.setTo(0.5, 0.5);
        m.scale.setTo(0.3, 0.3);
        m.body.setSize(90, 98, 0, 0);
        m.health = 100;
        game.physics.arcade.moveToObject(m, ninja, 100);
        monsterTime = game.time.now + 500;
    }

    game.physics.arcade.moveToObject(monster, ninja, 100);
    game.physics.arcade.collide(monster, bullets, monsterHit, null, this);
}

function monsterHit(monster, bullet) {
    monster.damage(5);
    bullet.kill();
}

function fire() {

    var b = bullets.getFirstExists(false);
    if (b !== null) {
        b.reset(ninja.position.x, ninja.position.y);
        b.body.setSize(33,33,-1,0);
        game.physics.arcade.moveToObject(b, target, 500);
    }
    bulletTime = game.time.now + fireSpeed;
}

function render() {
    //game.debug.body(monster);    
}
