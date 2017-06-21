var jwt = require("jsonwebtoken");
var config = require("../config");
var User = require("../file_handler/model/user.js");
module.exports.authUser = function(req, res, next) {
    var token = req.headers.servertoken;
    if (token) {

        jwt.verify(token, config.secreteKey, function(err, decoded) {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {

                req.decoded = decoded;
                User.findOne({ _id: req.decoded._id, status: "ACTIVE" }, function(err, result) {
                    if (err) {
                        res.send({
                            responseCode: 500,
                            responseMessage: 'Authentication error'
                        })
                    } else if (result) {
                        next();

                    } else if (!result) {
                        res.send({
                            responseCode: 401,
                            responseMessage: 'Authentication error'
                        })
                    }
                })
            }
        });

    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
}
