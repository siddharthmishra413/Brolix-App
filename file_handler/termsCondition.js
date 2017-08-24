var TermsCondition = require("./model/termsCondition");
var functions = require("./functionHandler");
var User = require("./model/user");

//<--------------------------------------------I18n------------------------------------------------->
var configs = {
    "lang": "ar",
    "langFile": "./../../translation/locale.json" //relative path to index.js file of i18n-nodejs module 
}
i18n_module = require('i18n-nodejs');
//<------------------------------------------------------------------------------------------------>


i18n = new i18n_module(configs.lang, configs.langFile);
console.log("===========================================", i18n.__('Welcome'));

// type of terms conditions :-  couponGiftInfo , cashGiftInfo, hiddenGiftInfo, cashAdCondition, cashAdCondition, signUpCondition sellThisCoupon

module.exports = {

    // api to create terms and conditions
    "createTerms": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        var obj = {
            termsConditionContent: req.body.termsConditionContent,
            type: req.body.type,
            authorType: 'ADMIN'
        };
        var terms = new TermsCondition(obj);
        terms.save(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: i18n.__("Terms Condition created successfully")
                });
            }
        })
    },

     // api to view terms for app
    "viewTermsCondition": function(req, res) {
        i18n = new i18n_module(req.params.lang, configs.langFile);
        var conditionType = req.params.type;
        TermsCondition.find({ type: conditionType }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: i18n.__('No terms and contions found') }); } else {
                res.send({ result: result, responseCode: 200, responseMessage: i18n.__("Terms and conditions shown successfully") });
            }
        })
    },

     // api for edit terms condition for admin
    "editTermsCondition": function(req, res) {
        i18n = new i18n_module(req.body.lang, configs.langFile);
        var conditionType = req.params.type;
        TermsCondition.findOneAndUpdate({ type: conditionType }, { $set:  req.body }, { new: true }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: i18n.__('No terms and contions found') }); } else {
                res.send({ result: result, responseCode: 200, responseMessage:i18n.__( "Terms and conditions updated successfully") })
            }
        })
    },

     // show all terms condition for admin
    "viewAllTerms": function(req, res) {
        i18n = new i18n_module(req.params.lang, configs.langFile);
        TermsCondition.find({}).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 500, responseMessage: i18n.__('No terms and contions found') }); } else {
                res.send({ result: result, responseCode: 200, responseMessage: i18n.__("Terms and conditions shown successfully") });
            }
        })
    }


}
