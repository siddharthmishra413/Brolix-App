var express = require('express');
var app = express();
var eventHandler = require('../file_handler/events.js');


app.post('/createEvent', eventHandler.createEvent);
app.get('/showAllEvents', eventHandler.showAllEvents);
app.get('/showEventDetails/:id',eventHandler.showEventDetails);

module.exports = app;