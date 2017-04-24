app.controller('createAdsCtrl', function ($scope, $state, $window, userService, uploadimgServeice, $http, toastr,$timeout, spinnerService) {
$(window).scrollTop(0,0);
$scope.$emit('headerStatus', 'Manage Ads');
$scope.$emit('SideMenu', 'Manage Ads');
$scope.createAds = {};
$scope.promoteAppGame = {};
//$scope.createAds.advertismentCover='../dist/image/cover.jpg';

userService.adminProfile().success(function(res) {
    if (res.responseCode == 200) {
        $scope.userId = res.result._id; 
        console.log("$scope.userId",$scope.userId)
        localStorage.setItem('adminId',$scope.userId);
    } else {
        toastr.error(res.responseMessage);
        $state.go('login')
        
    }
    console.log("resss",$scope.userId);
})

var adminIdss = localStorage.getItem('adminId');
console.log("userId",adminIdss)

userService.getPage().then(function(success) { 
        $scope.pageDetail=success.data.result;
        console.log("Page>>>>>>>>>>"+JSON.stringify($scope.pageDetail))
    },function(err){
        console.log(err);
         toastr.error('Connection error.');
}) 

 $scope.Step1 = true;
 $scope.Step2 = false;
 $scope.Step3 = false;
 $scope.vedioStep4 = false;
 $scope.Step5 = false;
 $scope.Step6 = false;
 $scope.slideStep4 = false;
 $scope.promoteApp = false;

 $scope.click = function(type){
    console.log("createAds.pageName",JSON.stringify($scope.createAds))
    console.log("type",type)
    if(type == 'Step2'){
        $scope.Step1 = false;
        $scope.Step2 = true;
        $scope.Step3 = false;
        $scope.vedioStep4 = false;
        $scope.Step5 = false;
        $scope.Step6 = false;
        $scope.slideStep4 = false;
        $scope.promoteApp = false;
        console.log("createAds.pageName",JSON.stringify($scope.createAds))
    }else if(type == 'Back2'){
        $scope.Step1 = true;
        $scope.Step2 = false;
        $scope.Step3 = false;
        $scope.vedioStep4 = false;
        $scope.Step5 = false;
        $scope.Step6 = false;
        $scope.slideStep4 = false;
        $scope.promoteApp = false;
        console.log("createAds.pageName",JSON.stringify($scope.createAds))

    }else if(type == 'Step3'){
        $scope.Step1 = false;
        $scope.Step2 = false;
        $scope.Step3 = true;
        $scope.vedioStep4 = false;
        $scope.Step5 = false;
        $scope.Step6 = false;
        $scope.slideStep4 = false;
        $scope.promoteApp = false;
        console.log("createAds.pageName",JSON.stringify($scope.createAds))

    }else if(type == 'Back3'){
        $scope.Step1 = false;
        $scope.Step2 = true;
        $scope.Step3 = false;
        $scope.vedioStep4 = false;
        $scope.Step5 = false;
        $scope.Step6 = false;
        $scope.slideStep4 = false;
        $scope.promoteApp = false;
        console.log("createAds.pageName",JSON.stringify($scope.createAds))

    }else if(type == 'video'){
        $scope.Step1 = false;
        $scope.Step2 = false;
        $scope.Step3 = false;
        $scope.vedioStep4 = true;
        $scope.Step5 = false;
        $scope.Step6 = false;
        $scope.slideStep4 = false;
        $scope.promoteApp = false;
       console.log("createAds.pageName",JSON.stringify($scope.createAds))

    }else if(type == 'Back4'){
        $scope.Step1 = false;
        $scope.Step2 = false;
        $scope.Step3 = true;
        $scope.vedioStep4 = false;
        $scope.Step5 = false;
        $scope.Step6 = false;
        $scope.slideStep4 = false;
        $scope.promoteApp = false;
        console.log("createAds.pageName",JSON.stringify($scope.createAds))

    }else if(type == 'Step5'){
        $scope.Step1 = false;
        $scope.Step2 = false;
        $scope.Step3 = false;
        $scope.vedioStep4 = false;
        $scope.Step5 = true;
        $scope.Step6 = false;
        $scope.slideStep4 = false;
        $scope.promoteApp = false;
        console.log("createAds.pageName",JSON.stringify($scope.createAds))
    }else if(type == 'Back5'){
        $scope.Step1 = false;
        $scope.Step2 = false;
        $scope.Step3 = false;
        $scope.vedioStep4 = true;
        $scope.Step5 = false;
        $scope.Step6 = false;
        $scope.slideStep4 = false;
        $scope.promoteApp = false;
       console.log("createAds.pageName",JSON.stringify($scope.createAds))

    }else if(type == 'slide'){
        $scope.Step1 = false;
        $scope.Step2 = false;
        $scope.Step3 = false;
        $scope.vedioStep4 = false;
        $scope.Step5 = false;
        $scope.Step6 = false;
        $scope.slideStep4 = true;
        $scope.promoteApp = false;
       console.log("createAds.pageName",JSON.stringify($scope.createAds))

    }else if(type == 'Step6'){
        $scope.Step1 = false;
        $scope.Step2 = false;
        $scope.Step3 = false;
        $scope.vedioStep4 = false;
        $scope.Step5 = false;
        $scope.Step6 = true;
        $scope.slideStep4 = false;
        $scope.promoteApp = false;
        console.log("createAds.pageName",JSON.stringify($scope.createAds))

    }else if(type == 'Back6'){
        $scope.Step1 = false;
        $scope.Step2 = false;
        $scope.Step3 = false;
        $scope.vedioStep4 = false;
        $scope.Step5 = true;
        $scope.Step6 = false;
        $scope.slideStep4 = false;
        $scope.promoteApp = false;
       console.log("createAds.pageName",JSON.stringify($scope.createAds))

    }else if(type == 'promoteApp'){
        $scope.Step1 = false;
        $scope.Step2 = false;
        $scope.Step3 = false;
        $scope.vedioStep4 = false;
        $scope.Step5 = false;
        $scope.Step6 = false;
        $scope.slideStep4 = false;
        $scope.promoteApp = true;
       console.log("createAds.pageName",JSON.stringify($scope.createAds))

    }else if(type == 'promoteAppBack'){
        console.log("alalalaldata",$scope.createAds.adContentType)
        if ($scope.createAds.adContentType == 'video'){
            $scope.Step1 = false;
            $scope.Step2 = false;
            $scope.Step3 = false;
            $scope.vedioStep4 = true;
            $scope.Step5 = false;
            $scope.Step6 = false;
            $scope.slideStep4 = false;
            $scope.promoteApp = false;
            console.log("createAds.pageName",JSON.stringify($scope.createAds))
        }else if($scope.createAds.adContentType == 'slideshow'){
            $scope.Step1 = false;
            $scope.Step2 = false;
            $scope.Step3 = false;
            $scope.vedioStep4 = false;
            $scope.Step5 = false;
            $scope.Step6 = false;
            $scope.slideStep4 = true;
            $scope.promoteApp = false;
        }else{
            toastr.error("somthing wents to wrong")
        }
        

    }else{
        toastr.error("something wents to wrong")
    }
    
 }


$scope.changeImage = function(input,type) {

     spinnerService.show('html5spinner');  
       var file = input.files[0];
       console.log("input type",input.files[0])
       var ext = file.name.split('.').pop();
       if (ext == "jpg" || ext == "jpeg" || ext == "bmp" || ext == "gif" || ext == "png" || ext == "3gp" || ext == "mp4" || ext == "flv" || ext == "avi" || ext == "wmv") {
           $scope.imageName = file.name;
           console.log("$scope.imageName",$scope.imageName)
           $scope.createAds.type = file.type;
           console.log("$scope.createAds.type",$scope.createAds.type)
           if(file.type.split('/')[0]=='image') {
                switch (type)
            {
                
                case 'advertismentCover': 
                uploadimgServeice.user(file).then(function(ObjS) {
                     $timeout(function () {      
                spinnerService.hide('html5spinner');   
                    $scope.createAds.advertismentCover = ObjS.data.result.url;
                    
                        }, 250);  
                    // $scope.user.photo1 = ObjS.data.result.url;
                    console.log("advertismentCover",$scope.createAds.advertismentCover)
                })  
                break;

                case 'photo1': 
                uploadimgServeice.user(file).then(function(ObjS) {
                     $timeout(function () {      
                spinnerService.hide('html5spinner');   
                    $scope.createAds.photo1 = ObjS.data.result.url;
                    
                        }, 250);  
                    // $scope.user.photo1 = ObjS.data.result.url;
                    console.log("image",$scope.createAds.photo1)
                })  
                break;

                case 'photo2': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $timeout(function () {      
                    spinnerService.hide('html5spinner'); 
                    $scope.createAds.photo2 = ObjS.data.result.url;
                    }, 250);  
                    // $scope.user.photo2 = ObjS.data.result.url;
                    console.log("image",$scope.createAds.photo2)
                })  
                break;

                case 'photo3': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $timeout(function () {      
                    spinnerService.hide('html5spinner'); 
                    $scope.createAds.photo3 = ObjS.data.result.url;
                    }, 250); 
                    // $scope.user.photo3 = ObjS.data.result.url;
                })  
                break;

                case 'photo4': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $timeout(function () {      
                    spinnerService.hide('html5spinner');
                    $scope.createAds.photo4 = ObjS.data.result.url;
                        }, 250);  
                    // $scope.user.photo4 = ObjS.data.result.url;
                })  
                break;

                case 'photo5': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $timeout(function () {      
                    spinnerService.hide('html5spinner'); 
                    $scope.createAds.photo5 = ObjS.data.result.url;
                    }, 250);  
                    // $scope.user.photo5 = ObjS.data.result.url;
                })  
                break;

                case 'photo6': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $timeout(function () {      
                    spinnerService.hide('html5spinner'); 
                    $scope.createAds.photo6 = ObjS.data.result.url;
                    }, 250);  
                    // $scope.user.photo6 = ObjS.data.result.url;

                })  
                break;
                case 'adCover': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $timeout(function () {      
                    spinnerService.hide('html5spinner'); 
                    $scope.createAds.adCover = ObjS.data.result.url;
                    }, 250);  
                    console.log('adsType Image in video-->>>'+$scope.createAds.adCover)
                    console.log(JSON.stringify($scope.createAds.adCover))
                })  
                break;

                case 'appIcon': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $timeout(function () {      
                    spinnerService.hide('html5spinner'); 
                    $scope.promoteAppGame.appIcon = ObjS.data.result.url;
                    }, 250);  
                    // $scope.user.appIcon = ObjS.data.result.url;
                })  
                break;

                case 'appPhoto1': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $timeout(function () {      
                    spinnerService.hide('html5spinner'); 
                   $scope.promoteAppGame.appPhoto1 = ObjS.data.result.url;
                    }, 250);  
                    // $scope.user.downloadPhoto1 = ObjS.data.result.url;

                })  
                break;
                case 'appPhoto2': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $timeout(function () {      
                    spinnerService.hide('html5spinner'); 
                    $scope.promoteAppGame.appPhoto2 = ObjS.data.result.url;
                    }, 250);  
                    // $scope.user.downloadPhoto2 = ObjS.data.result.url;
                })  
                break;

                case 'appPhoto3': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $timeout(function () {      
                    spinnerService.hide('html5spinner'); 
                    $scope.promoteAppGame.appPhoto3 = ObjS.data.result.url;
                    }, 250);  
                    //$scope.user.downloadPhoto3 = ObjS.data.result.url;
                })  
                break;

                case 'appPhoto4': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $timeout(function () {      
                    spinnerService.hide('html5spinner'); 
                    $scope.promoteAppGame.appPhoto4 = ObjS.data.result.url;
                    }, 250);  
                    //$scope.user.downloadPhoto4 = ObjS.data.result.url;

                })  
                break;

                case 'giftImage': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $timeout(function () {      
                    spinnerService.hide('html5spinner'); 
                    $scope.createAds.giftImage = ObjS.data.result.url;
                    }, 250); 
                    //$scope.user.giftImage = ObjS.data.result.url;

                })  
                break;

                default: 
                toastr.error("Somthing wents to wroung")
                
            }
            } else {

                uploadimgServeice.user(file).then(function(ObjS) {
                     $timeout(function () {      
                spinnerService.hide('html5spinner');   
                    $scope.createAds.vedioUrl = ObjS.data.result.url;
                    console.log("$scope.createAds.url",$scope.createAds.vedioUrl);
                        }, 250);
                }) 
                
            }          
       }else{
           toastr.error("Only image supported.")
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
      for(var i=0;i<$scope.countriesList.length;i++){
        if($scope.countriesList[i].name==$scope.createAds.country){
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
      //console.log('detail -> '+countryCode+' city name -> '+$scope.createAds.state)
      var url="http://battuta.medunes.net/api/city/"+countryCode+"/search/?region="+$scope.createAds.state+"&key="+BATTUTA_KEY+"&callback=?";
      $.getJSON(url,function(cities)
      {
        // console.log('city list:   '+JSON.stringify(cities))
        $timeout(function(){
          $scope.cityList = cities;
            },100)
      })
    }
    //-------------------------------END OF SELECT CASCADING-------------------------//


   $scope.submit = function(){
    console.log("$scope",$scope.createAds);
    console.log("ddadaaradfatya0",JSON.stringify(data));
    var modifyData = {};
    modifyData = {
        userId:adminIdss,
        pageId:$scope.createAds.pageName._id,
        adsType:data.giftType,
        //cashAdPrize:data.,
        adContentType:data.adContentType,
        // numberOfWinners:
        // viewerLenght:data.viewers.
        uploadGiftImage:data.advertismentCover
    }

//     userService.createAds(data).success(function(res) {
//     if (res.responseCode == 200) {
//         toastr.success("create ads successfully")
//     } else {
//         toastr.error(res.responseMessage);
//         $state.go('login')
        
//     }
//     console.log("resss",$scope.userId);
// })
       console.log("All data -->>"+JSON.stringify(modifyData));
   }

   
})