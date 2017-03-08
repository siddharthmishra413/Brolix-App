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

cloudinary.config({
    cloud_name: 'mobiloitte-in',
    api_key: '188884977577618',
    api_secret: 'MKOCQ4Dl6uqWNwUjizZLzsxCumE'
});


var avoid = {
        "password": 0
    }
    //var createNewPage = require("./model/createNewAds");
    // http://172.16.6.171

//brintree Integration
var braintree = require("braintree");

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "hncxrnbt5fh2c2cr",
  publicKey: "xjhcfhbmqszj6rcx",
  privateKey: "f3ffe3376878b6d1a0eff16c9099127d"
});

module.exports = {

"paymentClientToken": function(req, res){ 
    gateway.clientToken.generate({}, function (err, response) {
    console.log(response)
    responseHandler.apiResponder(req, res, 200,"success", response.clientToken)
  });
},

  "paymentIntegration": function(req, res){ 
      waterfall([
          function(callback){ 
              // createNewAds.findOne({
              //   _id: req.body.Id,
              //   adsType:'coupon'
              // }).exec(function(err, result){
              //   if(err){      
              //     res.send({
              //           responseCode: 302,
              //           responseMessage: 'error.',
              //           result: err
              //     });}
              //   else if(!result){
              //           res.send({
              //           responseCode: 404,
              //           responseMessage: 'data not found.'
              //         //  result: result
              //       });
              //   }
              //   else{
                  var nextPay;
                   // console.log("chefRefund==>>",result.chefRefund)
                    // if(result.chefRefund == "Yes"){
                    //   var amount = req.body.paymentDetails.amount;
                    //   var serviceFee = amount/10 + parseInt(result.chefPay);
                    //  // var nextPay = 0;
                    //   console.log("amount"+amount);
                    //   console.log("serviceFee"+serviceFee)
                    //   if(serviceFee > amount){
                    //     nextPay = serviceFee - amount;
                    //      serviceFee = amount;
                    //      console.log("nextPay"+nextPay)
                    //   }
                    // }else{
                    //   console.log("wrong")
                    //   var amount = req.body.paymentDetails.amount;
                    //    var serviceFee = amount/10;
                    //   // nextPay = 0;
                    // }
                    var amount = req.body.amount;
                    var serviceFee = amount/10; 
                      var transactionCost = amount*(2.9/100)+ 0.30;
                      merchantAccountParams = {
                      individual: {
                        firstName: req.body.firstName,
                        lastName:req.body.lastName,
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
                        email:req.body.email,
                        mobilePhone: req.body.phoneNumber,
                        accountNumber: req.body.accountNumber,
                        routingNumber: req.body.routingNumber
                      },
                        tosAccepted: true,
                        masterMerchantAccountId: "mobiloitte"
                      };
                     //console.log("nextpay in out merchant==>>"+nextPay)
                    gateway.merchantAccount.create(merchantAccountParams, function (err, resultss) {
                      console.log(resultss);
                       console.log("merchantAccount=====>>>",resultss.merchantAccount.id);
                    //  console.log("nextpay in create merchant==>>"+nextPay)
                      callback(null,resultss);
                     
                    }); 
              //   }
              // })
          },
          function(resultss, callback){
            var amount = req.body.amount;
                    var serviceFee = amount/10; 
            console.log("amount=====>>>",amount);
            console.log("serviceFee=====>>>",serviceFee);
            console.log("merchantAccount=====>>>",resultss.merchantAccount.id);
              gateway.transaction.sale({
                  merchantAccountId: resultss.merchantAccount.id,
                  amount: amount,
                  paymentMethodNonce: req.body.paymentMethodNonce,
                  serviceFeeAmount:serviceFee,
                  options: {
                     submitForSettlement: true
                  }
              }, function (err, results) {
                 if(err){      
                  res.send({
                        responseCode: 302,
                        responseMessage: 'error.',
                        result: err
                    });}
                  else if(results.errors){
                    res.send({
                        responseCode: 404,
                        responseMessage: 'not found.'
                       // result: result
                    });
                  }
                  else{

                    res.send({
                        responseCode: 200,
                        responseMessage: 'Successfully.',
                        result: results
                    });
                // console.log("transaction id===>>", results.transaction.id);
                // User.find({_id:req.body.chefId}).exec(function(err, ress){
                //   if(err){respon seHandler.apiResponder(req, res, 302,"Problem in data finding", err) }
                //   else if(!ress){
                //     responseHandler.apiResponder(req, res, 404,"Data not found.");
                //   }
                //   else{
                //     var user = new User();
                //     user.paymentDetails.serviceFee =serviceFee; 
                //     user.paymentDetails.amount=amount;
                //     user.paymentDetails.chefId=req.body.paymentDetails.chefId;
                //     user.paymentDetails.dinerId=req.body.paymentDetails.dinerId;
                //     user.paymentDetails.mealId=req.body.paymentDetails.mealId;
                //     user.paymentDetails.transactionId= results.transaction.id;
                //     user.paymentDetails.transactionCost= transactionCost;
                //     user.save(function (err,user) {
                //       if(err){responseHandler.apiResponder(req, res, 302,"Problem in data finding", err) }
                //       else if (!user) {responseHandler.apiResponder(req, res, 404,"Data not Found")}
                //       else{
                //       callback(null ,user,result, amount, serviceFee, transactionCost,nextPay,resultss, results)
                //       }
                //     })
                //   }
                // })
              }
            })
          },
          // function(user,result, amount, serviceFee, transactionCost,nextPay,resultss,results, callback){
          //     console.log("nextPay value after callback"+nextPay)
          //     var nextAmount = nextPay;
          //     if(result.chefRefund == "Yes"){
          //     console.log("yes");
          //       if(nextPay = 0 || nextPay == undefined || nextPay == null){
          //         User.findOneAndUpdate({_id:req.body.paymentDetails.chefId}, {'$set': {
          //           chefRefund: 'No' , chefPay: 0
          //         }},{new:true},function (err, resu) {
          //         if (err) {res.send({response_code: 404,response_message: "something went wrong"});}
          //         if (!resu) {res.send({response_code: 400,response_message: "Data not found."});}
          //         else{
          //           callback(null,user,results)
          //         }})
          //       }
          //       else{
          //         console.log("nextPay is not zero==>>"+nextAmount)
          //         User.findOneAndUpdate({_id:req.body.paymentDetails.chefId}, {'$set': {
          //           chefRefund: 'Yes' , chefPay: nextAmount
          //         }},{new:true},function (err, resu) {
          //         if (err) {res.send({response_code: 404,response_message: "something went wrong"});}
          //         if (!resu) {res.send({response_code: 400,response_message: "Data not found."});}
          //         else{
          //           callback(null,user,results)
          //         }})
          //       }               
          //    }else{
          //     console.log("no");
          //       callback(null,user,results)
          //    }
          // }

      ],function (err, result) {
          if(err){responseHandler.apiResponder(req, res, 302,"Problem in data finding", err) }
          else{
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

    //API for user Details
    "allUserDetails": function(req, res) {
        User.find({ $or: [{ type: "USER" }, { type: "Advertiser" }] }).exec(function(err, result) {
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
            console.log("ddd---" + JSON.stringify(result));
            if (!result) {
                res.send({
                    response_code: 400,
                    response_message: "User doesn't exist."
                });
            } else {
                var oldpassword = (req.body.oldpass);
                if (result.password != oldpassword) {
                    res.send({
                        response_code: 401,
                        response_message: "Old password doesn't match."
                    });
                } else {
                    var password = (req.body.newpass);
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

    "success": function(req, res) {
        console.log("req data-->" + JSON.stringify(req.body));
        res.send("Payment transfered successfully.");
    },

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

                    var amount = req.body.cash;
                    console.log("amount-------", amount)
                    User.findOne({ _id: req.body.userId }, function(err, result) {
                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!results) res.send({ responseCode: 404, responseMessage: "please enter correct userId" });
                        else if (result.cash < req.body.cash) { res.send({ responseCode: 400, responseMessage: "Insufficient amount of brolix in your account" }); } else {
                            User.findOneAndUpdate({ _id: req.body.userId }, { $push: { "transferAmountListObject": { amount: amount, adId: req.body.adId } } }, { new: true }, function(err, results) {
                                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!results) res.send({ responseCode: 404, responseMessage: "please enter correct userId" });
                                else {
                                    results.cash -= req.body.cash;
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

    "cancel": function(req, res) {
        console.log("req data-->" + JSON.stringify(req.body));
        res.send("Payment canceled successfully.");
    },
    // Api for Send brolix To Follower
    "sendBrolixToFollower": function(req, res) {
        User.findOne({ _id: req.body.userId }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) res.send({ responseCode: 404, responseMessage: "please enter correct userId" });
            else if (result.brolix <= req.body.brolix) { res.send({ responseCode: 400, responseMessage: "Insufficient amount of brolix in your account." }); } else {
                result.brolix -= req.body.brolix;
                result.save();
                User.findOneAndUpdate({ _id: req.body.receiverId }, { $push: { "sendBrolixListObject": { senderId: req.body.userId, brolix: req.body.brolix } } }, { new: true }, function(err, results) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!results) res.send({ responseCode: 404, responseMessage: "Please enter correct receiverId" });
                    else {
                        results.brolix += req.body.brolix;
                        results.save();
                        res.send({
                            responseCode: 200,
                            responseMessage: "You have successfully transferred your brolix.",
                            result: result

                        });
                    }
                });
            }
        });
    },

    // Api for Send Cash to Follower    
    "sendCashToFollower": function(req, res) { // userId, receiverId, cash in request
        User.findOne({ _id: req.body.userId }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) res.send({ responseCode: 404, responseMessage: "please enter correct userId" });
            else if (result.cash <= req.body.cash) { res.send({ responseCode: 400, responseMessage: "Insufficient amount of cash in your account." }); } else {
                result.cash -= req.body.cash;
                result.save();
                User.findOneAndUpdate({ _id: req.body.receiverId }, { $push: { "sendCashListObject": { senderId: req.body.userId, cash: req.body.cash } } }, { new: true }, function(err, user) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!user) res.send({ responseCode: 404, responseMessage: "Please enter correct receiverId" });
                    else {
                        user.cash += req.body.cash;
                        user.save();
                        res.send({
                            responseCode: 200,
                            responseMessage: "You have successfully transferred your cash.",
                            result: result

                        });
                    }
                });
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
                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!results) res.send({ responseCode: 404, responseMessage: "please enter correct userId" });

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
                        result: newResult,
                        responseCode: 200,
                        responseMessage: "Show list all followers."
                    });
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
                    responseMessage: "User Blocked successfully."
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
                User.find({ _id: { $in: arr } }).exec(function(err, newResult) {
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
                var obj = { cash: 0, viewers: 0 }
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
                    User.findByIdAndUpdate({ _id: req.body.userId }, { $push: { "upgradeCardObject": array[i] },  $set:{cardPurchaseDate:req.body.date} }, { new: true }).exec(function(err, user) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                            console.log("sum-->>", sum)
                        }
                    });
                }
                result.cash -= sum;
                result.save();
                res.send({
                    result: result,
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
                var obj = { brolix: 0, chances: 0 }
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
                    User.findByIdAndUpdate({ _id: req.body.userId }, { $push: { "luckCardObject": array[i] } , $set:{cardPurchaseDate:req.body.date}}, { new: true }).exec(function(err, user) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                            console.log("sum--->>>", sum)
                        }
                    });
                }
                result.brolix -= sum;
                result.save();
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "successfully purchased the luck card"
                });
            }
        })
    },


    "useLuckCard": function(req, res) { // userId, adId, Brolix, luckId in request parameter

        var obj = (req.body.luckId);
        createNewAds.findOne({ _id: req.body.adId }, function(err, data) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!data) return res.status(404).send({ responseMessage: "please enter correct adId" })
            else if (obj == null || obj == '' || obj === undefined) { res.send({ responseCode: 500, responseMessage: 'please enter luckId' }); } else if (data.winners.length != 0) return res.status(406).send({ responseCode: 406, responseMessage: "Winner allready decided" });
            else if (Boolean(data.luckCardListObject.find(luckCardListObject => luckCardListObject.userId == req.body.userId))) {
                return res.status(403).send({ responseMessage: "Already used luckCard" })
            } else {
                var obj = (req.body.luckId);
                console.log("obj", obj, typeof obj);
                User.update({ 'luckCardObject._id': obj }, { $set: { 'luckCardObject.$.status': "INACTIVE" } }, function(err, result) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) return res.status(404).send({ responseMessage: "please enter userId" })
                    else {
                        createNewAds.findByIdAndUpdate({ _id: req.body.adId }, { $push: { "luckCardListObject": { userId: req.body.userId, chances: req.body.chances } } }, { new: true }).exec(function(err, user) {
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                                res.send({
                                    result: user,
                                    responseCode: 200,
                                    responseMessage: "Successfully used the luck card."
                                })
                            }

                        })
                    }
                })
            }
        })
    },

    "useUpgradeCard": function(req, res) {
        var obj = req.body.upgradeId;
        if (obj == null || obj == '' || obj === undefined) { res.send({ responseCode: 404, responseMessage: 'please enter upgradeId' }); }
        for (var i = 0; i < obj.length; i++) {
            User.update({ 'upgradeCardObject._id': obj[i] }, { $set: { 'upgradeCardObject.$.status': "INACTIVE" } }, { multi: true }, function(err, result) {
                if (err) { res.send({ responseCode: 500, responseMessage: err }); } else if (!result) return res.status(404).send({ responseMessage: "please enter userId" })
                else {
                    console.log("else")
                }
            })
        }
        res.send({
            // result: user,
            responseCode: 200,
            responseMessage: "Successfully used the upgrade card."
        })
    },

    "facebookLogin": function(req, res) {
        var obj = (req.body.facebookID);
        if (obj == null || obj == '' || obj === undefined) { res.send({ responseCode: 500, responseMessage: 'please enter facebookID' }); }
        if (!validator.isEmail(req.body.email)) res.send({ responseCode: 403, responseMessage: 'Please enter the correct email id.' });
        User.findOne({ email: req.body.email, status: 'ACTIVE' }, avoid).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) {
                var user = new User(req.body)
                user.save(function(err, result1) {
                    var token = jwt.sign(result1, config.secreteKey);
                    res.header({
                        "appToken": token
                    }).send({ result: result1, token: token, responseCode: 200, responseMessage: "Signup successfully." });
                })
            } else {
                if (result.facebookID == undefined) {
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

    "userCashGifts": function(req, res) { // userId in req 
        var userId = req.body.userId;
        var array = [];
        createNewAds.find({ adsType: "cash" }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else {
                for (i = 0; i < result.length; i++) {
                    for (j = 0; j < result[i].winners.length; j++) {
                        if (result[i].winners[j] == userId) {
                            array.push(result[i]._id);
                        }
                    }
                }
                createNewAds.paginate({ _id: { $in: array } }, { page: req.params.pageNumber, limit: 8 }, function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (result1.docs.length == 0) { res.send({ responseCode: 404, responseMessage: "No ad found" }); } else {
                        res.send({
                            result: result1,
                            responseCode: 200,
                            responseMessage: "result show successfully;"
                        })
                    }
                })
            }
        })
    },

    "userCouponGifts": function(req, res) { // userId in req 
        var userId = req.body.userId;
        var array = [];
        User.findOne({ _id: userId }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else {
                for (i = 0; i < result.coupon.length; i++) {
                    array.push(result.coupon[i].adId)
                }
                createNewAds.paginate({ _id: { $in: array } }, { page: req.params.pageNumber, limit: 8 }, function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (result1.docs.length == 0) { res.send({ responseCode: 404, responseMessage: "No ad found" }); } else {
                        res.send({
                            result: result1,
                            responseCode: 200,
                            responseMessage: "result show successfully."
                        })
                    }
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
        chat.paginate({ $or: [{ senderId: req.body.senderId, receiverId: req.body.receiverId }, { senderId: req.body.receiverId, receiverId: req.body.senderId }] }, { page: req.params.pageNumber, limit: 15, sort: { timestamp: -1 } }, function(err, results) {
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
        var obj = (req.body.googleID);
        if (obj == null || obj == '' || obj === undefined) { res.send({ responseCode: 500, responseMessage: 'please enter googleID' }); }
        if (!validator.isEmail(req.body.email)) res.send({ responseCode: 403, responseMessage: 'Please enter the correct email id.' });
        User.findOne({ email: req.body.email, status: 'ACTIVE' }, avoid).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) {
                var user = new User(req.body)
                user.save(function(err, result) {
                    var token = jwt.sign(result, config.secreteKey);
                    res.header({
                        "appToken": token
                    }).send({ result: result, token: token, responseCode: 200, responseMessage: "Signup successfully." });
                })
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
        createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $inc: { couponPurchased: 1 } }, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No ad found" }); } else if (result.couponBuyersLength <= result.couponPurchased) { res.send({ responseCode: 201, responseMessage: " All coupon sold out" }); } else {

                User.findOne({ _id: req.body.userId }).exec(function(err, result2) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!result2) { res.send({ responseCode: 404, responseMessage: "No user found" }); } else if (result2.brolix < req.body.brolix) { res.send({ responseCode: 400, responseMessage: "Insufficient amount of brolix in your account" }); } else {
                        var couponCode = result.couponCode;
                        var startTime = new Date().toUTCString();
                        var h = new Date(new Date(startTime).setHours(00)).toUTCString();
                        var m = new Date(new Date(h).setMinutes(00)).toUTCString();
                        var s = Date.now(m)
                        var coupanAge = result.couponExpiryDate;
                        var actualTime = parseInt(s) + parseInt(coupanAge);
                        var data = {
                            couponCode: couponCode+1234,
                            expirationTime: actualTime,
                            adId: req.body.adId
                        }
                        console.log("data--->>",data)
                        User.findByIdAndUpdate({ _id: req.body.userId }, { $push: { coupon: data }, $inc: { brolix: -req.body.brolix } }, { new: true }, function(err, result3) {
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error.' }); } else {

                            }
                        })
                    }
                })
                res.send({
                    //  result: result3,
                    responseCode: 200,
                    responseMessage: "Successfully purchased the coupon."
                })

            }
        })
    },

    "listOfFavouriteCoupon": function(req, res) {
        User.findOne({ _id: req.body.userId }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error.' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No user found." }); } else {
                var array = result.favouriteCoupon;

                createNewAds.paginate({ _id: { $in: array } }, { page: req.params.pageNumber, limit: 8 }, function(err, result) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (result.docs.length == 0) { res.send({ responseCode: 404, responseMessage: "No ad found" }); } else {
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
        if (req.body.type == "favourite") {
            User.findOne({ _id: req.body.userId }).exec(function(err, result) {
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error.' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No user found." }); }
                var favouriteCoupon = result.favouriteCoupon;

                var mySet = new Set(favouriteCoupon);
                var has = mySet.has(adId)
                if (has) { res.send({ responseCode: 302, responseMessage: "Already added to favourites." }) } else if (!has) {
                    User.findOneAndUpdate({ _id: req.body.userId }, { $push: { favouriteCoupon: adId } }, { new: true }, function(err, result1) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error.' }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: "No user found." }); } else {
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

            User.findOne({ _id: req.body.userId }).exec(function(err, result) {
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error.' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No user found." }); }
                var favouriteCoupon = result.favouriteCoupon;

                var mySet = new Set(favouriteCoupon);
                var has = mySet.has(adId)
                if (!has) { res.send({ responseCode: 302, responseMessage: "Already removed from favourites." }) } else if (has) {
                    User.findOneAndUpdate({ _id: req.body.userId }, { $pop: { favouriteCoupon: -adId } }, { new: true }, function(err, result1) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error.' }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: "No user found." }); } else {
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
        var obj = req.body.couponCode;
        var status = req.body.status;
        if (obj == null || obj == '' || obj === undefined) { res.send({ responseCode: 404, responseMessage: 'please enter couponCode' }); } 
        else {
            User.findOne({ _id: userId }).exec(function(err, result) {
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error.' }); }
                 else if (!result) { res.send({ responseCode: 404, responseMessage: "No user found." }); }
                  else {
                    User.update({ 'coupon.couponCode': obj }, { $set: { 'coupon.$.exchangeStatus': status } }, { new: true }, function(err, result1) {
                        if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); }
                         else {
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

"CouponExchangeRequest": function(req, res) { // userId, couponCode, receiverId, senderId
    waterfall([
        function(callback) {
            var obj = req.body.couponCode;
            var userId = req.body.userId;
            User.findOne({ _id: userId }).exec(function(err, result) {
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error.' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No user found." }); } else {
                    User.findOne({ 'coupon.couponCode': obj }, function(err, result1) {
                        console.log("result-->>", result1)
                        if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (Boolean(result1.coupon.find(coupon => coupon.exchangeStatus == "OFF"))) {
                            res.send({ responseCode: 403, responseMessage: "Exchange request not allowed." })
                        } else {
                            callback(null, result)
                        }
                    })
                }
            })
        },
        function(result, callback) {
            var receiverId = req.body.receiverId;
            var senderId = req.body.userId;
            User.findOne({ _id: receiverId }, function(err, result2) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result2) { res.send({ responseCode: 404, responseMessage: "No user found." }); }
                 else if (result2.privacy.exchangeCoupon == "onlyMe") { res.send({ responseCode: 409, responseMessage: "you are not allowed to send" }) }
                 else if (result2.privacy.exchangeCoupon == "followers") {

                   var flag = result2.userFollowers.find(userFollowers => userFollowers == req.body.senderId)                
                if (flag === undefined) return res.status(400).send({ responseMessage: "you are not friend" })
                    else{
                         console.log("friend")
                    }
                } else {
                    console.log("public")

                }
            })
        },

    ], function(err, result) {
        res.send({
            result: result,
            responseCode: 200,
            responseMessage: "data shows successfully created"
        });
    })

}

}





cron.schedule('00 12 * * *', function() {

    User.find({ 'coupon.couponStatus': "valid" }).exec(function(err, result) {
        if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); }
        //  else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No coupon found" }); }
        else {
            var array = [];
            var array1 = [];
            var startTime = new Date().toUTCString();
            var h = new Date(new Date(startTime).setHours(00)).toUTCString();
            var m = new Date(new Date(h).setMinutes(00)).toUTCString();
            var currentTime = Date.now(m)
            for (var i = 0; i < result.length; i++) {
                for (var j = 0; j < result[i].coupon.length; j++) {
                    if (currentTime >= Math.round(result[i].coupon[j].expirationTime)) {
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
