  var https = require('https');
  var nodemailer = require('nodemailer');
  module.exports = {
      "otp": function(req, res, mobile) {
          var possible = "0123456789";
          var otp = "";
          for (var i = 0; i < 4; i++) {
              otp += possible.charAt(Math.floor(Math.random() * possible.length));
              console.log(otp);
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

      },

      "android_notification": function(deviceToken, message) {
          var serverKey = 'AIzaSyDGz-6yYBGWStanh-DN7ljMzDATDFGA9vQ';
          var fcm = new FCM(serverKey);

          var message = {
              to: deviceToken, // required
              collapse_key: 'your_collapse_key',
              data: {
                  your_custom_data_key: 'your_custom_data_value'
              },
              notification: {
                  title: 'Hello from Brolix.',
                  body: message
              }
          };

          fcm.send(message, function(err, response) {
              if (err) {
                  console.log("Android !! Something has gone wrong!");
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
              "title": "Testing",
              "message": "Hello from Koob. We have new titles in our library. Click here to see!",
              "deviceToken": deviceToken
          };
          var title = "Hello from Brolix";
          var message = message;
          var bookname = bookname;
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
