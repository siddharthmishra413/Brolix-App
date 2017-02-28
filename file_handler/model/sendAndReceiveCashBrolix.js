'use strict';
/*var asyn=require("async");*/
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var async = require('async');
var encrypt = require('mongoose-encryption');
var Schema = mongoose.Schema;

/* Send/Receive Cash and Brolix schema */

var cashBrolixSchema = new Schema({
    senderId: {
        type: String,
        trim: true
    },
    receiverId: {
        type: String,
        trim: true
    },
    cashType: {
        type: String,
        trim: true
    },
    transferredAmount: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});
var cashBrolixSchema = mongoose.model('cashBrolix', cashBrolixSchema);
module.exports = cashBrolixSchema;
