'use strict';
/*var asyn=require("async");*/
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var async = require('async');
var encrypt = require('mongoose-encryption');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
//var autopopulate = require('mongoose-autopopulate');

/* Ads schema */

var createNewAdsSchema = new Schema({
    userId: { type: String, trim: true, ref: 'brolixUser' },
    pageId: { type: String, trim: true, ref: 'createNewPage' },
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
    adsType: {
        type: String,
        trim: true
    },
    brolixFees: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        trim: true
    },
    coverImage: {
        type: String,
        trim: true
    },
    couponCoverImage: {
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
    slideShow: [],
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
    couponStatus: {
        type: String,
    },
    cashAdPrize: {
        type: Number
    },
    cashStatus: {
        type: String
    },
    adContentType: { type: String },
    musicFileName: { type: String },
    couponSellPrice: {
        type: Number
    },
    couponBuyersLength: {
        type: Number
    },
    couponPurchased: {
        type: Number,
        default: 0
    },
    sellCoupon: {
        type: Boolean
    },
    couponSellViewers: { type: String },
    dawnloadPagePhoto: [],
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
    raffleCount: [],
    like: [],
    winners: [],
    viewerLenght: { type: Number },
    luckCardListObject: [{
        userId: { type: String },
        brolix: { type: Number },
        chances: { type: Number }
    }],
    socialShareListObject: [{
        userId: { type: String },
        link: { type: String }
    }],
    upgradeCardListObject: [{
        userId: { type: String },
        brolix: { type: Number },
        viewers: { type: Number }
    }],
    couponExchange: [{
        senderId: { type: String },
        receiverId: { type: String },
        exchangedWithAdId: { type: String },
        senderCouponCode: { type: String },
        couponExchangeStatus: { type: String, default: 'REQUESTED' },
        exchangedDate: { type: Date, default: Date.now }
    }],
    couponSend: [{
        senderId: { type: String },
        receiverId: { type: String },
        sendDate: { type: Date, default: Date.now }
    }],
    numberOfWinners: {
        type: Number,
        default: 1
    },
    couponUsedDate: {
        type: Date
    },
    couponExpiryDate: {
        type: String
    },
    giftDescription: {
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
    tag: [{
        userId: { type: String },
        senderId: []
    }],

    adFollowers: [String],
    commentCount: { type: Number, default: 0 },
    reportOnAd:{ type: Number, default:0},

    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    watchedAds: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: 'ACTIVE',
        trim: true
    }
});
//createNewAdsSchema.plugin(autopopulate);
createNewAdsSchema.plugin(mongoosePaginate);
var createNewAds = mongoose.model('createNewAds', createNewAdsSchema);
module.exports = createNewAds;
