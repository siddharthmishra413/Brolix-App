app.controller('manageCardsCtrl', function($scope, $window, userService, $state, toastr, $timeout) {
    $(window).scrollTop(0, 0);
    $scope.class = true;
    $scope.$emit('headerStatus', 'Manage Cards');
    $scope.$emit('SideMenu', 'Manage Cards');
    $scope.tab = 'SoldUpgradeCard';
    $scope.myForm = {};
    var upgrade_card = {};
    var luck_card = {};
    $scope.dashBordFilter = {};

$scope.key = "Discount";


upgrade_card = {
            cardType:'upgrade_card',
            offerType:'discount'
        }

luck_card = {
    cardType:'luck_card',
    offerType:'discount'
}

    $scope.currentPageNo = 1;
    userService.showOfferOnCards(upgrade_card,$scope.currentPageNo).success(function(res) {
        console.log("upgrade_card res",JSON.stringify(res));
        //console.log("res",JSON.stringify(res))
        // if(res.responseCode == 200){
        //     if(res.data.length == 0){
        //         toastr.error("No data Found");

        //     }else if(res.data.length != 0){
        //         var resultUpgradeCardDiscount = res.data.filter(function( obj ) {
        //       return obj.offer.offerType == 'discount';
        //     });
        //     $scope.resultUpgradeCardDiscount = resultUpgradeCardDiscount;            
        //     var resultUpgradeCardBuyGet = res.data.filter(function( obj ) {
        //       return obj.offer.offerType == 'buyGet';
        //     });
        //     $scope.resultUpgradeCardBuyGet=resultUpgradeCardBuyGet;
        //     $scope.totalOfferUpgradeCardCount=resultUpgradeCardDiscount.length+resultUpgradeCardBuyGet.length;
        //     }
            

        // }
        // else{
        //     toastr.error(res.responseMessage);
        // }

    })

    userService.showOfferOnCards(luck_card,$scope.currentPageNo).success(function(res){
        console.log("luck_card res",JSON.stringify(res));
        // if(res.responseCode == 200){
        //     if(res.data.length == 0){
        //         toastr.error("No data Found");

        //     }else if(res.data.length != 0){
        //         var resultLuckCardDiscount = res.data.filter(function( obj ) {
        //       return obj.offer.offerType == 'discount';
        //     });
        //     $scope.resultLuckCardDiscount = resultLuckCardDiscount;            
        //     var resultLuckCardBuyGet = res.data.filter(function( obj ) {
        //       return obj.offer.offerType == 'buyGet';
        //     });
        //     $scope.resultLuckCardBuyGet=resultLuckCardBuyGet;
        //     $scope.totalOfferLuckCardCount=resultLuckCardDiscount.length+resultLuckCardBuyGet.length;
        //     }
        // }
        // else{
        //     toastr.error(res.responseMessage);
        // }

    })

















$scope.getdata = function(data)
{
    $scope.key = data;
}
//     //-------------------------------SELECT CASCADING COUNTRY, STATE & CITY FILTER-------------------------//
//     var currentCities=[];
//    $scope.currentCountry= '';
// var BATTUTA_KEY="00000000000000000000000000000000"
//    // Populate country select box from battuta API
//  url="http://battuta.medunes.net/api/country/all/?key="+BATTUTA_KEY+"&callback=?";
//    $.getJSON(url,function(countries)
//    {
//      $timeout(function(){
//        $scope.countriesList=countries;
//      },100)
     
     
//    });
//  var countryCode;
//    $scope.changeCountry = function(){
//      for(var i=0;i<$scope.countriesList.length;i++){
//        if($scope.countriesList[i].name==$scope.dashBordFilter.country){
//          countryCode=$scope.countriesList[i].code;
//          //console.log(countryCode)
//          break;
//        }
//      }
//      var url="http://battuta.medunes.net/api/region/"+countryCode+"/all/?key="+BATTUTA_KEY+"&callback=?";
//      $.getJSON(url,function(regions)
//      {
//        //console.log('state list:   '+JSON.stringify(regions))
//            $timeout(function(){
//             $scope.stateList = regions;
//            },100)
//      });
//    }

//    $scope.changeState = function(){
//      //console.log('detail -> '+countryCode+' city name -> '+$scope.dashBordFilter.state)
//      var url="http://battuta.medunes.net/api/city/"+countryCode+"/search/?region="+$scope.dashBordFilter.state+"&key="+BATTUTA_KEY+"&callback=?";
//      $.getJSON(url,function(cities)
//      {
//        // console.log('city list:   '+JSON.stringify(cities))
//            $timeout(function(){
//             $scope.cityList = cities;
//            },100)
//      })
//    }


    userService.countryListData().success(function(res) {
      //console.log("ddd",JSON.stringify(res))
      $scope.countriesList = res.result;
    })

    $scope.changeCountry = function(){
        var obj = {};
        obj = {
          country:$scope.dashBordFilter.country,
        }
        userService.cityListData(obj).success(function(res) {
        console.log("ddd",JSON.stringify(res))
        $scope.cityList = res.result;
      })


    }

    $scope.total_user_message = function (modal) {

        $scope.modalId = modal;
        $scope.sendMessage.massage= '';
        $("#sendMessageModelAllUser").modal('show');
    }

    /*Send Message and close all modal*/

    $scope.send_massage = function(){
         var array =[];
         var data = {};
         console.log(" $scope.modalId", $scope.modalId)
         switch ($scope.modalId)
            {
                case 'SoldUpgradeCard': 
                    for (var i = 0; i < $scope.totalSoldUpgradeCard.length; i++) {
                        array.push($scope.totalSoldUpgradeCard[i]._id)
                    }
                    data = {
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                    console.log("data",data)
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

                case 'totalincomeUpgrade': 
                    for (var i = 0; i < $scope.totalSoldUpgradeCard.length; i++) {
                        array.push($scope.totalSoldUpgradeCard[i]._id)
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

                case 'usedUpgradeCard': 
                    for (var i = 0; i < $scope.usedUpgradeCard.length; i++) {
                        array.push($scope.usedUpgradeCard[i]._id)
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

                case 'unUsedUpgradeCard': 
                    for (var i = 0; i < $scope.unUsedUpgradeCard.length; i++) {
                        array.push($scope.unUsedUpgradeCard[i]._id)
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

                case 'SoldULuckCard': 
                    for (var i = 0; i < $scope.totalSoldLuckCard.length; i++) {
                        array.push($scope.totalSoldLuckCard[i]._id)
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

                case 'totalincomeLuck': 
                    for (var i = 0; i < $scope.totalSoldLuckCard.length; i++) {
                        array.push($scope.totalSoldLuckCard[i]._id)
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

                case 'usedLuckCard': 
                    for (var i = 0; i < $scope.usedLuckCard.length; i++) {
                        array.push($scope.usedLuckCard[i]._id)
                    }
                    data = {
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                    console.log("90-----------------------",data)
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

                case 'unUsedLuckCard': 
                    for (var i = 0; i < $scope.unUsedLuckCard.length; i++) {
                        array.push($scope.unUsedLuckCard[i]._id)
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
                toastr.error("Something Wents to wrong");
            }

    }


    $scope.export = function() {
        html2canvas(document.getElementById('manageCardTable'), {
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

     $scope.export1 = function() {
        html2canvas(document.getElementById('manageCardTable1'), {
            onrendered: function (canvas) {
                var data = canvas.toDataURL();
                var docDefinition = {
                    content: [{
                        image: data,
                        width: 500,
                    }]
                };
                pdfMake.createPdf(docDefinition).download("test1.pdf");
            }
        });
    }


    
   
    
    //*******************Total Winners****************
    // userService.totalWinners().success(function(res) {
    //     $scope.totalWinners = res.result;
    // })
    // $scope.showOffer = function(type){
    //     var data = {};
    //     data = {
    //         cardType:type
    //     }
    //     console.log("datatatatat",data)
    //     userService.showOfferOnCards(data).success(function(res){
    //     if(res.responseCode == 200){
    //         $scope.totalOffer = res.data;
    //         if(type=="upgrade_card"){
    //          $scope.table1 = true;
    //          $scope.table2 = false; 
    //         }else{
    //           $scope.table2 = true;
    //           $scope.table1 = false;  
    //         }
    //     }
    //     else{
    //         toastr.error(res.responseMessage);
    //     }

    // })

    // }
   
    //*******************Total Sold UpgradeCard****************

    $scope.currentTotalSoldUpgradeCards = 1;
     $scope.nextTotalSoldUpgradeCardsDetail = function() {
         userService.totalSoldUpgradeCard($scope.currentTotalSoldUpgradeCards).success(function(res) { 
            if (res.responseCode == 200){
                   $scope.noOfPagesTotalSoldUpgradeCards = res.pages;
                   $scope.pageTotalSoldUpgradeCards= res.page;
                   $scope.totalSoldUpgradeCard= res.docs;
                   $scope.totalSoldUpgradeCardCount = res.total;
               } 
               else {
                $scope.totalSoldUpgradeCardCount = 0;
                //toastr.error(res.responseMessage);
                }
          })
     }
     $scope.nextTotalSoldUpgradeCardsDetail();
     $scope.nextTotalSoldUpgradeCards = function(){
        $scope.currentTotalSoldUpgradeCards++;
        $scope.nextTotalSoldUpgradeCardsDetail();
     }
     $scope.preTotalSoldUpgradeCards= function(){
        $scope.currentTotalSoldUpgradeCards--;
        $scope.nextTotalSoldUpgradeCardsDetail();
     }

    // userService.totalSoldUpgradeCard().success(function(res) {
    //     if (res.responseCode == 200){
    //         $scope.totalSoldUpgradeCard = res.result;
    //         //console.log("totalSoldUpgradeCardtotalSoldUpgradeCard",JSON.stringify($scope.totalSoldUpgradeCard));
    //     } else {
    //         toastr.error(res.responseMessage);
    //     }
        
    // })
   $scope.currentTotalIncomeUpgradeCard = 1;
     $scope.nextTotalIncomeUpgradeCardDetail = function(){
         userService.totalIncomeInCashFromUpgradeCard($scope.currentTotalIncomeUpgradeCard).success(function(res) { 
              //console.log("val11",JSON.stringify(res))
            if (res.responseCode == 200){
                   $scope.noOfPagesTotalIncomeUpgradeCard = res.pages;
                   $scope.pageTotalIncomeUpgradeCard= res.page;
                   $scope.totalIncomeInCashFromUpgradeCard= res.docs;
                   $scope.totalIncomeFromUpgradeCard = res.totalIncome;
               } 
               else if (res.responseCode == 400) {
                $scope.totalIncomeFromUpgradeCard = 0;
                //toastr.error(res.responseMessage);
                }else{
                     toastr.error(res.responseMessage);
                }
          })
     }
     $scope.nextTotalIncomeUpgradeCardDetail();
     $scope.nextTotalIncomeUpgradeCard = function(){
        $scope.currentTotalIncomeUpgradeCard++;
        $scope.nextTotalIncomeUpgradeCardDetail();
     }
     $scope.preTotalIncomeUpgradeCard= function(){
        $scope.currentTotalIncomeUpgradeCard--;
        $scope.nextTotalIncomeUpgradeCardDetail();
     }
   // userService.totalIncomeInCashFromUpgradeCard().success(function(res) {
   //      if (res.responseCode == 200){
   //          $scope.totalIncomeInCashFromUpgradeCard = res.result;
   //          $scope.totalIncomeFromUpgradeCard = res.totalIncome;
   //          $scope.totalcount = res.count;
   //         //console.log("totalIncomeInCashFromUpgradeCard",JSON.stringify(res));
   //         //console.log("totalIncome",JSON.stringify($scope.totalIncomeInCashFromUpgradeCard));
   //         //console.log("totalIncomeInCashFromUpgradeCard",JSON.stringify($scope.totalIncomeInCashFromUpgradeCard));
   //      } else {
   //          toastr.error(res.responseMessage);
   //      }
        
   //  })
   $scope.currentUsedUpgradeCard = 1;
     $scope.nextUsedUpgradeCardDetail = function(){
         userService.usedUpgradeCard($scope.currentUsedUpgradeCard).success(function(res) { 
            console.log()
            if (res.responseCode == 200){
                   $scope.noOfPagesUsedUpgradeCard = res.pages;
                   $scope.pageUsedUpgradeCard= res.page;
                   $scope.usedUpgradeCard= res.docs;
                   //console.log(JSON.stringify($scope.usedUpgradeCard));
                    $scope.usedUpgradeCardcount = res.total;
               }
               else  {
                $scope.usedUpgradeCardcount = 0;
                //toastr.error(res.responseMessage);
                }
          })
     }
     $scope.nextUsedUpgradeCardDetail();
     $scope.nextUsedUpgradeCard = function(){
        $scope.currentUsedUpgradeCard++;
        $scope.nextUsedUpgradeCardDetail();
     }
     $scope.preUsedUpgradeCard= function(){
        $scope.currentUsedUpgradeCard--;
        $scope.nextUsedUpgradeCardDetail();
     }
   // userService.usedUpgradeCard().success(function(res) {
   //      if (res.responseCode == 200){
   //          $scope.usedUpgradeCard = res.result;
   //          // $scope.totalIncome = res.totalIncome;
   //          $scope.usedUpgradeCardcount = res.count;
   //         //console.log("usedUpgradeCard",JSON.stringify($scope.usedUpgradeCard));
   //      } else {
   //          toastr.error(res.responseMessage);
   //      }
        
   //  })

   $scope.currentUnusedUpgradeCards = 1;
     $scope.nextUnusedUpgradeCardsDetail = function(){
         userService.unUsedUpgradeCard($scope.currentUnusedUpgradeCards).success(function(res) { 
            if (res.responseCode == 200){
                   $scope.noOfPagesUnusedUpgradeCards = res.pages;
                   $scope.pageUnusedUpgradeCards= res.page;
                   $scope.unUsedUpgradeCard= res.docs;
                   $scope.unUsedUpgradeCardcount = res.total;
               } 
               else {
                $scope.unUsedUpgradeCardcount = 0;
                //toastr.error(res.responseMessage);
                }
          })
     }
     $scope.nextUnusedUpgradeCardsDetail();
     $scope.nextUnusedUpgradeCards = function(){
        $scope.currentUnusedUpgradeCards++;
        $scope.nextUnusedUpgradeCardsDetail();
     }
     $scope.preUnusedUpgradeCards= function(){
        $scope.currentUnusedUpgradeCards--;
        $scope.nextUnusedUpgradeCardsDetail();
     }

    // userService.unUsedUpgradeCard().success(function(res) {
    //     if (res.responseCode == 200){
    //         $scope.unUsedUpgradeCard = res.result;
    //         // $scope.totalIncome = res.totalIncome;
    //          $scope.unUsedUpgradeCardcount = res.count;
    //        //console.log("unUsedUpgradeCard",JSON.stringify($scope.unUsedUpgradeCard));
    //     } else {
    //         toastr.error(res.responseMessage);
    //     }
        
    // })

    //*******************Total Sold LuckCard****************
    $scope.currentSoldLuckCard = 1;
     $scope.nextSoldLuckCardDetail = function(){
         userService.totalSoldLuckCard($scope.currentSoldLuckCard).success(function(res) { 
            if (res.responseCode == 200){
                   $scope.noOfPagesSoldLuckCard = res.pages;
                   $scope.pageSoldLuckCard= res.page;
                   $scope.totalSoldLuckCard= res.docs;
                   $scope.totalSoldLuckCardcount = res.total;
               } 
               else {
                $scope.totalSoldLuckCardcount = 0;
                //toastr.error(res.responseMessage);
                }
          })
     }
     $scope.nextSoldLuckCardDetail();
     $scope.nextSoldLuckCard = function(){
        $scope.currentSoldLuckCard++;
        $scope.nextSoldLuckCardDetail();
     }
     $scope.preSoldLuckCard= function(){
        $scope.currentSoldLuckCard--;
        $scope.nextSoldLuckCardDetail();
     }

    // userService.totalSoldLuckCard().success(function(res) {
    //     if (res.responseCode == 200){
    //         $scope.totalSoldLuckCard = res.result;
    //         // $scope.totalIncome = res.totalIncome;
    //          $scope.totalSoldLuckCardcount = res.count;
    //        //console.log("totalIncomeInCashFromUpgradeCard",JSON.stringify($scope.totalSoldLuckCard));
    //     } else {
    //         toastr.error(res.responseMessage);
    //     }
        
    // })
    $scope.currentIncomeInBrolixFromLuckCard = 1;
     $scope.nextIncomeInBrolixFromLuckCardDetail = function(){
         userService.totalIncomeInBrolixFromLuckCard($scope.currentIncomeInBrolixFromLuckCard).success(function(res) { 
      
            if (res.responseCode == 200){
                   $scope.noOfPagesIncomeInBrolixFromLuckCard = res.pages;
                   $scope.pageIncomeInBrolixFromLuckCard= res.page;
                   $scope.totalIncomeInBrolixFromLuckCard= res.result;
                    $scope.totalIncomeLuck = res.totalIncome;
               } 
               else {
                $scope.totalIncomeLuck = 0;
                //toastr.error(res.responseMessage);
                }
          })
     }
     $scope.nextIncomeInBrolixFromLuckCardDetail();
     $scope.nextIncomeInBrolixFromLuckCard = function(){
        $scope.currentIncomeInBrolixFromLuckCard++;
        $scope.nextIncomeInBrolixFromLuckCardDetail();
     }
     $scope.preIncomeInBrolixFromLuckCard= function(){
        $scope.currentIncomeInBrolixFromLuckCard--;
        $scope.nextIncomeInBrolixFromLuckCardDetail();
     }
    // userService.totalIncomeInBrolixFromLuckCard().success(function(res) {
    //     if (res.responseCode == 200){
    //         $scope.totalIncomeInBrolixFromLuckCard = res.result;
    //          $scope.totalIncomeLuck = res.totalIncome;
    //          $scope.totalIncomeInBrolixFromLuckCardcount = res.count;

    //     } else {
    //         toastr.error(res.responseMessage);
    //     }
        
    // })
    $scope.currentUsedLuckCard = 1;
     $scope.nextUsedLuckCardDetail = function(){
         userService.usedLuckCard($scope.currentUsedLuckCard).success(function(res) { 
            if (res.responseCode == 200){
                   $scope.noOfPagesUsedLuckCard = res.pages;
                   $scope.pageUsedLuckCard= res.page;
                   $scope.usedLuckCard= res.docs;
                    $scope.usedLuckCardcount = res.total;
               } 
               else {
                $scope.usedLuckCardcount = 0;
                //toastr.error(res.responseMessage);
                }
          })
     }
     $scope.nextUsedLuckCardDetail();
     $scope.nextUsedLuckCard = function(){
        $scope.currentUsedLuckCard++;
        $scope.nextUsedLuckCardDetail();
     }
     $scope.preUsedLuckCard= function(){
        $scope.currentUsedLuckCard--;
        $scope.nextUsedLuckCardDetail();
     }
    // userService.usedLuckCard().success(function(res) {
    //     if (res.responseCode == 200){
    //         $scope.usedLuckCard = res.result;
    //         $scope.usedLuckCardcount = res.count;
    //        //console.log("totalIncomeInCashFromUpgradeCard",JSON.stringify($scope.totalIncome));
    //     } else {
    //         toastr.error(res.responseMessage);
    //     }
        
    // })
    $scope.currentUnusedLuckCard = 1;
     $scope.nextUnusedLuckCardDetail = function(){
         userService.unUsedLuckCard($scope.currentUnusedLuckCard).success(function(res) { 
             // console.log("val",JSON.stringify(res))
            if (res.responseCode == 200){
                   $scope.noOfPagesUnusedLuckCard = res.pages;
                   $scope.pageUnusedLuckCard= res.page;
                   $scope.unUsedLuckCard= res.docs;
                    $scope.unUsedLuckCardcount = res.total;
               } 
               else {
                $scope.unUsedLuckCardcount = 0;
                //toastr.error(res.responseMessage);
                }
          })
     }
     $scope.nextUnusedLuckCardDetail();
     $scope.nextUnusedLuckCard = function(){
        $scope.currentUnusedLuckCard++;
        $scope.nextUnusedLuckCardDetail();
     }
     $scope.preUnusedLuckCard= function(){
        $scope.currentUnusedLuckCard--;
        $scope.nextUnusedLuckCardDetail();
     }
    // userService.unUsedLuckCard().success(function(res) {
    //     if (res.responseCode == 200){
    //         $scope.unUsedLuckCard = res.result;
    //         $scope.unUsedLuckCardcount = res.count;
    //        //console.log("totalIncomeInCashFromUpgradeCard",JSON.stringify($scope.totalIncome));
    //     } else {
    //         toastr.error(res.responseMessage);
    //     }
        
    // })

    $scope.userInfo=function(id) {
    //console.log(JSON.stringify(id))
    userService.userInfo(id).then(function(success) { 
        //console.log(JSON.stringify(success))
                if(success.data.responseCode == 200) {
                        $scope.userDetail=success.data.result
                        $("#userInfo").modal('show');
                       // console.log(JSON.stringify($scope.userDetail))
                 } 
                 else{
                    toastr.error(success.data.responseMessage)
                 }
             },function(err){
           // console.log(err);
            toastr.error('Connection error.');
           }) 
    }

     $scope.pageCount=function(id) {
        console.log("iddddss",JSON.stringify(id))
        $scope.page=[];
        userService.pageCount(id).success(function(res) {
          console.log("res",JSON.stringify(res))
           if(res.responseCode ==  200) {
            $scope.page = res.result;
           $("#Pages").modal('show');
            console.log("$scope.res",JSON.stringify($scope.page))
        }else{
          toastr.error(res.responseMessage);
          
        }        
            
        })


        // userService.pageCount(id).then(function(success) { 
          
        //     if(success.data.responseCode == 200) {
        //             for(i=0;i<success.data.result.length;i++){
        //                 $scope.page.push(success.data.result[0]);
        //             }
        //              console.log("pages>>>>>>"+JSON.stringify($scope.page))
        //              $("#Pages").modal('show');
        //          }
        //          else{
        //             toastr.error(success.data.responseMessage)
        //          }
        //         },function(err){
        //             console.log(err);
        //              toastr.error('Connection error.');
        //     }) 
    }
    
    $scope.upgradeCardUsedAd=function(id) {
        console.log(JSON.stringify(id))
        var data = {
                    "upgradeId":id
                    }
        
        userService.upgradeCardUsedAd(data).then(function(success) { 
            console.log("first",JSON.stringify(success))
              if(success.data.responseCode == 200) {
                    $scope.usedAd=success.data.result;
                    $("#luckCardUsedAd").modal('show');
                  }else{
                    toastr.error(success.data.responseMessage)
                 }
                },function(err){
                   // console.log(err);
                     toastr.error('Connection error.');
            }) 
    }


    $scope.luckCardUsedAd=function(id) {
        var data = {
                    "luckId":id
                }
        
        userService.luckCardUsedAd(data).then(function(success) {
        console.log("second",JSON.stringify(success)) 
                 if(success.data.responseCode == 200) {
                    $scope.usedAd=success.data.result;
                    $scope.img=$scope.usedAd[0].coverImage;
                    $("#luckCardUsedAd").modal('show');
                   }else{
                    toastr.error(success.data.responseMessage)
                 }
                },function(err){
                    //console.log(err);
                     toastr.error('Connection error.');
        }) 
    }

  $scope.cardTypeName = function(val) {
        //console.log(val)
         localStorage.setItem('cardTypeName',val);
         $scope.test = '';

        $scope.currentTotalSoldUpgradeCards = 1;
        $scope.nextTotalSoldUpgradeCardsDetail();

        $scope.currentTotalIncomeUpgradeCard = 1;
        $scope.nextTotalIncomeUpgradeCardDetail();

        $scope.currentUsedUpgradeCard = 1;
        $scope.nextUsedUpgradeCardDetail();

        $scope.currentUnusedUpgradeCards = 1;
        $scope.nextUnusedUpgradeCardsDetail();

        $scope.currentSoldLuckCard = 1;
        $scope.nextSoldLuckCardDetail();

        $scope.currentIncomeInBrolixFromLuckCard = 1;
        $scope.nextIncomeInBrolixFromLuckCardDetail();

        $scope.currentUsedLuckCard = 1;
        $scope.nextUsedLuckCardDetail();

        $scope.currentUnusedLuckCard = 1;
        $scope.nextUnusedLuckCardDetail();
    }

 
    $scope.dashBordFilter = function() {

    var type = localStorage.getItem('cardTypeName');
    //console.log(type);
    $scope.country =$scope.dashBordFilter.country==undefined?undefined : $scope.dashBordFilter.country.name;

    var data = {};
        data = {
            cardType:localStorage.getItem('cardTypeName'),
            country: $scope.dashBordFilter.country,
            state:$scope.dashBordFilter.state,
            city:$scope.dashBordFilter.city,
            upgradeType:$scope.dashBordFilter.upgradeCard,
            LuckCardType:$scope.dashBordFilter.luckCard,
            joinTo:new Date($scope.dashBordFilter.dobTo).getTime(),
            joinFrom:new Date($scope.dashBordFilter.dobFrom).getTime(),
        }
       // console.log("datatata",data)

    switch (type)
            {
                case 'totalSoldCards':
                //console.log("1"); 
                    userService.cardFilter(data).success(function(res){
                       // console.log(JSON.stringify(res));
                        $scope.totalSoldUpgradeCard = res.data;
                        //console.log("ressssssss1",JSON.stringify($scope.totalSoldUpgradeCard));
                    })
                    
                break;

                case 'totalIncome$': 
               // console.log("2");
                    userService.cardFilter(data).success(function(res){
                        $scope.totalIncomeInCashFromUpgradeCard = res.data;
                        //console.log("ressssssss2",JSON.stringify($scope.totalIncomeInCashFromUpgradeCard));
                    })
                    
                break;

                case 'usedCards': 
                //console.log("3");
                    userService.cardFilter(data).success(function(res){
                        $scope.usedUpgradeCard = res.data;
                        //console.log("ressssssss3",JSON.stringify($scope.usedUpgradeCard));
                    })
                    
                break;

                case 'unusedCards': 
                //console.log("4");
                    userService.cardFilter(data).success(function(res){
                        $scope.unUsedUpgradeCard = res.data;
                        //console.log("ressssssss4",JSON.stringify($scope.unUsedUpgradeCard));
                    })
                    
                break;

                case 'totalSoldLuckCards': 
               // console.log("5");
                    userService.cardFilter(data).success(function(res){
                        $scope.totalSoldLuckCard = res.data;
                        //console.log("ressssssss5",JSON.stringify($scope.totalSoldLuckCard));
                    })
                    
                break;

                case 'totalIncome$LuckCards':
               // console.log("6"); 
                    userService.cardFilter(data).success(function(res){
                        $scope.totalIncomeInBrolixFromLuckCard = res.data;
                        //console.log("ressssssss6",JSON.stringify($scope.totalIncomeInBrolixFromLuckCard));
                    })
                    
                break;

                case 'usedCardsLuckCards': 
                //console.log("7");
                    userService.cardFilter(data).success(function(res){
                        $scope.usedLuckCard = res.data;
                        //console.log("ressssssss7",JSON.stringify($scope.usedLuckCard));
                    })
                    
                break;

                case 'unusedCardsLuckCards': 
               // console.log("8");
                    userService.cardFilter(data).success(function(res){
                        $scope.unUsedLuckCard = res.data;
                        //console.log("ressssssss8",JSON.stringify($scope.unUsedLuckCard));
                    })
                    
                break;
                
                default: 
                toastr.error("something went to wrong");
            }

    }

})


/*----------ManageCardsCustomFilter----------*/

app.filter("cardsFilter",function() {

  var fullName = [];
     
      return function(items,nameValue) {
        //console.log(JSON.stringify(items))
        //console.log(nameValue)
        if (!nameValue) {            
         return retArray = items;
           }
         var retArray = [];
           for(var i=0;i<items.length;i++) 
               {
              fullName.push(items[i].firstName+' '+items[i].lastName);
              if(fullName[i].toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase())
               {
                retArray.push(items[i])
               }
            }

         return retArray;

     }
})

app.filter("manageCardsFilter",function() {

  var name = [];
     
      return function(items,nameValue) {
       // console.log(JSON.stringify(items))
       // console.log(nameValue)
        if (!nameValue) {            
         return retArray = items;
           }
         var retArrayy = [];
           for(var i=0;i<items.length;i++) 
               {
              name.push(items[i].firstName+' '+items[i].lastName);
              if(name[i].toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase())
               {
                retArrayy.push(items[i])
               }
            }

         return retArrayy;

     }
});
