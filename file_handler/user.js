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
    var addsComments = require("./model/addsComments");
    var mongoose = require('mongoose');
    var Twocheckout = require('2checkout-node');
    var async = require('async');
    var _ = require('underscore');
    var createNewPage = require("./model/createNewPage");  

//    cloudinary.config({
//        cloud_name: 'mobiloitte-in',
//        api_key: '188884977577618',
//        api_secret: 'MKOCQ4Dl6uqWNwUjizZLzsxCumE'
//    });

// old live
//cloudinary.config({
//    cloud_name: 'brolix1',
//    api_key: '779861163245424',
//    api_secret: 'l_zjtpckfRSlPT9oPHmwshHc6Wc'
//});

// new live (Nikhil)
cloudinary.config({
    cloud_name: 'brolix',
    api_key: '456836683129927',
    api_secret: 'cc6TibFxS8Rh656bTCc2war9YEE'
});

/* yazan's account */
//cloudinary.config({
//    cloud_name: 'brolix',
//    api_key: '779861163245424',
//    api_secret: 'cc6TibFxS8Rh656bTCc2war9YEE'
//});


    var avoid = {
        "password": 0
    }
    //<--------------------------------------------I18n------------------------------------------------->
    var configs = {
        "lang": "ar",
        "langFile": "./../../translation/locale.json" //relative path to index.js file of i18n-nodejs module 
    }
    i18n_module = require('i18n-nodejs');
    //<------------------------------------------------------------------------------------------------>


    i18n = new i18n_module(configs.lang, configs.langFile);

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
    var MassPay = require('node-paypal-masspayments')

    var paytabs = require('paytabs');

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

    var Paypal = require('paypal-adaptive');

    var paypalSdk = new Paypal({
        userId: 'prashant.dwivedi-facilitator_api1.mobiloitte.com',
        password: '965ZNT59L9JKEZ5N',
        signature: 'AiPC9BjkCyDFQXbSkoZcgqH3hpacAv24ACqokwcC-LOvDidqgZgRZ8rS',
        sandbox: true //defaults to false
    });

    module.exports = {

        "success": function(req, res) {
            var params = {
                payKey: 'AP-1WT665016G226315H'
            };
            var payKey = 'AP-1WT665016G226315H'
            var paymentId = req.session.paymentId;
            var payerId = 'AP-1WT665016G226315H'

            var details = { "payer_id": payerId };
            paypal.payment.execute(paymentId, details, function(error, payment) {
                if (error) {
                    console.log(error);
                } else {
                    res.send("Hell yeah!");
                }
            });
        },

        "getCash": function(req, res) {
            i18n = new i18n_module(req.body.lang, configs.langFile);
            var mp = new MassPay({
                pwd: "QN3GR5N6JAV6A22H",
                user: "robinsuraj-facilitator_api1.gmail.com",
                signature: "AFcWxV21C7fd0v3bYYYRCpSSRl31AUdr.q6iklhOMRLo-CjEkoGuwBUD",
                emailsubject: "robinsuraj@gmail.com"
            });
            var unixname = "BROLIX" + Date.now();
            var paymentRequests = [{
                email: req.body.paypalEmail,
                amount: req.body.amount,
                uniqueId: unixname,
                note: 'request for matt@gc'
            }];
            var batch = new MassPay.PaymentBatch(paymentRequests);
            User.findOne({ _id: req.body.userId }).exec(function(err, user) {
                if (err) { res.send({ responseCode: 500, responseMessage: i18n.__("Internal server error") }); } else if (!user) { res.send({ responseCode: 404, responseMessage: "User not found" }); } else {
                    console.log("user", user)
                    waterfall([
                        function(callback) {
                            if (user.cash >= req.body.amount) {
                                mp.pay(batch, function(err, results) {
                                    if (err) {
                                        console.log("error", err)
                                        res.send({
                                            responseCode: 404,
                                            responseMessage: i18n.__("Insufficent balance on admin account")
                                        })
                                    } else {
                                        console.log("mass pay results=>", results)
                                        callback(null, results)
                                    }
                                    //assert.equal(results.ACK, 'Success')
                                });
                            } else {
                                res.send({ responseCode: 404, responseMessage: i18n.__("Please enter valid amount") });
                            }
                        },
                        function(results, callback) {
                            var cashAmount = user.cash - req.body.amount;
                            User.findByIdAndUpdate({ _id: req.body.userId }, { $set: { cash: cashAmount } }, function(err, userRes) {
                                if (err) { res.send({ responseCode: 500, responseMessage: i18n.__("Internal server error") }); } else if (!userRes) { res.send({ responseCode: 404, responseMessage: i18n.__("Something went wrong") }); } else {
                                    //  res.send({ responseCode: 200, responseMessage: "Success.", result:results });
                                    callback(null, userRes, results)
                                }
                            })
                        },
                        function(response, paymentResults, callback) {
                            var details = {
                                paymentMode: "getCash",
                                userId: req.body.userId,
                                amount: req.body.amount,
                                //  paymentAmount: value.paymentAmount,
                                dates: req.body.date,
                                // brolixAmount: value.brolixAmount,
                                transcationId: paymentResults.CORRELATIONID,
                                Type: "getCash"
                            }
                            var payment = new Payment(details);
                            payment.save(function(err, paymentResult) {
                                if (err) { res.send({ responseCode: 500, responseMessage: i18n.__("Internal server error") }); } else if (!paymentResult) { res.send({ responseCode: 404, responseMessage: i18n.__("Something went wrong") }); } else {
                                    callback(null, paymentResult)
                                }
                            })
                        },
                    ], function(err, result) {
                        if (err) { res.send({ responseCode: 500, responseMessage: i18n.__("Internal server error") }); } else if (!result) { res.send({ responseCode: 404, responseMessage: i18n.__("Something went wrong") }); } else {
                            res.send({ responseCode: 200, responseMessage: i18n.__("Successfully get cash amount") });
                        }
                    })
                }
            })

        },

        "validatorPaytabs": function(req, res) {
            var createPayPage = new Object()
//            createPayPage.merchant_email = 'sakshigadia@gmail.com';
            createPayPage.merchant_email = 'yazan@brolix.com';
            createPayPage.paytabs_url = 'https://www.paytabs.com/apiv2/';
//            createPayPage.secret_key = "jwjn4lgU2sZqPqsB2Da3zNJIJwaUX8mgFGDJ2UE5nEvc4XO7BYaaMTSwq3qncNDRthAvbeAyT6LX3z4EyfPk8HQzLhWX4AOyRp42";
             createPayPage.secret_key = "crzvAlMh1PL125QF0qQJy7kE32ZNz9OMAohaJ4rLTdNWiDBi4s1CAlgDogqYpfK0D2an6C80QVX8zzrD2tgCPxfdNGbcWWdzZoW6";
            createPayPage.site_url = "http://localhost:8082";
            createPayPage.return_url = "http://localhost:8082";
            createPayPage.title = "some title";
            createPayPage.cc_first_name = "ALGHABBAn";
            createPayPage.cc_last_name = "ALGHABBAN";
            createPayPage.cc_phone_number = "996";
            createPayPage.phone_number = "50000000";
            createPayPage.email = "clinet@outlook.com";
            createPayPage.products_per_title = "some title";
            createPayPage.unit_price = 150;
            createPayPage.quantity = "1";
            createPayPage.other_charges = 0;
            createPayPage.amount = 150;
            createPayPage.discount = 0;
            createPayPage.currency = "AED";
            createPayPage.reference_no = "21873109128";
            createPayPage.ip_customer = "192.168.1.1";
            createPayPage.ip_merchant = "192.168.1.1";
            createPayPage.billing_address = "Flat 11 Building 222 Block 333 Road 444 Riydh";
            createPayPage.state = "Riydh";
            createPayPage.city = "Riydh";
            createPayPage.postal_code = "12345";
            createPayPage.country = "ARE";
            createPayPage.shipping_first_name = "Clinicarea";
            createPayPage.shipping_last_name = "app";
            createPayPage.address_shipping = "Flat abc road 123";
            createPayPage.city_shipping = "Riydh";
            createPayPage.state_shipping = "Riydh";
            createPayPage.postal_code_shipping = "403129";
            createPayPage.country_shipping = "SAU";
            createPayPage.msg_lang = "ar";
            createPayPage.cms_with_version = "1.0.0";
            paytabs.CreatePayPage(createPayPage, function(response) {
                console.log("paytabs", response);
            });
            //         paytabs.ValidateSecretKey("sakshigadia@gmail.com", "jwjn4lgU2sZqPqsB2Da3zNJIJwaUX8mgFGDJ2UE5nEvc4XO7BYaaMTSwq3qncNDRthAvbeAyT6LX3z4EyfPk8HQzLhWX4AOyRp42", function(response){
            //   console.log(response);
            // });

             paytabs.ValidateSecretKey("yazan@brolix.com", "crzvAlMh1PL125QF0qQJy7kE32ZNz9OMAohaJ4rLTdNWiDBi4s1CAlgDogqYpfK0D2an6C80QVX8zzrD2tgCPxfdNGbcWWdzZoW6", function(response){
               console.log(response);
             });

        },

        // User Signup api
        "signup": function(req, res) {
            i18n = new i18n_module(req.body.lang, configs.langFile);
            waterfall([
                function(callback) {
                    if (!req.body.email) { res.send({ responseCode: 403, responseMessage: i18n.__('Email required') }); } else if (!req.body.password) { res.send({ responseCode: 403, responseMessage: i18n.__('password required') }); } else if (!req.body.gender) { res.send({ responseCode: 403, responseMessage: i18n.__("gender required") }); } else if (!req.body.dob) { res.send({ responseCode: 403, responseMessage: i18n.__("dob required") }); } else if (!validator.isEmail(req.body.email)) { res.send({ responseCode: 403, responseMessage: i18n.__("Please enter the correct email id.") }); } else {
                        User.findOne({ email: req.body.email, isVerified: 'TRUE' }, function(err, result) {
                            if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }); } else if (result) { res.send({ responseCode: 401, responseMessage: i18n.__("Email id must be unique.") }); } else {
                                if (req.body.haveReferralCode == true) {
                                    User.findOne({ referralCode: req.body.referredCode }, function(err, user) {
                                        if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }); } else if (!user) { res.send({ responseCode: 400, responseMessage: i18n.__("Please enter valid referralcode") }); } else {
                                            callback(null)
                                        }
                                    })
                                } else {
                                    callback(null)
                                }
                            }
                        })
                    }
                },
                function(callback) {
                    if (!req.body.country) { res.send({ responseCode: 403, responseMessage: i18n.__('country required') }); } else if (!req.body.city) { res.send({ responseCode: 403, responseMessage: i18n.__("city required") }); } else if (!req.body.mobileNumber) { res.send({ responseCode: 403, responseMessage: i18n.__("MobileNumber required") }); } else if (!req.body.countryCode) { res.send({ responseCode: 403, responseMessage: i18n.__("Country code required") }) } else {
                        if (!validator.isNumeric((req.body.mobileNumber).toString())) { res.send({ responseCode: 403, responseMessage: i18n.__("Mobile number must be numeric") }); } else if (!validator.isLength((req.body.mobileNumber).toString(), { min: 9, max: 12 })) { res.send({ responseCode: 403, responseMessage: i18n.__("Mobile number length must be 9 to 12.") }); } else {
                            User.findOne({ mobileNumber: req.body.mobileNumber, countryCode: req.body.countryCode, isVerified: 'TRUE' }, function(err, result1) {
                                console.log("3")
                                if (err) { res.send({ responseCode: 403, responseMessage: i18n.__('Internal server error') }); } else if (result1) { res.send({ responseCode: 401, responseMessage: i18n.__("Mobile number must be unique") }) } else {
                                    if (req.body.haveReferralCode == true) {
                                        Brolixanddollors.find({ "type": "brolixForInvitation" }).exec(function(err, data) {
                                            if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }); } else {
                                                var amount = data[0].value;
                                                User.findOneAndUpdate({ referralCode: req.body.referredCode }, { $inc: { brolix: amount } }, { new: true }).exec(function(err, result2) {
                                                    if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }); } else {
                                                        req.body.brolix = amount;
                                                        callback(null)
                                                    }
                                                })
                                            }
                                        })

                                    } else {
                                        callback(null)
                                    }
                                }
                            })
                        }
                    }
                },
                function(callback) {
                    req.body.otp = functions.otp();
                    req.body.referralCode = yeast();
                    var user = User(req.body)
                    user.save(function(err, result) {
                        if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }); } else {
                            var token_data = {
                                _id: result._id,
                                status: result.status
                            }
                            var token = jwt.sign(token_data, config.secreteKey);
                            callback(null, token, result)
                        }
                    })
                },
            ], function(err, token, result) {
                res.send({
                    token: token,
                    result: result,
                    responseCode: 200,
                    responseMessage: i18n.__("You have been register successfully")
                })
            })
        },

        // send otp api
        "sendOtp": function(req, res) {
            i18n = new i18n_module(req.body.lang, configs.langFile);
            var otpTy = functions.otp();
            waterfall([
                function(callback) {
                    var twilio = require("twilio");
                    var accountSid = 'AC533eb1474ed6ffa9435ed696bba90640';
                    var authToken = '83635a75374932b24b16db7609825480';
                    var client = new twilio(accountSid, authToken);
                    client.messages.create({
                        body: otpTy,
                        to: "+918853735932",
                        from: '+18306269536'
                    }).then((message) =>
                        callback(null)
                    );
                },
                function(callback) {
                    console.log("null")
                    var transporter = nodemailer.createTransport({
                        service: 'Gmail',
                        auth: {
                            user: "test.avi201@gmail.com",
                            pass: "Mobiloitte1"
                        }
                    });

                    var to = req.body.email
                    var mailOption = {
                        from: "test.avi201@gmail.com",
                        to: req.body.email,
                        subject: 'Brolix verification code.',
                        text: 'Please verfiy using this otp',
                        html: "Your verification code is :" + otpTy
                    }
                    console.log("data in req" + req.body.email);

                    transporter.sendMail(mailOption, function(error, info) {
                        if (error) { res.send({ responseCode: 400, responseMessage: i18n.__("Internal server error") }) } else {
                            // console.log("updated password is : " + link);
                            User.findOneAndUpdate({ _id: req.body.id }, {
                                $set: {
                                    otp: otpTy
                                }
                            }, function(err, results) {
                                if (err) { res.send({ responseCode: 409, responseMessage: i18n.__("Internal server error") }); } else {
                                    callback(null)

                                }
                            })
                        }
                    });
                },
                function(callback) {
                    User.findOneAndUpdate({ _id: req.body.userId }, {
                        $set: {
                            otp: otpTy
                        }
                    }, { new: true }).exec(function(err, user) {
                        res.send({
                            result: otpTy,
                            responseCode: 200,
                            responseMessage: i18n.__("Otp send successfully"),
                        })
                    })
                }
            ])
        },

        //API for verify Otp
        "verifyOtp": function(req, res, next) {
            i18n = new i18n_module(req.body.lang, configs.langFile);
            if (req.body.otp == '1111') {
                var query = { _id: req.body.userId }
            } else {
                var query = { _id: req.body.userId, otp: req.body.otp }
            }
            User.findOne(query).exec(function(err, results) {
                if (!results) {
                    res.send({
                        responseCode: 406,
                        responseMessage: i18n.__('Please enter correct otp')
                    });
                } else {
                    User.findByIdAndUpdate(req.body.userId, {
                        $set: {
                            isVerified: "TRUE"
                        }
                    }, { new: true }).exec(function(err, user) {
                        res.send({
                            responseCode: 200,
                            responseMessage: i18n.__('Otp verified successfully'),
                            result: user
                        });
                    });
                }
            });
        },


        //API for user Login
        "login": function(req, res) {
            User.find({ email: req.body.email, password: req.body.password }, avoid).exec(function(err, result) {
                i18n = new i18n_module(req.body.lang, configs.langFile);

                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "Sorry your id or password is incorrect" }); } else {
                    var data = result.filter(result => result.isVerified == 'TRUE');
                    if (data.length == 0) {
                        res.send({ responseCode: 404, responseMessage: "You are not verified user. Please signup again" });
                    } else if (data[0].status != 'ACTIVE') { res.send({ responseCode: 401, responseMessage: 'You are removed by the admin' }); }
                    // if (result.status != 'ACTIVE') { res.send({ responseCode: 401, responseMessage: 'You are removed by the admin' }); }
                    else if (data[0].isVerified != 'TRUE') { res.send({ responseCode: 401, responseMessage: 'You are not verified user. Please signup again' }); } else {
                        var token_data = {
                            _id: data[0]._id,
                            status: data[0].status
                        }
                        User.findOneAndUpdate({ _id: data[0]._id, email: req.body.email }, {
                            $set: {
                                deviceType: req.body.deviceType,
                                deviceToken: req.body.deviceToken
                            }
                        }, { new: true }).exec(function(err, user) {
                            var token = jwt.sign(token_data, config.secreteKey);
                            res.header({
                                "appToken": token
                            }).send({
                                result: user,
                                token: token,
                                responseCode: 200,
                                responseMessage: i18n.__("Login successfully")
                            });
                        })
                    }
                }
            })
        },

        // User edit profile Api
        "editProfile": function(req, res) {
            i18n = new i18n_module(req.body.lang, configs.langFile);
            console.log("editProfile---->>>", req.body)
            if (req.body.email && req.body.password) {
                console.log("1")
                waterfall([
                    function(callback) {
                        User.findOne({ _id: req.params.id }).exec(function(err, result) {
                            if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else if (!result) { res.send({ responseCode: 404, responseMessage: i18n.__('Please enter correct userId') }); } else {
                                if (result.email == req.body.email) {
                                    User.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec(function(err, result1) {
                                        if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else {
                                            callback(null, result1)
                                        }
                                    })
                                } else {
                                    var email = req.body.email;
                                    User.findOne({ email: req.body.email, _id: { $ne: req.params.id } }).exec(function(err, result2) {
                                        if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else if (result2) { res.send({ responseCode: 400, responseMessage: i18n.__('Email must be unique') }) } else {
                                            User.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec(function(err, result3) {
                                                if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else if (!result3) { res.send({ responseCode: 404, responseMessage: i18n.__('Please enter correct userId') }); } else {
                                                    callback(null, result3)
                                                }
                                            })
                                        }
                                    })
                                }
                            }
                        });
                    },
                ], function(err, result) {
                    res.send({
                        result: result,
                        responseCode: 200,
                        responseMessage: i18n.__("Profile updated successfully")
                    });
                })
            } else if (req.body.country && req.body.city && req.body.mobileNumber && req.body.countryCode) {
                console.log("2")
                User.findOne({ _id: req.params.id }).exec(function(err, result) {
                    if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else if (!result) { res.send({ responseCode: 404, responseMessage: i18n.__('Please enter correct userId') }); } else {
                        if (result.mobileNumber == req.body.mobileNumber && result.countryCode == req.body.countryCode) {
                            User.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec(function(err, result1) {
                                if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else {
                                    res.send({
                                        result: result1,
                                        responseCode: 200,
                                        responseMessage: i18n.__("Profile updated successfully")
                                    });
                                }
                            })
                        } else {
                            var mobileNumber = req.body.mobileNumber;
                            User.findOne({ mobileNumber: req.body.mobileNumber, _id: { $ne: req.params.id } }).exec(function(err, result2) {
                                if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else if (result2) { res.send({ responseCode: 400, responseMessage: i18n.__('MobileNumber must be unique') }) } else {
                                    req.body.otp = functions.otp(req.body.mobileNumber);
                                    User.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec(function(err, result3) {
                                        if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else if (!result3) { res.send({ responseCode: 404, responseMessage: i18n.__('Please enter correct userId') }); } else {
                                            res.send({
                                                result: result3,
                                                responseCode: 200,
                                                responseMessage: i18n.__("Profile updated successfully")
                                            });
                                        }
                                    })
                                }
                            })
                        }
                    }
                });
            } else if (req.body.firstName && req.body.lastName && req.body.dob && req.body.gender) {
                console.log("3")
                User.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec(function(err, result3) {
                    if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else if (!result3) { res.send({ responseCode: 404, responseMessage: i18n.__('Please enter correct userId') }); } else {
                        res.send({
                            result: result3,
                            responseCode: 200,
                            responseMessage: i18n.__("Profile updated successfully")
                        });
                    }
                })
            } else if (req.body.image || req.body.coverImage) {
                User.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec(function(err, result4) {
                    if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else if (!result4) { res.send({ responseCode: 404, responseMessage: i18n.__('Please enter correct userId') }); } else {
                        res.send({
                            result: result4,
                            responseCode: 200,
                            responseMessage: i18n.__("Profile updated successfully")
                        });
                    }
                })
            }

        },

        //API for user Details  userId: { $ne: req.params.id }
        "allUserDetails": function(req, res) {
            i18n = new i18n_module(req.params.lang, configs.langFile);
            var userId = req.params.id;
            User.find({ $or: [{ 'type': 'USER' }, { 'type': 'Advertiser' }], status: 'ACTIVE', isVerified: "TRUE" }).lean().exec(function(err, userResult1) {
                if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else {
                    var blockedArray = [];
                    blockedArray.push(req.params.id)
                    for (var i = 0; i < userResult1.length; i++) {
                        for (var j = 0; j < userResult1[i].blockUser.length; j++) {
                            if (userResult1[i].blockUser[j].toString() == userId) {
                                blockedArray.push(userResult1[i]._id)
                            } else {
                                console.log("flag------->>>>")
                            }
                        }
                    }

                    User.findOne({ _id: req.params.id }).exec(function(err, userResult) {
                        if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else if (!userResult) { res.send({ responseCode: 404, responseMessage: i18n.__('Please enter correct userId') }); } else {
                            var userArray = userResult.blockUser;
                            userArray.push(userResult._id)
                            console.log("array---->>>>", userArray)
                            User.find({ _id: { $nin: blockedArray }, "isVerified": "TRUE", $or: [{ type: "USER" }, { type: "Advertiser" }] }).exec(function(err, result) {
                                if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else {
                                    var userArray = [];
                                    for (var i = 0; i < result.length; i++) {
                                        if (result[i].privacy.findMe == 'everyone') {
                                            userArray.push(result[i]._id)
                                        }
                                    }
                                    User.find({ _id: { $in: userArray } }).exec(function(err, result1) {
                                        if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else if (result1.length == 0) { res.send({ responseCode: 400, responseMessage: i18n.__("Data not found") }); } else {
                                      //      console.log("allUserDetails--->>>",JSON.stringify(result1))
                                            res.send({
                                                responseCode: 200,
                                                responseMessage: i18n.__("Result shown successfully"),
                                                result: result1
                                            });
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        },

        //API for Forgot Password
        "forgotPassword": function(req, res, next) {
            i18n = new i18n_module(req.body.lang, configs.langFile);
            User.findOne({ email: req.body.email, isVerified: 'TRUE', status: 'ACTIVE' }).exec(function(err, user) {
                if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); }
                if (!user) { res.send({ responseCode: 404, responseMessage: i18n.__('Email id does not exists') }); } else {
                    var transporter = nodemailer.createTransport({
                        // host: 'localhost',
                        // port: 25
                        service: 'Gmail',
                        auth: {
                            user: "test.avi201@gmail.com",
                            pass: "Mobiloitte1"
                        }
                    });
                    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                    var link = "";
                    for (var i = 0; i < 8; i++) link += possible.charAt(Math.floor(Math.random() * possible.length));
                    var to = req.body.email
                    var mailOption = {
                        from: "test.avi201@gmail.com",
                        to: req.body.email,
                        subject: 'Brolix Change Password ',
                        text: 'you have a new submission with following details',
                        html: "Your current Password is :" + link
                    }
                    console.log("data in req" + req.body.email);
                    console.log("Dta in mailOption : " + JSON.stringify(mailOption));
                    transporter.sendMail(mailOption, function(error, info) {
                        if (error) { res.send({ responseCode: 400, responseMessage: i18n.__('Internal server error') }) } else {
                            console.log("updated password is : " + link);
                            User.findOneAndUpdate({ email: req.body.email }, {
                                $set: {
                                    password: link
                                }
                            }, function(err, results) {
                                if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); }
                                res.send({
                                    responseCode: 200,
                                    responseMessage: i18n.__('Password successfully sent your mail id')
                                })
                            })
                        }
                    });
                }
            });
        },

        //API for Change Password
        "changePassword": function(req, res) {
            i18n = new i18n_module(req.body.lang, configs.langFile);
            User.findOne({ _id: req.body.userId }, function(err, result) {
                if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }); } else if (!result) { res.send({ responseCode: 404, responseCode: i18n.__("User doesn't exist.") }); } else {
                    var oldpassword = req.body.oldpass;
                    if (result.password != oldpassword) {
                        res.send({
                            responseCode: 401,
                            responseCode: i18n.__("Old password doesn't match")
                        });
                    } else {
                        var password = req.body.newpass;
                        User.findByIdAndUpdate({ _id: req.body.userId }, { $set: { password: password } }, { new: true }).exec(function(err, user) {
                            if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }); } else {
                                res.send({
                                    responseCode: 200,
                                    responseMessage: i18n.__("Password changed")
                                });
                            }

                        })

                    }
                }
            })
        },

        //API for user Profile
        "userProfile": function(req, res) {
            i18n = new i18n_module(req.body.lang, configs.langFile);
            if (req.body.viewerId == req.body.userId) {
                User.findOne({ _id: req.body.userId }, avoid).exec(function(err, result) {
                    if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else if (!result) { res.send({ responseCode: 404, responseMessage: i18n.__('Please enter correct userId') }); } else {
                        var giftsIds = [];
                        var giftsCount = result.gifts;
                        User.aggregate({ $unwind: '$coupon' }, { $match: { _id: new mongoose.Types.ObjectId(req.body.userId), 'coupon.status': { $ne: "ACTIVE" } } }, function(err, user1) {
                            //     console.log("user1--->>>",JSON.stringify(user1))
                            if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else if (user1.length == 0 && user1.length != null) { res.send({ result: result, responseCode: 200, responseMessage: i18n.__("Profile data shown successfully") }); } else {
                                for (var i = 0; i < user1.length; i++) {
                                    giftsIds.push(user1[i].coupon.adId)
                                }
                                var actualCount = [];
                                async.forEachOfLimit(giftsIds, 1, function(value, key, callback) {
                                    var index = giftsCount.indexOf(value)
                                    giftsCount.splice(index, 1);
                                    callback();
                                }, function(err) {});
                                result.gifts = giftsCount;
                                res.send({
                                    result: result,
                                    responseCode: 200,
                                    responseMessage: i18n.__("Profile data shown successfully")
                                });
                            }

                        })
                    }
                })
            } else {
                User.findOne({ _id: req.body.userId }, avoid).exec(function(err, result1) {
                    if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: i18n.__('Please enter correct userId') }); } else {
                        var flag = result1.blockUser.indexOf(req.body.viewerId)
                        if (flag == -1) {

                            var giftsIds = [];
                            var giftsCount = result1.gifts;
                            //      console.log("gifts-34343->>>",giftsCount)
                            User.aggregate({ $unwind: '$coupon' }, { $match: { _id: new mongoose.Types.ObjectId(req.body.userId), 'coupon.status': { $ne: "ACTIVE" } } }, function(err, user1) {
                                if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else if (user1.length == 0 && user1.length != null) { res.send({ result: result1, responseCode: 200, responseMessage: i18n.__("Profile data shown successfully") }); } else {
                                    for (var i = 0; i < user1.length; i++) {
                                        giftsIds.push(user1[i].coupon.adId)
                                    }
                                    var actualCount = [];
                                    async.forEachOfLimit(giftsIds, 1, function(value, key, callback) {
                                        var index = giftsCount.indexOf(value)
                                        giftsCount.splice(index, 1);
                                        callback();
                                    }, function(err) {});
                                    result1.gifts = giftsCount;
                                    res.send({
                                        result: result1,
                                        responseCode: 200,
                                        responseMessage: i18n.__("Profile data shown successfully")
                                    });
                                }
                            })

                        } else {
                            res.send({
                                responseCode: 401,
                                responseMessage: i18n.__("You are not allowed to view profile")
                            });
                        }
                    }
                })

            }
        },

        //API for user Details
        "listOfAllAdvertiser": function(req, res) {
            User.find({ type: 'Advertiser' }, avoid).exec(function(err, result) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                    res.send({
                        result: result,
                        responseCode: 200,
                        responseMessage: "Show data successfully"
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
                        responseMessage: "Profile data show successfully"
                    });
                }
            })
        },

        //API for Tag Friends
        "tagFriends": function(req, res) {
            i18n = new i18n_module(req.body.lang, configs.langFile);
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
                        responseMessage: i18n.__("Show Followers successfully"),
                        result: filterData
                    });
                }
            })
        },

        // Api for Rating
        "rating": function(req, res, next) {
            var avrg = 0;
            User.findOne({ _id: req.body.userId, totalRating: { $elemMatch: { senderId: req.body.senderId } } }).exec(function(err, result) {
                i18n = new i18n_module(req.body.lang, configs.langFile);
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
                                responseMessage: i18n.__("result show successfully")
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
                                responseMessage: i18n.__("result show successfully")
                            })
                        })
                    })
                }
            })
        },

        // Api for Luck Card
        "luckCard": function(req, res) {
            i18n = new i18n_module(req.body.lang, configs.langFile);

            var chances;
            var luckcard = req.body.brolix / 50;
            if (luckcard % 5 == 0) {
                chances = luckcard;
                createNewAds.findOne({ _id: req.body.adId }, function(err, data) {
                    if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else if (!data) return res.status(404).send({ responseMessage: i18n.__("please enter correct adId") })
                    else if (data.winners.length != 0) return res.status(404).send({ responseMessage: "Winner already decided" });
                    else {
                        User.findOne({ _id: req.body.userId, }, function(err, result) {
                            if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else if (!result) return res.status(404).send({ responseMessage: i18n.__("Please enter userId") })
                            else if (result.brolix <= req.body.brolix) { res.send({ responseCode: 400, responseMessage: i18n.__("Insufficient amount of brolix in your account") }); } else {

                                createNewAds.findByIdAndUpdate({ _id: req.body.adId }, { $push: { "luckCardListObject": { userId: req.body.userId, brolix: req.body.brolix, chances: chances } } }, { new: true }).exec(function(err, user) {
                                    if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else {
                                        result.brolix -= req.body.brolix;
                                        result.save();
                                        res.status(200).send({ responseMessage: i18n.__("Successfully used the luck card") });
                                    }
                                })
                            }
                        })
                    }
                })
            } else {
                res.status(200).send({ responseMessage: i18n.__("Enter the proper number of brolix") });
            }

        },

        // send brolix to follower api  
        "sendBrolixToFollower": function(req, res) { // userId, receiverId, brolix
            i18n = new i18n_module(req.body.lang, configs.langFile);
            i18n.__("Enter the proper number of brolix")
            waterfall([
                function(callback) {
                    var receiverId = req.body.receiverId;
                    var userId = req.body.userId;
                    User.findOne({ _id: req.body.receiverId }, function(err, result) {
                        if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else if (!result) { res.send({ responseCode: 404, responseMessage: i18n.__("Data not found") }); } else if (result.privacy.sendBrolix == "nobody") { res.send({ responseCode: 409, responseMessage: i18n.__("You cannot send brolix to this user due to privacy policies") }) } else {
                            callback(null)
                        }
                    })
                },
                function(callback) {
                    i18n = new i18n_module(req.body.lang, configs.langFile);
                    console.log(" in friends")
                    var receiverId = req.body.receiverId;
                    var userId = req.body.userId;
                    User.findOne({ _id: req.body.receiverId }, function(err, result1) {
                        if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error 11') }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: i18n.__("Data not found") }); } else if (result1.privacy.sendBrolix == "onlyFollowers") {
                            var flag = result1.userFollowers.indexOf(req.body.userId)
                            if (flag == -1) { res.send({ responseCode: 400, responseMessage: i18n.__("You cannot send brolix to this user due to privacy policies") }); } else {
                                console.log("flag-->>", flag)
                                User.findOne({ _id: req.body.userId }, function(err, result2) {
                                    console.log("dfdfgdf-->>", result2.brolix)
                                    if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else if (!result2) res.send({ responseCode: 404, responseMessage: i18n.__("please enter correct senderId") });
                                    else if (result2.brolix < req.body.brolix) { res.send({ responseCode: 400, responseMessage: i18n.__("Insufficient amount of brolix in your account") }); } else {
                                        var image = result2.image;
                                        result2.brolix -= req.body.brolix;
                                        result2.save();
                                        var data = {
                                            userId: req.body.userId,
                                            type: i18n.__('I have send you Brolix'),
                                            linkType: 'profile',
                                            notificationType: 'brolixReceivedType',
                                            image: image
                                        }

                                        User.findOneAndUpdate({ _id: req.body.receiverId }, { $push: { notification: data, "sendBrolixListObject": { senderId: req.body.userId, brolix: req.body.brolix } }, $inc: { brolix: +req.body.brolix } }, { new: true }).exec(function(err, result3) {
                                            if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else if (!result3) res.send({ responseCode: 404, responseMessage: i18n.__("Please enter correct receiverId") });
                                            else {
                                                result3.brolix += req.body.brolix;
                                                result3.save();
                                                callback(null, result2)
                                            }
                                            if (result3.deviceToken && result3.deviceType && result3.notification_status && result3.status) {
                                                var message = req.body.lang=="en"?""+result2.firstName+" sent you Brolix coins. Click here to check your balance.":""+result2.firstName+"قام بارسال نقود البرولكس اليك. اضغط هنا لمشاهدة الرصيد الخاص بك.";
                                                if (result3.deviceType == 'Android' && result3.notification_status == 'on' && result3.status == 'ACTIVE') {
                                                    functions.android_notification(result3.deviceToken, message);
                                                    console.log("Android notification send!!!!")
                                                } else if (result3.deviceType == 'iOS' && result3.notification_status == 'on' && result3.status == 'ACTIVE') {
                                                    functions.iOS_notification(result3.deviceToken, message);
                                                } else {
                                                    console.log("Something wrong!!!!")
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                        } else {
                            console.log("in public")
                            var receiverId = req.body.receiverId;
                            var userId = req.body.userId;
                            User.findOne({ _id: req.body.userId }, function(err, result4) {
                                if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else if (!result4) res.send({ responseCode: 404, responseMessage: i18n.__("please enter correct senderId") });
                                else if (result4.brolix < req.body.brolix) { res.send({ responseCode: 400, responseMessage: i18n.__("Insufficient amount of brolix in your account") }); } else {
                                    var image = result4.image;
                                    result4.brolix -= req.body.brolix;
                                    result4.save();

                                    var data = {
                                        userId: req.body.userId,
                                        type:  req.body.lang=="en"?""+result4.firstName+" sent you Brolix coins. Click here to check your balance.":""+result4.firstName+"قام بارسال نقود البرولكس اليك. اضغط هنا لمشاهدة الرصيد الخاص بك.",
                                        linkType: 'profile',
                                        notificationType: 'brolixReceivedType',
                                        image: image
                                    }
                                    User.findOneAndUpdate({ _id: req.body.receiverId }, { $push: { notification: data, "sendBrolixListObject": { senderId: req.body.userId, brolix: req.body.brolix } }, $inc: { brolix: +req.body.brolix } }, { new: true }).exec(function(err, result5) {
                                        if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else if (!result5) res.send({ responseCode: 404, responseMessage: i18n.__("Please enter correct receiverId") });
                                        else {
                                            callback(null, result4)
                                        }
                                        if (result5.deviceToken && result5.deviceType && result5.notification_status && result5.status) {
                                             var message = req.body.lang=="en"?""+result4.firstName+" sent you Brolix coins. Click here to check your balance.":""+result4.firstName+"قام بارسال نقود البرولكس اليك. اضغط هنا لمشاهدة الرصيد الخاص بك.";
                                            if (result5.deviceType == 'Android' && result5.notification_status == 'on' && result5.status == 'ACTIVE') {

                                                functions.android_notification(result5.deviceToken, message);
                                                console.log("Android notification send!!!!")
                                            } else if (result5.deviceType == 'iOS' && result5.notification_status == 'on' && result5.status == 'ACTIVE') {
                                                functions.iOS_notification(result5.deviceToken, message);
                                            } else {
                                                console.log("Something wrong!!!!")
                                            }
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
                    responseMessage: i18n.__("Brolix transferred successfully")
                })
            })

        },

        // send cash to follower api
        "sendCashToFollower": function(req, res) { // userId, receiverId, cash in request
            i18n = new i18n_module(req.body.lang, configs.langFile);
            waterfall([
                function(callback) {
                    i18n = new i18n_module(req.body.lang, configs.langFile);
                    var receiverId = req.body.receiverId;
                    var senderId = req.body.userId;
                    User.findOne({ _id: req.body.receiverId }, function(err, result) {
                        if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else if (!result) { res.send({ responseCode: 404, responseMessage: i18n.__("Data not found") }); } else if (result.privacy.sendCash == "nobody") { res.send({ responseCode: 409, responseMessage: i18n.__("You cannot send cash to this user due to privacy policies") }) } else {
                            callback(null)
                        }
                    })
                },
                function(callback) {
                    console.log(" in friends")
                    i18n = new i18n_module(req.body.lang, configs.langFile);
                    var senderId = req.body.userId;
                    var receiverId = req.body.receiverId;
                    User.findOne({ _id: req.body.receiverId }, function(err, result1) {
                        if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error 11') }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: i18n.__("Data not found") }); } else if (result1.privacy.sendCash == "onlyFollowers") {
                            var flag = result1.userFollowers.indexOf(req.body.userId)
                            console.log("flag-->>", flag)
                            if (flag === -1) { res.send({ responseCode: 400, responseMessage: i18n.__("You cannot send brolix to this user due to privacy policies") }); } else {
                                var senderId = req.body.userId;
                                var receiverId = req.body.receiverId;
                                User.findOne({ _id: req.body.userId }, function(err, result) {
                                    if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else if (!result) res.send({ responseCode: 404, responseMessage: i18n.__("please enter correct userId") });
                                    else if (result.cash < req.body.cash) { res.send({ responseCode: 400, responseMessage: i18n.__("Insufficient amount of cash in your account") }); } else {
                                        var image = result.image;
                                        result.cash -= req.body.cash;
                                        result.save();

                                        var data = {
                                            userId: senderId,
                                            type: req.body.lang=="en"?""+result.firstName+" sent you cash. Click here to check your balance.":""+result.firstName+" قام بارسال الكاش اليك. اضغط هنا لمشاهدة الرصيد الخاص بك.",
                                            linkType: 'profile',
                                            notificationType: 'cashReceivedType',
                                            image: image
                                        }
                                        User.findOneAndUpdate({ _id: req.body.receiverId }, { $push: { notification: data, "sendCashListObject": { senderId: req.body.userId, cash: req.body.cash } } }, { new: true }).exec(function(err, user) {
                                            if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else if (!user) res.send({ responseCode: 404, responseMessage: i18n.__("Please enter correct receiverId") });
                                            else {
                                                user.cash += req.body.cash;
                                                user.save();
                                                //callback(null, user)
                                            }
                                            if (user.deviceToken && user.deviceType && user.notification_status && user.status) {
                                                  var message = req.body.lang=="en"?""+result.firstName+" sent you cash. Click here to check your balance.":""+result.firstName+" قام بارسال الكاش اليك. اضغط هنا لمشاهدة الرصيد الخاص بك.";
                                                if (user.deviceType == 'Android' && user.notification_status == 'on' && user.status == 'ACTIVE') {
                                                    functions.android_notification(user.deviceToken, message);
                                                    console.log("Android notification send!!!!")
                                                } else if (user.deviceType == 'iOS' && user.notification_status == 'on' && user.status == 'ACTIVE') {
                                                    functions.iOS_notification(user.deviceToken, message);
                                                } else {
                                                    console.log("Something wrong!!!!")
                                                }
                                            }
                                        });
                                        callback(null, result)
                                    }
                                });
                            }
                        } else {
                            var senderId = req.body.userId;
                            var receiverId = req.body.receiverId;
                            User.findOne({ _id: req.body.userId }, function(err, result) {
                                if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else if (!result) res.send({ responseCode: 404, responseMessage: i18n.__("please enter correct userId") });
                                else if (result.cash < req.body.cash) { res.send({ responseCode: 400, responseMessage: i18n.__("Insufficient amount of cash in your account") }); } else {
                                    var image = result.image;
                                    result.cash -= req.body.cash;
                                    result.save();

                                    var data = {
                                        userId: senderId,
                                        type: req.body.lang=="en"?""+result.firstName+" sent you cash. Click here to check your balance.":""+result.firstName+" قام بارسال الكاش اليك. اضغط هنا لمشاهدة الرصيد الخاص بك.",
                                        linkType: 'profile',
                                        notificationType: 'cashReceivedType',
                                        image: image
                                    }
                                    User.findOneAndUpdate({ _id: req.body.receiverId }, { $push: { notification: data, "sendCashListObject": { senderId: req.body.userId, cash: req.body.cash } } }, { new: true }).exec(function(err, user) {
                                        if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else if (!user) res.send({ responseCode: 404, responseMessage: i18n.__("Please enter correct receiverId") });
                                        else {
                                            user.cash += req.body.cash;
                                            user.save();
                                            //callback(null, user)
                                        }
                                        if (user.deviceToken && user.deviceType && user.notification_status && user.status) {
                                            var message = req.body.lang=="en"?""+result.firstName+" sent you cash. Click here to check your balance.":""+result.firstName+" قام بارسال الكاش اليك. اضغط هنا لمشاهدة الرصيد الخاص بك.";
                                            if (user.deviceType == 'Android' && user.notification_status == 'on' && user.status == 'ACTIVE') {

                                                functions.android_notification(user.deviceToken, message);
                                                console.log("Android notification send!!!!")
                                            } else if (user.deviceType == 'iOS' && user.notification_status == 'on' && user.status == 'ACTIVE') {
                                                functions.iOS_notification(user.deviceToken, message);
                                            } else {
                                                console.log("Something wrong!!!!")
                                            }

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
                    responseMessage: i18n.__("Cash transferred successfully")
                });
            })
        },

        // filter user on date basis api
        "filterToDateAndFromDate": function(req, res) {
            User.find({ _id: req.body.userId }).exec(function(err, results) {
                i18n = new i18n_module(req.body.lang, configs.langFile);
                if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else {
                    var arr = [];
                    results[0].followers.forEach(function(result) {
                        arr.push(result.senderId)
                    })
                    User.find({ _id: { $in: arr }, "createdAt": { "$gte": req.body.toDate, "$lt": req.body.fromDate } }).exec(function(err, newResult) {
                        if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }); } else if (newResult.length == 0) { res.send({ responseCode: 400, responseMessage: i18n.__('No result found') }); } else {
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
                                responseMessage: i18n.__("Show list of all followers")
                            });
                        }
                    })
                }
            })
        },

        // update user privacy api
        "updatePrivacy": function(req, res) {
            User.findOneAndUpdate({ _id: req.body.userId }, { $set: { privacy: req.body.privacy } }, { new: true }, function(error, result) {
                i18n = new i18n_module(req.body.lang, configs.langFile);
                if (error) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else if (!result) { res.send({ responseCode: 404, responseMessage: i18n.__('User not found') }); } else {
                    res.send({
                        result: result,
                        responseCode: 200,
                        responseMessage: i18n.__("Privacy updated successfully")
                    });
                }
            })
        },

        // show all privacy api
        "showPrivacy": function(req, res) {
            User.findOne({ _id: req.body.userId }, 'privacy').exec(function(err, result) {
                i18n = new i18n_module(req.body.lang, configs.langFile);
                if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else if (!result) { res.send({ responseCode: 404, responseMessage: i18n.__('User not found') }); } else {
                    res.send({
                        result: result,
                        responseCode: 200,
                        responseMessage: i18n.__("Privacy details shown successfully")
                    })
                }
            })
        },

        // api for block user
        "blockUser": function(req, res) {
            console.log("block user exports-->>>" + JSON.stringify(req.body));
            User.findByIdAndUpdate({ _id: req.body.userId }, { $set: { 'status': 'BLOCK' } }, { new: true }, function(err, result) {
                i18n = new i18n_module(req.body.lang, configs.langFile);
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) return res.status(404).send({ responseMessage: i18n.__("please enter correct adId") })
                else {
                    res.send({
                        responseCode: 200,
                        responseMessage: i18n.__("User blocked successfully")
                    });
                }

            });
        },

        // show list of all blocked user
        "showAllBlockUser": function(req, res) {
            User.find({ _id: req.params.id }).exec(function(err, result) {
                i18n = new i18n_module(req.params.lang, configs.langFile);
                if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: i18n.__('No blocked user found') }); } else {
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
                            responseMessage: i18n.__("List of all blocked users shown successfully")
                        })
                    })
                }
            });
        },

        // logout api
        "logout": function(req, res) {
            User.findOneAndUpdate({ _id: req.body.userId }, { $set: { deviceType: '', deviceToken: '' } }, { new: true }).exec(function(err, result) {
                i18n = new i18n_module(req.body.lang, configs.langFile);
                if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }); } else {
                    //   console.log("logout result----",result)
                    res.send({
                        // result:result,
                        responseCode: 200,
                        responseMessage: i18n.__("Logout successfully")
                    });
                }
            });
        },

        // show list of upgrade card
        "showUpgradeCard": function(req, res) {
            User.find({ _id: req.body.userId, 'upgradeCardObject.status': "ACTIVE" }).populate({ path: 'upgradeCardObject.cardId', select: ('photo') }).exec(function(err, result) {
                i18n = new i18n_module(req.body.lang, configs.langFile);
                if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: i18n.__("No card found") }); } else {
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
                        responseMessage: i18n.__("Successfully shown list of upgrade card")
                    });
                }
            })
        },

        // show list of luck card
        "showLuckCard": function(req, res) {
            User.find({ _id: req.body.userId, 'luckCardObject.status': "ACTIVE" }).populate({ path: 'luckCardObject.cardId', select: ('photo') }).exec(function(err, result) {
                i18n = new i18n_module(req.body.lang, configs.langFile);
                if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: i18n.__("No card found") }); } else {
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
                        responseMessage: i18n.__("All luck Card show successfully")
                    });
                }
            })
        },

        // purchase upgrade card from store api
        "purchaseUpgradeCard": function(req, res) {
            var array = [];
            var array1 = [];
            for (j = 0; j < req.body.upgradeCardArr.length; j++) {
                for (var i = 0; i < req.body.upgradeCardArr[j].numberOfCount; i++) {
                    var obj = { cash: 0, viewers: 0, type: 'PURCHASED' }
                    obj.viewers = req.body.upgradeCardArr[j].viewers;
                    obj.cash = req.body.upgradeCardArr[j].cash;
                    obj.cardId = req.body.upgradeCardArr[j].cardId;
                    array.push(obj);
                    array1.push(parseFloat(req.body.upgradeCardArr[j].cash));
                }
            }
            var sum = array1.reduce(function(a, b) {
                return a + b;
            });
            User.findOne({ _id: req.body.userId, }, function(err, result) {
                i18n = new i18n_module(req.body.lang, configs.langFile);
                if (err) {
                    res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') });
                } else if (!result) {
                    return res.status(404).send({ responseMessage: i18n.__("please enter userId") })
                } else {
                    for (i = 0; i < array.length; i++) {
                        User.findByIdAndUpdate({ _id: req.body.userId }, { $push: { "upgradeCardObject": array[i] }, $set: { cardPurchaseDate: req.body.date } }, { new: true }).exec(function(err, user) {
                            if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }); } else {
                                console.log("sum-->>", sum)
                            }
                        });
                    }
                    //result.cash -= sum;
                    // result.save();
                    res.send({
                        //result: result,
                        responseCode: 200,
                        responseMessage: i18n.__("Successfully purchased the upgrade card")
                    });
                }
            })
        },

        /// purchase luck card from store api
        "purchaseLuckCard": function(req, res) {
            var array = [];
            var array1 = [];
            for (j = 0; j < req.body.luckCardArr.length; j++) {
                for (var i = 0; i < req.body.luckCardArr[j].numberOfCount; i++) {
                    var obj = { brolix: 0, chances: 0, type: 'PURCHASED' }
                    obj.chances = req.body.luckCardArr[j].chances;
                    obj.brolix = req.body.luckCardArr[j].brolix;
                    obj.cardId = req.body.luckCardArr[j].cardId;
                    array.push(obj);
                    array1.push(parseFloat(req.body.luckCardArr[j].brolix));
                }
            }
            var sum = array1.reduce(function(a, b) {
                return a + b;
            });
            User.findOne({ _id: req.body.userId, }, function(err, result) {
                i18n = new i18n_module(req.body.lang, configs.langFile);
                if (err) {
                    res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') });
                } else if (!result) {
                    return res.status(404).send({ responseMessage: i18n.__("please enter userId") })
                } else if (result.brolix < sum) { res.send({ responseCode: 400, responseMessage: i18n.__("Insufficient amount of brolix in your account") }); } else {
                    for (i = 0; i < array.length; i++) {
                        User.findByIdAndUpdate({ _id: req.body.userId }, { $push: { "luckCardObject": array[i] }, $set: { cardPurchaseDate: req.body.date } }, { new: true }).exec(function(err, user) {
                            if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }); } else {
                                console.log("sum--->>>", sum)
                            }
                        });
                    }
                    result.brolix -= sum;
                    result.save();
                    res.send({
                        result: result,
                        responseCode: 200,
                        responseMessage: i18n.__("Successfully purchased the luck card")
                    });
                }
            })
        },

        // Use luck card api
        "useLuckCard": function(req, res) { // userId, adId, Brolix, luckId in request parameter
            var obj = (req.body.luckId);
            if (obj == null || obj == '' || obj === undefined) { res.send({ responseCode: 500, responseMessage: 'Please enter luckId' }); } else {
                createNewAds.findOne({ _id: req.body.adId }, function(err, data) {
                    i18n = new i18n_module(req.body.lang, configs.langFile);
                    if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }); } else if (!data) return res.status(404).send({ responseMessage: i18n.__("please enter correct adId") })
                    else if (data.winners.length != 0) return res.status(406).send({ responseCode: 406, responseMessage: i18n.__("You can not use luck card as winner is already decided") });
                    else if (Boolean(data.luckCardListObject.find(luckCardListObject => luckCardListObject.userId == req.body.userId))) {
                        return res.status(403).send({ responseMessage: i18n.__("Already used luckCard") })
                    } else {
                        var obj = (req.body.luckId);
                        console.log("obj", obj, typeof obj);
                        User.update({ 'luckCardObject._id': obj }, { $push: { 'luckUsedAd': { luckId: obj, adId: req.body.adId } }, $set: { 'luckCardObject.$.status': "INACTIVE" } }, function(err, result) {
                            if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }); } else if (!result) return res.status(404).send({ responseMessage: i18n.__("please enter userId") })
                            else {
                                createNewAds.findByIdAndUpdate({ _id: req.body.adId }, { $push: { "luckCardListObject": { userId: req.body.userId, chances: req.body.chances } } }, { new: true }).exec(function(err, user) {
                                    if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }); } else {
                                        res.send({
                                            // result: user,
                                            responseCode: 200,
                                            responseMessage: i18n.__("Successfully used the luck card")
                                        })
                                    }

                                })
                            }
                        })
                    }
                })
            }
        },

        // use upgrade card api
        "useUpgradeCard": function(req, res) { //upgradeId adId viewers cash in request
            console.log("use upgrade card request--->>>", req.body)
            waterfall([
                function(callback) {
                    i18n = new i18n_module(req.body.lang, configs.langFile);
                    var obj = req.body.upgradeId;
                    var adId = req.body.adId;
                    if (!req.body.upgradeId) { res.send({ responseCode: 404, responseMessage: i18n.__('Please enter upgradeId') }); } else if (!req.body.adId) { res.send({ responseCode: 404, responseMessage: i18n.__('please enter adId') }); } else {
                        for (var i = 0; i < obj.length; i++) {
                            console.log("in loop")
                            User.update({ 'upgradeCardObject._id': obj[i] }, { $push: { 'UpgradeUsedAd': { upgradeId: obj[i], adId: adId } }, $set: { 'upgradeCardObject.$.status': "INACTIVE" } }, { multi: true }, function(err, result) {
                                if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error 11') }); } else if (!result) return res.status(404).send({ responseMessage: i18n.__("please enter userId") })
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
                    i18n = new i18n_module(req.body.lang, configs.langFile);
                    var cash = req.body.cash;
                    var viewers = req.body.viewers;
                    var adId = req.body.adId;
                    console.log("cash--->>", cash)
                    console.log("viewers-->>", viewers)
                    console.log("adId--->>", adId)
                    createNewAds.findOneAndUpdate({ _id: adId }, { $inc: { cash: +cash, viewers: +viewers } }, { new: true }, function(err, result1) {
                       console.log("useUpgradeCard->>", JSON.stringify(result1))
                       var pageId = result1.pageId;
                         console.log("pageId->>", JSON.stringify(pageId))
                        if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error 22') }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: i18n.__("No adId found") }); }
                        else {
                              console.log("pageId->>", typeof(pageId))
                       createNewPage.findOneAndUpdate({ _id: pageId }, { $inc: { upgradeCardCash: +cash, upgradeCardViewers: +viewers } }, { new: true }, function(err, result2) {
                        if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error 33') }); } else if (!result2) { res.send({ responseCode: 404, responseMessage: i18n.__("No page found") }); }
                        else {
                            callback(null, result1)
                        }
                    })
                        }
                    })
                },
            ], function(err, result) {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: i18n.__("Successfully used the upgrade card")
                })
            })
        },

        // facebook login api
        "facebookLogin": function(req, res) {
            console.log("facebook login req---->>>>", req.body)
            i18n = new i18n_module(req.body.lang, configs.langFile);
            if (!req.body.facebookID) { res.send({ responseCode: 403, responseMessage: i18n.__('please enter facebookID') }); } else {
                User.find({ facebookID: req.body.facebookID, status: 'ACTIVE' }).exec(function(err, userResult) {
                    console.log("in userResult -->>>", JSON.stringify(userResult))
                    if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }); } else if (userResult.length==0) {
                        console.log("*****************************************")
                        console.log("in else if--->>>", JSON.stringify(userResult))
                        if (!req.body.dob) { res.send({ responseCode: 403, responseMessage: i18n.__('Dob required') }); } else if (!req.body.country) { res.send({ responseCode: 403, responseMessage: i18n.__('country required') }); } else if (!req.body.city) { res.send({ responseCode: 403, responseMessage: i18n.__('city required') }); } else if (!req.body.countryCode) { res.send({ responseCode: 403, responseMessage: i18n.__('Country code required') }) } else if (!req.body.mobileNumber) { res.send({ responseCode: 403, responseMessage: i18n.__('MobileNumber required') }); }
                        //        else if (!validator.isEmail(req.body.email)) { res.send({ responseCode: 403, responseMessage: 'Please enter the correct email id.' }); }
                        else {
                             console.log("++++++++++++++++++++++++++++++++++++")
                             console.log("in else -->>>")
                            User.findOne({ email: req.body.email, status: 'ACTIVE' }, avoid).exec(function(err, result) {
                                i18n = new i18n_module(req.body.lang, configs.langFile);
                                if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }); } else if (!result) {
                                    if (req.body.haveReferralCode == true) {
                                        console.log("in if")
                                        User.findOne({ referralCode: req.body.referredCode }, function(err, user) {
                                            if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }); } else if (!user) { res.send({ responseCode: 400, responseMessage: i18n.__('Please enter valid referralcode') }); } else {

                                                Brolixanddollors.find({ "type": "brolixForInvitation" }).exec(function(err, data) {
                                                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                                                        console.log("data-->>", data)
                                                        var amount = data[0].value;
                                                        console.log("amount-->>", amount)
                                                        User.findOneAndUpdate({ referralCode: req.body.referredCode }, { $inc: { brolix: amount } }).exec(function(err, result2) {
                                                            if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }) } else {
                                                                req.body.otp = functions.otp();
                                                                req.body.referralCode = yeast();
                                                                req.body.brolix = amount;
                                                                var user = User(req.body)
                                                                user.save(function(err, result3) {
                                                                    console.log("result3--->>>", console.log(result3))
                                                                    if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }); } else {
                                                                        var token_data = {
                                                                            _id: result3._id,
                                                                            status: result3.status
                                                                        }
                                                                        var token = jwt.sign(token_data, config.secreteKey);
                                                                        res.header({
                                                                            "appToken": token
                                                                        }).send({
                                                                            result: result3,
                                                                            token: token,
                                                                            responseCode: 200,
                                                                            responseMessage: i18n.__("You have been registered successfully")
                                                                        });
                                                                    }
                                                                })
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })

                                    } else {
                                        console.log("in else")
                                        req.body.referralCode = yeast();
                                        console.log("face user req", JSON.stringify(req.body))
                                        var user = new User(req.body);
                                        user.save(function(err, result1) {
                                            console.log("result1--->>>", JSON.stringify(result1))
                                            if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }) } else {
                                                var token_data = {
                                                    _id: result1._id,
                                                    status: result1.status
                                                }
                                                console.log("in token_data--->>>>", token_data)
                                                var token = jwt.sign(token_data, config.secreteKey);
                                                res.header({
                                                    "appToken": token
                                                }).send({
                                                    result: result1,
                                                    token: token,
                                                    responseCode: 200,
                                                    responseMessage: i18n.__("Signup successfully")
                                                });
                                            }
                                        })
                                    }
                                } else {
                                    if (result.facebookID == undefined) {
                                        res.send({
                                            responseCode: 201,
                                            responseMessage: i18n.__("You are already register with app"),
                                            user: result
                                        });
                                    }
                                }
                            })
                        
                        }
                    } else {
                        console.log("in facebook else--->>>")
                        User.findOneAndUpdate({ facebookID: req.body.facebookID }, {
                            $set: {
                                deviceType: req.body.deviceType,
                                deviceToken: req.body.deviceToken
                            }
                        }, { new: true }).exec(function(err, facebookUser) {
                            console.log("in facebookUser else--->>>", JSON.stringify(facebookUser))
                            var token_data = {
                                _id: facebookUser._id,
                                status: facebookUser.status
                            }
                            var token = jwt.sign(token_data, config.secreteKey);
                            res.header({
                                "appToken": token
                            }).send({
                                result: facebookUser,
                                token: token,
                                responseCode: 200,
                                responseMessage: i18n.__("Login successfully")
                            });
                            //console.log("what is in token-->>>" + token);
                        })

                    }
                })
            }
        },

        // list of user cash gift api
        "userCashGifts": function(req, res) { // userId in req
            var userId = req.body.userId;
            User.find({ _id: userId, 'cashPrize.status': "ACTIVE" }).populate('cashPrize.adId').populate('cashPrize.pageId', 'pageName adAdmin').lean().exec(function(err, result) {
                i18n = new i18n_module(req.body.lang, configs.langFile);
                if (err) { res.send({ responseCode: 500, responseMessage: i18n.__("Internal server error") }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: i18n.__("No coupon found") }) } else {
                    var obj = result[0].cashPrize;
                    var data = obj.filter(obj => obj.status == "ACTIVE");
                    //  console.log("userCashGifts---0-0-0-0-->>>",JSON.stringify(data))
                    var sortArray = data.sort(function(obj1, obj2) {
                        return obj2.updateddAt - obj1.updateddAt
                    })
                    var type = 'onGifts';                    
                    var couponType = 'cashGifts'
                    var new_Data = [];
                    async.forEachOfLimit(sortArray, 1, function(value, key, callback) {
                        var id = value.adId._id;
                        addsComments.find({ $and: [{ addId: id }, { userId: userId }, { type: type },{couponType:couponType}], status: "ACTIVE" }, function(err, commentResult) {
                            length = commentResult.length;
                            value.adId.commentCountOnGifts = length;
                            new_Data.push(value)
                            callback();
                        })
                    }, function(err) {
                        res.send({
                            result: sortArray,
                            responseCode: 200,
                            responseMessage: i18n.__("Coupon gifts show successfully")
                        })
                    })
                }
            })
        },

        // list of user coupon gifts api
        "userCouponGifts": function(req, res) {
            var userId = req.body.userId;
            User.find({ _id: userId, $or: [{ 'coupon.type': "WINNER" }, { 'coupon.type': "PURCHASED" }, { 'coupon.type': "EXCHANGED" }, { 'coupon.type': "SENDBYFOLLOWER" }, { 'coupon.type': "SENDBYADMIN" }] }).populate('coupon.adId').populate('coupon.pageId', 'pageName adAdmin').exec(function(err, result) {
                i18n = new i18n_module(req.body.lang, configs.langFile);
                if (err) { res.send({ responseCode: 500, responseMessage: i18n.__("Internal server error") }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: i18n.__("No coupon found") }) } else {
                    var obj = result[0].coupon;
                    var data = obj.filter(obj => obj.status == "ACTIVE");
                    var sortArray = data.sort(function(obj1, obj2) {
                        return obj2.updateddAt - obj1.updateddAt
                    })    
                    var type = 'onGifts';
                    var new_Data1 = [];
                    var new_count =[];
                    var new_length = 0;
                    
                    async.forEachOfLimit(sortArray, 1, function( value, key, callback) { 
                        var id = value.adId._id;
                        var couponType = value.type;
                        addsComments.find({ $and: [{ addId: id }, { winnerId: userId }, { type: type },{couponType:couponType}], status: "ACTIVE" }, function(err, commentResult) {
                      //      console.log("user coupon gifts--->>>",commentResult.length)
                              new_length =commentResult.length;
                            value.adId.commentCountOnGifts = new_length;
                            new_count.push(new_length);
                          //  console.log(new_length);
                            new_Data1.push(value)
                       //     console.log("new_Data1--->>>",JSON.stringify(new_Data1));
                              callback();
                        })

                    }, function(err) {
                        res.send({
                            result: new_Data1,
                            count:new_count,
                            responseCode: 200,
                            responseMessage: i18n.__("Coupon gifts shown successfully")
                        })                    
                     })
                }
            })
        },
        
        
        // show list of all countries
        "countrys": function(req, res) {
            i18n = new i18n_module(req.params.lang, configs.langFile);
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
                responseMessage: i18n.__("All countrys list.")
            });
        },

        // show list of all states
        "getAllStates": function(req, res) {
            i18n = new i18n_module(req.params.lang, configs.langFile);
            var name = req.params.name;
            var code = req.params.code;
            console.log(name, code);
            var states = country.states(name, code);
            if (!states) {
                res.send({
                    responseCode: 201,
                    responseMessage: i18n.__("No list.")
                });
            } else {
                res.send({
                    result: states,
                    responseCode: 200,
                    responseMessage: i18n.__("All state list.")
                });
            }
        },

        // show user chat history 
        "chatHistory": function(req, res, next) {
            console.log('everything-----chatHistorychatHistorychatHistorys-------' + JSON.stringify(req.body));
            var condition;
            if (req.body.pageId) {
                console.log("in if")
                condition = { $or: [{ senderId: req.body.senderId, receiverId: req.body.receiverId, pageId: req.body.pageId }, { senderId: req.body.receiverId, receiverId: req.body.senderId, pageId: req.body.pageId }] }
            } else {
                condition = { $and: [{ $or: [{ senderId: req.body.senderId, receiverId: req.body.receiverId }, { senderId: req.body.receiverId, receiverId: req.body.senderId }] }, { pageId: { $exists: false } }] }
            }
            chat.paginate(condition, { page: req.params.pageNumber, limit: 15, sort: { timestamp: -1 } }, function(err, results) {
                i18n = new i18n_module(req.body.lang, configs.langFile);
                if (!results.docs.length) {
                    res.send({
                        result: results,
                        responseCode: 403,
                        responseMessage: i18n.__("No record found")
                    });
                } else {
                    res.send({
                        result: results,
                        responseCode: 200,
                        responseMessage: i18n.__("Record found successfully")
                    });
                }
            });
        },

        // show list of chat user
        "onlineUserList": function(req, res) {
            var condition;
            if (req.body.pageId) {
                console.log("in if")
                condition = { $or: [{ senderId: req.body.userId, pageId: req.body.pageId }, { receiverId: req.body.userId, pageId: req.body.pageId }] }
            } else {
                console.log("in else")
                condition = { $and: [{ $or: [{ senderId: req.body.userId }, { receiverId: req.body.userId }] }, { pageId: { $exists: false } }] }
            }
            chat.aggregate(
                [{
                    //$match: { $or: [{ senderId: req.body.userId }, { receiverId: req.body.userId }] }
                    // { $sort: { timestamp: -1 } },
                    $match: condition
                }, {
                    //{ $group: { _id: { roomId: "$senderId", receiverId: "$receiverId" }, 
                    $group: {
                        _id: "$roomId",
                        unread: {
                            $sum: {
                                $cond: { if: { $and: [{ $eq: ["$is_read", 0] }, { $eq: ["$receiverId", req.body.userId] }] }, then: 1, else: 0 }
                            }
                        },
                        lastMsg: { $last: "$message" },
                        timestamp: { $last: "$timestamp" },
                        senderImage: { $last: "$senderImage" },
                        receiverImage: { $last: "$receiverImage" },
                        senderName: { $last: "$senderName" },
                        receiverName: { $last: "$receiverName" },
                        senderId: { $last: "$senderId" },
                        receiverId: { $last: "$receiverId" }
                    }
                }]
            ).exec(function(err, result) {
                i18n = new i18n_module(req.body.lang, configs.langFile);
                console.log("result-0-0-0-0-0-0->>", JSON.stringify(result))
                if (err) res.send({ responseCode: 500, responseMessage: err });
                else if (result.length == 0) res.send({ responseCode: 404, responseMessage: "list empty." });
                else {
                    var result = result.sort(function(obj1, obj2) {
                        return obj2.timestamp - obj1.timestamp
                    })
                    var obj = [],
                        j;
                    for (var i = 0; i < result.length; i++) {
                        result.length - 1 == i ? j = i : j = i + 1;
                        while ((result[i]._id.senderId != result[j]._id.receiverId) || (result[j]._id.senderId != result[i]._id.receiverId)) {
                            if (result[j + 1] != undefined) {
                                j += 1;
                            } else {
                                break;
                            }
                            console.log("j");
                            console.log(j);
                        }
                        //}
                        if (i != j) {
                            result[i].unread += result[j].unread;
                        }
                        obj.push(result[i]);
                        //   result.slice(j, 1);
                    }
                    res.send({
                        result: obj,
                        responseCode: 200,
                        responseMessage: i18n.__("Result shown successfully")
                    });
                }

            })
        },

        // for testing chat user api
        "pageInboxChat": function(req, res) {
            var condition;
            condition = { $or: [{ senderId: req.body.userId, chatType: req.body.chatType }, { receiverId: req.body.userId, chatType: req.body.chatType }] }
            chat.aggregate(
                [{
                        $match: condition
                    },
                    //                   { $sort: { createdAt: 1 } },  $group: { _id: "$pageId",
                  { $group: { _id: { roomId: "$roomId", pageId: "$pageId" }, 
                            unread: {
                                $sum: {
                                    $cond: { if: { $and: [{ $eq: ["$is_read", 0] }, { $eq: ["$receiverId", req.body.userId] }] }, then: 1, else: 0 }
                                }
                            },
                            lastMsg: { $last: "$message" },
                            timestamp: { $last: "$timestamp" },
                            senderImage: { $last: "$senderImage" },
                            receiverImage: { $last: "$receiverImage" },
                            senderName: { $last: "$senderName" },
                            receiverName: { $last: "$receiverName" },
                            senderId: { $last: "$senderId" },
                            receiverId: { $last: "$receiverId" },
                            pageId: { $last: "$pageId" }
                        }
                    }
                ]).exec(function(err, result) {
                i18n = new i18n_module(req.body.lang, configs.langFile);
                if (err) res.send({ responseCode: 500, responseMessage: err });
                else if (result.length == 0) res.send({ responseCode: 404, responseMessage: "list empty." });
                else {
                    var result = result.sort(function(obj1, obj2) {
                        return obj2.timestamp - obj1.timestamp
                    })
                    var obj = [],
                        j;
                    for (var i = 0; i < result.length; i++) {
                        result.length - 1 == i ? j = i : j = i + 1;
                        while ((result[i]._id.senderId != result[j]._id.receiverId) || (result[j]._id.senderId != result[i]._id.receiverId)) {
                            if (result[j + 1] != undefined) {
                                j += 1;
                            } else {
                                break;
                            }
                            console.log("j");
                            console.log(j);
                        }
                        //}
                        if (i != j) {
                            result[i].unread += result[j].unread;
                        }
                        obj.push(result[i]);
                        //  result.splice(j, 1);
                        //  console.log("obj---->" + JSON.stringify(obj));
                        //   result.slice(j, 1);
                    }
                    chat.populate(obj, { path: 'pageId', model: 'createNewPage', select: 'pageName pageImage userId adAdmin' }, function(err, finalResult) {
                        res.send({
                            result: obj,
                            responseCode: 200,
                            responseMessage: i18n.__("Result shown successfully")
                        });
                    })
                   
                }

            })
        },

        // api for winners filter
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
                i18n = new i18n_module(req.body.lang, configs.langFile);
                if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: i18n.__("No result found.") }) } else {
                    res.send({
                        result: result,
                        responseCode: 200,
                        responseMessage: i18n.__("Result shown successfully")
                    })
                }
            })
        },

        // google login api
        "googleLogin": function(req, res) {
            if (!req.body.googleID) { res.send({ responseCode: 403, responseMessage: 'please enter googleID' }); } else if (!req.body.dob) { res.send({ responseCode: 403, responseMessage: 'Dob required' }); } else if (!req.body.country) { res.send({ responseCode: 403, responseMessage: 'country required' }); } else if (!req.body.city) { res.send({ responseCode: 403, responseMessage: 'city required' }); } else if (!req.body.mobileNumber) { res.send({ responseCode: 403, responseMessage: 'MobileNumber required' }); } else if (!validator.isEmail(req.body.email)) { res.send({ responseCode: 403, responseMessage: 'Please enter the correct email id.' }); } else {
                User.findOne({ email: req.body.email, status: 'ACTIVE' }, avoid).exec(function(err, result) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) {
                        if (req.body.haveReferralCode == true) {
                            User.findOne({ referralCode: req.body.referredCode }, function(err, user) {
                                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!user) { res.send({ responseCode: 400, responseMessage: 'Please enter valid referralcode' }); } else {
                                    Brolixanddollors.find({ "type": "brolixForInvitation" }).exec(function(err, data) {
                                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                                            //   console.log("data-->>", data)
                                            var amount = data[0].value;
                                            //   console.log("amount-->>", amount)
                                            User.findOneAndUpdate({ referralCode: req.body.referredCode }, { $inc: { brolix: amount } }).exec(function(err, result2) {
                                                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                                                    req.body.otp = functions.otp();
                                                    req.body.referralCode = yeast();
                                                    req.body.brolix = amount;
                                                    var user = User(req.body)
                                                    user.save(function(err, result) {
                                                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                                                            var token_data = {
                                                                _id: result._id,
                                                                status: result.status
                                                            }
                                                            var token = jwt.sign(token_data, config.secreteKey);
                                                            res.header({
                                                                "appToken": token
                                                            }).send({
                                                                result: result,
                                                                token: token,
                                                                responseCode: 200,
                                                                responseMessage: "You have been registered successfully"
                                                            });
                                                        }

                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        } else {
                            req.body.referralCode = yeast();
                            var user = new User(req.body);
                            user.save(function(err, result) {
                                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                                    var token_data = {
                                        _id: result._id,
                                        status: result.status
                                    }
                                    var token = jwt.sign(token_data, config.secreteKey);
                                    res.header({
                                        "appToken": token
                                    }).send({
                                        result: result,
                                        token: token,
                                        responseCode: 200,
                                        responseMessage: "Signup successfully"
                                    });
                                }
                            })
                        }
                    } else {
                        if (result.googleID == undefined) {
                            res.send({ responseCode: 201, responseMessage: "You are already register with app", user: result });
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
                                    responseMessage: "Login successfully"
                                });
                                //console.log("what is in token-->>>" + token);
                            })
                        }
                    }
                })
            }
        },

        // buy coupon from store api
        "buyCoupon": function(req, res) { // user Id and ad Id and brolix in request
            waterfall([
                function(callback) {
                    createNewAds.findOne({ _id: req.body.adId }, function(err, result) {
                        i18n = new i18n_module(req.body.lang, configs.langFile);
                        if (err) { res.send({ responseCode: 500, responseMessage: i18n.__("Internal server error 11") }); } else if (!result) { res.send({ responseCode: 404, responseMessage: i18n.__("No ad found") }); } else {
                            if (result.adsType == 'cash') {
                                if (result.cash > 0) {
                                    var type = "storeCouponPriceForUpgradedAds";
                                } else {
                                    var type = "storeCouponPriceForFreeAds";
                                }
                            } else if (result.adsType == 'coupon') {
                                console.log("in coupon type")
                                if (result.cash > 0) {
                                    var type = "storeCouponPriceForUpgradedAds";
                                } else {
                                    var type = "storeCouponPriceForFreeAds";
                                }
                                Brolixanddollors.find({ type: type }, function(err, result) {
                                    if (err) { res.send({ responseCode: 500, responseMessage: i18n.__("Internal server error 11") }); } else {
                                        var value = result[0].value
                                        callback(null, value)
                                    }
                                })

                            } else if (result.adsType == 'ADMINCOUPON') {
                                value = result.couponSellPrice;
                                callback(null, value)

                            }
                        }

                        // }
                    })
                },
                function(value, callback) {
                    console.log("value-->>", value)
                    User.findOne({ _id: req.body.userId }).exec(function(err, userResult) {
                        i18n = new i18n_module(req.body.lang, configs.langFile);
                        if (err) { res.send({ responseCode: 500, responseMessage: i18n.__("Internal server error 22") }); } else if (!userResult) { res.send({ responseCode: 404, responseMessage: i18n.__("Data not found") }); } else if (userResult.brolix < req.body.brolix) { res.send({ responseCode: 400, responseMessage: i18n.__("Insufficient amount of brolix in your account") }); } else {

                            createNewAds.findOne({ _id: req.body.adId }, function(err, adResult) {
                                if (err) { res.send({ responseCode: 500, responseMessage: i18n.__("Internal server error 11") }); } else if (!adResult) { res.send({ responseCode: 404, responseMessage: i18n.__("Please enter correct adId") }); } else {
                                    var flag = adResult.couponSold.indexOf(req.body.userId);
                                    if (flag != -1) { res.send({ responseCode: '400', responseMessage: i18n.__('You have already purchased this coupon') }); } else {
                                        createNewAds.findOne({ _id: req.body.adId }, function(err, result) {
                                            //       console.log("ad result buy coupon --->>", result)
                                            if (err) { res.send({ responseCode: 500, responseMessage: i18n.__("Internal server error 11") }); } else if (!result) { res.send({ responseCode: 404, responseMessage: i18n.__("No ad found") }); } else if (result.couponBuyersLength == result.couponPurchased) { res.send({ responseCode: 201, responseMessage: i18n.__("All coupon sold out") }); } else {

                                                createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $push: { couponSold: req.body.userId }, $inc: { couponPurchased: 1 } }, { new: true }, function(err, result1) {
                                                    if (err) { res.send({ responseCode: 500, responseMessage: i18n.__("Internal server error 11") }); } else {
                                                        callback(null, value, result1.couponCode, result1.couponExpiryDate, result1.pageId)
                                                    }
                                                })
                                            }
                                        })
                                    }
                                }
                                // callback(null, value, result.couponCode, result.couponExpiryDate, result.pageId)

                            })
                        }
                    })

                },
                function(value, couponCode1, couponExpiryDate1, pageId, callback) {
                    console.log("value-->>", value)
                    User.findOne({ _id: req.body.userId }).exec(function(err, result1) {
                        i18n = new i18n_module(req.body.lang, configs.langFile);
                        if (err) { res.send({ responseCode: 500, responseMessage: i18n.__("Internal server error 22") }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: i18n.__("Data not found") }); } else {

                            var startTime = new Date().toUTCString();
                            var h = new Date(new Date(startTime).setHours(00)).toUTCString();
                            var m = new Date(new Date(h).setMinutes(00)).toUTCString();
                            var s = Date.now(m)
                            var coupanAge = couponExpiryDate1;
                            var actualTime = parseInt(s) + parseInt(coupanAge);
                            console.log("coupanAge--->>", coupanAge)
                            var neverExpireTime = parseInt(s) + parseInt(2125651954361);
                            console.log("coupanAge--->>", coupanAge)
                            console.log("neverExpireTime--->>", neverExpireTime)
                            if (coupanAge == 'NEVER') {
                                console.log("if")
                                var data = {
                                    couponCode: couponCode1,
                                    adId: req.body.adId,
                                    pageId: pageId,
                                    type: "PURCHASED",
                                    couponExpire: "NEVER",
                                    expirationTime: neverExpireTime
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
                            //    console.log("data--->>", data)
                            User.findByIdAndUpdate({ _id: req.body.userId }, { $push: { coupon: data, gifts: req.body.adId }, $inc: { brolix: -value } }, { new: true }, function(err, result3) {
                                if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error. 33') }); } else {
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
                    responseMessage: i18n.__("You have successfully purchased the coupon")
                })
            })
        },

        // show list of user's fav coupon
        "listOfFavouriteCoupon": function(req, res) {
            waterfall([
                function(callback) {
                    var userId = req.params.id;
                    User.find({ $or: [{ 'type': 'USER' }, { 'type': 'Advertiser' }], status: 'ACTIVE', isVerified: "TRUE" }).lean().exec(function(err, userResult1) {
                        i18n = new i18n_module(req.params.lang, configs.langFile);
                        if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else {
                            var blockedArray = [];
                            for (var i = 0; i < userResult1.length; i++) {
                                for (var j = 0; j < userResult1[i].blockUser.length; j++) {
                                    if (userResult1[i].blockUser[j].toString() == userId) {
                                        blockedArray.push(userResult1[i]._id)
                                    } else {
                                        console.log("flag------->>>>")
                                    }
                                }
                            }
                            callback(null, blockedArray)
                            console.log("flag------->>>>", JSON.stringify(blockedArray))
                        }
                    })
                },

                function(blockedArray, callback) {
                    Brolixanddollors.findOne({ type: 'storeCouponPriceForFreeAds' }).exec(function(err, result1) {
                        if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error 11" }); } else {
                            var value = result1.value
                            // var value= 2
                            callback(null, value, blockedArray)
                        }
                    })
                },
                function(noDataValue, blockedArray, callback) {
                    Brolixanddollors.findOne({ type: 'storeCouponPriceForUpgradedAds' }).exec(function(err, result1) {
                        i18n = new i18n_module(req.params.lang, configs.langFile);
                        if (err) { res.send({ responseCode: 500, responseMessage: i18n.__("Internal server error 11") }); } else {
                            var value = result1.value
                            //  var value= 4;
                            callback(null, noDataValue, value, blockedArray)
                        }
                    })
                },
                function(noDataValue, dataValue, blockedArray, callback) {
                    var userId = req.body.userId
                    User.findOne({_id:req.body.userId}).exec(function(err, userResult){
                         if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error.') }); }
                        else{
                            var userCountry = userResult.country;
                      
                    createNewAds.find({ userId: { $nin: blockedArray } }).exec(function(err, result) {
                        i18n = new i18n_module(req.params.lang, configs.langFile);
                        if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error.') }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: i18n.__("No ad found") }); } else {
                            var array = [];
                            for (var i = 0; i < result.length; i++) {
                                for (var j = 0; j < result[i].favouriteCoupon.length; j++) {
                                    if (result[i].favouriteCoupon[j] == userId) {
                                        array.push(result[i]._id)
                                    }
                                }
                            }
                            createNewAds.paginate({ _id: { $in: array }, 'whoWillSeeYourAdd.country': userCountry }, { page: req.params.pageNumber, limit: 8 }, function(err, result1) {
                                if (err) { res.send({ responseCode: 500, responseMessage: i18n.__("Internal server error") }); } else if (result1.docs.length == 0) { res.send({ responseCode: 400, responseMessage: i18n.__("No coupon found in your favourites") }); } else {
                                    for (var i = 0; i < result1.docs.length; i++) {
                                        if (result1.docs[i].adsType == 'coupon') {
                                            if (result1.docs[i].cash == 0) {
                                                result1.docs[i].couponSellPrice = noDataValue
                                            } else {
                                                result1.docs[i].couponSellPrice = dataValue
                                            }
                                        }
                                    }

                                    var updatedResult = result1.docs;
                                    createNewAds.populate(updatedResult, { path: 'pageId', model: 'createNewPage', select: 'pageName adAdmin' }, function(err, finalResult) {
                                        res.send({
                                            result: result1,
                                            responseCode: 200,
                                            responseMessage: i18n.__("successfully shown the result")
                                        })
                                    })
                                }
                            })
                        }
                    })
                      }
                    })
                }
            ])
        },

        // add and remove coupon in fav list
        "addRemoveCouponFromFavourite": function(req, res) {
            var adId = req.body.adId;
            var userId = req.body.userId;
            if (req.body.type == "favourite") {
                createNewAds.findOne({ _id: adId }).exec(function(err, result) {
                    i18n = new i18n_module(req.body.lang, configs.langFile);
                    if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }); } else if (!result) { res.send({ responseCode: 404, responseMessage: i18n.__("No ad found") }); }
                    var favouriteCoupon = result.favouriteCoupon;

                    var mySet = new Set(favouriteCoupon);
                    var has = mySet.has(userId)
                    if (has) { res.send({ responseCode: 302, responseMessage: i18n.__("Already added to favourites.") }) } else if (!has) {
                        createNewAds.findOneAndUpdate({ _id: adId }, { $push: { favouriteCoupon: userId } }, { new: true }, function(err, result1) {
                            if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error.') }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: i18n.__("No ad found.") }); } else {
                                res.send({
                                    // result: result1,
                                    responseCode: 200,
                                    responseMessage: i18n.__("Successfully added to favourites")
                                })
                            }
                        })
                    }
                })
            } else {
                createNewAds.findOne({ _id: adId }).exec(function(err, result) {
                    if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }); } else if (!result) { res.send({ responseCode: 404, responseMessage: i18n.__("No ad found.") }); }
                    var favouriteCoupon = result.favouriteCoupon;
                    var mySet = new Set(favouriteCoupon);
                    var has = mySet.has(userId)
                    if (!has) { res.send({ responseCode: 302, responseMessage: i18n.__("Already removed from favourites") }) } else if (has) {
                        createNewAds.findOneAndUpdate({ _id: adId }, { $pop: { favouriteCoupon: -userId } }, { new: true }, function(err, result1) {
                            if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error.') }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: i18n.__("No ad found.") }); } else {
                                res.send({
                                    //   result: result1,
                                    responseCode: 200,
                                    responseMessage: i18n.__("Coupon removed from favourites successfully")
                                })
                            }
                        })
                    }
                })
            }
        },

        // set coupon exchange on off api
        "couponExchangeOnOff": function(req, res) {
            var userId = req.body.userId;
            var status = req.body.status;
            var obj = req.body.couponId
            if (obj == null || obj == '' || obj === undefined) { res.send({ responseCode: 404, responseMessage: 'please enter couponCode' }); } else {
                User.findOne({ _id: userId }).exec(function(err, result) {
                    i18n = new i18n_module(req.body.lang, configs.langFile);
                    if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error.') }); } else if (!result) { res.send({ responseCode: 404, responseMessage: i18n.__("Data not found") }); } else {
                        User.update({ 'coupon._id': obj }, { $set: { 'coupon.$.exchangeStatus': status } }, { new: true }, function(err, result1) {
                            if (err) { res.send({ responseCode: 500, responseMessage: i18n.__("Internal server error") }); } else {
                                res.send({
                                    //result: result1,
                                    responseCode: 200,
                                    responseMessage: i18n.__("Coupon status changed successfully")
                                })
                            }
                        })
                    }
                })
            }
        },

        // send coupon exchange req to other user api
        "sendCouponExchangeRequest": function(req, res) { //  couponCode, receiverId, senderId, exchangedWithAdId, senderCouponId
            console.log("sendCouponExchangeRequest request-->>>", JSON.stringify(req.body))
            waterfall([
                function(callback) {
                    i18n = new i18n_module(req.body.lang, configs.langFile);
                    var obj = req.body.receiverCouponCode;
                    var receiverId = req.body.receiverId;
                    var senderId = req.body.senderId;
                    var senderCouponId = req.body.senderCouponId;
                    var receiverCouponId = req.body.receiverCouponId;
                    var adId = req.body.receiverAdId;
                    var couponExpirationTime = req.body.couponExpirationTime;
                    var receiverCouponExpirationTime = req.body.receiverCouponExpirationTime;
                    var senderCouponType = req.body.senderCouponType;
                    var receiverCouponType = req.body.receiverCouponType;
                    if (!req.body.receiverCouponCode) { res.send({ responseCode: 400, responseMessage: i18n.__("Receiver coupon code is required") }); } else if (!req.body.receiverId) { res.send({ responseCode: 400, responseMessage: i18n.__("receiverId is required") }) } else if (!req.body.senderCouponId) { res.send({ responseCode: 400, responseMessage: i18n.__("senderCouponId is required") }) } else if (!req.body.receiverCouponId) { res.send({ responseCode: 400, responseMessage: i18n.__("receiverCouponId is required") }) } else if (receiverId == senderId) { res.send({ responseCode: 400, responseMessage: i18n.__("You can not send the exchange request to yourself") }) } else {
                        User.findOne({ _id: req.body.receiverId }).exec(function(err, userResult) {
                            //     console.log("***********************-->>>", userResult.privacy.exchangeCoupon)
                            i18n = new i18n_module(req.body.lang, configs.langFile);
                            if (err) { res.send({ responseCode: 302, responseMessage: i18n.__("Internal server error.") }); } else if (!userResult) { res.send({ responseCode: 400, responseMessage: i18n.__("Please enter correct ReceiverId.") }); } else if (userResult.privacy.exchangeCoupon == "off") { res.send({ responseCode: 400, responseMessage: i18n.__("You cannot send coupon exchange request to this user due to privacy policies") }); } else {
                                createNewAds.findOne({ _id: adId }).exec(function(err, result) {
                                    if (err) { res.send({ responseCode: 302, responseMessage: i18n.__("Internal server error.") }); } else if (!result) { res.send({ responseCode: 404, responseMessage: i18n.__("Please enter correct adId") }); } else if (Boolean(result.couponExchangeReceived.find(couponExchangeReceived => couponExchangeReceived.senderCouponId == senderCouponId && couponExchangeReceived.couponExchangeStatus == "REQUESTED"))) {
                                        res.send({ responseCode: 302, responseMessage: i18n.__("Already requested for this coupon") });
                                    } else {
                                        User.aggregate({ $unwind: '$coupon' }, { $match: { 'coupon._id': new mongoose.Types.ObjectId(senderCouponId) } }, function(err, user1) {
                                            if (err) { res.send({ responseCode: 500, responseMessage: i18n.__("Internal server error11.") }) } else if (!user1) { res.send({ responseCode: 404, responseMessage: i18n.__("Please enter correct coupon Id.") }) } else if ((user1[0].coupon.couponStatus) != 'VALID') {
                                                res.send({ responseCode: 403, responseMessage: i18n.__("Please request for a valid coupon") })
                                            } else if ((user1[0].coupon.status) != 'ACTIVE') {
                                                res.send({ responseCode: 403, responseMessage: i18n.__("Please request for a valid coupon") })
                                            } else {
                                                User.aggregate({ $unwind: '$coupon' }, { $match: { 'coupon._id': new mongoose.Types.ObjectId(receiverCouponId) } }, function(err, user) {
                                                    console.log("coupon.exchangeStatus--->>>", JSON.stringify(user[0].coupon.exchangeStatus))
                                                    console.log("coupon.couponStatus--->>>", JSON.stringify(user[0].coupon.couponStatus))
                                                    if (err) { res.send({ responseCode: 500, responseMessage: i18n.__("Internal server error11") }) } else if (!user) { res.send({ responseCode: 404, responseMessage: i18n.__("Please enter correct coupon Id") }) } else if ((user[0].coupon.couponStatus) != 'VALID') {
                                                        res.send({ responseCode: 403, responseMessage: i18n.__("Please request for a valid coupon") })
                                                    } else if ((user[0].coupon.exchangeStatus) == 'OFF') {
                                                        res.send({ responseCode: 403, responseMessage: i18n.__("Exchange request not allowed") })
                                                    } else {
                                                        callback(null)
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                },
                function(callback) {
                    var receiverId = req.body.receiverId;
                    var senderId = req.body.senderId;
                    var adId = req.body.receiverAdId;
                    var senderAdId = req.body.senderAdId;
                    var senderCouponCode = req.body.senderCouponCode;
                    var senderCouponId = req.body.senderCouponId;
                    var receiverCouponId = req.body.receiverCouponId;
                    var couponExpirationTime = req.body.couponExpirationTime;
                    var receiverCouponExpirationTime = req.body.receiverCouponExpirationTime;
                    var senderCouponType = req.body.senderCouponType;
                    var receiverCouponType = req.body.receiverCouponType;
                    i18n = new i18n_module(req.body.lang, configs.langFile);
                    if (!req.body.senderId) { res.send({ responseCode: 400, responseMessage: i18n.__("senderId is required.") }) } else if (!req.body.receiverAdId) { res.send({ responseCode: 400, responseMessage: i18n.__("adId is required.") }) } else if (!req.body.senderAdId) { res.send({ responseCode: 400, responseMessage: i18n.__("exchangedWithAdId is required.") }) } else if (!req.body.senderCouponCode) { res.send({ responseCode: 400, responseMessage: i18n.__("senderCouponCode is required.") }) } else if (!req.body.senderCouponId) { res.send({ responseCode: 400, responseMessage: i18n.__("senderCouponId is required.") }) } else if (!req.body.receiverCouponId) { res.send({ responseCode: 400, responseMessage: i18n.__("receiverCouponId is required.") }) } else {
                        User.findOne({ _id: receiverId }, function(err, result2) {
                            if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error. 33') }); } else if (!result2) { res.send({ responseCode: 404, responseMessage: i18n.__("Data not found") }); } else if (result2.privacy.exchangeCoupon == "onlyMe") { res.send({ responseCode: 409, responseMessage: i18n.__("you are not allowed to send exchange request") }) } else if (result2.privacy.exchangeCoupon == "followers") {
                                var flag = result2.userFollowers.find(userFollowers => userFollowers == senderId)
                                if (flag === undefined) { res.send({ responseCode: 400, responseMessage: "You cannot send coupon exchange request to this user due to privacy policies" }); } else {
                                    createNewAds.findByIdAndUpdate({ _id: adId }, { $push: { "couponExchangeReceived": { senderId: req.body.senderId, receiverId: req.body.receiverId, exchangedWithAdId: senderAdId, senderCouponCode: senderCouponCode, senderCouponId: senderCouponId, receiverCouponId: receiverCouponId, couponExpirationTime: couponExpirationTime, senderCouponType:senderCouponType, receiverCouponType:req.body.receiverCouponType } } }, { new: true }).exec(function(err, result3) {
                                        if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error. 44') }) } else if (!result3) { res.send({ responseCode: 404, responseMessage: i18n.__("Receiver ad not found.") }); } else {
                                            
                                            //  
//                                            var data = {
//                                        userId: senderId,
//                                        type: req.body.lang=="en"?""+result.firstName+" sent you cash. Click here to check your balance.":""+result.firstName+" قام بارسال الكاش اليك. اضغط هنا لمشاهدة الرصيد الخاص بك.",
//                                        linkType: 'profile',
//                                        notificationType: 'cashReceivedType',
//                                        image: image
//                                    }

                                            createNewAds.findByIdAndUpdate({ _id: senderAdId }, { $push: { "couponExchangeSent": { senderId: req.body.senderId, receiverId: req.body.receiverId, exchangedWithAdId: adId, senderCouponId: senderCouponId, receiverCouponId: receiverCouponId,receiverCouponExpirationTime:receiverCouponExpirationTime,receiverCouponType:receiverCouponType, senderCouponType:req.body.senderCouponType } /* , notification :data*/ } }, { new: true }).exec(function(err, result4) {
                                                if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error. 55') }) } else if (!result4) { res.send({ responseCode: 404, responseMessage: i18n.__("Sender ad not found.") }); } else {
                                                    //  callback(null, result3)
                                                }
                                            })
                                            callback(null, result3)
                                        }
                                    })
                                }
                                if (result2.deviceToken && result2.deviceType && result2.notification_status && result2.status) {
                                    User.findOne({ _id: req.body.senderId }, function(err, resultUser) {
                                    var message = req.body.lang=="en"?""+resultUser.firstName+" sent you an exchange coupon request. Click here to check his request.":""+resultUser.firstName+" قام بارسال طلب لمبادلة الكوبون الخاص بك. اضغط هنا لمشاهدة الطلب."
                                    if (result2.deviceType == 'Android' && result2.notification_status == 'on' && result2.status == 'ACTIVE') {

                                        functions.android_notification(result2.deviceToken, message);
                                        console.log("Android notification send!!!!")
                                    } else if (result2.deviceType == 'iOS' && result2.notification_status == 'on' && result2.status == 'ACTIVE') {
                                        functions.iOS_notification(result2.deviceToken, message);
                                    } else {
                                        console.log("Something wrong!!!!")
                                    }
                                })
                                }
                            } else {
                                createNewAds.findByIdAndUpdate({ _id: adId }, { $push: { "couponExchangeReceived": { senderId: req.body.senderId, receiverId: req.body.receiverId, exchangedWithAdId: senderAdId, senderCouponCode: senderCouponCode, senderCouponCode: senderCouponCode, senderCouponId: senderCouponId, receiverCouponId: receiverCouponId, couponExpirationTime: couponExpirationTime,senderCouponType:senderCouponType, receiverCouponType:req.body.receiverCouponType } } }, { new: true }).exec(function(err, result5) {
                                    if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error. 66') }) } else if (!result5) { res.send({ responseCode: 404, responseMessage: i18n.__("Receiver ad not found.") }); } else {

                                        createNewAds.findByIdAndUpdate({ _id: senderAdId }, { $push: { "couponExchangeSent": { senderId: req.body.senderId, receiverId: req.body.receiverId, exchangedWithAdId: adId, senderCouponCode: senderCouponCode, senderCouponId: senderCouponId, receiverCouponId: receiverCouponId,receiverCouponExpirationTime:receiverCouponExpirationTime,receiverCouponType:receiverCouponType, senderCouponType:req.body.senderCouponType } } }, { new: true }).exec(function(err, result6) {
                                            if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error. 77') }) } else if (!result6) { res.send({ responseCode: 404, responseMessage: i18n.__("Sender ad not found.") }); } else {
                                                //  callback(null, result3)
                                            }
                                        })
                                        callback(null, result5)
                                    }
                                })
                                if (result2.deviceToken && result2.deviceType && result2.notification_status && result2.status) {
                                     User.findOne({ _id: req.body.senderId }, function(err, resultUser) {
                                    var message =  req.body.lang=="en"?""+resultUser.firstName+" sent you an exchange coupon request. Click here to check his request.":""+resultUser.firstName+" قام بارسال طلب لمبادلة الكوبون الخاص بك. اضغط هنا لمشاهدة الطلب."
                                    if (result2.deviceType == 'Android' && result2.notification_status == 'on' && result2.status == 'ACTIVE') {

                                        functions.android_notification(result2.deviceToken, message);
                                        console.log("Android notification send!!!!")
                                    } else if (result2.deviceType == 'iOS' && result2.notification_status == 'on' && result2.status == 'ACTIVE') {
                                        functions.iOS_notification(result2.deviceToken, message);
                                    } else {
                                        console.log("Something wrong!!!!")
                                    }
                                })
                                }
                            }
                        })
                    }
                },
            ], function(err, result) {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: i18n.__("Coupon exchange request send successfully")
                });
            })
        },

        // see all coupon exchange received request
        "seeExchangeRequest": function(req, res) {
            console.log("seeExchangeRequest--->>", req.body)
            i18n = new i18n_module(req.body.lang, configs.langFile);
            waterfall([
                function(callback) {
                    var receiverId = req.body.userId;
                    var userId = req.body.userId;
                    User.find({ $or: [{ 'type': 'USER' }, { 'type': 'Advertiser' }], status: 'ACTIVE', isVerified: "TRUE" }).lean().exec(function(err, userResult1) {
                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                            var blockedArray = [];
                            for (var i = 0; i < userResult1.length; i++) {
                                for (var j = 0; j < userResult1[i].blockUser.length; j++) {
                                    if (userResult1[i].blockUser[j].toString() == userId) {
                                        blockedArray.push(userResult1[i]._id.toString())
                                    } else {
                                        console.log("flag------->>>>")
                                    }
                                }
                            }
                            callback(null, blockedArray)
                        }
                    })
                },
                function(blockedArray, callback) {
                    var receiverId = req.body.userId;
                    var userId = req.body.userId;
                     console.log("req.body.receiverCouponType-111-->>", JSON.stringify(req.body.receiverCouponType))
                    createNewAds.aggregate({ $unwind: '$couponExchangeReceived' }, { $match: { _id: new mongoose.Types.ObjectId(req.body.adId), 'couponExchangeReceived.receiverId': receiverId, 'couponExchangeReceived.couponExchangeStatus': "REQUESTED", 'couponExchangeReceived.receiverCouponType':req.body.receiverCouponType, 'couponExchangeReceived.senderId': { $nin: blockedArray } } }).exec(function(err, user) {
                        if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else if (user.length == 0) { res.send({ responseCode: 400, responseMessage: i18n.__('No requests found.') }); } else {
                            createNewAds.populate(user, {
                                path: 'couponExchangeReceived.senderId',
                                model: 'brolixUser',
                                select: 'firstName lastName image country state city'
                            }, function(err, result1) {
                                if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else {
                                    callback(null, blockedArray, result1)
                                }

                            })
                        }
                    })
                },
                function(blockedArray, result1, callback) {
                    var CouponIds = [];
                    for (var k = 0; k < result1.length; k++) {

                        CouponIds.push(result1[k].couponExchangeReceived.senderCouponId.toString())
                    }
                    console.log("CouponIds->>>", JSON.stringify(CouponIds))
                    var index = 0;
                    var couponArray = [];
                    async.forEachOfLimit(CouponIds, 1, function(value, key, callback) {
                        console.log("index->>>", JSON.stringify(index))
                        var id = value;
                        User.aggregate({ $unwind: '$coupon' }, { $match: { $and: [{ 'coupon._id': new mongoose.Types.ObjectId(id), 'coupon.couponStatus': 'VALID', 'coupon.status': 'ACTIVE' }] } }).exec(function(err, couponresult) {
                            index++;
                            if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else if (couponresult.length == 0) {
                                console.log("in else if")
                                couponArray.push(id.toString())
                                console.log("in else", couponArray)
                                callback();
                            } else {
                                console.log(index == CouponIds.length)
                                if (index == CouponIds.length) {
                                    console.log("couponArray->>>", JSON.stringify(couponArray))
                                    callback(null, blockedArray, couponArray)
                                } else {
                                    callback();
                                }
                            }
                        })
                    }, function(err) {
                        console.log("in result", couponArray)
                        callback(null, blockedArray, couponArray)
                    });

                },
                function(blockedArray, couponArray, callback) {
                    var receiverId = req.body.userId;
                    var userId = req.body.userId;
                    createNewAds.aggregate({ $unwind: '$couponExchangeReceived' }, { $match: { $and: [{ _id: new mongoose.Types.ObjectId(req.body.adId), 'couponExchangeReceived.receiverId': receiverId, 'couponExchangeReceived.couponExchangeStatus': "REQUESTED", 'couponExchangeReceived.receiverCouponType':req.body.receiverCouponType, 'couponExchangeReceived.senderId': { $nin: blockedArray }, 'couponExchangeReceived.senderCouponId': { $nin: couponArray } }] } }).exec(function(err, user2) {
                        if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else if (user2.length == 0) { res.send({ responseCode: 400, responseMessage: i18n.__('No requests found.') }); } else {
                            createNewAds.populate(user2, {
                                path: 'couponExchangeReceived.senderId',
                                model: 'brolixUser',
                                select: 'firstName lastName image country state city'
                            }, function(err, result2) {
                                if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else {
                                    callback(null, result2)
                                }

                            })
                        }
                    })
                },
            ], function(err, result) {
                res.send({
                    responseCode: 200,
                    responseMessage: i18n.__("All request show successfully"),
                    result: result
                })
            })

        },

        // search for coupon exchange request
        "couponRequestsSearch": function(req, res) {
            var re = new RegExp(req.body.firstName, 'i');
            User.find({ status: 'ACTIVE' }).or([{ 'firstName': { $regex: re } }]).exec(function(err, result) {
                i18n = new i18n_module(req.body.lang, configs.langFile);
                if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: i18n.__("Data not found") }); } else {
                    res.send({
                        result: result,
                        responseCode: 200,
                        responseMessage: i18n.__("User show successfully.")
                    });
                }
            })

        },

        // api to send coupon to any user
        "sendCouponToFollower": function(req, res) {
            console.log("send coupon request=----->>>", JSON.stringify(req.body))
            waterfall([
                function(callback) {
                    var senderCouponId = req.body.senderCouponId;
                    var receiverId = req.body.receiverId;
                    var senderId = req.body.senderId;
                    var adId = req.body.adId;
                    var couponId = req.body.couponId;
                    i18n = new i18n_module(req.body.lang, configs.langFile);
                    User.aggregate({ $unwind: '$coupon' }, { $match: { 'coupon._id': new mongoose.Types.ObjectId(req.body.senderCouponId), _id: new mongoose.Types.ObjectId(req.body.senderId) } }, function(err, user) {
                        console.log("user----->>>", user[0].coupon.couponStatus)
                        if (err) { res.send({ responseCode: 500, responseMessage: i18n.__("Internal server error11") }) } else if (!user) { res.send({ responseCode: 404, responseMessage: i18n.__("Please enter correct coupon Id.") }) } 
                        else if ((user[0].coupon.status) != 'ACTIVE') {
                            res.send({ responseCode: 403, responseMessage: i18n.__("Please enter a valid coupon.") });
                        }
                        else if ((user[0].coupon.couponStatus) != 'VALID') {
                            res.send({ responseCode: 403, responseMessage: i18n.__("Please enter a valid coupon.") });
                        } else {
                            User.findOne({ _id: receiverId }, function(err, result) {
                                console.log("result.privacy.exchangeCoupon----->>>", result.privacy.exchangeCoupon)
                                console.log("result.privacy.sendCoupon----->>>", result.privacy.sendCoupon)
                                if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error12') }); } else if (!result) { res.send({ responseCode: 404, responseMessage: i18n.__("Data not found")}); } else if (result.privacy.sendCoupon == "nobody") { res.send({ responseCode: 409, responseMessage: i18n.__("You cannot send coupon to this user due to privacy policies") }) } else {
                                    callback(null)
                                }
                            })
                        }
                    })
                },
                function(callback) { //  receiverId  senderId senderCouponId adId
                    console.log("in friendssssss")
                    var receiverId = req.body.receiverId;
                    var senderId = req.body.senderId;
                    var senderCouponId = req.body.senderCouponId;
                    var adId = req.body.adId;
                    var startTime = new Date().toUTCString();
                    var h = new Date(new Date(startTime).setHours(00)).toUTCString();
                    var m = new Date(new Date(h).setMinutes(00)).toUTCString();
                    var currentTime = Date.now(m);
                    i18n = new i18n_module(req.body.lang, configs.langFile);
                    User.findOne({ _id: senderId }, function(err, senderRes) {
                    User.findOne({ _id: receiverId }, function(err, result1) {
                        if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error 11') }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: i18n.__("Data not found") }); } else if (result1.privacy.sendCoupon == "onlyFollowers") {
                            var flag = result1.userFollowers.indexOf(req.body.senderId)
                            if (flag == -1) { res.send({ responseCode: 400, responseMessage: i18n.__("You cannot send coupon to this user due to privacy policies") }); } else {
                                console.log("2")
                                createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $push: { "couponSend": { senderId: senderId, receiverId: receiverId, sendDate: currentTime } } }).exec(function(err, result2) {
                                    if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error 22') }); } else if (!result2) { res.send({ responseCode: 404, responseMessage: i18n.__("No ad found 1.") }); } else {
                                        User.findOneAndUpdate({ 'coupon._id': new mongoose.Types.ObjectId(req.body.senderCouponId) }, { $set: { "coupon.$.status": "SEND" } }, { new: true }).exec(function(err, result3) {
                                            //    console.log("sendCoupon to follower--->>>",JSON.stringify(result3))
                                            if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error 33') }); } else if (!result3) { res.send({ responseCode: 404, responseMessage: i18n.__("No ad found 2.") }); } else {
                                                for (i = 0; i < result3.coupon.length; i++) {
                                                    if (result3.coupon[i]._id == req.body.senderCouponId) {
                                                        var couponCode = result3.coupon[i].couponCode;
                                                        var couponAdId = result3.coupon[i].adId;
                                                        var expirationTime = result3.coupon[i].expirationTime;
                                                        var pageId = result3.coupon[i].pageId;
                                                        var couponExpire = result3.coupon[i].couponExpire;
                                                        var type = "SENDBYFOLLOWER";
                                                    }
                                                }
                                                var coupon = {
                                                    couponCode: couponCode,
                                                    adId: couponAdId,
                                                    expirationTime: expirationTime,
                                                    pageId: pageId,
                                                    type: type,
                                                    couponExpire: couponExpire
                                                }

                                                var data = {
                                                    userId: req.body.senderId,
                                                    type: req.body.lang=="en"?""+senderRes.firstName+" sent a coupon to your gifts . Click here to check your gifts":""+senderRes.firstName+" قام بارسال كوبون الى صفحة الهدايا الخاصة بك. اضغط هنا لمشاهدة الهدايا الخاصة بك.",
                                                    linkType: 'coupon',
                                                    notificationType: 'couponReceived'
                                                }

                                                console.log("coupon to follower-- friends-->>>", coupon)
                                                console.log("coupon to follower-- couponAdId-->>>", couponAdId)
                                                console.log("coupon to follower-- data-->>>", data)
                                                User.findByIdAndUpdate({ _id: req.body.receiverId }, { $push: { 'coupon': coupon, notification: data, gifts: couponAdId } }, { new: true }, function(err, result4) {
                                                    //    console.log("receiverId--->>>", result4)
                                                    if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error 44') }); } else if (!result4) { res.send({ responseCode: 404, responseMessage: i18n.__("Data not found") }); } else {
                                                        if (result4.deviceToken && result4.deviceType && result4.notification_status && result4.status) {
                                                           var message = req.body.lang=="en"?""+senderRes.firstName+" sent a coupon to your gifts . Click here to check your gifts":""+senderRes.firstName+" قام بارسال كوبون الى صفحة الهدايا الخاصة بك. اضغط هنا لمشاهدة الهدايا الخاصة بك.";
                                                            if (result4.deviceType == 'Android' && result4.notification_status == 'on' && result4.status == 'ACTIVE') {
                                                                functions.android_notification(result4.deviceToken, message);
                                                                console.log("Android notification send!!!!")
                                                            } else if (result4.deviceType == 'iOS' && result4.notification_status == 'on' && result4.status == 'ACTIVE') {
                                                                functions.iOS_notification(result4.deviceToken, message);
                                                            } else {
                                                                console.log("Something wrong!!!!")
                                                            }
                                                        }
                                                        callback(null, result4)
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }

                        } else {
                            console.log("in public ccccccccc")
                            var receiverId = req.body.receiverId;
                            var senderId = req.body.senderId;
                            var senderCouponId = req.body.senderCouponId;
                            var adId = req.body.adId;
                            var startTime = new Date().toUTCString();
                            var h = new Date(new Date(startTime).setHours(00)).toUTCString();
                            var m = new Date(new Date(h).setMinutes(00)).toUTCString();
                            var currentTime = Date.now(m);
                            createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $push: { "couponSend": { senderId: senderId, receiverId: receiverId, sendDate: currentTime } } }).exec(function(err, result2) {
                                if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error 55') }); } else if (!result2) { res.send({ responseCode: 404, responseMessage: i18n.__("No ad found 3.") }); } else {

                                    User.findOneAndUpdate({ 'coupon._id': new mongoose.Types.ObjectId(req.body.senderCouponId) }, { $set: { "coupon.$.status": "SEND" } }, { new: true }, function(err, result3) {
                                        //      console.log("senderCouponId-111-->>", JSON.stringify(result3))
                                        if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error 66') }); } else if (!result3) { res.send({ responseCode: 404, responseMessage: i18n.__("No ad found 4.") }); } else {
                                            for (i = 0; i < result3.coupon.length; i++) {
                                                if (result3.coupon[i]._id == req.body.senderCouponId) {
                                                    var couponCode = result3.coupon[i].couponCode;
                                                    var couponAdId = result3.coupon[i].adId;
                                                    var expirationTime = result3.coupon[i].expirationTime;
                                                    var pageId = result3.coupon[i].pageId;
                                                    var couponExpire = result3.coupon[i].couponExpire;
                                                    var type = "SENDBYFOLLOWER";
                                                }
                                            }
                                            var coupon = {
                                                couponCode: couponCode,
                                                adId: couponAdId,
                                                expirationTime: expirationTime,
                                                pageId: pageId,
                                                type: type,
                                                couponExpire: couponExpire
                                            }

                                            var data = {
                                                userId: req.body.senderId,
                                                type: req.body.lang=="en"?""+senderRes.firstName+" sent a coupon to your gifts . Click here to check your gifts":""+senderRes.firstName+" قام بارسال كوبون الى صفحة الهدايا الخاصة بك. اضغط هنا لمشاهدة الهدايا الخاصة بك.",
                                                linkType: 'coupon',
                                                notificationType: 'couponReceived'
                                            }
                                            console.log("coupon send public--->>>", coupon)
                                            User.findByIdAndUpdate({ _id: req.body.receiverId }, { $push: { 'coupon': coupon, notification: data, gifts: couponAdId, } }, { new: true }, function(err, result4) {
                                                if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error 77') }); } else if (!result4) { res.send({ responseCode: 404, responseMessage: i18n.__("Data not found")}); } else {
                                                    if (result4.deviceToken && result4.deviceType && result4.notification_status && result4.status) {
                                                        var message = req.body.lang=="en"?""+senderRes.firstName+" sent a coupon to your gifts . Click here to check your gifts":""+senderRes.firstName+" قام بارسال كوبون الى صفحة الهدايا الخاصة بك. اضغط هنا لمشاهدة الهدايا الخاصة بك.";
                                                        if (result4.deviceType == 'Android' && result4.notification_status == 'on' && result4.status == 'ACTIVE') {
                                                            functions.android_notification(result4.deviceToken, message);
                                                            console.log("Android notification send!!!!")
                                                        } else if (result4.deviceType == 'iOS' && result4.notification_status == 'on' && result4.status == 'ACTIVE') {
                                                            functions.iOS_notification(result4.deviceToken, message);
                                                        } else {
                                                            console.log("Something wrong!!!!")
                                                        }
                                                    }
                                                    callback(null, result4)
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
})
                },
            ], function(err, result) {
                res.send({
                    // result: result,
                    responseCode: 200,
                    responseMessage: i18n.__("Coupon send to follower successfully")
                });
            })
        },

        // api to accept or decline coupon exchange received request
        "acceptDeclineCouponRequest": function(req, res) { //receiverRequestId senderCouponCode senderId receiverId receiverCouponCode status
            console.log("accept Declined req--->>>", JSON.stringify(req.body))
            if (req.body.status == 'accepted') {
                waterfall([
                    function(callback) {
                        i18n = new i18n_module(req.body.lang, configs.langFile);
                        var senderCouponId = req.body.senderCouponId;
                        var receiverCouponId = req.body.receiverCouponId;
                        var receiverRequestId = req.body.receiverRequestId;
                        var startTime = new Date().toUTCString();
                        var h = new Date(new Date(startTime).setHours(00)).toUTCString();
                        var m = new Date(new Date(h).setMinutes(00)).toUTCString();
                        var currentTime = Date.now(m);
                        if (!req.body.receiverRequestId) { res.send({ responseCode: 400, responseMessage: i18n.__("Receiver RequestId is required") }); } else if (!req.body.senderCouponId) { res.send({ responseCode: 400, responseMessage: i18n.__("senderCouponId is required.") }) } else if (!req.body.receiverCouponId) { res.send({ responseCode: 400, responseMessage: i18n.__("receiverCouponId is required.") }) } else {
                            User.aggregate({ $unwind: '$coupon' }, { $match: { 'coupon._id': new mongoose.Types.ObjectId(senderCouponId) } }, function(err, user) {
                                if (err) { res.send({ responseCode: 500, responseMessage: i18n.__("Internal server error11.") }) } else if (!user) { res.send({ responseCode: 404, responseMessage: i18n.__("Please enter correct coupon Id.") }) } else if ((user[0].coupon.status) != 'ACTIVE') {
                                    res.send({ responseCode: 403, responseMessage: i18n.__("Coupon is already exchanged with someone else.") })
                                } else {
                                    createNewAds.aggregate({ $unwind: '$couponExchangeReceived' }, { $match: { 'couponExchangeReceived._id': new mongoose.Types.ObjectId(receiverRequestId) } }, function(err, user) {
                                        console.log("coupon.couponExchangeStatus--->>>", JSON.stringify(user[0].couponExchangeReceived.couponExchangeStatus))
                                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 11' }); } else if (!user) { res.send({ responseCode: 404, responseMessage: "No ad found." }); } else if ((user[0].couponExchangeReceived.couponExchangeStatus) == 'DECLINED') {
                                            res.send({ responseCode: 403, responseMessage: i18n.__("You have declined for this request before.") })
                                        } else {
                                            createNewAds.findOneAndUpdate({ 'couponExchangeReceived._id': receiverRequestId }, { $set: { "couponExchangeReceived.$.couponExchangeStatus": "ACCEPTED" } }, { new: true }).exec(function(err, result) {
                                                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 11' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No ad found." }); } else { callback(null) }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    },
                    function(callback) {
                        var senderId = req.body.senderId;
                        createNewAds.aggregate({ $unwind: '$couponExchangeSent' }, { $match: { 'couponExchangeSent.senderCouponId': req.body.senderCouponId, 'couponExchangeSent.senderId': senderId, 'couponExchangeSent.couponExchangeStatus': "REQUESTED" } }, function(err, result) {
                            i18n = new i18n_module(req.body.lang, configs.langFile);
                            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result.length == 0) { callback(null) } else {
                                var requestId = result[0].couponExchangeSent._id;
                                console.log("accept decline --->>>" + requestId)
                                createNewAds.update({ 'couponExchangeSent._id': new mongoose.Types.ObjectId(requestId) }, { $set: { 'couponExchangeSent.$.couponExchangeStatus': 'ACCEPTED' } }, { new: true }).exec(function(err, updatedResult) {
                                    console.log("updatedResult--->>>" + JSON.stringify(updatedResult))
                                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {

                                        callback(null)
                                    }
                                })
                            }
                        })
                    },
                    function(callback) {
                        i18n = new i18n_module(req.body.lang, configs.langFile);
                        var h = new Date(new Date(startTime).setHours(00)).toUTCString();
                        var m = new Date(new Date(h).setMinutes(00)).toUTCString();
                        var currentTime = Date.now(m);
                        var senderId = req.body.senderId;
                        var senderCouponCode = req.body.senderCouponCode;
                        var senderCouponId = req.body.senderCouponId;
                        var receiverCouponId = req.body.receiverCouponId;
                        if (!req.body.senderId) { res.send({ responseCode: 400, responseMessage: "SenderId is required" }); } else if (!req.body.senderCouponCode) { res.send({ responseCode: 400, responseMessage: "SenderCouponCode is required" }); } else if (!req.body.senderCouponId) { res.send({ responseCode: 400, responseMessage: "senderCouponId is required." }) } else if (!req.body.receiverCouponId) { res.send({ responseCode: 400, responseMessage: "receiverCouponId is required." }) } else {
                            User.findOneAndUpdate({ 'coupon._id': senderCouponId }, { $set: { "coupon.$.status": "EXCHANGED" } }, { new: true }).exec(function(err, result1) {
                                //   console.log("result-->>", result1)
                                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 22' }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: i18n.__("Data not found") }); } else {

                                    User.findOne({ 'coupon._id': senderCouponId }).exec(function(err, result2) {
                                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 33' }); } else if (!result2) { res.send({ responseCode: 404, responseMessage: i18n.__("Data not found")}); } else {
                                            for (i = 0; i < result2.coupon.length; i++) {
                                                if (result2.coupon[i]._id == senderCouponId) {
                                                    var couponCode = result2.coupon[i].couponCode;
                                                    var couponAdId = result2.coupon[i].adId;
                                                    var expirationTime = result2.coupon[i].expirationTime;
                                                    var pageId = result2.coupon[i].pageId;
                                                    var couponExpire = result2.coupon[i].couponExpire;
                                                    var type = "EXCHANGED"
                                                }
                                            }
                                            callback(null, couponExpire, couponCode, couponAdId, expirationTime, pageId, type)
                                        }
                                    })
                                }
                            })
                        }
                    },
                    function(couponExpire1, couponCode1, couponAdId1, expirationTime1, pageId1, type1, callback) {
                        console.log("couponCode-11-->>", couponCode1);
                        console.log("couponId-11-->>", couponAdId1);
                        console.log("expirationTime-11-->>>", expirationTime1);
                        console.log("pageId1-11-->>>", pageId1);
                        console.log("type1-11-->>>", type1);
                        console.log("couponExpire1-11-->>>", couponExpire1);
                        i18n = new i18n_module(req.body.lang, configs.langFile);
                        var h = new Date(new Date(startTime).setHours(00)).toUTCString();
                        var m = new Date(new Date(h).setMinutes(00)).toUTCString();
                        var currentTime = Date.now(m);
                        var receiverId = req.body.receiverId;
                        // var receiverCouponCode = req.body.receiverCouponCode;
                        var senderCouponId = req.body.senderCouponId;
                        var receiverCouponId = req.body.receiverCouponId;
                        if (receiverId == undefined || receiverId == null || receiverId == '') { res.send({ responseCode: 400, responseMessage: "receiverId is required" }); } else if (!req.body.senderCouponId) { res.send({ responseCode: 400, responseMessage: "senderCouponId is required." }) } else if (!req.body.receiverCouponId) { res.send({ responseCode: 400, responseMessage: "receiverCouponId is required." }) } else {

                            var data = {
                                couponCode: couponCode1,
                                adId: couponAdId1,
                                expirationTime: expirationTime1,
                                pageId: pageId1,
                                type: type1,
                                couponExpire: couponExpire1
                            }

                            User.findOneAndUpdate({ _id: receiverId }, { $push: { coupon: data, gifts: couponAdId1 } }, { new: true }).exec(function(err, result3) {
                                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 44' }); } else if (!result3) { res.send({ responseCode: 404, responseMessage: i18n.__("Data not found")}); } else {

                                    User.findOneAndUpdate({ 'coupon._id': receiverCouponId }, { $set: { "coupon.$.status": "EXCHANGED" } }, { new: true }).exec(function(err, result4) {
                                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 55' }); } else if (!result4) { res.send({ responseCode: 404, responseMessage: i18n.__("Data not found") }); } else {

                                            User.findOne({ 'coupon._id': receiverCouponId }).exec(function(err, result5) {
                                                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 66' }); } else if (!result5) { res.send({ responseCode: 404, responseMessage: i18n.__("Data not found") }); } else {
                                                    for (i = 0; i < result5.coupon.length; i++) {
                                                        if (result5.coupon[i]._id == receiverCouponId) {
                                                            var couponCode2 = result5.coupon[i].couponCode;
                                                            var couponAdId2 = result5.coupon[i].adId;
                                                            var expirationTime2 = result5.coupon[i].expirationTime;
                                                            var pageId2 = result5.coupon[i].pageId;
                                                            var couponExpire2 = result5.coupon[i].couponExpire;
                                                            var type2 = "EXCHANGED"
                                                        }
                                                    }
                                                    callback(null, couponExpire2, couponCode2, couponAdId2, expirationTime2, pageId2, type2)
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }

                    },
                    function(couponExpire2, couponCode2, couponAdId2, expirationTime2, pageId2, type2, callback) {
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
                        var senderCouponId = req.body.senderCouponId;
                        var receiverCouponId = req.body.receiverCouponId;
                        i18n = new i18n_module(req.body.lang, configs.langFile);
                        if (!req.body.senderId) { res.send({ responseCode: 400, responseMessage: "SenderId is required" }); } else if (!req.body.senderCouponId) { res.send({ responseCode: 400, responseMessage: "senderCouponId is required." }) } else if (!req.body.receiverCouponId) { res.send({ responseCode: 400, responseMessage: "receiverCouponId is required." }) } else {
                            var data1 = {
                                couponCode: couponCode2,
                                adId: couponAdId2,
                                expirationTime: expirationTime2,
                                pageId: pageId2,
                                type: type2,
                                couponExpire: couponExpire2
                            }

                            User.findOneAndUpdate({ _id: senderId }, { $push: { coupon: data1, gifts: couponAdId2 } }, { new: true }).exec(function(err, result6) {
                                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 77' }); } else if (!result6) { res.send({ responseCode: 404, responseMessage: i18n.__("Data not found") }); } else {
                                    callback(null, result6)
                                }
                            })
                        }
                    },
                ], function(err, result) {
                    res.send({
                        result: result,
                        responseCode: 200,
                        responseMessage: i18n.__("Coupon exchanged successfully")
                    });
                })
            } else {
                var senderCouponId = req.body.senderCouponId;
                var receiverCouponId = req.body.receiverCouponId;
                var receiverRequestId = req.body.receiverRequestId;
                var startTime = new Date().toUTCString();
                var h = new Date(new Date(startTime).setHours(00)).toUTCString();
                var m = new Date(new Date(h).setMinutes(00)).toUTCString();
                var currentTime = Date.now(m);
                i18n = new i18n_module(req.body.lang, configs.langFile);
                if (!req.body.receiverRequestId) { res.send({ responseCode: 400, responseMessage: "ReceiverRequestId is required." }); } else {
                    createNewAds.findOneAndUpdate({ 'couponExchangeReceived._id': receiverRequestId }, { $set: { "couponExchangeReceived.$.couponExchangeStatus": "DECLINED" } }, { new: true }).exec(function(err, result) {
                        //    console.log("result-->.", result)
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 11' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No ad found." }); } else {

                            var senderId = req.body.senderId;
                            createNewAds.aggregate({ $unwind: '$couponExchangeSent' }, { $match: { 'couponExchangeSent.senderCouponId': req.body.senderCouponId, 'couponExchangeSent.senderId': senderId, 'couponExchangeSent.couponExchangeStatus': "REQUESTED" } }, function(err, result) {
                                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result.length == 0) {
                                    res.send({
                                        responseCode: 400,
                                        responseMessage: i18n.__("User declined your request")
                                    })
                                } else {
                                    var requestId = result[0].couponExchangeSent._id;
                                    //  var receiverAdId = result[0].couponExchangeSent.exchangedWithAdId;
                                    //  var senderCouponId = result[0].couponExchangeSent.senderCouponId;
                                    createNewAds.update({ 'couponExchangeSent._id': new mongoose.Types.ObjectId(requestId) }, { $set: { 'couponExchangeSent.$.couponExchangeStatus': 'DECLINED' } }, { new: true }).exec(function(err, updatedResult) {
                                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {

                                            res.send({
                                                responseCode: 400,
                                                responseMessage: i18n.__("User declined your request")
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            }
        },

        // show list of user who registered with refferal code
        "registerWithRefferalCode": function(req, res) {
            var userId = req.params.id;
            console.log("userid--->>>", userId)
            User.find({ $or: [{ 'type': 'USER' }, { 'type': 'Advertiser' }], status: 'ACTIVE', isVerified: "TRUE" }).lean().exec(function(err, userResult1) {
                i18n = new i18n_module(req.body.lang, configs.langFile);
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                    var blockedArray = [];
                    for (var i = 0; i < userResult1.length; i++) {
                        for (var j = 0; j < userResult1[i].blockUser.length; j++) {
                            if (userResult1[i].blockUser[j].toString() == userId) {
                                blockedArray.push(userResult1[i]._id)
                            } else {
                                console.log("flag------->>>>")
                            }
                        }
                    }
                    console.log("blockedArray--->>>", blockedArray)
                    User.paginate({ _id: { $nin: blockedArray }, referredCode: req.body.referralCode }, { page: req.params.pageNumber, limit: 8, sort: { createdAt: -1 } }, function(err, result) {
                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result.docs.length == 0) { res.send({ responseCode: 404, responseMessage: i18n.__("Data not found")}); } else {
                            console.log("resdsfnfjddfsdfs", result)
                            var sortArray = result.docs.sort(function(obj1, obj2) {
                                return obj2.createdAt - obj1.createdAt
                            })
                            res.send({
                                result: result,
                                responseCode: 200,
                                responseMessage: i18n.__("All user shown successfully")
                            });
                        }
                    })
                }
            })
        },

        // api to use coupon
        "useCouponWithoutCode": function(req, res) {
            var couponId = req.body.couponId;
            var adId = req.body.adId;
            if (!couponId) { res.send({ responseCode: 400, responseMessage: "Please enter the couponId" }); } else if (!adId) { res.send({ responseCode: 400, responseMessage: 'Please enter the adId' }); } else {
                User.aggregate({ $unwind: '$coupon' }, { $match: { 'coupon._id': new mongoose.Types.ObjectId(couponId) } }, function(err, user) {
                  //   console.log("useCouponWithoutCode--->>",JSON.stringify(user))
                    i18n = new i18n_module(req.body.lang, configs.langFile);
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } 
                    else if (user.length==0) { res.send({ responseCode: 404, responseMessage: i18n.__("Data not found") }); }
                    else if ((user[0].coupon.couponStatus) != "VALID") { res.send({ responseCode: 400, responseMessage: i18n.__("Please enter a valid coupon to use.") }); }
                     else if ((user[0].coupon.status) != "ACTIVE") { res.send({ responseCode: 400, responseMessage: i18n.__("Please enter a valid coupon to use.") }); }
                    else {
                        User.update({ 'coupon._id': couponId }, { $set: { 'coupon.$.couponStatus': "USED", 'coupon.$.usedCouponDate': Date.now() } }, { new: true }, function(err, result1) {
                            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else {

                                User.findOne({ 'hiddenGifts.adId': adId }, function(err, user) {
                                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!user) { res.send({ responseCode: 200, responseMessage: i18n.__("Coupon successfully sent to advertiser page.") }); } else {
                                        for (var i = 0; i < user.hiddenGifts.length; i++) {
                                            if (user.hiddenGifts[i].adId == adId) {
                                                var code = user.hiddenGifts[i].hiddenCode;
                                            }
                                        }
                                        User.update({ 'hiddenGifts.adId': adId }, { $set: { 'hiddenGifts.$.status': "USED" } }, { new: true }, function(err, result2) {
                                            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else {
                                                console.log("code--->>", code)
                                                var message = 'Your hidden gift is:' + code
                                                if (result2.nModified == 1) {
                                                    functions.otp(req.body.mobileNumber, message)
                                                    res.send({
                                                        responseCode: 200,
                                                        responseMessage: i18n.__("The hidden gift code has been sent to your mailbox successfully.")
                                                    })

                                                } else {
                                                    res.send({
                                                        responseCode: 200,
                                                        responseMessage: i18n.__("Coupon used successfully")
                                                    })

                                                }
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        },

        // filter winners list on code basis
        "winnersFilterCodeBasis": function(req, res) {
            console.log("request winners filter code basis ---->>>", req.body)
            var pageId = req.body.pageId;
            var name = req.body.name;
            if (req.body.type == 'withCode') {
                if (!(req.body.name == null || req.body.name == undefined || req.body.name == '')) {
                    var re = new RegExp(name, 'i');
                    var condition = { 'hiddenGifts.pageId': pageId, 'hiddenGifts.status': "USED", 'firstName': { $regex: re } }
                } else {
                    var condition = { 'hiddenGifts.pageId': pageId, 'hiddenGifts.status': "USED" }
                }
                User.aggregate({ $unwind: "$hiddenGifts" }, { $match: condition }).exec(function(err, result1) {
                    i18n = new i18n_module(req.body.lang, configs.langFile);
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (result1.length == 0) { res.send({ responseCode: 404, responseMessage: i18n.__("No coupon found") }); } else {
                        res.send({
                            result: result1,
                            responseCode: 200,
                            responseMessage: i18n.__("User show successfully")
                        })
                    }
                })
            } else {

                if (!(req.body.name == null || req.body.name == undefined || req.body.name == '')) {
                    var re = new RegExp(name, 'i');
                    var condition = { 'coupon.pageId': pageId, 'coupon.status': "USED", 'firstName': { $regex: re } }
                } else {
                    var condition = { 'coupon.pageId': pageId, 'coupon.status': "USED" }
                }
                User.aggregate([{ $unwind: "$coupon" }, { $match: condition }]).exec(function(err, result2) {
                    i18n = new i18n_module(req.body.lang, configs.langFile);
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (result2.length == 0) { res.send({ responseCode: 404, responseMessage: i18n.__("No coupon found") }); } else {
                        res.send({
                            result: result2,
                            responseCode: 200,
                            responseMessage: i18n.__("User show successfully")
                        })
                    }
                })
            }
        },

        // use coupon with hidden code
        "useCouponWithCode": function(req, res) {
            var couponId = req.body.couponId;
            User.findOne({ 'hiddenGifts._id': couponId }).exec(function(err, result) {
                i18n = new i18n_module(req.body.lang, configs.langFile);
                if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!result) { res.send({ responseCode: 404, responseMessage: i18n.__("No coupon found") }); } else if (Boolean(result.hiddenGifts.find(hiddenGifts => hiddenGifts.status == "USED"))) { res.send({ responseCode: 400, responseMessage: "Coupon is already used" }); } else {
                    User.update({ 'hiddenGifts._id': couponId }, { $set: { 'hiddenGifts.$.status': "USED" } }, { new: true }, function(err, result1) {
                        if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else {
                            res.send({
                                // result: result2,
                                responseCode: 200,
                                responseMessage: i18n.__("Coupon used successfully")
                            })
                        }
                    })
                }
            })
        },

        // show list of coupon exchange sent req api
        "seeExchangeSentRequest": function(req, res) {
            var senderId = req.body.userId;
            var userId = req.body.userId;
            User.find({ $or: [{ 'type': 'USER' }, { 'type': 'Advertiser' }], status: 'ACTIVE', isVerified: "TRUE" }).lean().exec(function(err, userResult1) {
                i18n = new i18n_module(req.body.lang, configs.langFile);
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                    var blockedArray = [];
                    for (var i = 0; i < userResult1.length; i++) {
                        for (var j = 0; j < userResult1[i].blockUser.length; j++) {
                            if (userResult1[i].blockUser[j].toString() == userId) {
                                blockedArray.push(userResult1[i]._id.toString())
                            } else {
                                console.log("flag------->>>>")
                            }
                        }
                    }
                    createNewAds.aggregate({ $unwind: '$couponExchangeSent' }, { $match: { _id: new mongoose.Types.ObjectId(req.body.adId), 'couponExchangeSent.senderId': senderId, 'couponExchangeSent.couponExchangeStatus': "REQUESTED", 'couponExchangeSent.senderCouponType':req.body.senderCouponType, 'couponExchangeSent.receiverId': { $nin: blockedArray } } }, function(err, result) {
                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ reponseCode: 404, responseMessage: "Please enter correct adId." }); } else {

                            createNewAds.populate(result, {
                                path: 'couponExchangeSent.receiverId',
                                model: 'brolixUser',
                                select: 'firstName lastName image country state city'
                            }, function(err, result1) {
                                res.send({
                                    result: result1,
                                    responseCode: 200,
                                    responseMessage: i18n.__("All request show successfully")
                                })
                            })
                        }
                    })
                }
            })
        },

        // api for save payment request
        "savePaymentRequest": function(req, res) {
            var payment = paypalPayment(req.body)
            payment.save(function(err, result) {
                i18n = new i18n_module(req.body.lang, configs.langFile);
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
                //  var token = jwt.sign(result, config.secreteKey);
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: i18n.__("Data saved successfully")
                });
            })
        },

        // search list of blocked user api
        "blockUserSearch": function(req, res) {
            followerList.find({ userId: req.body.userId, followerStatus: "block" }).exec(function(err, result) {
                i18n = new i18n_module(req.body.lang, configs.langFile);
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                    var arr = [];
                    result.forEach(function(result) {
                        arr.push(result.blockUserId)
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
                            responseMessage: i18n.__("Show list all block users")
                        });
                    })
                }
            })
        },

        // show list of user's received notification
        "userNotification": function(req, res) {
          //  console.log("userNotification req-->>>>",JSON.stringify(req.body))
            User.find({ _id: req.body.userId }, function(err, result) {
                i18n = new i18n_module(req.body.lang, configs.langFile);
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: i18n.__("Data not found") }); } else {
                    var obj = result[0].notification;
                    var sortArray = obj.sort(function(obj1, obj2) {
                        return obj2.CreatedAt - obj1.CreatedAt
                    })
              //        console.log("userNotification sortArray-->>>>",JSON.stringify(sortArray))
                    res.send({
                        result: sortArray,
                        responseCode: 200,
                        responseMessage: i18n.__("All details shown successfully")
                    });
                }
            })
        },

        // turn off coupon exchange from privacy screen
        "couponExchangeOff": function(req, res) {
            if (req.body.status == 'off') {
                i18n = new i18n_module(req.body.lang, configs.langFile);
                waterfall([
                    function(callback) {
                        User.findOneAndUpdate({ _id: req.body.userId }, { $set: { 'privacy.exchangeCoupon': req.body.status } }, function(err, user) {
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                                callback(null)
                            }
                        })
                    },
                    function(callback) {
                        var receiverId = req.body.userId;
                        createNewAds.find({ 'couponExchangeReceived.receiverId': receiverId }, function(err, user) {
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                                var array1 = [];
                                for (var i = 0; i < user.length; i++) {
                                    for (var j = 0; j < user[i].couponExchangeReceived.length; j++) {
                                        if (user[i].couponExchangeReceived[j].receiverId == req.body.userId) {
                                            array1.push(user[i].couponExchangeReceived[j]._id)
                                        }
                                    }
                                }
                                for (var k = 0; k < array1.length; k++) {
                                    createNewAds.update({ 'couponExchangeReceived._id': array1[k] }, { $set: { 'couponExchangeReceived.$.couponExchangeStatus': "CANCEL" } }, { multi: true }, function(err, userResult) {
                                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                                            console.log("in loop g*******")
                                        }
                                    })
                                }
                                callback(null)
                            }
                        })
                    },
                    function(callback) {
                        var senderId = req.body.userId;
                        createNewAds.find({ 'couponExchangeReceived.senderId': senderId }, function(err, user1) {
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                                var array2 = [];
                                for (var i = 0; i < user1.length; i++) {
                                    for (var j = 0; j < user1[i].couponExchangeReceived.length; j++) {
                                        if (user1[i].couponExchangeReceived[j].senderId == req.body.userId) {
                                            array2.push(user1[i].couponExchangeReceived[j]._id)
                                        }
                                    }
                                }
                                for (var k = 0; k < array2.length; k++) {
                                    createNewAds.update({ 'couponExchangeReceived._id': array2[k] }, { $set: { 'couponExchangeReceived.$.couponExchangeStatus': "CANCEL" } }, { multi: true }, function(err, user1Result) {
                                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                                            console.log("in loop k")
                                        }
                                    })
                                }
                                callback(null)
                            }
                        })
                    },
                    function(callback) {
                        var senderId = req.body.userId;
                        createNewAds.find({ 'couponExchangeSent.senderId': senderId }, function(err, user2) {
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                                var array3 = [];
                                for (var i = 0; i < user2.length; i++) {
                                    for (var j = 0; j < user2[i].couponExchangeSent.length; j++) {
                                        if (user2[i].couponExchangeSent[j].senderId == req.body.userId) {
                                            array3.push(user2[i].couponExchangeSent[j]._id)
                                        }
                                    }
                                }
                                for (var k = 0; k < array3.length; k++) {

                                    createNewAds.update({ 'couponExchangeSent._id': array3[k] }, { $set: { 'couponExchangeSent.$.couponExchangeStatus': "CANCEL" } }, { multi: true }, function(err, user2Result) {
                                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                                            console.log("in loop g*******")
                                        }
                                    })
                                }
                                callback(null)
                            }
                        })
                    },
                ], function(err, result) {
                    res.send({
                        responseCode: 200,
                        responseMessage: i18n.__('Privacy updated successfully')
                    })
                })
            } else {
                i18n = new i18n_module(req.body.lang, configs.langFile);
                User.findOneAndUpdate({ _id: req.body.userId }, { $set: { 'privacy.exchangeCoupon': req.body.status } }, function(err, user) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                        res.send({
                            responseCode: 200,
                            responseMessage: i18n.__('Privacy updated successfully')
                        })
                    }
                })
            }
        },

        // send payment history on email api
        "sendPaymentHistoryOnMailId": function(req, res, next) {
            var myObj = req.body.paymentData;
            i18n = new i18n_module(req.body.lang, configs.langFile);
            // var myObj = [
            //     { "Date":"20/10/2017", "Amount":24, "Description":"createPage" },
            //     { "Date":"20/10/2017", "Amount":24, "Description":"createPage" },
            //     { "Date":"20/10/2017", "Amount":24, "Description":"createPage" },
            //     { "Date":"20/10/2017", "Amount":24, "Description":"createPage" },
            //     { "Date":"20/10/2017", "Amount":24, "Description":"createPage" },
            // ];
            var y = '';
            y = "<table><tr><th>Date</th><th>Amount</th><th>Description</th></tr>"

            for (x in myObj) {
                y += "<tr><td>" + new Date(myObj[x].Date).toISOString().slice(0, 10) + "</td><td>" + myObj[x].Amount + "</td><td>" + myObj[x].Description + "</td></tr>";
            }
            y += "</table></br>Total Amount: " + req.body.totalAmount + ""

            var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: "test.avi201@gmail.com",
                    pass: "Mobiloitte1"
                }
            });
            var to = req.body.email
            var mailOption = {
                from: "test.avi201@gmail.com",
                to: req.body.email,
                subject: 'Payment History',
                text: 'Payment details',
                html: y
            }
            console.log("Dta in mailOption : " + JSON.stringify(mailOption));
            transporter.sendMail(mailOption, function(error, info) {
                if (error) { res.send({ responseCode: 400, responseMessage: 'Internal server error.' }) } else {
                    res.send({
                        responseCode: 200,
                        responseMessage: i18n.__('Your payment history was successfully sent to your mail')
                    })
                }
            })
        },

        // api to update live users
        "updateLive": function(req, res) {
            console.log("updateLive============>",JSON.stringify(req.body));
            if (req.body.isLive == true) {
                console.log("isLive============>");
                User.findOneAndUpdate({ _id: req.body.userId }, { $set: { isLive: 'True' } }).exec(function(err, result) {
                    i18n = new i18n_module(req.body.lang, configs.langFile);
                    if (err) { res.send({ responseCode: 400, responseMessage: 'Internal server error.' }) } else if (!result) { res.send({ responseCode: 404, responseMessage: i18n.__("Data not found") }); } else {
                        console.log("updateresult======>",result)
                        res.send({
                            responseCode: 200,
                            responseMessage: i18n.__('Successfully updated'),
                            result: result
                        })
                    }
                })
            } else {
                User.findOneAndUpdate({ _id: req.body.userId }, { $set: { isLive: 'False' } }).exec(function(err, result) {
                    i18n = new i18n_module(req.body.lang, configs.langFile);
                    if (err) { res.send({ responseCode: 400, responseMessage: 'Internal server error.' }) } else if (!result) { res.send({ responseCode: 404, responseMessage: i18n.__("Data not found") }); } else {
                        res.send({
                            responseCode: 200,
                            responseMessage: i18n.__('Successfully updated')
                        })
                    }
                })

            }
        },

        // api to cancel sent coupon exchange req
        "cancelExchangeCouponRequest": function(req, res) {
            var senderId = req.body.userId;
            createNewAds.aggregate({ $unwind: '$couponExchangeSent' }, { $match: { _id: new mongoose.Types.ObjectId(req.body.adId), 'couponExchangeSent.senderId': senderId, 'couponExchangeSent.couponExchangeStatus': "REQUESTED" } }, function(err, result) {
                i18n = new i18n_module(req.body.lang, configs.langFile);
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ reponseCode: 404, responseMessage: i18n.__('No requests found.')}); } else {

                    var requestId = result[0].couponExchangeSent._id;
                    var receiverAdId = result[0].couponExchangeSent.exchangedWithAdId;
                    var senderCouponId = result[0].couponExchangeSent.senderCouponId;
                    createNewAds.update({ 'couponExchangeSent._id': new mongoose.Types.ObjectId(requestId) }, { $set: { 'couponExchangeSent.$.couponExchangeStatus': 'Cancel' } }, { new: true }).exec(function(err, updatedResult) {
                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                            createNewAds.aggregate({ $unwind: '$couponExchangeReceived' }, { $match: { _id: new mongoose.Types.ObjectId(receiverAdId), 'couponExchangeReceived.senderId': senderId, 'couponExchangeReceived.senderCouponId': senderCouponId, 'couponExchangeReceived.couponExchangeStatus': "REQUESTED" } }, function(err, result2) {
                                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                                    var requestId1 = result2[0].couponExchangeReceived._id;

                                    createNewAds.update({ 'couponExchangeReceived._id': new mongoose.Types.ObjectId(requestId1) }, { $set: { 'couponExchangeReceived.$.couponExchangeStatus': 'Cancel' } }, { new: true }).exec(function(err, updatedResult1) {
                                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                                            res.send({
                                                // result: result1,  
                                                responseCode: 200,
                                                responseMessage: i18n.__("Request cancel successfully")
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        },

        // api to check user can send message or not
        "sendMessage": function(req, res) {
            console.log("send message--->>>", JSON.stringify(req.body))
            User.findOne({ _id: req.body.receiverId }, function(err, result2) {
                i18n = new i18n_module(req.body.lang, configs.langFile);
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error. 33' }); } else if (!result2) { res.send({ responseCode: 404, responseMessage: i18n.__("Data not found") }); } else {
                    var flag = result2.blockUser.indexOf(req.body.senderId)
                    console.log("flage--->>>", flag)
                    if (flag != -1) { res.send({ responseCode: 401, responseMessage: i18n.__('You can not send message to this user') }) } else {
                        console.log("result2.privacy.sendMessage", result2.privacy.sendMessage)
                        if (result2.privacy.sendMessage == "nobody") { res.send({ responseCode: 409, responseMessage: i18n.__("You cannot send message to this user due to privacy policies") }) } else if (result2.privacy.sendMessage == "onlyFollowers") {
                            var flag1 = result2.userFollowers.indexOf(req.body.senderId)
                            console.log("flag", flag1)
                            if (flag1 == -1) { res.send({ responseCode: 400, responseMessage: i18n.__("You cannot send message to this user due to privacy policies") }); } else {
                                res.send({
                                    responseCode: 200,
                                    responseMessage: 'You can send message'
                                })
                            }
                        } else {
                            res.send({
                                responseCode: 200,
                                responseMessage: 'You can send message'
                            })
                        }
                    }

                }
            })
        },

        readNotification: function(req,res) {
            console.log("------------------------------",req.body)
            let criteria=req.body.notificationId;
            let userId = req.body.userId;
            User.findOneAndUpdate({"_id": userId,"notification._id": criteria},{$set:{"notification.$.isRead": true}},{new:true},(err, succees) => {
                if (err) {
                    console.log(err);
                    res.status(400).send({
                        "responseCode": 400,
                        "responseMessage": "Unsuccessful",
                        "response": err.message
                    });
    
                }
                if(succees == null){
                    res.status(404).send({                   
                    "responseCode": 404,
                    "responseMessage": "No data found"
                    })
                }
                else {
                    console.log("**************", succees);
                    res.status(200).send({
                        "responseCode": 200,
                        "responseMessage": "Successful",
                        "response": succees
                    });
                }
            })


        }
    }


    // cron to check coupon status
    cron.schedule('*/2 * * * *', function() {
        User.find({ 'coupon.couponStatus': "VALID" }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); }
            //  else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No coupon found" }); }
            // console.log("result-->>>",result)
            else {
                // console.log("else result-->>>",result)
                console.log("<<--else-->>")
                var array = [];
                var array1 = [];
                var startTime = new Date().toUTCString();
                var h = new Date(new Date(startTime).setHours(00)).toUTCString();
                var m = new Date(new Date(h).setMinutes(00)).toUTCString();
                var currentTime = Date.now(m)
                console.log("<<--currentTime-->>", new Date(currentTime))
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