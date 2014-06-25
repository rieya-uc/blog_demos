
ArenaShooter.MainMenu = function (game) {

    //this.music = null;
    //this.playButton = null;

};

ArenaShooter.MainMenu.prototype = {

    create: function () {

	this.playButton = this.add.button(400, 300, "buttons", this.startGame, this, 
                                          "green_button00.png", "green_button00.png", 
                                          "green_button02.png", "green_button00.png");
        this.playButton.anchor.setTo(0.5, 0.5);

        var text = new Phaser.Text(this, 0, 0, "Start Game", {font: "24px Arial"});
        this.add.existing(text);
        
        text.anchor.setTo(0.5, 0.5);
        text.x = this.playButton.x;
        text.y = this.playButton.y;
        text.fill = "#191970";

        this.stage.backgroundColor = '#DDDDDD';
    },

    update: function () {

	//	Do some nice funky main menu effect here

    },

    startGame: function (pointer) {

	this.state.start('Game');

    }

};
