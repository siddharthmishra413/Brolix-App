'use strict';
/*var asyn=require("async");*/
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var async = require('async');
var encrypt = require('mongoose-encryption');
var Schema = mongoose.Schema;

/* SignUp schema */

var createCouponsSchema = new Schema({
    userId: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        trim: true
    },
    couponName: {
        type: String,
        trim: true
    },
    couponExpriyDate: {
        type: Date
    },
    numberOfViewers: {
        type: String,
        trim: true
    },
    giftDiscription: {
        type: String,
        trim: true
    },    
    brolix: {
        type: String
    },
    winners: {
        type: Number
    },
    coupons: {
        type: Number
    },
    whoWillSeeYourAdd: [{
        country:{type: String},
        state:{type: String},
        city:{type: String}
    }],
    gender: {
        type: String,
        trim: true
    },    
    age: {
        type: Number,
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
var createCoupons = mongoose.model('createCoupons', createCouponsSchema);
module.exports = createCoupons;