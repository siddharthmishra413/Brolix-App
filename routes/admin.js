var express = require('express');
var app = express();
var adminHandler = require('../file_handler/admin.js');
var authUser = require('../middlewares/authUser');


app.post('/login', adminHandler.login);
app.get('/adminProfile', adminHandler.adminProfile);


module.exports = app;	