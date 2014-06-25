

ArenaShooter.Preloader = function (game) {

    this.background = null;
    this.preloadBar = null;

    this.ready = false;
};


//  The Google WebFont Loader will look for this object, so create it before loading the script.
WebFontConfig = {

    //  'active' means all requested fonts have finished loading
    //  We set a 1 second delay before calling 'createText'.
    //  For some reason if we don't the browser cannot render the text the first time it's created.
    //active: function() { game.time.events.add(Phaser.Timer.SECOND, game.state.start('Boot'), this); },

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
        families: ['Handlee']
    }
};

ArenaShooter.Preloader.prototype = {

    preload: function () {

	//	These are the assets we loaded in Boot.js
	//	A nice sparkly background and a loading progress bar
	// this.background = this.add.sprite(0, 0, 'preloaderBackground');
	// this.preloadBar = this.add.sprite(300, 400, 'preloaderBar');

	//	This sets the preloadBar sprite as a loader sprite.
	//	What that does is automatically crop the sprite from 0 to full-width
	//	as the files below are loaded in.
	// this.load.setPreloadSprite(this.preloadBar);


        // centre the canvas
        // this.scale.pageAlignHorizontally = true;
        // this.scale.refresh();

        var path;
        if (typeof window.path === "undefined") {
            path = "";
        }
        else {
            path = window.path;
        }

        this.load.image("player", path+"assets/chars/player.png");
        this.load.image("circle", path+"assets/dashed_circle.png");
        this.load.image("bullet", path+"assets/chars/shuriken.png");
        this.load.image("monster", path+"assets/chars/blue_monster.png");
        this.load.atlas("pixels", path+"assets/pixels.png", path+"assets/pixels.json");
        this.load.atlasXML("buttons", path+"assets/ui/greenButtons.png", path+"assets/ui/greenButtons.xml");
        this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');


    },

    create: function () {

	//	Once the load has finished we disable the crop because we're going to sit 
        //      in the update loop for a short while as the music decodes
	// this.preloadBar.cropEnabled = false;

        this.ready = true;
	this.state.start('MainMenu');
    },
};
