var express = require('express');
var app = express();
var reportHandler = require('../file_handler/reportProblem.js');
var authUser = require('../middlewares/authUser');

app.post('/reportProblem',authUser.authUser,reportHandler.reportProblem);

module.exports = app;