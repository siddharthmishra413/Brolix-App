'use strict';
/*var asyn=require("async");*/
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var async = require('async');
var encrypt = require('mongoose-encryption');
var Schema = mongoose.Schema;

/* SignUp schema */

var chatSchema = new Schema({
	senderId: {
        type: String,
        trim: true
    },
    receiverId: {
        type: String,
        trim: true
    },
    message: {
        type: String,
        trim: true
    },
    roomId: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});
var chat = mongoose.model('chatSchema', chatSchema);
module.exports = chat;