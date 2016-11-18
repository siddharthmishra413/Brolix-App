var createNewPage = require("./model/createNewPage");
var User = require("./model/user");
 module.exports = {

     //API for create Page
     "createPage": function(req, res) {
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
     },
     //API for create Page
     "showAllPages": function(req, res) {
         createNewPage.find({}).exec(function(err, result) {
             if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
             res.send({
                 result: result,
                 responseCode: 200,
                 responseMessage: "All pages show successfully."
             })
         })
     },

     //API for create Page
     "showPageDetails": function(req, res) {
         createNewPage.findOne({ _id: req.body.pageId }).exec(function(err, result) {
             if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
             res.send({
                 result: result,
                 responseCode: 200,
                 responseMessage: "Pages details show successfully."
             })
         })
     }


 }		