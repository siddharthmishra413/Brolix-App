app.controller('managePaymentCtrl', function ($scope,$window,userService,$timeout,$http,toastr,$state) {
$(window).scrollTop(0,0);
    $scope.$emit('headerStatus', 'Manage Payment');
    $scope.$emit('SideMenu', 'Manage Payment');
    $scope.tab = 'totalUsers';
    $scope.flag=0;
    $scope.type='dollars';
    $scope.clr="#00B288";
    $scope.clr1=""
    $scope.myForm={};
    $scope.dashBordFilter={};
    $scope.dashBordFilter.country="";
    $scope.dashBordFilter.state="";
    $scope.dashBordFilter.city="";
    $scope.myForm.country="";
    $scope.myForm.state="";
    $scope.myForm.city="";
    $scope.dashBordFilter.dollarCardType ="";
    $scope.dashBordFilter.brolixCardType ="";
        $scope.myForm.cashStatus ="";
    $scope.myForm.couponStatus ="";


    //******************** dollars Sold Upgrade Card data **********************
   $scope.currentSoldUpgradeCard = 1;
     $scope.nextSoldUpgradeCardDetail = function(){
         userService.SoldUpgradeCard($scope.currentSoldUpgradeCard).success(function(res) { 
              // console.log("val>>",JSON.stringify(res))
             $scope.dollars=[];
            if (res.responseCode == 200){
                   $scope.noOfPagesSoldUpgradeCard = res.pages;
                   $scope.pageSoldUpgradeCard= res.page;
                    // $scope.dollars= res.docs;
                    $scope.showAllSoldUpgradeCardCount = res.total;
                   for(i=0;i<res.docs.length;i++) {
                            $scope.dollars.push(res.docs[i]);
                            // console.log("dollars>>>>>>>>>"+JSON.stringify($scope.dollars))
                        }
               } 
               else {
                toastr.error(res.responseMessage);
                }
          })
     }
     $scope.nextSoldUpgradeCardDetail();
     $scope.nextSoldUpgradeCard = function(){
        $scope.currentSoldUpgradeCard++;
        $scope.nextSoldUpgradeCardDetail();
     }
     $scope.preSoldUpgradeCard= function(){
        $scope.currentSoldUpgradeCard--;
        $scope.nextSoldUpgradeCardDetail();
     }

//***************  Cash Gifts****************************
     $scope.currentCashGifts = 1;
             $scope.nextCashGiftsDetail = function(){
                 userService.cashGift($scope.currentCashGifts).success(function(res) { 
                       //console.log("val111>>",JSON.stringify(res))
                    $scope.dollarsCashGift=[];
                    if (res.responseCode == 200){
                           $scope.noOfPagesCashGifts = res.pages;
                           $scope.pageCashGifts= res.page;
                            // $scope.dollars= res.docs;
                             $scope.count= res.total;
                           for(i=0;i<res.docs.length;i++)  {
                                $scope.dollarsCashGift.push(res.docs[i]);
                               }

                       } 
                       else {
                        toastr.error(res.responseMessage);
                        }
                  })
             }
             $scope.nextCashGiftsDetail();
             $scope.nextCashGifts = function(){
                $scope.currentCashGifts++;
                $scope.nextCashGiftsDetail();
             }
             $scope.preCashGifts= function(){
                $scope.currentCashGifts--;
                $scope.nextCashGiftsDetail();
             }
    
    
    

    $scope.payment=function(data){
        $scope.type = data;
        $scope.string = $scope.type;

        // ******************** Brolix Data *************

        if($scope.string == 'brolix'){
            $scope.flag= 1;
            $scope.clr1="#00B288";
            $scope.dashBordFilter.city="";
            $scope.dashBordFilter.country="";
            $scope.dashBordFilter.state="";
            $scope.dashBordFilter.dobFrom="";
            $scope.dashBordFilter.dobTo="";
            $scope.myForm.dateFrom="";
            $scope.myForm.dateTo="";
            $scope.search="";
            $scope.searchdata="";
            $scope.myForm.country="";
            $scope.myForm.state="";
            $scope.myForm.city="";
            $scope.clr="";
//**************** Sold Luck Card ****************************************
            $scope.currentSoldLuckCard = 1;
             $scope.nextSoldLuckCardDetail = function(){
                 userService.SoldLuckCard($scope.currentSoldLuckCard).success(function(res) { 
                    $scope.brolix=[];
                    if (res.responseCode == 200){
                           $scope.noOfPagesSoldLuckCard = res.pages;
                           $scope.pageSoldLuckCard= res.page;
                            // $scope.dollars= res.docs;
                            $scope.showAllSoldLuckCardCount = res.total;
                           for(i=0;i<res.docs.length;i++) {
                                $scope.brolix.push(res.docs[i]);
                                //console.log(JSON.stringify($scope.brolix[i].luckCardObject.status));
                                if($scope.brolix[i].luckCardObject.status == "INACTIVE"){
                                    $scope.brolix[i].luckCardObject.status="Unused";
                                }
                                else{
                                    $scope.brolix[i].luckCardObject.status="Used";
                                }
                            }

                       } 
                       else {
                        toastr.error(res.responseMessage);
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

//**************** Sold Coupons ****************************************

             $scope.currentSoldCoupons = 1;
             $scope.nextSoldCouponsDetail = function(){
                 userService.soldCoupons($scope.currentSoldCoupons).success(function(res) { 
                       //console.log("val>>",JSON.stringify(res))
                    $scope.brolixCoupon=[];
                    if (res.responseCode == 200){
                           $scope.noOfPagesSoldCoupons = res.pages;
                           $scope.pageSoldCoupons= res.page;
                            // $scope.dollars= res.docs;
                             $scope.SoldCouponsCount = res.total;
                           for(i=0;i<res.docs.length;i++)  {
                                $scope.brolixCoupon.push(res.docs[i]);
                               }

                       } 
                       else {
                        toastr.error(res.responseMessage);
                        }
                  })
             }
             $scope.nextSoldCouponsDetail();
             $scope.nextSoldCoupons = function(){
                $scope.currentSoldCoupons++;
                $scope.nextSoldCouponsDetail();
             }
             $scope.preSoldCoupons= function(){
                $scope.currentSoldCoupons--;
                $scope.nextSoldCouponsDetail();
             }
        }  

        //****************** dollars Data *********************

        else if($scope.string == 'dollars'){
            $scope.dashBordFilter.country="";
            $scope.dashBordFilter.state="";
            $scope.dashBordFilter.city="";
            $scope.myForm.country="";
            $scope.myForm.state="";
            $scope.search="";
            $scope.myForm.cashStatus="";
            $scope.myForm.couponStatus="";
            $scope.dashBordFilter.dollarCardType="";
            $scope.dashBordFilter.brolixCardType="";
            $scope.dashBordFilter.dobFrom="";
            $scope.dashBordFilter.dobTo="";
            $scope.myForm.dateFrom="";
            $scope.myForm.dateTo="";
            $scope.searchdata="";
            $scope.myForm.city="";
            $scope.flag= 0;
            $scope.clr="#00B288";
            $scope.clr1="";

            $scope.dollars=[];
            $scope.currentSoldUpgradeCard = 1;
            $scope.nextSoldUpgradeCardDetail();
             $scope.nextSoldUpgradeCard = function(){
                $scope.currentSoldUpgradeCard++;
                $scope.nextSoldUpgradeCardDetail();
             }
             $scope.preSoldUpgradeCard= function(){
                $scope.currentSoldUpgradeCard--;
                $scope.nextSoldUpgradeCardDetail();
             }
        } 
        $scope.dollarsCashGift =[];
        $scope.currentCashGifts = 1;
        $scope.nextCashGiftsDetail();
             $scope.nextCashGifts = function(){
                $scope.currentCashGifts++;
                $scope.nextCashGiftsDetail();
             }
             $scope.preCashGifts= function(){
                $scope.currentCashGifts--;
                $scope.nextCashGiftsDetail();
             }

    }

    //********************** User Info (click on Name) ********************

    $scope.userInfo=function(id){
        //console.log(JSON.stringify(id))
        
        userService.userInfo(id).then(function(success) { 
             console.log(JSON.stringify(success))
                    if(success.data.responseCode== 200){
                            $scope.userDetail=success.data.result
                            $("#userInfo").modal('show');
                    }
                    else{
                        toastr.error(success.data.responseMessage);
                    }
            
                },function(err){
                    //console.log(err);
                     toastr.error('Connection error.');
            }) 
    }

    //********************* CashGift, Sold Coupon and Ad ****************

    $scope.adInfo=function(id){
        //console.log("adInfoId>>>"+JSON.stringify(id))
        userService.adInfo(id).then(function(success) { 
            console.log("adInfoId>>>"+JSON.stringify(success))
                    if(success.data.responseCode == 200){
                            $scope.userDetail=success.data.result;
                            $("#adInfo").modal('show');
                            $scope.newDate = success.data.result.couponExpiryDate;
                            console.log("adInfo>>>>>>>>>>>>>"+JSON.stringify(success.data.result))
                    }
                    else{
                        toastr.error(success.data.responseMessage)
                    }
            
                },function(err){
                    console.log(err);
                     toastr.error('Connection error.');
            }) 
    }
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

    $scope.top_50_dollarsBuyers=function(){
            userService.top_50_dollarsBuyers(1).then(function(success) {
                 console.log("success"+JSON.stringify(success))
                    if(success.data.responseCode == 200){
                        $scope.userDetail=success.data.result.docs;
                            $("#top_50_buyers").modal('show');
                            // console.log(JSON.stringify(success.data.result))
                    } else{
                        toastr.error(success.data.responseMessage);
                    }
                    
                },function(err){
                    //console.log(err);
                     toastr.error('Connection error.');
            })
    }
    $scope.top_50_brolixBuyers=function(){
            userService.top_50_brolixBuyers(1).then(function(success) { 
                console.log("ressss",JSON.stringify(success))
                    if(success.data.responseCode == 200){
                        
                        $scope.userDetail=success.data.result;
                        $("#top_50_buyers").modal('show');
                        // console.log(JSON.stringify(success.data.result))
                    }else{
                        toastr.error(success.data.responseCode);
                    }
                    
                },function(err){
                    //console.log(err);
                     toastr.error('Connection error.');
            })
    }

    //*******************Total Price****************
     userService.totalDollarsPrice().then(function(res) {
         //console.log(JSON.stringify(res))
        if (res.data.responseCode == 200){
            $scope.totalDollarsPrice = res.data.totalCash;
            if(res.data.totalCash == null)
                $scope.totalDollarsPrice =0;
           //console.log("totalIncomeInCashFromUpgradeCard",JSON.stringify($scope.totalSoldLuckCardcount));
        } else {
            toastr.error(res.responseMessage);
        }
        
    })
    userService.totalBrolixPrice().then(function(res) {
        // console.log(JSON.stringify(res))
        if (res.data.responseCode == 200){
            $scope.totalBrolixPrice = res.data.totalBrolix;
           //console.log("totalIncomeInCashFromUpgradeCard",JSON.stringify($scope.totalSoldLuckCardcount));
        } else {
            toastr.error(res.responseMessage);
        }
        
    })

    //************************Top 50 Ads ***********************

    $scope.top_50_Ads=function(){
        $scope.adsDetail=[];
            userService.top_50_Ads().then(function(success) {
             //console.log(JSON.stringify(success)) 
                    if(success.data.responseCode == 200){
                        for(i=0;i<success.data.result.length;i++){
                            $scope.adsDetail.push(success.data.result[i]);
                            $("#top_50_Ads").modal('show');
                            success.data.result[i].couponExpiryDate = new Date(success.data.result[i].couponExpiryDate);
                        }
 
                    }else{
                        toastr.error(success.data.responseCode);
                    }
                    
                },function(err){
                    //onsole.log(err);
                     toastr.error('Connection error.');
            })
    }


    //********************** page Name *************************

    $scope.pageInfo=function(id){
        userService.pageInfo(id).then(function(success) { 
                    if(success.data.responseCode == 200){
                        $scope.pageDetail=success.data.result;
                                $("#pageInfo").modal('show');
                            // console.log(JSON.stringify($scope.pageDetail))
                    }else{
                        toastr.error(success.data.responseMessage)
                    }
                    
                },function(err){
                    //console.log(err);
                     toastr.error('Connection error.');
            }) 
    }


    //*********************** Used Ad **************************

    $scope.upgradeCardUsedAd=function(id){
        $scope.usedAd=[];
        //console.log(JSON.stringify(id))
        var data = {
                    "upgradeId":id
                    }
        //console.log(JSON.stringify(data))
        userService.upgradeCardUsedAd(data).then(function(success) { 
                    if(success.data.responseCode == 200){
                        for(i=0;i<success.data.result.length;i++){
                            $scope.usedAd.push(success.data.result[i]);
                            $("#luckCardUsedAd").modal('show');
                            //console.log(JSON.stringify($scope.usedAd))
                            $scope.newDate = new Date((success.data.result[i].couponExpiryDate)*1000);
                            //console.log(JSON.stringify($scope.newDate))
                        } 
                    }
                    else{
                        toastr.error(success.data.responseMessage);
                    }
                    
                },function(err){
                    //console.log(err);
                     toastr.error('Connection error.');
            }) 
    }
    $scope.luckCardUsedAd=function(id){
        $scope.usedAd=[];
        //console.log(JSON.stringify(id))
        var data = {
                    "luckId":id
                }
        userService.luckCardUsedAd(data).then(function(success) { 
                    if(success.data.responseCode == 200){
                        for(i=0;i<success.data.result.length;i++){
                            $scope.usedAd.push(success.data.result[i]);
                            $("#luckCardUsedAd").modal('show');
                            //console.log(JSON.stringify($scope.usedAd))
                            $scope.newDate = new Date((success.data.result[i].couponExpiryDate)*1000);
                            //console.log(JSON.stringify($scope.newDate ))
                        } 
                    }else{
                            toastr.error(success.data.responseMessage);
                    }
                    
                },function(err){
                    //onsole.log(err);
                     toastr.error('Connection error.');
            }) 
    }


    //*********************** Payment History **************************

    $scope.upgradePayment=function(id){
            userService.upgradeCardPayment(id).then(function(success) {
                if(success.data.responseCode == 200){
                   $scope.upgradeUsedAd=[];
                     $scope.upgradeCardObject =[];
                    $("#upgradePayment").modal('show'); 
                    // console.log(JSON.stringify(success.data.result))
                    for(i=0;i<success.data.result.length;i++) {
                            for(j=0;j<success.data.result[i].UpgradeUsedAd.length;j++){
                                 $scope.upgradeUsedAd.push(success.data.result[i].upgradeUsedAd[j].adId);
                                 // console.log(JSON.stringify($scope.upgradeUsedAd))
                            }
                            for(k=0;k<success.data.result[i].upgradeCardObject.length;k++){
                                $scope.upgradeCardObject.push(success.data.result[i].upgradeCardObject[k]);
                                // console.log(JSON.stringify($scope.upgradeCardObject))
                            }
                            
                        } 
                }
                else{
                    toastr.error(success.data.responseMessage)
                }
                
                },function(err){
                    //console.log(err);
                     toastr.error('Connection error.');
            }) 
    }
    $scope.luckPayment=function(id){
            userService.luckCardPayment(id).then(function(success) {
                $scope.luckUsedAd=[];
                $scope.luckCardObject=[];
                    $("#luckPayment").modal('show'); 
                    // console.log(JSON.stringify(success.data.result))
                    for(i=0;i<success.data.result.length;i++) {
                            for(j=0;j<success.data.result[i].luckUsedAd.length;j++){
                                 $scope.luckUsedAd.push(success.data.result[i].luckUsedAd[j].adId);
                                 // console.log(JSON.stringify($scope.luckUsedAd))
                            }
                            for(k=0;k<success.data.result[i].luckCardObject.length;k++){
                                $scope.luckCardObject.push(success.data.result[i].luckCardObject[k]);
                                // console.log(JSON.stringify($scope.luckCardObject))
                            }
                            
                        }
                },function(err){
                    //console.log(err);
                     toastr.error('Connection error.');
            }) 
    }

    //*******************Total Sold UpgradeCard****************

    userService.totalSoldUpgradeCard().success(function(res) {
        if (res.responseCode == 200){
            $scope.totalSoldUpgradeCard = res.result;
            //console.log("totalSoldUpgradeCardtotalSoldUpgradeCard",JSON.stringify($scope.totalSoldUpgradeCard));
        } else {
            toastr.error(res.responseMessage);
        }
        
    })

    //*******************Total Sold LuckCard****************

    userService.totalSoldLuckCard().success(function(res) {
        if (res.responseCode == 200){
            $scope.totalSoldLuckCard = res.result;
            // $scope.totalIncome = res.totalIncome;
             $scope.totalSoldLuckCardcount = res.count;
           //console.log("totalIncomeInCashFromUpgradeCard",JSON.stringify($scope.totalSoldLuckCardcount));
        } else {
            toastr.error(res.responseMessage);
        }
        
    })
    //**************************** Page Count *******************************

    $scope.pageCount=function(id){
        //console.log(JSON.stringify(id))
        $scope.page=[];
        userService.pageCount(id).then(function(success) { 
                    if(success.data.responseCode == 200){
                       for(i=0;i<success.data.result.length;i++){
                                $scope.page.push(success.data.result[i]);
                            }
                             // console.log("pages>>>>>>"+JSON.stringify($scope.page))
                             $("#Pages").modal('show'); 
                    }else{
                        toastr.error(success.data.responseMessage)
                    }  
                },function(err){
                    //console.log(err);
                     toastr.error('Connection error.');
            }) 
    }

    //**************************** Payment Paypal *******************************
    $scope.paymentPaypal=function(type){
        $scope.paymentPay=[];
        var data = {
                    "type":type
                    }
           userService.paymentPaypal(data).then(function(success) {
           // console.log(JSON.stringify(success)) 
                    if(success.data.responseCode == 200){
                       for(i=0;i<success.data.result.length;i++){
                                $scope.paymentPay.push(success.data.result[i]);
                            }
                             $("#paymentPaypal").modal('show');  
                             console.log(JSON.stringify($scope.paymentPay))
                    }else{
                        toastr.error(success.data.responseMessage)
                    }  
                },function(err){
                    //console.log(err);
                     toastr.error('Connection error.');
            })          
       
    }

    //************************** Contact Buyers and Winners ******************

    $scope.total_user_message = function (modal) {
        // console.log("Contact Modal >>>>>>>>>>"+JSON.stringify(modal))
        $scope.modalId = modal;
        $scope.modelData = modal;
        $scope.sendMessage.massage= '';
        if($scope.modalId == '' || $scope.modalId == undefined || $scope.modalId == null){
        toastr.error("Please select user.")
        $state.go('header.userServices')
        }else {
            $("#sendMessageModelAllUser").modal('show');
        }
    }

    $scope.send_massage = function(){
         var array =[];
         var data = {};

         switch ($scope.modelData)
            {
                case 'dollars': 

                    for (var i = 0; i < $scope.dollars.length; i++) {
                        array.push($scope.dollars[i]._id)
                    }
                    $scope.sendMessage.massage = '';
                    data = {
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                    userService.sendMassageAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
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
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                    userService.sendMassageAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Message Sent Successfully to All Buyers");
                            $scope.sendMessage.massage= '';
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
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                    userService.sendMassageAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
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
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                    userService.sendMassageAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
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
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                    userService.sendMassageAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Message Send Successfully to User");
                            $scope.sendMessage.massage= '';
                            $("#sendMessageModelAllUser").modal('hide'); 
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
            }

    }
    
    // ***************Filters for Country, State and City*********************

    var currentCities=[];
    $scope.currentCountry= '';
    $scope.countriesList=[];
    $scope.myForm={};
    var BATTUTA_KEY="00000000000000000000000000000000"
  url="http://battuta.medunes.net/api/country/all/?key="+BATTUTA_KEY+"&callback=?";
    $.getJSON(url,function(countries)
    {
      $timeout(function(){
        $scope.countriesList=countries;
         $scope.brolixCountryList=countries;
      },100)
      
      
    });
  $scope.country1Code;
  $scope.country2Code;
    $scope.changeCountry = function(ind){
        if(ind=='1'){
            for(var i=0; i<$scope.countriesList.length;i++) {
                if($scope.countriesList[i].name==$scope.dashBordFilter.country) {
                   $scope.country1Code=$scope.countriesList[i].code;
                   break;
                }
            }
        }
        else{
            for(var i=0;i<$scope.brolixCountryList.length;i++) {
                if($scope.brolixCountryList[i].name==$scope.myForm.country) {
                    $scope.country2Code=$scope.brolixCountryList[i].code;
                    break;
                }
                
            }
        }
        
      // }
      if(ind=='1') {
              var url="http://battuta.medunes.net/api/region/"+$scope.country1Code+"/all/?key="+BATTUTA_KEY+"&callback=?";
              $.getJSON(url,function(regions)
              {
                 $timeout(function(){
                        $scope.state1List = regions;
                  },100)
              });
            
        }
        else{
            var url="http://battuta.medunes.net/api/region/"+$scope.country2Code+"/all/?key="+BATTUTA_KEY+"&callback=?";
              $.getJSON(url,function(regions)
              {
                 $timeout(function(){
                        $scope.state2List = regions;
                        // console.log("State2 List",JSON.stringify( $scope.state2List))
                  },100)
              });
            }
        }

    $scope.changeState = function(ind){
        if(ind=='1') {
                //console.log('State:   '+JSON.stringify($scope.dashBordFilter.state))
              var url="http://battuta.medunes.net/api/city/"+$scope.country1Code+"/search/?region="+$scope.dashBordFilter.state+"&key="+BATTUTA_KEY+"&callback=?";
              $.getJSON(url,function(cities)
              {
                 $timeout(function(){
                        $scope.city1List = cities;
                    },100)
              })
         }
         else{
            //console.log('State:   '+JSON.stringify($scope.myForm.state))
              var url="http://battuta.medunes.net/api/city/"+$scope.country2Code+"/search/?region="+$scope.myForm.state+"&key="+BATTUTA_KEY+"&callback=?";
              $.getJSON(url,function(cities)
              {
                 $timeout(function(){
                        $scope.city2List = cities;
                    },100)
              })
         }
     
    }
   
   //-------------------------------END OF SELECT CASCADING-------------------------//



    // ******************DashBoard Filters *********************

    $scope.newdashBordFilter = function(type){
        //console.log("country---"+$scope.dashBordFilter.country)
        if($scope.dashBordFilter.country == 'undefined' || $scope.dashBordFilter.country == null || $scope.dashBordFilter.country == '' ){
                $scope.dashBordFilter.country = ''

        }
        if($scope.dashBordFilter.state == 'undefined' || $scope.dashBordFilter.state == null || $scope.dashBordFilter.state == '' ){
                $scope.dashBordFilter.state = ''

        }
        if($scope.dashBordFilter.city == 'undefined' || $scope.dashBordFilter.city == null || $scope.dashBordFilter.city == '' ){
                $scope.dashBordFilter.city = ''

        }
         if($scope.myForm.country== 'undefined' || $scope.myForm.country== null || $scope.myForm.country== '' ){
                $scope.myForm.country= ''

        }
        if($scope.myForm.state == 'undefined' || $scope.myForm.state == null || $scope.myForm.state == '' ){
                $scope.myForm.state = ''

        }
        if($scope.myForm.city == 'undefined' || $scope.myForm.city == null ||$scope.myForm.city == '' ){
                $scope.myForm.city = ''

        }
                //console.log(JSON.stringify(type));
                var data = {};

                switch (type)
                        {
                            case 'dollars':
                            $scope.dollars =[];
                             // alert("1");
                             data = {
                                        paymentCardType:"soldUpgradeCards",
                                        joinTo:new Date($scope.dashBordFilter.dobTo).getTime(),
                                        joinFrom:new Date($scope.dashBordFilter.dobFrom).getTime(),
                                        country:$scope.dashBordFilter.country,
                                        state:$scope.dashBordFilter.state,
                                        city: $scope.dashBordFilter.city,
                                        cardType:$scope.dashBordFilter.dollarCardType

                                     } 
                                     //console.log(JSON.stringify(data))
                                userService.filterDollars(data).success(function(res){
                                    console.log("hello"+JSON.stringify(res))
                                    if(res.responseCode == 400){
                                        $scope.dollars =[];
                                    }
                                    else if(res.responseCode == 200){
                                        $scope.dollars = res.result;
                                        console.log("ressssssss1"+JSON.stringify($scope.dollars));
                                    }
                                    
                                })
                                
                            break;

                            case 'brolix': 
                            $scope.brolix =[];
                            // alert("2");
                            data = {
                                        paymentCardType:"soldLuckCard",
                                        joinTo:new Date($scope.dashBordFilter.dobTo).getTime(),
                                        joinFrom:new Date($scope.dashBordFilter.dobFrom).getTime(),
                                        country:$scope.dashBordFilter.country,
                                        state:$scope.dashBordFilter.state,
                                        city: $scope.dashBordFilter.city,
                                        cardType:$scope.dashBordFilter.brolixCardType
                                     }
                                     //console.log("brolix"+JSON.stringify(data))
                                userService.filterBrolix(data).success(function(res){
                                    //console.log("hello"+JSON.stringify(res))
                                    if(res.responseCode == 400){
                                        $scope.brolix =[];
                                    }
                                    else if(res.responseCode == 200){
                                        $scope.brolix = res.result;
                                        //console.log("ressssssss2"+JSON.stringify($scope.brolix));
                                    }
                                    
                                })
                                
                            break;

                            case 'dollarsCashGift': 
                            $scope.dollarsCashGift=[];
                            // alert("3");
                            data = {
                                        paymentCardType:"cashGifts",
                                        joinTo:new Date($scope.myForm.dateTo).getTime(),
                                        joinFrom:new Date($scope.myForm.dateFrom).getTime(),
                                        country:$scope.myForm.country,
                                        state:$scope.myForm.state,
                                        city: $scope.myForm.city,
                                        cashStatus:$scope.myForm.cashStatus
                                     }
                                     //console.log("dollarsCashGift"+JSON.stringify(data))
                                userService.filterDollars(data).success(function(res){
                                    //console.log("hello"+JSON.stringify(res))
                                    if(res.responseCode == 400){
                                        $scope.dollarsCashGift = [];
                                    }
                                    else if(res.responseCode == 200){
                                       $scope.dollarsCashGift = res.result;
                                        console.log("ressssssss3"+JSON.stringify($scope.dollarsCashGift));
                                    }
                                   
                                })
                                
                            break;

                            case 'brolixCoupon': 
                            $scope.brolixCoupon =[];
                            //console.log("4");
                            data = {
                                        paymentCardType:"soldCoupon",
                                        joinTo:new Date($scope.myForm.dateTo).getTime(),
                                        joinFrom:new Date($scope.myForm.dateFrom).getTime(),
                                        country:$scope.myForm.country,
                                        state:$scope.myForm.state,
                                        city: $scope.myForm.city,
                                        couponStatus:$scope.myForm.couponStatus
                                     }
                                    //console.log("brolixCoupon"+JSON.stringify(data)) 
                                userService.filterBrolix(data).success(function(res){
                                    //console.log("hello"+JSON.stringify(res))
                                     if(res.responseCode == 400){
                                        $scope.brolixCoupon  = [];
                                    }
                                    else if(res.responseCode == 200){
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

})
app.filter("manageFilter",function() {
    return function(items,nameValue){
        // console.log(JSON.stringify(items))
      if (!nameValue) {
        return retArray = items;
        }
        var retArray = [];
          for(var i=0;i<items.length;i++) 
            {
                if(items[i].firstName || items[i].lastName) {
                   if (items[i].firstName.toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() || items[i].lastName.toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase()  ) {
                       retArray.push(items[i]);
                   }
               }
           }
          return retArray
       } 
});

app.filter("managePaymentFilter",function() {
      return function(items,nameValue){
        // console.log(JSON.stringify(items))

      if (!nameValue) {
        return retArray = items;
        }
        var retArray = [];
          for(var i=0;i<items.length;i++) 
             { //items[i].cashPrize.pageId.firstName ||
                if(items[i].firstName || items[i].lastName || items[i].cashPrize.pageId.pageName) {
                    // items[i].cashPrize.pageId.userId.firstName.toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() || items[i].lastName.toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() ||
                   if (items[i].firstName.toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() || items[i].lastName.toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() || items[i].cashPrize.pageId.pageName.toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() ) {
                       retArray.push(items[i]);
                   }
                }
          }
          return retArray
        } 
});
app.filter("managePaymentSoldCouponFilter",function() {
      return function(items,nameValue){
        // console.log(JSON.stringify(items))

      if (!nameValue) {
        return retArray = items;
        }
        var retArray = [];
          for(var i=0;i<items.length;i++) 
             {//||  items[i].coupon.pageId.pageName || items[i].coupon.pageId.userId.firstName || items[i].coupon.pageId.userId.lastName
                console.log(JSON.stringify(items[i].coupon));
                if(items[i].firstName || items[i].lastName )
                {
                    //||items[i].coupon.pageId.userId.firstName.toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() || items[i].coupon.pageId.userId.lastName.toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() || items[i].coupon.pageId.pageName.toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase()
                   if (items[i].firstName.toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() || items[i].lastName.toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() ) {
                       retArray.push(items[i]);
                   }
               }
          }
          return retArray
        } 
});