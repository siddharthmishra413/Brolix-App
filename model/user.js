'use strict';
/*var asyn=require("async");*/
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var async = require('async');
var encrypt = require('mongoose-encryption');
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
    facebookID:{
        type: String
    },
    image: {
        type: String
    },
    coverImage: {
        type: String
    },    
    cash: {
        type: String
    },
    brolix: {
       type: Number,
        default:0
    },    
    coupons: {
        type: String
    },
    luckCard: {
        type: String
    },
    deviceToken:{
        type:String
    },
    deviceType:{
        type:String
    },
    otp:{
        type:Number
    },
    followers:[],
    notification_status:{
       type: String,
       default:'on',
       trim:true
   },
    viewedAd:[],
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'inActive',
        trim: true
    }

});
var user = mongoose.model('brolixUser', userSchema);
module.exports = user;
function initDB(){
    async.waterfall([
        function(callback){
        user.find({type:'ADMIN'},function(err,result){
            if(err)throw err;            
            callback(null,result);
        })
    },
    function(adminUser,callback){
        if(adminUser.length>0)
             callback(null,{adminUser:adminUser});
        else{
        var defaultUser={
              email:'admin@admin.com',
              password: 'admin123',
              type:'ADMIN',
              firstname:'ADMIN'             
            }
       
        var adminUser = new user(defaultUser);
        adminUser.save(function(err,result){
            callback(null,{adminUser:defaultUser});
        })
        }
    }],function(err,result){
        if(err) throw err;
    })
}initDB();