var express = require('express');
var app = express();
var productHandler = require('../file_handler/product.js');
var authUser = require('../middlewares/authUser');

app.post('/deleteComments', productHandler.deleteComments);
app.post('/editComments', productHandler.editComments);

app.post('/createProduct', authUser.authUser, productHandler.createProduct);
app.get('/productList/:id/:pageNumber', productHandler.productList);
app.get('/productDetail/:id', authUser.authUser, productHandler.productDetail);
app.post('/productLikeAndUnlike', authUser.authUser, productHandler.productLikeAndUnlike);
app.post('/commentOnProduct', authUser.authUser, productHandler.commentOnProduct);
app.post('/productReplyOnComment', authUser.authUser, productHandler.productReplyOnComment);
app.post('/tagOnProduct', authUser.authUser, productHandler.tagOnProduct);
app.get('/productCommentList/:id/:pageNumber', authUser.authUser, productHandler.productCommentList);
app.get('/removeProduct/:id/:mediaId', productHandler.removeProduct);
app.put('/editProduct/:id/:mediaId', productHandler.editProduct);

module.exports = app;
