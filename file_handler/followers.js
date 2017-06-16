 var followerList = require("./model/followersList");
 var User = require("./model/user");
 var functions = require("./functionHandler");
 var waterfall = require('async-waterfall');
 module.exports = {

     //API Report Problem  
     "followUnfollow": function(req, res) {
         if (req.body.follow == "follow") {
             User.findOne({ _id: req.body.receiverId }, function(err, result) {
                 if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No user found." }); } else if (result.privacy.followMe == "nobody") { res.send({ responseCode: 409, responseMessage: "You cannot send follow request to this user due to privacy policies" }) } else {
                     followerList.findOne({ senderId: req.body.senderId, receiverId: req.body.receiverId }).exec(function(err, result1) {
                         if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                             if (!result1) {
                                 var follow = new followerList(req.body);
                                 follow.save(function(err, result) {
                                     User.findOne({ _id: req.body.senderId }).exec(function(err, results) {
                                         if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                                             var image = results.image;
                                             User.findOneAndUpdate({ _id: req.body.receiverId }, {
                                                 $push: { "notification": { userId: req.body.senderId, type: "You have one follow request", linkType: 'profile', notificationType: 'follow', image: image } }
                                             }, { new: true }).exec(function(err, results) {
                                                if(!(results.deviceToken == undefined && results.deviceToken == null)){
                                                 if (results.deviceToken && results.deviceType && results.notification_status && results.status) {
                                                     var message = "You have one follow request";
                                                     if (results.deviceType == 'Android' && results.notification_status == 'on' && results.status == 'ACTIVE') {
                                                         functions.android_notification(results.deviceToken, message);
                                                         console.log("Android notification send!!!!")
                                                     } else if (results.deviceType == 'iOS' && results.notification_status == 'on' && results.status == 'ACTIVE') {
                                                         functions.iOS_notification(results.deviceToken, message);
                                                     } else {
                                                         console.log("Something wrong!!!!")
                                                     }
                                                 }
                                             }
                                                 else{
                                                    console.log("no deviceToken")
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
         var viewerId = req.body.viewerId;
         if (req.body.viewerId == req.body.receiverId) {
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
         } else {
             User.findOne({ _id: req.body.receiverId }, function(err, result1) {
                 if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error12' }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: "No user found." }); } else if (result1.privacy.ViewFollower == "nobody") { res.send({ responseCode: 409, responseMessage: "You cannot see follower of this user due to privacy policies" }) } else if (result1.privacy.ViewFollower == "onlyFollowers") {
                     var flag = result1.userFollowers.indexOf(req.body.viewerId)
                     console.log("flag-->>", flag)
                     if (flag == -1) { res.send({ responseCode: 400, responseMessage: "You cannot see follower of this user due to privacy policies" }); } else {
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

                     }

                 } else {
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

                 }
             })
         }
     },



     //API for Accept Follower Request
     "acceptFollowerRequest": function(req, res) {
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
             console.log("block req-->>", req.body)
             var blockUserId = req.body.blockUserId;
             User.findOne({ _id: req.body.receiverId }).exec(function(err, user) {
                 if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }) } else if (!user) { res.send({ responseCode: 404, responseMessage: "Please enter correct receiverId" }); } else if (Boolean(user.blockUser.find(blockUser => blockUser == blockUserId))) { res.send({ responseCode: 400, responseMessage: "You have already block this user." }); } else {
                     followerList.findOneAndUpdate({ $and: [{ senderId: req.body.senderId }, { receiverId: req.body.receiverId }] }, { $set: { followerStatus: req.body.followerStatus, userId: req.body.userId, blockUserId: req.body.blockUserId } }, { new: true }).exec(function(err, results) {
                         if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }) } else {

                             User.findOne({ _id: req.body.receiverId }).exec(function(err, result) {
                                 console.log("block result-->>", result)
                                 if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }) } else if (!result) { res.send({ responseCode: 404, responseMessage: "No user found" }); } else {
                                     var userFollowers = result.userFollowers;
                                     var mySet = new Set(userFollowers);
                                     var has = mySet.has(blockUserId)
                                     if (has) {
                                         console.log("<<in if-->>")
                                         User.findOneAndUpdate({ _id: req.body.receiverId }, { $push: { blockUser: req.body.blockUserId }, $pop: { userFollowers: -req.body.blockUserId } }, { new: true }, function(err, result1) {
                                             if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error.' }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: "No ad found." }); } else {
                                                 res.send({
                                                     result: result1,
                                                     responseCode: 200,
                                                     responseMessage: "Successfully blocked this user."
                                                 });
                                             }
                                         })
                                     } else {
                                         console.log("<<in elseif-->>")
                                         User.findOneAndUpdate({ _id: req.body.receiverId }, { $push: { blockUser: req.body.blockUserId } }, { new: true }, function(err, result1) {
                                             if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error.' }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: "No ad found." }); } else {
                                                 res.send({
                                                     result: result1,
                                                     responseCode: 200,
                                                     responseMessage: "Successfully blocked this user."
                                                 });
                                             }
                                         })
                                     }
                                 }
                             })
                         }
                     })
                 }
             })
         } else if (req.body.followerStatus == "reject") {
             console.log("req-->>", req.body)
             followerList.findOneAndUpdate({ $and: [{ senderId: req.body.senderId }, { receiverId: req.body.receiverId }] }, { $set: { followerStatus: req.body.followerStatus } }, { new: true }).exec(function(err, results) {
                 console.log("results-->>", results)
                 if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }) } else {
                     res.send({
                         result: results,
                         responseCode: 200,
                         responseMessage: "You have reject this user."
                     });
                 }
             })
         } else if (req.body.followerStatus == "unblock") {
             followerList.findOneAndUpdate({ $and: [{ userId: req.body.userId }, { blockUserId: req.body.blockUserId }] }, {
                 $set: { followerStatus: req.body.followerStatus }
             }, { new: true }).exec(function(err, results) {
                 if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }) } else {

                     User.findOneAndUpdate({ _id: req.body.receiverId }, { $pop: { blockUser: -req.body.blockUserId } }, { new: true }).exec(function(err, result) {
                         if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }) } else if (!result) { res.send({ responseCode: 404, responseMessage: "No user found" }); } else {
                             res.send({
                                 result: results,
                                 responseCode: 200,
                                 responseMessage: "Successfully unblock this user."
                             });
                         }
                     })

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
     },

     "blockLeader": function(req, res) {
         console.log("blockLeader req-->>", req.body)
         var blockUserId = req.body.blockUserId;
         User.findOne({ _id: req.body.senderId }).exec(function(err, user) {
             if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }) } else if (!user) { res.send({ responseCode: 404, responseMessage: "Please enter correct userId" }); } else if (Boolean(user.blockUser.find(blockUser => blockUser == blockUserId))) { res.send({ responseCode: 400, responseMessage: "You have already block this user." }); } else {
                 followerList.findOneAndUpdate({ $and: [{ senderId: req.body.senderId }, { receiverId: req.body.receiverId }] }, { $set: { followerStatus: req.body.followerStatus, userId: req.body.userId, blockUserId: req.body.blockUserId } }, { new: true }).exec(function(err, results) {
                     if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }) } else {

                         User.findOne({ _id: req.body.senderId }).exec(function(err, result) {
                             console.log("blockLeader result-->>", result)
                             if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }) } else if (!result) { res.send({ responseCode: 404, responseMessage: "No user found" }); } else {
                                 var userFollowers = result.userFollowers;
                                 var mySet = new Set(userFollowers);
                                 var has = mySet.has(blockUserId)
                                 if (has) {
                                     console.log("<<blockLeader in if-->>")
                                     User.findOneAndUpdate({ _id: req.body.receiverId }, { $push: { blockUser: req.body.blockUserId }, $pop: { userFollowers: -req.body.blockUserId } }, { new: true }, function(err, result1) {
                                         if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error.' }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: "No ad found." }); } else {
                                             res.send({
                                                 result: result1,
                                                 responseCode: 200,
                                                 responseMessage: "You have blocked this user."
                                             });
                                         }
                                     })
                                 } else {
                                     console.log("<<blockLeader in elseif-->>")
                                     User.findOneAndUpdate({ _id: req.body.receiverId }, { $push: { blockUser: req.body.blockUserId } }, { new: true }, function(err, result1) {
                                         if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error.' }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: "No ad found." }); } else {
                                             res.send({
                                                 result: result1,
                                                 responseCode: 200,
                                                 responseMessage: "You have blocked this user."
                                             });
                                         }
                                     })
                                 }
                             }
                         })
                     }
                 })
             }
         })
     }
 }
