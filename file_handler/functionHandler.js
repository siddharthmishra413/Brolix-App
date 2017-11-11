  var https = require('https');
  var nodemailer = require('nodemailer');
  var FCM = require('fcm').FCM;
  var config = require("../config.js")
  console.log("secreteKey-->>>", config.secreteKey)
  var apn = require('apn');
  module.exports = {

      // send otp function
      "otp": function(mobile, msg_body) {
          var possible = "123456789";
          var otp = "";
          for (var i = 0; i < 4; i++) {
              otp += possible.charAt(Math.floor(Math.random() * possible.length));
              console.log(otp);
          }
          var send_msg_body = msg_body ? msg_body : 'You have been registerd ' + otp + ' OTP'
          //var otp = Math.floor(Math.random() * 10000)
          var data = JSON.stringify({
              api_key: '0ec05def',
              api_secret: '48fbcc6a6fedbcaa',
              to: '+91' + mobile,
              from: '917011911324',
              text: send_msg_body
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

      // send emial function
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

      // send android notification function
      "android_notification": function(deviceToken, message1, senderId, senderName, chatType) {
          console.log("android_notification-->>>", message1)
           console.log("senderId-->>>", senderId)
           console.log("senderName-->>>", senderName)
          var serverKey = 'AAAA0wDwq1I:APA91bHUyLivU-szb-z_23Ui532XPOxY0yqB07F27-HMme9Vu1psCS2TZI970av_HS1NswVHyKhX4qKoERYWmCChqY2fOVCVlZwTdudwXAk_rda5Z98z7fxK2r6kaf0o5x4cDSFzQqdc ';
          var fcm = new FCM(serverKey);
          var message = {
              to: deviceToken,
              'data.sound':"default", 
              'data.message': message1,
                "title": "Brolix",
              'data.type': chatType
          };
          console.log("message android--->>>", message)
          fcm.send(message, function(err, response) {
              if (err) {
                  console.log("Android !! Something has gone wrong!", err);
              } else {
                  console.log("Successfully sent with response: ", response);
              }
          });
      },

      // send ios notification function
      "iOS_notification": function(deviceToken, message, senderId, senderName, chatType) {
          console.log("iOS_notification-->>>", message)
          console.log("senderId-->>>", senderId)
           console.log("senderName-->>>", senderName)
          var options = {
              "cert": config.iOSPemFile,
              "key": config.iOSPemFile,
              "passphrase": "brolix",
              "gateway": "gateway.push.apple.com",
              "port": 2195,
              "enhanced": true,
              "cacheLength": 5,
              "title": "Brolix",
              "message": "Hello from Brolix. Here is a message for you!!",
          };
          var title = "Brolix";
          var message = message;
          var chatType = chatType;
          var apnConnection = new apn.Connection(options);
          var myDevice = new apn.Device(deviceToken);
          var note = new apn.Notification();
          console.log("mydevice-1111-->>>", myDevice)
          //note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
          note.badge = 1;
          note.alert = message;
          note.sound = 'default';
          note.payload = { title: title, message: message, type: chatType };
          try {
              apnConnection.pushNotification(note, myDevice);
              console.log('iOS Push Notification send');
          } catch (ex) {
              console.log("Error in push notification-- ", ex);
          }
      },

  }