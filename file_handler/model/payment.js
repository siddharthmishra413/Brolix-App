'use strict';
/*var asyn=require("async");*/
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var async = require('async');
var encrypt = require('mongoose-encryption');
var Schema = mongoose.Schema;

/* Payment schema */

var paypalPaymentSchema = new Schema({
    paymentMode:{
        type: String  //paypal or visaCard or massPay
    },
    userId: {
        type: String,
        ref: 'brolixUser'
    },
    amount: {
        type: Number
    },
    transcationId: {
        type: String,
        trim: true
    },
    adId:{
        type:String,
        ref: 'createNewAds'
    },
    pageId:{
        type:String,
        ref: 'createNewPage'
    },
    Type:{
        type:String  //createPage //createAd //upgradeCardPurchase //sendFollower //getCash
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
var paypalPayment = mongoose.model('paypalPayment', paypalPaymentSchema);
module.exports = paypalPayment;
