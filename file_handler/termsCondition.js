var TermsCondition = require("./model/termsCondition");
var functions = require("./functionHandler");
var User = require("./model/user");

// couponGiftInfo , cashGiftInfo, hiddenGiftInfo, cashAdCondition, cashAdCondition, signUpCondition

module.exports = {

    "createTerms": function(req, res) {
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
                    responseMessage: "Terms Condition created successfully."
                });
            }
        })
    },

    "viewTermsCondition": function(req, res) {
        var conditionType = req.params.type;
        TermsCondition.find({ type: conditionType }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: 'No terms and contions found.' }); } else {
                res.send({ result: result, responseCode: 200, responseMessage: "Terms and conditions shown successfully." });
            }
        })
    },

    "editTermsCondition": function(req, res) {
        var conditionType = req.params.type;
        TermsCondition.findOneAndUpdate({ type: conditionType }, { $set: { termsConditionContent: req.body.termsConditionContent } }, { new: true }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: 'No terms and contions found.' }); } else {
                res.send({ result: result, responseCode: 200, responseMessage: "Terms and conditions updated successfully." })
            }
        })
    },

    "viewAllTerms": function(req, res) {
        TermsCondition.find({}).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 500, responseMessage: 'No terms and contions found.' }); } else {
                res.send({ result: result, responseCode: 200, responseMessage: "Terms and conditions shown successfully." });
            }
        })
    }


}
