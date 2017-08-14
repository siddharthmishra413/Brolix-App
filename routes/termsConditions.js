var express = require('express');
var app = express();
var termsConditionHandler = require('../file_handler/termsCondition.js');
var authUser = require('../middlewares/authUser');


app.post('/createTerms', termsConditionHandler.createTerms);
app.get('/viewTermsCondition/:type/:lang', termsConditionHandler.viewTermsCondition);
app.put('/editTermsCondition/:type', termsConditionHandler.editTermsCondition);
app.get('/viewAllTerms', termsConditionHandler.viewAllTerms);


module.exports = app;
