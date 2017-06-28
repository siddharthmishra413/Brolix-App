app.controller('managePaymentCtrl', function($scope, $window, userService, $timeout, $http, toastr, $state) {
    $(window).scrollTop(0, 0);
    $scope.$emit('headerStatus', 'Manage Payment');
    $scope.$emit('SideMenu', 'Manage Payment');
    $scope.tab = 'totalUsers';
    $scope.myForm = {};
    $scope.dashBordFilter = {};
    $scope.dollars = [];
    $scope.dollarsCashGift = [];
    $scope.brolix = [];
    $scope.brolixCoupon = [];
    $scope.firstss = true;
    $scope.secondss = false;

    $scope.winnerInfo = function(id) {
        console.log("id", id)

    }

    $scope.dateValidation = function(dtaa) {
        var dta = dtaa;
        var timestamp = new Date(dtaa).getTime();
        var nextday = timestamp + 8.64e+7;
        $scope.minDatee = new Date(nextday).toDateString();
    }

    userService.upgradeCardViewersList().success(function(res) {
        if (res.responseCode == 200) {
            $scope.dashBordFilterViewer = res.result;
        } else {
            // toastr.error(res.responseMessage);
        }
    })

    userService.luckCardViewersList().success(function(res) {
        if (res.responseCode == 200) {
            $scope.dashBordFilterChances = res.result;
        } else {
            // toastr.error(res.responseMessage);
        }
    })

    userService.userCouponStatus().success(function(res) {
        if (res.responseCode == 200) {
            $scope.couponStatus = res.result;
        } else {
            // toastr.error("something wents to roung")
        }
    })

    userService.userCashStatus().success(function(res) {
        if (res.responseCode == 200) {
            $scope.cashStatus = res.result;
        } else {
            // toastr.error("something wents to roung")
        }
    })


    userService.countryListData().success(function(res) {
        $scope.countriesFirst = res.result;
        $scope.countriesSecond = res.result;
        $scope.countriesThird = res.result;
        $scope.countriesFourth = res.result;
    })
    $scope.changeCountry = function(key) {

        var obj = {};

        if (key == 'first') {
            obj = {
                country: $scope.dashBordFilter.countriesFirst,
            }
            userService.cityListData(obj).success(function(res) {
                $scope.cityListFirst = res.result;
            })

        } else if (key == 'second') {
            obj = {
                country: $scope.dashBordFilter.countriesSecond,
            }
            userService.cityListData(obj).success(function(res) {
                $scope.cityListSecond = res.result;
            })
        } else if (key == 'third') {
            obj = {
                country: $scope.dashBordFilter.countriesThird,
            }
            userService.cityListData(obj).success(function(res) {
                $scope.cityListThird = res.result;
            })
        } else if (key == 'fourth') {
            console.log("ddd")
            obj = {
                country: $scope.dashBordFilter.countriesFourth,
            }
            userService.cityListData(obj).success(function(res) {
                $scope.cityListFourth = res.result;
            })
        } else {
            toastr.error("rrrrrrrrrrrr")

        }


    }

    userService.SoldUpgradeCard().success(function(res) {
        if (res.responseCode == 200) {
            $scope.showAllSoldUpgradeCardCount = res.count;
            $scope.dollars = res.result;
        } else {
            $scope.showAllSoldUpgradeCardCount = 0;
        }
    })

    userService.cashGift().success(function(res) { 
    console.log("resssssaa",JSON.stringify(res))       
        if (res.responseCode == 200) {
            $scope.count = res.count;
            $scope.dollarsCashGift = res.result;
        } else {
            $scope.count = 0;
        }
    })

    userService.SoldLuckCard().success(function(res) {
        $scope.brolix = [];
        if (res.responseCode == 200) {
            $scope.showAllSoldLuckCardCount = res.count;
            for (i = 0; i < res.result.length; i++) {
                $scope.brolix.push(res.result[i]);
            }
        } else {
            $scope.showAllSoldLuckCardCount = 0;
        }
    })

    userService.soldCoupons().success(function(res) {
        //console.log("4",JSON.stringify(res))    

        $scope.brolixCoupon = [];
        if (res.responseCode == 200) {
            $scope.SoldCouponsCount = res.count;
            for (i = 0; i < res.result.length; i++) {
                $scope.brolixCoupon.push(res.result[i]);
            }
        } else {
            $scope.SoldCouponsCount = 0;
        }
    })

    $scope.payment = function(data) {
        if (data == 'brolix') {
            $scope.firstss = false;
            $scope.secondss = true;
        } else if (data == 'dollars') {
            $scope.firstss = true;
            $scope.secondss = false;
        }
    }

    //********************** User Info (click on Name) ********************

    $scope.userInfo = function(id) {
        //console.log(JSON.stringify(id))

        userService.userInfo(id).then(function(success) {
            //console.log(JSON.stringify(success))
            if (success.data.responseCode == 200) {
                $scope.userDetail = success.data.result
                $("#userInfo").modal('show');
            } else {
                toastr.error(success.data.responseMessage);
            }

        }, function(err) {
            //console.log(err);
            toastr.error('Connection error.');
        })
    }

    //********************* CashGift, Sold Coupon and Ad ****************

    $scope.adInfo = function(id) {
        //console.log("adInfoId>>>"+JSON.stringify(id))
        userService.adInfo(id).then(function(success) {
            //console.log("adInfoId>>>"+JSON.stringify(success))
            if (success.data.responseCode == 200) {
                $scope.userDetail = success.data.result;
                $("#adInfo").modal('show');
                $scope.newDate = success.data.result.couponExpiryDate;
                //console.log("adInfo>>>>>>>>>>>>>"+JSON.stringify(success.data.result))
            } else {
                toastr.error(success.data.responseMessage)
            }

        }, function(err) {
            //console.log(err);
            toastr.error('Connection error.');
        })
    }
    $scope.cashGift = function(id) {
        //console.log("cashGiftId>>>"+JSON.stringify(id))
        userService.adInfo(id).then(function(success) {
            if (success.data.responseCode == 200) {
                $scope.userDetail = success.data.result;
                $("#cashGift").modal('show');
            } else {
                toastr.error(success.data.responseMessage)
            }

        }, function(err) {
            //console.log(err);
            toastr.error('Connection error.');
        })
    }


    //******************** top 50 Buyers *********************

    //   $scope.counter =1; 
    //      $scope.loadMore=function(){
    //         $scope.userDetail=[];
    //         userService.top_50_dollarsBuyers($scope.counter).then(function(success) {
    //              console.log("x"+JSON.stringify(success))
    //                 if(success.data.responseCode == 200){
    //                     var last = success.data.result.limit -1;
    //                         for(var i = 1; i <= success.data.result.total; i++) {
    //                           $scope.userDetail.push(last + i);
    //                         }
    //                     // $scope.userDetail=success.data.result.docs;


    //                         $scope.counter++;
    //                         // console.log(JSON.stringify(success.data.result))
    //                 } else{
    //                     toastr.error(success.data.responseMessage);
    //                 }

    //             },function(err){
    //                 console.log(err);
    //                  toastr.error('Connection error.');
    //         })
    //       } 

    // $scope.top_50_dollarsBuyers=function(){

    //       $("#top_50_buyers").modal('show');
    // }

    $scope.top_50_dollarsBuyers = function() {
        userService.top_50_dollarsBuyers().then(function(success) {
            console.log("success", success)
            if (success.data.responseCode == 200) {
                $scope.userDetail = success.data.result;
                $("#top_50_buyers").modal('show');
                // console.log(JSON.stringify(success.data.result))
            } else {
                toastr.error(success.data.responseMessage);
            }

        }, function(err) {
            //console.log(err);
            toastr.error('Connection error.');
        })
    }
    $scope.top_50_brolixBuyers = function() {
        userService.top_50_brolixBuyers(1).then(function(success) {
            // console.log("ressss",JSON.stringify(success))
            if (success.data.responseCode == 200) {

                $scope.userDetail = success.data.result;
                $("#top_50_buyers").modal('show');
                // console.log(JSON.stringify(success.data.result))
            } else {
                toastr.error(success.data.responseCode);
            }

        }, function(err) {
            //console.log(err);
            toastr.error('Connection error.');
        })
    }

    //*******************Total Price****************
    userService.totalDollarsPrice().then(function(res) {
        //console.log(JSON.stringify(res))
        if (res.data.responseCode == 200) {
            $scope.totalDollarsPrice = res.data.totalCash;
            if (res.data.totalCash == null)
                $scope.totalDollarsPrice = 0;
            //console.log("totalIncomeInCashFromUpgradeCard",JSON.stringify($scope.totalSoldLuckCardcount));
        } else {
            //toastr.error(res.responseMessage);
        }

    })
    userService.totalBrolixPrice().then(function(res) {
        // console.log(JSON.stringify(res))
        if (res.data.responseCode == 200) {
            $scope.totalBrolixPrice = res.data.totalBrolix;
            //console.log("totalIncomeInCashFromUpgradeCard",JSON.stringify($scope.totalSoldLuckCardcount));
        } else {
            //toastr.error(res.responseMessage);
        }

    })

    //************************Top 50 Ads ***********************

    $scope.top_50_Ads = function() {
        $scope.adsDetail = [];
        userService.top_50_Ads().then(function(success) {
            //console.log(JSON.stringify(success)) 
            if (success.data.responseCode == 200) {
                for (i = 0; i < success.data.result.length; i++) {
                    $scope.adsDetail.push(success.data.result[i]);
                    $("#top_50_Ads").modal('show');
                    success.data.result[i].couponExpiryDate = new Date(success.data.result[i].couponExpiryDate);
                }

            } else {
                toastr.error(success.data.responseCode);
            }

        }, function(err) {
            //onsole.log(err);
            toastr.error('Connection error.');
        })
    }


    //********************** page Name *************************

    $scope.pageInfo = function(id) {
        userService.pageInfo(id).then(function(success) {
            if (success.data.responseCode == 200) {
                $scope.pageDetail = success.data.result;
                $("#pageInfo").modal('show');
                // console.log(JSON.stringify($scope.pageDetail))
            } else {
                toastr.error(success.data.responseMessage)
            }

        }, function(err) {
            //console.log(err);
            toastr.error('Connection error.');
        })
    }


    //*********************** Used Ad **************************

    $scope.upgradeCardUsedAd = function(id) {
        $scope.usedAd = [];
        //console.log(JSON.stringify(id))
        var data = {
            "upgradeId": id
        }
        //console.log(JSON.stringify(data))
        userService.upgradeCardUsedAd(data).then(function(success) {
            if (success.data.responseCode == 200) {
                for (i = 0; i < success.data.result.length; i++) {
                    $scope.usedAd.push(success.data.result[i]);
                    $("#luckCardUsedAd").modal('show');
                    //console.log(JSON.stringify($scope.usedAd))
                    $scope.newDate = new Date((success.data.result[i].couponExpiryDate) * 1000);
                    //console.log(JSON.stringify($scope.newDate))
                }
            } else {
                toastr.error(success.data.responseMessage);
            }

        }, function(err) {
            //console.log(err);
            toastr.error('Connection error.');
        })
    }
    $scope.luckCardUsedAd = function(id) {
        $scope.usedAd = [];
        //console.log(JSON.stringify(id))
        var data = {
            "luckId": id
        }
        userService.luckCardUsedAd(data).then(function(success) {
            if (success.data.responseCode == 200) {
                for (i = 0; i < success.data.result.length; i++) {
                    $scope.usedAd.push(success.data.result[i]);
                    $("#luckCardUsedAd").modal('show');
                    //console.log(JSON.stringify($scope.usedAd))
                    $scope.newDate = new Date((success.data.result[i].couponExpiryDate) * 1000);
                    //console.log(JSON.stringify($scope.newDate ))
                }
            } else {
                toastr.error(success.data.responseMessage);
            }

        }, function(err) {
            //onsole.log(err);
            toastr.error('Connection error.');
        })
    }


    //*********************** Payment History **************************

    $scope.upgradePayment = function(id) {
        userService.upgradeCardPayment(id).then(function(success) {
            if (success.data.responseCode == 200) {
                $scope.upgradeUsedAd = [];
                $scope.upgradeCardObject = [];
                $("#upgradePayment").modal('show');
                // console.log(JSON.stringify(success.data.result))
                for (i = 0; i < success.data.result.length; i++) {
                    for (j = 0; j < success.data.result[i].UpgradeUsedAd.length; j++) {
                        $scope.upgradeUsedAd.push(success.data.result[i].upgradeUsedAd[j].adId);
                        // console.log(JSON.stringify($scope.upgradeUsedAd))
                    }
                    for (k = 0; k < success.data.result[i].upgradeCardObject.length; k++) {
                        $scope.upgradeCardObject.push(success.data.result[i].upgradeCardObject[k]);
                        // console.log(JSON.stringify($scope.upgradeCardObject))
                    }

                }
            } else {
                toastr.error(success.data.responseMessage)
            }

        }, function(err) {
            //console.log(err);
            toastr.error('Connection error.');
        })
    }
    $scope.luckPayment = function(id) {
        userService.luckCardPayment(id).then(function(success) {
            $scope.luckUsedAd = [];
            $scope.luckCardObject = [];
            $("#luckPayment").modal('show');
            // console.log(JSON.stringify(success.data.result))
            for (i = 0; i < success.data.result.length; i++) {
                for (j = 0; j < success.data.result[i].luckUsedAd.length; j++) {
                    $scope.luckUsedAd.push(success.data.result[i].luckUsedAd[j].adId);
                    // console.log(JSON.stringify($scope.luckUsedAd))
                }
                for (k = 0; k < success.data.result[i].luckCardObject.length; k++) {
                    $scope.luckCardObject.push(success.data.result[i].luckCardObject[k]);
                    // console.log(JSON.stringify($scope.luckCardObject))
                }

            }
        }, function(err) {
            //console.log(err);
            toastr.error('Connection error.');
        })
    }

    //*******************Total Sold UpgradeCard****************

    userService.totalSoldUpgradeCard().success(function(res) {
        if (res.responseCode == 200) {
            $scope.totalSoldUpgradeCard = res.result;
            //console.log("totalSoldUpgradeCardtotalSoldUpgradeCard",JSON.stringify($scope.totalSoldUpgradeCard));
        } else {
            //toastr.error(res.responseMessage);
        }

    })

    //*******************Total Sold LuckCard****************

    userService.totalSoldLuckCard().success(function(res) {
        if (res.responseCode == 200) {
            //console.log("ressssssssss",JSON.stringify(res))
            $scope.totalSoldLuckCard = res.result;
            // $scope.totalIncome = res.totalIncome;
            $scope.totalSoldLuckCardcount = res.count;
            //console.log("totalIncomeInCashFromUpgradeCard",JSON.stringify($scope.totalSoldLuckCardcount));
        } else {
            //toastr.error(res.responseMessage);
        }

    })
    //**************************** Page Count *******************************

    $scope.pageCount = function(id) {
        //console.log(JSON.stringify(id))
        $scope.page = [];
        userService.pageCount(id).then(function(success) {
            if (success.data.responseCode == 200) {
                for (i = 0; i < success.data.result.length; i++) {
                    $scope.page.push(success.data.result[i]);
                }
                // console.log("pages>>>>>>"+JSON.stringify($scope.page))
                $("#Pages").modal('show');
            } else {
                toastr.error(success.data.responseMessage)
            }
        }, function(err) {
            //console.log(err);
            toastr.error('Connection error.');
        })
    }

    //**************************** Payment Paypal *******************************
    $scope.paymentPaypal = function(type) {
        $scope.paymentPay = [];
        var data = {
            "type": type
        }
        userService.paymentPaypal(data).then(function(success) {
            // console.log(JSON.stringify(success)) 
            if (success.data.responseCode == 200) {
                for (i = 0; i < success.data.result.length; i++) {
                    $scope.paymentPay.push(success.data.result[i]);
                }
                $("#paymentPaypal").modal('show');
                console.log(JSON.stringify($scope.paymentPay))
            } else {
                toastr.error(success.data.responseMessage)
            }
        }, function(err) {
            //console.log(err);
            toastr.error('Connection error.');
        })

    }

    //************************** Contact Buyers and Winners ******************

    $scope.total_user_message = function(modal) {
        // console.log("Contact Modal >>>>>>>>>>"+JSON.stringify(modal))
        $scope.modalId = modal;
        $scope.modelData = modal;
        $scope.sendMessage.massage = '';
        if ($scope.modalId == '' || $scope.modalId == undefined || $scope.modalId == null) {
            toastr.error("Please select user.")
            $state.go('header.userServices')
        } else {
            $("#sendMessageModelAllUser").modal('show');
        }
    }

    $scope.send_massage = function() {
        var array = [];
        var data = {};

        switch ($scope.modelData) {
            case 'dollars':

                for (var i = 0; i < $scope.dollars.length; i++) {
                    array.push($scope.dollars[i]._id)
                }
                $scope.sendMessage.massage = '';
                data = {
                    Message: $scope.sendMessage.massage,
                    Id: array
                }
                userService.sendMassageAllUser(data).success(function(res) {
                    if (res.responseCode == 200) {
                        toastr.success("Message Sent Successfully to All Buyers");
                        $("#sendMessageModelAllUser").modal('hide');
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;

            case 'brolix':
                for (var i = 0; i < $scope.brolix.length; i++) {
                    array.push($scope.brolix[i]._id)
                }
                data = {
                    Message: $scope.sendMessage.massage,
                    Id: array
                }
                userService.sendMassageAllUser(data).success(function(res) {
                    if (res.responseCode == 200) {
                        toastr.success("Message Sent Successfully to All Buyers");
                        $scope.sendMessage.massage = '';
                        $("#sendMessageModelAllUser").modal('hide');
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;

            case 'dollarsCashGift':
                for (var i = 0; i < $scope.dollarsCashGift.length; i++) {
                    array.push($scope.dollarsCashGift[i]._id)
                }
                data = {
                    Message: $scope.sendMessage.massage,
                    Id: array
                }
                userService.sendMassageAllUser(data).success(function(res) {
                    if (res.responseCode == 200) {
                        toastr.success("Message Sent Successfully to All Winners");
                        $scope.sendMessage.massage = '';
                        $("#sendMessageModelAllUser").modal('hide');
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })

                break;

            case 'brolixCoupon':
                for (var i = 0; i < $scope.brolixCoupon.length; i++) {
                    array.push($scope.brolixCoupon[i]._id)
                }
                data = {
                    Message: $scope.sendMessage.massage,
                    Id: array
                }
                userService.sendMassageAllUser(data).success(function(res) {
                    if (res.responseCode == 200) {
                        toastr.success("Message Sent Successfully to All Buyers");
                        $scope.sendMessage.massage = '';
                        $("#sendMessageModelAllUser").modal('hide');
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;

            default:
                array.push($scope.modalId)
                data = {
                    Message: $scope.sendMessage.massage,
                    Id: array
                }
                userService.sendMassageAllUser(data).success(function(res) {
                    if (res.responseCode == 200) {
                        toastr.success("Message Send Successfully to User");
                        $scope.sendMessage.massage = '';
                        $("#sendMessageModelAllUser").modal('hide');
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
        }

    }

    //   // ***************Filters for Country, State and City*********************

    //   var currentCities=[];
    //   $scope.currentCountry= '';
    //   $scope.countriesList=[];
    //   $scope.myForm={};
    //   var BATTUTA_KEY="00000000000000000000000000000000"
    // url="http://battuta.medunes.net/api/country/all/?key="+BATTUTA_KEY+"&callback=?";
    //   $.getJSON(url,function(countries)
    //   {
    //     $timeout(function(){
    //       $scope.countriesList=countries;
    //        $scope.brolixCountryList=countries;
    //     },100)


    //   });
    // $scope.country1Code;
    // $scope.country2Code;
    //   $scope.changeCountry = function(ind){
    //       if(ind=='1'){
    //           for(var i=0; i<$scope.countriesList.length;i++) {
    //               if($scope.countriesList[i].name==$scope.dashBordFilter.country) {
    //                  $scope.country1Code=$scope.countriesList[i].code;
    //                  break;
    //               }
    //           }
    //       }
    //       else{
    //           for(var i=0;i<$scope.brolixCountryList.length;i++) {
    //               if($scope.brolixCountryList[i].name==$scope.myForm.country) {
    //                   $scope.country2Code=$scope.brolixCountryList[i].code;
    //                   break;
    //               }

    //           }
    //       }

    //     // }
    //     if(ind=='1') {
    //             var url="http://battuta.medunes.net/api/region/"+$scope.country1Code+"/all/?key="+BATTUTA_KEY+"&callback=?";
    //             $.getJSON(url,function(regions)
    //             {
    //                $timeout(function(){
    //                       $scope.state1List = regions;
    //                 },100)
    //             });

    //       }
    //       else{
    //           var url="http://battuta.medunes.net/api/region/"+$scope.country2Code+"/all/?key="+BATTUTA_KEY+"&callback=?";
    //             $.getJSON(url,function(regions)
    //             {
    //                $timeout(function(){
    //                       $scope.state2List = regions;
    //                       // console.log("State2 List",JSON.stringify( $scope.state2List))
    //                 },100)
    //             });
    //           }
    //       }

    //   $scope.changeState = function(ind){
    //       if(ind=='1') {
    //               //console.log('State:   '+JSON.stringify($scope.dashBordFilter.state))
    //             var url="http://battuta.medunes.net/api/city/"+$scope.country1Code+"/search/?region="+$scope.dashBordFilter.state+"&key="+BATTUTA_KEY+"&callback=?";
    //             $.getJSON(url,function(cities)
    //             {
    //                $timeout(function(){
    //                       $scope.city1List = cities;
    //                   },100)
    //             })
    //        }
    //        else{
    //           //console.log('State:   '+JSON.stringify($scope.myForm.state))
    //             var url="http://battuta.medunes.net/api/city/"+$scope.country2Code+"/search/?region="+$scope.myForm.state+"&key="+BATTUTA_KEY+"&callback=?";
    //             $.getJSON(url,function(cities)
    //             {
    //                $timeout(function(){
    //                       $scope.city2List = cities;
    //                   },100)
    //             })
    //        }

    //   }

    //-------------------------------END OF SELECT CASCADING-------------------------//



    // ******************DashBoard Filters *********************


    $scope.dashBordFilter = function(key) {
        console.log("key", key)
        var data = {};
        if (key == 'soldUpgradeCards') {
            data = {
                paymentCardType: 'soldUpgradeCards',
                country: $scope.dashBordFilter.countriesFirst,
                city: $scope.dashBordFilter.cityListFirst,
                cardType: parseInt($scope.dashBordFilter.dollarCardTypeFirst),
                joinFrom: new Date($scope.dashBordFilter.dobFromFirst).getTime(),
                joinTo: new Date($scope.dashBordFilter.dobToFirst).getTime(),
            }
            console.log("1", JSON.stringify(data))

            userService.filterDollars(data).success(function(res) {
                // console.log("ressss111",JSON.stringify(res))
                if (res.responseCode == 400) {
                    $scope.dollars = [];
                } else if (res.responseCode == 200) {
                    $scope.showAllSoldUpgradeCardCount = res.count;
                    $scope.dollars = res.result;
                } else {
                    toastr.error(res.responseMessage)
                }
            })

        } else if (key == 'cashGifts') {
            console.log("22")
            data = {
                paymentCardType: 'cashGifts',
                country: $scope.dashBordFilter.countriesSecond,
                city: $scope.dashBordFilter.cityListSecond,
                cashStatus: $scope.dashBordFilter.cashStatus,
                joinFrom: new Date($scope.dashBordFilter.dobFromSecond).getTime(),
                joinTo: new Date($scope.dashBordFilter.dobToSecond).getTime(),
            }
            console.log("2", JSON.stringify(data))

            userService.filterDollars(data).success(function(res) {
                console.log("ressss", JSON.stringify(res))

                if (res.responseCode == 400) {
                    $scope.dollars = [];
                } else if (res.responseCode == 200) {
                    $scope.count = res.count;
                    $scope.dollarsCashGift = res.result;
                }
            })

        } else if (key == 'soldLuckCard') {
            data = {
                paymentCardType: 'soldLuckCard',
                country: $scope.dashBordFilter.countriesThird,
                city: $scope.dashBordFilter.cityListThird,
                cardType: $scope.dashBordFilter.brolixCardType,
                joinFrom: new Date($scope.dashBordFilter.dobFromThird).getTime(),
                joinTo: new Date($scope.dashBordFilter.dobToThird).getTime(),
            }
            console.log("3", JSON.stringify(data))

            userService.filterBrolix(data).success(function(res) {
                if (res.responseCode == 400) {
                    $scope.brolix = [];
                } else if (res.responseCode == 200) {
                    $scope.brolix = res.result;
                    $scope.showAllSoldLuckCardCount = res.count;
                }
            })

        } else if (key == 'soldCoupon') {
            data = {
                paymentCardType: 'soldCoupon',
                country: $scope.dashBordFilter.countriesFourth,
                city: $scope.dashBordFilter.cityListFourth,
                couponStatus: $scope.dashBordFilter.couponStatus,
                joinFrom: new Date($scope.dashBordFilter.dobFromFourth).getTime(),
                joinTo: new Date($scope.dashBordFilter.dobToFourth).getTime(),
            }
            console.log("4", JSON.stringify(data))

            userService.filterBrolix(data).success(function(res) {
                if (res.responseCode == 400) {
                    $scope.dollars = [];
                } else if (res.responseCode == 200) {
                    $scope.brolixCoupon = res.result;
                    $scope.SoldCouponsCount = res.count;
                }
            })

        }
    }

    $scope.newdashBordFilter = function(type) {
        //console.log("country---"+$scope.dashBordFilter.country)
        if ($scope.dashBordFilter.country == 'undefined' || $scope.dashBordFilter.country == null || $scope.dashBordFilter.country == '') {
            $scope.dashBordFilter.country = ''

        }
        if ($scope.dashBordFilter.state == 'undefined' || $scope.dashBordFilter.state == null || $scope.dashBordFilter.state == '') {
            $scope.dashBordFilter.state = ''

        }
        if ($scope.dashBordFilter.city == 'undefined' || $scope.dashBordFilter.city == null || $scope.dashBordFilter.city == '') {
            $scope.dashBordFilter.city = ''

        }
        if ($scope.myForm.country == 'undefined' || $scope.myForm.country == null || $scope.myForm.country == '') {
            $scope.myForm.country = ''

        }
        if ($scope.myForm.state == 'undefined' || $scope.myForm.state == null || $scope.myForm.state == '') {
            $scope.myForm.state = ''

        }
        if ($scope.myForm.city == 'undefined' || $scope.myForm.city == null || $scope.myForm.city == '') {
            $scope.myForm.city = ''

        }
        //console.log(JSON.stringify(type));
        var data = {};

        switch (type) {
            case 'dollars':
                $scope.dollars = [];
                // alert("1");
                data = {
                    paymentCardType: "soldUpgradeCards",
                    joinTo: new Date($scope.dashBordFilter.dobTo).getTime(),
                    joinFrom: new Date($scope.dashBordFilter.dobFrom).getTime(),
                    country: $scope.dashBordFilter.country,
                    state: $scope.dashBordFilter.state,
                    city: $scope.dashBordFilter.city,
                    cardType: $scope.dashBordFilter.dollarCardType

                }
                //console.log(JSON.stringify(data))


                break;

            case 'brolix':
                $scope.brolix = [];
                // alert("2");
                data = {
                    paymentCardType: "soldLuckCard",
                    joinTo: new Date($scope.dashBordFilter.dobTo).getTime(),
                    joinFrom: new Date($scope.dashBordFilter.dobFrom).getTime(),
                    country: $scope.dashBordFilter.country,
                    city: $scope.dashBordFilter.city,
                    cardType: $scope.dashBordFilter.brolixCardType
                }
                //console.log("brolix"+JSON.stringify(data))
                userService.filterBrolix(data).success(function(res) {
                    //console.log("hello"+JSON.stringify(res))
                    if (res.responseCode == 400) {
                        $scope.brolix = [];
                    } else if (res.responseCode == 200) {
                        $scope.brolix = res.result;
                        //console.log("ressssssss2"+JSON.stringify($scope.brolix));
                    }

                })

                break;

            case 'dollarsCashGift':
                $scope.dollarsCashGift = [];
                // alert("3");
                data = {
                    paymentCardType: "cashGifts",
                    joinTo: new Date($scope.myForm.dateTo).getTime(),
                    joinFrom: new Date($scope.myForm.dateFrom).getTime(),
                    country: $scope.myForm.country,
                    state: $scope.myForm.state,
                    city: $scope.myForm.city,
                    cashStatus: $scope.myForm.cashStatus
                }
                //console.log("dollarsCashGift"+JSON.stringify(data))
                userService.filterDollars(data).success(function(res) {
                    //console.log("hello"+JSON.stringify(res))
                    if (res.responseCode == 400) {
                        $scope.dollarsCashGift = [];
                    } else if (res.responseCode == 200) {
                        $scope.dollarsCashGift = res.result;
                        //console.log("ressssssss3"+JSON.stringify($scope.dollarsCashGift));
                    }

                })

                break;

            case 'brolixCoupon':
                $scope.brolixCoupon = [];
                //console.log("4");
                data = {
                    paymentCardType: "soldCoupon",
                    joinTo: new Date($scope.myForm.dateTo).getTime(),
                    joinFrom: new Date($scope.myForm.dateFrom).getTime(),
                    country: $scope.myForm.country,
                    state: $scope.myForm.state,
                    city: $scope.myForm.city,
                    couponStatus: $scope.myForm.couponStatus
                }
                //console.log("brolixCoupon"+JSON.stringify(data)) 
                userService.filterBrolix(data).success(function(res) {
                    //console.log("hello"+JSON.stringify(res))
                    if (res.responseCode == 400) {
                        $scope.brolixCoupon = [];
                    } else if (res.responseCode == 200) {
                        $scope.brolixCoupon = res.result;
                        //console.log("ressssssss4"+JSON.stringify($scope.brolixCoupon));
                    }

                })

                break;

            default:
                toastr.error("something went wrong");
        }

    }


    $scope.export = function() {
        html2canvas(document.getElementById('managePayment'), {
            onrendered: function(canvas) {
                var data = canvas.toDataURL();
                var docDefinition = {
                    content: [{
                        image: data,
                        width: 500,
                    }]
                };
                pdfMake.createPdf(docDefinition).download("test.pdf");
            }
        });
    }

})
app.filter("manageFilter", function() {
    return function(items, nameValue) {
        // console.log(JSON.stringify(items))
        if (!nameValue) {
            return retArray = items;
        }
        var retArray = [];
        for (var i = 0; i < items.length; i++) {
            if (items[i].firstName || items[i].lastName) {
                if (items[i].firstName.toLowerCase().substr(0, nameValue.length) == nameValue.toLowerCase() || items[i].lastName.toLowerCase().substr(0, nameValue.length) == nameValue.toLowerCase()) {
                    retArray.push(items[i]);
                }
            }
        }
        return retArray
    }
});

app.filter("managePaymentFilter", function() {
    return function(items, nameValue) {
        // console.log(JSON.stringify(items))

        if (!nameValue) {
            return retArray = items;
        }
        var retArray = [];
        for (var i = 0; i < items.length; i++) { //items[i].cashPrize.pageId.firstName ||
            if (items[i].firstName || items[i].lastName || items[i].cashPrize.pageId.pageName) {
                // items[i].cashPrize.pageId.userId.firstName.toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() || items[i].lastName.toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() ||
                if (items[i].firstName.toLowerCase().substr(0, nameValue.length) == nameValue.toLowerCase() || items[i].lastName.toLowerCase().substr(0, nameValue.length) == nameValue.toLowerCase() || items[i].cashPrize.pageId.pageName.toLowerCase().substr(0, nameValue.length) == nameValue.toLowerCase()) {
                    retArray.push(items[i]);
                }
            }
        }
        return retArray
    }
});
app.filter("managePaymentSoldCouponFilter", function() {
    return function(items, nameValue) {
        // console.log(JSON.stringify(items))

        if (!nameValue) {
            return retArray = items;
        }
        var retArray = [];
        for (var i = 0; i < items.length; i++) { //||  items[i].coupon.pageId.pageName || items[i].coupon.pageId.userId.firstName || items[i].coupon.pageId.userId.lastName
            //console.log(JSON.stringify(items[i].coupon));
            if (items[i].firstName || items[i].lastName) {
                //||items[i].coupon.pageId.userId.firstName.toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() || items[i].coupon.pageId.userId.lastName.toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() || items[i].coupon.pageId.pageName.toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase()
                if (items[i].firstName.toLowerCase().substr(0, nameValue.length) == nameValue.toLowerCase() || items[i].lastName.toLowerCase().substr(0, nameValue.length) == nameValue.toLowerCase()) {
                    retArray.push(items[i]);
                }
            }
        }
        return retArray
    }
});