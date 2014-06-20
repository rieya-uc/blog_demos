MonsterSpawner = function (game) {
    Phaser.Group.call(this, game)

    this.game = game;

    this.monsterTime = game.time.now;
    this.monsterSpawnSpeed = 800;

    this.monsterSpeed = 100;
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

    var monster = this.create(100,100, "monster");
    this.game.physics.enable(monster, Phaser.Physics.ARCADE);
    monster.anchor.setTo(0.5, 0.5);
    monster.scale.setTo(0.3, 0.3);
    monster.body.setSize(90, 98, 0, 0);
    monster.health = 30;
};

MonsterSpawner.prototype.moveTo = function(x, y) {
    this.forEachAlive(function(m) {
        this.game.physics.arcade.moveToXY(m, x, y, this.monsterSpeed);
    }, this);
};

MonsterSpawner.prototype.monsterHit = function(monster, bullet) {
    bullet.kill();
    monster.damage(5);
};
