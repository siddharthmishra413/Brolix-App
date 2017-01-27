var express = require('express');
var app = express();
var eventHandler = require('../file_handler/events.js');
var authUser = require('../middlewares/authUser');


app.post('/createEvent', authUser.authUser, eventHandler.createEvent);
app.get('/showAllEvents/:id', authUser.authUser, eventHandler.showAllEvents);
app.get('/showEventDetails/:id', authUser.authUser, eventHandler.showEventDetails);
app.put('/editEvent/:id', authUser.authUser, eventHandler.editEvent);
app.put('/deleteEvent', authUser.authUser, eventHandler.deleteEvent); 

module.exports = app;
