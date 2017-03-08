var createNewPage = require("./model/createNewPage");
var createNewAds = require("./model/createNewAds");
var createEvents = require("./model/createEvents");
var createNewReport = require("./model/reportProblem");
//var notificationList = require("./model/notificationList");

var Views = require("./model/views");
var User = require("./model/user");
var waterfall = require('async-waterfall');

//var mongoosePaginate = require('mongoose-paginate');
console.log("test===>"+new Date(1487589012837).getTimezoneOffset())
var mongoose = require('mongoose');
module.exports = {

    //API for create Page
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
                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                            User.findByIdAndUpdate({ _id: req.body.userId }, { $inc: { pageCount: 1 }, $set: { type: "Advertiser" } }).exec(function(err, result1) {
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
    //API for Show All Pages
    "showAllPages": function(req, res) {
        createNewPage.paginate({ status: "ACTIVE" }, { page: req.params.pageNumber, limit: 8 }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "All pages show successfully."
            })
        })
    },

    //API for Show All Pages
    "showAllOtherUserPages": function(req, res) {
        waterfall([
            function(callback) {
                User.findOne({ _id: req.params.id }).exec(function(err, result) {
                    callback(null, result);
                    console.log("resultresultresult count====>>>>" + result)
                })
            },
            function(result, callback) {
                createNewPage.paginate({ userId: { $ne: req.params.id }, status: "ACTIVE" }, { page: req.params.pageNumber, limit: 8 }, function(err, pageResult) {
                    callback(null, result, pageResult);
                })
            },
            function(result, pageResult, callback) {
                console.log("After pageResult pageResult====>>>>" + JSON.stringify(pageResult));
                console.log("After result result  result  result====>>>>" + JSON.stringify(result));
                var array = [];
                var data = [];
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
                res.send({
                    result: pageResult,
                    responseCode: 200,
                    responseMessage: "User rating updated."
                })
                callback(null, "done");
            },
            function(err, results) {

            }
        ])
    },

    //API for Show Page Details
    "showPageDetails": function(req, res) {
        var date = new Date().toUTCString()
        console.log(JSON.stringify(date))
        createNewPage.findOne({ _id: req.body.pageId, status: "ACTIVE" }).populate({ path: 'pageFollowersUser.userId', select: ('firstName lastName image country state city') }).populate({ path: 'adAdmin.userId', select: ('firstName lastName image country state city') }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
            else if(!result){ res.send({responseCode:404, responseMessage:"No page found"}); }
            createEvents.find({ pageId: req.body.pageId, status: "ACTIVE", createdAt: { $gte: date } }).exec(function(err, result1) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
                else if(!result1){ res.send({responseCode:404, responseMessage:"No event found"}); }
                res.send({
                    result: result,
                    eventList: result1,
                    responseCode: 200,
                    responseMessage: "Pages details show successfully."
                })
            })
        })
    },
    //API for Business Type
    "showPageBusinessType": function(req, res) {
        createNewPage.paginate({ userId: req.params.id, pageType: 'Business', status: "ACTIVE" }, { page: req.params.pageNumber, limit: 8 }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
            else if(!result){ res.send({responseCode:404, responseMessage:"No page found"}); }
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "Pages details show successfully."
            })
        })
    },
    //API for Favourite Type
    "showPageFavouriteType": function(req, res) {
        User.find({ _id: req.params.id }).exec(function(err, results) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                var arr = [];
                results[0].pageFollowers.forEach(function(result) {
                    arr.push(result.pageId)
                })
                createNewPage.paginate({ _id: { $in: arr } }, { page: req.params.pageNumber, limit: 8 }, function(err, newResult) {
                    res.send({
                        result: newResult,
                        responseCode: 200,
                        responseMessage: "Show list all follow pages."
                    });
                })
            }
        })
    },
    //API for Edit Page
    "editPage": function(req, res) {
        createNewPage.findOne({ pageName: req.body.pageName }).exec(function(err, result) {
            if (err) throw err;
            else if (result) {
                res.send({
                    responseCode: 302,
                    responseMessage: "Page name must be unique."
                });
            } else {
                createNewPage.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec(function(err, result) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
                    res.send({
                        result: result,
                        responseCode: 200,
                        responseMessage: "Pages details updated successfully."
                    })
                })
            }
        })
    },
    //API for Delete Page
    "deletePage": function(req, res) {
        createNewPage.findOne({ _id: req.body.pageId }).exec(function(err, result) {
            if (err) throw err;
            else if (!result) {
                res.send({
                    responseCode: 302,
                    responseMessage: "Something went worng."
                });
            } else {
                createNewPage.findByIdAndUpdate(req.body.pageId, { $set: { status: 'DELETE' } }, { new: true }).exec(function(err, result) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
                    res.send({
                        result: result,
                        responseCode: 200,
                        responseMessage: "Pages delete successfully."
                    })
                })
            }
        })
    },
    //API for Follow and unfollow
    "pageFollowUnfollow": function(req, res) {
        if (req.body.follow == "follow") {
            User.findOneAndUpdate({ _id: req.body.userId }, { $push: { "pageFollowers": { pageId: req.body.pageId, pageName: req.body.pageName } } }, { new: true }).exec(function(err, results) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
                createNewPage.findOneAndUpdate({ _id: req.body.pageId }, { $push: { "pageFollowersUser": { userId: req.body.userId } } }, { new: true }).exec(function(err, result1) {
                    res.send({
                        result: results,
                        responseCode: 200,
                        responseMessage: "Followed"
                    });
                })
            })
        } else {
            User.findOneAndUpdate({ _id: req.body.userId }, { $pop: { "pageFollowers": { pageId: req.body.pageId } } }, { new: true }).exec(function(err, results) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                    createNewPage.findOneAndUpdate({ _id: req.body.pageId }, { $pop: { "pageFollowersUser": { userId: req.body.userId } } }, { new: true }).exec(function(err, result1) {
                        res.send({
                            result: results,
                            responseCode: 200,
                            responseMessage: "Followed"
                        });
                    })
                }
            })
        }
    },
    //API for Show Page Search
    "pagesSearch": function(req, res) {
        //console.log("req======>>>" + JSON.stringify(req.body))
        var re = new RegExp(req.body.search, 'i');
        createNewPage.find({ status: 'ACTIVE', pageType: "Business" }).or([{ 'pageName': { $regex: re } }]).sort({ pageName: -1 }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                res.send({
                    responseCode: 200,
                    responseMessage: "Show pages successfully.",
                    result: result
                });
            }
        })
    },
    //API for Show Search
    "searchForPages": function(req, res) {
        var data = {
            'whoWillSeeYourAdd.country': req.body.country,
            'whoWillSeeYourAdd.state': req.body.state,
            'whoWillSeeYourAdd.city': req.body.city,
            'pageName': req.body.pageName,
            'category': req.body.category,
            'subCategory': req.body.subCategory
        }
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                if (data[key] == "" || data[key] == null || data[key] == undefined) {
                    delete data[key];
                }
            }
        }
        createNewPage.paginate({ $and: [data] }, { page: req.params.pageNumber, limit: 8 }, function(err, results) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                res.send({
                    result: results,
                    responseCode: 200,
                    responseMessage: "All Details Found"
                })
            }
        })
    },

    "pageRating": function(req, res) {
        var avrg = 0;
        createNewPage.findOne({ _id: req.body.pageId, totalRating: { $elemMatch: { userId: req.body.userId } } }).exec(function(err, result) {
            console.log("result========================" + JSON.stringify(result));
            if (!result) {
                console.log("If");
                createNewPage.findOneAndUpdate({ _id: req.body.pageId }, { $push: { "totalRating": { userId: req.body.userId, rating: req.body.rating ,date:req.body.date } } }, { new: true }).exec(function(err, results) {
                    for (var i = 0; i < results.totalRating.length; i++) {
                        avrg += results.totalRating[i].rating;
                    }
                    var averageRating = avrg / results.totalRating.length;
                    createNewPage.findOneAndUpdate({ _id: req.body.pageId }, { $set: { averageRating: averageRating } }, { new: true }).exec(function(err, results2) {
                        res.send({
                            result: results2,
                            responseCode: 200,
                            responseMessage: "result show successfully"
                        })
                    })
                })
            } else {
                console.log("else");
                createNewPage.findOneAndUpdate({ _id: req.body.pageId, 'totalRating.userId': req.body.userId }, { $set: { "totalRating.$.rating": req.body.rating ,"totalRating.$.date": req.body.date} }, { new: true }).exec(function(err, results1) {
                    for (var i = 0; i < results1.totalRating.length; i++) {
                        avrg += results1.totalRating[i].rating;
                    }
                    var averageRating = avrg / results1.totalRating.length;
                    createNewPage.findOneAndUpdate({ _id: req.body.pageId }, { $set: { averageRating: averageRating } }, { new: true }).exec(function(err, results2) {
                        res.send({
                            result: results2,
                            responseCode: 200,
                            responseMessage: "result show successfully"
                        })
                    })
                })
            }
        })
    },

    "showBlockedPage": function(req, res) { // pageId in request
        createNewPage.paginate({ status: "BLOCK" }, { page: req.params.pageNumber, limit: 8 }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) return res.status(404).send({ responseMessage: "please enter correct pageId" })
            else if (result.docs.length == 0) { res.send({ responseCode: 404, responseMessage: "No blocked page found" }) } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Blocked page shown successfully."
                });
            }

        });
    },

    "removePage": function(req, res) { // pageId in request
        createNewPage.findByIdAndUpdate({ _id: req.body.pageId }, { $set: { 'status': 'REMOVED' } }, { new: true }, function(err, result) {
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

    "showAllRemovedPage": function(req, res) {
        createNewPage.paginate({ status: "REMOVED" }, { page: req.params.pageNumber, limit: 8 }, function(err, result) {
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
                    responseMessage: "Removed page shown successfully."
                });
            }

        });
    },


    "linkSocialMedia": function(req, res) {
        var userId = req.body.userId;
        var mediaType = req.body.mediaType;
        var link = req.body.link;
        createNewPage.findOneAndUpdate({ _id: req.body.pageId }, { $push: { "linkSocialListObject": { userId: req.body.userId, mediaType: req.body.mediaType, link: req.body.link } } }, { new: true }, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No ad Found" }); } else if (userId == null || userId == '' || userId === undefined) { res.send({ responseCode: 404, responseMessage: 'please enter userId' }); } else if (mediaType == null || mediaType == '' || mediaType === undefined) { res.send({ responseCode: 404, responseMessage: 'please enter mediaType' }); } else if (link == null || link == '' || link === undefined) { res.send({ responseCode: 404, responseMessage: 'please enter link' }); } else {
                res.send({
                    //  result: result,
                    responseCode: 200,
                    responseMessage: "Post saved successfully"
                })
            }
        })
    },

    "getSocialMediaLink": function(req, res) {
        createNewPage.findOne({ _id: req.body.pageId }, 'linkSocialListObject').exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result)(res.send({ responseCode: 404, responseMessage: "No page found." }))
            else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Post saved successfully"
                })
            }
        })
    },

    "particularPageCouponWinners": function(req, res) {
        var pageId = req.body.pageId;
        if (pageId == null || pageId == '' || pageId === undefined) { res.send({ responseCode: 404, responseMessage: 'please enter pageId' }); } else {
            var array = [];
            createNewAds.find({ pageId: pageId, status: "EXPIRED" }, function(err, result) {
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                    var couponType = result.filter(result => result.adsType == "coupon");
                    for (i = 0; i < couponType.length; i++) {
                        for (j = 0; j < couponType[i].winners.length; j++, j) {
                            array.push(couponType[i].winners[j]);
                        }
                    }
                    User.paginate({ _id: { $in: array } }, { page: req.params.pageNumber, limit: 8 }, function(err, result1) {
                        if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (result1.length == 0) { res.send({ responseCode: 404, responseMessage: "No winner found " }) } else {
                            res.send({
                                result: result1,
                                responseCode: 200,
                                responseMessage: "result show successfully;"
                            })
                        }
                    })
                }
            })
        }
    },

    "particularPageCashWinners": function(req, res) {
        var pageId = req.body.pageId;
        if (pageId == null || pageId == '' || pageId === undefined) { res.send({ responseCode: 404, responseMessage: 'please enter pageId' }); } else {
            var array = [];
            createNewAds.find({ pageId: pageId, status: "EXPIRED" }).exec(function(err, result) {
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                    var cashType = result.filter(result => result.adsType == "cash");
                    for (i = 0; i < cashType.length; i++) {
                        for (j = 0; j < cashType[i].winners.length; j++, j) {
                            array.push(cashType[i].winners[j]);
                        }
                    }
                    User.paginate({ _id: { $in: array } }, { page: req.params.pageNumber, limit: 8 }, function(err, result1) {
                        if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (result1.length == 0) { res.send({ responseCode: 404, responseMessage: "No winner found " }) } else {
                            res.send({
                                result: result1,
                                responseCode: 200,
                                responseMessage: "result show successfully;"
                            })
                        }
                    })
                }
            })
        }
    },

    "adAdmin": function(req, res) {
        if (req.body.add == "add") {
            createNewPage.findByIdAndUpdate(req.params.id, { $push: { "adAdmin": { userId: req.body.userId, type: req.body.type } } }, {
                new: true
            }).exec(function(err, result) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Ad edit."
                });
            });
        } else if (req.body.add == "remove") {
            createNewPage.findByIdAndUpdate(req.params.id, { $pop: { "adAdmin": { userId: req.body.userId, type: req.body.type } } }, {
                new: true
            }).exec(function(err, result) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Removed."
                });
            });
        }
    },

    // "pageFilter": function(req, res) {
    //     var date = req.body.date;
    //       function daysInMonth(month,year) {
    //          return new Date(year, month, 0).getDate();
    //       }
    //         var startTime = new Date(parseInt(req.body.date)).toUTCString();
    //         var endTimeHour = parseInt(req.body.date) + 86400000;
    //         var endTime = new Date(endTimeHour).toUTCString();

    //         var week = endTimeHour + 604800000;
    //         var weekly = new Date(week).toUTCString();


    //         var month_date = new Date(parseInt(req.body.date))
    //         var mm = month_date.getMonth();
    //         var yy = month_date.getFullYear();
    //         console.log("year==>"+yy)
    //         var days = daysInMonth(mm,yy);
    //         console.log("days-----------  ",days);
             
    //         var month = parseInt(req.body.date) + (86400000 * days)
    //         var monthly = new Date(month).toUTCString();
         
    //         console.log("startTime"+startTime);
    //         console.log("endTime"+endTime);
    //         console.log("weekly"+weekly);
    //         console.log("monthly"+monthly);











    //     createNewPage.paginate({ status: "ACTIVE" }, { page: req.params.pageNumber, limit: 8 }, function(err, result) {
    //         if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
    //         res.send({
    //             result: result,
    //             responseCode: 200,
    //             responseMessage: "All pages show successfully."
    //         })
    //     })
    // },

    "pageViewClick": function(req, res){
        var startTime = new Date(req.body.date).toUTCString();
        var endTimeHour = req.body.date +  86399000;
        var endTime = new Date(endTimeHour).toUTCString();
            console.log(startTime);
            console.log(endTime)

        var details = req.body;
        var data = req.body.click;
 
        switch(data){
          case 'productView':
          var updateData = { $inc: { productView: 1 }};
          details.productView = 1;
          break;
          case 'callUsClick':
          var updateData = { $inc: { callUsClick: 1 }};
          details.productView = 1;
          break;
          case 'locationClicks':
          var updateData = { $inc: { locationClicks: 1 }};
          details.locationClicks = 1;
          break;
          case 'websiteClicks':
          var updateData = { $inc: { websiteClicks: 1 }};
          details.websiteClicks = 1;
          break;
          case 'emailClicks':
          var updateData = { $inc: { emailClicks: 1 }};
          details.emailClicks = 1;
          break;
          case 'socialMediaClicks':
          var updateData = { $inc: { socialMediaClicks: 1 }};
          details.socialMediaClicks = 1;
          break;
          case 'pageView':
          var updateData = { $inc: { pageView: 1 }};
          details.pageView = 1;
          break;
          case 'followerNumber':
          var updateData = { $inc: { followerNumber: 1 }};
          details.followerNumber = 1;
          break;
          case 'eventViewClicks':
          var updateData = { $inc: { eventViewClicks: 1 }};
          details.eventViewClicks = 1;
          break;
          case 'shares':
          var updateData = { $inc: { shares: 1 }};
          details.shares = 1;
          break;
          case 'viewAds':
          var updateData = { $inc: { viewAds: 1 }};
          details.viewAds = 1;
          break;
        }
       
        Views.findOne({pageId:req.body.pageId, date:{$gte: startTime , $lte: endTime} },function(err, result){
            console.log("views r3sult==>>"+result)
            if(err){
              res.send({
                result: err,
                responseCode: 302,
                responseMessage: "error."
              });}
            else if(!result){
                saveData = 1;
                details.date = startTime;
                var views = Views(details);
                views.save(function(err, pageRes){
                    if(req.body.click == 'viewAds'){
                        createNewAds.findOneAndUpdate({_id:req.body.adsId}, { $inc: { watchedAds: 1 }},{new: true}).exec(function(err, AdsRes){
                            res.send({
                                result: pageRes,
                                responseCode: 200,
                                responseMessage: "Successfully update clicks."
                            });
                        })
                    }
                    else{
                        res.send({
                            result: pageRes,
                            responseCode: 200,
                            responseMessage: "Successfully update clicks."
                        });
                    }
                })

            }
            else{
                Views.findOneAndUpdate({_id:result._id}, updateData,{new: true}).exec(function(err, pageRes){
                    if(err){
                      res.send({
                        result: err,
                        responseCode: 302,
                        responseMessage: "error."
                      });}
                    else if(!result){
                        res.send({
                            result: pageRes,
                            responseCode: 404,
                            responseMessage: "Successfully update clicks."
                        });
                    }
                    else{
                        if(req.body.click == 'viewAds'){
                        createNewAds.findOneAndUpdate({_id:req.body.adsId}, { $inc: { watchedAds: 1 }},{new: true}).exec(function(err, AdsRes){
                                res.send({
                                    result: pageRes,
                                    responseCode: 200,
                                    responseMessage: "Successfully update clicks."
                                });
                            })
                        }
                        else{
                            res.send({
                              result: pageRes,
                              responseCode: 200,
                              responseMessage: "Successfully update clicks."
                            });
                        }
                    }
                })
            }
        })
    },

    "pageStatisticsFilter": function(req, res){   //pageId, 
        var startTime = new Date(req.body.date).toUTCString();
        var endTimeHour = req.body.date +  86399000;
        var endTime = new Date(endTimeHour).toUTCString();

        var week = endTimeHour - 604800000;
        var weekly = new Date(week).toUTCString();

         
        function daysInMonth(month,year) {
            return new Date(year, month, 0).getDate();
        }
        var month_date = new Date(parseInt(req.body.date))
        var mm = month_date.getMonth();
        var yy = month_date.getFullYear();
        console.log("year==>"+yy)
        var days = daysInMonth(mm,yy);
        console.log("days-----------  ",days);
        var month = parseInt(req.body.date) + (86400000 * days)
        var monthly = new Date(month).toUTCString();

        //var yearly = new Date().getFullYear;
        if(req.body.dateFilter == 'all'){
            var queryCondition = { $match: {date: {"$gte":  new Date(startTime), "$lte": new Date(endTime)}}}
        }
        if(req.body.dateFilter == 'today'){
          var queryCondition = { $match: {date: {"$gte":  new Date(startTime), "$lte": new Date(endTime)},pageId:req.body.pageId}}
        }
        if(req.body.dateFilter == 'weekly'){
            var condition;
          var queryCondition = { $match: {date: {"$gte":  new Date(startTime), "$lte": new Date(endTime)},pageId:req.body.pageId}}
        }
        if(req.body.dateFilter == 'monthly'){
          var query = { $match : { "month" : mm, "year": yy } }
        }
        if(req.body.dateFilter == 'yearly'){
          var condition = { $project: {pageView: "$pageView",productView: "$productView", callUsClick:"$callUsClick", date: "$date", year: { $year: "$date" }, month: { $month: "$date" } } };
          var queryCondition = { $match : {"year": yy } };
         // var queryCondition = {query,condition};
        }
        console.log("startTime==>>"+startTime);
        console.log("new date startTime==>>"+new Date(startTime));
        console.log("endTime====>>"+endTime)
 //   var rules = [{pageId:"58aaa1b3fdc4ed1553754d2f"}, {date: {$gte: startTime}}];

 //         Views.aggregate( [    
 //  { $match: {date: {"$gte":  new Date(startTime), "$lte": new Date(endTime)},pageId:"58aaa1b3fdc4ed1553754d2f"}},
 // // { $group: { _id: null, count: { $sum: "$productView" } } }
 //  ]).exec(function(err,result){
        
        console.log("queryCondition"+JSON.stringify(queryCondition))

        Views.aggregate( [ queryCondition,{
                  $group : {
                    _id : null,
                    totalProductView: { $sum: "$productView"},
                    totalPageView: { $sum: "$pageView"},
                    totalEventViewClicks: { $sum: "$eventViewClicks"},
                    totalEmailClicks: { $sum: "$emailClicks"},
                    totalCallUsClick: { $sum: "$callUsClick"},
                    totalFollowerNumber: { $sum: "$followerNumber"},
                    totalSocialMediaClicks: { $sum: "$socialMediaClicks"},
                    totalLocationClicks: { $sum: "$locationClicks"},
                    totalWebsiteClicks: { $sum: "$websiteClicks"},
                    totalShares :{$sum:"$shares"},
                    totalViewAds :{$sum:"$viewAds"},
                    totalRating : {$sum:0}
                }
              }] ).exec(function(err, result){
            if(err){
              res.send({
                result: err,
                responseCode: 404,
                responseMessage: "error."
              });   
            }
            else if(!result){
              res.send({
                result: result,
                responseCode: 404,
                responseMessage: "Data not found."
              });
            }
            else{
               createNewPage.aggregate(
                [
                  //  { $match: {_id:req.body.pageId} },
                    { $unwind: "$totalRating" },
                    { $match: {"totalRating.date": {"$gte":  new Date(startTime), "$lte": new Date(endTime)}, _id: new mongoose.Types.ObjectId(req.body.pageId)}}
                ],
                function(err,pages) {

                    var totalRating = pages.length;
                    console.log("totalRating====>>"+totalRating)
                    result[0].totalRating = totalRating;
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

    "giftStatistics" : function(req, res){
        var startTime = new Date(req.body.date).toUTCString();
        var endTimeHour = req.body.date +  86399000;
        var endTime = new Date(endTimeHour).toUTCString();

        var week = endTimeHour - 604800000;
        var weekly = new Date(week).toUTCString();


        waterfall([
             function(callback){
                createNewAds.find({
                    updatedAt: {$gte: startTime, $lte:endTime},
                    pageId: req.body.pageId
                }).exec(function(err, result){
                    if(err){res.send({result: err,responseCode: 404,responseMessage: "error."});}
                    else if(!result){res.send({result: result,responseCode: 404,responseMessage: "Data not found."});}
                    else{
                        console.log(result)
                        var winnersLength = 0;
                        
                        for(var i=0; i<result.length; i++){
                            winnersLength += result[i].winners.length;
                            console.log(winnersLength);

                        }
                        callback(null, winnersLength)
                    }
                })
            },
            function(winnersLength,callback){
                User.find({
                    cardPurchaseDate:{$gte: startTime, $lte: endTime}
                }).exec(function(err, ress){
                    var totalBuyers = ress.length;
                    var data = {
                        total_winners : winnersLength,
                        total_buyers : totalBuyers
                    }
                    callback(null, data)
                })
            },
            function(winnersLength, totalBuyers, callback){
                createNewAds.find({
                    couponStatus: 'used',
                    couponUsedDate: {$gte: startTime, $lte: endTime}
                }).exec(function(err, couponUsedResult){
                    callback(null, winnersLength, totalBuyers, couponUsedResult)
                })
            },
            function(winnersLength, totalBuyers, couponUsedResult, callback){
                createNewAds.find({
                    couponStatus: 'expired',
                    couponUsedDate:{$gte: startTime, $lte: endTime}
                }).exec(function(err, couponExpResult){
                    callback(null, winnersLength, totalBuyers, couponUsedResult, couponExpResult);       
                })
            },
            function(winnersLength, totalBuyers, couponUsedResult, couponExpResult, callback){
                createNewAds.find({
                    couponStatus: 'valid',
                    couponUsedDate:{$gte: startTime, $lte: endTime}
                }).exec(function(err, couponValidResult){
                    callback(null, winnersLength, totalBuyers, couponUsedResult, couponExpResult,couponValidResult);       
                })
            }
        ],function (err, result) {
          if(err){responseHandler.apiResponder(req, res, 302,"Problem in data finding", err) }
          else{
            res.send({
                        responseCode: 200,
                        responseMessage: 'Successfully.',
                        result: result
                    });
          }
        })

    },

    //Request parameter
    // {
    // "adId":"58ae86f90739d0153030bc45",
    // "pageId":"58aaa1b3fdc4ed1553754d2f"
    // }

    "adsStatistics": function(req, res){
        var startTime = new Date(req.body.date).toUTCString();
        var endTimeHour = req.body.date +  86399000;
        var endTime = new Date(endTimeHour).toUTCString();

        var week = endTimeHour - 604800000;
        var weekly = new Date(week).toUTCString();

        waterfall([
            function(callback){
                var queryCondition = { $match : {pageId:req.body.pageId} } 
                Views.aggregate( [ queryCondition,{
                  $group : {
                    _id : null,
                    totalPageView: { $sum: "$pageView"}
                  }
                }] ).exec(function(err, result){
                    callback(null, result)
                })
            },
            function(pageView, callback){
                createNewAds.findOne({
                    _id: req.body.adId
                }).exec(function(err, results){
                    callback(null,pageView, results)
                })
            },
            function(pageView, results, callback){
                createNewReport.find({
                  adId: req.body.adId
                }).exec(function(err, resultRepo){
                    console.log("result repo==>>"+resultRepo)
                    var data = {
                        pageView : pageView[0].totalPageView,
                        AdTag : results.tag.length,
                        socialShare : results.socialShareListObject.length,
                        AdFollowers : results.adFollowers.length,
                        useLuckCard : results.luckCardListObject.length,
                        AdReport : resultRepo.length
                    }
                    console.log(data)
                    callback(null, data)
                })
            }],function (err, result) {
            if(err){ res.send({
                        responseCode: 302,
                        responseMessage: 'Something went worng.',
                        result: err
                });}
            else{
                res.send({
                        responseCode: 200,
                        responseMessage: 'Successfully.',
                        result: result
                });
            }
        })
    },

    "CouponCashAdStatistics": function(req, res){
        createNewAds.findOne({
          _id: req.body.adId
        }).exec(function(err, result){
            createNewAds.findOne({
               _id: req.body.adId
            },function(err, result){
                if(result.adsType == 'coupon'){
                    //var couponStatus = result.couponPurchased;
                    console.log("result coupon===>"+result.couponExpired)
                    var data = {
                        couponStatus : result.couponStatus,
                        winners : result.winners.length,
                        couponBuyer: result.couponPurchased
                        //couponPurchased : result.couponPurchased.length
                    }
                    res.send({
                        responseCode: 200,
                        responseMessage: 'Successfully.',
                        result: data
                    });
                }
                else{
                    var array = [];

                    User.find({ _id: { $in: result.winners } }, function(err, result1) {
                       
                        result1.forEach(function(result) {
                            array.push(result.firstName)
                        })
                        console.log(array)
                            var data = {
                                 cashStatus : result.cashStatus,
                                 winners : array
                                //couponPurchased : result.couponPurchased.length
                            }

                            res.send({
                                responseCode: 200,
                                responseMessage: 'Successfully.',
                                result: data
                            });  
                        })
                        
                   // })

                }
            })
        })
    },

    "notificationList":function(req, res){
        notificationList.findOne({
          userId: req.body.userId
        }).exec(function(err, result){
           if(err){responseHandler.apiResponder(req, res, 302,"Problem in data finding", err) }
            else{
                res.send({
                    responseCode: 200,
                    responseMessage: 'Successfully.',
                    result: result
                });
            }

        })
    },

    "pageFilter": function(req, res) {
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
            console.log("result--->>", result)
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Result shown successfully."
                })
            }
        })
    },

    "userFavouratePages": function(req, res){
      User.findOne({
        _id:req.body.userId
      },'pageFollowers',function(err, result){
        if(err){res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
        else if(!result){res.send({
                    responseCode: 404,
                    responseMessage: "Data not found."
        })}
        else{
            User.populate(result,{
              path:'pageFollowers.pageId',
              model:'createNewPage'
            },function(err, resultt){

                res.send({
                    result: resultt,
                    responseCode: 200,
                    responseMessage: "Data not found."
                })
            })
        }
      })  
    }

}
