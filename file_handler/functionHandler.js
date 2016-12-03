  var https = require('https');
  var nodemailer = require('nodemailer');
  module.exports = {
      "otp": function(req, res, mobile) {
        var possible = "0123456789";
        var otp="";
       for (var i = 0; i < 4; i++){
       otp+=  possible.charAt(Math.floor(Math.random() * possible.length)); console.log(otp);
        }
          var otp = Math.floor(Math.random() * 10000)
          var data = JSON.stringify({
              api_key: '0ec05def',
              api_secret: '48fbcc6a6fedbcaa',
              to: '+91' + mobile,
              from: '917011911324',
              text: 'You have been registerd ' + otp + ' OTP'
          });
          var options = {
              host: 'rest.nexmo.com',
              path: '/sms/json',
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Content-Length': Buffer.byteLength(data)
              }
          };
          var request = https.request(options);
          request.write(data);
          request.end();
          return otp;
          console.log("-------Your OTP------" + otp)
      },

      "mail": function(email, massege, otp) {
          var transporter = nodemailer.createTransport({
              service: 'Gmail',
              auth: {
                  user: "dixitjorden@gmail.com",
                  pass: "8090404689"
              }
          });
          var to = email
          var mailOption = {
              from: "testing.mobiloitte@gmail.com",
              to: email,
              subject: 'Brolix',
              text: 'you have a new submission with following details',
              html: massege + "-" + otp
                  // "Your otp is :"
          }
          console.log("data in req" + email);
          console.log("Dta in mailOption : " + JSON.stringify(mailOption));
          transporter.sendMail(mailOption, function(error, info) {
              if (error) {
                  console.log("internal server error");
              }

          });

      }
  }
