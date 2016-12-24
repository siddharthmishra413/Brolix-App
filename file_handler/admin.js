 var validator = require('validator');
 var User = require("./model/user");
 module.exports = {
     "login": function(req, res) {
         if (!validator.isEmail(req.body.email)) res.send({ responseCode: 403, responseMessage: 'Please enter the correct email id.' });
         User.findOne({ email: req.body.email, password: req.body.password, status: 'ACTIVE', type: "ADMIN" }).exec(function(err, result) {
             if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
             if (!result) {
                 return res.send({
                     responseCode: 404,
                     responseMessage: "Sorry your id or password is incorrect."
                 });
             } else {
                 // sets a cookie with the user's info
                 req.session.user = result;
                 return res.send({
                     responseCode: 200,
                     responseMessage: "Login successfully."
                 });
             }
         })
     },

     "adminProfile": function(req, res) {
         if (req.session && req.session.user) {
             User.findOne({ email: req.session.user.email }).exec(function(err, result) {
                 if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
                 if (!result) {
                     req.session.reset();
                     //res.redirect('/login');
                 } else {
                     res.locals.user = result;
                     return res.send({
                         result: result,
                         responseCode: 200,
                         responseMessage: "Login successfully."
                     });
                     //res.render('header/manageUsers');
                 }
             })
         } else {
             return res.send({
                 responseCode: 404,
                 responseMessage: "session has been expried"
             });
             //res.redirect('/login');
         }
     }
 }
