var express = require('express');
var app = express();
var eventHandler = require('../file_handler/events.js');
var authUser = require('../middlewares/authUser');


app.post('/createEvent', authUser.authUser, eventHandler.createEvent);
app.get('/showAllEvents', authUser.authUser, eventHandler.showAllEvents);
app.get('/showEventDetails/:id', authUser.authUser, eventHandler.showEventDetails);
app.put('/editEvent/:id', authUser.authUser, eventHandler.editEvent); //Not Update in Docs

module.exports = app;
