var Player = function (id) {
    this.id = id;

    this.nextPosition = {
        x: -1,
        y: -1,
    }
};

// Export the Player class so you can use it in
// other files by using require("Player")
module.exports = Player;