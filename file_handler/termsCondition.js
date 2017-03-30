var TermsCondition = require("./model/termsCondition");
var functions = require("./functionHandler"); 
var User = require("./model/user");


module.exports = {

     "createTerms": function(req, res) {
         var obj = {
             userId: req.body.userId,
             termsConditionContent: req.body.termsConditionContent,
             type: req.body.type,
             type: 'ADMIN'
         };

         var terms = new TermsCondition(obj);
         terms.save(function(err, result) {
             if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                 res.send({
                     result: result,
                     responseCode: 200,
                     responseMessage: "Report submitted successfully."
                 });
             }
         })
     },

     "viewTermsCondition": function(req,res){
        TermsCondition.find({}).exec(function(err, result){
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
            else if(result.length ==0){ res.send({ responseCode: 500, responseMessage: 'No terms and contions found.' }); }
            else{
                res.send({ result: result, responseCode: 200, responseMessage: "Terms and conditions shown successfully." });
            }
        })
     },

     "editTermsCondition": function(req, res) {
        TermsCondition.findByIdAndUpdate(req.params.type,req.params.id, req.body, { new: true }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
             else if (!result) { res.send({ responseCode: 404, responseMessage: 'No terms and contions found.' }); } else {
                res.send({ result: result, responseCode: 200, responseMessage: "Terms and conditions updated successfully." })
            }
        })
    },


}
