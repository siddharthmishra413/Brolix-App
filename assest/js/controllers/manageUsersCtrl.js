app.controller('manageUsersCtrl', function($scope, $window, userService, $state, toastr, $http, $timeout) {
    $(window).scrollTop(0, 0);
    $scope.class = true;
    $scope.$emit('headerStatus', 'Manage User');
    $scope.$emit('SideMenu', 'Manage User');
    $scope.tab = 'totalUsers';
    $scope.myForm = {};
    $scope.sendMessage = {};
    $scope.sendBrolix = {};
    $scope.sendCash = {};
    $scope.countrieName = {};
    $scope.stateName = {};
    $scope.active_upgrade_card=true;
    $scope.cardType = 'upgrade_card';
    $scope.dashBordFilter = {};
    $scope.ageLimit = [];

    for (var i = 15; i <99; i++){
      $scope.ageLimit.push(i);
    }

    $scope.showPageDetails = function(id){
        //console.log("id---------",id);
        userService.showUserPage(id).success(function(res) {
           if(res.responseCode ==  200) {
            $scope.allshowUserPage = res.result;
            $("#pageDetails").modal('show');
            //console.log("$scope.allshowUserPage",JSON.stringify($scope.allshowUserPage))
        }else{
          toastr.error(res.responseMessage);

        }

        })
    }


    $scope.addcardId = function(id){
        $scope.cardId = id;

      // userService.removeCard(id).success(function(res){
      //   if(res.responseCode ==  200) {
      //     toastr.success(res.responseMessage);
      //     $state.reload();
      //   }else{
      //     toastr.error(res.responseMessage);
      //     $state.reload();
      //   }
      // })

    }


    userService.viewcard($scope.cardType).success(function(res) {
      //console.log("resssssssssssssss",res)
        $scope.UpgradeCard = res.data;
        //console.log("UpgradeCard",$scope.UpgradeCard);
    })

    userService.showListOFCoupon().success(function(res) {
      //console.log("resssssssssssssss",res)
        $scope.allCoupons = res.result;
        console.log("allCoupons",JSON.stringify($scope.allCoupons));
    })

    $scope.export = function(){
        html2canvas(document.getElementById('manageUserTable'), {
            onrendered: function (canvas) {
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

    $scope.userTypeName = function(val) {
        //$state.reload();
        //console.log("val",val)
        localStorage.setItem('userTypeName',val);

         switch (val)
            {
                case 'totalUsers':

                $scope.currentPage = 1;
                $scope.nextTotalUserDetail();

                break;

                case 'personalUsers':

                $scope.currentPersonalUser = 1;
                $scope.nextpersonalUserDetail();

                break;

                case 'businessUsers':

                $scope.currentBusinessUser = 1;
                $scope.nextBusinessUserDetail();

                break;

                case 'liveUsers':

                $scope.currentLiveUser = 1;
                $scope.nextLiveUserDetail();

                break;

                case 'totalWinners':

                $scope.currentTotalWinners = 1;
                $scope.nextTotalWinnersDetail();

                break;

                case 'cashWinners':

                $scope.currentCashWinners = 1;
                $scope.nextCashWinnersDetail();

                break;

                case 'couponWinners':

                $scope.currentCouponWinners = 1;
                $scope.nextCouponWinnersDetail();

                break;

                case 'blockedUsers':

                $scope.currentBlockUser = 1;
                $scope.nextBlockUserDetail();

                break;

                default:
                toastr.error("Somwthing wents to wroung");
            }
    }


    // $scope.slectCountry = function(qq){
    //     console.log("dashBordFilter.country----------",$scope.dashBordFilter.country);
    //     userService.allstatefind($scope.dashBordFilter.country).success(function(res) {
    //     $scope.allstatefind = res.result;
    // })
    // }

//-------------------------------SELECT CASCADING COUNTRY, STATE & CITY FILTER-------------------------//
    var currentCities=[];
    $scope.currentCountry= '';
var BATTUTA_KEY="00000000000000000000000000000000"
    // Populate country select box from battuta API
  url="http://battuta.medunes.net/api/country/all/?key="+BATTUTA_KEY+"&callback=?";
    $.getJSON(url,function(countries)
    {
      $timeout(function(){
        $scope.countriesList=countries;
      },100)


    });
  var countryCode;
    $scope.changeCountry = function(){
      for(var i=0;i<$scope.countriesList.length;i++){
        if($scope.countriesList[i].name==$scope.dashBordFilter.country){
          countryCode=$scope.countriesList[i].code;
          //console.log(countryCode)
          break;
        }
      }
      var url="http://battuta.medunes.net/api/region/"+countryCode+"/all/?key="+BATTUTA_KEY+"&callback=?";
      $.getJSON(url,function(regions)
      {
        //console.log('state list:   '+JSON.stringify(regions))
            $timeout(function(){
             $scope.stateList = regions;
            },100)
      });
    }

    $scope.changeState = function(){
      //console.log('detail -> '+countryCode+' city name -> '+$scope.dashBordFilter.state)
      var url="http://battuta.medunes.net/api/city/"+countryCode+"/search/?region="+$scope.dashBordFilter.state+"&key="+BATTUTA_KEY+"&callback=?";
      $.getJSON(url,function(cities)
      {
        // console.log('city list:   '+JSON.stringify(cities))
            $timeout(function(){
             $scope.cityList = cities;
            },100)
      })
    }
    //-------------------------------END OF SELECT CASCADING-------------------------//


    //*******************Total Winners****************
    $scope.currentTotalWinners = 1;
     $scope.nextTotalWinnersDetail = function(){
         userService.totalWinners($scope.currentTotalWinners).success(function(res) {

            if (res.responseCode == 200){
                   $scope.noOfPagesTotalWinners = res.result.pages;
                   $scope.pageTotalWinners= res.result.page;
                   $scope.totalWinners = res.result.docs;
                   $scope.totalWinnersCount = res.result.total;
               }
               else {
                toastr.error(res.responseMessage);
                }
          })
     }
     $scope.nextTotalWinnersDetail();
     $scope.nextTotalWinners = function(){
        $scope.currentTotalWinners++;
        $scope.nextTotalWinnersDetail();
     }
     $scope.preTotalWinners= function(){
        $scope.currentTotalWinners--;
        $scope.nextTotalWinnersDetail();
     }



    userService.adminProfile().success(function(res) {
        if (res.responseCode == 404) {
            toastr.error(res.responseMessage);
            $state.go('login')
        } else {
            $scope.user = res.result;
        }
    })

    //*******************Total User****************

    $scope.currentPage = 1;
     $scope.nextTotalUserDetail = function(){
       // console.log('page number TotalUserDetail -> '+$scope.currentPage);
         userService.totalUser($scope.currentPage).success(function(res) {
          //console.log(JSON.stringify(res))
            if (res.responseCode == 200){
                   $scope.noOfPages = res.result.pages;
                   $scope.pageNo = res.result.page;
                   $scope.totalUser = res.result.docs;
                   $scope.totalUserCount = res.result.total;
               }
               else {
                toastr.error(res.responseMessage);
                }
          })
     }
     $scope.nextTotalUserDetail();
     $scope.nextClk = function(){
        $scope.currentPage++;
        $scope.nextTotalUserDetail();
     }
     $scope.preClk = function(){
        $scope.currentPage--;
        $scope.nextTotalUserDetail();
     }

    //*******************Personal User****************

     $scope.currentPersonalUser = 1;
     $scope.nextpersonalUserDetail = function(){
         userService.showAllPersonalUser($scope.currentPersonalUser).success(function(res) {
            if (res.responseCode == 200){
                   $scope.noOfPagesPersonalUser = res.result.pages;
                   $scope.pagePersonalUser= res.result.page;
                   $scope.personalUser = res.result.docs;
                   $scope.personalUserCount = res.result.total;
               }
               else {
                toastr.error(res.responseMessage);
                }
          })
     }
     $scope.nextpersonalUserDetail();
     $scope.nextPersonalUser = function(){
        $scope.currentPersonalUser++;
        $scope.nextpersonalUserDetail();
     }
     $scope.prePersonalUser= function(){
        $scope.currentPersonalUser--;
        $scope.nextpersonalUserDetail();
     }


    //*******************Business User****************


    $scope.currentBusinessUser = 1;
     $scope.nextBusinessUserDetail = function(){
         userService.showAllBusinessUser($scope.currentBusinessUser).success(function(res) {
            if (res.responseCode == 200){
                   $scope.noOfPagesBusinessUser = res.result.pages;
                   $scope.pageBusinessUser= res.result.page;
                   $scope.businessUser = res.result.docs;
                   $scope.businessUserCount = res.result.total;
               }
               else {
                toastr.error(res.responseMessage);
                }
          })
     }
     $scope.nextBusinessUserDetail();
     $scope.nextBusinessUser = function(){
        $scope.currentBusinessUser++;
        $scope.nextBusinessUserDetail();
     }
     $scope.preBusinessUser= function(){
        $scope.currentBusinessUser--;
        $scope.nextBusinessUserDetail();
     }

    //*******************Cash Winners****************

    $scope.currentCashWinners = 1;
     $scope.nextCashWinnersDetail = function(){
       //console.log('page number personalUserDetail-> '+$scope.currentCashWinners);
         userService.showAllCashWinners($scope.currentCashWinners).success(function(res) {
            if (res.responseCode == 200){
                   //console.log("resresresres",res)
                   $scope.noOfPagesCashWinners = res.result.pages;
                   $scope.pageCashWinners= res.result.page;
                   $scope.cashWinners = res.result.docs;
                   $scope.cashWinnersCount = res.result.total;
                   //console.log("$scope.cashWinnersCount",$scope.cashWinnersCount)
               }
               else {
                toastr.error(res.responseMessage);
                }
          })
     }
     $scope.nextCashWinnersDetail();
     $scope.nextCashWinners = function(){
        $scope.currentCashWinners++;
        $scope.nextCashWinnersDetail();
     }
     $scope.preCashWinners= function(){
        $scope.currentCashWinners--;
        $scope.nextCashWinnersDetail();
     }

    //*******************Coupon Winners****************
    $scope.currentCouponWinners = 1;
     $scope.nextCouponWinnersDetail = function(){
         userService.showAllCouponWinners($scope.currentCouponWinners).success(function(res) {
            // console.log("dddd",JSON.stringify(res))
            if (res.responseCode == 200){
                   $scope.noOfPagesCouponWinners = res.result.pages;
                   $scope.pageCouponWinners= res.result.page;
                   $scope.couponWinners = res.result.docs;
                   $scope.couponWinnersCount = res.result.total;
               }
               else {
                toastr.error(res.responseMessage);
                }
          })
     }
     $scope.nextCouponWinnersDetail();
     $scope.nextCouponWinners = function(){
        $scope.currentCouponWinners++;
        $scope.nextCouponWinnersDetail();
     }
     $scope.preCouponWinners= function(){
        $scope.currentCouponWinners--;
        $scope.nextCouponWinnersDetail();
     }

     //*******************Show AllBlockUser****************
     $scope.currentBlockUser = 1;
     $scope.nextBlockUserDetail = function(){
         userService.showAllBlockUser($scope.currentBlockUser).success(function(res) {
            if (res.responseCode == 200){
                   $scope.noOfPagesBlockUser = res.result.pages;
                   $scope.pageBlockUser= res.result.page;
                   $scope.allblockUser = res.result.docs;
                   $scope.allblockUserCount = res.result.total;
               }
               else {
                toastr.error(res.responseMessage);
                }
          })
     }
     $scope.nextBlockUserDetail();
     $scope.nextBlockUser = function(){
        $scope.currentBlockUser++;
        $scope.nextBlockUserDetail();
     }
     $scope.preBlockUser= function(){
        $scope.currentBlockUser--;
        $scope.nextBlockUserDetail();
     }


    //************** Live Users *******************

 $scope.currentLiveUser = 1;
     $scope.nextLiveUserDetail = function(){
         userService.showAllLiveUsers($scope.currentLiveUser).success(function(res) {
            if (res.responseCode == 200){
                   $scope.noOfPagesLiveUser = res.result.pages;
                   $scope.pageLiveUser= res.result.page;
                   $scope.liveUser = res.result.docs;
                   $scope.LiveUserCount = res.result.total;
               }
               else {
                toastr.error(res.responseMessage);
                }
          })
     }
     $scope.nextLiveUserDetail();
     $scope.nextLiveUser = function(){
        $scope.currentLiveUser++;
        $scope.nextLiveUserDetail();
     }
     $scope.preLiveUser= function(){
        $scope.currentLiveUser--;
        $scope.nextLiveUserDetail();
     }


    $scope.active_tab=function(active_card){
        if(active_card=='upgrade_card'){
        $scope.active_upgrade_card=true;
         $scope.active_luck_card=false;
      }else{
        userService.viewcard(active_card).success(function(res) {
        //console.log("resssssssssssssss",res)
        $scope.LuckCard = res.data;
        //console.log("LuckCard",$scope.LuckCard);
    })
         $scope.active_upgrade_card=false;
            $scope.active_luck_card=true;
      }
    }

    /*Open Modal To send message to Multiple User*/

    $scope.total_user_message = function (modal) {

        $scope.modalId = modal;
        $scope.modelData = modal;
        if($scope.modalId == '' || $scope.modalId == undefined || $scope.modalId == null){
        toastr.error("Please select user.")
        $state.go('header.manageUsers')
        }else {
            $("#sendMessageModelAllUser").modal('show');
        }
    }

    /*Send Message and close all modal*/

    $scope.send_massage = function(){
         var array =[];
         var data = {};
         switch ($scope.modelData)
            {
                case 'totalUser':
                    for (var i = 0; i < $scope.totalUser.length; i++) {
                        array.push($scope.totalUser[i]._id)
                    }
                    data = {
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                    userService.sendMassageAllUser(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("Message Send Successfully to All User");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'PersonalUser':
                    for (var i = 0; i < $scope.personalUser.length; i++) {
                        array.push($scope.personalUser[i]._id)
                    }
                    data = {
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                    userService.sendMassageAllUser(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("Message Send Successfully to All Personal User");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'BusinessUser':
                    for (var i = 0; i < $scope.businessUser.length; i++) {
                        array.push($scope.businessUser[i]._id)
                    }
                    data = {
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                    userService.sendMassageAllUser(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("Message Send Successfully to All Business User");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'LiveUser':
                    for (var i = 0; i < $scope.liveUser.length; i++) {
                        array.push($scope.liveUser[i]._id)
                    }
                    data = {
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                    userService.sendMassageAllUser(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("Message Send Successfully to All Live User");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'WinnersUser':
                    for (var i = 0; i < $scope.totalWinners.length; i++) {
                        array.push($scope.totalWinners[i]._id)
                    }
                    data = {
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                    userService.sendMassageAllUser(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("Message Send Successfully to All Winners User");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'CashWinnersUser':
                    for (var i = 0; i < $scope.cashWinners.length; i++) {
                        array.push($scope.cashWinners[i]._id)
                    }
                    data = {
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                    userService.sendMassageAllUser(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("Message Send Successfully to All CashWinners User");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'CouponWinnersUser':
                    for (var i = 0; i < $scope.couponWinners.length; i++) {
                        array.push($scope.couponWinners[i]._id)
                    }
                    data = {
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                    userService.sendMassageAllUser(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("Message Send Successfully to All CouponWinners User");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'BlockedUser':
                    for (var i = 0; i < $scope.allblockUser.length; i++) {
                        array.push($scope.allblockUser[i]._id)
                    }
                    data = {
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                    userService.sendMassageAllUser(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("Message Send Successfully to All Blocked User");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                default:
                array.push($scope.modalId)
                    data = {
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                    userService.sendMassageAllUser(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("Message Send Successfully to User");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
            }

    }

    /*Open Modal To send Brolix to Multiple User*/

    $scope.total_user_brolix = function (modal) {
        $scope.modalId = modal;
        $scope.modelBrolix = modal;
        if($scope.modalId == '' || $scope.modalId == undefined || $scope.modalId == null){
        toastr.error("Please select user.")
        $state.go('header.manageUsers')
        }else {
            $("#sendbrolixModelAllUser").modal('show');
        }
    }

     /*Send Brolix and close all modal*/

    $scope.send_brolix = function(modal){
        var array =[];
        var data = {};

        switch ($scope.modelBrolix)
            {
                case 'totalUser':
                    for (var i = 0; i < $scope.totalUser.length; i++) {
                        array.push($scope.totalUser[i]._id)
                    }
                    data = {
                        Brolix:$scope.sendBrolix.brolix,
                        Id:array
                    }
                    userService.sendBrolixAndCashAllUser(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("Brolix Send successfully to All User");
                            $scope.sendBrolix = '';
                            $("#sendbrolixModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'PersonalUser':
                    for (var i = 0; i < $scope.personalUser.length; i++) {
                        array.push($scope.personalUser[i]._id)
                    }
                    data = {
                        Brolix:$scope.sendBrolix.brolix,
                        Id:array
                    }
                    userService.sendBrolixAndCashAllUser(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("Brolix Send successfully all Personal User");
                            $scope.sendBrolix = '';
                            $("#sendbrolixModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'BusinessUser':
                    for (var i = 0; i < $scope.businessUser.length; i++) {
                        array.push($scope.businessUser[i]._id)
                    }
                    data = {
                        Brolix:$scope.sendBrolix.brolix,
                        Id:array
                    }
                    userService.sendBrolixAndCashAllUser(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("Brolix Send successfully to all Business User");
                            $("#sendbrolixModelAllUser").modal('hide');
                            $scope.sendBrolix = '';
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'LiveUser':
                    for (var i = 0; i < $scope.liveUser.length; i++) {
                        array.push($scope.liveUser[i]._id)
                    }
                    data = {
                        Brolix:$scope.sendBrolix.brolix,
                        Id:array
                    }
                    userService.sendBrolixAndCashAllUser(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("Brolix Send successfully to all Live User");
                            $("#sendbrolixModelAllUser").modal('hide');
                            $scope.sendBrolix = '';
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'WinnersUser':
                    for (var i = 0; i < $scope.totalWinners.length; i++) {
                        array.push($scope.totalWinners[i]._id)
                    }
                    data = {
                        Brolix:$scope.sendBrolix.brolix,
                        Id:array
                    }
                    userService.sendBrolixAndCashAllUser(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("Brolix Send successfully to all Winners User");
                            $("#sendbrolixModelAllUser").modal('hide');
                            $scope.sendBrolix = '';
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'CashWinnersUser':
                    for (var i = 0; i < $scope.cashWinners.length; i++) {
                        array.push($scope.cashWinners[i]._id)
                    }
                    data = {
                        Brolix:$scope.sendBrolix.brolix,
                        Id:array
                    }
                    userService.sendBrolixAndCashAllUser(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("Brolix Send successfully to all CashWinners User");
                            $("#sendbrolixModelAllUser").modal('hide');
                            $scope.sendBrolix = '';
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'CouponWinnersUser':
                    for (var i = 0; i < $scope.couponWinners.length; i++) {
                        array.push($scope.couponWinners[i]._id)
                    }
                    data = {
                        Brolix:$scope.sendBrolix.brolix,
                        Id:array
                    }
                    userService.sendBrolixAndCashAllUser(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("Brolix Send successfully to all CouponWinners User");
                            $("#sendbrolixModelAllUser").modal('hide');
                            $scope.sendBrolix = '';
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'BlockedUser':
                    for (var i = 0; i < $scope.allblockUser.length; i++) {
                        array.push($scope.allblockUser[i]._id)
                    }
                    data = {
                        Brolix:$scope.sendBrolix.brolix,
                        Id:array
                    }
                    userService.sendBrolixAndCashAllUser(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("Brolix Send successfully to all Blocked User");
                            $("#sendbrolixModelAllUser").modal('hide');
                            $scope.sendBrolix = '';
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                default:
                    array.push($scope.modalId)
                    data = {
                        Brolix:$scope.sendBrolix.brolix,
                        Id:array
                    }
                    userService.sendBrolixAndCashAllUser(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("Brolix Send successfully to User");
                            $("#sendbrolixModelAllUser").modal('hide');
                            $scope.sendBrolix = '';
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
            }
    }


    /*Open Modal To send cash to Multiple User*/

    $scope.total_user_cash = function (modal) {

        $scope.modalId = modal;
        $scope.modelCash = modal;
        if($scope.modalId == '' || $scope.modalId == undefined || $scope.modalId == null){
        toastr.error("Please select user.")
        $state.go('header.manageUsers')
        }else {
            $("#sendcashModelAllUser").modal('show');
        }
    }


     /*Send Brolix and close all modal*/

    $scope.send_cashall = function(modal){

        var array =[];
        var data = {};
        switch ($scope.modelCash)
            {
                case 'totalUser':
                    for (var i = 0; i < $scope.totalUser.length; i++) {
                        array.push($scope.totalUser[i]._id)
                    }
                    data = {
                        Cash:$scope.sendCash.Cash,
                        Id:array
                    }
                    userService.sendBrolixAndCashAllUser(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("Cash Send successfully to All User");
                            $scope.sendCash = '';
                            $("#sendcashModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'PersonalUser':
                    for (var i = 0; i < $scope.personalUser.length; i++) {
                        array.push($scope.personalUser[i]._id)
                    }
                    data = {
                        Cash:$scope.sendCash.Cash,
                        Id:array
                    }
                    userService.sendBrolixAndCashAllUser(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("Cash Send successfully to All Personal User");
                            $scope.sendCash = '';
                            $("#sendcashModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'BusinessUser':
                    for (var i = 0; i < $scope.businessUser.length; i++) {
                        array.push($scope.businessUser[i]._id)
                    }
                    data = {
                        Cash:$scope.sendCash.Cash,
                        Id:array
                    }
                    userService.sendBrolixAndCashAllUser(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("Cash Send successfully to All Business User");
                            $scope.sendCash = '';
                            $("#sendcashModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'LiveUser':
                    for (var i = 0; i < $scope.liveUser.length; i++) {
                        array.push($scope.liveUser[i]._id)
                    }
                    data = {
                        Cash:$scope.sendCash.Cash,
                        Id:array
                    }
                    userService.sendBrolixAndCashAllUser(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("Cash Send successfully to All Live User");
                            $scope.sendCash = '';
                            $("#sendcashModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'WinnersUser':
                    for (var i = 0; i < $scope.totalWinners.length; i++) {
                        array.push($scope.totalWinners[i]._id)
                    }
                    data = {
                        Cash:$scope.sendCash.Cash,
                        Id:array
                    }
                    userService.sendBrolixAndCashAllUser(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("Cash Send successfully to All Winners User");
                            $scope.sendCash = '';
                            $("#sendcashModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'CashWinnersUser':
                    for (var i = 0; i < $scope.cashWinners.length; i++) {
                        array.push($scope.cashWinners[i]._id)
                    }
                    data = {
                        Cash:$scope.sendCash.Cash,
                        Id:array
                    }
                    userService.sendBrolixAndCashAllUser(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("Cash Send successfully to All CashWinners User");
                            $scope.sendCash = '';
                            $("#sendcashModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'CouponWinnersUser':
                    for (var i = 0; i < $scope.couponWinners.length; i++) {
                        array.push($scope.couponWinners[i]._id)
                    }
                    data = {
                        Cash:$scope.sendCash.Cash,
                        Id:array
                    }
                    userService.sendBrolixAndCashAllUser(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("Cash Send successfully to All CouponWinners User");
                            $scope.sendCash = '';
                            $("#sendcashModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'BlockedUser':
                    for (var i = 0; i < $scope.allblockUser.length; i++) {
                        array.push($scope.allblockUser[i]._id)
                    }
                    data = {
                        Cash:$scope.sendCash.Cash,
                        Id:array
                    }
                    userService.sendBrolixAndCashAllUser(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("Cash Send successfully to All Blocked User");
                            $scope.sendCash = '';
                            $("#sendcashModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                default:
                    array.push($scope.modalId)
                    data = {
                        Cash:$scope.sendCash.Cash,
                        Id:array
                    }
                    userService.sendBrolixAndCashAllUser(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("Cash Send successfully to User");
                            $scope.sendCash = '';
                            $("#sendcashModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
            }

    }

    $scope.Block_User = function (id) {
        $scope.BlockId = id;
        var userId = $scope.BlockId;
        //console.log("Blockid",userId);
        if ($scope.BlockId == '' || $scope.BlockId == undefined || $scope.BlockId == null) {
        toastr.error("Please select user.")
        $state.go('header.manageUsers')
        }else {
        BootstrapDialog.show({
            title: 'Block User',
            message: 'Are you sure want to block this User',
            buttons: [{
                label: 'Yes',
                action: function(dialog) {
                    userService.BlockUser(userId).success(function(res) {
                        if (res.responseCode == 200){
                            dialog.close();
                            toastr.success("User Blocked");
                            $state.reload();
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                }
            }, {
                label: 'No',
                action: function(dialog) {
                    dialog.close();
                    // toastr.success("User Blocked");
                }
            }]
        });
    }
    }


    $scope.UnBlock_User = function (id) {
        $scope.BlockId = id;
        var userId = $scope.BlockId;
        //console.log("Blockid",userId);
        if ($scope.BlockId == '' || $scope.BlockId == undefined || $scope.BlockId == null) {
        toastr.error("Please select user.")
        $state.go('header.manageUsers')
        }else {
        BootstrapDialog.show({
            title: 'Block User',
            message: 'Are you sure want to Unblock this User',
            buttons: [{
                label: 'Yes',
                action: function(dialog) {
                    userService.UnBlockUser(userId).success(function(res) {
                        if (res.responseCode == 200){
                            dialog.close();
                            toastr.success("User UnBlocked");
                            $state.reload();
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                }
            }, {
                label: 'No',
                action: function(dialog) {
                    dialog.close();
                    // toastr.success("User Blocked");
                }
            }]
        });
    }
    }


    $scope.view_coupons = function (id) {
        $scope.couponId = id;
        $("#allCouponsDetails").modal('show');
    }



$scope.total_user_card = function (modal) {
        //console.log("model",modal);
        $scope.modalId = modal;
        $scope.modelData = modal;
        if($scope.modalId == '' || $scope.modalId == undefined || $scope.modalId == null){
        toastr.error("Please select user.")
        $state.go('header.manageUsers')
        }else {
            $("#showAllCard").modal('show');
        }
    }

$scope.sendCard = function(cardId,type){
         var array =[];
         var data = {};
         $scope.cardId = cardId;
         if(type == 'upgrade'){
            //console.log("type",type);

             switch ($scope.modelData)
            {
                case 'totalUser':
                    for (var i = 0; i < $scope.totalUser.length; i++) {
                        array.push($scope.totalUser[i]._id)
                    }
                    data = {
                        cardId:$scope.cardId,
                        Id:array
                    }
                    //console.log("dataIn",data)
                    userService.sendUpgradeCardTOUsers(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("UpgradeCard Send Successfully to All User");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'PersonalUser':
                    for (var i = 0; i < $scope.personalUser.length; i++) {
                        array.push($scope.personalUser[i]._id)
                    }
                    data = {
                        cardId:$scope.cardId,
                        Id:array
                    }
                    //console.log("dataIn",data)
                    userService.sendUpgradeCardTOUsers(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("UpgradeCard Send Successfully to All Personal User");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'BusinessUser':
                    for (var i = 0; i < $scope.businessUser.length; i++) {
                        array.push($scope.businessUser[i]._id)
                    }
                    data = {
                        cardId:$scope.cardId,
                        Id:array
                    }
                   // console.log("dataIn",data)
                    userService.sendUpgradeCardTOUsers(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("UpgradeCard Send Successfully to All Business User");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'LiveUser':
                    for (var i = 0; i < $scope.liveUser.length; i++) {
                        array.push($scope.liveUser[i]._id)
                    }
                    data = {
                        cardId:$scope.cardId,
                        Id:array
                    }
                    //console.log("dataIn",data)
                    userService.sendUpgradeCardTOUsers(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("UpgradeCard Send Successfully to All Live User");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'WinnersUser':
                    for (var i = 0; i < $scope.totalWinners.length; i++) {
                        array.push($scope.totalWinners[i]._id)
                    }
                    data = {
                        cardId:$scope.cardId,
                        Id:array
                    }
                    //console.log("dataIn",data)
                    userService.sendUpgradeCardTOUsers(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("UpgradeCard Send Successfully to All Winners User");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'CashWinnersUser':
                    for (var i = 0; i < $scope.cashWinners.length; i++) {
                        array.push($scope.cashWinners[i]._id)
                    }
                    data = {
                        cardId:$scope.cardId,
                        Id:array
                    }
                    //console.log("dataIn",data)
                    userService.sendUpgradeCardTOUsers(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("UpgradeCard Send Successfully to All CashWinners User");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'CouponWinnersUser':
                    for (var i = 0; i < $scope.couponWinners.length; i++) {
                        array.push($scope.couponWinners[i]._id)
                    }
                    data = {
                        cardId:$scope.cardId,
                        Id:array
                    }
                    //console.log("dataIn",data)
                    userService.sendUpgradeCardTOUsers(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("UpgradeCard Send Successfully to All CouponWinners User");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'BlockedUser':
                    for (var i = 0; i < $scope.allblockUser.length; i++) {
                        array.push($scope.allblockUser[i]._id)
                    }
                    data = {
                        cardId:$scope.cardId,
                        Id:array
                    }
                    //console.log("dataIn",data)
                    userService.sendUpgradeCardTOUsers(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("UpgradeCard Send Successfully to All Blocked User");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                default:
                array.push($scope.modalId)
                    data = {
                        cardId:$scope.cardId,
                        Id:array
                    }
                    //console.log("dataIn",data)
                    userService.sendUpgradeCardTOUsers(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("UpgradeCard Send Successfully to User");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
            }

         }else if(type == 'luck'){
            //console.log("type",type);
             switch ($scope.modelData)
            {
                case 'totalUser':
                    for (var i = 0; i < $scope.totalUser.length; i++) {
                        array.push($scope.totalUser[i]._id)
                    }
                    data = {
                        cardId:$scope.cardId,
                        Id:array
                    }
                    //console.log("dataIn",data)
                    userService.sendLuckCardTOUsers(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("LuckCard Send Successfully to All User");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'PersonalUser':
                    for (var i = 0; i < $scope.personalUser.length; i++) {
                        array.push($scope.personalUser[i]._id)
                    }
                    data = {
                        cardId:$scope.cardId,
                        Id:array
                    }
                   // console.log("dataIn",data)
                    userService.sendLuckCardTOUsers(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("LuckCard Send Successfully to All Personal User");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'BusinessUser':
                    for (var i = 0; i < $scope.businessUser.length; i++) {
                        array.push($scope.businessUser[i]._id)
                    }
                    data = {
                        cardId:$scope.cardId,
                        Id:array
                    }
                    //console.log("dataIn",data)
                    userService.sendLuckCardTOUsers(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("LuckCard Send Successfully to All Business User");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'LiveUser':
                    for (var i = 0; i < $scope.liveUser.length; i++) {
                        array.push($scope.liveUser[i]._id)
                    }
                    data = {
                        cardId:$scope.cardId,
                        Id:array
                    }
                    //console.log("dataIn",data)
                    userService.sendLuckCardTOUsers(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("LuckCard Send Successfully to All Live User");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'WinnersUser':
                    for (var i = 0; i < $scope.totalWinners.length; i++) {
                        array.push($scope.totalWinners[i]._id)
                    }
                    data = {
                        cardId:$scope.cardId,
                        Id:array
                    }
                    //console.log("dataIn",data)
                    userService.sendLuckCardTOUsers(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("LuckCard Send Successfully to All Winners User");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'CashWinnersUser':
                    for (var i = 0; i < $scope.cashWinners.length; i++) {
                        array.push($scope.cashWinners[i]._id)
                    }
                    data = {
                        cardId:$scope.cardId,
                        Id:array
                    }
                    //console.log("dataIn",data)
                    userService.sendLuckCardTOUsers(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("LuckCard Send Successfully to All CashWinners User");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'CouponWinnersUser':
                    for (var i = 0; i < $scope.couponWinners.length; i++) {
                        array.push($scope.couponWinners[i]._id)
                    }
                    data = {
                        cardId:$scope.cardId,
                        Id:array
                    }
                    //console.log("dataIn",data)
                    userService.sendLuckCardTOUsers(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("LuckCard Send Successfully to All CouponWinners User");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'BlockedUser':
                    for (var i = 0; i < $scope.allblockUser.length; i++) {
                        array.push($scope.allblockUser[i]._id)
                    }
                    data = {
                        cardId:$scope.cardId,
                        Id:array
                    }
                    //console.log("dataIn",data)
                    userService.sendLuckCardTOUsers(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("LuckCard Send Successfully to All Blocked User");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                default:
                array.push($scope.modalId)
                    data = {
                        cardId:$scope.cardId,
                        Id:array
                    }
                    //console.log("dataIn",data)
                    userService.sendLuckCardTOUsers(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("LuckCard Send Successfully to User");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
            }

         }else{
            toastr.error("Somwthing wents to wroung")
         }


    }

    /*----------DashBoardFilter----------*/


$scope.dashBordFilter = function(){

    var type = localStorage.getItem('userTypeName');
    // $scope.dobTo =$scope.dashBordFilter.dobTo==undefined?undefined : new Date().getTime($scope.dashBordFilter.dobTo);
    // $scope.dobFrom =$scope.dashBordFilter.dobFrom==undefined?undefined : new Date().getTime($scope.dashBordFilter.dobFrom);
    $scope.country =$scope.dashBordFilter.country==undefined?undefined : $scope.dashBordFilter.country.name;
    console.log("dateczx",$scope.dobFrom,$scope.dobFrom);
    var data = {};
        data = {
            userType:localStorage.getItem('userTypeName'),
            country:$scope.dashBordFilter.country,
            state:$scope.dashBordFilter.state,
            city:$scope.dashBordFilter.city,
            gender:$scope.dashBordFilter.gender,
            ageTo:$scope.dashBordFilter.ageTo,
            ageFrom:$scope.dashBordFilter.ageFrom,
            joinTo:new Date($scope.dashBordFilter.dobTo).getTime(),
            joinFrom:new Date($scope.dashBordFilter.dobFrom).getTime(),
        }
        //console.log("datatata",JSON.stringify(data))

    switch (type)
            {
                case 'totalUsers':
                //console.log("aaa1");
                    userService.userfilter(data).success(function(res){
                        $scope.totalUser = res.data;
                        //console.log("ressssssss1",JSON.stringify(res));
                    })

                break;

                case 'personalUsers':
                //console.log("2");
                    userService.userfilter(data).success(function(res){
                        $scope.personalUser = res.data;
                        //console.log("ressssssss2",JSON.stringify($scope.personalUser));
                    })

                break;

                case 'businessUsers':
                //console.log("3");
                    userService.userfilter(data).success(function(res){
                        $scope.businessUser = res.data;
                        //console.log("ressssssss3",JSON.stringify($scope.businessUser));
                    })

                break;

                case 'liveUsers':
                //console.log("4");
                    userService.userfilter(data).success(function(res){
                        $scope.liveUser = res.data;
                        //console.log("ressssssss4",JSON.stringify($scope.liveUser));
                    })

                break;

                case 'totalWinners':
                //console.log("5");
                    userService.userfilter(data).success(function(res){
                        $scope.totalWinners = res.data;
                        //console.log("ressssssss5",JSON.stringify($scope.totalWinners));
                    })

                break;

                case 'cashWinners':
                //console.log("6");
                    userService.userfilter(data).success(function(res){
                        $scope.cashWinners = res.data;
                        //console.log("ressssssss6",JSON.stringify($scope.cashWinners));
                    })

                break;

                case 'couponWinners':
                //console.log("7");
                    userService.userfilter(data).success(function(res){
                        $scope.couponWinners = res.data;
                        //console.log("ressssssss7",JSON.stringify($scope.couponWinners));
                    })

                break;

                case 'blockedUsers':
               //console.log("8");
                    userService.userfilter(data).success(function(res){
                        $scope.allblockUser = res.data;
                        //console.log("ressssssss8",JSON.stringify($scope.allblockUser));
                    })

                break;

                default:
                toastr.error("somthing wents to wroung");
            }

    }


    $scope.total_user_coupons = function (modal) {
        //console.log("model",modal);
        $scope.modalIdcoupon = modal;
        $scope.modelDatacoupon = modal;
        if($scope.modalIdcoupon == '' || $scope.modalIdcoupon == undefined || $scope.modalIdcoupon == null){
        toastr.error("Please select user.")
        $state.go('header.manageUsers')
        }else {
            $("#showAllCoupons").modal('show');
        }
    }

    $scope.sendCoupons = function(couponId){
         var array =[];
         var data = {};
         $scope.couponId = couponId;
         console.log("$scope.couponId",$scope.couponId)

         // switch ($scope.modelDatacoupon)
         //    {
         //        case 'totalUser':
         //            for (var i = 0; i < $scope.totalUser.length; i++) {
         //                array.push($scope.totalUser[i]._id)
         //            }
         //            data = {
         //                couponId:$scope.couponId,
         //                Id:array
         //            }
                    
         //            BootstrapDialog.show({
         //            title: 'Send Coupon',
         //            message: 'Are you sure want to send coupon Users',
         //                buttons: [{
         //                    label: 'Yes',
         //                    action: function(dialog) {
         //                      $("#sendMessageModelAllUser").modal('hide');
         //                    userService.sendCouponTOUSers(data).success(function(res) {
         //                        if (res.responseCode == 200){
         //                          toastr.success(res.responseMessage);
         //                          $scope.sendMessage = '';
                                  
         //                          dialog.close();
         //                          //toastr.success("Coupon Send successfully");
         //                          $state.reload();
         //                        } else {
         //                          toastr.error(res.responseMessage);
         //                        }
         //                      })
         //                    }
         //                }, {
         //                    label: 'No',
         //                    action: function(dialog) {
         //                        dialog.close();
         //                        // toastr.success("User Blocked");
         //                    }
         //                }]
         //            });
         //            //console.log("dataIn",data)
                    
         //        break;

         //        case 'PersonalUser':
         //            for (var i = 0; i < $scope.personalUser.length; i++) {
         //                array.push($scope.personalUser[i]._id)
         //            }
         //            data = {
         //                couponId:$scope.couponId,
         //                Id:array
         //            }
         //            //console.log("dataIn",data)
         //            BootstrapDialog.show({
         //            title: 'Send Coupon',
         //            message: 'Are you sure want to send coupon Users',
         //                buttons: [{
         //                    label: 'Yes',
         //                    action: function(dialog) {
         //                    userService.sendCouponTOUSers(data).success(function(res) {
         //                        if (res.responseCode == 200){
         //                          toastr.success(res.responseMessage);
         //                          $scope.sendMessage = '';
         //                          $("#sendMessageModelAllUser").modal('hide');
         //                          dialog.close();
         //                          //toastr.success("Coupon Send successfully");
         //                          $state.reload();
         //                        } else {
         //                          toastr.error(res.responseMessage);
         //                        }
         //                      })
         //                    }
         //                }, {
         //                    label: 'No',
         //                    action: function(dialog) {
         //                        dialog.close();
         //                        // toastr.success("User Blocked");
         //                    }
         //                }]
         //            });
         //        break;

         //        case 'BusinessUser':
         //            for (var i = 0; i < $scope.businessUser.length; i++) {
         //                array.push($scope.businessUser[i]._id)
         //            }
         //            data = {
         //                couponId:$scope.couponId,
         //                Id:array
         //            }
         //            //console.log("dataIn",data)
         //            BootstrapDialog.show({
         //            title: 'Send Coupon',
         //            message: 'Are you sure want to send coupon Users',
         //                buttons: [{
         //                    label: 'Yes',
         //                    action: function(dialog) {
         //                    userService.sendCouponTOUSers(data).success(function(res) {
         //                        if (res.responseCode == 200){
         //                          toastr.success(res.responseMessage);
         //                          $scope.sendMessage = '';
         //                          $("#sendMessageModelAllUser").modal('hide');
         //                          dialog.close();
         //                          //toastr.success("Coupon Send successfully");
         //                          $state.reload();
         //                        } else {
         //                          toastr.error(res.responseMessage);
         //                        }
         //                      })
         //                    }
         //                }, {
         //                    label: 'No',
         //                    action: function(dialog) {
         //                        dialog.close();
         //                        // toastr.success("User Blocked");
         //                    }
         //                }]
         //            });
         //        break;

         //        case 'LiveUser':
         //            for (var i = 0; i < $scope.liveUser.length; i++) {
         //                array.push($scope.liveUser[i]._id)
         //            }
         //            data = {
         //                couponId:$scope.couponId,
         //                Id:array
         //            }
         //            //console.log("dataIn",data)
         //           BootstrapDialog.show({
         //            title: 'Send Coupon',
         //            message: 'Are you sure want to send coupon Users',
         //                buttons: [{
         //                    label: 'Yes',
         //                    action: function(dialog) {
         //                    userService.sendCouponTOUSers(data).success(function(res) {
         //                        if (res.responseCode == 200){
         //                          toastr.success(res.responseMessage);
         //                          $scope.sendMessage = '';
         //                          $("#sendMessageModelAllUser").modal('hide');
         //                          dialog.close();
         //                          //toastr.success("Coupon Send successfully");
         //                          $state.reload();
         //                        } else {
         //                          toastr.error(res.responseMessage);
         //                        }
         //                      })
         //                    }
         //                }, {
         //                    label: 'No',
         //                    action: function(dialog) {
         //                        dialog.close();
         //                        // toastr.success("User Blocked");
         //                    }
         //                }]
         //            });
         //        break;

         //        case 'WinnersUser':
         //            for (var i = 0; i < $scope.totalWinners.length; i++) {
         //                array.push($scope.totalWinners[i]._id)
         //            }
         //            data = {
         //                couponId:$scope.couponId,
         //                Id:array
         //            }
         //            //console.log("dataIn",data)
         //            BootstrapDialog.show({
         //            title: 'Send Coupon',
         //            message: 'Are you sure want to send coupon Users',
         //                buttons: [{
         //                    label: 'Yes',
         //                    action: function(dialog) {
         //                    userService.sendCouponTOUSers(data).success(function(res) {
         //                        if (res.responseCode == 200){
         //                          toastr.success(res.responseMessage);
         //                          $scope.sendMessage = '';
         //                          $("#sendMessageModelAllUser").modal('hide');
         //                          dialog.close();
         //                          //toastr.success("Coupon Send successfully");
         //                          $state.reload();
         //                        } else {
         //                          toastr.error(res.responseMessage);
         //                        }
         //                      })
         //                    }
         //                }, {
         //                    label: 'No',
         //                    action: function(dialog) {
         //                        dialog.close();
         //                        // toastr.success("User Blocked");
         //                    }
         //                }]
         //            });
         //        break;

         //        case 'CashWinnersUser':
         //            for (var i = 0; i < $scope.cashWinners.length; i++) {
         //                array.push($scope.cashWinners[i]._id)
         //            }
         //            data = {
         //                couponId:$scope.couponId,
         //                Id:array
         //            }
         //            //console.log("dataIn",data)
         //            BootstrapDialog.show({
         //            title: 'Send Coupon',
         //            message: 'Are you sure want to send coupon Users',
         //                buttons: [{
         //                    label: 'Yes',
         //                    action: function(dialog) {
         //                    userService.sendCouponTOUSers(data).success(function(res) {
         //                        if (res.responseCode == 200){
         //                          toastr.success(res.responseMessage);
         //                          $scope.sendMessage = '';
         //                          $("#sendMessageModelAllUser").modal('hide');
         //                          dialog.close();
         //                          //toastr.success("Coupon Send successfully");
         //                          $state.reload();
         //                        } else {
         //                          toastr.error(res.responseMessage);
         //                        }
         //                      })
         //                    }
         //                }, {
         //                    label: 'No',
         //                    action: function(dialog) {
         //                        dialog.close();
         //                        // toastr.success("User Blocked");
         //                    }
         //                }]
         //            });
         //        break;

         //        case 'CouponWinnersUser':
         //            for (var i = 0; i < $scope.couponWinners.length; i++) {
         //                array.push($scope.couponWinners[i]._id)
         //            }
         //            data = {
         //                couponId:$scope.couponId,
         //                Id:array
         //            }
         //            //console.log("dataIn",data)
         //            BootstrapDialog.show({
         //            title: 'Send Coupon',
         //            message: 'Are you sure want to send coupon Users',
         //                buttons: [{
         //                    label: 'Yes',
         //                    action: function(dialog) {
         //                    userService.sendCouponTOUSers(data).success(function(res) {
         //                        if (res.responseCode == 200){
         //                          toastr.success(res.responseMessage);
         //                          $scope.sendMessage = '';
         //                          $("#sendMessageModelAllUser").modal('hide');
         //                          dialog.close();
         //                          //toastr.success("Coupon Send successfully");
         //                          $state.reload();
         //                        } else {
         //                          toastr.error(res.responseMessage);
         //                        }
         //                      })
         //                    }
         //                }, {
         //                    label: 'No',
         //                    action: function(dialog) {
         //                        dialog.close();
         //                        // toastr.success("User Blocked");
         //                    }
         //                }]
         //            });
         //        break;

         //        case 'BlockedUser':
         //            for (var i = 0; i < $scope.allblockUser.length; i++) {
         //                array.push($scope.allblockUser[i]._id)
         //            }
         //            data = {
         //                couponId:$scope.couponId,
         //                Id:array
         //            }
         //            //console.log("dataIn",data)
         //            BootstrapDialog.show({
         //            title: 'Send Coupon',
         //            message: 'Are you sure want to send coupon Users',
         //                buttons: [{
         //                    label: 'Yes',
         //                    action: function(dialog) {
         //                    userService.sendCouponTOUSers(data).success(function(res) {
         //                        if (res.responseCode == 200){
         //                          toastr.success(res.responseMessage);
         //                          $scope.sendMessage = '';
         //                          $("#sendMessageModelAllUser").modal('hide');
         //                          dialog.close();
         //                          //toastr.success("Coupon Send successfully");
         //                          $state.reload();
         //                        } else {
         //                          toastr.error(res.responseMessage);
         //                        }
         //                      })
         //                    }
         //                }, {
         //                    label: 'No',
         //                    action: function(dialog) {
         //                        dialog.close();
         //                        // toastr.success("User Blocked");
         //                    }
         //                }]
         //            });
         //        break;

         //        default:
         //        array.push($scope.modalId)
         //            data = {
         //                couponId:$scope.couponId,
         //                Id:array
         //            }
         //            //console.log("dataIn",data)
         //            BootstrapDialog.show({
         //            title: 'Send Coupon',
         //            message: 'Are you sure want to send coupon Users',
         //                buttons: [{
         //                    label: 'Yes',
         //                    action: function(dialog) {
         //                    userService.sendCouponTOUSers(data).success(function(res) {
         //                        if (res.responseCode == 200){
         //                          toastr.success(res.responseMessage);
         //                          $scope.sendMessage = '';
         //                          $("#sendMessageModelAllUser").modal('hide');
         //                          dialog.close();
                                  
         //                          $state.reload();
         //                        } else {
         //                          toastr.error(res.responseMessage);
         //                        }
         //                      })
         //                    }
         //                }, {
         //                    label: 'No',
         //                    action: function(dialog) {
         //                        dialog.close();
         //                        // toastr.success("User Blocked");
         //                    }
         //                }]
         //            });
         //    }

    }
});

 app.filter("customFilterUser",function() {
     return function(items,nameValue) {
       if (!nameValue) {
         return retArray = items;
         }
         var retArray = [];
           for(var i=0;i<items.length;i++)
                {
                if (items[i].firstName.toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() || items[i].mobileNumber.toString().substr(0,nameValue.length) == nameValue.toString()) {
                    retArray.push(items[i]);
                }
           }
           return retArray;
        }
 });

 app.filter("customSearchFilter",function(){
   return function(items,value){
     if(!value){
       return retArray = items;
     }
     var retArray =[];
     for(var i=0;i<items.length;i++){
       if(items[i].pageName.toLowerCase().substr(0,value.length) == value.toLowerCase()){
         retArray.push(items[i]);
       }
     }
     return retArray;
   }
 });
