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
    totalRating:{
        type: Number,
        default: 0
    },
    adId:{
        type:String
    },

    AdTag:{
        type: Number,
        default: 0
    },
    socialShare:{
        type: Number,
        default: 0
    },
    AdFollowers:{
        type: Number,
        default: 0
    },
    useLuckCard:{
        type: Number,
        default: 0
    },
    AdReport:{
        type: Number,
        default: 0
    },
    GameDownloaded:{
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});
var views = mongoose.model('views', viewSchema);
module.exports = views;
