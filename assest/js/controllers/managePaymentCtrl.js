app.controller('managePaymentCtrl', function ($scope,$window,userService,$timeout,$http,toastr,$state) {
$(window).scrollTop(0,0);
    $scope.$emit('headerStatus', 'Manage Payment');
    $scope.$emit('SideMenu', 'Manage Payment');
    $scope.tab = 'totalUsers';
    $scope.flag=0;
	$scope.type='dollars';
	$scope.clr="#00B288";
    $scope.clr1=""

    //******************** dollars data **********************
   
    userService.SoldUpgradeCard().then(function(success) {       
	            $scope.dollars=[];
	            console.log("UpgradeCard>>>>>>>>"+JSON.stringify(success.data.result));
	            for(i=0;i<success.data.result.length;i++) {
                            $scope.dollars.push(success.data.result[i]);
                            console.log("dollars>>>>>>>>>"+JSON.stringify($scope.dollars))
                        }
        		},function(err){
			        console.log(err);
			         toastr.error('Connection error.');
	})
	userService.cashGift().then(function(success) {       
	            console.log("cashGift--->>>"+JSON.stringify(success))
	            $scope.count=success.data.count;
	            $scope.dollarsCashGift=[];
	            for(i=0;i<success.data.result.length;i++) {
                            $scope.dollarsCashGift.push(success.data.result[i]);
                            console.log("dollarsCashGift>>>>>>>>>"+JSON.stringify($scope.dollarsCashGift[i].cashPrize.pageId._id))
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
        	$scope.clr=""
        	userService.SoldLuckCard().then(function(success) {       
	            console.log(JSON.stringify(success))
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
	            console.log("sold Coupon >>>>>>"+JSON.stringify(success))
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
	           console.log("Cash Giftttt--->>>"+JSON.stringify(success))
	            $scope.count=success.data.count;
	            $scope.dollarsCashGift=[];
	            for(i=0;i<success.data.result.length;i++) {
                            $scope.dollarsCashGift.push(success.data.result[i]);
                            console.log(JSON.stringify($scope.dollarsCashGift[i].cashPrize.pageId.pageName))
                        }
        		},function(err){
			        console.log(err);
			         toastr.error('Connection error.');
		     })

	}

	//********************** User Info (click on Name) ********************

	$scope.userInfo=function(id){
		console.log(JSON.stringify(id))
		$("#userInfo").modal('show');
		userService.userInfo(id).then(function(success) { 
			//console.log(JSON.stringify($scope.userDetail))
					$scope.userDetail=success.data.result
					console.log(JSON.stringify($scope.userDetail))
        		},function(err){
			        console.log(err);
			         toastr.error('Connection error.');
		    }) 
	}

	//********************* CashGift, Sold Coupon and Ad ****************

	$scope.adInfo=function(id){
		console.log("adInfoId>>>"+JSON.stringify(id))
		$("#adInfo").modal('show');
		userService.adInfo(id).then(function(success) { 
			//console.log(JSON.stringify($scope.userDetail))
					$scope.userDetail=success.data.result;
					console.log("adInfo>>>>>>>>>>>>>"+JSON.stringify(success))
        		},function(err){
			        console.log(err);
			         toastr.error('Connection error.');
		    }) 
	}

	//******************** top 50 Buyers *********************

	$scope.top_50_dollarsBuyers=function(){
			$("#top_50_buyers").modal('show');
			userService.top_50_dollarsBuyers().then(function(success) { 
					$scope.userDetail=success.data.result;
					console.log(JSON.stringify(success.data.result))
        		},function(err){
			        console.log(err);
			         toastr.error('Connection error.');
		    })
	}
	$scope.top_50_brolixBuyers=function(){
			$("#top_50_buyers").modal('show');
			userService.top_50_brolixBuyers().then(function(success) { 
					$scope.userDetail=success.data.result;
					console.log(JSON.stringify(success.data.result))
        		},function(err){
			        console.log(err);
			         toastr.error('Connection error.');
		    })
	}

	//*******************Total Price****************
	 userService.totalDollarsPrice().then(function(res) {
    	console.log(JSON.stringify(res))
        if (res.data.responseCode == 200){
            $scope.totalDollarsPrice = res.data.totalCash;
           //console.log("totalIncomeInCashFromUpgradeCard",JSON.stringify($scope.totalSoldLuckCardcount));
        } else {
            toastr.error(res.responseMessage);
        }
        
    })
    userService.totalBrolixPrice().then(function(res) {
    	console.log(JSON.stringify(res))
        if (res.data.responseCode == 200){
            $scope.totalBrolixPrice = res.data.totalBrolix;
           //console.log("totalIncomeInCashFromUpgradeCard",JSON.stringify($scope.totalSoldLuckCardcount));
        } else {
            toastr.error(res.responseMessage);
        }
        
    })

	//************************Top 50 Ads ***********************

	$scope.top_50_Ads=function(){
		$("#top_50_Ads").modal('show');
			userService.top_50_Ads().then(function(success) { 
					$scope.adsDetail=success.data.result;
					console.log("top 50 Ads>>>>>>>>>>>>"+JSON.stringify(success))
        		},function(err){
			        console.log(err);
			         toastr.error('Connection error.');
		    })
	}


	//********************** page Name *************************

	$scope.pageInfo=function(id){
		$("#pageInfo").modal('show');
		userService.pageInfo(id).then(function(success) { 
					$scope.pageDetail=success.data.result
					console.log(JSON.stringify($scope.pageDetail))
        		},function(err){
			        console.log(err);
			         toastr.error('Connection error.');
		    }) 
	}


	//*********************** Used Ad **************************

	$scope.upgradeCardUsedAd=function(id){
		//console.log(JSON.stringify(id))
		$("#luckCardUsedAd").modal('show');
		var data = {
					"upgradeId":id
					}
		//console.log(JSON.stringify(data))
		userService.upgradeCardUsedAd(data).then(function(success) { 
					$scope.usedAd=success.data.result;
					//$scope.img=$scope.usedAd.coverImage;
					console.log("dadaddadadaa",JSON.stringify(success))
        		},function(err){
			        //console.log(err);
			         toastr.error('Connection error.');
		    }) 
	}
	$scope.luckCardUsedAd=function(id){
		//console.log(JSON.stringify(id))
		$("#luckCardUsedAd").modal('show');
		var data = {
					"luckId":id
     			}
		//console.log(JSON.stringify(data))
		userService.luckCardUsedAd(data).then(function(success) { 
					$scope.usedAd=success.data.result;
					$scope.img=$scope.usedAd[0].coverImage;
					//console.log(JSON.stringify($scope.usedAd))
        		},function(err){
			        //console.log(err);
			         toastr.error('Connection error.');
		    }) 
	}


	//*********************** Payment History **************************

	$scope.upgradePayment=function(id){
			userService.upgradeCardPayment(id).then(function(success) {
				$scope.upgradeUsedAd=[];
				$scope.upgradeCardObject =[];
					$("#upgradePayment").modal('show'); 
					//console.log(JSON.stringify(success.data.result))
					for(i=0;i<success.data.result.length;i++) {
							for(j=0;j<success.data.result[i].UpgradeUsedAd.length;j++){
								 $scope.upgradeUsedAd.push(success.data.result[i].upgradeUsedAd[j].adId);
								 //console.log(JSON.stringify($scope.upgradeUsedAd))
							}
                        	for(k=0;k<success.data.result[i].upgradeCardObject.length;k++){
                        		$scope.upgradeCardObject.push(success.data.result[i].upgradeCardObject[k]);
                        		//console.log(JSON.stringify($scope.upgradeCardObject))
                        	}
                            
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
					//console.log(JSON.stringify(success.data.result))
					for(i=0;i<success.data.result.length;i++) {
							for(j=0;j<success.data.result[i].luckUsedAd.length;j++){
								 $scope.luckUsedAd.push(success.data.result[i].luckUsedAd[j].adId);
								 //console.log(JSON.stringify($scope.luckUsedAd))
							}
                        	for(k=0;k<success.data.result[i].luckCardObject.length;k++){
                        		$scope.luckCardObject.push(success.data.result[i].luckCardObject[k]);
                        		//console.log(JSON.stringify($scope.luckCardObject))
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
        $("#Pages").modal('show');
        userService.pageCount(id).then(function(success) { 
                    for(i=0;i<success.data.result.length;i++){
                        $scope.page.push(success.data.result[0]);
                    }
                     //console.log("pages>>>>>>"+JSON.stringify($scope.page))
                },function(err){
                    //console.log(err);
                     toastr.error('Connection error.');
            }) 
    }

    //************************** Contact Buyers and Winners ******************

    $scope.total_user_message = function (modal) {
        //console.log("Contact Modal >>>>>>>>>>"+JSON.stringify(modal))
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
        console.log('Country:   '+JSON.stringify($scope.dashBordFilter.country))
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
        console.log('State:   '+JSON.stringify($scope.dashBordFilter.state))
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
    //  console.log('City:   '+JSON.stringify($scope.dashBordFilter.city))
   
   //-------------------------------END OF SELECT CASCADING-------------------------//



	// ******************DashBoard Filters *********************

	$scope.dashBordFilter = function(){

			    var type = localStorage.getItem('userTypeName');
			    $scope.dobTo =$scope.dashBordFilter.dobTo==undefined?undefined : new Date().getTime($scope.dashBordFilter.dobTo);
			    $scope.dobFrom =$scope.dashBordFilter.dobFrom==undefined?undefined : new Date().getTime($scope.dashBordFilter.dobFrom);
			    $scope.country =$scope.dashBordFilter.country==undefined?undefined : $scope.dashBordFilter.country.name;
			    console.log("date",$scope.dashBordFilter.country);
			    var data = {};
			        data = {
			            userType:localStorage.getItem('userTypeName'),
			            country:$scope.country,
			            state:$scope.dashBordFilter.state,
			            city:$scope.dashBordFilter.cities,
			            gender:$scope.dashBordFilter.gender,
			            ageTo:$scope.dashBordFilter.ageTo,
			            ageFrom:$scope.dashBordFilter.ageFrom,
			            joinTo:$scope.dobTo,
			            joinFrom:$scope.dobFrom,
			        }
			        console.log("datatata",data)

			    switch (type)
			            {
			                case 'totalUsers':
			                console.log("1"); 
			                    userService.userfilter(data).success(function(res){
			                        $scope.totalUser = res.data;
			                        console.log("ressssssss1",JSON.stringify($scope.totalUser));
			                    })
			                    
			                break;

			                case 'personalUsers': 
			                console.log("2");
			                    userService.userfilter(data).success(function(res){
			                        $scope.personalUser = res.data;
			                        console.log("ressssssss2",JSON.stringify($scope.personalUser));
			                    })
			                    
			                break;

			                case 'businessUsers': 
			                console.log("3");
			                    userService.userfilter(data).success(function(res){
			                        $scope.businessUser = res.data;
			                        console.log("ressssssss3",JSON.stringify($scope.businessUser));
			                    })
			                    
			                break;

			                case 'liveUsers': 
			                console.log("4");
			                    userService.userfilter(data).success(function(res){
			                        $scope.liveUser = res.data;
			                        console.log("ressssssss4",JSON.stringify($scope.liveUser));
			                    })
			                    
			                break;

			                case 'totalWinners': 
			                console.log("5");
			                    userService.userfilter(data).success(function(res){
			                        $scope.totalWinners = res.data;
			                        console.log("ressssssss5",JSON.stringify($scope.totalWinners));
			                    })
			                    
			                break;

			                case 'cashWinners':
			                console.log("6"); 
			                    userService.userfilter(data).success(function(res){
			                        $scope.cashWinners = res.data;
			                        console.log("ressssssss6",JSON.stringify($scope.cashWinners));
			                    })
			                    
			                break;

			                case 'couponWinners': 
			                console.log("7");
			                    userService.userfilter(data).success(function(res){
			                        $scope.couponWinners = res.data;
			                        console.log("ressssssss7",JSON.stringify($scope.couponWinners));
			                    })
			                    
			                break;

			                case 'blockedUsers': 
			                console.log("8");
			                    userService.userfilter(data).success(function(res){
			                        $scope.blockedUsers = res.data;
			                        console.log("ressssssss8",JSON.stringify($scope.blockedUsers));
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
// *************************** DashBoard Filters ********************************

app.filter("paymentFilter",function() {
    return function(items,nameValue){
    	// console.log(JSON.stringify(items));
    	//var data=items;
    	var arr=[];
    	//console.log(JSON.stringify(nameValue.dollarCardType))
    	// if(nameValue.dollarCardType== undefined || nameValue.dollarCardType == "" ){
		   //  return items;
		   // }
		 if( nameValue.country== undefined || nameValue.country == ""){
		 	return items;
		 }
		   if(nameValue.country!="" && nameValue.country!=undefined){
			   	console.log(JSON.stringify(items.length))
			   	
			    	arr= items.filter(function(){
			    		for(i=0;i< items.length; i++){
			    		console.log(JSON.stringify(nameValue.country))
			    		return items[i].country==nameValue.country;
			    		 }
			    	})
			       // console.log(JSON.stringify(arr))
			    
		   }
			if(nameValue.state!="" && nameValue.state!=undefined){
			   	console.log(JSON.stringify(items.length))
			   	
			    	arr= items.filter(function(){
			    		for(i=0;i< items.length; i++){
			    		console.log(JSON.stringify(nameValue.state))
			    		return items[i].state==nameValue.state; }
			    	})
			       // console.log(JSON.stringify(arr))
			    
		   }
		   	if(nameValue.city!="" && nameValue.city!=undefined){
		   		console.log(JSON.stringify(items.length))
		   			// console.log(JSON.stringify(items[i].city))
			      	console.log(JSON.stringify(nameValue.city))
			      arr= items.filter(function(){
				      	for(i=0;i< items.length; i++){
				      		console.log(JSON.stringify(items[i].city))
				         return items[i].city == nameValue.city;
				     	}
			       }) 
			      console.log(JSON.stringify(arr))
			  
			  
		    }
		 console.log("INPUT VALUE" + JSON.stringify(nameValue.dollarCardType))
		    if(nameValue.dollarCardType!="" && nameValue.dollarCardType!=undefined){
		    	console.log(JSON.stringify(items.length))
			    	arr= items.filter(function(){
			    		for(i=0;i< items.length; i++){
			    			console.log(JSON.stringify(items[i].upgradeCardObject.viewers))
				         	return items[i].upgradeCardObject.viewers.toString()==nameValue.dollarCardType;
				         }
			       })
			    	console.log(JSON.stringify(arr))
		    }
           return arr;
        } 
});
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