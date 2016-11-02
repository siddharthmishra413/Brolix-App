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
 var createCoupons = require("./model/createCoupons");
 var createEvents = require("./model/createEvents");
 var createNewAds = require("./model/createNewAds");
 var reportProblem = require("./model/reportProblem");
 var paypalPayment = require("./model/payment");
 var waterfall = require('async-waterfall');
 var multiparty = require('multiparty');

 cloudinary.config({
     cloud_name: 'mobiloitte-in',
     api_key: '188884977577618',
     api_secret: 'MKOCQ4Dl6uqWNwUjizZLzsxCumE'
 });
 var avoid = {
        "password":0
    }
 cloudinary.config({ 
  cloud_name: 'demoproject', 
  api_key: '377656625223734', 
  api_secret: 'o33QOFnL3lExfEmtRPkvsKL7-q4' 
    });


 var LocalStrategy = require('passport-local').Strategy;
 var FacebookStrategy = require('passport-facebook').Strategy;
 var crypto = require('crypto'),
     algorithm = 'aes-256-cbc',
     password = 'abcabcbacbbcabcbbacbbacbabcbabcbac125';

 function encrypt(text) {
     var cipher = crypto.createCipher(algorithm, password)
     var crypted = cipher.update(text, 'utf8', 'hex')
     crypted += cipher.final('hex');
     return crypted;
 }

 function decrypt(text) {
     var decipher = crypto.createDecipher(algorithm, password)
     var dec = decipher.update(text, 'hex', 'utf8')
     dec += decipher.final('utf8');
     return dec;
 }

 var https = require('https');
 var http = require('http');
 store = {
     "key": "ACTIVE"
 };
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

function mail(email, otp) {
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
        subject: 'Brolix Otp',
        text: 'you have a new submission with following details',
        html: "Your otp is :" + otp
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
        var user = new User(req.body);
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
                    //console.log("opt======>>>"+opt)
                var details = req.body;
                if (!(req.body.image === undefined || req.body.image == "")) {
                    var img_base64 = req.body.image;
                    binaryData = new Buffer(img_base64, 'base64');
                    require("fs").writeFile("test.jpeg", binaryData, "binary", function(err) {
                     console.log(err);
                 });
                 cloudinary.uploader.upload("test.jpeg", function(result) {                   
                     req.body.image = result.url;
                     var user = new User(details);
                     user.save(function(err, result) {
                        if (err) throw err;
                            var token = jwt.sign(!result, config.secreteKey);
                                 res.header({
                                     "appToken": token
                                 }).send({
                                    result: result,
                                    token:token,
                                    responseCode: 200,
                                    responseMessage: "You have been registered successfully."
                                 });
                            })
                        });

                }else{
                user.save(function(err, result) {
                    if (err){console.log(err)}
                    var token = jwt.sign(!result, config.secreteKey);
                         res.header({
                             "appToken": token
                         }).send({
                            result: result,
                            token:token,
                            responseCode: 200,
                            responseMessage: "You have been registered successfully."
                         });
                     }) 
                }              
            }
        })
    },

    //API for verify Otp
  "verifyOtp": function (req, res, next) {
                       User.findOne({_id:req.body.userId,otp:req.body.otp}).exec(function (err, results) {
                        if(!results){
                          res.send({
                            responseCode:404,
                            responseMessage:'Please enter correct otp'                         
                          }); }

                        else{
                            User.findByIdAndUpdate(req.body.userId, {
                                    $set:{
                                        status:"ACTIVE"
                                    }
                                   },{new:true}).exec( function (err, user) {                                      
                                      res.send({
                                        responseCode:200,
                                        responseMessage:'Otp verified successfully',
                                        result:user
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
        },avoid).exec(function(err, result) {
            if (err) throw err;
            if (!result) {
                return res.send({
                    responseCode: 404,
                    responseMessage: "Sorry Your Id or Password is Incorrect."
                });
            }else {
             var token = jwt.sign(!result, config.secreteKey);
             res.header({
                 "appToken": token
             }).send({
                result: result,
                token:token,
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
        if (err) return res.status(500).send(err);
        else {
            var sendEmail = (!req.body.email) ? "false" : (data.email == req.body.email) ? "exitEmail" : "true";
            var sendMobileOtp = (req.body.mobileNumber && Boolean(sendEmail)) ? (data.mobileNumber == req.body.mobileNumber) ? "exitMobile" : "true" : "false";
            if (sendEmail == "exitEmail") return res.status(403).send({
                responseMessage: "This email is already register"
            })
            if (sendMobileOtp == "exitMobile") return res.status(403).send({
                responseMessage: "This mobile number is already register"
            })
            otp1 = sendMobileOtp == "true" ? otp(req.body.mobileNumber) : otp();
            console.log("otp--->" + otp1)
            if (sendEmail == "true") {
                mail(req.body.email, otp1);
            }
            if (sendMobileOtp == "exitMobile") {
                req.body.otp = otp1;
                req.body.status = "inActive";
            }
            if (Boolean(req.body.image)) {
                var img_base64 = req.body.image;
                binaryData = new Buffer(img_base64, 'base64');
                require("fs").writeFile("test.jpeg", binaryData, "binary", function(err) {
                    console.log(err);
                });
                cloudinary.uploader.upload("test.jpeg", function(result) {
                    req.body.image = result.url;
                    User.findByIdAndUpdate(req.params.id, req.body, {
                        new: true
                    }).exec(function(err, result) {
                        if (err) throw err;
                        res.send({
                            result: result,
                            responseCode: 200,
                            responseMessage: "Profile updated successfully"
                        });
                    });

                });
            } else {
                req.body.image = req.body.url;
                User.findByIdAndUpdate(req.params.id, req.body, {
                    new: true
                }).exec(function(err, result) {
                    if (err) throw err;
                    res.send({
                        result: result,
                        responseCode: 200,
                        responseMessage: "Profile updated successfully"
                    });
                });

            }
        }
    })

},

    //API for user Details
    "allUserDetails": function(req, res) {
        User.find({type:'USER'},avoid).exec(function(err, result) {
            if (err) throw err;
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "Show data successfully"
            });
        })
    },

    //API for user Profile
    "userProfile": function(req, res) {
        User.findOne({_id: req.body.userId},avoid).exec(function(err, result) {
            if (err) throw err;
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "Profile data show successfully"
            });
        })
    },


    //API for Forgot Password
     "forgotPassword":function(req, res, next) {
     User.findOne({email: req.body.email}).exec(function(err, user) {
         if (err) throw err;
         if (!user) {
             res.send({
                 responseCode: 404,
                 responseMessage: 'Email id does not exists',
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
                         responseMessage: 'Internal server error'
                     })
                 } else {
                     console.log("updated password is : " + link);
                     User.findOneAndUpdate({email: req.body.email},{
                         $set: {
                             password: link
                         }
                     }, function(err, results) {
                         res.send({
                             responseCode: 200,
                             responseMessage: 'Password successfully sent your mail id'
                         })
                     })
                 }
             });
         }
     });
 },



    //API for create Page
    "createPage": function(req, res) {
        var page = new createNewPage(req.body);
        page.save(function(err, result) {
            if (err) throw err;
                 res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Page create successfully"
                 });
             })
    },

     //API for create Page
    "showAllPages": function(req, res) {
        createNewPage.find({}).exec(function(err, result){
            if(err) throw err;
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "All pages show successfully"
            })
        })
    },

     //API for create Page
    "showPageDetails": function(req, res) {
        createNewPage.findOne({_id: req.body.pageId}).exec(function(err, result){
            if(err) throw err;
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "Pages details show successfully"
            })
        })
    },


     // Api for create Ads
    "createAds": function(req, res) {
          waterfall([
          function(callback){
           var form = new multiparty.Form();
           form.multiples = true;
           form.parse(req, function(err, fields, files) {
            var fileUrl =[];
            console.log("files---->>>"+JSON.stringify(files));
               for (var i = 0; i < files.file.length; i++) {
               var filePath = files.file[i].path;
               cloudinary.uploader.upload(filePath, function(result) { 
               console.log("result---->>>>",result) 
               fileUrl.push(result.url);
               console.log("urls--=-=-=-=-=-=-=-=-=-=-=->>>"+JSON.stringify(fileUrl));
                console.log("image"+Boolean(files.file));
                var fileUrl1 = result.url;

                   var extension = fileUrl1.split('.').pop(); 

                    console.log(extension, extension === 'jpg');
              if(extension === 'mp4')   req.body.video=result.url;
               else  req.body.image=result.url;
              
              var Ads = new createNewAds(req.body);
               Ads.save(function(err, result1) {
               if (err) throw err;
               else  callback(null,result1)
             })
              
               },{resource_type: "auto"});
            }
           })
          }], function (err, result) {
                 console.log("result--------->>>>"+JSON.stringify(result))
                 res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Ad created successfully"
                 });
        })
    },

     // show all ads
    "showAllAdsData": function(req, res) {
         createNewAds.find({}).exec(function(err, result){
            if(err) throw err;
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "Data Show successfully"
            })
        })
    },

    
    // "showAdsDetails": function(req, res) {
    //     createNewPage.findOne({_id: req.body.adsId}).exec(function(err, result){
    //         if(err) throw err;
    //         res.send({
    //             result: result,
    //             responseCode: 200,
    //             responseMessage: "Pages details show successfully"
    //         })
    //     })
    // },

    // "followerList": function(req,res){


    // },
    
      "followList" : function(req, res){
        console.log("request---->>>"+JSON.stringify(req.body));
        User.findOneAndUpdate({ _id :req.body.userId},{
                $push :{followers : req.body.followers}
                    
                  },
                   {new: true}).exec(function(err, results){
                    console.log("followers----->>>>>"+JSON.stringify(results))

                    if(err) return err;

                      res.send({results:results,
                      responseCode: 200,
                      responseMessage: "Followed"});
                    }); 

  },

      "videoCount": function(req, res){
      console.log("request---->>>"+JSON.stringify(req.body));
      User.findOne({_id:req.body.userId,viewedAd:req.body.adId}, function(err, result){
        if(err) res.status(500).send(err);
        else if(!result){
          createNewAds.findOneAndUpdate({_id:req.body.adId},{
            $inc:{count:1 }
          },function(err,data){
           if (err) res.status(500).send(err);
           else{
               User.findOneAndUpdate({_id:req.body.userId},{
                $push:{viewedAd:req.body.adId}
               },function(err,user){
                res.status(200).send({msg:"success"});
               })
           }

          })

        }
        else{
        res.status(200).send({msg:"allready Watched"});
        }
     })
    }

}


 