var User = require("./model/user");
var createNewAds = require("./model/createNewAds");


module.exports = {

    "showAllUser": function(req, res) {
        User.find({}, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                res.status(200).send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "successfully purchased the upgrade card"
                });

            }

        })
    },

    "winners": function(req, res) {
        createNewAds.find({}, 'winners').exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Winners details show successfully"
                })
            }
        })
    },

    "sendBrolix": function(req, res) {
        User.findOne({ _id: req.body.userId }, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }

            // if (result.brolix <= req.body.brolix) { res.send({ responseCode: 400, responseMessage: "Insufficient amount of Brolix in your account" }); } 
            else {
                //     result.brolix -= req.body.brolix;
                //     result.save();

                User.findOneAndUpdate({ _id: req.body.receiverId }, { $push: { "sendBrolixListObject": { senderId: req.body.userId, brolix: req.body.brolix } } }, { new: true }, function(err, results) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!results) res.send({ responseCode: 404, responseMessage: "please enter correct userId" });
                    else {
                        results.brolix += req.body.brolix;
                        results.save();
                        res.send({
                            responseCode: 200,
                            responseMessage: "You have successfully transfer your Brolix",
                            result: results
                        });
                    }
                });
            }
        });
    },


    "blockUser": function(req, res) {
        console.log("block user exports-->>>" + JSON.stringify(req.body));
        User.findByIdAndUpdate({ _id: req.body.userId }, { '$set': { 'status': 'BLOCK' } }, { new: true }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) return res.status(404).send({ responseMessage: "please enter correct adId" })
            else {
                res.send({
                    // result: result,
                    responseCode: 200,
                    responseMessage: "User Blocked successfully!!"
                });
            }

        });
    }


}
