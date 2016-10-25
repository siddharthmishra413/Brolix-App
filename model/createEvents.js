'use strict';
/*var asyn=require("async");*/
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var async = require('async');
var encrypt = require('mongoose-encryption');
var Schema = mongoose.Schema;

/* SignUp schema */

var createEventsSchema = new Schema({
    userId: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        trim: true
    },
    eventDate: {
        type: String,
        trim: true
    },
    eventName: {
        type: String,
        trim: true
    },
    eventTime: {
        type: String,
        trim: true
    },
    discription: {
        type: String,
        trim: true
    },    
    currentEvent:[{
        name:{type:String}
    }],
    socialMedia: [],
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'ACTIVE',
        trim: true
    }
});
var createEvents = mongoose.model('createEventsSchema', createEventsSchema);
module.exports = createEvents;