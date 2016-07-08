var gameState = function(game){
    if (game) { this.game = game; }
    this.debug = false;

    this.socket;
    this.player;
    this.remotePlayers = {};
};

gameState.prototype = {

    render: function () {
        if (this.debug) {
            game.debug.body(this.player);

            for (var remotePlayer in this.remotePlayers) {
                if (this.remotePlayers.hasOwnProperty(remotePlayer)) {
                    game.debug.body(this.remotePlayers[remotePlayer]);
                }
            }
        }
    },

    init: function () {
        var mainState = game.state.states.mainState;
        this.socket = mainState.socket;

        var remotePlayers = mainState.remotePlayers;
        for (var remotePlayer in remotePlayers) {
            if (remotePlayers.hasOwnProperty(remotePlayer)) {
                this.createRemotePlayer(remotePlayers[remotePlayer])
            }
        }
        mainState.remotePlayers = this.remotePlayers;

    },

    create: function () {

        // game.stage.backgroundColor = 'rgb(68, 136, 170)';

    game.stage.backgroundColor = '#2d2d2d';

    //  Creates a blank tilemap
    map = game.add.tilemap();

    //  This is our tileset - it's just a BitmapData filled with a selection of randomly colored tiles
    //  but you could generate anything here
    bmd = game.make.bitmapData(32 * 25, 32 * 2);

    var colors = Phaser.Color.HSVColorWheel();

    var i = 0;

    for (var y = 0; y < 2; y++)
    {
        for (var x = 0; x < 25; x++)
        {
            bmd.rect(x * 32, y * 32, 32, 32, colors[i].rgba);
            i += 6;
        }
    }

    //  Add a Tileset image to the map
    map.addTilesetImage('tiles', bmd);

    //  Creates a new blank layer and sets the map dimensions.
    //  In this case the map is 40x30 tiles in size and the tiles are 32x32 pixels in size.
    layer = map.create('level1', 40, 30, 32, 32);

    //  Populate some tiles for our player to start on
    map.putTile(31, 2, 10, layer);
    map.putTile(30, 3, 10, layer);
    map.putTile(30, 4, 10, layer);

    map.setCollisionByExclusion([0]);

    //  Create our tile selector at the top of the screen
    this.createTileSelector();

    
    cursors = game.input.keyboard.createCursorKeys();
    // jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    game.input.addMoveCallback(this.updateMarker, this);

        this.player = new Player(game, this.socket.id, true);
        this.socket.emit('clientCreatePlayer');

        var infoToUpdateWith = {
            nextPosition: {
                x: this.player.x,
                y: this.player.y,
            },
        };
        this.socket.emit('clientPushUpdate', infoToUpdateWith);
    },

    update: function () {
            game.physics.arcade.collide(this.player, layer);


    },
 pickTile: function (sprite, pointer) {

    var x = game.math.snapToFloor(pointer.x, 32, 0);
    var y = game.math.snapToFloor(pointer.y, 32, 0);

    currentTileMarker.x = x;
    currentTileMarker.y = y;

    x /= 32;
    y /= 32;

    currentTile = x + (y * 25);
    this.getCurrentTile(currentTile);
},
 getCurrentTile: function (currentTile) {
    console.log(currentTile);
    this.currentTile = currentTile;
    console.log(currentTile);


},

 updateMarker: function () {
    if (this.currentTile === undefined)
    {
        this.currentTile = -1;
    }
    
    marker.x = layer.getTileX(game.input.activePointer.worldX) * 32;
    marker.y = layer.getTileY(game.input.activePointer.worldY) * 32;
    // console.log(this.currentTile);
    if (game.input.mousePointer.isDown && marker.y > 32)
    {   
        // console.log(map.putTile(this.currentTile));
        map.putTile(this.currentTile, layer.getTileX(marker.x), layer.getTileY(marker.y), layer);
    }

},
 createTileSelector: function () {
    //  Our tile selection window
    var tileSelector = game.add.group();

    var tileSelectorBackground = game.make.graphics();
    tileSelectorBackground.beginFill(0x000000, 0.8);
    tileSelectorBackground.drawRect(0, 0, 800, 66);
    tileSelectorBackground.endFill();

    tileSelector.add(tileSelectorBackground);

    var tileStrip = tileSelector.create(1, 1, bmd);
    tileStrip.inputEnabled = true;
    tileStrip.events.onInputDown.add(this.pickTile, this);
    // console.log(this.pickTile);
    //  Our painting marker
    marker = game.add.graphics();
    marker.lineStyle(2, 0xffffff, 1);
    marker.drawRect(0, 0, 32, 32);
    // console.log(this.currentTile);

    //  Our current tile marker
    currentTileMarker = game.add.graphics();
    currentTileMarker.lineStyle(1, 0xffffff, 1);
    currentTileMarker.drawRect(0, 0, 32, 32);

    tileSelector.add(currentTileMarker);

},
    createRemotePlayer: function (remotePlayerData) {
        var remotePlayer = new Player(game, remotePlayerData.id, false, remotePlayerData.nextPosition.x, remotePlayerData.nextPosition.y);
        updateObjectProperties(remotePlayer, remotePlayerData);

        this.remotePlayers[remotePlayer.id] = remotePlayer;
    },
};

game.state.add("gameState", gameState);