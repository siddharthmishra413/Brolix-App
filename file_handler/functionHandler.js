  var https = require('https');
  var nodemailer = require('nodemailer');
  var FCM = require('fcm-push');
  // var apn = require('apn');
  module.exports = {
      "otp": function(req, res, mobile) {
          var possible = "123456789";
          var otp = "";
          for (var i = 0; i < 4; i++) {
              otp += possible.charAt(Math.floor(Math.random() * possible.length));
              console.log(otp);
          }
          //var otp = Math.floor(Math.random() * 10000)
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
      },

      "android_notification": function(deviceToken, message1) {
          var serverKey = 'AAAA0wDwq1I:APA91bHUyLivU-szb-z_23Ui532XPOxY0yqB07F27-HMme9Vu1psCS2TZI970av_HS1NswVHyKhX4qKoERYWmCChqY2fOVCVlZwTdudwXAk_rda5Z98z7fxK2r6kaf0o5x4cDSFzQqdc ';
          var fcm = new FCM(serverKey);
          var title="BROLIX";       
          var message={
            to: deviceToken,      
            'data.message': message1,
            'data.title':title
        };
          fcm.send(message, function(err, response) {
              if (err) {
                  console.log("Android !! Something has gone wrong!", err);
              } else {
                  console.log("Successfully sent with response: ", response);
              }
          });
      },

      "iOS_notification": function(deviceToken, message) {
          var options = {
              "cert": "MobiloitteEnterprise.pem",
              "key": "MobiloitteEnterprise.pem",
              "passphrase": "Mobiloitte1",
              //    "cert": "pushcert.pem",
              //    "key":  "pushcert.pem",
              //    "passphrase": "",
              "gateway": "gateway.push.apple.com",
              "port": 2195,
              "enhanced": true,
              "cacheLength": 5,
              "title": "Brolix",
              "message": message,
              "deviceToken": deviceToken
          };
          var title = "Brolix";
          var message = message;
          var deviceToken = deviceToken;
          var apnConnection = new apn.Connection(options);
          var myDevice = new apn.Device(deviceToken);
          var note = new apn.Notification();
          note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
          note.badge = 1;
          note.alert = message;
          note.payload = {
              "title": title,
              "message": message
          };
          try {
              apnConnection.pushNotification(note, myDevice);
          } catch (ex) {
              console.log(ex);
          }
          console.log('iOS Push Notification send');
      }

  }
