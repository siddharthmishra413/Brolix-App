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
    productType:{
        type:String
    },
    thumbnail:{type:String},
    media: [{
        image: { type: String, trim: true },
        description: { type: String, trim: true },
    }],
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
        senderId: []
    }],
    commentCount: { type: Number, default: 0 },
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
