var express = require('express');
var app = express();
var followerHandler = require('../file_handler/followers.js');
var authUser = require('../middlewares/authUser');

app.post('/followUnfollow', authUser.authUser, followerHandler.followUnfollow);
app.post('/followerRequestSend', authUser.authUser, followerHandler.followerRequestSend);
app.post('/followerRequestReceive',  followerHandler.followerRequestReceive);
app.post('/acceptFollowerRequest', authUser.authUser, followerHandler.acceptFollowerRequest);
app.post('/blockUserList', authUser.authUser, followerHandler.blockUserList);
app.post('/blockLeader', authUser.authUser, followerHandler.blockLeader);

module.exports = app;
