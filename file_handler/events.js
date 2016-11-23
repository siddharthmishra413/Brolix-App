var createEvents = require("./model/createEvents");

module.exports = {
    //API for create Page
    "createEvent": function(req, res) {
        var event = new createEvents(req.body);
        event.save(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                User.findByIdAndUpdate({ _id: req.body.userId }, {
                    $set: {
                        type: "Advertiser"
                    }
                }, { new: true }).exec(function(err, result) {})
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Event create successfully."
                });
            }
        })
    },

    //API for create Page
    "showAllEvents": function(req, res) {
        createEvents.find({}).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "All event show successfully."
            })
        })
    },

    //API for create Page
    "showEventDetails": function(req, res) {
        createEvents.findOne({ _id: req.params.id }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "Event details show successfully."
            })
        })
    }
}
