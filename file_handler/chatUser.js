
var chat=require("./model/chatModel")
var user = require('./model/user');

module.exports={
    // initChat:function(connection,obj){
    //     ID = obj.senderId;
    //     return connectedClients;
    // },
    textOneOnOne:function(senderConn,recieverConn,data){
        console.log("textOneOnOne-------");
        console.log(JSON.stringify(data));
        var roomId;
        if(data.roomId == "" || data.roomId == undefined){
            chat.findOne({$or:[{senderId:data.senderId,receiverId:data.receiverId},{senderId:data.receiverId,receiverId:data.senderId}]}).limit(1).sort({timestamp:-1}).exec(function(err, roomResult){
                if(roomResult){
                    roomId=roomResult.roomId;
                }else{
                    roomId = data.timestamp;
                }
            })
            
        } else{
            roomId = data.roomId;
        }
                   
           var objChat=new chat({
                message:data.message,
                senderId:data.senderId,
                receiverId:data.receiverId,
                timestamp:data.timestamp,
                roomId:roomId
         })
       
        objChat.save(function(err,result){
               // console.log(result);
                if(err) console.log(err);
                else{
                   
                    user.findOne({_id:data.receiverId},function(err1,receiverData){
                        if(result1.length>0){
                        if(recieverConn!=undefined){
                            var respObj=JSON.stringify(data);
                            respObj.roomId = roomId;
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
                            respObj.roomId = roomId;
                            recieverConn.send(respObj);
                        }
                        if(senderConn == undefined){
                            console.log("senderConn gone");
                        }else{
                             console.log("respObj22----------")
                             var respObj=JSON.stringify(data);
                             respObj.roomId = roomId;
                            senderConn.send(respObj);
                        }
                        
                    });
//                    
                } 
           })
       
        
    }
}


