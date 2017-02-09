var express = require('express');
var app = express();
var reportHandler = require('../file_handler/reportProblem.js');
var authUser = require('../middlewares/authUser');

app.post('/reportProblembyUser',authUser.authUser,reportHandler.reportProblembyUser);
app.post('/reportProblemOnAds',authUser.authUser,reportHandler.reportProblemOnAds);
<<<<<<< HEAD
=======
app.get('/showReport',authUser.authUser,reportHandler.showReport);
>>>>>>> ab392163b8b2082e1779c15c8863c2e8881e9db2

module.exports = app;