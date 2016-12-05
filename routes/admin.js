var express = require('express');
var app = express();
var userHandler = require('../file_handler/user.js');
var authUser = require('../middlewares/authUser');


// app.post('/changePassword',authUser.authUser,userHandler.changePassword);


module.exports = app;	