 var express = require('express');
 var app = express();
 var mongoose = require('mongoose');
 var jwt = require('jsonwebtoken');
 var nodemailer = require('nodemailer');
 var cloudinary = require('cloudinary');
 var config = require('./config');
 var bodyParser = require("body-parser");
 var User = require("./model/user");
 var createNewPage = require("./model/createNewPage");
 var cashBrolixSchema = require("./model/sendAndReceiveCashBrolix");
 var chat = require("./model/chat");
 var createEvents = require("./model/createEvents");
 var createNewAds = require("./model/createNewAds");
 var reportProblem = require("./model/reportProblem");
 var paypalPayment = require("./model/payment");
 var waterfall = require('async-waterfall');
 var multiparty = require('multiparty');
 var cc = require('coupon-code');
 var voucher_codes = require('voucher-code-generator');
 var paypal = require('paypal-rest-sdk');

 cloudinary.config({
     cloud_name: 'mobiloitte-in',
     api_key: '188884977577618',
     api_secret: 'MKOCQ4Dl6uqWNwUjizZLzsxCumE'
 });

 paypal.configure({
     'host': 'api.sandbox.paypal.com',
     'mode': 'sandbox', //sandbox or live
     'client_id': 'AUPnCDpK4dzzqAaNNHrw4bYxkjG0SDWGislalh5-6T1sx2XYn7ZpwX3D1-QO5snuG339SDV3esPyKbBq',
     'client_secret': 'EEaa_8sOwZ9aond0Dta5zNA_xE40zsv-VaUudN3jARkKEMhGBvEXBdu4f29b-TJ0KZ5oq2vZOr-8sFHt'
 });

 var avoid = {
     "password": 0
 }


 var https = require('https');
 var http = require('http');
 mongoose.connect('mongodb://localhost/brolix');

 function otp(req, res, mobile) {
     var otp = Math.floor(Math.random() * 10000)
     var data = JSON.stringify({
         api_key: '71414445',
         api_secret: '49e5f9fe2864877f',
         to: '+91' + mobile,
         from: '+917417773034',
         text: 'You have been registerd ' + otp + ' OTP'
     });
     var options = {
         host: 'rest.nexmo.com',
         path: '/sms/json',
         method: 'POST',
         headers: {
             'Content-Type': 'application/json',
             'Content-Length': Buffer.byteLength(data)
         }
     };
     var request = https.request(options);
     request.write(data);
     request.end();
     return otp;
     console.log("-------Your OTP------" + otp)
 }

 function mail(email, massege, otp) {
     var transporter = nodemailer.createTransport({
         service: 'Gmail',
         auth: {
             user: "dixitjorden@gmail.com",
             pass: "8090404689"
         }
     });
     var to = email
     var mailOption = {
         from: "testing.mobiloitte@gmail.com",
         to: email,
         subject: 'Brolix',
         text: 'you have a new submission with following details',
         html: massege + "-" + otp
             // "Your otp is :"
     }
     console.log("data in req" + email);
     console.log("Dta in mailOption : " + JSON.stringify(mailOption));
     transporter.sendMail(mailOption, function(error, info) {
         if (error) {
             console.log("internal server error");
         }

     });

 }

 module.exports = {

     //API for user signUP
     "signup": function(req, res) {
         User.findOne({
             email: req.body.email
         }, function(err, result) {
             if (err) throw err;
             else if (result) {
                 res.send({
                     responseCode: 302,
                     responseMessage: "Email id must be unique."
                 });
             } else {
                 req.body.otp = otp();
                 var user = User(req.body)
                 user.save(function(err, result) {
                     if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
                     var token = jwt.sign(!result, config.secreteKey);
                     res.header({
                         "appToken": token
                     }).send({
                         result: result,
                         token: token,
                         responseCode: 200,
                         responseMessage: "You have been registered successfully."
                     });
                 })
             }
         })
     },

     //API for verify Otp
     "verifyOtp": function(req, res, next) {
         User.findOne({ _id: req.body.userId, otp: req.body.otp }).exec(function(err, results) {
             if (!results) {
                 res.send({
                     responseCode: 404,
                     responseMessage: 'Please enter correct otp.'
                 });
             } else {
                 User.findByIdAndUpdate(req.body.userId, {
                     $set: {
                         status: "ACTIVE"
                     }
                 }, { new: true }).exec(function(err, user) {
                     res.send({
                         responseCode: 200,
                         responseMessage: 'Otp verified successfully.',
                         result: user
                     });
                 });
             }
         });
     },

     //API for user Login
     "login": function(req, res) {
         User.findOne({
             email: req.body.email,
             password: req.body.password
         }, avoid).exec(function(err, result) {
             if (err) throw err;
             if (!result) {
                 return res.send({
                     responseCode: 404,
                     responseMessage: "Sorry Your Id or Password is Incorrect."
                 });
             } else {
                 var token = jwt.sign(!result, config.secreteKey);
                 res.header({
                     "appToken": token
                 }).send({
                     result: result,
                     token: token,
                     responseCode: 200,
                     responseMessage: "Login successfully."
                 });
                 console.log("what is in token-->>>" + token);
             }
         })
     },
     //API for Edit Profile
     "editProfile": function(req, res) {
         var otp1;
         var sendEmail = "",
             sendMobileOtp = "";
         User.findOne({
             _id: req.params.id
         }, function(err, data) {
             if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                 var sendEmail = (!req.body.email) ? "false" : (data.email == req.body.email) ? "exitEmail" : "true";
                 var sendMobileOtp = (req.body.mobileNumber && Boolean(sendEmail)) ? (data.mobileNumber == req.body.mobileNumber) ? "exitMobile" : "true" : "false";
                 if (sendEmail == "exitEmail") return res.status(403).send({
                     responseMessage: "This email is already register"
                 })
                 if (sendMobileOtp == "exitMobile") return res.status(403).send({
                     responseMessage: "This mobile number is already register"
                 })
                 otp1 = sendMobileOtp == "true" ? otp(req.body.mobileNumber) : otp();
                 if (sendEmail == "true") {
                     var massege = "Your otp is :"
                     mail(req.body.email, massege, otp1);
                 }
                 if (sendMobileOtp == "exitMobile") {
                     req.body.otp = otp1;
                     req.body.status = "inActive";
                 }
                 if (Boolean(req.body.image) || Boolean(req.body.coverImage)) {
                     var img_base64 = Boolean(req.body.image) == true ? req.body.image : req.body.coverImage;
                     binaryData = new Buffer(img_base64, 'base64');
                     require("fs").writeFile("test.jpeg", binaryData, "binary", function(err) {
                         console.log(err);
                     });
                     cloudinary.uploader.upload("test.jpeg", function(result) {
                         console.log("new url-->" + JSON.stringify(result));
                         Boolean(req.body.image) == true ? (req.body.image = result.url) : (req.body.coverImage = result.url);
                         User.findByIdAndUpdate(req.params.id, req.body, {
                             new: true
                         }).exec(function(err, result) {
                             if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
                             res.send({
                                 result: result,
                                 responseCode: 200,
                                 responseMessage: "Profile updated successfully."
                             });
                         });

                     });
                 } else {
                     User.findByIdAndUpdate(req.params.id, req.body, {
                         new: true
                     }).exec(function(err, result) {
                         if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
                         res.send({
                             result: result,
                             responseCode: 200,
                             responseMessage: "Profile updated successfully."
                         });
                     });

                 }
             }
         })

     },

     //API for user Details
     "allUserDetails": function(req, res) {
         User.find({ type: 'USER' }, avoid).exec(function(err, result) {
             if (err) throw err;
             res.send({
                 result: result,
                 responseCode: 200,
                 responseMessage: "Show data successfully."
             });
         })
     },
     //API for user Details
     "listOfAllAdvertiser": function(req, res) {
         User.find({ type: 'Advertiser' }, avoid).exec(function(err, result) {
             if (err) throw err;
             res.send({
                 result: result,
                 responseCode: 200,
                 responseMessage: "Show data successfully."
             });
         })
     },
     //API for user Profile
     "detailsOfAdvertiser": function(req, res) {
         User.findOne({ _id: req.params.id }, avoid).exec(function(err, result) {
             if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
             res.send({
                 result: result,
                 responseCode: 200,
                 responseMessage: "Profile data show successfully."
             });
         })
     },

     //API for user Profile
     "userProfile": function(req, res) {
         User.findOne({ _id: req.body.userId }, avoid).exec(function(err, result) {
             if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
             res.send({
                 result: result,
                 responseCode: 200,
                 responseMessage: "Profile data show successfully."
             });
         })
     },


     //API for Forgot Password
     "forgotPassword": function(req, res, next) {
         User.findOne({ email: req.body.email }).exec(function(err, user) {
             if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
             if (!user) {
                 res.send({
                     responseCode: 404,
                     responseMessage: 'Email id does not exists.',
                 });
             } else {
                 var transporter = nodemailer.createTransport({
                     service: 'Gmail',
                     auth: {
                         user: "dixitjorden@gmail.com",
                         pass: "8090404689"
                     }
                 });
                 var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                 var link = "";
                 for (var i = 0; i < 8; i++) link += possible.charAt(Math.floor(Math.random() * possible.length));
                 var to = req.body.email
                 var mailOption = {
                     from: "testing.mobiloitte@gmail.com",
                     to: req.body.email,
                     subject: 'Brolix Change Password ',
                     text: 'you have a new submission with following details',
                     html: "Your current Password is :" + link
                 }
                 console.log("data in req" + req.body.email);
                 console.log("Dta in mailOption : " + JSON.stringify(mailOption));
                 transporter.sendMail(mailOption, function(error, info) {
                     if (error) {
                         res.send({
                             responseCode: 400,
                             responseMessage: 'Internal server error.'
                         })
                     } else {
                         console.log("updated password is : " + link);
                         User.findOneAndUpdate({ email: req.body.email }, {
                             $set: {
                                 password: link
                             }
                         }, function(err, results) {
                             if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
                             res.send({
                                 responseCode: 200,
                                 responseMessage: 'Password successfully sent your mail id.'
                             })
                         })
                     }
                 });
             }
         });
     },

     //API for Change Password
     "changePassword": function(req, res) {
         User.findByIdAndUpdate(req.params.id, req.body, {
             new: true
         }).exec(function(err, result) {
             if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
             res.send({
                 result: result,
                 responseCode: 200,
                 responseMessage: "Password updated successfully."
             });
         });
     },



     //API for create Page
     "createPage": function(req, res) {
         var page = new createNewPage(req.body);
         page.save(function(err, result) {
             if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                 User.findByIdAndUpdate({ _id: req.body.userId }, {
                     $set: {
                         type: "Advertiser"
                     }
                 }, { new: true }).exec(function(err, result) {})
                 res.send({
                     result: result,
                     responseCode: 200,
                     responseMessage: "Page create successfully."
                 });
             }
         })
     },

     //API for create Page
     "showAllPages": function(req, res) {
         createNewPage.find({}).exec(function(err, result) {
             if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
             res.send({
                 result: result,
                 responseCode: 200,
                 responseMessage: "All pages show successfully."
             })
         })
     },

     //API for create Page
     "showPageDetails": function(req, res) {
         createNewPage.findOne({ _id: req.body.pageId }).exec(function(err, result) {
             if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
             res.send({
                 result: result,
                 responseCode: 200,
                 responseMessage: "Pages details show successfully."
             })
         })
     },

     // Api for create Ads
     "createAds": function(req, res) {
         if (req.body.adsType == "coupon") {
             var couponCode = voucher_codes.generate({ length: 6, count: 1, charset: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" });
             req.body.couponCode = couponCode;
             // var binaryData = req.body.image;
             // binaryData = new Buffer(req.body.image,'base64','multipart');
             if (Boolean(req.body.image) || Boolean(req.body.video)) {
                 var img_base64 = Boolean(req.body.image) == true ? req.body.image : req.body.video;
                 binaryData = new Buffer(img_base64, 'base64');
                 require("fs").writeFile("test.jpeg", binaryData, "binary", function(err) {
                     console.log(err);
                 });
                 cloudinary.uploader.upload("test.jpeg", function(result) {
                     console.log("new url-->" + JSON.stringify(result));
                     Boolean(req.body.image) == true ? (req.body.image = result.url) : (req.body.video = result.url);
                     req.body.image = result.url;
                     var Ads = new createNewAds(req.body);
                     Ads.save(function(err, result) {
                         if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
                         res.send({ result: result, responseCode: 200, responseMessage: "Ad created successfully" });
                     })
                 })

             } else {
                 var Ads = new createNewAds(req.body);
                 Ads.save(function(err, result) {
                     if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
                     res.send({ result: result, responseCode: 200, responseMessage: "Ad created successfully" });
                 })
             }
         }


     },

     //API for Apply Coupon
     "applyCoupon": function(req, res) {
         createNewAds.findByIdAndUpdate(req.params.id, req.body, {
             new: true
         }).exec(function(err, result) {
             if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
             res.send({
                 result: result,
                 responseCode: 200,
                 responseMessage: "Coupon apply successfully."
             });
         });
     },

     // // Api for create Ads
     // "createAds": function(req, res) {
     //     waterfall([
     //         function(callback) {
     //             var form = new multiparty.Form();
     //             form.multiples = true;
     //             form.parse(req, function(err, fields, files) {
     //                 var fileUrl = [];
     //                 console.log("files---->>>" + JSON.stringify(files));
     //                 for (var i = 0; i < files.file.length; i++) {
     //                     var filePath = files.file[i].path;
     //                     cloudinary.uploader.upload(filePath, function(result) {
     //                         console.log("result---->>>>", result)
     //                         fileUrl.push(result.url);
     //                         console.log("urls--=-=-=-=-=-=-=-=-=-=-=->>>" + JSON.stringify(fileUrl));
     //                         console.log("image" + Boolean(files.file));
     //                         var fileUrl1 = result.url;
     //                         var extension = fileUrl1.split('.').pop();
     //                         console.log(extension, extension === 'jpg');
     //                         if (extension === 'mp4') req.body.video = result.url;
     //                         else req.body.image = result.url;

     //                         var Ads = new createNewAds(req.body);
     //                         Ads.save(function(err, result1) {
     //                             if (err) { res.send({responseCode:409,responseMessage:'Internal server error'});}
     //                             else callback(null, result1)
     //                         })

     //                     }, { resource_type: "auto" });
     //                 }
     //             })
     //         }
     //     ], function(err, result) {
     //        if (err) { res.send({responseCode:409,responseMessage:'Internal server error'});}
     //         console.log("result--------->>>>" + JSON.stringify(result))
     //         res.send({
     //             result: result,
     //             responseCode: 200,
     //             responseMessage: "Ad created successfully"
     //         });
     //     })
     // },

     // show all ads
     "showAllAdsData": function(req, res) {
         createNewAds.find({}).exec(function(err, result) {
             if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
             res.send({
                 result: result,
                 responseCode: 200,
                 responseMessage: "Data Show successfully"
             })
         })
     },

     "followUnfollow": function(req, res) {
         if (req.body.follow == "follow") {
             User.findOneAndUpdate({
                 _id: req.body.userId
             }, {
                 $push: { "followers": { senderId: req.body.senderId, senderName: req.body.senderName } }
             }, {
                 new: true
             }).exec(function(err, results) {
                 if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
                 res.send({
                     results: results,
                     responseCode: 200,
                     responseMessage: "Followed"
                 });
             })
         } else {
             User.findOneAndUpdate({
                 _id: req.body.userId
             }, {
                 $pop: { "followers": { senderId: req.body.senderId } }
             }, {
                 new: true
             }).exec(function(err, results) {
                 if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                     res.send({
                         results: results,
                         responseCode: 200,
                         responseMessage: "Unfollowed"
                     });
                 }
             })
         }
     },

     "followerList": function(req, res) {
         User.find({ _id: req.body.userId }).exec(function(err, results) {
             if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                 var arr = [];
                 results[0].followers.forEach(function(result) {
                     arr.push(result.senderId)
                 })
                 User.find({ _id: { $in: arr } }).exec(function(err, newResult) {
                     for (var i = 0; i < newResult.length; i++) {
                         var obj = {};
                         obj.followStatus = results[0].followers[i].FollowStatus;
                         console.log(obj);
                         obj.result = newResult[i];
                         newResult[i] = obj;
                     }
                     res.send({
                         results: newResult,
                         responseCode: 200,
                         responseMessage: "Show list all followers."
                     });
                 })
             }
         })
     },

     "acceptFollowerRequest": function(req, res) {
         User.update({ _id: req.body.userId, 'followers.senderId': req.body.senderId }, {
             $set: {
                 'followers.$.FollowStatus': "Accepted"
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

     //API for Show Coupons Search
     "tagFriends": function(req, res) {
         console.log("req======>>>" + JSON.stringify(req.body))
         var re = new RegExp(req.body.search, 'i');

         User.aggregate([
             { $match: { _id: req.body.userId } }, {
                 $project: {
                     followers: {
                         $filter: {
                             input: '$followers',
                             as: 'item',
                             cond: { $elemMatch: ['$$item.FollowStatus', 'Accepted'] }
                         }
                     }
                 }
             }
         ]).exec(function(err, result) {
             if (err) { res.send({ responseCode: 409, responseMessage: err }); } else {
                 res.send({
                     responseCode: 200,
                     responseMessage: "Show Followers successfully.",
                     result: result
                 });
             }
         })
     },

     "videoCount": function(req, res) {
         User.findOne({ _id: req.body.userId, viewedAd: req.body.adId }, function(err, result) {
             if (err) res.status(500).send(err);
             else if (!result) {
                 createNewAds.findOneAndUpdate({ _id: req.body.adId }, {
                     $inc: { count: 1 }
                 }, function(err, data) {
                     if (err) res.status(500).send(err);
                     else {
                         User.findOneAndUpdate({ _id: req.body.userId }, {
                             $push: { viewedAd: req.body.adId }
                         }, function(err, user) {
                             res.status(200).send({ responseMessage: "success" });
                         })
                     }
                 })

             } else {
                 res.status(200).send({ responseMessage: "allready Watched" });
             }
         })

     },

     "raffleJoin": function(req, res) {
         console.log("request---->>>" + JSON.stringify(req.body));
         createNewAds.findOne({ _id: req.body.adId, raffleCount: req.body.userId }, function(err, result) {

             if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
             if (result) { res.status(200).send({ responseMessage: "allready watched" }); } else {
                 User.findOneAndUpdate({ _id: req.body.userId }, {
                     $inc: { brolix: 50 }
                 }, function(err, data) {
                     if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                         createNewAds.findOneAndUpdate({ _id: req.body.adId }, {
                             $push: { raffleCount: req.body.userId }
                         }, { new: true }).exec(function(err, user) {
                             var len = user.raffleCount.length;
                             if (len > 0) {
                                 console.log("length--->>>", user.raffleCount.length)
                                 if (len % 100 == 0) {
                                     var i = len - 1;
                                     createNewAds.findOneAndUpdate({ _id: req.body.adId }, {
                                         $push: { winners: user.raffleCount[i] }
                                     }, { new: true }).exec(function(err, result) {
                                         res.status(300).send({ responseMessage: "success", result: result });
                                     })
                                 } else {
                                     res.status(200).send({ responseMessage: "success", user: user });
                                 }
                             }
                         })
                     }
                 })
             }
         })
     },


     //API for Show Coupons Search
     "couponsSearch": function(req, res) {
         console.log("req======>>>" + JSON.stringify(req.body))
         var re = new RegExp(req.body.search, 'i');

         createNewAds.find({ status: 'ACTIVE' }).or([{ 'whoWillSeeYourAdd.country': { $regex: re } }, { 'whoWillSeeYourAdd.state': { $regex: re } }, { 'whoWillSeeYourAdd.city': { $regex: re } }]).sort({ country: -1 }).exec(function(err, result) {
             if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                 res.send({
                     responseCode: 200,
                     responseMessage: "Show coupons successfully.",
                     result: result
                 });
             }
         })
     },

     //API for Show Search
     "searchForCoupons": function(req, res) {
         var data = {
             'whoWillSeeYourAdd.country': req.body.country,
             'whoWillSeeYourAdd.state': req.body.state,
             'whoWillSeeYourAdd.city': req.body.city
         }
         for (var key in data) {
             if (data.hasOwnProperty(key)) {
                 if (data[key] == "" || data[key] == null || data[key] == undefined) {
                     delete data[key];
                 }
             }
         }
         createNewAds.find({ $and: [data] }).exec(function(err, results) {
             if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                 res.send({
                     results: results,
                     responseCode: 200,
                     responseMessage: "All Details Found"
                 })
             }
         })
     },

     //API for Like And Unlike
     "likeAndUnlike": function(req, res) {
         if (req.body.flag == "like") {
             createNewAds.findOneAndUpdate({
                 _id: req.body.adId
             }, {
                 $push: {
                     like: req.body.userId
                 }
             }, { new: true }).exec(function(err, results) {
                 if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                     res.send({
                         results: results,
                         responseCode: 200,
                         responseMessage: "Liked"
                     });
                 }
             })
         } else {
             createNewAds.findOneAndUpdate({
                 _id: req.body.adId
             }, {
                 $pop: {
                     like: req.body.userId
                 }
             }, { new: true }).exec(function(err, results) {
                 if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                     res.send({
                         results: results,
                         responseCode: 200,
                         responseMessage: "Unliked"
                     });
                 }
             })

         }

     },

     //API Report Problem
     "reportProblem": function(req, res) {
         var report = new reportProblem(req.body);
         report.save(function(err, result) {
             if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                 res.send({
                     results: result,
                     responseCode: 200,
                     responseMessage: "Report submitted successfully."
                 });
             }
         })
     },

     //API Comment on Ads
     "commentOnAds": function(req, res) {
         createNewAds.findOneAndUpdate({ _id: req.body.adId }, {
             $push: { "comments": { userId: req.body.userId, comment: req.body.comment } }
         }, { new: true }).exec(function(err, results) {
             if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                 res.send({
                     results: results,
                     responseCode: 200,
                     responseMessage: "Comments save with concerned User details."
                 });
             }
         })
     },
     //API Comment on Ads
     "replyOnComment": function(req, res) {
         console.log(req.body)
         createNewAds.findOneAndUpdate({ _id: req.body.adId, 'comments._id': req.body.commentId }, {
             $push: { 'comments.$.reply': { userId: req.body.userId, rplyComment: req.body.rplyComment } }
         }, { new: true }).exec(function(err, results) {
             if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                 res.send({
                     results: results,
                     responseCode: 200,
                     responseMessage: "Comments save successfully."
                 });
             }
         })
     },
     //API Comment on Ads
     "sendCoupon": function(req, res) {
         User.findOne({ _id: req.body.userId }, avoid).exec(function(err, result) {
             if (!result) {
                 res.send({
                     responseCode: 404,
                     responseMessage: 'User does not exists.'
                 });
             } else {
                 console.log(result.email)
                 var massege = "Coupon Code is:-"
                 mail(result.email, massege, req.body.couponCode);
                 res.send({
                     responseCode: 200,
                     responseMessage: "Send your coupon successfully."
                 });
             }
         })
     },

     //Exchange Coupons Api
     "exchangeCoupon": function(req, res) {
         User.findOne({ _id: req.body.senderId }).exec(function(err, result) {
             if (!result) {
                 res.send({
                     responseCode: 404,
                     responseMessage: 'User does not exists.'
                 });
             } else {
                 createNewAds.findByIdAndUpdate({ _id: req.body.adId }, { $push: { "couponExchange": { senderId: req.body.senderId, newCoupon: req.body.newCoupon, oldCoupon: req.body.oldCoupon, couponExchangeStatus: req.body.couponExchangeStatus } } }, { new: true }).exec(function(err, results) {
                     if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }) } else {
                         //mail(result.email, req.body.massege, req.body.couponCode);
                         res.send({
                             result: results,
                             responseCode: 200,
                             responseMessage: "Coupon exchange request sent successfully."
                         });
                     }
                 })

             }
         })

     },

     "acceptExchangeCouponRequest": function(req, res) {
         createNewAds.update({ _id: req.body.adId, 'couponExchange.senderId': req.body.senderId }, {
             $set: {
                 'couponExchange.$.couponExchangeStatus': "Accepted"
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

     "rating": function(req, res, next) {
         waterfall([

             function(callback) {
                 User.findOne({ _id: req.body.userId }).exec(function(err, result) {
                     var pre_book_rating = result.rating;
                     var count = result.review_count;

                     var xxx = pre_book_rating == "0" ? req.body.rating : (parseInt(req.body.rating) + parseInt(pre_book_rating)) / 2;
                     callback(null, pre_book_rating, count, xxx);
                     console.log("pre_book_rating count====>>>>" + count)
                 })
             },
             function(pre_book_rating, count, xxx, callback) {
                 User.findByIdAndUpdate(req.body.userId, {
                     $set: {
                         review_count: count + 1,
                         rating: xxx
                     }
                 }, {
                     new: true
                 }).exec(function(err, data) {
                     var update_rating = data.rating;
                     console.log("update_rating count====>>>>" + update_rating);
                     callback(null, update_rating);

                 })
             },
             function(update_rating, callback) {
                 console.log("After update_rating count====>>>>" + update_rating);
                 // console.log("After pre_book_rating count====>>>>"+pre_book_rating);
                 res.send({
                     responseCode: 200,
                     responseMessage: "Book rating updated.",
                     rating: update_rating
                 })
                 callback(null, "done");
             },
             function(err, results) {

             }

         ])

     },


     "luckCard": function(req, res) {
         var chances;
         var luckcard = req.body.brolix / 50;
         if (luckcard % 5 == 0) {
             chances = luckcard;
         }
         User.findOne({ _id: req.body.userId, }, function(err, result) {
             if (result.brolix < req.body.brolix) { res.send({ responseCode: 400, responseMessage: "Insufficient amount of brolix in your account" }); } else {
                 waterfall([
                     function(callback) {
                         createNewAds.findOne({ _id: req.body.adId }, function(err, data) {
                             if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                                 if (Boolean(data.luckCardListObject.find(luckCardListObject => luckCardListObject.userId == req.body.userId))) {
                                     return res.status(403).send({ responseMessage: "allready add luckCard" })
                                 } else callback(null, data)
                             }
                         })

                     },
                     function(data, callback) {
                         User.findOneAndUpdate({ _id: req.body.userId }, { $inc: { brolix: -req.body.brolix } }, { new: true }).exec(function(error, update) {
                             if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else callback(null, data)

                         })

                     },
                     function(data, callback) {
                         createNewAds.findByIdAndUpdate({ _id: req.body.adId }, { $push: { "luckCardListObject": { userId: req.body.userId, brolix: req.body.brolix, chances: chances } } }, { new: true }).exec(function(err, user) {
                             callback(null, user);
                         })

                     },
                     function(user, callback) {
                         var arr1 = user.raffleCount;

                         if (user.raffleCount.length < 100) return res.status(403).send({ responseMessage: "length minimum 100" });
                         else {
                             for (var i = 0; i < user.luckCardListObject.length; i++) {
                                 for (var j = 0; j < user.luckCardListObject[i].chances; j++) {
                                     arr1.push(user.luckCardListObject[i].userId);
                                 }
                             }
                             var randomIndex = Math.floor(Math.random() * arr1.length);
                             createNewAds.findOneAndUpdate({ _id: req.body.adId }, {
                                 $push: { winners: arr1[randomIndex] }
                             }, { new: true }).exec(function(err, result1) {
                                 if (err) return res.status(500).send(err);
                                 else {
                                     callback(null, result1)
                                 }
                             })
                         }

                     }
                 ], function(err, result) {

                     res.status(200).send({ responseMessage: "success", result: result })


                 })
             }
         })

     },




     "success": function(req, res) {
         console.log("req data-->" + JSON.stringify(req.body));
         res.send("Payment transfered successfully.");
     },

     "redeemCash": function(req, res) {
         // paypal payment configuration.
         var payment = {
             "intent": "sale",
             "payer": {
                 "payment_method": "paypal"
             },
             "redirect_urls": {
                 "return_url": 'http://localhost:8000/success',
                 "cancel_url": app.locals.baseurl + "/cancel"
             },
             "transactions": [{
                 "amount": {
                     "total": parseInt(req.body.brolix),
                     "currency": req.body.currency
                         // "transactions_ID": req.body.transactions_ID
                 },
                 "description": req.body.description
             }]
         };


         paypal.payment.create(payment, function(error, payment) {
             if (error) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                 if (payment.payer.payment_method === 'paypal') {
                     req.paymentId = payment.id;
                     var redirectUrl;
                     console.log("payment", payment);
                     console.log("requestbody", JSON.stringify(req.body))
                     console.log("currency", JSON.stringify(req.body.currency))

                     var amount = req.body.brolix / 100;
                     console.log("Rupees-------", amount)

                     User.findOne({ _id: req.body.userId }, function(err, result) {

                         if (result.brolix < req.body.brolix) { res.send({ responseCode: 400, responseMessage: "Insufficient amount of brolix in your account" }); } else {

                             User.findOneAndUpdate({ _id: req.body.userId }, { $push: { "transferAmountListObject": { amount: amount } } }, { new: true }, function(err, results) {

                                 if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!results) res.send({ responseCode: 404, responseMessage: "please enter correct userId" });
                                 else {
                                     results.brolix -= req.body.brolix;
                                     results.save();
                                     for (var i = 0; i < payment.links.length; i++) {
                                         var link = payment.links[i];
                                         if (link.method === 'REDIRECT') {
                                             redirectUrl = link.href;
                                         }
                                     }
                                     console.log("paymentttt", JSON.stringify(payment.transactions));
                                     //res.redirect(redirectUrl);
                                     res.send({
                                         responseCode: 200,
                                         responseMessage: "You have successfully transfer your amount"

                                     });
                                 }
                             });
                         }
                     })
                 }
             }
         });
     },

     "cancel": function(req, res) {
         console.log("req data-->" + JSON.stringify(req.body));
         res.send("Payment canceled successfully.");
     },

     "sendBrolixToFollower": function(req, res) {
         User.findOne({ _id: req.body.userId }, function(err, result) {
             if (result.brolix <= req.body.brolix) { res.send({ responseCode: 400, responseMessage: "Insufficient amount of Brolix in your account" }); } else {
                 result.brolix -= req.body.brolix;
                 result.save();

                 User.findOneAndUpdate({ _id: req.body.receiverId }, { $push: { "sendBrolixListObject": { senderId: req.body.userId, brolix: req.body.brolix } } }, { new: true }, function(err, results) {
                     if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!results) res.send({ responseCode: 404, responseMessage: "please enter correct userId" });
                     else {
                         results.brolix += req.body.brolix;
                         results.save();

                         res.send({
                             responseCode: 200,
                             responseMessage: "You have successfully transfer your Brolix",
                             result: results

                         });
                     }
                 });
             }
         });
     },

     
     "sendCashToFollower": function(req, res) {
         // paypal payment configuration.
         var payment = {
             "intent": "sale",
             "payer": {
                 "payment_method": "paypal"
             },
             "redirect_urls": {
                 "return_url": 'http://localhost:8000/success',
                 "cancel_url": app.locals.baseurl + "/cancel"
             },
             "transactions": [{
                 "amount": {
                     "total": parseInt(req.body.cash),
                     "currency": req.body.currency
                         // "transactions_ID": req.body.transactions_ID
                 },
                 "description": req.body.description
             }]
         };


         paypal.payment.create(payment, function(error, payment) {
             if (error) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                 if (payment.payer.payment_method === 'paypal') {
                     req.paymentId = payment.id;
                     var redirectUrl;
                     console.log("payment", payment);
                     console.log("requestbody", JSON.stringify(req.body))
                     console.log("currency", JSON.stringify(req.body.currency))

                     User.findOne({ _id: req.body.userId }, function(err, result) {

                         if (result.cash <= req.body.cash) { res.send({ responseCode: 400, responseMessage: "Insufficient amount of Cash in your account" }); } else {
                             result.cash -= req.body.cash;
                             result.save();

                             User.findOneAndUpdate({ _id: req.body.receiverId }, { $push: { "sendCashListObject": { senderId: req.body.userId, cash: req.body.cash } } }, { new: true }, function(err, results) {
                                 if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!results) res.send({ responseCode: 404, responseMessage: "please enter correct userId" });

                                 else {
                                     results.cash += req.body.cash;
                                     results.save();

                                     for (var i = 0; i < payment.links.length; i++) {
                                         var link = payment.links[i];
                                         if (link.method === 'REDIRECT') {
                                             redirectUrl = link.href;
                                         }
                                     }
                                     console.log("paymentttt", JSON.stringify(payment.transactions));
                                     //res.redirect(redirectUrl);

                                     res.send({
                                         responseCode: 200,
                                         responseMessage: "You have successfully transfer your Cash",
                                         result: results

                                     });

                                 }
                             });
                         }
                     });

                 }
             }
         });
     },

     //API for create Page
     "createEvent": function(req, res) {
         var event = new createEvents(req.body);
         event.save(function(err, result) {
             if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                 User.findByIdAndUpdate({ _id: req.body.userId }, {
                     $set: {
                         type: "Advertiser"
                     }
                 }, { new: true }).exec(function(err, result) {})
                 res.send({
                     result: result,
                     responseCode: 200,
                     responseMessage: "Event create successfully."
                 });
             }
         })
     },

     //API for create Page
     "showAllEvents": function(req, res) {
         createEvents.find({}).exec(function(err, result) {
             if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
             res.send({
                 result: result,
                 responseCode: 200,
                 responseMessage: "All event show successfully."
             })
         })
     },

     //API for create Page
     "showEventDetails": function(req, res) {
         createEvents.findOne({ _id: req.params.id }).exec(function(err, result) {
             if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
             res.send({
                 result: result,
                 responseCode: 200,
                 responseMessage: "Event details show successfully."
             })
         })
     },


 }
