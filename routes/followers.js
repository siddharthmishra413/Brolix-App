var express = require('express');
var app = express();
var followerHandler = require('../file_handler/followers.js');
var authUser = require('../middlewares/authUser');

app.post('/followUnfollow',authUser.authUser,followerHandler.followUnfollow);
app.post('/followerRequestSend',authUser.authUser,followerHandler.followerRequestSend);
app.post('/followerRequestReceive',authUser.authUser,followerHandler.followerRequestReceive);
app.post('/acceptFollowerRequest',authUser.authUser,followerHandler.acceptFollowerRequest);
app.post('/blockUserList',authUser.authUser,followerHandler.blockUserList);

module.exports = app;