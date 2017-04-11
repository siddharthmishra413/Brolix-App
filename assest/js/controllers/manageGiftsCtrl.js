app.controller('manageGiftsCtrl', function ($scope, $window, $state, toastr, $timeout, userService) {
$(window).scrollTop(0,0);
$scope.$emit('headerStatus', 'Manage Gifts');
$scope.$emit('SideMenu', 'Manage Gifts');
$scope.tab= 'totalCouponsGifts';
$scope.array = [];

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
   $scope.changeCountry = function() {

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

 userService.totalBrolixGift().then(function(success) {
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
     $scope.nextTotalCouponsGiftDetail = function(){
         userService.totalCouponsGifts($scope.currentTotalCouponsGift).success(function(res) { 
             // console.log("val",JSON.stringify(res))
            if (res.responseCode == 200){
                   $scope.noOfPagesTotalCouponsGift = res.result.pages;
                   $scope.pageTotalCouponsGift= res.result.page;
                   $scope.totalCouponsGiftShow= res.result.docs;
                    $scope.totalCouponsGift = res.result.total;
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
//  userService.totalCouponsGifts().then(function(success) {
//   if(success.data.responseCode == 404){
//         $scope.totalCouponsGift = success.data.count;
//   }else if(success.data.responseCode == 200){
//      $scope.totalCouponsGiftShow = success.data.result;

//        $scope.totalCouponsGift = success.data.count;
//   }else{
//     toastr.error(success.responseMessage);
//   }
// })
  $scope.currentTotalCashGifts = 1;
     $scope.nextTotalCashGiftsDetail = function(){
         userService.totalCashGifts($scope.currentTotalCashGifts).success(function(res) { 
             // console.log("val",JSON.stringify(res))
            if (res.responseCode == 200){
                   $scope.noOfPagesTotalCashGifts = res.result.pages;
                   $scope.pageTotalCashGifts= res.result.page;
                   $scope.totalCashGiftShow= res.result.docs;
                    $scope.totalCashGift = res.result.total;
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

//  userService.totalCashGifts().then(function(success) {
//   console.log(JSON.stringify(success))
//   if(success.data.responseCode == 404){
//        $scope.totalCashGift = success.data.count;
//   }else if(success.data.responseCode == 200){
//      $scope.totalCashGiftShow = success.data.result;
//      console.log(JSON.stringify($scope.totalCashGiftShow))
//        $scope.totalCashGift=success.data.count;
//   }else{
//     toastr.error(success.responseMessage);
//   }
// })
$scope.currentTotalHiddenGifts = 1;
     $scope.nextTotalHiddenGiftsDetail = function(){
         userService.totalHiddenGifts($scope.currentTotalHiddenGifts).success(function(res) { 
             // console.log("val",JSON.stringify(res))
            if (res.responseCode == 200){
                   $scope.noOfPagesTotalHiddenGifts = res.result.pages;
                   $scope.pageTotalHiddenGifts= res.result.page;
                   $scope.totalHiddenGiftShow= res.result.docs;
                    $scope.totalHiddenGift = res.result.total;
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

//  userService.totalHiddenGifts().then(function(success) {
//   if(success.data.responseCode == 404){
//        $scope.totalHiddenGift = success.data.count;
//   }else if(success.data.responseCode == 200){
//      $scope.totalHiddenGiftShow = success.data.result;
//        $scope.totalHiddenGift = success.data.count;
//   }else{
//     toastr.error(success.responseMessage);
//   }
// })

 userService.totalExchangedCoupon().then(function(success) {
  if(success.data.responseCode == 404){
       $scope.totalExchangedCoupons=success.data.count;
  }else if(success.data.responseCode == 200){
     $scope.totalExchangedCouponShow1=[];
    
  for(var i=0;i<success.data.result.length;i++)
     {  
         for (var j=0;j<success.data.result[i].coupon.adId.couponExchange.length;j++) {
               $scope.totalExchangedCouponShow1.push({
             "id":success.data.result[i].coupon.adId._id,  
             "exchToFirstName":success.data.result[i].firstName,
             "exchToLastName":success.data.result[i].lastName,
             "exchFromFirstName":success.data.result[i].coupon.adId.couponExchange[j].receiverId.firstName,
             "exchFromLastName":success.data.result[i].coupon.adId.couponExchange[j].receiverId.lastName,
             });
        }
     }  
       $scope.totalExchangedCoupons = success.data.count;
  }else{
    toastr.error(success.responseMessage);
  }
})

// $scope.currentTotalHiddenGifts = 1;
//      $scope.nextTotalHiddenGiftsDetail = function(){
//          userService.totalSentCoupon($scope.currentTotalHiddenGifts).success(function(res) { 
//              // console.log("val",JSON.stringify(res))
//              $scope.totalSentCouponShow1=[];
//             if (res.responseCode == 200){
//                    $scope.noOfPagesTotalHiddenGifts = res.result.pages;
//                    $scope.pageTotalHiddenGifts= res.result.page;
//                    for(var i=0;i<success.data.result.length;i++)
//                      {  
//                         $scope.totalSentCouponShow = success.data.result;
//                          for (var j=0;j<success.data.result[i].coupon.adId.couponSend.length;j++) {
//                                $scope.totalSentCouponShow1.push({
//                              "id":success.data.result.docs[i].coupon.adId._id,
//                              "sentFromFirstName":success.data.result.docs[i].firstName,
//                              "sentFromLastName":success.data.result.docs[i].lastName,
//                              "sentToFirstName":success.data.result.docs[i].coupon.adId.couponSend[j].receiverId.firstName,
//                              "sentToLastName":success.data.result.docs[i].coupon.adId.couponSend[j].receiverId.lastName,
//                              });
//                         }
//                      }  
//                     $scope.totalSentCoupon = res.result.total;
//                } 
//                else {
//                 toastr.error(res.responseMessage);
//                 }
//           })
         
//      }
//      $scope.nextTotalHiddenGiftsDetail();
//      $scope.nextTotalHiddenGifts = function(){
//         $scope.currentTotalHiddenGifts++;
//         $scope.nextTotalHiddenGiftsDetail();
//      }
//      $scope.preTotalHiddenGifts= function(){
//         $scope.currentTotalHiddenGifts--;
//         $scope.nextTotalHiddenGiftsDetail();
//      }

 userService.totalSentCoupon().then(function(success) {
  if(success.data.responseCode == 404){
       $scope.totalSentCoupon = success.data.count;
  }else if(success.data.responseCode == 200){
    $scope.totalSentCouponShow1=[];
    
  for(var i=0;i<success.data.result.length;i++)
     {  
        $scope.totalSentCouponShow = success.data.result;
         for (var j=0;j<success.data.result[i].coupon.adId.couponSend.length;j++) {
               $scope.totalSentCouponShow1.push({
             "id":success.data.result[i].coupon.adId._id,
             "sentFromFirstName":success.data.result[i].firstName,
             "sentFromLastName":success.data.result[i].lastName,
             "sentToFirstName":success.data.result[i].coupon.adId.couponSend[j].receiverId.firstName,
             "sentToLastName":success.data.result[i].coupon.adId.couponSend[j].receiverId.lastName,
             });
        }
     }  
       $scope.totalSentCoupon = success.data.count;
  }else{
    toastr.error(success.responseMessage);
  }
})

 userService.totalSentCash().then(function(success) {
  if(success.data.responseCode == 404){
       $scope.totalSentCash = success.data.count;
  }else if(success.data.responseCode == 200){
     $scope.totalSentCashShow = success.data.result;
     $scope.totalCash = success.data.totalCash;
       $scope.totalSentCash=success.data.count;
  }else{
    toastr.error(success.responseMessage);
  }
})

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
         console.log(err);
          toastr.error('Connection error.');
   }) 
}

/*-------------------------Message model---------------------*/

$scope.top_50_couponsProviders= function() {
    $("#top_50_couponsProviders").modal('show');
    userService.topFiftyCouponProvider().then(function(success) { 
    $scope.topFiftyCouponProvider=success.data.result;
            },function(err){
           console.log(err);
            toastr.error('Connection error.');
   }) 
}

$scope.top_50_cashProviders= function() {
    $("#top_50_cashProviders").modal('show');
    userService.topFiftyCashProvider().then(function(success) { 
    $scope.topFiftyCashProvider=success.data.result;
            },function(err){
           console.log(err);
            toastr.error('Connection error.');
   }) 
}

$scope.showCouponGift= function(id) {
  console.log(id);
  $("#showCouponGift").modal('show');
  userService.couponGiftAd(id).then(function(success) { 
  $scope.couponGiftAd=success.data.result;
          },function(err){
         console.log(err);
          toastr.error('Connection error.');
   }) 
} 

 $scope.cashGift=function(id){
        console.log("cashGiftId>>>"+JSON.stringify(id))
        userService.adInfo(id).then(function(success) { 
                    if(success.data.responseCode == 200){
                            $scope.userDetail=success.data.result;
                            $("#cashGift").modal('show');
                    }
                    else{
                        toastr.error(success.data.responseMessage)
                    }
            
                },function(err){
                    console.log(err);
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
    }

 
    $scope.dashBordFilter = function() {

    var type1 = localStorage.getItem('giftTypeName');
    console.log(type1);
  
    var data = {};
        data = {
            giftsType:localStorage.getItem('giftTypeName'),
            country: $scope.dashBordFilter.country,
            state:$scope.dashBordFilter.state,
            city:$scope.dashBordFilter.city,
            couponStatus:$scope.dashBordFilter.couponStatus,
            cashStatus:$scope.dashBordFilter.cashStatus,
            joinTo:new Date($scope.dashBordFilter.dateTo).getTime(),
            joinFrom:new Date($scope.dashBordFilter.dateFrom).getTime(),
        }
        console.log("datatata",data)

    switch(type1)
            {

                case 'totalCouponsGifts': 
                console.log("1");
                    userService.giftFilter(data).success(function(res){
                      console.log(res);
                        $scope.totalCouponsGiftShow = res.result;
                        //console.log("ressssssss2",JSON.stringify($scope.totalCoponsGiftShow));
                    })
                    
                break;

                case 'totalCashGifts': 
                console.log("2");
                    userService.giftFilter(data).success(function(res){
                        $scope.totalCashGiftShow = res.result;
                        //console.log("ressssssss3",JSON.stringify($scope.totalCashGiftShow));
                    })
                    
                break;

                case 'totalHiddenGifts': 
                console.log("3");
                    userService.giftFilter(data).success(function(res){
                      console.log("res",JSON.stringify(res))
                        $scope.totalHiddenGiftShow = res.result;
                        //console.log("ressssssss4",JSON.stringify($scope.totalHiddenGiftShow));
                    })
                    
                break;

                case 'totalExchanged': 
                console.log("4");
                    userService.giftFilter(data).success(function(res){
                        $scope.totalExchangedCouponShow1 = res.result;
                        //console.log("ressssssss5",JSON.stringify($scope.totalExchangedCouponShow1));
                    })
                    
                break;

                case 'totalSentCoupons':
                console.log("5"); 
                    userService.giftFilter(data).success(function(res){
                        $scope.totalSentCouponShow1 = res.result;
                        //console.log("ressssssss6",JSON.stringify($scope.totalSentCouponShow1));
                    })
                    
                break;

                case 'totalSentCash': 
                console.log("6");
                    userService.giftFilter(data).success(function(res){
                        $scope.totalSentCashShow = res.result;
                        //console.log("ressssssss7",JSON.stringify($scope.totalSentCashShow));
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


