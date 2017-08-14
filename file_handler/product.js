var pageProductList = require("./model/productList");
var productComments = require("./model/productComments");
var User = require("./model/user");
var functions = require("./functionHandler");
var mongoose = require('mongoose');
var waterfall = require('async-waterfall');

//<------------------------------------------------language conversn----------------------->
var configs = {
    "lang": "ar",
    "langFile": "./../../translation/locale.json" //relative path to index.js file of i18n-nodejs module 
}
var i18n_module = require('i18n-nodejs');

var i18n = new i18n_module(configs.lang, configs.langFile);
console.log("===========================================", i18n.__('Welcome'));

module.exports = {

    "createProduct": function(req, res) {
         i18n = new i18n_module(req.body.lang, configs.langFile);
        var product = new pageProductList(req.body);
        product.save(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
            res.send({ result: result, responseCode: 200, responseMessage: i18n.__("Product Created") });
        })
    },

    "productList": function(req, res) {
        i18n = new i18n_module(req.params.lang, configs.langFile);
                pageProductList.aggregate({ $unwind: "$media" }, { $match: { pageId: req.params.id ,status: 'ACTIVE'} }).exec(function(err, result1) {
                    console.log("2")
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } 
                    else if (result1.length == 0) { res.send({ responseCode: 404, responseMessage: "Data not found." }); } 
                    else {
                        
                         var sortArray = result1.sort(function(obj1, obj2) {
                     return obj2.createdAt - obj1.createdAt
                 })
                        
                    //    console.log("product result--->>>",JSON.stringify(result1))
                            res.send({
                            docs: sortArray,
                            responseCode: 200,
                            responseMessage: i18n.__("Product List")
                        })
                    }
        })



        // pageProductList.paginate({ pageId: req.params.id, status: 'ACTIVE' }, { page: req.params.pageNumber, limit: 11 }, function(err, result) {
        //     if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
        //         res.send({
        //             result: result,
        //             responseCode: 200,
        //             responseMessage: "Product List."
        //         })
        //     }
        // })
    },

    "productDetail": function(req, res) {
           i18n = new i18n_module(req.params.lang, configs.langFile);
        pageProductList.findOne({ _id: req.params.id }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: i18n.__("Product Details")
                })
            }
        })
    },

    // "productLikeAndUnlike": function(req, res) {
    //     if (req.body.flag == "like") {
    //         pageProductList.findOneAndUpdate({ _id: req.body.productId }, { $push: { like: req.body.userId } }, { new: true }).exec(function(err, results) {
    //             if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
    //                 res.send({
    //                     result: results,
    //                     responseCode: 200,
    //                     responseMessage: "Liked"
    //                 });
    //             }
    //         })
    //     } else {
    //         pageProductList.findOneAndUpdate({ _id: req.body.productId }, { $pop: { like: req.body.userId } }, { new: true }).exec(function(err, results) {
    //             if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
    //                 res.send({
    //                     result: results,
    //                     responseCode: 200,
    //                     responseMessage: "Unliked"
    //                 });
    //             }
    //         })
    //     }
    // },

     "productLikeAndUnlike": function(req, res) {
            i18n = new i18n_module(req.body.lang, configs.langFile);
        if (req.body.flag == "like") {
            pageProductList.findOneAndUpdate({ _id: req.body.productId , 'media._id': req.body.imageId}, { $push: { "media.$.like": req.body.userId} } , { new: true }).exec(function(err, results) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' , err: err}); } else {
                    pageProductList.aggregate({ $unwind: "$media" }, { $match: { _id: new mongoose.Types.ObjectId(req.body.productId) , 'media._id': new mongoose.Types.ObjectId(req.body.imageId) } }).exec(function(err, result) {
                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' , err: err}); } else {
                           
                            res.send({
                                result: result,
                                responseCode: 200,
                                responseMessage: i18n.__("Liked")
                            });
                        }
                    })

                }
            })
        } else {
            pageProductList.findOneAndUpdate({ _id: req.body.productId , 'media._id': req.body.imageId}, { $pop:  { "media.$.like": req.body.userId}}, { new: true }).exec(function(err, results) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                       pageProductList.aggregate({ $unwind: "$media" }, { $match: { _id: new mongoose.Types.ObjectId(req.body.productId) , 'media._id': new mongoose.Types.ObjectId(req.body.imageId) } }).exec(function(err, result) {
                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' , err: err}); } else {
                           
                            res.send({
                                result: result,
                                responseCode: 200,
                                responseMessage: i18n.__("Unliked")
                            });
                        }
                    })
                }
            })
        }
    },

    "commentOnProduct": function(req, res) {
           i18n = new i18n_module(req.body.lang, configs.langFile);
        var product = new productComments(req.body);
        product.save(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
            pageProductList.findOneAndUpdate({ _id: req.body.productId , 'media._id': req.body.imageId}, { $inc: { "media.$.commentCount": +1 } }, { new: true }).exec(function(err, results) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
                else {   
                    
               productComments.populate(result, { path: 'userId reply.userId', model: 'brolixUser', select: 'image firstName lastName' }, function(err, finalResult) {
              res.send({ 
                result: result,
                responseCode: 200, 
                responseMessage: i18n.__("Comments save with concerned User details")
            });
               })
                    
                    
                }
            })
        })
    },

    "productReplyOnComment": function(req, res) {
           i18n = new i18n_module(req.body.lang, configs.langFile);
        productComments.findOneAndUpdate({ productId: req.body.productId, 'imageId':req.body.imageId, _id: req.body.commentId }, {
            $push: { 'reply': { userId: req.body.userId, replyComment: req.body.replyComment, userName: req.body.userName, userImage: req.body.userImage } }
        }, { new: true }).exec(function(err, results) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                res.send({
                    result: results,
                    responseCode: 200,
                    responseMessage: i18n.__("Comments saved successfully")
                });
            }
        })
    },

    "deleteComments": function(req, res){
           i18n = new i18n_module(req.body.lang, configs.langFile);
        if(req.body.type == 'comment'){
            var productQuery = { productId: req.body.productId, imageId: req.body.imageId,_id: req.body.commentId }
            var setCondition = { status : 'INACTIVE'}
        }
        else{
            var productQuery = { productId: req.body.productId,imageId: req.body.imageId, _id: req.body.commentId , 'reply._id': req.body.replyId}
            var setCondition = { 'reply.$.status' : 'INACTIVE'}
        }

        productComments.findOneAndUpdate(productQuery, setCondition, { new: true }).exec(function(err, results) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } 
            else if(results == null || results == undefined){
                res.send({ responseCode: 409, responseMessage: 'Something went wrong' });
            }
            else {
                if(req.body.type == 'comment'){
                    pageProductList.findOneAndUpdate({ _id: req.body.productId }, { $inc: { commentCount: -1 } }, { new: true }).exec(function(err, resul) {
                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                            res.send({
                                result: results,
                                responseCode: 200,
                                responseMessage: i18n.__("Comment deleted successfully")
                            });
                        }
                    })
                }
                else{
                    res.send({
                        result: results,
                        responseCode: 200,
                        responseMessage: i18n.__("Comment deleted successfully")
                    });
                }
            }
        })
    },

    "editComments": function(req, res){
           i18n = new i18n_module(req.body.lang, configs.langFile);
        if(req.body.type == 'comment'){
            var productQuery = { productId: req.body.productId,imageId: req.body.imageId, _id: req.body.commentId }
            var setCondition = { comment : req.body.comment}
        }
        else{
            var productQuery = { productId: req.body.productId,imageId: req.body.imageId, _id: req.body.commentId , 'reply._id': req.body.replyId}
            var setCondition = { 'reply.$.replyComment' : req.body.replyComment}
        }

        productComments.findOneAndUpdate(productQuery, setCondition, { new: true }).exec(function(err, results) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } 
            else if(results == null || results == undefined){
                res.send({ responseCode: 409, responseMessage: 'Something went wrong' });
            }
            else {
                res.send({
                    result: results,
                    responseCode: 200,
                    responseMessage: i18n.__("Comment edited successfully")
                });
            }
        })
    },

    "tagOnProduct": function(req, res) {
           i18n = new i18n_module(req.body.lang, configs.langFile);
        waterfall([
            function(callback) {
                var senderId = req.body.senderId;
                pageProductList.findOneAndUpdate({ _id: req.body.productId , 'media._id': req.body.imageId}, {
                    $push: { "media.$.tag": { userId: req.body.userId, senderId: req.body.senderId } }
                }, { new: true }).exec(function(err, results) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                        callback(null, results)
                    }
                })
            },
            function(results, callback) {
                var senderId = req.body.senderId;
                User.findOne({ _id: req.body.userId }).exec(function(err, user) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!user) { res.send({ responseCode: 404, responseMessage: "Please enter correct userId" }); } else {
                        var image = user.image;
                        for (var i = 0; i < senderId.length; i++) {
                            User.findOneAndUpdate({ _id: senderId[i] }, {
                                $push: { "notification": { userId: req.body.senderId, type: "You are tagged in a product", productId: req.body.productId, notificationType: 'tagOnProduct', image: image } }
                            }, { new: true }).exec(function(err, result1) {
                                if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: "Please enter correct senderId" }); } else {

                                    if (result1.deviceType == 'Android' || result1.notification_status == 'on' || result1.status == 'ACTIVE') {
                                        var message = "You are taged in a product";
                                        functions.android_notification(result1.deviceToken, message);
                                        console.log("Android notification send!!!!")
                                    } else if (result1.deviceType == 'iOS' || result1.notification_status == 'on' || result1.status == 'ACTIVE') {
                                        functions.iOS_notification(result1.deviceToken, message);
                                    } else {
                                        console.log("Something wrong!!!!")
                                    }
                                }
                            });
                        }
                        callback(null, results)
                    }
                })
            },
        ], function(err, result) {
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: i18n.__("Tag save with concerned User details")
            })
        })
    },

    "productCommentList": function(req, res) {
           i18n = new i18n_module(req.params.lang, configs.langFile);
        productComments.paginate({ productId: req.params.id, imageId: req.params.imageId , 'status':'ACTIVE'}, { page: req.params.pageNumber, limit: 10, sort: { createdAt: -1 } }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: err }); } else {
                for(var i=0; i<result.docs.length; i++){
                     var reply=result.docs[i].reply;
                     var data=reply.filter(reply=>reply.status=='ACTIVE');
                     console.log("data--->>"+data)
                     result.docs[i].reply = data;
                }
                        console.log("productCommentList--->>>",result)

                    productComments.populate(result.docs, { path: 'userId reply.userId', model: 'brolixUser', select: 'image firstName lastName' }, function(err, finalResult) {
                      console.log("adsCommentList---->>>",JSON.stringify(finalResult))
                    res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: i18n.__("Comments List")
                })
                                })
              
            }
        })
    },

    "removeProduct": function(req, res) {
           i18n = new i18n_module(req.params.lang, configs.langFile);
        pageProductList.update({ _id: req.params.id , 'media._id': req.params.mediaId}, { $pull: { "media" : { _id: req.params.mediaId } } }, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error." }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No item found." }); } else {
                pageProductList.findOne({_id: req.params.id},function(err, result1){
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error." }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No item found." }); } else {
                        if(result1.media.length == 0){
                            console.log("meadia lenght==0")

                            pageProductList.findOneAndUpdate({ _id: req.params.id }, { $set: { 'status': 'REMOVED' } }, function(err, result2) {
                                if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error." }); } else if (!result2) { res.send({ responseCode: 404, responseMessage: "No item found." }); } else {
                                    res.send({
                                        result: result,
                                        responseCode: 200,
                                        responseMessage: i18n.__("Item removed successfully")
                                    })
                                }
                            })
                             
                        }
                        else{
                            console.log("meadia lenght>0")
                            res.send({
                                result: result,
                                responseCode: 200,
                                responseMessage: i18n.__("Item removed successfully")
                            })

                        }

                    }
                })
               

            
            }
        })

        // pageProductList.findOneAndUpdate({ _id: req.params.id }, { $set: { 'status': 'REMOVED' } }, function(err, result) {
        //     if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error." }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No product found." }); } else {
        //         res.send({
        //             result: result,
        //             responseCode: 200,
        //             responseMessage: "Product removed successfully."
        //         })
        //     }
        // })
    },

    "editProduct": function(req, res) {
           i18n = new i18n_module(req.body.lang, configs.langFile);
        console.log("req. body", JSON.stringify(req.body))
        pageProductList.findOneAndUpdate({ _id: req.params.id , 'media._id': req.params.mediaId}, { $set: { 'media.$.description': req.body.description } }, { new: true }).exec(function(err, result) {
            
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
            else if (!result) { res.send({ responseCode: 404, responseMessage: 'Please enter correct item id' }); } 
            else {                
              productComments.populate(result, { path: 'userId reply.userId', model: 'brolixUser', select: 'image firstName lastName' }, function(err, finalResult) {
               res.send({ result: result, responseCode: 200, responseMessage: i18n.__("Item updated successfully") })
               })
                
                // res.send({ result: result, responseCode: 200, responseMessage: i18n.__("Item updated successfully") })
            }
        })
    }

}
