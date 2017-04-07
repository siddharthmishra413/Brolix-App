var createEvents = require("./model/createEvents");

module.exports = {

    "createEvent": function(req, res) {
        console.log("request-->>>", JSON.stringify(req.body))
        var event = new createEvents(req.body);
        event.save(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Event create successfully."
                });
                // createEvents.find({ userId: req.body.userId, status: "ACTIVE" }).exec(function(err, result1) {
                //     if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
                //      else if (!result1) { res.send({ responseCode: 404, responseMessage: 'Please enter correct userId' }); } else {
                //         res.send({
                //             result: result,
                //             responseCode: 200,
                //             responseMessage: "All event show successfully."
                //         })
                //     }
                // })
            }
        })
    },

    //API for create Page
    "showAllEvents": function(req, res) {
        createEvents.find({ _id: req.params.id, status: "ACTIVE" }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "All event show successfully."
            })
        })
    },


    //API for Edit Event
    "editEvent": function(req, res) {
        createEvents.findByIdAndUpdate(req.params.id, req.body).exec(function(err, results) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
            res.send({
                result: results,
                responseCode: 200,
                responseMessage: "All event show successfully."
            })
        })
    },

    //API for Edit Event
    "deleteEvent": function(req, res) {
        createEvents.findByIdAndUpdate({ _id: req.body.eventId }, { $set: { status: "DELETE" } }, { new: true }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
            res.send({
                responseCode: 200,
                responseMessage: "Deleted."
            })
        })
    },

    // Show all events details
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
