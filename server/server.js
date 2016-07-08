var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Util = new (require('./Util.js'));
var Config = require('./config.json');
var Player = require('./Player.js');

var users = [];
var sockets = {};
// var bmd;
// var map;
// var layer;
// var marker;
// var currentTile = 0;
// var cursors;

app.use(express.static(__dirname + '/../client'));

io.on('connection', function (socket) {
    setEventHandlers(socket);
});

function setEventHandlers(socket) {

    socket.on('clientWantsToJoinServer', function () {
        sockets[socket.id] = socket;

        console.log('A player has joined with Id: ' + socket.id
            + ' (Players online: ' + (users.length + 1) + ")");

        socket.emit('serverClientCanStart', users);
    });

    socket.on('disconnect', function () {
        var id = socket.id;
        var poppedPlayer;

        var playerIndex = Util.findIndex(users, id);
        if (playerIndex >= 0) {
            poppedPlayer = users[playerIndex];

            users.splice(playerIndex, 1);

            sendUpdatesToUsers(id, function (remotePlayerId) {
                sockets[remotePlayerId].emit('serverRemotePlayerDisconnect', id);
            });
        }

        console.log('A player has disconnected with Id: ' + poppedPlayer.id
            + ' (Players online: ' + users.length + ")");

        socket.disconnect();
    });

    socket.on('clientCreatePlayer', function () {
        var newPlayer = new Player(socket.id);

        users.push(newPlayer);
    });

    socket.on('clientPushUpdate', function (infoToUpdateWith) {
        var id = socket.id;
        var playerIndex = Util.findIndex(users, id);

        if (playerIndex > -1) {
            var player = users[playerIndex];

            for (var property in infoToUpdateWith) {
                if (player.hasOwnProperty(property)) {
                    player[property] = infoToUpdateWith[property];
                } else {
                    player[property] = infoToUpdateWith[property];
                }
            }

            sendUpdatesToUsers(id, function (remotePlayerId) {
                infoToUpdateWith.id = id;

                sockets[remotePlayerId].emit('serverUpdateRemotePlayersInfo', infoToUpdateWith);
            });
        }
    })
}

/**
 * Runs a function for each player in users other then myself.
 * @param socketId          My socket's id
 * @param customFunction    a function to run for each other player
 */
function sendUpdatesToUsers(id, customFunction) {
    for (var i = 0; i < users.length; i++) {
        var remotePlayerId = users[i].id;

        if (remotePlayerId != id) {
            customFunction(remotePlayerId);
        }
    }
}

var serverPort = process.env.PORT ||Config.port;

http.listen(serverPort, function () {
    console.log("Server is listening on port " + serverPort);
    //console.log("localhost:3000");
});