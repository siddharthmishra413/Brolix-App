'use strict';
/*var asyn=require("async");*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* Chat schema */

var chatSchema = new Schema({
	senderId: {
        type: String,
        trim: true
    },
    receiverId: {
        type: String,
        trim: true
    },
    message: {
        type: String,
        trim: true
    },
    timestamp:{
        type:String
    },
    roomId:{
        type:String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
var chat = mongoose.model('chatSchema', chatSchema);
module.exports = chat;