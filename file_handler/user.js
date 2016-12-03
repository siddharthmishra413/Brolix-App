var User = require("./model/user");
var functions = require("./functionHandler");
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var config = require('../config');
var cc = require('coupon-code');
var voucher_codes = require('voucher-code-generator');
var paypal = require('paypal-rest-sdk');
var waterfall = require('async-waterfall');
var validator = require('validator');
var cloudinary = require('cloudinary');
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })

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
    //var createNewPage = require("./model/createNewAds");
    // http://172.16.6.171

module.exports = {

    //API for user signUP
    "signup": function(req, res) {
        console.log("request------>>>"+JSON.stringify(req.body));
        if (!req.body.email) res.send({ responseCode: 403, responseMessage: 'Email required' });
        else if (!validator.isEmail(req.body.email)) res.send({ responseCode: 403, responseMessage: 'Please enter the correct email id.' });
        else {
            User.findOne({ email: req.body.email }, function(err, result) {
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result) { res.send({ responseCode: 401, responseMessage: "Email id must be unique." }); } else {
                    if (!req.body.mobileNumber) res.send({ responseCode: 403, responseMessage: 'Mobile number required' });
                    else {
                        if (!validator.isNumeric((req.body.mobileNumber).toString())) return res.status(403).send({ msg: "Mobile number must be numeric" });
                        if (!validator.isLength((req.body.mobileNumber).toString(), { min: 10, max: 12 })) return res.status(403).send({ msg: "Mobile number length must be 10 to 12." });
                        User.findOne({ mobileNumber: req.body.mobileNumber }, function(err, result1) {
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result1) { res.send({ responseCode: 401, responseMessage: "Mobile number must be unique." }) } else {
                                req.body.otp = functions.otp();
                                var user = User(req.body)
                                user.save(function(err, result) {
                                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
                                    var token = jwt.sign(result, config.secreteKey);
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
                    }
                }
            })
        }
    },


    //API for verify Otp
    "verifyOtp": function(req, res, next) {
        User.findOne({ _id: req.body.userId, otp: req.body.otp }).exec(function(err, results) {
            if (!results) {
                res.send({
                    responseCode: 406,
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
        if (!validator.isEmail(req.body.email)) res.send({ responseCode: 403, responseMessage: 'Please enter the correct email id.' });
        User.findOne({ email: req.body.email, password: req.body.password, status: 'ACTIVE' }, avoid).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
            if (!result) {
                return res.send({
                    responseCode: 404,
                    responseMessage: "Sorry your id or password is incorrect."
                });
            } else {
                User.findOneAndUpdate({ email: req.body.email}, {
                    $set: {
                        deviceType: req.body.deviceType,
                        deviceToken: req.body.deviceToken
                    }
                }, { new: true }).exec(function(err, user) {
                    var token = jwt.sign(result, config.secreteKey);
                    res.header({
                        "appToken": token
                    }).send({
                        result: user,
                        token: token,
                        responseCode: 200,
                        responseMessage: "Login successfully."
                    });
                    //console.log("what is in token-->>>" + token);
                })
            }
        })
    },
    //API for Edit Profile
    "editProfile": function(req, res) {
        var otp1;
        var sendEmail = "",
            sendMobileOtp = "";
        User.findOne({ _id: req.params.id }, function(err, data) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                var sendEmail = (!req.body.email) ? "false" : (data.email == req.body.email) ? "exitEmail" : "true";
                var sendMobileOtp = (req.body.mobileNumber && Boolean(sendEmail)) ? (data.mobileNumber == req.body.mobileNumber) ? "exitMobile" : "true" : "false";
                if (sendEmail == "exitEmail") return res.status(403).send({
                    responseMessage: "This email is already register."
                })
                if (sendMobileOtp == "exitMobile") return res.status(403).send({
                    responseMessage: "This mobile number is already register."
                })
                otp1 = sendMobileOtp == "true" ? functions.otp(req.body.mobileNumber) : functions.otp();
                if (sendEmail == "true") {
                    var massege = "Your otp is :"
                    functions.mail(req.body.email, massege, otp1);
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
     User.findOne({ _id: req.body.userId }, function(err, result) {
         console.log("ddd---" + JSON.stringify(result));
         if (!result) {
             res.send({
                 response_code: 400,
                 response_message: "user dosn't exist"
             });
         } else {
             var oldpassword = (req.body.oldpass);
             if (result.password != oldpassword) {
                 res.send({
                     response_code: 401,
                     response_message: "Old password doesn't match"
                 });
             } else {

                 var password = (req.body.newpass);
                 User.findByIdAndUpdate({ _id: req.body.userId }, { $set: { password: password } }, { new: true }).exec(function(err, user) {
                     res.send({
                         // result: user,
                         response_code: 200,
                         response_message: "Password successfully changed"
                     });
                 })
             }
         }
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

    //API for Follow and unfollow
    "followUnfollow": function(req, res) {
        if (req.body.follow == "follow") {
            User.findOneAndUpdate({ _id: req.body.userId }, { $push: { "followers": { senderId: req.body.senderId, senderName: req.body.senderName } } }, { new: true }).exec(function(err, results) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
                res.send({
                    results: results,
                    responseCode: 200,
                    responseMessage: "Followed"
                });
            })
        } else {
            User.findOneAndUpdate({ _id: req.body.userId }, { $pop: { "followers": { senderId: req.body.senderId } } }, { new: true }).exec(function(err, results) {
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

    //API for Follower List
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

    //API for Accept Follower Request
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

    //API for Tag Friends
    "tagFriends": function(req, res) {
        //console.log("req======>>>" + JSON.stringify(req.body))
        var text = req.body.search;
        var senderName = [];
        var filterData = [];
        User.findOne({ _id: req.body.userId }, 'followers', function(err, result) {
            var followers = result.followers;
            //console.log(followers)
            if (err) { res.send({ responseCode: 409, responseMessage: err }); }
            for (var i = 0; i < followers.length; i++) {
                if (followers[i].FollowStatus == 'Accepted')
                    senderName.push(followers[i].senderName);
            }
            matchFollowers(text);

            function matchFollowers(input) {
                console.log('function call');
                var reg = new RegExp(input.split('').join('\\w*').replace(/\W/, ""), 'i');
                return senderName.filter(function(person) {
                    if (person.match(reg)) {
                        filterData.push(person)
                    }
                });
            }
            if (err) { res.send({ responseCode: 409, responseMessage: err }); } else {
                res.send({
                    responseCode: 200,
                    responseMessage: "Show Followers successfully.",
                    result: filterData
                });
            }
        })
    },

    // Api for Rating
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

    // Api for Luck Card
    "luckCard": function(req, res) {
        var chances;
        var luckcard = req.body.brolix / 50;
        if (luckcard % 5 == 0) {
            chances = luckcard;

            createNewAds.findOne({ _id: req.body.adId }, function(err, data) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
                 else if (!data) return res.status(404).send({ responseMessage: "please enter correct adId" })
                else if (data.winners.length != 0) return res.status(404).send({ responseMessage: "Winner already decided" });
                else {
                    User.findOne({ _id: req.body.userId, }, function(err, result) {
                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } 
                        else if (!result) return res.status(404).send({ responseMessage: "Please enter userId" })
                        else if (result.brolix <= req.body.brolix) { res.send({ responseCode: 400, responseMessage: "Insufficient amount of brolix in your account" }); } else {

                            createNewAds.findByIdAndUpdate({ _id: req.body.adId }, { $push: { "luckCardListObject": { userId: req.body.userId, brolix: req.body.brolix, chances: chances } } }, { new: true }).exec(function(err, user) {
                                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                                    result.brolix -= req.body.brolix;
                                    result.save();
                                    res.status(200).send({ responseMessage: "Successfully used the luck card" });
                                }
                            })
                        }
                    })
                }
            })
        } else {

            res.status(200).send({ responseMessage: "Enter the proper number of brolix" });
        }

    },
    // "success": function(req, res) {
    //     console.log("req data-->" + JSON.stringify(req.body));
    //     res.send("Payment transfered successfully.");
    // },

    // Api For Reedem Cash
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
                    console.log("amount-------", amount)
                    User.findOne({ _id: req.body.userId }, function(err, result) {
                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
                        else if (!results) res.send({ responseCode: 404, responseMessage: "please enter correct userId" });
                        else if (result.brolix < req.body.brolix) { res.send({ responseCode: 400, responseMessage: "Insufficient amount of brolix in your account" }); } else {
                            User.findOneAndUpdate({ _id: req.body.userId }, { $push: { "transferAmountListObject": { amount: amount } } }, { new: true }, function(err, results) {
                                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
                                 else if (!results) res.send({ responseCode: 404, responseMessage: "please enter correct userId" });
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
                                        responseMessage: "You have successfully transferred your amount"

                                    });
                                }
                            });
                        }
                    })
                }
            }
        });
    },

    // "cancel": function(req, res) {
    //     console.log("req data-->" + JSON.stringify(req.body));
    //     res.send("Payment canceled successfully.");
    // },

    // Api for Send brolix To Follower
    "sendBrolixToFollower": function(req, res) {
        User.findOne({ _id: req.body.userId }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
            else if (!results) res.send({ responseCode: 404, responseMessage: "please enter correct userId" });
            else if (result.brolix <= req.body.brolix) { res.send({ responseCode: 400, responseMessage: "Insufficient amount of Brolix in your account" }); } else {
                result.brolix -= req.body.brolix;
                result.save();
                User.findOneAndUpdate({ _id: req.body.receiverId }, { $push: { "sendBrolixListObject": { senderId: req.body.userId, brolix: req.body.brolix } } }, { new: true }, function(err, results) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!results) res.send({ responseCode: 404, responseMessage: "Please enter correct userId" });
                    else {
                        results.brolix += req.body.brolix;
                        results.save();
                        res.send({
                            responseCode: 200,
                            responseMessage: "You have successfully transferred your Brolix",
                            result: results

                        });
                    }
                });
            }
        });
    },

    // Api for Send Cash to Follower
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
                         if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
                        else if (!results) res.send({ responseCode: 404, responseMessage: "please enter correct userId" });

                        else if (result.cash <= req.body.cash) { res.send({ responseCode: 400, responseMessage: "Insufficient amount of cash in your account" }); } else {
                            result.cash -= req.body.cash;
                            result.save();

                            User.findOneAndUpdate({ _id: req.body.receiverId }, { $push: { "sendCashListObject": { senderId: req.body.userId, cash: req.body.cash } } }, { new: true }, function(err, results) {
                                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!results) res.send({ responseCode: 404, responseMessage: "Please enter correct userId" });

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
                                        responseMessage: "You have successfully transfer your cash",
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

    // Api for Buy Brolix
    "buyBrolix": function(req, res) {
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

                    var brolix = req.body.cash * 100;
                    console.log("amount-------", brolix)

                    User.findOne({ _id: req.body.userId }, function(err, result) {
                       if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
                        else if (!results) res.send({ responseCode: 404, responseMessage: "please enter correct userId" });

                        else if (result.cash <= req.body.cash) { res.send({ responseCode: 400, responseMessage: "Insufficient amount of cash in your account" }); } else {
                            result.cash -= req.body.cash;
                            result.save();

                            User.findOneAndUpdate({ _id: req.body.userId }, { $push: { "buyBrolixListObject": { brolix: brolix } } }, { new: true }, function(err, results) {

                                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!results) res.send({ responseCode: 404, responseMessage: "Please enter correct userId" });
                                else {
                                    results.brolix += req.body.brolix;
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
                                        responseMessage: "You have successfully transferred your Brolix",
                                        result: results

                                    });

                                    console.log("result------------->>>>>", JSON.stringify(result))
                                }

                            });
                        }

                    })
                }
            }
        });

    },

    "filterToDateAndFromDate": function(req, res) {
        User.find({ _id: req.body.userId }).exec(function(err, results) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                var arr = [];
                results[0].followers.forEach(function(result) {
                    arr.push(result.senderId)
                })
                User.find({ _id: { $in: arr }, "createdAt": { "$gte": req.body.toDate, "$lt": req.body.fromDate } }).exec(function(err, newResult) {
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

"updatePrivacy": function(req, res) {
    User.findOneAndUpdate({ _id: req.body.userId }, { $set: { privacy: req.body.privacy } }, { new: true }, function(error, result) {
        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) res.send({ responseCode: 404, responseMessage: "Please enter correct userId" });
        else {
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "Privacy updated successfully"
            });
        }
    })
},

   "showPrivacy": function(req, res) {
       User.findOne({ _id: req.body.userId }, 'privacy').exec(function(err, result) {
           if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: 'User does not found' }); } else {
               res.send({
                   result: result,
                   responseCode: 200,
                   responseMessage: "User details show successfully"
               })
           }
       })
   },


    "blockUser": function(req, res) {
       console.log("block user exports-->>>" + JSON.stringify(req.body));
       User.findByIdAndUpdate({ _id: req.body.userId }, { '$set': { 'status': 'BLOCK' } }, { new: true }, function(err, result) {
           if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: 'User not found' }); } else {
               res.send({
                   // result: result,
                   responseCode: 200,
                   responseMessage: "User Blocked successfully!!"
               });
           }

       });
   },


     "showAllBlockUser": function(req, res) {
        User.find({}, 'status').exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "All blocked user show successfully!!"
                });
            }
        });
      },

      "privacy": function(req, res) {
         User.findOne({ _id: req.body.userId }, function(err, result) {
             if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result.privacy.exchangeCoupon == "onlyMe") return res.status(400).send({ responseMessage: "you are not allowed" })
             else if (result.privacy.exchangeCoupon == "friends") {
                 var flag = result.followers.find(followers => followers == req.body.followerId)
                 if (flag === undefined) return res.status(400).send({ responseMessage: "you are not friend" })
                 else {

                 }

             } else {

                 res.send({
                     responseCode: 200,
                     responseMessage: "user data",
                     result: result
                 })
             }
         })


     }


}
