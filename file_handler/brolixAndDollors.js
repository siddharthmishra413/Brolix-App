var brolixAndDollors = require("./model/brolixAndDollors");
var functions = require("./functionHandler");
var User = require("./model/user");


module.exports = {

    "createBrolixAndDollors": function(req, res) {
        var obj = {
            value: req.body.value,
            type: req.body.type,
            authorType: 'ADMIN'
        };
        var terms = new brolixAndDollors(obj);
        terms.save(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Value created successfully."
                });
            }
        })
    },

    "viewBrolixAndDollors": function(req, res) {
        var conditionType = req.params.type;
        brolixAndDollors.find({ type: conditionType }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 500, responseMessage: 'No terms and contions found.' }); } else {
                res.send({ result: result, responseCode: 200, responseMessage: "Brolix And Dollors shown successfully." });
            }
        })
    },

    "editBrolixAndDollors": function(req, res) {
        var conditionType = req.params.type;
        brolixAndDollors.findOneAndUpdate({ type: conditionType }, { $set: { value: req.body.value } }, { new: true }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: 'No terms and contions found.' }); } else {
                res.send({ result: result, responseCode: 200, responseMessage: "Brolix And Dollors updated successfully." })
            }
        })
    },

    "viewAllBrolixAndDollors": function(req, res) {
        brolixAndDollors.find({}).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 500, responseMessage: 'No terms and contions found.' }); } else {
                res.send({ result: result, responseCode: 200, responseMessage: "Terms and conditions shown successfully." });
            }
        })
    }


}
