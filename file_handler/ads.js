var createNewAds = require("./model/createNewAds");
var User = require("./model/user");
var functions = require("./functionHandler");
var voucher_codes = require('voucher-code-generator');
var CronJob = require('cron').CronJob;
var cloudinary = require('cloudinary');
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })
var fs = require('fs');
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
        // Api for create Ads
        "createAds": function(req, res) {
            if (req.body.adsType == "coupon") {
                var couponCode = voucher_codes.generate({ length: 6, count: 1, charset: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" });
                req.body.couponCode = couponCode;
                req.body.viewerLenght = 100;
                var Ads = new createNewAds(req.body);
                Ads.save(function(err, result) {
                    if (err) { res.send({ responseCode: 409, responseMessage: err }); } else {
                        res.send({ result: result, responseCode: 200, responseMessage: "Ad created successfully" });
                    }
                })
            }  else {
                   User.findOne({ _id: req.body.userId }).exec(function(err, result) {
                    if (result.cash == null || result.cash == 0 || result.cash === undefined || result.cash <= req.body.cashAdPrize) {
                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
                        res.send({ responseCode: 200, responseMessage: "Insufficient cash" });
                    } else {
                        User.findByIdAndUpdate({ _id: req.body.userId }, { $inc: { cash: -req.body.adsCash } }, { new: true }).exec(function(err, result) {
                            req.body.viewerLenght = 1000;
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
        // show all ads
        "showAllAdsData": function(req, res) {
            createNewAds.paginate({ status: "ACTIVE" }, { page: req.params.pageNumber, limit: 8 }, function(err, result) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Data Show successfully"
                })
            })
        },
<<<<<<< HEAD
=======
        // Api For Video Count
        // "videoCount": function(req, res) {
        //     User.findOne({ _id: req.body.userId, viewedAd: req.body.adId }, function(err, result) {
        //         if (err) res.status(500).send(err);
        //         else if (!result) {
        //             createNewAds.findOneAndUpdate({ _id: req.body.adId }, {
        //                 $inc: { count: 1 }
        //             }, function(err, data) {
        //                 if (err) res.status(500).send(err);
        //                 else {
        //                     User.findOneAndUpdate({ _id: req.body.userId }, {
        //                         $push: { viewedAd: req.body.adId }
        //                     }, function(err, user) {
        //                         res.status(200).send({ responseMessage: "success" });
        //                     })
        //                 }
        //             })
        //         } else {
        //             res.status(200).send({ responseMessage: "already Watched" });
        //         }
        //     })
        // },


        // Api For Join A Raffle
        // "raffleJoin": function(req, res) {
        //     console.log("request---->>>" + JSON.stringify(req.body));
        //     createNewAds.findOne({ _id: req.body.adId, raffleCount: req.body.userId }, function(err, result) {
        //         if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error 1' }); }
        //         if (result) { res.status(200).send({ responseMessage: "allready watched" }); } else {
        //             User.findOneAndUpdate({ _id: req.body.userId }, { $inc: { brolix: 50 } }, function(err, data) {
        //                 if (err) { res.send({ responseCode: 409, responseMessage: err }); } else {
        //                     createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $push: { raffleCount: req.body.userId } }, { new: true }).exec(function(err, user) {
        //                         if (user.raffleCount.length > 3) {
        //                             var arr1 = user.raffleCount,
        //                                 randomIndex = [],
        //                                 a = 0;
        //                             for (var i = 0; i < user.luckCardListObject.length; i++) {
        //                                 for (var j = 0; j < user.luckCardListObject[i].chances; j++) {
        //                                     arr1.push(user.luckCardListObject[i].userId);
        //                                 }
        //                             }
        //                             console.log("arr111----->", arr1);
        //                             for (var i = 0; i < 3; i++) {
        //                                 var index = Math.floor(Math.random() * arr1.length);
        //                                 if (randomIndex.filter(randomIndex => randomIndex != arr1[index])) {
        //                                     randomIndex.push(arr1[index])
        //                                 }
        //                             }
        //                             console.log("randomIndex winners id--->" + randomIndex);
        //                             for (var i = 0; i < 3; i++) {
        //                                 createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $push: { winners: randomIndex[i] } }, { new: true }).exec(function(err, result1) {
        //                                     if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error 3' }); } else {
        //                                         console.log("value of i--->", i);
        //                                         a += 2
        //                                         if (a == 2) res.status(200).send({ responseMessage: "winner declared", result1: result1 })
        //                                     }
        //                                 })
        //                             }
        //                         } else {
        //                             res.status(200).send({ responseMessage: "successfully joined the raffle" });
        //                         }
        //                     })
        //                 }
        //             })
        //         }
        //     })
        // },


>>>>>>> deepak
        "raffleJoin": function(req, res) {
            waterfall([
                function(callback) {
                    User.findOne({ _id: req.body.userId, viewedAd: req.body.adId }, function(err, result) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) {
                            createNewAds.findOneAndUpdate({ _id: req.body.adId }, {
                                $inc: { count: 1 }
                            }, function(err, data) {
                                if (err) res.status(500).send(err);
                                else {

                                    User.findOneAndUpdate({ _id: req.body.userId }, {
                                        $push: { viewedAd: req.body.adId }
                                    }, function(err, user) {
                                        //res.status(200).send({ msg: "success" });
                                        callback(null)
                                    })
                                }
                            })
                        } else {
                            res.status(200).send({ msg: "Already watched ad" });
                        }
                    })
                },
                function(callback) {
                    createNewAds.findOne({ _id: req.body.adId, raffleCount: req.body.userId }, function(err, result) {
                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                            User.findOneAndUpdate({ _id: req.body.userId }, { $inc: { brolix: 50 } }, function(err, data) {
                                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                                    createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $push: { raffleCount: req.body.userId } }, { new: true }).exec(function(err, user) {
                                        if (user.raffleCount.length >= user.viewerLenght) {
                                            var arr1 = user.raffleCount,
                                                randomIndex = [],
                                                a = 0;
                                            for (var i = 0; i < user.luckCardListObject.length; i++) {
                                                for (var j = 0; j < user.luckCardListObject[i].chances; j++) {
                                                    arr1.push(user.luckCardListObject[i].userId);
                                                }
                                            }
                                            console.log("arr111----->", arr1);
                                            for (var i = 0; i < user.numberOfWinners; i++) {
                                                var index = Math.floor(Math.random() * arr1.length);
                                                if (randomIndex.filter(randomIndex => randomIndex != arr1[index])) {
                                                    randomIndex.push(arr1[index])
                                                }
                                            }
                                            console.log("randomIndex winners id--->" + randomIndex);

                                            for (var i = 0; i < user.numberOfWinners; i++) {
                                                createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $push: { winners: randomIndex[i] } }, { new: true }).exec(function(err, result1) {
                                                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                                                        console.log("value of i--->", i);
                                                        a += user.numberOfWinners - 1
                                                        if (a == user.numberOfWinners - 1) //res.status(200).send({ responseMessage: "winner declared", result1: result1 })
                                                            callback(null, result1)
                                                    }

                                                })

                                            }
                                        } else {
                                            res.status(200).send({ responseMessage: "Successfully joined the raffle" });

                                        }
                                    })
                                }
                            })
                        }
                    })
                }

            ], function(err, result) {
                res.status(200).send({ responseMessage: "Winner declared", result: result })
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
                createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $push: { like: req.body.userId } }, { new: true }).exec(function(err, results) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                        res.send({
                            results: results,
                            responseCode: 200,
                            responseMessage: "Liked"
                        });
                    }
                })
            } else {
                createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $pop: { like: req.body.userId } }, { new: true }).exec(function(err, results) {
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
            console.log("request----->>>" + JSON.stringify(req.body))
            createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $push: { "socailShareListObject": { userId: req.body.userId, link: req.body.link } } }, { new: true }, function(err, result) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                    res.send({
                        result: result,
                        responseCode: 200,
                        responseMessage: "Post saved successfully"
                    })
                }
            })
        },

        "upgradeCard": function(req, res) {
            var viewers;
            var upgrade = req.body.brolix / 5;
            if (upgrade % 50 == 0) {
                viewers = upgrade;
            }
            createNewAds.findOne({ _id: req.body.adId }, function(err, data) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!data) return res.status(404).send({ responseMessage: "please enter correct adId" });
                else if (Boolean(data.upgradeCardListObjectupgradeCardListObject.find(upgradeCardListObject => upgradeCardListObject.userId == req.body.userId))) {
                    return res.status(403).send({ responseMessage: "Already used upgradeCard" })
                } else {
                    User.findOne({ _id: req.body.userId, }, function(err, result) {
                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) return res.status(404).send({ responseMessage: "please enter userId" })
                        else if (result.brolix <= req.body.brolix) { res.send({ responseCode: 400, responseMessage: "Insufficient amount of brolix in your account" }); } else {
                            createNewAds.findByIdAndUpdate({ _id: req.body.adId }, { $push: { "upgradeCardListObject": { userId: req.body.userId, brolix: req.body.brolix, viewers: viewers } } }, { new: true }).exec(function(err, user) {
                                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                                    result.brolix -= req.body.brolix;
                                    result.save();
                                    res.status(200).send({ responseMessage: "successfully used the upgrade card" });
                                }
                            })
                        }
                    })
                }
            })
        },

        "winners": function(req, res) {
            createNewAds.find({}, 'winners').exec(function(err, result) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                    res.send({
                        result: result,
                        responseCode: 200,
                        responseMessage: "Winners details show successfully"
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
            createNewAds.find({}).exec(function(err, result) {
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                    var couponType = result.filter(result => result.adsType == "coupon");
                    var cashType = result.filter(result => result.adsType == "cash");
                    res.send({
                        couponType: couponType,
                        cashType: cashType,
                        responseCode: 200,
                        responseMessage: "All blocked user show successfully!!"
                    });
                }

            });
        },

        "uploads": function(req, res) {
            console.log(req.body.images)
            var form = new multiparty.Form();
            form.parse(req, function(err, fields, files) {
                console.log("img.path",files)
                var img = files.images[0];
                var fileName = files.images[0].originalFilename;
                console.log(img.path)
                cloudinary.uploader.upload(img.path, function(result) {
                    console.log("new url-->" + JSON.stringify(result.url));
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
        }

    }
    // new CronJob('* * * * * *', function() {  
    // var arr = [];
    //     createNewAds.find({status: 'ACTIVE'}, function(err, result) {
    //         for(i=0; i<result.winners.length; i++){
    //             if(result.winners[i]==null){
    //                 console.log("nothing...!")
    //             }else{
    //                 arr.push
    //             }
    //         }
    //     })

// }, null, true, 'America/Los_Angeles');
