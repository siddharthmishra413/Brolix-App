'use strict';
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var async = require('async');
var encrypt = require('mongoose-encryption');
var Schema = mongoose.Schema;

/* Report schema */

var pageFollowersSchema = new Schema({
    userId: {
        type: String,
        trim: true
    },
    pageId: {
        type: String,
        trim: true,
    },
    followStatus: {
        type: String,
        trim: true,
        default: "follow"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'ACTIVE',
        trim: true
    }
});
var pageFollowers = mongoose.model('pageFollowers', pageFollowersSchema);
module.exports = pageFollowers;
