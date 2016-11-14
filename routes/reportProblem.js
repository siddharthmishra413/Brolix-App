var express = require('express');
var app = express();
var reportHandler = require('../file_handler/reportProblem.js');

app.post('/reportProblem',reportHandler.reportProblem);

module.exports = app;