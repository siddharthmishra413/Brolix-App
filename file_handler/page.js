var createNewPage = require("./model/createNewPage");
var User = require("./model/user");
module.exports = {

    //API for create Page
    "createPage": function(req, res) {
        createNewPage.findOne({ pageName: req.body.pageName }).exec(function(err, result) {
            if (err) throw err;
            else if (result) {
                res.send({
                    responseCode: 302,
                    responseMessage: "Page name must be unique."
                });
            } else {
                var page = new createNewPage(req.body);
                page.save(function(err, result) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                        User.findByIdAndUpdate({ _id: req.body.userId }, {
                            $set: {
                                type: "Advertiser"
                            }
                        }, { new: true }).exec(function(err, result) {})
                        res.send({
                            result: result,
                            responseCode: 200,
                            responseMessage: "Page create successfully."
                        });
                    }
                })
            }
        })
    },
    //API for Show All Pages
    "showAllPages": function(req, res) {
        createNewPage.find({ status: "ACTIVE" }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "All pages show successfully."
            })
        })
    },
    //API for Show Page Details
    "showPageDetails": function(req, res) {
        createNewPage.findOne({ _id: req.body.pageId, status: "ACTIVE" }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "Pages details show successfully."
            })
        })
    },
    //API for Business Type
    "showPageBusinessType": function(req, res) {
        createNewPage.find({ pageType: 'Business', status: "ACTIVE" }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "Pages details show successfully."
            })
        })
    },
    //API for Favourite Type
    "showPageFavouriteType": function(req, res) {
        createNewPage.find({ pageType: 'Business', status: "ACTIVE" }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "Pages details show successfully."
            })
        })
    }


}
