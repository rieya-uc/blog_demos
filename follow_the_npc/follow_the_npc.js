var game = new Phaser.Game(600, 400, Phaser.AUTO, "demo", {preload:preload, create:create, update:update});

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

    game.load.atlas("npc", 
                    path+"assets/chars/little_square_people.png",  
                    path+"assets/chars/little_square_people.json");
}

function create() {
    var k = game.add.sprite(50,100,"npc");
    k.frame = 0;
    var l = game.add.sprite(100,100,"npc");
    l.frame = 1;
    l.scale.setTo(0.7, 0.7);
    var m = game.add.sprite(150,100,"npc");
    m.scale.setTo(0.5, 0.5);
    m.frame = 3;
    var n = game.add.sprite(200, 100, "npc");
    n.scale.setTo(0.3, 0.3);
    n.frame = 8;
    
}

function update() {
}
