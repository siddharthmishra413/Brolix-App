'use strict';
/*var asyn=require("async");*/
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var async = require('async');
var encrypt = require('mongoose-encryption');
var Schema = mongoose.Schema;

/* Notification schema */

var notificationSchema = new Schema({
    pageId: {
        type: String
    },
    adId: {
        type: String
    },
    Type: {
        type: String
    },
    userId: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
var notificationList = mongoose.model('notificationList', notificationSchema);
module.exports = notificationList;
