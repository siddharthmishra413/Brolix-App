 var followerList = require("./model/followersList");
 var User = require("./model/user");
 var functions = require("./functionHandler");
 module.exports = {

     //API Report Problem
     "followUnfollow": function(req, res) {
        console.log("result1.followerStatus == null =========", req.body);
         if (req.body.follow == "follow") {
             followerList.findOne({ $and: [{ senderId: req.body.senderId }, { receiverId: req.body.receiverId }] }).exec(function(err, result1) {
                console.log("result1.followerStatus == null =========", JSON.stringify(result1));
                 if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                     if (!result1) {
                         var follow = new followerList(req.body);
                         follow.save(function(err, result) {
                             User.findOne({ _id: req.body.receiverId }).exec(function(err, results) {
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
                         })
                     } else {
                        console.log("result1.followerStatus == null ========="+result1.followerStatus);
                         if (result1.followerStatus == "reject" || result1.followerStatus == "unfollow") {
                            console.log("result1.followerStatus == null =========");
                             followerList.findOneAndUpdate({ _id: result1._id }, { $set: { followerStatus: "Sent" } }, { new: true }).exec(function(err, result2) {
                                 if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
                                 res.send({
                                     result: result2,
                                     responseCode: 200,
                                     responseMessage: "Followed."
                                 });
                             })
                         } else {
                             res.send({
                                 responseCode: 200,
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
                     res.send({
                         result: result,
                         responseCode: 200,
                         responseMessage: "Unfollowed."
                     });
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
                     console.log("arrr========");
                     console.log(arr);
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
                     console.log("arrr========");
                     console.log(arr);
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
         followerList.findOneAndUpdate({ $and: [{ senderId: req.body.senderId }, { receiverId: req.body.receiverId }] }, {
             $set: {
                 followerStatus: req.body.followerStatus
             }
         }, { new: true }).exec(function(err, results) {
             if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }) } else {
                 res.send({
                     result: results,
                     responseCode: 200,
                     responseMessage: "Accepted successfully."
                 });
             }
         })
     },

     "blockUserList" : function (req, res) {
        followerList.find({ senderId: req.body.userId , followerStatus:"block"}).exec(function(err, result) {
             if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                 var arr = [];
                 result.forEach(function(result) {
                     arr.push(result.receiverId)
                     console.log("arrr========");
                     console.log(arr);
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
