'use strict';
/*var asyn=require("async");*/
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var async = require('async');
var encrypt = require('mongoose-encryption');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

/* Ads schema */

var createNewAdsSchema = new Schema({
    userId: {
        type: String,
        trim: true
    },
    pageId: {
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
    sildeShow: [],
    googleLink: {
        type: String
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
    linkDescription: {
        type: String
    },
    couponCode: {
        type: String
    },
    cashAdPrize: {
        type: Number
    },
    couponStatus: {
        type: String,
        default: 'Pending'
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
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
        reply: [{
            userId: { type: String },
            rplyComment: { type: String },
            createdAt: { type: Date, default: Date.now }
        }]
    }],
    raffleCount: [],
    like: [],
    winners: [],
    viewerLenght: { type: Number },
    luckCardListObject: [{
        userId: { type: String },
        brolix: { type: Number },
        chances: { type: Number }
    }],
    socailShareListObject: [{
        userId: { type: String },
        link: { type: String }
    }],
    upgradeCardListObject: [{
        userId: { type: String },
        brolix: { type: Number },
        viewers: { type: Number }
    }],
    count: {
        type: Number,
        default: 0
    },
    couponExchange: [{
        senderId: { type: String },
        newCoupon: { type: String },
        oldCoupon: { type: String },
        couponExchangeStatus: { type: String, default: 'Pending' }
    }],
    numberOfWinners: {
        type: Number,
        default: 1
    },
<<<<<<< HEAD
    couponExpiryDate: {
        type: String
    },
    couponLength: {
        type: Number
    },
    ageFrom: {
        type: Number
    },
    ageTo: {
        type: Number
    },
    hiddenGifts: [],
=======
    couponExpiryDate:{
        type : Date
    },
    couponLength:{
        type : Number
    },
>>>>>>> deepak
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
createNewAdsSchema.plugin(mongoosePaginate);
var createNewAds = mongoose.model('createNewAds', createNewAdsSchema);
module.exports = createNewAds;
