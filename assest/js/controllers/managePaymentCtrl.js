app.controller('managePaymentCtrl', function ($scope,$window,userService,$timeout,$http,toastr,$state) {
$(window).scrollTop(0,0);
    $scope.$emit('headerStatus', 'Manage Payment');
    $scope.$emit('SideMenu', 'Manage Payment');
    $scope.tab = 'totalUsers';
    $scope.flag=0;
    $scope.type='dollars';
    $scope.clr="#00B288";
    $scope.clr1=""
    $scope.myFrom={};
    $scope.dashBordFilter={};

    //******************** dollars data **********************
   
    userService.SoldUpgradeCard().then(function(success) {       
                $scope.dollars=[];
                // console.log("UpgradeCard>>>>>>>>"+JSON.stringify(success.data.result));
                for(i=0;i<success.data.result.length;i++) {
                            $scope.dollars.push(success.data.result[i]);
                            // console.log("dollars>>>>>>>>>"+JSON.stringify($scope.dollars))
                        }
                },function(err){
                    console.log(err);
                     toastr.error('Connection error.');
    })
    userService.cashGift().then(function(success) {       
                // console.log("cashGift--->>>"+JSON.stringify(success))
                $scope.count=success.data.count;
                $scope.dollarsCashGift=[];
                for(i=0;i<success.data.result.length;i++) {
                            $scope.dollarsCashGift.push(success.data.result[i]);
                            // console.log("dollarsCashGift>>>>>>>>>"+JSON.stringify($scope.dollarsCashGift[i].cashPrize.pageId._id))
                        }
                },function(err){
                    console.log(err);
                     toastr.error('Connection error.');
             })

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
            
            $scope.myFrom.country="";
            $scope.myFrom.state="";
            $scope.myFrom.city="";
            $scope.clr=""
            userService.SoldLuckCard().then(function(success) {       
                // console.log(JSON.stringify(success))
                $scope.brolix=[];
                for(i=0;i<success.data.result.length;i++) {
                            $scope.brolix.push(success.data.result[i]);
                            console.log(JSON.stringify($scope.brolix[i].luckCardObject.status));
                            if($scope.brolix[i].luckCardObject.status == "INACTIVE"){
                                $scope.brolix[i].luckCardObject.status="Unused";
                            }
                            else{
                                $scope.brolix[i].luckCardObject.status="Used";
                            }
                        }

                },function(err){
                    console.log(err);
                     toastr.error('Connection error.');
             })
            userService.soldCoupons().then(function(success) {       
                // console.log("sold Coupon >>>>>>"+JSON.stringify(success))
                $scope.SoldCouponsCount=success.data.count;
                   $scope.brolixCoupon=[];
                   for(i=0;i<success.data.result.length;i++)  {
                    $scope.brolixCoupon.push(success.data.result[i]);
                   }
                },function(err){
                    console.log(err);
                     toastr.error('Connection error.');
             })
        }  
        //****************** dollars Data *********************

        else if($scope.string == 'dollars'){
            $scope.dashBordFilter.country="";
            $scope.dashBordFilter.state="";
            $scope.dashBordFilter.city="";
            $scope.myFrom.country="";
            $scope.myFrom.state="";
            $scope.myFrom.city="";
            $scope.flag= 0;
            $scope.clr="#00B288";
            $scope.clr1="";
            userService.SoldUpgradeCard().then(function(success) {      
                $scope.dollars=[];
                for(i=0;i<success.data.result.length;i++) {
                            $scope.dollars.push(success.data.result[i]);
                        }
                },function(err){
                    console.log(err);
                     toastr.error('Connection error.');
            })
        } 
        userService.cashGift().then(function(success) {       
               // console.log("Cash Giftttt--->>>"+JSON.stringify(success))
                $scope.count=success.data.count;
                $scope.dollarsCashGift=[];
                for(i=0;i<success.data.result.length;i++) {
                            $scope.dollarsCashGift.push(success.data.result[i]);
                            // console.log(JSON.stringify($scope.dollarsCashGift[i].cashPrize.pageId.pageName))
                        }
                },function(err){
                    console.log(err);
                     toastr.error('Connection error.');
             })

    }

    //********************** User Info (click on Name) ********************

    $scope.userInfo=function(id){
        console.log(JSON.stringify(id))
        
        userService.userInfo(id).then(function(success) { 
            // console.log(JSON.stringify(success))
                    if(success.data.responseCode== 200){
                        //console.log(JSON.stringify($scope.userDetail))
                            $scope.userDetail=success.data.result
                            $("#userInfo").modal('show');
                            // console.log(JSON.stringify($scope.userDetail))
                    }
                    else{
                        toastr.error(success.data.responseMessage);
                    }
            
                },function(err){
                    console.log(err);
                     toastr.error('Connection error.');
            }) 
    }

    //********************* CashGift, Sold Coupon and Ad ****************

    $scope.adInfo=function(id){
        console.log("adInfoId>>>"+JSON.stringify(id))
        userService.adInfo(id).then(function(success) { 
                    if(success.data.responseCode == 200){

                        //console.log(JSON.stringify($scope.userDetail))
                            $scope.userDetail=success.data.result;
                            $("#adInfo").modal('show');
                            // console.log("adInfo>>>>>>>>>>>>>"+JSON.stringify(success))
                    }
                    else{
                        toastr.error(success.data.responseMessage)
                    }
            
                },function(err){
                    console.log(err);
                     toastr.error('Connection error.');
            }) 
    }

    //******************** top 50 Buyers *********************

    $scope.top_50_dollarsBuyers=function(){
            userService.top_50_dollarsBuyers().then(function(success) {
                // console.log(JSON.stringify(success))
                    if(success.data.responseCode == 200){
                        $scope.userDetail=success.data.result;
                            $("#top_50_buyers").modal('show');
                            // console.log(JSON.stringify(success.data.result))
                    } else{
                        toastr.error(success.data.responseMessage);
                    }
                    
                },function(err){
                    console.log(err);
                     toastr.error('Connection error.');
            })
    }
    $scope.top_50_brolixBuyers=function(){
            userService.top_50_brolixBuyers().then(function(success) { 
                    if(success.data.responseCode == 200){
                        $scope.userDetail=success.data.result;
                        $("#top_50_buyers").modal('show');
                        // console.log(JSON.stringify(success.data.result))
                    }else{
                        toastr.error(success.data.responseCode);
                    }
                    
                },function(err){
                    console.log(err);
                     toastr.error('Connection error.');
            })
    }

    //*******************Total Price****************
     userService.totalDollarsPrice().then(function(res) {
        // console.log(JSON.stringify(res))
        if (res.data.responseCode == 200){
            $scope.totalDollarsPrice = res.data.totalCash;
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
            userService.top_50_Ads().then(function(success) {
            // console.log(JSON.stringify(success)) 
                    if(success.data.responseCode == 200){
                        $scope.adsDetail=success.data.result;
                        $("#top_50_Ads").modal('show');
                        // console.log("top 50 Ads>>>>>>>>>>>>"+JSON.stringify(success))
                    }else{
                        toastr.error(success.data.responseCode);
                    }
                    
                },function(err){
                    console.log(err);
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
                    console.log(err);
                     toastr.error('Connection error.');
            }) 
    }


    //*********************** Used Ad **************************

    $scope.upgradeCardUsedAd=function(id){
        console.log(JSON.stringify(id))
        var data = {
                    "upgradeId":id
                    }
        console.log(JSON.stringify(data))
        userService.upgradeCardUsedAd(data).then(function(success) { 
                    if(success.data.responseCode == 200){
                        for(i=0;i<success.data.result.length;i++){
                            $scope.usedAd.push(success.data.result[i]);
                            //$scope.img=$scope.usedAd.coverImage;
                            $("#luckCardUsedAd").modal('show');
                            console.log(JSON.stringify(success))
                        } 
                    }
                    else{
                        toastr.error(success.data.responseMessage);
                    }
                    
                },function(err){
                    console.log(err);
                     toastr.error('Connection error.');
            }) 
    }
    $scope.luckCardUsedAd=function(id){
        console.log(JSON.stringify(id))
        var data = {
                    "luckId":id
                }
        // console.log(JSON.stringify(data))
        userService.luckCardUsedAd(data).then(function(success) { 
                    if(success.data.responseCode == 200){
                            $scope.usedAd=success.data.result;
                            $scope.img=$scope.usedAd[0].coverImage;
                            $("#luckCardUsedAd").modal('show');
                            // console.log(JSON.stringify($scope.usedAd))
                    }else{
                            toastr.error(success.data.responseMessage);
                    }
                    
                },function(err){
                    console.log(err);
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
                    console.log(err);
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
                    console.log(err);
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
        console.log(JSON.stringify(id))
        $scope.page=[];
        userService.pageCount(id).then(function(success) { 
                    if(success.data.responseCode == 200){
                       for(i=0;i<success.data.result.length;i++){
                                $scope.page.push(success.data.result[0]);
                            }
                             // console.log("pages>>>>>>"+JSON.stringify($scope.page))
                             $("#Pages").modal('show'); 
                    }else{
                        toastr.error(success.data.responseMessage)
                    }  
                },function(err){
                    console.log(err);
                     toastr.error('Connection error.');
            }) 
    }

    //************************** Contact Buyers and Winners ******************

    $scope.total_user_message = function (modal) {
        // console.log("Contact Modal >>>>>>>>>>"+JSON.stringify(modal))
        $scope.modalId = modal;
        $scope.modelData = modal;
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
                            toastr.success("Message Send Successfully to All Buyers");
                            $scope.sendMessage = '';
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
                            toastr.success("Message Send Successfully to All Winners");
                            $scope.sendMessage = '';
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
                if($scope.brolixCountryList[i].name==$scope.myFrom.country) {
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
                        console.log("State2 List",JSON.stringify( $scope.state2List))
                  },100)
              });
            }
        }

    $scope.changeState = function(ind){
        if(ind=='1') {
                console.log('State:   '+JSON.stringify($scope.dashBordFilter.state))
              var url="http://battuta.medunes.net/api/city/"+$scope.country1Code+"/search/?region="+$scope.dashBordFilter.state+"&key="+BATTUTA_KEY+"&callback=?";
              $.getJSON(url,function(cities)
              {
                 $timeout(function(){
                        $scope.city1List = cities;
                    },100)
              })
         }
         else{
            console.log('State:   '+JSON.stringify($scope.myForm.state))
              var url="http://battuta.medunes.net/api/city/"+$scope.country2Code+"/search/?region="+$scope.myForm.state+"&key="+BATTUTA_KEY+"&callback=?";
              $.getJSON(url,function(cities)
              {
                 $timeout(function(){
                        $scope.city2List = cities;
                    },100)
              })
         }
     
    }
    //  console.log('City:   '+JSON.stringify($scope.dashBordFilter.city))
   
   //-------------------------------END OF SELECT CASCADING-------------------------//



    // ******************DashBoard Filters *********************

    $scope.newdashBordFilter = function(type){

                // var type = localStorage.getItem('userTypeName');
                // $scope.dobTo =$scope.dashBordFilter.dobTo==undefined?undefined : new Date().getTime($scope.dashBordFilter.dobTo);
                // $scope.dobFrom =$scope.dashBordFilter.dobFrom==undefined?undefined : new Date().getTime($scope.dashBordFilter.dobFrom);
       //          $scope.To =$scope.myForm.toDate==undefined?undefined : new Date().getTime($scope.dashBordFilter.dobTo);
       //          $scope.From =$scope.myForm.fromDate==undefined?undefined : new Date().getTime($scope.dashBordFilter.dobFrom);
                // $scope.country =$scope.dashBordFilter.country==undefined?undefined : $scope.dashBordFilter.country.name;
                console.log(JSON.stringify(type));

                var data = {};

                switch (type)
                        {
                            case 'dollars':
                             console.log("1");
                             data = {
                                        paymentCardType:"soldUpgradeCards",
                                        joinTo:new Date($scope.dashBordFilter.dobTo).getTime(),
                                        joinFrom:new Date($scope.dashBordFilter.dobFrom).getTime(),
                                        country:$scope.dashBordFilter.country,
                                        state:$scope.dashBordFilter.state,
                                        city: $scope.dashBordFilter.city,
                                        cardType:$scope.dashBordFilter.dollarCardType

                                     } 
                                     console.log(JSON.stringify(data))
                                userService.filterDollars(data).success(function(res){
                                    console.log(JSON.stringify(res))
                                    $scope.dollars = res.result;
                                    console.log("ressssssss1",JSON.stringify($scope.dollars));
                                })
                                
                            break;

                            case 'brolix': 
                            console.log("2");
                            data = {
                                        paymentCardType:"soldLuckCard",
                                        joinTo:new Date($scope.dashBordFilter.dobTo).getTime(),
                                        joinFrom:new Date($scope.dashBordFilter.dobFrom).getTime(),
                                        country:$scope.dashBordFilter.country,
                                        state:$scope.dashBordFilter.state,
                                        city: $scope.dashBordFilter.city,
                                        cardType:$scope.dashBordFilter.dollarCardType
                                     }
                                userService.filterBrolix(data).success(function(res){
                                    $scope.brolix = res.result;
                                    console.log("ressssssss2",JSON.stringify($scope.brolix));
                                })
                                
                            break;

                            case 'dollarsCashGift': 
                            console.log("3");
                            data = {
                                        paymentCardType:"cashGifts",
                                        joinTo:new Date($scope.myForm.dateTo).getTime(),
                                        joinFrom:new Date($scope.myForm.dateFrom).getTime(),
                                        country:myFrom.country,
                                        state:myFrom.state,
                                        city: myFrom.city,
                                        cashStatus:myFrom.cashStatus
                                     }
                                userService.filterDollars(data).success(function(res){
                                    $scope.dollarsCashGift = res.result;
                                    console.log("ressssssss3",JSON.stringify($scope.dollarsCashGift));
                                })
                                
                            break;

                            case 'brolixCoupon': 
                            console.log("4");
                            data = {
                                        paymentCardType:"soldCoupon",
                                        joinTo:new Date($scope.myForm.dateTo).getTime(),
                                        joinFrom:new Date($scope.myForm.dateFrom).getTime(),
                                        country:myFrom.country,
                                        state:myFrom.state,
                                        city: myFrom.city,
                                        couponStatus:myFrom.couponStatus
                                     }
                                userService.filterBrolix(data).success(function(res){
                                    $scope.brolixCoupon = res.result;
                                    console.log("ressssssss4",JSON.stringify($scope.brolixCoupon));
                                })
                                
                            break;
                            
                            default: 
                            toastr.error("something went wrong");
                        }

    }


$scope.export = function(){
        html2canvas(document.getElementById('tableData'), {
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
app.filter("manageUsersFilter",function() {
    return function(items,nameValue){
        // console.log(JSON.stringify(items))
      if (!nameValue) {
        return retArray = items;
        }
        var retArray = [];
          for(var i=0;i<items.length;i++) 
               {
               if (items[i].firstName.toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() || items[i].lastName.toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase()  ) {
                   retArray.push(items[i]);
               }
          }
          return retArray
       } 
});

app.filter("managePaymentFilter",function() {
      return function(items,nameValue){
        //console.log(JSON.stringify(items))

      if (!nameValue) {
        return retArray = items;
        }
        var retArray = [];
          for(var i=0;i<items.length;i++) 
             {
                // if(nameValue="")
               if (items[i].firstName.toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() || items[i].lastName.toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() || items[i].cashPrize.pageId.userId.firstName.toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() || items[i].lastName.toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() ||items[i].cashPrize.pageId.pageName.toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() ) {
                   retArray.push(items[i]);
               }
          }
          return retArray
        } 
});
app.filter("managePaymentSoldCouponFilter",function() {
      return function(items,nameValue){
        //console.log(JSON.stringify(items))

      if (!nameValue) {
        return retArray = items;
        }
        var retArray = [];
          for(var i=0;i<items.length;i++) 
             {
                // if(nameValue="")
               if (items[i].firstName.toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() || items[i].lastName.toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() || items[i].coupon.pageId.userId.firstName.toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() || items[i].lastName.toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() ||items[i].coupon.pageId.pageName.toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() ) {
                   retArray.push(items[i]);
               }
          }
          return retArray
        } 
});