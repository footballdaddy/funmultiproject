var mainState = function (game) {
    this.tf_start;
    this.socket;
    this.player;
    this.remotePlayers;
};

mainState.prototype = {
    init: function () {
        this.stage.disableVisibilityChange = true;

        if (this.game.device.desktop) {
            //have the game centered horizontally
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
        } else {
            this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
            this.scale.setMinMax(480, 260, 1024, 768);
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
        }
    },

    /**
     * Loads assets defined in setup.js
     */
    preload: function () {

        var bmd;
        var map;
        var layer;
        var marker;
        var currentTile = 1;
        var cursors;
 
        //load all sprites and images
        for (var image in imageAssets) {
            if (imageAssets.hasOwnProperty(image)) {
                var imageAsset = imageAssets[image];
            }
            game.load.image(imageAsset.name, imageAsset.URL);
        }

        //load all spriteSheets
        for (var spriteSheet in spriteSheetAssets) {
            if (spriteSheetAssets.hasOwnProperty(spriteSheet)) {
                var spriteSheetAsset = spriteSheetAssets[spriteSheet];
            }
            game.load.spritesheet(spriteSheetAsset.name, spriteSheetAsset.URL, spriteSheetAsset.width, spriteSheetAsset.height, spriteSheetAsset.frames);
        }

        //load all sounds
        for (var sound in soundAssets) {
            if (soundAssets.hasOwnProperty(sound)) {
                var soundAsset = soundAssets[sound];
            }
            game.load.audio(soundAsset.name, soundAsset.URL);
        }
    },
  
    create: function () {
        var button = game.add.button(game.world.centerX, game.world.centerY * 1.325, 'button', function () {
            //on click of the button, start the game
            this.startGame();
        }, this);
        button.anchor.setTo(0.5, 0.5);

        var startInstructions = 'W\nA    S    D\n\nor\n\nclick to move\n\nstart';

        this.tf_start = game.add.text(game.world.centerX, game.world.centerY, startInstructions, fontAssets.counterFontStyle);
        this.tf_start.anchor.set(0.5, 0.5);

        //game.input.onDown.addOnce(this.startGame, this);
        //this.startGame();
    },

    startGame: function () {
        this.socket = io.connect();
        setUpSocket(this.socket, this);

        this.socket.emit('clientWantsToJoinServer');
    },
};

game.state.add("mainState", mainState);
game.state.start("mainState");