app.controller('manageGiftsCtrl', function ($scope, $window, $state, toastr, $timeout, userService) {
$(window).scrollTop(0,0);
$scope.$emit('headerStatus', 'Manage Gifts');
$scope.$emit('SideMenu', 'Manage Gifts');
$('#manageUserTable').DataTable();
// $scope.tab= 'totalCouponsGifts';
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
  }else if(type=='totalHiddenGifts'){
    $('#manageGiftTableThree').DataTable();
      $scope.tab= 'totalHiddenGifts'; 
     $timeout(function(){
        $('#manageGiftTableThree').DataTable();
         $scope.tab= 'totalHiddenGifts';      
     },100)
  }else if(type=='totalExchanged'){
    $('#manageGiftTableFour').DataTable();
      $scope.tab= 'totalExchanged'; 
     $timeout(function(){
        $('#manageGiftTableFour').DataTable();
         $scope.tab= 'totalExchanged';      
     },100)
  }else if(type=='totalSentCoupons'){
    $('#manageGiftTableFive').DataTable();
      $scope.tab= 'totalSentCoupons'; 
     $timeout(function(){
        $('#manageGiftTableFive').DataTable();
         $scope.tab= 'totalSentCoupons';      
     },100)
  }else if(type=='totalSentCash'){
    $('#manageGiftTableSix').DataTable();
      $scope.tab= 'totalSentCash'; 
     $timeout(function(){
        $('#manageGiftTableSix').DataTable();
         $scope.tab= 'totalSentCash';      
     },100)
  }else{
    console.log("dddddd");
  }
     
}

 userService.countryListData().success(function(res) {
      $scope.countriesList = res.result;
    })

$scope.changeCountry = function(){
  var obj = {};
  obj = {
    country:$scope.dashBordFilter.country,
  }
  userService.cityListData(obj).success(function(res) {
    $scope.cityList = res.result;
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

userService.totalCouponsGifts().success(function(res) {
  //console.log("sssss",JSON.stringify(res))
  if (res.responseCode == 200){
    $scope.totalCouponsGiftShow= res.result;
    $scope.totalCouponsGift = $scope.totalCouponsGiftShow.length;
  } 
  else {
    toastr.error(res.responseMessage);
  }
})

userService.totalCashGifts().success(function(res) { 
  if (res.responseCode == 200){
    $scope.totalCashGiftShow= res.result;
    $scope.totalCashGift = res.result.length;
  } 
  else {
    toastr.error(res.responseMessage);
  }
})

userService.totalHiddenGifts().success(function(res) { 
  if (res.responseCode == 200){
    $scope.totalHiddenGiftShow= res.result;
    $scope.totalHiddenGift = res.result.length;
  } 
  else {
    toastr.error(res.responseMessage);
  }
})

userService.totalExchangedCoupon().success(function(res) { 
  //console.log("resssss",JSON.stringify(res))
  if (res.responseCode == 200){
    $scope.totalExchangedCoupons= res.result.length;
    $scope.totalExchangedCouponShowOne=[];
    for(var i=0;i<res.result.length;i++)
    {  
      for (var j=0;j<res.result[i].coupon.adId.couponExchangeReceived.length;j++) {
        $scope.totalExchangedCouponShowOne.push({
          "id":res.result[i].coupon.adId._id,  
          "exchToFirstName":res.result[i].firstName,
          "exchToLastName":res.result[i].lastName,
          "exchFromFirstName":res.result[i].coupon.adId.couponExchangeReceived[j].receiverId.firstName,
          "exchFromLastName":res.result[i].coupon.adId.couponExchangeReceived[j].receiverId.lastName,
        });
      }
    }  
  } 
  else {
    toastr.error(res.responseMessage);
  }
})

userService.totalSentCoupon().success(function(res) { 
  //console.log("res",JSON.stringify(res))
  if (res.responseCode == 200){
    $scope.totalSentCoupon = res.result.length;
    $scope.totalSentCouponShowTwo=[];
    for(var i=0;i<res.result.length;i++)
    {  
      //console.log("res.result.length",res.result.length)
      for (var j=0;j<res.result[i].coupon.adId.couponSend.length;j++) {
        $scope.totalSentCouponShowTwo.push({
        "id":res.result[i].coupon.adId._id,
        "sentFromFirstName":res.result[i].firstName,
        "sentFromLastName":res.result[i].lastName,
        "sentToFirstName":res.result[i].coupon.adId.couponSend[j].receiverId.firstName,
        "sentToLastName":res.result[i].coupon.adId.couponSend[j].receiverId.lastName,
        });
      }
    }
    //console.log("$scope.totalSentCouponShowTwo",$scope.totalSentCouponShowTwo.length);
  
  } 
  else {
    toastr.error(res.responseMessage);
  }
})

userService.totalSentCash().success(function(res) { 
  //console.log("val",JSON.stringify(res))
  if (res.responseCode == 200){  
    $scope.totalCash= res.totalCash;   
    $scope.totalSentCashShow= res.result;
    $scope.totalSentCash=res.result.length;
  } 
  else {
    toastr.error(res.responseMessage);
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
  console.log(id)
  userService.couponGiftAd(id).then(function(success) { 
    console.log("success",success)
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
  localStorage.setItem('giftTypeName',val);
}

 
    $scope.dashBordFilter = function() {

    var type1 = localStorage.getItem('giftTypeName');
    // //console.log(type1);
    // $scope.countryOne =$scope.dashBordFilter.country==undefined?'' : $scope.dashBordFilter.country;
    // $scope.cityOne =$scope.dashBordFilter.city==undefined?'' : $scope.dashBordFilter.city;
    // $scope.couponStatusOne =$scope.dashBordFilter.couponStatus==undefined?'' : $scope.dashBordFilter.couponStatus;
    // $scope.cashStatusOne =$scope.dashBordFilter.cashStatus==undefined?'' : $scope.dashBordFilter.cashStatus;


    var data = {};
        data = {
            giftsType:localStorage.getItem('giftTypeName'),
            country: $scope.dashBordFilter.country,
            city:$scope.dashBordFilter.city,
            couponStatus:$scope.dashBordFilter.couponStatus,
            cashStatus:$scope.dashBordFilter.cashStatus,
            joinTo:new Date($scope.dashBordFilter.dobTo).getTime(),
            joinFrom:new Date($scope.dashBordFilter.dobFrom).getTime(),
        }
        //console.log("datatata",JSON.stringify(data))

    switch(type1)
            {

                case 'totalCouponsGifts': 
                //console.log("1");
                    userService.giftFilter(data).success(function(res){
                      //console.log("1:   ",JSON.stringify(res));
                      if (res.responseCode == 200){
                        $scope.totalCouponsGiftShow= res.result; 
                        $timeout(function(){
                          $('#manageGiftTableOne').DataTable();     
                        },100)
                      } 
                      else {
                        $scope.totalCouponsGiftShow="";
                        $timeout(function(){
                          $('#manageGiftTableOne').DataTable();      
                        },100)
                        toastr.error(res.responseMessage);
                      }
                    })
                    
                break;

                case 'totalCashGifts': 
                //console.log("2");
                    userService.giftFilter(data).success(function(res){
                      //console.log("2:   ",JSON.stringify(res));
                      if (res.responseCode == 200){
                        $scope.totalCashGiftShow= res.result; 
                        $timeout(function(){
                          $('#manageGiftTableTwo').DataTable();     
                        },100)
                      } 
                      else {
                        $scope.totalCashGiftShow="";
                        $timeout(function(){
                          $('#manageGiftTableTwo').DataTable();      
                        },100)
                        toastr.error(res.responseMessage);
                      }
                    })
                    
                break;

                case 'totalHiddenGifts': 
                //console.log("3");
                    userService.giftFilter(data).success(function(res){
                     // console.log("3:   ",JSON.stringify(res));
                      if (res.responseCode == 200){
                        $scope.totalHiddenGiftShow= res.result; 
                        $timeout(function(){
                          $('#manageGiftTableThree').DataTable();     
                        },100)
                      } 
                      else {
                        $scope.totalHiddenGiftShow="";
                        $timeout(function(){
                          $('#manageGiftTableThree').DataTable();      
                        },100)
                        toastr.error(res.responseMessage);
                      }
                    })
                    
                break;

                case 'totalExchanged': 
                //console.log("4");
                      userService.giftFilter(data).success(function(res){
                      //console.log("4:   ",JSON.stringify(res));
                      if (res.responseCode == 200){
                        $scope.totalExchangedCouponShowOne= res.result; 
                        $timeout(function(){
                          $('#manageGiftTableFour').DataTable();     
                        },100)
                      } 
                      else {
                        $scope.totalExchangedCouponShowOne="";
                        $timeout(function(){
                          $('#manageGiftTableFour').DataTable();      
                        },100)
                        toastr.error(res.responseMessage);
                      }
                    })
                    
                break;

                case 'totalSentCoupons':
               // console.log("5"); 
                    userService.giftFilter(data).success(function(res){
                     // console.log("5:   ",JSON.stringify(res));
                      if (res.responseCode == 200){
                        $scope.totalSentCouponShowTwo= res.result; 
                        $timeout(function(){
                          $('#manageGiftTableFive').DataTable();     
                        },100)
                      } 
                      else {
                        $scope.totalSentCouponShowTwo="";
                        $timeout(function(){
                          $('#manageGiftTableFive').DataTable();      
                        },100)
                        toastr.error(res.responseMessage);
                      }
                    })
                    
                break;

                case 'totalSentCash': 
               // console.log("6");
                    userService.giftFilter(data).success(function(res){
                     // console.log("6:   ",JSON.stringify(res));
                      if (res.responseCode == 200){
                        $scope.totalSentCashShow= res.result; 
                        $timeout(function(){
                          $('#manageGiftTableSix').DataTable();     
                        },100)
                      } 
                      else {
                        $scope.totalSentCashShow="";
                        $timeout(function(){
                          $('#manageGiftTableSix').DataTable();      
                        },100)
                        toastr.error(res.responseMessage);
                      }
                    })
                    
                break;
                
                default: 
                toastr.error("something went to wrong");
            }

    }

})

/*----------ManageGiftCustomFilter----------*/

// app.filter("totalCouponGiftFilter",function() {
//     var fullName = [];
//       return function(items,nameValue){
//        if (!nameValue) {
//          return retArray = items;
//           }
//          var retArray = [];
//            for(var i=0;i<items.length;i++) 
//                 {
//                  fullName.push(items[i].firstName+' '+items[i].lastName);  
//                 if (items[i].coupon.pageId.pageName.toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() || fullName[i].toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase())  {
//                     retArray.push(items[i]);
//                 }
//            }
//            return retArray
//         } 
// })

// app.filter("totalCashGiftFilter",function() {
//     var fullName = [];
//       return function(items,nameValue){
//        if (!nameValue) {
//          return retArray = items;
//           }
//          var retArray = [];
//            for(var i=0;i<items.length;i++) 
//                 {
//                  fullName.push(items[i].firstName+' '+items[i].lastName);  
//                 if (items[i].cashPrize.pageId.pageName.toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() || fullName[i].toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase())  {
//                     retArray.push(items[i]);
//                 }
//            }
//            return retArray
//         } 
// })

// app.filter("totalHiddenGiftFilter",function() {
//     var fullName = [];
//       return function(items,nameValue){
//        if (!nameValue) {
//          return retArray = items;
//           }
//          var retArray = [];
//            for(var i=0;i<items.length;i++) 
//                 {
//                  fullName.push(items[i].firstName+' '+items[i].lastName);  
//                 if (items[i].hiddenGifts.pageId.pageName.toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() || fullName[i].toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase())  {
//                     retArray.push(items[i]);
//                 }
//            }
//            return retArray
//         } 
// })

// app.filter("totalExchangedFilter",function() {
//     var sentFrom = [];
//     var sentTo = [];
//       return function(items,nameValue){
//        if (!nameValue) {
//          return retArray = items;
//           }
//          var retArray = [];
//            for(var i=0;i<items.length;i++) 
//               {
//                  sentFrom.push(items[i].exchFromFirstName+' '+items[i].exchFromLastName);
//                  sentTo.push(items[i].exchToFirstName+' '+items[i].exchToLastName);    
//                 if (sentFrom[i].toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() || sentTo[i].toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase())  {
//                     retArray.push(items[i]);
//                    }
//                }
//            return retArray
//         } 
// })

// app.filter("totalSentCouponFilter",function() {
//     var sentFrom = [];
//     var sentTo = [];
//       return function(items,nameValue){
//        if (!nameValue) {
//          return retArray = items;
//           }
//          var retArray = [];
//            for(var i=0;i<items.length;i++) 
//               {
//                  sentFrom.push(items[i].sentFromFirstName+' '+items[i].sentFromLastName);
//                  sentTo.push(items[i].sentToFirstName+' '+items[i].sentToLastName);    
//                 if (sentFrom[i].toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() || sentTo[i].toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase())  {
//                     retArray.push(items[i]);
//                    }
//              }
//            return retArray
//         } 
// })

// app.filter("totalSentCashFilter",function() {
//     var sentFrom = [];
//     var sentTo = [];
//       return function(items,nameValue){
//        if (!nameValue) {
//          return retArray = items;
//           }
//          var retArray = [];
//            for(var i=0;i<items.length;i++) 
//                 {
//                  sentFrom.push(items[i].sendCashListObject.senderId.firstName+' '+items[i].sendCashListObject.senderId.lastName);
//                  sentTo.push(items[i].firstName+' '+items[i].lastName);    
//                 if (sentFrom[i].toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() || sentTo[i].toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase())  {
//                     retArray.push(items[i]);
//                 }
//            }
//            return retArray
//         } 
// })


