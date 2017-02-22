var createNewAds = require("./model/createNewAds");
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
            req.body.viewerLenght = 5;
            req.body.couponStatus = 'valid';
            var Ads = new createNewAds(req.body);
            Ads.save(function(err, result) {
                if (err) { res.send({ responseCode: 409, responseMessage: err }); } else {
                    res.send({ result: result, responseCode: 200, responseMessage: "Ad created successfully" });
                }
            })
        } else {
            User.findOne({ _id: req.body.userId }).exec(function(err, result) {
                console.log("result-->>", result)
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result.cash == null || result.cash == 0 || result.cash === undefined || result.cash <= req.body.cashAdPrize) {
                    res.send({ responseCode: 201, responseMessage: "Insufficient cash" });
                } else {
                    User.findByIdAndUpdate({ _id: req.body.userId }, { $inc: { cash: -req.body.cashAdPrize } }, { new: true }).exec(function(err, result) {
                        //req.body.viewerLenght = 1000;
                        req.body.cashStatus = 'pending';
                        var Ads = new createNewAds(req.body);
                        Ads.save(function(err, result) {
                            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
                            res.send({ result: result, responseCode: 200, responseMessage: "Ad created successfully" });
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
                // var couponType = result.docs.filter(result => result.adsType == "coupon");
                // var cashType = result.docs.filter(result => result.adsType == "cash");
                res.send({
                    // couponType: couponType,
                    // cashType: cashType,
                    result: result,
                    responseCode: 200,
                    responseMessage: "All ads shown cash type and coupon type."
                });
            }

        });
    },

    "uploads": function(req, res) {
        console.log(req.body.images)
        var form = new multiparty.Form();
        form.parse(req, function(err, fields, files) {
            var img = files.images[0];
            var fileName = files.images[0].originalFilename;
            cloudinary.uploader.upload(img.path, function(result) {
                res.send({
                    result: result.url,
                    responseCode: 200,
                    responseMessage: "File uploaded successfully."
                });
            }, {
                resource_type: "auto",
                chunk_size: 6000000
            });
        })
    },

    "viewAd": function(req, res) { //req.body.userId, adId
        var userId = req.body.userId;
        waterfall([
            function(callback) {
                createNewAds.findOne({ _id: req.body.adId }, function(err, result) {
                    console.log("result--->>", result)
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
                                if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error  11." }); } else {}

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
                            callback(null, randomIndex, result.cashAdPrize, result.couponCode)
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
            function(winners, cashPrize, couponCode, callback) {
                createNewAds.update({ _id: req.body.adId }, { $push: { winners: { $each: winners } } }).lean().exec(function(err, result) {
                    if (err) { res.send({ responseCode: 302, responseMessage: "Something went wrongsssssss." }); } else {

                        var date = new Date();

                        createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $set: { 'status': "EXPIRED", updatedAt: date } }, function(err, result3) {
                            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error  33." }); } else {

                                if (result3.adsType == "cash") {

                                    var data = {
                                        cash: cashPrize,
                                        adId: req.body.adId
                                    }
                                    User.update({ _id: { $in: winners } }, { $push: { cashPrize: data }, $inc: { gifts: 1 } }, { multi: true }, function(err, result) {

                                        if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error  44." }); } else {
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
                                    var coupanAge = result3.couponExpiryDate;
                                    var actualTime = parseInt(s) + parseInt(coupanAge);
                                    var data = {
                                        couponCode: couponCode,
                                        expirationTime: actualTime,
                                        adId: req.body.adId
                                    }
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
                        });
                    }
                })
            }
        ])
    },

    //API for Follow and unfollow
    "adFollowUnfollow": function(req, res) {
        if (req.body.follow == "follow") {
            User.findOneAndUpdate({ _id: req.body.userId }, { $push: { "adFollowers": { adId: req.body.adId } } }, { new: true }).exec(function(err, results) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
                res.send({
                    result: results,
                    responseCode: 200,
                    responseMessage: "Followed"
                });
            })
        } else {
            User.findOneAndUpdate({ _id: req.body.userId }, { $pop: { "adFollowers": { adId: req.body.adId } } }, { new: true }).exec(function(err, results) {
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
        createNewAds.find({ adsType: "coupon" }).exec(function(err, result) {
            var array = [];
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                var count = 0;
                for (i = 0; i < result.length; i++) {
                    for (j = 0; j < result[i].winners.length; j++) {
                        array.push(result[i].winners[j]);
                        count++;
                        console.log("count--", count)
                    }
                }
                console.log("count-->>>", count)
                User.paginate({ _id: { $in: array } }, { page: req.params.pageNumber, limit: 8 }, function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else {
                        res.send({
                            result: result1,
                            responseCode: 200,
                            count: count,
                            responseMessage: "All coupon winner shown successfully."
                        })
                    }
                })
            }
        })
    },

    "cashWinners": function(req, res) {
        createNewAds.find({ adsType: "cash" }).exec(function(err, result) {
            var array = [];
            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else {
                var count = 0;
                for (var i = 0; i < result.length; i++) {
                    for (var j = 0; j < result[i].winners.length; j++) {
                        array.push(result[i].winners[j]);
                        count++;
                    }
                }
                console.log("count-->>", count)
                User.paginate({ _id: { $in: array } }, { page: req.params.pageNumber, limit: 8 }, function(err, result) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else {
                        res.send({
                            result: result,
                            responseCode: 200,
                            count: count,
                            responseMessage: "All cash winner shown successfully."
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
        var startDate = req.body.startDate;
        var endDate = req.body.endDate;
        console.log("startDate--->>", startDate)
        console.log("endDate--->>", endDate)
        createNewAds.find({ 'createdAt': { $gte: startDate, $lte: endDate }, status: 'ACTIVE' }).sort({ pageName: -1 }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: "err" }) } else {
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
    },

    "searchAds": function(req, res) {
        var condition = { $and: [] };
        if (req.body.adsType == 'all') {
            var obj = {
                $or: [{ adsType: 'cash' }, { adsType: 'coupon' }]
            }
            condition.$and.push(obj);
        } else {
            var obj = {
                adsType: req.body.adsType
            }
            condition.$and.push(obj);
        }

        if (req.body.status == 'all') {
            var obj = {
                $or: [{ status: 'ACTIVE' }, { status: 'EXPIRED' }]
            }
            condition.$and.push(obj);
        } else {
            var obj = {
                status: req.body.status
            }
            condition.$and.push(obj);
        }

        createNewAds.find(condition).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Result shown successfully."
                })
            }
        })
    },


    "couponFilter": function (req, res){
          var condition = { $or: [] };
          var obj = req.body;
           console.log("obj--->>",obj)
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
              }  else {
                  condition[key] = obj[key];
              }
          });
          if (condition.$or.length == 0) {
              delete condition.$or;
          }
          console.log("condition--->>",condition)
          createNewAds.find(condition).exec(function(err, result) {
            // console.log("result--->>",result)
              if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
              else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No result found."}) }
               else {
                  res.send({
                      result: result,
                      responseCode: 200,
                      responseMessage: "Result shown successfully."
                  })
              }
          })

    }


}
