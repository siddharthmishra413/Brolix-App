  var https = require('https');
  var nodemailer = require('nodemailer');
  module.exports = {
      "otp": function(req, res, mobile) {
          var otp = Math.floor(Math.random() * 10000)
          var data = JSON.stringify({
              api_key: '71414445',
              api_secret: '49e5f9fe2864877f',
              to: '+91' + mobile,
              from: '+917417773034',
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
