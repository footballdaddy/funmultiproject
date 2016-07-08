/**
 * Custom Player object that extends Phaser Sprite.
 * @param game - The Phaser game object.
 * @param id - The server socket's id.
 * @param isClient - True or False depending on if this is the client's Player,
 *                   or a remote Player, someone else connected to the server.
 * @param x - x-value to spawn at.
 * @param y - y-value to spawn at.
 * @param key - The sprite of this Player.
 */
var Player = function (game, id, isClient, x, y, key) {
    if (game) { this.game = game; }
    if (id == undefined) { window.alert("no id"); } else { this.id = id; }
    if (x == undefined) { x = game.world.width / 2; }
    if (y == undefined) { y = game.world.height / 2; }
    if (key == undefined) { key = imageAssets.square.name; }

    //call the Phaser.Sprite passing in the game reference
    Phaser.Sprite.call(this, game, x, y);
    this.anchor.setTo(0.5, 0.5);

    game.camera.follow(this);

    this.sprite = new PlayerSprite(game, key, this);
    this.addChild(this.sprite);

    this.properties = {
        velocity: 250,
        size: 10/100,
    };

    if (isClient) {
        //make this as the client's player
        this.isClient = true;
        this.isRemote = false;

        this.keys = {
            key_left: game.input.keyboard.addKey(Phaser.Keyboard.A),
            key_right: game.input.keyboard.addKey(Phaser.Keyboard.D),
            key_up: game.input.keyboard.addKey(Phaser.Keyboard.W),
            key_down: game.input.keyboard.addKey(Phaser.Keyboard.S),
            key_click: game.input.activePointer,
            key_debug: game.input.keyboard.addKey(Phaser.Keyboard.O).onDown.add(function () {
                //toggle debug mode with keyboard "o"
                game.state.getCurrentState().debug = !game.state.getCurrentState().debug;
            }, this),
        };

    } else {
        //make this as a remote player
        this.isClient = false;
        this.isRemote = true;

        this.nextPosition = {
            x: this.x,
            y: this.y,
        };
    }

    game.add.existing(this);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;
    

};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function () {

    this.updatePhysics();

    if (this.isClient) {
        this.checkPlayerInput();
        this.sendUpdates();
    } else if (this.isRemote) {
        this.updatePosition();
    } else {
        window.alert("Not isClient or isRemote");
    }
};

/**
 * Emits a signal to the server containing data that other connected
 * clients need.
 */
Player.prototype.sendUpdates = function () {
    if (this.isMoving()) {
        game.state.getCurrentState().socket.emit("clientPushUpdate", {nextPosition: {x: this.x, y: this.y}});
    }
    if (this.isRotating()) {
        game.state.getCurrentState().socket.emit("clientPushUpdate", {sprite: {rotation: this.sprite.rotation}});
    }
};

/**
 * client side input checking.
 */
Player.prototype.checkPlayerInput = function () {
    if (this.keys.key_click.isDown) {
        // game.physics.arcade.moveToPointer(this, this.properties.velocity);
    } else {
        //up
        if (this.keys.key_up.isDown) {
            this.body.velocity.y = -this.properties.velocity;
        //down
        } else if (this.keys.key_down.isDown) {
            this.body.velocity.y = this.properties.velocity;
        } else {
            this.body.velocity.y = 0;
        }
        //right
        if (this.keys.key_right.isDown) {
            this.body.velocity.x = this.properties.velocity;
        //left
        } else if (this.keys.key_left.isDown) {
            this.body.velocity.x = -this.properties.velocity;
        } else {
            this.body.velocity.x = 0;
        }
    }
};

Player.prototype.updatePhysics = function () {

};

/**
 * @returns {boolean} True if this player is moving, False otherwise.
 */
Player.prototype.isMoving = function () {
    return !Phaser.Point.equals(this.body.velocity, new Phaser.Point(0, 0));
};

/**
 * @returns {boolean} True if this player is rotating, False otherwise.
 */
Player.prototype.isRotating = function () {
    return this.sprite.isRotating;
};

/**
 * Moves this remote player to the last received coordinates.
 */
Player.prototype.updatePosition = function () {
    if (roundTo3(game.physics.arcade.distanceToXY(this, this.nextPosition.x, this.nextPosition.y))) {
        game.physics.arcade.moveToXY(this, this.nextPosition.x, this.nextPosition.y, this.properties.velocity, 100);
    } else {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
    }
};