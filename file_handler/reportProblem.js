var createNewReport = require("./model/reportProblem");
var createNewAds = require("./model/createNewAds");
module.exports = {

    //API Report Problem
    "reportProblembyUser": function(req, res) {
        var report = new createNewReport(req.body);
        report.save(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Report submitted successfully."
                });
            }
        })
    },

    "reportProblemOnAds": function(req, res) {
         var report = new createNewReport(req.body);
         report.save(function(err, result) {
             if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                 var adId = req.body.adId;
                 console.log("adId--->>", adId)
                 createNewAds.findByIdAndUpdate({ _id: adId }, { $inc: { reportOnAd: 1 } }, { new: true }).exec(function(err, result1) {
                     console.log("result1--->>", result1)
                     if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result1) { ressend({ responseCode: 404, responseMessage: "No ad found" }); } else {
                         res.send({
                             result: result,
                             responseCode: 200,
                             responseMessage: "Ad edit."
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
        createNewReport.find({}).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Report submitted successfully."
                });
            }

        })
    }
}
