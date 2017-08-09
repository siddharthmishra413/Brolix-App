'use strict';
/*var asyn=require("async");*/
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var async = require('async');
var encrypt = require('mongoose-encryption');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

/* Report schema */

var addsCommentSchema = new Schema({
    pageId: {
        type: String,
        trim: true
    },
    addId: {
        type: String,
        trim: true
    },
    type:{
        type:String
    },
    userId: { type: String, trim: true, ref: 'brolixUser' },
    userName: { type: String, trim: true },
    userImage: { type: String, trim: true },
    comment: { type: String, trim: true },
    reply: [{
        userId: { type: String },
        userName: { type: String, trim: true },
        userImage: { type: String, trim: true },
        replyComment: { type: String },
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
addsCommentSchema.plugin(mongoosePaginate);
var addsCommentList = mongoose.model('addsComment', addsCommentSchema);
module.exports = addsCommentList;
