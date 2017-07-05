var express = require('express');
var app = express();
var pageFollowHandler = require('../file_handler/pageFollow.js');
var authUser = require('../middlewares/authUser');

app.post('/pageFollowUnfollow', pageFollowHandler.pageFollowUnfollow);
app.post('/pageFollowerList',  pageFollowHandler.pageFollowerList);
app.post('/pageFollowRequestSend', authUser.authUser, pageFollowHandler.pageFollowRequestSend);
app.post('/blockPageFollower', authUser.authUser, pageFollowHandler.blockPageFollower);


module.exports = app;
