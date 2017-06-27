var validator = require('validator');
var User = require("./model/user");
var createNewAds = require("./model/createNewAds");
var createNewPage = require("./model/createNewPage");
var createNewReport = require("./model/reportProblem");
var adminCards = require("./model/cardsAdmin");
var Payment = require("./model/payment");
var subCategory = require("./subcategory.json");
var jwt = require('jsonwebtoken');
var config = require('../config');

var countryList = require('countries-cities').getCountries(); // Returns an array of country names. 
var citiess = require('countries-cities').getCities("India"); // Returns an array of city names of the particualr country. 
var mongoose = require('mongoose');


var country = require('countryjs');
var countries = require('country-list')();
var allCountries = require('all-countries');
var country = require('countryjs');
//var functionHandler = require('./functionHandler.js')
var multiparty = require('multiparty');
var cloudinary = require('cloudinary');
var gps = require('gps2zip');
var _ = require('underscore-node');
var voucher_codes = require('voucher-code-generator');
var functions = require("./functionHandler");
var waterfall = require('async-waterfall');

const cities = require("cities-list");
//console.log(cities) // WARNING: this will print out the whole object 
console.log(cities["london"]) // 1 
console.log(cities["something else"]) // undefined 

cloudinary.config({
    cloud_name: 'dfrspfd4g',
    api_key: '399442144392731',
    api_secret: 'BkGm-usnHDPfrun2fEloBtVqBqU'
});


module.exports = {
    "login": function(req, res) {
        if (!validator.isEmail(req.body.email)) res.send({ responseCode: 403, responseMessage: 'Please enter the correct email id.' });
        else {
            User.findOne({ email: req.body.email, password: req.body.password, $or: [{ 'type': 'ADMIN' }, { 'type': 'SYSTEMADMIN' }], status: 'ACTIVE' }).exec(function(err, result) {
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "The email and password that you've entered doesn't match any account." }); } else if (result.password != req.body.password) { res.send({ responseCode: 404, responseMessage: "The password that you've entered is incorrect." }); } else if (result.email != req.body.email) {
                    res.send({ responseCode: 404, responseMessage: "The email address that you've entered doesn't match any account." });
                } else {
                    var token_data = {
                            _id: result._id,
                            status: result.status
                        }
                        // sets a cookie with the user's info
                    req.session.user = result;
                    var token = jwt.sign(token_data, config.secreteKey);
                    res.header({
                        "appToken": token
                    }).send({
                        result: result,
                        token: token,
                        responseCode: 200,
                        responseMessage: "Login successfully."
                    });

                    // res.send({
                    //     responseCode: 200,
                    //     responseMessage: "Login successfully."
                    // });
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
        if (!req.body.email) { res.send({ responseCode: 403, responseMessage: 'Email required' }); } else if (!req.body.dob) { res.send({ responseCode: 403, responseMessage: 'Dob required' }); } else if (!req.body.country) { res.send({ responseCode: 403, responseMessage: 'country required' }); } else if (!req.body.city) { res.send({ responseCode: 403, responseMessage: 'city required' }); } else if (!req.body.mobileNumber) { res.send({ responseCode: 403, responseMessage: 'MobileNumber required' }); } else if (!validator.isEmail(req.body.email)) { res.send({ responseCode: 403, responseMessage: 'Please enter the correct email id.' }); } else {
            User.findOne({ email: req.body.email }).exec(function(err, result) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result) { res.send({ responseCode: 401, responseMessage: "Email should be unique." }); } else {
                    User.findOne({ mobileNumber: req.body.mobileNumber, countryCode : req.body.countryCode }).exec(function(err, result1) {
                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result1) { res.send({ responseCode: 401, responseMessage: "MobileNumber should be unique." }); } else {
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
                }
            })
        }
    },

    "showAllUser": function(req, res) {
        User.find({
            $or: [{ type: "USER", status: 'ACTIVE' }, { type: "Advertiser", status: 'ACTIVE' }]
        }, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 400, responseMessage: 'No user found' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Users show successfully."
                });
            }
        })
    },

    "showAllPersonalUser": function(req, res) {
        User.find({ type: "USER", status: 'ACTIVE' }, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 400, responseMessage: 'No user found' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Users show successfully."
                });
            }
        })
    },


    "showAllBusinessUser": function(req, res) {
        User.find({ type: "Advertiser", status: 'ACTIVE' }, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 400, responseMessage: 'No user found' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Users show successfully."
                });
            }
        })
    },

    "winners": function(req, res) {
        waterfall([
            function(callback) { // User.aggregate({ $unwind: "$upgradeCardObject" }, { $match: updateData }).exec(function(err, result) {
                User.aggregate({ $unwind: "$coupon" }, { $match: { 'coupon.type': "WINNER", 'coupon.status': 'ACTIVE' } }).exec(function(err, result) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                        var count1 = 0;
                        for (i = 0; i < result.length; i++) {
                            count1++;
                        }
                        console.log("coupon count--->>", count1)
                        callback(null, count1)
                    }
                })
            },
            function(count1, callback) {
                var totalCount;
                User.aggregate({ $unwind: "$cashPrize" }).exec(function(err, result) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                        var count2 = 0;
                        for (i = 0; i < result.length; i++) {
                            count2++;
                        }
                        console.log("cash Prizecount--->>", count2)
                        totalCount = count1 + count2;

                        callback(null, totalCount)
                    }
                })
            },
        ], function(err, result) {
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "Winners details show successfully."
            })
        })
    },

    "sendBrolix": function(req, res) {
        User.findOne({
            _id: req.body.userId
        }, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                User.findOneAndUpdate({ _id: req.body.receiverId }, { $push: { "sendBrolixListObject": { senderId: req.body.userId, brolix: req.body.brolix } } }, { new: true }, function(err, results) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!results) res.send({ responseCode: 404, responseMessage: "Please enter correct userId" });
                    else {
                        results.brolix += req.body.brolix;
                        results.save();
                        res.send({ responseCode: 200, responseMessage: "Brolix Transferred.", result: results });
                    }
                });
            }
        });
    },

    "blockUser": function(req, res) {
        User.findByIdAndUpdate({ _id: req.params.userId }, { '$set': { 'status': 'BLOCK' } }, { new: true }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server errorwqwq' }); } else if (!result) return res.status(404).send({ responseMessage: "Please enter correct adId" })
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
        User.find({ status: "BLOCK" }, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) {
                res.send({ result: result, count: 0, responseCode: 404, responseMessage: "No blocked found." })
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
    /*-------------------------Manage Ads API------------------------*/

    "totalAds": function(req, res) { // all ads cash and coupon type
        createNewAds.find({ adsType: { $ne: "ADMINCOUPON" }}, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ count: 0, responseCode: 404, responseMessage: "No ad found." }) } else {
                var count = 0;
                for (var i = 0; i < result.length; i++) {
                    count++;
                }
                createNewAds.populate(result, {
                    path: 'userId',
                    model: 'brolixUser',
                    select: 'mobileNumber'
                }, function(err, result2) {
                    res.send({
                        result: result2,
                        count: count,
                        responseCode: 200,
                        responseMessage: "All ads shown successfully."
                    })
                })

            }
        })
    },

    "totalActiveAds": function(req, res) { // all ads cash and coupon type
        createNewAds.find({adsType: { $ne: "ADMINCOUPON" }, status: 'ACTIVE' }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ count: 0, responseCode: 404, responseMessage: "No ad found." }) } else {
                var count = 0;
                for (var i = 0; i < result.length; i++) {
                    count++;
                }
                createNewAds.populate(result, {
                    path: 'pageId',
                    model: 'createNewPage',
                    select: 'pageName'
                }, function(err, result1) {
                    createNewAds.populate(result1, {
                        path: 'userId',
                        model: 'brolixUser',
                        select: 'mobileNumber'
                    }, function(err, result2) {
                        res.send({
                            result: result,
                            count: count,
                            responseCode: 200,
                            responseMessage: "All ads shown successfully."
                        });
                    })
                })
            }
        })
    },

    "totalExpiredAds": function(req, res) { // all ads cash and coupon type
        createNewAds.find({adsType: { $ne: "ADMINCOUPON" }, status: 'EXPIRED' }, function(err, result) {
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
                createNewAds.populate(result, {
                    path: 'pageId',
                    model: 'createNewPage',
                    select: 'pageName'
                }, function(err, result1) {
                    createNewAds.populate(result1, {
                        path: 'userId',
                        model: 'brolixUser',
                        select: 'mobileNumber'
                    }, function(err, result2) {
                        res.send({
                            result: result,
                            count: count,
                            responseCode: 200,
                            responseMessage: "All ads shown successfully."
                        });
                    })
                })
            }
        })
    },

    "listOfAds": function(req, res) { // for a single user based on cash and coupon category
        createNewAds.find({}).exec(function(err, result) {
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

    // "totalSoldUpgradeCard": function(req, res, query) {
    //     console.log(query.length)
    //     console.log("query===>" + JSON.stringify(query))
    //     if (!(query.length == 1)) {
    //         console.log("query")
    //         var updateData = query;
    //     } else {
    //         console.log("rather than query")
    //         var updateData = { 'upgradeCardObject.type': 'PURCHASED' }
    //     }
    //     var pageNumber = Number(req.params.pageNumber)
    //     var limitData = pageNumber * 10;
    //     var skips = limitData - 10;
    //     var page = String(pageNumber);

    //     User.aggregate({ $unwind: "$upgradeCardObject" }, { $match: updateData }).exec(function(err, result) {
    //         if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 400, responseMessage: 'No card found' }); } else {
    //             var count = 0;
    //             for (i = 0; i < result.length; i++) {
    //                 count++;
    //             }
    //             var pages = Math.ceil(count / 10);
    //             User.aggregate({ $unwind: "$upgradeCardObject" }, { $match: updateData }, { $limit: limitData }, { $skip: skips }).exec(function(err, result1) {
    //                 if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result1.length == 0) { res.send({ responseCode: 400, responseMessage: 'No card found' }); } else {
    //                     var limit = 0;
    //                     for (i = 0; i < result1.length; i++) {
    //                         limit++;
    //                     }
    //                     res.send({
    //                         docs: result1,
    //                         total: count,
    //                         limit: limit,
    //                         page: page,
    //                         pages: pages,
    //                         responseCode: 200,
    //                         responseMessage: "Successfully shown list of upgrade card"
    //                     });
    //                 }
    //             })
    //         }
    //     })
    // },

    "totalSoldUpgradeCard": function(req, res, query) {
        console.log(query.length)
        if (!(query.length == 1)) {
            console.log("query")
            var updateData = query;
        } else {
            console.log("rather than query")
            var updateData = { 'upgradeCardObject.type': 'PURCHASED' }
        }
        User.aggregate({ $unwind: "$upgradeCardObject" }, { $match: updateData }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                var count = 0;
                for (i = 0; i < result.length; i++) {
                    count++;
                }
                res.send({
                    result: result,
                    count: count,
                    responseCode: 200,
                    responseMessage: "Successfully shown list of upgrade card"
                });
            }
        })
    },


    // "totalSoldLuckCard": function(req, res, query) {
    //     console.log(query.length)
    //     if (!(query.length == 1)) {
    //         console.log("query")
    //         var updateData = query;
    //     } else {
    //         console.log("rather than query")
    //         var updateData = {}
    //     }
    //     var pageNumber = Number(req.params.pageNumber)
    //     var limitData = pageNumber * 10;
    //     var skips = limitData - 10;
    //     var page = String(pageNumber);
    //     User.aggregate({ $unwind: "$luckCardObject" }, { $match: updateData }).exec(function(err, result) {
    //         if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
    //             var count = 0;
    //             for (i = 0; i < result.length; i++) {
    //                 count++;
    //             }
    //             var pages = Math.ceil(count / 10);
    //             User.aggregate({ $unwind: "$luckCardObject" }, { $match: updateData }).exec(function(err, result1) {
    //                 if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result1.length == 0) { res.send({ responseCode: 400, responseMessage: 'No card found' }); } else {
    //                     var limit = 0;
    //                     for (i = 0; i < result1.length; i++) {
    //                         limit++;
    //                     }
    //                     res.send({
    //                         docs: result1,
    //                         total: count,
    //                         limit: limit,
    //                         page: page,
    //                         pages: pages,
    //                         responseCode: 200,
    //                         responseMessage: "Successfully shown list of luck card"
    //                     });
    //                 }

    //             })
    //         }

    //     })
    // },

    "totalSoldLuckCard": function(req, res, query) {
        console.log(query.length)
        if (!(query.length == 1)) {
            console.log("query")
            var updateData = query;
        } else {
            console.log("rather than query")
            var updateData = { "luckCardObject.type": "PURCHASED" }
        }
        User.aggregate({ $unwind: "$luckCardObject" }, { $match: updateData }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                var count = 0;
                for (i = 0; i < result.length; i++) {
                    count++;
                }
//                 var sortArray = result1.sort(function(obj1, obj2) {
//                             return obj2.luckCardObject.createdAt - obj1.luckCardObject.createdAt
//                         })
                res.send({
                    result: result,
                    count: count,
                    responseCode: 200,
                    responseMessage: "successfully shown list of luck card"
                });
            }

        })
    },


    "totalIncomeInBrolixFromLuckCard": function(req, res) {
        // var pageNumber = Number(req.params.pageNumber)
        // var limitData = pageNumber * 10;
        // var skips = limitData - 10;
        // var page = String(pageNumber);

        User.aggregate({ $unwind: "$luckCardObject" }, { $match: { "luckCardObject.type": "PURCHASED" } }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ result: result, responseCode: 403, responseMessage: "No matching result available." }); } else {
                var arr = [];
                var count = 0;
                for (i = 0; i < result.length; i++) {
                    count++;
                    arr.push(parseInt(result[i].luckCardObject.brolix));
                }
                //   var pages = Math.ceil(count / 10);
                var sum = arr.reduce((a, b) => a + b, 0);
                User.aggregate({ $unwind: "$luckCardObject" }, { $match: { "luckCardObject.type": "PURCHASED" } }).exec(function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result1.length == 0) { res.send({ responseCode: 400, responseMessage: 'No card found' }); } else {
                        var limit = 0;
                        for (i = 0; i < result1.length; i++) {
                            limit++;
                        }
                        var sortArray = result1.sort(function(obj1, obj2) {
                             return obj2.luckCardObject.createdAt - obj1.luckCardObject.createdAt
                         })
                        res.send({
                            result: sortArray,
                            totalIncome: sum,
                            total: count,
                            responseCode: 200,
                            responseMessage: "Total income in brolix Shows successfully."
                        });
                    }
                });
            }
        });
    },

    "totalIncomeInCashFromUpgradeCard": function(req, res) {
        // var pageNumber = Number(req.params.pageNumber)
        // var limitData = pageNumber * 10;
        // var skips = limitData - 10;
        // var page = String(pageNumber);

        User.aggregate({ $unwind: "$upgradeCardObject" }, { $match: { 'upgradeCardObject.type': 'PURCHASED' } }).exec(function(err, results) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!results) { res.send({ results: results, responseCode: 403, responseMessage: "No matching result available." }); } else {
                var arr = [];
                var count = 0;
                for (i = 0; i < results.length; i++) {
                    count++;
                    arr.push(results[i].upgradeCardObject.cash);
                }
                // var pages = Math.ceil(count / 10);
                var sum = arr.reduce((a, b) => a + b, 0);
                User.aggregate({ $unwind: "$upgradeCardObject" }, { $match: { 'upgradeCardObject.type': 'PURCHASED' } }).exec(function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result1.length == 0) { res.send({ responseCode: 400, responseMessage: 'No card found' }); } else {
                        var limit = 0;
                        for (i = 0; i < result1.length; i++) {
                            limit++;
                        }
                         var sortArray = result1.sort(function(obj1, obj2) {
                             return obj2.upgradeCardObject.createdAt - obj1.upgradeCardObject.createdAt
                         })
                        res.send({
                            result: sortArray,
                            totalIncome: sum,
                            total: count,
                            responseCode: 200,
                            responseMessage: "Total cash shows successfully."
                        });
                    }
                });
            }
        });
    },

    "usedLuckCard": function(req, res) {
        // var pageNumber = Number(req.params.pageNumber)
        // var limitData = pageNumber * 10;
        // var skips = limitData - 10;
        // var page = String(pageNumber);

        User.aggregate({ $unwind: "$luckCardObject" }, { $match: { 'luckCardObject.status': "INACTIVE" } }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ results: results, responseCode: 403, responseMessage: "No matching result available." }); } else {
                var count = 0;
                for (i = 0; i < result.length; i++) {
                    count++;
                }
                //var pages = Math.ceil(count / 10);
                User.aggregate({ $unwind: "$luckCardObject" }, { $match: { 'luckCardObject.status': "INACTIVE" } }).exec(function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result1.length == 0) { res.send({ responseCode: 403, responseMessage: "No card found." }); } else {
                        var limit = 0;
                        for (i = 0; i < result1.length; i++) {
                            limit++;
                        }
                        res.send({
                            result: result1,
                            total: count,
                            // limit: limit,
                            // page: page,
                            // pages: pages,
                            responseCode: 200,
                            responseMessage: "Total Brolix Shows successfully."
                        });
                    }
                });
            }
        });
    },

    "usedUpgradeCard": function(req, res) {
        // var pageNumber = Number(req.params.pageNumber)
        // var limitData = pageNumber * 10;
        // var skips = limitData - 10;
        // var page = String(pageNumber);

        User.aggregate({ $unwind: "$upgradeCardObject" }, { $match: { 'upgradeCardObject.status': "INACTIVE" } }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 403, responseMessage: "No matching result available." }); } else {
                var count = 0;
                for (i = 0; i < result.length; i++) {
                    count++;
                }
                res.send({
                    result: result,
                    total: count,
                    responseCode: 200,
                    responseMessage: "Used upgrade card Shows successfully."
                });
                // var pages = Math.ceil(count / 10);
                // User.aggregate({ $unwind: "$upgradeCardObject" }, { $match: { 'upgradeCardObject.status': "INACTIVE" } }, { $limit: limitData }, { $skip: skips }).exec(function(err, result1) {
                //     if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result1.length == 0) { res.send({ responseCode: 403, responseMessage: "No card found." }); } else {
                //         var limit = 0;
                //         for (i = 0; i < result1.length; i++) {
                //             limit++;
                //         }
                //         res.send({
                //             docs: result1,
                //             total: count,
                //             limit: limit,
                //             page: page,
                //             pages: pages,
                //             responseCode: 200,
                //             responseMessage: "Used upgrade card Shows successfully."
                //         });
                //     }
                // });
            }
        });
    },

    "unUsedUpgradeCard": function(req, res) {
        var pageNumber = Number(req.params.pageNumber)
        var limitData = pageNumber * 10;
        var skips = limitData - 10;
        var page = String(pageNumber);

        User.aggregate({ $unwind: "$upgradeCardObject" }, { $match: { 'upgradeCardObject.status': "ACTIVE" } }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ results: results, responseCode: 403, responseMessage: "No matching result available." }); } else {
                var count = 0;
                for (i = 0; i < result.length; i++) {
                    count++;
                }
                res.send({
                    result: result,
                    total: count,
                    responseCode: 200,
                    responseMessage: "Un Used upgrade card Shows successfully."
                });
                // var pages = Math.ceil(count / 10);
                // User.aggregate({ $unwind: "$upgradeCardObject" }, { $match: { 'upgradeCardObject.status': "ACTIVE" } }, { $limit: limitData }, { $skip: skips }).exec(function(err, result1) {
                //     if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result1.length == 0) { res.send({ responseCode: 403, responseMessage: "No card found." }); } else {
                //         var limit = 0;
                //         for (i = 0; i < result1.length; i++) {
                //             limit++;
                //         }
                //         res.send({
                //             docs: result1,
                //             total: count,
                //             limit: limit,
                //             page: page,
                //             pages: pages,
                //             responseCode: 200,
                //             responseMessage: "Un Used upgrade card Shows successfully."
                //         });
                //     }
                // });
            }
        });
    },

    "unUsedLuckCard": function(req, res) {
        // var pageNumber = Number(req.params.pageNumber)
        // var limitData = pageNumber * 10;
        // var skips = limitData - 10;
        // var page = String(pageNumber);

        User.aggregate({ $unwind: "$luckCardObject" }, { $match: { 'luckCardObject.status': "ACTIVE" } }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 403, responseMessage: "No card found." }); } else {
                var count = 0;
                for (i = 0; i < result.length; i++) {
                    count++;
                }
                res.send({
                    result: result,
                    total: count,
                    // limit: limit,
                    // page: page,
                    // pages: pages,
                    responseCode: 200,
                    responseMessage: "Total Brolix Shows successfully."
                });
                // var pages = Math.ceil(count / 10);
                // User.aggregate({ $unwind: "$luckCardObject" }, { $match: { 'luckCardObject.status': "ACTIVE" } }).exec(function(err, result1) {
                //     if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result1.length == 0) { res.send({ responseCode: 403, responseMessage: "No card found." }); } else {
                //         var limit = 0;
                //         for (i = 0; i < result1.length; i++) {
                //             limit++;
                //         }
                //         res.send({
                //             docs: result1,
                //             total: count,
                //             // limit: limit,
                //             // page: page,
                //             // pages: pages,
                //             responseCode: 200,
                //             responseMessage: "Total Brolix Shows successfully."
                //         });
                //     }
                // });
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
            res.send({
                responseCode: 404,
                responseMessage: "States not found."
            });
            // responseHandler.apiResponder(req, res, 404, "States not found");
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
        waterfall([
            function(callback){
                 User.findOne({ _id: req.params.id }).exec(function(err, result) {
                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } 
                     else if (!result) { res.send({ responseCode: 404, responseMessage: 'Please enter correct userId' }); }
                     else { 
                            if (result.email == req.body.email && result.mobileNumber == req.body.mobileNumber && result.countryCode == req.body.countryCode) {
                                User.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec(function(err, result1) {
                                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                                        callback(null, result1)
                                    }
                                })
                            } else {
                                console.log("in else")
                                var email = req.body.email;
                                User.findOne({ email: req.body.email, _id: { $ne: req.params.id } }).exec(function(err, result2) {
                                    console.log("result2 ----->>")
                                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
                                    else if (result2) { res.send({ responseCode: 400, responseMessage: 'Email must be unique' }) }
                                    else {
                                        console.log("innner else")
                                     User.findOne({ mobileNumber:req.body.mobileNumber, countryCode:req.body.countryCode, _id: { $ne: req.params.id } }).exec(function(err, result3) {
                                         console.log("result3----++++++++++++-->>")
                                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result3) { res.send({ responseCode: 400, responseMessage: 'Mobile Number must be unique' }) } else {
                                        User.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec(function(err, result4) {
                                            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result4) { res.send({ responseCode: 404, responseMessage: 'Please enter correct userId' }); } else {
                                                callback(null, result4)
                                            }
                                        })
                                    }
                                })
                                    }
                                })
                            }
                        }
                    });
                
            },
        ],function(err, result){
            res.send({
                result:result,
                responseCode:200,
                responseMessage:'Profile update successfully'
            })
        })
               
//        User.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec(function(err, result) {
//            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 409, responseMessage: 'Please enter correct userId' }); } else {
//                res.send({
//                    result: result,
//                    responseCode: 200,
//                    responseMessage: "Profile update successfully."
//                });
//            }
//        })
    },

    "totalPages": function(req, res) {
        createNewPage.find({ status: "ACTIVE", adsCount: { $gt: 0 } }, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 400, responseMessage: 'No page found' }); } else {
                createNewPage.populate(result, {
                    path: 'userId',
                    model: 'brolixUser',
                    select: 'firstName lastName email mobileNumber'
                }, function(err, result1) {
                    res.send({
                        result: result,
                        responseCode: 200,
                        responseMessage: "Total Pages."
                    });
                })
            }
        })
    },

    //API for user Profile
    "viewPage": function(req, res) {
        createNewPage.findOne({ _id: req.params.id }).populate('userId', 'firstName lastName').populate('adAdmin.userId', 'firstName lastName').exec(function(err, result) {
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
                                        responseMessage: "Pages details updated successfully."
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
        User.aggregate({ $unwind: "$coupon" }, { $match: { 'coupon.type': "WINNER", 'coupon.status': 'ACTIVE' } }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: 'No coupon found' }); } else {
                var count = 0;
                for (i = 0; i < result.length; i++) {
                    count++;
                }
                var pages = Math.ceil(count / 10);
                User.populate(result, 'coupon.pageId', function(err, result2) {
                    User.populate(result2, {
                        path: 'coupon.pageId.userId',
                        model: 'brolixUser',
                        select: 'firstName lastName email'
                    }, function(err, result3) {
                        res.send({
                            result: result3,
                            total: count,
                            responseCode: 200,
                            responseMessage: "all coupon winner"
                        });
                    })
                })
            }
        })
    },

    "cashWinners": function(req, res) {
        User.aggregate({ $unwind: "$cashPrize" }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: 'No cash gift found' }); } else {
                var count = 0;
                for (i = 0; i < result.length; i++) {
                    count++;
                }
                User.populate(result, 'cashPrize.pageId', function(err, result2) {
                    User.populate(result2, {
                        path: 'cashPrize.pageId.userId',
                        model: 'brolixUser',
                        select: 'firstName lastName email'
                    }, function(err, result3) {
                        res.send({
                            result: result3,
                            total: count,
                            responseCode: 200,
                            responseMessage: "all cash winner."
                        });
                    })
                })
            }
        })
    },

    "videoAds": function(req, res) {
        createNewAds.find({ adContentType: "video",adsType: { $ne: "ADMINCOUPON" }, status: 'ACTIVE' }, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "no ad found" }); } else {
                var count = 0;
                for (var i = 0; i < result.length; i++) {
                    count++;
                }
                createNewAds.populate(result, {
                        path: 'pageId',
                        model: 'createNewPage',
                        select: 'pageName'
                    },
                    function(err, result1) {
                        createNewAds.populate(result1, {
                            path: 'userId',
                            model: 'brolixUser',
                            select: 'mobileNumber'
                        }, function(err, result2) {
                            res.send({
                                result: result,
                                count: count,
                                responseCode: 200,
                                responseMessage: "Video ads shows successfully."
                            });
                        })
                    })
            }
        })
    },

    "slideshowAds": function(req, res) {
        createNewAds.find({ adContentType: "slideshow",adsType: { $ne: "ADMINCOUPON" }, status:'ACTIVE' }, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "no ad found" }); } else {
                var count = 0;
                for (var i = 0; i < result.length; i++) {
                    count++;
                }
                createNewAds.populate(result, {
                    path: 'pageId',
                    model: 'createNewPage',
                    select: 'pageName'
                }, function(err, result1) {
                    createNewAds.populate(result1, {
                        path: 'userId',
                        model: 'brolixUser',
                        select: 'mobileNumber'
                    }, function(err, result1) {
                        res.send({
                            result: result,
                            count: count,
                            responseCode: 200,
                            responseMessage: "Slideshow ads shown successfully."
                        });
                    })
                })
            }
        })
    },

    "showAllBlockedPage": function(req, res) { // pageId in request
        createNewPage.find({ status: "BLOCK" }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result.length == 0) {
                res.send({ result: result, responseCode: 200, count: 0, responseMessage: "No blocked page found" })
            } else {
                var count = 0;
                for (var i = 0; i < result.length; i++) {
                    count++;
                }
                createNewAds.populate(result, {
                    path: 'userId',
                    model: 'brolixUser',
                    select: 'firstName lastName email mobileNumber'
                }, function(err, result1) {
                    res.send({
                        result: result,
                        count: count,
                        responseCode: 200,
                        responseMessage: "Blocked page shown successfully."
                    });
                })
            }
        });
    },

    "removePage": function(req, res) { // pageId in request
        waterfall([
        function(callback){  
                createNewPage.findByIdAndUpdate({ _id: req.params.id }, { $set: { 'status': 'REMOVED' } }).exec(function(err, result) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 400, responseMessage: 'Please enter correct pageId.' }); } else {
                        var userId = result.userId;
                        User.findByIdAndUpdate({ _id: userId }, { $inc: { pageCount: -1 } }, { new: true }).exec(function(err, result1) {
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {

                                callback(null, result)
                            }
                        })
                    }
                })
            },
            function(pageResult, callback) {
                createNewPage.findOne({ _id: req.params.id }, function(err, result3) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result3) { res.send({ responseCode: 400, responseMessage: 'Please enter correct pageId' }); } else {
                        console.log("result3.adAdmin.length --->>>**********",result3.adAdmin.length )
                        if (result3.adAdmin.length != 0) {
                            console.log("in if")
                            var pageArray1 = [];
                            var i;
                            for (i = 0; i < result3.adAdmin.length; i++) {
                                console.log("in for loop")
                                pageArray1.push(result3.adAdmin[i].userId)

                            }
                            console.log("admin array---->>",pageArray1)
                            User.update({ _id: { $in: pageArray1 } }, { $inc: { pageCount: -1 } }, { new: true }).exec(function(err, result2) {
                                console.log("user update--->>>>",result2)
                                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                                    console.log("done")
                                    callback(null, pageResult)
                                }
                            })
                        }

                    }
                })

            },
            function(pageresult2, callback) {
                createNewAds.find({ pageId: req.params.id, status: 'ACTIVE' }, function(err, adResult) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (adResult.length == 0) {
                        res.send({
                          //  result: finalResult,
                            responseCode: 200,
                            responseMessage: "Page removed successfully."
                        })
                    } else {
                        var pageArray = [];
                        for (var i = 0; i < adResult.length; i++) {
                            if (adResult[i].pageId == req.params.id) {
                                pageArray.push(adResult[i]._id)
                            }
                        }
                        for(var j=0; j<pageArray.length; j++){
                        createNewAds.update({ _id: pageArray[j] }, { $set: { status: "REMOVED" } }, { new: true }).exec(function(err, result2) {
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                              console.log("done")
                            }
                        })
                        } console.log("not done")
                          callback(null, pageresult2)
                    }
                })
            },
            
       
        ],function(err, finalResult1){
                            res.send({
                    //result: finalResult1,
                    responseCode: 200,
                    responseMessage: "Page removed successfully58567567 33."
                });
        })
        
    },

    "showAllRemovedPage": function(req, res) { // pageId in request
        createNewPage.find({ status: "REMOVED" }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ result: result, responseCode: 200, count: 0, responseMessage: "No removed page found" }) } else {
                var count = 0;
                for (var i = 0; i < result.length; i++) {
                    count++;
                }
                createNewAds.populate(result, {
                    path: 'userId',
                    model: 'brolixUser',
                    select: 'firstName lastName email mobileNumber'
                }, function(err, result1) {
                    res.send({
                        result: result,
                        count: count,
                        responseCode: 200,
                        responseMessage: "Removed pages shown successfully."
                    });
                })
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
            createNewPage.find({ _id: { $nin: allPageIds }, "status": "ACTIVE" }, function(err, result) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                    User.populate(result, {
                        path: 'userId',
                        model: 'brolixUser',
                        select: 'firstName lastName email mobileNumber'
                    }, function(err, result2) {
                        res.send({ result: result, responseCode: 200, responseMessage: 'Here all the Unpublished pages' })
                    })
                }


            })
        })
    },

    "createCards": function(req, res) {
        var saveCards = new adminCards(req.body);

        saveCards.save(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                res.send({ responseCode: 200, responseMessage: 'Save card successfully', data: result });
            }
        })
    },

    "viewCards": function(req, res) {
        var cardType = req.params.type;
        if (req.params.type == 'upgrade_card') {
            var data = 'viewers'
        } else {
            console.log("chances")
            var data = 'chances'
        }
        adminCards.find({ type: cardType, status: "ACTIVE" }).sort([
            [data, 'ascending']
        ]).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                res.send({ data: result, responseCode: 200, responseMessage: 'Card shown successfully' });
            }
        })
    },

    "showCardDetails": function(req, res) {
        var cardId = req.params.id;
        adminCards.findOne({ _id: cardId }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                res.send({ responseCode: 200, responseMessage: 'Card find successfully', data: result });
            }
        })
    },

    "editCards": function(req, res) {
        var cardId = req.body.cardId;
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
        // adminCards.findOne({
        //     _id: cardId,
        //     offer.offerTime: { $gte : req.body.offerTime }
        // }).
        adminCards.findByIdAndUpdate(cardId, { $push: { offer: req.body } }, { new: true }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                res.send({ responseCode: 200, responseMessage: 'Offer created on card successfully', data: result });
            }
        })
    },

    "showOfferOnCards": function(req, res) {
        var pageId = req.body.pageId;
        // var pageNumber = Number(req.params.pageNumber)
        // var limitData = pageNumber * 8;
        // var skips = limitData - 8;
        // var page = String(pageNumber);

        var cardType = req.body.cardType;
        if (req.body.offerType == 'discount') {
            var groupQuery = { "buyCard": '$offer.buyCard' }
            var fieldData = 'discount'
        } else {
            var groupQuery = { "buyCard": '$offer.buyCard', "freeCard": '$offer.freeCard' }
            var fieldData = 'buyGet'
        }
        adminCards.aggregate([
            { $unwind: '$offer' },
            { $match: { $and: [{ type: cardType, "offer.offerType": req.body.offerType }, { $or: [{ 'offer.status': 'ACTIVE' }, { 'offer.status': 'EXPIRED' }] }] } },
            //{ $match: { type: cardType , "offer.offerType" : req.body.offerType} },
            {
                $group: {
                    _id: groupQuery,
                    "count": { "$sum": 1 },
                    offerTime: { $max: "$offer.offerTime" },
                    createdAt: { $min: "$offer.createdAt" },
                    status: {
                        $sum: { $cond: [{ $eq: ["$offer.status", 'ACTIVE'] }, 1, 0] }
                    },
                    offerType: { "$sum": 0 }
                }
            }
        ]).exec(function(err, result1) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                var count = 0;
                for (i = 0; i < result1.length; i++) {
                    count++;
                }
                // var pages = Math.ceil(count / 8);
                adminCards.aggregate([
                    { $unwind: '$offer' },
                    { $match: { $and: [{ type: cardType, "offer.offerType": req.body.offerType }, { $or: [{ 'offer.status': 'ACTIVE' }, { 'offer.status': 'EXPIRED' }] }] } }, {
                        $group: {
                            _id: groupQuery,
                            "count": { "$sum": 1 },
                            offerTime: { $max: "$offer.offerTime" },
                            createdAt: { $min: "$offer.createdAt" },
                            status: {
                                $sum: { $cond: [{ $eq: ["$offer.status", 'ACTIVE'] }, 1, 0] }
                            },
                            offerType: { "$sum": 0 }
                        }
                    }
                ]).exec(function(err, result) {
                    var limit = 0;
                    for (var i = 0; i < result.length; i++) {
                        limit++;
                        result[i].offerType = fieldData;
                        if (result[i].status == 0) {
                            result[i].status = 'EXPIRED';
                        } else {
                            result[i].status = 'ACTIVE';

                        }
                    }
                    res.send({
                        result: result,
                        total: count,
                        responseCode: 200,
                        responseMessage: 'Find all offers on card successfully'
                    });
                })

            }
        })
    },

    "getOfferList": function(req, res) {
        var cardType = req.body.cardType;
        if (req.body.offerType == 'discount') {
            var typDate = { type: cardType, "offer.offerType": req.body.offerType, "offer.buyCard": req.body.buyCard, "offer.status": 'ACTIVE' }
        } else {

            var typDate = { type: cardType, "offer.offerType": req.body.offerType, "offer.buyCard": req.body.buyCard, "offer.freeCard": req.body.freeCard, "offer.status": 'ACTIVE' }
        }
        adminCards.aggregate([
            { $unwind: '$offer' },
            { $match: typDate }
        ]).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result.length == 0) {
                res.send({ responseCode: 404, responseMessage: 'Data not found.' });
            } else {
                res.send({ responseCode: 200, responseMessage: 'Card lists show successfully.', result: result });
            }
        })

    },

    "showOneOfferDetail": function(req, res) {
        var typDate = { _id: new mongoose.Types.ObjectId(req.body.cardId), 'offer._id': new mongoose.Types.ObjectId(req.body.offerId), "offer.status": 'ACTIVE' }
        adminCards.aggregate([
            { $unwind: '$offer' },
            { $match: typDate }
        ]).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result.length == 0) {
                res.send({ responseCode: 404, responseMessage: 'Data not found.' });
            } else {
                res.send({ responseCode: 200, responseMessage: 'Card details show successfully.', result: result });
            }
        })

    },


    "showOfferCountOnCards": function(req, res) {
        adminCards.aggregate([
            { $unwind: '$offer' },
            { $match: { type: req.body.cardType, "offer.status": 'ACTIVE' } }
        ]).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result.length == 0) {
                res.send({ responseCode: 404, responseMessage: 'Data not found.' });
            } else {
                var count = 0;
                for (i = 0; i < result.length; i++) {
                    count++;
                }
                res.send({ responseCode: 200, responseMessage: 'Card count show successfully.', result: count });
            }
        })
    },

    "editOfferonCards": function(req, res) {
        if (req.body.offerType == 'discount') {
            var query = { 'offer.$.buyCard': req.body.buyCard, "offer.$.offerTime": req.body.offerTime, "offer.$.createdAt": req.body.createdAt }
        } else {
            var query = { 'offer.$.buyCard': req.body.buyCard, 'offer.$.freeCard': req.body.freeCard, "offer.$.offerTime": req.body.offerTime, "offer.$.createdAt": req.body.createdAt }
        }
        adminCards.findOneAndUpdate({ _id: req.body.cardId, 'offer._id': req.body.offerId }, { $set: query }, {
            new: true
        }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "Successfully updated."
            });
        });



        // if (req.body.offerType == 'discount') {
        //     var matchquery ={type: req.body.type, 'offer.buyCard':req.body.buyCard }
        //     var query = { 'offer.$.buyCard': req.body.updatebuyCard, "offer.$.offerTime": req.body.offerTime }
        // } else {
        //     var matchquery ={type: req.body.type, 'offer.buyCard':req.body.buyCard, 'offer.freeCard':req.body.freeCard }
        //     var query = { 'offer.$.buyCard': req.body.updatebuyCard, 'offer.$.freeCard': req.body.updatefreeCard, "offer.$.offerTime": req.body.offerTime }
        // }
        // adminCards.update(matchquery, { $set: query }, {
        //     multi: true
        // }).exec(function(err, result) {
        //     if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
        //     res.send({
        //         result: result,
        //         responseCode: 200,
        //         responseMessage: "Successfully updated."
        //     });
        // });
    },

    "removeOfferonCards": function(req, res) {
        adminCards.findOneAndUpdate({ _id: req.body.cardId, 'offer._id': req.body.offerId }, { $set: { 'offer.$.status': 'REMOVED' } }, {
            new: true
        }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "Removed successfully."
            });
        });

        // if(req.body.offerType == 'discount'){
        //    var query ={type: req.body.type, 'offer.buyCard':req.body.buyCard }
        // }
        // else{
        //    var query ={type: req.body.type, 'offer.buyCard':req.body.buyCard, 'offer.freeCard':req.body.freeCard }
        // }
        // adminCards.update(query, { $set: { 'offer.$.status': 'REMOVED' } }, {multi: true}).exec(function(err, result) {
        //     if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
        //     res.send({
        //         result: result,
        //         responseCode: 200,
        //         responseMessage: "Removed successfully."
        //     });
        // });
    },

    "createPage": function(req, res) {
        console.log("request---->>>",req.body)
        createNewPage.findOne({ pageName: req.body.pageName, status:'ACTIVE', status:'BLOCK' }).exec(function(err, result2) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Something went worng' }); } else if (result2) {
                res.send({ responseCode: 401, responseMessage: "Page name should be unique." });
            } else {
                var page = new createNewPage(req.body);
                page.save(function(err, result) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                        User.findByIdAndUpdate({ _id: req.body.userId }, { $inc: { pageCount: 1 } }).exec(function(err, result1) {
                            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                                var adminlength = result.adAdmin.length;
                                var pageId = result._id;
                                createNewPage.findOneAndUpdate({ _id: pageId }, { $inc: { adAdminCount: adminlength } }).exec(function(err, result2) {
                                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                                        var adminArray = [];
                                        for(var i =0; i<result2.adAdmin.length; i++){
                                            adminArray.push(result2.adAdmin[i].userId)
                                        }
                                        console.log("admin Ayya---->>",adminArray)
                                        for(var j =0; j<adminArray.length; j++){
                                        User.update({ _id:adminArray[j]}, { $inc: { pageCount: 1 }, $set: { type: "Advertiser" } }).exec(function(err, result3) {
                                            console.log("result---->>>",result3)
                                             if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
                                            else{
                                                console.log("done")
                                            }
                                        })                                        
                                    }
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
                if (data == "showReportedAd" || data == "adsWithLinks" || data == "adUpgradedByDollor" || data == "adUpgradedByBrolix") {
                    createNewAds.find({}).exec(function(err, result) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                            var array = [];
                            if (data == "showReportedAd") {
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
                            if (data == 'adUpgradedByDollor') {
                                for (var i = 0; i < result.length; i++) {
                                    if (result[i].cash > 0) {
                                        array.push(result[i]._id)
                                    }
                                }
                            }
                            if (data == 'adUpgradedByBrolix') {
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
                    case 'totalActiveAds':
                        var updateData = { status: "ACTIVE" };
                        condition.$and.push(updateData)
                        break;

                    case 'totalExpiredAds':
                        var updateData = { status: "EXPIRED" };
                        condition.$and.push(updateData)
                        break;

                    case 'showReportedAd':
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

                    case 'adUpgradedByDollor':
                        var updateData = { _id: { $in: allAdsIds } };
                        condition.$and.push(updateData)
                        break;

                    case 'adUpgradedByBrolix':
                        var updateData = { _id: { $in: allAdsIds } };
                        condition.$and.push(updateData)
                        break;

                    case 'totalAds':
                        var updateData = { status: 'ACTIVE' };
                        condition.$and.push(updateData)
                        break;

                    case 'topFiftyAds':
                        var updateData = {};
                        condition.$and.push(updateData)
                        break;

                }
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
                //var query = tempCond;
                if (data == 'topFiftyAds') {
                    var query = condition
                    module.exports.topFiftyAds(req, res, query)
                } else {
                    createNewAds.find(condition, function(err, result) {
                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                            //  console.log("result;;;>"+result)
                            callback(null, result, condition)
                        }
                    })

                }
            }
        ], function(err, result, condition) {
            res.send({
                responseCode: 200,
                responseMessage: 'Filtered Ads.',
                result: result
            });
        })
    },

    "luckUpgradeCardfilter": function(req, res) {
        var data = req.body.cardType;

        waterfall([
            function(callback) {
                switch (data) {
                    case 'totalSoldCards':
                        var matchCondt = { $match: { 'upgradeCardObject.type': 'PURCHASED' } }
                        var updateData = { $unwind: "$upgradeCardObject" };
                        break;

                    case 'totalIncome$':
                        var matchCondt = { $match: { 'upgradeCardObject.type': 'PURCHASED' } }
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
                        var matchCondt = { $match: { "luckCardObject.type": "PURCHASED" } }
                        var updateData = { $unwind: "$luckCardObject" }
                        break;

                    case 'totalIncome$LuckCards':
                        var matchCondt = { $match: { "luckCardObject.type": "PURCHASED" } }
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
                callback(null, updateData, matchCondt)
            },
            function(updateData, matchCondt, callback) {
                if (req.body.joinTo && req.body.joinFrom) {
                    var dateMatch = { createdAt: { $gte: new Date(req.body.joinFrom), $lte: new Date(req.body.joinTo) } }
                } else {
                    var dateMatch = {}
                }
                var upgradeType = {}
                if (req.body.upgradeType) {
                    var number_upgradeType = Number(req.body.upgradeType)
                    var upgradeType = { 'upgradeCardObject.viewers': number_upgradeType }
                } else {
                    var upgradeType = {}
                }
                if (req.body.luckCardType) {
                    var number_luckCardType = Number(req.body.luckCardType)
                    var luckCardType = { 'luckCardObject.chances': number_luckCardType }
                } else {
                    var luckCardType = {}
                }

                var tempCond = {};
                Object.getOwnPropertyNames(req.body).forEach(function(key, idx, array) {
                    if (!(key == "cardType" || key == "joinFrom" || key == "joinTo" || key == "upgradeType" || key == "luckCardType" || req.body[key] == "")) {

                        var conditions = {}
                        tempCond[key] = req.body[key];
                    }
                });
                Object.assign(tempCond, upgradeType)
                Object.assign(tempCond, luckCardType)

                callback(null, updateData, tempCond, matchCondt, dateMatch, luckCardType, upgradeType)
            },
            function(updateData, tempCond, matchCondt, dateMatch, luckCardType, upgradeType, callback) {
                User.aggregate(updateData, { $match: tempCond }, matchCondt, { $match: dateMatch }).exec(function(err, userResults) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
                    if (!userResults) { res.send({ results: results, responseCode: 403, responseMessage: "No matching result available." }); } else {
                        var count = userResults.length;
                        callback(null, userResults, count)
                            // var pageNumber = Number(req.params.pageNumber)
                            // var limitData = pageNumber * 10;
                            // var skips = limitData - 10;
                            // var page = String(pageNumber);
                            // var pages = Math.ceil(count / 10);
                            // User.aggregate(updateData, { $match: tempCond }, matchCondt, { $match: dateMatch }).exec(function(err, results) {
                            //     if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
                            //     if (!results) { res.send({ results: results, responseCode: 403, responseMessage: "No matching result available." }); } else {
                            //         callback(null, results, count)
                            //     }
                            // })

                    }
                });
            }
        ], function(err, results, count) {
            res.send({
                responseCode: 200,
                responseMessage: 'Filtered cards.',
                result: results,
                total: count
            });
        })
    },

    "giftsFilter": function(req, res) {
        console.log("req.body", JSON.stringify(req.body))
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
                    if (!(key == "giftsType" || key == "joinFrom" || key == "joinTo" || key == 'couponStatus' || key == 'cashStatus' || req.body[key] == "")) {
                        tempCond[key] = req.body[key];
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
                            //   { 'coupon.type': "WINNER", 'coupon.status': 'ACTIVE' }
                        var matchData = { 'coupon.type': "WINNER", 'coupon.status': 'ACTIVE' }
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

                }
                Object.assign(tempCond, matchData)
                callback(null, tempCond)
            },
            function(tempCond, callback) {
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
                    if (!(key == "paymentCardType" || key == "joinFrom" || key == "joinTo" || key == 'cardType' || key == 'couponStatus' || req.body[key] == "")) {
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
                    if (!(key == "paymentCardType" || key == "joinFrom" || key == "joinTo" || key == 'cardType' || req.body[key] == "" || key == "cashStatus")) {
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
                    Object.assign(query, { 'upgradeCardObject.type': 'PURCHASED' });
                    module.exports.totalSoldUpgradeCard(req, res, query)
                } else if (data == 'cashGifts') {
                    console.log("cash gifts", JSON.stringify(query))
                    module.exports.cashGift(req, res, query)
                } else {
                    Object.assign(query, { 'upgradeCardObject.type': 'PURCHASED' });
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
            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "Please enter correct user id." }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "All pages show successfully."
                })
            }
        })
    },

    "showUserAllPages": function(req, res) {
           waterfall([
            function(callback) {
                var userId = req.params.id;
                createNewPage.find({ $or:[{status: "ACTIVE"},{status: "BLOCK"}] }).exec(function(err, result) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "Please enter correct userId" }); }
                    else if (result.length == 0) { res.send({ responseCode: 400, responseMessage: 'No page found' }); } else {
                        var pageArray = [];
                        for (var i = 0; i < result.length; i++) {
                            for (var j = 0; j < result[i].adAdmin.length; j++) {
                                if (result[i].adAdmin[j].userId == userId) {
                                    pageArray.push(result[i]._id)
                                }
                            }
                        }
                        callback(null, pageArray)
                    }
                })
            },
            function(pageArray, callback) {
                var userId = req.params.id;
                createNewPage.find({ userId: req.params.id, $or:[{status: "ACTIVE"},{status: "BLOCK"}]}, function(err, result1) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                        for (var k = 0; k < result1.length; k++) {
                            pageArray.push(result1[k]._id)
                        }
                        callback(null, pageArray)
                    }
                })
            },
            function(pageArray, callback) {
                createNewPage.find({ _id: { $in: pageArray } }).exec(function(err, result2) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
                    else if (result2.length == 0) { res.send({ responseCode: 404, responseMessage: "No page found" }); } else {
                        callback(null, result2)
                    }
                })
            },
        ], function(err, result2) {
            res.send({
                result: result2,
                responseCode: 200,
                responseMessage: "All pages show successfully."
            })
        })
        
    },

    "adsOnPage": function(req, res) {
        createNewAds.find({ pageId: req.params.id, adsType: { $ne: "ADMINCOUPON" } }, function(err, result) {
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
            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else {
                var array = [];
                for (var i = 0; i < result.length; i++) {
                    for (var j = 0; j < result[i].winners.length; j++) {
                        array.push(result[i].winners[j])
                    }
                }
                User.find({ _id: { $in: array } }, function(err, result1) {
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
                console.log("array", array)
                User.find({ _id: { $in: array } }, function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: err }); } else if (result1.length == 0) { res.send({ responseCode: 404, responseMessage: "No user found." }); } else {
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
        createNewPage.find({ status: 'ACTIVE' }, function(err, result) {
            var array = [];
            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No page found." }); } else {
                for (var i = 0; i < result.length; i++) {
                    if (result[i].adAdminCount > 0) {
                        array.push(result[i]._id)
                    }
                } //).populate('adAdmin.userId', 'firstName lastName').exec(
                createNewPage.find({ _id: { $in: array } }, function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (result1.length == 0) { res.send({ responseCode: 404, responseMessage: "No page found." }); } else {
                        var count = 0;
                        for (var i = 0; i < result1.length; i++) {
                            count++;
                        }
                        createNewAds.populate(result1, {
                            path: 'adAdmin.userId',
                            model: 'brolixUser',
                            select: 'firstName lastName'
                        }, function(err, result2) {
                            res.send({
                                result: result2,
                                count: count,
                                responseCode: 200,
                                responseMessage: "Page detail show successfully."
                            })
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
                createNewAds.find({ _id: { $in: array } }).sort({ 'createdAt': -1 }).exec(function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (result1.length == 0) { res.send({ count: 0, responseCode: 404, responseMessage: "No ad found." }); } else {
                        var count = 0;
                        for (var i = 0; i < result1.length; i++) {
                            count++;
                        }
                        createNewAds.populate(result1, {
                            path: 'pageId',
                            model: 'createNewPage',
                            select: 'pageName'
                        }, function(err, result2) {
                            createNewAds.populate(result2, {
                                path: 'userId',
                                model: 'brolixUser',
                                select: 'mobileNumber'
                            }, function(err, result3) {
                                res.send({
                                    result: result1,
                                    count: count,
                                    responseCode: 200,
                                    responseMessage: "All ads shown successfully."
                                });
                            })
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
                } // .populate('pageId', 'pageName').populate('userId', 'mobileNumber')
                console.log("array-->>" + array)
                createNewAds.find({ _id: { $in: array } }, function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (result1.length == 0) { res.send({ responseCode: 404, responseMessage: "No ad found." }); } else {
                        var count = 0;
                        for (var i = 0; i < result1.length; i++) {
                            count++;
                        }
                        createNewAds.populate(result1, {
                            path: 'pageId',
                            model: 'createNewPage',
                            select: 'pageName'
                        }, function(err, result2) {
                            createNewAds.populate(result2, {
                                path: 'userId',
                                model: 'brolixUser',
                                select: 'mobileNumber'
                            }, function(err, result3) {
                                res.send({
                                    result: result1,
                                    count: count,
                                    responseCode: 200,
                                    responseMessage: "All ads shown successfully."
                                });
                            })
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
                createNewAds.find({ _id: { $in: array } }, function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (result1.length == 0) { res.send({ responseCode: 404, responseMessage: "No ad found." }); } else {
                        var count = 0;
                        for (var i = 0; i < result1.length; i++) {
                            count++;
                        }
                        createNewAds.populate(result1, {
                            path: 'pageId',
                            model: 'createNewPage',
                            select: 'pageName'
                        }, function(err, result2) {
                            createNewAds.populate(result2, {
                                path: 'userId',
                                model: 'brolixUser',
                                select: 'mobileNumber'
                            }, function(err, result3) {
                                res.send({
                                    result: result1,
                                    count: count,
                                    responseCode: 200,
                                    responseMessage: "All ads shown successfully."
                                });
                            })
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
        console.log("totalBrolixGift")
        if (!(query.length == 1)) {
            console.log("query")
            var updateData = query;
        } else {
            console.log("rather than query")
            var updateData = {};
        }
        // console.log("pageNumber===>>>", req.params.pageNumber)
        // var pageNumber = Number(req.params.pageNumber)
        // var limitData = pageNumber * 10;
        // var skips = limitData - 10;
        // var page = String(pageNumber);
        User.aggregate({ $unwind: "$brolixAds" }, { $match: updateData }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ result: result, responseCode: 403, responseMessage: "No matching result available." }); } else {
                var arr = [];
                var count = 0;
                for (i = 0; i < result.length; i++) {
                    count++;
                    arr.push(parseInt(result[i].brolixAds));
                }
                var sum = arr.reduce((a, b) => a + b, 0);

                //var pages = Math.ceil(count / limitData);

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
            var updateData = { 'coupon.type': "WINNER", 'coupon.status': 'ACTIVE' };
        }
        console.log("up[date", updateData)
            //var pageNumber = Number(req.params.pageNumber)
            // var limitData = pageNumber * 10;
            // var skips = limitData - 10;
            // var page = String(pageNumber);
            // User.aggregate({ $unwind: "$coupon" }, { $match: updateData }).exec(function(err, result) {
            //     if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } 
            //     else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: 'No coupon found' }); } else {
            // var count = 0;
            // for (i = 0; i < result.length; i++) {
            //     count++;
            // }
            // var pages = Math.ceil(count / 10);
        User.aggregate({ $unwind: "$coupon" }, { $match: updateData }).exec(function(err, result1) {
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result1.length == 0) { res.send({ responseCode: 404, responseMessage: 'No coupon found' }); } else {
                    var limit = 0;
                    for (i = 0; i < result1.length; i++) {
                        limit++;
                    }
                    User.populate(result1, 'coupon.pageId', function(err, result2) {
                        User.populate(result2, {
                            path: 'coupon.pageId.userId',
                            model: 'brolixUser',
                            select: 'firstName lastName email'
                        }, function(err, result3) {
                            res.send({
                                result: result3,
                                responseCode: 200,
                                responseMessage: "Sold Coupon shows successfully."
                            });
                        })
                    })
                }
            })
            //     }
            // })
    },

    // "totalCouponGiftsFilter": function(req, res, query) {
    //     console.log(query.length)
    //     console.log("query===>" + JSON.stringify(query))
    //     if (!(query.length == 1)) {
    //         console.log("query")
    //         var updateData = query;
    //     } else {
    //         console.log("rather than query")
    //         var updateData = { 'coupon.type': "WINNER", 'coupon.status': 'ACTIVE' };
    //     }
    //     User.aggregate({ $unwind: "$coupon" }, { $match: updateData }).exec(function(err, result) {
    //         if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: 'No coupon found' }); } else {
    //             var count = 0;
    //             for (i = 0; i < result.length; i++) {
    //                 count++;
    //             }
    //             User.populate(result, 'coupon.pageId', function(err, result1) {
    //                 User.populate(result1, {
    //                     path: 'coupon.pageId.userId',
    //                     model: 'brolixUser',
    //                     select: 'firstName lastName email'
    //                 }, function(err, result2) {
    //                     res.send({
    //                         result: result1,
    //                         count: count,
    //                         responseCode: 200,
    //                         responseMessage: "Sold Coupon shows successfully."
    //                     });
    //                 })
    //             })
    //         }
    //     })
    // },

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
        // var pageNumber = Number(req.params.pageNumber)
        // var limitData = pageNumber * 10;
        // var skips = limitData - 10;
        // var page = String(pageNumber);

        // User.aggregate({ $unwind: "$cashPrize" }).exec(function(err, result) {
        //     if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: 'No cash gift found' }); } else {
        //         console.log(result)
        //         var count = 0;
        //         for (i = 0; i < result.length; i++) {
        //             count++;
        //         }
        //         var pages = Math.ceil(count / 10);
        User.aggregate({ $unwind: "$cashPrize" }, { $match: updateData }).exec(function(err, result1) {
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result1.length == 0) { res.send({ responseCode: 404, responseMessage: 'No cash gift found' }); } else {
                    // console.log(result)
                    var limit = 0;
                    for (i = 0; i < result1.length; i++) {
                        limit++;
                    }
                    User.populate(result1, 'cashPrize.pageId', function(err, result2) {
                        console.log(result2)
                        User.populate(result2, {
                            path: 'cashPrize.pageId.userId',
                            model: 'brolixUser',
                            select: 'firstName lastName email'
                        }, function(err, result3) {
                            res.send({
                                result: result3,
                                responseCode: 200,
                                responseMessage: "Cash gift shows successfully."
                            });
                        })
                    })
                }
            })
            //     }
            // })
    },

    // "totalCashGiftsFilter": function(req, res, query) {
    //     console.log(query.length)
    //     console.log("query===>" + JSON.stringify(query))
    //     if (!(query.length == 1)) {
    //         console.log("query")
    //         var updateData = query;
    //     } else {
    //         console.log("rather than query")
    //         var updateData = {};
    //     }
    //     User.aggregate({ $unwind: "$cashPrize" }).exec(function(err, result) {
    //         if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: 'No coupon found' }); } else {
    //             console.log(result)
    //             var count = 0;
    //             for (i = 0; i < result.length; i++) {
    //                 count++;
    //             }
    //             User.populate(result, 'cashPrize.pageId', function(err, result1) {
    //                 User.populate(result1, {
    //                     path: 'cashPrize.pageId.userId',
    //                     model: 'brolixUser',
    //                     select: 'firstName lastName email'
    //                 }, function(err, result2) {
    //                     res.send({
    //                         result: result1,
    //                         count: count,
    //                         responseCode: 200,
    //                         responseMessage: "Cash gift shows successfully."
    //                     });
    //                 })
    //             })
    //         }
    //     })
    // },


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
        // var pageNumber = Number(req.params.pageNumber)
        // var limitData = pageNumber * 10;
        // var skips = limitData - 10;
        // var page = String(pageNumber);
        // User.aggregate({ $unwind: "$hiddenGifts" }, { $match: updateData }).exec(function(err, result) {
        //     if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ count: 0, responseCode: 404, responseMessage: 'No coupon found' }); } else {
        //         var count = 0;
        //         for (i = 0; i < result.length; i++) {
        //             count++;
        //         }
        //    var pages = Math.ceil(count / 10);
        User.aggregate({ $unwind: "$hiddenGifts" }, { $match: updateData }).exec(function(err, result1) {
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result1.length == 0) { res.send({ count: 0, responseCode: 404, responseMessage: 'No coupon found' }); } else {
                    var limit = 0;
                    for (i = 0; i < result1.length; i++) {
                        limit++;
                    }
                    User.populate(result1, 'hiddenGifts.pageId', function(err, result2) {
                        User.populate(result2, {
                            path: 'hiddenGifts.pageId.userId',
                            model: 'brolixUser',
                            select: 'firstName lastName email'
                        }, function(err, result3) {
                            res.send({
                                result: result3,

                                responseCode: 200,
                                responseMessage: "Hidden gift shows successfully."
                            });
                        })
                    })
                }
            })
            //     }
            // })
    },

    // "totalHiddenGiftsFilter": function(req, res, query) {
    //     console.log(query.length)
    //     console.log("query===>" + JSON.stringify(query))
    //     if (!(query.length == 1)) {
    //         console.log("query")
    //         var updateData = query;
    //     } else {
    //         console.log("rather than query")
    //         var updateData = {};
    //     }
    //     User.aggregate({ $unwind: "$hiddenGifts" }, { $match: updateData }).exec(function(err, result) {
    //         if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ count: 0, responseCode: 404, responseMessage: 'No coupon found' }); } else {
    //             var count = 0;
    //             for (i = 0; i < result.length; i++) {
    //                 count++;
    //             }
    //             User.populate(result, 'hiddenGifts.pageId', function(err, result1) {
    //                 User.populate(result1, {
    //                     path: 'hiddenGifts.pageId.userId',
    //                     model: 'brolixUser',
    //                     select: 'firstName lastName email'
    //                 }, function(err, result2) {
    //                     res.send({ result: result1, count: count, responseCode: 200, responseMessage: "Hidden gift shows successfully." });
    //                 })
    //             })
    //         }
    //     })
    // },

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
        // var pageNumber = Number(req.params.pageNumber)
        // var limitData = pageNumber * 10;
        // var skips = limitData - 10;
        // var page = String(pageNumber);
        // User.aggregate({ $unwind: "$coupon" }, { $match: updateData }).exec(function(err, result) {
        //     if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ count: 0, responseCode: 404, responseMessage: 'No coupon found' }); } else {
        //         var count = 0;
        //         for (i = 0; i < result.length; i++) {
        //             count++;
        //         }
        //        var pages = Math.ceil(count / 10);
        User.aggregate({ $unwind: "$coupon" }, { $match: updateData }).exec(function(err, result1) {
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result1.length == 0) { res.send({ count: 0, responseCode: 404, responseMessage: 'No coupon found' }); } else {
                    var limit = 0;
                    for (i = 0; i < result1.length; i++) {
                        limit++;
                    }
                    User.populate(result1, 'coupon.adId', function(err, result2) {
                        User.populate(result2, {
                            path: 'coupon.adId.couponExchangeReceived.receiverId',
                            model: 'brolixUser',
                            select: 'firstName lastName email'
                        }, function(err, result3) {
                            res.send({
                                result: result3,

                                responseCode: 200,
                                responseMessage: "Exchanged gift shown successfully."
                            });
                        })
                    })
                }
            })
            //     }
            // })
    },

    // "totalExchangedCouponFilter": function(req, res, query) {
    //     console.log(query.length)
    //     console.log("query===>" + JSON.stringify(query))
    //     if (!(query.length == 1)) {
    //         console.log("query")
    //         var updateData = query;
    //     } else {
    //         console.log("rather than query")
    //         var updateData = { 'coupon.status': "EXCHANGED" }
    //     }
    //     User.aggregate({ $unwind: "$coupon" }, { $match: updateData }).exec(function(err, result) {
    //         if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ count: 0, responseCode: 404, responseMessage: 'No coupon found' }); } else {
    //             var count = 0;
    //             for (i = 0; i < result.length; i++) {
    //                 count++;
    //             }
    //             User.populate(result, 'coupon.adId', function(err, result1) {
    //                 User.populate(result1, {
    //                     path: 'coupon.adId.couponExchangeReceived.receiverId',
    //                     model: 'brolixUser',
    //                     select: 'firstName lastName email'
    //                 }, function(err, result2) {
    //                     res.send({ result: result2, count: count, responseCode: 200, responseMessage: "Exchanged gift shown successfully." });
    //                 })
    //             })
    //         }
    //     })
    // },


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
        // var pageNumber = Number(req.params.pageNumber)
        // var limitData = pageNumber * 10;
        // var skips = limitData - 10;
        // var page = String(pageNumber);
        // User.aggregate({ $unwind: "$coupon" }, { $match: updateData }).exec(function(err, result) {
        //     if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ count: 0, responseCode: 404, responseMessage: 'No coupon found' }); } else {
        //         var count = 0;
        //         for (i = 0; i < result.length; i++) {
        //             count++;
        //         }
        //         var pages = Math.ceil(count / 10);
        User.aggregate({ $unwind: "$coupon" }, { $match: updateData }).exec(function(err, result1) {
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result1.length == 0) { res.send({ count: 0, responseCode: 404, responseMessage: 'No coupon found' }); } else {
                    var limit = 0;
                    for (i = 0; i < result1.length; i++) {
                        limit++;
                    }
                    User.populate(result1, 'coupon.pageId', function(err, result2) {
                        User.populate(result2, 'coupon.adId', function(err, result3) {
                            User.populate(result3, {
                                path: 'coupon.adId.couponSend.receiverId',
                                model: 'brolixUser',
                                select: 'firstName lastName email'
                            }, function(err, result4) {
                                res.send({
                                    result: result4,
                                    responseCode: 200,
                                    responseMessage: "Hidden gift shows successfully."
                                });
                            })
                        })
                    })
                }
            })
            //     }
            // })
    },

    // "totalSentCouponFilter": function(req, res, query) {
    //     console.log(query.length)
    //     console.log("query===>" + JSON.stringify(query))
    //     if (!(query.length == 1)) {
    //         console.log("query")
    //         var updateData = query;
    //     } else {
    //         console.log("rather than query")
    //         var updateData = { 'coupon.status': "SEND" }
    //     }
    //     User.aggregate({ $unwind: "$coupon" }, { $match: updateData }).exec(function(err, result) {
    //         if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ count: 0, responseCode: 404, responseMessage: 'No coupon found' }); } else {
    //             var count = 0;
    //             for (i = 0; i < result.length; i++) {
    //                 count++;
    //             }
    //             User.populate(result, 'coupon.pageId', function(err, result1) {
    //                 User.populate(result1, 'coupon.adId', function(err, result2) {
    //                     User.populate(result1, {
    //                         path: 'coupon.adId.couponSend.receiverId',
    //                         model: 'brolixUser',
    //                         select: 'firstName lastName email'
    //                     }, function(err, result2) {
    //                         res.send({ result: result2, count: count, responseCode: 200, responseMessage: "Hidden gift shows successfully." });
    //                     })
    //                 })
    //             })
    //         }
    //     })
    // },


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
        // var pageNumber = Number(req.params.pageNumber)
        // var limitData = pageNumber * 10;
        // var skips = limitData - 10;
        // var page = String(pageNumber);
        // User.aggregate({ $unwind: "$sendCashListObject" }, { $match: updateData }).exec(function(err, result) {
        //     if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ count: 0, responseCode: 404, responseMessage: 'No coupon found' }); } else {
        //         var arr = [];
        //         var count = 0;
        //         for (i = 0; i < result.length; i++) {
        //             arr.push(parseInt(result[i].sendCashListObject.cash));
        //             count++;
        //         }
        //         var sum = arr.reduce((a, b) => a + b, 0);
        //         var pages = Math.ceil(count / 10);
        //         console.log("arrrrr", sum);
        User.aggregate({ $unwind: "$sendCashListObject" }, { $match: updateData }).exec(function(err, result1) {
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result1.length == 0) { res.send({ count: 0, responseCode: 404, responseMessage: 'No coupon found' }); } else {
                    var limit = 0;
                    for (i = 0; i < result1.length; i++) {
                        limit++;
                    }

                    var arr = [];
                    var count = 0;
                    for (i = 0; i < result1.length; i++) {
                        arr.push(result1[i].sendCashListObject.cash);
                        count++;
                    }
                    var sum = arr.reduce((a, b) => a + b, 0);
                    //  var pages = Math.ceil(count / 10);
                    console.log("arrrrr", sum);
                    User.populate(result1, 'sendCashListObject.senderId', function(err, result2) {
                        res.send({
                            result: result2,
                            totalCash: sum,
                            responseCode: 200,
                            responseMessage: "Send Coupon shows successfully."
                        });
                    })
                }
            })
            //     }
            // })
    },

    // "totalSentCashFilter": function(req, res, query) {
    //     console.log(query.length)
    //     console.log("query===>" + JSON.stringify(query))
    //     if (!(query.length == 1)) {
    //         console.log("query")
    //         var updateData = query;
    //     } else {
    //         console.log("rather than query")
    //         var updateData = {}
    //     }
    //     User.aggregate({ $unwind: "$sendCashListObject" }, { $match: updateData }).exec(function(err, result) {
    //         if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ count: 0, responseCode: 404, responseMessage: 'No coupon found' }); } else {
    //             var arr = [];
    //             var count = 0;
    //             for (i = 0; i < result.length; i++) {
    //                 arr.push(parseInt(result[i].sendCashListObject.cash));
    //                 count++;
    //             }
    //             var sum = arr.reduce((a, b) => a + b, 0);
    //             console.log("arrrrr", sum);
    //             User.populate(result, 'sendCashListObject.senderId', function(err, result1) {
    //                 res.send({
    //                     result: result1,
    //                     totalCash: sum,
    //                     count: count,
    //                     responseCode: 200,
    //                     responseMessage: "Send Coupon shows successfully."
    //                 });
    //             })
    //         }
    //     })
    // },

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

    // "cashGift": function(req, res, query) {
    //     console.log(query.length)
    //     console.log("query===>" + JSON.stringify(query))
    //     if (!(query.length == 1)) {
    //         console.log("query")
    //         var updateData = query;
    //     } else {
    //         console.log("rather than query")
    //         var updateData = {}
    //     }
    //     var pageNumber = Number(req.params.pageNumber)
    //     var limitData = pageNumber * 10;
    //     var skips = limitData - 10;
    //     var page = String(pageNumber);
    //     User.aggregate({ $unwind: "$cashPrize" }, { $match: updateData }, function(err, results) {
    //         if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!results) { res.send({ responseCode: 404, responseMessage: "No result found." }); } else {
    //             var arr = [];
    //             var count = 0;
    //             for (i = 0; i < results.length; i++) {
    //                 count++;
    //                 arr.push(parseInt(results[i].cashPrize.cash));
    //             }
    //             var sum = arr.reduce((a, b) => a + b, 0);
    //             var pages = Math.ceil(count / 10);
    //             console.log("arrrrr", sum);
    //             User.aggregate({ $unwind: "$cashPrize" }, { $match: updateData }, { $limit: limitData }, { $skip: skips }, function(err, result1) {
    //                 if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result1.length == 0) { res.send({ responseCode: 404, responseMessage: "No cash gift found." }); } else {
    //                     var limit = 0;
    //                     for (i = 0; i < result1.length; i++) {
    //                         limit++;
    //                     }
    //                     var sum = arr.reduce((a, b) => a + b, 0);
    //                     console.log("arrrrr", sum);
    //                     User.populate(result1, 'cashPrize.pageId', function(err, result2) {
    //                         User.populate(result2, {
    //                             path: 'cashPrize.pageId.userId',
    //                             model: 'brolixUser',
    //                             select: 'firstName lastName email'
    //                         }, function(err, result3) {
    //                             res.send({
    //                                 docs: result3,
    //                                 totalIncome: sum,
    //                                 total: count,
    //                                 limit: limit,
    //                                 page: page,
    //                                 pages: pages,
    //                                 responseCode: 200,
    //                                 responseMessage: "Cash gift shows successfully."
    //                             });
    //                         })

    //                     })
    //                 }
    //             });
    //         }
    //     });
    // },

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

    // "soldCoupon": function(req, res, query) {
    //     console.log(query.length)
    //     console.log("query===>" + JSON.stringify(query))
    //     if (!(query.length == 1)) {
    //         console.log("query")
    //         var updateData = query;
    //     } else {
    //         console.log("rather than query")
    //         var updateData = { 'coupon.type': "PURCHASED" }
    //     }

    //     var pageNumber = Number(req.params.pageNumber)
    //     var limitData = pageNumber * 10;
    //     var skips = limitData - 10;
    //     var page = String(pageNumber);

    //     User.aggregate({ $unwind: "$coupon" }, { $match: updateData }, function(err, results) {
    //         if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!results) { res.send({ results: results, responseCode: 403, responseMessage: "No result found." }); } else {
    //             var count = 0;
    //             for (i = 0; i < results.length; i++) {
    //                 count++;
    //             }
    //             var pages = Math.ceil(count / 10);
    //             User.aggregate({ $unwind: "$coupon" }, { $match: updateData }, {
    //                 $limit: limitData
    //             }, { $skip: skips }, function(err, result1) {
    //                 if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result1.length == 0) { res.send({ results: results, responseCode: 403, responseMessage: "No coupon found." }); } else {
    //                     var limit = 0;
    //                     for (i = 0; i < result1.length; i++) {
    //                         limit++;
    //                     }
    //                     User.populate(result1, 'coupon.pageId', function(err, result2) {
    //                         User.populate(result2, 'coupon.adId', function(err, result3) {
    //                             User.populate(result3, {
    //                                 path: 'coupon.pageId.userId',
    //                                 model: 'brolixUser',
    //                                 select: 'firstName lastName email'
    //                             }, function(err, result4) {
    //                                 res.send({
    //                                     docs: result4,
    //                                     total: count,
    //                                     limit: limit,
    //                                     page: page,
    //                                     pages: pages,
    //                                     responseCode: 200,
    //                                     responseMessage: "Cash gift shows successfully."
    //                                 });
    //                             })
    //                         })
    //                     })
    //                 }
    //             })
    //         }
    //     })
    // },

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
    }, // 'upgradeCardObject.type':'PURCHASED'

    "topFiftyUpgradeCardBuyers": function(req, res) {
        User.aggregate({ $unwind: '$upgradeCardObject' }, { $match: { 'upgradeCardObject.type': 'PURCHASED' } }, {
            $group: { _id: '$_id', list: { $push: 'upgradeCardObject.PURCHASED' } }
        }, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: 'No user found' }); } else {
                var sortArray = result.sort(function(obj1, obj2) {
                    return obj2.list.length - obj1.list.length
                })
                console.log("sortArray---->>>", sortArray)
                var array = [];
                for (var i = 0; i < sortArray.length; i++) {
                    array.push(sortArray[i]._id)
                }
                console.log("array---->>>", array)
                User.find({ _id: { $in: array }, status: 'ACTIVE' }, function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result1.length == 0) { res.send({ responseCode: 404, responseMessage: 'No user found' }); } else {

                        res.send({ result: result1, responseCode: 200, responseMessage: "Data show successfully." });
                    }
                })
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
        User.aggregate({ $unwind: '$luckCardObject' }, { $match: { 'luckCardObject.type': 'PURCHASED' } }, {
            $group: { _id: '$_id', list: { $push: 'luckCardObject.PURCHASED' } }
        }, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: 'No user found' }); } else {
                var sortArray = result.sort(function(obj1, obj2) {
                    return obj2.list.length - obj1.list.length
                })
                console.log("sortArray---->>>", sortArray)
                var array = [];
                for (var i = 0; i < sortArray.length; i++) {
                    array.push(sortArray[i]._id)
                }
                console.log("array---->>>", array)
                User.find({ _id: { $in: array }, status: 'ACTIVE' }, function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result1.length == 0) { res.send({ responseCode: 404, responseMessage: 'No user found' }); } else {

                        res.send({ result: result1, responseCode: 200, responseMessage: "Data show successfully." });
                    }
                })
            }
        })
    },

    "topFiftyAds": function(req, res, query) { //sort({ viewerLenght: -1 }).limit(50).populate('pageId', 'pageName')
        if (!(query.length == 1)) {
            console.log("query")
            var updateData = query;
        } else {
            console.log("rather than query")
            var updateData = {};
        }
        createNewAds.find(updateData).sort({ viewerLenght: -1 }).limit(50).exec(function(err, result) {
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
        console.log("---addNewCoupon---",req.body)
        if (!req.body.pageName) { res.send({ responseCode: 403, responseMessage: 'Please enter pageName' }); } else if (!req.body.pageId) { res.send({ responseCode: 403, responseMessage: 'Please enter pageId' }); } else {
            var couponCode = voucher_codes.generate({ length: 6, count: 1, charset: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" });
            var obj = {
                pageId: req.body.pageId,
                pageName: req.body.pageName,
                coverImage: req.body.coverImage,
                giftDescription: req.body.giftDescription,
                couponExpiryDate: req.body.couponExpiryDate,
                uploadGiftImage: req.body.uploadGiftImage,
                adsType: "ADMINCOUPON",
                couponBuyersLength: 0,
                sellCoupon: false,
                couponSellPrice: 0,
                couponStatus: 'VALID',
                couponCode: couponCode,
                couponExpiryInString: req.body.couponExpiryInString

            };

            var coupon = createNewAds(obj)
            coupon.save(function(err, result) {
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                    createNewPage.findOneAndUpdate({ _id: req.body.pageId }, { $inc: { couponCreatedCount: 1 } }, { new: true }).exec(function(err, result1) {
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
        createNewAds.find({ adsType: 'ADMINCOUPON', status: 'ACTIVE' }, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ count: 0, responseCode: 500, responseMessage: 'No coupon found' }); } else {
                res.send({ result: result, responseCode: 200, responseMessage: "Coupon list successfully." })
            }
        })
    },

    "showListOFCouponWithoutPagination": function(req, res) {
        createNewAds.find({ adsType: 'ADMINCOUPON', status: 'ACTIVE' }, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ count: 0, responseCode: 500, responseMessage: 'No coupon found' }); } else {
                res.send({ result: result, responseCode: 200, responseMessage: "Coupon list successfully." })
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
        createNewPage.find({ status: 'ACTIVE' }, 'pageName category subCategory').exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: 'No page found' }); } else {
                result.sort(function(a, b) {
                    //compare two values
                    if (a.pageName.toLowerCase() < b.pageName.toLowerCase()) return -1;
                    if (a.pageName.toLowerCase() > b.pageName.toLowerCase()) return 1;
                    return 0;

                })
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
                    var objuser = new User(obj);
                    objuser.save(function(err, result) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 22' }); } else {
                            callback(null, result)
                        }
                    })
                }
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
        User.find({ type: 'SYSTEMADMIN', status: 'ACTIVE' }, function(err, result) {
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
        var message = req.body.Message;
        var IosDevice = [];
        var androidDevice = [];
        User.find({}, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) return res.status(404).send({ responseMessage: "Records not found" })
            else {
                // result[i].deviceType == 'Android' ? androidDevice.push(result[i].deviceToken) : IosDevice.push(result[i].deviceToken)
                for (var i = 0; i < result.length; i++) {
                    if (result[i].deviceToken && result[i].deviceType && result[i].notification_status && result[i].status) {
                        console.log("enter in if")
                        if (result[i].deviceType == 'Android' && result[i].notification_status == 'on' && result[i].status == 'ACTIVE') {
                            functions.android_notification(result[i].deviceToken, message);
                            console.log("Android notification send!!!!")
                        } else if (result[i].deviceType == 'iOS' && result[i].notification_status == 'on' && result[i].status == 'ACTIVE') {
                            functions.iOS_notification(result[i].deviceToken, message);
                        } else {
                            console.log("Something wrong!!!!")
                        }
                    }
                }
                //            functionHandler.android_notification(androidDevice, message);
                //            functionHandler.iOS_notification(IosDevice,message);
                res.send({ responseCode: 200, responseMessage: 'Message brodcast successfully' })
            }
        })
    },

    "uploadImage": function(req, res) {
        console.log(req.files)
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
            }, {
                resource_type: "auto",
                chunk_size: 6000000
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
        createNewAds.find({ promoteApp: true, status: "ACTIVE" }, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ count: 0, responseCode: 404, responseMessage: 'No ad found' }); } else {
                var count = 0;
                for (var i = 0; i < result.length; i++) {
                    count++;
                }
                createNewAds.populate(result, {
                    path: 'pageId',
                    model: 'createNewPage',
                    select: 'pageName'
                }, function(err, result1) {
                    createNewAds.populate(result1, {
                        path: 'userId',
                        model: 'brolixUser',
                        select: 'mobileNumber'
                    }, function(err, result2) {
                        res.send({
                            result: result,
                            count: count,
                            responseCode: 200,
                            responseMessage: "All ads shown successfully."
                        });
                    })
                })
            }
        })
    },

    "notificationToAdmin": function(req, res) {
        waterfall([
            function(callback) {
                User.find({}, 'firstName lastName email createdAt').sort({ 'createdAt': -1 }).limit(10).exec(function(err, user) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (user.length == 0) { res.send({ responseCode: 400, responseMessage: 'No user found' }); } else {
                        callback(null, user)
                    }
                })
            },
            function(user, callback) {
                createNewAds.find({}, 'pageName adsType createdAt').sort({ 'createdAt': -1 }).limit(10).exec(function(err, ads) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (ads.length == 0) { res.send({ responseCode: 400, responseMessage: 'No ad found' }); } else {
                        callback(null, user, ads)
                    }
                })
            },
            function(user, ads, callback) {
                createNewPage.find({}, ' pageName createdAt').sort({ 'createdAt': -1 }).limit(10).exec(function(err, page) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (page.length == 0) { res.send({ responseCode: 400, responseMessage: 'No ad found' }); } else {
                        var data = {
                            userResult: user,
                            adsResult: ads,
                            pageResult: page
                        }
                        callback(null, data)
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
                    console.log("ageFrom", req.body.ageFrom)
                    console.log("ageTo", req.body.ageTo)
                    var fromDate = todayDate.setFullYear(todayDate.getFullYear() - req.body.ageFrom)
                    var toDate = newTodayDate.setFullYear(newTodayDate.getFullYear() - req.body.ageTo)

                    var fromUtcDate = new Date(fromDate);
                    var toUtcDate = new Date(toDate);
                    console.log("fromUtcDate", fromUtcDate)
                    console.log("toUtcDate", toUtcDate)
                    condition.$and.push({
                        dob: { $gte: toUtcDate, $lte: fromUtcDate }
                    })
                }
                if (req.body.joinTo && req.body.joinTo) {
                    condition.$and.push({
                        createdAt: { $gte: new Date(req.body.joinFrom).toUTCString(), $lte: new Date(req.body.joinTo).toUTCString() }
                    })
                }

                Object.getOwnPropertyNames(req.body).forEach(function(key, idx, array) {

                    if (!(key == "userType" || key == "ageFrom" || key == "ageTo" || key == "joinFrom" || key == "joinTo" || req.body[key] == "")) {
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

                    case 'totalPages':
                        var updateData = { status: "ACTIVE", adsCount: { $gt: 0 } }
                        condition.$and.push(updateData)
                        break;

                    case 'removePagerequest':
                        var updateData = { 'adminRequest': 'REQUESTED' }
                        condition.$and.push(updateData)
                        break;
                }
                console.log("condition before callback==>>" + JSON.stringify(condition))
                console.log("updated data===>." + updateData)
                callback(null, updateData)
            },
            function(updateData, callback) {

                if (req.body.joinFrom && req.body.joinTo) {
                    condition.$and.push({
                        createdAt: { $gte: new Date(req.body.joinFrom).toUTCString(), $lte: new Date(req.body.joinTo).toUTCString() }
                    })
                }

                Object.getOwnPropertyNames(req.body).forEach(function(key, idx, array) {

                    if (!(key == "pageType" || key == "joinFrom" || key == "joinTo" || req.body[key] == "")) {
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
                    responseMessage: "Profile updated successfully."
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
                        adId: req.body.couponId,
                        pageId: pageId,
                        type: type
                    }
                    data1 = {
                        adId: req.body.couponId,
                        type: "I have sent you a coupon",
                        notificationType: 'couponReceivedFromAdmin'
                    }
                    console.log("data-->>", data)
                    console.log("data-->>", data1)
                        //   for (var i = 0; i < userArray.length; i++) {
                    User.update({ _id: { $in: userArray } }, { $push: { coupon: data, gifts: couponAdId }, "notification": data1 }, { multi: true },
                            function(err, result1) {
                                console.log("result1-->>", result1)
                                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 11', err }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: "please enter correct userId" }) } else {
                                    callback(null)
                                }
                                if (result1.deviceToken && result1.deviceType && result1.notification_status && result1.status) {
                                    var message = "Hello !! i have sent you a coupon";
                                    if (result1.deviceType == 'Android' && result1.notification_status == 'on' && result1.status == 'ACTIVE') {
                                        functions.android_notification(result1.deviceToken, message);
                                        console.log("Android notification send!!!!")
                                    } else if (result1.deviceType == 'iOS' && result1.notification_status == 'on' && result1.status == 'ACTIVE') {
                                        functions.iOS_notification(result1.deviceToken, message);
                                    } else {
                                        console.log("Something wrong!!!!")
                                    }
                                }
                            })
                        // }
                        // callback(null)
                },
            ],
            function(err, result) {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Coupon sent successfully."
                });
            })
    },

    "blockPage": function(req, res) {
        console.log("request--->>>",JSON.stringify(req.params.id))
        createNewPage.findByIdAndUpdate({ _id: req.params.id }, { $set: { status: 'BLOCK' } }, { new: true }, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "Please enter correct pageId" }) } else {
                createNewAds.find({pageId: req.params.id,status:'ACTIVE'},function(err, adResult){
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
                    else if(adResult.length==0){ res.send({ responseCode: 200, responseMessage: "Page Blocked successfully." });}
                    else{
                        var pageArray = [];
                        for(var i =0; i<adResult.length; i++){
                            if(adResult[i].pageId == req.params.id ){
                                pageArray.push(adResult[i]._id)
                            }
                        }
                        for(var j =0; j<pageArray.length; j++){
                            createNewAds.update({_id:pageArray[j]},{$set: { 'status': 'BLOCK'} },{multi:true},function(err, result2){
                              if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }else{
                                  console.log("done")
                              }  
                            })
                            
                        }
                        res.send({ responseCode: 200, responseMessage: "Page Blocked successfully." });
                    }
                    })                                  
                    
                }
                
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
                            if (result1.deviceToken && result1.deviceType && result1.notification_status && result1.status) {
                                var message = "Hello !! i have sent you a luck card";
                                if (result1.deviceType == 'Android' && result1.notification_status == 'on' && result1.status == 'ACTIVE') {
                                    functions.android_notification(result1.deviceToken, message);
                                    console.log("Android notification send!!!!")
                                } else if (result1.deviceType == 'iOS' && result1.notification_status == 'on' && result1.status == 'ACTIVE') {
                                    functions.iOS_notification(result1.deviceToken, message);
                                } else {
                                    console.log("Something wrong!!!!")
                                }
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
                    responseMessage: "Card sent successfully."
                });
            })
    },

    "sendUpgradeCardTOUsers": function(req, res) {
        console.log("sendUpgradeCardTOUsers--->>>",req.body)
        waterfall([
                function(callback) {
                    var id = req.body.Id;
                    if (id == 0) { res.send({ responseCode: 404, responseMessage: 'please enter atleast one user.' }); } else {
                        var cardId = req.body.cardId;
                        var userArray = req.body.Id;
                        console.log("lenght-->>>", userArray)
                        var arrayLenght = userArray.length;
                        console.log("userArray-->>>", arrayLenght)
                        adminCards.findOneAndUpdate({ _id: cardId }, { $inc: { sendCardToUser: arrayLenght } }, { new: true }).exec(function(err, result) {
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: 'Please enter correct cardId' }); } else {
                                var cash = result.price;
                                var viewers = result.viewers;
                                var type = "SENDBYADMIN";
                                callback(null, cash, viewers, type)
                            }
                        })
                    }
                },
                function(cash, viewers, type, callback) {
                    var cardId = req.body.cardId;
                    var userArray = req.body.Id;
                    var arrayLenght = userArray.length;

                    var data = {
                        cash: cash,
                        viewers: viewers,
                        type: type
                    }
                    console.log("data-->>", data)
                    for (var i = 0; i < userArray.length; i++) {
                        User.update({ _id: userArray[i] }, { $push: { upgradeCardObject: data } }, { multi: true }, function(err, result1) {
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 11' }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: "please enter correct userId" }) } else {
                                // callback(null)
                            }
                            if (result1.deviceToken && result1.deviceType && result1.notification_status && result1.status) {
                                var message = "Hello !! i have sent you an upgrade card";
                                if (result1.deviceType == 'Android' && result1.notification_status == 'on' && result1.status == 'ACTIVE') {
                                    functions.android_notification(result1.deviceToken, message);
                                    console.log("Android notification send!!!!")
                                } else if (result1.deviceType == 'iOS' && result1.notification_status == 'on' && result1.status == 'ACTIVE') {
                                    functions.iOS_notification(result1.deviceToken, message);
                                } else {
                                    console.log("Something wrong!!!!")
                                }
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
                    responseMessage: "Card sent successfully."
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
                });
            }
        })
    },


    "paymentHistory": function(req, res) {
        Payment.find({ Type: req.body.type }).populate('userId', 'email firstName lastName').populate('adId', 'userId pageName').exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "Data not found." }) } else {
                User.populate(result, {
                    path: 'adId.userId',
                    select: 'firstName lastName email'
                }, function(err, dbres) {
                    res.send({ responseCode: 200, responseMessage: "Payment details.", result: result });
                })
            }
        })
    },

    "liveUser": function(req, res) {
        User.find({ $or: [{ type: "USER", status: 'ACTIVE' }, { type: "Advertiser", status: 'ACTIVE' }] }, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 400, responseMessage: 'Internal server error' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Ad removed successfully."
                });
            }
        })
    },

    "listOfCategory": function(req, res) {
        var categoryList = ["Restaurant and Coffee Shop", "Fashion (Men-Women-Kids-Babies)", "Beauty & Health Care", "Fitness and Sports",
            "Traveling Agencies", "Cinemas", "Furniture", "Home", "Mobile and Computer Apps", "ToysforkidsandBabies", "Electronics and Technology",
            "Hotels and Apartments", "Medical", "Education", "Motors", "Hypermarkets", "Events", "Jewelry", "Arts and Design", "Pets", "Insurance",
            "Banks and Finance Companies", "Real Estate", "Books", "Business and Services", "Nightlife", "Construction", "Factories"
        ];
        res.send({
            result: categoryList,
            responseCode: 200,
            responseMessage: "List of all category shown successfully."
        })
    },

    "subCategoryData": function(req, res) {
        var matchData = req.body.subCat;
        res.send({
            responseCode: 200,
            responseMessage: "Subcategory lists.",
            result: subCategory[matchData]
        })
    },

    "adsDetail": function(req, res) {
        createNewAds.findOne({ _id: req.params.id, status: "ACTIVE" }, "coverImage", function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) {
                res.send({
                    responseCode: 404,
                    responseMessage: "Data not found."
                })
            } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Data Show successfully."
                })
            }
        })
    },

    "countryListData": function(req, res) {
        res.send({
            result: countryList,
            responseCode: 200,
            responseMessage: "All Country list."
        })
    },

    "cityListData": function(req, res) {

        var city = require('countries-cities').getCities(req.body.country);
        if (city == null || city.length == 0 || city == undefined || city == '') {
            res.send({
                responseCode: 404,
                responseMessage: "Data not found.."
            })
        } else {
            res.send({
                result: city,
                responseCode: 200,
                responseMessage: "Data Show successfully."
            })
        }
    },

    "showAllReports": function(req, res) {
        createNewReport.find({}).populate('userId', 'firstName lastName').exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 400, responseMessage: "No report found" }); } else {
                var AdsType = result.filter(result => result.type == "USER");
                var UserType = result.filter(result => result.type == "ADS");
                var sortArray1 = AdsType.sort(function(obj1, obj2) {
                    return obj2.createdAt - obj1.createdAt
                })
                var sortArray2 = UserType.sort(function(obj1, obj2) {
                    return obj2.createdAt - obj1.createdAt
                })
                res.send({
                    AdsType: sortArray1,
                    userType: sortArray2,
                    responseCode: 200,
                    responseMessage: "All report Shown successfully."
                })
            }
        })
    },

    "upgradeCardViewersList": function(req, res) { // "type": "luck_card",
        adminCards.find({ "type": "upgrade_card" }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 400, responseMessage: "No report found" }); } else {
                var viewersArray = [];
                for (var i = 0; i < result.length; i++) {
                    if (viewersArray.indexOf(result[i].viewers) == -1) {
                        viewersArray.push(result[i].viewers)
                    }
                }
                res.send({
                    result: viewersArray,
                    responseCode: 200,
                    responseMessage: "Result"
                })
            }
        })
    },


    "luckCardViewersList": function(req, res) {
        adminCards.find({ "type": "luck_card" }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 400, responseMessage: "No report found" }); } else {
                var chancesArray = [];
                for (var i = 0; i < result.length; i++) {
                    if (chancesArray.indexOf(result[i].chances) == -1) {
                        chancesArray.push(result[i].chances)
                    }
                }
                res.send({
                    result: chancesArray,
                    responseCode: 200,
                    responseMessage: "Result"
                })
            }
        })
    },

    "userCouponStatus": function(req, res) {
        User.find({}, 'coupon').exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ result: result, responseCode: 400, responseMessage: 'No coupon status found' }); } else {
                var statusArray = [];
                for (var i = 0; i < result.length; i++) {
                    for (var j = 0; j < result[i].coupon.length; j++) {
                        if (statusArray.indexOf(result[i].coupon[j].couponStatus) == -1) {
                            statusArray.push(result[i].coupon[j].couponStatus)
                        }
                    }
                }
                console.log("statusArray--->>>", statusArray)
                res.send({
                    result: statusArray,
                    responseCode: 200,
                    responseMessage: "Result"
                })
            }
        })
    },


    "userCashStatus": function(req, res) {
        User.find({}, 'cashPrize').exec(function(err, result) {
            console.log("result-->>", result)
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ result: result, responseCode: 400, responseMessage: 'No cash status found' }); } else {
                var statusArray = [];
                for (var i = 0; i < result.length; i++) {
                    console.log("result   --  i --->>>", result.length, i)
                    for (var j = 0; j < result[i].cashPrize.length; j++) {
                        console.log("result   --  j--->>>", result[i].cashPrize[j].length, j)
                        if (statusArray.indexOf(result[i].cashPrize[j].cashStatus) == -1) {
                            statusArray.push(result[i].cashPrize[j].cashStatus)
                        }
                    }
                }
                console.log("statusArray--->>>", statusArray)
                res.send({
                    result: statusArray,
                    responseCode: 200,
                    responseMessage: "Result"
                })
            }
        })
    },

    "removePageRequest": function(req, res) {
        createNewPage.find({ 'adminRequest': 'REQUESTED' }, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ result: result, responseCode: 400, responseMessage: 'Data not found.' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Remove pages request."
                })
            }
        })
    },

    "approvalStatus": function(req, res) {
    if (req.body.status == 'ACCEPTED') {
        //createNewPage.find({'adminRequest': 'REQUESTED'},function(err, result){
        waterfall([
            function(callback) {
                createNewPage.findByIdAndUpdate({ _id: req.body.pageId }, { $set: { adminRequest: 'REMOVED', 'status': 'REMOVED' } }).exec(function(err, result) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ result: result, responseCode: 400, responseMessage: 'Data not found.' }); } else {
                        var userId = result.userId;
                        User.findByIdAndUpdate({ _id: userId }, { $inc: { pageCount: -1 } }, { new: true }).exec(function(err, result1) {
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {

                                callback(null, result)
                            }
                        })
                    }
                })
            },
            function(pageResult, callback) {
                createNewPage.findOne({ _id: req.body.pageId }, function(err, result3) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result3) { res.send({ responseCode: 400, responseMessage: 'Please give page id' }); } else {
                        if (result3.adAdmin.length != 0) {
                            var pageArray1 = [];
                            for (var i = 0; i < result3.length; i++) {
                                pageArray1.push(result3.adAdmin[i].userId)

                            }
                            User.update({ _id: { $in: pageArray1 } }, { $inc: { pageCount: -1 } }, { new: true }).exec(function(err, result2) {
                                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                                    console.log("done")
                                    callback(null, pageResult)
                                }
                            })
                        }

                    }
                })

            },
            function(pageresult2, callback) {
                createNewAds.find({ pageId: req.body.pageId, status: 'ACTIVE' }, function(err, adResult) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (adResult.length == 0) {
                        res.send({
                            result: finalResult,
                            responseCode: 200,
                            responseMessage: "Page removed successfully."
                        })
                    } else {
                        var pageArray = [];
                        for (var i = 0; i < adResult.length; i++) {
                            if (adResult[i].pageId == req.body.pageId) {
                                pageArray.push(adResult[i]._id)
                            }
                        }
                        for(var j=0; j<pageArray.length; j++){
                        createNewAds.update({ _id: pageArray[j] }, { $set: { status: "REMOVED" } }, { new: true }).exec(function(err, result2) {
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                              console.log("done")
                            }
                        })
                        } console.log("not done")
                          callback(null, pageresult2)
                    }
                })
            },
        ], function(err, finalResult) {
            res.send({
                result: finalResult,
                responseCode: 200,
                responseMessage: "Page removed successfully."
            })

        })

    } else {
        console.log("else")
        createNewPage.findByIdAndUpdate({ _id: req.body.pageId }, { $set: { adminRequest: 'REMOVED', 'status': 'ACTIVE' } }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ result: result, responseCode: 400, responseMessage: 'Data not found.' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Page removed successfully."
                })
            }
        })
    }
},


    "upgradeCardPriceList": function(req, res) { // "type": "luck_card",
        adminCards.find({ "type": "upgrade_card" }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 400, responseMessage: "No report found" }); } else {
                var priceArray = [];
                for (var i = 0; i < result.length; i++) {
                    if (priceArray.indexOf(result[i].price) == -1) {
                        priceArray.push(result[i].price)
                    }
                }
                res.send({
                    result: priceArray,
                    responseCode: 200,
                    responseMessage: "Result"
                })
            }
        })
    },


}
