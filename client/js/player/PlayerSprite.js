/**
 * Custom Player object that extends Phaser Sprite.
 * @param game - The Phaser game object.
 * @param key - The name of the sprite to display as.
 * @param parentSprite - This object's parent.
 */
var PlayerSprite = function (game, key, parentSprite) {
    if (game) { this.game = game; }
    if (key == undefined) { window.alert("no key"); }

    //call the Phaser.Sprite passing in the game reference
    Phaser.Sprite.call(this, game, 0, 0, key);
    this.anchor.setTo(0.5, 0.5);

    this.isRotating = false;

    game.add.existing(this);
    if (parentSprite == undefined) { window.alert("no parentSprite"); } else { this.parent = parentSprite; }
};

PlayerSprite.prototype = Object.create(Phaser.Sprite.prototype);
PlayerSprite.prototype.constructor = PlayerSprite;

PlayerSprite.prototype.update = function () {
    if (this.parent) {
        this.updatePhysics();
    }
};

PlayerSprite.prototype.updatePhysics = function () {
    if (this.parent.isClient) {
        this.isRotating = false;
        var currentRot = roundTo3(this.rotation);
        var pointerRot = roundTo3(game.physics.arcade.angleToPointer(this.parent));

        if (currentRot != pointerRot) {
            this.rotation = game.physics.arcade.angleToPointer(this.parent);
            this.isRotating = true;
        }
    }
};