var validator = require('validator');
var User = require("./model/user");
var createNewAds = require("./model/createNewAds");
var createNewPage = require("./model/createNewPage");
var createNewReport = require("./model/reportProblem");
var adminCards = require("./model/cardsAdmin");
var country = require('countryjs');
var countries = require('country-list')();
var allCountries = require('all-countries');
var country = require('countryjs');
var functionHandler = require('./functionHandler.js')
var multiparty = require('multiparty');
var cloudinary = require('cloudinary');
var gps = require('gps2zip');
var _ = require('underscore-node');
var voucher_codes = require('voucher-code-generator');

var waterfall = require('async-waterfall');

const cities = require("cities-list");
//console.log(cities) // WARNING: this will print out the whole object 
console.log(cities["london"]) // 1 
console.log(cities["something else"]) // undefined 


module.exports = {
    "login": function(req, res) {
        console.log("request-->>" + JSON.stringify(req.body))
        if (!validator.isEmail(req.body.email)) res.send({ responseCode: 403, responseMessage: 'Please enter the correct email id.' });
        else {
            User.findOne({
                email: req.body.email,
                password: req.body.password,
                $or: [{ 'type': 'ADMIN' }, { 'type': 'SYSTEMADMIN' }],
                status: 'ACTIVE'
            }).exec(function(err, result) {
                console.log("result-->>", result)
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "The email and password that you've entered doesn't match any account." }); } else if (result.password != req.body.password) { res.send({ responseCode: 404, responseMessage: "The password that you've entered is incorrect." }); } else if (result.email != req.body.email) {
                    res.send({
                        responseCode: 404,
                        responseMessage: "The email address that you've entered doesn't match any account."
                    });
                } else {
                    console.log("2")
                        // sets a cookie with the user's info
                    req.session.user = result;
                    console.log("request-->>", req.session.user)
                    res.send({
                        responseCode: 200,
                        responseMessage: "Login successfully."
                    });
                }
            })
        }
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
                } else if (!result) {
                    req.session.reset();
                } else {
                    res.locals.user = result;
                    res.send({
                        result: result,
                        responseCode: 200,
                        responseMessage: "Login successfully."
                    });
                }
            })
        } else {
            res.send({
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
            $or: [{ type: "USER", status: 'ACTIVE' }, { type: "Advertiser", status: 'ACTIVE' }]
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
        User.find({ type: "USER", status: 'ACTIVE' }, function(err, result) {
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
        User.find({ type: "Advertiser", status: 'ACTIVE' }, function(err, result) {
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
                User.find({ _id: { $in: arr }, status: 'ACTIVE' }).exec(function(err, newResult) {
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

        console.log("req.body.userId", req.params.userId);

        User.findByIdAndUpdate({
            _id: req.params.userId
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
                    responseMessage: 'Internal server errorwqwq'
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

            } else if (result.length == 0) { res.send({ count: 0, responseCode: 404, responseMessage: "No blocked found." }) } else {

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
    /*-------------------------Manage Ads API------------------------*/

    "totalAds": function(req, res) { // all ads cash and coupon type
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

    "totalActiveAds": function(req, res) { // all ads cash and coupon type
        createNewAds.find({ status: 'ACTIVE' }).populate('pageId', 'pageName').populate('userId', 'mobileNumber').exec(function(err, result) {
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
        createNewAds.find({ status: 'EXPIRED' }).populate('pageId', 'pageName').populate('userId', 'mobileNumber').exec(function(err, result) {
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
    /*----------------------------------------------------------------------------------------------------*/
    "totalSoldUpgradeCard": function(req, res, query) {
        console.log(query.length)
        console.log("query===>" + JSON.stringify(query))
        if (!(query.length == 1)) {
            console.log("query")
            var updateData = query;
        } else {
            console.log("rather than query")
            var updateData = {}
        }
        User.aggregate({ $unwind: "$upgradeCardObject" }, { $match: updateData }).exec(function(err, result) {
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

    "totalSoldLuckCard": function(req, res, query) {
        console.log(query.length)
        console.log("query===>" + JSON.stringify(query))
        if (!(query.length == 1)) {
            console.log("query")
            var updateData = query;
        } else {
            console.log("rather than query")
            var updateData = {}
        }
        User.aggregate({ $unwind: "$luckCardObject" }, { $match: updateData }).exec(function(err, result) {
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
    "viewProfile": function(req, res) {
        User.findOne({ _id: req.params.id }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: 'No user found' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Profile data show successfully."
                });
            }
        })
    },

    //API for user Profile
    "editUserProfile": function(req, res) {
        User.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 409, responseMessage: 'Please enter correct userId' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Profile update successfully."
                });
            }
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
    "showAllBlockedPage": function(req, res) { // pageId in request
        createNewPage.find({ status: "BLOCK" }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) return res.status(404).send({ responseMessage: "please enter correct pageId" })
            else if (result.docs.length == 0) { res.send({ responseCode: 404, responseMessage: "No blocked page found" }) } else {
                var count = 0;
                for (var i = 0; i < result.docs.length; i++) {
                    count++;
                }
                res.send({
                    result: result,
                    count: count,
                    responseCode: 200,
                    responseMessage: "Blocked page successfully."
                });
            }

        });
    },

    //API for user Profile
    "viewPage": function(req, res) {
        createNewPage.findOne({ _id: req.params.id }).populate('userId', 'firstName lastName').exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: 'No page found' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "View Page."
                });
            }
        })
    },

    "editPage": function(req, res) {
        createNewPage.findOne({ _id: req.params.id }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: 'Please enter correct pageId' }); } else {
                if (result.pageName == req.body.pageName) {
                    createNewPage.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec(function(err, result1) {
                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: 'Please enter correct pageId' }); } else {
                            res.send({
                                result: result1,
                                responseCode: 200,
                                responseMessage: "Pages details updated successfully rtwrttr."
                            })
                        }
                    })

                } else {
                    var pageName = req.body.pageName;
                    createNewPage.findOne({ pageName: pageName, _id: { $ne: req.params.id } }).exec(function(err, result2) {
                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result2) { res.send({ responseCode: 500, responseMessage: ' unique 11' }); } else {
                            createNewPage.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec(function(err, result3) {
                                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result3) { res.send({ responseCode: 404, responseMessage: 'Please enter correct pageId' }); } else {
                                    res.send({
                                        result: result3,
                                        responseCode: 200,
                                        responseMessage: "Pages details updated successfully. 544353"
                                    })
                                }
                            })
                        }
                    })
                }
            }
        })
    },

    "couponWinners": function(req, res) {
        createNewAds.find({ adsType: "coupon" }).exec(function(err, result) {
            var array = [];
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                for (i = 0; i < result.length; i++) {
                    for (j = 0; j < result[i].winners.length; j++) {
                        array.push(result[i].winners[j]);
                    }
                }
                User.find({ _id: { $in: array } }).exec(function(err, result) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else {
                        res.send({
                            result: result,
                            responseCode: 200,
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
        createNewAds.find({ adContentType: "video" }).populate('pageId', 'pageName').populate('userId', 'mobileNumber').exec(function(err, result) {
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
        createNewAds.find({ adContentType: "slideshow" }).populate('pageId', 'pageName').populate('userId', 'mobileNumber').exec(function(err, result) {
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

    "showAllBlockedPage": function(req, res) { // pageId in request
        createNewPage.find({ status: "BLOCK" }).populate('userId', 'firstName lastName email mobileNumber').exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 200, count: 0, responseMessage: "No blocked page found" }) } else {
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
        createNewPage.findByIdAndUpdate({ _id: req.params.id }, { $set: { 'status': 'REMOVED' } }, { new: true }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) return res.status(404).send({ responseMessage: "please enter correct pageId" })
            else {
                var userId = result.userId;
                User.findOneAndUpdate({ _id: userId }, { $inc: { pageCount: -1 } }, { new: true }).exec(function(err, resul1) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                        res.send({
                            //result: resul1,
                            responseCode: 200,
                            responseMessage: "Page removed successfully."
                        });
                    }
                })
            }
        });
    },

    "showAllRemovedPage": function(req, res) { // pageId in request
        createNewPage.find({ status: "REMOVED" }).populate('userId', 'firstName lastName email mobileNumber').exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 200, count: 0, responseMessage: "No removed page found" }) } else {
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
    "sendcardAndcoupan": function(req, res) {
        var userId = req.params.id; //589dc8f2d6c43c4034a92f5e
        User.findOne({ _id: userId }, 'coupon', function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) return res.status(404).send({ responseMessage: "Coupan not found for this user" })
            res.send({ responseCode: 200, responseMessage: 'Coupan of user', result: result })
        })
    },
    "findAllCities": function(req, res) {
        User.find({}, 'city', function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) return res.status(404).send({ responseMessage: "No city record found" })
            var result = result.map(function(a) {
                return a.city;
            });
            res.send({ responseCode: 200, responseMessage: 'Here all all citiers', data: result })
        })
    },
    "unPublishedPage": function(req, res) {
        createNewAds.find({}, 'pageId', function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) return res.status(404).send({ responseMessage: "No page found" })
            var result = result.map(function(a) {
                return a.pageId;
            });
            var allPageIds = _.uniq(result);
            createNewPage.find({ _id: { $nin: allPageIds } }).populate('userId', 'firstName lastName email mobileNumber').exec(function(err, result) {
                res.send({ responseCode: 200, responseMessage: 'Here all the Unsuscribe pages', data: result })

            })
        })
    },
    "createCards": function(req, res) {
        console.log("SASAS>>>" + JSON.stringify(req.body))
        var saveCards = new adminCards(req.body);

        saveCards.save(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                res.send({ responseCode: 200, responseMessage: 'Save card successfully', data: result });
            }
        })
    },
    "viewCards": function(req, res) {
        console.log(typeof(req.params.type))
        var cardType = req.params.type;
        adminCards.find({ type: cardType, status: "ACTIVE" }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                res.send({ responseCode: 200, responseMessage: 'Card find successfully', data: result });
            }
        })
    },
    "showCardDetails": function(req, res) {
        var cardId = req.params.id;
        adminCards.findById(cardId, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                res.send({ responseCode: 200, responseMessage: 'Card find successfully', data: result });
            }
        })
    },
    "editCards": function(req, res) {
        var cardId = req.body.cardId;
        console.log("req in edit card>>>" + JSON.stringify(req.body))
        var data = req.body;
        adminCards.findOneAndUpdate({ _id: cardId }, data, { new: true }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                res.send({ responseCode: 200, responseMessage: 'card updated successfully', data: result });
            }
        })
    },
    "removeCard": function(req, res) {
        var cardId = req.params.id;
        adminCards.findByIdAndUpdate(cardId, { status: "removed" }, { new: true }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                res.send({ responseCode: 200, responseMessage: 'Card find successfully', data: result });
            }
        })
    },
    "createOfferOnCard": function(req, res) {
        var cardId = req.body.id;
        adminCards.findByIdAndUpdate(cardId, { $push: { offer: req.body } }, { new: true }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                res.send({ responseCode: 200, responseMessage: 'Offer created on card successfully', data: result });
            }
        })
    },
    "showOfferOnCards": function(req, res) {
        var cardType = req.body.cardType;
        adminCards.aggregate([
            { $unwind: '$offer' },
            { $match: { type: cardType, 'offer.status': 'ACTIVE' } },
            { $project: { offer: 1, _id: 0 } }
        ]).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                res.send({ responseCode: 200, responseMessage: 'Find all offers on card successfully', data: result });
            }
        })
    },

    "createPage": function(req, res) {
        createNewPage.findOne({ pageName: req.body.pageName }).exec(function(err, result2) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Something went worng' }); } else if (result2) {
                res.send({ responseCode: 401, responseMessage: "Page name should be unique." });
            } else {
                var page = new createNewPage(req.body);
                page.save(function(err, result) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                        User.findByIdAndUpdate({ _id: req.body.adminId }, { $inc: { pageCount: 1 } }).exec(function(err, result1) {
                            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                                var adminlength = result.adAdmin.length;
                                console.log("adminlength--11->>", adminlength)
                                var pageId = result._id;
                                console.log("pageId--->>", pageId)
                                createNewPage.findOneAndUpdate({ _id: pageId }, { $inc: { adAdminCount: adminlength } }).exec(function(err, result2) {
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
                })
            }
        })
    },

    "adsfilter": function(req, res) {
        var condition = { $and: [] };
        var todayDate = new Date();
        var newTodayDate = new Date();
        var data = req.body.adsType;

        waterfall([
            function(callback) {
                if (data == "reportedAds" || data == "adsWithLinks" || data == "upgradedAdsBy$" || data == "upgradedAdsByB") {
                    createNewAds.find({}).exec(function(err, result) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                            var array = [];
                            if (data == "reportedAds") {
                                for (var i = 0; i < result.length; i++) {
                                    if (result[i].reportOnAd > 0) {
                                        array.push(result[i]._id)
                                    }
                                }
                            }
                            if (data == 'adsWithLinks') {
                                for (var i = 0; i < result.length; i++) {
                                    if (result[i].promoteApp == true) {
                                        array.push(result[i]._id)
                                    }
                                }
                            }
                            if (data == 'upgradedAdsBy$') {
                                for (var i = 0; i < result.length; i++) {
                                    if (result[i].cash > 0) {
                                        array.push(result[i]._id)
                                    }
                                }
                            }
                            if (data == 'upgradedAdsByB') {
                                for (var i = 0; i < result.length; i++) {
                                    if (result[i].couponPurchased > 0) {
                                        array.push(result[i]._id)
                                    }
                                }
                            }

                            // createNewAds.find({ _id: { $in: array } }).exec(function(err, result1) {
                            //     if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } 
                            //     else if (result1.length == 0) { res.send({ responseCode: 404, responseMessage: "No ad found." }); } 
                            //     else {

                            callback(null, array)
                                //     }
                                // })
                        }
                    })
                } else {
                    callback(null, "null")
                }
            },
            function(allAdsIds, callback) {
                switch (data) {
                    case 'activeAds':
                        var updateData = { status: "ACTIVE" };
                        condition.$and.push(updateData)
                        break;

                    case 'expiredAds':
                        var updateData = { status: "EXPIRED" };
                        condition.$and.push(updateData)
                        break;

                    case 'reportedAds':
                        var updateData = { _id: { $in: allAdsIds } };
                        condition.$and.push(updateData)
                        break;

                    case 'adsWithLinks':
                        var updateData = { _id: { $in: allAdsIds } };
                        condition.$and.push(updateData)
                        break;

                    case 'videoAds':
                        var updateData = { adContentType: "video" };
                        condition.$and.push(updateData)
                        break;

                    case 'slideShowAds':
                        var updateData = { adContentType: "slideshow" };
                        condition.$and.push(updateData)
                        break;

                    case 'upgradedAdsBy$':
                        var updateData = { _id: { $in: allAdsIds } };
                        condition.$and.push(updateData)
                        break;

                    case 'upgradedAdsByB':
                        var updateData = { _id: { $in: allAdsIds } };
                        condition.$and.push(updateData)
                        break;

                    default:
                        var updateData = {};
                        condition.$and.push(updateData)
                }
                console.log("condition before callback==>>" + JSON.stringify(condition))
                console.log("updated data===>." + updateData)
                callback(null, updateData)
            },
            function(updateData, callback) {

                if (req.body.joinTo && req.body.joinTo) {
                    condition.$and.push({
                        createdAt: { $gte: new Date(req.body.joinFrom).toUTCString(), $lte: new Date(req.body.joinTo).toUTCString() }
                    })
                }

                if (req.body.country) {
                    var data = { 'whoWillSeeYourAdd.country': req.body.country }
                    condition.$and.push(data)
                }
                if (req.body.state) {
                    var data = { 'whoWillSeeYourAdd.state': req.body.state }
                    condition.$and.push(data)
                }
                if (req.body.city) {
                    var data = { 'whoWillSeeYourAdd.city': req.body.city }
                    condition.$and.push(data)
                }

                // Object.getOwnPropertyNames(req.body).forEach(function(key, idx, array) {
                //             if (!(key == "adsType" || key == "joinFrom" || key == "joinTo" )) {
                //                 var tempCond={};
                //                 if(req.body.country){
                //                     var data = {'whoWillSeeYourAdd.country':req.body[key]}
                //                    condition.$and.push(data)
                //                 }
                //                  if(req.body.state){
                //                     var data = {'whoWillSeeYourAdd.state':req.body[key]}
                //                    condition.$and.push(data)
                //                 }
                //                  if(req.body.city){
                //                     var data = {'whoWillSeeYourAdd.country':req.body[key]}
                //                    condition.$and.push(data)
                //                 }
                //                // tempCond[key]=req.body[key];
                //                 //console.log("tempCOndition===>"+JSON.stringify(tempCond))
                //                 // condition.$and.push(data)
                //             }
                // });
                if (condition.$and.length == 0) {
                    delete condition.$and;
                }
                callback(null, condition)
            },
            function(condition, callback) {


                console.log("condition===>.." + JSON.stringify(condition))
                createNewAds.find(condition, function(err, result) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                        //  console.log("result;;;>"+result)
                        callback(null, result, condition)
                    }
                })
            }
        ], function(err, result, condition) {
            res.send({
                responseCode: 200,
                responseMessage: 'Filtered Ads.',
                data: result
            });
        })
    },

    "luckUpgradeCardfilter": function(req, res) {
        var data = req.body.cardType;

        waterfall([
            function(callback) {
                switch (data) {
                    case 'totalSoldCards':
                        var matchCondt = { $match: {} }
                        var updateData = { $unwind: "$upgradeCardObject" };
                        break;

                    case 'totalIncome$':
                        var matchCondt = { $match: {} }
                        var updateData = { $unwind: "$upgradeCardObject" };
                        break;

                    case 'usedCards':
                        var matchCondt = { $match: { 'upgradeCardObject.status': "INACTIVE" } }
                        var updateData = { $unwind: "$upgradeCardObject" };
                        break;

                    case 'unusedCards':
                        var matchCondt = { $match: { 'upgradeCardObject.status': "ACTIVE" } }
                        var updateData = { $unwind: "$upgradeCardObject" }
                        break;

                    case 'totalSoldLuckCards':
                        var matchCondt = { $match: {} }
                        var updateData = { $unwind: "$luckCardObject" }
                        break;

                    case 'totalIncome$LuckCards':
                        var matchCondt = { $match: {} }
                        var updateData = { $unwind: "$luckCardObject" }
                        break;

                    case 'usedCardsLuckCards':
                        var updateData = { $unwind: "$luckCardObject" }
                        var matchCondt = { $match: { 'luckCardObject.status': "INACTIVE" } }
                        break;

                    case 'unusedCardsLuckCards':
                        var updateData = { $unwind: "$luckCardObject" }
                        var matchCondt = { $match: { 'luckCardObject.status': "ACTIVE" } }
                        break;

                    default:
                        var matchCondt = { $match: {} }
                        var updateData = { $unwind: "$upgradeCardObject" };
                }
                console.log("updated data===>." + updateData)
                callback(null, updateData, matchCondt)
            },
            function(updateData, matchCondt, callback) {
                console.log("match condition==>" + JSON.stringify(matchCondt));
                console.log("unwind conditions==>>" + JSON.stringify(updateData));
                if (req.body.joinTo && req.body.joinFrom) {
                    var dateMatch = { createdAt: { $gte: new Date(req.body.joinFrom), $lte: new Date(req.body.joinTo) } }
                } else {
                    var dateMatch = {}
                }
                var upgradeType = {}
                if (req.body.upgradeType) {
                    var upgradeType = { 'upgradeCardObject.viewers': req.body.upgradeType }
                } else {
                    var upgradeType = {}
                }
                if (req.body.luckCardType) {
                    var luckCardType = { 'luckCardObject.chances': req.body.luckCardType }
                } else {
                    var luckCardType = {}
                }

                var tempCond = {};
                Object.getOwnPropertyNames(req.body).forEach(function(key, idx, array) {
                    if (!(key == "cardType" || key == "joinFrom" || key == "joinTo" || key == "upgradeType" || key == "luckCardType")) {

                        var conditions = {}
                        tempCond[key] = req.body[key];
                        console.log("tempCOndition===>" + JSON.stringify(tempCond))
                    }
                });
                Object.assign(tempCond, upgradeType)
                Object.assign(tempCond, luckCardType)

                callback(null, updateData, tempCond, matchCondt, dateMatch, luckCardType, upgradeType)
            },
            function(updateData, tempCond, matchCondt, dateMatch, luckCardType, upgradeType, callback) {

                User.aggregate(updateData, { $match: tempCond }, matchCondt, { $match: dateMatch }).exec(function(err, results) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
                    if (!results) { res.send({ results: results, responseCode: 403, responseMessage: "No matching result available." }); } else {
                        callback(null, results)
                    }
                });
            }

        ], function(err, result, condition) {
            res.send({
                responseCode: 200,
                responseMessage: 'Filtered cards.',
                data: result
            });
        })
    },

    "giftsFilter": function(req, res) {
        var condition = { $and: [] };
        var todayDate = new Date();
        var newTodayDate = new Date();
        var data = req.body.giftsType;

        waterfall([
            function(callback) {
                if (req.body.joinTo && req.body.joinTo) {
                    var dataMatch = { createdAt: { $gte: new Date(req.body.joinFrom), $lte: new Date(req.body.joinTo) } }
                } else {
                    var dataMatch = {}
                }

                if (req.body.couponStatus) {
                    var couponStatus = { 'coupon.couponStatus': req.body.couponStatus }
                } else {
                    var couponStatus = {}
                }
                if (req.body.cashStatus) {
                    var cashStatus = { 'cashPrize.cashStatus': req.body.cashStatus }
                } else {
                    var cashStatus = {}
                }
                var tempCond = {};

                Object.getOwnPropertyNames(req.body).forEach(function(key, idx, array) {
                    if (!(key == "giftsType" || key == "joinFrom" || key == "joinTo" || key == 'couponStatus' || key == 'cashStatus')) {
                        tempCond[key] = req.body[key];
                        console.log("tempCOndition===>" + JSON.stringify(tempCond))
                        condition.$and.push(data)
                    }
                });
                if (condition.$and.length == 0) {
                    delete condition.$and;
                }

                Object.assign(tempCond, dataMatch)
                Object.assign(tempCond, couponStatus)
                Object.assign(tempCond, cashStatus)
                callback(null, tempCond)
            },
            function(tempCond, callback) {
                switch (data) {
                    case 'totalBrolixGifts':
                        var matchData = {}
                        break;

                    case 'totalCouponsGifts':
                        var updateData = { $unwind: "$coupon" }
                        var matchData = { 'coupon.type': "WINNER" }
                        break;

                    case 'totalCashGifts':
                        var updateData = { $unwind: "$cashPrize" }
                        var matchData = {}
                        break;

                    case 'totalHiddenGifts':
                        var updateData = { $unwind: "$hiddenGifts" }
                        var matchData = {}
                        break;

                    case 'totalExchanged':
                        var updateData = { $unwind: "$coupon" }
                        var matchData = { 'coupon.status': "EXCHANGED" }
                        break;

                    case 'totalSentCoupons':
                        var updateData = { $unwind: "$coupon" }
                        var matchData = { 'coupon.status': "SEND" }
                        break;

                    case 'totalSentCash':
                        var updateData = { $unwind: "$sendCashListObject" }
                        var matchData = {}
                        break;

                    default:
                        var updateData = { $unwind: "$cashPrize" }
                        var matchData = {}
                }
                console.log("condition before callback==>>" + JSON.stringify(condition))
                console.log("updated data===>." + updateData)
                Object.assign(tempCond, matchData)
                callback(null, tempCond)
            },
            function(tempCond, callback) {

                console.log("tempCond===>" + JSON.stringify(tempCond))
                    // console.log("updateData===>"+JSON.stringify(updateData))
                    // console.log("pathData1===>"+JSON.stringify(pathData1))
                    // console.log("pathData===>"+JSON.stringify(pathData))
                var query = tempCond;
                if (data == 'totalBrolixGifts') {
                    module.exports.totalBrolixGift(req, res, query)
                } else if (data == 'totalCouponsGifts') {
                    module.exports.totalCouponGifts(req, res, query)
                } else if (data == 'totalCashGifts') {
                    module.exports.totalCashGifts(req, res, query)
                } else if (data == 'totalHiddenGifts') {
                    module.exports.totalHiddenGifts(req, res, query)
                } else if (data == 'totalExchanged') {
                    module.exports.totalExchangedCoupon(req, res, query)
                } else if (data == 'totalSentCoupons') {
                    module.exports.totalSentCoupon(req, res, query)
                } else if (data == 'totalSentCash') {
                    module.exports.totalSentCash(req, res, query)
                } else {
                    module.exports.totalBrolixGift(req, res, query)
                }
            }

        ], function(err, result, condition) {
            res.send({
                responseCode: 200,
                responseMessage: 'Filtered gifts.',
                data: result
            });
        })
    },


    "brolixPaymentFilter": function(req, res) {
        var data = req.body.paymentCardType;

        waterfall([
            function(callback) {
                if (req.body.joinTo && req.body.joinTo) {
                    var dataMatch = { createdAt: { $gte: new Date(req.body.joinFrom), $lte: new Date(req.body.joinTo) } }
                } else {
                    var dataMatch = {}
                }

                if (req.body.cardType) {
                    var cardType = { 'luckCardObject.chances': req.body.cardType }
                } else {
                    var cardType = {}
                }

                if (req.body.couponStatus) {
                    var couponStatus = { 'coupon.couponStatus': req.body.couponStatus }
                } else {
                    var couponStatus = {}
                }

                var tempCond = {};

                Object.getOwnPropertyNames(req.body).forEach(function(key, idx, array) {
                    if (!(key == "paymentCardType" || key == "joinFrom" || key == "joinTo" || key == 'cardType' || key == 'couponStatus')) {
                        tempCond[key] = req.body[key];
                        console.log("tempCOndition===>" + JSON.stringify(tempCond))

                    }
                });

                Object.assign(tempCond, dataMatch)
                Object.assign(tempCond, cardType)
                Object.assign(tempCond, couponStatus)

                callback(null, tempCond)
            },
            function(tempCond, callback) {
                var query = tempCond
                if (data == 'soldLuckCard') {
                    module.exports.totalSoldLuckCard(req, res, query)
                } else if (data == 'soldCoupon') {
                    var matchQuery = { 'coupon.type': "PURCHASED" }
                    Object.assign(tempCond, matchQuery)
                    module.exports.soldCoupon(req, res, query)
                } else {
                    module.exports.totalSoldLuckCard(req, res, query)
                }
            }

        ], function(err, result) {
            res.send({
                responseCode: 200,
                responseMessage: 'Filtered Ads.',
                data: result
            });
        })
    },

    "dollorPaymentFilter": function(req, res) {
        var data = req.body.paymentCardType;

        waterfall([
            function(callback) {
                if (req.body.joinTo && req.body.joinTo) {
                    var dataMatch = { createdAt: { $gte: new Date(req.body.joinFrom), $lte: new Date(req.body.joinTo) } }
                } else {
                    var dataMatch = {}
                }

                if (req.body.cardType) {
                    var cardType = { 'upgradeCardObject.viewers': req.body.cardType }
                } else {
                    var cardType = {}
                }

                if (req.body.cashStatus) {
                    var cashStatus = { 'cashPrize.cashStatus': req.body.cashStatus }
                } else {
                    var cashStatus = {}
                }

                var tempCond = {};

                Object.getOwnPropertyNames(req.body).forEach(function(key, idx, array) {
                    if (!(key == "paymentCardType" || key == "joinFrom" || key == "joinTo" || key == 'cardType')) {
                        tempCond[key] = req.body[key];
                        console.log("tempCOndition===>" + JSON.stringify(tempCond))

                    }
                });

                Object.assign(tempCond, dataMatch)
                Object.assign(tempCond, cashStatus)
                Object.assign(tempCond, cardType)
                callback(null, tempCond)
            },
            function(tempCond, callback) {
                var query = tempCond
                if (data == 'soldUpgradeCards') {
                    module.exports.totalSoldUpgradeCard(req, res, query)
                } else if (data == 'cashGifts') {

                    module.exports.cashGift(req, res, query)
                } else {
                    module.exports.totalSoldUpgradeCard(req, res, query)
                }
            }

        ], function(err, result, condition) {
            res.send({
                responseCode: 200,
                responseMessage: 'Filtered Ads.',
                data: result
            });
        })
    },


    "showUserPage": function(req, res) {
        createNewPage.find({ userId: req.params.id, status: "ACTIVE" }, 'pageName').exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No page found." }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No page found." }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "All pages show successfully."
                })
            }
        })
    },

    "adsOnPage": function(req, res) {
        createNewAds.find({ pageId: req.params.id }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No page found." }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "All pages show successfully."
                })
            }
        })
    },

    "winnersOnPage": function(req, res) {
        createNewAds.find({ pageId: req.params.id }).exec(function(err, result) {
            console.log("result--->>", result)
            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else {
                var array = [];
                for (var i = 0; i < result.length; i++) {
                    console.log("array--->>", array)
                    for (var j = 0; j < result[i].winners.length; j++) {
                        array.push(result[i].winners[j])
                    }
                }
                console.log("array--->>", array)
                User.find({ _id: { $in: array } }).exec(function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (result1.length == 0) { res.send({ responseCode: 404, responseMessage: "No winner found" }); } else {
                        res.send({
                            result: result1,
                            responseCode: 200,
                            responseMessage: "List of all winners show successfully."
                        })
                    }
                })
            }
        })
    },

    "pageAdminsDetail": function(req, res) {
        var array = [];
        createNewPage.findOne({ _id: req.params.id }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: err }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No page found." }); } else {
                for (var i = 0; i < result.adAdmin.length; i++) {
                    array.push(result.adAdmin[i].userId)
                }
                User.find({ _id: { $in: array } }).exec(function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: err }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No user found." }); } else {
                        res.send({
                            result: result1,
                            responseCode: 200,
                            responseMessage: "All pages show successfully."

                        })
                    }
                })
            }
        })
    },


    "showReportOnAd": function(req, res) {
        createNewReport.find({ adId: req.params.id }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: err }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No report found on this ad." }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "All report show successfully."
                })
            }
        })
    },

    "ownerDetails": function(req, res) {
        createNewPage.find({ _id: req.params.id }, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No page found." }); } else {
                var userId1 = result[0].userId;
                console.log("userId--->>>", userId1)
                User.findOne({ _id: userId1 }, function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: "No user found." }); } else {
                        res.send({
                            result: result1,
                            responseCode: 200,
                            responseMessage: "User detail show successfully."
                        })
                    }
                })
            }
        })
    },

    "PagesAdmins": function(req, res) {
        createNewPage.find({status:'ACTIVE'}, function(err, result) {
            var array = [];
            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No page found." }); } else {
                for (var i = 0; i < result.length; i++) {
                    if (result[i].adAdminCount > 0) {
                        array.push(result[i]._id)
                    }
                }
                createNewPage.find({ _id: { $in: array } }).populate('adAdmin.userId', 'firstName lastName').exec(function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (result1.length == 0) { res.send({ responseCode: 404, responseMessage: "No page found." }); } else {
                        var count = 0;
                        for (var i = 0; i < result1.length; i++) {
                            count++;
                        }
                        res.send({
                            result: result1,
                            count: count,
                            responseCode: 200,
                            responseMessage: "Page detail show successfully."
                        })
                    }
                })
            }
        })
    },

    "userInfo": function(req, res) {
        User.findOne({ _id: req.params.id }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
            if (!result) { res.send({ responseCode: 404, responseMessage: 'No user found' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "All info shown successfully."
                });
            }
        })
    },

    "showReportedAd": function(req, res) {
        createNewAds.find({}).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                var array = [];
                for (var i = 0; i < result.length; i++) {
                    if (result[i].reportOnAd > 0) {
                        array.push(result[i]._id)
                    }
                }
                createNewAds.find({ _id: { $in: array } }).populate('pageId', 'pageName').populate('userId', 'mobileNumber').exec(function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (result1.length == 0) { res.send({ count: 0, responseCode: 404, responseMessage: "No ad found." }); } else {
                        var count = 0;
                        for (var i = 0; i < result1.length; i++) {
                            count++;
                        }
                        res.send({
                            result: result1,
                            count: count,
                            responseCode: 200,
                            responseMessage: "Ad detail show successfully."
                        })
                    }
                })
            }
        })
    },

    "adUpgradedByDollor": function(req, res) {
        createNewAds.find({}).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                var array = [];
                for (var i = 0; i < result.length; i++) {
                    if (result[i].cash > 0) {
                        array.push(result[i]._id)
                    }
                }
                console.log("array-->>" + array)
                createNewAds.find({ _id: { $in: array } }).populate('pageId', 'pageName').populate('userId', 'mobileNumber').exec(function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (result1.length == 0) { res.send({ responseCode: 404, responseMessage: "No ad found." }); } else {
                        var count = 0;
                        for (var i = 0; i < result1.length; i++) {
                            count++;
                        }
                        res.send({
                            result: result1,
                            count: count,
                            responseCode: 200,
                            responseMessage: "Ad detail show successfully."
                        })
                    }
                })
            }
        })
    },

    "adUpgradedByBrolix": function(req, res) {
        createNewAds.find({}).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                var array = [];
                for (var i = 0; i < result.length; i++) {
                    if (result[i].couponPurchased > 0) {
                        array.push(result[i]._id)
                    }
                }
                console.log("array-->>" + array)
                createNewAds.find({ _id: { $in: array } }).populate('pageId', 'pageName').populate('userId', 'mobileNumber').exec(function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (result1.length == 0) { res.send({ responseCode: 404, responseMessage: "No ad found." }); } else {
                        var count = 0;
                        for (var i = 0; i < result1.length; i++) {
                            count++;
                        }
                        res.send({
                            result: result1,
                            count: count,
                            responseCode: 200,
                            responseMessage: "Ad detail show successfully."
                        })
                    }
                })
            }
        })
    },

    "unblockUser": function(req, res) {
        console.log("req.body.userId", req.params.userId);
        User.findByIdAndUpdate({
            _id: req.params.userId
        }, {
            '$set': {
                'status': 'ACTIVE'
            }
        }, {
            new: true
        }, function(err, result) {
            if (err) {
                res.send({
                    responseCode: 409,
                    responseMessage: 'Internal server errorwqwq'
                });
            } else if (!result) return res.status(404).send({
                responseMessage: "Please enter correct adId"
            })
            else {
                res.send({
                    // result: result,
                    responseCode: 200,
                    responseMessage: "User UnBlocked successfully."
                });
            }

        });
    },

    /* --------------------------------- Manage Gift Section ---------------------------------------*/



    "totalBrolixGift": function(req, res, query) {
        console.log(query.length)
        console.log("totalBrolixGift query===>" + JSON.stringify(query))
        if (!(query.length == 1)) {
            console.log("query")
            var updateData = query;
        } else {
            console.log("rather than query")
            var updateData = {};
        }
        User.aggregate({ $unwind: "$brolix" }, { $match: updateData }).exec(function(err, result) {
            //   console.log("brolix--->>", result)
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
            if (!result) { res.send({ result: result, responseCode: 403, responseMessage: "No matching result available." }); } else {
                var arr = [];
                for (i = 0; i < result.length; i++) {
                    //console.log("data--->>>>", result[i].brolix, i);
                    arr.push(parseInt(result[i].brolix));
                }
                var sum = arr.reduce((a, b) => a + b, 0);
                //console.log("arrrrr", sum);
                res.send({
                    result: result,
                    totalBrolix: sum,
                    responseCode: 200,
                    responseMessage: "Total brolix Shows successfully."
                });
            }
        });
    },

    "totalCouponGifts": function(req, res, query) {
        console.log(query.length)
        console.log("query===>" + JSON.stringify(query))
        if (!(query.length == 1)) {
            console.log("query")
            var updateData = query;
        } else {
            console.log("rather than query")
            var updateData = { 'coupon.type': "WINNER" };
        }
        User.aggregate({ $unwind: "$coupon" }, { $match: updateData }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: 'No coupon found' }); } else {
                var count = 0;
                for (i = 0; i < result.length; i++) {
                    count++;
                }
                User.populate(result, 'coupon.pageId', function(err, result1) {
                    User.populate(result1, {
                        path: 'coupon.pageId.userId',
                        model: 'brolixUser',
                        select: 'firstName lastName email'
                    }, function(err, result2) {
                        res.send({
                            result: result1,
                            count: count,
                            responseCode: 200,
                            responseMessage: "Sold Coupon shows successfully."
                        });
                    })
                })
            }
        })
    },

    "totalCashGifts": function(req, res, query) {
        console.log(query.length)
        console.log("query===>" + JSON.stringify(query))
        if (!(query.length == 1)) {
            console.log("query")
            var updateData = query;
        } else {
            console.log("rather than query")
            var updateData = {};
        }
        User.aggregate({ $unwind: "$cashPrize" }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: 'No coupon found' }); } else {
                console.log(result)
                var count = 0;
                for (i = 0; i < result.length; i++) {
                    count++;
                }
                User.populate(result, 'cashPrize.pageId', function(err, result1) {
                    User.populate(result1, {
                        path: 'cashPrize.pageId.userId',
                        model: 'brolixUser',
                        select: 'firstName lastName email'
                    }, function(err, result2) {
                        res.send({
                            result: result1,
                            count: count,
                            responseCode: 200,
                            responseMessage: "Cash gift shows successfully."
                        });
                    })
                })
            }
        })
    },

    "totalHiddenGifts": function(req, res, query) {
        console.log(query.length)
        console.log("query===>" + JSON.stringify(query))
        if (!(query.length == 1)) {
            console.log("query")
            var updateData = query;
        } else {
            console.log("rather than query")
            var updateData = {};
        }
        User.aggregate({ $unwind: "$hiddenGifts" }, { $match: updateData }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ count: 0, responseCode: 404, responseMessage: 'No coupon found' }); } else {
                var count = 0;
                for (i = 0; i < result.length; i++) {
                    count++;
                }
                User.populate(result, 'hiddenGifts.pageId', function(err, result1) {
                    User.populate(result1, {
                        path: 'hiddenGifts.pageId.userId',
                        model: 'brolixUser',
                        select: 'firstName lastName email'
                    }, function(err, result2) {
                        res.send({ result: result1, count: count, responseCode: 200, responseMessage: "Hidden gift shows successfully." });
                    })
                })
            }
        })
    },

    "totalExchangedCoupon": function(req, res, query) {
        console.log(query.length)
        console.log("query===>" + JSON.stringify(query))
        if (!(query.length == 1)) {
            console.log("query")
            var updateData = query;
        } else {
            console.log("rather than query")
            var updateData = { 'coupon.status': "EXCHANGED" }
        }
        User.aggregate({ $unwind: "$coupon" }, { $match: updateData }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ count: 0, responseCode: 404, responseMessage: 'No coupon found' }); } else {
                var count = 0;
                for (i = 0; i < result.length; i++) {
                    count++;
                }
                User.populate(result, 'coupon.adId', function(err, result1) {
                    User.populate(result1, {
                        path: 'coupon.adId.couponExchange.receiverId',
                        model: 'brolixUser',
                        select: 'firstName lastName email'
                    }, function(err, result2) {
                        res.send({ result: result2, count: count, responseCode: 200, responseMessage: "Exchanged gift shown successfully." });
                    })
                })
            }
        })
    },

    "totalSentCoupon": function(req, res, query) {
        console.log(query.length)
        console.log("query===>" + JSON.stringify(query))
        if (!(query.length == 1)) {
            console.log("query")
            var updateData = query;
        } else {
            console.log("rather than query")
            var updateData = { 'coupon.status': "SEND" }
        }
        User.aggregate({ $unwind: "$coupon" }, { $match: updateData }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ count: 0, responseCode: 404, responseMessage: 'No coupon found' }); } else {
                var count = 0;
                for (i = 0; i < result.length; i++) {
                    count++;
                }
                User.populate(result, 'coupon.pageId', function(err, result1) {
                    User.populate(result1, 'coupon.adId', function(err, result2) {
                        User.populate(result1, {
                            path: 'coupon.adId.couponSend.receiverId',
                            model: 'brolixUser',
                            select: 'firstName lastName email'
                        }, function(err, result2) {
                            res.send({ result: result2, count: count, responseCode: 200, responseMessage: "Hidden gift shows successfully." });
                        })
                    })
                })
            }
        })
    },

    "totalSentCash": function(req, res, query) {
        console.log(query.length)
        console.log("query===>" + JSON.stringify(query))
        if (!(query.length == 1)) {
            console.log("query")
            var updateData = query;
        } else {
            console.log("rather than query")
            var updateData = {}
        }
        User.aggregate({ $unwind: "$sendCashListObject" }, { $match: updateData }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ count: 0, responseCode: 404, responseMessage: 'No coupon found' }); } else {
                var arr = [];
                var count = 0;
                for (i = 0; i < result.length; i++) {
                    arr.push(parseInt(result[i].sendCashListObject.cash));
                    count++;
                }
                var sum = arr.reduce((a, b) => a + b, 0);
                console.log("arrrrr", sum);
                User.populate(result, 'sendCashListObject.senderId', function(err, result1) {
                    res.send({
                        result: result1,
                        totalCash: sum,
                        count: count,
                        responseCode: 200,
                        responseMessage: "Send Coupon shows successfully."
                    });
                })
            }
        })
    },

    "topFiftyCashProviders": function(req, res) {
        createNewAds.find({ adsType: 'cash', status: 'ACTIVE' }).sort({ cashAdPrize: -1 }).populate('pageId', 'pageName').limit(50).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) {
                ({ count: 0, responseCode: 404, responseMessage: 'No result found' })
            } else {
                var count = 0;
                for (var i = 0; i < result.length; i++) {
                    count++;
                }
                res.send({ result: result, count: count, responseCode: 200, responseMessage: "Top cash providers shown successfully." });
            }
        })
    },

    "topFiftyCouponProviders": function(req, res) {
        createNewAds.find({ adsType: 'coupon', status: 'ACTIVE' }).sort({ couponBuyersLength: -1 }).populate('pageId', 'pageName').limit(50).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) {
                ({ count: 0, responseCode: 404, responseMessage: 'No result found' })
            } else {
                var count = 0;
                for (var i = 0; i < result.length; i++) {
                    count++;
                }
                res.send({ result: result, count: count, responseCode: 200, responseMessage: "Top coupon providers shown successfully." });
            }
        })
    },


    /* --------------------------------- Manage payment Section -----------------------------------------------------------*/

    "luckCardUsedAd": function(req, res) {
        var obj = (req.body.luckId);
        var array = [];
        if (obj == null || obj == '' || obj === undefined) { res.send({ responseCode: 500, responseMessage: 'please enter luckId' }); } else {
            User.findOne({ 'luckUsedAd.luckId': obj }).exec(function(err, result) {
                if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "Card not used yet." }); } else {
                    for (var i = 0; i < result.luckUsedAd.length; i++) {
                        if (result.luckUsedAd[i].luckId == obj) {
                            array.push(result.luckUsedAd[i].adId)
                        }
                    }
                    createNewAds.find({ _id: { $in: array } }).exec(function(err, result1) {
                        if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (result1.length == 0) { res.send({ responseCode: 404, responseMessage: "No ad found." }); } else {
                            res.send({ result: result1, responseCode: 200, responseMessage: "Ad detail show successfully." })
                        }
                    })
                }
            })
        }
    },

    "upgradeCardUsedAd": function(req, res) {
        var obj = (req.body.upgradeId);
        var array = [];
        if (obj == null || obj == '' || obj === undefined) { res.send({ responseCode: 500, responseMessage: 'please enter upgradeId' }); } else {
            User.findOne({ 'UpgradeUsedAd.upgradeId': obj }).exec(function(err, result) {
                if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "Card not used yet." }); } else {
                    for (var i = 0; i < result.UpgradeUsedAd.length; i++) {
                        if (result.UpgradeUsedAd[i].upgradeId == obj) {
                            array.push(result.UpgradeUsedAd[i].adId)
                        }
                    }
                    createNewAds.find({ _id: { $in: array } }).exec(function(err, result1) {
                        if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (result1.length == 0) { res.send({ responseCode: 404, responseMessage: "No ad found." }); } else {
                            res.send({ result: result1, responseCode: 200, responseMessage: "Ad detail show successfully." })
                        }
                    })
                }
            })
        }
    },

    "paymentHistoryUpgradeCard": function(req, res) { // pageId in request
        User.find({ _id: req.params.id }, 'upgradeCardObject UpgradeUsedAd').populate('UpgradeUsedAd.adId').exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result[0].upgradeCardObject.length == 0) { res.send({ responseCode: 404, responseMessage: 'No card found' }) } else {
                res.send({ result: result, responseCode: 200, responseMessage: "All history shown successfully." });
            }
        })
    },

    "paymentHistoryLuckCard": function(req, res) { // pageId in request  { $in: ["text", "here"] }  'luckCardObject', 'luckUsedAd'
        User.find({ _id: req.params.id }, 'luckCardObject luckUsedAd').populate('luckUsedAd.adId').exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result[0].luckCardObject.length == 0) { res.send({ responseCode: 404, responseMessage: 'No card found' }) } else {
                res.send({ result: result, responseCode: 200, responseMessage: "All history shown successfully." });
            }
        })
    },

    "cashGift": function(req, res, query) {
        console.log(query.length)
        console.log("query===>" + JSON.stringify(query))
        if (!(query.length == 1)) {
            console.log("query")
            var updateData = query;
        } else {
            console.log("rather than query")
            var updateData = {}
        }
        User.aggregate({ $unwind: "$cashPrize" }, { $match: updateData }, function(err, results) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
            if (!results) { res.send({ responseCode: 404, responseMessage: "No result found." }); } else {
                var arr = [];
                var count = 0;
                for (i = 0; i < results.length; i++) {
                    count++;
                    arr.push(parseInt(results[i].cashPrize.cash));
                }
                var sum = arr.reduce((a, b) => a + b, 0);
                console.log("arrrrr", sum);
                User.populate(results, 'cashPrize.pageId', function(err, result1) {
                    User.populate(result1, {
                        path: 'cashPrize.pageId.userId',
                        model: 'brolixUser',
                        select: 'firstName lastName email'
                    }, function(err, result2) {
                        res.send({ result: result2, count: count, totalIncome: sum, responseCode: 200, responseMessage: "Cash gift shows successfully." });
                    })
                })
            }
        });
    },

    "soldCoupon": function(req, res, query) {
        console.log(query.length)
        console.log("query===>" + JSON.stringify(query))
        if (!(query.length == 1)) {
            console.log("query")
            var updateData = query;
        } else {
            console.log("rather than query")
            var updateData = { 'coupon.type': "PURCHASED" }
        }
        User.aggregate({ $unwind: "$coupon" }, { $match: updateData }, function(err, results) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
            if (!results) { res.send({ results: results, responseCode: 403, responseMessage: "No result found." }); } else {
                var count = 0;
                for (i = 0; i < results.length; i++) {
                    count++;
                }
                User.populate(results, 'coupon.pageId', function(err, result1) {
                    User.populate(result1, 'coupon.adId', function(err, result2) {
                        User.populate(result1, {
                            path: 'coupon.pageId.userId',
                            model: 'brolixUser',
                            select: 'firstName lastName email'
                        }, function(err, result2) {
                            res.send({ result: result2, count: count, responseCode: 200, responseMessage: "Cash gift shows successfully." });
                        })
                    })
                })
            }
        })
    },

    "pageInfo": function(req, res) {
        createNewPage.find({ _id: req.params.id }).populate('adAdmin.userId', 'firstName lastName').exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) {
                res.send({ responseCode: 404, responseMessage: "No page found" });
            } else {
                res.send({ result: result, responseCode: 200, responseMessage: "Page show successfully." });
            }
        })
    },

    "topFiftyBalances": function(req, res) {
        User.find({}).sort({ brolix: -1 }).limit(50).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                var count = 0;
                for (var i = 0; i < result.length; i++) {
                    count++;
                }
                res.send({ result: result, count: count, responseCode: 200, responseMessage: "Data show successfully." });
            }
        })
    },

    "topFiftyUpgradeCardBuyers": function(req, res) {
        User.find({}).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                var sortArray = result.sort(function(obj1, obj2) {
                    return obj2.upgradeCardObject.length - obj1.upgradeCardObject.length
                })
                var count = 0;
                for (var i = 0; i < sortArray.length; i++) {
                    count++;
                }
                res.send({ result: sortArray, count: count, responseCode: 200, responseMessage: "Data show successfully." });
            }
        })
    },

    "totalBrolixPrice": function(req, res) {
        User.aggregate({ $unwind: "$luckCardObject" }, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
            if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No card found." }); } else {
                var arr = [];
                var count = 0;
                for (i = 0; i < result.length; i++) {
                    count++;
                    arr.push(parseInt(result[i].luckCardObject.brolix));
                }
                var sum = arr.reduce((a, b) => a + b, 0);
                res.send({ totalBrolix: sum, responseCode: 200, responseMessage: "Total brolix price shown successfully." });
            }
        });
    },

    "totalCashPrice": function(req, res) {
        User.aggregate({ $unwind: "$upgradeCardObject" }, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
            if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No card found." }); } else {
                var arr = [];
                var count = 0;
                for (i = 0; i < result.length; i++) {
                    count++;
                    arr.push(parseInt(result[i].upgradeCardObject.cash));
                }
                var sum = arr.reduce((a, b) => a + b, 0);
                res.send({ totalCash: sum, responseCode: 200, responseMessage: "Total cash price shown successfully." });
            }
        });
    },

    "adInfo": function(req, res) {
        createNewAds.findOne({ _id: req.params.id }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: 'No ad found' }); } else {
                res.send({ result: result, responseCode: 200, responseMessage: "Ad info shown successfully." });
            }
        })
    },

    "topFiftyLuckCardBuyers": function(req, res) {
        User.find({}).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                var sortArray = result.sort(function(obj1, obj2) {
                    return obj2.luckCardObject.length - obj1.luckCardObject.length
                })
                var count = 0;
                for (var i = 0; i < sortArray.length; i++) {
                    count++;
                }
                res.send({ result: sortArray, count: count, responseCode: 200, responseMessage: "Data show successfully." });
            }
        })
    },

    "topFiftyAds": function(req, res) { //sort({ viewerLenght: -1 }).limit(50).populate('pageId', 'pageName')
        createNewAds.find({}).sort({ viewerLenght: -1 }).limit(50).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 11' }); } else {
                var count = 0;
                for (var i = 0; i < result.length; i++) {
                    count++;
                }
                res.send({ result: result, count: count, responseCode: 200, responseMessage: "Top ads show successfully." });
            }
        })
    },



    /************************************ Admin tool sections *****************************************************************/

    "addNewCoupon": function(req, res) {
        console.log("---addNewCoupon---")
        if (req.body.pageName == undefined || req.body.pageName == null || req.body.pageName == '') { res.send({ responseCode: 403, responseMessage: 'Please enter pageName' }); } else if (req.body.pageId == undefined || req.body.pageId == null || req.body.pageId == '') { res.send({ responseCode: 403, responseMessage: 'Please enter pageId' }); } else {
            var couponCode = voucher_codes.generate({ length: 6, count: 1, charset: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" });
            var obj = {
                pageId: req.body.pageId,
                pageName: req.body.pageName,
                coverImage: req.body.coverImage,
                giftDescription: req.body.giftDescription,
                couponExpiryDate: req.body.couponExpiryDate,
                adsType: "ADMINCOUPON",
                couponBuyersLength: 0,
                sellCoupon: false,
                couponSellPrice: 0,
                couponStatus: 'VALID',
                couponCode: couponCode
            };

            var coupon = createNewAds(obj)
            coupon.save(function(err, result) {
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                    createNewPage.findOneAndUpdate({ _id: req.body.pageId }, { $inc: { adsCount: 1 } }, { new: true }).exec(function(err, result1) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                            res.send({ result: result, responseCode: 200, responseMessage: "Coupon created successfully" });
                        }
                    })
                }
            })
        }
    },


    "viewCoupon": function(req, res) {
        createNewAds.findOne({ _id: req.params.id }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: 'No coupon found' }); } else {
                res.send({ result: result, responseCode: 200, responseMessage: "Coupon shown successfully." });
            }
        })
    },

    "editCoupon": function(req, res) {
        createNewAds.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: 'No coupon found' }); } else {
                res.send({ result: result, responseCode: 200, responseMessage: "Coupon updated successfully." })
            }
        })
    },

    "removeCoupon": function(req, res) {
        createNewAds.findOneAndUpdate({ _id: req.body.CouponId }, { $set: { 'status': "REMOVED" } }, { new: true }, function(err, result) {
            console.log("result--->>", result)
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: 'No coupon found' }); } else {
                res.send({ responseCode: 200, responseMessage: "Coupon removed successfully." })
            }
        })
    },

    "showListOFCoupon": function(req, res) {
        createNewAds.find({ adsType: 'ADMINCOUPON', status: 'ACTIVE' }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ count: 0, responseCode: 500, responseMessage: 'No coupon found' }); } else {
                res.send({ result: result, responseCode: 200, responseMessage: "Coupon removed successfully." })
            }
        })
    },

    "postCouponToStore": function(req, res) {
        createNewAds.findOneAndUpdate({ _id: req.params.id }, { $set: { couponSellPrice: req.body.couponSellPrice, couponBuyersLength: req.body.couponBuyersLength, sellCoupon: true } }, { new: true }, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: 'No coupon found' }); } else {
                res.send({ responseCode: 200, responseMessage: "Coupon posted to store successfully." })
            }
        })
    },

    "showPageName": function(req, res) {
        createNewPage.find({ status: 'ACTIVE' }, 'pageName').exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: 'No page found' }); } else {
                res.send({ result: result, responseCode: 200, responseMessage: "All page with name shown successfully" })
            }
        })
    },

    "createSystemUser": function(req, res) {
        waterfall([
            function(callback) {
                if (!req.body.permissions) { res.send({ responseCode: 403, responseMessage: 'Please enter permission to system admin' }); } else if (req.body.permissions.length == 0) { res.send({ responseCode: 403, responseMessage: 'Please give atleast one permission to system admin' }); } else {
                    var obj = {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        password: req.body.password,
                        type: 'SYSTEMADMIN'
                    };
                    User.findOne({ email: req.body.email }, function(err, result) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 11' }); } else if (result) { res.send({ responseCode: 400, responseMessage: "Email id must be unique" }); } else {
                            var objuser = new User(obj);
                            objuser.save(function(err, result) {
                                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 22' }); } else {
                                    callback(null, result)
                                }
                            })
                        }
                    })
                }
            },
            function(result, callback) {
                User.findOneAndUpdate({ type: 'ADMIN' }, { $push: { permissions: result._id } }).exec(function(err, result1) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error 33' }); } else { callback(null, result) }
                })
            },
            function(result, callback) {
                console.log("result--->>" + result)

                for (var i = 0; i < req.body.permissions.length; i++) {
                    console.log("i--->>>", i)
                    switch (req.body.permissions[i]) {

                        case "manageUser":
                            User.findOneAndUpdate({ _id: result._id }, { $push: { permissions: "manageUser" } }).exec(function(err, result1) {
                                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 44' }); } else {
                                    console.log("1")

                                }
                            })
                            break;

                        case "managePages":
                            User.findOneAndUpdate({ _id: result._id }, { $push: { permissions: "managePages" } }).exec(function(err, result1) {
                                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 55' }); } else {
                                    console.log("2")
                                }
                            })
                            break;

                        case "manageAds":
                            User.findOneAndUpdate({ _id: result._id }, { $push: { permissions: "manageAds" } }).exec(function(err, result3) {
                                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 66' }); } else {
                                    console.log("3")
                                }
                            })

                            break;

                        case "manageCards":
                            User.findOneAndUpdate({ _id: result._id }, { $push: { permissions: "manageCards" } }).exec(function(err, result4) {
                                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 77' }); } else {
                                    console.log("4")
                                }
                            })
                            break;

                        case "manageGifts":
                            User.findOneAndUpdate({ _id: result._id }, { $push: { permissions: "manageGifts" } }).exec(function(err, result4) {
                                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 88' }); } else {
                                    console.log("5")
                                }
                            })
                            break;

                        case "managePayments":
                            User.findOneAndUpdate({ _id: result._id }, { $push: { permissions: "managePayments" } }).exec(function(err, result4) {
                                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 99' }); } else {
                                    console.log("6")
                                }
                            })
                            break;

                        case "adminTool":
                            User.findOneAndUpdate({ _id: result._id }, { $push: { permissions: "adminTool" } }).exec(function(err, result4) {
                                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 10' }); } else {
                                    console.log("7")
                                }
                            })
                            break;

                    }
                    if (i == req.body.permissions.length - 1) {
                        callback(null)
                    }
                }
            }
        ], function(err, result) {
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "System user successfully created"
            });
        })
    },

    "checkPermission": function(req, res) {
        User.findOne({ _id: req.body.userId }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: 'No user found' }); } else {
                var flag = result.permissions.find(permissions => permissions == req.body.permission)
                console.log("flag--->>", flag)
                if (flag === undefined) { res.send({ responseCode: 400, responseMessage: "You are not allowed to go." }); } else {
                    res.send({
                        responseCode: 200,
                        responseMessage: "You are allowed to go."
                    });
                }
            }
        })
    },

    "listOfSystemAdmin": function(req, res) {
        User.find({ type: 'SYSTEMADMIN', status: 'ACTIVE' }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ count: 0, responseCode: 404, responseMessage: 'No System user found' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "All System admin shown successfully."
                })
            }
        })
    },

    "removeSystemAdmin": function(req, res) {
        User.findOneAndUpdate({ _id: req.params.id }, { $set: { status: 'INACTIVE' } }, { new: true }, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: 'No user found' }); } else {
                res.send({ responseCode: 200, responseMessage: "System admin removed successfully." })
            }
        })
    },

    "editSystemAdmin": function(req, res) {
        User.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: 'No user found' }); } else {
                res.send({ result: result, responseCode: 200, responseMessage: "Details updated successfully." })
            }
        })
    },

    "allCountriesfind": function(req, res) {
        res.send({
            result: allCountries.all,
            responseCode: 200,
            responseMessage: "Show all Countries"
        });
    },

    "allstatefind": function(req, res) {
        console.log("req.body", req.body.country)
        var name = countries.getCode(req.body.country)
        console.log("name", name)

        var result = [];
        result = country.states(name);
        console.log("rseult", result);
        res.send({
            result: result,
            responseCode: 200,
            responseMessage: "Show all Countries"
        });
    },

    "sendCashBrolix": function(req, res) {
        var ids = req.body.Id;
        console.log("ids", ids)
        var option = req.body.Cash ? { $inc: { cash: req.body.Cash } } : { $inc: { brolix: req.body.Brolix } }
        console.log(option)
        User.update({ _id: { $in: ids } }, option, { multi: true }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) return res.status(404).send({ responseMessage: "Records not fond" })
            res.send({ result: result, responseCode: 200, responseMessage: 'Successfully updated' });
        })
    },

    "messageBroadcast": function(req, res) {
        var ids = req.body.userIds;
        var message = req.body.message;
        var IosDevice = [];
        var androidDevice = [];
        User.find({}, 'deviceType deviceToken', function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) return res.status(404).send({ responseMessage: "Records not fond" })
            for (var i = 0; i < result.length; i++) {
                result[i].deviceType == 'Android' ? androidDevice.push(result[i].deviceToken) : IosDevice.push(result[i].deviceToken)

            }
            functionHandler.android_notification(androidDevice, message);
            // functionHandler.iOS_notification(IosDevice,message);
            res.send({ responseCode: 200, responseMessage: 'Message brodcast successfully' })
        })
    },

    "uploadImage": function(req, res) {
        var form = new multiparty.Form();
        form.parse(req, function(err, fields, files) {
            console.log("Image_Path=======>>>> " + JSON.stringify(files.file[0].path));
            cloudinary.uploader.upload(files.file[0].path, function(result) {
                console.log(result)
                console.log("Url====>>>>" + result.url);
                res.send({
                    result: result,
                    serverStatus: 200,
                    response_message: "Image Uploaded"
                });
            });
        })
    },

    "zipcodFunction": function(req, res) {
        console.log("req", req.body)
        var zipcod = gps.gps2zip(req.body.lat, req.body.lng);
        res.send({
            result: zipcod,
            serverStatus: 200,
            response_message: "Image Uploaded"
        });
        console.log("zipcode", zipcod)
    },

    "adsWithLinks": function(req, res) {
        createNewAds.find({ promoteApp: true, status: "ACTIVE" }).populate('pageId', 'pageName').populate('userId', 'mobileNumber').exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ count: 0, responseCode: 404, responseMessage: 'No ad found' }); } else {
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

    "notificationToAdmin": function(req, res) {
        waterfall([
            function(callback) {
                var array = [];
                User.find({}, 'firstName lastName email createdAt').sort({ 'createdAt': -1 }).limit(10).exec(function(err, result) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 400, responseMessage: 'No user found' }); } else {
                        array.push(result)
                        callback(null, array)
                    }
                })
            },
            function(array, callback) {
                createNewAds.find({}, 'pageName adsType createdAt').sort({ 'createdAt': -1 }).limit(10).exec(function(err, result2) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result2.length == 0) { res.send({ responseCode: 400, responseMessage: 'No ad found' }); } else {
                        array.push(result2)
                        callback(null, array)
                    }
                })
            },
            function(array, callback) {
                createNewPage.find({}, ' pageName createdAt').sort({ 'createdAt': -1 }).limit(10).exec(function(err, result3) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result3.length == 0) { res.send({ responseCode: 400, responseMessage: 'No ad found' }); } else {
                        array.push(result3)
                            // var sortArray = array.sort(function(obj1, obj2) {
                            //     return obj2.createdAt - obj1.createdAt
                            // })
                        callback(null, array)
                    }
                })
            },
        ], function(err, result) {
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "All info shown successfully."
            })
        })
    },

    "userfilter": function(req, res) {
        var condition = { $and: [] };
        var todayDate = new Date();
        var newTodayDate = new Date();
        var data = req.body.userType;

        waterfall([
            function(callback) {
                if (data == "cashWinners" || data == "couponWinners" || data == "totalWinners") {
                    switch (data) {
                        case 'cashWinners':
                            var query = { adsType: "cash" };
                            break;

                        case 'couponWinners':
                            var query = { adsType: "coupon" };
                            break;

                        case 'totalWinners':
                            var query = {};
                            break;
                    }
                    var arrayWinner = [];
                    createNewAds.find(query).exec(function(err, result) {
                        console.log("dfgfg")
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                            var count = 0;
                            for (i = 0; i < result.length; i++) {
                                for (j = 0; j < result[i].winners.length; j++) {
                                    arrayWinner.push(result[i].winners[j]);
                                    count++;
                                    console.log("count--", count)
                                }
                            }
                            console.log("array--->" + arrayWinner)

                            console.log("count-->>>", count)
                            callback(null, arrayWinner)
                        }
                    })
                } else {
                    callback(null, "null")
                }

            },
            function(arrayWinner, callback) {
                switch (data) {
                    case 'personalUsers':
                        var updateData = { type: "USER" };
                        condition.$and.push(updateData)
                        break;

                    case 'businessUsers':
                        var updateData = { type: "Advertiser" };
                        condition.$and.push(updateData)
                        break;

                    case 'liveUsers':
                        var updateData = { type: "USER" };
                        condition.$and.push(updateData)
                        break;

                    case 'totalWinners':
                        var updateData = { _id: { $in: arrayWinner } };
                        condition.$and.push(updateData)
                        break;

                    case 'cashWinners':
                        var updateData = { _id: { $in: arrayWinner } };
                        condition.$and.push(updateData)
                        break;

                    case 'couponWinners':
                        var updateData = { _id: { $in: arrayWinner } };
                        condition.$and.push(updateData)
                        break;

                    case 'blockedUsers':
                        var updateData = { type: "BLOCK" };
                        condition.$and.push(updateData)
                        break;

                    default:
                        var updateData = { type: "USER" };
                        condition.$and.push(updateData)
                }
                console.log("condition before callback==>>" + JSON.stringify(condition))
                console.log("updated data===>." + updateData)
                callback(null, updateData)
            },
            function(updateData, callback) {

                console.log("todayDate==>" + todayDate)
                if (req.body.ageFrom && req.body.ageTo) {
                    //    data.setFullYear(data.getFullYear() + 1);

                    var fromDate = todayDate.setFullYear(todayDate.getFullYear() - req.body.ageFrom)
                    var toDate = newTodayDate.setFullYear(newTodayDate.getFullYear() - req.body.ageTo)

                    var fromUtcDate = new Date(fromDate);
                    var toUtcDate = new Date(toDate);
                    condition.$and.push({
                        dob: { $gte: fromUtcDate, $lte: toUtcDate }
                    })
                }
                if (req.body.joinTo && req.body.joinTo) {
                    condition.$and.push({
                        createdAt: { $gte: new Date(req.body.joinFrom).toUTCString(), $lte: new Date(req.body.joinTo).toUTCString() }
                    })
                }

                Object.getOwnPropertyNames(req.body).forEach(function(key, idx, array) {

                    if (!(key == "userType" || key == "ageFrom" || key == "ageTo" || key == "joinFrom" || key == "joinTo")) {
                        var tempCond = {};
                        tempCond[key] = req.body[key];
                        condition.$and.push(tempCond)
                    }
                });
                if (condition.$and.length == 0) {
                    delete condition.$and;
                }
                callback(null, condition)
            },
            function(condition, callback) {


                console.log("condition===>.." + JSON.stringify(condition))
                User.find(condition, function(err, result) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                        console.log("result;;;>" + result)
                        callback(null, result, condition)
                    }

                })
            }

        ], function(err, result, condition) {
            res.send({
                responseCode: 200,
                responseMessage: 'Filtered Users',
                data: result
            });
        })
    },

    "pagefilter": function(req, res) {
        var condition = { $and: [] };
        var todayDate = new Date();
        var newTodayDate = new Date();
        var data = req.body.pageType;

        waterfall([
            function(callback) {
                if (data == "unpublishedPages") {
                    createNewAds.find({}, 'pageId', function(err, result) {
                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) return res.status(404).send({ responseMessage: "No page found" })
                        var result = result.map(function(a) {
                            return a.pageId;
                        });
                        var allPageIds = _.uniq(result);
                        callback(null, allPageIds)
                            // createNewPage.find({_id:{$nin:allPageIds}},function(err, result){
                            // res.send({ responseCode: 200, responseMessage: 'Here all the Unsuscribe pages', data:result })
                            // })
                    })
                } else {
                    callback(null, "null")
                }

            },
            function(allPageIds, callback) {
                switch (data) {
                    case 'blockedPages':
                        var updateData = { status: "BLOCK" };
                        condition.$and.push(updateData)
                        break;

                    case 'unpublishedPages':
                        var updateData = { _id: { $nin: allPageIds } };
                        condition.$and.push(updateData)
                        break;

                    case 'removedPages':
                        var updateData = { status: "REMOVED" };
                        condition.$and.push(updateData)
                        break;

                    case 'pagesAdmins':
                        var updateData = {};
                        condition.$and.push(updateData)
                        break;

                    default:
                        var updateData = {};
                        condition.$and.push(updateData)
                }
                console.log("condition before callback==>>" + JSON.stringify(condition))
                console.log("updated data===>." + updateData)
                callback(null, updateData)
            },
            function(updateData, callback) {

                if (req.body.joinTo && req.body.joinTo) {
                    condition.$and.push({
                        createdAt: { $gte: new Date(req.body.joinFrom).toUTCString(), $lte: new Date(req.body.joinTo).toUTCString() }
                    })
                }

                Object.getOwnPropertyNames(req.body).forEach(function(key, idx, array) {

                    if (!(key == "pageType" || key == "joinFrom" || key == "joinTo")) {
                        var tempCond = {};
                        tempCond[key] = req.body[key];
                        condition.$and.push(tempCond)
                    }
                });
                if (condition.$and.length == 0) {
                    delete condition.$and;
                }
                callback(null, condition)
            },
            function(condition, callback) {


                console.log("condition===>.." + JSON.stringify(condition))
                createNewPage.find(condition, function(err, result) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                        console.log("result;;;>" + result)
                        callback(null, result, condition)
                    }

                })
            }

        ], function(err, result, condition) {
            res.send({
                responseCode: 200,
                responseMessage: 'Filtered Users',
                data: result
            });
        })
    },

    "adAdminUserList": function(req, res) {
        User.find({}, 'firstName lastName email', function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 400, responseMessage: "No user found" }) } else { res.send({ result: result, responseCode: 200, responseMessage: 'List of all user' }); }
        })
    },

    "removeAds": function(req, res) { // pageId in request
        createNewAds.findByIdAndUpdate({ _id: req.params.id }, { $set: { 'status': 'REMOVED' } }, { new: true }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) return res.status(404).send({ responseMessage: "please enter correct adId" })
            else {
                var pageId = result.pageId;
                createNewPage.findOneAndUpdate({ _id: pageId }, { $inc: { adsCount: -1 } }, { new: true }).exec(function(err, resul1) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                        res.send({
                            //result: resul1,
                            responseCode: 200,
                            responseMessage: "Ad removed successfully."
                        });
                    }
                })
            }
        });
    },

    "editAdminProfile": function(req, res) {
        console.log("editAdminProfile-->>" + JSON.stringify(req.body))
        User.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: 'Please enter correct userId' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Profile update successfully."
                });
            }
        })
    },


    // var couponCode = result3.coupon[i].couponCode;
    //  var couponAdId = result3.coupon[i].adId;
    //  var expirationTime = result3.coupon[i].expirationTime;
    //  var pageId = result3.coupon[i].pageId;
    //  var type = "SEND BY FOLLOWER";



    "sendCouponTOUSers": function(req, res) {
        waterfall([
            function(callback) {
                if (req.body.Id.length == 0) { res.send({ responseCode: 404, responseMessage: 'please enter atleast one user.' }); } else {
                    var adId = req.body.couponId;
                    var userArray = req.body.Id;
                    console.log("lenght-->>>", userArray)
                    var arrayLenght = userArray.length;
                    console.log("userArray-->>>", arrayLenght)
                    createNewAds.findOneAndUpdate({ _id: adId }, { $inc: { sendCouponToUser: arrayLenght } }, { new: true }).exec(function(err, result) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: 'Please enter correct adId' }); } else {
                            var couponCode = result.couponCode;
                            var couponAdId = result._id;
                            var expirationTime = result.couponExpiryDate;
                            var pageId = result.pageId;
                            var type = "SENDBYADMIN";
                            callback(null, couponCode, couponAdId, expirationTime, pageId, type)
                        }
                    })
                }
            },
            function(couponCode, couponAdId, expirationTime, pageId, type, callback) {
                var adId = req.body.couponId;
                var userArray = req.body.Id;
                console.log("lenght-->>>", userArray)
                var arrayLenght = userArray.length;

                var startTime = new Date().toUTCString();
                var h = new Date(new Date(startTime).setHours(00)).toUTCString();
                var m = new Date(new Date(h).setMinutes(00)).toUTCString();
                var s = Date.now(m)
                var actualTime = parseInt(s) + parseInt(expirationTime);
                var data = {
                    couponCode: couponCode,
                    expirationTime: actualTime,
                    adId: couponAdId,
                    pageId: pageId,
                    type: type
                }
                console.log("data-->>", data)
                for (var i = 0; i < userArray.length; i++) {
                    User.update({ _id: userArray[i] }, { $push: { coupon: data }, $inc: { gifts: 1 } }, { multi: true }, function(err, result1) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 11' }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: "please enter correct userId" }) } else {
                            // callback(null)
                        }
                    })
                }
                callback(null)
            },
        ], function(err, result) {
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "Coupon send successfully."
            });
        })
    },

    "blockPage": function(req, res) {
        createNewPage.findByIdAndUpdate({ _id: req.params.id }, { $set: { status: 'BLOCK' } }, { new: true }, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "Please enter correct pageId" }) } else { res.send({ responseCode: 200, responseMessage: "Page Blocked successfully." }); }
        });
    },

    "unBlockPage": function(req, res) {
        createNewPage.findByIdAndUpdate({ _id: req.params.id }, { $set: { status: 'ACTIVE' } }, { new: true }, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "Please enter correct pageId" }) } else { res.send({ responseCode: 200, responseMessage: "Page unblocked successfully." }); }
        });
    },

    "sendLuckCardTOUsers": function(req, res) {
        waterfall([
                function(callback) {
                    if (req.body.Id.length == 0) { res.send({ responseCode: 404, responseMessage: 'please enter atleast one user.' }); } else {
                        var cardId = req.body.cardId;
                        var userArray = req.body.Id;
                        console.log("lenght-->>>", userArray)
                        var arrayLenght = userArray.length;
                        console.log("userArray-->>>", arrayLenght)
                        adminCards.findOneAndUpdate({ _id: cardId }, { $inc: { sendCardToUser: arrayLenght } }, { new: true }).exec(function(err, result) {
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: 'Please enter correct cardId' }); } else {
                                var brolix = result.brolix;
                                var chances = result.chances;
                                var type = "SENDBYADMIN";
                                callback(null, brolix, chances, type)
                            }
                        })
                    }
                },
                function(brolix, chances, type, callback) {
                    var cardId = req.body.cardId;
                    var userArray = req.body.Id;
                    var arrayLenght = userArray.length;

                    var data = {
                        brolix: brolix,
                        chances: chances,
                        type: type
                    }
                    console.log("data-->>", data)
                    for (var i = 0; i < userArray.length; i++) {
                        User.update({ _id: userArray[i] }, { $push: { luckCardObject: data } }, { multi: true }, function(err, result1) {
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 11' }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: "please enter correct userId" }) } else {
                                // callback(null)
                            }
                        })
                    }
                    callback(null)
                },
            ],
            function(err, result) {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Card send successfully."
                });
            })
    },

    "sendUpgradeCardTOUsers": function(req, res) {
        waterfall([
                function(callback) {
                    if (req.body.Id.length == 0) { res.send({ responseCode: 404, responseMessage: 'please enter atleast one user.' }); } else {
                        var cardId = req.body.cardId;
                        var userArray = req.body.Id;
                        console.log("lenght-->>>", userArray)
                        var arrayLenght = userArray.length;
                        console.log("userArray-->>>", arrayLenght)
                        adminCards.findOneAndUpdate({ _id: cardId }, { $inc: { sendCardToUser: arrayLenght } }, { new: true }).exec(function(err, result) {
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: 'Please enter correct cardId' }); } else {
                                var price = result.price;
                                var viewers = result.viewers;
                                var type = "SENDBYADMIN";
                                callback(null, price, viewers, type)
                            }
                        })
                    }
                },
                function(price, viewers, type, callback) {
                    var cardId = req.body.cardId;
                    var userArray = req.body.Id;
                    var arrayLenght = userArray.length;

                    var data = {
                        price: price,
                        viewers: viewers,
                        type: type
                    }
                    console.log("data-->>", data)
                    for (var i = 0; i < userArray.length; i++) {
                        User.update({ _id: userArray[i] }, { $push: { upgradeCardObject: data } }, { multi: true }, function(err, result1) {
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 11' }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: "please enter correct userId" }) } else {
                                // callback(null)
                            }
                        })
                    }
                    callback(null)
                },
            ],
            function(err, result) {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Card send successfully."
                });
            })
    },

    // "homePageAds": function(req, res){
    //      var obj = {
    //                     firstName: req.body.firstName,
    //                     lastName: req.body.lastName,
    //                     email: req.body.email,
    //                     password: req.body.password,
    //                     type: 'SYSTEMADMIN'
    //                 };

    // }

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
                        // cloudinary.image('ngdsjthoo4thilkrxpmw.png', { width: 100, height: 150, crop: "fill" },function(err, result){
                        //     console.log("image result==>>"+result)
                        // })
                    if (result.url) {
                        //    cloudinary.image(result.url, { width: 100, height: 150, crop: 'fill', 
                        // html_width: 50, html_height: 75 },function(ress){
                        //    console.log("DFdfdf"+ress)
                        // })                                                       
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
                    width: 600,
                    height: 600,
                    x: 100,
                    y: 100,
                    crop: "scale",
                    format: "png"
                });
            }
        })
    },


}
