var User = require("./model/user");
var createNewAds = require("./model/createNewAds");
var functions = require("./functionHandler");
var chat = require("./model/chatModel")
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
var country = require('countryjs');
var cron = require('node-cron');
var yeast = require('yeast');
var followerList = require("./model/followersList");
var paypalPayment = require("./model/payment");
var Brolixanddollors = require("./model/brolixAndDollors");
var mongoose = require('mongoose');

cloudinary.config({
    cloud_name: 'mobiloitte-in',
    api_key: '188884977577618',
    api_secret: 'MKOCQ4Dl6uqWNwUjizZLzsxCumE'
});


var avoid = {
    "password": 0
}

//brintree Integration
var braintree = require("braintree");

var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: "hncxrnbt5fh2c2cr",
    publicKey: "xjhcfhbmqszj6rcx",
    privateKey: "f3ffe3376878b6d1a0eff16c9099127d"
});

///////////////////////////////////////////////////////
var sha512 = require('js-sha512');
var querystring = require('querystring');
var https = require('https');

var marchentKey = "gtKFFx";
var txnid = '4945398';
var amount = 1000;
var productinfo = 'Product 1';
var firstname = 'sakshi';
var email = 'sakshigadia1994@gmail.com';
var phone = '9015426958';
var surl = 'http://localhost/success';
var furl = 'http://localhost/fail';
var service_provider = 'payu_paisa';
var salt = 'eCwWELxi';
var string = marchentKey + '|' + txnid + '|' + amount + '|' + productinfo + '|' + firstname + '|' + email + '|||||||||||' + salt;
var data1 = querystring.stringify({
    marchentKey: "gtKFFx",
    txnid: '4945398',
    amount: 1000,
    productinfo: 'Product 1',
    firstname: 'sakshi',
    email: 'sakshigadia1994@gmail.com',
    phone: '9015426958',
    surl: 'http://localhost/success',
    furl: 'http://localhost/fail',
    service_provider: 'payu_paisa',
    salt: 'eCwWELxi',
    hash: sha512(string)
})


var optionsNew = {
    'Content-Type': 'application/json',
    hostname: 'test.payumoney.com',
    port: 443,
    path: '/payment/payment/createPayment' + data1,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data1),
        'content': data1,
        'accept': '*/*'
    }
};

module.exports = {

    //////////////////////////////////////////////////////////////////
    //////////////////////////////payU////////////////////////////////

    "payU": function(request, response) {
        console.log(data);
        var req = https.request(options, function(res) {
            console.log("res" + res);

            res.setEncoding('utf8');
            res.on('data', function(chunk) { // data will be available in callback 
                console.log("body: " + chunk);
            });
        });
        req.on('error', function(e) {
            console.log('Error' + e.message);
        });
        req.write(data);
        req.end();
    },

    "paydU": function(request, response) {
        //     var querystring = require('querystring'); 
        // var http = require('https'); 

        var data = querystring.stringify({
            merchantKey: "BBF7oOWI",
            merchantTransactionIds: "4945362"
        });
        var options = {
            hostname: 'https://test.payu.in/_payment',
            port: 443,
            path: '/payment/op/getPaymentResponse?' + data,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data),
                'content': data,
                'accept': '*/*'
            }
        };

        var req = https.request(options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function(chunk) { // data will be available in callback 
                console.log("body: " + chunk);
            });
        });
        req.on('error', function(e) {
            console.log('Error' + e.message);
        });
        req.write(data);
        req.end();
    },

    ////////////////////////////////////////////////////////////////////

    "paymentClientToken": function(req, res) {
        gateway.clientToken.generate({}, function(err, response) {
            console.log(response)
            responseHandler.apiResponder(req, res, 200, "success", response.clientToken)
        });
    },

    "paymentIntegration": function(req, res) {
        waterfall([
            function(callback) {
                var nextPay;
                var amount = req.body.amount;
                var serviceFee = amount / 10;
                var transactionCost = amount * (2.9 / 100) + 0.30;
                merchantAccountParams = {
                    individual: {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        phone: req.body.phoneNumber,
                        dateOfBirth: req.body.dateOfBirth,
                        //ssn: "456-45-4567",
                        address: {
                            streetAddress: req.body.address.streetAddress,
                            locality: req.body.address.locality,
                            region: req.body.address.region,
                            postalCode: req.body.address.postalCode
                        }
                    },
                    funding: {
                        descriptor: "Sub merchantAccount",
                        destination: braintree.MerchantAccount.FundingDestination.Bank,
                        email: req.body.email,
                        mobilePhone: req.body.phoneNumber,
                        accountNumber: req.body.accountNumber,
                        routingNumber: req.body.routingNumber
                    },
                    tosAccepted: true,
                    masterMerchantAccountId: "mobiloitte"
                };
                //console.log("nextpay in out merchant==>>"+nextPay)
                gateway.merchantAccount.create(merchantAccountParams, function(err, resultss) {
                    console.log(resultss);
                    console.log("merchantAccount=====>>>", resultss.merchantAccount.id);
                    //  console.log("nextpay in create merchant==>>"+nextPay)
                    callback(null, resultss);

                });
                //   }
                // })
            },
            function(resultss, callback) {
                var amount = req.body.amount;
                var serviceFee = amount / 10;
                console.log("amount=====>>>", amount);
                console.log("serviceFee=====>>>", serviceFee);
                console.log("merchantAccount=====>>>", resultss.merchantAccount.id);
                gateway.transaction.sale({
                    merchantAccountId: resultss.merchantAccount.id,
                    amount: amount,
                    paymentMethodNonce: req.body.paymentMethodNonce,
                    serviceFeeAmount: serviceFee,
                    options: {
                        submitForSettlement: true
                    }
                }, function(err, results) {
                    if (err) {
                        res.send({
                            responseCode: 302,
                            responseMessage: 'error.',
                            result: err
                        });
                    } else if (results.errors) {
                        res.send({
                            responseCode: 404,
                            responseMessage: 'not found.'
                                // result: result
                        });
                    } else {

                        res.send({
                            responseCode: 200,
                            responseMessage: 'Successfully.',
                            result: results
                        });
                    }
                })
            },

        ], function(err, result) {
            if (err) { responseHandler.apiResponder(req, res, 302, "Problem in data finding", err) } else {
                res.send({
                    responseCode: 200,
                    responseMessage: 'Successfully.',
                    result: result
                });
            }
        })
    },
    // "paymentIntegration": function(req, res){

    // },

    //API for user signUP
    "signup": function(req, res) {
        console.log("request--->>", req.body)
        if (!req.body.email) { res.send({ responseCode: 403, responseMessage: 'Email required' }); } 
        else if (!req.body.dob) { res.send({ responseCode: 403, responseMessage: 'Dob required' }); }
         else if (!req.body.country) { res.send({ responseCode: 403, responseMessage: 'country required' }); }
           else if (!req.body.city) { res.send({ responseCode: 403, responseMessage: 'city required' }); } 
           else if (!req.body.mobileNumber) { res.send({ responseCode: 403, responseMessage: 'MobileNumber required' }); }
            else if (!validator.isEmail(req.body.email)) res.send({ responseCode: 403, responseMessage: 'Please enter the correct email id.' });
        else {
            console.log("1")
            User.findOne({ email: req.body.email }, function(err, result) {
                console.log("result-->>", result)
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result) { res.send({ responseCode: 401, responseMessage: "Email id must be unique." }); } else {
                    console.log("2")
                    if (!req.body.mobileNumber) res.send({ responseCode: 403, responseMessage: 'Mobile number required' });
                    else {
                        if (!validator.isNumeric((req.body.mobileNumber).toString())) return res.status(403).send({ msg: "Mobile number must be numeric" });
                        if (!validator.isLength((req.body.mobileNumber).toString(), { min: 10, max: 12 })) return res.status(403).send({ msg: "Mobile number length must be 10 to 12." });
                        User.findOne({ mobileNumber: req.body.mobileNumber }, function(err, result1) {
                            console.log("result1-->>", result1)
                            console.log("3")
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result1) { res.send({ responseCode: 401, responseMessage: "Mobile number must be unique." }) } else {
                                console.log("4")
                                if (req.body.haveReferralCode == true) {
                                    Brolixanddollors.find({ "type": "brolixForInvitation" }).exec(function(err, data) {
                                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                                            console.log("data-->>", data)
                                            var amount = data[0].value;
                                            console.log("amount-->>", amount)
                                            User.findOneAndUpdate({ referralCode: req.body.referredCode }, { $inc: { brolix: amount } }).exec(function(err, result2) {
                                                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                                                    req.body.otp = functions.otp();
                                                    req.body.referralCode = yeast();
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
                                    })
                                } else {
                                    req.body.otp = functions.otp();
                                    req.body.referralCode = yeast();
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
            } else if (result.facebookID !== undefined) res.send({ responseCode: 203, responseMessage: "User registered with facebook." });
            else {
                User.findOneAndUpdate({ email: req.body.email }, {
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

    //API for user Details  userId: { $ne: req.params.id },
    "allUserDetails": function(req, res) {
        User.find({ userId: { $ne: req.params.id }, $or: [{ type: "USER" }, { type: "Advertiser" }] }).exec(function(err, result) {
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
                            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error.' }); }
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
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseCode: "User doesn't exist." }); } else {
                var oldpassword = req.body.oldpass;
                if (result.password != oldpassword) {
                    res.send({
                        responseCode: 401,
                        responseCode: "Old password doesn't match."
                    });
                } else {
                    var password = req.body.newpass;
                    User.findByIdAndUpdate({ _id: req.body.userId }, { $set: { password: password } }, { new: true }).exec(function(err, user) {
                        res.send({
                            responseCode: 200,
                            responseMessage: "Password changed."
                        });
                    })
                }
            }
        })
    },

    //API for user Profile
    "userProfile": function(req, res) {
        User.findOne({ _id: req.body.userId }, avoid).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: 'Please enter correct userId' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Profile data show successfully."
                });
            }
        })
    },

    //API for user Details
    "listOfAllAdvertiser": function(req, res) {
        User.find({ type: 'Advertiser' }, avoid).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Show data successfully."
                });
            }
        })
    },

    //API for user Profile
    "detailsOfAdvertiser": function(req, res) {
        User.findOne({ _id: req.params.id }, avoid).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Profile data show successfully."
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
        var avrg = 0;
        User.findOne({ _id: req.body.userId, totalRating: { $elemMatch: { senderId: req.body.senderId } } }).exec(function(err, result) {
            console.log("result========================" + JSON.stringify(result));
            if (!result) {
                console.log("If");
                User.findOneAndUpdate({ _id: req.body.userId }, { $push: { "totalRating": { senderId: req.body.senderId, rating: req.body.rating } } }, { new: true }).exec(function(err, results) {
                    for (var i = 0; i < results.totalRating.length; i++) {
                        avrg += results.totalRating[i].rating;
                    }
                    var averageRating = avrg / results.totalRating.length;
                    User.findOneAndUpdate({ _id: req.body.userId }, { $set: { averageRating: averageRating } }, { new: true }).exec(function(err, results2) {
                        res.send({
                            result: results2,
                            responseCode: 200,
                            responseMessage: "result show successfully;"
                        })
                    })
                })
            } else {
                console.log("else");
                User.findOneAndUpdate({ _id: req.body.userId, 'totalRating.senderId': req.body.senderId }, { $set: { "totalRating.$.rating": req.body.rating } }, { new: true }).exec(function(err, results1) {
                    for (var i = 0; i < results1.totalRating.length; i++) {
                        avrg += results1.totalRating[i].rating;
                    }
                    var averageRating = avrg / results1.totalRating.length;
                    User.findOneAndUpdate({ _id: req.body.userId }, { $set: { averageRating: averageRating } }, { new: true }).exec(function(err, results2) {
                        res.send({
                            result: results2,
                            responseCode: 200,
                            responseMessage: "result show successfully;"
                        })
                    })
                })
            }
        })
    },

    // Api for Luck Card
    "luckCard": function(req, res) {
        var chances;
        var luckcard = req.body.brolix / 50;
        if (luckcard % 5 == 0) {
            chances = luckcard;

            createNewAds.findOne({ _id: req.body.adId }, function(err, data) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!data) return res.status(404).send({ responseMessage: "please enter correct adId" })
                else if (data.winners.length != 0) return res.status(404).send({ responseMessage: "Winner already decided" });
                else {
                    User.findOne({ _id: req.body.userId, }, function(err, result) {
                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) return res.status(404).send({ responseMessage: "Please enter userId" })
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

    "sendBrolixToFollower": function(req, res) { // userId, receiverId, brolix
        waterfall([
            function(callback) {
                var receiverId = req.body.receiverId;
                var userId = req.body.userId;
                User.findOne({ _id: receiverId }, function(err, result) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No user found." }); } else if (result.privacy.exchangeCoupon == "onlyMe") { res.send({ responseCode: 409, responseMessage: "you are not allowed to send" }) } else {
                        callback(null)
                    }
                })
            },
            function(callback) {
                console.log(" in friends")
                var receiverId = req.body.receiverId;
                var userId = req.body.userId;
                User.findOne({ _id: receiverId }, function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 11' }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: "No user found." }); } else if (result1.privacy.sendBrolix == "followers") {
                        var flag = result1.userFollowers.find(userFollowers => userFollowers == senderId)
                        if (flag === undefined) { res.send({ responseCode: 400, responseMessage: "you are not friend" }); } else {

                            User.findOne({ _id: userId }, function(err, result2) {
                                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result2) res.send({ responseCode: 404, responseMessage: "please enter correct senderId" });
                                else if (result2.brolix <= req.body.brolix) { res.send({ responseCode: 400, responseMessage: "Insufficient amount of brolix in your account." }); } else {
                                    var image = result2.image;
                                    result2.brolix -= req.body.brolix;
                                    result2.save();

                                    User.findOneAndUpdate({ _id: receiverId }, { $push: { "sendBrolixListObject": { senderId: userId, brolix: req.body.brolix } }, "notification": { userId: userId, type: 'I have send you Brolix', notificationType: 'brolixReceivedType', image: image }, $inc: { brolix: +req.body.brolix } }, { new: true }, function(err, result3) {
                                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result3) res.send({ responseCode: 404, responseMessage: "Please enter correct receiverId" });
                                        else {
                                            result3.brolix += req.body.brolix;
                                            result3.save();
                                            callback(null, result3)
                                        }
                                        if (result3.deviceType == 'Android' || result3.notification_status == 'on' || result3.status == 'ACTIVE') {
                                            var message = "I have send you brolix";
                                            functions.android_notification(result3.deviceToken, message);
                                            console.log("Android notification send!!!!")
                                        } else if (result3.deviceType == 'iOS' || result3.notification_status == 'on' || result3.status == 'ACTIVE') {
                                            functions.iOS_notification(result3.deviceToken, message);
                                        } else {
                                            console.log("Something wrong!!!!")
                                        }
                                    });
                                }
                            });
                        }
                    } else {
                        console.log("in public")
                        var receiverId = req.body.receiverId;
                        var userId = req.body.userId;
                        User.findOne({ _id: userId }, function(err, result4) {
                            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result4) res.send({ responseCode: 404, responseMessage: "please enter correct senderId" });
                            else if (result4.brolix <= req.body.brolix) { res.send({ responseCode: 400, responseMessage: "Insufficient amount of brolix in your account." }); } else {
                                var image = result4.image;
                                result4.brolix -= req.body.brolix;
                                result4.save();
                                User.findOneAndUpdate({ _id: receiverId }, { $push: { "sendBrolixListObject": { senderId: userId, brolix: req.body.brolix } }, "notification": { userId: userId, type: 'I have send you Brolix', notificationType: 'brolixReceivedType', image: image }, $inc: { brolix: +req.body.brolix } }, { new: true }, function(err, result5) {
                                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result5) res.send({ responseCode: 404, responseMessage: "Please enter correct receiverId" });
                                    else {
                                        callback(null, result5)
                                    }
                                    if (result5.deviceType == 'Android' || result5.notification_status == 'on' || result5.status == 'ACTIVE') {
                                        var message = "I have send you brolix";
                                        functions.android_notification(result5.deviceToken, message);
                                        console.log("Android notification send!!!!")
                                    } else if (result5.deviceType == 'iOS' || result5.notification_status == 'on' || result5.status == 'ACTIVE') {
                                        functions.iOS_notification(result5.deviceToken, message);
                                    } else {
                                        console.log("Something wrong!!!!")
                                    }
                                });
                            }
                        });
                    }
                })
            },
        ], function(err, result) {
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "You have successfully transferred your brolix."
            })
        })

    },

    "sendCashToFollower": function(req, res) { // userId, receiverId, cash in request
        waterfall([
            function(callback) {
                var receiverId = req.body.receiverId;
                var senderId = req.body.userId;
                User.findOne({ _id: receiverId }, function(err, result) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No user found." }); } else if (result.privacy.exchangeCoupon == "onlyMe") { res.send({ responseCode: 409, responseMessage: "you are not allowed to send" }) } else {
                        callback(null)
                    }
                })
            },
            function(callback) {
                console.log(" in friends")
                var senderId = req.body.userId;
                var receiverId = req.body.receiverId;
                User.findOne({ _id: receiverId }, function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 11' }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: "No user found." }); } else if (result1.privacy.sendCash == "followers") {
                        var flag = result1.userFollowers.find(userFollowers => userFollowers == senderId)
                        if (flag === undefined) { res.send({ responseCode: 400, responseMessage: "you are not friend" }); } else {
                            var senderId = req.body.userId;
                            var receiverId = req.body.receiverId;
                            User.findOne({ _id: senderId }, function(err, result) {
                                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) res.send({ responseCode: 404, responseMessage: "please enter correct userId" });
                                else if (result.cash <= req.body.cash) { res.send({ responseCode: 400, responseMessage: "Insufficient amount of cash in your account." }); } else {
                                    var image = result.image;
                                    result.cash -= req.body.cash;
                                    result.save();
                                    User.findOneAndUpdate({ _id: receiverId }, { $push: { "sendCashListObject": { senderId: senderId, cash: req.body.cash } }, "notification": { userId: senderId, type: 'I have send you Cash', notificationType: 'cashReceivedType', image: image } }, { new: true }, function(err, user) {
                                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!user) res.send({ responseCode: 404, responseMessage: "Please enter correct receiverId" });
                                        else {
                                            user.cash += req.body.cash;
                                            user.save();
                                            //callback(null, user)
                                        }
                                        if (user.deviceType == 'Android' || user.notification_status == 'on' || user.status == 'ACTIVE') {
                                            var message = "I have sent you cash";
                                            functions.android_notification(user.deviceToken, message);
                                            console.log("Android notification send!!!!")
                                        } else if (user.deviceType == 'iOS' || user.notification_status == 'on' || user.status == 'ACTIVE') {
                                            functions.iOS_notification(user.deviceToken, message);
                                        } else {
                                            console.log("Something wrong!!!!")
                                        }
                                    });
                                    callback(null, result)
                                }
                            });
                        }
                    } else {
                        var senderId = req.body.userId;
                        var receiverId = req.body.receiverId;
                        User.findOne({ _id: senderId }, function(err, result) {
                            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) res.send({ responseCode: 404, responseMessage: "please enter correct userId" });
                            else if (result.cash <= req.body.cash) { res.send({ responseCode: 400, responseMessage: "Insufficient amount of cash in your account." }); } else {
                                var image = result.image;
                                result.cash -= req.body.cash;
                                result.save();
                                User.findOneAndUpdate({ _id: receiverId }, { $push: { "sendCashListObject": { senderId: senderId, cash: req.body.cash } }, "notification": { userId: senderId, type: 'I have send you Cash', notificationType: 'cashReceivedType', image: image } }, { new: true }, function(err, user) {
                                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!user) res.send({ responseCode: 404, responseMessage: "Please enter correct receiverId" });
                                    else {
                                        user.cash += req.body.cash;
                                        user.save();
                                        //callback(null, user)
                                    }
                                    if (user.deviceType == 'Android' || user.notification_status == 'on' || user.status == 'ACTIVE') {
                                        var message = "I have sent you cash";
                                        functions.android_notification(user.deviceToken, message);
                                        console.log("Android notification send!!!!")
                                    } else if (user.deviceType == 'iOS' || user.notification_status == 'on' || user.status == 'ACTIVE') {
                                        functions.iOS_notification(user.deviceToken, message);
                                    } else {
                                        console.log("Something wrong!!!!")
                                    }
                                });
                                callback(null, result)
                            }
                        });
                    }
                })

            },
        ], function(err, result) {
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "You have successfully transferred your cash."
            });
        })
    },

    "filterToDateAndFromDate": function(req, res) {
        User.find({ _id: req.body.userId }).exec(function(err, results) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                var arr = [];
                results[0].followers.forEach(function(result) {
                    arr.push(result.senderId)
                })
                User.find({ _id: { $in: arr }, "createdAt": { "$gte": req.body.toDate, "$lt": req.body.fromDate } }).exec(function(err, newResult) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (newResult.length == 0) { res.send({ responseCode: 400, responseMessage: 'No result found' }); } else {
                        for (var i = 0; i < newResult.length; i++) {
                            var obj = {};
                            obj.followStatus = results[0].followers[i].FollowStatus;
                            console.log(obj);
                            obj.result = newResult[i];
                            newResult[i] = obj;
                        }
                        res.send({
                            result: newResult,
                            responseCode: 200,
                            responseMessage: "Show list all followers."
                        });
                    }
                })
            }
        })
    },

    "updatePrivacy": function(req, res) {
        User.findOneAndUpdate({ _id: req.body.userId }, { $set: { privacy: req.body.privacy } }, { new: true }, function(error, result) {
            if (error) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: 'User not found' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Privacy updated successfully."
                });
            }
        })
    },

    "showPrivacy": function(req, res) {
        User.findOne({ _id: req.body.userId }, 'privacy').exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: 'User not found' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Privacy details show successfully."
                })
            }
        })
    },

    "blockUser": function(req, res) {
        console.log("block user exports-->>>" + JSON.stringify(req.body));
        User.findByIdAndUpdate({ _id: req.body.userId }, { $set: { 'status': 'BLOCK' } }, { new: true }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) return res.status(404).send({ responseMessage: "please enter correct adId" })
            else {
                res.send({
                    // result: result,
                    responseCode: 200,
                    responseMessage: "User blocked successfully."
                });
            }

        });
    },

    "showAllBlockUser": function(req, res) {
        User.find({ _id: req.params.id }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: 'No blocked user found' }); } else {
                var arr = [];
                for (var i = 0; i < result.length; i++) {
                    if (result[i].followers.length >= 1) {
                        for (var j = 0; j < result[i].followers.length; j++) {
                            if (result[i].followers[j].FollowStatus == "block")
                                arr.push(result[i].followers[j].senderId);
                        }
                    }
                }
                User.find({ _id: { $in: arr } }, avoid).exec(function(err, newResult) {
                    res.send({
                        result: newResult,
                        responseCode: 200,
                        responseMessage: "Blocked users."
                    })
                })
            }
        });
    },

    "logout": function(req, res) {
        User.findOneAndUpdate({ _id: req.body.userId }, { $set: { deviceType: '', deviceToken: '' } }, { new: true }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                res.send({
                    // result:result,
                    responseCode: 200,
                    responseMessage: "logout successfully."
                });
            }
        });

    },

    "showUpgradeCard": function(req, res) {
        User.find({ _id: req.body.userId, 'upgradeCardObject.status': "ACTIVE" }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No card found" }); } else {
                var count = 0;
                for (i = 0; i < result.length; i++) {
                    for (j = 0; j < result[i].upgradeCardObject.length; j++) {
                        if (result[i].upgradeCardObject[j].status == "ACTIVE") {
                            count++;
                        }
                    }
                }
                var obj = result[0].upgradeCardObject;
                var data = obj.filter(obj => obj.status == "ACTIVE");
                res.send({
                    result: data,
                    count: count,
                    responseCode: 200,
                    responseMessage: "List of all upgrade Card show successfully!!"
                });
            }
        })
    },

    "showLuckCard": function(req, res) {
        User.find({ _id: req.body.userId, 'luckCardObject.status': "ACTIVE" }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No card found" }); } else {
                var count = 0;
                for (i = 0; i < result.length; i++) {
                    for (j = 0; j < result[i].luckCardObject.length; j++) {
                        if (result[i].luckCardObject[j].status == "ACTIVE") {
                            count++;
                        }
                    }
                }
                var obj = result[0].luckCardObject;
                var data = obj.filter(obj => obj.status == "ACTIVE");
                res.send({
                    result: data,
                    count: count,
                    responseCode: 200,
                    responseMessage: "All luck Card show successfully."
                });
            }
        })
    },

    "purchaseUpgradeCard": function(req, res) { //request: date
        var array = [];
        var array1 = [];
        for (j = 0; j < req.body.upgradeCardArr.length; j++) {
            for (var i = 0; i < req.body.upgradeCardArr[j].numberOfCount; i++) {
                var obj = { cash: 0, viewers: 0, type: 'PURCHASED' }
                obj.viewers = req.body.upgradeCardArr[j].cash * 20;
                obj.cash = req.body.upgradeCardArr[j].cash;
                array.push(obj);
                array1.push(parseFloat(req.body.upgradeCardArr[j].cash));
            }
        }
        var sum = array1.reduce(function(a, b) {
            return a + b;
        });
        User.findOne({ _id: req.body.userId, }, function(err, result) {
            if (err) {
                res.send({ responseCode: 500, responseMessage: 'Internal server error' });
            } else if (!result) {
                return res.status(404).send({ responseMessage: "please enter userId" })
            } else if (result.cash <= sum) { res.send({ responseCode: 400, responseMessage: "Insufficient amount of cash in your account" }); } else {
                for (i = 0; i < array.length; i++) {
                    User.findByIdAndUpdate({ _id: req.body.userId }, { $push: { "upgradeCardObject": array[i] }, $set: { cardPurchaseDate: req.body.date } }, { new: true }).exec(function(err, user) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                            console.log("sum-->>", sum)
                        }
                    });
                }
                result.cash -= sum;
                result.save();
                res.send({
                    //result: result,
                    responseCode: 200,
                    responseMessage: "successfully purchased the upgrade card"
                });
            }
        })
    },

    "purchaseLuckCard": function(req, res) { //request: date
        var array = [];
        var array1 = [];
        for (j = 0; j < req.body.luckCardArr.length; j++) {
            for (var i = 0; i < req.body.luckCardArr[j].numberOfCount; i++) {
                var obj = { brolix: 0, chances: 0, type: 'PURCHASED' }
                obj.chances = req.body.luckCardArr[j].brolix / 50;
                obj.brolix = req.body.luckCardArr[j].brolix;
                array.push(obj);
                array1.push(parseFloat(req.body.luckCardArr[j].brolix));
            }
        }
        var sum = array1.reduce(function(a, b) {
            return a + b;
        });
        User.findOne({ _id: req.body.userId, }, function(err, result) {
            if (err) {
                res.send({ responseCode: 500, responseMessage: 'Internal server error' });
            } else if (!result) {
                return res.status(404).send({ responseMessage: "please enter userId" })
            } else if (result.brolix <= sum) { res.send({ responseCode: 400, responseMessage: "Insufficient amount of brolix in your account" }); } else {
                for (i = 0; i < array.length; i++) {
                    User.findByIdAndUpdate({ _id: req.body.userId }, { $push: { "luckCardObject": array[i] }, $set: { cardPurchaseDate: req.body.date } }, { new: true }).exec(function(err, user) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                            console.log("sum--->>>", sum)
                        }
                    });
                }
                result.brolix -= sum;
                result.save();
                res.send({
                    //  result: result,
                    responseCode: 200,
                    responseMessage: "successfully purchased the luck card"
                });
            }
        })
    },

    "useLuckCard": function(req, res) { // userId, adId, Brolix, luckId in request parameter
        var obj = (req.body.luckId);
        if (obj == null || obj == '' || obj === undefined) { res.send({ responseCode: 500, responseMessage: 'please enter luckId' }); } else {
            createNewAds.findOne({ _id: req.body.adId }, function(err, data) {
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!data) return res.status(404).send({ responseMessage: "please enter correct adId" })
                else if (data.winners.length != 0) return res.status(406).send({ responseCode: 406, responseMessage: "Winner allready decided" });
                else if (Boolean(data.luckCardListObject.find(luckCardListObject => luckCardListObject.userId == req.body.userId))) {
                    return res.status(403).send({ responseMessage: "Already used luckCard" })
                } else {
                    var obj = (req.body.luckId);
                    console.log("obj", obj, typeof obj);
                    User.update({ 'luckCardObject._id': obj }, { $push: { 'luckUsedAd': { luckId: obj, adId: req.body.adId } }, $set: { 'luckCardObject.$.status': "INACTIVE" } }, function(err, result) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) return res.status(404).send({ responseMessage: "please enter userId" })
                        else {
                            createNewAds.findByIdAndUpdate({ _id: req.body.adId }, { $push: { "luckCardListObject": { userId: req.body.userId, chances: req.body.chances } } }, { new: true }).exec(function(err, user) {
                                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                                    res.send({
                                        // result: user,
                                        responseCode: 200,
                                        responseMessage: "Successfully used the luck card."
                                    })
                                }

                            })
                        }
                    })
                }
            })
        }
    },

    "useUpgradeCard": function(req, res) { //upgradeId adId viewers cash in request
        waterfall([
            function(callback) {
                var obj = req.body.upgradeId;
                var adId = req.body.adId;
                if (obj == null || obj == '' || obj === undefined) { res.send({ responseCode: 404, responseMessage: 'please enter upgradeId' }); } else if (adId == null || adId == '' || adId === undefined) { res.send({ responseCode: 404, responseMessage: 'please enter adId' }); } else {
                    for (var i = 0; i < obj.length; i++) {
                        console.log("in loop")
                        User.update({ 'upgradeCardObject._id': obj[i] }, { $push: { 'UpgradeUsedAd': { upgradeId: obj[i], adId: adId } }, $set: { 'upgradeCardObject.$.status': "INACTIVE" } }, { multi: true }, function(err, result) {
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 11' }); } else if (!result) return res.status(404).send({ responseMessage: "please enter userId" })
                            else {
                                console.log("in loop 1")
                                    // callback(null)
                            }
                        })
                    }
                    callback(null)
                }
            },
            function(callback) {
                var cash = req.body.cash;
                var viewers = req.body.viewers;
                var adId = req.body.adId;
                console.log("cash--->>", cash)
                console.log("viewers-->>", viewers)
                console.log("adId--->>", adId)
                createNewAds.findOneAndUpdate({ _id: adId }, { $inc: { cash: +cash, viewers: +viewers } }, { new: true }, function(err, result1) {
                    //console.log("add--111->>", result1)
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 22' }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: "No adId found" }); } else {
                        callback(null, result1)
                    }
                })
            },
        ], function(err, result) {
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "Successfully used the upgrade card."
            })
        })
    },

    "facebookLogin": function(req, res) {
        if (req.body.facebookID) { res.send({ responseCode: 500, responseMessage: 'please enter facebookID' }); } else if (!req.body.dob) { res.send({ responseCode: 403, responseMessage: 'Dob required' }); } else if (!req.body.country) { res.send({ responseCode: 403, responseMessage: 'country required' }); }  else if (!req.body.city) { res.send({ responseCode: 403, responseMessage: 'city required' }); } else if (!req.body.mobileNumber) { res.send({ responseCode: 403, responseMessage: 'MobileNumber required' }); } else if (!validator.isEmail(req.body.email)) res.send({ responseCode: 403, responseMessage: 'Please enter the correct email id.' });
        User.findOne({ email: req.body.email, status: 'ACTIVE' }, avoid).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) {
                if (req.body.haveReferralCode == true) {
                    Brolixanddollors.find({ "type": "brolixForInvitation" }).exec(function(err, data) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                            console.log("data-->>", data)
                            var amount = data[0].value;
                            console.log("amount-->>", amount)
                            User.findOneAndUpdate({ referralCode: req.body.referredCode }, { $inc: { brolix: amount } }).exec(function(err, result2) {
                                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                                    req.body.otp = functions.otp();
                                    req.body.referralCode = yeast();
                                    var user = User(req.body)
                                    user.save(function(err, result3) {
                                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
                                        var token = jwt.sign(result3, config.secreteKey);
                                        res.header({
                                            "appToken": token
                                        }).send({
                                            result: result3,
                                            token: token,
                                            responseCode: 200,
                                            responseMessage: "You have been registered successfully."
                                        });
                                    })
                                }
                            })
                        }
                    })
                } else {
                    req.body.referralCode = yeast();
                    var user = new User(req.body);
                    user.save(function(err, result1) {
                        var token = jwt.sign(result1, config.secreteKey);
                        res.header({
                            "appToken": token
                        }).send({
                            result: result1,
                            token: token,
                            responseCode: 200,
                            responseMessage: "Signup successfully."
                        });
                    })
                }
            } else {
                if (result.facebookID == undefined) {
                    res.send({
                        responseCode: 201,
                        responseMessage: "You have already register with app.",
                        user: result
                    });
                } else {
                    User.findOneAndUpdate({ email: req.body.email }, {
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
            }
        })
    },

    "userCashGifts": function(req, res) { // userId in req 
        var userId = req.body.userId;
        User.find({ _id: userId, 'cashPrize.status': "ACTIVE" }).populate('cashPrize.adId').populate('cashPrize.pageId', 'pageName').exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No coupon found" }) } else {
                var obj = result[0].cashPrize;
                var data = obj.filter(obj => obj.status == "ACTIVE");
                res.send({
                    result: data,
                    responseCode: 200,
                    responseMessage: "Cash gifts show successfully."
                })
            }
        })
    },

    "userCouponGifts": function(req, res) { // userId in req 
        var userId = req.body.userId;
        User.find({ _id: userId, 'coupon.status': "ACTIVE" }).populate('coupon.adId').populate('coupon.pageId', 'pageName').exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No coupon found" }) } else {
                var obj = result[0].coupon;
                var data = obj.filter(obj => obj.status == "ACTIVE");
                res.send({
                    result: data,
                    responseCode: 200,
                    responseMessage: "Coupon gifts show successfully."
                })
            }
        })
    },

    "countrys": function(req, res) {
        var countrys = country.all();
        var coutr = [];
        var a = new Array();
        var b = new Object();
        a[0] = b;
        for (var i = 0; i < countrys.length; i++) {
            var data = {
                name: countrys[i].name,
                callingCode: countrys[i].callingCodes,
                code: countrys[i].ISO.alpha2
            }
            coutr.push(data);
        }
        res.send({
            result: coutr,
            responseCode: 200,
            responseMessage: "All countrys list."
        });
    },

    "getAllStates": function(req, res) {
        var name = req.params.name;
        var code = req.params.code;
        console.log(name, code);
        var states = country.states(name, code);
        if (!states) {
            res.send({
                responseCode: 201,
                responseMessage: "No list."
            });
        } else {
            res.send({
                result: states,
                responseCode: 200,
                responseMessage: "All state list."
            });
        }
    },

    "chatHistory": function(req, res, next) {
        console.log('everything-----chatHistorychatHistorychatHistorys-------' + JSON.stringify(req.body));
        var condition;
        if (req.body.pageId) {
            condition = { $or: [{ senderId: req.body.senderId, receiverId: req.body.receiverId, pageId: req.body.pageId }, { senderId: req.body.receiverId, receiverId: req.body.senderId, pageId: req.body.pageId }] }
        } else {
            condition = { $or: [{ senderId: req.body.senderId, receiverId: req.body.receiverId }, { senderId: req.body.receiverId, receiverId: req.body.senderId }] }
        }
        chat.paginate(condition, { page: req.params.pageNumber, limit: 15, sort: { timestamp: -1 } }, function(err, results) {
            if (!results.docs.length) {
                res.send({
                    result: results,
                    responseCode: 403,
                    responseMessage: "No record found."
                });
            } else {
                res.send({
                    result: results,
                    responseCode: 200,
                    responseMessage: "Record found successfully."
                });
            }
        });
    },

    "onlineUserList": function(req, res) {
        var condition;
        if (req.body.pageId) {
            condition = { $or: [{ senderId: req.body.userId, pageId: req.body.pageId }, { receiverId: req.body.userId, pageId: req.body.pageId }] }
        } else {
            condition = { $or: [{ senderId: req.body.userId }, { receiverId: req.body.userId }] }
        }
        chat.aggregate(
            [{
                $match: { $or: [{ senderId: req.body.userId }, { receiverId: req.body.userId }] }
            }, { $sort: { timestamp: -1 } }, {
                $group: {
                    _id: { senderId: "$senderId", receiverId: "$receiverId" },
                    unread: {
                        $sum: {
                            $cond: { if: { $eq: ["$is_read", 0] }, then: 1, else: 0 }
                        }
                    },
                    lastMsg: { $last: "$message" },
                    timestamp: { $last: "$timestamp" },
                    senderImage: { $last: "$senderImage" },
                    receiverImage: { $last: "$receiverImage" },
                    senderName: { $last: "$senderName" },
                    receiverName: { $last: "$receiverName" }
                }
            }]
        ).exec(function(err, result) {
            if (err) res.send({ responseCode: 500, responseMessage: err });
            else if (result.length == 0) res.send({ responseCode: 404, responseMessage: "list empty." });
            else {
                result.sort(function(a, b) {
                    if (a.timestamp < b.timestamp) return -1;
                    if (a.timestamp > b.timestamp) return 1;
                    return 0;
                });
                var obj = [],
                    j;
                console.log("result--->" + JSON.stringify(result));
                for (var i = 0; i < result.length; i++) {
                    result.length - 1 == i ? j = i : j = i + 1;
                    console.log("j--->" + j);
                    while ((result[i]._id.senderId != result[j]._id.receiverId) || (result[j]._id.senderId != result[i]._id.receiverId)) {
                        j += 1;
                    }
                    if (i != j) {
                        result[i].unread += result[j].unread;
                    }
                    obj.push(result[i]);
                    result.splice(j, 1);
                    console.log("length---->" + result.length);
                }
                res.send({
                    result: obj,
                    responseCode: 200,
                    responseMessage: "Record found successfully."
                });
            }

        })
    },

    "winnersFilter": function(req, res) {
        var condition = { $or: [] };
        var obj = req.body;
        Object.getOwnPropertyNames(obj).forEach(function(key, idx, array) {
            if (key == 'cashPrize.cashStatus' || key == 'coupon.couponStatus') {
                var cond = { $or: [] };
                if (key == "cashPrize.cashStatus") {
                    for (data in obj[key]) {
                        condition.$or.push({ 'cashPrize.cashStatus': obj[key][data] })
                    }
                } else {
                    for (data in obj[key]) {
                        condition.$or.push({ 'coupon.couponStatus': obj[key][data] })
                    }
                }
                //condition[key] = cond;
            } else {
                condition[key] = obj[key];
            }
        });
        if (condition.$or.length == 0) {
            delete condition.$or;
        }
        User.find(condition).exec(function(err, result) {
            // console.log("result--->>",result)
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No result found." }) } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Result shown successfully."
                })
            }
        })
    },

    "googleLogin": function(req, res) {
        if (!req.body.googleID) { res.send({ responseCode: 403, responseMessage: 'please enter googleID' }); } else if (!req.body.dob) { res.send({ responseCode: 403, responseMessage: 'Dob required' }); } else if (!req.body.country) { res.send({ responseCode: 403, responseMessage: 'country required' }); }  else if (!req.body.city) { res.send({ responseCode: 403, responseMessage: 'city required' }); } else if (!req.body.mobileNumber) { res.send({ responseCode: 403, responseMessage: 'MobileNumber required' }); } else if (!validator.isEmail(req.body.email)) res.send({ responseCode: 403, responseMessage: 'Please enter the correct email id.' });
        User.findOne({ email: req.body.email, status: 'ACTIVE' }, avoid).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) {
                if (req.body.haveReferralCode == true) {
                    Brolixanddollors.find({ "type": "brolixForInvitation" }).exec(function(err, data) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                            console.log("data-->>", data)
                            var amount = data[0].value;
                            console.log("amount-->>", amount)
                            User.findOneAndUpdate({ referralCode: req.body.referredCode }, { $inc: { brolix: amount } }).exec(function(err, result2) {
                                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                                    req.body.otp = functions.otp();
                                    req.body.referralCode = yeast();
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
                    })
                } else {
                    req.body.referralCode = yeast();
                    var user = new User(req.body);
                    user.save(function(err, result) {
                        var token = jwt.sign(result, config.secreteKey);
                        res.header({
                            "appToken": token
                        }).send({
                            result: result,
                            token: token,
                            responseCode: 200,
                            responseMessage: "Signup successfully."
                        });
                    })
                }
            } else {
                if (result.googleID == undefined) {
                    res.send({ responseCode: 201, responseMessage: "You have already register with app.", user: result });
                } else {
                    User.findOneAndUpdate({ email: req.body.email }, {
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
            }
        })
    },

    "buyCoupon": function(req, res) { // user Id and ad Id and brolix in request
        waterfall([
            function(callback) {
                createNewAds.findOne({ _id: req.body.adId },function(err, result) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error 11" }); }
                    else if (!result) { res.send({ responseCode: 404, responseMessage: "No ad found" }); } 
                    else {
                        if (adResult.adsType == 'cash') {
                    if (adResult.cash > 0) {
                        var type = "storeCouponPriceForUpgradedAds";
                    } else {
                        var type = "storeCouponPriceForFreeAds";
                    }
                } else if (adResult.adsType == 'coupon') {
                    if (adResult.cash > 0) {
                        var type = "storeCouponPriceForUpgradedAds";
                    } else {
                        var type = "storeCouponPriceForFreeAds";
                    }
                }
                console.log("type-->>", type)
                brolixAndDollors.findOne({
                    type: type
                }, function(err, result) {
                     if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error 11" }); }
                    else{
                    var value = result.value
                    callback(null, value)
                    }
                })
                    }
                })                
            },
            function(value,callback) {
                createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $push: { couponSold: req.body.userId }, $inc: { couponPurchased: 1 } },{new:true}, function(err, result) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error 11" }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No ad found" }); } else if (result.couponBuyersLength == result.couponPurchased) { res.send({ responseCode: 201, responseMessage: " All coupon sold out" }); } else {
                        callback(null, value, result.couponCode, result.couponExpiryDate, result.pageId)
                    }
                })
            },
            function(couponCode1, couponExpiryDate1, pageId, callback) {
                User.findOne({ _id: req.body.userId }).exec(function(err, result1) {

                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error 22" }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: "No user found" }); } else if (result1.brolix < req.body.brolix) { res.send({ responseCode: 400, responseMessage: "Insufficient amount of brolix in your account" }); } else {

                        var startTime = new Date().toUTCString();
                        var h = new Date(new Date(startTime).setHours(00)).toUTCString();
                        var m = new Date(new Date(h).setMinutes(00)).toUTCString();
                        var s = Date.now(m)
                        var coupanAge = couponExpiryDate1;
                        var actualTime = parseInt(s) + parseInt(coupanAge);
                        console.log("coupanAge--->>", coupanAge)
                        if (coupanAge == 'NEVER') {
                            console.log("if")
                            var data = {
                                couponCode: couponCode1,
                                adId: req.body.adId,
                                pageId: pageId,
                                type: "PURCHASED",
                                couponExpire: "NEVER"
                            }

                        } else {
                            console.log("else")
                            var data = {
                                couponCode: couponCode1,
                                expirationTime: actualTime,
                                adId: req.body.adId,
                                pageId: pageId,
                                type: "PURCHASED",
                                couponExpire: "YES"
                            }
                        }
                        console.log("data--->>", data)
                        User.findByIdAndUpdate({ _id: req.body.userId }, { $push: { coupon: data }, $inc: { gifts: 1, brolix: -value } }, { new: true }, function(err, result3) {
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error. 33' }); } else {
                                callback(null, result3)
                            }
                        })
                    }
                })
            },
        ], function(err, result) {
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "successfully purchased the coupon."
            })
        })
    },


    "listOfFavouriteCoupon": function(req, res) {
        var userId = req.body.userId
        createNewAds.find({}).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error.' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No ad found." }); } else {
                var array = [];
                for (var i = 0; i < result.length; i++) {
                    for (var j = 0; j < result[i].favouriteCoupon.length; j++) {
                        if (result[i].favouriteCoupon[j] == userId) {
                            array.push(result[i]._id)
                        }
                    }
                }
                createNewAds.paginate({ _id: { $in: array } }, { page: req.params.pageNumber, limit: 8 }, function(err, result) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (result.docs.length == 0) { res.send({ responseCode: 400, responseMessage: "No coupon found in your favourites" }); } else {
                        res.send({
                            result: result,
                            responseCode: 200,
                            responseMessage: "successfully shown the result."
                        })
                    }
                })
            }
        })
    },

    "addRemoveCouponFromFavourite": function(req, res) {
        var adId = req.body.adId;
        var userId = req.body.userId;
        if (req.body.type == "favourite") {
            createNewAds.findOne({ _id: adId }).exec(function(err, result) {
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error.' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No ad found." }); }
                var favouriteCoupon = result.favouriteCoupon;

                var mySet = new Set(favouriteCoupon);
                var has = mySet.has(userId)
                if (has) { res.send({ responseCode: 302, responseMessage: "Already added to favourites." }) } else if (!has) {
                    createNewAds.findOneAndUpdate({ _id: adId }, { $push: { favouriteCoupon: userId } }, { new: true }, function(err, result1) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error.' }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: "No ad found." }); } else {
                            res.send({
                                // result: result1,
                                responseCode: 200,
                                responseMessage: "successfully added to favourite."
                            })
                        }
                    })
                }
            })
        } else {
            createNewAds.findOne({ _id: adId }).exec(function(err, result) {
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error.' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No ad found." }); }
                var favouriteCoupon = result.favouriteCoupon;
                var mySet = new Set(favouriteCoupon);
                var has = mySet.has(userId)
                if (!has) { res.send({ responseCode: 302, responseMessage: "Already removed from favourites." }) } else if (has) {
                    createNewAds.findOneAndUpdate({ _id: adId }, { $pop: { favouriteCoupon: -userId } }, { new: true }, function(err, result1) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error.' }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: "No ad found." }); } else {
                            res.send({
                                //   result: result1,
                                responseCode: 200,
                                responseMessage: "Coupon removed from favourites successfully."
                            })
                        }
                    })
                }
            })
        }
    },

    "couponExchangeOnOff": function(req, res) {
        var userId = req.body.userId;
        var status = req.body.status;
        var obj = req.body.couponId
        if (obj == null || obj == '' || obj === undefined) { res.send({ responseCode: 404, responseMessage: 'please enter couponCode' }); } else {
            User.findOne({ _id: userId }).exec(function(err, result) {
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error.' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No user found." }); } else {
                    User.update({ 'coupon._id': obj }, { $set: { 'coupon.$.exchangeStatus': status } }, { new: true }, function(err, result1) {
                        if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else {
                            res.send({
                                //result: result1,
                                responseCode: 200,
                                responseMessage: "Coupon status changed successfully."
                            })
                        }
                    })
                }
            })
        }
    },

    "sendCouponExchangeRequest": function(req, res) { //  couponCode, receiverId, senderId, exchangedWithAdId, senderCouponId
        waterfall([
            function(callback) {
                var obj = req.body.receiverCouponCode;
                var receiverId = req.body.receiverId;
                var senderId = req.body.senderId;
                var senderCouponId = req.body.senderCouponId;
                var receiverCouponId = req.body.receiverCouponId;
                
                if (!req.body.receiverCouponCode) { res.send({ responseCode: 400, responseMessage: "Receiver coupon code is required" }); } else if (!req.body.receiverId) { res.send({ responseCode: 400, responseMessage: "receiverId is required." }) }
                else if (receiverId == senderId) { res.send({ responseCode: 400, responseMessage: "You can not send the exchange request to yourself." }) }
                else {
                    
                    User.aggregate({ $unwind: '$coupon' }, { $match: { 'coupon._id': new mongoose.Types.ObjectId(receiverCouponId) } }, function(err, user) {
                    console.log("user---->>>",user)
                    console.log("coupon.couponStatus--->>>",JSON.stringify(user[0].coupon.exchangeStatus))
                    if(err){ res.send({ responseCode:500, responseMessage:"Internal server error11."})}
                    else if(!user){res.send({ responseCode:404, responseMessage:"Please enter correct coupon Id."})}
                        else if((user[0].coupon.exchangeStatus) == 'OFF') {
                     res.send({ responseCode: 403, responseMessage: "Exchange request not allowed." })}
                        else{
                           callback(null) 
                        }
                    })
                    
//                    User.findOne({ _id: receiverId }).exec(function(err, result) {
//                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error. 11' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No user found." }); }
//                        else {
//                            User.findOne({ 'coupon.couponCode': obj }, function(err, result1) {   
//                                console.log("result-->>>",result1)
//                                if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error. 22" }); }
//                                else if (Boolean(result1.coupon.find(coupon => coupon.exchangeStatus == "OFF"))) {
//                                    res.send({ responseCode: 403, responseMessage: "Exchange request not allowed." })}
//                                else {
//                                    callback(null)
//                                }
//                            })
//                        }
//                    })
                } //receiverAdId senderAdId
            },
            function(callback) {
                var receiverId = req.body.receiverId;
                var senderId = req.body.senderId;
                var adId = req.body.receiverAdId;
                var senderAdId = req.body.senderAdId;
                var senderCouponCode = req.body.senderCouponCode;
                var senderCouponId = req.body.senderCouponId;
                var receiverCouponId = req.body.receiverCouponId;
                
                if (!req.body.senderId) { res.send({ responseCode: 400, responseMessage: "senderId is required." }) } else if (!req.body.receiverAdId) { res.send({ responseCode: 400, responseMessage: "adId is required." }) } else if (!req.body.senderAdId) { res.send({ responseCode: 400, responseMessage: "exchangedWithAdId is required." }) } else if (!req.body.senderCouponCode) { res.send({ responseCode: 400, responseMessage: "senderCouponCode is required." }) } else {

                    User.findOne({ _id: receiverId }, function(err, result2) {
                        console.log("result2-->>", result2)
                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error. 33' }); } else if (!result2) { res.send({ responseCode: 404, responseMessage: "No user found." }); } else if (result2.privacy.exchangeCoupon == "onlyMe") { res.send({ responseCode: 409, responseMessage: "you are not allowed to send exchange request" }) } else if (result2.privacy.exchangeCoupon == "followers") {

                            var flag = result2.userFollowers.find(userFollowers => userFollowers == senderId)
                            if (flag === undefined) { res.send({ responseCode: 400, responseMessage: "you are not friend" }); } else {

                                createNewAds.findByIdAndUpdate({ _id: adId }, { $push: { "couponExchangeReceived": { senderId: req.body.senderId, receiverId: req.body.receiverId, exchangedWithAdId: senderAdId, senderCouponCode: senderCouponCode } } }, { new: true }).exec(function(err, result3) {

                                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error. 44' }) } else if (!result3) { res.send({ responseCode: 404, responseMessage: "Receiver ad not found." }); } else {

                                        createNewAds.findByIdAndUpdate({ _id: senderAdId }, { $push: { "couponExchangeSent": { senderId: req.body.senderId, receiverId: req.body.receiverId, exchangedWithAdId: adId } } }, { new: true }).exec(function(err, result4) {

                                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error. 55' }) } else if (!result4) { res.send({ responseCode: 404, responseMessage: "Sender ad not found." }); } else {
                                                //  callback(null, result3)
                                            }
                                        })
                                        callback(null, result3)
                                    }
                                })
                            }
                            if (result2.deviceType == 'Android' || result2.notification_status == 'on' || result2.status == 'ACTIVE') {
                                var message = "You have coupon Exchange request";
                                functions.android_notification(result2.deviceToken, message);
                                console.log("Android notification send!!!!")
                            } else if (result2.deviceType == 'iOS' || result2.notification_status == 'on' || result2.status == 'ACTIVE') {
                                functions.iOS_notification(result2.deviceToken, message);
                            } else {
                                console.log("Something wrong!!!!")
                            }
                        } else {
                            createNewAds.findByIdAndUpdate({ _id: adId }, { $push: { "couponExchangeReceived": { senderId: req.body.senderId, receiverId: req.body.receiverId, exchangedWithAdId: senderAdId, senderCouponCode: senderCouponCode } } }, { new: true }).exec(function(err, result5) {
                                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error. 66' }) } else if (!result5) { res.send({ responseCode: 404, responseMessage: "Receiver ad not found." }); } else {

                                    createNewAds.findByIdAndUpdate({ _id: senderAdId }, { $push: { "couponExchangeSent": { senderId: req.body.senderId, receiverId: req.body.receiverId, exchangedWithAdId: adId } } }, { new: true }).exec(function(err, result6) {

                                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error. 77' }) } else if (!result6) { res.send({ responseCode: 404, responseMessage: "Sender ad not found." }); } else {
                                            //  callback(null, result3)
                                        }
                                    })
                                    callback(null, result5)
                                }
                            })
                            if (result2.deviceType == 'Android' || result2.notification_status == 'on' || result2.status == 'ACTIVE') {
                                var message = "You have coupon Exchange request";
                                functions.android_notification(result2.deviceToken, message);
                                console.log("Android notification send!!!!")
                            } else if (result2.deviceType == 'iOS' || result2.notification_status == 'on' || result2.status == 'ACTIVE') {
                                functions.iOS_notification(result2.deviceToken, message);
                            } else {
                                console.log("Something wrong!!!!")
                            }
                        }
                    })
                }
            },
        ], function(err, result) {
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "Coupon exchange request send successfully."
            });
        })
    },

    "seeExchangeRequest": function(req, res) {
        var receiverId = req.body.userId;
        createNewAds.aggregate({ $unwind: '$couponExchangeReceived' }, { $match: { 'couponExchangeReceived.receiverId': receiverId } }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ reponseCode: 404, responseMessage: "Please enter correct adId." }); } else {
                createNewAds.populate(result, {
                    path: 'couponExchangeReceived.senderId',
                    model: 'brolixUser',
                    select: 'firstName lastName image country state city'
                }, function(err, result1) {
                    res.send({
                        result: result1,
                        responseCode: 200,
                        responseMessage: "All request show successfully"
                    })
                })
            }
        })
    },

    "couponRequestsSearch": function(req, res) {
        var re = new RegExp(req.body.firstName, 'i');
        User.find({ status: 'ACTIVE' }).or([{ 'firstName': { $regex: re } }]).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No user found." }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "User show successfully."
                });
            }
        })
    },
   //   User.aggregate({ $unwind: '$coupon' }, { $match: { 'coupon._id': senderCouponId } }, function(err, user) {
    "sendCouponToFollower": function(req, res) {
        waterfall([
            function(callback) {
                var senderCouponId = req.body.senderCouponId;
                var receiverId = req.body.receiverId;
                var senderId = req.body.userId;
                var adId = req.body.adId;
                var couponId = req.body.couponId;
               User.aggregate({ $unwind: '$coupon' }, { $match: { 'coupon._id': new mongoose.Types.ObjectId(senderCouponId) } }, function(err, user) {
                    console.log("user---->>>",user)
                    console.log("coupon.couponStatus--->>>",JSON.stringify(user[0].coupon.couponStatus))
                    if(err){ res.send({ responseCode:500, responseMessage:"Internal server error11."})}
                    else if(!user){res.send({ responseCode:404, responseMessage:"Please enter correct coupon Id."})}
                    else if((user[0].coupon.couponStatus) != 'VALID') {
                     res.send({ responseCode: 403, responseMessage: "Please enter a valid coupon." })}
                    else{
                   User.findOne({ _id: receiverId }, function(err, result) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error12' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No user found." }); } else if (result.privacy.exchangeCoupon == "onlyMe") { res.send({ responseCode: 409, responseMessage: "you are not allowed to send" }) } else {
                        callback(null)
                    }
                })
                    }
                })
            },
            function(callback) { //  receiverId  senderId senderCouponId adId
                console.log("in friends")
                var receiverId = req.body.receiverId;
                var senderId = req.body.senderId;
                var senderCouponId = req.body.senderCouponId;
                var adId = req.body.adId;
                var startTime = new Date().toUTCString();
                var h = new Date(new Date(startTime).setHours(00)).toUTCString();
                var m = new Date(new Date(h).setMinutes(00)).toUTCString();
                var currentTime = Date.now(m);
                User.findOne({ _id: receiverId }, function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 11' }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: "No user found." }); } else if (result1.privacy.exchangeCoupon == "followers") {
                        var flag = result1.userFollowers.find(userFollowers => userFollowers == senderId)
                        if (flag === undefined) { res.send({ responseCode: 400, responseMessage: "you are not friend" }); } else {

                            createNewAds.findOneAndUpdate({ _id: adId }, { $push: { "couponSend": { senderId: senderId, receiverId: receiverId, sendDate: currentTime } } }).exec(function(err, result2) {
                                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 22' }); } else if (!result2) { res.send({ responseCode: 404, responseMessage: "No ad found." }); } else {

                                    User.findOneAndUpdate({ 'coupon._id': senderCouponId }, { $set: { "coupon.$.status": "SEND" }, $inc: { gifts: -1 } }, { new: true }).exec(function(err, result3) {
                                        console.log("result3--->>", result3)
                                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 33' }); } else if (!result3) { res.send({ responseCode: 404, responseMessage: "No ad found." }); } else {
                                            for (i = 0; i < result3.coupon.length; i++) {
                                                if (result3.coupon[i]._id == senderCouponId) {
                                                    var couponCode = result3.coupon[i].couponCode;
                                                    var couponAdId = result3.coupon[i].adId;
                                                    var expirationTime = result3.coupon[i].expirationTime;
                                                    var pageId = result3.coupon[i].pageId;
                                                    var type = "SEND BY FOLLOWER";
                                                }
                                            }
                                            console.log("couponAdId--->>>", couponAdId)
                                            User.findOneAndUpdate({ _id: receiverId }, { $push: { 'coupon': { couponCode: couponCode, adId: couponAdId, expirationTime: expirationTime, pageId: pageId, type: type }, "notification": { userId: req.body.senderId, type: "I have sent you a coupon", notificationType: 'couponReceived' } }, $inc: { gifts: 1 } }, { new: true }).exec(function(err, result4) {
                                                console.log("result4--->>>", result4)
                                                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 44' }); } else if (!result4) { res.send({ responseCode: 404, responseMessage: "No user found." }); } else { callback(null, result4) }

                                                if (result4.deviceType == 'Android' || result4.notification_status == 'on' || result4.status == 'ACTIVE') {
                                                    var message = "you have one coupon exchange request";
                                                    functions.android_notification(result4.deviceToken, message);
                                                    console.log("Android notification send!!!!")
                                                } else if (result4.deviceType == 'iOS' || result4.notification_status == 'on' || result4.status == 'ACTIVE') {
                                                    functions.iOS_notification(result4.deviceToken, message);
                                                } else {
                                                    console.log("Something wrong!!!!")
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }

                    } else {
                        console.log("in public")
                        var receiverId = req.body.receiverId;
                        var senderId = req.body.senderId;
                        var senderCouponId = req.body.senderCouponId;
                        var adId = req.body.adId;
                        var startTime = new Date().toUTCString();
                        var h = new Date(new Date(startTime).setHours(00)).toUTCString();
                        var m = new Date(new Date(h).setMinutes(00)).toUTCString();
                        var currentTime = Date.now(m);
                        createNewAds.findOneAndUpdate({ _id: adId }, { $push: { "couponSend": { senderId: senderId, receiverId: receiverId, sendDate: currentTime } } }).exec(function(err, result2) {
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 22' }); } else if (!result2) { res.send({ responseCode: 404, responseMessage: "No ad found." }); } else {

                                User.findOneAndUpdate({ 'coupon._id': senderCouponId }, { $set: { "coupon.$.status": "SEND" }, $inc: { gifts: -1 } }, { new: true }).exec(function(err, result3) {
                                    console.log("result3--->>", result3)
                                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 33' }); } else if (!result3) { res.send({ responseCode: 404, responseMessage: "No ad found." }); } else {
                                        for (i = 0; i < result3.coupon.length; i++) {
                                            if (result3.coupon[i]._id == senderCouponId) {
                                                var couponCode = result3.coupon[i].couponCode;
                                                var couponAdId = result3.coupon[i].adId;
                                                var expirationTime = result3.coupon[i].expirationTime;
                                                var pageId = result3.coupon[i].pageId;
                                                var type = "SENDBYFOLLOWER";
                                            }
                                        }
                                        User.findOneAndUpdate({ _id: receiverId }, { $push: { 'coupon': { couponCode: couponCode, adId: couponAdId, expirationTime: expirationTime, pageId: pageId, type: type }, "notification": { userId: req.body.senderId, type: "I have sent you a coupon", notificationType: 'couponReceived' } }, $inc: { gifts: 1 } }, { new: true }).exec(function(err, result4) {
                                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 44' }); } else if (!result4) { res.send({ responseCode: 404, responseMessage: "No user found." }); } else { callback(null, result4) }
                                            if (result4.deviceType == 'Android' || result4.notification_status == 'on' || result4.status == 'ACTIVE') {
                                                var message = "you have one coupon exchange request";
                                                functions.android_notification(result4.deviceToken, message);
                                                console.log("Android notification send!!!!")
                                            } else if (result4.deviceType == 'iOS' || result4.notification_status == 'on' || result4.status == 'ACTIVE') {
                                                functions.iOS_notification(result4.deviceToken, message);
                                            } else {
                                                console.log("Something wrong!!!!")
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            },
        ], function(err, result) {
            res.send({
                // result: result,
                responseCode: 200,
                responseMessage: "Coupon send successfully"
            });
        })
    },

    "acceptDeclineCouponRequest": function(req, res) { //receiverRequestId senderCouponCode senderId receiverId receiverCouponCode status
        if (req.body.status == 'accepted') {
            waterfall([
                function(callback) {
                    var receiverRequestId = req.body.receiverRequestId;
                    var startTime = new Date().toUTCString();
                    var h = new Date(new Date(startTime).setHours(00)).toUTCString();
                    var m = new Date(new Date(h).setMinutes(00)).toUTCString();
                    var currentTime = Date.now(m);
                    if (!req.body.receiverRequestId) { res.send({ responseCode: 400, responseMessage: "Receiver RequestId is required" }); } else {
//                        createNewAds.findOne({ 'couponExchangeReceived._id': receiverRequestId }).exec(function(err, result) {
//                            console.log("ads --result--->>>",result)
                        createNewAds.aggregate({ $unwind: '$couponExchangeReceived' }, { $match: { 'couponExchangeReceived._id': new mongoose.Types.ObjectId(receiverRequestId) } }, function(err, user) {
                    console.log("user---->>>",user)
                    console.log("coupon.couponExchangeStatus--->>>",JSON.stringify(user[0].couponExchangeReceived.couponExchangeStatus))
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 11' }); }
                            else if (!user) { res.send({ responseCode: 404, responseMessage: "No ad found." }); }
                            else if((user[0].couponExchangeReceived.couponExchangeStatus) == 'ACCEPTED') {
                     res.send({ responseCode: 403, responseMessage: "Coupon is already exchanged with someone else." })}
                            else {
                                createNewAds.findOneAndUpdate({ 'couponExchangeReceived._id': receiverRequestId }, { $set: { "couponExchangeReceived.$.couponExchangeStatus": "ACCEPTED" } }, { new: true }).exec(function(err, result) {
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 11' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No ad found." }); } else { callback(null) }
                        }) }
                        })
                    }
                },
                function(callback) {
                    var h = new Date(new Date(startTime).setHours(00)).toUTCString();
                    var m = new Date(new Date(h).setMinutes(00)).toUTCString();
                    var currentTime = Date.now(m);
                    var senderId = req.body.senderId;
                    var senderCouponCode = req.body.senderCouponCode;
                    if (!req.body.senderId) { res.send({ responseCode: 400, responseMessage: "SenderId is required" }); } else if (!req.body.senderCouponCode) { res.send({ responseCode: 400, responseMessage: "SenderCouponCode is required" }); } else {
                        User.findOneAndUpdate({ 'coupon.couponCode': senderCouponCode }, { $set: { "coupon.$.status": "EXCHANGED" } }, { new: true }).exec(function(err, result1) {
                            console.log("result-->>", result1)
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 22' }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: "No user found. 11" }); } else {

                                User.findOne({ 'coupon.couponCode': senderCouponCode }).exec(function(err, result2) {
                                    console.log("senderCouponCode------->>", result2)
                                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 33' }); } else if (!result2) { res.send({ responseCode: 404, responseMessage: "No user found. 22" }); } else {
                                        for (i = 0; i < result2.coupon.length; i++) {
                                            console.log("result2.coupon-->>", result2.coupon)
                                            if (result2.coupon[i].couponCode == senderCouponCode) {
                                                var couponCode = result2.coupon[i].couponCode;
                                                var couponAdId = result2.coupon[i].adId;
                                                var expirationTime = result2.coupon[i].expirationTime;
                                                var pageId = result2.coupon[i].pageId;
                                                var type = "EXCHANGED"
                                            }
                                        }
                                        callback(null, couponCode, couponAdId, expirationTime, pageId, type)
                                    }
                                })
                            }
                        })
                    }
                },
                function(couponCode1, couponAdId1, expirationTime1, pageId1, type1, callback) {
                    console.log("couponCode-11-->>", couponCode1);
                    console.log("couponId-11-->>", couponAdId1);
                    console.log("expirationTime-11-->>>", expirationTime1);
                    console.log("pageId1-11-->>>", pageId1);
                    console.log("type1-11-->>>", type1);

                    var h = new Date(new Date(startTime).setHours(00)).toUTCString();
                    var m = new Date(new Date(h).setMinutes(00)).toUTCString();
                    var currentTime = Date.now(m);
                    var receiverId = req.body.receiverId;
                    var receiverCouponCode = req.body.receiverCouponCode;
                    if (receiverId == undefined || receiverId == null || receiverId == '') { res.send({ responseCode: 400, responseMessage: "receiverId is required" }); } else if (receiverCouponCode == undefined || receiverCouponCode == null || receiverCouponCode == '') { res.send({ responseCode: 400, responseMessage: "ReceiverCouponCode is required" }); } else {

                        var data = {
                            couponCode: couponCode1,
                            adId: couponAdId1,
                            expirationTime: expirationTime1,
                            pageId: pageId1,
                            type: type1
                        }

                        User.findOneAndUpdate({ _id: receiverId }, { $push: { coupon: data } }, { new: true }).exec(function(err, result3) {
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 44' }); } else if (!result3) { res.send({ responseCode: 404, responseMessage: "No user found. 33" }); } else {

                                User.findOneAndUpdate({ 'coupon.couponCode': receiverCouponCode }, { $set: { "coupon.$.status": "EXCHANGED" } }, { new: true }).exec(function(err, result4) {
                                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 55' }); } else if (!result4) { res.send({ responseCode: 404, responseMessage: "No user found. 44" }); } else {

                                        User.findOne({ 'coupon.couponCode': receiverCouponCode }).exec(function(err, result5) {
                                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 66' }); } else if (!result5) { res.send({ responseCode: 404, responseMessage: "No user found. 55" }); } else {
                                                for (i = 0; i < result5.coupon.length; i++) {
                                                    if (result5.coupon[i].couponCode == receiverCouponCode) {
                                                        var couponCode2 = result5.coupon[i].couponCode;
                                                        var couponAdId2 = result5.coupon[i].adId;
                                                        var expirationTime2 = result5.coupon[i].expirationTime;
                                                        var pageId2 = result5.coupon[i].pageId;
                                                        var type2 = "EXCHANGED"
                                                    }
                                                }
                                                callback(null, couponCode2, couponAdId2, expirationTime2, pageId2, type2)
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }

                },
                function(couponCode2, couponAdId2, expirationTime2, pageId2, type2, callback) {
                    console.log("couponCode-22-->>", couponCode2);
                    console.log("couponId-22-->>", couponAdId2);
                    console.log("expirationTime-22-->>>", expirationTime2);
                    console.log("pageId2-22-->>>", pageId2);
                    console.log("type2-22-->>>", type2);

                    var receiverId = req.body.receiverId;
                    var h = new Date(new Date(startTime).setHours(00)).toUTCString();
                    var m = new Date(new Date(h).setMinutes(00)).toUTCString();
                    var currentTime = Date.now(m);
                    var senderId = req.body.senderId;
                    if (senderId == undefined || senderId == null || senderId == '') { res.send({ responseCode: 400, responseMessage: "SenderId is required" }); } else {
                        var data1 = {
                            couponCode: couponCode2,
                            adId: couponAdId2,
                            expirationTime: expirationTime2,
                            pageId: pageId2,
                            type: type2
                        }

                        User.findOneAndUpdate({ _id: senderId }, { $push: { coupon: data1 } }, { new: true }).exec(function(err, result6) {
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 77' }); } else if (!result6) { res.send({ responseCode: 404, responseMessage: "No user found. 66" }); } else {
                                callback(null, result6)
                            }
                        })
                    }
                },
            ], function(err, result) {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Coupon exchanged successfully"
                });
            })
        } else {
            var receiverRequestId = req.body.receiverRequestId;
            var startTime = new Date().toUTCString();
            var h = new Date(new Date(startTime).setHours(00)).toUTCString();
            var m = new Date(new Date(h).setMinutes(00)).toUTCString();
            var currentTime = Date.now(m);
            if (receiverRequestId == undefined || receiverRequestId == null || receiverRequestId == '') { res.send({ responseCode: 400, responseMessage: "ReceiverRequestId is required." }); } else {
                createNewAds.findOneAndUpdate({ 'couponExchange._id': receiverRequestId }, { $set: { "couponExchange.$.couponExchangeStatus": "DECLINED" } }, { new: true }).exec(function(err, result) {
                    console.log("result-->.", result)
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 11' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No ad found." }); } else {
                        res.send({
                            responseCode: 400,
                            responseMessage: "User declined your request."
                        })
                    }
                })
            }
        }
    },

    "registerWithRefferalCode": function(req, res) {
        User.paginate({ referredCode: req.body.referralCode }, { page: req.params.pageNumber, limit: 8 }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result.docs.length == 0) { res.send({ responseCode: 404, responseMessage: "No user found." }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "All user shows successfully"
                });
            }
        })
    },

    "useCouponWithoutCode": function(req, res) {
        var couponId = req.body.couponId;
        var adId = req.body.adId;
        User.find({ 'coupon._id': couponId }).exec(function(err, result) {
            console.log(result)
            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No user found" }); }
            // else if (Boolean(result.coupon.find(coupon => coupon.couponStatus == "EXPIRED"))) { res.send({ responseCode: 400, responseMessage: "Coupon is expired" }); } else if (Boolean(result.coupon.find(coupon => coupon.couponStatus == "USED"))) { res.send({ responseCode: 400, responseMessage: "Coupon is already used" }); } 
            else {
                User.update({ 'coupon._id': couponId }, { $set: { 'coupon.$.couponStatus': "USED", 'coupon.$.usedCouponDate': Date.now() } }, { new: true }, function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else {
                        createNewAds.update({ _id: adId }, { $set: { 'couponStatus': "USED" } }, function(err, result2) {
                            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!result2) { res.send({ responseCode: 404, responseMessage: "No user found" }); } else {
                                res.send({
                                    // result: result2,
                                    responseCode: 200,
                                    responseMessage: "Coupon used successfully."
                                })
                            }
                        })
                    }
                })
            }
        })
    },

    "winnersFilterCodeBasis": function(req, res) {
        var pageId = req.body.pageId;
        var name = req.body.name;
        if (req.body.type == 'withCode') {
            if (!(req.body.name == null || req.body.name == undefined || req.body.name == '')) {
                var condition = { 'hiddenGifts.pageId': pageId, 'hiddenGifts.status': "ACTIVE", 'firstName': name }
            } else {
                var condition = { 'hiddenGifts.pageId': pageId, 'hiddenGifts.status': "ACTIVE" }
            }
            User.aggregate({ $unwind: "$hiddenGifts" }, { $match: condition }).exec(function(err, result1) {
                if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (result1.length == 0) { res.send({ responseCode: 404, responseMessage: "No user found" }); } else {
                    res.send({
                        result: result1,
                        responseCode: 200,
                        responseMessage: "User show successfully."
                    })
                }
            })
        } else {

            if (!(req.body.name == null || req.body.name == undefined || req.body.name == '')) {
                var condition = { 'coupon.pageId': pageId, 'coupon.status': "ACTIVE", 'firstName': name }
            } else {
                var condition = { 'coupon.pageId': pageId, 'coupon.status': "ACTIVE" }
            }

            console.log("condition--->>", condition)
            User.aggregate([{ $unwind: "$coupon" }, { $match: condition }]).exec(function(err, result2) {

                if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (result2.length == 0) { res.send({ responseCode: 404, responseMessage: "No user found" }); } else {
                    res.send({
                        result: result2,
                        responseCode: 200,
                        responseMessage: "User show successfully."
                    })
                }
            })
        }
    },

    "useCouponWithCode": function(req, res) {
        var couponId = req.body.couponId;
        User.findOne({ 'hiddenGifts._id': couponId }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No user found" }); } else if (Boolean(result.hiddenGifts.find(hiddenGifts => hiddenGifts.status == "USED"))) { res.send({ responseCode: 400, responseMessage: "Coupon is already used" }); } else {
                User.update({ 'hiddenGifts._id': couponId }, { $set: { 'hiddenGifts.$.status': "USED" } }, { new: true }, function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else {
                        res.send({
                            // result: result2,
                            responseCode: 200,
                            responseMessage: "Coupon used successfully."
                        })
                    }
                })
            }
        })
    },

    "seeExchangeSentRequest": function(req, res) {
        var senderId = req.body.userId;
        console.log("receiverId-->>", senderId)
        createNewAds.aggregate({ $unwind: '$couponExchangeSent' }, { $match: { 'couponExchangeSent.senderId': senderId } }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ reponseCode: 404, responseMessage: "Please enter correct adId." }); } else {

                createNewAds.populate(result, {
                    path: 'couponExchangeSent.receiverId',
                    model: 'brolixUser',
                    select: 'firstName lastName image country state city'
                }, function(err, result1) {
                    res.send({
                        result: result1,
                        responseCode: 200,
                        responseMessage: "All request show successfully"
                    })
                })
            }
        })
    },

    "savePaymentRequest": function(req, res) {
        var payment = paypalPayment(req.body)
        payment.save(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
            //  var token = jwt.sign(result, config.secreteKey);
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "Data saved successfully."
            });
        })
    },

    "blockUserSearch": function(req, res) {
        followerList.find({ userId: req.body.userId, followerStatus: "block" }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                var arr = [];
                result.forEach(function(result) {
                    arr.push(result.blockUserId)
                    console.log("arrr========");
                    console.log(arr);
                })
                var re = new RegExp(req.body.search, 'i');
                User.find({ $and: [{ _id: { $in: arr } }, { 'pageName': { $regex: re } }] }, function(err, newResult) {
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

    "userNotification": function(req, res) {
        User.find({ _id: req.body.userId }, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No user found" }); } else {
                var obj = result[0].notification;
                var sortArray = obj.sort(function(obj1, obj2) {
                    return obj2.CreatedAt - obj1.CreatedAt
                })
                res.send({
                    result: sortArray,
                    responseCode: 200,
                    responseMessage: "All details show successfully."
                });
            }
        })
    },




}











cron.schedule('*/2 * * * *', function() {
    User.find({ 'coupon.couponStatus': "VALID" }).exec(function(err, result) {
        if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); }
        //  else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No coupon found" }); }
        else {
            console.log("<<--else-->>")
            var array = [];
            var array1 = [];
            var startTime = new Date().toUTCString();
            var h = new Date(new Date(startTime).setHours(00)).toUTCString();
            var m = new Date(new Date(h).setMinutes(00)).toUTCString();
            var currentTime = Date.now(m)
            console.log("<<--currentTime-->>", currentTime)
            for (var i = 0; i < result.length; i++) {
                for (var j = 0; j < result[i].coupon.length; j++) {
                    if (currentTime >= new Date(result[i].coupon[j].expirationTime)) {
                        array.push(result[i].coupon[j]._id);
                        array1.push(result[i].coupon[j].adId)
                    } else {
                        console.log("time is not equal")
                    }
                }
            }
            for (var i = 0; i < array.length; i++) {
                User.update({ 'coupon._id': array[i] }, { $set: { 'coupon.$.couponStatus': "EXPIRED" } }, { multi: true }, function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else {
                        createNewAds.update({ _id: { $in: array1 } }, { $set: { 'couponStatus': "EXPIRED" } }, function(err, result) {
                            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else {

                            }

                        })

                    }
                })
            }
        }
        // res.send({
        //     result: result,
        //     responseCode: 200,
        //     responseMessage: "data shown successfully"
        // })
    })
})
