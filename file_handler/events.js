var createEvents = require("./model/createEvents");

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

     // api to ceate event on pages
    "createEvent": function(req, res) {
            i18n = new i18n_module(req.body.lang, configs.langFile);
        if (!req.body.pageId) {
            res.send({
                responseCode: 400,
                responseMessage: 'Please enter pageId'
            });
        } else {
            var event = new createEvents(req.body);
            event.save(function(err, result) {
                if (err) {
                    res.send({
                        responseCode: 500,
                        responseMessage: 'Internal server error'
                    });
                } else {
                    res.send({
                        result: result,
                        responseCode: 200,
                        responseMessage: i18n.__("Event created successfully")
                    });
                }
            })
        }
    },

    //show list of all events on a page
    "showAllEvents": function(req, res) {
            i18n = new i18n_module(req.params.lang, configs.langFile);
        createEvents.find({
            pageId: req.params.id,
            status: "ACTIVE"
        }).exec(function(err, result) {
            if (err) {
                res.send({
                    responseCode: 409,
                    responseMessage: 'Internal server error'
                });
            } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: i18n.__("All event shown successfully")
                })
            }
        })
    },


    //API for Edit Event
    "editEvent": function(req, res) {
            i18n = new i18n_module(req.body.lang, configs.langFile);
        createEvents.findByIdAndUpdate(req.params.id, req.body).exec(function(err, results) {
            if (err) {
                res.send({
                    responseCode: 409,
                    responseMessage: 'Internal server error'
                });
            } else {
                res.send({
                    result: results,
                    responseCode: 200,
                    responseMessage: i18n.__("Event saved successfully")
                })
            }
        })
    },

    //API for delete Event
    "deleteEvent": function(req, res) {
            i18n = new i18n_module(req.body.lang, configs.langFile);
        createEvents.findByIdAndUpdate({
            _id: req.body.eventId
        }, {
            $set: {
                status: "DELETE"
            }
        }, {
            new: true
        }).exec(function(err, result) {
            if (err) {
                res.send({
                    responseCode: 409,
                    responseMessage: 'Internal server error'
                });
            } else {
                res.send({
                    responseCode: 200,
                    responseMessage: i18n.__("Event deleted successfully")
                })
            }
        })
    },

    // Show all events details
    "showEventDetails": function(req, res) {
            i18n = new i18n_module(req.params.lang, configs.langFile);
        createEvents.findOne({
            _id: req.params.id
        }).exec(function(err, result) {
            if (err) {
                res.send({
                    responseCode: 409,
                    responseMessage: 'Internal server error'
                });
            } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: i18n.__("Event details shown successfully")
                })
            }
        })
    },

     // show list of all upcoming events on a page
    "upCommingEvents": function(req, res) {
            i18n = new i18n_module(req.body.lang, configs.langFile);
        var startTime = new Date().toUTCString();
        var h = new Date(new Date(startTime).setHours(00)).toUTCString();
        var m = new Date(new Date(h).setMinutes(00)).toUTCString();
        var s = Date.now(m)
        createEvents.find({ pageId: req.body.pageId, "status" : "ACTIVE"}).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409,responseMessage: 'Internal server error' }); } 
            else {
                var eventArray = [];
                var currentTime = new Date().getTime();
                for (var i = 0; i < result.length; i++) {
                        if (s < result[i].eventStartTime) {
                        eventArray.push(result[i]._id)
                    }
                }
                createEvents.find({
                    _id: {
                        $in: eventArray
                    }
                }).exec(function(err, result1) {
                    if (err) {
                        res.send({
                            responseCode: 409,
                            responseMessage: 'Internal server error'
                        });
                    } else if (result1.length == 0) {
                        res.send({
                            responseCode: 400,
                            responseMessage: 'No event found.'
                        })
                    } else {
                        res.send({
                            result: result1,
                            responseCode: 200,
                            responseMessage: i18n.__("Event details shown successfully")
                        })
                    }
                })
            }
        })
    }
}
