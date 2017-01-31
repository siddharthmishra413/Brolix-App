var validator = require('validator');
var User = require("./model/user");
var createNewAds = require("./model/createNewAds");
var createNewPage = require("./model/createNewPage");
var country = require('countryjs');

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

    "totalIncomeInBrolixFromUpgradeCard": function(req, res) {
         User.aggregate({ $unwind: "$upgradeCardObject" }).exec(function(err, result) {
             if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
             if (!result) { res.send({ result: result, responseCode: 403, responseMessage: "No matching result available." }); } else {
                 var arr = [];
                 var count = 0;
                 for (i = 0; i < result.length; i++) {
                     count++;
                     console.log("data--->>>>", result[i].upgradeCardObject.brolix, i);
                     arr.push(parseInt(result[i].upgradeCardObject.brolix));
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
 }


}
