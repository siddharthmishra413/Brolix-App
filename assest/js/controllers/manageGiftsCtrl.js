app.controller('manageGiftsCtrl', function ($scope, $window, $state, toastr, $timeout, userService) {
$(window).scrollTop(0,0);
$scope.$emit('headerStatus', 'Manage Gifts');
$scope.$emit('SideMenu', 'Manage Gifts');
$('#manageUserTable').DataTable();
$scope.tab= 'totalCouponsGifts';
$scope.array = [];
$scope.dashBordFilter = {};
$scope.dashBordFilter.country="";
$scope.dashBordFilter.state="";
$scope.dashBordFilter.city="";
localStorage.setItem('giftTypeName','totalCouponsGifts');



$scope.dataTableOne = function(type){
  console.log("type",type)
  if(type=='totalCouponsGifts'){
    $('#manageGiftTableOne').DataTable();
      $scope.tab= 'totalCouponsGifts'; 
     $timeout(function(){
        $('#manageGiftTableOne').DataTable();
         $scope.tab= 'totalCouponsGifts';      
     },100)
  }else if(type=='totalCashGifts'){
    $('#manageGiftTableTwo').DataTable();
      $scope.tab= 'totalCashGifts'; 
     $timeout(function(){
        $('#manageGiftTableTwo').DataTable();
         $scope.tab= 'totalCashGifts';      
     },100)
  }else{
    consoel.log("dddddd");
  }
     
  }



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
      //console.log("ddd",JSON.stringify(res))
      $scope.cityList = res.result;
    })
}


//-------------------------------SELECT CASCADING COUNTRY, STATE & CITY FILTER-------------------------//
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
//    $scope.changeCountry = function() {

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

 userService.totalBrolixGift().then(function(success) {
  //console.log("success",JSON.stringify(success));
  if(success.data.responseCode == 404){
       $scope.totalBrolix = success.data.totalBrolix;
  }else if(success.data.responseCode == 200) {
        $scope.contactWinners = success.data.result;
        $scope.totalBrolix = success.data.totalBrolix;
  }else{
    toastr.error(success.responseMessage);
  }
})

$scope.currentTotalCouponsGift = 1;
     $scope.nextTotalCouponsGiftDetail = function() {
         userService.totalCouponsGifts().success(function(res) { 
             //console.log("val",JSON.stringify(res))
            if (res.responseCode == 200){
                   // $scope.noOfPagesTotalCouponsGift = res.pages;
                   // $scope.pageTotalCouponsGift= res.page;
                   $scope.totalCouponsGiftShow= res.result;

                    $scope.totalCouponsGift = $scope.totalCouponsGiftShow.length;
               } 
               else {
                toastr.error(res.responseMessage);
                }
          })

     }
     $scope.nextTotalCouponsGiftDetail();
     $scope.nextTotalCouponsGift = function(){
        $scope.currentTotalCouponsGift++;
        $scope.nextTotalCouponsGiftDetail();
     }
     $scope.preTotalCouponsGift= function(){
        $scope.currentTotalCouponsGift--;
        $scope.nextTotalCouponsGiftDetail();
     }

  $scope.currentTotalCashGifts = 1;
     $scope.nextTotalCashGiftsDetail = function(){
         userService.totalCashGifts().success(function(res) { 
              // console.log("sssssssssss",JSON.stringify(res))
            if (res.responseCode == 200){
                   // $scope.noOfPagesTotalCashGifts = res.pages;
                   // $scope.pageTotalCashGifts= res.page;
                   $scope.totalCashGiftShow= res.result;
                    $scope.totalCashGift = res.result.length;
               } 
               else {
                toastr.error(res.responseMessage);
                }
          })
         
     }
     $scope.nextTotalCashGiftsDetail();
     $scope.nextTotalCashGifts = function(){
        $scope.currentTotalCashGifts++;
        $scope.nextTotalCashGiftsDetail();
     }
     $scope.preTotalCashGifts= function(){
        $scope.currentTotalCashGifts--;
        $scope.nextTotalCashGiftsDetail();
     }


$scope.currentTotalHiddenGifts = 1;
     $scope.nextTotalHiddenGiftsDetail = function(){
         userService.totalHiddenGifts($scope.currentTotalHiddenGifts).success(function(res) { 
             // console.log("val",JSON.stringify(res))
            if (res.responseCode == 200){
                   $scope.noOfPagesTotalHiddenGifts = res.pages;
                   $scope.pageTotalHiddenGifts= res.page;
                   $scope.totalHiddenGiftShow= res.docs;
                    $scope.totalHiddenGift = res.total;
               } 
               else {
                toastr.error(res.responseMessage);
                }
          })
         
     }
     $scope.nextTotalHiddenGiftsDetail();
     $scope.nextTotalHiddenGifts = function(){
        $scope.currentTotalHiddenGifts++;
        $scope.nextTotalHiddenGiftsDetail();
     }
     $scope.preTotalHiddenGifts= function(){
        $scope.currentTotalHiddenGifts--;
        $scope.nextTotalHiddenGiftsDetail();
     }


     $scope.currentTotalExchangedCoupon= 1;
     $scope.nextTotalExchangedCouponDetail = function(){
         userService.totalExchangedCoupon($scope.currentTotalExchangedCoupon).success(function(res) { 
              //console.log("totalExchanged----->",JSON.stringify(res))
            if (res.responseCode == 200){
                   $scope.noOfPagesTotalExchangedCoupon = res.pages;
                   $scope.pageTotalExchangedCoupon= res.page;
                    $scope.totalExchangedCoupons= res.total;
                    $scope.totalExchangedCouponShow1=[];
                  for(var i=0;i<res.docs.length;i++)
                     {  
                         for (var j=0;j<res.docs[i].coupon.adId.couponExchangeReceived.length;j++) {
                               $scope.totalExchangedCouponShow1.push({
                             "id":res.docs[i].coupon.adId._id,  
                             "exchToFirstName":res.docs[i].firstName,
                             "exchToLastName":res.docs[i].lastName,
                             "exchFromFirstName":res.docs[i].coupon.adId.couponExchangeReceived[j].receiverId.firstName,
                             "exchFromLastName":res.docs[i].coupon.adId.couponExchangeReceived[j].receiverId.lastName,
                             });
                        }
                     }  
               } 
               else {
                toastr.error(res.responseMessage);
                }
          })
         
     }
     $scope.nextTotalExchangedCouponDetail();
     $scope.nextTotalExchangedCoupon = function(){
        $scope.currentTotalExchangedCoupon++;
        $scope.nextTotalExchangedCouponDetail();
     }
     $scope.preTotalExchangedCoupon= function(){
        $scope.currentTotalExchangedCoupon--;
        $scope.nextTotalExchangedCouponDetail();
     }

//  userService.totalExchangedCoupon().then(function(success) {
//   if(success.data.responseCode == 404){
//        $scope.totalExchangedCoupons=success.data.count;
//   }else if(success.data.responseCode == 200){
//      $scope.totalExchangedCouponShow1=[];
    
//   for(var i=0;i<success.data.result.length;i++)
//      {  
//          for (var j=0;j<success.data.result[i].coupon.adId.couponExchange.length;j++) {
//                $scope.totalExchangedCouponShow1.push({
//              "id":success.data.result[i].coupon.adId._id,  
//              "exchToFirstName":success.data.result[i].firstName,
//              "exchToLastName":success.data.result[i].lastName,
//              "exchFromFirstName":success.data.result[i].coupon.adId.couponExchange[j].receiverId.firstName,
//              "exchFromLastName":success.data.result[i].coupon.adId.couponExchange[j].receiverId.lastName,
//              });
//         }
//      }  
//        $scope.totalExchangedCoupons = success.data.count;
//   }else{
//     toastr.error(success.responseMessage);
//   }
// })

$scope.currentTotalSentCoupon= 1;
     $scope.nextTotalSentCouponDetail = function(){
         userService.totalSentCoupon($scope.currentTotalSentCoupon).success(function(res) { 
              //console.log("valtt",JSON.stringify(res))
            if (res.responseCode == 200){
                  $scope.totalSentCouponShow1=[];
                for(var i=0;i<res.docs.length;i++)
                   {  
                      $scope.totalSentCouponShow = res.docs;
                       for (var j=0;j<res.docs[i].coupon.adId.couponSend.length;j++) {
                             $scope.totalSentCouponShow1.push({
                           "id":res.docs[i].coupon.adId._id,
                           "sentFromFirstName":res.docs[i].firstName,
                           "sentFromLastName":res.docs[i].lastName,
                           "sentToFirstName":res.docs[i].coupon.adId.couponSend[j].receiverId.firstName,
                           "sentToLastName":res.docs[i].coupon.adId.couponSend[j].receiverId.lastName,
                           });
                      }
                    }
                    $scope.totalSentCoupon = res.total;
               } 
               else {
                toastr.error(res.responseMessage);
                }
          })
         
     }
     $scope.nextTotalSentCouponDetail();
     $scope.nextTotalSentCoupon = function(){
        $scope.currentTotalSentCoupon++;
        $scope.nextTotalSentCouponDetail();
     }
     $scope.preTotalSentCoupon= function(){
        $scope.currentTotalSentCoupon--;
        $scope.nextTotalSentCouponDetail();
     }

//  userService.totalSentCoupon().then(function(success) {
//   if(success.data.responseCode == 404){
//        $scope.totalSentCoupon = success.data.count;
//   }else if(success.data.responseCode == 200){
//     $scope.totalSentCouponShow1=[];
    
//   for(var i=0;i<success.data.result.length;i++)
//      {  
//         $scope.totalSentCouponShow = success.data.result;
//          for (var j=0;j<success.data.result[i].coupon.adId.couponSend.length;j++) {
//                $scope.totalSentCouponShow1.push({
//              "id":success.data.result[i].coupon.adId._id,
//              "sentFromFirstName":success.data.result[i].firstName,
//              "sentFromLastName":success.data.result[i].lastName,
//              "sentToFirstName":success.data.result[i].coupon.adId.couponSend[j].receiverId.firstName,
//              "sentToLastName":success.data.result[i].coupon.adId.couponSend[j].receiverId.lastName,
//              });
//         }
//      }  
//        $scope.totalSentCoupon = success.data.count;
//   }else{
//     toastr.error(success.responseMessage);
//   }
// })


$scope.currentTotalSentCash = 1;
     $scope.nextTotalSentCashDetail = function(){
         userService.totalSentCash($scope.currentTotalSentCash).success(function(res) { 
              //console.log("val",JSON.stringify(res))
            if (res.responseCode == 200){
                   $scope.noOfPagesTotalSentCash = res.pages;
                   $scope.pageTotalSentCash= res.page;
                   $scope.totalSentCashShow= res.docs;
                    $scope.totalSentCash = res.total;
               } 
               else {
                $scope.totalSentCash = 0;
                //toastr.error(res.responseMessage);
                }
          })
         
     }
     $scope.nextTotalSentCashDetail();
     $scope.nextTotalSentCash = function(){
        $scope.currentTotalSentCash++;
        $scope.nextTotalSentCashDetail();
     }
     $scope.preTotalSentCash= function(){
        $scope.currentTotalSentCash--;
        $scope.nextTotalSentCashDetail();
     }

//  userService.totalSentCash().then(function(success) {
//   if(success.data.responseCode == 404){
//        $scope.totalSentCash = success.data.count;
//   }else if(success.data.responseCode == 200){
//      $scope.totalSentCashShow = success.data.result;
//      $scope.totalCash = success.data.totalCash;
//        $scope.totalSentCash=success.data.count;
//   }else{
//     toastr.error(success.responseMessage);
//   }
// })

/*-------------------------Create report---------------------*/

$scope.export = function(){
       html2canvas(document.getElementById('manageGiftTable'), {
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

/*-------------------------Model show on top 50 balances---------------------*/

$scope.top_50_balance= function() {
  $("#top_50_balance").modal('show');
  userService.topFiftyBalances().then(function(success) { 
  $scope.top50balances=success.data.result;
          },function(err){
         //console.log(err);
          toastr.error('Connection error.');
   }) 
}

/*-------------------------Message model---------------------*/

// $scope.top_50_couponsProviders= function() {
//     $("#top_50_couponsProviders").modal('show');
//     userService.topFiftyCouponProvider().then(function(success) { 
//     $scope.topFiftyCouponProvider=success.data.result;
//             },function(err){
//            //console.log(err);
//             toastr.error('Connection error.');
//    }) 
// }

// $scope.top_50_cashProviders= function() {
//     $("#top_50_cashProviders").modal('show');
//     userService.topFiftyCashProvider().then(function(success) { 
//     $scope.topFiftyCashProvider=success.data.result;
//             },function(err){
//           // console.log(err);
//             toastr.error('Connection error.');
//    }) 
// }

$scope.showCouponGift= function(id,key) {
  //console.log("key",key)
  if(key == 'first'){
    $("#showCouponGift").modal('show');
  }else if(key == 'second'){
    $("#showCouponGiftsecond").modal('show');
  }else if(key == 'third'){
    $("#showCouponGiftthird").modal('show');
  }else if(key == 'fourth'){
    $("#showCouponGiftfourth").modal('show');
  }else{
    toastr.error("Something wents to wrong");
  }
  userService.couponGiftAd(id).then(function(success) { 
  $scope.couponGiftAd=success.data.result;
          },function(err){
         //console.log(err);
          toastr.error('Connection error.');
   }) 
}

// $scope.showCouponGifttwo= function(id) {
//   console.log("showCouponGifttwo",id);
//    $("#showCouponGiftsecond").modal('show');
//   userService.couponGiftAd(id).then(function(success) { 
//   $scope.couponGiftAd=success.data.result;
//           },function(err){
//          //console.log(err);
//           toastr.error('Connection error.');
//    }) 
// }  

 $scope.cashGift=function(id){
        //console.log("cashGiftId>>>"+JSON.stringify(id))
        userService.adInfo(id).then(function(success) { 
                    if(success.data.responseCode == 200){
                            $scope.userDetail=success.data.result;
                            $("#cashGift").modal('show');
                    }
                    else{
                        toastr.error(success.data.responseMessage)
                    }
            
                },function(err){
                    //console.log(err);
                     toastr.error('Connection error.');
            }) 
    }

 $scope.contact_winner_message = function (modal) {
        $scope.modalId = modal;
        $scope.modelData = modal;
        $scope.sendMessage.massage= '';
        if($scope.modalId == '' || $scope.modalId == undefined || $scope.modalId == null){
        toastr.error("Please select user.")
        $state.go('header.manageGifts')
        }else {
            $("#sendMessageModelAllUser").modal('show');
        }
    }

/*-------------------------Message send to all contact winners---------------------*/
    
    $scope.send_massage = function(){
         var array =[];
         var data = {};
         switch ($scope.modelData)
            {
                case 'totalBrolixGiftWinner': 
                    for (var i = 0; i < $scope.contactWinners.length; i++) {
                        array.push($scope.contactWinners[i]._id)
                    }
                    data = {
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                    userService.sendMassageAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Message Send Successfully to All Buyers");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide'); 
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'totalCouponGiftWinner': 
                    for (var i = 0; i < $scope.totalCouponsGiftShow.length; i++) {
                        array.push($scope.totalCouponsGiftShow[i]._id)
                    }
                    data = {
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                    userService.sendMassageAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Message Send Successfully to All Buyers");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide'); 
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'totalCashGiftWinner': 
                    for (var i = 0; i < $scope.totalCashGiftShow.length; i++) {
                        array.push($scope.totalCashGiftShow[i]._id)
                    }
                    data = {
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                    userService.sendMassageAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Message Send Successfully to All Winners");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide'); 
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'totalHiddenGiftWinner': 
                    for (var i = 0; i < $scope.totalHiddenGiftShow.length; i++) {
                        array.push($scope.totalHiddenGiftShow[i]._id)
                    }
                    data = {
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                    userService.sendMassageAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Message Send Successfully to All Buyers");
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

$scope.top_50_balanc = function(type){
  if(type=='balances'){
    $("#top_50_balance").modal('show');
  }else if(type=='coupons'){
    $("#top_50_couponsProviders").modal('show');
  }else{
    $("#top_50_cashProviders").modal('show');
  }   
}

  $scope.giftTypeName = function(val) {
        console.log(val)
        localStorage.setItem('giftTypeName',val);

        //$scope.currentTotalCouponsGift = 1;
        $scope.nextTotalCouponsGiftDetail();

        $scope.currentTotalCashGifts = 1;
        $scope.nextTotalCashGiftsDetail();

        $scope.currentTotalHiddenGifts = 1;
        $scope.nextTotalHiddenGiftsDetail();

          $scope.currentTotalExchangedCoupon= 1;
        $scope.nextTotalExchangedCouponDetail();

        $scope.currentTotalSentCoupon= 1;
        $scope.nextTotalSentCouponDetail();

        $scope.currentTotalSentCash = 1;
        $scope.nextTotalSentCashDetail();

        // $scope.currentTotalSentCash = 1;
        // $scope.nextTotalSentCashDetail();
    }

 
    $scope.dashBordFilter = function() {

      // if($scope.dashBordFilter.country == 'undefined' || $scope.dashBordFilter.country == null || $scope.dashBordFilter.country == '' ){
      //          $scope.dashBordFilter.country = ''

      //  }
      //  if($scope.dashBordFilter.state == 'undefined' || $scope.dashBordFilter.state == null || $scope.dashBordFilter.state == '' ){
      //          $scope.dashBordFilter.state = ''

      //  }
      //  if($scope.dashBordFilter.city == 'undefined' || $scope.dashBordFilter.city == null || $scope.dashBordFilter.city == '' ){
      //          $scope.dashBordFilter.city = ''

      //  }



    var type1 = localStorage.getItem('giftTypeName');
    //console.log(type1);
    $scope.countryOne =$scope.dashBordFilter.country==undefined?'' : $scope.dashBordFilter.country;
    $scope.cityOne =$scope.dashBordFilter.city==undefined?'' : $scope.dashBordFilter.city;
    $scope.couponStatusOne =$scope.dashBordFilter.couponStatus==undefined?'' : $scope.dashBordFilter.couponStatus;
    $scope.cashStatusOne =$scope.dashBordFilter.cashStatus==undefined?'' : $scope.dashBordFilter.cashStatus;


    var data = {};
        data = {
            giftsType:localStorage.getItem('giftTypeName'),
            country: $scope.countryOne,
            city:$scope.cityOne,
            couponStatus:$scope.dashBordFilter.couponStatusOne,
            cashStatus:$scope.dashBordFilter.cashStatusOne,
            joinTo:new Date($scope.dashBordFilter.dobTo).getTime(),
            joinFrom:new Date($scope.dashBordFilter.dobFrom).getTime(),
        }
        console.log("datatata",data)
        data.keys(data).forEach(key => data[key] === undefined ? delete data[key] : '');
        console.log("datatata",data)

    switch(type1)
            {

                case 'totalCouponsGifts': 
                //console.log("1");
                    $scope.currentTotalCouponsGift = 1;
                    userService.giftFilter(data,$scope.currentTotalCouponsGift).success(function(res){
                      //console.log("res",JSON.stringify(res));


                      if (res.responseCode == 200){
                             $scope.noOfPagesTotalCouponsGift = res.pages;
                             $scope.pageTotalCouponsGift= res.page;
                             $scope.totalCouponsGiftShow= res.docs;
                              $scope.totalCouponsGift = res.total;
                         } 
                         else {
                          toastr.error(res.responseMessage);
                          }
                       
                        // if(res.responseCode == 200) {
                        //     $scope.totalCouponsGiftShow = res.result;

                        //     console.log("ressssssss1",res.result.createdAt);
                        //  }else {
                        //     $scope.totalCouponsGiftShow = [];
                        // }
                    })
                    
                break;

                case 'totalCashGifts': 
                //console.log("2");
                    userService.giftFilter(data).success(function(res){
                        
                         if(res.responseCode == 200) {
                           $scope.totalCashGiftShow = res.result;
                           //console.log("ressssssss2",JSON.stringify($scope.totalCashGiftShow));
                         }else {
                           $scope.totalCashGiftShow = [];
                        }
                    })
                    
                break;

                case 'totalHiddenGifts': 
                //console.log("3");
                    userService.giftFilter(data).success(function(res){
                      
                      if(res.responseCode == 200) {
                         $scope.totalHiddenGiftShow = res.result;
                          //console.log("ressssssss3",JSON.stringify($scope.totalHiddenGiftShow));
                      }else {
                         $scope.totalHiddenGiftShow = [];
                      }

                    })
                    
                break;

                case 'totalExchanged': 
                //console.log("4");
                    userService.giftFilter(data).success(function(res){
                       
                        if(res.responseCode == 200) {
                         $scope.totalExchangedCouponShow1 = res.result;
                         // console.log("ressssssss4",JSON.stringify($scope.totalExchangedCouponShow1));
                      }else {
                         $scope.totalExchangedCouponShow1 = [];
                      }

                    })
                    
                break;

                case 'totalSentCoupons':
               // console.log("5"); 
                    userService.giftFilter(data).success(function(res){
                       
                         if(res.responseCode == 200) {
                         $scope.totalSentCouponShow1 = res.result;
                          //console.log("ressssssss4",JSON.stringify($scope.totalSentCouponShow1));
                         }else {
                           $scope.totalSentCouponShow1 = [];
                         }
                    })
                    
                break;

                case 'totalSentCash': 
               // console.log("6");
                    userService.giftFilter(data).success(function(res){
                        $scope.totalSentCashShow = res.result;

                         if(res.responseCode == 200) {
                         $scope.totalSentCashShow = res.result;
                         // console.log("ressssssss4",JSON.stringify($scope.totalSentCashShow));
                         }else {
                           $scope.totalSentCashShow = [];
                         }
                      
                    })
                    
                break;
                
                default: 
                toastr.error("something went to wrong");
            }

    }

})

/*----------ManageGiftCustomFilter----------*/

app.filter("totalCouponGiftFilter",function() {
    var fullName = [];
      return function(items,nameValue){
       if (!nameValue) {
         return retArray = items;
          }
         var retArray = [];
           for(var i=0;i<items.length;i++) 
                {
                 fullName.push(items[i].firstName+' '+items[i].lastName);  
                if (items[i].coupon.pageId.pageName.toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() || fullName[i].toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase())  {
                    retArray.push(items[i]);
                }
           }
           return retArray
        } 
})

app.filter("totalCashGiftFilter",function() {
    var fullName = [];
      return function(items,nameValue){
       if (!nameValue) {
         return retArray = items;
          }
         var retArray = [];
           for(var i=0;i<items.length;i++) 
                {
                 fullName.push(items[i].firstName+' '+items[i].lastName);  
                if (items[i].cashPrize.pageId.pageName.toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() || fullName[i].toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase())  {
                    retArray.push(items[i]);
                }
           }
           return retArray
        } 
})

app.filter("totalHiddenGiftFilter",function() {
    var fullName = [];
      return function(items,nameValue){
       if (!nameValue) {
         return retArray = items;
          }
         var retArray = [];
           for(var i=0;i<items.length;i++) 
                {
                 fullName.push(items[i].firstName+' '+items[i].lastName);  
                if (items[i].hiddenGifts.pageId.pageName.toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() || fullName[i].toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase())  {
                    retArray.push(items[i]);
                }
           }
           return retArray
        } 
})

app.filter("totalExchangedFilter",function() {
    var sentFrom = [];
    var sentTo = [];
      return function(items,nameValue){
       if (!nameValue) {
         return retArray = items;
          }
         var retArray = [];
           for(var i=0;i<items.length;i++) 
              {
                 sentFrom.push(items[i].exchFromFirstName+' '+items[i].exchFromLastName);
                 sentTo.push(items[i].exchToFirstName+' '+items[i].exchToLastName);    
                if (sentFrom[i].toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() || sentTo[i].toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase())  {
                    retArray.push(items[i]);
                   }
               }
           return retArray
        } 
})

app.filter("totalSentCouponFilter",function() {
    var sentFrom = [];
    var sentTo = [];
      return function(items,nameValue){
       if (!nameValue) {
         return retArray = items;
          }
         var retArray = [];
           for(var i=0;i<items.length;i++) 
              {
                 sentFrom.push(items[i].sentFromFirstName+' '+items[i].sentFromLastName);
                 sentTo.push(items[i].sentToFirstName+' '+items[i].sentToLastName);    
                if (sentFrom[i].toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() || sentTo[i].toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase())  {
                    retArray.push(items[i]);
                   }
             }
           return retArray
        } 
})

app.filter("totalSentCashFilter",function() {
    var sentFrom = [];
    var sentTo = [];
      return function(items,nameValue){
       if (!nameValue) {
         return retArray = items;
          }
         var retArray = [];
           for(var i=0;i<items.length;i++) 
                {
                 sentFrom.push(items[i].sendCashListObject.senderId.firstName+' '+items[i].sendCashListObject.senderId.lastName);
                 sentTo.push(items[i].firstName+' '+items[i].lastName);    
                if (sentFrom[i].toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() || sentTo[i].toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase())  {
                    retArray.push(items[i]);
                }
           }
           return retArray
        } 
})


