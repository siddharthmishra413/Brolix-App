var pageProductList = require("./model/productList");
var productComments = require("./model/productComments");
var User = require("./model/user");
var functions = require("./functionHandler");
module.exports = {

    "createProduct": function(req, res) {
        var product = new pageProductList(req.body);
        product.save(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
            res.send({ result: result, responseCode: 200, responseMessage: "Product Created." });
        })
    },

    "productList": function(req, res) {
        pageProductList.paginate({ pageId: req.params.id, status: 'ACTIVE' }, { page: req.params.pageNumber, limit: 11 }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Product List."
                })
            }
        })
    },

    "productDetail": function(req, res) {
        pageProductList.findOne({ _id: req.params.id }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Product Details."
                })
            }
        })
    },

    "productLikeAndUnlike": function(req, res) {
        if (req.body.flag == "like") {
            pageProductList.findOneAndUpdate({ _id: req.body.productId }, { $push: { like: req.body.userId } }, { new: true }).exec(function(err, results) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                    res.send({
                        result: results,
                        responseCode: 200,
                        responseMessage: "Liked"
                    });
                }
            })
        } else {
            pageProductList.findOneAndUpdate({ _id: req.body.productId }, { $pop: { like: req.body.userId } }, { new: true }).exec(function(err, results) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                    res.send({
                        result: results,
                        responseCode: 200,
                        responseMessage: "Unliked"
                    });
                }
            })
        }
    },

    "commentOnProduct": function(req, res) {
        var product = new productComments(req.body);
        product.save(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
            pageProductList.findOneAndUpdate({ _id: req.body.productId }, { $inc: { commentCount: +1 } }, { new: true }).exec(function(err, results) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                    res.send({ result: result, responseCode: 200, responseMessage: "Comments save with concerned User details." });
                }
            })
        })
    },

    "productReplyOnComment": function(req, res) {
        productComments.findOneAndUpdate({ productId: req.body.productId, _id: req.body.commentId }, {
            $push: { 'reply': { userId: req.body.userId, replyComment: req.body.replyComment, userName: req.body.userName, userImage: req.body.userImage } }
        }, { new: true }).exec(function(err, results) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                res.send({
                    result: results,
                    responseCode: 200,
                    responseMessage: "Comments save successfully."
                });
            }
        })
    },

    "tagOnProduct": function(req, res) {
        pageProductList.findOneAndUpdate({ _id: req.body.productId }, {
            $push: { "tag": { userId: req.body.userId, senderId: req.body.senderId } }
        }, { new: true }).exec(function(err, results) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                res.send({
                    result: results,
                    responseCode: 200,
                    responseMessage: "Tag save with concerned User details."
                });
            }
        })
    },

    "productCommentList": function(req, res) {
        productComments.paginate({ productId: req.params.id }, { page: req.params.pageNumber, limit: 10, sort: { createdAt: -1 } }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: err }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Comments List."
                })
            }
        })
    },

    "removeProduct": function(req, res) {
        pageProductList.findOneAndUpdate({ _id: req.params.id }, { $set: { 'status': 'REMOVED' } }, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error." }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No product found." }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Product removed successfully."
                })
            }
        })
    }

}
