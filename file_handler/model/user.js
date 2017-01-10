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
    facebookID: {
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
    gifts: {
        type: Number,
        default: 0
    },
    brolix: {
        type: Number,
        default: 0
    },
    coupons: [],
    luckCard: {
        type: String
    },
    deviceToken: {
        type: String
    },
    deviceType: {
        type: String
    },
    otp: { type: Number },
    followers: [{
        senderId: { type: String },
        senderName: { type: String },
        FollowStatus: { type: String, default: 'Pending' }
    }],
    pageFollowers: [{
        pageId: { type: String },
        pageName: { type: String }
    }],
    notification_status: { type: String, default: 'on', trim: true },
    viewedAd: [],
    rating: { type: Number, trim: true, default: 0 },
    transferAmountListObject: [{
        amount: { type: Number },
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
        sendMessage: { type: String, default: 'public' },
        sendCash: { type: String, default: 'public' },
        sendCoupon: { type: String, default: 'public' },
        follow: { type: String, default: 'public' },
        ViewFollower: { type: String, default: 'public' },
        ViewGifts: { type: String, default: 'public' },
        findMe: { type: String, default: 'public' },
        exchangeCoupon: { type: String, default: 'public' },
        viewLocation: { type: String, default: 'public' }
    },
    luckCardObject: [{
        brolix: { type: Number },
        chances: { type: Number }
    }],
    upgradeCardObject: [{
        brolix: { type: Number },
        viewers: { type: Number }
    }],
    usedLuckCard:[],
    userUpgradeCard:[],
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
                    email: 'admin@admin.com',
                    password: 'admin123',
                    type: 'ADMIN',
                    firstName: 'AKASH',
                    lastName: 'BAIS',
                    image: 'http://res.cloudinary.com/mobiloitte-in/image/upload/v1482579253/IMG_0768_f9b0nw.jpg'
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
