'use strict';
/*var asyn=require("async");*/
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var async = require('async');
var encrypt = require('mongoose-encryption');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

/* User schema */

var userSchema = new Schema({
    type: {
        type: String,
        trim: true
    },
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    gender: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    password: {
        type: String
    },
    dob: {
        type: Date
    },
    country: {
        type: String,
        trim: true
    },
    state: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    mobileNumber: {
        type: Number,
        trim: true
    },
    pincode: {
        type: Number,
        trim: true
    },
    facebookID: {
        type: String
    },
    googleID: {
        type: String
    },
    image: {
        type: String
    },
    coverImage: {
        type: String
    },
    cash: {
        type: Number,
        default: 0
    },
    countryCode:{
        type:Number
    },
    cashPrize: [{
        cash: { type: String },
        adId: { type: String, ref: 'createNewAds' },
        pageId: { type: String, ref: 'createNewPage' },
        status: { type: String, default: 'ACTIVE' },
        cashStatus: { type: String, default: 'DELIVERED' },
        updateddAt: { type: Date, default: Date.now }
    }],
    couponPrize: [],
    gifts: [],
    brolixAds: {
        type: Number,
        default: 0
    },
    brolix: {
        type: Number,
        default: 0
    },
    coupon: [{
        couponCode: { type: String },
        adId: { type: String, ref: 'createNewAds' },
        pageId: { type: String, ref: 'createNewPage' },
        expirationTime: { type: Date, default: Date.now },
        couponStatus: { type: String, default: 'VALID' },
        exchangeStatus: { type: String, default: 'ON' },
        status: { type: String, default: 'ACTIVE' },
        type: { type: String },
        updateddAt: { type: Date, default: Date.now },
        createddAt: { type: Date, default: Date.now },
        usedCouponDate: { type: Date, default: Date.now },
        couponExpire: { type: String }
    }],
    hiddenGifts: [{
        adId: { type: String, ref: 'createNewAds' },
        pageId: { type: String, ref: 'createNewPage' },
        status: { type: String, default: 'ACTIVE' },
        hiddenCode: { type: String },
        updateddAt: { type: Date, default: Date.now }
    }],
    luckCard: {
        type: String
    },
    cardPurchaseDate: {
        type: Date
    },
    deviceToken: {
        type: String
    },
    deviceType: {
        type: String
    },
    otp: { type: Number },
    averageRating: { type: Number, trim: true, default: 0 },
    totalRating: [{
        senderId: { type: String },
        rating: { type: Number }
    }],
    followers: [{
        senderId: { type: String },
        senderName: { type: String },
        FollowStatus: { type: String, default: 'Pending' }
    }],
    pageFollowers: [{
        pageId: { type: String },
        pageName: { type: String },
        pageFollowersStatus: { type: Boolean, default: true }
    }],
    adFollowers: [{
        adId: { type: String }
    }],
    notification_status: { type: String, default: 'on', trim: true },
    notification: [{
        type: { type: String },
        image: { type: String },
        notificationType: { type: String },
        userId: { type: String },
        adId: { type: String, ref: 'createNewAds' },
        linkType: { type: String },
        productId: { type: String },
        CreatedAt: { type: Date, default: Date.now }
    }],
    viewedAd: [],
    transferAmountListObject: [{
        amount: { type: Number },
        adId: { type: Number },
        CreatedAt: {
            type: Date,
            default: Date.now
        }
    }],
    sendBrolixListObject: [{
        senderId: { type: String },
        brolix: { type: Number },
        CreatedAt: {
            type: Date,
            default: Date.now
        }
    }],
    sendCashListObject: [{
        senderId: { type: String },
        cash: { type: Number },
        CreatedAt: {
            type: Date,
            default: Date.now
        }
    }],
    buyBrolixListObject: [{
        brolix: { type: Number },
        createdAt: { type: Date, default: Date.now }
    }],
    privacy: {
        sendMessage: { type: String, default: 'everyone' },
        sendCash: { type: String, default: 'everyone' },
        sendCoupon: { type: String, default: 'everyone' },
        followMe: { type: String, default: 'everyone' },
        ViewFollower: { type: String, default: 'everyone' },
        sendBrolix: { type: String, default: 'everyone' },
        findMe: { type: String, default: 'everyone' },
        exchangeCoupon: { type: String, default: 'on' }
    },
    luckCardObject: [{
        cardId:{ type: String, ref: 'cardsAdmin' },
        brolix: { type: Number },
        chances: { type: Number },
        status: { type: String, default: 'ACTIVE' },
        type: { type: String },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    upgradeCardObject: [{
        cardId:{ type: String, ref: 'cardsAdmin' },
        cash: { type: Number },
        viewers: { type: Number },
        status: { type: String, default: 'ACTIVE' },
        type: { type: String },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    usedLuckCard: [],
    pageCount: {
        type: Number,
        default: 0
    },
    userUpgradeCard: [],
    permissions: [],
    termsCondition: {
        type: String
    },
    referralCode: {
        type: String
    },
    haveReferralCode: {
        type: Boolean
    },
    referredCode: {
        type: String
    },
    cashStatus: [{
        adId: { type: String },
        cashStatus: { type: String, default: 'pending' }
    }],
    userFollowers: [],
    blockUser: [],
    UpgradeUsedAd: [{
        upgradeId: { type: String },
        adId: { type: String, ref: 'createNewAds' }
    }],
    luckUsedAd: [{
        luckId: { type: String },
        adId: { type: String, ref: 'createNewAds' }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'ACTIVE',
        trim: true
    },
    isVerified:{
        type:String,
        default:'FALSE',
        trim:true
    },
        isLive:{
        type:String,
        default:'False',
        trim:true
    }


});
userSchema.plugin(mongoosePaginate);
var user = mongoose.model('brolixUser', userSchema);
module.exports = user;

function initDB() {
    async.waterfall([
        function(callback) {
            user.find({ type: 'ADMIN' }, function(err, result) {
                if (err) throw err;
                callback(null, result);
            })
        },
        function(adminUser, callback) {
            if (adminUser.length > 0)
                callback(null, { adminUser: adminUser });
            else {
                var defaultUser = {
                    email: 'deepakmobiloitte@gmail.com',
                    password: 'Mobiloitte1',
                    type: 'ADMIN',
                    firstName: 'Deepak',
                    lastName: 'Sharma',
                    isVerified: 'TRUE',
                    image: 'http://res.cloudinary.com/mobiloitte-in/image/upload/v1482579253/IMG_0768_f9b0nw.jpg',
                    permissions: ["manageUser", "managePages", "manageAds", "manageCards", "manageGifts", "managePayments", "adminTool"]
                }

                var adminUser = new user(defaultUser);
                adminUser.save(function(err, result) {
                    callback(null, { adminUser: defaultUser });
                })
            }
        }
    ], function(err, result) {
        if (err) throw err;
    })
}
initDB();
