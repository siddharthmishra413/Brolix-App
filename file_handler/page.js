var createNewPage = require("./model/createNewPage");
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
        createNewPage.paginate({ userId: { $ne: req.params.id }, status: "ACTIVE" }, { page: req.params.pageNumber, limit: 8 }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "All pages show successfully."
            })
        })
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
                createNewPage.find({ _id: { $in: arr } }).exec(function(err, newResult) {
                    res.send({
                        results: newResult,
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
                    results: results,
                    responseCode: 200,
                    responseMessage: "Followed"
                });
            })
        } else {
            User.findOneAndUpdate({ _id: req.body.userId }, { $pop: { "pageFollowers": { pageId: req.body.pageId } } }, { new: true }).exec(function(err, results) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                    res.send({
                        results: results,
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
        createNewPage.find({ status: 'ACTIVE' }).or([{ 'pageName': { $regex: re } }]).sort({ pageName: -1 }).exec(function(err, result) {
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
        createNewPage.find({ $and: [data] }).exec(function(err, results) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                res.send({
                    results: results,
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
}
