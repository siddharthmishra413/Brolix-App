var chatUser = require('./chatUser');
var WebSocketServer = require('websocket').server;
var http = require('http');
var server = http.createServer(function(request, response) {});
var connectedClients = {}
var wsServer = new WebSocketServer({
    httpServer: server
});
server.listen(8086, function() {
    console.log((new Date()) + ' Server is listening on port ---->>>>' + 8086);
});

var chat = function() {
    wsServer.on('request', function(r) {
        var connection = r.accept(null, r.origin);

        connection.on('close', function() {
            console.log('Client disconnected  ' + connection.ID);
            delete connectedClients[connection.ID]
            console.log(connectedClients[connection.ID]);
        });

        connection.on('message', function(message) {
            var obj = JSON.parse(message.utf8Data);
            if (obj.msgTyp == "init") {
                connection.ID = obj.senderId;
            }
            console.log("connectedClients ---connectedClients ---connectedClients ---connectedClients --- ")
//            console.log("0-0-0-0-0-0-0->>>>",obj)
//            console.log("*********************",obj.receiverId)
//            console.log("connectedClients---->>>>",connectedClients)
//            console.log("*+*+*+*+*+*+*+*+*+*+*+",connection.ID);
            //console.log("connectedClients --- ", JSON.stringify(connectedClients));
            /* if(!connectedClients[obj.senderId]){
                 connection.send('closed');
             }*/
            switch (obj.msgTyp) {
                case "init":
                    connectedClients[obj.senderId] = connection;
                    break;
                case "textOneOnOne":
                    chatUser.textOneOnOne(connectedClients[obj.senderId], connectedClients[obj.receiverId], obj);
                    break;
                case "onlineUserList":
                    chatUser.onlineUserList(connectedClients[obj.senderId], connectedClients, obj);
                    break;
                case "readCount":
                    chatUser.readCount(obj);
                    break;

            }
        });
    });
}

module.exports = chat;
