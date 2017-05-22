var PageFollowers = require("./model/pageFollow");
var User = require("./model/user");
var createNewPage = require("./model/createNewPage");

module.exports = {

    "pageFollowUnfollow": function(req, res) {
        if (req.body.follow == "follow") {
            PageFollowers.findOne({ userId: req.body.userId, pageId: req.body.pageId }).exec(function(err, result1) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                    if (!result1) {
                        var follow = new PageFollowers(req.body);
                        follow.save(function(err, result) {
                            User.findOneAndUpdate({ _id: req.body.userId }, { $push: { "pageFollowers": { pageId: req.body.pageId, pageName: req.body.pageName } } }, { new: true }).exec(function(err, results) {
                                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                                    res.send({
                                        result: result,
                                        responseCode: 200,
                                        responseMessage: "Followed."
                                    });
                                }
                            })
                        })
                    } else {
                        if (result1.followStatus == "unfollow" || result1.followStatus == "unblock") {
                            PageFollowers.findOneAndUpdate({ _id: result1._id }, { $set: { followStatus: "follow", userId: req.body.userId, pageId: req.body.pageId } }, { new: true }).exec(function(err, result2) {
                                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
                                res.send({
                                    result: result2,
                                    responseCode: 200,
                                    responseMessage: "Followed."
                                });
                            })
                        } else if (result1.followStatus == "block") {
                            res.send({
                                responseCode: 201,
                                responseMessage: "You have already block this page."
                            });
                        } else {
                            res.send({
                                responseCode: 202,
                                responseMessage: "You are already following this page."
                            });
                        }
                    }
                }
            })
        } else if (req.body.follow == "unfollow") {
            PageFollowers.findOneAndUpdate({ userId: req.body.userId, pageId: req.body.pageId }, { $set: { followStatus: "unfollow" } }, { new: true }).exec(function(err, result) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                    User.findOneAndUpdate({ _id: req.body.userId }, { $pop: { "pageFollowers": -req.body.pageId } }, { new: true }).exec(function(err, result) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }) } else if (!result) { res.send({ responseCode: 404, responseMessage: "No user found" }); } else {
                            res.send({
                                result: result,
                                responseCode: 200,
                                responseMessage: "Unfollowed."
                            });
                        }
                    })
                }
            })
        }
    },

    "pageFollowRequestSend": function(req, res) {
        PageFollowers.find({ userId: req.body.userId }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                var arr = [];
                result.forEach(function(result) {
                    arr.push(result.pageId)
                })
                createNewPage.find({ _id: { $in: arr } }).lean().exec(function(err, newResult) {
                    for (var i = 0; i < newResult.length; i++) {
                        newResult[i].followStatus = result[i].followStatus;
                    }
                    res.send({
                        result: newResult,
                        responseCode: 200,
                        responseMessage: "Show list all followers."
                    });
                })
            }
        })
    },

    "pageFollowerList": function(req, res) {
        PageFollowers.find({ pageId: req.body.pageId }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                var arr = [];
                result.forEach(function(result) {
                    arr.push(result.userId)
                })
                User.find({ _id: { $in: arr } }).lean().exec(function(err, newResult) {
                    for (var i = 0; i < newResult.length; i++) {
                        newResult[i].followStatus = result[i].followStatus;
                    }
                    res.send({
                        result: newResult,
                        responseCode: 200,
                        responseMessage: "Show list all followers request."
                    });
                })
            }
        })
    },

    "blockPageFollower": function(req, res) {
        if (req.body.followStatus == "block") {
            var blockUserId = req.body.userId;
            createNewPage.findOne({ _id: req.body.pageId }).exec(function(err, user) {
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }) } else if (!user) { res.send({ responseCode: 404, responseMessage: "Please enter correct pageId." }); } else if (Boolean(user.blockedUser.find(blockedUser => blockedUser == blockUserId))) { res.send({ responseCode: 400, responseMessage: "You have already block this user." }); } else {
                    PageFollowers.findOneAndUpdate({ $and: [{ userId: req.body.userId }, { pageId: req.body.pageId }] }, { $set: { followStatus: req.body.followStatus, blockUserId: req.body.userId } }, { new: true }).exec(function(err, results) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }) } else {

                            createNewPage.findOne({ _id: req.body.pageId }).exec(function(err, result) {
                                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }) } else if (!result) { res.send({ responseCode: 404, responseMessage: "No user found" }); } else {
                                    var blockedUser = result.blockedUser;
                                    var mySet = new Set(blockedUser);
                                    var has = mySet.has(blockUserId)
                                    if (has) {
                                        console.log("<<in if-->>")
                                        res.send({
                                            result: result,
                                            responseCode: 200,
                                            responseMessage: "You have already blocked this user."
                                        });
                                    } else {
                                        console.log("<<in elseif-->>")
                                        createNewPage.findOneAndUpdate({ _id: req.body.pageId }, { $push: { blockedUser: blockUserId } }, { new: true }, function(err, result1) {
                                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error.' }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: "No ad found." }); } else {
                                                res.send({
                                                    result: result1,
                                                    responseCode: 200,
                                                    responseMessage: "You have blocked this user."
                                                });
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
            PageFollowers.findOneAndUpdate({ $and: [{ userId: req.body.userId }, { pageId: req.body.pageId }] }, {
                $set: { followStatus: req.body.followStatus }
            }, { new: true }).exec(function(err, results) {
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }) } else {

                    createNewPage.findOneAndUpdate({ _id: req.body.pageId }, { $pop: { blockedUser: blockUserId } }, { new: true }).exec(function(err, result) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }) } else if (!result) { res.send({ responseCode: 404, responseMessage: "No user found" }); } else {
                            res.send({
                                result: results,
                                responseCode: 200,
                                responseMessage: "You have unblock this user."
                            });
                        }
                    })
                }
            })
        }
    }




}
