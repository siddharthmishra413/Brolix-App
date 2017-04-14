app.controller('manageAdsCtrl', function ($scope,$window,userService, $timeout,toastr,$state) {
$(window).scrollTop(0,0);
 $scope.$emit('headerStatus', 'Manage Ads');
 $scope.$emit('SideMenu', 'Manage Ads');
 $scope.tab = 'totalads';
 $scope.dashBordFilter = {};
 $scope.sendMessage = {};
 $scope.myForm={};

  $scope.sendMessagePage = function (modal) {
      console.log($scope.myForm.checkId);
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
        console.log($scope.myForm.checkId);
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
        console.log("id---------"+id);
        userService.pageInfo(id).success(function(res) {
             console.log("Show(res.result)",JSON.stringify(res.result))
           $scope.allpageInfo = res.result;
            $("#pageDetails").modal('show');
          console.log("$scope.allpageInfo",JSON.stringify($scope.allpageInfo))
        })
    }
    
     $scope.adInfo=function(){
         console.log($scope.myForm.checkId)
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
                    console.log(err);
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
                    console.log(err);
                     toastr.error('Connection error.');
            }) 
        
    }

         $scope.reportOnAd=function(id){
        console.log("reportOnAdId>>>"+JSON.stringify(id))
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
                    console.log("reportOnAd>>>>>>>>>>>>>"+JSON.stringify(success))
                },function(err){
                    console.log(err);
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
             userService.totalAds($scope.currentTotalAds).success(function(res) {
                 // console.log("response-->>"+JSON.stringify(res))
                if(res.responseCode == 409){
                $state.go('login')
            }else {
                $scope.noOfPages = res.result.pages;
                $scope.pageNo = JSON.parse(res.result.page);
                $scope.totalAds = res.result.docs;
               
                $scope.totalAdscount = res.result.total;
                
            }
        }).error(function(status, data) {

    })
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
             userService.totalActiveAds($scope.currentActiveAds).success(function(res) {
                 // console.log("response111-->>"+JSON.stringify(res))
                if(res.responseCode == 409){
                    $state.go('login')
                }
                else {
                    $scope.noOfPagesActiveAds = res.result.pages;
                    $scope.pageNoActiveAds = JSON.parse(res.result.page);
                    $scope.totalActiveAds = res.result.docs;
                     console.log(JSON.stringify($scope.totalActiveAds))
                    $scope.totalActiveAdscount = res.count;
                    
                }
             }).error(function(status, data) {

         })
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
             userService.totalExpiredAds($scope.currentExpiredAds).success(function(res) {
                 // console.log("response-->>"+JSON.stringify(res))
                if(res.responseCode == 409){
                    $state.go('login')
                }
                else {
                    $scope.noOfPagesExpiredAds = res.result.pages;
                    $scope.pageNoExpiredAds = res.result.page;
                    $scope.totalExpiredAds = res.result.docs;
                    $scope.totalExpiredAdscount = res.count;
                    
                }
             }).error(function(status, data) {

         })
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
             userService.videoAds($scope.currentVideoAds).success(function(res) {
                 // console.log("response-->>"+JSON.stringify(res))
                if(res.responseCode == 409){
                    $state.go('login')
                }
                else {
                    $scope.noOfPagesVideoAds = res.result.pages;
                    $scope.pageNoVideoAds = res.result.page;
                    $scope.videoAds = res.result.docs;
                     $scope.videoAdscount = res.result.total;
                    
                }
             }).error(function(status, data) {

         })
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
             userService.slideshowAds($scope.currentSlideShowAds).success(function(res) {
                if(res.responseCode == 409){
                    $state.go('login')
                }
                else {
                    $scope.noOfPagesSlideShowAds = res.result.pages;
                    // console.log("pages>>",JSON.stringify($scope.noOfPagesSlideShowAds))
                    $scope.pageNoSlideShowAds = JSON.parse(res.result.page);
                    $scope.slideshowAds = res.result.docs;
                    $scope.slideshowAdscount = res.result.total;
                    
                }
             }).error(function(status, data) {

         })
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
             userService.adUpgradedByDollor($scope.currentUpgradedByDollars).success(function(res) {
                 // console.log("response-->>"+JSON.stringify(res))
                if(res.responseCode == 409){
                    $state.go('login')
                }
                else {
                    $scope.noOfPagesUpgradedByDollars = res.result.pages;
                    $scope.pageNoUpgradedByDollars = JSON.parse(res.result.page);
                    $scope.adUpgradedByDollor = res.result.docs;
                    $scope.adUpgradedByDollorcount = res.result.total;
                    
                }
             }).error(function(status, data) {

         })
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
                 userService.slideshowAds($scope.currentUpgradedByBrolix).success(function(res) {
                     // console.log("response-->>"+JSON.stringify(res))
                    if(res.responseCode == 409){
                        $state.go('login')
                    }
                    else {
                        $scope.noOfPagesUpgradedByBrolix = res.result.pages;
                        $scope.pageNoUpgradedByBrolix = JSON.parse(res.result.page);
                        $scope.adUpgradedByBrolix = res.result.docs;
                        $scope.adUpgradedByBrolixcount= res.result.total;
                        
                    }
                 }).error(function(status, data) {

             })
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
         userService.showReportedAd($scope.currentReportedAds).success(function(res) {
             // console.log("response-->>"+JSON.stringify(res))
            if(res.responseCode == 409){
                $state.go('login')
            }
            else {
                $scope.noOfPagesReportedAds = res.result.pages;
                // console.log("pages>>",JSON.stringify($scope.noOfPagesReportedAds))
                $scope.pageNoReportedAds = JSON.parse(res.result.page);
                $scope.showReportedAd = res.result.docs;
                $scope.showReportedAdcount= res.result.total;
                
            }
         }).error(function(status, data) {

     })
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
         userService.adsWithLinks($scope.currentAdsWithLinks).success(function(res) {
             console.log("resssponse-->>"+JSON.stringify(res))
            if(res.responseCode == 409){
                $state.go('login')
            }
            else {
                $scope.noOfPagesAdsWithLinks = res.result.pages;
                $scope.pageNoAdsWithLinks = JSON.parse(res.result.page);
                $scope.adsWithLinks = res.result.docs;
                $scope.adsWithLinkscount= res.result.total;
                
            }
         }).error(function(status, data) {

     })
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

        $scope.currentTotalAds = 1;
        $scope.nextTotalAds();

         $scope.currentActiveAds = 1;
        $scope.nextActiveAds();

        $scope.currentExpiredAds = 1;
        $scope.nextExpiredAds();

        $scope.currentVideoAds = 1;
        $scope.nextVideoAds();

        $scope.currentSlideShowAds = 1;
        $scope.nextSlideShowAds();

        $scope.currentUpgradedByDollars = 1;
        $scope.nextUpgradedByDollars();

        $scope.currentUpgradedByBrolix = 1;
        $scope.nextUpgradedByBrolix();

        $scope.currentReportedAds = 1;
        $scope.nextReportedAds();

        $scope.currentAdsWithLinks = 1;
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
        if(type == undefined || type == null  || type == "" )
        {
            toastr.error("First you click on show Ads button")
        }else {
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
    console.log(JSON.stringify(items))
    console.log(nameValue)
     if (!nameValue) {
       return retArray = items;
       }
       var retArray = [];
         for(var i=0;i<items.length;i++)
              {
             if(items[i].userId.mobileNumber == '' || items[i].userId.mobileNumber == 'undefined' || items[i].pageName == null || items[i].pageName == 'undefined' || items[i].pageName == null || items[i].userId.mobileNumber == null)
              {
               }else  if(items[i].pageName.toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase() || items[i].userId.mobileNumber.toString().substr(0,nameValue.length) == nameValue.toString()) {
                        retArray.push(items[i]);
                    }
         }
         return retArray
      }
})



