app.controller('manageAdsCtrl', function ($scope,$window,userService, $timeout,toastr,$state) {
$(window).scrollTop(0,0);
 $scope.$emit('headerStatus', 'Manage Ads');
 $scope.$emit('SideMenu', 'Manage Ads');
 $scope.tab = 'totalads';
 $scope.dashBordFilter = {};
 $scope.sendMessage = {};
 $scope.myForm={};

localStorage.setItem('adsTypeName','totalAds');





//  $('#manageAdsTable').DataTable();
//       $scope.tab= 'totalads'; 
//      $timeout(function(){
//         $('#manageAdsTable').DataTable();
//          $scope.tab= 'totalads';      
//      },0)

// $scope.dataTableOne = function(type){
//   console.log("type",type)
//   if(type=='totalads'){
//     $('#manageAdsTable').DataTable();
//       $scope.tab= 'totalads'; 
//      $timeout(function(){
//         $('#manageAdsTable').DataTable();
//          $scope.tab= 'totalads';      
//      },100)
//   }else if(type=='activeads'){
//     $('#manageAdsTable').DataTable();
//       $scope.tab= 'activeads'; 
//      $timeout(function(){
//         $('#manageAdsTable').DataTable();
//          $scope.tab= 'activeads';      
//      },100)
//   }else if(type=='expiredAds'){
//     $('#manageAdsTable').DataTable();
//       $scope.tab= 'expiredAds'; 
//      $timeout(function(){
//         $('#manageAdsTable').DataTable();
//          $scope.tab= 'expiredAds';      
//      },100)
//   }else if(type=='showReportedAd'){
//     $('#manageAdsTable').DataTable();
//       $scope.tab= 'showReportedAd'; 
//      $timeout(function(){
//         $('#manageAdsTable').DataTable();
//          $scope.tab= 'showReportedAd';      
//      },100)
//   }else if(type=='adsWithLinks'){
//     $('#manageAdsTable').DataTable();
//       $scope.tab= 'adsWithLinks'; 
//      $timeout(function(){
//         $('#manageAdsTable').DataTable();
//          $scope.tab= 'adsWithLinks';      
//      },100)
//   }else if(type=='videoAds'){
//     $('#manageAdsTable').DataTable();
//       $scope.tab= 'videoAds'; 
//      $timeout(function(){
//         $('#manageAdsTable').DataTable();
//          $scope.tab= 'videoAds';      
//      },100)
//   }
//   else if(type=='slideShowAds'){
//     $('#manageAdsTable').DataTable();
//       $scope.tab= 'slideShowAds'; 
//      $timeout(function(){
//         $('#manageAdsTable').DataTable();
//          $scope.tab= 'slideShowAds';      
//      },100)
//   }
//   else if(type=='adUpgradedByDollor'){
//     $('#manageAdsTable').DataTable();
//       $scope.tab= 'adUpgradedByDollor'; 
//      $timeout(function(){
//         $('#manageAdsTable').DataTable();
//          $scope.tab= 'adUpgradedByDollor';      
//      },100)
//   }
//   else if(type=='adUpgradedByBrolix'){
//     $('#manageAdsTable').DataTable();
//       $scope.tab= 'adUpgradedByBrolix'; 
//      $timeout(function(){
//         $('#manageAdsTable').DataTable();
//          $scope.tab= 'adUpgradedByBrolix';      
//      },100)
//   }
//   else if(type=='topFiftyAds'){
//     $('#manageAdsTable').DataTable();
//       $scope.tab= 'topFiftyAds'; 
//      $timeout(function(){
//         $('#manageAdsTable').DataTable();
//          $scope.tab= 'topFiftyAds';      
//      },100)
//   }else{
//     console.log("dddddd");
//   }
     
//   }























 $scope.removeAds = function (id) {
    //console.log("hhh",id)
        $scope.RemoveId = id;
        var adsId = $scope.RemoveId;
        //console.log("Blockidvcbc");
        //console.log("$scope.RemoveId",$scope.RemoveId)
        if ($scope.RemoveId == '' || $scope.RemoveId == undefined || $scope.RemoveId == null) {
       toastr.error("Please select user.")
       $state.go('header.manageAds')
    } else {
    BootstrapDialog.show({
        title: 'Remove User',
        message: 'Are you sure want to Remove this Add',
        buttons: [{
            label: 'Yes',
            action: function(dialog) {
                userService.removeAds(adsId).success(function(res) {        
                    if (res.responseCode == 200){
                        dialog.close();
                        toastr.success("Page removed Successfully");
                        $state.reload();
                    } else if(res.responseCode == 404){
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


// $scope.removeAds=function(id){
//         if ($scope.myForm.checkId == '' || $scope.myForm.checkId == undefined || $scope.myForm.checkId == null) {
//         toastr.error("Please select user.")
//     }
//     else {
//         userService.removeAds($scope.myForm.checkId).then(function(success) { 

//             },function(err){
//                 console.log(err);
//                  toastr.error('Connection error.');
//         }) 
//     }
// }

  $scope.sendMessagePage = function (modal) {
      //console.log($scope.myForm.checkId);
        $scope.modalId = modal;
        $scope.modelData = modal;
      $("#sendMessageModelAllUser").modal('show');
 }
 
 $scope.contactOwner = function (modal) {
    $scope.modalId = modal;
    $scope.modelData = modal;
      if ($scope.myForm.checkId == '' || $scope.myForm.checkId == undefined || $scope.myForm.checkId == null) {
    toastr.error("Please select user.")
      }
      else{
           $("#sendMessageModelOwners").modal('show');           
      }       
 }

  $scope.send_messageOwners = function(id){
        //console.log($scope.myForm.checkId);
        if ($scope.sendMessage.massage == '' || $scope.sendMessage.massage == undefined || $scope.sendMessage.massage == null) {
            toastr.error('Please enter your message');
            return;
        }
     userService.sendMassageAllUser(id).success(function(res) {
         if (res.responseCode == 200){
              toastr.success("Message sent successfully to Owner");
              $scope.sendMessage = '';
              $("#sendMessageModelOwners").modal('hide');
          } else {
               toastr.error(res.responseMessage);
           }
     })
  }

  $scope.showPageDetails = function(id){
        //console.log("id---------"+id);
        userService.pageInfo(id).success(function(res) {
             console.log("Show(res.result)",JSON.stringify(res.result))
           $scope.allpageInfo = res.result;
            $("#pageDetails").modal('show');
          //console.log("$scope.allpageInfo",JSON.stringify($scope.allpageInfo))
        })
    }

     $scope.adInfo=function(){
         //console.log($scope.myForm.checkId)
         if ($scope.myForm.checkId == '' || $scope.myForm.checkId == undefined || $scope.myForm.checkId == null) {
        toastr.error("Please select user.")
         }
        else {
            userService.adInfo($scope.myForm.checkId).then(function(success) { 
            //console.log(JSON.stringify($scope.userDetail))
                    $scope.userDetail=success.data.result;
                    $("#adInfo").modal('show');
                    //console.log("adInfo>>>>>>>>>>>>>"+JSON.stringify(success))
                },function(err){
                    //console.log(err);
                     toastr.error('Connection error.');
            }) 
        }
    }

     $scope.adInfoSoldCoupon=function(id){
      
            userService.adInfo(id).then(function(success) { 
            //console.log(JSON.stringify($scope.userDetail))
                    $scope.userDetail=success.data.result;
                    $("#adInfo").modal('show');
                    //console.log("adInfo>>>>>>>>>>>>>"+JSON.stringify(success))
                },function(err){
                    //console.log(err);
                     toastr.error('Connection error.');
            }) 
        
    }

         $scope.reportOnAd=function(id){
        //console.log("reportOnAdId>>>"+JSON.stringify(id))
        userService.showReportOnAd($scope.myForm.checkId).then(function(success) { 
            //console.log(JSON.stringify($scope.userDetail))
                    $scope.userDetail=success.data.result;
                    
                    if(success.data.responseCode == 404)
                    {
                        toastr.error(success.data.responseMessage);
                    }
                    else if(success.data.responseCode == 200){
                        $("#adReport").modal('show');
                    }
                    else{
                         toastr.error(success.data.responseMessage);
                    }
                    //console.log("reportOnAd>>>>>>>>>>>>>"+JSON.stringify(success))
                },function(err){
                    //console.log(err);
                     toastr.error('Connection error.');
            }) 
    }

/*-------------------------Message send to all contact Admins---------------------*/

    $scope.send_massage = function(){
         if ($scope.sendMessage.massage == '' || $scope.sendMessage.massage == undefined || $scope.sendMessage.massage == null) {
            toastr.error('Please enter your message');
            return;
        }
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
                    if ($scope.sendMessage.massage == '' || $scope.sendMessage.massage == undefined || $scope.sendMessage.massage == null) {
                        toastr.error('Please enter your message');
                        return;
                    }
                    userService.sendMassageAllUser(data).success(function(res) {
                        if (res.responseCode == 200){
                            toastr.success("Message sent successfully to Admins");
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
                            toastr.success("Message sent successfully to  Admins");
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
                            toastr.success("Message sent successfully to Admins");
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
                            toastr.success("Message sent successfully to  Admins");
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
                            toastr.success("Message sent successfully to Admins");
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
                            toastr.success("Message sent successfully to Admins");
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
                            toastr.success("Message sent successfully to Admins");
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
                            toastr.success("Message sent successfully to Admins");
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
                            toastr.success("Message sent successfully  Admins");
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
                            toastr.success("Message sent successfully to Admins");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
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
          console.log("ddd",JSON.stringify(res))
          $scope.cityList = res.result;
        })
    }

// //-------------------------------SELECT CASCADING COUNTRY, STATE & CITY FILTER-------------------------//
//     var currentCities=[];
//     $scope.currentCountry= '';
// var BATTUTA_KEY="00000000000000000000000000000000"
//     // Populate country select box from battuta API
//   url="http://battuta.medunes.net/api/country/all/?key="+BATTUTA_KEY+"&callback=?";
//     $.getJSON(url,function(countries)
//     {
//       $timeout(function(){
//         $scope.countriesList=countries;
//       },100)


//     });
//   var countryCode;
//     $scope.changeCountry = function(){
//         console.log('Country:   '+JSON.stringify($scope.dashBordFilter.country))
//       for(var i=0;i<$scope.countriesList.length;i++){
//         if($scope.countriesList[i].name==$scope.dashBordFilter.country){
//           countryCode=$scope.countriesList[i].code;
//           //console.log(countryCode)
//           break;
//         }
//       }
//       var url="http://battuta.medunes.net/api/region/"+countryCode+"/all/?key="+BATTUTA_KEY+"&callback=?";
//       $.getJSON(url,function(regions)
//       {
//         //console.log('state list:   '+JSON.stringify(regions))
//          $timeout(function(){
//         $scope.stateList = regions;
//           },100)
//       });
//     }

//     $scope.changeState = function(){
//         console.log('State:   '+JSON.stringify($scope.dashBordFilter.state))
//       //console.log('detail -> '+countryCode+' city name -> '+$scope.dashBordFilter.state)
//       var url="http://battuta.medunes.net/api/city/"+countryCode+"/search/?region="+$scope.dashBordFilter.state+"&key="+BATTUTA_KEY+"&callback=?";
//       $.getJSON(url,function(cities)
//       {
//         // console.log('city list:   '+JSON.stringify(cities))
//          $timeout(function(){
//           $scope.cityList = cities;
//             },100)
//       })

//     }
//     //  console.log('City:   '+JSON.stringify($scope.dashBordFilter.city))
//     //-------------------------------END OF SELECT CASCADING-------------------------//


userService.totalAds().then(function(success) {
  if(success.data.responseCode == 404){
    toastr.error(success.responseMessage);
  }else if(success.data.responseCode == 200) {
    $scope.totalAds = res.result;
    $scope.totalAdscount = res.result.length;
  }else{
    toastr.error(success.responseMessage);
  }
})
// userService.totalAds().success(function(res) {
//                  console.log("response-->>"+JSON.stringify(res))
//                 if(res.responseCode == 409){
//                 $state.go('login')
//             }else if(res.responseCode == 200) {

//                 $scope.totalAds = res.result;
               
//                 $scope.totalAdscount = res.result.length;
                
//             }
//             else{
//               toastr.error(responseMessage);
//             }
//         }).error(function(status, data) {

//     })

     userService.totalActiveAds().success(function(res) {
                 // console.log("response111-->>"+JSON.stringify(res))
                if(res.responseCode == 409){
                    $state.go('login')
                }
                else {
                    $scope.totalActiveAds = res.result;
                     //console.log(JSON.stringify($scope.totalActiveAds))
                    $scope.totalActiveAdscount = res.result.length;
                    
                }
             }).error(function(status, data) {

         })
      userService.totalExpiredAds().success(function(res) {
                 // console.log("response-->>"+JSON.stringify(res))
                if(res.responseCode == 409){
                    $state.go('login')
                }
                else {
                    $scope.totalExpiredAds = res.result;
                    $scope.totalExpiredAdscount = res.result.length;
                    
                }
             }).error(function(status, data) {

         })
userService.videoAds().success(function(res) {
                 // console.log("response-->>"+JSON.stringify(res))
                if(res.responseCode == 409){
                    $state.go('login')
                }
                else {
                    $scope.videoAds = res.result;
                     $scope.videoAdscount = res.result.length;
                    
                }
             }).error(function(status, data) {

         })
userService.slideshowAds().success(function(res) {
                if(res.responseCode == 409){
                    $state.go('login')
                }
                else {
                    $scope.slideshowAds = res.result;
                    $scope.slideshowAdscount = res.result.length;
                    
                }
             }).error(function(status, data) {

         })
userService.adUpgradedByDollor().success(function(res) {
                 // console.log("response-->>"+JSON.stringify(res))
                if(res.responseCode == 409){
                    $state.go('login')
                }
                else {
                    $scope.adUpgradedByDollor = res.result;
                    $scope.adUpgradedByDollorcount = res.result.length;
                    
                }
             }).error(function(status, data) {

         })
userService.slideshowAds().success(function(res) {
                     // console.log("response-->>"+JSON.stringify(res))
                    if(res.responseCode == 409){
                        $state.go('login')
                    }
                    else {
                        $scope.adUpgradedByBrolix = res.result;
                        $scope.adUpgradedByBrolixcount= res.result.length;
                        
                    }
                 }).error(function(status, data) {

             })
 userService.showReportedAd().success(function(res) {
             // console.log("response-->>"+JSON.stringify(res))
            if(res.responseCode == 409){
                $state.go('login')
            }
            else {
                $scope.showReportedAd = res.result;
                $scope.showReportedAdcount= res.result.length;
                
            }
         }).error(function(status, data) {

     })

 userService.adsWithLinks().success(function(res) {
             console.log("resssponse-->>"+JSON.stringify(res))
            if(res.responseCode == 409){
                $state.go('login')
            }
            else {
                $scope.adsWithLinks = res.result;
                $scope.adsWithLinkscount= res.result.length;
                
            }
         }).error(function(status, data) {

     })





















 $scope.export = function(){
    var type = localStorage.getItem('adsTypeName');
        html2canvas(document.getElementById('manageAdsTable'), {
            onrendered: function (canvas) {
                var data = canvas.toDataURL();
                var docDefinition = {
                    content: [{
                        image: data,
                        width: 500,
                    }]
                };
                pdfMake.createPdf(docDefinition).download(type+'.pdf');
            }
        });
    }
//*************Total Ads****************
    $scope.currentTotalAds = 1;
         $scope.nextTotalAds = function(){
             
    }
     $scope.nextTotalAds();
     $scope.nextClk = function(){
        $scope.currentTotalAds++;
        $scope.nextTotalAds();
     }
     $scope.preClk = function(){
        $scope.currentTotalAds--;
        $scope.nextTotalAds();
     }

//*********************Active Ads*******************

    $scope.currentActiveAds = 1;
         $scope.nextActiveAds = function(){
           console.log('page number -> '+ $scope.currentActiveAds);
        
    }
     $scope.nextActiveAds();
     $scope.nextActiveAdsClk = function(){
        $scope.currentActiveAds++;
        $scope.nextActiveAds();
     }
     $scope.preActiveAdsClk = function(){
        $scope.currentActiveAds--;
        $scope.nextActiveAds();
     }

// userService.totalActiveAds().success(function(res) {
//         if(res.responseCode == 409){
//             $state.go('login')
//         }else {
//             $scope.totalActiveAds = res.result;
//             $scope.totalActiveAdscount = res.count;
//              console.log("jjjjjjj",JSON.stringify(res))
//         }
//     }).error(function(status, data) {

// })



//***************total Expired ADs******************

    $scope.currentExpiredAds = 1;
         $scope.nextExpiredAds = function(){
       
    }
     $scope.nextExpiredAds();
     $scope.nextExpiredAdsClk = function(){
        $scope.currentExpiredAds++;
        $scope.nextExpiredAds();
     }
     $scope.preExpiredAdsClk = function(){
        $scope.currentExpiredAds--;
        $scope.nextExpiredAds();
     }


//****************** Video ads *********************

$scope.currentVideoAds = 1;
         $scope.nextVideoAds = function(){
             
    }
     $scope.nextVideoAds();
     $scope.nextVideoAdsClk = function(){
        $scope.currentVideoAds++;
        $scope.nextVideoAds();
     }
     $scope.preVideoAdsClk = function(){
        $scope.currentVideoAds--;
        $scope.nextVideoAds();
     }


//*************** SlideShow Ads************
    $scope.currentSlideShowAds = 1;
         $scope.nextSlideShowAds = function(){
             
    }
     $scope.nextSlideShowAds();
     $scope.nextSlideShowAdsClk = function(){
        $scope.currentSlideShowAds++;
        $scope.nextSlideShowAds();
     }
     $scope.preSlideShowAdsClk = function(){
        $scope.currentSlideShowAds--;
        $scope.nextSlideShowAds();
     }

//*************** Upgraded by Dollars************
    $scope.currentUpgradedByDollars = 1;
         $scope.nextUpgradedByDollars = function(){
             
    }
     $scope.nextUpgradedByDollars();
     $scope.nextUpgradedByDollarsClk = function(){
        $scope.currentUpgradedByDollars++;
        $scope.nextUpgradedByDollars();
     }
     $scope.preUpgradedByDollarsClk = function(){
        $scope.currentUpgradedByDollars--;
        $scope.nextUpgradedByDollars();
     }

//*************** Upgraded By Brolix **************

    $scope.currentUpgradedByBrolix = 1;
             $scope.nextUpgradedByBrolix = function(){
                 
        }
         $scope.nextUpgradedByBrolix();
         $scope.nextUpgradedByBrolixClk = function(){
            $scope.currentUpgradedByBrolix++;
            $scope.nextUpgradedByBrolix();
         }
         $scope.preUpgradedByBrolixClk = function(){
            $scope.currentUpgradedByBrolix--;
            $scope.nextUpgradedByBrolix();
         }

 //************** Reported Ads *********************

    $scope.currentReportedAds = 1;
     $scope.nextReportedAds = function(){
        
    }
     $scope.nextReportedAds();
     $scope.nextReportedAdsClk = function(){
        $scope.currentReportedAds++;
        $scope.nextReportedAds();
     }
     $scope.preReportedAdsClk = function(){
        $scope.currentReportedAds--;
        $scope.nextReportedAds();
     }

//**************  Ads With Links *********************

    $scope.currentAdsWithLinks = 1;
     $scope.nextAdsWithLinks = function(){
        console.log('Ads -> '+ $scope.currentAdsWithLinks);
        
    }
     $scope.nextAdsWithLinks();
     $scope.nextAdsWithLinksClk = function(){
        $scope.currentAdsWithLinks++;
        $scope.nextAdsWithLinks();
     }
     $scope.preAdsWithLinksClk = function(){
        $scope.currentAdsWithLinks--;
        $scope.nextAdsWithLinks();
     }
// userService.adsWithLinks().success(function(res) {
//         if(res.responseCode == 409){
//             $state.go('login')
//         }else {
//             $scope.adsWithLinks = res.result;
//             $scope.adsWithLinkscount = res.count;
//              //console.log("Ads",JSON.stringify(res))
//         }
//     }).error(function(status, data) {
// })

//****************** Top 50 Ads ********************
   // $scope.currentTopFiftyAds = 1;
   //   $scope.nextTopFiftyAds = function(){
   //       userService.topFiftyAds($scope.currentTopFiftyAds).success(function(res) {
   //           // console.log("response-->>"+JSON.stringify(res))
   //          if(res.responseCode == 409){
   //              $state.go('login')
   //          }
   //          else {
   //              $scope.noOfPagesTopFiftyAds = res.result.pages;
   //              $scope.pageNoTopFiftyAds = JSON.parse(res.result.page);
   //              $scope.topFiftyAds = res.result.docs;
   //              $scope.topFiftyAdscount= res.result.total;
                
   //          }
   //       }).error(function(status, data) {

   //   })
   //  }
   //   $scope.nextTopFiftyAds();
   //   $scope.nextTopFiftyAdsClk = function(){
   //      $scope.currentTopFiftyAds++;
   //      $scope.nextTopFiftyAds();
   //   }
   //   $scope.preTopFiftyAdsClk = function(){
   //      $scope.currentTopFiftyAds--;
   //      $scope.nextTopFiftyAds();
   //   }
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

 $scope.adsTypeName = function(val) {
        localStorage.setItem('adsTypeName',val);

        //$scope.currentTotalAds = 1;
        $scope.nextTotalAds();

        // $scope.currentActiveAds = 1;
        $scope.nextActiveAds();

       // $scope.currentExpiredAds = 1;
        $scope.nextExpiredAds();

        //$scope.currentVideoAds = 1;
        $scope.nextVideoAds();

       // $scope.currentSlideShowAds = 1;
        $scope.nextSlideShowAds();

        //$scope.currentUpgradedByDollars = 1;
        $scope.nextUpgradedByDollars();

        //$scope.currentUpgradedByBrolix = 1;
        $scope.nextUpgradedByBrolix();

        //$scope.currentReportedAds = 1;
        $scope.nextReportedAds();

       // $scope.currentAdsWithLinks = 1;
        $scope.nextAdsWithLinks();
    }

$scope.dashBordFilter = function(){

    var type = localStorage.getItem('adsTypeName');

    $scope.dobTo =$scope.dashBordFilter.dobTo==undefined?undefined : new Date().getTime($scope.dashBordFilter.dobTo);
    $scope.dobFrom =$scope.dashBordFilter.dobFrom==undefined?undefined : new Date().getTime($scope.dashBordFilter.dobFrom);
    $scope.country =$scope.dashBordFilter.country==undefined?undefined : $scope.dashBordFilter.country.name;
    console.log("date",$scope.dashBordFilter.country);
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
        console.log("type:                "+type)
        if(type == undefined || type == null  || type == "" )
        {
            toastr.error("First you click on show Ads button")
        }else {
            console.log("switch type:   "+type);
            switch (type)
            {
                case 'totalAds':
                console.log("1");
                $scope.currentPage = 1;
                console.log("data jst before service"+JSON.stringify(data));
                    userService.adsfilter(data,$scope.currentPage).success(function(res){
                        console.log("ressssssss",JSON.stringify(res));
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
                console.log("9");
                    userService.adsfilter(data).success(function(res){
                        $scope.adUpgradedByDollor = res.data;
                        console.log("ressssssss8",JSON.stringify($scope.adUpgradedByDollor));
                    })

                break;

                case 'adUpgradedByBrolix':
                console.log("10");
                    userService.adsfilter(data).success(function(res){
                        $scope.adUpgradedByBrolix = res.data;
                        console.log("ressssssss8",JSON.stringify($scope.adUpgradedByBrolix));
                    })

                break;

                case 'topFiftyAds':
                console.log("11");
                    userService.adsfilter(data).success(function(res){
                        $scope.topFiftyAds = res.data;
                        console.log("ressssssss8",JSON.stringify($scope.topFiftyAds));
                    })

                break;

                default:
                toastr.error("somthing wents to wroung");
            }
        }         
    }
})

app.filter("manageAdsFilter",function() {
   return function(items,nameValue){
    //console.log(JSON.stringify(items))
    //console.log(nameValue)
     if (!nameValue) {
       return retArray = items;
       }
       var retArray = [];
         for(var i=0;i<items.length;i++)
              {
              if(items[i].pageName.toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() || items[i].userId.mobileNumber.toString().substr(0,nameValue.length) == nameValue.toString()) {
                        retArray.push(items[i]);
                    }
         }
         return retArray
      }
})



