var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var cardsSchema = new Schema({
    type: {
        type: String,
        trim: true
    },
    brolix: {
        type: Number
    },
    chances: {
        type: Number
    },
    viewers: {
        type: Number
    },
    price: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    photo:{
        type:String
    },
    offer:[{
        offerType:{type:String},
        buyCard:{type:Number},
        freeCard:{type:Number},
        offerTime:{type:Date},
        status:{type:String,default:"active"},
        createdAt:{type:Date,default:Date.now()}   
        }],
    sendCouponToUser: { type: Number },
    status:{
        type:String,
        default:"ACTIVE"
    }
},{ versionKey: false });
var cardsAdmin = mongoose.model('cardsAdmin', cardsSchema);
module.exports = cardsAdmin;
