var express = require('express');
var app = express();
var pageHandler = require('../file_handler/page.js');
var authUser = require('../middlewares/authUser');



app.post('/createPage', authUser.authUser,pageHandler.createPage);
app.get('/showAllPages',authUser.authUser,pageHandler.showAllPages);
app.post('/showPageDetails',authUser.authUser,pageHandler.showPageDetails);
app.get('/showPageBusinessType',authUser.authUser,pageHandler.showPageBusinessType);
app.get('/showPageFavouriteType',authUser.authUser,pageHandler.showPageFavouriteType);


module.exports = app;