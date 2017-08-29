var PageFollowers = require("./model/pageFollow");
var User = require("./model/user");
var createNewPage = require("./model/createNewPage");
var Views = require("./model/views");
var async = require('async');
var configs = {
    "lang": "ar",
    "langFile": "./../../translation/locale.json" //relative path to index.js file of i18n-nodejs module 
}
var i18n_module = require('i18n-nodejs');

var i18n = new i18n_module(configs.lang, configs.langFile);
console.log("===========================================", i18n.__('Welcome'));

module.exports = {

    // api for page follow and unfollow
    "pageFollowUnfollow": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        console.log("pageFollowUnfollow----->>>", req.body)
        if (req.body.follow == "follow") {
            console.log("8989898989---*****+++++++--///////////-->>>>>>>>>>>>>>>", JSON.stringify(req.body))
            PageFollowers.findOne({ userId: req.body.userId, pageId: req.body.pageId }).exec(function(err, result1) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                    if (!result1) {
                        var follow = new PageFollowers(req.body);
                        follow.save(function(err, result) {
                            User.findOneAndUpdate({ _id: req.body.userId }, { $push: { "pageFollowers": { pageId: req.body.pageId, pageName: req.body.pageName } } }, { new: true }).exec(function(err, results) {
                                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                                    createNewPage.findOneAndUpdate({ _id: req.body.pageId }, { $push: { "pageFollowersUser": { userId: req.body.userId } } }, { new: true }).exec(function(err, result1) {
                                        res.send({
                                            result: result,
                                            responseCode: 200,
                                            responseMessage: i18n.__("Followed")
                                        });
                                    })
                                }
                            })
                        })
                    } else {
                        console.log("in else")
                        var date = new Date();
                        if (result1.followStatus == "unfollow" || result1.followStatus == "unblock") {
                            PageFollowers.findOneAndUpdate({ _id: result1._id }, { $set: { followStatus: "follow", userId: req.body.userId, pageId: req.body.pageId, updatedAt: date } }, { new: true }).exec(function(err, result2) {
                                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                                    User.findOneAndUpdate({ _id: req.body.userId }, { $push: { "pageFollowers": { pageId: req.body.pageId, pageName: req.body.pageName } } }, { new: true }).exec(function(err, results) {
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
                        } else if (result1.followStatus == "block") {
                            res.send({
                                responseCode: 201,
                                responseMessage: i18n.__("You have already blocked this page")
                            });
                        } else {
                            res.send({
                                responseCode: 202,
                                responseMessage: i18n.__("You are already following this page")
                            });
                        }
                    }
                }
            })
        } else if (req.body.follow == "unfollow") { // { connections : { _id : connId } } 
            var date = new Date();
            console.log("saaa---*****+++++++---->>>>>>>>>>>>>>>", JSON.stringify(req.body))
            var query = { $and: [{ 'coupon.pageId': req.body.pageId, 'coupon.type': 'WINNER' }] };
            PageFollowers.update({ $and: [{ userId: req.body.userId }, { pageId: req.body.pageId }] }, { $set: { followStatus: req.body.follow, updatedAt: date } }, { new: true }).exec(function(err, result) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                    User.findOneAndUpdate({ _id: req.body.userId }, { $pull: { pageFollowers: { pageId: req.body.pageId } } }, { new: true }).exec(function(err, result1) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 11' }) } else if (!result1) { res.send({ responseCode: 404, responseMessage: "No user found" }); } else {
                            console.log("enter in view")
                            Views.findOneAndUpdate({ $and: [{ userId: req.body.userId }, { pageId: req.body.pageId }] }, { $set: { userId: '', followerNumber: 0 } }, { new: true }, function(err, ress) {
                                res.send({
                                    // result: result,
                                    responseCode: 200,
                                    responseMessage: i18n.__("Unfollowed")
                                });
                            })

                        }
                    })
                }
            })
        }
    },

    // show all send follow req on page
    "pageFollowRequestSend": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        PageFollowers.find({ userId: req.body.userId }).sort({ updatedAt: -1 }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                var arr = [];
                var status_obj = {};
                result.forEach(function(result) {
                    arr.unshift(result.pageId);
                    status_obj[result.pageId] = result.followStatus;
                    //arr.push(result.pageId)
                })
                createNewPage.find({ _id: { $in: arr } }).lean().exec(function(err, newResult) {
                    for (var i = 0; i < newResult.length; i++) {
                        var page_id = newResult[i]._id;
                        newResult[i].followStatus = status_obj[page_id];
                        // newResult[i].followStatus = result[i].followStatus;
                    }
                    res.send({
                        result: newResult,
                        responseCode: 200,
                        responseMessage: i18n.__("Shown list all followers")
                    });
                })
            }
        })
    },

    // show list of all followers
    "pageFollowerList": function(req, res) {
         console.log("pageFollowerList-->>", JSON.stringify(req.body))
        i18n = new i18n_module(req.body.lang, configs.langFile);
        PageFollowers.find({ pageId: req.body.pageId }).sort({ updatedAt: -1 }).exec(function(err, result) {
            console.log("pageFollowerList-->>", JSON.stringify(result))
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 400, responseMessage: i18n.__('No follower found') }); } else {
                var arr = [];
                var status_obj = {};
                
                     async.forEachOfLimit(result,1, function(value, key, callback) {
                       //  console.log("value-->>", value)  
                                arr.push(value.userId);
                           console.log("value- arr->>", arr)
                           status_obj[value.userId] = value.followStatus;
                            console.log("value- status_obj->>", status_obj)
                                   callback();                     
                        },function (err) {                         
                         console.log("status_obj-->>", status_obj)  
                            console.log("arr-->>", arr)
                      });
//                
//                result.forEach(function(result) {
//                    arr.unshift(result.userId);
//                    status_obj[result.userId] = result.followStatus;
//                })
               
             
                
                User.find({ _id: { $in: arr } }).lean().exec(function(err, newResult) {
                    console.log("user result-->>", JSON.stringify(newResult))
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                        for (var i = 0; i < newResult.length; i++) {
                            var user_id = newResult[i]._id;
                            newResult[i].followStatus = status_obj[user_id];
                        }
                        newResult.sort((a, b) => arr.findIndex(id => a._id.equals(id)) - 
                        arr.findIndex(id => b._id.equals(id)));
                        //  console.log("newResult-->>", newResult)
                        res.send({
                            result: newResult,
                            responseCode: 200,
                            responseMessage: i18n.__("Shown list all followers request")
                        });
                    }
                })

            }
        })
    },

    // block page followers api
    "blockPageFollower": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        if (req.body.followStatus == "block") {
            var date = new Date();
            var blockUserId = req.body.userId;
            createNewPage.findOne({ _id: req.body.pageId }).exec(function(err, user) {
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }) } else if (!user) { res.send({ responseCode: 404, responseMessage: "Please enter correct pageId." }); } else if (Boolean(user.blockedUser.find(blockedUser => blockedUser == blockUserId))) { res.send({ responseCode: 400, responseMessage: i18n.__("You have already blocked this user") }); } else {
                    PageFollowers.findOneAndUpdate({ $and: [{ userId: req.body.userId }, { pageId: req.body.pageId }] }, { $set: { followStatus: req.body.followStatus, blockUserId: req.body.userId, updatedAt: date } }, { new: true }).exec(function(err, results) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }) } else {
                            //         console.log("followStatus--->>>", results)

                            createNewPage.findOne({ _id: req.body.pageId }).exec(function(err, result) {
                                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }) } else if (!result) { res.send({ responseCode: 404, responseMessage: "No user found" }); } else {
                                    var blockedUser = result.blockedUser;
                                    var mySet = new Set(blockedUser);
                                    var has = mySet.has(blockUserId)
                                    if (has) {
                                        console.log("<<in if-->>")
                                        res.send({
                                            result: results,
                                            responseCode: 200,
                                            responseMessage: i18n.__("You have already blocked this user")
                                        });
                                    } else {
                                        console.log("<<in elseif-->>")
                                        createNewPage.findOneAndUpdate({ _id: req.body.pageId }, { $push: { blockedUser: blockUserId } }, { new: true }, function(err, result1) {
                                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error.' }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: "No ad found." }); } else {
                                                User.findOneAndUpdate({ _id: req.body.userId }, { $pop: { "pageFollowers": { pageId: req.body.pageId } } }, { new: true }).exec(function(err, results) {
                                                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {

                                                        createNewPage.findOneAndUpdate({ _id: req.body.pageId }, { $pull: { pageFollowersUser: { userId: req.body.userId } } }, { new: true }).exec(function(err, result2) {
                                                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 11' }) } else if (!result2) { res.send({ responseCode: 404, responseMessage: "No page found" }); } else {
                                                                console.log("result- 111->>", result1)
                                                                res.send({
                                                                    result: results,
                                                                    responseCode: 200,
                                                                    responseMessage: i18n.__("Successfully blocked this user")
                                                                });
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
                    })
                }
            })
        } else if (req.body.followStatus == "unblock") {
            var date = new Date();
            PageFollowers.findOneAndUpdate({ $and: [{ userId: req.body.userId }, { pageId: req.body.pageId }] }, {
                $set: { followStatus: "follow", updatedAt: date }
            }, { new: true }).exec(function(err, results) {
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }) } else {

                    createNewPage.findOneAndUpdate({ _id: req.body.pageId }, { $pop: { blockedUser: blockUserId } }, { new: true }).exec(function(err, result) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }) } else if (!result) { res.send({ responseCode: 404, responseMessage: "No user found" }); } else {

                            User.findOneAndUpdate({ _id: req.body.userId }, { $push: { "pageFollowers": { pageId: req.body.pageId } } }, { new: true }).exec(function(err, results) {
                                //      console.log("pageFollowUnfollow 1---------0000000000---->>>", results)
                                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                                    createNewPage.findOneAndUpdate({ _id: req.body.pageId }, { $push: { "pageFollowersUser": { userId: req.body.userId } } }, { new: true }).exec(function(err, result1) {
                                        res.send({
                                            result: results,
                                            responseCode: 200,
                                            responseMessage: i18n.__("Successfully unblock this user")
                                        });
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    }




}