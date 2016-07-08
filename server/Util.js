var Util = function () {};

/**
 * Gets a random integer between min and max.
 */
Util.prototype.randomIntFromInterval = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

/**
 * Finds the index of an element within an array based on their id.
 */
Util.prototype.findIndex = function (arr, id) {
    var len = arr.length;

    while (len--) {
        if (arr[len].id === id) {
            return len;
        }
    }

    return -1;
};

module.exports = Util;