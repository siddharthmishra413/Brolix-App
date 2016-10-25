var jwt = require("jsonwebtoken");
var config = require("../config");
module.exports.authUser = function (req, res, next) {
    var token = req.headers.servertoken;
    if (token) {

        jwt.verify(token, config.secreteKey, function (err, decoded) {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {

                req.decoded = decoded;
                console.log(decoded);
                next();
            }
        });

    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
}