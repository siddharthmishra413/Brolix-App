var express = require('express');
var app = express();
var brolixHandler = require('../file_handler/brolixAndDollors.js');
var authUser = require('../middlewares/authUser');


app.post('/createBrolixAndDollors', brolixHandler.createBrolixAndDollors);
app.get('/viewBrolixAndDollors/:type/:lang', brolixHandler.viewBrolixAndDollors);
app.put('/editBrolixAndDollors/:type', brolixHandler.editBrolixAndDollors);
app.get('/viewAllBrolixAndDollors', brolixHandler.viewAllBrolixAndDollors);


module.exports = app;