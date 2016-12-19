var express = require('express');
var app = express();
var adminHandler = require('../file_handler/admin.js');
var authUser = require('../middlewares/authUser');


app.get('/showAllUsershowAllUser', authUser.authUser, adminHandler.showAllUser);
app.get('/winners', authUser.authUser, adminHandler.winners);
app.post('/sendBrolix', authUser.authUser, adminHandler.sendBrolix);
app.post('/blockUser', authUser.authUser, adminHandler.blockUser);


module.exports = app;
