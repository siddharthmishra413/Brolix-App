
var chat=require("./model/chatModel")
var user = require('./model/user');
var waterfall = require('async-waterfall');

module.exports={
    // initChat:function(connection,obj){
    //     ID = obj.senderId;
    //     return connectedClients;
    // },
    textOneOnOne:function(senderConn,recieverConn,data){
        console.log("textOneOnOne-------");
        console.log(JSON.stringify(data));
        var roomId;

        waterfall([
            function(callback){
                if(data.roomId == "" || data.roomId == undefined){

                    chat.findOne({$or:[{senderId:data.senderId,receiverId:data.receiverId},{senderId:data.receiverId,receiverId:data.senderId}]}).limit(1).sort({timestamp:-1}).exec(function(err, roomResult){
                        console.log("roomResult-----------------  ", roomResult);
                        if(roomResult){
                            roomId=roomResult.roomId;
                        }else{
                            roomId = data.timestamp;
                        }
                        console.log("roomId----22------------  ", roomId);
                        callback(null, roomId);
                    })
            
                } else{
                    roomId = data.roomId;

                    console.log("roomId---after----28---------  ", roomId);
                    callback(null, roomId);
                }
            }, function(roomId, callback){
                console.log("roomId---after---later---31-------  ", roomId);
                       
               var objChat=new chat({
                    message:data.message,
                    senderId:data.senderId,
                    receiverId:data.receiverId,
                    timestamp:data.timestamp,
                    roomId:roomId,
                    senderImage:data.senderImage,
                    receiverImage:data.receiverImage,
                    senderName:data.senderName,
                    receiverName:data.receiverName
             })
               objChat.save(function(err,result){
                    if(err) console.log(err);
                    else{
                       
                        user.findOne({_id:data.receiverId},function(err1,receiverData){
                            if(receiverData){
                                if(recieverConn!=undefined){
                                    var respObj=JSON.stringify(data);
                                    respObj = JSON.parse(respObj);
                                    respObj.roomId = roomId;
                                    respObj = JSON.stringify(respObj);
                                    console.log("respObj----51---------", respObj);
                                    recieverConn.send(respObj);
                                }
                                else{
                                  
                                    console.log("user is offline textOneOnOne------------")
                                    if(receiverData.deviceType =="ios" && receiverData.notification_status == "on"){
                                        console.log("in iOS textOneOnOne")
                                        if(receiverData.deviceToken == '' || receiverData.deviceToken == undefined){
                                                    console.log("receiver is offline");
                                        }else{
                                        pushNotification.iosPush(receiverData.deviceToken ,data.message,result1[0].username,groupSetting[0],data.senderId,"textOneOnOne")
                                    }
        //                                    
                                    }
                                    else if(receiverData.deviceType =="android" && receiverData.notification_status == "on"){
                                        console.log("in android textOneOnOne")
                                        if(receiverData.deviceToken == '' || receiverData.deviceToken == undefined){
                                                    console.log("receiver is offline");
                                        }else{
                                        pushNotification.androidPush(data.message,receiverData.deviceToken ,groupSetting[0],data.senderId,"textOneOnOne")
                                        }
        //                                
                                      
                                    }
                                }
                            }
                            else{
                                var respObj=JSON.stringify(data);
                                //console.log("roomId--------------89  ",roomId);
                                respObj = JSON.parse(respObj);
                                respObj.roomId = roomId;
                                console.log("respObj 91----------", respObj);
                                respObj = JSON.stringify(respObj);
                                if(recieverConn == undefined){
                                    console.log("recieverConn gone");
                                }else{
                                    recieverConn.send(respObj);
                                }
                            }
                            if(senderConn == undefined){
                                console.log("senderConn gone");
                            }else{
                                 var respObj=JSON.stringify(data);
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
                ],function(err, result){
                    console.log("result");
                })
            },
            onlineUserList: function(senderConn, connectedClients, data){
                console.log("list of friends-------"+JSON.stringify(data));

              var j =0;
              var onlineFriends=[];

              for(var i =0; i<data.followers.length; i++){

                if(connectedClients[data.followers[i]]){
                     onlineFriends[j] = data.followers[i];
                     j++;

                } 
              }
              console.log("list of online friends-------"+onlineFriends);

                  if(senderConn == undefined){
                    console.log("sender is offline")

                  } else{
                    senderConn.send(onlineFriends);
                  }

            },
            readCount:function(data){
                console.log("readCount dta----", data);
                chat.update({roomId:data.roomId, timestamp:{$lte:data.timestamp}},{$set:{is_read:1}},{multi:true},function(err, readResult){
                    if(err) return err;
                    console.log("readResult      ------ ",readResult);
                })
            }
        
}


