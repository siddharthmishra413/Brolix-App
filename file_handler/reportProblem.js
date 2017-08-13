var createNewReport = require("./model/reportProblem");
var createNewAds = require("./model/createNewAds");

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

    //API Report Problem
    "reportProblembyUser": function(req, res) {
         i18n = new i18n_module(req.body.lang, configs.langFile);
        var report = new createNewReport(req.body);
        report.save(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: i18n.__("Report submitted successfully")
                });
            }
        })
    },

    "reportProblemOnAds": function(req, res) {
         i18n = new i18n_module(req.body.lang, configs.langFile);
        var report = new createNewReport(req.body);
        report.save(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }); } else {
                var adId = req.body.adId;
                console.log("adId--->>", adId)
                createNewAds.findByIdAndUpdate({ _id: adId }, { $inc: { reportOnAd: 1 } }, { new: true }).exec(function(err, result1) {
                    console.log("result1--->>", result1)
                    if (err) { res.send({ responseCode: 500, responseMessage: i18n.__('Internal server error') }); } else if (!result1) { ressend({ responseCode: 404, responseMessage: ("No ad found") }); } else {
                        res.send({
                            result: result,
                            responseCode: 200,
                            responseMessage: i18n.__("Report submitted successfully")
                        });
                    }
                });
                // res.send({
                //     result: result,
                //     responseCode: 200,
                //     responseMessage: "Report submitted successfully."
                // });
            }
        })
    },


    "showReport": function(req, res) {
         i18n = new i18n_module(req.params.lang, configs.langFile);
        createNewReport.find({}).populate('userId').populate('adId').exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: i18n.__('Internal server error') }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: i18n.__("Report submitted successfully")
                });
            }
        })
    }
}
