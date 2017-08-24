var chat = require("./model/chatModel")
var user = require('./model/user');
var waterfall = require('async-waterfall');
var functions = require("./functionHandler");

module.exports = {
    // initChat:function(connection,obj){
    //     ID = obj.senderId;
    //     return connectedClients;
    // },
    textOneOnOne: function(senderConn, recieverConn, data) {
        console.log("textOneOnOne-------");
        console.log("xtOneOnOne-->>>*+*+*+*",JSON.stringify(data));
        console.log("recieverConn-------");
        console.log(recieverConn);
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
                                if (receiverData.deviceToken && receiverData.deviceType && receiverData.notification_status && receiverData.status) {
                                var message = "You have coupon Exchange request";
                                if (receiverData.deviceType == 'iOS' && receiverData.notification_status == "on") {
                                 functions.iOS_notification(receiverData.deviceToken, data.message, data.senderId, data.senderName) 
                                     
                                }
                              else if (receiverData.deviceType == 'Android' && receiverData.notification_status == "on") {
                                  functions.android_notification(receiverData.deviceToken, data.message,  data.senderId, data.senderName)
                                } else {
                                    console.log("Something wrong!!!!")
                                }
                            }   
                                  
                                }
                            } else {
                                var respObj = JSON.stringify(data);
                                respObj = JSON.parse(respObj);
                                respObj.roomId = roomId;
                                console.log("respObj 91----------", respObj);
                                console.log("recieverConnrespObj-------");
                                console.log(recieverConn);
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
                       //         console.log("respObj 100----------", respObj);
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
    
    // function to show online user list
    onlineUserList: function(senderConn, connectedClients, data) {
        var j = 0;
        var onlineFriends = [];

        for (var i = 0; i < data.followers.length; i++) {

            if (connectedClients[data.followers[i]]) {
                onlineFriends[j] = data.followers[i];
                j++;
            }
        }
        console.log("onlineFriends--->>>",onlineFriends)
        if (senderConn == undefined) {
        } else {
            senderConn.send(onlineFriends);
        }
    },
    
    // function to update read count on chat
    readCount: function(data) {
       console.log("data--->>>>",JSON.stringify(data))
        chat.update({receiverId: data.userID, roomId: data.roomId, timestamp: { $lte: data.timestamp } }, { $set: { is_read: 1 } }, { multi: true }, function(err, readResult) {
            console.log("read count result-->>>",readResult)
            if (err) return err;
        })
    }
}
