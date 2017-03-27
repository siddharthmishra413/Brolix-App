var validator = require('validator');
var User = require("./model/user");
var createNewAds = require("./model/createNewAds");
var createNewPage = require("./model/createNewPage");
var adminCards = require("./model/cardsAdmin");
var cloudinary = require('cloudinary');
var multiparty = require('multiparty');
var country = require('countryjs');
var cities = require('cities');
var _ = require('underscore-node');
var waterfall = require('async-waterfall');




var cron = require('node-cron');
cron.schedule('* * * * *', function(){
    var startDate = new Date().toUTCString();

  adminCards.update({'offer.offerTime':{$lte:startDate}},{ $set:  { 'offer.$.status': 'expired' }},{multi:true},function(err, result){
              if (err) { console.log('some thing went wrong') }
          else{
             console.log("result in offer Expire>>>>"+JSON.stringify(result))
          } 
  })
})

cloudinary.config({
    cloud_name: 'mobiloitte-in',
    api_key: '188884977577618',
    api_secret: 'MKOCQ4Dl6uqWNwUjizZLzsxCumE'
});
module.exports = {
    "login": function(req, res) {
        if (!validator.isEmail(req.body.email)) res.send({
            responseCode: 403,
            responseMessage: 'Please enter the correct email id.'
        });
        User.findOne({
            $or: [{
                email: req.body.email
            }, {
                password: req.body.password
            }],
            status: 'ACTIVE',
            type: "ADMIN"
        }).exec(function(err, result) {
            if (err) {
                res.send({
                    responseCode: 500,
                    responseMessage: 'Internal server error'
                });
            }
            if (result == null) {
                return res.send({
                    responseCode: 404,
                    responseMessage: "The email and password that you've entered doesn't match any account."
                });
            } else if (result.password != req.body.password) {
                return res.send({
                    responseCode: 404,
                    responseMessage: "The password that you've entered is incorrect."
                });
            } else if (result.email != req.body.email) {
                return res.send({
                    responseCode: 404,
                    responseMessage: "The email address that you've entered doesn't match any account."
                });
            } else {
                // sets a cookie with the user's info
                req.session.user = result;
                return res.send({
                    responseCode: 200,
                    responseMessage: "Login successfully."
                });
            }
        })
    },

    "adminProfile": function(req, res) {
        if (req.session && req.session.user) {
            User.findOne({
                email: req.session.user.email
            }).exec(function(err, result) {
                if (err) {
                    res.send({
                        responseCode: 500,
                        responseMessage: 'Internal server error'
                    });
                }
                if (!result) {
                    req.session.reset();
                } else {
                    res.locals.user = result;
                    return res.send({
                        result: result,
                        responseCode: 200,
                        responseMessage: "Login successfully."
                    });
                }
            })
        } else {
            return res.send({
                responseCode: 404,
                responseMessage: "session has been expried"
            });
            //res.redirect('/login');
        }
    },

    "addNewUser": function(req, res) {
        User.findOne({
            email: req.body.email
        }).exec(function(err, result) {
            if (err) {
                res.send({
                    responseCode: 409,
                    responseMessage: 'Something went worng'
                });
            } else if (result) {
                res.send({
                    responseCode: 401,
                    responseMessage: "Email should be unique."
                });
            } else {
                var user = new User(req.body);
                user.save(function(err, result) {
                    if (err) {
                        res.send({
                            result: err,
                            responseCode: 409,
                            responseMessage: 'Internal server error'
                        });
                    } else {
                        res.send({
                            result: result,
                            responseCode: 200,
                            responseMessage: "User create successfully."
                        });
                    }
                })
            }
        })
    },

    "showAllUser": function(req, res) {
        User.find({
            $or: [{ type: "USER" }, { type: "Advertiser" }]
        }, function(err, result) {
            if (err) {
                res.send({
                    responseCode: 500,
                    responseMessage: 'Internal server error'
                });
            } else {
                res.status(200).send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Users show successfully."
                });
            }
        })
    },
    "showAllPersonalUser": function(req, res) {
        User.find({ type: "USER" }, function(err, result) {
            if (err) {
                res.send({
                    responseCode: 500,
                    responseMessage: 'Internal server error'
                });
            } else {
                res.status(200).send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Users show successfully."
                });
            }
        })
    },


    "showAllBusinessUser": function(req, res) {
        User.find({ type: "Advertiser" }, function(err, result) {
            if (err) {
                res.send({
                    responseCode: 500,
                    responseMessage: 'Internal server error'
                });
            } else {
                res.status(200).send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Users show successfully."
                });
            }
        })
    },

    "winners": function(req, res) {
        createNewAds.find({}, 'winners').exec(function(err, result) {
            if (err) {
                res.send({
                    responseCode: 500,
                    responseMessage: 'Internal server error'
                });
            } else {
                var arr = [];
                for (var i = 0; i < result.length; i++) {
                    if (result[i].winners.length >= 1) {
                        for (var j = 0; j < result[i].winners.length; j++) {
                            arr.push(result[i].winners[j]);

                        }
                    }
                }
                User.find({
                    _id: {
                        $in: arr
                    }
                }).exec(function(err, newResult) {
                    res.send({
                        result: newResult,
                        responseCode: 200,
                        responseMessage: "Winners details show successfully."
                    })
                })

            }
        })
    },

    "sendBrolix": function(req, res) {
        User.findOne({
            _id: req.body.userId
        }, function(err, result) {
            if (err) {
                res.send({
                    responseCode: 500,
                    responseMessage: 'Internal server error'
                });
            } else {
                User.findOneAndUpdate({
                    _id: req.body.receiverId
                }, {
                    $push: {
                        "sendBrolixListObject": {
                            senderId: req.body.userId,
                            brolix: req.body.brolix
                        }
                    }
                }, {
                    new: true
                }, function(err, results) {
                    if (err) {
                        res.send({
                            responseCode: 409,
                            responseMessage: 'Internal server error'
                        });
                    } else if (!results) res.send({
                        responseCode: 404,
                        responseMessage: "Please enter correct userId"
                    });
                    else {
                        results.brolix += req.body.brolix;
                        results.save();
                        res.send({
                            responseCode: 200,
                            responseMessage: "Brolix Transferred.",
                            result: results
                        });
                    }
                });
            }
        });
    },

    "blockUser": function(req, res) {
        User.findByIdAndUpdate({
            _id: req.body.userId
        }, {
            '$set': {
                'status': 'BLOCK'
            }
        }, {
            new: true
        }, function(err, result) {
            if (err) {
                res.send({
                    responseCode: 409,
                    responseMessage: 'Internal server error'
                });
            } else if (!result) return res.status(404).send({
                responseMessage: "Please enter correct adId"
            })
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
        User.find({
            status: "BLOCK"
        }).exec(function(err, result) {
            if (err) {
                res.send({
                    responseCode: 500,
                    responseMessage: 'Internal server error'
                });
            }
            if (result.length == 0) {
                res.send({
                    responseCode: 404,
                    responseMessage: 'No blocked user found'
                });
            } else {
                var count = 0;
                for (var i = 0; i < result.length; i++) {
                    count++;
                }
                res.send({
                    result: result,
                    count: count,
                    responseCode: 200,
                    responseMessage: "All blocked user shows successfully."
                });
            }

        });
    },

    "totalAds": function(req, res) { // all ads cash and coupon type
        createNewAds.find({}).exec(function(err, result) {
            if (err) {
                res.send({
                    responseCode: 409,
                    responseMessage: 'Internal server error'
                });
            } else {
                var count = 0;
                for (var i = 0; i < result.length; i++) {
                    count++;
                }
                res.send({
                    result: result,
                    count: count,
                    responseCode: 200,
                    responseMessage: "All ads shown successfully."
                })
            }
        })
    },

    "totalActiveAds": function(req, res) { // all ads cash and coupon type
        createNewAds.find({ status: 'ACTIVE' }).exec(function(err, result) {
            if (err) {
                res.send({
                    responseCode: 409,
                    responseMessage: 'Internal server error'
                });
            } else {
                var count = 0;
                for (var i = 0; i < result.length; i++) {
                    count++;
                }
                res.send({
                    result: result,
                    count: count,
                    responseCode: 200,
                    responseMessage: "All ads shown successfully."
                })
            }
        })
    },

    "totalExpiredAds": function(req, res) { // all ads cash and coupon type
        createNewAds.find({ status: 'EXPIRED' }).exec(function(err, result) {
            if (err) {
                res.send({
                    responseCode: 409,
                    responseMessage: 'Internal server error'
                });
            } else {
                var count = 0;
                for (var i = 0; i < result.length; i++) {
                    count++;
                }
                res.send({
                    result: result,
                    count: count,
                    responseCode: 200,
                    responseMessage: "All ads shown successfully."
                })
            }
        })
    },


    "listOfAds": function(req, res) { // for a single user based on cash and coupon category
        createNewAds.find({ userId: req.body.userId }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: 'No ad found from this User' }); } else {
                var couponType = result.filter(result => result.adsType == "coupon");
                var cashType = result.filter(result => result.adsType == "cash");
                res.send({
                    couponType: couponType,
                    cashType: cashType,
                    responseCode: 200,
                    responseMessage: "List of ads show successfully."
                });
            }

        });

    },

    "listOfAllAds": function(req, res) { // for all users based on cash and coupon category
        createNewAds.find({}).exec(function(err, result) {
            if (err) {
                res.send({
                    responseCode: 500,
                    responseMessage: 'Internal server error'
                });
            } else {
                var couponType = result.filter(result => result.adsType == "coupon");
                var cashType = result.filter(result => result.adsType == "cash");
                res.send({
                    couponType: couponType,
                    cashType: cashType,
                    responseCode: 200,
                    responseMessage: "List of all ads show successfully!!"
                });
            }
        });
    },

    "totalSoldUpgradeCard": function(req, res) {
        User.aggregate({ $unwind: "$upgradeCardObject" }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                var count = 0;
                for (i = 0; i < result.length; i++) {
                    count++;
                }
                res.status(200).send({
                    result: result,
                    count: count,
                    responseCode: 200,
                    responseMessage: "Successfully shown list of upgrade card"
                });
            }
        })
    },

    "totalSoldLuckCard": function(req, res) {
        User.aggregate({ $unwind: "$luckCardObject" }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                var count = 0;
                for (i = 0; i < result.length; i++) {
                    count++;
                }
                res.status(200).send({
                    result: result,
                    count: count,
                    responseCode: 200,
                    responseMessage: "successfully shown list of luck card"
                });
            }

        })
    },

    "totalIncomeInBrolixFromLuckCard": function(req, res) {
        User.aggregate({ $unwind: "$luckCardObject" }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
            if (!result) { res.send({ result: result, responseCode: 403, responseMessage: "No matching result available." }); } else {
                var arr = [];
                var count = 0;
                for (i = 0; i < result.length; i++) {
                    count++;
                    console.log("data--->>>>", result[i].luckCardObject.brolix, i);
                    arr.push(parseInt(result[i].luckCardObject.brolix));
                }
                var sum = arr.reduce((a, b) => a + b, 0);
                console.log("arrrrr", sum);
                res.status(200).send({
                    result: result,
                    totalIncome: sum,
                    count: count,
                    responseCode: 200,
                    responseMessage: "Total income in brolix Shows successfully."
                });
            }
        });
    },

    "totalIncomeInCashFromUpgradeCard": function(req, res) {
        User.aggregate({ $unwind: "$upgradeCardObject" }).exec(function(err, results) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
            if (!results) { res.send({ results: results, responseCode: 403, responseMessage: "No matching result available." }); } else {
                var arr = [];
                var count = 0;
                for (i = 0; i < results.length; i++) {
                    count++;
                    arr.push(parseInt(results[i].upgradeCardObject.cash));
                }
                var sum = arr.reduce((a, b) => a + b, 0);
                console.log("arrrrr", sum);
                res.status(200).send({
                    result: results,
                    totalIncome: sum,
                    count: count,
                    responseCode: 200,
                    responseMessage: "Total cash shows successfully."
                });
            }
        });
    },

    "usedLuckCard": function(req, res) {
        User.aggregate({ $unwind: "$luckCardObject" }, { $match: { 'luckCardObject.status': "INACTIVE" } }).exec(function(err, result) {
            console.log("rseult=-=-=-=-=->>" + JSON.stringify(result))
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
            if (!result) { res.send({ results: results, responseCode: 403, responseMessage: "No matching result available." }); } else {
                var count = 0;
                for (var i = 0; i < result.length; i++) {
                    count++;
                }
                res.status(200).send({
                    result: result,
                    count: count,
                    responseCode: 200,
                    responseMessage: "Total Brolix Shows successfully."
                });
            }
        });

    },

    "usedUpgradeCard": function(req, res) {
        User.aggregate({ $unwind: "$upgradeCardObject" }, { $match: { 'upgradeCardObject.status': "INACTIVE" } }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
            if (!result) { res.send({ results: results, responseCode: 403, responseMessage: "No matching result available." }); } else {
                var count = 0;
                for (var i = 0; i < result.length; i++) {
                    count++;
                }
                res.status(200).send({
                    result: result,
                    count: count,
                    responseCode: 200,
                    responseMessage: "Used upgrade card Shows successfully."
                });
            }
        });

    },

    "unUsedUpgradeCard": function(req, res) {
        User.aggregate({ $unwind: "$upgradeCardObject" }, { $match: { 'upgradeCardObject.status': "ACTIVE" } }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
            if (!result) { res.send({ results: results, responseCode: 403, responseMessage: "No matching result available." }); } else {
                var count = 0;
                for (var i = 0; i < result.length; i++) {
                    count++;
                }
                res.status(200).send({
                    result: result,
                    count: count,
                    responseCode: 200,
                    responseMessage: "Un Used upgrade card Shows successfully."
                });
            }
        });

    },


    "unUsedLuckCard": function(req, res) {
        User.aggregate({ $unwind: "$luckCardObject" }, { $match: { 'luckCardObject.status': "ACTIVE" } }).exec(function(err, result) {
            console.log("rseult=-=-=-=-=->>" + JSON.stringify(result))
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
            if (!result) { res.send({ results: results, responseCode: 403, responseMessage: "No matching result available." }); } else {
                var count = 0;
                for (var i = 0; i < result.length; i++) {
                    count++;
                }
                res.status(200).send({
                    result: result,
                    count: count,
                    responseCode: 200,
                    responseMessage: "Total Brolix Shows successfully."
                });
            }
        });

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
        var states = country.states(name, code);
        if (!states) {
            responseHandler.apiResponder(req, res, 404, "States not found");
        } else {
            res.send({
                result: states,
                responseCode: 200,
                responseMessage: "All state list."
            });
        }
    },

    //API for user Profile
    "userProfile": function(req, res) {
        User.findOne({ _id: req.params.id }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "Profile data show successfully."
            });
        })
    },

    //API for user Profile
    "editUserProfile": function(req, res) {
        User.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "Profile update successfully."
            });
        })
    },

    "totalPages": function(req, res) {
        createNewPage.find({ status: "ACTIVE" }).populate('userId', 'firstName lastName email mobileNumber').exec(function(err, result) {
            if (err) {
                res.send({
                    responseCode: 500,
                    responseMessage: 'Internal server error'
                });
            } else {
                res.status(200).send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Total Pages."
                });
            }
        })
    },

    //API for user Profile
    "viewPage": function(req, res) {
        createNewPage.findOne({ _id: req.params.id }).populate('userId', 'firstName lastName').exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "View Page."
            });
        })
    },

    //API for user Profile
    "editpage": function(req, res) {
        createNewPage.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "Page Updated."
            });
        })
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
                User.find({ _id: { $in: array } }).exec(function(err, result) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else {
                        res.send({
                            result: result,
                            responseCode: 200,
                            count: count,
                            responseMessage: "all coupon winner"
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
                User.find({ _id: { $in: array } }).exec(function(err, result) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else {
                        res.send({
                            result: result,
                            responseCode: 200,
                            count: count,
                            responseMessage: "all cash winner"
                        })
                    }
                })
            }
        })

    },

    "videoAds": function(req, res) {
        createNewAds.find({ adContentType: "video" }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0 || result.length == null || result.length == undefined || result.length == '') { res.send({ responseCode: 404, responseMessage: "no ad found" }); } else {
                var count = 0;
                for (var i = 0; i < result.length; i++) {
                    count++;
                }
                res.send({
                    result: result,
                    count: count,
                    responseCode: 200,
                    responseMessage: "All ads shown successfully."
                })
            }
        })
    },

    "slideshowAds": function(req, res) {
        createNewAds.find({ adContentType: "slideshow" }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0 || result.length == null || result.length == undefined || result.length == '') { res.send({ responseCode: 404, responseMessage: "no ad found" }); } else {
                var count = 0;
                for (var i = 0; i < result.length; i++) {
                    count++;
                }
                res.send({
                    result: result,
                    count: count,
                    responseCode: 200,
                    responseMessage: "All ads shown successfully."
                })
            }
        })
    },

    // "totalPages": function(req, res) {
    //     createNewPage.paginate({ status: "ACTIVE" }, { page: req.params.pageNumber, limit: 8 }, function(err, result) {
    //         console.log("result-->>", result)
    //         if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result.docs.length == 0) { res.send({ responseCode: 404, responseMessage: "No page found" }); } else {
    //             var count = 0;
    //             for (var i = 0; i < result.docs.length; i++) {
    //                 count++;
    //             }
    //             res.send({
    //                 result: result,
    //                 count: count,
    //                 responseCode: 200,
    //                 responseMessage: "All pages show successfully."
    //             })
    //         }
    //     })
    // },

    "totalPages": function(req, res) {
        createNewPage.find({ status: "ACTIVE" }).populate('userId', 'firstName lastName email mobileNumber').exec(function(err, result) {
            if (err) {
                res.send({
                    responseCode: 500,
                    responseMessage: 'Internal server error'
                });
            } else {
                res.status(200).send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Total Pages."
                });
            }
        })
    },

    "blockPage": function(req, res) { // pageId in request
        createNewPage.findOneAndUpdate({ _id: req.body.pageId }, { $set: { status: req.body.status } }, { new: true }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) return res.status(404).send({ responseMessage: "please enter correct pageId" })
            else {
                res.send({
                    // result: result,
                    responseCode: 200,
                    responseMessage: "Page blocked successfully."
                });
            }

        });
    },

    "showAllBlockedPage": function(req, res) { // pageId in request
        createNewPage.find({ status: "BLOCK" },function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
            else if (result.length == 0) { res.send({ responseCode: 200, count:0, responseMessage: "No blocked page found" }) } else {
                var count = 0;
                for (var i = 0; i < result.length; i++) {
                    count++;
                }
                res.send({
                    result: result,
                    count: count,
                    responseCode: 200,
                    responseMessage: "Blocked page shown successfully."
                });
            }

        });
    },

    "removePage": function(req, res) { // pageId in request
        createNewPage.findByIdAndUpdate({ _id: req.params.pageId }, { $set: { 'status': 'REMOVED' } }, { new: true }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) return res.status(404).send({ responseMessage: "please enter correct pageId" })
            else {
                res.send({
                    // result: result,
                    responseCode: 200,
                    responseMessage: "Page removed successfully."
                });
            }

        });
    },

    "showAllRemovedPage": function(req, res) { // pageId in request
        createNewPage.find({ status: "REMOVED" },function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
            else if (result.length == 0) { res.send({ responseCode: 200, count:0 , responseMessage: "No removed page found"}) } else {
                var count = 0;
                for (var i = 0; i < result.length; i++) {
                    count++;
                }
                res.send({
                    result: result,
                    count: count,
                    responseCode: 200,
                    responseMessage: "Removed page shown successfully."
                });
            }

        });
    },
    "sendcardAndcoupan":function(req, res){
     var userId = req.params.id; //589dc8f2d6c43c4034a92f5e
     User.findOne({_id:userId},'coupon',function(err, result){
      if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) return res.status(404).send({ responseMessage: "Coupan not found for this user" })
     res.send({ responseCode: 200, responseMessage: 'Coupan of user' , result :result})
     })
    },
    "findAllCities":function(req, res){
        User.find({},'city',function(err, result){
      if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) return res.status(404).send({ responseMessage: "No city record found" })
       var result = result.map(function(a) {return a.city;});
       res.send({ responseCode: 200, responseMessage: 'Here all all citiers', data:result })
        })
    },
    "unPublishedPage":function(req, res){
        createNewAds.find({},'pageId',function(err, result){
         if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) return res.status(404).send({ responseMessage: "No page found" })
       var result = result.map(function(a) {return a.pageId;});
       var allPageIds = _.uniq(result);
       createNewPage.find({_id:{$nin:allPageIds}},function(err, result){
      res.send({ responseCode: 200, responseMessage: 'Here all the Unsuscribe pages', data:result })

       })
        })
    },
    "createCards":function(req, res){
   console.log("SASAS>>>"+JSON.stringify(req.body))
     var saveCards = new adminCards(req.body);

     saveCards.save(function(err, result){
          if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
          else{
             res.send({ responseCode: 200, responseMessage: 'Save card successfully',data:result });
          }
     })  
    },
    "viewCards":function(req, res){
        console.log(typeof(req.params.type))
     var cardType = req.params.type;
     adminCards.find({type:cardType,status : "active"},function(err, result){
          if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
          else{
             res.send({ responseCode: 200, responseMessage: 'Card find successfully',data:result });
          }
     })  
    },
   "showCardDetails":function(req, res){
     var cardId = req.params.id;
     adminCards.findById(cardId,function(err, result){
          if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
          else{
             res.send({ responseCode: 200, responseMessage: 'Card find successfully',data:result });
          }
     })  
    },
    "editCards":function(req, res){
     var cardId = req.body.cardId;
     console.log("req in edit card>>>"+JSON.stringify(req.body))
     var data = req.body;
     adminCards.findOneAndUpdate({_id:cardId},data,{new:true},function(err, result){
          if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
          else{
             res.send({ responseCode: 200, responseMessage: 'card updated successfully',data:result });
          }
     })  
    },
    "removeCard":function(req, res){
     var cardId = req.params.id;
     adminCards.findByIdAndUpdate(cardId,{status:"removed"},{new:true},function(err, result){
          if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
          else{
             res.send({ responseCode: 200, responseMessage: 'Card find successfully',data:result });
          }
     })    
    },
    "createOfferOnCard":function(req, res){
        var cardId = req.body.id;
        adminCards.findByIdAndUpdate(cardId,{$push:{offer:req.body}},{new:true},function(err, result){
          if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
          else{
             res.send({ responseCode: 200, responseMessage: 'Offer created on card successfully',data:result });
          }            
        })
    },
    "showOfferOnCards":function(req, res){
        var cardType = req.body.cardType;
        adminCards.aggregate([
        {$unwind:'$offer'},
        {$match:{type:cardType,'offer.status':'active'}},
        { $project: {offer:1,_id:0} }
            ]).exec(function(err, result){
          if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
          else{
             res.send({ responseCode: 200, responseMessage: 'Find all offers on card successfully',data:result });
          }             
       }) 
    },

     "createPage": function(req, res) {
        createNewPage.findOne({ pageName: req.body.pageName }).exec(function(err, result2) {
        if (err) { res.send({ responseCode: 409, responseMessage: 'Something went worng' }); } else if (result2) {
            res.send({ responseCode: 401, responseMessage: "Page name should be unique." });
        } else {
            if (!req.body.category || !req.body.subCategory) {
                res.send({ responseCode: 403, responseMessage: 'Category and Sub category required' });
            } else {
                var page = new createNewPage(req.body);
                page.save(function(err, result) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } 
                    else {
                        User.findByIdAndUpdate({ _id: req.body.adminId }, { $inc: { pageCount: 1 } }).exec(function(err, result1) {
                            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                                res.send({
                                    result: result,
                                    responseCode: 200,
                                    responseMessage: "Page create successfully."
                                });
                            }
                        })
                    }
                })
            }
        }
    })
    },

    "adsStatus": function(req, res){
        
    }

}

   function uploads(req, callback) {
        console.log(req.body.images)
        var form = new multiparty.Form();
        form.parse(req, function(err, fields, files) {
            console.log("files>>"+JSON.stringify(files));
            var img = files.images[0];
            var fileName = files.images[0].originalFilename;
            cloudinary.uploader.upload(img.path, function(result) {
                console.log("results url>>>"+result)
                callback(null,result.url);
              /*  res.send({
                    result: result.url,
                    responseCode: 200,
                    responseMessage: "File uploaded successfully."
                });*/
            }, {
                resource_type: "auto",
                chunk_size: 6000000
            });
        })
    }