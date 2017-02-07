 var createNewReport = require("./model/reportProblem");
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
                 res.send({
                     result: result,
                     responseCode: 200,
                     responseMessage: "Report submitted successfully."
                 });
             }
         })
     },

     "showReport": function(req, res){
        createNewReport.find({}).exec(function(err, result){
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
