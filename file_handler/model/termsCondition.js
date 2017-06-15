'use strict';
/*var asyn=require("async");*/
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var async = require('async');
var encrypt = require('mongoose-encryption');
var Schema = mongoose.Schema;

/* Notification schema */
// cashAdCondition  couponAdCondition  signUpCondition cashAdGift couponAdGift hiddenAdGift sellThisCoupon

var termsConditionSchema = new Schema({
    userId: {
        type: String
    },
    termsConditionContent: {
        type: String
    },
    pageCost:{
        type: Number
    },
    type: {
        type: String
    },
    authorType: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
var termsCondition = mongoose.model('termsCondition', termsConditionSchema);
module.exports = termsCondition;
