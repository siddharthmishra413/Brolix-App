'use strict';
/*var asyn=require("async");*/
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var async = require('async');
var encrypt = require('mongoose-encryption');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

/* Page schema */

var createNewPageSchema = new mongoose.Schema({
    userId: {
        type: String,
        trim: true,
        ref: 'brolixUser'
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
        type: String
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
    location: [],
    pageImage: {
        type: String,
        trim: true
    },
    coverImage: {
        type: String,
        trim: true
    },
    pageFollowersStatus: { type: Boolean, default: false },
    averageRating: { type: Number, trim: true, default: 0 },
    totalRating: [{
        userId: { type: String },
        rating: { type: Number },
        date: { type: Date }
    }],
    permissions: [],
    linkSocialListObject: [{
        userId: { type: String },
        mediaType: { type: String },
        link: { type: String },
        status: { type: String, default: 'ACTIVE'}
    }],
    adAdmin: [{
        userId: { type: String, ref: 'brolixUser' },
        type: { type: String }
    }],
    adAdminCount: {
        type: Number,
        default: 0
    },
    pageFollowersUser: [{
        userId: { type: String, ref: 'brolixUser' }
    }],
    pageView: {
        type: String
    },
    followerNumber: {
        type: String
    },
    callUsClick: {
        type: String
    },
    productView: {
        type: String
    },
    locationClicks: {
        type: String
    },
    websiteClicks: {
        type: String
    },
    emailClicks: {
        type: String
    },
    eventViewClicks: {
        type: String
    },
    socialMediaClicks: {
        type: String
    },
    country: {
        type: String
    },
    state: {
        type: String
    },
    city: {
        type: String
    },
    adsCount: {
        type: Number,
        default: 0
    },
    winnersCount: {
        type: Number,
        default: 0
    },
    socialMedia: [],
    blockedUser: [],
    countryCode:{ type:String},
    locationDescription:{type:String},
    commentCount: { type: Number, default: 0 },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'ACTIVE',
        trim: true
    },
    adminRequest: {
        type: String,
        default: 'ACTIVE',
        trim: true
    }
});
createNewPageSchema.plugin(mongoosePaginate);
var createNewPage = mongoose.model('createNewPage', createNewPageSchema);
module.exports = createNewPage;
