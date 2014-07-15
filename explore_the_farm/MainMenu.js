
TilemapTowns.MainMenu = function (game) {

    this.music = null;
    this.playButton = null;

};

TilemapTowns.MainMenu.prototype = {

    create: function () {

	//	We've already preloaded our assets, so let's kick right into the Main Menu itself.
	//	Here all we're doing is playing some music and adding a picture and button
	//	Naturally I expect you to do something significantly better :)

        this.stage.backgroundColor = "#666666";

        this.playButton = this.add.button(this.game.width/2, this.game.height/2, 'buttons', this.startGame, this, 
                                          "green_button00.png", "green_button00.png", 
                                          "green_button02.png", "green_button00.png");
        this.playButton.anchor.setTo(0.5, 0.5);
        this.playButton.scale.setTo(1.3, 1.3);

        var text = this.add.text(0, 0, "Start Tilemap Town");
        text.anchor.setTo(0.5, 0.5);
        text.x = this.playButton.x;
        text.y = this.playButton.y;
        text.fontSize = 24;
        text.fill = "#191970";
        
        var note = this.add.text(0, 0, "Note:\ndemo is very laggy on non-desktop devices");
        note.anchor.setTo(0.5, 0.5);
        note.x = this.playButton.x;
        note.y = this.playButton.y + 100;
        note.fill = "#FFFCCC";
                                 

    },

    update: function () {


    },

    startGame: function (pointer) {
	this.state.start('Game');

    }

};
