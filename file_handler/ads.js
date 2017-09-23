var createNewAds = require("./model/createNewAds");
var createNewPage = require("./model/createNewPage");
var addsComments = require("./model/addsComments");
var User = require("./model/user");
var functions = require("./functionHandler");
var voucher_codes = require('voucher-code-generator');
var cron = require('node-cron');
var cloudinary = require('cloudinary');
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })
var fs = require('fs');
var waterfall = require('async-waterfall');
var multiparty = require('multiparty');
var Views = require("./model/views");
var mongoose = require('mongoose');
var brolixAndDollors = require("./model/brolixAndDollors");
var Payment = require("./model/payment");
var multer = require('multer');
var path = require('path');
var User = require("./model/user");
var uploadFile = require("./model/savedFiles")
var PageFollowers = require("./model/pageFollow");
var _ = require('underscore');
var async = require('async');
var multer = require('multer');
var ffmpeg = require('ffmpeg');
var payfort = require("payfort-node");
var createNewPage = require("./model/createNewPage");
var request = require('request');
var videoVariable;
var createSignature = require('./utility.js')
var paytabs = require('paytabs')
var NodeCache = require("node-cache");
var myCache = new NodeCache();

//<--------------------------------------------I18n------------------------------------------------->
var configs = {
    "lang": "ar",
    "langFile": "./../../translation/locale.json" //relative path to index.js file of i18n-nodejs module 
}
i18n_module = require('i18n-nodejs');
//<------------------------------------------------------------------------------------------------>


i18n = new i18n_module(configs.lang, configs.langFile);

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}


// cloudinary.config({
//     cloud_name: 'mobiloitte-in',
//     api_key: '188884977577618',
//     api_secret: 'MKOCQ4Dl6uqWNwUjizZLzsxCumE'
// });


/* This credential is munesh's account. */

cloudinary.config({
    cloud_name: 'brolix1',
    api_key: '779861163245424',
    api_secret: 'l_zjtpckfRSlPT9oPHmwshHc6Wc'
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


// var storage = multer.diskStorage({
//     destination: function(req, file, callback) {
//         //  console.log("filereq",file);

//         var unixname = file.fieldname + Date.now();
//         console.log("fieldname", unixname);
//         var details = file;
//         console.log("details" + details);
//         callback(null, './uploads');
//     },
//     filename: function(req, file, callback) {
//         callback(null, file.fieldname + '-' + Date.now());
//         //callback(null, file.fieldname);
//     }
// });

//  var uploadData = multer({ storage: storage }, { limits: { fieldNameSize: 10 } }).single('userPhoto');

// var uploadData = multer({
//                        storage: storage,
//                       fileFilter: function (req, file, callback) {
//                     var ext = path.extname(file.originalname);
//                     console.log("ext-->>>",ext)
//                     // if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
//                     //   console.log("Only images are allowed")
//                     //     return callback(new Error('Only images are allowed'))
//                     //    // callback(null, false)
//                     // }
//                     callback(null, true)
//                 },
//               limits: {
//                  fields: 1,
//                  files: 1,
//                  fileSize: 512000
//               }}).single('userFile')

//    var uploadData = multer({ storage : storage}).single('userPhoto');

// var xlsx = require('node-xlsx');

// var obj = xlsx.parse(__dirname + '/uploads/Brolix new pp (1).xlsx'); // parses a file

// var obj = xlsx.parse(fs.readFileSync(__dirname + '/myFile.xlsx')); // parses a buffer

// console.log("buffer", obj)


    var client = payfort.create_client("development", {
      access_code : "OX7sl2WYAts0VuwNP1XJ",
      merchant_identifier : "iPyVkhPq",
      passphrase : "TESTSHAIN",
      purchase_url : "https://sbcheckout.payfort.com/FortAPI/paymentPage"
    });

    var purchaseData = {
      "amount": 100000,
      "command" : "PURCHASE", // PURCHASE OR AUTHORIZATION 
      "currency": "JOD",
      "customer_email": "deepak@mobiloitte.in",
      "customer_name": "deepak",
      "language": "ar",
      "return_url": "http://ec2-52-76-162-65.ap-southeast-1.compute.amazonaws.com:8082/#/login",
      "merchant_reference": '24'
    };

module.exports = {    
    
    
    "testingPayfort": function(req, res) {
        var passdata={
            "service_command":"TOKENIZATION",
            "language": "en",
            "merchant_identifier" :"iPyVkhPq",
            "access_code" : "OX7sl2WYAts0VuwNP1XJ",
            "merchant_reference" : "MyReference0004",
            "card_security_code" : "123",
            "card_number" : 4005550000000001,
            "expiry_date" :2105,
            "remember_me": "YES",
            "card_holder_name" :"John Smith"
        }

        createSignature.create_signature("TESTSHAIN",passdata,function(datas){
            console.log("datat--->>>>",JSON.stringify(datas))
//            var testd ={
//                "service_command":"SDK_TOKEN",
//                "access_code":"OX7sl2WYAts0VuwNP1XJ",
//                "merchant_identifier":"iPyVkhPq",
//                "language":"en",
//                "device_id":"ef87856055b45dd42511515141181219b20ee755786801c885ae00100389f3d7",
//                "signature":datas
//            }
//            console.log("test data==>",testd)
           request({
            method: 'POST',
            headers: {
              'Content-Length': 5,
              'Content-Type': 'application/json'
            },
        uri: 'https://sbpaymentservices.payfort.com/FortAPI/paymentApi?JsonData={"service_command":"SDK_TOKEN","access_code":"OX7sl2WYAts0VuwNP1XJ","merchant_identifier":"iPyVkhPq","language":"en","device_id":"ef87856055b45dd42511515141181219b20ee755786801c885ae00100389f3d7","signature":"'+datas+'"}'        
    }, function (error, response, body)
        {
     //   console.log("test gate",response)
          if (error)
          {console.log(error)}
          else if(!error && response.statusCode == 200)
          { res.send({ responseCode:500, result:response}) }
          else
          { res.send({ responseCode:500,result:response }) } 
    })
        })
},
        
    "testingPayrwerfort": function(req, res) {       
       payfort.send_request(client, purchaseData, function(err, response){
          if(err){
              console.log("err---->>>>>",JSON.stringify(err))
              res.send({
                  responseCode:500,
                  result:err
              })
            }
           else{
               var get_request = {
                  // decoded query params 
                };
               var original_signature = response.create_signature;
               
               delete response.create_signature;
               
               var new_signature = payfort.create_signature("TESTSHAOUT", get_request);
               
               if(original_signature == new_signature){
                 console.log("valid---->>>>>")
                }else{
                  console.log("not   valid---->>>>>")
                }
              console.log("response---->>>>>",JSON.stringify(response)) 
              res.send({
                  responseCode:200,
                  result:response
              })
           }
            //handle response 
        })
    },
    
    // upload mp3 file in ad api
    "uploadMp3Files": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        var imageUrl = [];
        var form = new multiparty.Form();
        form.parse(req, function(err, fields, files) {
            var a = 0;
            for (var i = 0; i < files.mp3files.length; i++) {
                var img = files.mp3files[i];
                var fileName = files.mp3files[i].originalFilename;
                cloudinary.uploader.upload(img.path, function(result) {
                    if (result.url) {
                        var data = {
                            fileUrl: result.url,
                            fileName: result.public_id
                        }
                        //  console.log(data)
                        var fileData = new uploadFile(data);
                        fileData.save(function(err, ress) {
                            a += i;
                            if (a == i * i) {
                                res.send({
                                    responseCode: 200,
                                    responseMessage: i18n.__("File uploaded successfully")
                                });
                            }
                        })
                    } else {
                        callback(null, 'http://res.cloudinary.com/ducixxxyx/image/upload/v1480150776/u4wwoexwhm0shiz8zlsv.png')
                    }

                }, {
                    resource_type: "auto",
                    chunk_size: 6000000
                });
            }
        })
    },

    // show all mp3 file api
    "getMp3Files": function(req, res) {
        i18n = new i18n_module(req.params.lang, configs.langFile);
        uploadFile.find({}, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                res.send({ result: result, responseCode: 200, responseMessage: i18n.__("Mp3 files show successfully") });
            }
        })
    },

    // for create ads
    "createAds": function(req, res) {
        console.log("createAds--->>>", JSON.stringify(req.body))
        i18n = new i18n_module(req.body.lang, configs.langFile);
        if (req.body.adsType == "coupon") {
            if (!req.body.couponExpiryDate) { res.send({ responseCode: 400, responseMessage: i18n.__('Please enter coupon expiry date') }); } else if (req.body.numberOfWinners > req.body.viewerLenght) { res.send({ responseCode: 400, responseMessage: i18n.__('Number of winners can not be greater than number of viewers') }); } else {
                var couponCode = voucher_codes.generate({ length: 6, count: 1, charset: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" });
                req.body.couponCode = couponCode;
                //                req.body.viewerLenght = 100;
                //                req.body.numberOfWinners = 100;
                req.body.couponStatus = 'VALID';
                var Ads = new createNewAds(req.body);
                Ads.save(function(err, result) {
                    console.log("createAds--->>>", JSON.stringify(result))
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error 66', err }); } else {
                        var pageId = result.pageId;
                        createNewPage.findOneAndUpdate({ _id: pageId }, { $inc: { adsCount: 1 } }, { new: true }).exec(function(err, result1) {
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 22', err }); } else {
                                res.send({ result: result, responseCode: 200, responseMessage: i18n.__("Ad created successfully") });
                            }
                        })
                    }
                })
            }
        } else {
            User.findOne({ _id: req.body.userId }).exec(function(err, result) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error 44', err }); } else if (!result) { res.send({ responseCode: 404, responseMessage: 'Please enter correct userId' }) } else {
                    // req.body.viewerLenght = 100;
                    // req.body.numberOfWinners = 100;
                    req.body.cashStatus = 'DELIVERED';
                    var Ads = new createNewAds(req.body);
                    Ads.save(function(err, result) {
                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error 44', err }); } else {
                            var pageId = result.pageId;
                            createNewPage.findOneAndUpdate({ _id: pageId }, { $inc: { adsCount: 1 } }, { new: true }).exec(function(err, result1) {
                                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error 33', err }); } else {
                                    res.send({ result: result, responseCode: 200, responseMessage: i18n.__("Ad created successfully") });
                                }
                            })
                        }
                    })
                }
            })

        }
    },

    // remove ads api
    "removeAds": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        createNewAds.findOne({ _id: req.body.adId }).exec(function(err, results) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                var flag = results.removedUser.indexOf(req.body.userId)
                if (flag == -1) {
                    createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $push: { removedUser: req.body.userId } }, { new: true }).exec(function(err, results) {
                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                            res.send({
                                result: results,
                                responseCode: 200,
                                responseMessage: i18n.__("Ad removed successfully")
                            });

                        }
                    })
                } else {
                    res.send({
                        result: results,
                        responseCode: 200,
                        responseMessage: i18n.__("Ad removed successfully")
                    });
                }
            }
        })
    },

    // not in use
    "applyCoupon": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        createNewAds.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: i18n.__("Coupon apply successfully")
            });
        });
    },

    // show all ads coupon type api
    "showAllAdsCouponType": function(req, res) {
        i18n = new i18n_module(req.params.lang, configs.langFile);
        waterfall([
            function(callback) {
                var userId = req.params.id;
                console.log("showAllAdsCouponType-userId-->>>", userId)
                User.find({ $or: [{ 'type': 'USER' }, { 'type': 'Advertiser' }], status: 'ACTIVE', isVerified: "TRUE" }).lean().exec(function(err, userResult1) {
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
                        callback(null, blockedArray)
                        console.log("flag------->>>>", JSON.stringify(blockedArray))

                    }
                })
            },
            function(blockedArray, callback) {
                brolixAndDollors.findOne({ type: 'storeCouponPriceForFreeAds' }).exec(function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error 11" }); } else {
                        var value = result1.value
                        // var value= 2
                        callback(null, value, blockedArray)
                    }
                })
            },
            function(noDataValue, blockedArray, callback) {
                brolixAndDollors.findOne({ type: 'storeCouponPriceForUpgradedAds' }).exec(function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error 11" }); } else {
                        var value = result1.value
                        //  var value= 4;
                        callback(null, noDataValue, value, blockedArray)
                    }
                })
            },
            function(noDataValue, dataValue, blockedArray, callback) {
                console.log("flag----322--->>>>", JSON.stringify(blockedArray))
                User.findOne({ _id: req.params.id }).exec(function(err, userResult) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!userResult) { res.send({ responseCode: 404, responseMessage: "Please enter correct userId" }); } else {
                        var userCountry = userResult.country;
                    createNewAds.paginate({ userId: { $nin: blockedArray }, removedUser: { $ne: req.params.id }, adsType: "coupon", status: "ACTIVE", 'whoWillSeeYourAdd.country': userCountry }, { page: req.params.pageNumber, limit: 8, sort: { viewerLenght: -1, createdAt: -1 } }, function(err, result) {
                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result.docs.length == 0) { res.send({ responseCode: 404, responseMessage: i18n.__("No coupon ad found") }); } else {
                                for (var i = 0; i < result.docs.length; i++) {
                                    if (result.docs[i].adsType == 'coupon') {
                                        if (result.docs[i].cash == 0) {
                                            result.docs[i].couponSellPrice = noDataValue
                                        } else {
                                            result.docs[i].couponSellPrice = dataValue
                                        }
                                    }
                                }
                                var currentTime = (new Date).getTime();
                                for (var i = 0; i <= result.docs.length - 1; i++) {
                                    var array = [];
                                    var array2 = [];
                                    console.log("haanananna", i)
                                    if (result.docs[i].expiryOfPriority != null && result.docs[i].expiryOfPriority - currentTime > 0) {
                                        console.log(" +*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+* ")
                                        //   console.log("with priority ", result.docs[i]._id)
                                        //     console.log("and prority", result.docs[i].priorityNumber)
                                        var sigma = function() {
                                            var array = result.docs;
                                            if (array[i].priorityNumber >= array.length) {
                                                var k = array[i].priorityNumber - result.length;
                                                while ((k--) + 1) {
                                                    array.push(undefined);
                                                }
                                            }
                                            array.splice(array[i].priorityNumber, 0, array.splice(i, 1)[0]);
                                            return array;
                                        }();
                                    } else {
                                        console.log("sayng something ", i)
                                        array2.push(result.docs[i]);
                                    }
                                }
                                var updatedResult = result.docs;
                                createNewAds.populate(updatedResult, { path: 'pageId', model: 'createNewPage', select: 'pageName adAdmin' }, function(err, finalResult) {
                                    res.send({
                                        responseCode: 200,
                                        responseMessage: i18n.__("Data Shown successfully"),
                                        result: result
                                    })
                                })
                            }
                        })

                    }
                })
            }
        ])
    },

    // for testing
    "testingPriority": function(req, res) {
        var userId = req.params.id;
        console.log("priority userId req --->>", userId)
        waterfall([
            function(callback) {
                var userId = req.params.id;
                User.find({ $or: [{ 'type': 'USER' }, { 'type': 'Advertiser' }], status: 'ACTIVE', isVerified: "TRUE" }).lean().exec(function(err, userResult1) {
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
                        callback(null, blockedArray)
                        console.log("flag------->>>>", JSON.stringify(blockedArray))

                    }
                })
            },
            function(blockedArray, callback) {
                brolixAndDollors.findOne({ type: 'storeCouponPriceForFreeAds' }).exec(function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error 11" }); } else {
                        var value = result1.value
                        // var value= 2
                        callback(null, value, blockedArray)
                    }
                })
            },
            function(noDataValue, blockedArray, callback) {
                brolixAndDollors.findOne({ type: 'storeCouponPriceForUpgradedAds' }).exec(function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error 11" }); } else {
                        var value = result1.value
                        //  var value= 4;
                        callback(null, noDataValue, value, blockedArray)
                    }
                })
            },
            function(noDataValue, dataValue, blockedArray, callback) {
                console.log("blockedArray---->>", blockedArray)
                User.findOne({ _id: req.params.id }).exec(function(err, userResult) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error 22' }); } else if (!userResult) { res.send({ responseCode: 404, responseMessage: "Please enter correct userId" }); } else {
                        var userCountry = userResult.country;
                        createNewAds.paginate({ userId: { $nin: blockedArray }, removedUser: { $ne: req.params.id }, status: "ACTIVE", 'whoWillSeeYourAdd.country': userCountry }, { page: req.params.pageNumber, limit: 8, sort: { viewerLenght: -1 } }, function(err, result) {
                            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error 11' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No coupon ad found" }); } else {
                                for (var i = 0; i < result.docs.length; i++) {
                                    if (result.docs[i].adsType == 'coupon') {
                                        if (result.docs[i].cash == 0) {
                                            result.docs[i].couponSellPrice = noDataValue
                                        } else {
                                            result.docs[i].couponSellPrice = dataValue
                                        }
                                    }
                                }
                                var currentTime = (new Date).getTime();
                                // console.log('currentTime',data)
                                for (var i = 0; i <= result.docs.length - 1; i++) {
                                    var array = [];
                                    var array2 = [];
                                    console.log("haanananna", i)
                                    if (result.docs[i].expiryOfPriority != null && result.docs[i].expiryOfPriority - currentTime > 0) {
                                        console.log(" +*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+* ")
                                        console.log("with priority ", result.docs[i]._id)
                                        console.log("and prority", result.docs[i].priorityNumber)
                                        var sigma = function() {
                                            var array = result.docs;
                                            if (array[i].priorityNumber >= array.length) {
                                                var k = array[i].priorityNumber - result.length;
                                                while ((k--) + 1) {
                                                    array.push(undefined);
                                                }
                                            }
                                            array.splice(array[i].priorityNumber, 0, array.splice(i, 1)[0]);
                                            return array;
                                        }();
                                    } else {
                                        console.log("sayng something ", i)
                                        array2.push(result.docs[i]);
                                    }
                                }

                                var updatedResult = result.docs;
                                createNewAds.populate(updatedResult, { path: 'pageId', model: 'createNewPage', select: 'pageName adAdmin' }, function(err, finalResult) {
                                    res.send({
                                        result: result,
                                        responseCode: 200,
                                        responseMessage: "Data Shown successfully"
                                    })
                                })
                            }
                        })

                    }
                })
            }
        ])
    },

    // show all ads cash type api
    "showAllAdsCashType": function(req, res) {
        i18n = new i18n_module(req.params.lang, configs.langFile);
        var userId = req.params.id;
        User.find({ $or: [{ 'type': 'USER' }, { 'type': 'Advertiser' }], status: 'ACTIVE', isVerified: "TRUE" }).lean().exec(function(err, userResult1) {
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
                console.log("flag------->>>>", JSON.stringify(blockedArray))
                User.findOne({ _id: req.params.id }).exec(function(err, userResult) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!userResult) { res.send({ responseCode: 404, responseMessage: "Please enter correct userId" }); } else {
                        var userCountry = userResult.country;
                        createNewAds.paginate({ userId: { $nin: blockedArray }, removedUser: { $ne: req.params.id }, adsType: "cash", status: "ACTIVE", 'whoWillSeeYourAdd.country': userCountry }, { page: req.params.pageNumber, limit: 8, sort: { viewerLenght: -1, createdAt: -1 }}, function(err, result) {
                            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {

                                var currentTime = (new Date).getTime();
                                for (var i = 0; i <= result.docs.length - 1; i++) {
                                    var array = [];
                                    var array2 = [];
                                    console.log("haanananna", i)
                                    if (result.docs[i].expiryOfPriority != null && result.docs[i].expiryOfPriority - currentTime > 0) {
                                        var sigma = function() {
                                            var array = result.docs;
                                            if (array[i].priorityNumber >= array.length) {
                                                var k = array[i].priorityNumber - result.length;
                                                while ((k--) + 1) {
                                                    array.push(undefined);
                                                }
                                            }
                                            array.splice(array[i].priorityNumber, 0, array.splice(i, 1)[0]);
                                            return array;
                                        }();
                                    } else {
                                        console.log("sayng something ", i)
                                        array2.push(result.docs[i]);
                                    }
                                }

                                var updatedResult = result.docs;
                                createNewAds.populate(updatedResult, { path: 'pageId', model: 'createNewPage', select: 'pageName adAdmin' }, function(err, finalResult) {
                                    res.send({
                                        result: result,
                                        responseCode: 200,
                                        responseMessage: i18n.__("Data Shown successfully")
                                    })
                                })

                            }
                        })
                    }
                })
            }
        })
    },

    //API for Show Coupons Search
    "couponsSearch": function(req, res) {
        //   console.log("req======>>>" + JSON.stringify(req.body))
        i18n = new i18n_module(req.body.lang, configs.langFile);
        var re = new RegExp(req.body.search, 'i');
        createNewAds.find({ status: 'ACTIVE' }).or([{ 'whoWillSeeYourAdd.country': { $regex: re } }, { 'whoWillSeeYourAdd.state': { $regex: re } }, { 'whoWillSeeYourAdd.city': { $regex: re } }]).sort({ country: -1 }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                res.send({
                    responseCode: 200,
                    responseMessage: i18n.__("Show coupons successfully"),
                    result: result
                });
            }
        })
    },

    //API for Show Search
    "searchForCoupons": function(req, res) {
        console.log("searchForCoupons--->>>", JSON.stringify(req.body))
        i18n = new i18n_module(req.body.lang, configs.langFile);
        waterfall([
            function(callback) {
                var userId = req.params.id;
                User.find({ $or: [{ 'type': 'USER' }, { 'type': 'Advertiser' }], status: 'ACTIVE', isVerified: "TRUE" }).lean().exec(function(err, userResult1) {
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
                        callback(null, blockedArray)
                        console.log("flag------->>>>", JSON.stringify(blockedArray))
                    }
                })
            },
            function(blockedArray, callback) {
                brolixAndDollors.findOne({ type: 'storeCouponPriceForFreeAds' }).exec(function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error 11" }); } else {
                        var value = result1.value
                        // var value= 2
                        callback(null, value, blockedArray)
                    }
                })
            },
            function(noDataValue, blockedArray, callback) {
                brolixAndDollors.findOne({ type: 'storeCouponPriceForUpgradedAds' }).exec(function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error 11" }); } else {
                        var value = result1.value
                        //  var value= 4;
                        callback(null, noDataValue, value, blockedArray)
                    }
                })
            },
            function(noDataValue, value, blockedArray, callback) {
                var re = new RegExp(req.body.pageName, 'i');
                createNewPage.find({ 'pageName': { $regex: re }, status: 'ACTIVE' }, function(err, pageResult) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (pageResult.length == 0) { res.send({ responseCode: 404, responseMessage: 'No page found' }); } else {
                        //     console.log("array--->>>",JSON.stringify(pageResult))
                        var array = []
                        for (var i = 0; i < pageResult.length; i++) {
                            array.push(pageResult[i]._id)
                        }
                        //  console.log("array--->>>",array)
                        callback(null, array, noDataValue, value, blockedArray);
                    }
                })

            },
            function(array, noDataValue, dataValue, blockedArray, callback) {               
                var re = new RegExp(req.body.pageName, 'i');
                var re2 = new RegExp(req.body.subCategory, 'i')
                var data = {
                    'whoWillSeeYourAdd.country': req.body.country,
                    'whoWillSeeYourAdd.state': req.body.state,
                    $or: [{ 'whoWillSeeYourAdd.city': req.body.city }, { 'whoWillSeeYourAdd.city': '' }],
                    // 'whoWillSeeYourAdd.city': req.body.city,
                    // 'pageName': { $regex: re },
                    'adsType': req.body.type,
                    'category': req.body.category,
                    'subCategory': { $regex: re2 },
                    'pageId': { $in: array },
                    //'_id':{$in:adsArray}
                }

                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        if (data[key] == "" || data[key] == null || data[key] == undefined) {
                            delete data[key];
                        }
                    }
                }
                var activeStatus = { userId: { $nin: blockedArray }, status: 'ACTIVE' }
                Object.assign(data, activeStatus)
             //   console.log("data==========>", data)
                createNewAds.paginate(data, { page: req.params.pageNumber, limit: 8, sort: { viewerLenght: -1, createdAt: -1 } }, function(err, results) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                        //var Removed = results.docs.filter(function(el) { return el.userId !== req.body.userId; });
                        for (var i = 0; i < results.docs.length; i++) {
                            if (results.docs[i].cash == 0) {
                                results.docs[i].couponSellPrice = noDataValue
                            } else {
                                results.docs[i].couponSellPrice = dataValue
                            }
                        }
                        var updatedResult = results.docs;
                        createNewAds.populate(updatedResult, { path: 'pageId', model: 'createNewPage', select: 'pageName adAdmin' }, function(err, finalResult) {
                             console.log("data==========>", JSON.stringify(results))
                            res.send({
                                result: results,
                                responseCode: 200,
                                responseMessage: i18n.__("All Details Found")
                            })
                        })

                    }
                })
            }
        ])
    },

    // //API for Like And Unlike
    // "likeAndUnlike": function(req, res) {
    //     i18n = new i18n_module(req.body.lang, configs.langFile);
    //     if (req.body.flag == "like") {
    //         createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $push: { like: req.body.userId } }, { new: true }).exec(function(err, results) {
    //             if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
    //                 res.send({
    //                     result: results,
    //                     responseCode: 200,
    //                     responseMessage: i18n.__("Liked")
    //                 });
    //             }
    //         })
    //     } else {
    //         createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $pop: { like: req.body.userId } }, { new: true }).exec(function(err, results) {
    //             if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
    //                 res.send({
    //                     result: results,
    //                     responseCode: 200,
    //                     responseMessage: i18n.__("Unliked")
    //                 });
    //             }
    //         })
    //     }
    // },
    
    // new like and unlike
      "likeAndUnlike":function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        console.log("req body of like.....",req.body)
        if (req.body.flag == "like") {
            createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $push: { likeAndUnlike: { userId:req.body.userId,winnerId:req.body.winnerId ,type:req.body.type }} }, { new: true }).exec(function(err, results) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                    res.send({
                        result: results,
                        responseCode: 200,
                        responseMessage: i18n.__("Liked")
                    });
                }
            })
        } else {
            createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $pull: { likeAndUnlike: {userId:req.body.userId ,winnerId:req.body.winnerId ,type:req.body.type } } }, { new: true }).exec(function(err, results) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                    res.send({
                        result: results,
                        responseCode: 200,
                        responseMessage: i18n.__("Unliked")
                    });
                }
            })
        }
    },

    // api for comments on ads
    "commentOnAds": function(req, res) {
        console.log("comments on ads request -->>>", JSON.stringify(req.body))
        i18n = new i18n_module(req.body.lang, configs.langFile);
        var adds = new addsComments(req.body);
        adds.save(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                if (result.type == 'onAds') {
                    createNewAds.findOneAndUpdate({ _id: req.body.addId }, { $inc: { commentCount: +1 } }, { new: true }).exec(function(err, results) {
              if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {

                  var taggedUserArray = [];
                  if (results.tag.length > 0 && results.tag.length != null) {
                      for (var i = 0; i < results.tag.length; i++) {
                          for (var j = 0; j < results.tag[i].senderId.length; j++) {
                              taggedUserArray.push(results.tag[i].senderId[j])

                          }
                      }
                  }
                  addsComments.populate(result, { path: 'userId reply.userId', model: 'brolixUser', select: 'image firstName lastName' }, function(err, finalResult) {
                      addsComments.populate(result, { path: 'pageId', model: 'createNewPage', select: 'pageName pageImage userId adAdmin' }, function(err, finalResult) {
                           console.log("taggedUserArray--->>>", JSON.stringify(taggedUserArray))
                           User.findOne({_id:req.body.userId},function(err, userResult1){
                              if (err) { res.send({ responseCode: 500, responseMess: 'Internal server error' }); }
                               else{
                                   
                             console.log(userResult1.firstName+userResult1.lastName)
                           
                          if (taggedUserArray.length > 0) {                                
                              User.find({ _id: { $in: taggedUserArray } }, function(err, userResult) {
                                  if (err) { res.send({ responseCode: 500, responseMess: 'Internal server error' }); } else {
                                      for (var k = 0; k < userResult.length; k++) {
                                      //  console.log("taggedUserArray-22-->>>", JSON.stringify(userResult[k]))
                                       //  console.log(userResult[k].firstName+userResult[k].lastName)
                                          if (userResult[k].deviceToken && userResult[k].deviceType && userResult[k].notification_status && userResult[k].status) {
                                              var message = userResult1.firstName+" "+userResult1.lastName+" "+"commented on an ad that you are tagged in";
                                              var id = req.body.userId;
                                                 console.log(message)
                                                 console.log(id)
                                              if (userResult[k].deviceType == 'Android' && userResult[k].notification_status == 'on' && userResult[k].status == 'ACTIVE') {
                                                  functions.android_notification(userResult[k].deviceToken, message,id);
                                                  console.log("Android notification send!!!!")
                                              } else if (userResult[k].deviceType == 'iOS' && userResult[k].notification_status == 'on' && userResult[k].status == 'ACTIVE') {
                                                  functions.iOS_notification(userResult[k].deviceToken, message, id);
                                              } else {
                                                  console.log("Something wrong!!!!")
                                              }
                                          }
                                      }

                                  }
                              })
                          }
                                     }
                           })
                          res.send({
                              result: result,
                              responseCode: 200,
                              responseMessage: i18n.__("Comments save with concerned User details")
                          });
                      })
                  })
              }
          })
         } else {
                createNewAds.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(req.body.addId) }, { $inc: { commentCountOnGifts: 1 } }, { new: true }, function(err, result1) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                        addsComments.populate(result, { path: 'userId reply.userId', model: 'brolixUser', select: 'image firstName lastName' }, function(err, finalResult) {
                             addsComments.populate(result, { path: 'pageId', model: 'createNewPage', select: 'pageName pageImage userId adAdmin' }, function(err, finalResult) {
                            res.send({
                                result: result,
                                responseCode: 200,
                                responseMessage: i18n.__("Comments save with concerned User details")
                            });
                        })
                        })
                    }
                })
            }
        }
    })
    },


    //API reply on Comment on Ads
    "replyOnComment": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        addsComments.findOneAndUpdate({ addId: req.body.addId, _id: req.body.commentId }, {
            $push: { 'reply': { userId: req.body.userId, replyComment: req.body.replyComment, userName: req.body.userName, userImage: req.body.userImage } } }, { new: true }).exec(function(err, results) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
            else {                
                addsComments.populate(results, { path: 'userId reply.userId', model: 'brolixUser', select: 'image firstName lastName' }, function(err, finalResult) {                    
                    addsComments.populate(results, { path: 'pageId', model: 'createNewPage', select: 'pageName pageImage userId adAdmin' }, function(err, finalResult) {
                        
                        createNewAds.findOne({_id:req.body.addId}).exec(function(err, adResult){
                             if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
                            else{
                        //  console.log("in replyOnComment--->>>", JSON.stringify(adResult))
                                var taggedUserArray = [];
                              if (adResult.tag.length > 0 && adResult.tag.length != null) {
                                  for (var i = 0; i < adResult.tag.length; i++) {
                                      for (var j = 0; j < adResult.tag[i].senderId.length; j++) {
                                          taggedUserArray.push(adResult.tag[i].senderId[j])

                                      }
                                  }
                              }
                                
                                User.findOne({_id:req.body.userId},function(err, userResult1){
                              if (err) { res.send({ responseCode: 500, responseMess: 'Internal server error' }); }
                               else{
                                   
                             console.log(userResult1.firstName+userResult1.lastName)
                                
                              if (taggedUserArray.length > 0) {                                
                              User.find({ _id: { $in: taggedUserArray } }, function(err, userResult) {
                                  if (err) { res.send({ responseCode: 500, responseMess: 'Internal server error' }); } else {
                                      for (var k = 0; k < userResult.length; k++) {
                                      //  console.log("taggedUserArray-22-->>>", JSON.stringify(userResult[k]))
                                         console.log(userResult[k].firstName+userResult[k].lastName)
                                          if (userResult[k].deviceToken && userResult[k].deviceType && userResult[k].notification_status && userResult[k].status) {
                                              var message = userResult[k].firstName+" "+userResult[k].lastName+" "+"commented on an ad that you are tagged in";
                                              var id =req.body.userId;
                                                 console.log(message)
                                                 console.log(id)
                                              if (userResult[k].deviceType == 'Android' && userResult[k].notification_status == 'on' && userResult[k].status == 'ACTIVE') {
                                                  functions.android_notification(userResult[k].deviceToken, message,id);
                                                  console.log("Android notification send!!!!")
                                              } else if (userResult[k].deviceType == 'iOS' && userResult[k].notification_status == 'on' && userResult[k].status == 'ACTIVE') {
                                                  functions.iOS_notification(userResult[k].deviceToken, message, id);
                                              } else {
                                                  console.log("Something wrong!!!!")
                                              }
                                          }
                                      }

                                  }
                              })
                          }
                               }
                                })
                        
                        res.send({
                            result: results,
                            responseCode: 200,
                            responseMessage: i18n.__("Comments save successfully")
                        });
         
                                
                            }
                        })
               
                    })

                })

            }
        })
    },

    // show list of comments on ads
    "adsCommentList": function(req, res) {
        i18n = new i18n_module(req.params.lang, configs.langFile);
        var type = req.params.type;
        var id = req.params.id;
        var userId = req.params.userId;
        var couponType = req.params.couponType;
        console.log("in couponType--->>>", couponType)
        console.log("in type--->>>", type)
        console.log("in id--->>>", id)
        var condition;
        if (type == 'onGifts') {
            console.log("in if")
            condition = { $and: [{ addId: id }, { winnerId: userId }, { type: type }, { couponType: couponType }], status: "ACTIVE" }
        } else {
            console.log("in else")
            condition = { addId: id, type: type, status: "ACTIVE" }
        }
        console.log("in condition--->>>", condition)
        addsComments.paginate(condition, { page: req.params.pageNumber, limit: 10, sort: { createdAt: -1 } }, function(err, result) {
            console.log("in result", result)
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result.docs.length == 0) { res.send({ responseCode: 400, responseMessage: 'No comment found in list' }) } else {
                for (var i = 0; i < result.docs.length; i++) {
                    var reply = result.docs[i].reply;
                    var data = reply.filter(reply => reply.status == 'ACTIVE');
                    result.docs[i].reply = data;
                }
                addsComments.populate(result.docs, { path: 'userId reply.userId', model: 'brolixUser', select: 'image firstName lastName' }, function(err, finalResult) {
                    addsComments.populate(result.docs, { path: 'pageId', model: 'createNewPage', select: 'pageName pageImage userId adAdmin' }, function(err, finalResult) {
                        addsComments.populate(result.docs, { path: 'addId', model: 'createNewAds', select: 'giftDescription likeAndUnlike ' }, function(err, finalResult) {
                        res.send({
                            result: result,
                            responseCode: 200,
                            responseMessage: i18n.__("Comments List")
                        })
                    })
                    })
                })

            }
        })
    },

    // delete comments on ads
    "deleteComments": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        if (req.body.type == 'comment') {
            var adQuery = { addId: req.body.adId, _id: req.body.commentId }
            var setCondition = { status: 'INACTIVE' }
        } else {
            var adQuery = { addId: req.body.adId, _id: req.body.commentId, 'reply._id': req.body.replyId }
            var setCondition = { 'reply.$.status': 'INACTIVE' }
        }

        addsComments.findOneAndUpdate(adQuery, setCondition, { new: true }).exec(function(err, results) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (results == null || results == undefined) {
                res.send({ responseCode: 409, responseMessage: 'Something went wrong' });
            } else {
                if (req.body.type == 'comment') {
                    createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $inc: { commentCount: -1 } }, { new: true }).exec(function(err, resul) {
                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                            res.send({
                                result: results,
                                responseCode: 200,
                                responseMessage: i18n.__("Comment deleted successfully")
                            });
                        }
                    })
                } else {
                    res.send({
                        result: results,
                        responseCode: 200,
                        responseMessage: i18n.__("Comment deleted successfully")
                    });
                }
            }
        })
    },

    // edit comments on ads api 
    "editComments": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        if (req.body.type == 'comment') {
            var adQuery = { addId: req.body.adId, _id: req.body.commentId, type: req.body.commentType }
            var setCondition = { comment: req.body.comment }
        } else {
            var adQuery = { addId: req.body.adId, _id: req.body.commentId, 'reply._id': req.body.replyId }
            var setCondition = { 'reply.$.replyComment': req.body.replyComment }
        }
        addsComments.findOneAndUpdate(adQuery, setCondition, { new: true }).exec(function(err, results) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (results == null || results == undefined) {
                res.send({ responseCode: 409, responseMessage: 'Something went wrong' });
            } else {
                addsComments.populate(results, { path: 'userId reply.userId', model: 'brolixUser', select: 'image firstName lastName' }, function(err, finalResult) {

                    addsComments.populate(results, { path: 'pageId', model: 'createNewPage', select: 'pageName pageImage userId adAdmin' }, function(err, finalResult) {
                        res.send({
                            result: results,
                            responseCode: 200,
                            responseMessage: i18n.__("Comment edited successfully")
                        });
                    })
                })
            }
        })
    },

    // edit comments on page api
    "editCommentsOnPage": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        if (req.body.type == 'comment') {
            var adQuery = { addId: req.body.adId, _id: req.body.commentId }
            var setCondition = { comment: req.body.comment }
        } else {
            var adQuery = { addId: req.body.adId, _id: req.body.commentId, 'reply._id': req.body.replyId }
            var setCondition = { 'reply.$.replyComment': req.body.replyComment }
        }
        addsComments.findOneAndUpdate(adQuery, setCondition, { new: true }).exec(function(err, results) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (results == null || results == undefined) {
                res.send({ responseCode: 409, responseMessage: 'Something went wrong' });
            } else {
              //  console.log("adsCommentList---->>>", JSON.stringify(results))
                addsComments.populate(results, { path: 'userId reply.userId', model: 'brolixUser', select: 'image firstName lastName' }, function(err, finalResult) {

                    addsComments.populate(results, { path: 'pageId', model: 'createNewPage', select: 'pageName pageImage userId adAdmin' }, function(err, finalResult) {
                        res.send({
                            result: results,
                            responseCode: 200,
                            responseMessage: i18n.__("Comment edited successfully")
                        });
                    })


                })
            }
        })
    },

    //API Comment on Ads
    "sendCoupon": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        User.findOne({ _id: req.body.userId }, avoid).exec(function(err, result) {
            if (!result) {
                res.send({
                    responseCode: 404,
                    responseMessage: i18n.__('User does not exists')
                });
            } else {
                console.log(result.email)
                var massege = "Coupon Code is:-"
                functions.mail(result.email, massege, req.body.couponCode);
                res.send({
                    responseCode: 200,
                    responseMessage: i18n.__("Send your coupon successfully")
                });
            }
        })
    },

    //Exchange Coupons Api
    "exchangeCoupon": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        User.findOne({ _id: req.body.senderId }).exec(function(err, result) {
            if (!result) {
                res.send({
                    responseCode: 404,
                    responseMessage: i18n.__('User does not exists')
                });
            } else {
                createNewAds.findByIdAndUpdate({ _id: req.body.adId }, { $push: { "couponExchange": { senderId: req.body.senderId, newCoupon: req.body.newCoupon, oldCoupon: req.body.oldCoupon, couponExchangeStatus: req.body.couponExchangeStatus } } }, { new: true }).exec(function(err, results) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }) } else {
                        //mail(result.email, req.body.massege, req.body.couponCode);
                        res.send({
                            result: results,
                            responseCode: 200,
                            responseMessage: i18n.__("Coupon exchange request sent successfully")
                        });
                    }
                })
            }
        })
    },

    /* not in use */
    "acceptExchangeCouponRequest": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        createNewAds.update({ _id: req.body.adId, 'couponExchange.senderId': req.body.senderId }, {
            $set: {
                'couponExchange.$.couponExchangeStatus': "Accepted"
            }
        }, { new: true }).exec(function(err, results) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }) } else {
                res.send({
                    result: results,
                    responseCode: 200,
                    responseMessage: i18n.__("Accepted successfully")
                });
            }
        })
    },

    // Api for Social Share
    "socialShare": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        var userId = req.body.userId;
        var link = req.body.link;
        createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $push: { "socialShareListObject": { userId: req.body.userId, link: req.body.link } } }, { new: true }, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No Ad Found" }); } else if (userId == null || userId == '' || userId === undefined) { res.send({ responseCode: 404, responseMessage: 'please enter userId' }); } else if (link == null || link == '' || link === undefined) { res.send({ responseCode: 404, responseMessage: 'please enter link' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: i18n.__("Post saved successfully")
                })
            }
        })
    },

    // show all winners 
    "winners": function(req, res) {
        i18n = new i18n_module(req.params.lang, configs.langFile);
        createNewAds.find({ status: "EXPIRED" }).exec(function(err, result) {
            var array = [];
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                var count = 0;
                for (var i = 0; i < result.length; i++) {
                    for (var j = 0; j < result[i].winners.length; j++) {
                        array.push(result[i].winners[j])
                        count++;
                    }
                }
                User.paginate({ _id: { $in: array } }, { page: req.params.pageNumber, limit: 8 }, function(err, result1) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                        res.send({
                            result: result1,
                            count: count,
                            responseCode: 200,
                            responseMessage: i18n.__("Post saved successfully")
                        })

                    }
                })
            }
        })
    },

    // list of user's ads
    "listOfAds": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        createNewAds.find({ userId: req.body.userId }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                var couponType = result.filter(result => result.adsType == "coupon");
                var cashType = result.filter(result => result.adsType == "cash");
                res.send({
                    couponType: couponType,
                    cashType: cashType,
                    responseCode: 200,
                    responseMessage: i18n.__("List of ads show successfully!!")
                });
            }
        });
    },

    // list of all ads
    "listOfAllAds": function(req, res) {
        i18n = new i18n_module(req.params.lang, configs.langFile);
        if (req.params.type == 'all') {
            waterfall([
                function(callback) {
                    brolixAndDollors.findOne({ type: 'storeCouponPriceForFreeAds' }).exec(function(err, result1) {
                        if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error 11" }); } else {
                            var value = result1.value
                            // var value= 2
                            callback(null, value)
                        }
                    })
                },
                function(noDataValue, callback) {
                    brolixAndDollors.findOne({ type: 'storeCouponPriceForUpgradedAds' }).exec(function(err, result1) {
                        if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error 11" }); } else {
                            var value = result1.value
                            //  var value= 4;
                            callback(null, noDataValue, value)
                        }
                    })
                },
                function(noDataValue, dataValue, callback) {
                    createNewAds.paginate({ adsType: { $ne: 'ADMINCOUPON' }, pageId: req.params.pageId, $or: [{ status: 'ACTIVE' }, { status: 'EXPIRED' }] }, { page: req.params.pageNumber, limit: 8, sort: { viewerLenght: -1, createdAt: -1 } }, function(err, result) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 400, responseMessage: 'Please enter correct page id' }); } else if (result.docs.length == 0) { res.send({ responseCode: 400, responseMessage: 'No ad found' }); } else {

                            var updatedResult = result.docs;
                            createNewAds.populate(updatedResult, { path: 'pageId', model: 'createNewPage', select: 'pageName' }, function(err, finalResult) {

                                for (var i = 0; i < result.docs.length; i++) {
                                    if (result.docs[i].adsType == 'coupon') {
                                        if (result.docs[i].cash == 0) {
                                            result.docs[i].couponSellPrice = noDataValue
                                        } else {
                                            result.docs[i].couponSellPrice = dataValue
                                        }
                                    }
                                }
                                //   console.log("listOfAllAds---->>>",JSON.stringify(result))
                                res.send({
                                    result: result,
                                    responseCode: 200,
                                    responseMessage: i18n.__("All ads shown cash type and coupon type")
                                });
                            })
                        }
                    })
                }
            ])

        } else {
            waterfall([
                function(callback) {
                    brolixAndDollors.findOne({ type: 'storeCouponPriceForFreeAds' }).exec(function(err, result1) {
                        if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error 11" }); } else {
                            var value = result1.value
                            // var value= 2
                            callback(null, value)
                        }
                    })
                },
                function(noDataValue, callback) {
                    brolixAndDollors.findOne({ type: 'storeCouponPriceForUpgradedAds' }).exec(function(err, result1) {
                        if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error 11" }); } else {
                            var value = result1.value
                            //  var value= 4;
                            callback(null, noDataValue, value)
                        }
                    })
                },
                function(noDataValue, dataValue, callback) {
                    type = req.params.type;
                    createNewAds.paginate({ pageId: req.params.pageId, adsType: type, $or: [{ status: 'ACTIVE' }, { status: 'EXPIRED' }] }, { page: req.params.pageNumber, limit: 8, sort: { viewerLenght: -1, createdAt: -1 } }, function(err, result) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 400, responseMessage: 'Please enter correct page id' }); } else if (result.docs.length == 0) { res.send({ responseCode: 400, responseMessage: 'No ad found' }); } else {

                            var updatedResult1 = result.docs;
                            createNewAds.populate(updatedResult1, { path: 'pageId', model: 'createNewPage', select: 'pageName' }, function(err, finalResult) {
                                for (var i = 0; i < result.docs.length; i++) {
                                    if (result.docs[i].adsType == 'coupon') {
                                        if (result.docs[i].cash == 0) {
                                            result.docs[i].couponSellPrice = noDataValue
                                        } else {
                                            result.docs[i].couponSellPrice = dataValue
                                        }
                                    }
                                }
                                //     console.log("listOfAllAds--2-->>>",JSON.stringify(result))
                                res.send({
                                    result: result,
                                    responseCode: 200,
                                    responseMessage: i18n.__("All ads shown cash type and coupon type")
                                });
                            })
                        }
                    });
                }
            ])
        }
    },


    // api for image and video upload
    "uploads": function(req, res) {       
        i18n = new i18n_module(req.body.lang, configs.langFile);
        console.log(req.files);
        var imageUrl = [];
        var form = new multiparty.Form();
        form.parse(req, function(err, fields, files) {
            var a = 0;
            for (var i = 0; i < files.images.length; i++) {
                var img = files.images[i];
                var fileName = files.images[i].originalFilename;
                cloudinary.uploader.upload(img.path, function(result) {
                    if (result.url) {
                        imageUrl.push(result.url);
                        a += i;
                        if (a == i * i) {
                            res.send({
                                result: result.url,
                                responseCode: 200,
                                responseMessage: i18n.__("File uploaded successfully")
                            });
                        }
                    } else {
                        callback(null, 'http://res.cloudinary.com/ducixxxyx/image/upload/v1480150776/u4wwoexwhm0shiz8zlsv.png')
                    }
                }, {
                    resource_type: "auto",
                    chunk_size: 6000000
                });
            }
        })
    },

     "videoUploads": function(req, res) {  
        i18n = new i18n_module(req.body.lang, configs.langFile);
        console.log(req.files);
        var imageUrl = [];
        var form = new multiparty.Form();
        form.parse(req, function(err, fields, files) {
            var a = 0;
            for (var i = 0; i < files.images.length; i++) {
                var img = files.images[i];
                cloudinary.v2.uploader.upload(img.path,{resource_type:"video", format:"mp4"},function(err,result) {
                 //   console.log("result--->>>>",JSON.stringify(result))
                    if(err){ res.send({ responseCode:500, responseMessage:'Internal server error'})}
                    else if (result.url) {
                        imageUrl.push(result.url);
                        a += i;
                        if (a == i * i) {
                             console.log("result   url--->>>>",JSON.stringify(result.url))
                            var rest = result.url.substring(0,result.url.lastIndexOf("."));
                            var newResult = rest+'.mp4'
                            res.send({
                                result: result.url,
                                responseCode: 200,
                                responseMessage: i18n.__("File uploaded successfully")
                            });
                        }
                    } else {
                        callback(null, 'http://res.cloudinary.com/ducixxxyx/image/upload/v1480150776/u4wwoexwhm0shiz8zlsv.png')
                    }
                }, {
                    resource_type: "auto",
                    chunk_size: 6000000
                });
            }
        })
    },
    
    //<----------------------------------------video upload api ------------------------------------>
//    "videoUploads": function(req, res) {
//    console.log("hi")
//    var img_base64 = req.body.video;
//    var binaryData = new Buffer(img_base64, 'base64');
//    fs.writeFile("fileHandler/images/test.mp4", binaryData, "binary", function() {});
//    cloudinary.v2.uploader.upload_large("fileHandler/images/test.mp4", {
//        resource_type: "video",
//        eager: [{
//            width: 300,
//            height: 300,
//            crop: "pad",
//            audio_codec: "none"
//        }, {
//            width: 160,
//            height: 100,
//            crop: "crop",
//            gravity: "south",
//            audio_codec: "none"
//        }],
//        eager_async: true,
//        eager_notification_url: "http://mysite/notify_endpoint"
//    }, function(err, result) {
//        if (err) {
//            return res.json({
//                responseCode: 400,
//                responseMessage: "some thing went wrong."
//            })
//        } else {
//            res.json({
//                ResponseCode: 200,
//                url: result.url
//                })
//            }
//        });
//    },

    
    
    // api to find user is targeted or not
    "targetedOrNottargeted": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        var userId = req.body.userId;
        var adId = req.body.adId;
        createNewAds.findOne({ _id: req.body.adId }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 302, responseMessage: "Internal server error." }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "Please enter correct adId." }); } else if (result.winners.length != 0) { res.send({ responseCode: 406, responseMessage: i18n.__("Winner allready decided") }); } else {
                //    console.log("city-- 222>>>", result)
                User.findOne({ _id: userId }).exec(function(err, result1) {
                    if (err) { res.send({ responseCode: 302, responseMessage: "Internal server error." }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: "Please enter correct adId." }); } else {
                        var age = result1.dob;

                        function _calculateAge(birthday) { // birthday is a date
                            var ageDifMs = Date.now() - birthday.getTime();
                            var ageDate = new Date(ageDifMs); // miliseconds from epoch
                            return Math.abs(ageDate.getUTCFullYear() - 1970);
                        }
                        var myAge = _calculateAge(new Date(age))
                        console.log("myAge-->", myAge)

                        if (result.gender != 'Both') {
                            if (result.gender != result1.gender) { { res.send({ responseCode: 400, responseMessage: i18n.__('Sorry, you are not from the targeted users which have been set by the advertiser, so you can’t join the raffle of this ad') }); }
                            } else {
                                if (myAge < result.ageFrom) { res.send({ responseCode: 400, responseMessage: i18n.__('Sorry, you are not from the targeted users which have been set by the advertiser, so you can’t join the raffle of this ad') }); } else if (myAge > result.ageTo) { res.send({ responseCode: 400, responseMessage: i18n.__('Sorry, you are not from the targeted users which have been set by the advertiser, so you can’t join the raffle of this ad') }); } else {
                                    var country = result.whoWillSeeYourAdd.country;
                                    // var state = result.whoWillSeeYourAdd.state;
                                    var city = result.whoWillSeeYourAdd.city;
                                    console.log("city-->>>", city)
                                    if (result1.country != country) { res.send({ responseCode: 400, responseMessage: i18n.__('Sorry, you are not from the targeted users which have been set by the advertiser, so you can’t join the raffle of this ad') }); } else {
                                        console.log("city- 111->>>", city)
                                        if (city == null || city == undefined || city == '') { res.send({ result: result, responseCode: 200, responseMessage: 'You can watch this add' }) } else if (result1.city != city) { res.send({ responseCode: 400, responseMessage: i18n.__('Sorry, you are not from the targeted users which have been set by the advertiser, so you can’t join the raffle of this ad') }); } else {
                                            res.send({ responseCode: 200, responseMessage: 'You can watch this add' })
                                        }
                                    }
                                }
                            }
                        } else {
                            if (myAge < result.ageFrom) { res.send({ responseCode: 400, responseMessage: i18n.__('Sorry, you are not from the targeted users which have been set by the advertiser, so you can’t join the raffle of this ad') }); } else if (myAge > result.ageTo) { res.send({ responseCode: 400, responseMessage: i18n.__('Sorry, you are not from the targeted users which have been set by the advertiser, so you can’t join the raffle of this ad') }); } else {
                                var country = result.whoWillSeeYourAdd.country;
                                var state = result.whoWillSeeYourAdd.state;
                                var city = result.whoWillSeeYourAdd.city;

                                if (result1.country != country) { res.send({ responseCode: 400, responseMessage: i18n.__('Sorry, you are not from the targeted users which have been set by the advertiser, so you can’t join the raffle of this ad') }); } else {
                                    console.log("city- 111->>>", city)
                                    if (city == null || city == undefined || city == '') { res.send({ responseCode: 200, responseMessage: 'You can watch this add' }) } else if (result1.city != city) { res.send({ responseCode: 400, responseMessage: i18n.__('Sorry, you are not from the targeted users which have been set by the advertiser, so you can’t join the raffle of this ad') }); } else {
                                        res.send({ result: result, responseCode: 200, responseMessage: 'You can watch this add' })
                                    }
                                }
                            }
                        }
                    }
                })
            }
        })
    },


    // view ad in app
    "viewAd": function(req, res) { //req.body.userId, adId
        i18n = new i18n_module(req.body.lang, configs.langFile);
        waterfall([
            function(callback) {
                var userId = req.body.userId;
                var adId = req.body.adId;
                createNewAds.findOne({ _id: req.body.adId }).exec(function(err, adResult) {
                    if (err) { res.send({ responseCode: 302, responseMessage: "Internal server error." }); } else if (!adResult) { res.send({ responseCode: 404, responseMessage: "Please enter correct adId." }); } else if (adResult.winners.length != 0) { res.send({ responseCode: 406, responseMessage: i18n.__("Winner allready decided") }); } else {
                        if (adResult.adsType == 'cash') { // brolixPerUpgradedCashAds
                            if (adResult.cash > 0) {
                                var type = "brolixPerUpgradedCashAds";
                            } else {
                                var type = "brolixPerFreeCashAds";
                            }
                        } else if (adResult.adsType == 'coupon') {
                            if (adResult.cash > 0) {
                                var type = "brolixPerUpgradedCashAds";
                            } else {
                                var type = "brolixPerFreeCouponAds";
                            }
                        }
                        console.log("type-->>", type)
                        brolixAndDollors.findOne({
                            type: type
                        }, function(err, result) {
                            var value = result.value
                            callback(null, value)
                        })
                    }
                })
            },
            function(value, callback) {
                console.log("value--->>>", value)
                var userId = req.body.userId;
                var adId = req.body.adId;
                createNewAds.findOne({ _id: req.body.adId }, function(err, result) {
                    if (err) { res.send({ responseCode: 302, responseMessage: "Internal server error." }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "Please enter correct adId." }); } else {
                        var randomIndex = [];
                        // var winnersArray = [];
                        var raffleCount = result.raffleCount;
                        var viewerLenght = result.viewerLenght;
                        var luckUsers = result.luckCardListObject;
                        var numberOfWinners = result.numberOfWinners;

                        var mySet = new Set(raffleCount);
                        var has = mySet.has(userId)
                        console.log("in raffleCount--1111-->>>", raffleCount)
                        if (has) { res.send({ responseCode: 302, responseMessage: i18n.__("You have already join the raffle") }) }
                        // else if (!has) raffleCount.push(userId);
                        else if (!has) {
                            console.log("in else if")
                            raffleCount.push(userId);
                            User.findOneAndUpdate({ _id: req.body.userId }, { $inc: { brolix: value, brolixAds: value } }, { new: true }, function(err, result1) {
                                console.log("raffleCount--->>>" + raffleCount.length);
                            })
                            if (raffleCount.length == viewerLenght) {
                                console.log("in if")
                                createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $push: { raffleCount: req.body.userId, NontargetedCount: req.body.userId } }, function(err, success) {
                                    //  console.log("success--->>>", success)
                                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error  11." }); } else {
                                        var winnerCount = success.numberOfWinners;
                                        var pageId = success.pageId;
                                    }
                                })
                                for (var n = 0; n < luckUsers.length; n++) {
                                    for (var m = 0; m < luckUsers[n].chances; m++) {
                                        raffleCount.push(luckUsers[n].userId)
                                    }
                                }
                                var finalValue = [];
                                if (finalValue.length != numberOfWinners) {
                                    var i = finalValue.length;
                                    while (i < numberOfWinners) {
                                        var index = Math.floor(Math.random() * raffleCount.length);
                                        var flag = finalValue.indexOf(raffleCount[index])
                                        if (flag == -1) {
                                            finalValue.push(raffleCount[index])
                                            i++;
                                        }
                                    }
                                }
                                callback(null, finalValue, result.cashAdPrize, result.couponCode, result.hiddenGifts)
                            } else {

                                createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $push: { raffleCount: req.body.userId, NontargetedCount: req.body.userId } }, function(err, success) {
                                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error 22." }); } else {
                                        res.send({
                                            responseCode: 200,
                                            responseMessage: i18n.__("You have successfully join the raffle")
                                        })
                                    }
                                });
                            }
                        }
                    }
                })
            },
            function(winners, cashPrize, couponCode, hiddenGifts, callback) {
                createNewAds.update({ _id: req.body.adId }, { $push: { winners: { $each: winners } } }).lean().exec(function(err, result) {
                    if (err) { res.send({ responseCode: 302, responseMessage: "Something went wrongsssssss." }); } else {
                        var date = new Date();

                        createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $set: { 'status': "EXPIRED", updatedAt: date, adExpired: true } }, function(err, result3) {
                            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error  33." }); } else {
                                var pageId = result3.pageId;
                                createNewPage.findByIdAndUpdate({ _id: pageId }, { $push: { winnersCount: { $each: winners } } }, { new: true }).exec(function(err, result2) {
                                    //    console.log("result2-->", result2)
                                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 88' }); } else {
                                        console.log("in else")
                                        if (result3.adsType == "cash") {
                                            var pageId = result3.pageId;
                                            var data = {
                                                cash: cashPrize,
                                                adId: req.body.adId,
                                                pageId: pageId
                                            }
                                            var notificationData = {
                                                adId: req.body.adId,
                                                type: i18n.__('You have successfully won this raffle'),
                                                linkType: 'profile',
                                                notificationType: 'WinnerType'
                                            }
                                            User.update({ _id: { $in: winners } }, { $push: { cashPrize: data, notification: notificationData, gifts: req.body.adId }, $inc: { cash: cashPrize } }, { multi: true }, function(err, result) {
                                                if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error  44." }); } else {
                                                    if (result.deviceToken && result.deviceType && result.notification_status && result.status) {
                                                        var message = i18n.__("You have successfully won this Raffle.");
                                                        if (result.deviceType == 'Android' && result.notification_status == 'on' && result.status == 'ACTIVE') {
                                                            functions.android_notification(result.deviceToken, message);
                                                            console.log("Android notification send!!!!")
                                                        } else if (result.deviceType == 'iOS' && result.notification_status == 'on' && result.status == 'ACTIVE') {
                                                            functions.iOS_notification(result.deviceToken, message);
                                                        } else {
                                                            console.log("Something wrong!!!!")
                                                        }
                                                    }
                                                    res.send({
                                                        responseCode: 200,
                                                        responseMessage: i18n.__("Raffle is over winner decided")
                                                        //result: result 
                                                    })
                                                }
                                            })

                                        } else {
                                            var startTime = new Date().toUTCString();
                                            var h = new Date(new Date(startTime).setHours(00)).toUTCString();
                                            var m = new Date(new Date(h).setMinutes(00)).toUTCString();
                                            var s = Date.now(m)
                                            var pageId = result3.pageId;
                                            var coupanAge = result3.couponExpiryDate;
                                            var actualTime = parseInt(s) + parseInt(coupanAge);
                                            console.log("coupanAge--->>", coupanAge)
                                            var neverExpireTime = parseInt(s) + parseInt(2125651954361);
                                            console.log("coupanAge--->>", coupanAge)
                                            console.log("neverExpireTime--->>", neverExpireTime)
                                            if (coupanAge == 'NEVER') {
                                                console.log("if")
                                                var data = {
                                                    couponCode: couponCode,
                                                    adId: req.body.adId,
                                                    pageId: pageId,
                                                    type: "WINNER",
                                                    couponExpire: "NEVER",
                                                    expirationTime: neverExpireTime
                                                }
                                            } else {
                                                console.log("else")
                                                var data = {
                                                    couponCode: couponCode,
                                                    expirationTime: actualTime,
                                                    adId: req.body.adId,
                                                    pageId: pageId,
                                                    type: "WINNER",
                                                    couponExpire: "YES"
                                                }
                                            }
                                            console.log("data---->>>>", data)
                                            if (hiddenGifts.length != 0) {
                                                console.log("if")
                                                var hiddenCode = hiddenGifts;
                                                var count = 0;
                                                for (var i = 0; i < hiddenCode.length; i++) {
                                                    var data1 = {
                                                        hiddenCode: hiddenCode[i],
                                                        adId: req.body.adId,
                                                        pageId: pageId
                                                    }
                                                    var notifyData = {
                                                        adId: req.body.adId,
                                                        type: i18n.__('You have successfully won this raffle'),
                                                        linkType: 'profile',
                                                        notificationType: 'WinnerType'
                                                    }
                                                    User.update({ _id: { $in: winners[i] } }, { $push: { coupon: data, notification: notifyData, hiddenGifts: data1, gifts: req.body.adId } }, { multi: true }, function(err, result) {
                                                        console.log("4")
                                                        if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error  55." }); } else {
                                                            count += i;
                                                            if ((i * i) == count) {
                                                                if (result.deviceToken && result.deviceType && result.notification_status && result.status) {
                                                                    var message = i18n.__("You have successfully won this Raffle.");
                                                                    if (result.deviceType == 'Android' && result.notification_status == 'on' && result.status == 'ACTIVE') {
                                                                        functions.android_notification(result.deviceToken, message);
                                                                        console.log("Android notification send!!!!")
                                                                    } else if (result.deviceType == 'iOS' && result.notification_status == 'on' && result.status == 'ACTIVE') {
                                                                        functions.iOS_notification(result.deviceToken, message);
                                                                    } else {
                                                                        console.log("Something wrong!!!!")
                                                                    }
                                                                }
                                                                res.send({
                                                                    responseCode: 200,
                                                                    responseMessage: i18n.__("Raffle is over winner decided")
                                                                    //result: result
                                                                })
                                                            }
                                                        }
                                                    })
                                                }

                                            } else {
                                                console.log("else")
                                                var notifyData = {
                                                    adId: req.body.adId,
                                                    type: i18n.__('You have successfully won this raffle'),
                                                    linkType: 'profile',
                                                    notificationType: 'WinnerType'
                                                }
                                                User.update({ _id: { $in: winners } }, { $push: { coupon: data, notification: notifyData, gifts: req.body.adId } }, { multi: true }, function(err, result) {
                                                    console.log("4")
                                                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error  55." }); } else {
                                                        if (result.deviceToken && result.deviceType && result.notification_status && result.status) {
                                                            var message = i18n.__("You have successfully won this Raffle.");
                                                            if (result.deviceToken && result.deviceType == 'Android' && result.notification_status == 'on' && result.status == 'ACTIVE') {
                                                                functions.android_notification(result.deviceToken, message);
                                                                console.log("Android notification send!!!!")
                                                            } else if (result.deviceType == 'iOS' && result.notification_status == 'on' && result.status == 'ACTIVE') {
                                                                functions.iOS_notification(result.deviceToken, message);
                                                            } else {
                                                                console.log("Something wrong!!!!")
                                                            }
                                                        }
                                                        res.send({
                                                            responseCode: 200,
                                                            responseMessage: i18n.__("Raffle is over winner decided")
                                                            //result: result
                                                        })
                                                    }
                                                })
                                            }
                                        }
                                    }
                                })
                            }
                        });
                    }
                })
            }
        ])
    },

    // api for continue watch ad
    "continueAd": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        createNewAds.findOne({ _id: req.body.adId }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 302, responseMessage: "Internal server error." }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "Please enter correct adId." }); } else {
                var flag = result.NontargetedCount.indexOf(req.body.userId)
                console.log(flag)
                if (flag == -1) {
                    console.log("flag")
                    createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $push: { NontargetedCount: req.body.userId } }, function(err, success) {
                        if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error  11." }); } else {
                            res.send({ responseCode: 200, responseMessage: i18n.__("Watched Ad") })
                        }
                    })

                } else {
                    console.log("non flag")
                    res.send({ responseCode: 200, responseMessage: i18n.__("Watched Ad") })
                }
            }
        })
    },

    // for all are winners condition 
    "allAreWinners": function(req, res) { //req.body.userId, adId
        console.log("all are winners--->>>", req.body)
        var userId = req.body.userId;
        i18n = new i18n_module(req.body.lang, configs.langFile);
        waterfall([
            function(callback) {
                createNewAds.findOne({ _id: req.body.adId }).exec(function(err, result) {
                    if (err) { res.send({ responseCode: 302, responseMessage: "Internal server error." }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "Please enter correct adId." }); } else {
                        User.findOne({ _id: userId }).exec(function(err, result1) {
                            if (err) { res.send({ responseCode: 302, responseMessage: "Internal server error." }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: "Please enter correct adId." }); } else {
                                var age = result1.dob;

                                function _calculateAge(birthday) { // birthday is a date
                                    var ageDifMs = Date.now() - birthday.getTime();
                                    var ageDate = new Date(ageDifMs); // miliseconds from epoch
                                    return Math.abs(ageDate.getUTCFullYear() - 1970);
                                }
                                var myAge = _calculateAge(new Date(age))
                                console.log("myAge-->", myAge)

                                if (result.gender != 'Both') {
                                    if (result.gender != result1.gender) { { res.send({ responseCode: 400, responseMessage: i18n.__('Sorry, you are not from the targeted users which have been set by the advertiser, so you can’t watch this ad') }); }
                                    } else {
                                        if (myAge < result.ageFrom) { res.send({ responseCode: 400, responseMessage: i18n.__('YSorry, you are not from the targeted users which have been set by the advertiser') }); } else if (myAge > result.ageTo) { res.send({ responseCode: 400, responseMessage: i18n.__('Sorry, you are not from the targeted users which have been set by the advertiser, so you can’t watch this ad') }); } else {
                                            var country = result.whoWillSeeYourAdd.country;
                                            // var state = result.whoWillSeeYourAdd.state;
                                            var city = result.whoWillSeeYourAdd.city;

                                            if (result1.country != country) { res.send({ responseCode: 400, responseMessage: i18n.__('Sorry, you are not from the targeted users which have been set by the advertiser, so you can’t watch this ad') }); } else {
                                                console.log("city- 111->>>", city)
                                                if (city == null || city == undefined || city == '') { callback(null, result) } else if (result1.city != city) { res.send({ responseCode: 400, responseMessage: i18n.__('Sorry, you are not from the targeted users which have been set by the advertiser, so you can’t watch this ad') }); } else {
                                                    callback(null, result)
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    if (myAge < result.ageFrom) { res.send({ responseCode: 400, responseMessage: i18n.__('Sorry, you are not from the targeted users which have been set by the advertiser') }); } else if (myAge > result.ageTo) { res.send({ responseCode: 400, responseMessage: i18n.__('Sorry, you are not from the targeted users which have been set by the advertiser, so you can’t watch this ad') }); } else {
                                        var country = result.whoWillSeeYourAdd.country;
                                        var state = result.whoWillSeeYourAdd.state;
                                        var city = result.whoWillSeeYourAdd.city;

                                        if (result1.country != country) { res.send({ responseCode: 400, responseMessage: i18n.__('Sorry, you are not from the targeted users which have been set by the advertiser, so you can’t watch this ad') }); } else {
                                            console.log("city- 111->>>", city)
                                            if (city == null || city == undefined || city == '') { callback(null, result) } else if (result1.city != city) { res.send({ responseCode: 400, responseMessage: i18n.__('Sorry, you are not from the targeted users which have been set by the advertiser, so you can’t watch this ad') }); } else {
                                                callback(null, result)
                                            }
                                        }
                                    }
                                }
                            }
                        })
                    }
                })
            },
            function(adResult, callback) {
                if (adResult.adsType == 'cash') { // brolixPerUpgradedCashAds
                    if (adResult.cash > 0) {
                        var type = "brolixPerUpgradedCashAds";
                    } else {
                        var type = "brolixPerFreeCashAds";
                    }
                } else if (adResult.adsType == 'coupon') {
                    if (adResult.cash > 0) {
                        var type = "brolixPerUpgradedCashAds";
                    } else {
                        var type = "brolixPerFreeCouponAds";
                    }
                }
                console.log("type-->>", type)
                brolixAndDollors.findOne({
                    type: type
                }, function(err, result) {
                    var value = result.value
                    callback(null, value)
                })
            },
            function(value, callback) {
                var userId = req.body.userId;
                var adId = req.body.adId
                createNewAds.findOne({ _id: req.body.adId }, function(err, result) {
                    if (err) { res.send({ responseCode: 302, responseMessage: "Internal server error." }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "Please enter correct adId." }); } else {
                        var randomIndex = [];
                        var raffleCount = result.raffleCount;
                        var viewerLenght = result.viewerLenght;
                        var numberOfWinners = result.numberOfWinners;
                        var mySet = new Set(raffleCount);
                        var has = mySet.has(userId)
                        if (has) { res.send({ responseCode: 302, responseMessage: i18n.__("You have already win this raffle") }) }
                        // else if (!has) raffleCount.push(userId);
                        else if (!has) {
                            raffleCount.push(userId);
                            User.findOneAndUpdate({ _id: req.body.userId }, { $inc: { brolix: value, brolixAds: value } }, { new: true }, function(err, result1) {})
                            if (raffleCount.length != viewerLenght) {
                                createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $push: { raffleCount: req.body.userId, NontargetedCount: req.body.userId } }, function(err, success) {
                                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error  11." }); } else {
                                        var pageId = success.pageId;
                                    }
                                })
                                callback(null, result.cashAdPrize, result.couponCode, result.hiddenGifts)
                            } else {
                                console.log("in raffle else")
                                createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $push: { raffleCount: req.body.userId, NontargetedCount: req.body.userId }, $set: { 'status': "EXPIRED", adExpired: true } }, function(err, success) {
                                    console.log("result------00000000000--->>>>", success)
                                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error 22." }); } else {
                                        res.send({
                                            responseCode: 200,
                                            responseMessage: i18n.__("You have successfully win this raffle")
                                        })
                                    }
                                });
                                callback(null, result.cashAdPrize, result.couponCode, result.hiddenGifts)
                            }
                        }
                    }
                })
            },
            function(cashPrize, couponCode, hiddenGifts, callback) {
                console.log("cashPrize-0-111-->>", cashPrize)
                console.log("couponCode--111-->>", couponCode)
                console.log("hiddenGifts--111-->>", hiddenGifts)
                createNewAds.update({ _id: req.body.adId }, { $push: { winners: req.body.userId } }).lean().exec(function(err, result) {
                    if (err) { res.send({ responseCode: 302, responseMessage: "Something went wrongsssssss." }); } else {
                        var date = new Date();
                        createNewAds.findOne({ _id: req.body.adId }, function(err, result3) {
                            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error  33." }); } else {
                                var pageId = result3.pageId;
                                console.log("all winners pageId-->>", pageId)
                                createNewPage.findByIdAndUpdate({ _id: pageId }, { $push: { winnersCount: req.body.userId } }, { new: true }).exec(function(err, result2) {
                                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error  33." }); } else {

                                        console.log("result3-->>", result3)
                                        var winner = result3.winners.length;
                                        if (result3.adsType == "cash") {
                                            var pageId = result3.pageId;
                                            var data = {
                                                cash: cashPrize,
                                                adId: req.body.adId,
                                                pageId: pageId
                                            }
                                            var notifydata = {
                                                adId: req.body.adId,
                                                type: 'You have successfully won this raffle',
                                                linkType: 'profile',
                                                notificationType: 'WinnerType'
                                            }
                                            console.log("cash---data--->>>", data)
                                            // { $push: { coupon: data, notification: notifyData, gifts: req.body.adId } }
                                            User.findOneAndUpdate({ _id: req.body.userId }, { $push: { cashPrize: data, gifts: req.body.adId, notification: notifydata }, $inc: { cash: cashPrize } }, { multi: true }, function(err, result) {
                                                console.log("result-->>", result)
                                                if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error  44." }); } else {
                                                    if (result.deviceToken && result.deviceType && result.notification_status && result.status) {
                                                        var message = "You have successfully won this Raffle.";
                                                        if (result.deviceType == 'Android' && result.notification_status == 'on' && result.status == 'ACTIVE') {
                                                            functions.android_notification(result.deviceToken, message);
                                                            console.log("Android notification send!!!!")
                                                        } else if (result.deviceType == 'iOS' && result.notification_status == 'on' && result.status == 'ACTIVE') {
                                                            functions.iOS_notification(result.deviceToken, message);
                                                        } else {
                                                            console.log("Something wrong!!!!")
                                                        }
                                                    }
                                                    res.send({
                                                        responseCode: 200,
                                                        responseMessage: i18n.__("Raffle is over")
                                                        //result: result 

                                                    })
                                                }
                                            })

                                        } else {
                                            var startTime = new Date().toUTCString();
                                            var h = new Date(new Date(startTime).setHours(00)).toUTCString();
                                            var m = new Date(new Date(h).setMinutes(00)).toUTCString();
                                            var s = Date.now(m)
                                            var pageId = result3.pageId;
                                            var coupanAge = result3.couponExpiryDate;
                                            var actualTime = parseInt(s) + parseInt(coupanAge);
                                            console.log("coupanAge--->>", coupanAge)
                                            var neverExpireTime = parseInt(s) + parseInt(2125651954361);
                                            console.log("coupanAge--->>", coupanAge)
                                            console.log("neverExpireTime--->>", neverExpireTime)
                                            if (coupanAge == 'NEVER') {
                                                console.log("if")
                                                var data = {
                                                    couponCode: couponCode,
                                                    adId: req.body.adId,
                                                    pageId: pageId,
                                                    type: "WINNER",
                                                    couponExpire: "NEVER",
                                                    expirationTime: neverExpireTime
                                                }
                                            } else {
                                                console.log("else")
                                                var data = {
                                                    couponCode: couponCode,
                                                    expirationTime: actualTime,
                                                    adId: req.body.adId,
                                                    pageId: pageId,
                                                    type: "WINNER",
                                                    couponExpire: "YES"
                                                }
                                            }
                                            console.log("data---->>>>", data)
                                            if (hiddenGifts.length != 0) {
                                                console.log("if")
                                                var hiddenCode = hiddenGifts;
                                                var count = 0;
                                                var data1 = {
                                                    hiddenCode: hiddenCode[winner - 1],
                                                    adId: req.body.adId,
                                                    pageId: pageId
                                                }

                                                var notifydata = {
                                                    adId: req.body.adId,
                                                    type: 'You have successfully won this raffle',
                                                    linkType: 'profile',
                                                    notificationType: 'WinnerType'
                                                }
                                                User.update({ _id: req.body.userId }, { $push: { coupon: data, hiddenGifts: data1, gifts: req.body.adId, notification: notifydata } }, { multi: true }, function(err, result) {
                                                    console.log("4")
                                                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error  55." }); } else {
                                                        if (result.deviceToken && result.deviceType && result.notification_status && result.status) {
                                                            var message = "You have successfully won this Raffle.";
                                                            if (result.deviceType == 'Android' && result.notification_status == 'on' && result.status == 'ACTIVE') {
                                                                functions.android_notification(result.deviceToken, message);
                                                                console.log("Android notification send!!!!")
                                                            } else if (result.deviceType == 'iOS' && result.notification_status == 'on' && result.status == 'ACTIVE') {
                                                                functions.iOS_notification(result.deviceToken, message);
                                                            } else {
                                                                console.log("Something wrong!!!!")
                                                            }
                                                        }
                                                        res.send({
                                                            responseCode: 200,
                                                            responseMessage: i18n.__("Raffle is over")
                                                            //result: result
                                                        })
                                                    }
                                                })
                                            } else {
                                                console.log("else")
                                                var notifyData = {
                                                    adId: req.body.adId,
                                                    type: 'You have successfully won this raffle',
                                                    linkType: 'profile',
                                                    notificationType: 'WinnerType'
                                                }
                                                User.update({ _id: req.body.userId }, { $push: { coupon: data, notification: notifyData, gifts: req.body.adId } }, { multi: true }, function(err, result) {
                                                    console.log("4")
                                                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error  55." }); } else {
                                                        if (result.deviceToken && result.deviceType && result.notification_status && result.status) {
                                                            var message = "You have successfully won this Raffle.";
                                                            if (result.deviceType == 'Android' && result.notification_status == 'on' && result.status == 'ACTIVE') {
                                                                functions.android_notification(result.deviceToken, message);
                                                                console.log("Android notification send!!!!")
                                                            } else if (result.deviceType == 'iOS' && result.notification_status == 'on' && result.status == 'ACTIVE') {
                                                                functions.iOS_notification(result.deviceToken, message);
                                                            } else {
                                                                console.log("Something wrong!!!!")
                                                            }
                                                        }
                                                        res.send({
                                                            responseCode: 200,
                                                            responseMessage: i18n.__("Raffle is over winner decided")
                                                            //result: result
                                                        })
                                                    }
                                                })
                                            }
                                        }
                                    }
                                })
                            }
                        })
                    }
                })
            }
        ])
    },


    //API for Follow and unfollow
    "adFollowUnfollow": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        if (req.body.follow == "follow") {
            createNewAds.findOne({ _id: req.body.adId }).exec(function(err, result) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) { res.semd({ responseCode: 404, responseMessage: 'Please enter correct adId' }); } else {
                    var pageId = result.pageId;
                    var pageName = result.pageName;
                    console.log(" pageId---->>>", pageId)
                    var adFollowers = result.adFollowers;
                    var mySet = new Set(adFollowers);
                    var has = mySet.has(req.body.userId)
                    if (has) { res.send({ responseCode: 400, responseMessage: i18n.__('You are already following this ad') }); } else {
                        console.log("in else ad follow")
                        createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $push: { "adFollowers": req.body.userId } }, { new: true }).exec(function(err, adResults) {
                            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                                PageFollowers.findOne({ userId: req.body.userId, pageId: pageId }).exec(function(err, result1) {
                                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                                        if (!result1) {
                                            console.log("in if")
                                            var obj = {
                                                pageId: pageId,
                                                pageName: pageName,
                                                userId: req.body.userId,
                                                followStatus: req.body.follow

                                            }
                                            var follow = new PageFollowers(obj);
                                            follow.save(function(err, result) {
                                                User.findOneAndUpdate({ _id: req.body.userId }, { $push: { "pageFollowers": { pageId: pageId, pageName: pageName } } }, { new: true }).exec(function(err, results) {
                                                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                                                        createNewPage.findOneAndUpdate({ _id: pageId }, { $push: { "pageFollowersUser": { userId: req.body.userId } } }, { new: true }).exec(function(err, result1) {
                                                            res.send({
                                                                result: adResults,
                                                                responseCode: 200,
                                                                responseMessage: i18n.__("Followed")
                                                            });
                                                        })
                                                    }
                                                })
                                            })
                                        } else {
                                            console.log("in else")
                                            console.log("result1.followStatus--->>", result1.followStatus)
                                            if (result1.followStatus == "unfollow" || result1.followStatus == "unblock") {
                                                PageFollowers.findOneAndUpdate({ _id: result1._id }, { $set: { followStatus: "follow", userId: req.body.userId, pageId: pageId } }, { new: true }).exec(function(err, result2) {
                                                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                                                        createNewAds.findOne({ _id: req.body.adId }).exec(function(err, adResult) {
                                                            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!adResult) { res.semd({ responseCode: 404, responseMessage: 'Please enter correct adId' }); } else {
                                                                console.log(" result--adFollowUnfollow-->>>", adResult)
                                                                var pageId = adResult.pageId;
                                                                var pageName = adResult.pageName;

                                                                User.findOneAndUpdate({ _id: req.body.userId }, { $push: { "pageFollowers": { pageId: pageId, pageName: pageName } } }, { new: true }).exec(function(err, results) {
                                                                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                                                                        createNewPage.findOneAndUpdate({ _id: req.body.pageId }, { $push: { "pageFollowersUser": { userId: req.body.userId } } }, { new: true }).exec(function(err, result1) {
                                                                            res.send({
                                                                                result: result2,
                                                                                responseCode: 200,
                                                                                responseMessage: i18n.__("Followed")
                                                                            });
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                        })
                                                        //                                                        res.send({
                                                        //                                                            result: adResults,
                                                        //                                                            responseCode: 200,
                                                        //                                                            responseMessage: "Followed."
                                                        //                                                        });
                                                    }
                                                })
                                            } else if (result1.followStatus == "block") {
                                                res.send({
                                                    result: adResults,
                                                    responseCode: 200,
                                                    responseMessage: i18n.__("Followed")
                                                });
                                            } else {
                                                res.send({
                                                    result: adResults,
                                                    responseCode: 200,
                                                    responseMessage: i18n.__("Followed")
                                                });
                                            }
                                        }
                                    }
                                })
                            }
                        })
                    }
                }
            })
        } else {
            createNewAds.findOne({ _id: req.body.adId }).exec(function(err, result) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) { res.semd({ responseCode: 404, responseMessage: 'Please enter correct adId' }); } else {
                    var pageId = result.pageId;
                    var pageName = result.pageName;
                    var adFollowers = result.adFollowers;
                    var mySet = new Set(adFollowers);
                    var has = mySet.has(req.body.userId)
                    if (!has) { res.send({ responseCode: 400, responseMessage: i18n.__('You have already Unfollow this ad') }); } else {
                        createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $pop: { "adFollowers": -req.body.userId } }, { new: true }).exec(function(err, adResults) {
                            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!adResults) { res.send({ responseCode: 404, responseMessage: 'Please enter correct adId' }); } else {
                                PageFollowers.findOneAndUpdate({ $and: [{ userId: req.body.userId }, { pageId: pageId }] }, { $set: { followStatus: "unfollow" } }, { new: true }).exec(function(err, result) {
                                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                                        User.findOneAndUpdate({ _id: req.body.userId }, { $pull: { pageFollowers: { pageId: pageId } } }, { new: true }).exec(function(err, result1) {
                                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 11' }) } else if (!result1) { res.send({ responseCode: 404, responseMessage: "No user found" }); } else {
                                                createNewPage.findOneAndUpdate({ _id: pageId }, { $pull: { pageFollowersUser: { userId: req.body.userId } } }, { new: true }).exec(function(err, result2) {
                                                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 11' }) } else if (!result2) { res.send({ responseCode: 404, responseMessage: "No page found" }); } else {
                                                        Views.findOneAndUpdate({ $and: [{ userId: req.body.userId }, { adId: req.body.adId }] }, {
                                                            $set: { userId: '', AdFollowers: 0 }
                                                        }, { new: true }, function(err, ress) {
                                                            res.send({
                                                                result: adResults,
                                                                responseCode: 200,
                                                                responseMessage: i18n.__("Unfollowed")
                                                            });
                                                        })

                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                }
            })
        }
    },

    // show all coupon winners list api
    "couponWinners": function(req, res) {
        console.log("couponWinners--->>>", JSON.stringify(req.body))
        i18n = new i18n_module(req.params.lang, configs.langFile);
        var pageNumber = Number(req.params.pageNumber)
        var limitData = pageNumber * 8;
        var skips = limitData - 8;
        var page = String(pageNumber);
        var userId = req.params.id;
        
        User.findOne({_id:req.params.id}).exec(function(err, userResultt) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
            else{
                
            var userCountry = userResultt.country;
        
        User.find({ $or: [{ 'type': 'USER' }, { 'type': 'Advertiser' }], status: 'ACTIVE', isVerified: "TRUE" }).lean().exec(function(err, userResult1) {
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
                User.aggregate({ $unwind: "$coupon" }, { $match: { 'coupon.type': 'WINNER', _id: { $nin: blockedArray }, country:userCountry } }).exec(function(err, result) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 11' }); } else if (result.length == 0) { res.send({ responseCode: 500, responseMessage: "No coupon winner found" }); } else {
                        var count = 0;
                        for (i = 0; i < result.length; i++) {
                            count++;
                        }
                        var pages = Math.ceil(count / 8);
                        User.aggregate({ $unwind: "$coupon" }, { $match: { 'coupon.type': 'WINNER', _id: { $nin: blockedArray }, country:userCountry } }, { $sort: { 'coupon.createddAt': -1 } }, { $limit: limitData }, { $skip: skips }).exec(function(err, result1) {
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 22' }); } else if (result1.length == 0) { res.send({ responseCode: 400, responseMessage: "No coupon winner found" }); } else {
                                User.populate(result1, {
                                    path: 'coupon.adId',
                                    model: 'createNewAds'
                                }, function(err, result2) {
                                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 33' }); } else {
                                        User.populate(result1, {
                                            path: 'coupon.pageId',
                                            model: 'createNewPage',
                                            select: 'pageName adAdmin'
                                        }, function(err, result3) {
                                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 33' }); } else {

                                                //                                                var sortArray = result2.sort(function(obj1, obj2) {
                                                //                                                 return obj2.coupon.createddAt - obj1.coupon.createddAt
                                                //                                             })

                                                //   console.log("couponWinners------->>>>",JSON.stringify(result2))
                                                //    console.log("couponWinners------->>>>",JSON.stringify(result2))
                                                res.send({
                                                    docs: result2,
                                                    count: count,
                                                    limit: limitData,
                                                    page: page,
                                                    pages: pages,
                                                    responseCode: 200,
                                                    responseMessage: i18n.__("Each coupon winner has successfully shown")
                                                })
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
        }
        })
    },

    // coupon winners date filter api
    "couponWinnersDateFilter": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        if (!req.body.startDate && !req.body.endDate) { res.send({ responseCode: 400, responseMessage: 'Please enter atleast start date or end date' }); } else {
            var pageNumber = Number(req.params.pageNumber)
            var limitData = pageNumber * 8;
            var skips = limitData - 8;
            var page = String(pageNumber);

            var startDateKey = '';
            var endDateKey = '';
            var tempCond = {};
            var tempEndDate = {};
            var data;

            var condition = { $or: [] };
            Object.getOwnPropertyNames(req.body).forEach(function(key, idx, array) {
                if (!(req.body[key] == "" || req.body[key] == undefined)) {
                    if (key == 'startDate') {
                        tempCond['$gte'] = new Date(req.body[key]);
                        console.log("startDate--->>>", tempCond)
                    }
                    if (key == 'endDate') {
                        tempEndDate['$lte'] = new Date(req.body[key]);
                        console.log("gte--->>>", tempEndDate)
                    }
                }
                if (tempCond != '' || tempEndDate != '') {
                    data = Object.assign(tempCond, tempEndDate)
                }
            });
            console.log("startDate", tempCond)
            console.log("endDate", tempEndDate)
            console.log("data===>>", data)

            var userId = req.params.id;
            
            User.findOne({_id:req.params.id}).exec(function(err, userResultt) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
            else{
                
            var userCountry = userResultt.country;
            
            User.find({ $or: [{ 'type': 'USER' }, { 'type': 'Advertiser' }], status: 'ACTIVE', isVerified: "TRUE" }).lean().exec(function(err, userResult1) {
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
                    User.aggregate({ $unwind: "$coupon" }, { $match: { 'coupon.type': 'WINNER', 'coupon.updateddAt': data, _id: { $nin: blockedArray }, country:userCountry  } }).exec(function(err, result) {
                        console.log("1")
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 11' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No coupon winner found" }); } else {
                            var count = 0;
                            for (i = 0; i < result.length; i++) {
                                count++;
                            }
                            var pages = Math.ceil(count / 8);
                            User.aggregate({ $unwind: "$coupon" }, { $match: { 'coupon.type': 'WINNER', 'coupon.updateddAt': data, _id: { $nin: blockedArray }, country:userCountry  } }, { $limit: limitData }, { $skip: skips }, { $sort: { 'coupon.updateddAt': -1 } }).exec(function(err, result1) {
                                console.log("2")
                                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 22' }); } else if (result1.length == 0) { res.send({ responseCode: 400, responseMessage: "No coupon winner found" }); } else {
                                    User.populate(result1, {
                                        path: 'coupon.adId',
                                        model: 'createNewAds'
                                    }, function(err, result2) {
                                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 33' }); } else {
                                            res.send({
                                                docs: result2,
                                                count: count,
                                                limit: limitData,
                                                page: page,
                                                pages: pages,
                                                responseCode: 200,
                                                responseMessage: i18n.__("Each coupon winner has successfully shown")
                                            })
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
        }
    },

    // cash winners filter api
    "cashWinnersDateFilter": function(req, res) {
        i18n = new i18n_module(req.params.lang, configs.langFile);
        if (!req.body.startDate && !req.body.endDate) { res.send({ responseCode: 400, responseMessage: i18n.__('Please enter atleast start date or end date') }); } else {
            var pageNumber = Number(req.params.pageNumber)
            var limitData = pageNumber * 8;
            var skips = limitData - 8;
            var page = String(pageNumber);

            var startDateKey = '';
            var endDateKey = '';
            var tempCond = {};
            var tempEndDate = {};
            var data;

            var condition = { $or: [] };
            Object.getOwnPropertyNames(req.body).forEach(function(key, idx, array) {
                if (!(req.body[key] == "" || req.body[key] == undefined)) {
                    if (key == 'startDate') {
                        tempCond['$gte'] = new Date(req.body[key]);
                        console.log("startDate--->>>", tempCond)
                    }
                    if (key == 'endDate') {
                        tempEndDate['$lte'] = new Date(req.body[key]);
                        console.log("gte--->>>", tempEndDate)
                    }
                }
                if (tempCond != '' || tempEndDate != '') {
                    data = Object.assign(tempCond, tempEndDate)
                }
            });

            var userId = req.params.id;
            
                User.findOne({_id:req.params.id}).exec(function(err, userResultt) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
            else{                
            var userCountry = userResultt.country;  
            
            User.find({ $or: [{ 'type': 'USER' }, { 'type': 'Advertiser' }], status: 'ACTIVE', isVerified: "TRUE" }).lean().exec(function(err, userResult1) {
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

                    User.aggregate({ $unwind: "$cashPrize" }, { $match: { 'cashPrize.updateddAt': data, _id: { $nin: blockedArray }, country:userCountry } }).exec(function(err, result) {
                        console.log("1")
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 11' }); } else if (result.length == 0) { res.send({ responseCode: 400, responseMessage: "No cash winner found" }); } else {
                            var count = 0;
                            for (i = 0; i < result.length; i++) {
                                count++;
                            }
                            var pages = Math.ceil(count / 8);
                            User.aggregate({ $unwind: "$cashPrize" }, { $match: { 'cashPrize.updateddAt': data, _id: { $nin: blockedArray }, country:userCountry } }, { $limit: limitData }, { $skip: skips }, { $sort: { 'cashPrize.updateddAt': -1 } }).exec(function(err, result1) {
                                console.log("2")
                                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 22' }); } else if (result1.length == 0) { res.send({ responseCode: 400, responseMessage: "No cash winner found" }); } else {
                                    User.populate(result1, {
                                        path: 'cashPrize.adId',
                                        model: 'createNewAds'
                                    }, function(err, result2) {
                                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 33' }); } else {
                                            res.send({
                                                docs: result2,
                                                count: count,
                                                limit: limitData,
                                                page: page,
                                                pages: pages,
                                                responseCode: 200,
                                                responseMessage: i18n.__("All cash winner shown successfully")
                                            })
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
        }
    },


    // list of cash winners api
    "cashWinners": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        var pageNumber = Number(req.params.pageNumber)
        var limitData = pageNumber * 8;
        var skips = limitData - 8;
        var page = String(pageNumber);
        var userId = req.params.id;
        
        User.findOne({_id:req.params.id}).exec(function(err, userResultt) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
            else{                
            var userCountry = userResultt.country;        
        User.find({ $or: [{ 'type': 'USER' }, { 'type': 'Advertiser' }], status: 'ACTIVE', isVerified: "TRUE" }).lean().exec(function(err, userResult1) {
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
                User.aggregate({ $unwind: "$cashPrize" }, { $match: { 'cashPrize.status': 'ACTIVE', _id: { $nin: blockedArray }, country:userCountry } }).exec(function(err, result) {
                    console.log("1")
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 11' }); } else if (result.length == 0) { res.send({ responseCode: 400, responseMessage: "No cash winner found." }); } else {
                        var count = 0;
                        for (i = 0; i < result.length; i++) {
                            count++;
                        }
                        var pages = Math.ceil(count / 8);
                        User.aggregate({ $unwind: "$cashPrize" }, { $match: { 'cashPrize.status': 'ACTIVE', _id: { $nin: blockedArray }, country:userCountry } }, { $limit: limitData }, { $skip: skips }, { $sort: { 'cashPrize.updateddAt': -1 } }).exec(function(err, result1) {
                            console.log("2")
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 22' }); } else if (result1.length == 0) { res.send({ responseCode: 400, responseMessage: "No cash winner found." }); } else {
                                User.populate(result1, {
                                    path: 'cashPrize.adId',
                                    model: 'createNewAds'
                                }, function(err, result2) {
                                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 33' }); } else {
                                        User.populate(result1, {
                                            path: 'cashPrize.pageId',
                                            model: 'createNewPage',
                                            select: 'pageName adAdmin'
                                        }, function(err, result3) {
                                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 33' }); } else {
                                                res.send({
                                                    docs: result2,
                                                    count: count,
                                                    limit: limitData,
                                                    page: page,
                                                    pages: pages,
                                                    responseCode: 200,
                                                    responseMessage: i18n.__("All coupon winner shown successfully")
                                                })
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
         }
        })
    },

    // tag friends on ads api
    "tagOnads": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        waterfall([
            function(callback) {
                var senderId = req.body.senderId;
                createNewAds.findOneAndUpdate({ _id: req.body.adId }, {
                    $push: { "tag": { userId: req.body.userId, senderId: req.body.senderId } }
                }, { new: true }).exec(function(err, results) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                        callback(null, results)
                    }
                })
            },
            function(results, callback) {
                var senderId = req.body.senderId;
                User.findOne({ _id: req.body.userId }).exec(function(err, user) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!user) { res.send({ responseCode: 404, responseMessage: "Please enter correct userId" }); } else {
                        var image = user.image;
                        for (var i = 0; i < senderId.length; i++) {
                            User.findOneAndUpdate({ _id: senderId[i] }, {
                                $push: { notification: { userId: req.body.userId, type: "You are tagged on an ad", linkType: 'profile', adId: req.body.adId, notificationType: 'tagOnAd', image: image } }
                            }, { multi: true }, function(err, result1) {
                                console.log("result1-->>", result1)
                                if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: "Please enter correct senderId" }); } else {
                                    if (result1.deviceToken && result1.deviceType && result1.notification_status && result1.status) {
                                        var message = "You are taged in a ad";
                                        if (result1.deviceType == 'Android' && result1.notification_status == 'on' && result1.status == 'ACTIVE') {

                                            functions.android_notification(result1.deviceToken, message);
                                            console.log("Android notification send!!!!")
                                        } else if (result1.deviceType == 'iOS' && result1.notification_status == 'on' && result1.status == 'ACTIVE') {
                                            functions.iOS_notification(result1.deviceToken, message);
                                        } else {
                                            console.log("Something wrong!!!!")
                                        }
                                    }
                                }
                            });
                        }
                        callback(null, results)
                    }
                })
            },
        ], function(err, result) {
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: i18n.__("Tag save with concerned User details")
            })
        })
    },

    // edit ad api
    "editAd": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        //console.log("edit ad-----*+*+/*+///+*///--->>>",JSON.stringify(req.body))
        createNewAds.update({ _id: req.params.id, $or: [{ userId: req.params.userId }, { 'adAdmin.userId': req.params.userId }] }, req.body, { new: true }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                console.log("result edit ad ---->>>", result)
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: i18n.__("Ad edit successfully")
                });
            }
        });
    },

    // ad filter on date basis
    "adsDateFilter": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        if (!req.body.startDate && !req.body.endDate) { res.send({ responseCode: 400, responseMessage: "Please enter atleast startDate or endDate" }); } else {
            var startDateKey = '';
            var endDateKey = '';
            var tempCond = {};
            var tempEndDate = {};
            var data;
            var type = req.body.type;
            console.log(type)
            var condition = { $or: [] };
            Object.getOwnPropertyNames(req.body).forEach(function(key, idx, array) {
                if (!(req.body[key] == "" || req.body[key] == undefined)) {
                    if (key == 'startDate') {
                        tempCond['$gte'] = req.body[key];
                        console.log("startDate--->>>", tempCond)
                    }
                    if (key == 'endDate') {
                        tempEndDate['$lte'] = req.body[key];
                        console.log("gte--->>>", tempEndDate)
                    }
                }
                if (tempCond != '' || tempEndDate != '') {
                    data = Object.assign(tempCond, tempEndDate)
                }
            });
            console.log("startDate", tempCond)
            console.log("endDate", tempEndDate)
            console.log("dta===>>", data)
            createNewAds.paginate({ pageId: req.params.id, 'createdAt': data, adsType: type, status: 'ACTIVE' }, { page: req.params.pageNumber, limit: 8, sort: { createdAt: -1 } }, function(err, result) {
                if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }) } else if (result.length == 0) { res.send({ responseCode: 400, responseMessage: "No ad found" }) } else {
                    var count = 0;
                    for (var i = 0; i < result.length; i++) {
                        count++;
                    }
                    res.send({
                        result: result,
                        count: count,
                        responseCode: 200,
                        responseMessage: i18n.__("Result shown successfully")
                    })
                }
            })
        }
    },

    // // page's coupon ad filter api
    "particularPageCouponAdsFilter": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        var status = req.body.status;
        createNewAds.find({ pageId: req.body.pageId, adsType: 'coupon' }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error." }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "Please enter correct pageId." }); } else {
                var adsArray = [];
                for (var i = 0; i < result.length; i++) {
                    adsArray.push(result[i]._id)
                }
                createNewAds.paginate({ _id: { $in: adsArray }, status: { $in: status } }, { page: req.params.pageNumber, limit: 8, sort: { createdAt: -1 } }, function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error." }); } else if (result1.length == 0) { res.send({ responseCode: 400, responseMessage: "Please enter correct adId." }); } else {
                        res.send({
                            result: result1,
                            responseCode: 200,
                            responseMessage: i18n.__('Result shown successfully')
                        })
                    }
                })
            }
        })
    },

    // page's cash ad filter api
    "particularPageCashAdsFilter": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        var status = req.body.status;
        createNewAds.find({ pageId: req.body.pageId, adsType: 'cash' }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error." }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "Please enter correct pageId." }); } else {
                var adsArray = [];
                for (var i = 0; i < result.length; i++) {
                    adsArray.push(result[i]._id)
                }
                createNewAds.paginate({ _id: { $in: adsArray }, status: { $in: status } }, { page: req.params.pageNumber, limit: 8, sort: { createdAt: -1 } }, function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error." }); } else if (result1.docs.length == 0) { res.send({ responseCode: 400, responseMessage: "Please enter correct adId." }); } else {
                        res.send({
                            result: result1,
                            responseCode: 200,
                            responseMessage: i18n.__('Result shown successfully')
                        })
                    }
                })
            }
        })
    },

    // coupon filter in app api
    "couponFilter": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        var condition = { $or: [] };
        var obj = req.body;
        Object.getOwnPropertyNames(obj).forEach(function(key, idx, array) {
            if (key == 'cashStatus' || key == 'couponStatus') {
                var cond = { $or: [] };
                if (key == "cashStatus") {
                    for (data in obj[key]) {
                        condition.$or.push({ cashStatus: obj[key][data] })
                    }
                } else {
                    for (data in obj[key]) {
                        condition.$or.push({ couponStatus: obj[key][data] })
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
        //   console.log("condition==>" + JSON.stringify(condition))
        createNewAds.find(condition).exec(function(err, result) {
            // console.log("result--->>",result)
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No result found." }) } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: i18n.__("Result shown successfully")
                })
            }
        })
    },
    
     // coupon gifts filter api
    "couponGiftsFilter": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        var userId = req.body.userId;
        var status = req.body.couponStatus;
        var array = [];
        User.aggregate({ $unwind: "$coupon" }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else {
                var userArray = [];
                for (var i = 0; i < result.length; i++) {
                    if (result[i]._id == userId) {
                        userArray.push(result[i]._id)
                    }
                }
                User.aggregate({ $unwind: "$coupon" }, { $match: { $and: [{ _id: { $in: userArray }, 'coupon.couponStatus': { $in: status }, 'coupon.status': 'ACTIVE' }] } }, { $sort: { 'coupon.createddAt': -1 } }, function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (result1.length == 0) { res.send({ responseCode: 404, responseMessage: "No coupon found" }); } else {
                        User.populate(result1, { path: 'coupon.pageId', model: 'createNewPage', select: 'pageName adAdmin' }, function(err, result2) {
                            User.populate(result1, { path: 'coupon.adId', model: 'createNewAds' }, function(err, result3) {
                                console.log("couponGiftsFilter--result3->>>", JSON.stringify(result3))

                                var type = 'onGifts';
                                var new_Data1 = [];
                                var new_count = [];
                                var new_length = 0;
                                async.forEachOfLimit(result3, 1, function(value, key, callback) {
                                    var id = value.coupon.adId._id;
                                    var couponType = value.coupon.type;
                                    addsComments.find({ $and: [{ addId: id }, { winnerId: userId }, { type: type }, { couponType: couponType }], status: "ACTIVE" }, function(err, commentResult) {
                                        new_length = commentResult.length;
                                        console.log("new_length--->>>", new_length);
                                        value.coupon.adId.commentCountOnGifts = new_length;
                                        //console.log(new_length);
                                        new_count.push(new_length)
                                        new_Data1.push(value)
                                        callback();
                                    })

                                }, function(err) {
                                    res.send({
                                        result: result3,
                                        count:new_count,
                                        responseCode: 200,
                                        responseMessage: i18n.__("result show successfully")
                                    })
                                })
                            })
                        })
                    }
                })
            }
        })
    },

    // cash gifts filter api
    "cashGiftsFilter": function(req, res) { // userId in req 
        i18n = new i18n_module(req.body.lang, configs.langFile);
        var userId = req.body.userId;
        var status = req.body.cashStatus;
        var array = [];
        createNewAds.find({ adsType: "cash", "status": "EXPIRED" }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error 22" }); } else {
                for (i = 0; i < result.length; i++) {
                    console.log("cash gift result.length--->>>", result.length, i)
                    for (j = 0; j < result[i].winners.length; j++) {
                        if (result[i].winners[j] == userId) {
                            array.push(result[i]._id);
                        }
                    }
                }
                console.log("array--->>>", array)
                console.log("status--->>>", status)
                createNewAds.find({ _id: { $in: array }, cashStatus: { $in: status } }).exec(function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error 33" }); } else if (result1.length == 0) { res.send({ responseCode: 404, responseMessage: "No ad found" }); } else {
                        var sortArray = result1.sort(function(obj1, obj2) {
                            return obj2.createdAt - obj1.createdAt
                        })
                        var updatedResult = result1;
                        createNewAds.populate(updatedResult, { path: 'pageId', model: 'createNewPage', select: 'pageName adAdmin' }, function(err, finalResult) {
                            res.send({
                                result: sortArray,
                                responseCode: 200,
                                responseMessage: i18n.__("Result shown successfully")
                            })
                        })
                    }
                })
            }
        })
    },

    // show list of coupon in store
    "storeCouponList": function(req, res) {
        console.log("storeCouponList--->>>",JSON.stringify(req.body))
        i18n = new i18n_module(req.params.lang, configs.langFile);
        waterfall([
            function(callback) {
                var userId = req.params.id;
                User.find({ $or: [{ 'type': 'USER' }, { 'type': 'Advertiser' }], status: 'ACTIVE', isVerified: "TRUE" }).lean().exec(function(err, userResult1) {
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
                        callback(null, blockedArray)
                        console.log("flag------->>>>", JSON.stringify(blockedArray))
                    }
                })
            },
            function(blockedArray, callback) {
                brolixAndDollors.findOne({ type: 'storeCouponPriceForFreeAds' }).exec(function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error 11" }); } else {
                        var value = result1.value
                        // var value= 2
                        callback(null, value, blockedArray)
                    }
                })
            },
            function(noDataValue, blockedArray, callback) {
                brolixAndDollors.findOne({ type: 'storeCouponPriceForUpgradedAds' }).exec(function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error 11" }); } else {
                        var value = result1.value
                        //  var value= 4;
                        callback(null, noDataValue, value, blockedArray)
                    }
                })
            },
            function(noDataValue, dataValue, blockedArray, callback) {
                User.findOne({_id:req.params.id}).exec(function(err, userResult){
                   if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); }
                    else{
                        var userCountry = userResult.country;                  
                createNewAds.paginate({ userId: { $nin: blockedArray },'whoWillSeeYourAdd.country': userCountry ,sellCoupon: true, status: "ACTIVE" }, { page: req.params.pageNumber, limit: 8, sort: { viewerLenght: -1, createdAt: -1 } }, function(err, result) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (result.docs.length == 0) { res.send({ responseCode: 404, responseMessage: "No coupon found" }); } else {
                        var updatedResult = result.docs;
                        createNewAds.populate(updatedResult, { path: 'pageId', model: 'createNewPage', select: 'pageName adAdmin' }, function(err, finalResult) {
                            for (var i = 0; i < result.docs.length; i++) {
                                if (result.docs[i].adsType == 'coupon') {
                                    if (result.docs[i].cash == 0) {
                                        result.docs[i].couponSellPrice = noDataValue
                                    } else {
                                        result.docs[i].couponSellPrice = dataValue
                                    }
                                }
                            }
                            //    console.log("storeCoupon--->>>",JSON.stringify(result))
                            res.send({
                                result: result,
                                responseCode: 200,
                                responseMessage: i18n.__("Each coupon from the store showed successfully")
                            })
                        })
                    }

                })
                  }
                })
            }
        ])
    },

    // view coupon in app api
    "viewCoupon": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        createNewAds.findOne({ _id: req.body.adId }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); }
            if (!result) { res.send({ responseCode: 404, responseMessage: "No ad found" }); } else {
                var updatedResult = result;
                createNewAds.populate(updatedResult, { path: 'pageId', model: 'createNewPage', select: 'pageName adAdmin' }, function(err, finalResult) {
                    res.send({
                        result: result,
                        responseCode: 200,
                        responseMessage: i18n.__("Result shown successfully")
                    })
                })
            }
        })
    },

    // page coupon filter api
    "PageCouponFilter": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        waterfall([
            function(callback) {
                var userId = req.params.id;
                User.find({ $or: [{ 'type': 'USER' }, { 'type': 'Advertiser' }], status: 'ACTIVE', isVerified: "TRUE" }).lean().exec(function(err, userResult1) {
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
                        callback(null, blockedArray)
                        console.log("flag------->>>>", JSON.stringify(blockedArray))

                    }
                })
            },

            function(blockedArray, callback) {
                brolixAndDollors.findOne({ type: 'storeCouponPriceForFreeAds' }).exec(function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error 11" }); } else {
                        var value = result1.value
                        // var value= 2
                        callback(null, value, blockedArray)
                    }
                })
            },
            function(noDataValue, blockedArray, callback) {
                brolixAndDollors.findOne({ type: 'storeCouponPriceForUpgradedAds' }).exec(function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error 11" }); } else {
                        var value = result1.value
                        //  var value= 4;
                        callback(null, noDataValue, value, blockedArray)
                    }
                })
            },
            function(noDataValue, dataValue, blockedArray, callback) {
                var condition = { $and: [] };
                var obj = req.body;
                Object.getOwnPropertyNames(obj).forEach(function(key, idx, array) {
                    if (!(obj[key] == "" || obj[key] == undefined || key == "lang")) {
                        var cond = { $or: [] };
                        //                        if (key == "subCategory") {
                        //                            for (data in obj[key]) {
                        //                                cond.$or.push({ subCategory: obj[key][data] })
                        //                            }
                        //                            condition.$and.push(cond)
                        //                        }
                        if (key == "subCategory") {
                            console.log("ssSSSSS", obj[key])
                            var re = new RegExp(obj[key], 'i');
                            console.log(re)
                            var data = { subCategory: { $regex: re } }
                            condition.$and.push(data)
                        } else if (key == "pageName") {
                            console.log("ssSSSSS", obj[key])
                            var re = new RegExp(obj[key], 'i');
                            console.log(re)
                            var data = { pageName: { $regex: re } }
                            condition.$and.push(data)
                        } else {
                            var tempCond = {};
                            tempCond[key] = obj[key];
                            condition.$and.push(tempCond)
                        }
                    }
                });
                if (condition.$and.length == 0) {
                    delete condition.$and;
                }
                console.log("condition==>" + JSON.stringify(condition))
                createNewPage.find(condition).exec(function(err, result) {
                    // console. 0000000("result--->>",result)
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No result found." }) } else {
                        console.log("array result", result)
                        var array = [];
                        for (var i = 0; i < result.length; i++) {
                            array.push(String(result[i]._id))
                        }
                        console.log(array)
                        callback(null, noDataValue, dataValue, array, blockedArray)
                    }
                })
            },
            function(noDataValue, dataValue, arrayId, blockedArray, callback) {
                //      console.log("arrayId=========>...", arrayId)
                createNewAds.paginate({ $and: [{ pageId: { $in: arrayId }, userId: { $nin: blockedArray }, sellCoupon: true, status: 'ACTIVE' }] }, { page: req.params.pageNumber, limit: 10, sort: { viewerLenght: -1, createdAt: -1 } }, function(err, result) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No result found." }) } else {
                        var updatedResult = result.docs;
                        createNewAds.populate(updatedResult, { path: 'pageId', model: 'createNewPage', select: 'pageName adAdmin' }, function(err, finalResult) {
                            for (var i = 0; i < result.docs.length; i++) {
                                if (result.docs[i].adsType == 'coupon') {
                                    if (result.docs[i].cash == 0) {
                                        result.docs[i].couponSellPrice = noDataValue
                                    } else {
                                        result.docs[i].couponSellPrice = dataValue
                                    }
                                }
                            }
                            //   console.log("finalResult", finalResult)
                            res.send({ responseCode: 200, responseMessage: i18n.__("Success."), result: result })
                        })

                    }
                })
            }
        ])
    },

    // store user's fav coupon filter api
    "StoreFavCouponFilter": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        waterfall([
            function(callback) {
                var userId = req.params.id;
                User.find({ $or: [{ 'type': 'USER' }, { 'type': 'Advertiser' }], status: 'ACTIVE', isVerified: "TRUE" }).lean().exec(function(err, userResult1) {
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
                        callback(null, blockedArray)
                        console.log("flag------->>>>", JSON.stringify(blockedArray))

                    }
                })
            },

            function(blockedArray, callback) {
                brolixAndDollors.findOne({ type: 'storeCouponPriceForFreeAds' }).exec(function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error 11" }); } else {
                        var value = result1.value
                        // var value= 2
                        callback(null, value, blockedArray)
                    }
                })
            },
            function(noDataValue, blockedArray, callback) {
                brolixAndDollors.findOne({ type: 'storeCouponPriceForUpgradedAds' }).exec(function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error 11" }); } else {
                        var value = result1.value
                        //  var value= 4;
                        callback(null, noDataValue, value, blockedArray)
                    }
                })
            },
            function(noDataValue, dataValue, blockedArray, callback) {
                var condition = { $and: [] };
                var obj = req.body;
                Object.getOwnPropertyNames(obj).forEach(function(key, idx, array) {
                    if (!(key == 'lang' || key == 'userId' || obj[key] == "" || obj[key] == undefined)) {
                        var cond = { $or: [] };
                        //                        if (key == "subCategory") {
                        //                            for (data in obj[key]) {
                        //                                cond.$or.push({ subCategory: obj[key][data] })
                        //                            }
                        //                            condition.$and.push(cond)
                        //                        } 
                        if (key == "subCategory") {
                            console.log("subCategory​-->>", obj[key])
                            var re2 = new RegExp(obj[key], 'i');
                            console.log("sasdasd--->>>", re2)
                            var data = { subCategory: { $regex: re2 } }
                            condition.$and.push(data)
                        } else if (key == "pageName") {
                            console.log("ssSSSSS", obj[key])
                            var re = new RegExp(obj[key], 'i');
                            console.log(re)
                            var data = { pageName: { $regex: re } }
                            condition.$and.push(data)
                        } else {
                            var tempCond = {};
                            tempCond[key] = obj[key];
                            condition.$and.push(tempCond)
                        }
                    }
                });
                if (condition.$and.length == 0) {
                    delete condition.$and;
                }
                console.log("condition==>" + JSON.stringify(condition))
                createNewPage.find(condition).exec(function(err, result) {
                    // console. 0000000("result--->>",result)
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error', err }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No result found." }) } else {
                        //         console.log("array result", result)
                        var array = [];
                        for (var i = 0; i < result.length; i++) {
                            array.push(String(result[i]._id))
                        }
                        console.log(array)
                        callback(null, noDataValue, dataValue, array, blockedArray)
                    }
                })
            },
            function(noDataValue, dataValue, arrayId, blockedArray, callback) {
                //     console.log("arrayId=========>...", arrayId)
                User.findOne({_id:req.params.id}).exec(function(err, userResult){
                     if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
                    else{
                   var userCountry = userResult.country;     
                   
                createNewAds.paginate({ $and: [{ pageId: { $in: arrayId }, userId: { $nin: blockedArray }, sellCoupon: true, status: 'ACTIVE', favouriteCoupon: req.body.userId }] }, { page: req.params.pageNumber, limit: 10, sort: { viewerLenght: -1, createdAt: -1 }}, function(err, result) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No result found." }) } else {
                        createNewAds.populate(result.docs, { path: 'pageId', model: 'createNewPage', select: 'pageName adAdmin' }, function(err, finalResult) {
                            for (var i = 0; i < result.docs.length; i++) {
                                if (result.docs[i].adsType == 'coupon') {
                                    if (result.docs[i].cash == 0) {
                                        result.docs[i].couponSellPrice = noDataValue
                                    } else {
                                        result.docs[i].couponSellPrice = dataValue
                                    }
                                }
                            }
                            res.send({ responseCode: 200, responseMessage: i18n.__("Success."), result: result })
                        })

                    }
                })
                    }
                })
            }
        ])
    },

    // ad view click api
    "adsViewClick": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        var startTime = new Date(req.body.date).toUTCString();
        var endTimeHour = req.body.date + 1000;
        var endTime = new Date(endTimeHour).toUTCString();
        console.log(startTime);
        console.log(endTime)

        var details = req.body;
        var data = req.body.click;

        switch (data) {
            case 'AdTag':
                var updateData = { $inc: { AdTag: 1 } };
                details.AdTag = 1;
                break;
            case 'socialShare':
                var updateData = { $inc: { socialShare: 1 } };
                details.socialShare = 1;
                break;
            case 'AdFollowers':
                var updateData = { $inc: { AdFollowers: 1 } };
                details.AdFollowers = 1;
                break;
            case 'useLuckCard':
                var updateData = { $inc: { useLuckCard: 1 } };
                details.useLuckCard = 1;
                break;
            case 'AdReport':
                var updateData = { $inc: { AdReport: 1 } };
                details.AdReport = 1;
                break;
            case 'GameDownloaded':
                var updateData = { $inc: { GameDownloaded: 1 } };
                details.GameDownloaded = 1;
                break;
            case 'couponPurchased':
                var updateData = { $inc: { couponPurchased: 1 } };
                details.couponPurchased = 1;
                break;
        }

        Views.findOne({ adId: req.body.adId, date: { $gte: startTime, $lte: endTime } }, function(err, result) {
            //    console.log("views r3sult==>>" + result)
            if (err) {
                res.send({
                    result: err,
                    responseCode: 302,
                    responseMessage: "error."
                });
            } else if (!result) {
                saveData = 1;
                details.date = startTime;
                var views = Views(details);
                views.save(function(err, pageRes) {
                    res.send({
                        result: pageRes,
                        responseCode: 200,
                        responseMessage: i18n.__("Clicks updated successfully")
                    });
                })

            } else {
                Views.findOneAndUpdate({ _id: result._id }, updateData, { new: true }).exec(function(err, pageRes) {
                    if (err) {
                        res.send({
                            result: err,
                            responseCode: 302,
                            responseMessage: "error."
                        });
                    } else if (!result) {
                        res.send({
                            result: pageRes,
                            responseCode: 404,
                            responseMessage: i18n.__("Clicks updated successfully")
                        });
                    } else {
                        res.send({
                            result: pageRes,
                            responseCode: 200,
                            responseMessage: i18n.__("Clicks updated successfully")
                        });
                    }
                })
            }
        })
    },

    // ad Statistics api
    "adStatistics": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
         console.log("adStatistics-->>>" + JSON.stringify(req.body))
        // var queryCondition = { $match: { $and: [{ date: { "$gte": new Date(req.body.startDate), "$lte": new Date(req.body.endDate) } }, { adId: req.body.adId }] } }
        // var queryConditionPage = { $match: { $and: [{ date: { "$gte": new Date(req.body.startDate), "$lte": new Date(req.body.endDate) } }, { pageId: req.body.pageId }] } }

        var queryCondition = { $match: { $and: [{ date: { "$gte": new Date(req.body.startDate), "$lte": new Date(req.body.endDate) } }, { adId: req.body.adId }] } }
        var queryConditionPage = { $match: { $and: [{ date: { "$gte": new Date(req.body.startDate), "$lte": new Date(req.body.endDate) } }, { pageId: req.body.pageId },{adId : req.body.adId}] } }
          console.log("queryConditionPage" + JSON.stringify(queryConditionPage))
        waterfall([
            function(callback) {
                Views.aggregate([queryCondition, {
                    $group: {
                        _id: null,
                        pageView: { $sum: 0 },
                        viewAds: { $sum: "$viewAds" },
                        AdTag: { $sum: "$AdTag" },
                        socialShare: { $sum: "$socialShare" },
                        AdFollowers: { $sum: "$AdFollowers" },
                        useLuckCard: { $sum: "$useLuckCard" },
                        AdReport: { $sum: "$AdReport" },
                        GameDownloaded: { $sum: "$GameDownloaded" }
                    }
                }]).exec(function(err, result) {
                    if (err) { res.send({  responseCode: 500, responseMessage: "Internal server error" });} 
                    else if (result.length == 0) {
                        var data = [{
                            pageView: 0,
                            viewAds: 0,
                            AdTag: 0,
                            socialShare: 0,
                            AdFollowers: 0,
                            useLuckCard: 0,
                            AdReport: 0,
                            GameDownloaded: 0
                        }]
                        callback(null, data)
                    } else {
                        callback(null, result)
                    }
                })
            },
            function(AdResult, callback) {
                Views.aggregate([queryConditionPage, {
                    $group: {
                        _id: null,
                        pageView: { $sum: "$pageView" }

                    }
                }]).exec(function(err, result) {
                     if (err) { res.send({  responseCode: 500, responseMessage: "Internal server error" });} 
                    else if (result.length == 0) {
                        var data = [{
                            pageView: 0
                        }]
                         console.log("data" + JSON.stringify(data))
                        AdResult[0].pageView = data[0].pageView;
                          res.send({
                            result: AdResult,
                            responseCode: 200,
                            responseMessage: i18n.__("Success.")
                        });

                    } else {
                        AdResult[0].pageView = result[0].pageView;
                        //   AdResult[0].viewAds = result[0].viewAds;
                        res.send({
                            result: AdResult,
                            responseCode: 200,
                            responseMessage: i18n.__("Success.")
                        });
                    }
                })
            }
        ])
    },

    // coupon Statistics filter clicks api
    "adStatisticsFilterClick": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        // var details = req.body;
        var data = req.body.click;

        switch (data) {
            case 'pageView':
                var updateData = { $match: { pageId: req.body.pageId ,adId: req.body.adId} };
                var groupCond = {
                    $group: {
                        _id: { year: { $year: "$date" }, month: { $month: "$date" } },
                        pageView: { $sum: "$pageView" },
                        viewAds: { $sum: 0 },
                        AdTag: { $sum: 0 },
                        socialShare: { $sum: 0 },
                        AdFollowers: { $sum: 0 },
                        useLuckCard: { $sum: 0 },
                        AdReport: { $sum: 0 },
                        GameDownloaded: { $sum: 0 }
                    }
                }
                break;
            case 'viewAds':
                var updateData = { $match: { pageId: req.body.pageId } };
                var groupCond = {
                    $group: {
                        _id: { year: { $year: "$date" }, month: { $month: "$date" } },
                        pageView: { $sum: 0 },
                        viewAds: { $sum: "$viewAds" },
                        AdTag: { $sum: 0 },
                        socialShare: { $sum: 0 },
                        AdFollowers: { $sum: 0 },
                        useLuckCard: { $sum: 0 },
                        AdReport: { $sum: 0 },
                        GameDownloaded: { $sum: 0 }
                    }
                }
                break;
            case 'AdTag':
                var updateData = { $match: { adId: req.body.adId } };
                var groupCond = {
                    $group: {
                        _id: { year: { $year: "$date" }, month: { $month: "$date" } },
                        pageView: { $sum: 0 },
                        viewAds: { $sum: 0 },
                        AdTag: { $sum: "$AdTag" },
                        socialShare: { $sum: 0 },
                        AdFollowers: { $sum: 0 },
                        useLuckCard: { $sum: 0 },
                        AdReport: { $sum: 0 },
                        GameDownloaded: { $sum: 0 }
                    }
                }
                break;
            case 'socialShare':
                var updateData = { $match: { adId: req.body.adId } };
                var groupCond = {
                    $group: {
                        _id: { year: { $year: "$date" }, month: { $month: "$date" } },
                        pageView: { $sum: 0 },
                        viewAds: { $sum: 0 },
                        AdTag: { $sum: 0 },
                        socialShare: { $sum: "$socialShare" },
                        AdFollowers: { $sum: 0 },
                        useLuckCard: { $sum: 0 },
                        AdReport: { $sum: 0 },
                        GameDownloaded: { $sum: 0 }
                    }
                }
                break;
            case 'AdFollowers':
                var updateData = { $match: { adId: req.body.adId } };
                var groupCond = {
                    $group: {
                        _id: { year: { $year: "$date" }, month: { $month: "$date" } },
                        pageView: { $sum: 0 },
                        viewAds: { $sum: 0 },
                        AdTag: { $sum: 0 },
                        socialShare: { $sum: 0 },
                        AdFollowers: { $sum: "$AdFollowers" },
                        useLuckCard: { $sum: 0 },
                        AdReport: { $sum: 0 },
                        GameDownloaded: { $sum: 0 }
                    }
                }
                break;
            case 'useLuckCard':
                var updateData = { $match: { adId: req.body.adId } };
                var groupCond = {
                    $group: {
                        _id: { year: { $year: "$date" }, month: { $month: "$date" } },
                        pageView: { $sum: 0 },
                        viewAds: { $sum: 0 },
                        AdTag: { $sum: 0 },
                        socialShare: { $sum: 0 },
                        AdFollowers: { $sum: 0 },
                        useLuckCard: { $sum: "$useLuckCard" },
                        AdReport: { $sum: 0 },
                        GameDownloaded: { $sum: 0 }
                    }
                }
                break;
            case 'AdReport':
                var updateData = { $match: { adId: req.body.adId } };
                var groupCond = {
                    $group: {
                        _id: { year: { $year: "$date" }, month: { $month: "$date" } },
                        pageView: { $sum: 0 },
                        viewAds: { $sum: 0 },
                        AdTag: { $sum: 0 },
                        socialShare: { $sum: 0 },
                        AdFollowers: { $sum: 0 },
                        useLuckCard: { $sum: 0 },
                        AdReport: { $sum: "$AdReport" },
                        GameDownloaded: { $sum: 0 }
                    }
                }
                break;
            case 'GameDownloaded':
                var updateData = { $match: { adId: req.body.adId } };
                var groupCond = {
                    $group: {
                        _id: { year: { $year: "$date" }, month: { $month: "$date" } },
                        pageView: { $sum: 0 },
                        viewAds: { $sum: 0 },
                        AdTag: { $sum: 0 },
                        socialShare: { $sum: 0 },
                        AdFollowers: { $sum: 0 },
                        useLuckCard: { $sum: 0 },
                        AdReport: { $sum: 0 },
                        GameDownloaded: { $sum: "$GameDownloaded" }
                    }
                }
                break;
        }

        var newDate = new Date(req.body.date).getFullYear();

        Views.aggregate(updateData, groupCond,
            function(err, results) {
                //var yearData = 2017
                var data = results.filter(results => results._id.year == newDate)
                results = data;
                var array = [];
                var flag = false;
                for (var i = 1; i <= 12; i++) {
                    for (var j = 0; j < results.length; j++) {
                        if (i == results[j]._id.month) {
                            flag = true;
                            break;
                        } else {
                            flag = false;
                        }
                    }
                    if (flag == true) {
                        array.push(results[j])
                    } else {
                        var data = {
                            _id: {
                                year: 2017,
                                month: i
                            },
                            pageView: 0,
                            viewAds: 0,
                            AdTag: 0,
                            socialShare: 0,
                            AdFollowers: 0,
                            useLuckCard: 0,
                            AdReport: 0,
                            GameDownloaded: 0
                        }
                        array.push(data)
                    }
                }
                res.send({
                    result: array,
                    responseCode: 200,
                    responseMessage: i18n.__("Success.")
                })
            });
    },
    // , 'coupon.type':'PURCHASED'
    "CouponAdStatistics": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        var updateData = { $match: { adId: req.body.adId } };
        var groupCond = {
            $group: {
                _id: null,
                couponPurchased: { $sum: "$couponPurchased" }
            }
        }

        var updateDataVALID = { $match: { 'coupon.adId': req.body.adId, 'coupon.status': 'ACTIVE', 'coupon.couponStatus': 'VALID' } };
        var updateUnwindDataVALID = { $unwind: "$coupon" };
        var groupCondVALID = {
            $group: {
                _id: null,
                validCoupon: { $sum: 1 }
            }
        }

        var updateDataUSED = { $match: { 'coupon.adId': req.body.adId, 'coupon.status': 'ACTIVE', 'coupon.couponStatus': 'USED' } };
        var updateUnwindDataUSED = { $unwind: "$coupon" };
        var groupCondUSED = {
            $group: {
                _id: null,
                usedCoupon: { $sum: 1 }
            }
        }

        var updateDataEXPIRED = { $match: { 'coupon.adId': req.body.adId, 'coupon.status': 'ACTIVE', 'coupon.couponStatus': 'EXPIRED' } };
        var updateUnwindDataEXPIRED = { $unwind: "$coupon" };
        var groupCondEXPIRED = {
            $group: {
                _id: null,
                expiredCoupon: { $sum: 1 }
            }
        }
        waterfall([
            function(callback) {
                createNewAds.findOne({
                    _id: req.body.adId
                }, function(err, result) {
                    if (err) {
                        res.send({ result: err, responseCode: 302, responseMessage: "error." });

                    } else if (!result) {
                        res.send({ responseCode: 404, responseMessage: 'Data not found.' });
                    } else {
                        callback(null, result)
                    }
                })
            },
            function(adsResult, callback) {
                Views.aggregate(updateData, groupCond, function(err, result) {
                    if (err) {
                        res.send({ result: err, responseCode: 302, responseMessage: "error." });
                    } else if (result.length == 0) {
                        var data = 0
                        callback(null, adsResult, data)
                    } else {
                        var data = result[0].couponPurchased;
                        callback(null, adsResult, data)
                    }
                })
            },
            function(adsResult, viewResult, callback) {
                User.aggregate(updateUnwindDataVALID, updateDataVALID, groupCondVALID, function(err, result) {
                    if (err) {
                        res.send({ result: err, responseCode: 302, responseMessage: "error." });
                    } else if (result.length == 0) {
                        var data = 0
                        callback(null, adsResult, viewResult, data)
                    } else {
                        var data = result[0].validCoupon;
                        callback(null, adsResult, viewResult, data)
                    }
                })
            },
            function(adsResult, viewResult, validResult, callback) {
                User.aggregate(updateUnwindDataUSED, updateDataUSED, groupCondUSED, function(err, result) {
                    if (err) {
                        res.send({ result: err, responseCode: 302, responseMessage: "error." });
                    } else if (result.length == 0) {
                        var data = 0;
                        callback(null, adsResult, viewResult, validResult, data)
                    } else {
                        var data = result[0].usedCoupon
                        callback(null, adsResult, viewResult, validResult, data)
                    }
                })
            },
            function(adsResult, viewResult, validResult, usedResult, callback) {
                User.aggregate(updateUnwindDataEXPIRED, updateDataEXPIRED, groupCondEXPIRED, function(err, result) {
                    if (err) {
                        res.send({ result: err, responseCode: 302, responseMessage: "error." });
                    } else if (result.length == 0) {
                        var data = {
                            totalWinner: adsResult.winners.length,
                            couponPurchased: viewResult,
                            validResult: validResult,
                            usedResult: usedResult,
                            expiredResult: 0
                        }
                        res.send({
                            result: data,
                            responseCode: 200,
                            responseMessage: i18n.__('Success')
                        });
                    } else {
                        var resultData = result[0].expiredCoupon
                        var data = {
                            totalWinner: adsResult.winners.length,
                            couponPurchased: viewResult,
                            validCoupon: validResult,
                            usedCoupon: usedResult,
                            expiredCoupon: resultData
                        }
                        res.send({
                            result: data,
                            responseCode: 200,
                            responseMessage: i18n.__('Success')
                        });
                    }
                })
            }

        ])
    },

    // coupon Statistics year clicks api
    "couponStatisticsYearClicks": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        var newDate = new Date(req.body.date).getFullYear();
        var data = req.body.click;

        switch (data) {
            case 'couponPurchased':
                var updateData = { $match: { adId: req.body.adId } };
                var groupCond = {
                    $group: {
                        _id: { year: { $year: "$date" }, month: { $month: "$date" } },
                        expiredCoupon: { $sum: 0 },
                        usedCoupon: { $sum: 0 },
                        validCoupon: { $sum: 0 },
                        totalWinner: { $sum: 0 },
                        couponPurchased: { $sum: "$couponPurchased" }
                    }
                }
                break;

            case 'totalWinner':
                var updateData = { $match: { _id: new mongoose.Types.ObjectId(req.body.adId) } };
                var updateUnwindData = { $unwind: "$winners" };
                var groupCond = {
                    $group: {
                        _id: { year: { $year: "$updatedAt" }, month: { $month: "$updatedAt" } },
                        expiredCoupon: { $sum: 0 },
                        usedCoupon: { $sum: 0 },
                        validCoupon: { $sum: 0 },
                        totalWinner: { $sum: 1 },
                        couponPurchased: { $sum: 0 }
                    }
                }
                break;

            case 'validCoupon':
                var updateData = { $match: { 'coupon.adId': req.body.adId, 'coupon.couponStatus': 'VALID' } };
                var updateUnwindData = { $unwind: "$coupon" };
                var groupCond = {
                    $group: {
                        _id: { year: { $year: "$coupon.updateddAt" }, month: { $month: "$coupon.updateddAt" } },
                        expiredCoupon: { $sum: 0 },
                        usedCoupon: { $sum: 0 },
                        validCoupon: { $sum: 1 },
                        totalWinner: { $sum: 0 },
                        couponPurchased: { $sum: 0 }
                    }
                }
                break;

            case 'usedCoupon':
                var updateData = { $match: { 'coupon.adId': req.body.adId, 'coupon.couponStatus': 'USED' } };
                var updateUnwindData = { $unwind: "$coupon" };
                var groupCond = {
                    $group: {
                        _id: { year: { $year: "$coupon.usedCouponDate" }, month: { $month: "$coupon.usedCouponDate" } },
                        expiredCoupon: { $sum: 0 },
                        usedCoupon: { $sum: 1 },
                        validCoupon: { $sum: 0 },
                        totalWinner: { $sum: 0 },
                        couponPurchased: { $sum: 0 }
                    }
                }
                break;

            case 'expiredCoupon':
                var updateData = { $match: { 'coupon.adId': req.body.adId, 'coupon.couponStatus': 'EXPIRED' } };
                var updateUnwindData = { $unwind: "$coupon" };
                var groupCond = {
                    $group: {
                        _id: { year: { $year: "$coupon.expirationTime" }, month: { $month: "$coupon.expirationTime" } },
                        expiredCoupon: { $sum: 1 },
                        usedCoupon: { $sum: 0 },
                        validCoupon: { $sum: 0 },
                        totalWinner: { $sum: 0 },
                        couponPurchased: { $sum: 0 }
                    }
                }
                break;
        }

        //  var newDate = new Date(req.body.date).getFullYear();
        //  console.log("groupCond", JSON.stringify(groupCond))
        waterfall([
            function(callback) {
                if (req.body.click == 'expiredCoupon' || req.body.click == 'usedCoupon' || req.body.click == 'validCoupon') {
                    User.aggregate(updateUnwindData, updateData, groupCond,
                        function(err, results) {
                            var data = results.filter(results => results._id.year == newDate)
                            results = data;
                            var array = [];
                            var flag = false;
                            for (var i = 1; i <= 12; i++) {
                                console.log("Dfdgf", i)
                                for (var j = 0; j < results.length; j++) {
                                    if (i == results[j]._id.month) {
                                        console.log("value of j==>", j)
                                        flag = true;
                                        break;
                                    } else {
                                        flag = false;
                                    }
                                }
                                if (flag == true) {
                                    array.push(results[j])
                                } else {
                                    var data = {
                                        _id: {
                                            year: 2017,
                                            month: i
                                        },
                                        expiredCoupon: 0,
                                        usedCoupon: 0,
                                        validCoupon: 0,
                                        totalWinner: 0,
                                        couponPurchased: 0
                                    }
                                    array.push(data)
                                }
                            }
                            callback(null, array)
                        });
                } else {
                    callback(null, "data")
                }
            },
            function(userResult, callback) {
                if (req.body.click == 'totalWinner') {
                    createNewAds.aggregate(updateUnwindData, updateData, groupCond,
                        function(err, results) {
                            var data = results.filter(results => results._id.year == newDate)
                            results = data;
                            var array = [];
                            var flag = false;
                            for (var i = 1; i <= 12; i++) {
                                console.log("Dfdgf", i)
                                for (var j = 0; j < results.length; j++) {
                                    if (i == results[j]._id.month) {
                                        console.log("value of j==>", j)
                                        flag = true;
                                        break;
                                    } else {
                                        flag = false;
                                    }
                                }
                                if (flag == true) {
                                    array.push(results[j])
                                } else {
                                    var data = {
                                        _id: {
                                            year: 2017,
                                            month: i
                                        },
                                        expiredCoupon: 0,
                                        usedCoupon: 0,
                                        validCoupon: 0,
                                        totalWinner: 0,
                                        couponPurchased: 0
                                    }
                                    array.push(data)
                                }
                            }
                            callback(null, array)
                        });
                } else {
                    callback(null, userResult)
                }
            },
            function(result, callback) {
                if (req.body.click == 'couponPurchased') {
                    Views.aggregate(updateData, groupCond,
                        function(err, results) {
                            var data = results.filter(results => results._id.year == newDate)
                            results = data;
                            var array = [];
                            var flag = false;
                            for (var i = 1; i <= 12; i++) {
                                console.log("Dfdgf", i)
                                for (var j = 0; j < results.length; j++) {
                                    if (i == results[j]._id.month) {
                                        console.log("value of j==>", j)
                                        flag = true;
                                        break;
                                    } else {
                                        flag = false;
                                    }
                                }
                                if (flag == true) {
                                    array.push(results[j])
                                } else {
                                    var data = {
                                        _id: {
                                            year: 2017,
                                            month: i
                                        },
                                        expiredCoupon: 0,
                                        usedCoupon: 0,
                                        validCoupon: 0,
                                        totalWinner: 0,
                                        couponPurchased: 0
                                    }
                                    array.push(data)
                                }
                            }
                            callback(null, array)
                            // res.send({
                            //     result: array,
                            //     responseCode: 200,
                            //     responseMessage: "Success."
                            // })
                        });
                } else {
                    callback(null, result)
                }
            }
        ], function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) {
                res.send({ responseCode: 404, responseMessage: 'Data not found.' });
            } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: i18n.__('success')
                });
            }
        })
    },

    // cash ad Statistics api
    "CashAdStatistics": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        waterfall([
            function(callback) {
                var updateDataDELIVERED = { $match: { 'cashPrize.adId': req.body.adId, 'cashPrize.cashStatus': 'DELIVERED' } };
                var updateUnwindDataDELIVERED = { $unwind: "$cashPrize" };
                var groupCondDELIVERED = {
                    $group: {
                        _id: null,
                        deliveredCash: { $sum: 1 }
                    }
                }
                User.aggregate(updateUnwindDataDELIVERED, updateDataDELIVERED, groupCondDELIVERED, function(err, results) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (results.length == 0) {
                        var data = 0;
                        callback(null, data)
                    } else {
                        var data = results[0].deliveredCash
                        callback(null, data)
                    }
                })
            },
            function(cashDelivered, callback) {
                createNewAds.find({
                    _id: req.body.adId
                }).exec(function(err, result) {
                    if (err) { res.send({ result: err, responseCode: 404, responseMessage: "error." }); } else if (result.length == 0) {
                        var data = {
                            winnersLength: 0,
                            cashStatus: cashDelivered
                        }
                        res.send({
                            result: data,
                            responseCode: 200,
                            responseMessage: i18n.__('success')
                        });
                    } else {
                        var winnersLength = 0;
                        for (var i = 0; i < result.length; i++) {
                            winnersLength += result[i].winners.length;
                            console.log(winnersLength);
                        }
                        var data = {
                            winnersLength: winnersLength,
                            cashStatus: cashDelivered
                        }

                        res.send({
                            result: data,
                            responseCode: 200,
                            responseMessage: i18n.__('success')
                        });
                    }
                })
            }
        ])
    },

    // cash Statistics year clicks api
    "cashStatisticsYearClicks": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        var newYear = new Date(req.body.date).getFullYear();
        var data = req.body.click;
        waterfall([
            function(callback) {
                if (req.body.click == 'WINNER') {
                    var updateDataWinner = { year: { $year: "$updatedAt" }, month: { $month: "$updatedAt" } };
                    var updateUnwindDataWinner = { $unwind: "$winners" };
                    createNewAds.aggregate(updateUnwindDataWinner, { $match: { _id: new mongoose.Types.ObjectId(req.body.adId) } }, {
                        $group: {
                            _id: updateDataWinner,
                            winnersLength: { $sum: 1 }
                        }
                    }, function(err, results) {
                        var data = results.filter(results => results._id.year == newYear)
                        results = data;
                        var array = [];
                        var flag = false;
                        for (var i = 1; i <= 12; i++) {
                            console.log("Dfdgf", i)
                            for (var j = 0; j < results.length; j++) {
                                if (i == results[j]._id.month) {

                                    console.log("value of j==>", j)
                                    flag = true;
                                    break;
                                } else {
                                    flag = false;
                                }
                            }
                            if (flag == true) {
                                array.push(results[j])
                            } else {
                                var data = {
                                    _id: {
                                        year: 2017,
                                        month: i
                                    },
                                    winnersLength: 0
                                }
                                array.push(data)
                            }
                        }
                        callback(null, array)
                    })
                } else {
                    var winnersLength = 0;
                    callback(null, winnersLength)
                }
            },
            function(results, callback) {
                if (req.body.click == 'DELIVERED') {
                    var updateDataDELIVERED = { $match: { 'cashPrize.adId': req.body.adId, 'cashPrize.cashStatus': 'DELIVERED' } };
                    var updateDataDeliveredd = { year: { $year: "$cashPrize.updateddAt" }, month: { $month: "$cashPrize.updateddAt" } };
                    var updateUnwindDataDELIVERED = { $unwind: "$cashPrize" };
                    var groupCondDELIVERED = {
                        $group: {
                            _id: updateDataDeliveredd,
                            deliveredCash: { $sum: 1 }
                        }
                    }
                    User.aggregate(updateUnwindDataDELIVERED, updateDataDELIVERED, groupCondDELIVERED, function(err, results) {
                        console.log("yearly")
                        var data = results.filter(results => results._id.year == newYear)
                        results = data;
                        var array = [];
                        var flag = false;
                        for (var i = 1; i <= 12; i++) {
                            console.log("Dfdgf", i)
                            for (var j = 0; j < results.length; j++) {
                                if (i == results[j]._id.month) {

                                    console.log("value of j==>", j)
                                    flag = true;
                                    break;
                                } else {
                                    flag = false;
                                }
                            }
                            if (flag == true) {
                                array.push(results[j])
                            } else {
                                var data = {
                                    _id: {
                                        year: 2017,
                                        month: i
                                    },
                                    deliveredCash: 0,
                                }
                                array.push(data)
                            }
                        }
                        callback(null, array)
                    })
                } else {
                    callback(null, results)
                }
            }
        ], function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) {
                res.send({ responseCode: 404, responseMessage: 'Data not found.' });
            } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: i18n.__('success')
                });
            }
        })
    },

    // note in use for testing
    "homepageAds": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        console.log("home page req-->>", req.body)
        waterfall([
            function(callback) {
                createNewAds.paginate({}, { sort: { viewerLenght: -1 } }, function(err, data) {
                    if (err) {
                        return res.json({ responseCode: 404, responseMessage: "Internal server error.", err })
                    } else {
                        callback(null, data);
                    }
                })
            },
            function(data, callback) {
                var currentTime = (new Date).getTime();
                for (var i = 0; i <= data.docs.length - 1; i++) {
                    if (data.docs[i].priorityNumber == req.body.priorityNumber) {
                        console.log("data.docs[i].priorityNumber--->>>", data.docs[i].priorityNumber, i)
                        if (data.docs[i].expiryOfPriority - currentTime >= 0) {
                            console.log("data.docs[i].expiryOfPriority--->>>", data.docs[i].expiryOfPriority, i)
                            return res.json({ responseCode: 400, responseMessage: i18n.__("At this place already a ads exist"), timeleft: currentTime - data.docs[i].expiryOfPriority, docs: data.docs[i], currentTime: currentTime })
                        }
                    } else {
                        console.log('.')
                    }
                }
                callback(null, data)
            },
            function(data, callback) {
                createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $set: { expiryOfPriority: req.body.expiryOfPriority, priorityNumber: req.body.priorityNumber } }, { new: true }, function(err, result) {
                    if (err) {
                        return res.json({ responseCode: 404, responseMessage: "Internal server error.", err })
                    } else {
                        // console.log("asgdhasd--------->>")
                        var priorityNumber = req.body.priorityNumber;
                        // console.log("asghdhasgdhasgdkagsdkasdjkasdks------------->>>>>",data.docs[0]._id)
                        for (var i = 0; i < data.docs.length; i++) {
                            if (data.docs[i]._id == req.body.adId) {
                                if (priorityNumber >= data.docs.length) {
                                    var k = priorityNumber - data.docs.length;
                                    while ((k--) + 1) {
                                        data.docs.push(undefined);
                                    }
                                }
                                // console.log("above data",data)
                                data.docs.splice(priorityNumber, 0, data.docs.splice(i, 1)[0]);
                                // return data.docs;
                            }
                        }
                        callback(null, data.docs)
                    }
                })
            }
        ], function(err, data) {
            if (err) {
                return res.json({ responseCode: 404, responseMessage: "Internal server error.", err })
            } else {
                return res.json({ responseCode: 200, responseMessage: i18n.__("Ad position set successfully"), result: data })
            }
        })

    },

    // api for store coupon price 
    "storeCouponPrice": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        createNewAds.findOne({ _id: req.params.id }, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error 11" }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No ad found" }); } else {
                if (result.adsType == 'cash') {
                    if (result.cash > 0) {
                        var type = "storeCouponPriceForUpgradedAds";
                    } else {
                        var type = "storeCouponPriceForFreeAds";
                    }
                } else if (result.adsType == 'coupon') {
                    if (result.cash > 0) {
                        var type = "storeCouponPriceForUpgradedAds";
                    } else {
                        var type = "storeCouponPriceForFreeAds";
                    }
                }
                brolixAndDollors.find({ type: type }).exec(function(err, result) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error 11" }); } else {
                        var value = result[0].value
                        res.send({
                            price: value,
                            responseCode: 200,
                            responseMessage: i18n.__('Successfully show price for coupon')
                        })
                    }
                })
            }
        })
    },

    // update cash in user data api
    "updateCash": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        User.findOneAndUpdate({ _id: req.params.id }, { $inc: { cash: req.body.cash } }, { new: true }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) {
                res.send({
                    responseCode: 404,
                    responseMessage: 'Data not found.'
                })
            } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: i18n.__("Cash updated successfully")
                });
            }
        })
    },

    // create ad payment api
    "createAdPayment": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        User.findOne({ _id: req.body.userId }).exec(function(err, user) {
            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!user) { res.send({ responseCode: 404, responseMessage: "User not found." }); } else {
                if (req.body.paymentMode == 'paypal' || req.body.paymentMode == 'payWithWallet') {
                    waterfall([
                        function(callback) {
                            if (req.body.paymentMode == 'paypal') {
                                var cashAmount = user.cash - req.body.brolixAmount;
                            } else if (req.body.paymentMode == 'payWithWallet') {
                                var cashAmount = user.cash - req.body.amount;
                            }

                            User.findOneAndUpdate({ _id: req.body.userId }, { $set: { cash: cashAmount } }, { new: true }).exec(function(err, result) {
                                if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "Something went wrong." }); } else {
                                    callback(null, "null")
                                }
                            })

                        },
                        function(nullResult, callback) {
                            if (req.body.paymentMode == 'paypal') {
                                var details = {
                                    paymentMode: req.body.paymentMode,
                                    userId: req.body.userId,
                                    amount: req.body.amount,
                                    paymentAmount: req.body.paymentAmount,
                                    brolixAmount: req.body.brolixAmount,
                                    transcationId: req.body.transcationId,
                                    Type: req.body.Type,
                                    dates: req.body.date
                                }
                            } else if (req.body.paymentMode == 'payWithWallet') {
                                var details = {
                                    paymentMode: req.body.paymentMode,
                                    userId: req.body.userId,
                                    amount: req.body.amount,
                                    transcationId: "brolixAccount",
                                    Type: req.body.Type,
                                    dates: req.body.date
                                }
                            }

                            var payment = new Payment(details);
                            payment.save(function(err, paymentResult) {
                                if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!paymentResult) { res.send({ responseCode: 404, responseMessage: "Something went wrong." }); } else {
                                    callback(null, paymentResult)
                                }
                            })
                        }
                    ], function(err, result) {
                        if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "Something went wrong." }); } else {
                            res.send({ responseCode: 200, responseMessage: i18n.__("Ad created successfully") });
                        }
                    })
                } else {
                    waterfall([
                        function(callback) {
                            paytabs.ValidateSecretKey("sakshigadia@gmail.com", "jwjn4lgU2sZqPqsB2Da3zNJIJwaUX8mgFGDJ2UE5nEvc4XO7BYaaMTSwq3qncNDRthAvbeAyT6LX3z4EyfPk8HQzLhWX4AOyRp42", function(response) {
                                if (response.result == 'valid') {
                                    callback(null, response)
                                } else {
                                    res.send({
                                        responseCode: 404,
                                        responseMessage: "Internal server error."
                                    })
                                }
                            });
                        },
                        function(result, callback) {
                            if (user.country == 'United Arab Emirates') {
                                var state = 'UAE'
                                var country_shipping = "ARE"
                            } else if (user.country == 'Jordan') {
                                var state = 'Jordan'
                                var country_shipping = "JOR"
                            } else {
                                res.send({
                                    responseCode: 404,
                                    responseMessage: i18n.__("User can pay only for country UAE and Jordan")
                                })
                            }

                            var createPayPage = new Object()
                            createPayPage.merchant_email = 'sakshigadia@gmail.com';
                            createPayPage.paytabs_url = 'https://www.paytabs.com/apiv2/';
                            createPayPage.secret_key = "jwjn4lgU2sZqPqsB2Da3zNJIJwaUX8mgFGDJ2UE5nEvc4XO7BYaaMTSwq3qncNDRthAvbeAyT6LX3z4EyfPk8HQzLhWX4AOyRp42";
                            createPayPage.site_url = "http://ec2-52-76-162-65.ap-southeast-1.compute.amazonaws.com:8082";
                            createPayPage.return_url = "http://ec2-52-76-162-65.ap-southeast-1.compute.amazonaws.com:8082/page/returnPage";
                            createPayPage.title = "Brolix";
                            createPayPage.cc_first_name = user.firstName;
                            createPayPage.cc_last_name = user.lastName;
                            createPayPage.cc_phone_number = user.mobileNumber;
                            createPayPage.phone_number = user.mobileNumber;
                            createPayPage.email = user.email;
                            createPayPage.products_per_title = "Payment";
                            createPayPage.unit_price = req.body.paymentAmount;
                            createPayPage.quantity = "1";
                            createPayPage.other_charges = 0;
                            createPayPage.amount = req.body.paymentAmount;
                            createPayPage.discount = 0;
                            createPayPage.currency = "USD"; //EUR JOD
                            createPayPage.reference_no = "21873109128";
                            createPayPage.ip_customer = "192.168.1.1";
                            createPayPage.ip_merchant = "192.168.1.1";
                            createPayPage.billing_address = "ydh";
                            createPayPage.state = state;
                            createPayPage.city = user.city;
                            createPayPage.postal_code = '110020';
                            createPayPage.country = country_shipping;
                            createPayPage.shipping_first_name = user.firstName;
                            createPayPage.shipping_last_name = user.lastName;
                            createPayPage.address_shipping = "Flat";
                            createPayPage.city_shipping = user.city;
                            createPayPage.state_shipping = state;
                            createPayPage.postal_code_shipping = '110020';
                            createPayPage.country_shipping = country_shipping; //JOR ARE
                            createPayPage.msg_lang = "English";
                            createPayPage.cms_with_version = "1.0.0";
                            paytabs.CreatePayPage(createPayPage, function(response) {
                                if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!(response.response_code == "4012")) {
                                    res.send({ responseCode: 404, responseMessage: "User details are invalid." });
                                } else {
                                    var obj = {
                                        userId: req.body.userId,
                                        paymentMode: req.body.paymentMode,
                                        amount: req.body.amount,
                                        userCashAmount: user.cash,
                                        paymentAmount: req.body.paymentAmount,
                                        brolixAmount: req.body.brolixAmount,
                                        Type: req.body.Type,
                                        pid: response.p_id,
                                        dates: req.body.date
                                    };
                                    // myCache.del( "myKey", function( err, count ){
                                    //   if( !err ){
                                    //     console.log( count );                              
                                    //   }
                                    // })

                                    myCache.set("myKey", obj, 10000);
                                    var value = myCache.get("myKey");
                                    console.log("value", value)

                                    res.send({
                                        responseCode: 200,
                                        responseMessage: "Payment url.",
                                        result: response
                                    })
                                }
                            });
                        }
                    ])
                }
            }
        })
    },

    "readFile": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        var path = require("path");
        var fs = require("fs")
        var newPath = path.normalize(__dirname + "/testing.xls");
        console.log("New Path is ", newPath);
        var converter = require("xls-to-json");
        //var res = {};  
        converter({
            input: newPath,
            output: null
        }, function(err, result) {
            if (err) {
                console.error(err);
            } else {
                console.log("result is :-", result)
                var arrayData = []
                result.forEach(function(item) {
                    arrayData.push(item.Hiddengift)
                })



                // createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $push: { hiddenGifts: req.body.userId } }, { new: true }).exec(function(err, results) {
                //         if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                //             res.send({
                //                 result: results,
                //                 responseCode: 200,
                //                 responseMessage: "Ad removed successfully."
                //             });

                //         }
                //     })
                res.send({ result: arrayData })
            }
        })

        // var excelJson = require('excel2json');


        // excelJson('./testing.xls', {
        //     'convert_all_sheet': false,
        //     'return_type': 'File',
        //     'sheetName': 'survey'
        // }, function(err, output) {
        //   console.log("output",output)
        // });
    },

    // note in use for testing
    "test": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        uploadData(req, res, function(err, result) {
            //console.log(req.files)
            if (err) {
                console.log("rrr", err)
                return res.end("Error uploading file.");
            } else {
                console.log("res....", result)
                res.scrollend("File is uploaded");
            }
        });
        //   }


    },

    // for upload excel file in app
    "uploadXlFile": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        console.log("req", req)
        var upload = multer({
            storage: storage,
            fileFilter: function(req, file, callback) {
                callback(null, file)
            },
            limits: {
                fields: 1,
                files: 1,
                fileSize: 512000
            }
        }).single('userFile')
        //var upload = multer({ storage: storage }).array('userFile')
        upload(req, res, function(err, result) {
            if (err) {
                console.log("error", JSON.stringify(err))
                res.end('uploading error')
            } else {
                console.log("upload res", req.file.filename)

                var path = require("path");
                var fs = require("fs")
                var newPath = path.normalize(__dirname + "/../uploads/" + req.file.filename + "");
                console.log("New Path is ", newPath);
                var converter = require("xls-to-json");
                converter({
                    input: newPath,
                    output: null
                }, function(err, result) {
                    if (err) {
                        res.send({
                            responseCode: 404,
                            responseMessage: "Something went wrong.",
                            result: data
                        })
                    } else {
                        console.log("result is :-", result)
                        var arrayData = []
                        result.forEach(function(item) {
                            if (item.Hiddengift != undefined) {
                                arrayData.push(item.Hiddengift)
                            }

                        })
                        console.log("arrayData", arrayData)
                        if (arrayData == undefined || arrayData == null || arrayData == '' || arrayData.length == 0) {
                            res.send({
                                responseCode: 404,
                                responseMessage: i18n.__("Please upload file with correct format.")
                            })
                        } else {
                            var data = {
                                pathUrl: req.file.filename,
                                hiddenGifts: arrayData
                            }
                            res.send({
                                responseCode: 200,
                                responseMessage: i18n.__("Successfully uploaded."),
                                result: data
                            })
                        }

                    }
                })
            }
        })
    }

  // create ad payment api
    


    // "returnAds": function(req, res){
    //     var value = myCache.get( "myKey" );
    //     console.log("value",value)
    //     waterfall([
    //         function(callback){
    //             var verfiyPaymentRequest = new Object();
    //             verfiyPaymentRequest.merchant_email = "sakshigadia@gmail.com";
    //             verfiyPaymentRequest.secret_key = "jwjn4lgU2sZqPqsB2Da3zNJIJwaUX8mgFGDJ2UE5nEvc4XO7BYaaMTSwq3qncNDRthAvbeAyT6LX3z4EyfPk8HQzLhWX4AOyRp42";
    //             verfiyPaymentRequest.payment_reference = value.p_id;
    //             paytabs.VerfiyPayment(verfiyPaymentRequest, function(response){
    //                 console.log("verify response",response)
    //                 callback(null, response)
    //             }); 
    //         },
    //         function(response, callback){
    //             var details = {
    //                 paymentMode:value.paymentMode,
    //                 userId: value.userId,
    //                 amount: value.amount,
    //                 paymentAmount: value.paymentAmount,
    //                 brolixAmount: value.brolixAmount,
    //                 transcationId: response.transaction_id,
    //                 Type: value.Type
    //             }
    //             var payment = new Payment(details);
    //             payment.save(function(err, paymentResult){
    //             if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } 
    //             else if (!paymentResult) { res.send({ responseCode: 404, responseMessage: "Something went wrong." }); } 
    //             else {
    //                 callback(null, paymentResult)
    //             }
    //             })
    //         },
    //         function(cardRes, callback){
    //             console.log(data)
    //             var cashAmount = value.userCashAmount - value.brolixAmount
    //             console.log("cashAmount",cashAmount)
    //             User.findByIdAndUpdate({ _id: value.userId }, $set: {cash: cashAmount}, function(err, userRes) {
    //                 if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } 
    //                 else if (!userRes) { res.send({ responseCode: 404, responseMessage: "Something went wrong." }); } 
    //                 else {
    //                     console.log("userRes========>",userRes)
    //                     callback(null, userRes)
    //                 }
    //             })
    //         }
    //     ],function(err, result){
    //         if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } 
    //         else if (!result) { 
    //             res.redirect('http://ec2-52-76-162-65.ap-southeast-1.compute.amazonaws.com:1426/page/redirectad/'+404+'/'+"Failure"+'')
    //         }
    //             //res.send({ responseCode: 404, responseMessage: "Something went wrong." }); } 
    //         else {
    //             res.redirect('http://ec2-52-76-162-65.ap-southeast-1.compute.amazonaws.com:1426/page/redirectad/'+200+'/'+"Success"+'')
    //             //res.send({ responseCode: 200, responseMessage: "Cards updated successfully." });
    //         }
    //     })  
    // },

    // "redirectad":function(req, res){

    // }
}