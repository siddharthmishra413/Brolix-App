'use strict';
/*var asyn=require("async");*/
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var async = require('async');
var encrypt = require('mongoose-encryption');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

/* Report schema */

var pageProductSchema = new Schema({
    pageId: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        trim: true,
    },
    discription: {
        type: String,
        trim: true
    },
    // totalLike: [{
    //     userId: { type: String },
    //     like: { type: Boolean }
    // }],
    like: [],
    totalComments: [{
        userId: { type: String, trim: true },
        comment: { type: String, trim: true },
        createdAt: { type: Date, default: Date.now },
        reply: [{
            userId: { type: String },
            replyComment: { type: String },
            createdAt: { type: Date, default: Date.now }
        }]
    }],
    tag: [{
        userId: { type: String },
        senderId: { type: String }
    }],
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
pageProductSchema.plugin(mongoosePaginate);
var pageProductList = mongoose.model('pageProduct', pageProductSchema);
module.exports = pageProductList;
