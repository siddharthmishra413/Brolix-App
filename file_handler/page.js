var createNewPage = require("./model/createNewPage");
var User = require("./model/user");
//var mongoosePaginate = require('mongoose-paginate');
module.exports = {

    //API for create Page
    "createPage": function(req, res) {
        createNewPage.findOne({ pageName: req.body.pageName }).exec(function(err, result) {
            if (err) throw err;
            else if (result) {
                res.send({
                    responseCode: 302,
                    responseMessage: "Page name must be unique."
                });
            } else {
                var page = new createNewPage(req.body);
                page.save(function(err, result) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                        User.findByIdAndUpdate({ _id: req.body.userId }, {
                            $set: {
                                type: "Advertiser"
                            }
                        }, { new: true }).exec(function(err, result) {})
                        res.send({
                            result: result,
                            responseCode: 200,
                            responseMessage: "Page create successfully."
                        });
                    }
                })
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
        createNewPage.find({ pageType: 'Business', status: "ACTIVE" }).exec(function(err, result) {
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
        createNewPage.find({ pageType: 'Business', status: "ACTIVE" }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "Pages details show successfully."
            })
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
            createNewPage.findOneAndUpdate({ _id: req.body.pageId }, { $push: { "followers": { senderId: req.body.senderId, senderName: req.body.senderName } } }, { new: true }).exec(function(err, results) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
                res.send({
                    results: results,
                    responseCode: 200,
                    responseMessage: "Followed"
                });
            })
        } else {
            createNewPage.findOneAndUpdate({ _id: req.body.userId }, { $pop: { "followers": { senderId: req.body.senderId } } }, { new: true }).exec(function(err, results) {
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
        console.log("req======>>>" + JSON.stringify(req.body))
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
}
