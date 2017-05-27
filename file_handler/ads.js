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
var User = require("./model/user");
var uploadFile = require("./model/savedFiles")


// cloudinary.config({
//     cloud_name: 'mobiloitte-in',
//     api_key: '188884977577618',
//     api_secret: 'MKOCQ4Dl6uqWNwUjizZLzsxCumE'
// });
cloudinary.config({
    cloud_name: 'dfrspfd4g',
    api_key: '399442144392731',
    api_secret: 'BkGm-usnHDPfrun2fEloBtVqBqU'
});
var avoid = {
    "password": 0
}

module.exports = {

    "uploadMp3Files": function(req, res) {
        console.log(req.files);
        var imageUrl = [];
        var form = new multiparty.Form();
        form.parse(req, function(err, fields, files) {
            var a = 0;
            for (var i = 0; i < files.mp3files.length; i++) {
                var img = files.mp3files[i];
                var fileName = files.mp3files[i].originalFilename;
                cloudinary.uploader.upload(img.path, function(result) {
                    console.log(result)
                    if (result.url) {
                        var data = {
                            fileUrl: result.url,
                            fileName: result.public_id
                        }
                        console.log(data)
                        var fileData = new uploadFile(data);
                        fileData.save(function(err, ress) {
                            a += i;
                            if (a == i * i) {
                                res.send({
                                    responseCode: 200,
                                    responseMessage: "File uploaded successfully."
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


    "getMp3Files": function(req, res) {
        uploadFile.find({}, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                res.send({ result: result, responseCode: 200, responseMessage: "Mp3 files show successfully." });
            }
        })
    },

    "createAds": function(req, res) {
        if (req.body.adsType == "coupon") {
            if (!req.body.couponExpiryDate) { res.send({ responseCode: 400, responseMessage: 'Please enter coupon expiry date' }); } else if (req.body.numberOfWinners > req.body.viewerLenght) { res.send({ responseCode: 400, responseMessage: 'Number of winners can not be greater than number of viewers.' }); } else {
                var couponCode = voucher_codes.generate({ length: 6, count: 1, charset: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" });
                req.body.couponCode = couponCode;
                req.body.viewerLenght = 2;
                req.body.numberOfWinners = 2;
                req.body.couponStatus = 'VALID';
                var Ads = new createNewAds(req.body);
                Ads.save(function(err, result) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error', err }); } else {
                        createNewPage.findOneAndUpdate({ _id: req.body.pageId }, { $inc: { adsCount: 1 } }, { new: true }).exec(function(err, result1) {
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                                res.send({ result: result, responseCode: 200, responseMessage: "Ad created successfully" });
                            }
                        })
                    }
                })
            }
        } else {
            User.findOne({ _id: req.body.userId }, function(err, result) {
                console.log("result-->>", result)
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result.cash == null || result.cash == 0 || result.cash === undefined || result.cash < req.body.cashAdPrize) {
                    res.send({ responseCode: 201, responseMessage: "Insufficient cash" });
                } else {
                    User.findByIdAndUpdate({ _id: req.body.userId }, { $inc: { cash: -req.body.cashAdPrize } }, { new: true }).exec(function(err, result) {
                        req.body.viewerLenght = 2;
                        req.body.numberOfWinners = 2;
                        req.body.cashStatus = 'PENDING';
                        var Ads = new createNewAds(req.body);
                        Ads.save(function(err, result) {
                            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                                createNewPage.findByIdAndUpdate({ _id: req.body.pageId }, { $inc: { adsCount: 1 } }, { new: true }).exec(function(err, result1) {
                                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                                        res.send({ result: result, responseCode: 200, responseMessage: "Ad created successfully" });
                                    }
                                })
                            }
                        })
                    })
                }
            })
        }
    },

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

    // show all ads
    "showAllAdsCouponType": function(req, res) {
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
                createNewAds.paginate({ userId: { $ne: req.params.id }, adsType: "coupon", status: "ACTIVE" }, { page: req.params.pageNumber, limit: 8 }, function(err, result) {
                    console.log("result-->>", result)
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result.docs.length == 0) { res.send({ responseCode: 404, responseMessage: "No coupon found" }); } else {
                        for (var i = 0; i < result.docs.length; i++) {
                            if (result.docs[i].cash == 0) {
                                result.docs[i].couponSellPrice = noDataValue
                            } else {
                                result.docs[i].couponSellPrice = dataValue
                            }
                        }
                        res.send({
                            result: result,
                            responseCode: 200,
                            responseMessage: "Data Show successfully"
                        })
                    }
                })
            }
        ])
    },

    // show all ads
    "showAllAdsCashType": function(req, res) {
        createNewAds.paginate({ userId: { $ne: req.params.id }, adsType: "cash", status: "ACTIVE" }, { page: req.params.pageNumber, limit: 8 }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "Data Show successfully"
            })
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
            'whoWillSeeYourAdd.city': req.body.city,
            'pageName': req.body.pageName,
            'adsType': req.body.type,
            'category': req.body.category,
            'subCategory': req.body.subCategory,
            userId: { $ne: req.body.userId }
        }
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                if (data[key] == "" || data[key] == null || data[key] == undefined) {
                    delete data[key];
                }
            }
        }
        createNewAds.paginate(data, { page: req.params.pageNumber, limit: 8 }, function(err, results) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                //var Removed = results.docs.filter(function(el) { return el.userId !== req.body.userId; });
                res.send({
                    result: results,
                    responseCode: 200,
                    responseMessage: "All Details Found"
                })
            }
        })
    },

    //API for Like And Unlike
    "likeAndUnlike": function(req, res) {
        if (req.body.flag == "like") {
            createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $push: { like: req.body.userId } }, { new: true }).exec(function(err, results) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                    res.send({
                        result: results,
                        responseCode: 200,
                        responseMessage: "Liked"
                    });
                }
            })
        } else {
            createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $pop: { like: req.body.userId } }, { new: true }).exec(function(err, results) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                    res.send({
                        result: results,
                        responseCode: 200,
                        responseMessage: "Unliked"
                    });
                }
            })
        }
    },

    "commentOnAds": function(req, res) {
        var adds = new addsComments(req.body);
        adds.save(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                createNewAds.findOneAndUpdate({ _id: req.body.addId }, { $inc: { commentCount: +1 } }, { new: true }).exec(function(err, results) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                        res.send({ result: result, responseCode: 200, responseMessage: "Comments save with concerned User details." });
                    }
                })

            }
        })
    },
    //API Comment on Ads
    "replyOnComment": function(req, res) {
        addsComments.findOneAndUpdate({ addId: req.body.addId, _id: req.body.commentId }, {
            $push: { 'reply': { userId: req.body.userId, replyComment: req.body.replyComment, userName: req.body.userName, userImage: req.body.userImage } }
        }, { new: true }).exec(function(err, results) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                res.send({
                    result: results,
                    responseCode: 200,
                    responseMessage: "Comments save successfully."
                });
            }
        })
    },

    "adsCommentList": function(req, res) {
        addsComments.paginate({ addId: req.params.id }, { page: req.params.pageNumber, limit: 10, sort: { createdAt: -1 } }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Comments List."
                })
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
                functions.mail(result.email, massege, req.body.couponCode);
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

    // Api for Social Share
    "socialShare": function(req, res) {
        var userId = req.body.userId;
        var link = req.body.link;
        console.log("request----->>>" + JSON.stringify(req.body))
        createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $push: { "socialShareListObject": { userId: req.body.userId, link: req.body.link } } }, { new: true }, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No Ad Found" }); } else if (userId == null || userId == '' || userId === undefined) { res.send({ responseCode: 404, responseMessage: 'please enter userId' }); } else if (link == null || link == '' || link === undefined) { res.send({ responseCode: 404, responseMessage: 'please enter link' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Post saved successfully"
                })
            }
        })
    },

    "winners": function(req, res) {
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
                            responseMessage: "Post saved successfully"
                        })

                    }
                })
            }
        })
    },


    "listOfAds": function(req, res) {
        createNewAds.find({ userId: req.body.userId }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                var couponType = result.filter(result => result.adsType == "coupon");
                var cashType = result.filter(result => result.adsType == "cash");
                res.send({
                    couponType: couponType,
                    cashType: cashType,
                    responseCode: 200,
                    responseMessage: "List of ads show successfully!!"
                });
            }
        });
    },

    "listOfAllAds": function(req, res) {
        if (req.params.type == 'all') {
            createNewAds.paginate({ pageId: req.params.pageId }, { page: req.params.pageNumber, limit: 8 }, function(err, result) {
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 400, responseMessage: 'Please enter correct page id' }); } else if (result.docs.length == 0) { res.send({ responseCode: 400, responseMessage: 'No ad found' }); } else {
                    res.send({
                        result: result,
                        responseCode: 200,
                        responseMessage: "All ads shown cash type and coupon type."
                    });
                }
            })
        } else {
            type = req.params.type;
            createNewAds.paginate({ pageId: req.params.pageId, adsType: type }, { page: req.params.pageNumber, limit: 8 }, function(err, result) {
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 400, responseMessage: 'Please enter correct page id' }); } else if (result.docs.length == 0) { res.send({ responseCode: 400, responseMessage: 'No ad found' }); } else {
                    res.send({
                        result: result,
                        responseCode: 200,
                        responseMessage: "All ads shown cash type and coupon type."
                    });
                }
            });
        }
    },


    "uploads": function(req, res) {
        console.log(req.files);
        var imageUrl = [];
        var form = new multiparty.Form();
        form.parse(req, function(err, fields, files) {
            var a = 0;
            for (var i = 0; i < files.images.length; i++) {
                var img = files.images[i];
                var fileName = files.images[i].originalFilename;
                cloudinary.uploader.upload(img.path, function(result) {
                    console.log(result)
                    if (result.url) {
                        imageUrl.push(result.url);
                        a += i;
                        if (a == i * i) {
                            res.send({
                                result: result.url,
                                responseCode: 200,
                                responseMessage: "File uploaded successfully."
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

    "viewAd": function(req, res) { //req.body.userId, adId
        var userId = req.body.userId;
        waterfall([
            function(callback) {
                createNewAds.findOne({ _id: req.body.adId }).exec(function(err, result) {
                    if (err) { res.send({ responseCode: 302, responseMessage: "Internal server error." }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "Please enter correct adId." }); } else if (result.winners.length != 0) { res.send({ responseCode: 406, responseMessage: "Winner allready decided" }); } else {
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
                                    if (result.gender != result1.gender) {
                                        { res.send({ responseCode: 400, responseMessage: 'Sorry, you are not from the targeted users which have been set by the advertiser, so you can’t join the raffle of this ad.' }); }
                                    } else {
                                        if (myAge < result.ageFrom) { res.send({ responseCode: 400, responseMessage: 'Sorry, you are not from the targeted users which have been set by the advertiser, so you can’t join the raffle of this ad.' }); } else if (myAge > result.ageTo) { res.send({ responseCode: 400, responseMessage: 'Sorry, you are not from the targeted users which have been set by the advertiser, so you can’t join the raffle of this ad.' }); } else {
                                            var country = result.whoWillSeeYourAdd.country;
                                            // var state = result.whoWillSeeYourAdd.state;
                                            var city = result.whoWillSeeYourAdd.city;

                                            if (result1.country != country) { res.send({ responseCode: 400, responseMessage: 'Sorry, you are not from the targeted users which have been set by the advertiser, so you can’t join the raffle of this ad.' }); } else if (result1.city != city) { res.send({ responseCode: 400, responseMessage: 'Sorry, you are not from the targeted users which have been set by the advertiser, so you can’t join the raffle of this ad.' }); } else {
                                                callback(null)
                                            }
                                        }
                                    }
                                } else {
                                    if (myAge < result.ageFrom) { res.send({ responseCode: 400, responseMessage: 'Sorry, you are not from the targeted users which have been set by the advertiser, so you can’t join the raffle of this ad.' }); } else if (myAge > result.ageTo) { res.send({ responseCode: 400, responseMessage: 'Sorry, you are not from the targeted users which have been set by the advertiser, so you can’t join the raffle of this ad.' }); } else {
                                        var country = result.whoWillSeeYourAdd.country;
                                        var state = result.whoWillSeeYourAdd.state;
                                        var city = result.whoWillSeeYourAdd.city;

                                        if (result1.country != country) { res.send({ responseCode: 400, responseMessage: 'Sorry, you are not from the targeted users which have been set by the advertiser, so you can’t join the raffle of this ad.' }); } else if (result1.state != state) { res.send({ responseCode: 400, responseMessage: 'Sorry, you are not from the targeted users which have been set by the advertiser, so you can’t join the raffle of this ad.' }); } else if (result1.city != city) { res.send({ responseCode: 400, responseMessage: 'Sorry, you are not from the targeted users which have been set by the advertiser, so you can’t join the raffle of this ad.' }); } else {
                                            callback(null, result)
                                        }
                                    }
                                }
                            }
                        })
                    }
                })
            },
            function(adResult, callback) {
                if (adResult.adsType == 'cash') {
                    if (adResult.cash > 0) {
                        var type = "freeViewersPerCashAds";
                    } else {
                        var type = "brolixPerFreeCashAds";
                    }
                } else if (adResult.adsType == 'coupon') {
                    if (adResult.cash > 0) {
                        var type = "freeViewersPerCashAds";
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
                createNewAds.findOne({ _id: req.body.adId }, function(err, result) {
                    if (err) { res.send({ responseCode: 302, responseMessage: "Internal server error." }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "Please enter correct adId." }); } else {
                        var randomIndex = [];
                        var raffleCount = result.raffleCount;
                        var viewerLenght = result.viewerLenght;
                        var luckUsers = result.luckCardListObject;
                        var numberOfWinners = result.numberOfWinners;

                        var mySet = new Set(raffleCount);
                        var has = mySet.has(userId)
                        if (has) { res.send({ responseCode: 302, responseMessage: "You have already join the raffle." }) }
                        // else if (!has) raffleCount.push(userId);
                        else if (!has) {
                            raffleCount.push(userId);
                            User.findOneAndUpdate({ _id: req.body.userId }, { $inc: { brolix: value, brolixAds: value } }, { new: true }, function(err, result1) {
                                console.log("raffleCount--->>>" + raffleCount.length);
                            })

                            if (raffleCount.length == viewerLenght) {
                                createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $push: { raffleCount: req.body.userId } }, function(err, success) {
                                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error  11." }); } else {
                                        console.log("success-->>", success)
                                        var winnerCount = success.numberOfWinners;
                                        var pageId = success.pageId;
                                        console.log("winnerCount-->>", winnerCount)
                                        createNewPage.findByIdAndUpdate({ _id: pageId }, { $inc: { winnersCount: +winnerCount } }, { new: true }).exec(function(err, result2) {
                                            console.log("result2-->", result2)
                                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 88' }); } else {
                                                console.log("in else")
                                            }
                                        })
                                    }
                                })
                                console.log("raffleCount--111->>>" + raffleCount.length);
                                for (var n = 0; n < luckUsers.length; n++) {
                                    for (var m = 0; m < luckUsers[n].chances; m++) {
                                        raffleCount.push(luckUsers[n].userId)
                                    }
                                }
                                for (var i = 0; i < numberOfWinners; i++) {
                                    var index = Math.floor(Math.random() * raffleCount.length);
                                    if (randomIndex.filter(randomIndex => randomIndex != raffleCount[index])) {
                                        randomIndex.push(raffleCount[index])
                                    }
                                }
                                callback(null, randomIndex, result.cashAdPrize, result.couponCode, result.hiddenGifts)
                            } else {

                                createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $push: { raffleCount: req.body.userId } }, function(err, success) {
                                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error 22." }); } else {
                                        res.send({
                                            responseCode: 200,
                                            responseMessage: "You have successfully join the raffle."
                                        })
                                    }
                                });
                            }
                        }
                    }
                })
            },
            function(winners, cashPrize, couponCode, hiddenGifts, callback) {
                console.log("winners----->>>>", winners)
                createNewAds.update({ _id: req.body.adId }, { $push: { winners: { $each: winners } } }).lean().exec(function(err, result) {
                    if (err) { res.send({ responseCode: 302, responseMessage: "Something went wrongsssssss." }); } else {

                        var date = new Date();

                        createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $set: { 'status': "EXPIRED", updatedAt: date, adExpired: true } }, function(err, result3) {
                            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error  33." }); } else {

                                if (result3.adsType == "cash") {
                                    var pageId = result3.pageId;

                                    var data = {
                                        cash: cashPrize,
                                        adId: req.body.adId,
                                        pageId: pageId
                                    }
                                    User.update({ _id: { $in: winners } }, { $push: { cashPrize: data, gifts: req.body.adId }, "notification": { adId: req.body.adId, type: 'You have successfully won this raffle', notificationType: 'WinnerType' } }, { multi: true }, function(err, result) {
                                        if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error  44." }); } else {
                                            if(result.deviceType  && result.notification_status  && result.status ){
                                            if (result.deviceType == 'Android' && result.notification_status == 'on' && result.status == 'ACTIVE') {
                                                var message = "You have successfully won this Raffle.";
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
                                                responseMessage: "Raffle is over winner decided."
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
                                            User.update({ _id: { $in: winners[i] } }, { $push: { coupon: data, hiddenGifts: data1, gifts: req.body.adId }, "notification": { adId: req.body.adId, type: 'You have successfully won this raffle', notificationType: 'WinnerType' } }, { multi: true }, function(err, result) {
                                                console.log("4")
                                                if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error  55." }); } else {
                                                    count += i;
                                                    if ((i * i) == count) {
                                                        if(result.deviceType  && result.notification_status  && result.status ){
                                                        if (result.deviceType == 'Android' && result.notification_status == 'on' && result.status == 'ACTIVE') {
                                                            var message = "You have successfully won this Raffle.";
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
                                                            responseMessage: "Raffle is over winner decided."
                                                                //result: result
                                                        })
                                                    }
                                                }
                                            })
                                        }

                                    } else {
                                        console.log("else")
                                        User.update({ _id: { $in: winners } }, { $push: { coupon: data, gifts: req.body.adId }, "notification": { adId: req.body.adId, type: 'You have successfully won this raffle', notificationType: 'WinnerType' } }, { multi: true }, function(err, result) {
                                            console.log("4")
                                            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error  55." }); } else {
                                                if(result.deviceType  && result.notification_status  && result.status ){
                                                if (result.deviceType == 'Android' && result.notification_status == 'on' && result.status == 'ACTIVE') {
                                                    var message = "You have successfully won this Raffle.";
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
                                                    responseMessage: "Raffle is over winner decided."
                                                        //result: result
                                                })
                                            }
                                        })
                                    }
                                }
                            }
                        });
                    }
                })
            }
        ])
    },

    "allAreWinners": function(req, res) { //req.body.userId, adId
        var userId = req.body.userId;
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
                                    if (result.gender != result1.gender) {
                                        { res.send({ responseCode: 400, responseMessage: 'Sorry, you are not from the targeted users which have been set by the advertiser, so you can’t join the raffle of this ad.' }); }
                                    } else {
                                        if (myAge < result.ageFrom) { res.send({ responseCode: 400, responseMessage: 'YSorry, you are not from the targeted users which have been set by the advertiser, so you can’t join the raffle of this ad.' }); } else if (myAge > result.ageTo) { res.send({ responseCode: 400, responseMessage: 'Sorry, you are not from the targeted users which have been set by the advertiser, so you can’t join the raffle of this ad.' }); } else {
                                            var country = result.whoWillSeeYourAdd.country;
                                            // var state = result.whoWillSeeYourAdd.state;
                                            var city = result.whoWillSeeYourAdd.city;

                                            if (result1.country != country) { res.send({ responseCode: 400, responseMessage: 'Sorry, you are not from the targeted users which have been set by the advertiser, so you can’t join the raffle of this ad.' }); } else if (result1.city != city) { res.send({ responseCode: 400, responseMessage: 'Sorry, you are not from the targeted users which have been set by the advertiser, so you can’t join the raffle of this ad.' }); } else {
                                                callback(null)
                                            }
                                        }
                                    }
                                } else {
                                    if (myAge < result.ageFrom) { res.send({ responseCode: 400, responseMessage: 'Sorry, you are not from the targeted users which have been set by the advertiser, so you can’t join the raffle of this ad.' }); } else if (myAge > result.ageTo) { res.send({ responseCode: 400, responseMessage: 'Sorry, you are not from the targeted users which have been set by the advertiser, so you can’t join the raffle of this ad.' }); } else {
                                        var country = result.whoWillSeeYourAdd.country;
                                        var state = result.whoWillSeeYourAdd.state;
                                        var city = result.whoWillSeeYourAdd.city;

                                        if (result1.country != country) { res.send({ responseCode: 400, responseMessage: 'Sorry, you are not from the targeted users which have been set by the advertiser, so you can’t join the raffle of this ad.' }); } else if (result1.state != state) { res.send({ responseCode: 400, responseMessage: 'Sorry, you are not from the targeted users which have been set by the advertiser, so you can’t join the raffle of this ad.' }); } else if (result1.city != city) { res.send({ responseCode: 400, responseMessage: 'Sorry, you are not from the targeted users which have been set by the advertiser, so you can’t join the raffle of this ad.' }); } else {
                                            callback(null, result)
                                        }
                                    }
                                }
                            }
                        })
                    }
                })
            },
            function(adResult, callback) {
                if (adResult.adsType == 'cash') {
                    if (adResult.cash > 0) {
                        var type = "freeViewersPerCashAds";
                    } else {
                        var type = "brolixPerFreeCashAds";
                    }
                } else if (adResult.adsType == 'coupon') {
                    if (adResult.cash > 0) {
                        var type = "freeViewersPerCashAds";
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
                createNewAds.findOne({ _id: req.body.adId }, function(err, result) {
                    if (err) { res.send({ responseCode: 302, responseMessage: "Internal server error." }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "Please enter correct adId." }); } else {
                        console.log("result--->>", result.raffleCount)
                        var randomIndex = [];
                        var raffleCount = result.raffleCount;
                        var viewerLenght = result.viewerLenght;
                        var numberOfWinners = result.numberOfWinners;

                        var mySet = new Set(raffleCount);
                        var has = mySet.has(userId)
                        if (has) { res.send({ responseCode: 302, responseMessage: "You have already win this raffle." }) }
                        // else if (!has) raffleCount.push(userId);
                        else if (!has) {
                            raffleCount.push(userId);
                            User.findOneAndUpdate({ _id: req.body.userId }, { $inc: { brolix: value, brolixAds: value } }, { new: true }, function(err, result1) {
                                console.log("raffleCount--->>>" + raffleCount.length);
                            })

                            if (raffleCount.length != viewerLenght) {
                                createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $push: { raffleCount: req.body.userId } }, function(err, success) {
                                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error  11." }); } else {
                                        console.log("success-->>", success)
                                        var pageId = success.pageId;
                                        createNewPage.findByIdAndUpdate({ _id: pageId }, { $inc: { winnersCount: +1 } }, { new: true }).exec(function(err, result2) {
                                            console.log("result2-->", result2)
                                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 88' }); } else {
                                                console.log("in else")
                                            }
                                        })
                                    }
                                })
                                console.log("raffleCount--111->>>" + raffleCount.length);

                                callback(null, result.cashAdPrize, result.couponCode, result.hiddenGifts)
                            } else {

                                createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $push: { raffleCount: req.body.userId }, $set: { 'status': "EXPIRED", adExpired: true } }, function(err, success) {
                                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error 22." }); } else {
                                        res.send({
                                            responseCode: 200,
                                            responseMessage: "You have successfully win this raffle."
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
                console.log("cashPrize--->>", cashPrize)
                console.log("couponCode--->>", couponCode)
                console.log("hiddenGifts--->>", hiddenGifts)
                createNewAds.update({ _id: req.body.adId }, { $push: { winners: req.body.userId } }).lean().exec(function(err, result) {
                    if (err) { res.send({ responseCode: 302, responseMessage: "Something went wrongsssssss." }); } else {


                        var date = new Date();

                        createNewAds.findOneAndUpdate({ _id: req.body.adId }, function(err, result3) {
                            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error  33." }); } else {
                                //console.log("result3-->>", result3)
                                console.log("result.winners)--->>", result3.winners)
                                var winner = result3.winners.length;

                                if (result3.adsType == "cash") {
                                    var pageId = result3.pageId;

                                    var data = {
                                        cash: cashPrize,
                                        adId: req.body.adId,
                                        pageId: pageId
                                    }
                                    User.findOneAndUpdate({ _id: req.body.userId }, { $push: { cashPrize: data, gifts: req.body.adId }, "notification": { adId: req.body.adId, type: 'You have successfully won this raffle', notificationType: 'WinnerType' } }, { multi: true }, function(err, result) {
                                        console.log("result-->>", result)
                                        if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error  44." }); } else {
                                            if(result.deviceType  && result.notification_status  && result.status ){
                                            if (result.deviceType == 'Android' && result.notification_status == 'on' && result.status == 'ACTIVE') {
                                                var message = "You have successfully won this Raffle.";
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
                                                responseMessage: "Raffle is over"
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

                                        User.update({ _id: req.body.userId }, { $push: { coupon: data, hiddenGifts: data1, gifts: req.body.adId }, "notification": { adId: req.body.adId, type: 'You have successfully won this raffle', notificationType: 'WinnerType' } }, { multi: true }, function(err, result) {
                                            console.log("4")
                                            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error  55." }); } else {
                                                 if(result.deviceType  && result.notification_status  && result.status ){
                                                if (result.deviceType == 'Android' && result.notification_status == 'on' && result.status == 'ACTIVE') {
                                                    var message = "You have successfully won this Raffle.";
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
                                                    responseMessage: "Raffle is over."
                                                        //result: result
                                                })
                                            }
                                        })
                                    } else {
                                        console.log("else")
                                        User.update({ _id: req.body.userId }, { $push: { coupon: data, gifts: req.body.adId }, "notification": { adId: req.body.adId, type: 'You have successfully won this raffle', notificationType: 'WinnerType' } }, { multi: true }, function(err, result) {
                                            console.log("4")
                                            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error  55." }); } else {
                                                if(result.deviceType  && result.notification_status  && result.status ){
                                                if (result.deviceType == 'Android' && result.notification_status == 'on' && result.status == 'ACTIVE') {
                                                    var message = "You have successfully won this Raffle.";
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
                                                    responseMessage: "Raffle is over winner decided."
                                                        //result: result
                                                })
                                            }
                                        })
                                    }
                                }
                            }
                        });
                    }
                })
            }
        ])
    },


    //API for Follow and unfollow
    "adFollowUnfollow": function(req, res) {
        if (req.body.follow == "follow") {
            createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $push: { "adFollowers": req.body.userId } }, { new: true }).exec(function(err, results) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
                res.send({
                    result: results,
                    responseCode: 200,
                    responseMessage: "Followed"
                });
            })
        } else {
            createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $pop: { "adFollowers": -req.body.userId } }, { new: true }).exec(function(err, results) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                    res.send({
                        result: results,
                        responseCode: 200,
                        responseMessage: "Unfollowed"
                    });
                }
            })
        }
    },

    "couponWinners": function(req, res) {
        var pageNumber = Number(req.params.pageNumber)
        var limitData = pageNumber * 8;
        var skips = limitData - 8;
        var page = String(pageNumber);

        User.aggregate({ $unwind: "$coupon" }, { $match: { 'coupon.type': 'WINNER' } }).exec(function(err, result) {
            console.log("1")
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 11' }); } else if (result.length == 0) { res.send({ responseCode: 500, responseMessage: "No coupon winner found" }); } else {
                var count = 0;
                for (i = 0; i < result.length; i++) {
                    count++;
                }
                var pages = Math.ceil(count / 8);
                User.aggregate({ $unwind: "$coupon" }, { $match: { 'coupon.type': 'WINNER' } }, { $limit: limitData }, { $skip: skips }).exec(function(err, result1) {
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
                                    responseMessage: "All coupon winner shown successfully."
                                })
                            }
                        })
                    }
                })
            }
        })
    },

    "couponWinnersDateFilter": function(req, res) {
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
            User.aggregate({ $unwind: "$coupon" }, { $match: { 'coupon.type': 'WINNER', 'coupon.updateddAt': data } }).exec(function(err, result) {
                console.log("1")
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 11' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No coupon winner found" }); } else {
                    var count = 0;
                    for (i = 0; i < result.length; i++) {
                        count++;
                    }
                    var pages = Math.ceil(count / 8);
                    User.aggregate({ $unwind: "$coupon" }, { $match: { 'coupon.type': 'WINNER', 'coupon.updateddAt': data } }, { $limit: limitData }, { $skip: skips }).exec(function(err, result1) {
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
                                        responseMessage: "All coupon winner shown successfully."
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    },

    "cashWinnersDateFilter": function(req, res) {
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

            User.aggregate({ $unwind: "$cashPrize" }, { $match: { 'cashPrize.updateddAt': data } }).exec(function(err, result) {
                console.log("1")
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 11' }); } else if (result.length == 0) { res.send({ responseCode: 400, responseMessage: "No cash winner found" }); } else {
                    var count = 0;
                    for (i = 0; i < result.length; i++) {
                        count++;
                    }
                    var pages = Math.ceil(count / 8);
                    User.aggregate({ $unwind: "$cashPrize" }, { $match: { 'cashPrize.updateddAt': data } }, { $limit: limitData }, { $skip: skips }).exec(function(err, result1) {
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
                                        responseMessage: "All cash winner shown successfully."
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    },


    "cashWinners": function(req, res) {
        var pageNumber = Number(req.params.pageNumber)
        var limitData = pageNumber * 8;
        var skips = limitData - 8;
        var page = String(pageNumber);

        User.aggregate({ $unwind: "$cashPrize" }).exec(function(err, result) {
            console.log("1")
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 11' }); } else if (result.length == 0) { res.send({ responseCode: 400, responseMessage: "No cash winner found." }); } else {
                var count = 0;
                for (i = 0; i < result.length; i++) {
                    count++;
                }
                var pages = Math.ceil(count / 8);
                User.aggregate({ $unwind: "$cashPrize" }, { $limit: limitData }, { $skip: skips }).exec(function(err, result1) {
                    console.log("2")
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 22' }); } else if (result1.length == 0) { res.send({ responseCode: 400, responseMessage: "No cash winner found." }); } else {
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
                                    responseMessage: "All cash winner shown successfully."
                                })
                            }
                        })
                    }
                })
            }
        })
    },

    "tagOnads": function(req, res) {
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
                                $push: { "notification": { userId: req.body.senderId, type: "You are tagged on an ad", adId: req.body.adId, notificationType: 'tagOnAd', image: image } }
                            }, { new: true }).exec(function(err, result1) {
                                console.log("result1-->>", result1)
                                if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: "Please enter correct senderId" }); } else {
                                    console.log("res--1-->>", result1)
                                    if(result1.deviceType  && result1.notification_status  && result1.status ){
                                    if (result1.deviceType == 'Android' && result1.notification_status == 'on' && result1.status == 'ACTIVE') {
                                        var message = "You are taged in a ad";
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
                responseMessage: "Tag save with concerned User details."
            })
        })
    },

    "editAd": function(req, res) {
        createNewAds.update({ _id: req.params.id, $or: [{ userId: req.params.userId }, { 'adAdmin.userId': req.params.userId }] }, req.body, {
            new: true
        }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "Ad edit successfully."
            });
        });
    },

    "adsDateFilter": function(req, res) {
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
            createNewAds.paginate({ pageId: req.params.id, 'createdAt': data, adsType: type, status: 'ACTIVE' }, { page: req.params.pageNumber, limit: 8 }, function(err, result) {
                if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }) } else if (result.length == 0) { res.send({ responseCode: 400, responseMessage: "No ad found" }) } else {
                    var count = 0;
                    for (var i = 0; i < result.length; i++) {
                        count++;
                    }
                    res.send({
                        result: result,
                        count: count,
                        responseCode: 200,
                        responseMessage: "Result shown successfully."
                    })
                }
            })
        }
    },

    "particularPageCouponAdsFilter": function(req, res) {
        var status = req.body.status;
        createNewAds.find({ pageId: req.body.pageId, adsType: 'coupon' }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error." }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "Please enter correct pageId." }); } else {
                var adsArray = [];
                for (var i = 0; i < result.length; i++) {
                    adsArray.push(result[i]._id)
                }
                console.log("ads-->>", adsArray)
                createNewAds.paginate({ _id: { $in: adsArray }, status: { $in: status } }, { page: req.params.pageNumber, limit: 8 }, function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error." }); } else if (result1.length == 0) { res.send({ responseCode: 400, responseMessage: "Please enter correct adId." }); } else {
                        res.send({
                            result: result1,
                            responseCode: 200,
                            responseMessage: 'Success'
                        })
                    }
                })
            }
        })
    },

    "particularPageCashAdsFilter": function(req, res) {
        var status = req.body.status;
        createNewAds.find({ pageId: req.body.pageId, adsType: 'cash' }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error." }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "Please enter correct pageId." }); } else {
                var adsArray = [];
                for (var i = 0; i < result.length; i++) {
                    adsArray.push(result[i]._id)
                }
                console.log("ads-->>", adsArray)
                createNewAds.paginate({ _id: { $in: adsArray }, status: { $in: status } }, { page: req.params.pageNumber, limit: 8 }, function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error." }); } else if (result1.length == 0) { res.send({ responseCode: 400, responseMessage: "Please enter correct adId." }); } else {
                        res.send({
                            result: result1,
                            responseCode: 200,
                            responseMessage: 'Success'
                        })
                    }
                })
            }
        })
    },

    "couponFilter": function(req, res) {
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
        console.log("condition==>" + JSON.stringify(condition))
        createNewAds.find(condition).exec(function(err, result) {
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

    "couponGiftsFilter": function(req, res) {
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
                User.aggregate({ $unwind: "$coupon" }, { $match: { $and: [{ _id: { $in: userArray }, 'coupon.couponStatus': { $in: status }, 'coupon.status': 'ACTIVE' }] } }, function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (result1.length == 0) { res.send({ responseCode: 404, responseMessage: "No coupon found" }); } else {
                        User.populate(result1, {
                            path: 'coupon.pageId',
                            model: 'createNewPage',
                            select: 'pageName'
                        }, function(err, result2) {
                            User.populate(result1, {
                                path: 'coupon.adId',
                                model: 'createNewAds'
                            }, function(err, result3) {
                                res.send({
                                    result: result3,
                                    responseCode: 200,
                                    responseMessage: "result show successfully."
                                })
                            })
                        })
                    }
                })
            }
        })
    },

    "cashGiftsFilter": function(req, res) { // userId in req 
        var userId = req.body.userId;
        var status = req.body.cashStatus;
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
                createNewAds.find({ _id: { $in: array }, cashStatus: { $in: status } }, function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (result1.length == 0) { res.send({ responseCode: 404, responseMessage: "No ad found" }); } else {
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

    "storeCouponList": function(req, res) {
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
                createNewAds.paginate({ userId: { $ne: req.params.id }, sellCoupon: true, status: "ACTIVE" }, { page: req.params.pageNumber, limit: 8 }, function(err, result) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (result.docs.length == 0) { res.send({ responseCode: 404, responseMessage: "No coupon found" }); } else {
                        for (var i = 0; i < result.docs.length; i++) {
                            if (result.docs[i].cash == 0) {
                                result.docs[i].couponSellPrice = noDataValue
                            } else {
                                result.docs[i].couponSellPrice = dataValue
                            }
                        }
                        res.send({
                            result: result,
                            responseCode: 200,
                            responseMessage: "All coupon from store shown successfully."
                        })
                    }
                })
            }
        ])
    },

    "viewCoupon": function(req, res) {
        createNewAds.findOne({ _id: req.body.adId }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); }
            if (!result) { res.send({ responseCode: 404, responseMessage: "No ad found" }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Result show successfully."
                })
            }
        })
    },

    "PageCouponFilter": function(req, res) {
        waterfall([
            function(callback) {
                var condition = { $and: [] };
                var obj = req.body;
                Object.getOwnPropertyNames(obj).forEach(function(key, idx, array) {
                    //if (key == 'cashStatus' || key == 'couponStatus') {
                    var cond = { $or: [] };
                    if (key == "subCategory") {
                        for (data in obj[key]) {
                            cond.$or.push({ subCategory: obj[key][data] })
                        }
                        condition.$and.push(cond)
                    } else {
                        var tempCond = {};
                        tempCond[key] = obj[key];
                        condition.$and.push(tempCond)
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
                        callback(null, array)
                    }
                })
            },
            function(arrayId, callback) {
                console.log("arrayId=========>...", arrayId)
                createNewAds.paginate({ $and: [{ pageId: { $in: arrayId }, sellCoupon: true, status: 'ACTIVE' }] }, { page: req.params.pageNumber, limit: 10 }, function(err, result) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No result found." }) } else {
                        res.send({ responseCode: 200, responseMessage: "Success.", result: result })
                    }
                })
            }
        ])
    },


    "StoreFavCouponFilter": function(req, res) {
        waterfall([
            function(callback) {
                var condition = { $and: [] };
                var obj = req.body;
                Object.getOwnPropertyNames(obj).forEach(function(key, idx, array) {
                    if (!(key == 'userId')) {
                        var cond = { $or: [] };
                        if (key == "subCategory") {
                            for (data in obj[key]) {
                                cond.$or.push({ subCategory: obj[key][data] })
                            }
                            condition.$and.push(cond)
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
                        callback(null, array)
                    }
                })
            },
            function(arrayId, callback) {
                console.log("arrayId=========>...", arrayId)
                createNewAds.paginate({ $and: [{ pageId: { $in: arrayId }, sellCoupon: true, status: 'ACTIVE', favouriteCoupon: req.body.userId }] }, { page: req.params.pageNumber, limit: 10 }, function(err, result) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No result found." }) } else {
                        res.send({ responseCode: 200, responseMessage: "Success.", result: result })
                    }
                })
            }
        ])
    },

    "adsViewClick": function(req, res) {
        var startTime = new Date(req.body.date).toUTCString();
        var endTimeHour = req.body.date + 86399000;
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
            console.log("views r3sult==>>" + result)
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
                        responseMessage: "Clicks updated successfully."
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
                            responseMessage: "Clicks updated successfully."
                        });
                    } else {
                        res.send({
                            result: pageRes,
                            responseCode: 200,
                            responseMessage: "Clicks updated successfully."
                        });
                    }
                })
            }
        })
    },

    "adStatistics": function(req, res) {
        // var queryCondition = { $match: { $and: [{ date: { "$gte": new Date(req.body.startDate), "$lte": new Date(req.body.endDate) } }, { adId: req.body.adId }] } }
        // var queryConditionPage = { $match: { $and: [{ date: { "$gte": new Date(req.body.startDate), "$lte": new Date(req.body.endDate) } }, { pageId: req.body.pageId }] } }

        var queryCondition = { $match: { $and: [{ date: { "$gte": new Date(req.body.startDate), "$lte": new Date(req.body.endDate) } }, { adId: req.body.adId }] } }
        var queryConditionPage = { $match: { $and: [{ date: { "$gte": new Date(req.body.startDate), "$lte": new Date(req.body.endDate) } }, { pageId: req.body.pageId }] } }
        console.log("queryCondition" + JSON.stringify(queryCondition))
        waterfall([
            function(callback) {
                Views.aggregate([queryCondition, {
                    $group: {
                        _id: null,
                        pageView: { $sum: 0 },
                        viewAds: { $sum: 0 },
                        AdTag: { $sum: "$AdTag" },
                        socialShare: { $sum: "$socialShare" },
                        AdFollowers: { $sum: "$AdFollowers" },
                        useLuckCard: { $sum: "$useLuckCard" },
                        AdReport: { $sum: "$AdReport" },
                        GameDownloaded: { $sum: "$GameDownloaded" }
                    }
                }]).exec(function(err, result) {
                    if (err) {
                        res.send({
                            result: err,
                            responseCode: 404,
                            responseMessage: "error."
                        });
                    } else if (result.length == 0) {
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
                        pageView: { $sum: "$pageView" },
                        viewAds: { $sum: "$viewAds" }
                    }
                }]).exec(function(err, result) {
                    console.log("AdResult", AdResult)
                    console.log("result", result)
                    if (err) {
                        res.send({
                            result: err,
                            responseCode: 404,
                            responseMessage: "error."
                        });
                    } else if (result.length == 0) {
                        var data = [{
                            pageView: 0,
                            viewAds: 0
                        }]
                    } else {
                        AdResult[0].pageView = result[0].pageView;
                        AdResult[0].viewAds = result[0].viewAds;
                        res.send({
                            result: AdResult,
                            responseCode: 200,
                            responseMessage: "Success."
                        });
                    }
                })
            }
        ])
    },

    "adStatisticsFilterClick": function(req, res) {

        // var details = req.body;
        var data = req.body.click;

        switch (data) {
            case 'pageView':
                var updateData = { $match: { pageId: req.body.pageId } };
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
                    responseMessage: "Success."
                })
            });
    },

    "CouponAdStatistics": function(req, res) {
        var updateData = { $match: { adId: req.body.adId } };
        var groupCond = {
            $group: {
                _id: null,
                couponPurchased: { $sum: "$couponPurchased" }
            }
        }

        var updateDataVALID = { $match: { 'coupon.adId': req.body.adId, 'coupon.couponStatus': 'VALID' } };
        var updateUnwindDataVALID = { $unwind: "$coupon" };
        var groupCondVALID = {
            $group: {
                _id: null,
                validCoupon: { $sum: 1 }
            }
        }

        var updateDataUSED = { $match: { 'coupon.adId': req.body.adId, 'coupon.couponStatus': 'USED' } };
        var updateUnwindDataUSED = { $unwind: "$coupon" };
        var groupCondUSED = {
            $group: {
                _id: null,
                usedCoupon: { $sum: 1 }
            }
        }

        var updateDataEXPIRED = { $match: { 'coupon.adId': req.body.adId, 'coupon.couponStatus': 'EXPIRED' } };
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
                            responseMessage: 'Success.'
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
                            responseMessage: 'Success.'
                        });
                    }
                })
            }

        ])
    },


    "couponStatisticsYearClicks": function(req, res) {
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
        console.log("groupCond", JSON.stringify(groupCond))

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
                console.log("updateData==>.", updateData)
                console.log("groupCond==>.", updateData, groupCond)
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
                    responseMessage: 'success.'
                });
            }
        })
    },

    "CashAdStatistics": function(req, res) {

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
                    console.log("result", result)
                    if (err) { res.send({ result: err, responseCode: 404, responseMessage: "error." }); } else if (result.length == 0) {
                        var data = {
                            winnersLength: 0,
                            cashStatus: cashDelivered
                        }
                        res.send({
                            result: data,
                            responseCode: 200,
                            responseMessage: 'success.'
                        });
                    } else {
                        console.log(result)
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
                            responseMessage: 'success.'
                        });
                    }
                })
            }
        ])
    },

    "cashStatisticsYearClicks": function(req, res) {
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
                        console.log("results", results)
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
                    responseMessage: 'success.'
                });
            }
        })
    },

    "sortAds": function(req, res) {
        if (!req.body.adsType == 'coupon') {
            return res.json({ responseCode: 404, responseMessage: "Ads not Found." })
        } else {
            var array2 = [];
            createNewAds.paginate({ adsType: req.body.adsType }, { sort: { viewers: -1 } }).then(function(data) {
                var currentTime = (new Date).getTime();
                // console.log('currentTime',data)
                for (var i = 0; i <= data.docs.length - 1; i++) {
                    var array = [];
                    console.log("haanananna", i)
                    if (data.docs[i].expiryOfPriority != null && data.docs[i].expiryOfPriority - currentTime > 0) {
                        console.log("with priority ", data.docs[i]._id)
                        console.log("and prority", data.docs[i].priorityNumber)
                        var sigma = function() {
                            var array = data.docs;
                            if (array[i].priorityNumber >= array.length) {
                                var k = array[i].priorityNumber - data.length;
                                while ((k--) + 1) {
                                    array.push(undefined);
                                }
                            }
                            array.splice(array[i].priorityNumber, 0, array.splice(i, 1)[0]);
                            return array;
                        }();
                    } else {
                        console.log("sayng something ", i)
                        array2.push(data.docs[i]);
                    }
                }
                return res.json({ responseCode: 200, responseMessage: "Success", data: data })
            })
        }
    },

    "priority": function(req, res) {
        async.waterfall([
            function(callback) {
                createNewAds.paginate({ adsType: req.body.adsType }, { sort: { viewers: -1 } }, function(err, data) {
                    if (err) {
                        return res.json({ responseCode: 404, responseMessage: "Internal server error ." })
                    } else {
                        callback(null, data);
                    }
                })
            },
            function(data, callback) {
                var currentTime = (new Date).getTime();
                for (var i = 0; i <= data.docs.length - 1; i++) {
                    if (data.docs[i].priorityNumber == req.body.number) {
                        if (data.docs[i].expiryOfPriority - currentTime >= 0) {
                            return res.json({ responseCode: 400, responseMessage: "At this place already a ads exist.", timeleft: currentTime - data.docs[i].expiryOfPriority, docs: data.docs[i], currentTime: currentTime })
                        }
                    } else {
                        console.log('.')
                    }
                }
                callback(null, data)
            },
            function(data, callback) {

                createNewAds.findOneAndUpdate({ _id: req.body.adsId }, { $set: { expiryOfPriority: req.body.time, priorityNumber: req.body.number } }, { new: true }, function(err, result) {
                    console.log("datataataya------------->>>>>>", result)
                    if (err) {
                        return res.json({ responseCode: 404, responseMessage: "Internal server error." })
                    } else {
                        // console.log("asgdhasd--------->>")
                        var number = req.body.number;
                        console.log("length--------->>", data.docs.length)
                            // console.log("asghdhasgdhasgdkagsdkasdjkasdks------------->>>>>",data.docs[0]._id)
                        for (var i = 0; i < data.docs.length; i++) {
                            if (data.docs[i]._id == req.body.adsId) {
                                console.log("asgdhasdsadasdasd--------->>", i)
                                if (number >= data.docs.length) {
                                    var k = number - data.docs.length;
                                    while ((k--) + 1) {
                                        data.docs.push(undefined);
                                    }
                                }
                                // console.log("above data",data)
                                data.docs.splice(number, 0, data.docs.splice(i, 1)[0]);
                                console.log("ahsgdhsg-------->", data.docs)

                                // return data.docs;
                            }

                        }
                        callback(null, data.docs)
                    }
                })
            }
        ], function(err, data) {
            if (err) {
                return res.json({ responseCode: 404, responseMessage: "Internal server error." })
            } else {
                return res.json({ responseCode: 200, responseMessage: "Success", result: data })
            }
        })

    },

    "homepageAds": function(req, res) {
        waterfall([
            function(callback) {
                var priorityNumber = req.body.priorityNumber;
                createNewAds.find({}).exec(function(err, result) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 400, responseMessage: 'No ad found' }); } else {
                        var flag = false;
                        for (var i = 0; i < result.length; i++) {
                            if (result[i].priorityNumber == req.body.priorityNumber) {
                                var flag = true;
                            }
                        }
                        if (flag == false) {
                            callback(null);
                        } else {
                            res.send({ responseCode: 400, responseMessage: 'Already an ad exists at this place.' });
                        }
                    }
                })
            },
            function(callback) {
                var priorityNumber = req.body.priorityNumber;
                var expiryOfPriority = req.body.expiryOfPriority;
                var startTime = new Date().toUTCString();
                var h = new Date(new Date(startTime).setHours(00)).toUTCString();
                var m = new Date(new Date(h).setMinutes(00)).toUTCString();
                var s = Date.now(m)
                var coupanAge = priorityNumber;
                var actualTime = parseInt(s) + parseInt(coupanAge);
                console.log("coupanAge--->>", coupanAge)
                createNewAds.findOne({ _id: req.body.adId }).exec(function(err, result1) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: 'Please enter correct adId' }); } else {
                        createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $set: { priorityNumber: priorityNumber, expiryOfPriority: actualTime } }, { new: true }).exec(function(err, result2) {
                            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result2) { res.send({ responseCode: 404, responseMessage: 'Please enter correct adId' }); } else {
                                callback(null, result2)
                            }
                        })
                    }
                })
            },
        ], function(err, result) {
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: 'success.'
            });
        })
    },


    "storeCouponPrice": function(req, res) {
        createNewAds.findOne({ _id: req.params.id }, function(err, result) {
            console.log("result--->>>", result)
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
                            responseMessage: 'Successfully show price for coupon.'
                        })
                    }
                })
            }
        })
    },

    "updateCash": function(req, res) {
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
                    responseMessage: "Cash updated successfully."
                });
            }
        })
    }




}
