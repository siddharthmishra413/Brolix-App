var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// type : brolixPerFreeCouponAds, brolixPerFreeCashAds, brolixPerUpgradedCashAds, brolixForInvitation
// type : viewerPriceForCashAds,  brolixFeeForCashAds, storeCouponPriceForFreeAds, storeCouponPriceForUpgradedAds
// type :  freeViewersPerCouponAds, freeViewersPerCashAds


var brolixAndDollors = new Schema({
    userId: {
        type: String
    },
    type: {
        type: String
    },
    value: {
        type: Number
    },
    authorType: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

var brolixAndDollors = mongoose.model('brolixAndDollors', brolixAndDollors);
module.exports = brolixAndDollors;
