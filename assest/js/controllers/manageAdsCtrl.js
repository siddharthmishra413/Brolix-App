app.controller('manageAdsCtrl', function ($scope,$window,userService, $timeout,toastr) {
$(window).scrollTop(0,0);
 $scope.$emit('headerStatus', 'Manage Ads');
 $scope.$emit('SideMenu', 'Manage Ads');
 $scope.tab = 'totalads';
$scope.dashBordFilter = {};
 $scope.sendMessage = {};
 $scope.myForm = {};

  $scope.sendMessagePage = function (modal) {
        $scope.modalId = modal;
        $scope.modelData = modal;
      $("#sendMessageModelAllUser").modal('show');
 }

  $scope.showPageDetails = function(id){
        console.log("id---------"+id);
        userService.pageInfo(id).success(function(res) {
             console.log("Show(res.result)",JSON.stringify(res.result))
           $scope.allpageInfo = res.result;
            $("#pageDetails").modal('show');
          console.log("$scope.allpageInfo",JSON.stringify($scope.allpageInfo))
             //console.log("$scope.allpageInfo",JSON.stringify(res))
            //    console.log("$scope.allpageInfo",JSON.stringify(res.result))
        })
    }
     $scope.adInfo=function(id){
        console.log("adInfoId>>>"+JSON.stringify(id))
        userService.adInfo($scope.myForm.checkId).then(function(success) { 
            //console.log(JSON.stringify($scope.userDetail))
                    $scope.userDetail=success.data.result;
                    $("#adInfo").modal('show');
                    console.log("adInfo>>>>>>>>>>>>>"+JSON.stringify(success))
                },function(err){
                    console.log(err);
                     toastr.error('Connection error.');
            }) 
    }

         $scope.reportOnAd=function(id){
        console.log("reportOnAdId>>>"+JSON.stringify(id))
        userService.showReportOnAd($scope.myForm.checkId).then(function(success) { 
            //console.log(JSON.stringify($scope.userDetail))
                    $scope.userDetail=success.data.result;
                    $("#adReport").modal('show');
                    console.log("reportOnAd>>>>>>>>>>>>>"+JSON.stringify(success))
                },function(err){
                    console.log(err);
                     toastr.error('Connection error.');
            }) 
    }

        $scope.soldCoupon=function(id){
         console.log("soldCouponId>>>"+JSON.stringify(id))
         $("#soldCouponDetails").modal('show');
         userService.soldCoupon(id).then(function(success) {
         //console.log(JSON.stringify($scope.userDetail))
         $scope.brolixCoupon=success.data.result;
        console.log("soldCoupon>>>>>>>>>>>>>"+JSON.stringify(success))
          },function(err){
          console.log(err);
        toastr.error('Connection error.');
           })
    }


/*-------------------------Message send to all contact winners---------------------*/
    
    $scope.send_massage = function(){
         var array =[];
         var data = {};
         switch ($scope.modelData)
            {
                case 'totalads': 
                    for (var i = 0; i < $scope.totalads.length; i++) {
                        array.push($scope.totalads[i]._id)
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

                case 'totalActiveAds': 
                    for (var i = 0; i < $scope.totalActiveAds.length; i++) {
                        array.push($scope.totalActiveAds[i]._id)
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

                case 'totalExpiredAds': 
                    for (var i = 0; i < $scope.totalExpiredAds.length; i++) {
                        array.push($scope.totalExpiredAds[i]._id)
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

                case 'videoAds': 
                    for (var i = 0; i < $scope.videoAds.length; i++) {
                        array.push($scope.videoAds[i]._id)
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


                case 'slideshowAds': 
                    for (var i = 0; i < $scope.slideshowAds.length; i++) {
                        array.push($scope.slideshowAds[i]._id)
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

                case 'adUpgradedByDollor': 
                    for (var i = 0; i < $scope.adUpgradedByDollor.length; i++) {
                        array.push($scope.adUpgradedByDollor[i]._id)
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

                case 'adUpgradedByBrolix': 
                    for (var i = 0; i < $scope.adUpgradedByBrolix.length; i++) {
                        array.push($scope.adUpgradedByBrolix[i]._id)
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

                    case 'showReportedAd': 
                    for (var i = 0; i < $scope.showReportedAd.length; i++) {
                        array.push($scope.showReportedAd[i]._id)
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


                case 'adsWithLinks': 
                    for (var i = 0; i < $scope.adsWithLinks.length; i++) {
                        array.push($scope.adsWithLinks[i]._id)
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
        //console.log('Country:   '+JSON.stringify($scope.dashBordFilter.country))
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

 $scope.export = function(){
        html2canvas(document.getElementById('manageAdsTable'), {
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

userService.totalAds().success(function(res) {
        if(res.responseCode == 409){
            $state.go('login')
        }else {
            $scope.totalAds = res.result;
            $scope.totalAdscount = res.count;
            console.log(JSON.stringify(res))
        }
    }).error(function(status, data) {

})


userService.totalActiveAds().success(function(res) {
        if(res.responseCode == 409){
            $state.go('login')
        }else {
            $scope.totalActiveAds = res.result;
            $scope.totalActiveAdscount = res.count;
            // console.log("jjjjjjj",JSON.stringify(res))
        }
    }).error(function(status, data) {

}) 

userService.totalExpiredAds().success(function(res) {
        if(res.responseCode == 409){
            $state.go('login')
        }else {
            $scope.totalExpiredAds = res.result;
            $scope.totalExpiredAdscount = res.count;
            //console.log(JSON.stringify($scope.totalExpiredAds))
        }
    }).error(function(status, data) {

})

userService.videoAds().success(function(res) {
        if(res.responseCode == 409){
            $state.go('login')
        }else {
            $scope.videoAds = res.result;
            $scope.videoAdscount = res.count;
            // console.log("aaa",JSON.stringify(res.result))
        }
    }).error(function(status, data) {

})

userService.slideshowAds().success(function(res) {
        if(res.responseCode == 409){
            $state.go('login')
        }else {
            $scope.slideshowAds = res.result;
            $scope.slideshowAdscount = res.count;
            // console.log("bbb",JSON.stringify(res.result))
        }
    }).error(function(status, data) {

}) 

userService.adUpgradedByDollor().success(function(res) {
        if(res.responseCode == 409){
            $state.go('login')
        }else {
            $scope.adUpgradedByDollor = res.result;
            $scope.adUpgradedByDollorcount = res.count;
            // console.log("bbb",JSON.stringify(res))
        }
    }).error(function(status, data) {

})  

userService.adUpgradedByBrolix().success(function(res) {
        if(res.responseCode == 409){
            $state.go('login')
        }else {
            $scope.adUpgradedByBrolix = res.result;
            $scope.adUpgradedByBrolixcount = res.count;
            // console.log("bbb",JSON.stringify(res))
        }
    }).error(function(status, data) {

}) 

userService.showReportedAd().success(function(res) {
        if(res.responseCode == 409){
            $state.go('login')
        }else {
            $scope.showReportedAd = res.result;
            $scope.showReportedAdcount = res.count;
             //console.log("showReportedAd",JSON.stringify(res))
        }
    }).error(function(status, data) {

})    

userService.adsWithLinks().success(function(res) {
        if(res.responseCode == 409){
            $state.go('login')
        }else {
            $scope.adsWithLinks = res.result;
            $scope.adsWithLinkscount = res.count;
             //console.log("Ads",JSON.stringify(res))
        }
    }).error(function(status, data) {
}) 

userService.topFiftyAds().success(function(res) {
        if(res.responseCode == 409){
            $state.go('login')
        }else {
            $scope.topFiftyAds = res.result;
            $scope.topFiftyAdscount = res.count;
            // console.log("Ads",JSON.stringify(res))
        }
    }).error(function(status, data) {
}) 



// $scope.dashBordFilter = function(){

//     var type = localStorage.getItem('userTypeName');
//     $scope.dobTo =$scope.dashBordFilter.dobTo==undefined?undefined : new Date().getTime($scope.dashBordFilter.dobTo);
//     $scope.dobFrom =$scope.dashBordFilter.dobFrom==undefined?undefined : new Date().getTime($scope.dashBordFilter.dobFrom);
//     $scope.country =$scope.dashBordFilter.country==undefined?undefined : $scope.dashBordFilter.country.name;
//     console.log("date",$scope.dashBordFilter.country);
//     var data = {};
//         data = {
//             userType:localStorage.getItem('userTypeName'),
//             country:$scope.dashBordFilter.country,
//             state:$scope.dashBordFilter.state,
//             city:$scope.dashBordFilter.city,
//             joinTo:$scope.dobTo,
//             joinFrom:$scope.dobFrom,
//         }
//         console.log("datatata",data)
//     }
    
    
// })

 $scope.adsTypeName = function(val) {
        //$state.reload();
        localStorage.setItem('adsTypeName',val);
    } 
    
$scope.dashBordFilter = function(){

    var type = localStorage.getItem('adsTypeName');
    $scope.dobTo =$scope.dashBordFilter.dobTo==undefined?undefined : new Date().getTime($scope.dashBordFilter.dobTo);
    $scope.dobFrom =$scope.dashBordFilter.dobFrom==undefined?undefined : new Date().getTime($scope.dashBordFilter.dobFrom);
    $scope.country =$scope.dashBordFilter.country==undefined?undefined : $scope.dashBordFilter.country.name;
    //console.log("date",$scope.dashBordFilter.country);
    var data = {};
        data = {
            adsType:localStorage.getItem('adsTypeName'),
            country:$scope.dashBordFilter.country,
            state:$scope.dashBordFilter.state,
            city:$scope.dashBordFilter.city,
            joinTo:$scope.dobTo,
            joinFrom:$scope.dobFrom,
        }
        console.log("datatata",data)
         switch (type)
            {
                case 'totalAds':
                console.log("1"); 
                    userService.adsfilter(data).success(function(res){
                        $scope.totalAds = res.data;
                        console.log("ressssssss1",JSON.stringify($scope.totalAds));
                    })
                    
                break;

                case 'totalActiveAds': 
                console.log("2");
                    userService.adsfilter(data).success(function(res){
                        $scope.totalActiveAds = res.data;
                        console.log("ressssssss2",JSON.stringify($scope.totalActiveAds));
                    })
                    
                break;

                case 'totalExpiredAds': 
                console.log("3");
                    userService.adsfilter(data).success(function(res){
                        $scope.totalExpiredAds = res.data;
                        console.log("ressssssss3",JSON.stringify($scope.totalExpiredAds));
                    })
                    
                break;

                case 'showReportedAd': 
                console.log("4");
                    userService.adsfilter(data).success(function(res){
                        $scope.showReportedAd = res.data;
                        console.log("ressssssss4",JSON.stringify($scope.showReportedAd));
                    })
                    
                break;

                case 'adsWithLinks': 
                console.log("5");
                    userService.adsfilter(data).success(function(res){
                        $scope.adsWithLinks = res.data;
                        console.log("ressssssss5",JSON.stringify($scope.adsWithLinks));
                    })
                    
                break;

                case 'videoAds':
                console.log("6"); 
                    userService.adsfilter(data).success(function(res){
                        $scope.videoAds = res.data;
                        console.log("ressssssss6",JSON.stringify($scope.videoAds));
                    })
                    
                break;

                case 'slideshowAds': 
                console.log("7");
                    userService.adsfilter(data).success(function(res){
                        $scope.slideshowAds = res.data;
                        console.log("ressssssss7",JSON.stringify($scope.slideshowAds));
                    })
                    
                break;

                case 'adUpgradedByDollor': 
                console.log("8");
                    userService.adsfilter(data).success(function(res){
                        $scope.adUpgradedByDollor = res.data;
                        console.log("ressssssss8",JSON.stringify($scope.adUpgradedByDollor));
                    })
                    
                break;

                case 'adUpgradedByBrolix': 
                console.log("8");
                    userService.adsfilter(data).success(function(res){
                        $scope.adUpgradedByBrolix = res.data;
                        console.log("ressssssss8",JSON.stringify($scope.adUpgradedByBrolix));
                    })
                    
                break;

                case 'topFiftyAds': 
                console.log("8");
                    userService.adsfilter(data).success(function(res){
                        $scope.topFiftyAds = res.data;
                        console.log("ressssssss8",JSON.stringify($scope.topFiftyAds));
                    })
                    
                break;
                
                default: 
                toastr.error("somthing wents to wroung");
            }

    }
})

app.filter("manageAdsFilter",function() {
   return function(items,nameValue){
   //console.log(JSON.stringify(nameValue))
   //console.log(JSON.stringify(items))
     if (!nameValue) {
       return retArray = items;
       }
       var retArray = [];
         for(var i=0;i<items.length;i++) 
              {
                  if(items[i].pageName){
                    if (items[i].pageName.toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() ) {
                        retArray.push(items[i]);
                    }
                  }
         }
         return retArray
      } 
});