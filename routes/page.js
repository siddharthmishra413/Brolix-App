var express = require('express');
var app = express();
var pageHandler = require('../file_handler/page.js');
var authUser = require('../middlewares/authUser');



app.post('/createPage',pageHandler.createPage);
app.get('/showAllPages/:pageNumber',authUser.authUser,pageHandler.showAllPages);
app.get('/showAllOtherUserPages/:id/:pageNumber',authUser.authUser,pageHandler.showAllOtherUserPages);
app.post('/showPageDetails',authUser.authUser,pageHandler.showPageDetails);
app.get('/showPageFavouriteType',authUser.authUser,pageHandler.showPageFavouriteType);
app.get('/showPageBusinessType/:id/:pageNumber',authUser.authUser,pageHandler.showPageBusinessType);
app.get('/showPageFavouriteType/:id',authUser.authUser,pageHandler.showPageFavouriteType);
app.put('/editPage/:id',authUser.authUser,pageHandler.editPage);
app.post('/deletePage',authUser.authUser,pageHandler.deletePage);
app.post('/pagesSearch',authUser.authUser,pageHandler.pagesSearch); //Not Update in Docs
app.post('/pageFollowUnfollow',authUser.authUser,pageHandler.pageFollowUnfollow); //Not Update in Docs
app.post('/searchForPages',authUser.authUser,pageHandler.searchForPages); //Not Upadte in Docs
app.post('/pageRating',authUser.authUser,pageHandler.pageRating);

module.exports = app;