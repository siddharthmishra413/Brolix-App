'use strict';
/*var asyn=require("async");*/
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var async = require('async');
var encrypt = require('mongoose-encryption');
var Schema = mongoose.Schema;

/* Report schema */

var reportProblemSchema = new Schema({
    userId: {
        type: String,
        trim: true,
        ref: 'brolixUser'
    },
    adId: {
        type: String, ref: 'createNewAds'
    },
    type: {
        type: String
    },
    reportType: {
        type: String,
        trim: true
    },
    subject: {
        type: String,
        trim: true
    },
    reportDiscription: {
        type: String,
        trim: true
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
var reportProblem = mongoose.model('reportProblem', reportProblemSchema);
module.exports = reportProblem;
