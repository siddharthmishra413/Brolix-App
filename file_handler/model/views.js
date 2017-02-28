'use strict';
/*var asyn=require("async");*/
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var async = require('async');
var encrypt = require('mongoose-encryption');
var Schema = mongoose.Schema;

/* View Clicks schema */

var viewSchema = new Schema({
    pageId:{
        type:String
    },
    userId:{
        type:String
    },
    date:{
        type:Date
    },
    pageView: {
        type: Number,
        default: 0
    },
    followerNumber:{
         type: Number,
        default: 0
    },
    callUsClick:{
         type: Number,
        default: 0
    },
    productView:{
        type: Number,
        default: 0
    },
    locationClicks:{
        type: Number,
        default: 0
    },
    websiteClicks:{
        type: Number,
        default: 0
    },
    emailClicks:{
        type: Number,
        default: 0
    },
    eventViewClicks:{
        type: Number,
        default: 0
    },
    socialMediaClicks:{
        type: Number,
        default: 0
    },
    shares:{
        type: Number,
        default: 0
    },
    viewAds:{
        type: Number,
        default: 0
    },
    adsId:{
        type:String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});
var views = mongoose.model('views', viewSchema);
module.exports = views;
