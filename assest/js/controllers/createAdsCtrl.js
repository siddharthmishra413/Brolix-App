app.controller('createAdsCtrl', function ($scope, $state, $window, userService, uploadimgServeice, $http, toastr,$timeout, spinnerService) {
$(window).scrollTop(0,0);
$scope.$emit('headerStatus', 'Manage Ads');
$scope.$emit('SideMenu', 'Manage Ads');
$scope.createAds = {};
$scope.promoteAppGame = {};
$scope.addCode = [];

//$scope.createAds.advertismentCover='../dist/image/cover.jpg';


$scope.addcode = function(code){

    if($scope.addCode.length<$scope.createAds.numberOfWinners){
    console.log("code",code)
    $scope.addCode.push(code);
    $scope.createAds.hiddenCode="";
    console.log("addcode",$scope.addCode)

    }
    else{
        toastr.error("You are not allowed to add more coupons")
    }
}



$scope.openTerms = function(type){

    switch (type)
            {
                case 'hiddenGiftTerms': 
                $("#hiddenGiftTerms").modal('show');  
                break;

                case 'close': 
                $("#hiddenGiftTerms").modal('hide');  
                break;

                case 'cellThisCouponTerms':
                $("#cellThisCouponTerms").modal('show');          
                break;

                case 'couponTerms':
                $("#couponTerms").modal('show'); 
                break;

                case 'cashTerms':
                $("#cashTerms").modal('show'); 
                break;

                default:
                toastr.error("something wents to wrong") 
                
            }

    console.log("helll")
   
}

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
 $scope.cashStep5 = false;

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
        $scope.cashStep5 = false;
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
        $scope.cashStep5 = false;
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
        $scope.cashStep5 = false;
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
        $scope.cashStep5 = false;
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
        $scope.cashStep5 = false;
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
        $scope.cashStep5 = false;
        console.log("createAds.pageName",JSON.stringify($scope.createAds))

    }else if(type == 'Step5'){

        if($scope.createAds.giftType == 'coupon'){
            $scope.Step1 = false;
            $scope.Step2 = false;
            $scope.Step3 = false;
            $scope.vedioStep4 = false;
            $scope.Step5 = true;
            $scope.Step6 = false;
            $scope.slideStep4 = false;
            $scope.promoteApp = false;
            $scope.cashStep5 = false;
            $scope.cashStep5 = false;
            console.log("createAds.pageName",JSON.stringify($scope.createAds))
        }else if($scope.createAds.giftType == 'cash'){
            $scope.Step1 = false;
            $scope.Step2 = false;
            $scope.Step3 = false;
            $scope.vedioStep4 = false;
            $scope.Step5 = false;
            $scope.Step6 = false;
            $scope.slideStep4 = false;
            $scope.promoteApp = false;
            $scope.cashStep5 = true;
        }
        
    }else if(type == 'Back5'){

        if($scope.createAds.adContentType == 'video'){
            $scope.Step1 = false;
            $scope.Step2 = false;
            $scope.Step3 = false;
            $scope.vedioStep4 = true;
            $scope.Step5 = false;
            $scope.Step6 = false;
            $scope.slideStep4 = false;
            $scope.promoteApp = false;
            $scope.cashStep5 = false;
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
            $scope.cashStep5 = false;
            console.log("createAds.pageName",JSON.stringify($scope.createAds))
        }else{
            toastr.error('Something wents to wrong')
        }
    }else if(type == 'slide'){
        $scope.Step1 = false;
        $scope.Step2 = false;
        $scope.Step3 = false;
        $scope.vedioStep4 = false;
        $scope.Step5 = false;
        $scope.Step6 = false;
        $scope.slideStep4 = true;
        $scope.promoteApp = false;
        $scope.cashStep5 = false;
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
        $scope.cashStep5 = false;
        console.log("createAds.pageName",JSON.stringify($scope.createAds))

    }else if(type == 'Back6'){
        if($scope.createAds.giftType == 'coupon'){
            $scope.Step1 = false;
            $scope.Step2 = false;
            $scope.Step3 = false;
            $scope.vedioStep4 = false;
            $scope.Step5 = true;
            $scope.Step6 = false;
            $scope.slideStep4 = false;
            $scope.promoteApp = false;
            $scope.cashStep5 = false;
            console.log("createAds.pageName",JSON.stringify($scope.createAds))
        }else if($scope.createAds.giftType == 'cash'){
            $scope.Step1 = false;
            $scope.Step2 = false;
            $scope.Step3 = false;
            $scope.vedioStep4 = false;
            $scope.Step5 = false;
            $scope.Step6 = false;
            $scope.slideStep4 = false;
            $scope.promoteApp = false;
            $scope.cashStep5 = true;
            console.log("createAds.pageName",JSON.stringify($scope.createAds))

        }

    }else if(type == 'promoteApp'){
        $scope.Step1 = false;
        $scope.Step2 = false;
        $scope.Step3 = false;
        $scope.vedioStep4 = false;
        $scope.Step5 = false;
        $scope.Step6 = false;
        $scope.slideStep4 = false;
        $scope.promoteApp = true;
        $scope.cashStep5 = false;
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
            $scope.cashStep5 = false;
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
            $scope.cashStep5 = false;
        }else{
            toastr.error("somthing wents to wrong")
        }
        

    }else{
        toastr.error("something wents to wrong")
    }
    
 }


$scope.changeImage = function(input,type) {
    console.log("type",type)

     spinnerService.show('html5spinner');  
       var file = input.files[0];
       console.log("input type",input.files[0])
       var ext = file.name.split('.').pop();
       if (ext == "mp3" || ext == "jpg" || ext == "jpeg" || ext == "bmp" || ext == "gif" || ext == "png" || ext == "3gp" || ext == "mp4" || ext == "flv" || ext == "avi" || ext == "wmv") {
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

                case 'appPhoto1': 
                uploadimgServeice.user(file).then(function(ObjS) {
                     $timeout(function () {      
                spinnerService.hide('html5spinner');   
                    $scope.createAds.appPhoto1 = ObjS.data.result.url;
                    
                        }, 250);  
                    // $scope.user.photo1 = ObjS.data.result.url;
                    console.log("image",$scope.createAds.photo1)
                })  
                break;

                case 'appPhoto2': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $timeout(function () {      
                    spinnerService.hide('html5spinner'); 
                    $scope.createAds.appPhoto2 = ObjS.data.result.url;
                    }, 250);  
                    // $scope.user.photo2 = ObjS.data.result.url;
                    console.log("image",$scope.createAds.photo2)
                })  
                break;

                case 'appPhoto3': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $timeout(function () {      
                    spinnerService.hide('html5spinner'); 
                    $scope.createAds.appPhoto3 = ObjS.data.result.url;
                    }, 250); 
                    // $scope.user.photo3 = ObjS.data.result.url;
                })  
                break;

                case 'appPhoto4': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $timeout(function () {      
                    spinnerService.hide('html5spinner');
                    $scope.createAds.appPhoto4 = ObjS.data.result.url;
                        }, 250);  
                    // $scope.user.photo4 = ObjS.data.result.url;
                })  
                break;

                case 'appPhoto5': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $timeout(function () {      
                    spinnerService.hide('html5spinner'); 
                    $scope.createAds.appPhoto5 = ObjS.data.result.url;
                    }, 250);  
                    // $scope.user.photo5 = ObjS.data.result.url;
                })  
                break;

                case 'appPhoto6': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $timeout(function () {      
                    spinnerService.hide('html5spinner'); 
                    $scope.createAds.appPhoto6 = ObjS.data.result.url;
                    }, 250);  
                    // $scope.user.photo6 = ObjS.data.result.url;

                })  
                break;

                case 'appIcon': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $timeout(function () {      
                    spinnerService.hide('html5spinner'); 
                    $scope.createAds.appIcon = ObjS.data.result.url;
                    }, 250);  
                    // $scope.user.appIcon = ObjS.data.result.url;
                })  
                break;

                case 'slidePhoto1': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $timeout(function () {      
                    spinnerService.hide('html5spinner'); 
                    $scope.createAds.slidePhoto1 = ObjS.data.result.url;
                    }, 250);  
                    // $scope.user.photo6 = ObjS.data.result.url;

                })  
                break;

                case 'slidePhoto2': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $timeout(function () {      
                    spinnerService.hide('html5spinner'); 
                    $scope.createAds.slidePhoto2 = ObjS.data.result.url;
                    }, 250);  
                    // $scope.user.photo6 = ObjS.data.result.url;

                })  
                break;

                case 'slidePhoto3': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $timeout(function () {      
                    spinnerService.hide('html5spinner'); 
                    $scope.createAds.slidePhoto3 = ObjS.data.result.url;
                    }, 250);  
                    // $scope.user.photo6 = ObjS.data.result.url;

                })  
                break;

                case 'slidePhoto4': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $timeout(function () {      
                    spinnerService.hide('html5spinner'); 
                    $scope.createAds.slidePhoto4 = ObjS.data.result.url;
                    }, 250);  
                    // $scope.user.photo6 = ObjS.data.result.url;

                })  
                break;

                case 'slidePhoto5': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $timeout(function () {      
                    spinnerService.hide('html5spinner'); 
                    $scope.createAds.slidePhoto5 = ObjS.data.result.url;
                    }, 250);  
                    // $scope.user.photo6 = ObjS.data.result.url;

                })  
                break;

                case 'slidePhoto6': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $timeout(function () {      
                    spinnerService.hide('html5spinner'); 
                    $scope.createAds.slidePhoto6 = ObjS.data.result.url;
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

                if(type == 'mp3'){

                uploadimgServeice.user(file).then(function(ObjS) {
                    $timeout(function () {      
                    spinnerService.hide('html5spinner'); 
                    $scope.createAds.audioUrl = ObjS.data.result.url;
                    console.log("$scope.createAds.audioUrl",$scope.createAds.audioUrl);
                    }, 250); 
                    //$scope.user.giftImage = ObjS.data.result.url;

                })  
         
                }else{
                    uploadimgServeice.user(file).then(function(ObjS) {
                    $timeout(function () {      
                    spinnerService.hide('html5spinner');   
                    $scope.createAds.vedioUrl = ObjS.data.result.url;
                    console.log("$scope.createAds.url",$scope.createAds.vedioUrl);
                        }, 250);
                })

                }

                 
                
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

    function daysInMonth(month,year) {
            return new Date(year, month, 0).getDate();
        } 

    $scope.expDate = function(date){

        console.log("date",date);

        var currentDate = new Date()
        var year = currentDate.getFullYear();
        var month = 1+currentDate.getMonth();
        console.log("ccccccc",year,month)
        var noOfDaysOne = daysInMonth(month,year);
        var noOfDaysTwo = daysInMonth(month+1,year);
        var noOfDaysThree = daysInMonth(month+2,year); 
        console.log("noOfDays",noOfDaysOne);
        console.log("noOfDays",noOfDaysTwo);
        console.log("noOfDays",noOfDaysThree);
        var one_day = 86400000;
        var currentDateNumber = new Date().getTime();
        console.log("currentDateNumber",currentDateNumber)

        switch (date)
        {
            
            case '1 Week':
            $scope.couponExpiryDate = 86400000*7;
            console.log("1 week",$scope.couponExpiryDate)
     
            break;

            case '2 Weeks': 

            $scope.couponExpiryDate = 86400000*14;
            console.log("2 week",$scope.couponExpiryDate)
              
            break;

            case '3 Weeks': 

            $scope.couponExpiryDate = 86400000*21;
            console.log("3 week",$scope.couponExpiryDate)
              
            break;

            case '1 Month':

            $scope.couponExpiryDate = 86400000*30;
            console.log("1 Month",$scope.couponExpiryDate)
 
            break;

            case '2 Months': 

            $scope.couponExpiryDate = 86400000*60;
            console.log("1 Month",$scope.couponExpiryDate)
              
            break;

            case '3 Months':

            $scope.couponExpiryDate = 86400000*90;
            console.log("1 Month",$scope.couponExpiryDate) 
              
            break;

            default:
            toastr.error("Something Wents to wrong")

        }


    }


    $scope.submit = function(){

    // var onedaymilisecond = 8.64e+7;
    console.log("$scope",JSON.stringify($scope.createAds.pageName));
    pageDetails = JSON.parse($scope.createAds.pageName);
    var whoWillSeeYourAddArray = [];
    var slideShow = [$scope.createAds.slidePhoto1,$scope.createAds.slidePhoto2,$scope.createAds.slidePhoto3,$scope.createAds.slidePhoto4,$scope.createAds.slidePhoto5,$scope.createAds.slidePhoto6];
    var appPhoto = [];
    appPhoto= [$scope.createAds.appPhoto1,$scope.createAds.appPhoto2,$scope.createAds.appPhoto3,$scope.createAds.appPhoto4,$scope.createAds.appPhoto5,$scope.createAds.appPhoto6];
    var promoteAppBoolean = appPhoto.length==0 ? false:true;
    var coverimage = $scope.createAds.adContentType == 'slideshow' ? $scope.createAds.slidePhoto1:$scope.createAds.advertismentCover;
    //console.log("ddadaaradfatya0",JSON.stringify(data));
    var modifyData = {};
    modifyData = {
        userId:adminIdss,
        pageId:pageDetails._id,
        pageName:pageDetails.pageName,
        category:pageDetails.category,
        subCategory:pageDetails.subCategory,
        adsType:$scope.createAds.giftType,
        coverImage:coverimage,
        adContentType:$scope.createAds.adContentType,
        numberOfWinners:$scope.createAds.winner,
        giftDescription:$scope.createAds.giftDescription,
        viewerLength:$scope.createAds.viewers,
        hiddenGifts:$scope.addCode,
        couponLength:$scope.createAds.winner,
        gender:$scope.createAds.gender,
        ageFrom:$scope.createAds.ageFrom,
        ageTo:$scope.createAds.ageTo,
        couponBuyersLength:$scope.createAds.viewers,
        sellCoupon:$scope.createAds.cellThisCoupon,
        whoWillSeeYourAdd:{
            country:$scope.createAds.country,
            state:$scope.createAds.state,
            city:$scope.createAds.city
        },
        couponExpiryDate: $scope.couponExpiryDate,
        googleLink:$scope.createAds.googlePlayLink,
        appStoreLink:$scope.createAds.appStoreLink,
        windowsStoreLink:$scope.createAds.windowStoreLink,
        appIcon:$scope.createAds.appIcon,
        linkDescription:$scope.createAds.linkDescription,
        dawnloadPagePhoto:appPhoto,
        promoteApp:promoteAppBoolean,
        video:$scope.createAds.vedioUrl,
        musicFileName:$scope.createAds.audioUrl,
        slideShow:slideShow,
        brolixFees:$scope.createAds.brolixFees,
        cashAdPrize:$scope.createAds.winnerGift,
  
    }
    console.log("All data -->>"+JSON.stringify(modifyData));
    userService.createAds(modifyData).success(function(res) {
        console.log("ressssssss",JSON.stringify(res))
    if (res.responseCode == 200) {
        toastr.success(res.responseMessage)
    } else {
        toastr.error(res.responseMessage);
        // $state.go('login')
        
    }
    console.log("resss",$scope.userId);
    })
    
   }

    
       


})