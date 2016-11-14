'use strict';
/*var asyn=require("async");*/
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var async = require('async');
var encrypt = require('mongoose-encryption');
var Schema = mongoose.Schema;

/* Page schema */

var createNewPageSchema = new Schema({
    userId: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        trim: true
    },
    pageType: {
        type: String,
        trim: true
    },
    pageName: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        trim: true
    },
    subCategory: {
        type: String,
        trim: true
    },
    pageDiscription: {
        type: String,
        trim: true
    },    
    email: {
        type: String
    },
    website: {
        type: String
    },
    phoneNumber: {
        type: Number,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    pageImage: {
        type: String,
        trim: true
    },    
    coverImage: {
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
var createNewPage = mongoose.model('createNewPage', createNewPageSchema);
module.exports = createNewPage;