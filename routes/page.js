var express = require('express');
var app = express();
var pageHandler = require('../file_handler/page.js');
var authUser = require('../middlewares/authUser');



app.post('/createPage', authUser.authUser,pageHandler.createPage);
app.get('/showAllPages/:pageNumber',authUser.authUser,pageHandler.showAllPages);
app.post('/showPageDetails',authUser.authUser,pageHandler.showPageDetails);
app.get('/showPageBusinessType',authUser.authUser,pageHandler.showPageBusinessType);
app.get('/showPageFavouriteType',authUser.authUser,pageHandler.showPageFavouriteType);
app.put('/editPage/:id',authUser.authUser,pageHandler.editPage);
app.post('/deletePage',authUser.authUser,pageHandler.deletePage);
app.post('/pagesSearch',authUser.authUser,pageHandler.pagesSearch); //Not Update in Docs
app.post('/pageFollowUnfollow',authUser.authUser,pageHandler.pageFollowUnfollow); //Not Update in Docs
app.post('/editBusinessPage',authUser.authUser,pageHandler.editBusinessPage);

module.exports = app;