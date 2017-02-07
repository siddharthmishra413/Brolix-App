var express = require('express');
var app = express();
var reportHandler = require('../file_handler/reportProblem.js');
var authUser = require('../middlewares/authUser');

app.post('/reportProblembyUser',authUser.authUser,reportHandler.reportProblembyUser);
app.post('/reportProblemOnAds',authUser.authUser,reportHandler.reportProblemOnAds);

module.exports = app;