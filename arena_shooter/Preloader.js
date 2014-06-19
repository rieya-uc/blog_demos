
ArenaShooter.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

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

            var path;
            if (typeof window.path === "undefined") {
                path = "";
            }
            else {
                path = window.path;
            }

            this.load.image("ninja", path+"assets/chars/ninja.png");
            this.load.image("circle", path+"assets/dashed_circle.png");
            this.load.image("bullet", path+"assets/chars/shuriken.png");
            this.load.image("monster", path+"assets/chars/blue_monster.png");
            

            
	},

	create: function () {

		//	Once the load has finished we disable the crop because we're going to sit 
                //      in the update loop for a short while as the music decodes
		// this.preloadBar.cropEnabled = false;

            this.ready = true;
	    this.state.start('Game');
	},
};
