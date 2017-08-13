var brolixAndDollors = require("./model/brolixAndDollors");
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

module.exports = {

    "createBrolixAndDollors": function(req, res) {
          i18n = new i18n_module(req.body.lang, configs.langFile);
        var obj = {
            value: req.body.value,
            type: req.body.type,
            authorType: 'ADMIN'
        };
        var terms = new brolixAndDollors(obj);
        terms.save(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: i18n.__("Value created successfully")
                });
            }
        })
    },

    "viewBrolixAndDollors": function(req, res) {
          i18n = new i18n_module(req.params.lang, configs.langFile);
        var conditionType = req.params.type;
        brolixAndDollors.find({ type: conditionType }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }); } else if (result.length == 0) { res.send({ responseCode: 500, responseMessage: i18n.__('No Brolix And Dollors found') }); } else {
                res.send({ result: result, responseCode: 200, responseMessage: i18n.__("Brolix And Dollors shown successfully") });
            }
        })
    },

    "editBrolixAndDollors": function(req, res) {
         i18n = new i18n_module(req.body.lang, configs.langFile);
        var conditionType = req.params.type;
        brolixAndDollors.findOneAndUpdate({ type: conditionType }, { $set: { value: req.body.value } }, { new: true }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }); } else if (!result) { res.send({ responseCode: 404, responseMessage: i18n.__('No Brolix And Dollors found' )}); } else {
                res.send({ result: result, responseCode: 200, responseMessage: i18n.__("Brolix And Dollors updated successfully") })
            }
        })
    },

    "viewAllBrolixAndDollors": function(req, res) {
          i18n = new i18n_module(req.params.lang, configs.langFile);
        brolixAndDollors.find({}).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }); } else if (result.length == 0) { res.send({ responseCode: 500, responseMessage: i18n.__('No Brolix And Dollors found') }); } else {
                res.send({ result: result, responseCode: 200, responseMessage: i18n.__("Brolix And Dollors shown successfully") });
            }
        })
    }


}
