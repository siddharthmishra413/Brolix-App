'use strict';
/*var asyn=require("async");*/
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var async = require('async');
var encrypt = require('mongoose-encryption');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

/* Report schema */

var productCommentSchema = new Schema({
    pageId: {
        type: String,
        trim: true
    },
    productId: {
        type: String,
        trim: true
    },
    imageId: {
        type: String,
        trim: true
    },
    userId: { type: String, trim: true },
    userName: { type: String, trim: true },
    userImage: { type: String, trim: true },
    comment: { type: String, trim: true },
    reply: [{
        userId: { type: String },
        replyComment: { type: String },
        userName: { type: String, trim: true },
        userImage: { type: String, trim: true },
        createdAt: { type: Date, default: Date.now },
        status: { type: String, default: 'ACTIVE'}
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
productCommentSchema.plugin(mongoosePaginate);
var productCommentList = mongoose.model('productComment', productCommentSchema);
module.exports = productCommentList;
