var createEvents = require("./model/createEvents");

module.exports = {

    "createEvent": function(req, res) {
        if (!req.body.pageId) { res.send({ responseCode: 400, responseMessage: 'Please netr pageId' }); } else {
            console.log("request-->>>", JSON.stringify(req.body))
            var event = new createEvents(req.body);
            event.save(function(err, result) {
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                    res.send({
                        result: result,
                        responseCode: 200,
                        responseMessage: "Event created successfully."
                    });
                }
            })
        }
    },

    //API for create Page
    "showAllEvents": function(req, res) {
        createEvents.find({ pageId: req.params.id, status: "ACTIVE" }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "All event shown successfully."
                })
            }
        })
    },


    //API for Edit Event
    "editEvent": function(req, res) {
        createEvents.findByIdAndUpdate(req.params.id, req.body).exec(function(err, results) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                res.send({
                    result: results,
                    responseCode: 200,
                    responseMessage: "Event saved successfully."
                })
            }
        })
    },

    //API for Edit Event
    "deleteEvent": function(req, res) {
        createEvents.findByIdAndUpdate({ _id: req.body.eventId }, { $set: { status: "DELETE" } }, { new: true }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                res.send({
                    responseCode: 200,
                    responseMessage: "Event deleted successfully."
                })
            }
        })
    },

    // Show all events details
    "showEventDetails": function(req, res) {
        createEvents.findOne({ _id: req.params.id }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Event details shown successfully."
                })
            }
        })
    },

    "upCommingEvents": function(req, res) {
        createEvents.find({ pageId: req.body.pageId }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "All event shown successfully."
                })
            }

        })

    }
}
