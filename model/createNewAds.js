'use strict';
/*var asyn=require("async");*/
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var async = require('async');
var encrypt = require('mongoose-encryption');
var Schema = mongoose.Schema;

/* Ads schema */

var createNewAdsSchema = new Schema({
    userId: {
        type: String,
        trim: true
    },
    adsType: {
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
        thumbnail: []
    },
    sildeshow: {
        type: []
    },
    googleLink: {
        type: String,
        trim: true
    },
    appStoreLink: {
        type: String
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
    couponCode: {
        type: String
    },
    whoWillSeeYourAdd: [{
        country: { type: String },
        state: { type: String },
        city: { type: String }
    }],
    gender: {
        type: String,
        trim: true
    },
    age: {
        type: Number,
        trim: true
    },  
    comments: [{
        userId: { type: String },
        comment: { type: String }
    }],
    raffleCount: [],
    like: [],
    winners: [],
    luckCardListObject: [{
        userId:{type:String},
        brolix:{type:Number},
        chances:{type: Number}
    }],
    count: {
        type: Number,
        default: 0
    },
    couponExchange: [{
        senderId: { type: String },
        newCoupon: { type: String },
        oldCoupon: { type: String },
        couponExchangeStatus: { type: String, default:'Pending'}
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
var createNewAds = mongoose.model('createNewAds', createNewAdsSchema);
module.exports = createNewAds;
