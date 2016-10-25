'use strict';
/*var asyn=require("async");*/
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var async = require('async');
var encrypt = require('mongoose-encryption');
var Schema = mongoose.Schema;

/* SignUp schema */

var createNewAdsSchema = new Schema({
    userId: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        trim: true
    },
    adsDate: {
        type: String,
        trim: true
    },
    video: {
        type: String,
        thumbnail:[]
    },
    sildeshow: {
        type:[]
    },
    googleLink: {
        type: String,
        trim: true
    },    
    appStoreLink:{
        type:String
    },
    windowsStoreLink: {
        type: String
    },
    appIcon: {
        type: String
    },
    image: {
        type: String
    },
    linkDescription: {
        type: String
    },
    comments:[{
        userId:{type: String},
        comment:{type: String}
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
var createNewAds = mongoose.model('createNewAdsSchema', createNewAdsSchema);
module.exports = createNewAds;