'use strict';
/*var asyn=require("async");*/
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var async = require('async');
var encrypt = require('mongoose-encryption');
var Schema = mongoose.Schema;

/* Chat schema */

var storeSchema = new Schema({
    upgradeCardListObject: [{
        cash: { type: String, default: 0 },
        brolix: { type: String, default: 0 },
    }],
    luckCardListObject: [{
        cash: { type: String, default: 0 },
        brolix: { type: String, default: 0 },
    }],
   permissions:[],
    createdAt: {
        type: Date,
        default: Date.now
    },
});
var store = mongoose.model('storeSchema', storeSchema);
module.exports = chat;
