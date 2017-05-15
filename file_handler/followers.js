 var followerList = require("./model/followersList");
 var User = require("./model/user");
 var functions = require("./functionHandler");
 module.exports = {

     //API Report Problem  
     "followUnfollow": function(req, res) {
         if (req.body.follow == "follow") {
             followerList.findOne({ $or: [{ $and: [{ senderId: req.body.senderId }, { receiverId: req.body.receiverId }] }, { $and: [{ senderId: req.body.receiverId }, { receiverId: req.body.senderId }] }] }).exec(function(err, result1) {
                 if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                     if (!result1) {
                         var follow = new followerList(req.body);
                         follow.save(function(err, result) {
                             User.findOne({ _id: req.body.senderId }).exec(function(err, results) {
                                 if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                                     var image = results.image;

                                     User.findOneAndUpdate({ _id: req.body.receiverId }, {
                                         $push: { "notification": { userId: req.body.senderId, type: "You have one follow request", notificationType: 'follow', image: image } }
                                     }, { new: true }).exec(function(err, results) {

                                         if (results.deviceType == 'Android' || result.notification_status == 'on' || result.status == 'ACTIVE') {
                                             var message = "req.body.message";
                                             functions.android_notification(result.deviceToken, message);
                                             console.log("Android notification send!!!!")
                                         } else if (result.deviceType == 'iOS' || result.notification_status == 'on' || result.status == 'ACTIVE') {
                                             functions.iOS_notification(result.deviceToken, message);
                                         } else {
                                             console.log("Something wrong!!!!")
                                         }
                                         if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
                                         res.send({
                                             result: result,
                                             responseCode: 200,
                                             responseMessage: "Followed."
                                         });
                                     })
                                 }
                             })
                         })
                     } else {
                         if (result1.followerStatus == "reject" || result1.followerStatus == "unfollow" || result1.followerStatus == "unblock") {
                             followerList.findOneAndUpdate({ _id: result1._id }, { $set: { followerStatus: "Sent", receiverId: req.body.receiverId, senderId: req.body.senderId } }, { new: true }).exec(function(err, result2) {
                                 if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
                                 res.send({
                                     result: result2,
                                     responseCode: 200,
                                     responseMessage: "Followed."
                                 });
                             })
                         } else if (result1.followerStatus == "block") {
                             res.send({
                                 responseCode: 201,
                                 responseMessage: "You have already block this user."
                             });
                         } else {
                             res.send({
                                 responseCode: 202,
                                 responseMessage: "You have already send request."
                             });
                         }
                     }
                 }
             })
         } else if (req.body.follow == "unfollow") {
             followerList.findOneAndUpdate({ $and: [{ senderId: req.body.senderId }, { receiverId: req.body.receiverId }] }, {
                 $set: { followerStatus: "unfollow" }
             }, { new: true }).exec(function(err, result) {
                 if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                     User.findOneAndUpdate({ _id: req.body.receiverId }, { $pop: { userFollowers: -req.body.senderId } }, { new: true }).exec(function(err, result) {
                         if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }) } else if (!result) { res.send({ responseCode: 404, responseMessage: "No user found" }); } else {
                             res.send({
                                 result: result,
                                 responseCode: 200,
                                 responseMessage: "Unfollowed."
                             });
                         }
                     })
                 }
             })
         }
     },

     "followerRequestSend": function(req, res) {
         followerList.find({ senderId: req.body.senderId }).exec(function(err, result) {
             if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                 var arr = [];
                 result.forEach(function(result) {
                     arr.push(result.receiverId)
                 })
                 User.find({ _id: { $in: arr } }).lean().exec(function(err, newResult) {
                     for (var i = 0; i < newResult.length; i++) {
                         newResult[i].followerStatus = result[i].followerStatus;
                     }
                     res.send({
                         result: newResult,
                         responseCode: 200,
                         responseMessage: "Show list all followers."
                     });
                 })
             }
         })
     },

     "followerRequestReceive": function(req, res) {
         followerList.find({ receiverId: req.body.receiverId }).exec(function(err, result) {
             if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                 var arr = [];
                 result.forEach(function(result) {
                     arr.push(result.senderId)
                 })
                 User.find({ _id: { $in: arr } }).lean().exec(function(err, newResult) {
                     for (var i = 0; i < newResult.length; i++) {
                         newResult[i].followerStatus = result[i].followerStatus;
                     }
                     res.send({
                         result: newResult,
                         responseCode: 200,
                         responseMessage: "Show list all followers request."
                     });
                 })
             }
         })
     },

     //API for Accept Follower Request
     "acceptFollowerRequest": function(req, res) {
         console.log("req-->>",req.body)
         if (req.body.followerStatus == "accept") {
             console.log("in")
             followerList.findOneAndUpdate({ $and: [{ senderId: req.body.senderId }, { receiverId: req.body.receiverId }] }, {
                 $set: {
                     followerStatus: req.body.followerStatus,
                     userId: req.body.userId
                 }
             }, { new: true }).exec(function(err, results) {
                 if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }) } else {
                     User.findOneAndUpdate({ _id: req.body.receiverId }, { $push: { userFollowers: req.body.senderId } }, { new: true }).exec(function(err, result) {
                         console.log("result--->>>", result)
                         if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }) } else if (!result) { res.send({ responseCode: 404, responseMessage: "No user found" }); } else {
                             res.send({
                                 result: results,
                                 responseCode: 200,
                                 responseMessage: "Accepted successfully."
                             });
                         }
                     })
                 }
             })
         } else if (req.body.followerStatus == "block") {
              console.log("req-->>",req.body)
             followerList.findOneAndUpdate({ $and: [{ senderId: req.body.senderId }, { receiverId: req.body.receiverId }] }, {
                 $set: {
                     followerStatus: req.body.followerStatus,
                     userId: req.body.userId,
                     blockUserId: req.body.blockUserId
                 }
             }, { new: true }).exec(function(err, results) {
                 if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }) } else {
                     User.findOneAndUpdate({ _id: req.body.receiverId }, { $push: { blockUser: req.body.blockUserId } }, { new: true }).exec(function(err, result) {
                         if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }) } else if (!result) { res.send({ responseCode: 404, responseMessage: "No user found" }); } else {
                             res.send({
                                 result: results,
                                 responseCode: 200,
                                 responseMessage: "You have blocked this user."
                             });
                         }
                     })
                 }
             })
         } else if (req.body.followerStatus == "reject") {
             followerList.findOneAndUpdate({ $and: [{ userId: req.body.userId }, { blockUserId: req.body.blockUserId }] }, {
                 $set: {
                     followerStatus: req.body.followerStatus
                 }
             }, { new: true }).exec(function(err, results) {
                 if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }) } else {
                     res.send({
                         result: results,
                         responseCode: 200,
                         responseMessage: "You have reject this user."
                     });
                 }
             })
         }
     },

     "blockUserList": function(req, res) {
         followerList.find({ userId: req.body.userId, followerStatus: "block" }).exec(function(err, result) {
             if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                 var arr = [];
                 result.forEach(function(result) {
                     arr.push(result.blockUserId)
                 })
                 User.find({ _id: { $in: arr } }).lean().exec(function(err, newResult) {
                     for (var i = 0; i < newResult.length; i++) {
                         newResult[i].followerStatus = result[i].followerStatus;
                     }
                     res.send({
                         result: newResult,
                         responseCode: 200,
                         responseMessage: "Show list all block users."
                     });
                 })
             }
         })
     }
 }
