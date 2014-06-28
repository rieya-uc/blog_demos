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

}

function update() {
}
