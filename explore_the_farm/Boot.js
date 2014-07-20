var TilemapTowns = {};

TilemapTowns.Boot = function (game) {

};

TilemapTowns.Boot.prototype = {

    preload: function () {

        var path;
        if (typeof window.path === "undefined") {
            path = "";
        }
        else {
            path = window.path;
        }

        //  Here we load the assets required for our preloader (in this case a background and a loading bar)
        this.load.image('preloaderBackground', path+'assets/phaser-logo-small.png');
        this.load.image('preloaderBar', path+'assets/preload.png');

    },

    create: function () {
        var myScript = document.getElementById("script");

        //  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
        this.input.maxPointers = 1;

        //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
        this.stage.disableVisibilityChange = true;

        if (this.game.device.desktop)
        {
            //  If you have any desktop specific settings, they can go in here
            if (myScript.parentNode.className === "js_centred")
                this.scale.pageAlignHorizontally = true;
            else
                this.scale.pageAlignHorizontally = false;
        }
        else
        {
            //  Same goes for mobile settings.
            //  In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024x768"
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.minWidth = 480;
            this.scale.minHeight = 260;
            this.scale.maxWidth = 800;
            this.scale.maxHeight = 600;
            this.scale.forceLandscape = false;
            this.scale.pageAlignHorizontally = true;
            this.scale.setScreenSize(true);
        }

        this.scale.refresh();

        //  By this point the preloader assets have loaded to the cache, we've set the game settings
        //  So now let's start the real preloader going
        this.state.start('Preloader');

    }

};
