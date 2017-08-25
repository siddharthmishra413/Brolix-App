var express = require('express');
var app = express();
var productHandler = require('../file_handler/product.js');
var authUser = require('../middlewares/authUser');

app.post('/deleteComments', authUser.authUser,productHandler.deleteComments);
app.post('/editComments', authUser.authUser, productHandler.editComments);

app.post('/createProduct', authUser.authUser, productHandler.createProduct);
app.get('/productList/:id/:lang', authUser.authUser, productHandler.productList);
app.get('/productDetail/:id/:lang', authUser.authUser, productHandler.productDetail);
app.post('/productLikeAndUnlike', authUser.authUser, productHandler.productLikeAndUnlike);
app.post('/commentOnProduct', authUser.authUser, productHandler.commentOnProduct);
app.post('/productReplyOnComment', authUser.authUser, productHandler.productReplyOnComment);
app.post('/tagOnProduct', authUser.authUser, productHandler.tagOnProduct);
app.get('/productCommentList/:id/:imageId/:pageNumber/:lang', authUser.authUser, productHandler.productCommentList);
app.get('/removeProduct/:id/:mediaId/:lang', authUser.authUser, productHandler.removeProduct);
app.put('/editProduct/:id/:mediaId', authUser.authUser, productHandler.editProduct);

module.exports = app;
