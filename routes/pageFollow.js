var express = require('express');
var app = express();
var pageFollowHandler = require('../file_handler/pageFollow.js');
var authUser = require('../middlewares/authUser');

app.post('/pageFollowUnfollow', authUser.authUser,pageFollowHandler.pageFollowUnfollow);
app.post('/pageFollowerList',  authUser.authUser,pageFollowHandler.pageFollowerList);
app.post('/pageFollowRequestSend', authUser.authUser, pageFollowHandler.pageFollowRequestSend);
app.post('/blockPageFollower', authUser.authUser, pageFollowHandler.blockPageFollower);


module.exports = app;
