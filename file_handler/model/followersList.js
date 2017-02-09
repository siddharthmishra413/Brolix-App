'use strict';
/*var asyn=require("async");*/
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var async = require('async');
var encrypt = require('mongoose-encryption');
var Schema = mongoose.Schema;

/* Report schema */

var followerListSchema = new Schema({
    senderId: {
        type: String,
        trim: true
    },
    receiverId: {
        type: String,
        trim: true,
    },
    followerStatus: {
        type: String,
        trim: true,
        default: "Sent"
    },
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
var followersList = mongoose.model('followerList', followerListSchema);
module.exports = followersList;
