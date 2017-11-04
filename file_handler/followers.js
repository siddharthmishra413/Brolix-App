 var followerList = require("./model/followersList");
 var createNewPage = require("./model/createNewPage");
 var User = require("./model/user");
 var functions = require("./functionHandler");
 var waterfall = require('async-waterfall');
 var mongoose = require('mongoose');
 var async = require('async');

 //<--------------------------------------------I18n------------------------------------------------->
 var configs = {
     "lang": "ar",
     "langFile": "./../../translation/locale.json" //relative path to index.js file of i18n-nodejs module 
 }
 i18n_module = require('i18n-nodejs');
 //<------------------------------------------------------------------------------------------------>
 i18n = new i18n_module(configs.lang, configs.langFile);

 module.exports = {

     //API follow unfollow user  
     "followUnfollow": function(req, res) {
         i18n = new i18n_module(req.body.lang, configs.langFile);
         //    console.log("request----->>>>", req.body)
         if (req.body.follow == "follow") {
             User.findOne({ _id: req.body.receiverId }, function(err, result) {
                 if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No user found." }); } else if (result.privacy.followMe == "nobody") { res.send({ responseCode: 409, responseMessage: i18n.__("You cannot send follow request to this user due to privacy policies") }) } else {
                    User.findOne({ _id: req.body.senderId }, function(err, senderResult) {
                        console.log("senderResult",senderResult)
                     followerList.findOne({ senderId: req.body.senderId, receiverId: req.body.receiverId }).exec(function(err, result1) {
                         if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                             if (!result1) {
                                 var follow = new followerList(req.body);
                                 follow.save(function(err, result) {
                                     User.findOne({ _id: req.body.senderId }).exec(function(err, results) {
                                         if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                                             var image = results.image;
                                             if (image) {
                                                 console.log("in if")
                                                 data = {
                                                     userId: req.body.senderId,
                                                     type: req.body.lang=="en"?""+senderResult.firstName+" sent you a follow request, please click here to view it.":""+senderResult.firstName+" ارسل لك طلب متابعة يرجى الضغط هنا لمشاهدته.",
                                                     linkType: 'profile',
                                                     notificationType: 'follow',
                                                     image: image
                                                 }
                                             } else {
                                                 console.log("in else")
                                                 data = {
                                                     userId: req.body.senderId,
                                                     type:req.body.lang=="en"?""+senderResult.firstName+" sent you a follow request, please click here to view it.":""+senderResult.firstName+" ارسل لك طلب متابعة يرجى الضغط هنا لمشاهدته.",
                                                     linkType: 'profile',
                                                     notificationType: 'follow',
                                                     image: ""
                                                 }
                                             }
                                             console.log("data---->>>", data)
                                             User.findOneAndUpdate({ _id: req.body.receiverId }, { $push: { notification: data } }, { multi: true }).exec(function(err, receiverResult) {
                                                 //     console.log("receiverResult---/////--*+*+*+*+*+>>>>>", receiverResult);
                                                 if (receiverResult.deviceToken) {
                                                     if (receiverResult.deviceToken && receiverResult.deviceType && receiverResult.notification_status && receiverResult.status) {
                                                         var message = req.body.lang=="en"?""+senderResult.firstName+" sent you a follow request, please click here to view it.":""+senderResult.firstName+" ارسل لك طلب متابعة يرجى الضغط هنا لمشاهدته.";
                                                         if (receiverResult.deviceType == 'Android' && receiverResult.notification_status == 'on' && receiverResult.status == 'ACTIVE') {
                                                             functions.android_notification(receiverResult.deviceToken, message);
                                                             console.log("Android notification send!!!!")
                                                         } else if (receiverResult.deviceType == 'iOS' && receiverResult.notification_status == 'on' && receiverResult.status == 'ACTIVE') {
                                                             functions.iOS_notification(receiverResult.deviceToken, message);
                                                         } else {
                                                             console.log("Something wrong!!!!")
                                                         }
                                                     }
                                                 } else {
                                                     console.log("no deviceToken")
                                                 }
                                                 if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
                                                 console.log("Followed==>")
                                                 res.send({
                                                     result: result,
                                                     responseCode: 200,
                                                     responseMessage: i18n.__("Followed")
                                                 });
                                             })
                                         }
                                     })
                                 })
                             } else {
                                 var date = new Date();
                                 if (result1.followerStatus == "reject" || result1.followerStatus == "unfollow" || result1.followerStatus == "unblock" || result1.followerStatus == "cancel") {
                                     followerList.findOneAndUpdate({ _id: result1._id }, { $set: { followerStatus: "Sent", receiverId: req.body.receiverId, senderId: req.body.senderId, updatedAt: date } }, { new: true }).exec(function(err, result2) {
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
                                         responseMessage: i18n.__("You have already blocked this user")
                                     });
                                 } else {
                                    console.log("Followed==>")
                                     res.send({
                                         responseCode: 202,
                                         responseMessage: i18n.__("You have already send request")
                                     });
                                 }
                             }
                         }
                     })
})
                 }
             })

         } else if (req.body.follow == "unfollow") {
             var date = new Date();
             followerList.findOne({ $and: [{ senderId: req.body.receiverId }, { receiverId: req.body.senderId }] }).exec(function(err, userResult) {
                 if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (userResult.followerStatus == "block") { res.send({ responseCode: 201, responseMessage: i18n.__('You can not unfollow this user as you have blocked this user') }) } else {
                     followerList.update({ $or: [{ $and: [{ senderId: req.body.senderId }, { receiverId: req.body.receiverId }] }] }, { $set: { followerStatus: "unfollow", updatedAt: date } }, { multi: true }).exec(function(err, result) {
                         if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {

                             followerList.update({ $or: [{ $and: [{ senderId: req.body.receiverId }, { receiverId: req.body.senderId }] }] }, { $set: { followerStatus: "unfollow", updatedAt: date } }, { multi: true }).exec(function(err, result2) {
                                 if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {

                                     User.findOneAndUpdate({ _id: req.body.receiverId }, { $pop: { userFollowers: -req.body.senderId } }, { new: true }).exec(function(err, receiverResult) {
                                         if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }) } else if (!receiverResult) { res.send({ responseCode: 404, responseMessage: "No user found" }); } else {

                                             User.findOneAndUpdate({ _id: req.body.senderId }, { $pop: { userFollowers: -req.body.receiverId } }, { new: true }).exec(function(err, senderResult) {
                                                 if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }) } else if (!senderResult) { res.send({ responseCode: 404, responseMessage: "No user found" }); } else {
                                                     res.send({
                                                         result: receiverResult,
                                                         responseCode: 200,
                                                         responseMessage: i18n.__("Unfollowed")
                                                     });
                                                 }
                                             })
                                         }
                                     })
                                 }
                             })
                         }
                     })
                 }
             })
         } else if (req.body.follow == "cancel") {
             var date = new Date();
             followerList.findOneAndUpdate({ $and: [{ senderId: req.body.senderId }, { receiverId: req.body.receiverId }] }, {
                 $set: { followerStatus: "cancel", updatedAt: date }
             }, { new: true }).exec(function(err, result) {
                 if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                     res.send({
                         result: result,
                         responseCode: 200,
                         responseMessage: i18n.__("Request cancel successfully")
                     });
                 }
             })
         }
     },

     // show list of request send
     "followerRequestSend": function(req, res) {
        // console.log("followerRequestSend--->>>", req.body)
         followerList.find({ senderId: req.body.senderId }).sort({ updatedAt: -1 }).exec(function(err, result) {
             i18n = new i18n_module(req.body.lang, configs.langFile);
             if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else {
                 var arr = [];
                 var status_obj = {};
                 //                 result.forEach(function(result) {
                 //                     arr.unshift(result.receiverId);
                 //                     status_obj[result.receiverId] = result.followerStatus;
                 //                 })

                 async.forEachOfLimit(result, 1, function(value, key, callback) {
                 //    console.log("followerRequestSend-->>", value)  
                     arr.push(value.receiverId);
                     status_obj[value.userId] = value.followerStatus;
                     callback();
                 }, function(err) {
                 });
                 User.find({ _id: { $in: arr } }).lean().exec(function(err, newResult) {
                     for (var i = 0; i < newResult.length; i++) {
                         var receiverId_Id = newResult[i]._id;
                         newResult[i].followerStatus = status_obj[receiverId_Id];;
                     }
                     newResult.sort((a, b) => arr.findIndex(id => a._id.equals(id)) -
                         arr.findIndex(id => b._id.equals(id)));
                     res.send({
                         result: newResult,
                         responseCode: 200,
                         responseMessage: i18n.__("Shown list all followers")
                     });
                 })
             }
         })
     },

     // show list of req receive
     "followerRequestReceive": function(req, res) {
         i18n = new i18n_module(req.body.lang, configs.langFile);
         var viewerId = req.body.viewerId;
         if (req.body.viewerId == req.body.receiverId) {
             followerList.find({ receiverId: req.body.receiverId, followerStatus: { $ne: 'cancel' } }).sort({ updatedAt: -1 }).exec(function(err, result) {
                 if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else {
                     var arr = [];
                     var status_obj = {};
                     async.forEachOfLimit(result, 1, function(value, key, callback) {
                         //  console.log("value-->>", value)  
                         arr.push(value.senderId);
                         status_obj[value.senderId] = value.followerStatus;
                         callback();
                     }, function(err) {
                     });

                     //                     result.forEach(function(result) {
                     //                         arr.unshift(result.senderId);
                     //                         status_obj[result.senderId] = result.followerStatus;
                     //                     })
                     User.find({ _id: { $in: arr } }).lean().exec(function(err, newResult) {
                         for (var i = 0; i < newResult.length; i++) {
                             var sender_Id = newResult[i]._id;
                             newResult[i].followerStatus = status_obj[sender_Id];;
                         }
                         newResult.sort((a, b) => arr.findIndex(id => a._id.equals(id)) -
                             arr.findIndex(id => b._id.equals(id)));
                         res.send({
                             result: newResult,
                             responseCode: 200,
                             responseMessage: i18n.__("Shown list all followers request")
                         });
                     })
                 }
             })
         } else {
             User.findOne({ _id: req.body.receiverId }, function(err, result1) {
                 if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error12' }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: "No user found." }); } else if (result1.privacy.ViewFollower == "nobody") { res.send({ responseCode: 409, responseMessage: i18n.__("You cannot see follower of this user due to privacy policies") }) } else if (result1.privacy.ViewFollower == "onlyFollowers") {
                     var flag = result1.userFollowers.indexOf(req.body.viewerId)
                     console.log("flag-->>", flag)
                     if (flag == -1) { res.send({ responseCode: 400, responseMessage: i18n.__("You cannot see follower of this user due to privacy policies") }); } else {
                         followerList.find({ receiverId: req.body.receiverId, followerStatus: { $ne: 'cancel' } }).exec(function(err, result) {
                             if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                                 var arr = [];
                                 var status_obj = {};
                                 async.forEachOfLimit(result, 1, function(value, key, callback) {
                                     arr.push(value.senderId);
                                     status_obj[value.senderId] = value.followerStatus;
                                     callback();
                                 }, function(err) {
                                 });
                                 //                                 result.forEach(function(result) {
                                 //                                     arr.unshift(result.senderId);
                                 //                                     status_obj[result.senderId] = result.followerStatus;
                                 //                                 })
                                 User.find({ _id: { $in: arr } }).lean().exec(function(err, newResult) {
                                     for (var i = 0; i < newResult.length; i++) {
                                         // newResult[i].followerStatus = result[i].followerStatus;
                                         var sender_Id = newResult[i]._id;
                                         newResult[i].followerStatus = status_obj[sender_Id];
                                     }
                                     newResult.sort((a, b) => arr.findIndex(id => a._id.equals(id)) -
                                         arr.findIndex(id => b._id.equals(id)));
                                     res.send({
                                         result: newResult,
                                         responseCode: 200,
                                         responseMessage: i18n.__("Shown list all followers request")
                                     });
                                 })
                             }
                         })

                     }

                 } else {
                     followerList.find({ receiverId: req.body.receiverId, followerStatus: { $ne: 'cancel' } }).exec(function(err, result) {
                         if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                             var arr = [];
                             var status_obj = {};
                             async.forEachOfLimit(result, 1, function(value, key, callback) {
                                 arr.push(value.senderId);
                                 status_obj[value.senderId] = value.followerStatus;
                                 callback();
                             }, function(err) {
                             });
                             //                             result.forEach(function(result) {
                             //                                 arr.unshift(result.senderId);
                             //                                 status_obj[result.senderId] = result.followerStatus;
                             //                             })
                             User.find({ _id: { $in: arr } }).lean().exec(function(err, newResult) {
                                 for (var i = 0; i < newResult.length; i++) {
                                     //  newResult[i].followerStatus = result[i].followerStatus;
                                     var sender_Id = newResult[i]._id;
                                     newResult[i].followerStatus = status_obj[sender_Id];;
                                 }
                                 newResult.sort((a, b) => arr.findIndex(id => a._id.equals(id)) -
                                     arr.findIndex(id => b._id.equals(id)));
                                 res.send({
                                     result: newResult,
                                     responseCode: 200,
                                     responseMessage: i18n.__("Shown list all followers request")
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
         i18n = new i18n_module(req.body.lang, configs.langFile);
         var date = new Date();
         if (req.body.followerStatus == "accept") {
             console.log("in")
             followerList.findOneAndUpdate({ $and: [{ senderId: req.body.senderId }, { receiverId: req.body.receiverId }] }, { $set: { followerStatus: req.body.followerStatus, userId: req.body.userId, updatedAt: date } }, { new: true }).exec(function(err, results) {
                 if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }) } else {

                     followerList.findOne({ $and: [{ senderId: req.body.receiverId }, { receiverId: req.body.senderId }] }, function(err, followerResult) {
                         if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }) }
                         if (!followerResult) {
                             var obj = {
                                 receiverId: req.body.senderId,
                                 senderId: req.body.receiverId,
                                 followerStatus: "accept",
                                 userId: req.body.senderId
                             }
                             var follow = new followerList(obj);
                             follow.save(function(err, receiverResult) {
                                 if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }) } else {
                                     User.findOneAndUpdate({ _id: req.body.receiverId }, { $push: { userFollowers: req.body.senderId } }, { new: true }).exec(function(err, result) {
                                         if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }) } else if (!result) { res.send({ responseCode: 404, responseMessage: "No user found" }); } else {

                                             User.findOneAndUpdate({ _id: req.body.senderId }, { $push: { userFollowers: req.body.receiverId } }, { new: true }).exec(function(err, result1) {
                                                 if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }) } else if (!result1) { res.send({ responseCode: 404, responseMessage: "No user found" }); } else {
                                                     res.send({
                                                         result: results,
                                                         responseCode: 200,
                                                         responseMessage: i18n.__("Accepted successfully")
                                                     });
                                                 }
                                             })
                                         }
                                     })
                                 }
                             })
                         } else {

                             followerList.findOneAndUpdate({ _id: followerResult._id }, { $set: { followerStatus: "accept", receiverId: req.body.senderId, senderId: req.body.receiverId, updatedAt: date } }, { new: true }).exec(function(err, userResult) {
                                 if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else {

                                     User.findOneAndUpdate({ _id: req.body.receiverId }, { $push: { userFollowers: req.body.senderId } }, { new: true }).exec(function(err, result) {
                                         if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }) } else if (!result) { res.send({ responseCode: 404, responseMessage: "No user found" }); } else {

                                             User.findOneAndUpdate({ _id: req.body.senderId }, { $push: { userFollowers: req.body.receiverId } }, { new: true }).exec(function(err, result1) {
                                                 if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }) } else if (!result1) { res.send({ responseCode: 404, responseMessage: "No user found" }); } else {
                                                     res.send({
                                                         result: results,
                                                         responseCode: 200,
                                                         responseMessage: i18n.__("Accepted successfully")
                                                     });
                                                 }
                                             })
                                         }
                                     })

                                 }
                             })
                         }
                     })
                 }
             })
         } else if (req.body.followerStatus == "block") {
             //    console.log("block request----->>", req.body)
             var date = new Date();
             waterfall([
                 function(callabck) {
                     console.log("in first")
                     var blockUserId = req.body.blockUserId;
                     var flag;
                     User.findOne({ _id: req.body.receiverId }).exec(function(err, user) {
                         if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }) } else if (!user) { res.send({ responseCode: 404, responseMessage: "Please enter correct receiverId" }); } else {
                             var flag = user.blockUser.indexOf(req.body.blockUserId);
                             if (flag != -1) { res.send({ responseCode: 401, responseMessage: i18n.__("You have already blocked this user") }); } else {
                                 callabck(null)
                             }
                         }
                     })
                 },
                 function(callback) {
                     console.log("in second")
                     var blockUserId = req.body.blockUserId;
                     var flag;
                     var date = new Date();
                     followerList.findOneAndUpdate({ $and: [{ senderId: req.body.senderId }, { receiverId: req.body.receiverId }] }, { $set: { followerStatus: req.body.followerStatus, userId: req.body.userId, blockUserId: req.body.blockUserId, updatedAt: date } }, { new: true }).exec(function(err, results) {
                         if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }) } else {
                             callback(null)
                         }
                     })
                 },
                 function(callback) {
                      console.log("in third")
                     var date = new Date();
                     followerList.findOne({ $and: [{ senderId: req.body.receiverId }, { receiverId: req.body.senderId }] }, function(err, senderResult) {
                         //      console.log("*+*+*+*+*+*+*****+*+*+*+*++*+*+*--->>>")
                         //     console.log("senderResult--->>>", senderResult)
                         if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }) } else if (senderResult) {
                             followerList.findOneAndUpdate({ $and: [{ senderId: req.body.receiverId }, { receiverId: req.body.senderId }] }, { $set: { followerStatus: "cancel", updatedAt: date } }, { new: true }).exec(function(err, senderResult2) {
                                 if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }) } else {
                                     callback(null)
                                 }
                             })
                         } else {
                             callback(null)
                         }
                     })
                 },
                 function(callback) {
                     console.log("in forth")
                     createNewPage.find({ userId: req.body.receiverId }).exec(function(err, pageresult) {
                         console.log("pageresult--->>>",JSON.stringify(pageresult))
                         if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }); } else if (pageresult.length == 0) { callback(null, '') } else {
                             var pageIds = [];
                             for (var i = 0; i < pageresult.length; i++) {
                                 pageIds.push(pageresult[i]._id)
                             }
                             console.log("pageIds--->>>>", pageIds)
                             callback(null, pageIds)
                         }
                     })
                 },
                 function(pageIds, callback) {
                        console.log("in fifth")
                      console.log("pageIds-2-->>>>", pageIds)
                      console.log("pageIds.length -2-->>>>", pageIds.length )
                     var couponIds = [];
                     if (pageIds.length > 0 && pageIds.length != null) {
                          console.log("in if-->>>>")
                         User.aggregate({ $unwind: '$coupon' }, { $match: { _id: new mongoose.Types.ObjectId(req.body.senderId), 'coupon.status': 'ACTIVE' } }, function(err, user1) {
                             if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }); } else if (user1.length == 0) { callback(null,'') } else {
                                        console.log("json . stringify  user1 -->>>", JSON.stringify(user1))
                                 for (var i = 0; i < user1.length; i++) {
                                     couponIds.push(user1[i].coupon._id)
                                 }
                                 console.log("couponIds---->>>>",couponIds)
                                 callback(null, couponIds)
                             }
                         })
                     } else {
                         console.log("in else-->>>>")
                         callback(null,'')
                     }
                 },
                 function(userdata, callback) {
                     console.log("userdata---->>>>", userdata)
                     if (userdata.length > 0 && userdata.length != null) {
                         for (var j = 0; j < userdata.length; j++) {
                             //   console.log("userdata---->>>>",userdata[j])                              
                             User.update({ 'coupon._id': new mongoose.Types.ObjectId(userdata[j]) }, { $set: { 'coupon.$.status': "REMOVED" } }, { new: true }, function(err, userArrayResult) {
                                 console.log("userArrayResult---->>>>", userArrayResult)
                                 if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 56' }); } else {
                                     console.log("done user")
                                 }
                             })
                         }
                         callback(null)

                     } else {
                         callback(null)
                     }
                 },
                 function(callback) {
                     console.log("<<in third-->>")
                     User.findOneAndUpdate({ _id: req.body.receiverId }, { $push: { blockUser: req.body.blockUserId } }, { new: true }, function(err, result1) {
                         if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: "No ad found." }); } else {
                             callback(null, result1)
                         }
                     })

                 },
             ], function(err, result) {
                 res.send({
                     result: result,
                     responseCode: 200,
                     responseMessage: i18n.__("Successfully blocked this user")
                 });
             })
         } else if (req.body.followerStatus == "reject") {
             //     console.log("req-->>", req.body)
             var date = new Date();
             followerList.findOneAndUpdate({ $and: [{ senderId: req.body.senderId }, { receiverId: req.body.receiverId }] }, { $set: { followerStatus: req.body.followerStatus, updatedAt: date } }, { new: true }).exec(function(err, results) {
                 //  console.log("results-->>", results)
                 if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }) } else {
                     res.send({
                         result: results,
                         responseCode: 200,
                         responseMessage: i18n.__("You have rejected this user")
                     });
                 }
             })
         } else if (req.body.followerStatus == "unblock") {
             waterfall([
                 function(callback) {
                     var date = new Date();
                     User.findOne({ _id: req.body.receiverId }).exec(function(err, receiverResult) {
                         if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }) } else if (!receiverResult) { res.send({ responseCode: 404, responseMessage: 'Please enter correct receiverId' }) } else {
                             var flag = receiverResult.userFollowers.indexOf(req.body.blockUserId);
                             console.log("flag---->>>>", flag)
                             if (flag != -1) {
                                 followerList.findOneAndUpdate({ $and: [{ userId: req.body.userId }, { blockUserId: req.body.blockUserId }] }, {
                                     $set: { followerStatus: "accept", updatedAt: date }
                                 }, { new: true }).exec(function(err, followerResult) {
                                     if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }) } else {
                                         User.findOneAndUpdate({ _id: req.body.receiverId }, { $pop: { blockUser: -req.body.blockUserId } }, { new: true }).exec(function(err, result) {
                                             if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }) } else if (!result) { res.send({ responseCode: 404, responseMessage: "No user found" }); } else {

                                                 followerList.findOne({ $and: [{ senderId: req.body.receiverId }, { receiverId: req.body.senderId }] }, function(err, senderResult) {
                                                     if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }) } else if (senderResult) {
                                                         followerList.findOneAndUpdate({ $and: [{ senderId: req.body.receiverId }, { receiverId: req.body.senderId }] }, { $set: { followerStatus: "accept", updatedAt: date } }, { new: true }).exec(function(err, senderResult2) {
                                                             if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }) } else {
                                                                 //         console.log("senderResult2--->>>", senderResult2)
                                                                 callback(null, result)

                                                             }
                                                         })
                                                     } else {
                                                         callback(null, result)
                                                     }

                                                 })


                                             }
                                         })

                                     }
                                 })

                             } else {
                                 var date = new Date();
                                 followerList.findOneAndUpdate({ $and: [{ userId: req.body.userId }, { blockUserId: req.body.blockUserId }] }, {
                                     $set: { followerStatus: req.body.followerStatus, updatedAt: date }
                                 }, { new: true }).exec(function(err, results) {
                                     if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }) } else {

                                         User.findOneAndUpdate({ _id: req.body.receiverId }, { $pop: { blockUser: -req.body.blockUserId } }, { new: true }).exec(function(err, result) {
                                             if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }) } else if (!result) { res.send({ responseCode: 404, responseMessage: "No user found" }); } else {
                                                 callback(null, results)
                                             }
                                         })

                                     }
                                 })
                             }

                         }
                     })

                 },

             ], function(err, result) {
                 res.send({
                     result: result,
                     responseCode: 200,
                     responseMessage: i18n.__("Successfully unblock this user")
                 });
             })
         }
     },

     // show list of all block user
     "blockUserList": function(req, res) {
         i18n = new i18n_module(req.body.lang, configs.langFile);
         followerList.find({ userId: req.body.userId, followerStatus: "block" }).sort({ updatedAt: -1 }).exec(function(err, result) {
             if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else {
                 var arr = [];
                 async.forEachOfLimit(result, 1, function(value, key, callback) {
                     arr.push(value.blockUserId)
                     callback();
                 }, function(err) {
                 });

                 //                 result.forEach(function(result) {
                 //                     arr.push(result.blockUserId)
                 //                 })
                 User.find({ _id: { $in: arr } }).lean().exec(function(err, newResult) {
                     for (var i = 0; i < newResult.length; i++) {
                         newResult[i].followerStatus = result[i].followerStatus;
                     }
                     newResult.sort((a, b) => arr.findIndex(id => a._id.equals(id)) -
                         arr.findIndex(id => b._id.equals(id)));
                      //   console.log('blockUserList---newResult>>',JSON.stringify(newResult))
                     res.send({
                         result: newResult,
                         responseCode: 200,
                         responseMessage: i18n.__("Shown list all block users")
                     });
                 })
             }
         })
     },

     // api to block leader
     "blockLeader": function(req, res) {
         i18n = new i18n_module(req.body.lang, configs.langFile);
         waterfall([
             function(callback) {
                 var date = new Date();
                 var blockUserId = req.body.blockUserId;
                 User.findOne({ _id: req.body.receiverId }).exec(function(err, user) {
                     if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }) } else if (!user) { res.send({ responseCode: 404, responseMessage: "Please enter correct userId" }); } else {
                         var flag = user.blockUser.indexOf(req.body.blockUserId)
                         console.log(" block follower flag --->>>", flag)
                         if (flag != -1) { res.send({ responseCode: 400, responseMessage: i18n.__("You have already blocked this user.") }); } else {
                             callback(null)
                         }
                     }
                 })
             },
             function(callabck) {
                 var blockUserId = req.body.blockUserId;
                 var date = new Date();
                 followerList.findOneAndUpdate({ $and: [{ senderId: req.body.senderId }, { receiverId: req.body.receiverId }] }, { $set: { followerStatus: req.body.followerStatus, userId: req.body.userId, blockUserId: req.body.blockUserId, updatedAt: date } }, { new: true }).exec(function(err, results) {
                     if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }) } else {
                         callabck(null)
                     }
                 })
             },
             function(callback) {
                 var blockUserId = req.body.blockUserId;
                 var date = new Date();
                 followerList.findOne({ $and: [{ senderId: req.body.receiverId }, { receiverId: req.body.senderId }] }, function(err, senderResult) {
                     if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }) } else if (senderResult) {
                         followerList.findOneAndUpdate({ $and: [{ senderId: req.body.receiverId }, { receiverId: req.body.senderId }] }, { $set: { followerStatus: "cancel", updatedAt: date } }, { new: true }).exec(function(err, senderResult2) {
                             if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }) } else {
                                 callback(null)
                             }
                         })
                     } else {
                         callback(null)
                     }
                 })
             },
             function(callback) {
                 User.findOneAndUpdate({ _id: req.body.receiverId }, { $push: { blockUser: req.body.blockUserId } }, { new: true }, function(err, result1) {
                     if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: "No ad found." }); } else {
                         callback(null, result1)

                     }
                 })
             },
         ], function(err, result) {
             res.send({
                 result: result,
                 responseCode: 200,
                 responseMessage: i18n.__("Successfully blocked this user")
             });
         })

     }


 }