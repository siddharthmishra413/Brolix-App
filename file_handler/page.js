var createNewPage = require("./model/createNewPage");
var createNewAds = require("./model/createNewAds");
var User = require("./model/user");
var waterfall = require('async-waterfall');
//var mongoosePaginate = require('mongoose-paginate');
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
                                if (err) { res.send({ responseCode: 409, responseMessage: err }); } else {
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
        createNewPage.findOne({ _id: req.body.pageId, status: "ACTIVE" }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "Pages details show successfully."
            })
        })
    },
    //API for Business Type
    "showPageBusinessType": function(req, res) {
        createNewPage.paginate({ userId: req.params.id, pageType: 'Business', status: "ACTIVE" }, { page: req.params.pageNumber, limit: 8 }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
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
                res.send({
                    result: results,
                    responseCode: 200,
                    responseMessage: "Followed"
                });
            })
        } else {
            User.findOneAndUpdate({ _id: req.body.userId }, { $pop: { "pageFollowers": { pageId: req.body.pageId } } }, { new: true }).exec(function(err, results) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                    res.send({
                        result: results,
                        responseCode: 200,
                        responseMessage: "Unfollowed"
                    });
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
    // Api for Rating
    "pageRating": function(req, res, next) {
        waterfall([
            function(callback) {
                createNewPage.findOne({ _id: req.body.pageId }).exec(function(err, result) {
                    var pre_book_rating = result.rating;
                    var count = result.review_count;

                    var xxx = pre_book_rating == "0" ? req.body.rating : (parseInt(req.body.rating) + parseInt(pre_book_rating)) / 2;
                    callback(null, pre_book_rating, count, xxx);
                    console.log("pre_book_rating count====>>>>" + count)
                })
            },
            function(pre_book_rating, count, xxx, callback) {
                createNewPage.findByIdAndUpdate(req.body.pageId, {
                    $set: {
                        review_count: count + 1,
                        rating: xxx
                    }
                }, {
                    new: true
                }).exec(function(err, data) {
                    var update_rating = data.rating;
                    console.log("update_rating count====>>>>" + update_rating);
                    callback(null, update_rating);

                })
            },
            function(update_rating, callback) {
                console.log("After update_rating count====>>>>" + update_rating);
                // console.log("After pre_book_rating count====>>>>"+pre_book_rating);
                res.send({
                    responseCode: 200,
                    responseMessage: "Page rating updated.",
                    rating: update_rating
                })
                callback(null, "done");
            },
            function(err, results) {

            }
        ])
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

    // "showAllAdsCouponType": function(req, res) {
    //         createNewAds.paginate({ userId: { $ne: req.params.id }, adsType: "coupon", $or: [{ status: "ACTIVE" }, { status: "EXPIRED" }] }, { page: req.params.pageNumber, limit: 8 }, function(err, result) {
    //             if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
    //             res.send({
    //                 result: result,
    //                 responseCode: 200,
    //                 responseMessage: "Data Show successfully"
    //             })
    //         })
    //     },

    "particularPageWinners": function(req, res) {
        var pageId = req.body.pageId;
        var array = [];
        createNewAds.find({ pageId: pageId }).exec(function(err, result) {
            // console.log("result-->>"+result)
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (pageId == null || pageId == '' || pageId === undefined) { res.send({ responseCode: 404, responseMessage: 'please enter pageId' }); } else {
                for (i = 0; i < result.length; i++) {
                    for (j = 0; j < result[i].winners.length; j++, j) {
                        array.push(result[i].winners[j]);
                    }
                }
                User.find({ _id: { $in: array } }, function(err, result1) {
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


}
