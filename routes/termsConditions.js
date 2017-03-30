var express = require('express');
var app = express();
var termsConditionHandler = require('../file_handler/termsCondition.js');
var authUser = require('../middlewares/authUser');


app.post('/createTerms', termsConditionHandler.createTerms);
app.get('/viewTermsCondition', termsConditionHandler.viewTermsCondition);
//app.put('/editTermsCondition/:type/:id', termsConditionHandler.editTermsCondition);



module.exports = app;
