var validator = require('validator');
var User = require("./model/user");
var createNewAds = require("./model/createNewAds");

module.exports = {
    "login": function(req, res) {
        if (!validator.isEmail(req.body.email)) res.send({ responseCode: 403, responseMessage: 'Please enter the correct email id.' });
        User.findOne({ email: req.body.email, password: req.body.password, status: 'ACTIVE', type: "ADMIN" }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
            if (!result) {
                return res.send({
                    responseCode: 404,
                    responseMessage: "Sorry your id or password is incorrect."
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
            User.findOne({ email: req.session.user.email }).exec(function(err, result) {
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
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
        User.findOne({ email: req.body.pageName }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Something went worng' }); } else if (result) {
                res.send({ responseCode: 401, responseMessage: "Email should be unique." });
            } else {
                    var user = new User(req.body);
                    user.save(function(err, result) {
                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
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
        User.find({ $or: [{ type: "USER" }, { type: "Advertiser" }] }, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
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
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                var arr = [];
                for (var i = 0; i < result.length; i++) {
                    if (result[i].winners.length >= 1) {
                        for (var j = 0; j < result[i].winners.length; j++) {
                            arr.push(result[i].winners[j]);

                        }
                    }
                }
                User.find({ _id: { $in: arr } }).exec(function(err, newResult) {
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
        User.findOne({ _id: req.body.userId }, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                User.findOneAndUpdate({ _id: req.body.receiverId }, { $push: { "sendBrolixListObject": { senderId: req.body.userId, brolix: req.body.brolix } } }, { new: true }, function(err, results) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!results) res.send({ responseCode: 404, responseMessage: "please enter correct userId" });
                    else {
                        results.brolix += req.body.brolix;
                        results.save();
                        res.send({
                            responseCode: 200,
                            result: results,
                            responseMessage: "You have successfully transfer your brolix."
                        });
                    }
                });
            }
        });
    },

    "blockUser": function(req, res) {
        User.findByIdAndUpdate({ _id: req.body.userId }, { '$set': { 'status': 'BLOCK' } }, { new: true }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) return res.status(404).send({ responseMessage: "please enter correct adId" })
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
        User.find({ status: "BLOCK" }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
            if (result.length == 0) { res.send({ responseCode: 404, responseMessage: 'No blocked user found' }); } else {
                var count = 0;
                for(var i = 0; i<result.length;i++){
                    count++;
                }
                res.send({
                    result: result,
                    count:count,
                    responseCode: 200,
                    responseMessage: "All blocked user shows successfully."
                });
            }

        });
    },

    "totalAds": function(req, res) { // all ads cash and coupon type
        createNewAds.find({}).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
            else{
                var count = 0;
                for(var i =0; i<result.length;i++){
                    count++;
                }
            res.send({
                result: result,
                count:count,
                responseCode: 200,
                responseMessage: "All ads show successfully."
            })
           }
        })
    },

    "listOfAds": function(req, res) { // for a single user based on cash and coupon category
        createNewAds.find({ userId: req.body.userId }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
             else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: 'No ad found from this User' }); } else {
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
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
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

    "totalSoldUpgradeCard": function(req, res){
        Store.find({},'upgradeCardListObject').exec(function(err, result){
           if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
           else {
             var count = 0;
            for(i=0;i<result.length;i++)
            {
                for(j=0;j<result[i].upgradeCardListObject.length;j++)
                {
                  count++;
                }
            }
                 res.send({
                     result: result,
                     count:count,
                     responseCode: 200,
                     responseMessage: "Successfully show sold upgrade card."
                 });
             }
        })
    },

    "totalSoldLuckCard": function(req, res){
        Store.find({}, 'luckCardListObject').exec(function(err, result){
             if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
           else {
             var count = 0;
            for(i=0;i<result.length;i++)
            {
                for(j=0;j<result[i].luckCardListObject.length;j++)
                {
                  count++;
                }
            }
            console.log("count",count);
                 res.send({
                     result: result,
                     count:count,
                     responseCode: 200,
                     responseMessage: "Successfully show sold luck card."
                 });
             }

        })
    },

    "totalIncomeInBrolixFromLuckCard": function(req, res) {
     Store.aggregate({ $unwind: "$luckCardListObject" }).exec(function(err, results) {
         console.log("result------>>>" + JSON.stringify(results))
         if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
         if (!results) { res.send({ results: results, responseCode: 403, responseMessage: "User doesn't exist." }); } else {
             var arr = [];
             for (i = 0; i < results.length; i++) {
                 console.log("data--->>>>", results[i].luckCardListObject.brolix, i);
                 arr.push(parseInt(results[i].luckCardListObject.brolix));
             }
             var sum = arr.reduce((a, b) => a + b, 0);
             console.log("arrrrr", sum);
             res.send({
                 result: results,
                 responseCode: 200,
                 responseMessage: "Total brolix Shows successfully."
                 });
             }
         });
    },

    "totalIncomeInBrolixFromUpgradeCard": function(req, res) {
     Store.aggregate({ $unwind: "$upgradeCardListObject" }).exec(function(err, results) {
         console.log("result------>>>" + JSON.stringify(results))
         if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
         if (!results) { res.send({ results: results, responseCode: 403, responseMessage: "No matching result available." }); } else {
             var arr = [];
             for (i = 0; i < results.length; i++) {
                 console.log("data--->>>>", results[i].upgradeCardListObject.brolix, i);
                 arr.push(parseInt(results[i].upgradeCardListObject.brolix));
             }
             var sum = arr.reduce((a, b) => a + b, 0);
             console.log("arrrrr", sum);
             res.send({
                 result: results,
                 responseCode: 200,
                 responseMessage: "Total brolix Shows successfully."
                 });
             }
         });
    },


    "createSystemUser": function(req, res) {
        waterfall([
        function(callback) {
            var obj = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password
            };
            User.findOne({ email: req.body.email }, function(err, result) {
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
                // else if (result) res.status(401).send({msg:"Email id must be unique"});
                else {
                    var objuser = new User(obj);
                    objuser.save(function(err, result) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
                        //  else return res.status(200).send(result)
                        else {
                            callback(null, result)
                        }
                    })
                }
            })

        },
        function(result, callback) {
            console.log("result---->>>>" + JSON.stringify(result))
            User.findOneAndUpdate({ type: 'ADMIN' }, { $push: { permissions: result._id } }).exec(function(err, result1) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else { callback(null, result) }
            })
        },
        function(result, callback) {
            var i = 0;

            if (req.body.manageUser == true) {
                User.update({}, { $push: { permissions: result._id } }, { upsert: true }, { multi: true }).exec(function(err, result8) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else i++
                        //return res.status(200).send(result)
                })
            } else i++;
            if (req.body.managePages == true) {
                createNewPage.update({}, { $push: { permissions: result._id } }, { upsert: true }, { multi: true }).exec(function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else i++
                })
            } else i++;
            if (req.body.manageAds == true) {
                createNewAds.update({}, { $push: { permissions: result._id } }, { upsert: true }, { multi: true }).exec(function(err, result3) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else i++
                })

            } else i++;
            if (req.body.manageCards == true) {
                User.update({}, { $push: { permissions: result._id } }, { upsert: true }, { multi: true }).exec(function(err, result4) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else i++
                })
            } else i++;
            if (req.body.manageGifts == true) {
                User.update({}, { $push: { permissions: result._id } }, { upsert: true }, { multi: true }).exec(function(err, result5) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else i++
                })

            } else i++;
            if (req.body.managePayments == true) {
                User.update({}, { $push: { permissions: result._id } }, { upsert: true }, { multi: true }).exec(function(err, result6) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else i++
                })

            } else i++;
            if (req.body.adminTool == true) {
                User.update({}, { $push: { permissions: result._id } }, { upsert: true }, { multi: true }).exec(function(err, result7) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else i++
                })
            } else i++;

            if (i == 7) {
                callback(null, "success");
            }

        }
    ], function(err, result) {
        res.send({
            result: result,
            responseCode: 200,
            responseMessage: "System user successfully created"
        });
    })

}



}
