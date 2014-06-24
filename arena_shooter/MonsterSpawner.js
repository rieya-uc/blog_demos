MonsterSpawner = function (game, x, y, radius) {
    Phaser.Group.call(this, game)

    this.game = game;
    this.spawnX = x;
    this.spawnY = y;
    this.radius = radius;

    this.monsterTime = game.time.now;
    this.monsterSpawnSpeed = 800;
    this.monsterSpeed = 100;

    this.killCount = 0;

    this.createMultiple(5, "monster");
};

MonsterSpawner.prototype = Object.create(Phaser.Group.prototype);
MonsterSpawner.prototype.constructor = MonsterSpawner;

MonsterSpawner.prototype.update = function() {

    if (this.game.time.now > this.monsterTime) {
        this.spawn();
        this.monsterTime = this.game.time.now + this.monsterSpawnSpeed;
    }
};

MonsterSpawner.prototype.spawn = function() {
    var xpos = this.game.rnd.integerInRange(-this.radius, this.radius) + this.spawnX;
    var ypos = this.game.rnd.integerInRange(-this.radius, this.radius) + this.spawnY;
    
    // prevent the monster spawning on top of the player
    var ppos = this.game.getPlayerPosition();
    var pd = 50;

    if (xpos >= ppos.x-pd && xpos <= ppos.x+pd  && 
        ypos >= ppos.y-pd && ypos <= ppos.y+pd)  {
        xpos += pd*2;
        ypos += pd*2;
    }
    
    var monster = this.getFirstExists(false);
    if (monster !== null) {
        monster.reset(xpos, ypos, 30);
    }
    else {
        monster = this.create(xpos, ypos, "monster", 30);
    }
    
    this.game.physics.enable(monster, Phaser.Physics.ARCADE);
    monster.anchor.setTo(0.5, 0.5);
    monster.scale.setTo(0.3, 0.3);
    monster.body.setSize(90, 98, 0, 0);

    monster.events.onKilled.add(function() {
        this.killCount++;
    }, this);

};

MonsterSpawner.prototype.moveTo = function(x, y) {
    this.forEachAlive(function(m) {
        this.game.physics.arcade.moveToXY(m, x, y, this.monsterSpeed);
    }, this);
};

MonsterSpawner.prototype.monsterHit = function(monster, bullet) {
    if (bullet) {
        bullet.kill();
    }
    monster.damage(5);
};
