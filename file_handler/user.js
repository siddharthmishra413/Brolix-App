var User = require("./model/user");
var createNewAds = require("./model/createNewAds");
var functions = require("./functionHandler");
var chat = require("./model/chatModel")
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var config = require('../config');
var cc = require('coupon-code');
var voucher_codes = require('voucher-code-generator');
var paypal = require('paypal-rest-sdk');
var waterfall = require('async-waterfall');
var validator = require('validator');
var cloudinary = require('cloudinary');
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })
var country = require('countryjs');
var cron = require('node-cron');
var yeast = require('yeast');
var followerList = require("./model/followersList");
var paypalPayment = require("./model/payment");
var Brolixanddollors = require("./model/brolixAndDollors");
var mongoose = require('mongoose');
var Twocheckout = require('2checkout-node');

cloudinary.config({
    cloud_name: 'mobiloitte-in',
    api_key: '188884977577618',
    api_secret: 'MKOCQ4Dl6uqWNwUjizZLzsxCumE'
});


var avoid = {
    "password": 0
}

//brintree Integration
var braintree = require("braintree");

var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: "hncxrnbt5fh2c2cr",
    publicKey: "xjhcfhbmqszj6rcx",
    privateKey: "f3ffe3376878b6d1a0eff16c9099127d"
});

///////////////////////////////////////////////////////
var sha512 = require('js-sha512');
var querystring = require('querystring');
var https = require('https');

var marchentKey = "gtKFFx";
var txnid = '4945398';
var amount = 1000;
var productinfo = 'Product 1';
var firstname = 'sakshi';
var email = 'sakshigadia1994@gmail.com';
var phone = '9015426958';
var surl = 'http://localhost/success';
var furl = 'http://localhost/fail';
var service_provider = 'payu_paisa';
var salt = 'eCwWELxi';
var string = marchentKey + '|' + txnid + '|' + amount + '|' + productinfo + '|' + firstname + '|' + email + '|||||||||||' + salt;
var data1 = querystring.stringify({
    marchentKey: "gtKFFx",
    txnid: '4945398',
    amount: 1000,
    productinfo: 'Product 1',
    firstname: 'sakshi',
    email: 'sakshigadia1994@gmail.com',
    phone: '9015426958',
    surl: 'http://localhost/success',
    furl: 'http://localhost/fail',
    service_provider: 'payu_paisa',
    salt: 'eCwWELxi',
    hash: sha512(string)
})
var MassPay = require('node-paypal-masspayments')

var paytabs = require('paytabs');

var optionsNew = {
    'Content-Type': 'application/json',
    hostname: 'test.payumoney.com',
    port: 443,
    path: '/payment/payment/createPayment' + data1,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data1),
        'content': data1,
        'accept': '*/*'
    }
};

var Paypal = require('paypal-adaptive');

var paypalSdk = new Paypal({
    userId: 'prashant.dwivedi-facilitator_api1.mobiloitte.com',
    password: '965ZNT59L9JKEZ5N',
    signature: 'AiPC9BjkCyDFQXbSkoZcgqH3hpacAv24ACqokwcC-LOvDidqgZgRZ8rS',
    sandbox: true //defaults to false
});

module.exports = {

    "success": function(req, res) {
        var params = {
            payKey: 'AP-1WT665016G226315H'
        };
        var payKey = 'AP-1WT665016G226315H'
            // Or the transactionId
            // var params = {
            //     transactionId: 'AP-1234567890'
            // };
            // // Or the trackingId
            // var params = {
            //     trackingId: 'AP-1234567890'
            // };

        // paypalSdk.paymentDetails(params, function (err, response) {
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         // payments details for this payKey, transactionId or trackingId
        //         console.log("success==>>"+JSON.stringify(response));
        //     }
        // });


        var paymentId = req.session.paymentId;
        var payerId = 'AP-1WT665016G226315H'

        var details = { "payer_id": payerId };
        paypal.payment.execute(paymentId, details, function(error, payment) {
            if (error) {
                console.log(error);
            } else {
                res.send("Hell yeah!");
            }
        });

        // paypalSdk.getPaymentOptions(payKey, function (err, response) {
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         // payments options for this payKey
        //         console.log(response);
        //     }
        // });

    },

    "paynow": function(req, res) {
        console.log("sakshi")

        //   var requestData = {
        //       requestEnvelope: {
        //           errorLanguage:  'en_US',
        //           detailLevel:    'ReturnAll'
        //       },
        //       payKey: 'AP-8TF499834C5223057'
        //   };

        //   paypalSdk.callApi('AdaptivePayments/PaymentDetails', requestData, function (err, response) {
        //     if (err) {
        //         // You can see the error 
        //         console.log(err);
        //         //And the original Paypal API response too 
        //         console.log(response);
        //     } else {
        //         // Successful response :
        //         console.log(response);
        //         console.log(JSON.stringify(response.paymentInfoList.paymentInfo));
        //     }
        // });

        var trackingId;


        var payload = {
            requestEnvelope: {
                errorLanguage: 'en_US'
            },
            actionType: 'PAY',
            currencyCode: 'USD',
            feesPayer: 'EACHRECEIVER',
            memo: 'Chained payment example',
            cancelUrl: 'http://test.com/cancel',
            returnUrl: 'http://localhost:1406/users/successs',

            transactions: {

            },

            receiverList: {
                receiver: [{
                    email: 'primary@test.com',
                    amount: '50.00',
                    primary: 'true',
                    trackingId: "123456789"
                }, {
                    email: 'secondary@test.com',
                    amount: '10.00',
                    primary: 'false',
                    trackingId: "123456789"
                }]
            }
        };
        // paypalSdk.pay(payload, function (err, response) {
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         // Response will have the original Paypal API response 
        //         console.log(response);
        //         // But also a paymentApprovalUrl, so you can redirect the sender to checkout easily 
        //         console.log('Redirect to %s', response.paymentApprovalUrl);
        //     }
        // });

        // paypalSdk.payment.create(payload, config_opts, function (err, res) {
        //     if (err) {
        //         throw err;
        //     }

        //     if (res) {
        //         console.log("Create Payment Response");
        //         console.log(res);
        //     }
        // });
        paypalSdk.pay(payload, function(err, response) {
            if (err) {
                console.log(err);
            } else {
                // Response will have the original Paypal API response
                console.log(response);
                // But also a paymentApprovalUrl, so you can redirect the sender to checkout easily
                console.log('Redirect to %s', response.paymentApprovalUrl);
                //res.redirect(redirectUrl);
                if (response.payKey) {
                    // req.paymentId = payment.id;
                    var redirectUrl;
                    console.log("payment", response.payKey);
                    // for(var i=0; i < payment.links.length; i++) {
                    var link = response.paymentApprovalUrl;
                    console.log(link)
                        // if (link.method === 'REDIRECT') {
                    redirectUrl = link;
                    // }
                    console.log(redirectUrl)

                    var requestData = {
                        requestEnvelope: {
                            errorLanguage: 'en_US',
                            detailLevel: 'ReturnAll'
                        },
                        payKey: response.payKey
                    };

                    paypalSdk.callApi('AdaptivePayments/PaymentDetails', requestData, function(err, response) {
                        if (err) {
                            // You can see the error 
                            console.log(err);
                            //And the original Paypal API response too 
                            console.log(response);
                        } else {
                            // Successful response :
                            console.log(response);
                            // console.log(response.paymentInfoList.);
                            console.log(JSON.stringify(response.paymentInfoList.paymentInfo));
                        }
                    });
                    res.redirect(redirectUrl);
                }
            }
        });
    },

    "massPay": function(req, res) {

        var mp = new MassPay({
            pwd: "QN3GR5N6JAV6A22H",
            user: "robinsuraj-facilitator_api1.gmail.com",
            signature: "AFcWxV21C7fd0v3bYYYRCpSSRl31AUdr.q6iklhOMRLo-CjEkoGuwBUD",
            emailsubject: "robinsuraj@gmail.com"
        });

        // var mp = new MassPay({
        //     pwd: "X3NRSJQBL7FD5ZF9",
        //     user: "sakshigadia1994-1_api1.gmail.com",
        //     signature: "AFcWxV21C7fd0v3bYYYRCpSSRl31AhdXmittmmHtZ5I4YwBzIxOQHk3x",
        //     emailsubject: "rinku.kumar@mobiloitte.in"
        // });

        var paymentRequests = [{
            email: 'robinsuraj@gmail.com',
            amount: '1',
            uniqueId: '12345',
            note: 'request for matt@gc'
        }, {
            email: 'rinku.kumar@mobiloitte.in',
            amount: '1',
            uniqueId: '123456',
            note: 'request for tim@gc'
        }];

        var batch = new MassPay.PaymentBatch(paymentRequests);

        mp.pay(batch, function(err, results) {
            if (err) {
                console.log("error", err)
                res.send({
                    err: err
                })
            }
            console.log("results=>", results)
                //assert.equal(results.ACK, 'Success')
        });
    },

    "massPay": function(req, res) {

        var mp = new MassPay({
            pwd: "QN3GR5N6JAV6A22H",
            user: "robinsuraj-facilitator_api1.gmail.com",
            signature: "AFcWxV21C7fd0v3bYYYRCpSSRl31AUdr.q6iklhOMRLo-CjEkoGuwBUD",
            emailsubject: "robinsuraj@gmail.com"
        });

        // var mp = new MassPay({
        //     pwd: "X3NRSJQBL7FD5ZF9",
        //     user: "sakshigadia1994-1_api1.gmail.com",
        //     signature: "AFcWxV21C7fd0v3bYYYRCpSSRl31AhdXmittmmHtZ5I4YwBzIxOQHk3x",
        //     emailsubject: "rinku.kumar@mobiloitte.in"
        // });

        var paymentRequests = [{
            email: 'robinsuraj@gmail.com',
            amount: '1',
            uniqueId: '12345',
            note: 'request for matt@gc'
        }, {
            email: 'rinku.kumar@mobiloitte.in',
            amount: '1',
            uniqueId: '123456',
            note: 'request for tim@gc'
        }];

        var batch = new MassPay.PaymentBatch(paymentRequests);

        mp.pay(batch, function(err, results) {
            if (err) {
                console.log("error", err)
                res.send({
                    err: err
                })
            }
            console.log("results=>", results)
                //assert.equal(results.ACK, 'Success')
        });
    },


    "getCash": function(req, res) {

        var mp = new MassPay({
            pwd: "QN3GR5N6JAV6A22H",
            user: "robinsuraj-facilitator_api1.gmail.com",
            signature: "AFcWxV21C7fd0v3bYYYRCpSSRl31AUdr.q6iklhOMRLo-CjEkoGuwBUD",
            emailsubject: "robinsuraj@gmail.com"
        });

        // var mp = new MassPay({
        //     pwd: "X3NRSJQBL7FD5ZF9",
        //     user: "sakshigadia1994-1_api1.gmail.com",
        //     signature: "AFcWxV21C7fd0v3bYYYRCpSSRl31AhdXmittmmHtZ5I4YwBzIxOQHk3x",
        //     emailsubject: "rinku.kumar@mobiloitte.in"
        // });

        var unixname = "BROLIX" + Date.now();
        var paymentRequests = [{
                email: req.body.paypalEmail,
                amount: req.body.amount,
                uniqueId: unixname,
                note: 'request for matt@gc'
            }
            // , {
            //     email: 'rinku.kumar@mobiloitte.in',
            //     amount: '1',
            //     uniqueId: '123456',
            //     note: 'request for tim@gc'
            // }
        ];

        var batch = new MassPay.PaymentBatch(paymentRequests);

        // mp.pay(batch, function(err, results) {
        //     if (err) {
        //         console.log("error", err)
        //         res.send({
        //             err: err
        //         })
        //     }
        //     console.log("results=>", results)
        //         //assert.equal(results.ACK, 'Success')
        // });


        User.findOne({ _id: req.body.userId }).exec(function(err, user) {
            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!user) { res.send({ responseCode: 404, responseMessage: "User not found." }); } else {
                console.log("user", user)
                waterfall([
                    function(callback) {
                        if (user.cash >= req.body.amount) {
                            mp.pay(batch, function(err, results) {
                                if (err) {
                                    console.log("error", err)
                                    res.send({
                                        responseCode: 404,
                                        responseMessage: "Insufficent balance on admin account."
                                    })
                                } else {
                                    console.log("mass pay results=>", results)
                                    callback(null, results)
                                }
                                //assert.equal(results.ACK, 'Success')
                            });
                        } else {
                            res.send({ responseCode: 404, responseMessage: "Please enter valid amount." });
                        }
                    },
                    function(results, callback) {
                        var cashAmount = user.cash - req.body.amount;
                        User.findByIdAndUpdate({ _id: req.body.userId }, { $set: { cash: cashAmount } }, function(err, userRes) {
                            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!userRes) { res.send({ responseCode: 404, responseMessage: "Something went wrong." }); } else {
                                //  res.send({ responseCode: 200, responseMessage: "Success.", result:results });
                                callback(null, userRes, results)
                            }
                        })
                    },
                    function(response, paymentResults, callback) {
                        var details = {
                            paymentMode: "getCash",
                            userId: req.body.userId,
                            amount: req.body.amount,
                            //  paymentAmount: value.paymentAmount,
                            dates: req.body.date,
                            // brolixAmount: value.brolixAmount,
                            transcationId: paymentResults.CORRELATIONID,
                            Type: "getCash"
                        }
                        var payment = new Payment(details);
                        payment.save(function(err, paymentResult) {
                            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!paymentResult) { res.send({ responseCode: 404, responseMessage: "Something went wrong." }); } else {
                                callback(null, paymentResult)
                            }
                        })
                    },
                ], function(err, result) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "Something went wrong." }); } else {
                        res.send({ responseCode: 200, responseMessage: "Successfully get cash amount." });
                    }
                })
            }
        })

        // waterfall([
        //     function(callback){

        //         User.findByIdAndUpdate({ _id: req.body.userId }, { $set: {cash: cashAmount} }, function(err, userRes) {
        //             if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } 
        //             else if (!userRes) { res.send({ responseCode: 404, responseMessage: "Something went wrong." }); } 
        //             else {
        //                 callback(null, userRes)
        //             }
        //         })

        //     },
        //     function(callback){

        //     }
        // ])
    },

    "validatorPaytabs": function(req, res) {

        var createPayPage = new Object()
        createPayPage.merchant_email = 'sakshigadia@gmail.com';
        createPayPage.paytabs_url = 'https://www.paytabs.com/apiv2/';
        createPayPage.secret_key = "jwjn4lgU2sZqPqsB2Da3zNJIJwaUX8mgFGDJ2UE5nEvc4XO7BYaaMTSwq3qncNDRthAvbeAyT6LX3z4EyfPk8HQzLhWX4AOyRp42";
        createPayPage.site_url = "http://localhost:8082";
        createPayPage.return_url = "http://localhost:8082";
        createPayPage.title = "some title";
        createPayPage.cc_first_name = "ALGHABBAn";
        createPayPage.cc_last_name = "ALGHABBAN";
        createPayPage.cc_phone_number = "996";
        createPayPage.phone_number = "50000000";
        createPayPage.email = "clinet@outlook.com";
        createPayPage.products_per_title = "some title";
        createPayPage.unit_price = 150;
        createPayPage.quantity = "1";
        createPayPage.other_charges = 0;
        createPayPage.amount = 150;
        createPayPage.discount = 0;
        createPayPage.currency = "AED";
        createPayPage.reference_no = "21873109128";
        createPayPage.ip_customer = "192.168.1.1";
        createPayPage.ip_merchant = "192.168.1.1";
        createPayPage.billing_address = "Flat 11 Building 222 Block 333 Road 444 Riydh";
        createPayPage.state = "Riydh";
        createPayPage.city = "Riydh";
        createPayPage.postal_code = "12345";
        createPayPage.country = "ARE";
        createPayPage.shipping_first_name = "Clinicarea";
        createPayPage.shipping_last_name = "app";
        createPayPage.address_shipping = "Flat abc road 123";
        createPayPage.city_shipping = "Riydh";
        createPayPage.state_shipping = "Riydh";
        createPayPage.postal_code_shipping = "403129";
        createPayPage.country_shipping = "SAU";
        createPayPage.msg_lang = "ar";
        createPayPage.cms_with_version = "1.0.0";

        paytabs.CreatePayPage(createPayPage, function(response) {
            console.log("paytabs", response);
        });
        //         paytabs.ValidateSecretKey("sakshigadia@gmail.com", "jwjn4lgU2sZqPqsB2Da3zNJIJwaUX8mgFGDJ2UE5nEvc4XO7BYaaMTSwq3qncNDRthAvbeAyT6LX3z4EyfPk8HQzLhWX4AOyRp42", function(response){
        //   console.log(response);
        // });

        // paytabs.ValidateSecretKey("sakshigadia@gmail.com", "jwjn4lgU2sZqPqsB2Da3zNJIJwaUX8mgFGDJ2UE5nEvc4XO7BYaaMTSwq3qncNDRthAvbeAyT6LX3z4EyfPk8HQzLhWX4AOyRp42", function(response){
        //   console.log(response);
        // });

    },




    "createToken": function(req, res) {
        var tco = new Twocheckout({
            sellerId: "901347468",
            publishableKey: "0669EFD3-B132-4568-B2DB-494235857D4E",
            ccNo: 4000000000000002,
            cvv: 123,
            expMonth: 01,
            expYear: 2024
        });

        Twocheckout.loadPubKey('sandbox');
        // Twocheckout.loadPubKey('production', function() {
        //     Twocheckout.requestToken(successCallback, errorCallback, args);
        // })
    },

    "Twocheckout": function(req, res) {
        var tco = new Twocheckout({
            sellerId: "901349538",
            privateKey: "EDEF9BC9-718C-4391-A3F9-8FC34FA527FD",
            sandbox: true // #Uncomment to use Sandbox
        });

        var params = {
            "merchantOrderId": "123",
            "token": "MDExOTE4MzktZjY1ZS00MGIwLTkyNmEtZDc3YThjNjY4ZTdh",
            "currency": "USD",
            "total": "10.00",
            "billingAddr": {
                "name": "Testing Tester",
                "addrLine1": "123 Test St",
                "city": "Columbus",
                "state": "Ohio",
                "zipCode": "43123",
                "country": "USA",
                "email": "example@2co.com",
                "phoneNumber": "5555555555"
            }
        };

        tco.checkout.authorize(params, function(error, data) {
            if (error) {
                console.log(error);
            } else {
                console.log(JSON.stringify(data));
            }
        });



        // var tco = new Twocheckout({
        //     sellerId: "901342356",
        //     privateKey: "0BB89296-9BF8-4F70-9FD6-370D8FB016BC",
        //     //publishableKey: "521B76B5-72A0-4CC0-B643-946ACE46B281",
        //     sandbox: true //#Uncomment to use Sandbox
        // });


        // var params = {
        //     "merchantOrderId": "1237",
        //     "token": "MzljYmU2MDItOTQ5MC00MmYyLWExMjEtZWQ0MzY5MzkwNmU2",
        //     "currency": "USD",
        //     "total": "10.00",
        //     "billingAddr": {
        //         "name": "Joe Flagster",
        //         "addrLine1": "123 Main Street",
        //         "city": "Townsville",
        //         "state": "Ohio",
        //         "zipCode": "43206",
        //         "country": "USA",
        //         "email": "example@2co.com",
        //         "phoneNumber": "8853735932"
        //     }
        // };

        // tco.checkout.authorize(params, function(error, data) {
        //     console.log("Fg")
        //     if (error) {
        //         console.log("error")
        //         console.log(error);
        //     } else {
        //                         console.log(JSON.stringify(data));

        //         res.send({

        //         })
        //         console.log("success")
        //         console.log(JSON.stringify(data));
        //     }
        // });

    },


    //////////////////////////////////////////////////////////////////
    //////////////////////////////payU////////////////////////////////

    "payU": function(request, response) {
        console.log(data);
        var req = https.request(options, function(res) {
            console.log("res" + res);

            res.setEncoding('utf8');
            res.on('data', function(chunk) { // data will be available in callback 
                console.log("body: " + chunk);
            });
        });
        req.on('error', function(e) {
            console.log('Error' + e.message);
        });
        req.write(data);
        req.end();
    },

    "paydU": function(request, response) {
        //     var querystring = require('querystring'); 
        // var http = require('https'); 

        var data = querystring.stringify({
            merchantKey: "BBF7oOWI",
            merchantTransactionIds: "4945362"
        });
        var options = {
            hostname: 'https://test.payu.in/_payment',
            port: 443,
            path: '/payment/op/getPaymentResponse?' + data,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data),
                'content': data,
                'accept': '*/*'
            }
        };

        var req = https.request(options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function(chunk) { // data will be available in callback 
                console.log("body: " + chunk);
            });
        });
        req.on('error', function(e) {
            console.log('Error' + e.message);
        });
        req.write(data);
        req.end();
    },

    ////////////////////////////////////////////////////////////////////

    "paymentClientToken": function(req, res) {
        gateway.clientToken.generate({}, function(err, response) {
            console.log(response)
            responseHandler.apiResponder(req, res, 200, "success", response.clientToken)
        });
    },

    "paymentIntegration": function(req, res) {
        waterfall([
            function(callback) {
                var nextPay;
                var amount = req.body.amount;
                var serviceFee = amount / 10;
                var transactionCost = amount * (2.9 / 100) + 0.30;
                merchantAccountParams = {
                    individual: {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        phone: req.body.phoneNumber,
                        dateOfBirth: req.body.dateOfBirth,
                        //ssn: "456-45-4567",
                        address: {
                            streetAddress: req.body.address.streetAddress,
                            locality: req.body.address.locality,
                            region: req.body.address.region,
                            postalCode: req.body.address.postalCode
                        }
                    },
                    funding: {
                        descriptor: "Sub merchantAccount",
                        destination: braintree.MerchantAccount.FundingDestination.Bank,
                        email: req.body.email,
                        mobilePhone: req.body.phoneNumber,
                        accountNumber: req.body.accountNumber,
                        routingNumber: req.body.routingNumber
                    },
                    tosAccepted: true,
                    masterMerchantAccountId: "mobiloitte"
                };
                //console.log("nextpay in out merchant==>>"+nextPay)
                gateway.merchantAccount.create(merchantAccountParams, function(err, resultss) {
                    console.log(resultss);
                    console.log("merchantAccount=====>>>", resultss.merchantAccount.id);
                    //  console.log("nextpay in create merchant==>>"+nextPay)
                    callback(null, resultss);

                });
                //   }
                // })
            },
            function(resultss, callback) {
                var amount = req.body.amount;
                var serviceFee = amount / 10;
                console.log("amount=====>>>", amount);
                console.log("serviceFee=====>>>", serviceFee);
                console.log("merchantAccount=====>>>", resultss.merchantAccount.id);
                gateway.transaction.sale({
                    merchantAccountId: resultss.merchantAccount.id,
                    amount: amount,
                    paymentMethodNonce: req.body.paymentMethodNonce,
                    serviceFeeAmount: serviceFee,
                    options: {
                        submitForSettlement: true
                    }
                }, function(err, results) {
                    if (err) {
                        res.send({
                            responseCode: 302,
                            responseMessage: 'error.',
                            result: err
                        });
                    } else if (results.errors) {
                        res.send({
                            responseCode: 404,
                            responseMessage: 'not found.'
                                // result: result
                        });
                    } else {
                        res.send({
                            responseCode: 200,
                            responseMessage: 'Successfully.',
                            result: results
                        });
                    }
                })
            },

        ], function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                res.send({
                    responseCode: 200,
                    responseMessage: 'Successfully.',
                    result: result
                });
            }
        })
    },
    // "paymentIntegration": function(req, res){

    // },

    "signup": function(req, res) {
        console.log("data--************->>", req.body)
        waterfall([
            function(callback) {
                if (!req.body.email) { res.send({ responseCode: 403, responseMessage: 'Email required' }); } else if (!req.body.password) { res.send({ responseCode: 403, responseMessage: 'password required' }); } else if (!req.body.gender) { res.send({ responseCode: 403, responseMessage: 'gender required' }); } else if (!req.body.dob) { res.send({ responseCode: 403, responseMessage: 'dob required' }); } else if (!validator.isEmail(req.body.email)) { res.send({ responseCode: 403, responseMessage: 'Please enter the correct email id.' }); } else {
                    User.findOne({ email: req.body.email }, function(err, result) {
                        console.log("result-->>", result)
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result) { res.send({ responseCode: 401, responseMessage: "Email id must be unique." }); } else {

                            if (req.body.haveReferralCode == true) {
                                console.log("in if")
                                User.findOne({ referralCode: req.body.referredCode }, function(err, user) {
                                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!user) { res.send({ responseCode: 400, responseMessage: 'Please enter valid referralcode' }); } else {
                                        Brolixanddollors.find({ "type": "brolixForInvitation" }).exec(function(err, data) {
                                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                                                console.log("data-->>", data)
                                                var amount = data[0].value;
                                                User.findOne({ referralCode: req.body.referredCode }).exec(function(err, result2) {
                                                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                                                        result2.brolix = +amount;
                                                        result2.save();
                                                        req.body.brolix = amount;
                                                        callback(null)
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            } else {
                                callback(null)
                            }
                        }
                    })
                }
            },
            function(callback) {
                if (!req.body.country) { res.send({ responseCode: 403, responseMessage: 'country required' }); } else if (!req.body.city) { res.send({ responseCode: 403, responseMessage: 'city required' }); } else if (!req.body.mobileNumber) { res.send({ responseCode: 403, responseMessage: 'MobileNumber required' }); } else if (!req.body.countryCode) { res.send({ responseCode: 403, responseMessage: 'Country code required' }) } else {
                    if (!validator.isNumeric((req.body.mobileNumber).toString())) { res.send({ responseCode: 403, responseMessage: "Mobile number must be numeric" }); } else if (!validator.isLength((req.body.mobileNumber).toString(), { min: 9, max: 12 })) { res.send({ responseCode: 403, responseMessage: "Mobile number length must be 9 to 12." }); } else {
                        User.findOne({ mobileNumber: req.body.mobileNumber, countryCode: req.body.countryCode }, function(err, result1) {
                            console.log("result1-->>", result1)
                            console.log("3")
                            if (err) { res.send({ responseCode: 403, responseMessage: 'Internal server error' }); } else if (result1) { res.send({ responseCode: 401, responseMessage: "Mobile number must be unique." }) } else {
                                callback(null)
                            }
                        })
                    }
                }
            },
            function(callback) {
                req.body.otp = functions.otp();
                req.body.referralCode = yeast();
                var user = User(req.body)
                user.save(function(err, result) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                        var token_data = {
                            _id: result._id,
                            status: result.status
                        }
                        var token = jwt.sign(token_data, config.secreteKey);
                        callback(null, token, result)
                    }
                })
            },
        ], function(err, token, result) {
            res.send({
                token: token,
                result: result,
                responseCode: 200,
                responseMessage: "You have been register successfully."
            })
        })
    },

    //API for verify Otp
    "verifyOtp": function(req, res, next) {
        User.findOne({ _id: req.body.userId, otp: req.body.otp }).exec(function(err, results) {
            if (!results) {
                res.send({
                    responseCode: 406,
                    responseMessage: 'Please enter correct otp.'
                });
            } else {
                User.findByIdAndUpdate(req.body.userId, {
                    $set: {
                        status: "ACTIVE"
                    }
                }, { new: true }).exec(function(err, user) {
                    res.send({
                        responseCode: 200,
                        responseMessage: 'Otp verified successfully.',
                        result: user
                    });
                });
            }
        });
    },

    //API for user Login
    "login": function(req, res) {
        //        if (!validator.isEmail(req.body.email)) res.send({ responseCode: 403, responseMessage: 'Please enter the correct email id.' });
        //        else {
        User.findOne({ email: req.body.email, password: req.body.password }, avoid).exec(function(err, result) {
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "Sorry your id or password is incorrect." }); } else if (result.facebookID !== undefined) res.send({ responseCode: 203, responseMessage: "User registered with facebook." });
                else {

                    if (result.status != 'ACTIVE') { res.send({ responseCode: 401, responseMessage: 'You are removed by the admin' }); } else {
                        var token_data = {
                            _id: result._id,
                            status: result.status
                        }
                        User.findOneAndUpdate({ email: req.body.email }, {
                            $set: {
                                deviceType: req.body.deviceType,
                                deviceToken: req.body.deviceToken
                            }
                        }, { new: true }).exec(function(err, user) {
                            var token = jwt.sign(token_data, config.secreteKey);
                            res.header({
                                "appToken": token
                            }).send({
                                result: user,
                                token: token,
                                responseCode: 200,
                                responseMessage: "Login successfully."
                            });
                            //console.log("what is in token-->>>" + token);
                        })
                    }
                }
            })
            //  }
    },

    "editProfile": function(req, res) {
        if (req.body.email && req.body.password) {
            console.log("1")
            waterfall([
                function(callback) {
                    User.findOne({ _id: req.params.id }).exec(function(err, result) {
                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: 'Please enter correct userId' }); } else {
                            if (result.email == req.body.email) {
                                User.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec(function(err, result1) {
                                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                                        callback(null, result1)
                                    }
                                })
                            } else {
                                var email = req.body.email;
                                User.findOne({ email: req.body.email, _id: { $ne: req.params.id } }).exec(function(err, result2) {
                                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result2) { res.send({ responseCode: 400, responseMessage: 'Email must be unique' }) } else {
                                        User.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec(function(err, result3) {
                                            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result3) { res.send({ responseCode: 404, responseMessage: 'Please enter correct userId' }); } else {
                                                callback(null, result3)
                                            }
                                        })
                                    }
                                })
                            }
                        }
                    });
                },
            ], function(err, result) {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Profile updated successfully."
                });
            })
        } else if (req.body.country && req.body.city && req.body.mobileNumber && req.body.countryCode) {
            console.log("2")
            User.findOne({ _id: req.params.id }).exec(function(err, result) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: 'Please enter correct userId' }); } else {
                    if (result.mobileNumber == req.body.mobileNumber && result.countryCode == req.body.countryCode) {
                        User.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec(function(err, result1) {
                            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                                res.send({
                                    result: result1,
                                    responseCode: 200,
                                    responseMessage: "Profile updated successfully."
                                });
                            }
                        })
                    } else {
                        var mobileNumber = req.body.mobileNumber;
                        User.findOne({ mobileNumber: req.body.mobileNumber, _id: { $ne: req.params.id } }).exec(function(err, result2) {
                            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result2) { res.send({ responseCode: 400, responseMessage: 'MobileNumber must be unique' }) } else {
                                req.body.otp = functions.otp(req.body.mobileNumber);
                                User.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec(function(err, result3) {
                                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result3) { res.send({ responseCode: 404, responseMessage: 'Please enter correct userId' }); } else {
                                        res.send({
                                            result: result3,
                                            responseCode: 200,
                                            responseMessage: "Profile updated successfully."
                                        });
                                    }
                                })
                            }
                        })
                    }
                }
            });
        } else if (req.body.firstName && req.body.lastName && req.body.dob && req.body.gender) {
            console.log("3")
            User.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec(function(err, result3) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result3) { res.send({ responseCode: 404, responseMessage: 'Please enter correct userId' }); } else {
                    res.send({
                        result: result3,
                        responseCode: 200,
                        responseMessage: "Profile updated successfully."
                    });
                }
            })
        } else if (req.body.image && req.body.coverImage) {
            User.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec(function(err, result4) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result4) { res.send({ responseCode: 404, responseMessage: 'Please enter correct userId' }); } else {
                    res.send({
                        result: result4,
                        responseCode: 200,
                        responseMessage: "Profile updated successfully."
                    });
                }
            })
        }

    },

    //API for user Details  userId: { $ne: req.params.id }
    "allUserDetails": function(req, res) {
        User.find({ userId: { $ne: req.params.id }, $or: [{ type: "USER" }, { type: "Advertiser" }] }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                var userArray = [];
                for (var i = 0; i < result.length; i++) {
                    if (result[i].privacy.findMe == 'everyone') {
                        userArray.push(result[i]._id)
                    }
                }
                User.find({ _id: { $in: userArray } }).exec(function(err, result1) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result1.length == 0) { res.send({ responseCode: 400, responseMessage: 'No user found' }); } else {
                        res.send({
                            result: result1,
                            responseCode: 200,
                            responseMessage: "Show data successfully."
                        });
                    }
                })
            }
        })
    },

    //API for Forgot Password
    "forgotPassword": function(req, res, next) {
        User.findOne({ email: req.body.email }).exec(function(err, user) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); }
            if (!user) { res.send({ responseCode: 404, responseMessage: 'Email id does not exists.' }); } else {
                var transporter = nodemailer.createTransport({
                    // host: 'localhost',
                    // port: 25
                    service: 'Gmail',
                    auth: {
                        user: "test.avi201@gmail.com",
                        pass: "Mobiloitte1"
                    }
                });
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                var link = "";
                for (var i = 0; i < 8; i++) link += possible.charAt(Math.floor(Math.random() * possible.length));
                var to = req.body.email
                var mailOption = {
                    from: "test.avi201@gmail.com",
                    to: req.body.email,
                    subject: 'Brolix Change Password ',
                    text: 'you have a new submission with following details',
                    html: "Your current Password is :" + link
                }
                console.log("data in req" + req.body.email);
                console.log("Dta in mailOption : " + JSON.stringify(mailOption));
                transporter.sendMail(mailOption, function(error, info) {
                    if (error) { res.send({ responseCode: 400, responseMessage: 'Internal server error.' }) } else {
                        console.log("updated password is : " + link);
                        User.findOneAndUpdate({ email: req.body.email }, {
                            $set: {
                                password: link
                            }
                        }, function(err, results) {
                            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error.' }); }
                            res.send({
                                responseCode: 200,
                                responseMessage: 'Password successfully sent your mail id.'
                            })
                        })
                    }
                });
            }
        });
    },

    //API for Change Password
    "changePassword": function(req, res) {
        User.findOne({ _id: req.body.userId }, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseCode: "User doesn't exist." }); } else {
                var oldpassword = req.body.oldpass;
                if (result.password != oldpassword) {
                    res.send({
                        responseCode: 401,
                        responseCode: "Old password doesn't match."
                    });
                } else {
                    var password = req.body.newpass;
                    User.findByIdAndUpdate({ _id: req.body.userId }, { $set: { password: password } }, { new: true }).exec(function(err, user) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                            res.send({
                                responseCode: 200,
                                responseMessage: "Password changed."
                            });
                        }

                    })

                }
            }
        })
    },

    //API for user Profile
    "userProfile": function(req, res) {
        User.findOne({ _id: req.body.userId }, avoid).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: 'Please enter correct userId' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Profile data show successfully."
                });
            }
        })
    },

    //API for user Details
    "listOfAllAdvertiser": function(req, res) {
        User.find({ type: 'Advertiser' }, avoid).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Show data successfully."
                });
            }
        })
    },

    //API for user Profile
    "detailsOfAdvertiser": function(req, res) {
        User.findOne({ _id: req.params.id }, avoid).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Profile data show successfully."
                });
            }
        })
    },

    //API for Tag Friends
    "tagFriends": function(req, res) {
        //console.log("req======>>>" + JSON.stringify(req.body))
        var text = req.body.search;
        var senderName = [];
        var filterData = [];
        User.findOne({ _id: req.body.userId }, 'followers', function(err, result) {
            var followers = result.followers;
            //console.log(followers)
            if (err) { res.send({ responseCode: 409, responseMessage: err }); }
            for (var i = 0; i < followers.length; i++) {
                if (followers[i].FollowStatus == 'Accepted')
                    senderName.push(followers[i].senderName);
            }
            matchFollowers(text);

            function matchFollowers(input) {
                console.log('function call');
                var reg = new RegExp(input.split('').join('\\w*').replace(/\W/, ""), 'i');
                return senderName.filter(function(person) {
                    if (person.match(reg)) {
                        filterData.push(person)
                    }
                });
            }
            if (err) { res.send({ responseCode: 409, responseMessage: err }); } else {
                res.send({
                    responseCode: 200,
                    responseMessage: "Show Followers successfully.",
                    result: filterData
                });
            }
        })
    },

    // Api for Rating
    "rating": function(req, res, next) {
        var avrg = 0;
        User.findOne({ _id: req.body.userId, totalRating: { $elemMatch: { senderId: req.body.senderId } } }).exec(function(err, result) {
            console.log("result========================" + JSON.stringify(result));
            if (!result) {
                console.log("If");
                User.findOneAndUpdate({ _id: req.body.userId }, { $push: { "totalRating": { senderId: req.body.senderId, rating: req.body.rating } } }, { new: true }).exec(function(err, results) {
                    for (var i = 0; i < results.totalRating.length; i++) {
                        avrg += results.totalRating[i].rating;
                    }
                    var averageRating = avrg / results.totalRating.length;
                    User.findOneAndUpdate({ _id: req.body.userId }, { $set: { averageRating: averageRating } }, { new: true }).exec(function(err, results2) {
                        res.send({
                            result: results2,
                            responseCode: 200,
                            responseMessage: "result show successfully;"
                        })
                    })
                })
            } else {
                console.log("else");
                User.findOneAndUpdate({ _id: req.body.userId, 'totalRating.senderId': req.body.senderId }, { $set: { "totalRating.$.rating": req.body.rating } }, { new: true }).exec(function(err, results1) {
                    for (var i = 0; i < results1.totalRating.length; i++) {
                        avrg += results1.totalRating[i].rating;
                    }
                    var averageRating = avrg / results1.totalRating.length;
                    User.findOneAndUpdate({ _id: req.body.userId }, { $set: { averageRating: averageRating } }, { new: true }).exec(function(err, results2) {
                        res.send({
                            result: results2,
                            responseCode: 200,
                            responseMessage: "result show successfully;"
                        })
                    })
                })
            }
        })
    },

    // Api for Luck Card
    "luckCard": function(req, res) {
        var chances;
        var luckcard = req.body.brolix / 50;
        if (luckcard % 5 == 0) {
            chances = luckcard;

            createNewAds.findOne({ _id: req.body.adId }, function(err, data) {
                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!data) return res.status(404).send({ responseMessage: "please enter correct adId" })
                else if (data.winners.length != 0) return res.status(404).send({ responseMessage: "Winner already decided" });
                else {
                    User.findOne({ _id: req.body.userId, }, function(err, result) {
                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) return res.status(404).send({ responseMessage: "Please enter userId" })
                        else if (result.brolix <= req.body.brolix) { res.send({ responseCode: 400, responseMessage: "Insufficient amount of brolix in your account" }); } else {

                            createNewAds.findByIdAndUpdate({ _id: req.body.adId }, { $push: { "luckCardListObject": { userId: req.body.userId, brolix: req.body.brolix, chances: chances } } }, { new: true }).exec(function(err, user) {
                                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                                    result.brolix -= req.body.brolix;
                                    result.save();
                                    res.status(200).send({ responseMessage: "Successfully used the luck card" });
                                }
                            })
                        }
                    })
                }
            })
        } else {
            res.status(200).send({ responseMessage: "Enter the proper number of brolix" });
        }

    },

    "sendBrolixToFollower": function(req, res) { // userId, receiverId, brolix
        waterfall([
            function(callback) {
                var receiverId = req.body.receiverId;
                var userId = req.body.userId;
                User.findOne({ _id: req.body.receiverId }, function(err, result) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No user found." }); } else if (result.privacy.sendBrolix == "nobody") { res.send({ responseCode: 409, responseMessage: "You cannot send brolix to this user due to privacy policies" }) } else {
                        callback(null)
                    }
                })
            },
            function(callback) {
                console.log(" in friends")
                var receiverId = req.body.receiverId;
                var userId = req.body.userId;
                User.findOne({ _id: req.body.receiverId }, function(err, result1) {
                    console.log("result1-->>", result1)
                    console.log("privacy-->>", (result1.privacy.sendBrolix))
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 11' }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: "No user found." }); } else if (result1.privacy.sendBrolix == "onlyFollowers") {
                        console.log("userId-->>", req.body.userId)
                        var flag = result1.userFollowers.indexOf(req.body.userId)
                        console.log("flag-->>", flag)
                        if (flag == -1) { res.send({ responseCode: 400, responseMessage: "You cannot send brolix to this user due to privacy policies" }); } else {
                            console.log("flag-->>", flag)
                            User.findOne({ _id: req.body.userId }, function(err, result2) {
                                console.log("dfdfgdf-->>", result2.brolix)
                                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result2) res.send({ responseCode: 404, responseMessage: "please enter correct senderId" });
                                else if (result2.brolix < req.body.brolix) { res.send({ responseCode: 400, responseMessage: "Insufficient amount of brolix in your account." }); } else {
                                    var image = result2.image;
                                    result2.brolix -= req.body.brolix;
                                    result2.save();

                                    User.findOneAndUpdate({ _id: req.body.receiverId }, { $push: { "sendBrolixListObject": { senderId: req.body.userId, brolix: req.body.brolix } }, "notification": { userId: req.body.userId, type: 'I have send you Brolix', linkType: 'profile', notificationType: 'brolixReceivedType', image: image }, $inc: { brolix: +req.body.brolix } }, { new: true }).exec(function(err, result3) {
                                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result3) res.send({ responseCode: 404, responseMessage: "Please enter correct receiverId" });
                                        else {
                                            result3.brolix += req.body.brolix;
                                            result3.save();
                                            callback(null, result2)
                                        }
                                        if (result3.deviceToken && result3.deviceType && result3.notification_status && result3.status) {
                                            var message = "I have send you brolix";
                                            if (result3.deviceType == 'Android' && result3.notification_status == 'on' && result3.status == 'ACTIVE') {
                                                functions.android_notification(result3.deviceToken, message);
                                                console.log("Android notification send!!!!")
                                            } else if (result3.deviceType == 'iOS' && result3.notification_status == 'on' && result3.status == 'ACTIVE') {
                                                functions.iOS_notification(result3.deviceToken, message);
                                            } else {
                                                console.log("Something wrong!!!!")
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    } else {
                        console.log("in public")
                        var receiverId = req.body.receiverId;
                        var userId = req.body.userId;
                        User.findOne({ _id: req.body.userId }, function(err, result4) {
                            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result4) res.send({ responseCode: 404, responseMessage: "please enter correct senderId" });
                            else if (result4.brolix < req.body.brolix) { res.send({ responseCode: 400, responseMessage: "Insufficient amount of brolix in your account." }); } else {
                                var image = result4.image;
                                result4.brolix -= req.body.brolix;
                                result4.save();
                                User.findOneAndUpdate({ _id: req.body.receiverId }, { $push: { "sendBrolixListObject": { senderId: req.body.userId, brolix: req.body.brolix } }, "notification": { userId: req.body.userId, type: 'I have send you Brolix', linkType: 'profile', notificationType: 'brolixReceivedType', image: image }, $inc: { brolix: +req.body.brolix } }, { new: true }).exec(function(err, result5) {
                                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result5) res.send({ responseCode: 404, responseMessage: "Please enter correct receiverId" });
                                    else {
                                        callback(null, result4)
                                    }
                                    if (result5.deviceToken && result5.deviceType && result5.notification_status && result5.status) {
                                        var message = "I have send you brolix";
                                        if (result5.deviceType == 'Android' && result5.notification_status == 'on' && result5.status == 'ACTIVE') {

                                            functions.android_notification(result5.deviceToken, message);
                                            console.log("Android notification send!!!!")
                                        } else if (result5.deviceType == 'iOS' && result5.notification_status == 'on' && result5.status == 'ACTIVE') {
                                            functions.iOS_notification(result5.deviceToken, message);
                                        } else {
                                            console.log("Something wrong!!!!")
                                        }
                                    }
                                });
                            }
                        });
                    }
                })
            },
        ], function(err, result) {
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "You have successfully transferred your brolix."
            })
        })

    },

    "sendCashToFollower": function(req, res) { // userId, receiverId, cash in request
        waterfall([
            function(callback) {
                var receiverId = req.body.receiverId;
                var senderId = req.body.userId;
                User.findOne({ _id: req.body.receiverId }, function(err, result) {
                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No user found." }); } else if (result.privacy.sendCash == "nobody") { res.send({ responseCode: 409, responseMessage: "You cannot send cash to this user due to privacy policies" }) } else {
                        callback(null)
                    }
                })
            },
            function(callback) {
                console.log(" in friends")
                var senderId = req.body.userId;
                var receiverId = req.body.receiverId;
                User.findOne({ _id: req.body.receiverId }, function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 11' }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: "No user found." }); } else if (result1.privacy.sendCash == "onlyFollowers") {
                        var flag = result1.userFollowers.indexOf(req.body.userId)
                        console.log("flag-->>", flag)
                        if (flag === -1) { res.send({ responseCode: 400, responseMessage: "You cannot send brolix to this user due to privacy policies" }); } else {
                            var senderId = req.body.userId;
                            var receiverId = req.body.receiverId;
                            User.findOne({ _id: req.body.userId }, function(err, result) {
                                if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) res.send({ responseCode: 404, responseMessage: "please enter correct userId" });
                                else if (result.cash < req.body.cash) { res.send({ responseCode: 400, responseMessage: "Insufficient amount of cash in your account." }); } else {
                                    var image = result.image;
                                    result.cash -= req.body.cash;
                                    result.save();
                                    User.findOneAndUpdate({ _id: req.body.receiverId }, { $push: { "sendCashListObject": { senderId: req.body.userId, cash: req.body.cash } }, "notification": { userId: senderId, type: 'I have send you Cash', linkType: 'profile', notificationType: 'cashReceivedType', image: image } }, { new: true }).exec(function(err, user) {
                                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!user) res.send({ responseCode: 404, responseMessage: "Please enter correct receiverId" });
                                        else {
                                            user.cash += req.body.cash;
                                            user.save();
                                            //callback(null, user)
                                        }
                                        if (user.deviceToken && user.deviceType && user.notification_status && user.status) {
                                            var message = "I have sent you cash";
                                            if (user.deviceType == 'Android' && user.notification_status == 'on' && user.status == 'ACTIVE') {
                                                functions.android_notification(user.deviceToken, message);
                                                console.log("Android notification send!!!!")
                                            } else if (user.deviceType == 'iOS' && user.notification_status == 'on' && user.status == 'ACTIVE') {
                                                functions.iOS_notification(user.deviceToken, message);
                                            } else {
                                                console.log("Something wrong!!!!")
                                            }
                                        }
                                    });
                                    callback(null, result)
                                }
                            });
                        }
                    } else {
                        var senderId = req.body.userId;
                        var receiverId = req.body.receiverId;
                        User.findOne({ _id: req.body.userId }, function(err, result) {
                            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) res.send({ responseCode: 404, responseMessage: "please enter correct userId" });
                            else if (result.cash < req.body.cash) { res.send({ responseCode: 400, responseMessage: "Insufficient amount of cash in your account." }); } else {
                                var image = result.image;
                                result.cash -= req.body.cash;
                                result.save();
                                User.findOneAndUpdate({ _id: req.body.receiverId }, { $push: { "sendCashListObject": { senderId: req.body.userId, cash: req.body.cash } }, "notification": { userId: senderId, type: 'I have send you Cash', linkType: 'profile', notificationType: 'cashReceivedType', image: image } }, { new: true }).exec(function(err, user) {
                                    if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!user) res.send({ responseCode: 404, responseMessage: "Please enter correct receiverId" });
                                    else {
                                        user.cash += req.body.cash;
                                        user.save();
                                        //callback(null, user)
                                    }
                                    if (user.deviceToken && user.deviceType && user.notification_status && user.status) {
                                        var message = "I have sent you cash";
                                        if (user.deviceType == 'Android' && user.notification_status == 'on' && user.status == 'ACTIVE') {

                                            functions.android_notification(user.deviceToken, message);
                                            console.log("Android notification send!!!!")
                                        } else if (user.deviceType == 'iOS' && user.notification_status == 'on' && user.status == 'ACTIVE') {
                                            functions.iOS_notification(user.deviceToken, message);
                                        } else {
                                            console.log("Something wrong!!!!")
                                        }

                                    }
                                });
                                callback(null, result)
                            }
                        });
                    }
                })

            },
        ], function(err, result) {
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "You have successfully transferred your cash."
            });
        })
    },

    "filterToDateAndFromDate": function(req, res) {
        User.find({ _id: req.body.userId }).exec(function(err, results) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                var arr = [];
                results[0].followers.forEach(function(result) {
                    arr.push(result.senderId)
                })
                User.find({ _id: { $in: arr }, "createdAt": { "$gte": req.body.toDate, "$lt": req.body.fromDate } }).exec(function(err, newResult) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (newResult.length == 0) { res.send({ responseCode: 400, responseMessage: 'No result found' }); } else {
                        for (var i = 0; i < newResult.length; i++) {
                            var obj = {};
                            obj.followStatus = results[0].followers[i].FollowStatus;
                            console.log(obj);
                            obj.result = newResult[i];
                            newResult[i] = obj;
                        }
                        res.send({
                            result: newResult,
                            responseCode: 200,
                            responseMessage: "Show list of all followers."
                        });
                    }
                })
            }
        })
    },

    "updatePrivacy": function(req, res) {
        User.findOneAndUpdate({ _id: req.body.userId }, { $set: { privacy: req.body.privacy } }, { new: true }, function(error, result) {
            if (error) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: 'User not found' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Privacy updated successfully."
                });
            }
        })
    },

    "showPrivacy": function(req, res) {
        User.findOne({ _id: req.body.userId }, 'privacy').exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: 'User not found' }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Privacy details show successfully."
                })
            }
        })
    },

    "blockUser": function(req, res) {
        console.log("block user exports-->>>" + JSON.stringify(req.body));
        User.findByIdAndUpdate({ _id: req.body.userId }, { $set: { 'status': 'BLOCK' } }, { new: true }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) return res.status(404).send({ responseMessage: "please enter correct adId" })
            else {
                res.send({
                    // result: result,
                    responseCode: 200,
                    responseMessage: "User blocked successfully."
                });
            }

        });
    },

    "showAllBlockUser": function(req, res) {
        User.find({ _id: req.params.id }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: 'No blocked user found' }); } else {
                var arr = [];
                for (var i = 0; i < result.length; i++) {
                    if (result[i].followers.length >= 1) {
                        for (var j = 0; j < result[i].followers.length; j++) {
                            if (result[i].followers[j].FollowStatus == "block")
                                arr.push(result[i].followers[j].senderId);
                        }
                    }
                }
                User.find({ _id: { $in: arr } }, avoid).exec(function(err, newResult) {
                    res.send({
                        result: newResult,
                        responseCode: 200,
                        responseMessage: "List of all blocked users shown successfully."
                    })
                })
            }
        });
    },

    "logout": function(req, res) {
        User.findOneAndUpdate({ _id: req.body.userId }, { $set: { deviceType: '', deviceToken: '' } }, { new: true }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                res.send({
                    // result:result,
                    responseCode: 200,
                    responseMessage: "Logout successfully."
                });
            }
        });

    },

    "showUpgradeCard": function(req, res) {
        console.log("request--->>>", req.body)
        User.find({ _id: req.body.userId, 'upgradeCardObject.status': "ACTIVE" }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No card found" }); } else {
                var count = 0;
                for (i = 0; i < result.length; i++) {
                    for (j = 0; j < result[i].upgradeCardObject.length; j++) {
                        if (result[i].upgradeCardObject[j].status == "ACTIVE") {
                            count++;
                        }
                    }
                }
                var obj = result[0].upgradeCardObject;
                var data = obj.filter(obj => obj.status == "ACTIVE");
                var shortData = obj.sort(function(obj1, obj2) {
                    return obj2.createdAt - obj1.createdAt
                })
                res.send({
                    result: shortData,
                    count: count,
                    responseCode: 200,
                    responseMessage: "List of all upgrade Card show successfully!!"
                });
            }
        })
    },

    "showLuckCard": function(req, res) {
        User.find({ _id: req.body.userId, 'luckCardObject.status': "ACTIVE" }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No card found" }); } else {
                var count = 0;
                for (i = 0; i < result.length; i++) {
                    for (j = 0; j < result[i].luckCardObject.length; j++) {
                        if (result[i].luckCardObject[j].status == "ACTIVE") {
                            count++;
                        }
                    }
                }
                var obj = result[0].luckCardObject;
                var data = obj.filter(obj => obj.status == "ACTIVE");
                var shortData = obj.sort(function(obj1, obj2) {
                    return obj2.createdAt - obj1.createdAt
                })
                res.send({
                    result: shortData,
                    count: count,
                    responseCode: 200,
                    responseMessage: "All luck Card show successfully."
                });
            }
        })
    },

    "purchaseUpgradeCard": function(req, res) { //request: date
        console.log("request---->>>", req.body)
        var array = [];
        var array1 = [];
        for (j = 0; j < req.body.upgradeCardArr.length; j++) {
            for (var i = 0; i < req.body.upgradeCardArr[j].numberOfCount; i++) {
                var obj = { cash: 0, viewers: 0, type: 'PURCHASED' }
                obj.viewers = req.body.upgradeCardArr[j].viewers;
                obj.cash = req.body.upgradeCardArr[j].cash;
                array.push(obj);
                array1.push(parseFloat(req.body.upgradeCardArr[j].cash));
            }
        }
        var sum = array1.reduce(function(a, b) {
            return a + b;
        });
        console.log("sum-->>", sum)
        User.findOne({ _id: req.body.userId, }, function(err, result) {
            if (err) {
                res.send({ responseCode: 500, responseMessage: 'Internal server error' });
            } else if (!result) {
                return res.status(404).send({ responseMessage: "please enter userId" })
            }
            //  else if (result.cash < sum) { res.send({ responseCode: 400, responseMessage: "Insufficient amount of cash in your account" }); } 
            else {
                for (i = 0; i < array.length; i++) {
                    User.findByIdAndUpdate({ _id: req.body.userId }, { $push: { "upgradeCardObject": array[i] }, $set: { cardPurchaseDate: req.body.date } }, { new: true }).exec(function(err, user) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                            console.log("sum-->>", sum)
                        }
                    });
                }
                //result.cash -= sum;
                // result.save();
                res.send({
                    //result: result,
                    responseCode: 200,
                    responseMessage: "Successfully purchased the upgrade card"
                });
            }
        })
    },

    "purchaseLuckCard": function(req, res) { //request: date
        var array = [];
        var array1 = [];
        for (j = 0; j < req.body.luckCardArr.length; j++) {
            for (var i = 0; i < req.body.luckCardArr[j].numberOfCount; i++) {
                var obj = { brolix: 0, chances: 0, type: 'PURCHASED' }
                obj.chances = req.body.luckCardArr[j].chances;
                obj.brolix = req.body.luckCardArr[j].brolix;
                array.push(obj);
                array1.push(parseFloat(req.body.luckCardArr[j].brolix));
            }
        }
        var sum = array1.reduce(function(a, b) {
            return a + b;
        });
        User.findOne({ _id: req.body.userId, }, function(err, result) {
            if (err) {
                res.send({ responseCode: 500, responseMessage: 'Internal server error' });
            } else if (!result) {
                return res.status(404).send({ responseMessage: "please enter userId" })
            } else if (result.brolix < sum) { res.send({ responseCode: 400, responseMessage: "Insufficient amount of brolix in your account" }); } else {
                for (i = 0; i < array.length; i++) {
                    User.findByIdAndUpdate({ _id: req.body.userId }, { $push: { "luckCardObject": array[i] }, $set: { cardPurchaseDate: req.body.date } }, { new: true }).exec(function(err, user) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                            console.log("sum--->>>", sum)
                        }
                    });
                }
                result.brolix -= sum;
                result.save();
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Successfully purchased the luck card"
                });
            }
        })
    },

    "useLuckCard": function(req, res) { // userId, adId, Brolix, luckId in request parameter
        var obj = (req.body.luckId);
        if (obj == null || obj == '' || obj === undefined) { res.send({ responseCode: 500, responseMessage: 'Please enter luckId' }); } else {
            createNewAds.findOne({ _id: req.body.adId }, function(err, data) {
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!data) return res.status(404).send({ responseMessage: "please enter correct adId" })
                else if (data.winners.length != 0) return res.status(406).send({ responseCode: 406, responseMessage: "You can not use luck card as winner is already decided." });
                else if (Boolean(data.luckCardListObject.find(luckCardListObject => luckCardListObject.userId == req.body.userId))) {
                    return res.status(403).send({ responseMessage: "Already used luckCard" })
                } else {
                    var obj = (req.body.luckId);
                    console.log("obj", obj, typeof obj);
                    User.update({ 'luckCardObject._id': obj }, { $push: { 'luckUsedAd': { luckId: obj, adId: req.body.adId } }, $set: { 'luckCardObject.$.status': "INACTIVE" } }, function(err, result) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) return res.status(404).send({ responseMessage: "please enter userId" })
                        else {
                            createNewAds.findByIdAndUpdate({ _id: req.body.adId }, { $push: { "luckCardListObject": { userId: req.body.userId, chances: req.body.chances } } }, { new: true }).exec(function(err, user) {
                                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                                    res.send({
                                        // result: user,
                                        responseCode: 200,
                                        responseMessage: "Successfully used the luck card."
                                    })
                                }

                            })
                        }
                    })
                }
            })
        }
    },

    "useUpgradeCard": function(req, res) { //upgradeId adId viewers cash in request
        waterfall([
            function(callback) {
                var obj = req.body.upgradeId;
                var adId = req.body.adId;
                if (!req.body.upgradeId) { res.send({ responseCode: 404, responseMessage: 'Please enter upgradeId' }); } else if (!req.body.adId) { res.send({ responseCode: 404, responseMessage: 'please enter adId' }); } else {
                    for (var i = 0; i < obj.length; i++) {
                        console.log("in loop")
                        User.update({ 'upgradeCardObject._id': obj[i] }, { $push: { 'UpgradeUsedAd': { upgradeId: obj[i], adId: adId } }, $set: { 'upgradeCardObject.$.status': "INACTIVE" } }, { multi: true }, function(err, result) {
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 11' }); } else if (!result) return res.status(404).send({ responseMessage: "please enter userId" })
                            else {
                                console.log("in loop 1")
                                    // callback(null)
                            }
                        })
                    }
                    callback(null)
                }
            },
            function(callback) {
                var cash = req.body.cash;
                var viewers = req.body.viewers;
                var adId = req.body.adId;
                console.log("cash--->>", cash)
                console.log("viewers-->>", viewers)
                console.log("adId--->>", adId)
                createNewAds.findOneAndUpdate({ _id: adId }, { $inc: { cash: +cash, viewers: +viewers } }, { new: true }, function(err, result1) {
                    //console.log("add--111->>", result1)
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 22' }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: "No adId found" }); } else {
                        callback(null, result1)
                    }
                })
            },
        ], function(err, result) {
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "Successfully used the upgrade card."
            })
        })
    },

    "facebookLogin": function(req, res) {
        if (!req.body.facebookID) { res.send({ responseCode: 403, responseMessage: 'please enter facebookID' }); } else if (!req.body.dob) { res.send({ responseCode: 403, responseMessage: 'Dob required' }); } else if (!req.body.country) { res.send({ responseCode: 403, responseMessage: 'country required' }); } else if (!req.body.city) { res.send({ responseCode: 403, responseMessage: 'city required' }); } else if (!req.body.mobileNumber) { res.send({ responseCode: 403, responseMessage: 'MobileNumber required' }); } else if (!validator.isEmail(req.body.email)) { res.send({ responseCode: 403, responseMessage: 'Please enter the correct email id.' }); } else {
            User.findOne({ email: req.body.email, status: 'ACTIVE' }, avoid).exec(function(err, result) {
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) {
                    if (req.body.haveReferralCode == true) {
                        User.findOne({ referralCode: req.body.referredCode }, function(err, user) {
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!user) { res.send({ responseCode: 400, responseMessage: 'Please enter valid referralcode' }); } else {

                                Brolixanddollors.find({ "type": "brolixForInvitation" }).exec(function(err, data) {
                                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                                        console.log("data-->>", data)
                                        var amount = data[0].value;
                                        console.log("amount-->>", amount)
                                        User.findOneAndUpdate({ referralCode: req.body.referredCode }, { $inc: { brolix: amount } }).exec(function(err, result2) {
                                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }) } else {
                                                req.body.otp = functions.otp();
                                                req.body.referralCode = yeast();
                                                req.body.brolix = amount;
                                                var user = User(req.body)
                                                user.save(function(err, result3) {
                                                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                                                        var token_data = {
                                                            _id: result3._id,
                                                            status: result3.status
                                                        }
                                                        var token = jwt.sign(token_data, config.secreteKey);
                                                        res.header({
                                                            "appToken": token
                                                        }).send({
                                                            result: result3,
                                                            token: token,
                                                            responseCode: 200,
                                                            responseMessage: "You have been registered successfully."
                                                        });
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })

                    } else {
                        req.body.referralCode = yeast();
                        var user = new User(req.body);
                        user.save(function(err, result1) {
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }) } else {
                                var token_data = {
                                    _id: result1._id,
                                    status: result1.status
                                }
                                var token = jwt.sign(token_data, config.secreteKey);
                                res.header({
                                    "appToken": token
                                }).send({
                                    result: result1,
                                    token: token,
                                    responseCode: 200,
                                    responseMessage: "Signup successfully."
                                });
                            }
                        })
                    }
                } else {
                    if (result.facebookID == undefined) {
                        res.send({
                            responseCode: 201,
                            responseMessage: "You are already register with app.",
                            user: result
                        });
                    } else {
                        User.findOneAndUpdate({ email: req.body.email }, {
                            $set: {
                                deviceType: req.body.deviceType,
                                deviceToken: req.body.deviceToken
                            }
                        }, { new: true }).exec(function(err, user) {
                            var token = jwt.sign(result, config.secreteKey);
                            res.header({
                                "appToken": token
                            }).send({
                                result: user,
                                token: token,
                                responseCode: 200,
                                responseMessage: "Login successfully."
                            });
                            //console.log("what is in token-->>>" + token);
                        })
                    }
                }
            })
        }
    },

    "userCashGifts": function(req, res) { // userId in req 
        var userId = req.body.userId;
        User.find({ _id: userId, 'cashPrize.status': "ACTIVE" }).populate('cashPrize.adId').populate('cashPrize.pageId', 'pageName adAdmin').exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No coupon found" }) } else {
                var obj = result[0].cashPrize;
                var data = obj.filter(obj => obj.status == "ACTIVE");
                res.send({
                    result: data,
                    responseCode: 200,
                    responseMessage: "Cash gifts show successfully."
                })
            }
        })
    },

    "userCouponGifts": function(req, res) { // userId in req $or: SEND BY FOLLOWER SENDBYADMIN
        var userId = req.body.userId;

        User.find({ _id: userId, $or: [{ 'coupon.type': "WINNER" }, { 'coupon.type': "PURCHASED" }, { 'coupon.type': "EXCHANGED" }, { 'coupon.type': "SENDBYFOLLOWER" }, { 'coupon.type': "SENDBYADMIN" }] }).populate('coupon.adId').populate('coupon.pageId', 'pageName adAdmin').exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No coupon found" }) } else {
                var obj = result[0].coupon;
                var data = obj.filter(obj => obj.status == "ACTIVE");
                res.send({
                    result: data,
                    responseCode: 200,
                    responseMessage: "Coupon gifts show successfully."
                })
            }
        })
    },

    "countrys": function(req, res) {
        var countrys = country.all();
        var coutr = [];
        var a = new Array();
        var b = new Object();
        a[0] = b;
        for (var i = 0; i < countrys.length; i++) {
            var data = {
                name: countrys[i].name,
                callingCode: countrys[i].callingCodes,
                code: countrys[i].ISO.alpha2
            }
            coutr.push(data);
        }
        res.send({
            result: coutr,
            responseCode: 200,
            responseMessage: "All countrys list."
        });
    },

    "getAllStates": function(req, res) {
        var name = req.params.name;
        var code = req.params.code;
        console.log(name, code);
        var states = country.states(name, code);
        if (!states) {
            res.send({
                responseCode: 201,
                responseMessage: "No list."
            });
        } else {
            res.send({
                result: states,
                responseCode: 200,
                responseMessage: "All state list."
            });
        }
    },

    "chatHistory": function(req, res, next) {
        console.log('everything-----chatHistorychatHistorychatHistorys-------' + JSON.stringify(req.body));
        var condition;
        if (req.body.pageId) {
            condition = { $or: [{ senderId: req.body.senderId, receiverId: req.body.receiverId, pageId: req.body.pageId }, { senderId: req.body.receiverId, receiverId: req.body.senderId, pageId: req.body.pageId }] }
        } else {
            condition = { $or: [{ senderId: req.body.senderId, receiverId: req.body.receiverId }, { senderId: req.body.receiverId, receiverId: req.body.senderId }] }
        }
        chat.paginate(condition, { page: req.params.pageNumber, limit: 15, sort: { timestamp: -1 } }, function(err, results) {
            if (!results.docs.length) {
                res.send({
                    result: results,
                    responseCode: 403,
                    responseMessage: "No record found."
                });
            } else {
                res.send({
                    result: results,
                    responseCode: 200,
                    responseMessage: "Record found successfully."
                });
            }
        });
    },

    "onlineUserList": function(req, res) {
        var condition;
        if (req.body.pageId) {
            console.log("in if")
            condition = { $or: [{ senderId: req.body.userId, pageId: req.body.pageId }, { receiverId: req.body.userId, pageId: req.body.pageId }] }
        } else {
            console.log("in else")
            condition = { $or: [{ senderId: req.body.userId }, { receiverId: req.body.userId }] }
        }
        chat.aggregate(
            [{
                //$match: { $or: [{ senderId: req.body.userId }, { receiverId: req.body.userId }] }
                $match: condition
            }, { $sort: { timestamp: -1 } }, {
                $group: {
                    _id: { senderId: "$senderId", receiverId: "$receiverId" },
                    unread: {
                        $sum: {
                            $cond: { if: { $eq: ["$is_read", 0] }, then: 1, else: 0 }
                        }
                    },
                    lastMsg: { $last: "$message" },
                    timestamp: { $last: "$timestamp" },
                    senderImage: { $last: "$senderImage" },
                    receiverImage: { $last: "$receiverImage" },
                    senderName: { $last: "$senderName" },
                    receiverName: { $last: "$receiverName" }
                }
            }]
        ).exec(function(err, result) {
            console.log("result-->>", result)
            if (err) res.send({ responseCode: 500, responseMessage: err });
            else if (result.length == 0) res.send({ responseCode: 404, responseMessage: "list empty." });
            else {
                result.sort(function(a, b) {
                    if (a.timestamp < b.timestamp) return -1;
                    if (a.timestamp > b.timestamp) return 1;
                    return 0;
                });
                var obj = [],
                    j;
                console.log("result--->" + JSON.stringify(result));
                for (var i = 0; i < result.length; i++) {
                    result.length - 1 == i ? j = i : j = i + 1;


                    //while ((result[j]._id.senderId)) {
                    /*if (j < result.length)
                    {*/
                    console.log("j--->" + j);
                    console.log("result.length" + result.length);

                    while ((result[i]._id.senderId != result[j]._id.receiverId) || (result[j]._id.senderId != result[i]._id.receiverId)) {
                        console.log("inside whil;e")
                        console.log("result[i]._id.senderId");
                        console.log(result[i]._id.senderId);
                        console.log("result[j]._id.receiverId");
                        console.log(result[j]._id.receiverId);
                        console.log("result[j]._id.senderId");
                        console.log(result[j]._id.senderId);
                        console.log("result[i]._id.receiverId");
                        console.log(result[i]._id.receiverId);
                        if (result[j + 1] != undefined)
                            j += 1;
                        else
                            break;
                        console.log("j");
                        console.log(j);
                    }
                    //}
                    if (i != j) {
                        result[i].unread += result[j].unread;
                    }
                    obj.push(result[i]);
                    result.splice(j, 1);
                    console.log("length---->" + result.length);
                }
                res.send({
                    result: obj,
                    responseCode: 200,
                    responseMessage: "Record found successfully."
                });
            }

        })
    },

    "winnersFilter": function(req, res) {
        var condition = { $or: [] };
        var obj = req.body;
        Object.getOwnPropertyNames(obj).forEach(function(key, idx, array) {
            if (key == 'cashPrize.cashStatus' || key == 'coupon.couponStatus') {
                var cond = { $or: [] };
                if (key == "cashPrize.cashStatus") {
                    for (data in obj[key]) {
                        condition.$or.push({ 'cashPrize.cashStatus': obj[key][data] })
                    }
                } else {
                    for (data in obj[key]) {
                        condition.$or.push({ 'coupon.couponStatus': obj[key][data] })
                    }
                }
                //condition[key] = cond;
            } else {
                condition[key] = obj[key];
            }
        });
        if (condition.$or.length == 0) {
            delete condition.$or;
        }
        User.find(condition).exec(function(err, result) {
            // console.log("result--->>",result)
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No result found." }) } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Result shown successfully."
                })
            }
        })
    },

    "googleLogin": function(req, res) {
        if (!req.body.googleID) { res.send({ responseCode: 403, responseMessage: 'please enter googleID' }); } else if (!req.body.dob) { res.send({ responseCode: 403, responseMessage: 'Dob required' }); } else if (!req.body.country) { res.send({ responseCode: 403, responseMessage: 'country required' }); } else if (!req.body.city) { res.send({ responseCode: 403, responseMessage: 'city required' }); } else if (!req.body.mobileNumber) { res.send({ responseCode: 403, responseMessage: 'MobileNumber required' }); } else if (!validator.isEmail(req.body.email)) { res.send({ responseCode: 403, responseMessage: 'Please enter the correct email id.' }); } else {
            User.findOne({ email: req.body.email, status: 'ACTIVE' }, avoid).exec(function(err, result) {
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!result) {
                    if (req.body.haveReferralCode == true) {
                        User.findOne({ referralCode: req.body.referredCode }, function(err, user) {
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (!user) { res.send({ responseCode: 400, responseMessage: 'Please enter valid referralcode' }); } else {
                                Brolixanddollors.find({ "type": "brolixForInvitation" }).exec(function(err, data) {
                                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                                        console.log("data-->>", data)
                                        var amount = data[0].value;
                                        console.log("amount-->>", amount)
                                        User.findOneAndUpdate({ referralCode: req.body.referredCode }, { $inc: { brolix: amount } }).exec(function(err, result2) {
                                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                                                req.body.otp = functions.otp();
                                                req.body.referralCode = yeast();
                                                req.body.brolix = amount;
                                                var user = User(req.body)
                                                user.save(function(err, result) {
                                                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                                                        var token_data = {
                                                            _id: result._id,
                                                            status: result.status
                                                        }
                                                        var token = jwt.sign(token_data, config.secreteKey);
                                                        res.header({
                                                            "appToken": token
                                                        }).send({
                                                            result: result,
                                                            token: token,
                                                            responseCode: 200,
                                                            responseMessage: "You have been registered successfully."
                                                        });
                                                    }

                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    } else {
                        req.body.referralCode = yeast();
                        var user = new User(req.body);
                        user.save(function(err, result) {
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                                var token_data = {
                                    _id: result._id,
                                    status: result.status
                                }
                                var token = jwt.sign(token_data, config.secreteKey);
                                res.header({
                                    "appToken": token
                                }).send({
                                    result: result,
                                    token: token,
                                    responseCode: 200,
                                    responseMessage: "Signup successfully."
                                });
                            }
                        })
                    }
                } else {
                    if (result.googleID == undefined) {
                        res.send({ responseCode: 201, responseMessage: "You are already register with app.", user: result });
                    } else {
                        User.findOneAndUpdate({ email: req.body.email }, {
                            $set: {
                                deviceType: req.body.deviceType,
                                deviceToken: req.body.deviceToken
                            }
                        }, { new: true }).exec(function(err, user) {
                            var token = jwt.sign(result, config.secreteKey);
                            res.header({
                                "appToken": token
                            }).send({
                                result: user,
                                token: token,
                                responseCode: 200,
                                responseMessage: "Login successfully."
                            });
                            //console.log("what is in token-->>>" + token);
                        })
                    }
                }
            })
        }
    },

    "buyCoupon": function(req, res) { // user Id and ad Id and brolix in request
        waterfall([
            function(callback) {
                createNewAds.findOne({ _id: req.body.adId }, function(err, result) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error 11" }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No ad found" }); } else {
                        if (result.adsType == 'cash') {
                            if (result.cash > 0) {
                                var type = "storeCouponPriceForUpgradedAds";
                            } else {
                                var type = "storeCouponPriceForFreeAds";
                            }
                        } else if (result.adsType == 'coupon') {
                            console.log("in coupon type")
                            if (result.cash > 0) {
                                var type = "storeCouponPriceForUpgradedAds";
                            } else {
                                var type = "storeCouponPriceForFreeAds";
                            }
                            console.log("type-->>", type)
                            Brolixanddollors.find({ type: type }, function(err, result) {
                                console.log("result---******++++--->>>", result)
                                if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error 11" }); } else {
                                    var value = result[0].value
                                    callback(null, value)
                                }
                            })

                        } else if (result.adsType == 'ADMINCOUPON') {
                            value = result.couponSellPrice;
                            callback(null, value)

                        }
                        //else{
                        //                        console.log("type-->>", type)
                        //                         console.log("adstype--->>>",result.adsType)
                        //                        console.log("adstype--/*/*/*/*/*/*/*/*/*/*/*/*+/9/+//+/+9/+9->>>",result)
                        //                        if (result.adsType == 'coupon') {
                        //                            Brolixanddollors.find({ type: type }).exec(function(err, result) {
                        //                                console.log("result--******>>", result)
                        //                                if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error 11" }); } else {
                        //                                    console.log("result--+++++++++>>", result)
                        //                                    var value = result[0].value
                        //                                    console.log("value--//////////////**************>>", value)
                        //                                     callback(null, value)
                        //                                }
                        //                            })
                        //                        }


                    }

                    // }
                })
            },
            function(value, callback) {
                console.log("value-->>", value)
                User.findOne({ _id: req.body.userId }).exec(function(err, userResult) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error 22" }); } else if (!userResult) { res.send({ responseCode: 404, responseMessage: "No user found" }); } else if (userResult.brolix < req.body.brolix) { res.send({ responseCode: 400, responseMessage: "Insufficient amount of brolix in your account" }); } else {

                        createNewAds.findOne({ _id: req.body.adId }, function(err, adResult) {
                            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error 11" }); } else if (!adResult) { res.send({ responseCode: 404, responseMessage: "Please enter correct adId" }); } else {
                                console.log("result ads ******------+++++++++++++++++++++")
                                console.log("result ads ---->>>>", adResult)
                                var flag = adResult.couponSold.indexOf(req.body.userId);
                                console.log("flag------->>>", flag)
                                if (flag != -1) { res.send({ responseCode: '400', responseMessage: 'You have already purchased this coupon' }); } else {
                                    createNewAds.findOneAndUpdate({ _id: req.body.adId }, { $push: { couponSold: req.body.userId }, $inc: { couponPurchased: 1 } }, { new: true }, function(err, result) {
                                        if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error 11" }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No ad found" }); } else if (result.couponBuyersLength == result.couponPurchased) { res.send({ responseCode: 201, responseMessage: " All coupon sold out" }); } else {
                                            callback(null, value, result.couponCode, result.couponExpiryDate, result.pageId)
                                        }
                                    })
                                }
                            }
                            // callback(null, value, result.couponCode, result.couponExpiryDate, result.pageId)

                        })
                    }
                })

            },
            function(value, couponCode1, couponExpiryDate1, pageId, callback) {
                console.log("value-->>", value)
                User.findOne({ _id: req.body.userId }).exec(function(err, result1) {

                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error 22" }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: "No user found" }); } else {

                        var startTime = new Date().toUTCString();
                        var h = new Date(new Date(startTime).setHours(00)).toUTCString();
                        var m = new Date(new Date(h).setMinutes(00)).toUTCString();
                        var s = Date.now(m)
                        var coupanAge = couponExpiryDate1;
                        var actualTime = parseInt(s) + parseInt(coupanAge);
                        console.log("coupanAge--->>", coupanAge)
                        var neverExpireTime = parseInt(s) + parseInt(2125651954361);
                        console.log("coupanAge--->>", coupanAge)
                        console.log("neverExpireTime--->>", neverExpireTime)
                        if (coupanAge == 'NEVER') {
                            console.log("if")
                            var data = {
                                couponCode: couponCode1,
                                adId: req.body.adId,
                                pageId: pageId,
                                type: "PURCHASED",
                                couponExpire: "NEVER",
                                expirationTime: neverExpireTime
                            }

                        } else {
                            console.log("else")
                            var data = {
                                couponCode: couponCode1,
                                expirationTime: actualTime,
                                adId: req.body.adId,
                                pageId: pageId,
                                type: "PURCHASED",
                                couponExpire: "YES"
                            }
                        }
                        console.log("data--->>", data)
                        User.findByIdAndUpdate({ _id: req.body.userId }, { $push: { coupon: data, gifts: req.body.adId }, $inc: { brolix: -value } }, { new: true }, function(err, result3) {
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error. 33' }); } else {
                                callback(null, result3)
                            }
                        })
                    }
                })
            },
        ], function(err, result) {
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "You have successfully purchased the coupon."
            })
        })
    },


    "listOfFavouriteCoupon": function(req, res) {
        waterfall([
            function(callback) {
                Brolixanddollors.findOne({ type: 'storeCouponPriceForFreeAds' }).exec(function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error 11" }); } else {
                        var value = result1.value
                            // var value= 2
                        callback(null, value)
                    }
                })
            },
            function(noDataValue, callback) {
                Brolixanddollors.findOne({ type: 'storeCouponPriceForUpgradedAds' }).exec(function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error 11" }); } else {
                        var value = result1.value
                            //  var value= 4;
                        callback(null, noDataValue, value)
                    }
                })
            },
            function(noDataValue, dataValue, callback) {
                var userId = req.body.userId
                createNewAds.find({}).exec(function(err, result) {
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error.' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No ad found." }); } else {
                        var array = [];
                        for (var i = 0; i < result.length; i++) {
                            for (var j = 0; j < result[i].favouriteCoupon.length; j++) {
                                if (result[i].favouriteCoupon[j] == userId) {
                                    array.push(result[i]._id)
                                }
                            }
                        }
                        createNewAds.paginate({ _id: { $in: array } }, { page: req.params.pageNumber, limit: 8 }, function(err, result1) {
                            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (result1.docs.length == 0) { res.send({ responseCode: 400, responseMessage: "No coupon found in your favourites" }); } else {
                                for (var i = 0; i < result1.docs.length; i++) {
                                    if (result1.docs[i].cash == 0) {
                                        result1.docs[i].couponSellPrice = noDataValue
                                    } else {
                                        result1.docs[i].couponSellPrice = dataValue
                                    }
                                }
                                
                                 var updatedResult = result1.docs;
                        createNewAds.populate(updatedResult, { path: 'pageId', model: 'createNewPage', select: 'pageName adAdmin' }, function(err, finalResult) {
                                res.send({
                                    result: result1,
                                    responseCode: 200,
                                    responseMessage: "successfully shown the result."
                                })
                        })
                            }
                        })
                    }
                })
            }
        ])
    },

    "addRemoveCouponFromFavourite": function(req, res) {
        var adId = req.body.adId;
        var userId = req.body.userId;
        if (req.body.type == "favourite") {
            createNewAds.findOne({ _id: adId }).exec(function(err, result) {
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error.' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No ad found." }); }
                var favouriteCoupon = result.favouriteCoupon;

                var mySet = new Set(favouriteCoupon);
                var has = mySet.has(userId)
                if (has) { res.send({ responseCode: 302, responseMessage: "Already added to favourites." }) } else if (!has) {
                    createNewAds.findOneAndUpdate({ _id: adId }, { $push: { favouriteCoupon: userId } }, { new: true }, function(err, result1) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error.' }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: "No ad found." }); } else {
                            res.send({
                                // result: result1,
                                responseCode: 200,
                                responseMessage: "Successfully added to favourites."
                            })
                        }
                    })
                }
            })
        } else {
            createNewAds.findOne({ _id: adId }).exec(function(err, result) {
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error.' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No ad found." }); }
                var favouriteCoupon = result.favouriteCoupon;
                var mySet = new Set(favouriteCoupon);
                var has = mySet.has(userId)
                if (!has) { res.send({ responseCode: 302, responseMessage: "Already removed from favourites." }) } else if (has) {
                    createNewAds.findOneAndUpdate({ _id: adId }, { $pop: { favouriteCoupon: -userId } }, { new: true }, function(err, result1) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error.' }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: "No ad found." }); } else {
                            res.send({
                                //   result: result1,
                                responseCode: 200,
                                responseMessage: "Coupon removed from favourites successfully."
                            })
                        }
                    })
                }
            })
        }
    },

    "couponExchangeOnOff": function(req, res) {
        var userId = req.body.userId;
        var status = req.body.status;
        var obj = req.body.couponId
        if (obj == null || obj == '' || obj === undefined) { res.send({ responseCode: 404, responseMessage: 'please enter couponCode' }); } else {
            User.findOne({ _id: userId }).exec(function(err, result) {
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error.' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No user found." }); } else {
                    User.update({ 'coupon._id': obj }, { $set: { 'coupon.$.exchangeStatus': status } }, { new: true }, function(err, result1) {
                        if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else {
                            res.send({
                                //result: result1,
                                responseCode: 200,
                                responseMessage: "Coupon status changed successfully."
                            })
                        }
                    })
                }
            })
        }
    },

    "sendCouponExchangeRequest": function(req, res) { //  couponCode, receiverId, senderId, exchangedWithAdId, senderCouponId
        console.log("request-->>>", JSON.stringify(req.body))
        waterfall([
            function(callback) {
                var obj = req.body.receiverCouponCode;
                var receiverId = req.body.receiverId;
                var senderId = req.body.senderId;
                var senderCouponId = req.body.senderCouponId;
                var receiverCouponId = req.body.receiverCouponId;
                var adId = req.body.receiverAdId;
                if (!req.body.receiverCouponCode) { res.send({ responseCode: 400, responseMessage: "Receiver coupon code is required" }); } else if (!req.body.receiverId) { res.send({ responseCode: 400, responseMessage: "receiverId is required." }) } else if (!req.body.senderCouponId) { res.send({ responseCode: 400, responseMessage: "senderCouponId is required." }) } else if (!req.body.receiverCouponId) { res.send({ responseCode: 400, responseMessage: "receiverCouponId is required." }) } else if (receiverId == senderId) { res.send({ responseCode: 400, responseMessage: "You can not send the exchange request to yourself." }) } else {
                    User.findOne({ _id: req.body.receiverId }).exec(function(err, userResult) {
                        console.log("***********************-->>>", userResult.privacy.exchangeCoupon)
                        if (err) { res.send({ responseCode: 302, responseMessage: "Internal server error." }); } else if (!userResult) { res.send({ responseCode: 400, responseMessage: "Please enter correct ReceiverId." }); } else if (userResult.privacy.exchangeCoupon == "off") { res.send({ responseCode: 400, responseMessage: "You cannot send coupon exchange request to this user due to privacy policies." }); } else {
                            createNewAds.findOne({ _id: adId }).exec(function(err, result) {
                                if (err) { res.send({ responseCode: 302, responseMessage: "Internal server error." }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "Please enter correct adId." }); } else if (Boolean(result.couponExchangeReceived.find(couponExchangeReceived => couponExchangeReceived.senderCouponId == senderCouponId && couponExchangeReceived.couponExchangeStatus == "REQUESTED"))) {
                                    res.send({ responseCode: 302, responseMessage: "Already requested for this coupon" });
                                } else {
                                    User.aggregate({ $unwind: '$coupon' }, { $match: { 'coupon._id': new mongoose.Types.ObjectId(senderCouponId) } }, function(err, user1) {
                                        console.log("coupon.couponStatus--->>>", JSON.stringify(user1[0].coupon.couponStatus))
                                        if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error11." }) } else if (!user1) { res.send({ responseCode: 404, responseMessage: "Please enter correct coupon Id." }) } else if ((user1[0].coupon.couponStatus) != 'VALID') {
                                            res.send({ responseCode: 403, responseMessage: "Please request for a valid coupon." })
                                        } else if ((user1[0].coupon.status) != 'ACTIVE') {
                                            res.send({ responseCode: 403, responseMessage: "Please request for a valid coupon." })
                                        } else {
                                            User.aggregate({ $unwind: '$coupon' }, { $match: { 'coupon._id': new mongoose.Types.ObjectId(receiverCouponId) } }, function(err, user) {
                                                console.log("coupon.exchangeStatus--->>>", JSON.stringify(user[0].coupon.exchangeStatus))
                                                console.log("coupon.couponStatus--->>>", JSON.stringify(user[0].coupon.couponStatus))
                                                if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error11." }) } else if (!user) { res.send({ responseCode: 404, responseMessage: "Please enter correct coupon Id." }) } else if ((user[0].coupon.couponStatus) != 'VALID') {
                                                    res.send({ responseCode: 403, responseMessage: "Please request for a valid coupon." })
                                                } else if ((user[0].coupon.exchangeStatus) == 'OFF') {
                                                    res.send({ responseCode: 403, responseMessage: "Exchange request not allowed." })
                                                } else {
                                                    callback(null)
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            },
            function(callback) {
                var receiverId = req.body.receiverId;
                var senderId = req.body.senderId;
                var adId = req.body.receiverAdId;
                var senderAdId = req.body.senderAdId;
                var senderCouponCode = req.body.senderCouponCode;
                var senderCouponId = req.body.senderCouponId;
                var receiverCouponId = req.body.receiverCouponId;

                if (!req.body.senderId) { res.send({ responseCode: 400, responseMessage: "senderId is required." }) } else if (!req.body.receiverAdId) { res.send({ responseCode: 400, responseMessage: "adId is required." }) } else if (!req.body.senderAdId) { res.send({ responseCode: 400, responseMessage: "exchangedWithAdId is required." }) } else if (!req.body.senderCouponCode) { res.send({ responseCode: 400, responseMessage: "senderCouponCode is required." }) } else if (!req.body.senderCouponId) { res.send({ responseCode: 400, responseMessage: "senderCouponId is required." }) } else if (!req.body.receiverCouponId) { res.send({ responseCode: 400, responseMessage: "receiverCouponId is required." }) } else {
                    User.findOne({ _id: receiverId }, function(err, result2) {
                        if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error. 33' }); } else if (!result2) { res.send({ responseCode: 404, responseMessage: "No user found." }); } else if (result2.privacy.exchangeCoupon == "onlyMe") { res.send({ responseCode: 409, responseMessage: "you are not allowed to send exchange request" }) } else if (result2.privacy.exchangeCoupon == "followers") {

                            var flag = result2.userFollowers.find(userFollowers => userFollowers == senderId)
                            if (flag === undefined) { res.send({ responseCode: 400, responseMessage: "you are not friend" }); } else {

                                createNewAds.findByIdAndUpdate({ _id: adId }, { $push: { "couponExchangeReceived": { senderId: req.body.senderId, receiverId: req.body.receiverId, exchangedWithAdId: senderAdId, senderCouponCode: senderCouponCode, senderCouponId: senderCouponId, receiverCouponId: receiverCouponId } } }, { new: true }).exec(function(err, result3) {
                                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error. 44' }) } else if (!result3) { res.send({ responseCode: 404, responseMessage: "Receiver ad not found." }); } else {

                                        createNewAds.findByIdAndUpdate({ _id: senderAdId }, { $push: { "couponExchangeSent": { senderId: req.body.senderId, receiverId: req.body.receiverId, exchangedWithAdId: adId, senderCouponId: senderCouponId, receiverCouponId: receiverCouponId } } }, { new: true }).exec(function(err, result4) {
                                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error. 55' }) } else if (!result4) { res.send({ responseCode: 404, responseMessage: "Sender ad not found." }); } else {
                                                //  callback(null, result3)
                                            }
                                        })
                                        callback(null, result3)
                                    }
                                })
                            }
                            if (result2.deviceToken && result2.deviceType && result2.notification_status && result2.status) {
                                var message = "You have coupon Exchange request";
                                if (result2.deviceType == 'Android' && result2.notification_status == 'on' && result2.status == 'ACTIVE') {

                                    functions.android_notification(result2.deviceToken, message);
                                    console.log("Android notification send!!!!")
                                } else if (result2.deviceType == 'iOS' && result2.notification_status == 'on' && result2.status == 'ACTIVE') {
                                    functions.iOS_notification(result2.deviceToken, message);
                                } else {
                                    console.log("Something wrong!!!!")
                                }
                            }
                        } else {
                            createNewAds.findByIdAndUpdate({ _id: adId }, { $push: { "couponExchangeReceived": { senderId: req.body.senderId, receiverId: req.body.receiverId, exchangedWithAdId: senderAdId, senderCouponCode: senderCouponCode, senderCouponCode: senderCouponCode, senderCouponId: senderCouponId, receiverCouponId: receiverCouponId } } }, { new: true }).exec(function(err, result5) {
                                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error. 66' }) } else if (!result5) { res.send({ responseCode: 404, responseMessage: "Receiver ad not found." }); } else {

                                    createNewAds.findByIdAndUpdate({ _id: senderAdId }, { $push: { "couponExchangeSent": { senderId: req.body.senderId, receiverId: req.body.receiverId, exchangedWithAdId: adId, senderCouponCode: senderCouponCode, senderCouponId: senderCouponId, receiverCouponId: receiverCouponId } } }, { new: true }).exec(function(err, result6) {

                                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error. 77' }) } else if (!result6) { res.send({ responseCode: 404, responseMessage: "Sender ad not found." }); } else {
                                            //  callback(null, result3)
                                        }
                                    })
                                    callback(null, result5)
                                }
                            })
                            if (result2.deviceToken && result2.deviceType && result2.notification_status && result2.status) {
                                var message = "You have coupon Exchange request";
                                if (result2.deviceType == 'Android' && result2.notification_status == 'on' && result2.status == 'ACTIVE') {

                                    functions.android_notification(result2.deviceToken, message);
                                    console.log("Android notification send!!!!")
                                } else if (result2.deviceType == 'iOS' && result2.notification_status == 'on' && result2.status == 'ACTIVE') {
                                    functions.iOS_notification(result2.deviceToken, message);
                                } else {
                                    console.log("Something wrong!!!!")
                                }
                            }
                        }
                    })
                }
            },
        ], function(err, result) {
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "Coupon exchange request send successfully."
            });
        })
    },


    "seeExchangeRequest": function(req, res) {
        var receiverId = req.body.userId;
        createNewAds.aggregate({ $unwind: '$couponExchangeReceived' }, { $match: { _id: new mongoose.Types.ObjectId(req.body.adId), 'couponExchangeReceived.receiverId': receiverId, 'couponExchangeReceived.couponExchangeStatus': "REQUESTED" } }).exec(function(err, user) {
            console.log("datatatata--->>>", user)
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!user) { res.send({ responseCode: 400, responseMessage: 'No ad found' }); } else {
                createNewAds.populate(user, {
                    path: 'couponExchangeReceived.senderId',
                    model: 'brolixUser',
                    select: 'firstName lastName image country state city'
                }, function(err, result1) {
                    res.send({
                        result: result1,
                        responseCode: 200,
                        responseMessage: "All request show successfully"
                    })
                })
            }
        })
    },

    "couponRequestsSearch": function(req, res) {
        var re = new RegExp(req.body.firstName, 'i');
        User.find({ status: 'ACTIVE' }).or([{ 'firstName': { $regex: re } }]).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No user found." }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "User show successfully."
                });
            }
        })
    },
    //   User.aggregate({ $unwind: '$coupon' }, { $match: { 'coupon._id': senderCouponId } }, function(err, user) {
    "sendCouponToFollower": function(req, res) {
        console.log("send coupon request=----->>>",JSON.stringify(req.body))
        waterfall([
            function(callback) {
                var senderCouponId = req.body.senderCouponId;
                var receiverId = req.body.receiverId;
                var senderId = req.body.userId;
                var adId = req.body.adId;
                var couponId = req.body.couponId;
                User.aggregate({ $unwind: '$coupon' }, { $match: { 'coupon._id': new mongoose.Types.ObjectId(senderCouponId) } }, function(err, user) {
                    console.log("user--*******-+++++++--*************->>>", user)
                    console.log("coupon.couponStatus--++++++++++->>>", JSON.stringify(user[0].coupon.couponStatus))
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error11." }) } else if (!user) { res.send({ responseCode: 404, responseMessage: "Please enter correct coupon Id." }) } else if ((user[0].coupon.couponStatus) != 'VALID') {
                        res.send({ responseCode: 403, responseMessage: "Please enter a valid coupon." });
                    } else {
                        User.findOne({ _id: receiverId }, function(err, result) {
                            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error12' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No user found." }); } else if (result.privacy.exchangeCoupon == "nobody") { res.send({ responseCode: 409, responseMessage: "You cannot send coupon to this user due to privacy policies" }) } else {
                                callback(null)
                            }
                        })
                    }
                })
            },
            function(callback) { //  receiverId  senderId senderCouponId adId
                console.log("in friends")
                var receiverId = req.body.receiverId;
                var senderId = req.body.senderId;
                var senderCouponId = req.body.senderCouponId;
                var adId = req.body.adId;
                var startTime = new Date().toUTCString();
                var h = new Date(new Date(startTime).setHours(00)).toUTCString();
                var m = new Date(new Date(h).setMinutes(00)).toUTCString();
                var currentTime = Date.now(m);
                User.findOne({ _id: receiverId }, function(err, result1) {
                    console.log("receiverId--->>>", result1)
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 11' }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: "No user found." }); } else if (result1.privacy.exchangeCoupon == "onlyFollowers") {
                        console.log("2")
                        var flag = result1.userFollowers.indexOf(req.body.senderId)
                        console.log("flag--*+*+++**+*+*+*+*+*+-->>", flag)
                       // var flag = result1.userFollowers.find(userFollowers => userFollowers == req.body.senderId)
                        if (flag != -1) { res.send({ responseCode: 400, responseMessage: "You cannot send coupon to this user due to privacy policies" }); }
                        else {
                            console.log("2")
                            createNewAds.findOneAndUpdate({ _id: adId }, { $push: { "couponSend": { senderId: senderId, receiverId: receiverId, sendDate: currentTime } } }).exec(function(err, result2) {
                                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 22' }); } else if (!result2) { res.send({ responseCode: 404, responseMessage: "No ad found." }); } else {

                                    User.findOneAndUpdate({ 'coupon._id': new mongoose.Types.ObjectId(senderCouponId) }, { $set: { "coupon.$.status": "SEND" }, $pop: { 'gifts': -adId } }, { new: true }).exec(function(err, result3) {
                                        console.log("senderCouponId--*+*+*+*+////*+*+*+*+///////->>", result3)
                                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 33' }); } else if (!result3) { res.send({ responseCode: 404, responseMessage: "No ad found." }); } else {
                                            for (i = 0; i < result3.coupon.length; i++) {
                                                if (result3.coupon[i]._id == senderCouponId) {
                                                    var couponCode = result3.coupon[i].couponCode;
                                                    var couponAdId = result3.coupon[i].adId;
                                                    var expirationTime = result3.coupon[i].expirationTime;
                                                    var pageId = result3.coupon[i].pageId;
                                                    var couponExpire = result3.coupon[i].couponExpire;
                                                    var type = "SENDBYFOLLOWER";
                                                }
                                            }
                                            var coupon = {
                                                couponCode: couponCode,
                                                adId: couponAdId,
                                                expirationTime: expirationTime,
                                                pageId: pageId,
                                                type: type,
                                                couponExpire: couponExpire
                                            }

                                            User.findByIdAndUpdate({ _id: receiverId }, { $push: { 'coupon': coupon, gifts: couponAdId }, 'notification': { userId: req.body.senderId, type: "I have sent you a coupon", linkType: 'coupon', notificationType: 'couponReceived' } }, { new: true }, function(err, result4) {
                                                console.log("receiverId--->>>", result4)
                                                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 44' }); } else if (!result4) { res.send({ responseCode: 404, responseMessage: "No user found." }); } else { callback(null, result4) }
                                                if (result4.deviceToken && result4.deviceType && result4.notification_status && result4.status) {
                                                    var message = "you have one coupon exchange request";
                                                    if (result4.deviceType == 'Android' && result4.notification_status == 'on' && result4.status == 'ACTIVE') {
                                                        functions.android_notification(result4.deviceToken, message);
                                                        console.log("Android notification send!!!!")
                                                    } else if (result4.deviceType == 'iOS' && result4.notification_status == 'on' && result4.status == 'ACTIVE') {
                                                        functions.iOS_notification(result4.deviceToken, message);
                                                    } else {
                                                        console.log("Something wrong!!!!")
                                                    }
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }

                    } else {
                        console.log("in public")
                        var receiverId = req.body.receiverId;
                        var senderId = req.body.senderId;
                        var senderCouponId = req.body.senderCouponId;
                        var adId = req.body.adId;
                        var startTime = new Date().toUTCString();
                        var h = new Date(new Date(startTime).setHours(00)).toUTCString();
                        var m = new Date(new Date(h).setMinutes(00)).toUTCString();
                        var currentTime = Date.now(m);
                        createNewAds.findOneAndUpdate({ _id: adId }, { $push: { "couponSend": { senderId: senderId, receiverId: receiverId, sendDate: currentTime } } }).exec(function(err, result2) {
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 55' }); } else if (!result2) { res.send({ responseCode: 404, responseMessage: "No ad found." }); } else {

                                User.findOneAndUpdate({ 'coupon._id': new mongoose.Types.ObjectId(senderCouponId) }, { $set: { "coupon.$.status": "SEND" }, $pop: { 'gifts': -adId } }, { new: true }, function(err, result3) {
                                    console.log("senderCouponId-111-->>", result3)
                                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 66' }); } else if (!result3) { res.send({ responseCode: 404, responseMessage: "No ad found." }); } else {
                                        for (i = 0; i < result3.coupon.length; i++) {
                                            if (result3.coupon[i]._id == senderCouponId) {
                                                var couponCode = result3.coupon[i].couponCode;
                                                var couponAdId = result3.coupon[i].adId;
                                                var expirationTime = result3.coupon[i].expirationTime;
                                                var pageId = result3.coupon[i].pageId;
                                                var couponExpire = result3.coupon[i].couponExpire;
                                                var type = "SENDBYFOLLOWER";
                                            }
                                        }
                                        var coupon = {
                                            couponCode: couponCode,
                                            adId: couponAdId,
                                            expirationTime: expirationTime,
                                            pageId: pageId,
                                            type: type,
                                            couponExpire: couponExpire
                                        }
                                        User.findByIdAndUpdate({ _id: receiverId }, { $push: { 'coupon': coupon, gifts: couponAdId }, 'notification': { userId: req.body.senderId, type: "I have sent you a coupon", linkType: 'coupon', notificationType: 'couponReceived' } }, { new: true }, function(err, result4) {
                                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 77' }); } else if (!result4) { res.send({ responseCode: 404, responseMessage: "No user found." }); } else { callback(null, result4) }
                                            if (result4.deviceToken && result4.deviceType && result4.notification_status && result4.status) {
                                                var message = "you have one coupon exchange request";
                                                if (result4.deviceType == 'Android' && result4.notification_status == 'on' && result4.status == 'ACTIVE') {
                                                    functions.android_notification(result4.deviceToken, message);
                                                    console.log("Android notification send!!!!")
                                                } else if (result4.deviceType == 'iOS' && result4.notification_status == 'on' && result4.status == 'ACTIVE') {
                                                    functions.iOS_notification(result4.deviceToken, message);
                                                } else {
                                                    console.log("Something wrong!!!!")
                                                }
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            },
        ], function(err, result) {
            res.send({
                // result: result,
                responseCode: 200,
                responseMessage: "Coupon send to follower successfully"
            });
        })
    },

    "acceptDeclineCouponRequest": function(req, res) { //receiverRequestId senderCouponCode senderId receiverId receiverCouponCode status
        if (req.body.status == 'accepted') {
            waterfall([
                function(callback) {
                    var senderCouponId = req.body.senderCouponId;
                    var receiverCouponId = req.body.receiverCouponId;
                    var receiverRequestId = req.body.receiverRequestId;
                    var startTime = new Date().toUTCString();
                    var h = new Date(new Date(startTime).setHours(00)).toUTCString();
                    var m = new Date(new Date(h).setMinutes(00)).toUTCString();
                    var currentTime = Date.now(m);
                    if (!req.body.receiverRequestId) { res.send({ responseCode: 400, responseMessage: "Receiver RequestId is required" }); } else if (!req.body.senderCouponId) { res.send({ responseCode: 400, responseMessage: "senderCouponId is required." }) } else if (!req.body.receiverCouponId) { res.send({ responseCode: 400, responseMessage: "receiverCouponId is required." }) } else {
                        User.aggregate({ $unwind: '$coupon' }, { $match: { 'coupon._id': new mongoose.Types.ObjectId(senderCouponId) } }, function(err, user) {
                            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error11." }) } else if (!user) { res.send({ responseCode: 404, responseMessage: "Please enter correct coupon Id." }) } else if ((user[0].coupon.status) != 'ACTIVE') {
                                res.send({ responseCode: 403, responseMessage: "Coupon is already exchanged with someone else." })
                            } else {
                                createNewAds.aggregate({ $unwind: '$couponExchangeReceived' }, { $match: { 'couponExchangeReceived._id': new mongoose.Types.ObjectId(receiverRequestId) } }, function(err, user) {
                                    console.log("user---->>>", user)
                                    console.log("coupon.couponExchangeStatus--->>>", JSON.stringify(user[0].couponExchangeReceived.couponExchangeStatus))
                                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 11' }); } else if (!user) { res.send({ responseCode: 404, responseMessage: "No ad found." }); } else if ((user[0].couponExchangeReceived.couponExchangeStatus) == 'DECLINED') {
                                        res.send({ responseCode: 403, responseMessage: "You have declined for this request before." })
                                    } else {
                                        createNewAds.findOneAndUpdate({ 'couponExchangeReceived._id': receiverRequestId }, { $set: { "couponExchangeReceived.$.couponExchangeStatus": "ACCEPTED" } }, { new: true }).exec(function(err, result) {
                                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 11' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No ad found." }); } else { callback(null) }
                                        })
                                    }
                                })
                            }
                        })
                    }
                },
                function(callback) {
                    var h = new Date(new Date(startTime).setHours(00)).toUTCString();
                    var m = new Date(new Date(h).setMinutes(00)).toUTCString();
                    var currentTime = Date.now(m);
                    var senderId = req.body.senderId;
                    var senderCouponCode = req.body.senderCouponCode;
                    var senderCouponId = req.body.senderCouponId;
                    var receiverCouponId = req.body.receiverCouponId;
                    if (!req.body.senderId) { res.send({ responseCode: 400, responseMessage: "SenderId is required" }); } else if (!req.body.senderCouponCode) { res.send({ responseCode: 400, responseMessage: "SenderCouponCode is required" }); } else if (!req.body.senderCouponId) { res.send({ responseCode: 400, responseMessage: "senderCouponId is required." }) } else if (!req.body.receiverCouponId) { res.send({ responseCode: 400, responseMessage: "receiverCouponId is required." }) } else {
                        User.findOneAndUpdate({ 'coupon._id': senderCouponId }, { $set: { "coupon.$.status": "EXCHANGED" } }, { new: true }).exec(function(err, result1) {
                            console.log("result-->>", result1)
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 22' }); } else if (!result1) { res.send({ responseCode: 404, responseMessage: "No user found. 11" }); } else {

                                User.findOne({ 'coupon._id': senderCouponId }).exec(function(err, result2) {
                                    console.log("senderCouponId------->>", result2)
                                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 33' }); } else if (!result2) { res.send({ responseCode: 404, responseMessage: "No user found. 22" }); } else {
                                        for (i = 0; i < result2.coupon.length; i++) {
                                            console.log("result2.coupon-->>", result2.coupon)
                                            if (result2.coupon[i]._id == senderCouponId) {
                                                var couponCode = result2.coupon[i].couponCode;
                                                var couponAdId = result2.coupon[i].adId;
                                                var expirationTime = result2.coupon[i].expirationTime;
                                                var pageId = result2.coupon[i].pageId;
                                                var couponExpire = result2.coupon[i].couponExpire;
                                                var type = "EXCHANGED"
                                            }
                                        }
                                        callback(null, couponExpire, couponCode, couponAdId, expirationTime, pageId, type)
                                    }
                                })
                            }
                        })
                    }
                },
                function(couponExpire1, couponCode1, couponAdId1, expirationTime1, pageId1, type1, callback) {
                    console.log("couponCode-11-->>", couponCode1);
                    console.log("couponId-11-->>", couponAdId1);
                    console.log("expirationTime-11-->>>", expirationTime1);
                    console.log("pageId1-11-->>>", pageId1);
                    console.log("type1-11-->>>", type1);
                    console.log("couponExpire1-11-->>>", couponExpire1);

                    var h = new Date(new Date(startTime).setHours(00)).toUTCString();
                    var m = new Date(new Date(h).setMinutes(00)).toUTCString();
                    var currentTime = Date.now(m);
                    var receiverId = req.body.receiverId;
                    // var receiverCouponCode = req.body.receiverCouponCode;
                    var senderCouponId = req.body.senderCouponId;
                    var receiverCouponId = req.body.receiverCouponId;
                    if (receiverId == undefined || receiverId == null || receiverId == '') { res.send({ responseCode: 400, responseMessage: "receiverId is required" }); }
                    //                    else if (receiverCouponCode == undefined || receiverCouponCode == null || receiverCouponCode == '') { res.send({ responseCode: 400, responseMessage: "ReceiverCouponCode is required" }); }
                    else if (!req.body.senderCouponId) { res.send({ responseCode: 400, responseMessage: "senderCouponId is required." }) } else if (!req.body.receiverCouponId) { res.send({ responseCode: 400, responseMessage: "receiverCouponId is required." }) } else {

                        var data = {
                            couponCode: couponCode1,
                            adId: couponAdId1,
                            expirationTime: expirationTime1,
                            pageId: pageId1,
                            type: type1,
                            couponExpire: couponExpire1
                        }

                        User.findOneAndUpdate({ _id: receiverId }, { $push: { coupon: data } }, { new: true }).exec(function(err, result3) {
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 44' }); } else if (!result3) { res.send({ responseCode: 404, responseMessage: "No user found. 33" }); } else {

                                User.findOneAndUpdate({ 'coupon._id': receiverCouponId }, { $set: { "coupon.$.status": "EXCHANGED" } }, { new: true }).exec(function(err, result4) {
                                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 55' }); } else if (!result4) { res.send({ responseCode: 404, responseMessage: "No user found. 44" }); } else {

                                        User.findOne({ 'coupon._id': receiverCouponId }).exec(function(err, result5) {
                                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 66' }); } else if (!result5) { res.send({ responseCode: 404, responseMessage: "No user found. 55" }); } else {
                                                for (i = 0; i < result5.coupon.length; i++) {
                                                    if (result5.coupon[i]._id == receiverCouponId) {
                                                        var couponCode2 = result5.coupon[i].couponCode;
                                                        var couponAdId2 = result5.coupon[i].adId;
                                                        var expirationTime2 = result5.coupon[i].expirationTime;
                                                        var pageId2 = result5.coupon[i].pageId;
                                                        var couponExpire2 = result5.coupon[i].couponExpire;
                                                        var type2 = "EXCHANGED"
                                                    }
                                                }
                                                callback(null, couponExpire2, couponCode2, couponAdId2, expirationTime2, pageId2, type2)
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }

                },
                function(couponExpire2, couponCode2, couponAdId2, expirationTime2, pageId2, type2, callback) {
                    console.log("couponCode-22-->>", couponCode2);
                    console.log("couponId-22-->>", couponAdId2);
                    console.log("expirationTime-22-->>>", expirationTime2);
                    console.log("pageId2-22-->>>", pageId2);
                    console.log("type2-22-->>>", type2);
                    var receiverId = req.body.receiverId;
                    var h = new Date(new Date(startTime).setHours(00)).toUTCString();
                    var m = new Date(new Date(h).setMinutes(00)).toUTCString();
                    var currentTime = Date.now(m);
                    var senderId = req.body.senderId;
                    var senderCouponId = req.body.senderCouponId;
                    var receiverCouponId = req.body.receiverCouponId;
                    if (!req.body.senderId) { res.send({ responseCode: 400, responseMessage: "SenderId is required" }); } else if (!req.body.senderCouponId) { res.send({ responseCode: 400, responseMessage: "senderCouponId is required." }) } else if (!req.body.receiverCouponId) { res.send({ responseCode: 400, responseMessage: "receiverCouponId is required." }) } else {
                        var data1 = {
                            couponCode: couponCode2,
                            adId: couponAdId2,
                            expirationTime: expirationTime2,
                            pageId: pageId2,
                            type: type2,
                            couponExpire: couponExpire2
                        }

                        User.findOneAndUpdate({ _id: senderId }, { $push: { coupon: data1 } }, { new: true }).exec(function(err, result6) {
                            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 77' }); } else if (!result6) { res.send({ responseCode: 404, responseMessage: "No user found. 66" }); } else {
                                callback(null, result6)
                            }
                        })
                    }
                },
            ], function(err, result) {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "Coupon exchanged successfully"
                });
            })
        } else {
            var senderCouponId = req.body.senderCouponId;
            var receiverCouponId = req.body.receiverCouponId;
            var receiverRequestId = req.body.receiverRequestId;
            var startTime = new Date().toUTCString();
            var h = new Date(new Date(startTime).setHours(00)).toUTCString();
            var m = new Date(new Date(h).setMinutes(00)).toUTCString();
            var currentTime = Date.now(m);
            if (!req.body.receiverRequestId) { res.send({ responseCode: 400, responseMessage: "ReceiverRequestId is required." }); } else {
                createNewAds.findOneAndUpdate({ 'couponExchangeReceived._id': receiverRequestId }, { $set: { "couponExchangeReceived.$.couponExchangeStatus": "DECLINED" } }, { new: true }).exec(function(err, result) {
                    console.log("result-->.", result)
                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error 11' }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No ad found." }); } else {
                        res.send({
                            responseCode: 400,
                            responseMessage: "User declined your request."
                        })
                    }
                })
            }
        }
    },

    "registerWithRefferalCode": function(req, res) {
        User.paginate({ referredCode: req.body.referralCode }, { page: req.params.pageNumber, limit: 8 }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (result.docs.length == 0) { res.send({ responseCode: 404, responseMessage: "No user found." }); } else {
                res.send({
                    result: result,
                    responseCode: 200,
                    responseMessage: "All user shows successfully"
                });
            }
        })
    },

    "useCouponWithoutCode": function(req, res) {
        var couponId = req.body.couponId;
        var adId = req.body.adId;
        if (!couponId) { res.send({ responseCode: 400, responseMessage: "Please enter the couponId" }); } else if (!adId) { res.send({ responseCode: 400, responseMessage: 'Please enter the adId' }); } else {
            User.aggregate({ $unwind: '$coupon' }, { $match: { 'coupon._id': new mongoose.Types.ObjectId(couponId) } }, function(err, user) {
                if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!user) { res.send({ responseCode: 404, responseMessage: "No user found" }); } else if ((user[0].coupon.couponStatus) != "VALID") { res.send({ responseCode: 400, responseMessage: "Please enter a valid coupon to use." }); } else {
                    User.update({ 'coupon._id': couponId }, { $set: { 'coupon.$.couponStatus': "USED", 'coupon.$.usedCouponDate': Date.now() } }, { new: true }, function(err, result1) {
                        if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else {

                            User.findOne({ 'hiddenGifts.adId': adId }, function(err, user) {
                                if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!user) { res.send({ responseCode: 200, responseMessage: "Coupon successfully sent to advertiser page." }); } else {
                                    for (var i = 0; i < user.hiddenGifts.length; i++) {
                                        if (user.hiddenGifts[i].adId == adId) {
                                            var code = user.hiddenGifts[i].hiddenCode;
                                        }
                                    }
                                    User.update({ 'hiddenGifts.adId': adId }, { $set: { 'hiddenGifts.$.status': "USED" } }, { new: true }, function(err, result2) {
                                        if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else {
                                            console.log("result2--->>", result2)
                                            console.log("code--->>", code)
                                            var message = 'Your hidden gift is:' + code
                                            if (result2.nModified == 1) {
                                                functions.otp(req.body.mobileNumber, message)
                                                res.send({
                                                    responseCode: 200,
                                                    responseMessage: "The hidden gift code has been sent to your mailbox successfully."
                                                })

                                            } else {
                                                res.send({
                                                    responseCode: 200,
                                                    responseMessage: "Coupon used successfully."
                                                })

                                            }
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    },

    "winnersFilterCodeBasis": function(req, res) {
        var pageId = req.body.pageId;
        var name = req.body.name;
        if (req.body.type == 'withCode') {
            if (!(req.body.name == null || req.body.name == undefined || req.body.name == '')) {
                var re = new RegExp(name, 'i');
                var condition = { 'hiddenGifts.pageId': pageId, 'hiddenGifts.status': "ACTIVE", 'firstName': { $regex: re } }
            } else {
                var condition = { 'hiddenGifts.pageId': pageId, 'hiddenGifts.status': "ACTIVE" }
            }
            User.aggregate({ $unwind: "$hiddenGifts" }, { $match: condition }).exec(function(err, result1) {
                if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (result1.length == 0) { res.send({ responseCode: 404, responseMessage: "No user found" }); } else {
                    res.send({
                        result: result1,
                        responseCode: 200,
                        responseMessage: "User show successfully."
                    })
                }
            })
        } else {

            if (!(req.body.name == null || req.body.name == undefined || req.body.name == '')) {
                var re = new RegExp(name, 'i');
                var condition = { 'coupon.pageId': pageId, 'coupon.status': "ACTIVE", 'firstName': { $regex: re } }
            } else {
                var condition = { 'coupon.pageId': pageId, 'coupon.status': "ACTIVE" }
            }

            console.log("condition--->>", condition)
            User.aggregate([{ $unwind: "$coupon" }, { $match: condition }]).exec(function(err, result2) {

                if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (result2.length == 0) { res.send({ responseCode: 404, responseMessage: "No user found" }); } else {
                    res.send({
                        result: result2,
                        responseCode: 200,
                        responseMessage: "User show successfully."
                    })
                }
            })
        }
    },

    "useCouponWithCode": function(req, res) {
        var couponId = req.body.couponId;
        User.findOne({ 'hiddenGifts._id': couponId }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else if (!result) { res.send({ responseCode: 404, responseMessage: "No user found" }); } else if (Boolean(result.hiddenGifts.find(hiddenGifts => hiddenGifts.status == "USED"))) { res.send({ responseCode: 400, responseMessage: "Coupon is already used" }); } else {
                User.update({ 'hiddenGifts._id': couponId }, { $set: { 'hiddenGifts.$.status': "USED" } }, { new: true }, function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else {
                        res.send({
                            // result: result2,
                            responseCode: 200,
                            responseMessage: "Coupon used successfully."
                        })
                    }
                })
            }
        })
    },

    "seeExchangeSentRequest": function(req, res) {
        var senderId = req.body.userId;
        console.log("receiverId-->>", senderId)
        createNewAds.aggregate({ $unwind: '$couponExchangeSent' }, { $match: { _id: new mongoose.Types.ObjectId(req.body.adId), 'couponExchangeSent.senderId': senderId, 'couponExchangeSent.couponExchangeStatus': "REQUESTED" } }, function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else if (!result) { res.send({ reponseCode: 404, responseMessage: "Please enter correct adId." }); } else {

                createNewAds.populate(result, {
                    path: 'couponExchangeSent.receiverId',
                    model: 'brolixUser',
                    select: 'firstName lastName image country state city'
                }, function(err, result1) {
                    res.send({
                        result: result1,
                        responseCode: 200,
                        responseMessage: "All request show successfully"
                    })
                })
            }
        })
    },

    "savePaymentRequest": function(req, res) {
        var payment = paypalPayment(req.body)
        payment.save(function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); }
            //  var token = jwt.sign(result, config.secreteKey);
            res.send({
                result: result,
                responseCode: 200,
                responseMessage: "Data saved successfully."
            });
        })
    },

    "blockUserSearch": function(req, res) {
        followerList.find({ userId: req.body.userId, followerStatus: "block" }).exec(function(err, result) {
            if (err) { res.send({ responseCode: 409, responseMessage: 'Internal server error' }); } else {
                var arr = [];
                result.forEach(function(result) {
                    arr.push(result.blockUserId)
                    console.log("arrr========");
                    console.log(arr);
                })
                var re = new RegExp(req.body.search, 'i');
                User.find({ $and: [{ _id: { $in: arr } }, { 'pageName': { $regex: re } }] }, function(err, newResult) {
                    for (var i = 0; i < newResult.length; i++) {
                        newResult[i].followerStatus = result[i].followerStatus;
                    }
                    res.send({
                        result: newResult,
                        responseCode: 200,
                        responseMessage: "Show list all block users."
                    });
                })
            }
        })
    },

    "userNotification": function(req, res) {
        User.find({ _id: req.body.userId }, function(err, result) {
            if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No user found" }); } else {
                var obj = result[0].notification;
                var sortArray = obj.sort(function(obj1, obj2) {
                    return obj2.CreatedAt - obj1.CreatedAt
                })
                res.send({
                    result: sortArray,
                    responseCode: 200,
                    responseMessage: "All details show successfully."
                });
            }
        })
    },

    "couponExchangeOff": function(req, res) {
        if (req.body.status == 'off') {
            waterfall([
                function(callback) {
                    User.findOneAndUpdate({ _id: req.body.userId }, { $set: { 'privacy.exchangeCoupon': req.body.status } }, function(err, user) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                            callback(null)
                        }
                    })
                },
                function(callback) {
                    var receiverId = req.body.userId;
                    createNewAds.find({ 'couponExchangeReceived.receiverId': receiverId }, function(err, user) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                            var array1 = [];
                            for (var i = 0; i < user.length; i++) {
                                for (var j = 0; j < user[i].couponExchangeReceived.length; j++) {
                                    if (user[i].couponExchangeReceived[j].receiverId == req.body.userId) {
                                        array1.push(user[i].couponExchangeReceived[j]._id)
                                    }
                                }
                            }
                            for (var k = 0; k < array1.length; k++) {
                                createNewAds.update({ 'couponExchangeReceived._id': array1[k] }, { $set: { 'couponExchangeReceived.$.couponExchangeStatus': "CANCEL" } }, { multi: true }, function(err, userResult) {
                                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                                        console.log("in loop g*******")
                                    }
                                })
                            }
                            callback(null)
                        }
                    })
                },
                function(callback) {
                    var senderId = req.body.userId;
                    createNewAds.find({ 'couponExchangeReceived.senderId': senderId }, function(err, user1) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                            var array2 = [];
                            for (var i = 0; i < user1.length; i++) {
                                for (var j = 0; j < user1[i].couponExchangeReceived.length; j++) {
                                    if (user1[i].couponExchangeReceived[j].senderId == req.body.userId) {
                                        array2.push(user1[i].couponExchangeReceived[j]._id)
                                    }
                                }
                            }
                            for (var k = 0; k < array2.length; k++) {
                                createNewAds.update({ 'couponExchangeReceived._id': array2[k] }, { $set: { 'couponExchangeReceived.$.couponExchangeStatus': "CANCEL" } }, { multi: true }, function(err, user1Result) {
                                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                                        console.log("in loop g*******")
                                    }
                                })
                            }
                            callback(null)
                        }
                    })
                },
                function(callback) {
                    var senderId = req.body.userId;
                    createNewAds.find({ 'couponExchangeSent.senderId': senderId }, function(err, user2) {
                        if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                            var array3 = [];
                            for (var i = 0; i < user2.length; i++) {
                                for (var j = 0; j < user2[i].couponExchangeSent.length; j++) {
                                    if (user2[i].couponExchangeSent[j].senderId == req.body.userId) {
                                        array3.push(user2[i].couponExchangeSent[j]._id)
                                    }
                                }
                            }
                            for (var k = 0; k < array3.length; k++) {

                                createNewAds.update({ 'couponExchangeSent._id': array3[k] }, { $set: { 'couponExchangeSent.$.couponExchangeStatus': "CANCEL" } }, { multi: true }, function(err, user2Result) {
                                    if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                                        console.log("in loop g*******")
                                    }
                                })
                            }
                            callback(null)
                        }
                    })
                },
            ], function(err, result) {
                res.send({
                    responseCode: 200,
                    responseMessage: 'Privacy updated successfully'
                })
            })
        } else {
            User.findOneAndUpdate({ _id: req.body.userId }, { $set: { 'privacy.exchangeCoupon': req.body.status } }, function(err, user) {
                if (err) { res.send({ responseCode: 500, responseMessage: 'Internal server error' }); } else {
                    res.send({
                        responseCode: 200,
                        responseMessage: 'Privacy updated successfully'
                    })
                }
            })
        }
    },

    // req.body {
    //     "myObj":[
    //             { "Date":"20/10/2017", "Amount":24, "Description":"createPage" },
    //             { "Date":"20/10/2017", "Amount":24, "Description":"createPage" },
    //             { "Date":"20/10/2017", "Amount":24, "Description":"createPage" },
    //             { "Date":"20/10/2017", "Amount":24, "Description":"createPage" },
    //             { "Date":"20/10/2017", "Amount":24, "Description":"createPage" },
    //         ],
    //     "email":"sakshigadia@gmail.com"
    // }
    "sendPaymentHistoryOnMailId": function(req, res, next) {

   
            var myObj = [
                { "Date":"20/10/2017", "Amount":24, "Description":"createPage" },
                { "Date":"20/10/2017", "Amount":24, "Description":"createPage" },
                { "Date":"20/10/2017", "Amount":24, "Description":"createPage" },
                { "Date":"20/10/2017", "Amount":24, "Description":"createPage" },
                { "Date":"20/10/2017", "Amount":24, "Description":"createPage" },
            ];
            var y='';
            y = "<table><tr><th>Date</th><th>Amount</th><th>Description</th></tr>"

            for (x in myObj) {
                y+= "<tr><td>"+myObj[x].Date+"</td><td>"+myObj[x].Amount+"</td><td>"+myObj[x].Description+"</td></tr>";
            }
            y+="</table>"

                var transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: "test.avi201@gmail.com",
                        pass: "Mobiloitte1"
                    }
                });

                var to = req.body.email

                var mailOption = {
                    from: "test.avi201@gmail.com",
                    to: req.body.email,
                    subject: 'Brolix Change Password ',
                    text: 'you have a new submission with following details',
                    html: y
                }
                
                console.log("Dta in mailOption : " + JSON.stringify(mailOption));
                transporter.sendMail(mailOption, function(error, info) {
                    if (error) { res.send({ responseCode: 400, responseMessage: 'Internal server error.' }) } 
                    else {
                        res.send({
                            responseCode: 200,
                            responseMessage: 'successfully sent your mail id.'
                        })
                    }
                })

    }







}



cron.schedule('*/2 * * * *', function() {
    User.find({ 'coupon.couponStatus': "VALID" }).exec(function(err, result) {
        if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); }
        //  else if (result.length == 0) { res.send({ responseCode: 404, responseMessage: "No coupon found" }); }
        // console.log("result-->>>",result)
        else {
            // console.log("else result-->>>",result)
            console.log("<<--else-->>")
            var array = [];
            var array1 = [];
            var startTime = new Date().toUTCString();
            var h = new Date(new Date(startTime).setHours(00)).toUTCString();
            var m = new Date(new Date(h).setMinutes(00)).toUTCString();
            var currentTime = Date.now(m)
            console.log("<<--currentTime-->>", new Date(currentTime))
            for (var i = 0; i < result.length; i++) {
                for (var j = 0; j < result[i].coupon.length; j++) {
                    if (currentTime >= new Date(result[i].coupon[j].expirationTime)) {
                        array.push(result[i].coupon[j]._id);
                        array1.push(result[i].coupon[j].adId)
                    } else {
                        console.log("time is not equal")
                    }
                }
            }
            for (var i = 0; i < array.length; i++) {
                User.update({ 'coupon._id': array[i] }, { $set: { 'coupon.$.couponStatus': "EXPIRED" } }, { multi: true }, function(err, result1) {
                    if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else {
                        createNewAds.update({ _id: { $in: array1 } }, { $set: { 'couponStatus': "EXPIRED" } }, function(err, result) {
                            if (err) { res.send({ responseCode: 500, responseMessage: "Internal server error" }); } else {

                            }

                        })

                    }
                })
            }
        }
        // res.send({
        //     result: result,
        //     responseCode: 200,
        //     responseMessage: "data shown successfully"
        // })
    })
})
