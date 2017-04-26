var chat = require("./model/chatModel")
var user = require('./model/user');
var waterfall = require('async-waterfall');

module.exports = {
    // initChat:function(connection,obj){
    //     ID = obj.senderId;
    //     return connectedClients;
    // },
    textOneOnOne: function(senderConn, recieverConn, data) {
        console.log("textOneOnOne-------");
        console.log(JSON.stringify(data));
        var roomId;

        waterfall([
            function(callback) {
                if (data.roomId == "" || data.roomId == undefined) {

                    chat.findOne({ $or: [{ senderId: data.senderId, receiverId: data.receiverId }, { senderId: data.receiverId, receiverId: data.senderId }] }).limit(1).sort({ timestamp: -1 }).exec(function(err, roomResult) {
                        if (roomResult) {
                            roomId = roomResult.roomId;
                        } else {
                            roomId = data.timestamp;
                        }
                        callback(null, roomId);
                    })

                } else {
                    roomId = data.roomId;
                    callback(null, roomId);
                }
            },
            function(roomId, callback) {

                var objChat = new chat({
                    message: data.message,
                    senderId: data.senderId,
                    receiverId: data.receiverId,
                    timestamp: data.timestamp,
                    roomId: roomId,
                    senderImage: data.senderImage,
                    receiverImage: data.receiverImage,
                    senderName: data.senderName,
                    receiverName: data.receiverName,
                    pageId:data.pageId
                })
                objChat.save(function(err, result) {
                    if (err) console.log(err);
                    else {

                        user.findOne({ _id: data.receiverId }, function(err1, receiverData) {
                            if (receiverData) {
                                if (recieverConn != undefined) {
                                    var respObj = JSON.stringify(data);
                                    respObj = JSON.parse(respObj);
                                    respObj.roomId = roomId;
                                    respObj = JSON.stringify(respObj);
                                    recieverConn.send(respObj);
                                } else {

                                    if (receiverData.deviceType == "ios" && receiverData.notification_status == "on") {
                                        if (receiverData.deviceToken == '' || receiverData.deviceToken == undefined) {
                                        } else {
                                            pushNotification.iosPush(receiverData.deviceToken, data.message, data.senderId, data.senderName)
                                        }
                                        //                                    
                                    } else if (receiverData.deviceType == "android" && receiverData.notification_status == "on") {
                                        if (receiverData.deviceToken == '' || receiverData.deviceToken == undefined) {
                                        } else {
                                            pushNotification.androidPush(data.message, receiverData.deviceToken,  data.senderId, data.senderName)
                                        }
                                        //                                

                                    }
                                }
                            } else {
                                var respObj = JSON.stringify(data);
                                respObj = JSON.parse(respObj);
                                respObj.roomId = roomId;
                                console.log("respObj 91----------", respObj);
                                respObj = JSON.stringify(respObj);
                                if (recieverConn == undefined) {
                                    console.log("recieverConn gone");
                                } else {
                                    recieverConn.send(respObj);
                                }
                            }
                            if (senderConn == undefined) {
                                console.log("senderConn gone");
                            } else {
                                var respObj = JSON.stringify(data);
                                //console.log("roomId--------------98  ",roomId);
                                respObj = JSON.parse(respObj);
                                respObj.roomId = roomId;
                                console.log("respObj 100----------", respObj);
                                respObj = JSON.stringify(respObj);
                                senderConn.send(respObj);
                            }

                        });
                    }
                })
            }
        ], function(err, result) {
            console.log("result");
        })
    },
    onlineUserList: function(senderConn, connectedClients, data) {
        var j = 0;
        var onlineFriends = [];

        for (var i = 0; i < data.followers.length; i++) {

            if (connectedClients[data.followers[i]]) {
                onlineFriends[j] = data.followers[i];
                j++;
            }
        }
        if (senderConn == undefined) {
        } else {
            senderConn.send(onlineFriends);
        }
    },
    readCount: function(data) {
        chat.update({ roomId: data.roomId, timestamp: { $lte: data.timestamp } }, { $set: { is_read: 1 } }, { multi: true }, function(err, readResult) {
            if (err) return err;
        })
    }
}
