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

cloudinary.config({
    cloud_name: 'mobiloitte-in',
    api_key: '188884977577618',
    api_secret: 'MKOCQ4Dl6uqWNwUjizZLzsxCumE'
});
var avoid = {
    "password": 0
}
module.exports = {

    "createAds": function(req, res) {
        if (req.body.adsType == "coupon") {
            var couponCode = voucher_codes.generate({ length: 6, count: 1, charset: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" });
            req.body.couponCode = couponCode;
            req.body.viewerLenght = 2;
            req.body.couponStatus = 'VALID';
            var Ads = new createNewAds(req.body);
            Ads.save(function(err, result) {
                if (err) { res.send({ responseCode: 409, responseMessage: err }); } else {
                    createNewPage.findOneAndUpdate({ _id: req.body.pageId }, { $inc: { adsCount: 1 } }, { new: true }).exec(function(err, result1) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                            res.send({ result: result, responseCode: 200, responseMessage: "Ad created successfully" });
                        }
                    })
                }
            })
        } else {
            User.findOne({ _id: req.body.userId }).exec(function(err, result) {
                console.log("result-->>", result)
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result.cash == null || result.cash == 0 || result.cash === undefined || result.cash <= req.body.cashAdPrize) {
                    res.send({ responseCode: 201, responseMessage: "Insufficient cash" });
                } else {
                    User.findByIdAndUpdate({ _id: req.body.userId }, { $inc: { cash: -req.body.cashAdPrize } }, { new: true }).exec(function(err, result) {
                        req.body.viewerLenght = 2;
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
        createNewAds.paginate({ userId: { $ne: req.params.id }, adsType: "coupon", $or: [{ status: "ACTIVE" }, { status: "EXPIRED" }] }, { page: req.params.pageNumber, limit: 8 }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Data Show successfully"
                })
            }
        })
    },

    // show all ads
    "showAllAdsCashType": function(req, res) {
        createNewAds.paginate({ userId: { $ne: req.params.id }, adsType: "cash", $or: [{ status: "ACTIVE" }, { status: "EXPIRED" }] }, { page: req.params.pageNumber, limit: 8 }, function(err, result) {
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

    "listOfAllAds": function(req, res) { // for a single user
        if (req.params.type == "all") {
            var data = { pageId: req.params.id }
        } else {
            var data = { pageId: req.params.id, adsType: req.params.type }
        }
        createNewAds.paginate(data, { page: req.params.pageNumber, limit: 8 }, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                createNewPage.findOne({
                    _id: req.params.id,
                    userId: req.params.userId
                }).exec(function(err, results) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }) }
                    if (!results) {
                        createNewPage.findOneAndUpdate({ _id: req.params.id }, { $inc: { pageView: 1 } }).exec(function(err, pageRes) {
                            res.send({
                                // couponType: couponType,
                                // cashType: cashType,
                                result: result,
                                responseCode: 200,
                                responseMessage: "All ads shown cash type and coupon type."
                            });
                        })
                    } else {
                        res.send({
                            // couponType: couponType,
                            // cashType: cashType,
                            result: result,
                            responseCode: 200,
                            responseMessage: "All ads shown cash type and coupon type."
                        });
                    }
                })
            }
        });
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
                createNewAds.findOne({ _id: req.body.adId }, function(err, result) {
                    if (err) { res.send({ responseCode: 302, responseMessage: "Something went wrong." }); } else if (result.winners.length != 0) return res.send({ responseCode: 406, responseMessage: "Winner allready decided" });
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
                        User.findOneAndUpdate({ _id: req.body.userId }, { $inc: { brolix: 50 } }, { new: true }, function(err, result1) {

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
                })
            },
            function(winners, cashPrize, couponCode, hiddenGifts, callback) {
                console.log("winners----->>>>", winners)
                createNewAds.update({ _id: req.body.adId }, { $push: { winners: { $each: winners } } }).lean().exec(function(err, result) {
                    if (err) { res.send({ responseCode: 302, responseMessage: "Something went wrongsssssss." }); } else {

                        var date = new Date();

                        createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $set: { 'status': "EXPIRED", updatedAt: date } }, function(err, result3) {
                            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error  33." }); } else {

                                if (result3.adsType == "cash") {
                                    var pageId = result3.pageId;

                                    var data = {
                                        cash: cashPrize,
                                        adId: req.body.adId,
                                        pageId: pageId
                                    }
                                    User.update({ _id: { $in: winners } }, { $push: { cashPrize: data }, $inc: { gifts: 1 } }, { multi: true }, function(err, result) {

                                        if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error  44." }); } else {

                                            // functions.iOS_notification();
                                            // functions.android_notification();

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
                                    var data = {
                                        couponCode: couponCode,
                                        expirationTime: actualTime,
                                        adId: req.body.adId,
                                        pageId: pageId,
                                        type: "WINNER"
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
                                            User.update({ _id: { $in: winners[i] } }, { $push: { coupon: data, hiddenGifts: data1 }, $inc: { gifts: 1 } }, { multi: true }, function(err, result) {
                                                console.log("4")
                                                if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error  55." }); } else {
                                                    count += i;
                                                    if ((i * i) == count) {
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
                                        User.update({ _id: { $in: winners } }, { $push: { coupon: data }, $inc: { gifts: 1 } }, { multi: true }, function(err, result) {
                                            console.log("4")
                                            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error  55." }); } else {
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
                                // var obj = result[0].coupon;
                                // var data = obj.filter(obj => obj.type == "ACTIVE");
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
        createNewAds.findOneAndUpdate({ _id: req.body.adId }, {
            $push: { "tag": { userId: req.body.userId, senderId: req.body.senderId } }
        }, { new: true }).exec(function(err, results) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                res.send({
                    result: results,
                    responseCode: 200,
                    responseMessage: "Tag save with concerned User details."
                });
            }
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
                responseMessage: "Ad edit."
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

    // "searchAds": function(req, res) {
    //     var condition = { $and: [] };
    //     var obj = req.body;
    //     Object.getOwnPropertyNames(obj).forEach(function(key, idx, array) {
    //         if (key == 'status') {
    //             var cond = { $or: [] };

    //             if (key == "status") {
    //                 for (data in obj[key]) {
    //                     cond.$or.push({ status: obj[key][data] })
    //                 }
    //                 condition.$and.push(cond)
    //             }
    //         } else {
    //             var tempCond = {};
    //             tempCond[key] = req.body[key];
    //             condition.$and.push(tempCond)
    //                 //condition[key] = obj[key];
    //         }
    //     });
    //     if (condition.$and.length == 0) {
    //         delete condition.$or;
    //     }
    //     console.log("condition==>" + JSON.stringify(condition))
    //     createNewAds.paginate(condition, { page: req.params.pageNumber, limit: 10 }, function(err, result) {
    //         if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
    //             res.send({
    //                 result: result,
    //                 responseCode: 200,
    //                 responseMessage: "Result shown successfully."
    //             })
    //         }
    //     })
    // },

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
        createNewAds.paginate({ sellCoupon: true, status: "ACTIVE" }, { page: req.params.pageNumber, limit: 8 }, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (result.docs.length == 0) { res.send({ responseCode: 404, responseMessage: "No coupon found" }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "All coupon from store shown successfully."
                })
            }
        })
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
                        responseMessage: "Successfully update clicks."
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
                            responseMessage: "Successfully update clicks."
                        });
                    } else {
                        res.send({
                            result: pageRes,
                            responseCode: 200,
                            responseMessage: "Successfully update clicks."
                        });
                    }
                })
            }
        })
    },

    "adStatistics": function(req, res) {
        var queryCondition = {$match :{$and: [{date: { "$gte": new Date(req.body.startDate), "$lte": new Date(req.body.endDate) } },{adId: req.body.adId}] }}
         var queryConditionPage = {$match :{$and: [{date: { "$gte": new Date(req.body.startDate), "$lte": new Date(req.body.endDate) } },{pageId: req.body.pageId}] }}
        console.log("queryCondition" + JSON.stringify(queryCondition))
        waterfall([
            function(callback){
                Views.aggregate([queryCondition,{
                    $group: {
                        _id: null,
                        pageView:{ $sum: 0 },
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
                    }
                    else{
                           callback(null, result)
                    }
                })
            },
            function(AdResult, callback){
                Views.aggregate([queryConditionPage,{
                    $group: {
                        _id: null,
                        pageView:  {$sum: "$pageView" },
                        viewAds: {$sum: "$viewAds" }              
                    }
                }]).exec(function(err, result) {
                    console.log("AdResult",AdResult)
                    console.log("result",result)
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
                    }
                    else{
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
                var updateData = {$match:{pageId: req.body.pageId}};
                var groupCond = { $group : { 
                   _id : { year: { $year : "$date" }, month: { $month : "$date" }}, 
                        pageView:{ $sum: "$pageView" },
                        viewAds:{ $sum: 0},
                        AdTag:{ $sum: 0 },
                        socialShare:{ $sum: 0 },
                        AdFollowers:{ $sum: 0},
                        useLuckCard:{ $sum: 0 },
                        AdReport:{ $sum: 0 },
                        GameDownloaded:{ $sum: 0 }
                    }}
                break;
            case 'viewAds':
                var updateData = {$match:{pageId: req.body.pageId}};
                var groupCond = { $group : { 
                   _id : { year: { $year : "$date" }, month: { $month : "$date" }}, 
                        pageView:{ $sum: 0},
                        viewAds:{ $sum: "$viewAds"},
                        AdTag:{ $sum: 0 },
                        socialShare:{ $sum: 0 },
                        AdFollowers:{ $sum: 0},
                        useLuckCard:{ $sum: 0 },
                        AdReport:{ $sum: 0 },
                        GameDownloaded:{ $sum: 0 }
                    }}
                break;
            case 'AdTag':
                 var updateData = {$match:{adId: req.body.adId}};
                 var groupCond = { $group : { 
                   _id : { year: { $year : "$date" }, month: { $month : "$date" }}, 
                        pageView:{ $sum: 0},
                        viewAds:{ $sum: 0},
                        AdTag:{ $sum: "$AdTag" },
                        socialShare:{ $sum: 0 },
                        AdFollowers:{ $sum: 0},
                        useLuckCard:{ $sum: 0 },
                        AdReport:{ $sum: 0 },
                        GameDownloaded:{ $sum: 0 }
                    }}
                break;
            case 'socialShare':
                var updateData = {$match:{adId: req.body.adId}};
                 var groupCond = { $group : { 
                   _id : { year: { $year : "$date" }, month: { $month : "$date" }}, 
                        pageView:{ $sum: 0},
                        viewAds:{ $sum: 0},
                        AdTag:{ $sum: 0 },
                        socialShare:{ $sum: "$socialShare"},
                        AdFollowers:{ $sum: 0},
                        useLuckCard:{ $sum: 0 },
                        AdReport:{ $sum: 0 },
                        GameDownloaded:{ $sum: 0 }
                    }}
                break;
            case 'AdFollowers':
                var updateData = {$match:{adId: req.body.adId}};
                  var groupCond = { $group : { 
                   _id : { year: { $year : "$date" }, month: { $month : "$date" }}, 
                        pageView:{ $sum: 0},
                        viewAds:{ $sum: 0},
                        AdTag:{ $sum: 0 },
                        socialShare:{ $sum: 0 },
                        AdFollowers:{ $sum: "$AdFollowers"},
                        useLuckCard:{ $sum: 0 },
                        AdReport:{ $sum: 0 },
                        GameDownloaded:{ $sum: 0 }
                    }}
                break;
            case 'useLuckCard':
                var updateData = {$match:{adId: req.body.adId}};
                  var groupCond = { $group : { 
                   _id : { year: { $year : "$date" }, month: { $month : "$date" }}, 
                        pageView:{ $sum: 0},
                        viewAds:{ $sum: 0},
                        AdTag:{ $sum: 0 },
                        socialShare:{ $sum: 0 },
                        AdFollowers:{ $sum: 0},
                        useLuckCard:{ $sum: "$useLuckCard"},
                        AdReport:{ $sum: 0 },
                        GameDownloaded:{ $sum: 0 }
                    }}
                break;
            case 'AdReport':
                var updateData = {$match:{adId: req.body.adId}};
                var groupCond = { $group : { 
                   _id : { year: { $year : "$date" }, month: { $month : "$date" }}, 
                        pageView:{ $sum: 0},
                        viewAds:{ $sum: 0},
                        AdTag:{ $sum: 0 },
                        socialShare:{ $sum: 0 },
                        AdFollowers:{ $sum: 0},
                        useLuckCard:{ $sum: 0 },
                        AdReport:{ $sum: "$AdReport"},
                        GameDownloaded:{ $sum: 0 }
                    }}
                break;
            case 'GameDownloaded':
                var updateData = {$match:{adId: req.body.adId}};
                var groupCond = { $group : { 
                   _id : { year: { $year : "$date" }, month: { $month : "$date" }}, 
                        pageView:{ $sum: 0},
                        viewAds:{ $sum: 0},
                        AdTag:{ $sum: 0 },
                        socialShare:{ $sum: 0 },
                        AdFollowers:{ $sum: 0},
                        useLuckCard:{ $sum: 0 },
                        AdReport:{ $sum: 0 },
                        GameDownloaded:{ $sum: "$GameDownloaded" }
                    }}
            break;
        }

        var newDate = new Date(req.body.date).getFullYear();


        Views.aggregate(updateData,groupCond, 
              function (err, results){
                //var yearData = 2017
                var data =results.filter(results=>results._id.year == newDate)
                results =data;
                var array = [];
                var flag = false;
                for(var i=1; i<=12; i++){
                    console.log("Dfdgf",i)
                    for(var j = 0; j<results.length; j++){
                        if(i == results[j]._id.month){
                            console.log("value of j==>",j)
                            flag = true;
                            break;
                        }
                        else{
                            flag = false;
                        }
                    }
                    if(flag==true){
                        array.push(results[j])
                    }
                    else{
                        var data ={
                                _id:
                                {
                                    year: 2017,
                                    month: i
                                },
                                pageView:0,
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


}
