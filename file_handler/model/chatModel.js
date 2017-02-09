'use strict';
/*var asyn=require("async");*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
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
    senderImage: {
        type: String
    },
    receiverImage: {
        type: String
    },
    senderName: {
        type: String
    },
    receiverName: {
        type: String
    },
    message: {
        type: String,
        trim: true
    },
    timestamp: {
        type: String
    },
    is_read: {
        type: Number,
        default: 0
    },
    roomId: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
chatSchema.plugin(mongoosePaginate);
var chat = mongoose.model('chat', chatSchema);
module.exports = chat;
