var gameProperties = {
    screenWidth: 800,
    screenHeight: 600,
};

/**
 * These get looped through to load in all the assets before connecting to the server
 */
var imageAssets = {
    main: {URL:'./assets/main.png', name:'main'},
    fish: {URL:'./assets/fish.png', name:'fish'},
    button: {URL:'./assets/button.png', name:'button'},
    square: {URL:'./assets/square.png', name:'square'},
    circle: {URL:'./assets/circle.png', name:'circle'},
    triangle: {URL:'./assets/triangle.png', name:'triangle'},
};

var spriteSheetAssets = {
    fishAnim: {URL:'./assets/fishAnim.png', name:'fishAnim', width: 500, height: 200, frames: 2},
};

var soundAssets = {
    gulp: {URL: ['assets/gulp.ogg', 'assets/gulp.m4a'], name:'gulp'},
    death: {URL: ['assets/death.ogg', 'assets/death.m4a'], name:'death'},
};

var fontAssets = {
    counterFontStyle:{font: '20px Arial', fill: '#FFFFFF', align: 'center'},
};

var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight);