var express = require('express');
var app = express();
var pageHandler = require('../file_handler/page.js');



app.post('/createPage', pageHandler.createPage);
app.get('/showAllPages',pageHandler.showAllPages);
app.post('/showPageDetails',pageHandler.showPageDetails);


module.exports = app;	