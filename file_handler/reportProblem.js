 var createNewPage = require("./model/reportProblem");
 module.exports = {

     //API Report Problem
     "reportProblem": function(req, res) {
         var report = new reportProblem(req.body);
         report.save(function(err, result) {
             if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                 res.send({
                     results: result,
                     responseCode: 200,
                     responseMessage: "Report submitted successfully."
                 });
             }
         })
     }
 }
