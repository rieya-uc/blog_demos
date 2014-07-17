
TilemapTowns.Preloader = function (game) {

    this.background = null;
    this.preloadBar = null;

    this.ready = false;

};

TilemapTowns.Preloader.prototype = {

    preload: function () {

	//	These are the assets we loaded in Boot.js
	//	A nice sparkly background and a loading progress bar
	this.background = this.add.sprite(230, 50, 'preloaderBackground');
	this.preloadBar = this.add.sprite(200, 400, 'preloaderBar');

	//	This sets the preloadBar sprite as a loader sprite.
	//	What that does is automatically crop the sprite from 0 to full-width
	//	as the files below are loaded in.
	this.load.setPreloadSprite(this.preloadBar);



        var path;
        if (typeof window.path === "undefined") {
            path = "";
        }
        else {
            path = window.path;
        }

        this.load.tilemap("map", path+"assets/maps/explore_farm_map.json", null, Phaser.Tilemap.TILED_JSON);

        this.load.image("terrain", path+"assets/tilesets/lpc/terrain_atlas.png");
        this.load.image("farming", path+"assets/tilesets/daneeklu/farming_fishing.png");
        this.load.image("fences", path+"assets/tilesets/daneeklu/fence.png");
        this.load.image("magecity", path+"assets/tilesets/hyptosis/magecity_0.png");

        this.load.spritesheet("player", path+"assets/chars/mage_f.png", 32, 36);
        this.load.text("jsonmap", path+"assets/maps/explore_farm_map.json");

        this.load.image("left", path+"assets/ui/transparentDarkLeft.png");
        this.load.image("right", path+"assets/ui/transparentDarkRight.png");
        this.load.image("up", path+"assets/ui/transparentDarkUp.png");
        this.load.image("down", path+"assets/ui/transparentDarkDown.png");

        this.load.atlasXML("buttons", path+"assets/ui/greenButtons.png", path+"assets/ui/greenButtons.xml");
    },

    create: function () {

	//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
	this.preloadBar.cropEnabled = false;

    },

    update: function () {

	//	You don't actually need to do this, but I find it gives a much smoother game experience.
	//	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
	//	You can jump right into the menu if you want and still play the music, but you'll have a few
	//	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
	//	it's best to wait for it to decode here first, then carry on.
	
	//	If you don't have any music in your game then put the game.state.start line into the 
        //      create function and delete the update function completely.
	
        /*
	  if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
	  {
	  this.ready = true;
	  this.state.start('MainMenu');
	  }
        */

        if (this.game.device.desktop) {
            this.state.start("Game");
        }
        else {
            this.state.start("MainMenu");
        }
    }

};
