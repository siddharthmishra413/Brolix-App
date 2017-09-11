var createNewPage = require("./model/createNewPage");
var createNewAds = require("./model/createNewAds");
var createEvents = require("./model/createEvents");
var createNewReport = require("./model/reportProblem");
var addsComments = require("./model/addsComments");
//var notificationList = require("./model/notificationList");
var subCategory = require("./subcategory.json");
var Payment = require("./model/payment");
var Views = require("./model/views");
var User = require("./model/user");
var waterfall = require('async-waterfall');
var _ = require('underscore')
var adminCards = require("./model/cardsAdmin");
var functions = require("./functionHandler");
//<------------------------------------------------language conversn----------------------->
var configs = {
    "lang": "ar",
    "langFile": "./../../translation/locale.json" //relative path to index.js file of i18n-nodejs module 
}
var i18n_module = require('i18n-nodejs');

var i18n = new i18n_module(configs.lang, configs.langFile);
console.log("test===>" + new Date(1487589012837).getTimezoneOffset())
var mongoose = require('mongoose');
var moment = require('moment')

var paytabs = require('paytabs')
var NodeCache = require("node-cache");
var myCache = new NodeCache();

module.exports = {

    //API for create Page
    "createPage": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        createNewPage.findOne({ pageName: req.body.pageName, $or: [{ status: 'ACTIVE' }, { status: 'BLOCK' }] }).exec(function(err, result2) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result2) {
                res.send({ responseCode: 401, responseMessage: i18n.__("Page name should be unique") });
            } else {
                if (!req.body.category || !req.body.subCategory) {
                    res.send({ responseCode: 403, responseMessage: i18n.__('Category and Sub category required') });
                } else {
                    var page = new createNewPage(req.body);
                    page.save(function(err, result) {
                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                            User.findByIdAndUpdate({ _id: req.body.userId }, { $inc: { pageCount: 1 }, $set: { type: "Advertiser" } }).exec(function(err, result1) {
                                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                                    res.send({
                                        result: result,
                                        responseCode: 200,
                                        responseMessage: i18n.__("Page create successfully")
                                    });
                                }
                            })
                        }
                    })
                }
            }
        })
    },

    //API for Show All Pages
    "showAllPages": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        createNewPage.paginate({ status: "ACTIVE" }, { page: req.params.pageNumber, limit: 8 }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: i18n.__("All pages show successfully")
            })
        })
    },

    //API for Show All Pages
    "showAllOtherUserPages": function(req, res) {
        i18n = new i18n_module(req.params.lang, configs.langFile);
        waterfall([
            function(callback) {
                var userId = req.params.id;
                createNewPage.find({ "status": "ACTIVE" }).exec(function(err, pageResult) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                        var pageArray = [];
                        for (var i = 0; i < pageResult.length; i++) {
                            for (var j = 0; j < pageResult[i].blockedUser.length; j++) {
                                console.log("page rsult --->>>", pageResult[i].blockedUser[j].toString() == userId)
                                if (pageResult[i].blockedUser[j].toString() == userId) {
                                    pageArray.push(pageResult[i]._id)
                                } else {
                                    console.log("flag------->>>>")
                                }
                            }
                        }
                        console.log("pageArray------->>>>", pageArray)
                        callback(null, pageArray)
                    }
                })
            },
            function(pageArray, callback) {
                var userId = req.params.id;
                User.find({ $or: [{ 'type': 'USER' }, { 'type': 'Advertiser' }], status: 'ACTIVE', isVerified: "TRUE" }).lean().exec(function(err, userResult1) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                        var blockedArray = [];
                        for (var i = 0; i < userResult1.length; i++) {
                            for (var j = 0; j < userResult1[i].blockUser.length; j++) {
                                if (userResult1[i].blockUser[j].toString() == userId) {
                                    blockedArray.push(userResult1[i]._id)
                                } else {
                                    console.log("flag------->>>>")
                                }
                            }
                        }
                        callback(null, blockedArray, pageArray)
                        console.log("flag------->>>>", JSON.stringify(blockedArray))

                    }
                })
            },
            function(blockedArray, pageArray, callback) {
                User.findOne({ _id: req.params.id }).exec(function(err, result) {
                    callback(null, result, blockedArray, pageArray);
                })
            },
            function(result, blockedArray, pageArray, callback) {
                createNewPage.paginate({ userId: { $nin: blockedArray }, status: "ACTIVE" }, { page: req.params.pageNumber, limit: 8, sort: { createdAt: -1 } }, function(err, pageResult) {
                    if (err) { res.semd({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                        callback(null, result, pageResult);
                    }
                })
            },
            function(result, pageResult, callback) {
                var array = [];
                var data = [];
                console.log("result.pageFollowers.length--type->>", typeof(result.pageFollowers))
                console.log("result.pageFollowers.length--->>", result.pageFollowers.length)
                if (result.pageFollowers.length > 0 && result.pageFollowers.length != null) {
                    for (var i = 0; i < result.pageFollowers.length; i++) {
                        array.push(result.pageFollowers[i].pageId)
                    }
                    for (var j = 0; j < array.length; j++) {
                        for (k = 0; k < pageResult.docs.length; k++) {
                            if (pageResult.docs[k]._id == array[j]) {
                                pageResult.docs[k].pageFollowersStatus = true
                            }
                        }
                    }
                }
                //                var sortArray = pageResult.sort(function(obj1, obj2) {
                //                             return obj2.createdAt - obj1.createdAt
                //                         })
                res.send({
                    result: pageResult,
                    responseCode: 200,
                    responseMessage: i18n.__("All pages shown successfully")
                })
                callback(null, "done");
            },
            function(err, results) {

            }
        ])
    },

    //API for Show Page Details
    "showPageDetails": function(req, res) { // pageId, viewerId
        console.log("showPageDetails request---->>>", JSON.stringify(req.body))
        var date = new Date().toUTCString()
        createNewPage.findOne({ _id: req.body.pageId }).exec(function(err, pageResult) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!pageResult) { res.send({ responseCode: 404, responseMessage: "No page found" }); } else {
                var userId = pageResult.userId;
                console.log("userId-->>", userId)
                User.findOne({ _id: userId }).exec(function(err, userResult) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                        var flag = userResult.blockUser.indexOf(req.body.viewerId)
                        console.log("flage--->>>", flag)
                        if (flag != -1) { res.send({ responseCode: 401, responseMessage: i18n.__('You have been blocked by this page admin') }) } else {
                            i18n = new i18n_module(req.body.lang, configs.langFile);
                            createNewPage.findOne({ _id: req.body.pageId, status: "ACTIVE" }).populate({ path: 'pageFollowersUser.userId', select: ('firstName lastName image country state city') }).populate({ path: 'adAdmin.userId', select: ('firstName lastName image country state city') }).exec(function(err, result) {
                                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No page found" }); } else {
                                    createEvents.find({ pageId: req.body.pageId, status: "ACTIVE", createdAt: { $gte: date } }).exec(function(err, result1) {
                                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: "No event found" }); } else {
                                            //console.log("show age details--->>>",JSON.stringify(result))
                                            res.send({
                                                result: result,
                                                eventList: result1,
                                                responseCode: 200,
                                                responseMessage: i18n.__("Pages details shown successfully")
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

    },

    //API to show list of user's pages
    "myPages": function(req, res) {
        i18n = new i18n_module(req.params.lang, configs.langFile);
        waterfall([
            function(callback) {
                var userId = req.params.id;
                createNewPage.find({ pageType: 'Business', status: "ACTIVE" }).exec(function(err, result) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "Please enter correct userId" }); } else if (result.length == 0) { res.send({ responseCode: 400, responseMessage: 'No page found' }); } else {
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
                createNewPage.find({ userId: req.params.id, pageType: 'Business', status: "ACTIVE" }, function(err, result1) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                        for (var k = 0; k < result1.length; k++) {
                            pageArray.push(result1[k]._id)
                        }
                        callback(null, pageArray)
                    }
                })
            },
            function(pageArray, callback) {
                createNewPage.paginate({ _id: { $in: pageArray } }, { page: req.params.pageNumber, limit: 8, sort: { createdAt: -1 } }, function(err, result2) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result2.length == 0) { res.send({ responseCode: 404, responseMessage: "No page found" }); } else {
                        callback(null, result2)
                    }
                })
            },
        ], function(err, result2) {
            // console.log("myPages--->>>", result2)
            res.send({
                result: result2,
                responseCode: 200,
                responseMessage: i18n.__("Pages details shown successfully")
            })
        })
    },

    // search user's api pages
    "myPagesSearch": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        waterfall([
            function(callback) {
                var userId = req.params.id;
                createNewPage.find({ pageType: 'Business', status: "ACTIVE" }).exec(function(err, result) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "Please enter correct userId" }); } else if (result.length == 0) { res.send({ responseCode: 400, responseMessage: 'No page found' }); } else {
                        var pageArray1 = [];
                        for (var i = 0; i < result.length; i++) {
                            for (var j = 0; j < result[i].adAdmin.length; j++) {
                                if (result[i].adAdmin[j].userId == userId) {
                                    pageArray1.push(result[i]._id)
                                }
                            }
                        }
                        callback(null, pageArray1)
                    }
                })
            },

            function(pageArray1, callback) {
                var userId = req.params.id;
                createNewPage.find({ pageType: 'Business', status: "ACTIVE" }).exec(function(err, result) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "Please enter correct userId" }); } else if (result.length == 0) { res.send({ responseCode: 400, responseMessage: 'No page found' }); } else {
                        var pageArray = [];
                        for (var i = 0; i < result.length; i++) {
                            for (var j = 0; j < result[i].adAdmin.length; j++) {
                                if (result[i].adAdmin[j].userId == userId) {
                                    pageArray.push(result[i]._id)
                                }
                            }
                        }
                        callback(null, pageArray, pageArray1)
                    }
                })
            },
            function(pageArray, pageArray1, callback) {
                var userId = req.params.id;
                createNewPage.find({ userId: req.params.id, pageType: 'Business', status: "ACTIVE" }, function(err, result1) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                        for (var k = 0; k < result1.length; k++) {
                            pageArray.push(result1[k]._id)
                        }
                        callback(null, pageArray, pageArray1)
                    }
                })
            },
            function(pageArray, pageArray1, callback) {
                var re = new RegExp(req.body.search, 'i');
                createNewPage.paginate({ _id: { $nin: pageArray1 }, $and: [{ _id: { $in: pageArray } }, { 'pageName': { $regex: re } }] }, { pageNumber: req.params.pageNumber, limit: 8, sort: { createdAt: -1 } },
                    function(err, result1) {
                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result1.docs.length == 0) { res.send({ responseCode: 404, responseMessage: 'No result found' }); } else {
                            callback(null, result1)
                        }
                    })
            },
        ], function(err, result2) {
            console.log("myPages--->>>", result2)
            res.send({
                result: result2,
                responseCode: 200,
                responseMessage: i18n.__("Show pages successfully")
            })
        })
    },

    //API for Favourite Type
    "showPageFavouriteType": function(req, res) {
        i18n = new i18n_module(req.params.lang, configs.langFile);
        var userId = req.params.id;
        //           createNewPage.find({ pageType: 'Business', status: "ACTIVE" }).exec(function(err, result) {
        //                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "Please enter correct userId" }); } else if (result.length == 0) { res.send({ responseCode: 400, responseMessage: 'No page found' }); } else {
        //                        var pageArray = [];
        //                        for (var i = 0; i < result.length; i++) {
        //                            for (var j = 0; j < result[i].adAdmin.length; j++) {
        //                                if (result[i].adAdmin[j].userId == userId) {
        //                                    pageArray.push(result[i]._id)
        //                                }
        //                            }
        //                        }
        User.find({ $or: [{ 'type': 'USER' }, { 'type': 'Advertiser' }], status: 'ACTIVE', isVerified: "TRUE" }).lean().exec(function(err, userResult1) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                var blockedArray = [];
                for (var i = 0; i < userResult1.length; i++) {
                    for (var j = 0; j < userResult1[i].blockUser.length; j++) {
                        if (userResult1[i].blockUser[j].toString() == userId) {
                            blockedArray.push(userResult1[i]._id)
                        } else {
                            console.log("flag------->>>>")
                        }
                    }
                }
                console.log("blockedArray->>>", blockedArray)

                createNewPage.find({ userId: { $nin: blockedArray }, "status": "ACTIVE" }).exec(function(err, pageResult) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                        //  console.log("pageResult--->>>",JSON.stringify(pageResult));
                        var pageArray = [];
                        for (var i = 0; i < pageResult.length; i++) {
                            for (var j = 0; j < pageResult[i].blockedUser.length; j++) {
                                console.log("page rsult --->>>", pageResult[i].blockedUser[j].toString() == userId)
                                if (pageResult[i].blockedUser[j].toString() == userId) {
                                    pageArray.push(pageResult[i]._id)
                                } else {
                                    console.log("flag------->>>>")
                                }
                            }
                        }
                        console.log("pageArray------->>>>", pageArray)

                        console.log("flag------->>>>", JSON.stringify(blockedArray))
                        User.find({ _id: req.params.id }).exec(function(err, results) {
                            console.log("results--->>>", JSON.stringify(results))
                            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                                var arr = [];
                                results[0].pageFollowers.forEach(function(result) {
                                    arr.push(result.pageId)
                                })
                                var pageIdArray = arr.reverse();
                                //    console.log("showPageFavouriteType--arr-->>>", pageIdArray)
                                createNewPage.paginate({ _id: { $in: arr }, $and: [{ _id: { $nin: pageArray }, userId: { $nin: blockedArray } }] }, { page: req.params.pageNumber, limit: 8 }, function(err, newResult1) {
                                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (newResult1.length == 0) { res.send({ responseCode: 201, responseMessage: 'No page found' }) } else {
                                        console.log("newResult1--newResult1-->>>", newResult1)

                                        newResult1.docs.sort((a, b) => arr.findIndex(id => a._id.equals(id)) -
                                            arr.findIndex(id => b._id.equals(id)));

                                        //  console.log("showPageFavouriteType-result-->>>", JSON.stringify(newResult1))
                                        res.send({
                                            result: newResult1,
                                            responseCode: 200,
                                            responseMessage: i18n.__("List of all pages shown successfully")
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

    //API for Edit Page
    "editPage": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        createNewPage.findOne({ _id: req.params.id }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: i18n.__('Please enter correct pageId') }); } else {
                if (result.pageName == req.body.pageName) {
                    createNewPage.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec(function(err, result1) {
                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: 'Please enter correct pageId' }); } else {
                            res.send({
                                result: result1,
                                responseCode: 200,
                                responseMessage: i18n.__("Pages details updated successfully")
                            })
                        }
                    })
                } else {
                    var pageName = req.body.pageName;
                    createNewPage.findOne({ pageName: pageName, $or: [{ status: 'ACTIVE' }, { status: 'BLOCK' }], _id: { $ne: req.params.id } }).exec(function(err, result2) {
                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result2) { res.send({ responseCode: 500, responseMessage: 'Page name must be unique' }); } else {
                            createNewPage.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec(function(err, result3) {
                                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result3) { res.send({ responseCode: 404, responseMessage: 'Please enter correct pageId' }); } else {
                                    res.send({
                                        result: result3,
                                        responseCode: 200,
                                        responseMessage: i18n.__("Pages details updated successfully")
                                    })
                                }
                            })
                        }
                    })
                }
            }
        })
    },

    //API for Delete Page
    "deletePage": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        createNewPage.findOne({ _id: req.body.pageId }).exec(function(err, result) {
            if (err) throw err;
            else if (!result) {
                res.send({
                    responseCode: 302,
                    responseMessage: "Internal server error."
                });
            } else {
                createNewPage.findByIdAndUpdate(req.body.pageId, { $set: { status: 'DELETE' } }, { new: true }).exec(function(err, result) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                        var userId = result.userId;
                        User.findByIdAndUpdate({ _id: userId }, { $inc: { pageCount: -1 } }, { new: true }).exec(function(err, result1) {
                            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                                res.send({
                                    result: result,
                                    responseCode: 200,
                                    responseMessage: i18n.__("Pages delete successfully")
                                })
                            }
                        })
                    }
                })
            }
        })
    },

    //API for Follow and unfollow
    "pageFollowUnfollow": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        if (req.body.follow == "follow") {
            User.findOneAndUpdate({ _id: req.body.userId }, { $push: { "pageFollowers": { pageId: req.body.pageId, pageName: req.body.pageName } } }, { new: true }).exec(function(err, results) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
                createNewPage.findOneAndUpdate({ _id: req.body.pageId }, { $push: { "pageFollowersUser": { userId: req.body.userId } } }, { new: true }).exec(function(err, result1) {
                    res.send({
                        result: results,
                        responseCode: 200,
                        responseMessage: i18n.__("Followed")
                    });
                })
            })
        } else {
            User.findOneAndUpdate({ _id: req.body.userId }, { $pop: { "pageFollowers": { pageId: -req.body.pageId } } }, { new: true }).exec(function(err, results) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                    createNewPage.findOneAndUpdate({ _id: req.body.pageId }, { $pop: { "pageFollowersUser": { userId: req.body.userId } } }, { new: true }).exec(function(err, result1) {
                        res.send({
                            result: results,
                            responseCode: 200,
                            responseMessage: i18n.__("Followed")
                        });
                    })
                }
            })
        }
    },

    // api to search all pages list
    "allPagesSearch": function(req, res) {
        console.log("request-->>", req.body)
        i18n = new i18n_module(req.body.lang, configs.langFile);
        waterfall([
            function(callback) {
                var userId = req.params.id;
                User.find({ $or: [{ 'type': 'USER' }, { 'type': 'Advertiser' }], status: 'ACTIVE', isVerified: "TRUE" }).lean().exec(function(err, userResult1) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                        var blockedArray = [];
                        for (var i = 0; i < userResult1.length; i++) {
                            for (var j = 0; j < userResult1[i].blockUser.length; j++) {
                                if (userResult1[i].blockUser[j].toString() == userId) {
                                    blockedArray.push(userResult1[i]._id)
                                } else {
                                    console.log("flag------->>>>")
                                }
                            }
                        }
                        callback(null, blockedArray)
                        //  console.log("flag------->>>>", JSON.stringify(blockedArray))

                    }
                })
            },
            function(blockedArray, callback) {
                var userId = req.params.id;
                createNewPage.find({ "status": "ACTIVE" }).exec(function(err, pageResult) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                        console.log("pageResult--->>>", JSON.stringify(pageResult));
                        var pageArray = [];
                        for (var i = 0; i < pageResult.length; i++) {
                            for (var j = 0; j < pageResult[i].blockedUser.length; j++) {
                                if (pageResult[i].blockedUser[j].toString() == userId) {
                                    console.log("in if loop")
                                    pageArray.push(pageResult[i]._id)
                                    //    console.log("pageArray-----0000-->>>>",pageArray)
                                } else {
                                    console.log("flag------->>>>")
                                }
                            }
                        }
                        console.log("pageArray----22--->>>>", pageArray)
                        callback(null, blockedArray, pageArray)
                    }
                })
            },
            function(blockedArray, pageArray, callback) {
                User.findOne({ _id: req.params.id }).exec(function(err, result) {
                    // blockedArray.push(req.params.id);
                    callback(null, result, blockedArray, pageArray);
                })
            },
            function(result, blockedArray, pageArray, callback) {
                var re = new RegExp(req.body.search, 'i');
                createNewPage.paginate({ $and: [{ _id: { $nin: pageArray }, userId: { $nin: blockedArray } }], 'pageName': { $regex: re }, status: 'ACTIVE' }, { pageNumber: req.params.pageNumber, limit: 8 }, function(err, pageResult) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (pageResult.docs.length == 0) { res.send({ responseCode: 404, responseMessage: 'No page found' }); } else {
                        callback(null, result, pageResult);
                    }
                })
            },
            function(result, pageResult, callback) {
                var array = [];
                var data = [];
                if (result.pageFollowers.length != 0) {
                    for (var i = 0; i < result.pageFollowers.length; i++) {
                        array.push(result.pageFollowers[i].pageId)
                    }
                    console.log("ssssssssss", array);
                    for (var j = 0; j < array.length; j++) {
                        console.log("jjjjj", j);
                        for (k = 0; k < pageResult.docs.length; k++) {
                            console.log("kkkkkk", pageResult.docs[k]._id);
                            console.log("kkkkkk", pageResult.docs[k]._id == array[j]);
                            if (pageResult.docs[k]._id == array[j]) {
                                pageResult.docs[k].pageFollowersStatus = "true"
                            }
                        }
                    }

                }
                res.send({
                    result: pageResult,
                    responseCode: 200,
                    responseMessage: i18n.__("Show pages successfully")
                })
                callback(null, "done");
            },
            function(err, results) {

            }
        ])
    },

    // "allPagesSearch": function(req, res) {
    //     var re = new RegExp(req.body.search, 'i');
    //     createNewPage.paginate({ userId: { $ne: req.params.id }, 'pageName': { $regex: re }, status: 'ACTIVE' }, { pageNumber: req.params.pageNumber, limit: 8 }, function(err, result) {
    //         if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result.docs.length == 0) { res.send({ responseCode: 404, responseMessage: 'No page found' }); } else {
    //             res.send({
    //                 result: result,
    //                 responseCode: 200,
    //                 responseMessage: "Show pages successfully."
    //             });
    //         }
    //     })
    // },


    //API for Show Search
    "searchForPages": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        if (req.body.pageName) {
            var re = new RegExp("^" + req.body.pageName, "i");
            var page = { $regex: re, $options: "i" }
        } else {
            page = ""
        }
        var re2 = new RegExp(req.body.subCategory, 'i')
        var data = {
            'country': req.body.country,
            'state': req.body.state,
            'city': req.body.city,
            'pageName': page,
            'category': req.body.category,
            'subCategory': { $regex: re2 }
        }
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                if (data[key] == "" || data[key] == null || data[key] == undefined) {
                    delete data[key];
                }
            }
        }
        var userId = req.params.id;
        User.find({ $or: [{ 'type': 'USER' }, { 'type': 'Advertiser' }], status: 'ACTIVE', isVerified: "TRUE" }).lean().exec(function(err, userResult1) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                var blockedArray = [];
                for (var i = 0; i < userResult1.length; i++) {
                    for (var j = 0; j < userResult1[i].blockUser.length; j++) {
                        if (userResult1[i].blockUser[j].toString() == userId) {
                            blockedArray.push(userResult1[i]._id)
                        } else {
                            console.log("flag------->>>>")
                        }
                    }
                }

                createNewPage.paginate({ userId: { $nin: blockedArray }, $and: [data] }, { page: req.params.pageNumber, limit: 8 }, function(err, results) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                        User.findOne({ _id: req.params.id }).exec(function(err, userResult) {
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                                var array = [];
                                var data = [];
                                if (userResult.pageFollowers.length != 0) {
                                    for (var i = 0; i < userResult.pageFollowers.length; i++) {
                                        array.push(userResult.pageFollowers[i].pageId)
                                    }
                                    for (var j = 0; j < array.length; j++) {
                                        for (k = 0; k < results.docs.length; k++) {
                                            if (results.docs[k]._id == array[j]) {
                                                results.docs[k].pageFollowersStatus = true
                                            }
                                        }
                                    }
                                }
                                res.send({
                                    result: results,
                                    responseCode: 200,
                                    responseMessage: i18n.__("Result show successfully")
                                })

                            }
                        })

                        //                var array = [];
                        //                var data = [];
                        //                if (result.pageFollowers.length != 0) {
                        //                    for (var i = 0; i < result.pageFollowers.length; i++) {
                        //                        array.push(result.pageFollowers[i].pageId)
                        //                    }
                        //                    //  console.log("followed pages------->>>>>", array);
                        //                    for (var j = 0; j < array.length; j++) {
                        //                    //    console.log("jjjjj", j);
                        //                        for (k = 0; k < pageResult.docs.length; k++) {
                        //                     //       console.log("kkkkkk", pageResult.docs[k]._id, k);
                        //                            if (pageResult.docs[k]._id == array[j]) {
                        //                                pageResult.docs[k].pageFollowersStatus = true
                        //                            }
                        //                        }
                        //                    }
                        //                }
                    }
                })
            }
        })
    },

    // update rating on page
    "pageRating": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        var avrg = 0;
        createNewPage.findOne({ _id: req.body.pageId, totalRating: { $elemMatch: { userId: req.body.userId } } }).exec(function(err, result) {
            if (!result) {
                console.log("If");
                createNewPage.findOneAndUpdate({ _id: req.body.pageId }, { $push: { "totalRating": { userId: req.body.userId, rating: req.body.rating, date: req.body.date } } }, { new: true }).exec(function(err, results) {
                    for (var i = 0; i < results.totalRating.length; i++) {
                        avrg += results.totalRating[i].rating;
                    }
                    var averageRating = avrg / results.totalRating.length;
                    createNewPage.findOneAndUpdate({ _id: req.body.pageId }, { $set: { averageRating: averageRating } }, { new: true }).exec(function(err, results2) {
                        res.send({
                            result: results2,
                            responseCode: 200,
                            responseMessage: i18n.__("Result show successfully")
                        })
                    })
                })
            } else {
                console.log("else");
                createNewPage.findOneAndUpdate({ _id: req.body.pageId, 'totalRating.userId': req.body.userId }, { $set: { "totalRating.$.rating": req.body.rating, "totalRating.$.date": req.body.date } }, { new: true }).exec(function(err, results1) {
                    for (var i = 0; i < results1.totalRating.length; i++) {
                        avrg += results1.totalRating[i].rating;
                    }
                    var averageRating = avrg / results1.totalRating.length;
                    createNewPage.findOneAndUpdate({ _id: req.body.pageId }, { $set: { averageRating: averageRating } }, { new: true }).exec(function(err, results2) {
                        res.send({
                            result: results2,
                            responseCode: 200,
                            responseMessage: i18n.__("Result show successfully")
                        })
                    })
                })
            }
        })
    },

    // show all blocked page 
    "showBlockedPage": function(req, res) { // pageId in request
        createNewPage.paginate({ status: "BLOCK" }, { page: req.params.pageNumber, limit: 8, sort: { createdAt: -1 } }, function(err, result) {
            i18n = new i18n_module(req.params.lang, configs.langFile);
            if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else if (!result) return res.status(404).send({ responseMessage: "please enter correct pageId" })
            else if (result.docs.length == 0) { res.send({ responseCode: 404, responseMessage: i18n.__("No blocked page found") }) } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: i18n.__("Blocked page shown successfully")
                });
            }
        });
    },

    // api to remove page
    "removePage": function(req, res) { // pageId in request
        createNewPage.findByIdAndUpdate({ _id: req.body.pageId }, { $set: { 'adminRequest': 'REQUESTED' } }, { new: true }, function(err, result) {
            i18n = new i18n_module(req.body.lang, configs.langFile);
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) return res.status(404).send({ responseMessage: "please enter correct pageId" })
            else {
                res.send({
                    // result: result,
                    responseCode: 200,
                    responseMessage: i18n.__("Page remove request send successfully")
                });
            }
        });
    },

    // show list of all removed page
    "showAllRemovedPage": function(req, res) {
        createNewPage.paginate({ status: "REMOVED" }, { page: req.params.pageNumber, limit: 8 }, function(err, result) {
            i18n = new i18n_module(req.params.lang, configs.langFile);
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) return res.status(404).send({ responseMessage: "please enter correct pageId" })
            else if (result.docs.length == 0) { res.send({ responseCode: 404, responseMessage: "No removed page found" }) } else {
                var count = 0;
                for (var i = 0; i < result.docs.length; i++) {
                    count++;
                }
                res.send({
                    result: result,
                    count: count,
                    responseCode: 200,
                    responseMessage: i18n.__("Removed page shown successfully")
                });
            }
        });
    },

    // link social media on page api
    "linkSocialMedia": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        var userId = req.body.userId;
        var mediaType = req.body.mediaType;
        var link = req.body.link;
        createNewPage.findOneAndUpdate({ _id: req.body.pageId }, { $push: { "linkSocialListObject": { userId: req.body.userId, mediaType: req.body.mediaType, link: req.body.link } } }, { new: true }, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No ad Found" }); } else if (!req.body.userId) { res.send({ responseCode: 404, responseMessage: 'Please enter userId' }); } else if (!req.body.mediaType) { res.send({ responseCode: 404, responseMessage: 'Please enter mediaType' }); } else if (!req.body.link) { res.send({ responseCode: 404, responseMessage: 'Please enter link' }); } else {
                res.send({
                    //  result: result,
                    responseCode: 200,
                    responseMessage: i18n.__("Post saved successfully")
                })
            }
        })
    },

    // get social media link on page api
    "getSocialMediaLink": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        createNewPage.findOne({ _id: req.body.pageId }, 'linkSocialListObject').exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result)(res.send({ responseCode: 404, responseMessage: "No page found." }))
            else {
                // for(var i=0; i<result.length; i++){
                //     var reply=result.docs[i].reply;
                //     var data=reply.filter(reply=>reply.status=='ACTIVE');
                //     console.log("data--->>"+data)
                //     result.docs[i].reply = data;
                //   }
                var data = result.linkSocialListObject.filter(linkSocialListObject => linkSocialListObject.status == 'ACTIVE');
                console.log("data--->>" + data)
                result.linkSocialListObject = data;
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: i18n.__("Post saved successfully")
                })
            }
        })
    },

    // delete social media link api
    "deleteSocialMediaLink": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        createNewPage.findOneAndUpdate({ _id: req.body.pageId, 'linkSocialListObject._id': req.body.linkId }, { 'linkSocialListObject.$.status': 'INACTIVE' }, { new: true }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result)(res.send({ responseCode: 404, responseMessage: "No link found." }))
            else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: i18n.__("Link deleted successfully")
                })
            }
        })
    },

    // edit social media link on page
    "editSocialMediaLink": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        createNewPage.findOneAndUpdate({ _id: req.body.pageId, 'linkSocialListObject._id': req.body.linkId }, { 'linkSocialListObject.$.link': req.body.link }, { new: true }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result)(res.send({ responseCode: 404, responseMessage: "No link found." }))
            else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: i18n.__("Link edited successfully")
                })
            }
        })
    },

    // show list of page's coupon winners
    "particularPageCouponWinners": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        var pageId = req.body.pageId;
        var pageNumber = Number(req.params.pageNumber)
        var limitData = pageNumber * 8;
        var skips = limitData - 8;
        var page = String(pageNumber);

        var userId = req.params.id;
        User.find({ $or: [{ 'type': 'USER' }, { 'type': 'Advertiser' }], status: 'ACTIVE', isVerified: "TRUE" }).lean().exec(function(err, userResult1) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                var blockedArray = [];
                for (var i = 0; i < userResult1.length; i++) {
                    for (var j = 0; j < userResult1[i].blockUser.length; j++) {
                        if (userResult1[i].blockUser[j].toString() == userId) {
                            blockedArray.push(userResult1[i]._id)
                        } else {
                            console.log("flag------->>>>")
                        }
                    }
                }


                User.aggregate({ $unwind: '$coupon' }, { $match: { 'coupon.pageId': pageId, 'coupon.type': 'WINNER', _id: { $nin: blockedArray } } }, function(err, result) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 11' }); } else if (result.length == 0) { res.send({ responseCode: 400, responseMessage: 'No winner found.' }); } else {
                        var count = 0;
                        for (i = 0; i < result.length; i++) {
                            count++;
                        }
                        var pages = Math.ceil(count / 8);
                        User.aggregate({ $unwind: '$coupon' }, { $match: { 'coupon.pageId': pageId, 'coupon.type': 'WINNER', _id: { $nin: blockedArray } } }, { $limit: limitData }, { $skip: skips }, { $sort: { 'coupon.updateddAt': -1 } }, function(err, result1) {
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 22' }); } else if (result1.length == 0) { res.send({ responseCode: 400, responseMessage: 'No winner found.' }); } else {
                                var limit = 0;
                                for (i = 0; i < result1.length; i++) {
                                    limit++;
                                }
                                res.send({
                                    docs: result1,
                                    total: count,
                                    limit: limit,
                                    page: page,
                                    pages: pages,
                                    responseCode: 200,
                                    responseMessage: i18n.__("Successfully shown result")
                                });
                            }
                        })
                    }
                })
            }
        })
    },

    // show page's cash winners
    "particularPageCashWinners": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        var pageId = req.body.pageId;
        var pageNumber = Number(req.params.pageNumber)
        var limitData = pageNumber * 8;
        var skips = limitData - 8;
        var page = String(pageNumber);
        User.aggregate({ $unwind: '$cashPrize' }, { $match: { 'cashPrize.pageId': pageId } }, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 11' }); } else if (result.length == 0) { res.send({ responseCode: 400, responseMessage: 'No winner found' }); } else {
                var count = 0;
                for (i = 0; i < result.length; i++) {
                    count++;
                }
                var pages = Math.ceil(count / 8);
                User.aggregate({ $unwind: '$cashPrize' }, { $match: { 'cashPrize.pageId': pageId } }, { $limit: limitData }, { $skip: skips }, { $sort: { 'cashPrize.updateddAt': -1 } }, function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 22' }); } else if (result1.length == 0) { res.send({ responseCode: 400, responseMessage: 'No winner found' }); } else {
                        var limit = 0;
                        for (i = 0; i < result1.length; i++) {
                            limit++;
                        }
                        res.send({
                            docs: result1,
                            total: count,
                            limit: limit,
                            page: page,
                            pages: pages,
                            responseCode: 200,
                            responseMessage: i18n.__("Successfully shown result")
                        });
                    }
                })
            }
        })
    },

    // filter pages's coupon winners api
    "PageCouponWinnersFilter": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        if (!req.body.startDate && !req.body.endDate) { res.send({ responseCode: 400, responseMessage: 'Please enter atleast start date or end date' }); } else {
            var pageId = req.params.id;
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

            var userId = req.body.id;
            User.find({ $or: [{ 'type': 'USER' }, { 'type': 'Advertiser' }], status: 'ACTIVE', isVerified: "TRUE" }).lean().exec(function(err, userResult1) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                    var blockedArray = [];
                    for (var i = 0; i < userResult1.length; i++) {
                        for (var j = 0; j < userResult1[i].blockUser.length; j++) {
                            if (userResult1[i].blockUser[j].toString() == userId) {
                                blockedArray.push(userResult1[i]._id)
                            } else {
                                console.log("flag------->>>>")
                            }
                        }
                    }
                    User.aggregate({ $unwind: "$coupon" }, { $match: { 'coupon.pageId': pageId, 'coupon.type': 'WINNER', 'coupon.updateddAt': data, _id: { $nin: blockedArray } } }).exec(function(err, result) {
                        console.log("1")
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 11' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No coupon winner found" }); } else {
                            var count = 0;
                            for (i = 0; i < result.length; i++) {
                                count++;
                            }
                            var pages = Math.ceil(count / 8);
                            User.aggregate({ $unwind: "$coupon" }, { $match: { 'coupon.pageId': pageId, 'coupon.type': 'WINNER', 'coupon.updateddAt': data, _id: { $nin: blockedArray } } }, { $limit: limitData }, { $skip: skips }).exec(function(err, result1) {
                                console.log("2")
                                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 22' }); } else if (result1.length == 0) { res.send({ responseCode: 400, responseMessage: "No coupon winner found" }); } else {
                                    res.send({
                                        docs: result1,
                                        count: count,
                                        limit: limitData,
                                        page: page,
                                        pages: pages,
                                        responseCode: 200,
                                        responseMessage: i18n.__("All coupon winner shown successfully")
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    },

    //  // filter pages's cash winners api
    "PageCashWinnersFilter": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        if (!req.body.startDate && !req.body.endDate) { res.send({ responseCode: 400, responseMessage: i18n.__('Please enter atleast start date or end date') }); } else {
            var pageId = req.params.id;
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
            var userId = req.body.id;
            User.find({ $or: [{ 'type': 'USER' }, { 'type': 'Advertiser' }], status: 'ACTIVE', isVerified: "TRUE" }).lean().exec(function(err, userResult1) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                    var blockedArray = [];
                    for (var i = 0; i < userResult1.length; i++) {
                        for (var j = 0; j < userResult1[i].blockUser.length; j++) {
                            if (userResult1[i].blockUser[j].toString() == userId) {
                                blockedArray.push(userResult1[i]._id)
                            } else {
                                console.log("flag------->>>>")
                            }
                        }
                    }

                    User.aggregate({ $unwind: "$cashPrize" }, { $match: { 'cashPrize.pageId': pageId, 'cashPrize.updateddAt': data }, _id: { $nin: blockedArray } }).exec(function(err, result) {
                        console.log("1")
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 11' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No cash winner found" }); } else {
                            var count = 0;
                            for (i = 0; i < result.length; i++) {
                                count++;
                            }
                            var pages = Math.ceil(count / 8);
                            User.aggregate({ $unwind: "$cashPrize" }, { $match: { 'cashPrize.pageId': pageId, 'cashPrize.updateddAt': data }, _id: { $nin: blockedArray } }, { $limit: limitData }, { $skip: skips }).exec(function(err, result1) {
                                console.log("2")
                                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 22' }); } else if (result1.length == 0) { res.send({ responseCode: 400, responseMessage: "No cash winner found" }); } else {
                                    res.send({
                                        docs: result1,
                                        count: count,
                                        limit: limitData,
                                        page: page,
                                        pages: pages,
                                        responseCode: 200,
                                        responseMessage: i18n.__("All cash winner shown successfully")
                                    })
                                }
                            })
                        }
                    })

                }
            })
        }
    },

    // ad or remove admin on page
    "adAdmin": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        if (req.body.add == "add") {
            createNewPage.findOne({ _id: req.params.id }).exec(function(err, result) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (Boolean(result.adAdmin.find(adAdmin => adAdmin.userId == req.body.userId))) { res.send({ responseCode: 400, responseMessage: i18n.__("This user is already added as admin") }); } else {
                    createNewPage.findByIdAndUpdate(req.params.id, { $push: { "adAdmin": { userId: req.body.userId, type: req.body.type } }, $inc: { adAdminCount: 1 } }, { new: true }).exec(function(err, result) {
                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                            User.findOneAndUpdate({ _id: req.body.userId }, { $inc: { pageCount: 1 }, $set: { type: "Advertiser" } }, { new: true }).exec(function(err, result1) {
                                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                                    res.send({
                                        result: result,
                                        responseCode: 200,
                                        responseMessage: i18n.__("Admin added successfully")
                                    });
                                }
                            })
                        }
                    });
                }
            })
        } else if (req.body.add == "remove") {
            createNewPage.findByIdAndUpdate(req.params.id, { $pop: { "adAdmin": { userId: req.body.userId, type: req.body.type } }, $inc: { adAdminCount: -1 } }, { new: true }).exec(function(err, result) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                    User.findByIdAndUpdate({ _id: req.body.userId }, { $inc: { pageCount: -1 }, $set: { type: "USER" } }).exec(function(err, result1) {
                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                            res.send({
                                result: result,
                                responseCode: 200,
                                responseMessage: i18n.__("Admin removed successfully")
                            });
                        }
                    })
                }
            });
        }
    },

    // update page click view
    "pageViewClick": function(req, res) {
        console.log("page view", JSON.stringify(req.body))
        i18n = new i18n_module(req.body.lang, configs.langFile);
        var startTime = new Date(req.body.date).toUTCString();
        var endTimeHour = req.body.date + 60000;
        var endTime = new Date(endTimeHour).toUTCString();
        console.log(startTime);
        console.log(endTime)
        var details = req.body;
        var data = req.body.click;
        switch (data) {
            case 'productView':
                var updateData = { $inc: { productView: 1 } };
                details.productView = 1;
                break;
            case 'callUsClick':
                var updateData = { $inc: { callUsClick: 1 } };
                details.callUsClick = 1;
                break;
            case 'locationClicks':
                var updateData = { $inc: { locationClicks: 1 } };
                details.locationClicks = 1;
                break;
            case 'websiteClicks':
                var updateData = { $inc: { websiteClicks: 1 } };
                details.websiteClicks = 1;
                break;
            case 'emailClicks':
                var updateData = { $inc: { emailClicks: 1 } };
                details.emailClicks = 1;
                break;
            case 'socialMediaClicks':
                var updateData = { $inc: { socialMediaClicks: 1 } };
                details.socialMediaClicks = 1;
                break;
            case 'pageView':
                var updateData = { $inc: { pageView: 1 } };
                details.pageView = 1;
                break;
            case 'followerNumber':
                var updateData = { $inc: { followerNumber: 1 } };
                details.followerNumber = 1;
                break;
            case 'eventViewClicks':
                var updateData = { $inc: { eventViewClicks: 1 } };
                details.eventViewClicks = 1;
                break;
            case 'shares':
                var updateData = { $inc: { shares: 1 } };
                details.shares = 1;
                break;
            case 'viewAds':
                var updateData = { $inc: { viewAds: 1 } };
                details.viewAds = 1;
                break;
            case 'totalReview':
                var updateData = { $inc: { totalRating: 1 } };
                details.totalRating = 1;
                break;
        }

        details.date = startTime;
        var views = Views(details);
        views.save(function(err, pageRes) {
            if (req.body.click == 'viewAds') {
                createNewAds.findOneAndUpdate({ _id: req.body.adsId }, { $inc: { watchedAds: 1 } }, { new: true }).exec(function(err, AdsRes) {
                    res.send({
                        result: pageRes,
                        responseCode: 200,
                        responseMessage: i18n.__("Successfully update clicks")
                    });
                })
            } else {
                res.send({
                    result: pageRes,
                    responseCode: 200,
                    responseMessage: i18n.__("Successfully update clicks")
                });
            }
        })

        // Views.findOne({ pageId: req.body.pageId, date: { $gte: startTime, $lte: endTime } }, function(err, result) {
        //     console.log("views r3sult==>>" + result)
        //     if (err) {
        //         res.send({
        //             result: err,
        //             responseCode: 302,
        //             responseMessage: "error."
        //         });
        //     } else if (!result) {
        //         saveData = 1;
        //         details.date = startTime;
        //         var views = Views(details);
        //         views.save(function(err, pageRes) {
        //             if (req.body.click == 'viewAds') {
        //                 createNewAds.findOneAndUpdate({ _id: req.body.adsId }, { $inc: { watchedAds: 1 } }, { new: true }).exec(function(err, AdsRes) {
        //                     res.send({
        //                         result: pageRes,
        //                         responseCode: 200,
        //                         responseMessage: "Successfully update clicks."
        //                     });
        //                 })
        //             } else {
        //                 res.send({
        //                     result: pageRes,
        //                     responseCode: 200,
        //                     responseMessage: "Successfully update clicks."
        //                 });
        //             }
        //         })

        //     } else {
        //         Views.findOneAndUpdate({ _id: result._id }, updateData, { new: true }).exec(function(err, pageRes) {
        //             if (err) {
        //                 res.send({
        //                     result: err,
        //                     responseCode: 302,
        //                     responseMessage: "error."
        //                 });
        //             } else if (!result) {
        //                 res.send({
        //                     result: pageRes,
        //                     responseCode: 404,
        //                     responseMessage: "Successfully update clicks."
        //                 });
        //             } else {
        //                 if (req.body.click == 'viewAds') {
        //                     createNewAds.findOneAndUpdate({ _id: req.body.adsId }, { $inc: { watchedAds: 1 } }, { new: true }).exec(function(err, AdsRes) {
        //                         res.send({
        //                             result: pageRes,
        //                             responseCode: 200,
        //                             responseMessage: "Successfully update clicks."
        //                         });
        //                     })
        //                 } else {
        //                     res.send({
        //                         result: pageRes,
        //                         responseCode: 200,
        //                         responseMessage: "Successfully update clicks."
        //                     });
        //                 }
        //             }
        //         })
        //     }
        // })
    },

    "pageStatisticsFilter": function(req, res) { //pageId, 
        // var startTime = new Date(req.body.date).toUTCString();
        // var endTimeHour = req.body.date + 86399000;
        // var endTime = new Date(endTimeHour).toUTCString();

        // var week = endTimeHour - 604800000;
        // var weekly = new Date(week).toUTCString();


        // function daysInMonth(month, year) {
        //     return new Date(year, month, 0).getDate();
        // }
        // var month_date = new Date(parseInt(req.body.date))
        // var mm = month_date.getMonth();
        // var yy = month_date.getFullYear();
        // console.log("year==>" + yy)
        // var days = daysInMonth(mm, yy);
        // console.log("days-----------  ", days);
        // var month = parseInt(req.body.date) + (86400000 * days)
        // var monthly = new Date(month).toUTCString();

        // //var yearly = new Date().getFullYear;
        // if (req.body.dateFilter == 'all') {
        //     var queryCondition = { $match: { date: { "$gte": new Date(startTime), "$lte": new Date(endTime) } } }
        // }
        // if (req.body.dateFilter == 'today') {
        //     var queryCondition = { $match: { date: { "$gte": new Date(req.body.startDate), "$lte": new Date(req.body.endDate) }, pageId: req.body.pageId } }
        // }
        // if (req.body.dateFilter == 'weekly') {
        //     var condition;
        //     var queryCondition = { $match: { date: { "$gte": new Date(req.body.startDate), "$lte": new Date(req.body.endDate) }, pageId: req.body.pageId } }
        // }
        // if (req.body.dateFilter == 'monthly') {
        //     var queryCondition = { $match: { "month": mm, "year": yy } }
        // }
        // if (req.body.dateFilter == 'yearly') {
        //     var condition = { $project: { pageView: "$pageView", productView: "$productView", callUsClick: "$callUsClick", date: "$date", year: { $year: "$date" }, month: { $month: "$date" } } };
        //     var queryCondition = { $match: { "year": yy } };
        //     // var queryCondition = {query,condition};
        // }
        // console.log("startTime==>>" + startTime);
        // console.log("new date startTime==>>" + new Date(startTime));
        // console.log("endTime====>>" + endTime)
        //     //   var rules = [{pageId:"58aaa1b3fdc4ed1553754d2f"}, {date: {$gte: startTime}}];

        //         Views.aggregate( [    
        //  { $match: {date: {"$gte":  new Date(startTime), "$lte": new Date(endTime)},pageId:"58aaa1b3fdc4ed1553754d2f"}},
        // // { $group: { _id: null, count: { $sum: "$productView" } } }
        //  ]).exec(function(err,result){
        i18n = new i18n_module(req.body.lang, configs.langFile);
        var queryCondition = { $match: { date: { "$gte": new Date(req.body.startDate), "$lte": new Date(req.body.endDate) }, pageId: req.body.pageId } }

        console.log("queryCondition" + JSON.stringify(queryCondition))

        if (req.body.dateFilter == 'yearly') {
            var queryCondition = { $match: { date: { "$gte": new Date(startTime), "$lte": new Date(endTime) } } }
        }

        Views.aggregate([queryCondition, {
            $group: {
                _id: null,
                totalProductView: { $sum: "$productView" },
                totalPageView: { $sum: "$pageView" },
                totalEventViewClicks: { $sum: "$eventViewClicks" },
                totalEmailClicks: { $sum: "$emailClicks" },
                totalCallUsClick: { $sum: "$callUsClick" },
                totalFollowerNumber: { $sum: "$followerNumber" },
                totalSocialMediaClicks: { $sum: "$socialMediaClicks" },
                totalLocationClicks: { $sum: "$locationClicks" },
                totalWebsiteClicks: { $sum: "$websiteClicks" },
                totalShares: { $sum: "$shares" },
                totalViewAds: { $sum: "$viewAds" },
                totalRating: { $sum: "$totalRating" }
            }
        }]).exec(function(err, result) {
            if (err) {
                res.send({
                    result: err,
                    responseCode: 404,
                    responseMessage: "error."
                });
            } else if (result.length == 0) {
                var data = {
                    totalProductView: 0,
                    totalPageView: 0,
                    totalEventViewClicks: 0,
                    totalEmailClicks: 0,
                    totalCallUsClick: 0,
                    totalFollowerNumber: 0,
                    totalSocialMediaClicks: 0,
                    totalLocationClicks: 0,
                    totalWebsiteClicks: 0,
                    totalShares: 0,
                    totalViewAds: 0,
                    totalRating: 0
                }
                res.send({
                    result: data,
                    responseCode: 200,
                    responseMessage: "Data not found."
                });

            } else {
                console.log("aggregate result===>.", result)
                createNewPage.aggregate(
                    [
                        //  { $match: {_id:req.body.pageId} },
                        { $unwind: "$totalRating" },
                        { $match: { "totalRating.date": { "$gte": new Date(req.body.startDate), "$lte": new Date(req.body.endDate) }, _id: new mongoose.Types.ObjectId(req.body.pageId) } }
                    ],
                    function(err, pages) {

                        var totalRating = pages.length;
                        console.log("totalRating====>>" + totalRating)
                        //result[0].totalRating = totalRating;
                        res.send({
                            result: result,
                            responseCode: 200,
                            responseMessage: "Success."
                        });
                    })
                // createNewPage.findOne({_id:req.body.pageId,'totalRating.date': {"$gte":  new Date(startTime), "$lte": new Date(endTime)}}).exec(function(err, ress){
                //     var totalRating = ress.totalRating.length;
                //     console.log("totalRating====>>"+totalRating)
                //     result[0].totalRating = totalRating;
                //       res.send({
                //         result: result,
                //         responseCode: 200,
                //         responseMessage: "Success."
                //       });
                // })
            }
        })
    },

    // 
    "pageStatisticsFilterClick": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        var newYear = new Date(req.body.date).getFullYear();
        var newMonth = new Date(req.body.date).getMonth();
        var newDate = new Date(req.body.date).getDate();
        var data = req.body.dateFilter;
        switch (data) {
            case 'yearly':
                var updateData = { year: { $year: "$date" }, month: { $month: "$date" } }
                break;
            case 'monthly':
                var updateData = { year: { $year: "$date" }, month: { $month: "$date" }, week: { $week: "$date" } }
                break;
            case 'weekly':
                var updateData = { year: { $year: "$date" }, month: { $month: "$date" }, week: { $week: "$date" }, dayOfMonth: { $dayOfMonth: "$date" } }
                break;
            case 'today':
                var updateData = { year: { $year: "$date" }, month: { $month: "$date" }, dayOfMonth: { $dayOfMonth: "$date" }, hour: { $hour: "$date" }, minutes: { $minute: "$date" } }
                break;
        }

        Views.aggregate({ $match: { pageId: req.body.pageId } }, {
                $group: {
                    _id: updateData,
                    totalProductView: { $sum: "$productView" },
                    totalPageView: { $sum: "$pageView" },
                    totalEventViewClicks: { $sum: "$eventViewClicks" },
                    totalEmailClicks: { $sum: "$emailClicks" },
                    totalCallUsClick: { $sum: "$callUsClick" },
                    totalFollowerNumber: { $sum: "$followerNumber" },
                    totalSocialMediaClicks: { $sum: "$socialMediaClicks" },
                    totalLocationClicks: { $sum: "$locationClicks" },
                    totalWebsiteClicks: { $sum: "$websiteClicks" },
                    totalShares: { $sum: "$shares" },
                    totalViewAds: { $sum: "$viewAds" },
                    totalRating: { $sum: "$totalRating" }
                }
            },
            function(err, results) {
                if (req.body.dateFilter == 'yearly') {
                    console.log("yearly")
                    var yearData = 2017
                    var data = results.filter(results => results._id.year == newYear)
                    results = data;
                    var array = [];
                    var flag = false;
                    for (var i = 1; i <= 12; i++) {
                        console.log("Dfdgf", i)
                        for (var j = 0; j < results.length; j++) {
                            if (i == results[j]._id.month) {

                                console.log("value of j==>", j)
                                flag = true;
                                break;
                            } else {
                                flag = false;
                            }
                        }
                        if (flag == true) {
                            array.push(results[j])
                        } else {
                            var data = {
                                _id: {
                                    year: newYear,
                                    month: i
                                },
                                totalProductView: 0,
                                totalPageView: 0,
                                totalEventViewClicks: 0,
                                totalEmailClicks: 0,
                                totalCallUsClick: 0,
                                totalFollowerNumber: 0,
                                totalSocialMediaClicks: 0,
                                totalLocationClicks: 0,
                                totalWebsiteClicks: 0,
                                totalShares: 0,
                                totalViewAds: 0,
                                totalRating: 0
                            }
                            array.push(data)
                        }
                    }
                    res.send({
                        result: array,
                        responseCode: 200,
                        responseMessage: i18n.__("Success")
                    })
                }
                if (req.body.dateFilter == 'monthly') {
                    console.log("monthly", newMonth + 1)
                    var month = newMonth + 1;
                    var yearData = 2017
                    var data = results.filter(results => results._id.year == newYear && results._id.month == month)
                    results = data;
                    if (results.length == 0) {
                        var datas = {
                            _id: {
                                year: newYear,
                                month: newMonth
                            },
                            totalProductView: 0,
                            totalPageView: 0,
                            totalEventViewClicks: 0,
                            totalEmailClicks: 0,
                            totalCallUsClick: 0,
                            totalFollowerNumber: 0,
                            totalSocialMediaClicks: 0,
                            totalLocationClicks: 0,
                            totalWebsiteClicks: 0,
                            totalShares: 0,
                            totalViewAds: 0,
                            totalRating: 0
                        }
                        res.send({
                            result: datas,
                            responseCode: 200,
                            responseMessage: i18n.__("Success")
                        })
                    } else {
                        res.send({
                            result: results,
                            responseCode: 200,
                            responseMessage: i18n.__("Success")
                        })
                    }

                }
                if (req.body.dateFilter == 'weekly') {
                    console.log("monthly", newMonth + 1)
                    var month = newMonth + 1;
                    var yearData = 2017
                    var data = results.filter(results => results._id.year == newYear && results._id.month == month)
                    results = data;
                    if (results.length == 0) {
                        var datas = {
                            _id: {
                                year: newYear,
                                month: newMonth,
                                week: 0
                            },
                            totalProductView: 0,
                            totalPageView: 0,
                            totalEventViewClicks: 0,
                            totalEmailClicks: 0,
                            totalCallUsClick: 0,
                            totalFollowerNumber: 0,
                            totalSocialMediaClicks: 0,
                            totalLocationClicks: 0,
                            totalWebsiteClicks: 0,
                            totalShares: 0,
                            totalViewAds: 0,
                            totalRating: 0
                        }
                        res.send({
                            result: datas,
                            responseCode: 200,
                            responseMessage: i18n.__("Success")
                        })
                    } else {
                        res.send({
                            result: results,
                            responseCode: 200,
                            responseMessage: i18n.__("Success")
                        })
                    }
                }

                if (req.body.dateFilter == 'today') {
                    console.log("monthly", newMonth + 1)
                    var month = newMonth + 1;
                    var yearData = 2017
                    var data = results.filter(results => results._id.year == newYear && results._id.month == month && results._id.dayOfMonth == newDate)
                    results = data;
                    if (results.length == 0) {
                        var datas = [{
                            _id: {
                                year: newYear,
                                month: newMonth,
                                week: 0,
                                dayOfMonth: 0
                            },
                            totalProductView: 0,
                            totalPageView: 0,
                            totalEventViewClicks: 0,
                            totalEmailClicks: 0,
                            totalCallUsClick: 0,
                            totalFollowerNumber: 0,
                            totalSocialMediaClicks: 0,
                            totalLocationClicks: 0,
                            totalWebsiteClicks: 0,
                            totalShares: 0,
                            totalViewAds: 0,
                            totalRating: 0
                        }]
                        res.send({
                            result: datas,
                            responseCode: 200,
                            responseMessage: i18n.__("Success")
                        })
                    } else {
                        res.send({
                            result: results,
                            responseCode: 200,
                            responseMessage: i18n.__("Success")
                        })
                    }
                }
            })
    },

    //  // api for gift statisticks click
    "giftStatistics": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        var startTime = new Date(req.body.startDate);
        var endTime = new Date(req.body.endDate);
        waterfall([
            function(callback) {
                createNewAds.find({
                    updatedAt: { $gte: startTime, $lte: endTime },
                    pageId: req.body.pageId
                }).exec(function(err, result) {
                    console.log("result", result)
                    if (err) { res.send({ result: err, responseCode: 404, responseMessage: "error." }); } else if (result.length == 0) {
                        var winnersLength = 0;
                        callback(null, winnersLength)
                    } else {
                        //    console.log("winner=====>", result)
                        var winnersLength = 0;
                        for (var i = 0; i < result.length; i++) {
                            winnersLength += result[i].winners.length;
                            console.log(winnersLength);
                        }

                        callback(null, winnersLength)
                    }
                })
            },
            function(winnersLength, callback) {
                createNewAds.find({
                    pageId: req.body.pageId
                }).exec(function(err, result) {
                    console.log("result", result)
                    if (err) { res.send({ result: err, responseCode: 404, responseMessage: "error." }); } else if (result.length == 0) {
                        var data = 0;
                        callback(null, winnersLength, data)
                    } else {
                        var array = [];
                        for (var i = 0; i < result.length; i++) {
                            array.push(String(result[i]._id))
                        }
                        var updateData = { $match: { adId: { $in: array }, date: { $gte: startTime, $lte: endTime }, } };
                        var groupCond = {
                            $group: {
                                _id: null,
                                couponPurchased: { $sum: "$couponPurchased" }
                            }
                        }
                        Views.aggregate(updateData, groupCond, function(err, result) {
                            console.log("result=========>>>..", result)
                            if (err) {
                                res.send({ result: err, responseCode: 302, responseMessage: "error." });
                            } else if (result.length == 0) {
                                var data = 0
                                callback(null, winnersLength, data)
                            } else {
                                var data = result[0].couponPurchased;
                                callback(null, winnersLength, data)
                            }
                        })
                    }
                })
            },
            function(winnersLength, totalBuyers, callback) {
                var updateDataPENDING = { $match: { 'cashPrize.pageId': req.body.pageId, 'cashPrize.cashStatus': 'DELIVERED', 'cashPrize.updateddAt': { $gte: startTime, $lte: endTime } } };
                var updateUnwindDataPENDING = { $unwind: "$cashPrize" };
                var groupCondPENDING = {
                    $group: {
                        _id: null,
                        deliveredCash: { $sum: 1 }
                    }
                }
                User.aggregate(updateUnwindDataPENDING, updateDataPENDING, groupCondPENDING, function(err, result) {
                    if (err) {
                        res.send({ result: err, responseCode: 302, responseMessage: "error." });
                    } else if (result.length == 0) {
                        var cashDeliveredResult = 0;
                        callback(null, winnersLength, totalBuyers, cashDeliveredResult)
                    } else {
                        var cashDeliveredResult = result[0].deliveredCash
                        callback(null, winnersLength, totalBuyers, cashDeliveredResult)
                    }
                })
            },
            function(winnersLength, totalBuyers, cashDeliveredResult, callback) {
                var updateDataPENDING = { $match: { 'cashPrize.pageId': req.body.pageId, 'cashPrize.cashStatus': 'PENDING', 'cashPrize.updateddAt': { $gte: startTime, $lte: endTime } } };
                var updateUnwindDataPENDING = { $unwind: "$cashPrize" };
                var groupCondPENDING = {
                    $group: {
                        _id: null,
                        pendingCash: { $sum: 1 }
                    }
                }
                User.aggregate(updateUnwindDataPENDING, updateDataPENDING, groupCondPENDING, function(err, result) {
                    if (err) {
                        res.send({ result: err, responseCode: 302, responseMessage: "error." });
                    } else if (result.length == 0) {
                        var cashPendingResult = 0;
                        callback(null, winnersLength, totalBuyers, cashDeliveredResult, cashPendingResult)
                    } else {
                        var cashPendingResult = result[0].pendingCash
                        callback(null, winnersLength, totalBuyers, cashDeliveredResult, cashPendingResult)
                    }
                })
            },
            function(winnersLength, totalBuyers, cashDeliveredResult, cashPendingResult, callback) {
                var updateDataUSED = { $match: { 'coupon.pageId': req.body.pageId, 'coupon.couponStatus': 'USED', 'coupon.usedCouponDate': { $gte: startTime, $lte: endTime } } };
                var updateUnwindDataUSED = { $unwind: "$coupon" };
                var groupCondUSED = {
                    $group: {
                        _id: null,
                        usedCoupon: { $sum: 1 }
                    }
                }
                User.aggregate(updateUnwindDataUSED, updateDataUSED, groupCondUSED, function(err, result) {
                    if (err) {
                        res.send({ result: err, responseCode: 302, responseMessage: "error." });
                    } else if (result.length == 0) {
                        var couponUsedResult = 0;
                        callback(null, winnersLength, totalBuyers, cashDeliveredResult, cashPendingResult, couponUsedResult)
                    } else {
                        var couponUsedResult = result[0].usedCoupon
                        callback(null, winnersLength, totalBuyers, cashDeliveredResult, cashPendingResult, couponUsedResult)
                    }
                })
            },
            function(winnersLength, totalBuyers, cashDeliveredResult, cashPendingResult, couponUsedResult, callback) {
                var updateDataEXPIRED = { $match: { 'coupon.pageId': req.body.pageId, 'coupon.couponStatus': 'EXPIRED', 'coupon.expirationTime': { $gte: startTime, $lte: endTime } } };
                var updateUnwindDataEXPIRED = { $unwind: "$coupon" };
                var groupCondEXPIRED = {
                    $group: {
                        _id: null,
                        expiredCoupon: { $sum: 1 }
                    }
                }

                User.aggregate(updateUnwindDataEXPIRED, updateDataEXPIRED, groupCondEXPIRED, function(err, result) {
                    if (err) {
                        res.send({ result: err, responseCode: 302, responseMessage: "error." });
                    } else if (result.length == 0) {
                        var couponExpResult = 0;
                        callback(null, winnersLength, totalBuyers, cashDeliveredResult, cashPendingResult, couponUsedResult, couponExpResult);
                    } else {
                        var couponExpResult = result[0].expiredCoupon
                        callback(null, winnersLength, totalBuyers, cashDeliveredResult, cashPendingResult, couponUsedResult, couponExpResult);
                    }
                })
            },
            function(winnersLength, totalBuyers, cashDeliveredResult, cashPendingResult, couponUsedResult, couponExpResult, callback) {
                var updateDataVALID = { $match: { 'coupon.pageId': req.body.pageId, 'coupon.couponStatus': 'VALID', 'coupon.updateddAt': { $gte: startTime, $lte: endTime } } };
                var updateUnwindDataVALID = { $unwind: "$coupon" };
                var groupCondVALID = {
                    $group: {
                        _id: null,
                        validCoupon: { $sum: 1 }
                    }
                }
                User.aggregate(updateUnwindDataVALID, updateDataVALID, groupCondVALID, function(err, result) {
                    if (err) {
                        res.send({ result: err, responseCode: 302, responseMessage: "error." });
                    } else if (result.length == 0) {
                        var couponValidResult = 0;
                        var data = {
                            winnersLength: winnersLength,
                            totalBuyers: totalBuyers,
                            cashPendingResult: cashPendingResult,
                            cashDeliveredResult: cashDeliveredResult,
                            couponUsedResult: couponUsedResult,
                            couponExpResult: couponExpResult,
                            couponValidResult: couponValidResult
                        }
                        callback(null, data);
                    } else {
                        var data = {
                            winnersLength: winnersLength,
                            totalBuyers: totalBuyers,
                            cashPendingResult: cashPendingResult,
                            cashDeliveredResult: cashDeliveredResult,
                            couponUsedResult: couponUsedResult,
                            couponExpResult: couponExpResult,
                            couponValidResult: result[0].validCoupon
                        }
                        callback(null, data);
                    }
                })
            }
        ], function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }) } else {
                res.send({
                    responseCode: 200,
                    responseMessage: i18n.__('Successfully'),
                    result: result
                });
            }
        })
    },

    // api for gift statisticks filter click
    "giftStatisticsFilterClick": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        var newYear = new Date(req.body.date).getFullYear();
        var newMonth = new Date(req.body.date).getMonth();
        var newDate = new Date(req.body.date).getDate();
        var data = req.body.dateFilter;
        switch (data) {
            case 'yearly':
                var updateDataWinner = { year: { $year: "$updatedAt" }, month: { $month: "$updatedAt" } };
                var updateData = { year: { $year: "$date" }, month: { $month: "$date" } };
                var updateDataExpiredd = { year: { $year: "$coupon.expirationTime" }, month: { $month: "$coupon.expirationTime" } };
                var updateDataValidd = { year: { $year: "$coupon.updateddAt" }, month: { $month: "$coupon.updateddAt" } };
                var updateDataUsedd = { year: { $year: "$coupon.usedCouponDate" }, month: { $month: "$coupon.usedCouponDate" } };
                var updateDataDeliveredd = { year: { $year: "$cashPrize.updateddAt" }, month: { $month: "$cashPrize.updateddAt" } };
                var updateDataPendingg = { year: { $year: "$cashPrize.updateddAt" }, month: { $month: "$cashPrize.updateddAt" } }
                break;
            case 'monthly':
                var updateData = { year: { $year: "$date" }, month: { $month: "$date" }, week: { $week: "$date" } };
                var updateDataWinner = { year: { $year: "$updatedAt" }, month: { $month: "$updatedAt" }, week: { $week: "$updatedAt" } };
                var updateDataExpiredd = { year: { $year: "$coupon.expirationTime" }, month: { $month: "$coupon.expirationTime" }, week: { $week: "$coupon.expirationTime" } };
                var updateDataValidd = { year: { $year: "$coupon.updateddAt" }, month: { $month: "$coupon.updateddAt" }, week: { $week: "$coupon.updateddAt" } }
                var updateDataUsedd = { year: { $year: "$coupon.usedCouponDate" }, month: { $month: "$coupon.usedCouponDate" }, week: { $week: "$coupon.usedCouponDate" } }
                var updateDataDeliveredd = { year: { $year: "$cashPrize.updateddAt" }, month: { $month: "$cashPrize.updateddAt" }, week: { $week: "$cashPrize.updateddAt" } };
                var updateDataPendingg = { year: { $year: "$cashPrize.updateddAt" }, month: { $month: "$cashPrize.updateddAt" }, week: { $week: "$cashPrize.updateddAt" } }
                break;
            case 'weekly':
                var updateData = { year: { $year: "$date" }, month: { $month: "$date" }, week: { $week: "$date" }, dayOfMonth: { $dayOfMonth: "$date" } };
                var updateDataWinner = { year: { $year: "$updatedAt" }, month: { $month: "$updatedAt" }, week: { $week: "$updatedAt" }, dayOfMonth: { $dayOfMonth: "$updatedAt" } };
                var updateDataExpiredd = { year: { $year: "$coupon.expirationTime" }, month: { $month: "$coupon.expirationTime" }, week: { $week: "$coupon.expirationTime" }, dayOfMonth: { $dayOfMonth: "$coupon.expirationTime" } };
                var updateDataValidd = { year: { $year: "$coupon.updateddAt" }, month: { $month: "$coupon.updateddAt" }, week: { $week: "$coupon.updateddAt" }, dayOfMonth: { $dayOfMonth: "$coupon.updateddAt" } };
                var updateDataUsedd = { year: { $year: "$coupon.usedCouponDate" }, month: { $month: "$coupon.usedCouponDate" }, week: { $week: "$coupon.usedCouponDate" }, dayOfMonth: { $dayOfMonth: "$coupon.usedCouponDate" } };
                var updateDataDeliveredd = { year: { $year: "$cashPrize.updateddAt" }, month: { $month: "$cashPrize.updateddAt" }, week: { $week: "$cashPrize.updateddAt" }, dayOfMonth: { $dayOfMonth: "$cashPrize.updateddAt" } };
                var updateDataPendingg = { year: { $year: "$cashPrize.updateddAt" }, month: { $month: "$cashPrize.updateddAt" }, week: { $week: "$cashPrize.updateddAt" }, dayOfMonth: { $dayOfMonth: "$cashPrize.updateddAt" } }
                break;
            case 'today':
                var updateData = { year: { $year: "$date" }, month: { $month: "$date" }, dayOfMonth: { $dayOfMonth: "$date" }, hour: { $hour: "$date" }, minutes: { $minute: "$date" } }
                var updateDataWinner = { year: { $year: "$updatedAt" }, month: { $month: "$updatedAt" }, dayOfMonth: { $dayOfMonth: "$updatedAt" }, hour: { $hour: "$updatedAt" }, minutes: { $minute: "$updatedAt" } };
                var updateDataExpiredd = { year: { $year: "$coupon.expirationTime" }, month: { $month: "$coupon.expirationTime" }, dayOfMonth: { $dayOfMonth: "$coupon.expirationTime" }, hour: { $hour: "$coupon.expirationTime" }, minutes: { $minute: "$coupon.expirationTime" } };
                var updateDataValidd = { year: { $year: "$coupon.updateddAt" }, month: { $month: "$coupon.updateddAt" }, dayOfMonth: { $dayOfMonth: "$coupon.updateddAt" }, hour: { $hour: "$coupon.updateddAt" }, minutes: { $minute: "$coupon.updateddAt" } };
                var updateDataUsedd = { year: { $year: "$coupon.usedCouponDate" }, month: { $month: "$coupon.usedCouponDate" }, dayOfMonth: { $dayOfMonth: "$coupon.usedCouponDate" }, hour: { $hour: "$coupon.usedCouponDate" }, minutes: { $minute: "$coupon.usedCouponDate" } };
                var updateDataDeliveredd = { year: { $year: "$cashPrize.updateddAt" }, month: { $month: "$cashPrize.updateddAt" }, dayOfMonth: { $dayOfMonth: "$cashPrize.updateddAt" }, hour: { $hour: "$cashPrize.updateddAt" }, minutes: { $minute: "$cashPrize.updateddAt" } };
                var updateDataPendingg = { year: { $year: "$cashPrize.updateddAt" }, month: { $month: "$cashPrize.updateddAt" }, dayOfMonth: { $dayOfMonth: "$cashPrize.updateddAt" }, hour: { $hour: "$cashPrize.updateddAt" }, minutes: { $minute: "$cashPrize.updateddAt" } }
                break;
        }

        waterfall([
            function(callback) {
                if (req.body.click == 'WINNER') {
                    var updateUnwindDataWinner = { $unwind: "$winners" };
                    createNewAds.aggregate(updateUnwindDataWinner, { $match: { pageId: req.body.pageId } }, {
                        $group: {
                            _id: updateDataWinner,
                            winnersLength: { $sum: 1 }
                        }
                    }, function(err, results) {
                        if (req.body.dateFilter == 'yearly') {
                            console.log("yearly")
                            var data = results.filter(results => results._id.year == newYear)
                            results = data;
                            var array = [];
                            var flag = false;
                            for (var i = 1; i <= 12; i++) {
                                console.log("Dfdgf", i)
                                for (var j = 0; j < results.length; j++) {
                                    if (i == results[j]._id.month) {
                                        console.log("value of j==>", j)
                                        flag = true;
                                        break;
                                    } else {
                                        flag = false;
                                    }
                                }
                                if (flag == true) {
                                    array.push(results[j])
                                } else {
                                    var data = {
                                        _id: {
                                            year: 2017,
                                            month: i
                                        },
                                        winnersLength: 0
                                    }
                                    array.push(data)
                                }
                            }
                            res.send({
                                responseCode: 200,
                                responseMessage: i18n.__('Successfully'),
                                result: array
                            });
                        }
                        if (req.body.dateFilter == 'monthly' || req.body.dateFilter == 'weekly' || req.body.dateFilter == 'today') {
                            console.log("monthly", newMonth + 1)
                            var month = newMonth + 1;
                            if (req.body.dateFilter == 'monthly') {
                                var data = results.filter(results => results._id.year == newYear && results._id.month == month)
                                results = data;
                            }
                            if (req.body.dateFilter == 'weekly') {
                                var data = results.filter(results => results._id.year == newYear && results._id.month == month)
                                results = data;
                            }
                            if (req.body.dateFilter == 'today') {
                                var data = results.filter(results => results._id.year == newYear && results._id.month == month && results._id.dayOfMonth == newDate)
                                results = data;
                            }
                            if (results.length == 0) {
                                var datas = [{
                                    _id: {
                                        year: newYear,
                                        month: newMonth,
                                        week: 0,
                                        dayOfMonth: 0
                                    },
                                    winnersLength: 0
                                }]
                                res.send({
                                    result: datas,
                                    responseCode: 200,
                                    responseMessage: i18n.__("Success")
                                })
                            } else {
                                res.send({
                                    result: results,
                                    responseCode: 200,
                                    responseMessage: i18n.__("Success")
                                })
                            }
                        }
                    })
                } else {
                    callback(null, "winnersLength")
                }
            },
            function(reeee, callback) {
                if (req.body.click == 'PURCHASED') {
                    Views.aggregate({ $match: { pageId: req.body.pageId } }, {
                            $group: {
                                _id: updateData,
                                couponPurchased: { $sum: "$couponPurchased" }
                            }
                        },
                        function(err, results) {
                            if (req.body.dateFilter == 'yearly') {
                                console.log("yearly")
                                var data = results.filter(results => results._id.year == newYear)
                                results = data;
                                var array = [];
                                var flag = false;
                                for (var i = 1; i <= 12; i++) {
                                    console.log("Dfdgf", i)
                                    for (var j = 0; j < results.length; j++) {
                                        if (i == results[j]._id.month) {
                                            console.log("value of j==>", j)
                                            flag = true;
                                            break;
                                        } else {
                                            flag = false;
                                        }
                                    }
                                    if (flag == true) {
                                        array.push(results[j])
                                    } else {
                                        var data = {
                                            _id: {
                                                year: 2017,
                                                month: i
                                            },
                                            couponPurchased: 0,
                                        }
                                        array.push(data)
                                    }
                                }
                                res.send({
                                    responseCode: 200,
                                    responseMessage: 'Successfully.',
                                    result: array
                                });
                            }
                            if (req.body.dateFilter == 'monthly' || req.body.dateFilter == 'weekly' || req.body.dateFilter == 'today') {
                                console.log("monthly", newMonth + 1)
                                var month = newMonth + 1;
                                if (req.body.dateFilter == 'monthly') {
                                    var data = results.filter(results => results._id.year == newYear && results._id.month == month)
                                    results = data;
                                }
                                if (req.body.dateFilter == 'weekly') {
                                    var data = results.filter(results => results._id.year == newYear && results._id.month == month)
                                    results = data;
                                }
                                if (req.body.dateFilter == 'today') {
                                    var data = results.filter(results => results._id.year == newYear && results._id.month == month && results._id.dayOfMonth == newDate)
                                    results = data;
                                }
                                if (results.length == 0) {
                                    var datas = [{
                                        _id: {
                                            year: newYear,
                                            month: newMonth,
                                            week: 0,
                                            dayOfMonth: 0
                                        },
                                        couponPurchased: 0
                                    }]
                                    res.send({
                                        result: datas,
                                        responseCode: 200,
                                        responseMessage: i18n.__("Success")
                                    })
                                } else {
                                    res.send({
                                        result: results,
                                        responseCode: 200,
                                        responseMessage: i18n.__("Success")
                                    })
                                }
                            }
                        });
                } else {
                    callback(null, "PURCHASED")
                }
            },
            function(couponPr, callback) {
                if (req.body.click == 'EXPIRED' || req.body.click == 'VALID' || req.body.click == 'USED') {
                    if (req.body.click == 'EXPIRED') {
                        var updateDataMatch = { $match: { 'coupon.pageId': req.body.pageId, 'coupon.couponStatus': 'EXPIRED' } };
                        var updateDataCoupon = updateDataExpiredd;
                    }
                    if (req.body.click == 'VALID') {
                        var updateDataMatch = { $match: { 'coupon.pageId': req.body.pageId, 'coupon.couponStatus': 'VALID' } };
                        var updateDataCoupon = updateDataValidd;
                    }
                    if (req.body.click == 'USED') {
                        var updateDataMatch = { $match: { 'coupon.pageId': req.body.pageId, 'coupon.couponStatus': 'USED' } };
                        var updateDataCoupon = updateDataUsedd;
                    }
                    var updateUnwindData = { $unwind: "$coupon" };
                    var groupCond = {
                        $group: {
                            _id: updateDataCoupon,
                            CouponData: { $sum: 1 }
                        }
                    }
                    User.aggregate(updateUnwindData, updateDataMatch, groupCond, function(err, results) {
                        console.log("result", results)
                        if (req.body.dateFilter == 'yearly') {
                            console.log("yearly")
                            var data = results.filter(results => results._id.year == newYear)
                            results = data;
                            var array = [];
                            var flag = false;
                            for (var i = 1; i <= 12; i++) {
                                console.log("Dfdgf", i)
                                for (var j = 0; j < results.length; j++) {
                                    if (i == results[j]._id.month) {
                                        console.log("value of j==>", j)
                                        flag = true;
                                        break;
                                    } else {
                                        flag = false;
                                    }
                                }
                                if (flag == true) {
                                    array.push(results[j])
                                } else {
                                    var data = {
                                        _id: {
                                            year: 2017,
                                            month: i
                                        },
                                        CouponData: 0,
                                    }
                                    array.push(data)
                                }
                            }
                            res.send({
                                responseCode: 200,
                                responseMessage: i18n.__('Successfully'),
                                result: array
                            });
                        }
                        if (req.body.dateFilter == 'monthly' || req.body.dateFilter == 'weekly' || req.body.dateFilter == 'today') {
                            console.log("monthly", newMonth + 1)
                            var month = newMonth + 1;
                            if (req.body.dateFilter == 'monthly') {
                                var data = results.filter(results => results._id.year == newYear && results._id.month == month)
                                results = data;
                            }
                            if (req.body.dateFilter == 'weekly') {
                                var data = results.filter(results => results._id.year == newYear && results._id.month == month)
                                results = data;
                            }
                            if (req.body.dateFilter == 'today') {
                                var data = results.filter(results => results._id.year == newYear && results._id.month == month && results._id.dayOfMonth == newDate)
                                results = data;
                            }
                            if (results.length == 0) {
                                var datas = [{
                                    _id: {
                                        year: newYear,
                                        month: newMonth,
                                        week: 0,
                                        dayOfMonth: 0
                                    },
                                    CouponData: 0
                                }]
                                res.send({
                                    result: datas,
                                    responseCode: 200,
                                    responseMessage: i18n.__("Success")
                                })
                            } else {
                                res.send({
                                    result: results,
                                    responseCode: 200,
                                    responseMessage: i18n.__("Success")
                                })
                            }
                        }
                    })
                } else {
                    callback(null, "COUPONSTATUS")
                }
            },
            function(result, callback) {
                if (req.body.click == 'DELIVERED') {
                    var updateDataDELIVERED = { $match: { 'cashPrize.pageId': req.body.pageId, 'cashPrize.cashStatus': 'DELIVERED' } };
                    var updateUnwindDataDELIVERED = { $unwind: "$cashPrize" };
                    var groupCondDELIVERED = {
                        $group: {
                            _id: updateDataDeliveredd,
                            deliveredCash: { $sum: 1 }
                        }
                    }
                    User.aggregate(updateUnwindDataDELIVERED, updateDataDELIVERED, groupCondDELIVERED, function(err, results) {
                        if (req.body.dateFilter == 'yearly') {
                            console.log("yearly")
                            var data = results.filter(results => results._id.year == newYear)
                            results = data;
                            var array = [];
                            var flag = false;
                            for (var i = 1; i <= 12; i++) {
                                console.log("Dfdgf", i)
                                for (var j = 0; j < results.length; j++) {
                                    if (i == results[j]._id.month) {
                                        console.log("value of j==>", j)
                                        flag = true;
                                        break;
                                    } else {
                                        flag = false;
                                    }
                                }
                                if (flag == true) {
                                    array.push(results[j])
                                } else {
                                    var data = {
                                        _id: {
                                            year: 2017,
                                            month: i
                                        },
                                        deliveredCash: 0,
                                    }
                                    array.push(data)
                                }
                            }
                            res.send({
                                responseCode: 200,
                                responseMessage: i18n.__('Successfully'),
                                result: array
                            });
                        }
                        if (req.body.dateFilter == 'monthly' || req.body.dateFilter == 'weekly' || req.body.dateFilter == 'today') {
                            console.log("monthly", newMonth + 1)
                            var month = newMonth + 1;
                            if (req.body.dateFilter == 'monthly') {
                                var data = results.filter(results => results._id.year == newYear && results._id.month == month)
                                results = data;
                            }
                            if (req.body.dateFilter == 'weekly') {
                                var data = results.filter(results => results._id.year == newYear && results._id.month == month)
                                results = data;
                            }
                            if (req.body.dateFilter == 'today') {
                                var data = results.filter(results => results._id.year == newYear && results._id.month == month && results._id.dayOfMonth == newDate)
                                results = data;
                            }
                            if (results.length == 0) {
                                var datas = [{
                                    _id: {
                                        year: newYear,
                                        month: newMonth,
                                        week: 0,
                                        dayOfMonth: 0
                                    },
                                    deliveredCash: 0
                                }]
                                res.send({
                                    result: datas,
                                    responseCode: 200,
                                    responseMessage: i18n.__("Success")
                                })
                            } else {
                                res.send({
                                    result: results,
                                    responseCode: 200,
                                    responseMessage: i18n.__("Success")
                                })
                            }
                        }
                    })
                } else {
                    callback(null, "DELIVERED")
                }
            },
            function(result, callback) {
                if (req.body.click == 'PENDING') {
                    var updateDataPENDING = { $match: { 'cashPrize.pageId': req.body.pageId, 'cashPrize.cashStatus': 'PENDING' } };
                    var updateUnwindDataPENDING = { $unwind: "$cashPrize" };
                    var groupCondPENDING = {
                        $group: {
                            _id: updateDataPendingg,
                            pendingCash: { $sum: 1 }
                        }
                    }
                    User.aggregate(updateUnwindDataPENDING, updateDataPENDING, groupCondPENDING, function(err, results) {
                        console.log("results", results)
                        if (req.body.dateFilter == 'yearly') {
                            console.log("yearly")
                            var data = results.filter(results => results._id.year == newYear)
                            results = data;
                            var array = [];
                            var flag = false;
                            for (var i = 1; i <= 12; i++) {
                                console.log("Dfdgf", i)
                                for (var j = 0; j < results.length; j++) {
                                    if (i == results[j]._id.month) {
                                        console.log("value of j==>", j)
                                        flag = true;
                                        break;
                                    } else {
                                        flag = false;
                                    }
                                }
                                if (flag == true) {
                                    array.push(results[j])
                                } else {
                                    var data = {
                                        _id: {
                                            year: 2017,
                                            month: i
                                        },
                                        pendingCash: 0,
                                    }
                                    array.push(data)
                                }
                            }
                            res.send({
                                responseCode: 200,
                                responseMessage: i18n.__('Successfully'),
                                result: array
                            });
                        }
                        if (req.body.dateFilter == 'monthly' || req.body.dateFilter == 'weekly' || req.body.dateFilter == 'today') {
                            console.log("monthly", newMonth + 1)
                            var month = newMonth + 1;
                            if (req.body.dateFilter == 'monthly') {
                                var data = results.filter(results => results._id.year == newYear && results._id.month == month)
                                results = data;
                            }
                            if (req.body.dateFilter == 'weekly') {
                                var data = results.filter(results => results._id.year == newYear && results._id.month == month)
                                results = data;
                            }
                            if (req.body.dateFilter == 'today') {
                                var data = results.filter(results => results._id.year == newYear && results._id.month == month && results._id.dayOfMonth == newDate)
                                results = data;
                            }
                            if (results.length == 0) {
                                var datas = [{
                                    _id: {
                                        year: newYear,
                                        month: newMonth,
                                        week: 0,
                                        dayOfMonth: 0
                                    },
                                    pendingCash: 0
                                }]
                                res.send({
                                    result: datas,
                                    responseCode: 200,
                                    responseMessage: i18n.__("Success")
                                })
                            } else {
                                res.send({
                                    result: results,
                                    responseCode: 200,
                                    responseMessage: i18n.__("Success")
                                })
                            }
                        }
                    })
                } else {
                    callback(null, "null")
                }
            }
        ])
    },

    "giftStatisticsFilterClickPurchased": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        Views.aggregate({ $match: { pageId: req.body.pageId } }, {
                $group: {
                    _id: updateData,
                    couponPurchased: { $sum: "$couponPurchased" }
                }
            },
            function(err, results) {
                if (req.body.dateFilter == 'yearly') {
                    console.log("yearly")
                    var data = results.filter(results => results._id.year == newYear)
                    results = data;
                    var array = [];
                    var flag = false;
                    for (var i = 1; i <= 12; i++) {
                        console.log("Dfdgf", i)
                        for (var j = 0; j < results.length; j++) {
                            if (i == results[j]._id.month) {

                                console.log("value of j==>", j)
                                flag = true;
                                break;
                            } else {
                                flag = false;
                            }
                        }
                        if (flag == true) {
                            array.push(results[j])
                        } else {
                            var data = {
                                _id: {
                                    year: 2017,
                                    month: i
                                },
                                couponPurchased: 0,
                            }
                            array.push(data)
                        }
                    }
                    res.send({
                        responseCode: 200,
                        responseMessage: i18n.__('Successfully'),
                        result: array
                    });
                }
                if (req.body.dateFilter == 'monthly') {
                    console.log("monthly", newMonth + 1)
                    var month = newMonth + 1;
                    var data = results.filter(results => results._id.year == newYear && results._id.month == month)
                    results = data;
                    res.send({
                        responseCode: 200,
                        responseMessage: i18n.__('Successfully'),
                        result: results
                    });
                }
                if (req.body.dateFilter == 'weekly') {
                    console.log("monthly", newMonth + 1)
                    var month = newMonth + 1;
                    var data = results.filter(results => results._id.year == newYear && results._id.month == month)
                    results = data;
                    res.send({
                        responseCode: 200,
                        responseMessage: i18n.__('Successfully'),
                        result: results
                    });
                }
            });
    },

    // show notification list api
    "notificationList": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        notificationList.findOne({
            userId: req.body.userId
        }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                res.send({
                    responseCode: 200,
                    responseMessage: i18n.__('Successfully'),
                    result: result
                });
            }

        })
    },

    // page filter api
    "pageFilter": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        var condition = { $or: [] };
        var obj = req.body;
        Object.getOwnPropertyNames(obj).forEach(function(key, idx, array) {
            if (key == 'subCategory') {
                var cond = { $or: [] };
                for (data in obj[key]) {
                    condition.$or.push({ subCategory: obj[key][data] })
                }
            } else {
                condition[key] = obj[key];
            }
        });
        if (condition.$or.length == 0) {
            delete condition.$or;
        }
        console.log("subCategory--->>", condition)
        createNewPage.find(condition).exec(function(err, result) {
            //   console.log("result--->>", result)
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: i18n.__("Result shown successfully")
                })
            }
        })
    },

    // show user's fav pages
    "userFavouratePages": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        User.findOne({ _id: req.body.userId }, 'pageFollowers', function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) {
                res.send({ responseCode: 404, responseMessage: "Data not found." })
            } else {
                User.populate(result, { path: 'pageFollowers.pageId', model: 'createNewPage' }, function(err, resultt) {
                    res.send({ result: resultt, responseCode: 200, responseMessage: i18n.__("Data found") })
                })
            }
        })
    },

    // show list of all category for pages
    "listOfCategory": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        var categoryList = ["Restaurant and Coffee Shop", "Fashion (Men-Women-Kids-Babies)", "Beauty & Health Care", "Fitness and Sports",
            "Traveling Agencies", "Cinemas", "Furniture", "Home", "Mobile and Computer Apps", "ToysforkidsandBabies", "Electronics and Technology",
            "Hotels and Apartments", "Medical", "Education", "Motors", "Hypermarkets", "Events", "Jewelry", "Arts and Design", "Pets", "Insurance",
            "Banks and Finance Companies", "Real Estate", "Books", "Business and Services", "Nightlife", "Construction", "Factories"
        ];
        res.send({
            result: categoryList,
            responseCode: 200,
            responseMessage: i18n.__("List of all category shown successfully")
        })
    },

    // show list of all sub category
    "subCategoryData": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        var matchData = req.body.subCat;
        res.send({
            responseCode: 200,
            responseMessage: i18n.__("Subcategory list"),
            result: subCategory[matchData]
        })
    },

    // search for winners api
    "winnerFilter": function(req, res) {
        console.log("winnerFilter-- request ->>>", JSON.stringify(req.body))
        i18n = new i18n_module(req.body.lang, configs.langFile);
        console.log("req body===>" + JSON.stringify(req.body))
        var arrayResults = [];
        var condition = { $and: [] };
        var arrayId = [];
        waterfall([
            function(callback) {
                var userId = req.params.id;
                console.log("userId--->>>", userId)
                User.find({ $or: [{ 'type': 'USER' }, { 'type': 'Advertiser' }], status: 'ACTIVE', isVerified: "TRUE" }).lean().exec(function(err, userResult1) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                        var blockedArray = [];
                        for (var i = 0; i < userResult1.length; i++) {
                            for (var j = 0; j < userResult1[i].blockUser.length; j++) {
                                if (userResult1[i].blockUser[j].toString() == userId) {
                                    blockedArray.push(userResult1[i]._id)
                                } else {
                                    console.log("flag------->>>>")
                                }
                            }
                        }
                        callback(null, blockedArray)
                        //console.log("flag------->>>>", JSON.stringify(blockedArray))
                    }
                })
            },

            function(blockedArray, callback) {
                Object.getOwnPropertyNames(req.body).forEach(function(key, idx, array) {
                    if (!(key == "couponStatus" || key == "cashStatus" || key == "firstName" || key == "lastName" || key == "type" || req.body[key] == "" || req.body[key] == undefined || key == "country" || key == "state" || key == "city" || key == "lang")) {
                        var cond = { $or: [] };
                        var tempCond = {};
                        if (key == "pageName") {
                            // for (data in req.body[key]) {
                            //     console.log("data",data)
                            //     cond.$or.push({ subCategory: req.body[key] })
                            // }
                            console.log("ssSSSSS", req.body[key])
                            var re = new RegExp(req.body[key], 'i');
                            console.log(re)
                            var data = { pageName: { $regex: re } }
                            //  condition.$and.push(data)({ subCategory: req.body[key] })
                            condition.$and.push(data)
                        }
                        // // else if(key == "pageName"){
                        //                        else if (key == "subCategory") {
                        //                            for (data in req.body[key]) {
                        //                                cond.$or.push({ subCategory: req.body[key][data] })
                        //                            }
                        //                            condition.$and.push(cond)
                        //                        }
                        else if (key == "subCategory") {
                            var re = new RegExp(req.body[key], 'i');
                            console.log(re)
                            var data = { subCategory: { $regex: re } }
                            //  condition.$and.push(data)({ subCategory: req.body[key] })
                            condition.$and.push(data)
                        }
                        // // }
                        else {

                            tempCond[key] = req.body[key];
                            condition.$and.push(tempCond)
                        }
                    }
                });
                if (condition.$and.length == 0) {
                    delete condition.$and;
                }
                var activeStatus = { userId: { $nin: blockedArray }, status: 'ACTIVE' }
                Object.assign(condition, activeStatus)
                createNewPage.find(condition, function(err, result) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) {
                        res.send({ responseCode: 404, responseMessage: 'Data not found' });
                    } else {
                        result.forEach(function(key) {
                            arrayId.push(String(key._id))
                        })
                        console.log("arrayId===>>", arrayId)
                        callback(null, arrayId, blockedArray)
                    }
                })
            },
            function(arrayId, blockedArray, callback) {
                if (req.body.type == 'coupon') {
                    if (!(arrayId.length == 0)) {
                        var query = { $and: [{ 'coupon.pageId': { $in: arrayId }, 'coupon.type': 'WINNER', _id: { $nin: blockedArray } }] };
                    } else {
                        var query = { $and: [{ 'coupon.type': 'WINNER', _id: { $nin: blockedArray } }] };
                    }

                    Object.getOwnPropertyNames(req.body).forEach(function(key, idx, array) {
                        if (!(key == "lang" || key == "pageName" || key == "category" || key == "subCategory" || key == 'cashStatus' || key == "type" || req.body[key] == "" || req.body[key] == undefined)) {
                            var queryOrData = { $or: [] };
                            var temporayCondData = {}
                            if (key == 'couponStatus') {
                                console.log("ddddddddD", req.body[key].length)
                                for (var i = 0; i < req.body[key].length; i++) {

                                    if (req.body[key].length == 1) {
                                        var queryOrData = { $or: [{ 'coupon.couponStatus': req.body[key][0] }] };
                                    } else if (req.body[key].length == 2) {
                                        var queryOrData = { $or: [{ 'coupon.couponStatus': req.body[key][0] }, { 'coupon.couponStatus': req.body[key][1] }] };
                                    } else if (req.body[key].length == 3) {
                                        var queryOrData = { $or: [{ 'coupon.couponStatus': req.body[key][0] }, { 'coupon.couponStatus': req.body[key][1] }, { 'coupon.couponStatus': req.body[key][2] }] };
                                    }
                                    console.log("queryOrData", queryOrData)
                                }
                                query.$and.push(queryOrData)
                            } else if (key == "firstName") {

                                var re = new RegExp(req.body[key], 'i');
                                var data = { firstName: { $regex: re } }
                                query.$and.push(data)
                            }
                            else if(key == "lastName")
                                 {

                                var re = new RegExp(req.body[key], 'i');
                                var data = { lastName: { $regex: re } }
                                query.$and.push(data)
                            }
                            else {
                                var temporayCond = {};
                                temporayCond[key] = req.body[key];
                                query.$and.push(temporayCond)
                            }
                        }
                    });
                    if (query.$and.length == 0) {
                        delete query.$and;
                    }
                    User.aggregate(
                        [
                            { $unwind: '$coupon' },
                            { $match: query }

                        ]
                    ).exec(function(err, Couponresults) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                            var count = Couponresults.length;
                            console.log("query====>>" + JSON.stringify(query))
                            var pageNumber = Number(req.params.pageNumber)
                            var limitData = pageNumber * 10;
                            var skips = limitData - 10;
                            var page = String(pageNumber);
                            var pages = Math.ceil(count / 10);
                            User.aggregate(
                                [
                                    { $unwind: '$coupon' },
                                    { $match: query },
                                    { $limit: limitData }, { $skip: skips }
                                ]
                            ).exec(function(err, results) {
                                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!results) {
                                    callback(null, "null")
                                } else {
                                    User.populate(results, { path: 'coupon.pageId', model: 'createNewPage', select: 'pageName adAdmin' }, function(err, resultt) {
                                        callback(null, results, arrayId, page, pages, limitData, count, blockedArray)
                                    })

                                }
                            })
                        }
                    })
                } else {
                    callback(null, [], arrayId, "null", "null", "null", "null", blockedArray)
                }

            },
            function(couponResults, arrayId, page, pages, limitData, count, blockedArray, callback) {
                if (req.body.type == 'cash') {
                    if (!(arrayId.length == 0)) {
                        var queryData = { $and: [{ 'cashPrize.pageId': { $in: arrayId }, 'cashPrize.status': 'ACTIVE', _id: { $nin: blockedArray } }] };
                    } else {
                        var queryData = { $and: [{ 'cashPrize.status': 'ACTIVE', _id: { $nin: blockedArray } }] };
                    }

                    Object.getOwnPropertyNames(req.body).forEach(function(key, idx, array) {
                        if (!(key == "lang" || key == "pageName" || key == "category" || key == "subCategory" || key == 'couponStatus' || key == "type" || req.body[key] == "" || req.body[key] == undefined)) {
                            //   queryOrData = { $or: [] };
                            var temporayCondData = {}
                            if (key == 'cashStatus') {
                                console.log("ddddddddD", req.body[key].length)

                                for (var i = 0; i <= 2; i++) {
                                    if (req.body[key].length == 1) {
                                        var queryOrData = { $or: [{ 'cashPrize.cashStatus': req.body[key][0] }] };
                                    } else if (req.body[key].length == 2) {
                                        var queryOrData = { $or: [{ 'cashPrize.cashStatus': req.body[key][0] }, { 'cashPrize.cashStatus': req.body[key][1] }] };
                                    }
                                }
                                queryData.$and.push(queryOrData)
                            } else if (key == "firstName") {
                                var re = new RegExp(req.body[key], 'i');
                                var data = { firstName: { $regex: re } }
                                queryData.$and.push(data)
                            }
                            else if(key == "lastName")
                                 {

                                var re = new RegExp(req.body[key], 'i');
                                var data = { lastName: { $regex: re } }
                                query.$and.push(data)
                            }else {
                                var temporayCond = {};
                                temporayCond[key] = req.body[key];
                                queryData.$and.push(temporayCond)
                            }
                        }
                    });
                    if (queryData.$and.length == 0) {
                        delete queryData.$and;
                    }
                    User.aggregate(
                        [
                            { $unwind: '$cashPrize' },
                            { $match: queryData }
                        ]
                    ).exec(function(err, Cashresults) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                            var countCash = Cashresults.length;
                            //console.log("Cashresults====>>"+JSON.stringify(Cashresults))
                            var pageNumber = Number(req.params.pageNumber)
                            var limitDataCash = pageNumber * 10;
                            var skips = limitDataCash - 10;
                            var pageCash = String(pageNumber);
                            var pagesCash = Math.ceil(countCash / 10);
                            User.aggregate(
                                [
                                    { $unwind: '$cashPrize' },
                                    { $match: queryData },
                                    { $limit: limitDataCash }, { $skip: skips }
                                ]
                            ).exec(function(err, resu) {
                                // console.log("resu====>>"+JSON.stringify(resu))
                                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                                    User.populate(resu, { path: 'cashPrize.pageId', model: 'createNewPage', select: 'pageName adAdmin' }, function(err, resultt) {
                                        callback(null, resu, pageCash, pagesCash, limitDataCash, countCash)
                                    })

                                }
                            })
                        }
                    })

                } else {
                    callback(null, couponResults, page, pages, limitData, count)
                }
            }
        ], function(err, result, page, pages, limitData, count) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) {
                res.send({ responseCode: 404, responseMessage: 'Data not found' });
            } else {
                var sortArray = result.sort(function(obj1, obj2) {
                    return obj2.coupon.updateddAt - obj1.coupon.updateddAt
                })
                res.send({
                    responseCode: 200,
                    responseMessage: i18n.__('success'),
                    docs: sortArray,
                    total: count,
                    limit: limitData,
                    page: page,
                    pages: pages
                });
            }
        })
    },

    // search filter for winners api
    "winnerSearchFilter": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        console.log("req body===>" + JSON.stringify(req.body))
        var arrayResults = [];
        var condition = { $and: [] };
        var arrayId = [];
        waterfall([
            function(callback) {
                var userId = req.params.id;
                User.find({ $or: [{ 'type': 'USER' }, { 'type': 'Advertiser' }], status: 'ACTIVE', isVerified: "TRUE" }).lean().exec(function(err, userResult1) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                        var blockedArray = [];
                        for (var i = 0; i < userResult1.length; i++) {
                            for (var j = 0; j < userResult1[i].blockUser.length; j++) {
                                if (userResult1[i].blockUser[j].toString() == userId) {
                                    blockedArray.push(userResult1[i]._id)
                                } else {
                                    console.log("flag------->>>>")
                                }
                            }
                        }
                        callback(null, blockedArray)
                        console.log("blockedArray------->>>>", JSON.stringify(blockedArray))
                    }
                })
            },

            function(blockedArray, callback) {
                if (req.body.type == 'coupon') {
                    var query = { $and: [{ 'coupon.pageId': req.body.pageId, 'coupon.type': 'WINNER' }] };
                    Object.getOwnPropertyNames(req.body).forEach(function(key, idx, array) {
                        if (!(key == 'lang' || key == 'cashStatus' || key == "type" || req.body[key] == "" || req.body[key] == undefined || key == 'pageId')) {
                            var queryOrData = { $or: [] };
                            var temporayCondData = {}
                            if (key == 'couponStatus') {
                                //     console.log("ddddddddD", req.body[key].length)
                                for (var i = 0; i < req.body[key].length; i++) {
                                    if (req.body[key].length == 1) {
                                        var queryOrData = { $or: [{ 'coupon.couponStatus': req.body[key][0] }] };
                                    } else if (req.body[key].length == 2) {
                                        var queryOrData = { $or: [{ 'coupon.couponStatus': req.body[key][0] }, { 'coupon.couponStatus': req.body[key][1] }] };
                                    } else if (req.body[key].length == 3) {
                                        var queryOrData = { $or: [{ 'coupon.couponStatus': req.body[key][0] }, { 'coupon.couponStatus': req.body[key][1] }, { 'coupon.couponStatus': req.body[key][2] }] };
                                    }
                                    console.log("queryOrData", queryOrData)
                                }
                                query.$and.push(queryOrData)
                            } else if (key == "firstName") {
                                //     console.log("ssSSSSS", req.body[key])
                                var re = new RegExp(req.body[key], 'i');
                                console.log(re)
                                var data = { firstName: { $regex: re } }
                                query.$and.push(data)
                            } 
                            else if (key == "lastName") {
                                //     console.log("ssSSSSS", req.body[key])
                                var re = new RegExp(req.body[key], 'i');
                                console.log(re)
                                var data = { lastName: { $regex: re } }
                                query.$and.push(data)
                            }else {
                                var temporayCond = {};
                                temporayCond[key] = req.body[key];
                                query.$and.push(temporayCond)
                            }
                        }
                    });

                    if (query.$and.length == 0) {
                        delete query.$and;
                    }
                    var activeStatus = { _id: { $nin: blockedArray }, status: 'ACTIVE' }
                    Object.assign(query, activeStatus)
                    //   console.log("query-->>>",query)
                    // , _id: { $nin: blockedArray }
                    User.aggregate([{ $unwind: '$coupon' }, { $match: query }]).exec(function(err, Couponresults) {
                        console.log("Couponresults-->>>", Couponresults)
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                            var count = Couponresults.length;
                            //     console.log("query====>>" + JSON.stringify(query))
                            var pageNumber = Number(req.params.pageNumber)
                            var limitData = pageNumber * 10;
                            var skips = limitData - 10;
                            var page = String(pageNumber);
                            var pages = Math.ceil(count / 10);
                            User.aggregate([{ $unwind: '$coupon' }, { $match: query }, { $limit: limitData }, { $skip: skips }, { $sort: { 'coupon.updatedAt': -1 } }]).exec(function(err, results) {
                                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!results) {
                                    callback(null, "null")
                                } else {
                                    callback(null, results, arrayId, page, pages, limitData, count, blockedArray)
                                }
                            })
                        }
                    })
                } else {
                    callback(null, [], arrayId, "null", "null", "null", "null", blockedArray)
                }

            },
            function(couponResults, arrayId, page, pages, limitData, count, blockedArray, callback) {
                if (req.body.type == 'cash') {
                    var queryData = { $and: [{ 'cashPrize.pageId': req.body.pageId }] };
                    // if (!(arrayId.length == 0)) {
                    //     var queryData = { $and: [{ 'cashPrize.pageId': { $in: arrayId } }] };
                    // } else {
                    //     var queryData = { $and: [] };
                    // }
                    Object.getOwnPropertyNames(req.body).forEach(function(key, idx, array) {
                        if (!(key == 'lang' || key == 'couponStatus' || key == "type" || req.body[key] == "" || req.body[key] == undefined || key == 'pageId')) {
                            //   queryOrData = { $or: [] };
                            var temporayCondData = {}
                            if (key == 'cashStatus') {
                                console.log("ddddddddD", req.body[key].length)
                                for (var i = 0; i <= 2; i++) {
                                    if (req.body[key].length == 1) {
                                        var queryOrData = { $or: [{ 'cashPrize.cashStatus': req.body[key][0] }] };
                                    } else if (req.body[key].length == 2) {
                                        var queryOrData = { $or: [{ 'cashPrize.cashStatus': req.body[key][0] }, { 'cashPrize.cashStatus': req.body[key][1] }] };
                                    }
                                }
                                queryData.$and.push(queryOrData)
                            } else {
                                var temporayCond = {};
                                temporayCond[key] = req.body[key];
                                queryData.$and.push(temporayCond)
                            }
                        }
                    });
                    if (queryData.$and.length == 0) {
                        delete queryData.$and;
                    }
                    var activeStatus = { _id: { $nin: blockedArray }, status: 'ACTIVE' }
                    Object.assign(queryData, activeStatus)
                    // console.log("queryData-->>>",queryData)
                    console.log("queryData====>>" + JSON.stringify(queryData))
                    User.aggregate(
                        [
                            { $unwind: '$cashPrize' },
                            { $match: queryData }
                        ]
                    ).exec(function(err, Cashresults) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                            var countCash = Cashresults.length;
                            var pageNumber = Number(req.params.pageNumber)
                            var limitDataCash = pageNumber * 10;
                            var skips = limitDataCash - 10;
                            var pageCash = String(pageNumber);
                            var pagesCash = Math.ceil(countCash / 10);
                            User.aggregate(
                                [
                                    { $unwind: '$cashPrize' },
                                    { $match: queryData },
                                    { $limit: limitDataCash }, { $skip: skips },
                                    { $sort: { 'cashPrize.updatedAt': -1 } }
                                ]
                            ).exec(function(err, resu) {
                                // console.log("resu====>>"+JSON.stringify(resu))
                                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                                    callback(null, resu, pageCash, pagesCash, limitDataCash, countCash)
                                }
                            })
                        }
                    })

                } else {
                    callback(null, couponResults, page, pages, limitData, count)
                }

            }
        ], function(err, result, page, pages, limitData, count) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) {
                res.send({ responseCode: 404, responseMessage: 'Data not found' });
            } else {
                var sortArray = result.sort(function(obj1, obj2) {
                    return obj2.coupon.updateddAt - obj1.coupon.updateddAt
                })

                res.send({
                    responseCode: 200,
                    responseMessage: i18n.__('success'),
                    docs: sortArray,
                    total: count,
                    limit: limitData,
                    page: page,
                    pages: pages
                });
            }
        })
    },

    // show list of particular page followers
    "pageFollowersList": function(req, res) {
        i18n = new i18n_module(req.params.lang, configs.langFile);
        createNewPage.find({ _id: req.params.id }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: 'Please enter correct page id' }); } else {
                var userArray = [];
                for (var i = 0; i < result[0].pageFollowersUser.length; i++) {
                    userArray.push(result[0].pageFollowersUser[i].userId)
                }
                User.find({ _id: { $in: userArray } }).exec(function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (result1.length == 0) { res.send({ responseCode: 400, responseMessage: "No follower found" }); } else {
                        res.send({
                            result: result1,
                            responseCode: 200,
                            responseMessage: i18n.__("successfully shown the result")
                        })
                    }
                })
            }
        })
    },

    // show list of winners on coupon inbox tab
    "CouponInboxWinners": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        var pageId = req.params.id;
        var userId = req.body.userId;
        User.find({ $or: [{ 'type': 'USER' }, { 'type': 'Advertiser' }], status: 'ACTIVE', isVerified: "TRUE" }).lean().exec(function(err, userResult1) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                var blockedArray = [];
                for (var i = 0; i < userResult1.length; i++) {
                    for (var j = 0; j < userResult1[i].blockUser.length; j++) {
                        if (userResult1[i].blockUser[j].toString() == userId) {
                            blockedArray.push(userResult1[i]._id)
                        } else {
                            console.log("flag------->>>>")
                        }
                    }
                }

                User.aggregate({ $unwind: '$coupon' }, { $match: { 'coupon.pageId': pageId, 'coupon.couponStatus': 'USED', _id: { $nin: blockedArray } } }, function(err, result) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: 'Please enter correct page id' }); } else if (result.length == 0) { res.send({ responseCode: 400, responseMessage: 'No winner found' }); } else {
                        //    console.log("CouponInboxWinners--->>>",JSON.stringify(result))
                        var sortArray = result.sort(function(obj1, obj2) {
                            return obj2.coupon.updateddAt - obj1.coupon.updateddAt
                        })

                        res.send({
                            result: sortArray,
                            responseCode: 200,
                            responseMessage: i18n.__("All request show successfully")
                        })
                    }
                })
            }
        })

    },

    // view hidden code of coupon
    "viewCouponCode": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        console.log("view coupon code request--->>>", req.body)
        var adId = req.body.adId;
        var userId = req.body.userId;
        console.log("adId--->>>", adId)
        console.log("userId--->>>", userId) // new mongoose.Types.ObjectId(userId)        
        User.aggregate({ $unwind: "$hiddenGifts" }, { $match: { 'hiddenGifts.adId': adId, _id: new mongoose.Types.ObjectId(userId) } }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 400, responseMessage: 'No gift found' }) } else {
                //    console.log("view coupon code --->>>",JSON.stringify(result))
                var code = result[0].hiddenGifts.hiddenCode;
                console.log("viewCouponCode-0-0-0-0-0--->>>", code)
                //   console.log("code-->>", code)
                res.send({
                    result: code,
                    responseCode: 200,
                    responseMessage: i18n.__('Coupon code shown successfully')
                })
            }
        })
    },

    // page coupon inbox filter date basis
    "couponInboxDateFilter": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        if (!req.body.startDate && !req.body.endDate) { res.send({ responseCode: 400, responseMessage: "Please enter atleast startDate or endDate" }); } else if (!req.body.pageId) { res.send({ responseCode: 400, responseMessage: "Please enter pageId" }); } else {
            var pageId = req.body.pageId;
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
            console.log("dta===>>", data)
            var userId = req.params.id;
            User.find({ $or: [{ 'type': 'USER' }, { 'type': 'Advertiser' }], status: 'ACTIVE', isVerified: "TRUE" }).lean().exec(function(err, userResult1) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                    var blockedArray = [];
                    for (var i = 0; i < userResult1.length; i++) {
                        for (var j = 0; j < userResult1[i].blockUser.length; j++) {
                            if (userResult1[i].blockUser[j].toString() == userId) {
                                blockedArray.push(userResult1[i]._id)
                            } else {
                                console.log("flag------->>>>")
                            }
                        }
                    }

                    User.aggregate({ $unwind: "$coupon" }, { $match: { 'coupon.pageId': pageId, 'coupon.couponStatus': 'USED', 'coupon.updateddAt': data, _id: { $nin: blockedArray } } }).exec(function(err, result) {
                        console.log("2")
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 22' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "Please enter correct pageId" }); } else if (result.length == 0) { res.send({ responseCode: 400, responseMessage: "No coupon winner found" }); } else {
                            res.send({
                                result: result,
                                responseCode: 200,
                                responseMessage: i18n.__("All coupon winner shown successfully")
                            })
                        }
                    })


                }
            })
        }
    },

    // blocked pages search api
    "blockedPagesSearch": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        createNewPage.find({ status: 'BLOCK' }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No page found" }); } else {
                var blockPagesArray = [];
                for (var i = 0; i < result.length; i++) {
                    console.log(typeof(result[i]._id))
                    blockPagesArray.push(String(result[i]._id))
                }
                console.log("blockPagesArray-->>", blockPagesArray)
                var re = new RegExp(req.body.search, 'i');
                createNewPage.paginate({ $and: [{ _id: { $in: blockPagesArray } }, { 'pageName': { $regex: re } }] }, { pageNumber: req.params.pageNumber, limit: 8, sort: { createdAt: -1 } },
                    function(err, result1) {
                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result1.docs.length == 0) { res.send({ responseCode: 404, responseMessage: 'No result found.' }); } else {
                            res.send({ result: result1, responseCode: 200, responseMessage: i18n.__("Show pages successfully.") });
                        }
                    })
            }
        })
    },

    // search user's fav page api
    "searchFavouitePages": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        User.find({ _id: req.params.id }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "Please enter correct user id" }); } else {
                var FavouitePages = [];
                for (var i = 0; i < result[0].pageFollowers.length; i++) {
                    console.log("data-->", result[0].pageFollowers.length, i)
                    FavouitePages.push(result[0].pageFollowers[i].pageId)
                }
                console.log("FavouitePages-->>", FavouitePages)
                var re = new RegExp(req.body.search, 'i');
                createNewPage.paginate({ $and: [{ _id: { $in: FavouitePages } }, { 'pageName': { $regex: re } }] }, { pageNumber: req.params.pageNumber, limit: 8, sort: { createdAt: -1 } }, function(err, result1) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result1.length == 0) { res.send({ responseCode: 404, responseMessage: 'No result found' }); } else {
                        res.send({ result: result1, responseCode: 200, responseMessage: i18n.__("Show pages successfully") });
                    }
                })
            }
        })
    },

    // review on page api
    "reviewOnPage": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        var adds = new addsComments(req.body);
        adds.save(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                createNewPage.findOneAndUpdate({ _id: req.body.pageId }, { $inc: { commentCount: +1 } }, { new: true }).exec(function(err, results) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                        addsComments.populate(result, { path: 'userId reply.userId', model: 'brolixUser', select: 'image firstName lastName' }, function(err, finalResult) {
                            addsComments.populate(result, { path: 'pageId', model: 'createNewPage', select: 'pageName pageImage userId adAdmin' }, function(err, finalResult) {
                                res.send({
                                    result: result,
                                    responseCode: 200,
                                    responseMessage: i18n.__("Review save with concerned User details")
                                });
                            })
                        })


                    }
                })
            }
        })
    },

    //API Comment on Ads
    "replyOnReview": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        addsComments.findOneAndUpdate({ pageId: req.body.pageId, _id: req.body.commentId }, {
            $push: { 'reply': { userId: req.body.userId, replyComment: req.body.replyComment, userName: req.body.userName, userImage: req.body.userImage } }
        }, { new: true }).exec(function(err, results) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                addsComments.populate(results, { path: 'userId reply.userId', model: 'brolixUser', select: 'image firstName lastName' }, function(err, finalResult) {
                    addsComments.populate(results, { path: 'pageId', model: 'createNewPage', select: 'pageName pageImage userId adAdmin' }, function(err, finalResult) {
                        res.send({
                            result: results,
                            responseCode: 200,
                            responseMessage: i18n.__("Review save successfully")
                        });
                    })
                })

            }
        })
    },

    // review comments lsit api
    "reviewCommentList": function(req, res) {
        i18n = new i18n_module(req.params.lang, configs.langFile);
        addsComments.paginate({ pageId: req.params.id, "status": "ACTIVE" }, { page: req.params.pageNumber, limit: 10, sort: { createdAt: -1 } }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                for (var i = 0; i < result.docs.length; i++) {
                    var reply = result.docs[i].reply;
                    var data = reply.filter(reply => reply.status == 'ACTIVE');
                    //    console.log("data--->>" + data)
                    result.docs[i].reply = data;
                }
               //   console.log("adsCommentList---->>>",JSON.stringify(result))
                addsComments.populate(result.docs, { path: 'userId reply.userId', model: 'brolixUser', select: 'image firstName lastName' }, function(err, finalResult) {
                    addsComments.populate(result.docs, { path: 'pageId', model: 'createNewPage', select: 'pageName pageImage userId adAdmin' }, function(err, finalResult) {
                        //    console.log("adsCommentList--22-->>>",JSON.stringify(finalResult))
                        res.send({
                            result: result,
                            responseCode: 200,
                            responseMessage: i18n.__("Review List")
                        })
                    })
                })

            }
        })
    },

    // delete comments on page api
    "deleteCommentsOnPage": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        if (req.body.type == 'comment') {
            var pageQuery = { pageId: req.body.pageId, _id: req.body.commentId }
            var setCondition = { status: 'INACTIVE' }
        } else {
            var pageQuery = { pageId: req.body.pageId, _id: req.body.commentId, 'reply._id': req.body.replyId }
            var setCondition = { 'reply.$.status': 'INACTIVE' }
        }

        addsComments.findOneAndUpdate(pageQuery, setCondition, { new: true }).exec(function(err, results) {
            i18n = new i18n_module(req.body.lang, configs.langFile);
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (results == null || results == undefined) {
                res.send({ responseCode: 409, responseMessage: 'Something went wrong' });
            } else {
                if (req.body.type == 'comment') {
                    createNewPage.findOneAndUpdate({ _id: req.body.pageId }, { $inc: { commentCount: -1 } }, { new: true }).exec(function(err, resul) {
                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                            res.send({
                                result: results,
                                responseCode: 200,
                                responseMessage: i18n.__("Comment deleted successfully")
                            });
                        }
                    })
                } else {
                    res.send({
                        result: results,
                        responseCode: 200,
                        responseMessage: i18n.__("Comment deleted successfully")
                    });
                }
            }
        })
    },

    // api for edit comments on pages
    "editCommentsonPage": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        if (req.body.type == 'comment') {
            var pageQuery = { pageId: req.body.pageId, _id: req.body.commentId }
            var setCondition = { comment: req.body.comment }
        } else {
            var pageQuery = { pageId: req.body.pageId, _id: req.body.commentId, 'reply._id': req.body.replyId }
            var setCondition = { 'reply.$.replyComment': req.body.replyComment }
        }
        addsComments.findOneAndUpdate(pageQuery, setCondition, { new: true }).exec(function(err, results) {
            i18n = new i18n_module(req.body.lang, configs.langFile);
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (results == null || results == undefined) {
                res.send({ responseCode: 409, responseMessage: 'Something went wrong' });
            } else {
                res.send({
                    result: results,
                    responseCode: 200,
                    responseMessage: i18n.__("Comment edited successfully")
                });
            }
        })
    },

    //  send coupon to advertiser api
    "sendCouponToAdvertiser": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        console.log("sendCouponToAdvertiser--->>>", JSON.stringify(req.body))
        var couponId = req.body.couponId;
        var adId = req.body.adId;
        if (!couponId) { res.send({ responseCode: 400, responseMessage: "Please enter the couponId" }); } else if (!adId) { res.send({ responseCode: 400, responseMessage: 'Please enter the adId' }); } else {
            User.aggregate({ $unwind: '$coupon' }, { $match: { 'coupon._id': new mongoose.Types.ObjectId(couponId) } }, function(err, user) {
                //    console.log("sendCouponToAdvertiser--->>>",JSON.stringify(user))
                console.log("sendCouponToAdvertiser--->>>", (user[0].coupon.status))
                if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (user.length == 0) { res.send({ responseCode: 404, responseMessage: "No user found" }); } else if ((user[0].coupon.status) != "ACTIVE") { res.send({ responseCode: 400, responseMessage: i18n.__("Please enter a valid coupon to use.") }); } else if ((user[0].coupon.status) != "ACTIVE") { res.send({ responseCode: 400, responseMessage: i18n.__("Please enter a valid coupon to use.") }); } else if ((user[0].coupon.couponStatus) != "VALID") { res.send({ responseCode: 400, responseMessage: i18n.__("Please enter a valid coupon to use.") }); } else {
                    var id = user[0]._id;
                    console.log("id----user---->>", id)
                    User.update({ 'coupon._id': new mongoose.Types.ObjectId(couponId) }, { $set: { 'coupon.$.couponStatus': "USED", 'coupon.$.usedCouponDate': Date.now() } }, { new: true }, function(err, result1) {
                        if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else {

                            User.aggregate({ $unwind: "$hiddenGifts" }, { $match: { 'hiddenGifts.adId': adId, _id: new mongoose.Types.ObjectId(id) } }).exec(function(err, user) {
                                //  User.findOne({ 'hiddenGifts.adId': adId }, function(err, user) {
                                if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (user.length == 0) { res.send({ responseCode: 200, responseMessage: i18n.__("Coupon successfully sent to advertiser page.") }); } else {
                                    console.log("$hiddenGifts----->>>>", JSON.stringify(user))
                                    var mobileNumber = user[0].mobileNumber;
                                    var code = user[0].hiddenGifts.hiddenCode;
                                    console.log("mobileNumber----->>>>", mobileNumber)
                                    console.log("code----->>>>", code)
                                    //                                    for (var i = 0; i < user.hiddenGifts.length; i++) {
                                    //                                        if (user.hiddenGifts[i].adId == adId) {
                                    //                                            
                                    //                                        }
                                    //                                    }
                                    User.update({ 'hiddenGifts.hiddenCode': code }, { $set: { 'hiddenGifts.$.status': "USED" } }, { new: true }, function(err, result2) {
                                        if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else {
                                            console.log("mobile---->>>>", mobileNumber)
                                            // console.log("result2--->>", result2)
                                            //    console.log("code--->>", code)
                                            var message = 'Your hidden gift is:' + code
                                            if (result2.nModified == 1) {
                                                if (mobileNumber) {
                                                    functions.otp(req.body.mobileNumber, message)
                                                }
                                                res.send({
                                                    responseCode: 200,
                                                    responseMessage: i18n.__("The hidden gift code has been sent to your mailbox successfully")
                                                })

                                            } else {
                                                res.send({
                                                    responseCode: 200,
                                                    responseMessage: i18n.__("Coupon successfully sent to advertiser page")
                                                })

                                            }
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    },

    // api for create ad payment
    "createAdPayment": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        User.findOne({ _id: req.body.userId }).exec(function(err, user) {
            if (err) { res.send({ responseCode: 500, responseMessage: i18n.__("Internal server error") }); } else if (!user) { res.send({ responseCode: 404, responseMessage: i18n.__("User not found.") }); } else {
                //   console.log("user", user)
                if (req.body.paymentMode == 'paypal' || req.body.paymentMode == 'payWithWallet') {
                    waterfall([
                        function(callback) {
                            if (req.body.paymentMode == 'paypal') {
                                var cashAmount = user.cash - req.body.brolixAmount;
                            } else if (req.body.paymentMode == 'payWithWallet') {
                                var cashAmount = user.cash - req.body.amount;
                            }

                            User.findOneAndUpdate({ _id: req.body.userId }, { $set: { cash: cashAmount } }, { new: true }).exec(function(err, result) {
                                if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "Something went wrong." }); } else {
                                    callback(null, "null")
                                }
                            })
                        },
                        function(nullResult, callback) {
                            if (req.body.paymentMode == 'paypal') {
                                var details = {
                                    paymentMode: req.body.paymentMode,
                                    userId: req.body.userId,
                                    amount: req.body.amount,
                                    paymentAmount: req.body.paymentAmount,
                                    brolixAmount: req.body.brolixAmount,
                                    transcationId: req.body.transcationId,
                                    Type: req.body.Type,
                                    dates: req.body.date
                                }
                            } else if (req.body.paymentMode == 'payWithWallet') {
                                var details = {
                                    paymentMode: req.body.paymentMode,
                                    userId: req.body.userId,
                                    amount: req.body.amount,
                                    transcationId: "brolixAccount",
                                    Type: req.body.Type,
                                    dates: req.body.date
                                }
                            }

                            var payment = new Payment(details);
                            payment.save(function(err, paymentResult) {
                                if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!paymentResult) { res.send({ responseCode: 404, responseMessage: "Something went wrong" }); } else {
                                    callback(null, paymentResult)
                                }
                            })
                        }
                    ], function(err, result) {
                        if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "Something went wrong." }); } else {
                            res.send({ responseCode: 200, responseMessage: i18n.__("Ad created successfully") });
                        }
                    })
                } else {
                    waterfall([
                        function(callback) {
                            paytabs.ValidateSecretKey("sakshigadia@gmail.com", "jwjn4lgU2sZqPqsB2Da3zNJIJwaUX8mgFGDJ2UE5nEvc4XO7BYaaMTSwq3qncNDRthAvbeAyT6LX3z4EyfPk8HQzLhWX4AOyRp42", function(response) {
                                console.log(response);
                                if (response.result == 'valid') {
                                    callback(null, response)
                                } else {
                                    res.send({
                                        responseCode: 404,
                                        responseMessage: "Internal server error"
                                    })
                                }
                            });
                        },
                        function(result, callback) {
                            if (user.country == 'United Arab Emirates') {
                                var state = 'UAE'
                                var country_shipping = "ARE"
                            } else if (user.country == 'Jordan') {
                                var state = 'Jordan'
                                var country_shipping = "JOR"
                            } else {
                                res.send({
                                    responseCode: 404,
                                    responseMessage: i18n.__("User can pay only for country UAE and Jordan")
                                })
                            }

                            var createPayPage = new Object()
                            createPayPage.merchant_email = 'sakshigadia@gmail.com';
                            createPayPage.paytabs_url = 'https://www.paytabs.com/apiv2/';
                            createPayPage.secret_key = "jwjn4lgU2sZqPqsB2Da3zNJIJwaUX8mgFGDJ2UE5nEvc4XO7BYaaMTSwq3qncNDRthAvbeAyT6LX3z4EyfPk8HQzLhWX4AOyRp42";
                            createPayPage.site_url = "http://ec2-52-76-162-65.ap-southeast-1.compute.amazonaws.com:8082";
                            createPayPage.return_url = 'http://ec2-52-76-162-65.ap-southeast-1.compute.amazonaws.com:8082/page/redirectpage/' + 200 + '/' + "Success" + '';
                            createPayPage.title = "Brolix";
                            createPayPage.cc_first_name = user.firstName;
                            createPayPage.cc_last_name = user.lastName;
                            createPayPage.cc_phone_number = user.mobileNumber;
                            createPayPage.phone_number = user.mobileNumber;
                            createPayPage.email = user.email;
                            createPayPage.products_per_title = "Payment";
                            createPayPage.unit_price = req.body.amount;
                            createPayPage.quantity = "1";
                            createPayPage.other_charges = 0;
                            createPayPage.amount = req.body.amount;
                            createPayPage.discount = 0;
                            createPayPage.currency = "USD"; //EUR JOD
                            createPayPage.reference_no = "21873109128";
                            createPayPage.ip_customer = "192.168.1.1";
                            createPayPage.ip_merchant = "192.168.1.1";
                            createPayPage.billing_address = "ydh";
                            createPayPage.state = state;
                            createPayPage.city = user.city;
                            createPayPage.postal_code = '110020';
                            createPayPage.country = country_shipping;
                            createPayPage.shipping_first_name = user.firstName;
                            createPayPage.shipping_last_name = user.lastName;
                            createPayPage.address_shipping = "Flat";
                            createPayPage.city_shipping = user.city;
                            createPayPage.state_shipping = state;
                            createPayPage.postal_code_shipping = '110020';
                            createPayPage.country_shipping = country_shipping; //JOR ARE
                            createPayPage.msg_lang = "English";
                            createPayPage.cms_with_version = "1.0.0";
                            paytabs.CreatePayPage(createPayPage, function(response) {
                                console.log(response)
                                if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!(response.response_code == "4012")) {
                                    res.send({ responseCode: 404, responseMessage: "User details are invalid" });
                                } else {
                                    var obj = {
                                        userId: req.body.userId,
                                        paymentMode: req.body.paymentMode,
                                        amount: req.body.amount,
                                        userCashAmount: user.cash,
                                        paymentAmount: req.body.paymentAmount,
                                        brolixAmount: req.body.brolixAmount,
                                        Type: req.body.Type,
                                        pid: response.p_id,
                                        dates: req.body.date
                                    };
                                    // myCache.del( "myKey", function( err, count ){
                                    //   if( !err ){
                                    //     console.log( count );                              
                                    //   }
                                    // })

                                    myCache.set("myKeys", obj, 10000);
                                    var value = myCache.get("myKeys");
                                    console.log("value", value)
                                    var objData = {
                                        userId: req.body.userId,
                                        paymentMode: req.body.paymentMode,
                                        amount: req.body.amount,
                                        userCashAmount: user.cash,
                                        paymentAmount: req.body.paymentAmount,
                                        brolixAmount: req.body.brolixAmount,
                                        Type: req.body.Type,
                                        pid: response.p_id,
                                        dates: req.body.date,
                                        payment_url: response.payment_url
                                    };

                                    res.send({
                                        responseCode: 200,
                                        responseMessage: "Payment url",
                                        result: objData
                                    })
                                }
                            });
                        }
                    ])
                }
            }
        })
    },

    // api for create page payment
    "createPagePayment": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        console.log("req body on create page===>>", JSON.stringify(req.body))

        User.findOne({ _id: req.body.userId }).exec(function(err, user) {
            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!user) { res.send({ responseCode: 404, responseMessage: "User not found." }); } else {
                console.log("user", user)
                if (req.body.paymentMode == 'paypal' || req.body.paymentMode == 'payWithWallet') {
                    waterfall([
                        function(callback) {
                            if (req.body.paymentMode == 'paypal') {
                                var cashAmount = user.cash - req.body.brolixAmount;
                            } else if (req.body.paymentMode == 'payWithWallet') {
                                var cashAmount = user.cash - req.body.amount;
                            }

                            User.findOneAndUpdate({ _id: req.body.userId }, { $set: { cash: cashAmount } }, { new: true }).exec(function(err, result) {
                                if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "Something went wrong" }); } else {
                                    callback(null, "null")
                                }
                            })

                        },
                        function(nullResult, callback) {
                            if (req.body.paymentMode == 'paypal') {
                                var details = {
                                    paymentMode: req.body.paymentMode,
                                    userId: req.body.userId,
                                    amount: req.body.amount,
                                    paymentAmount: req.body.paymentAmount,
                                    brolixAmount: req.body.brolixAmount,
                                    transcationId: req.body.transcationId,
                                    Type: req.body.Type,
                                    dates: req.body.date
                                }
                            } else if (req.body.paymentMode == 'payWithWallet') {
                                var details = {
                                    paymentMode: req.body.paymentMode,
                                    userId: req.body.userId,
                                    amount: req.body.amount,
                                    transcationId: "brolixAccount",
                                    Type: req.body.Type,
                                    dates: req.body.date
                                }
                            }

                            var payment = new Payment(details);
                            payment.save(function(err, paymentResult) {
                                if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!paymentResult) { res.send({ responseCode: 404, responseMessage: "Something went wrong" }); } else {
                                    callback(null, paymentResult)
                                }
                            })
                        },
                        function(paymentResult, callback) {
                            adminCards.findOne({
                                type: "upgrade_card",
                                price: req.body.amount
                            }, function(err, cardRes) {
                                if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!cardRes) { res.send({ responseCode: 404, responseMessage: "No cards available" }); } else {
                                    callback(null, cardRes)
                                }
                            })
                        },
                        function(cardRes, callback) {
                            var card_viewers = cardRes.viewers;
                            var data = {
                                cash: req.body.amount,
                                viewers: card_viewers,
                                type: "SENDBYADMIN"
                            }
                            User.findByIdAndUpdate({ _id: req.body.userId }, { $push: { upgradeCardObject: data } }, function(err, userRes) {
                                if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!userRes) { res.send({ responseCode: 404, responseMessage: "Something went wrong" }); } else {
                                    callback(null, userRes)
                                }
                            })
                        }
                    ], function(err, result) {
                        if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "Something went wrong" }); } else {
                            res.send({ responseCode: 200, responseMessage: i18n.__("Payment done successfully") });
                        }
                    })
                } else {
                    waterfall([
                        function(callback) {
                            paytabs.ValidateSecretKey("sakshigadia@gmail.com", "jwjn4lgU2sZqPqsB2Da3zNJIJwaUX8mgFGDJ2UE5nEvc4XO7BYaaMTSwq3qncNDRthAvbeAyT6LX3z4EyfPk8HQzLhWX4AOyRp42", function(response) {
                                console.log(response);
                                if (response.result == 'valid') {
                                    callback(null, response)
                                } else {
                                    res.send({
                                        responseCode: 404,
                                        responseMessage: "Internal server error"
                                    })
                                }
                            });
                        },
                        function(result, callback) {
                            if (user.country == 'United Arab Emirates') {
                                var state = 'UAE'
                                var country_shipping = "ARE"
                            } else if (user.country == 'Jordan') {
                                var state = 'Jordan'
                                var country_shipping = "JOR"
                            } else {
                                res.send({
                                    responseCode: 404,
                                    responseMessage: i18n.__("User can pay only for country UAE and Jordan.")
                                })
                            }

                            var createPayPage = new Object()
                            createPayPage.merchant_email = 'sakshigadia@gmail.com';
                            createPayPage.paytabs_url = 'https://www.paytabs.com/apiv2/';
                            createPayPage.secret_key = "jwjn4lgU2sZqPqsB2Da3zNJIJwaUX8mgFGDJ2UE5nEvc4XO7BYaaMTSwq3qncNDRthAvbeAyT6LX3z4EyfPk8HQzLhWX4AOyRp42";
                            createPayPage.site_url = "http://ec2-52-76-162-65.ap-southeast-1.compute.amazonaws.com:8082";
                            createPayPage.return_url = 'http://ec2-52-76-162-65.ap-southeast-1.compute.amazonaws.com:8082/page/redirectpage/' + 200 + '/' + "Success" + '';
                            createPayPage.title = "Brolix";
                            createPayPage.cc_first_name = user.firstName;
                            createPayPage.cc_last_name = user.lastName;
                            createPayPage.cc_phone_number = user.mobileNumber;
                            createPayPage.phone_number = user.mobileNumber;
                            createPayPage.email = user.email;
                            createPayPage.products_per_title = "Payment";
                            createPayPage.unit_price = req.body.amount;
                            createPayPage.quantity = "1";
                            createPayPage.other_charges = 0;
                            createPayPage.amount = req.body.amount;
                            createPayPage.discount = 0;
                            createPayPage.currency = "USD"; //EUR JOD
                            createPayPage.reference_no = "21873109128";
                            createPayPage.ip_customer = "192.168.1.1";
                            createPayPage.ip_merchant = "192.168.1.1";
                            createPayPage.billing_address = "ydh";
                            createPayPage.state = state;
                            createPayPage.city = user.city;
                            createPayPage.postal_code = '110020';
                            createPayPage.country = country_shipping;
                            createPayPage.shipping_first_name = user.firstName;
                            createPayPage.shipping_last_name = user.lastName;
                            createPayPage.address_shipping = "Flat";
                            createPayPage.city_shipping = user.city;
                            createPayPage.state_shipping = state;
                            createPayPage.postal_code_shipping = '110020';
                            createPayPage.country_shipping = country_shipping; //JOR ARE
                            createPayPage.msg_lang = "English";
                            createPayPage.cms_with_version = "1.0.0";
                            paytabs.CreatePayPage(createPayPage, function(response) {
                                console.log(response)
                                if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!(response.response_code == "4012")) {
                                    res.send({ responseCode: 404, responseMessage: "User details are invalid" });
                                } else {
                                    var obj = {
                                        userId: req.body.userId,
                                        paymentMode: req.body.paymentMode,
                                        amount: req.body.amount,
                                        userCashAmount: user.cash,
                                        paymentAmount: req.body.paymentAmount,
                                        brolixAmount: req.body.brolixAmount,
                                        Type: req.body.Type,
                                        pid: response.p_id,
                                        dates: req.body.date
                                    };
                                    myCache.set("myKey", obj, 10000);
                                    var value = myCache.get("myKey");
                                    console.log("value", value)

                                    var objData = {
                                        userId: req.body.userId,
                                        paymentMode: req.body.paymentMode,
                                        amount: req.body.amount,
                                        userCashAmount: user.cash,
                                        paymentAmount: req.body.paymentAmount,
                                        brolixAmount: req.body.brolixAmount,
                                        Type: req.body.Type,
                                        pid: response.p_id,
                                        dates: req.body.date,
                                        payment_url: response.payment_url
                                    };

                                    res.send({
                                        responseCode: 200,
                                        responseMessage: "Payment url.",
                                        result: objData
                                    })
                                }
                            });
                        }
                    ])
                }
            }
        })
    },

    "redirectpage": function(req, res) {
        i18n = new i18n_module(req.params.lang, configs.langFile);
        res.json({ result: i18n.__("Page created") })
    },

    "returnPage": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        //myCache.del( "myKey" );
        var value = req.body;
        console.log("value", value)
        waterfall([
            function(callback) {
                var verfiyPaymentRequest = new Object();
                verfiyPaymentRequest.merchant_email = "sakshigadia@gmail.com";
                verfiyPaymentRequest.secret_key = "jwjn4lgU2sZqPqsB2Da3zNJIJwaUX8mgFGDJ2UE5nEvc4XO7BYaaMTSwq3qncNDRthAvbeAyT6LX3z4EyfPk8HQzLhWX4AOyRp42";
                verfiyPaymentRequest.payment_reference = value.pid;
                paytabs.VerfiyPayment(verfiyPaymentRequest, function(response) {
                    if (response.response_code == '100') {
                        console.log("verify response", response)
                        callback(null, response)
                    } else {

                    }
                });
            },
            function(response, callback) {
                var details = {
                    paymentMode: value.paymentMode,
                    userId: value.userId,
                    amount: value.amount,
                    paymentAmount: value.paymentAmount,
                    brolixAmount: value.brolixAmount,
                    transcationId: response.transaction_id,
                    Type: value.Type,
                    dates: value.dates
                }
                var payment = new Payment(details);
                payment.save(function(err, paymentResult) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!paymentResult) { res.send({ responseCode: 404, responseMessage: "Something went wrong" }); } else {
                        console.log("payment result==>.", paymentResult)
                        callback(null, paymentResult)
                    }
                })
            },
            function(paymentResult, callback) {
                if (value.Type == 'createPage') {
                    adminCards.findOne({
                        type: "upgrade_card",
                        price: value.amount
                    }, function(err, cardRes) {
                        if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!cardRes) { res.send({ responseCode: 404, responseMessage: "No cards available" }); } else {
                            // console.log("card res0", cardRes)
                            callback(null, cardRes)
                        }
                    })
                } else {
                    callback(null, "cardRes")
                }

            },
            function(cardRes, callback) {
                var cashAmount = value.userCashAmount - value.brolixAmount
                if (value.Type == 'createPage') {
                    var card_viewers = cardRes.viewers;
                    var data = {
                        cash: value.amount,
                        viewers: card_viewers,
                        type: "SENDBYADMIN"
                    }
                    var query = { $push: { upgradeCardObject: data }, $set: { cash: cashAmount } }
                } else {
                    var query = { $set: { cash: cashAmount } }

                }

                // console.log(data)

                //console.log("cashAmount", cashAmount)
                User.findByIdAndUpdate({ _id: value.userId }, query, function(err, userRes) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!userRes) { res.send({ responseCode: 404, responseMessage: "Something went wrong" }); } else {
                        //  console.log("userRes========>", userRes)
                        callback(null, userRes)
                    }
                })
            }
        ], function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!result) {
                res.redirect('http://ec2-52-76-162-65.ap-southeast-1.compute.amazonaws.com:1426/page/redirectpage/' + 404 + '/' + "Failure" + '')
            }
            //res.send({ responseCode: 404, responseMessage: "Something went wrong." }); } 
            else {
                // var values = myCache.del("myKey");
                // console.log("values",values)
                //res.redirect('http://ec2-52-76-162-65.ap-southeast-1.compute.amazonaws.com:1426/page/redirectpage/' + 200 + '/' + "Success" + '')
                res.send({ responseCode: 200, responseMessage: i18n.__("Payment done successfully") });
            }
        })
        //   }
    },


    "returnAdsData": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        //myCache.del( "myKey" );
        var value = myCache.get("myKeys");
        if (value == undefined || value == null || value == '') {
            res.redirect('http://ec2-52-76-162-65.ap-southeast-1.compute.amazonaws.com:1426/page/redirectpage/' + 404 + '/' + "Failure" + '')
        } else {
            console.log("value", value)
            waterfall([
                function(callback) {
                    var verfiyPaymentRequest = new Object();
                    verfiyPaymentRequest.merchant_email = "sakshigadia@gmail.com";
                    verfiyPaymentRequest.secret_key = "jwjn4lgU2sZqPqsB2Da3zNJIJwaUX8mgFGDJ2UE5nEvc4XO7BYaaMTSwq3qncNDRthAvbeAyT6LX3z4EyfPk8HQzLhWX4AOyRp42";
                    verfiyPaymentRequest.payment_reference = value.pid;
                    paytabs.VerfiyPayment(verfiyPaymentRequest, function(response) {
                        if (response.response_code == '100') {
                            console.log("verify response", response)
                            callback(null, response)
                        } else {
                            res.redirect('http://ec2-52-76-162-65.ap-southeast-1.compute.amazonaws.com:1426/page/redirectpage/' + 404 + '/' + "Failure" + '')
                        }
                    });
                },
                function(response, callback) {
                    var details = {
                        paymentMode: value.paymentMode,
                        userId: value.userId,
                        amount: value.amount,
                        paymentAmount: value.paymentAmount,
                        brolixAmount: value.brolixAmount,
                        transcationId: response.transaction_id,
                        Type: value.Type,
                        dates: value.dates
                    }
                    var payment = new Payment(details);
                    payment.save(function(err, paymentResult) {
                        if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!paymentResult) { res.send({ responseCode: 404, responseMessage: "Something went wrong." }); } else {
                            console.log("payment result==>.", paymentResult)
                            callback(null, paymentResult)
                        }
                    })
                },
                function(paymentResult, callback) {
                    if (value.Type == 'createPage') {
                        adminCards.findOne({
                            type: "upgrade_card",
                            price: value.amount
                        }, function(err, cardRes) {
                            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!cardRes) { res.send({ responseCode: 404, responseMessage: "No cards available." }); } else {
                                //console.log("card res0", cardRes)
                                callback(null, cardRes)
                            }
                        })
                    } else {
                        callback(null, "cardRes")
                    }

                },
                function(cardRes, callback) {
                    var cashAmount = value.userCashAmount - value.brolixAmount
                    if (value.Type == 'createPage') {
                        var card_viewers = cardRes.viewers;
                        var data = {
                            cash: value.amount,
                            viewers: card_viewers,
                            type: "SENDBYADMIN"
                        }
                        var query = { $push: { upgradeCardObject: data }, $set: { cash: cashAmount } }
                    } else {
                        var query = { $set: { cash: cashAmount } }

                    }

                    console.log(data)

                    console.log("cashAmount", cashAmount)
                    User.findByIdAndUpdate({ _id: value.userId }, query, function(err, userRes) {
                        if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!userRes) { res.send({ responseCode: 404, responseMessage: "Something went wrong" }); } else {
                            // console.log("userRes========>", userRes)
                            callback(null, userRes)
                        }
                    })
                }
            ], function(err, result) {
                if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!result) {
                    res.redirect('http://ec2-52-76-162-65.ap-southeast-1.compute.amazonaws.com:1426/page/redirectpage/' + 404 + '/' + "Failure" + '')
                }
                //res.send({ responseCode: 404, responseMessage: "Something went wrong." }); } 
                else {
                    //var values = myCache.del("myKey");
                    //console.log("values",values)
                    res.redirect('http://ec2-52-76-162-65.ap-southeast-1.compute.amazonaws.com:1426/page/redirectpage/' + 200 + '/' + "Success" + '')
                    //res.send({ responseCode: 200, responseMessage: "Cards updated successfully." });
                }
            })
        }
    },

    // "redirectpage": function(req, res) {

    // },

    "paymentFilterApi": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        var startTime = new Date(parseInt(req.body.startTime)).toUTCString();
        var endTime = new Date(parseInt(req.body.endTime)).toUTCString();

        Payment.find({ userId: req.body.userId, dates: { $gte: startTime, $lte: endTime } }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (result.length == 0) {
                res.send({ responseCode: 404, responseMessage: "Data not found" });
            } else {
                res.send({ responseCode: 200, responseMessage: i18n.__("Your payment history shown successfully"), result: result });
            }
        })
    }

}