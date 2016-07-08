/**
 * This is where all the server's messages are received by the client.
 * @param socket
 * @param self - The state using these sockets.
 */
function setUpSocket (socket, self) {
    socket.on('disconnect', function () {
        socket.disconnect();
    });

    socket.on('serverClientCanStart', function (remotePlayers) {
        self.remotePlayers = remotePlayers;
        game.state.start("gameState");
    });

    socket.on('serverUpdateRemotePlayersInfo', function (infoToUpdateWith) {
        var remotePlayer = self.remotePlayers[infoToUpdateWith.id];

        if (remotePlayer) {
            updateObjectProperties(remotePlayer, infoToUpdateWith);
        } else {
            var newPlayer = new Player(game, infoToUpdateWith.id, false, infoToUpdateWith.x, infoToUpdateWith.y);
            self.remotePlayers[newPlayer.id] = newPlayer;
        }
    });

    socket.on('serverRemotePlayerDisconnect', function (id) {
        var remotePlayer = self.remotePlayers[id];

        if (remotePlayer) {
            var poppedPlayer = self.remotePlayers[id];
            poppedPlayer.destroy();
            delete self.remotePlayers[id];
        }
    });
}