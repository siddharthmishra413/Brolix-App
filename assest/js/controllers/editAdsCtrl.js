app.controller('editAdsCtrl', function ($scope, $window, userService,spinnerService,$timeout, uploadimgServeice, $state, toastr, $stateParams, $http) {
$(window).scrollTop(0,0);
$scope.class = true;
$scope.$emit('headerStatus', 'Manage Ads');
$scope.$emit('SideMenu', 'Manage Ads');
$scope.createAds = {};
$scope.cityFirst = true;
$scope.citySecond = false;
$scope.dawnloadPagePhoto = [];
$scope.promoteApp = false;


$scope.downloadPhotoss = function(image){
        console.log("image------------>",image)
        $scope.dawnloadPagePhoto.push(image)
        console.log("$scope.dawnloadPagePhoto",$scope.dawnloadPagePhoto)
        console.log("length:    ",$scope.dawnloadPagePhoto.length);
        $scope.promoteApp = true;
    }

// if ($scope.myForm.checkId == '' || $scope.myForm.checkId == undefined || $scope.myForm.checkId == null) {
//         toastr.error("Please select user.")
//          }
//         else {
//             userService.adInfo($scope.myForm.checkId).then(function(success) { 
//             //console.log(JSON.stringify($scope.userDetail))
//                     $scope.userDetail=success.data.result;
//                     $("#adInfo").modal('show');
//                     //console.log("adInfo>>>>>>>>>>>>>"+JSON.stringify(success))
//                 },function(err){
//                     //console.log(err);
//                      toastr.error('Connection error.');
//             }) 
//         }





console.log("id:"+$stateParams.id);
var id = $stateParams.id;
if(id=="" || id==undefined || id==null)
{
    toastr.error("Please select Add");
    $state.go("header.manageCard");
}
else
{   
    userService.adInfo(id).success(function(res) {
        console.log("res",JSON.stringify(res))
    if (res.responseCode == 200) {
        $scope.createAds = res.result;
        $scope.createAds.country = res.result.whoWillSeeYourAdd.country;
        $scope.createAds.city = res.result.whoWillSeeYourAdd.city;
        console.log("slidesahow",res.result.slideShow)
        console.log("res.result.dawnloadPagePhoto.length",res.result.dawnloadPagePhoto.length)
        console.log("res.result.dawnloadPagePhoto.length",res.result.dawnloadPagePhoto)

        if(res.result.dawnloadPagePhoto.length == 0){
         console.log("ooo")
        }else if(res.result.dawnloadPagePhoto.length == 1){
            $scope.createAds.slidePhoto1 = res.result.dawnloadPagePhoto[0];
        }else if(res.result.dawnloadPagePhoto.length == 2){
            $scope.createAds.slidePhoto1 = res.result.dawnloadPagePhoto[0];
            $scope.createAds.slidePhoto2 = res.result.dawnloadPagePhoto[1];
        }else if(res.result.dawnloadPagePhoto.length == 3){
            $scope.createAds.slidePhoto1 = res.result.dawnloadPagePhoto[0];
            $scope.createAds.slidePhoto2 = res.result.dawnloadPagePhoto[1];
            $scope.createAds.slidePhoto3 = res.result.dawnloadPagePhoto[2];
        }else if(res.result.dawnloadPagePhoto.length == 4){
            $scope.createAds.slidePhoto1 = res.result.dawnloadPagePhoto[0];
            $scope.createAds.slidePhoto2 = res.result.dawnloadPagePhoto[1];
            $scope.createAds.slidePhoto3 = res.result.dawnloadPagePhoto[2];
            $scope.createAds.slidePhoto4 = res.result.dawnloadPagePhoto[3];
        }else if(res.result.dawnloadPagePhoto.length == 5){
            $scope.createAds.slidePhoto1 = res.result.dawnloadPagePhoto[0];
            $scope.createAds.slidePhoto2 = res.result.dawnloadPagePhoto[1];
            $scope.createAds.slidePhoto3 = res.result.dawnloadPagePhoto[2];
            $scope.createAds.slidePhoto4 = res.result.dawnloadPagePhoto[3];
            $scope.createAds.slidePhoto5 = res.result.dawnloadPagePhoto[4];
        }else if(res.result.dawnloadPagePhoto.length == 6){
            console.log("l")
            $scope.createAds.slidePhoto1 = res.result.slideShow[0];
            console.log("$scope.createAds.slidePhoto1",$scope.createAds.slidePhoto1);
            $scope.createAds.slidePhoto2 = res.result.dawnloadPagePhoto[1];
            $scope.createAds.slidePhoto3 = res.result.dawnloadPagePhoto[2];
            $scope.createAds.slidePhoto4 = res.result.dawnloadPagePhoto[3];
            $scope.createAds.slidePhoto5 = res.result.dawnloadPagePhoto[4];
            $scope.createAds.slidePhoto6 = res.result.dawnloadPagePhoto[5];
        }
        

        console.log("country",$scope.createAds.country)
        console.log("city",$scope.createAds.city)
        if(res.result.adsType)
        {
        $scope.createAds.giftType = res.result.adsType;
        if(res.result.adContentType) {
            if(res.result.adContentType=="slideshow"){
                 $scope.slideStep4 = true;
            }else if(res.result.adContentType=="video"){
                $scope.vedioStep4 = true;
            }else{
                toastr.error(res.responseMessage);
                $state.go('login')
            }
        } 
        else
        {
         $scope.value ='';
        }
        }
    } else {
        toastr.error(res.responseMessage);
        $state.go('login')
    }
    //console.log("resss",$scope.userId);
})

	// var data = {params: {user_id: id}}
 // userService.adInfo(id).then(function(objS){
 //      console.log('success: -->  '+objS);
 //      $scope.createAds = objS.data.result;
 //      console.log('image: -->  '+JSON.stringify($scope.createAds.slideShow[0]));
 //      if(objS.data.result.adsType)
 //      {
 //      	$scope.createAds.giftType = objS.data.result.adsType;
 //      if(objS.data.result.adContentType) {
 //        if(objS.data.result.adContentType=="slideshow")
 //        		$scope.slideStep4 = true;
 //        	else if(objS.data.result.adContentType=="video")
 //        		$scope.vedioStep4 = true;
 //      } 
 //      else
 //      {
 //         $scope.value ='';
 //      }
 //    }
 //    },function(objE){
 //      console.log('error:    '+JSON.stringify(objE))
 //    });

}

userService.countryListData().success(function(res) {
     //console.log("ddd",JSON.stringify(res))
     $scope.countries = res.result;
     //console.log("ddd",JSON.stringify($scope.countries))
   })

   $scope.changeCountry = function(){
     var obj = {};
     obj = {
       country:$scope.createAds.country
     }
     userService.cityListData(obj).success(function(res) {
     console.log("ddd",JSON.stringify(res))
     $scope.cityList = res.result;
   })
   }

$scope.promoteAppGame = {};
$scope.addCode = [];
$scope.promoteAppValidation = [];


$scope.validation =  function(item){
    $scope.promoteAppValidation.push(item);
}

//$scope.createAds.advertismentCover='../dist/image/cover.jpg';


$scope.addcode = function(code){
    if($scope.addCode.length<$scope.createAds.numberOfWinners){
    //console.log("code",code)
    $scope.addCode.push(code);
    $scope.createAds.hiddenCode="";
    //console.log("addcode",$scope.addCode)

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

                case 'cellThisCouponTerms': 
                $("#cellThisCouponTerms").modal('show');  
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

    //console.log("helll")
   
}

userService.adminProfile().success(function(res) {
    if (res.responseCode == 200) {
        $scope.userId = res.result._id; 
        //console.log("$scope.userId",$scope.userId)
        localStorage.setItem('adminId',$scope.userId);
    } else {
        toastr.error(res.responseMessage);
        $state.go('login')
        
    }
    //console.log("resss",$scope.userId);
})

var adminIdss = localStorage.getItem('adminId');
//console.log("userId",adminIdss)

userService.getPage().then(function(success) { 
        $scope.pageDetail=success.data.result;
        //console.log("Page>>>>>>>>>>"+JSON.stringify($scope.pageDetail))
    },function(err){
        console.log(err);
         toastr.error('Connection error.');
}) 

//api for getting data from user to show first page at edit ads
 
 $scope.Step5 = false;
 $scope.Step6 = false;
 
 $scope.promoteApp = false;
 $scope.cashStep5 = false;

 $scope.click = function(type){
    //console.log("createAds.pageName",JSON.stringify($scope.createAds))
    //console.log("type",type)
    // if(type == 'Step2'){
    //     $scope.Step1 = false;
    //     $scope.Step2 = true;
    //     $scope.Step3 = false;
    //     $scope.vedioStep4 = false;
    //     $scope.Step5 = false;
    //     $scope.Step6 = false;
    //     $scope.slideStep4 = false;
    //     $scope.promoteApp = false;
    //     $scope.cashStep5 = false;
    //     console.log("createAds.pageName",JSON.stringify($scope.createAds))
    // }else if(type == 'Back2'){
    //     $scope.Step1 = true;
    //     $scope.Step2 = false;
    //     $scope.Step3 = false;
    //     $scope.vedioStep4 = false;
    //     $scope.Step5 = false;
    //     $scope.Step6 = false;
    //     $scope.slideStep4 = false;
    //     $scope.promoteApp = false;
    //     $scope.cashStep5 = false;
    //     console.log("createAds.pageName",JSON.stringify($scope.createAds))

    // }else if(type == 'Step3'){
    //     $scope.Step1 = false;
    //     $scope.Step2 = false;
    //     $scope.Step3 = true;
    //     $scope.vedioStep4 = false;
    //     $scope.Step5 = false;
    //     $scope.Step6 = false;
    //     $scope.slideStep4 = false;
    //     $scope.promoteApp = false;
    //     $scope.cashStep5 = false;
    //     console.log("createAds.pageName",JSON.stringify($scope.createAds))

    // }else if(type == 'Back3'){
    //     $scope.Step1 = false;
    //     $scope.Step2 = true;
    //     $scope.Step3 = false;
    //     $scope.vedioStep4 = false;
    //     $scope.Step5 = false;
    //     $scope.Step6 = false;
    //     $scope.slideStep4 = false;
    //     $scope.promoteApp = false;
    //     $scope.cashStep5 = false;
    //     console.log("createAds.pageName",JSON.stringify($scope.createAds))

    // }else 
    	if(type == 'video'){
        $scope.Step1 = false;
        $scope.Step2 = false;
        $scope.Step3 = false;
        $scope.vedioStep4 = true;
        $scope.Step5 = false;
        $scope.Step6 = false;
        $scope.slideStep4 = false;
        $scope.promoteApp = false;
        $scope.cashStep5 = false;
       //console.log("createAds.pageName",JSON.stringify($scope.createAds))

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
        //console.log("createAds.pageName",JSON.stringify($scope.createAds))

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
            //console.log("createAds.pageName",JSON.stringify($scope.createAds))
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
            //console.log("createAds.pageName",JSON.stringify($scope.createAds))
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
            //console.log("createAds.pageName",JSON.stringify($scope.createAds))
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
       //console.log("createAds.pageName",JSON.stringify($scope.createAds))

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
        //console.log("createAds.pageName",JSON.stringify($scope.createAds))

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
            //console.log("createAds.pageName",JSON.stringify($scope.createAds))
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
            //console.log("createAds.pageName",JSON.stringify($scope.createAds))

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
       //console.log("createAds.pageName",JSON.stringify($scope.createAds))

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
            //console.log("createAds.pageName",JSON.stringify($scope.createAds))
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

     //spinnerService.show('html5spinner');  
       var file = input.files[0];
       //console.log("input type",input.files[0])
       var ext = file.name.split('.').pop();
       if (ext == "mp3" || ext == "jpg" || ext == "jpeg" || ext == "bmp" || ext == "gif" || ext == "png" || ext == "3gp" || ext == "mp4" || ext == "flv" || ext == "avi" || ext == "wmv") {
           $scope.imageName = file.name;
           //console.log("$scope.imageName",$scope.imageName)
           $scope.createAds.type = file.type;
           //console.log("$scope.createAds.type",$scope.createAds.type)
           if(file.type.split('/')[0]=='image') {
                switch (type)
            {
                
                case 'advertismentCover': 
                uploadimgServeice.user(file).then(function(ObjS) {
                     $timeout(function () {      
                //.hide('html5spinner');   
                    $scope.createAds.advertismentCover = ObjS.data.result.url;
                    
                        }, 250);  
                    // $scope.user.photo1 = ObjS.data.result.url;
                    console.log("advertismentCover",$scope.createAds.advertismentCover)
                })  
                break;

                case 'appPhoto1': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $scope.createAds.appPhoto1 = ObjS.data.result.url;
                    $scope.downloadPhotoss($scope.createAds.appPhoto1);
                //      $timeout(function () {      
                // spinnerService.hide('html5spinner');   
                    
                    
                //         }, 250);  
                    // $scope.user.photo1 = ObjS.data.result.url;
                    console.log("image",$scope.createAds.photo1)
                })  
                break;

                case 'appPhoto2': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $scope.createAds.appPhoto2 = ObjS.data.result.url;
                    $scope.downloadPhotoss($scope.createAds.appPhoto2);
                    // $timeout(function () {      
                    // spinnerService.hide('html5spinner'); 
                    
                    // }, 250);  
                    // $scope.user.photo2 = ObjS.data.result.url;
                    console.log("image",$scope.createAds.photo2)
                })  
                break;

                case 'appPhoto3': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $scope.createAds.appPhoto3 = ObjS.data.result.url;
                    $scope.downloadPhotoss($scope.createAds.appPhoto3);
                    // $timeout(function () {      
                    // spinnerService.hide('html5spinner'); 
                    
                    // }, 250); 
                    // $scope.user.photo3 = ObjS.data.result.url;
                })  
                break;

                case 'appPhoto4': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $scope.createAds.appPhoto4 = ObjS.data.result.url;
                    $scope.downloadPhotoss($scope.createAds.appPhoto4);
                    // $timeout(function () {      
                    // spinnerService.hide('html5spinner');
                    
                    //     }, 250);  
                    // $scope.user.photo4 = ObjS.data.result.url;
                })  
                break;

                case 'appPhoto5': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $scope.createAds.appPhoto5 = ObjS.data.result.url;
                    $scope.downloadPhotoss($scope.createAds.appPhoto5);
                    // $timeout(function () {      
                    // spinnerService.hide('html5spinner'); 
                    
                    // }, 250);  
                    // $scope.user.photo5 = ObjS.data.result.url;
                })  
                break;

                case 'appPhoto6': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $scope.createAds.appPhoto6 = ObjS.data.result.url;
                    $scope.downloadPhotoss($scope.createAds.appPhoto6);
                    // $timeout(function () {      
                    // spinnerService.hide('html5spinner'); 
                    
                    // }, 250);  
                    // $scope.user.photo6 = ObjS.data.result.url;

                })  
                break;

                case 'appIcon': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $scope.createAds.appIcon = ObjS.data.result.url;
                    // $timeout(function () {      
                    // spinnerService.hide('html5spinner'); 
                    
                    // }, 250);  
                    // $scope.user.appIcon = ObjS.data.result.url;
                })  
                break;

                case 'slidePhoto1': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $scope.createAds.slidePhoto1 = ObjS.data.result.url;
                    // $timeout(function () {      
                    // spinnerService.hide('html5spinner'); 
                    
                    // }, 250);  
                    // $scope.user.photo6 = ObjS.data.result.url;

                })  
                break;

                case 'slidePhoto2': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $scope.createAds.slidePhoto2 = ObjS.data.result.url;
                    // $timeout(function () {      
                    // spinnerService.hide('html5spinner'); 
                    
                    // }, 250);  
                    // $scope.user.photo6 = ObjS.data.result.url;

                })  
                break;

                case 'slidePhoto3': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $scope.createAds.slidePhoto3 = ObjS.data.result.url;
                    // $timeout(function () {      
                    // spinnerService.hide('html5spinner'); 
                    
                    // }, 250);  
                    // $scope.user.photo6 = ObjS.data.result.url;

                })  
                break;

                case 'slidePhoto4': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $scope.createAds.slidePhoto4 = ObjS.data.result.url;
                    // $timeout(function () {      
                    // spinnerService.hide('html5spinner'); 
                    
                    // }, 250);  
                    // $scope.user.photo6 = ObjS.data.result.url;

                })  
                break;

                case 'slidePhoto5': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $scope.createAds.slidePhoto5 = ObjS.data.result.url;
                    // $timeout(function () {      
                    // spinnerService.hide('html5spinner'); 
                    
                    // }, 250);  
                    // $scope.user.photo6 = ObjS.data.result.url;

                })  
                break;

                case 'slidePhoto6': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $scope.createAds.slidePhoto6 = ObjS.data.result.url;
                    // $timeout(function () {      
                    // spinnerService.hide('html5spinner'); 
                    
                    // }, 250);  
                    // $scope.user.photo6 = ObjS.data.result.url;

                })  
                break;

                case 'adCover': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $scope.createAds.adCover = ObjS.data.result.url;
                    // $timeout(function () {      
                    // spinnerService.hide('html5spinner'); 
                    
                    // }, 250);  
                    console.log('adsType Image in video-->>>'+$scope.createAds.adCover)
                    console.log(JSON.stringify($scope.createAds.adCover))
                })  
                break;

                

                case 'appPhoto1': 
                uploadimgServeice.user(file).then(function(ObjS) {
                     $scope.promoteAppGame.appPhoto1 = ObjS.data.result.url;
                    // $timeout(function () {      
                    // spinnerService.hide('html5spinner'); 
                  
                    // }, 250);  
                    // $scope.user.downloadPhoto1 = ObjS.data.result.url;

                })  
                break;
                case 'appPhoto2': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $scope.promoteAppGame.appPhoto2 = ObjS.data.result.url;
                    // $timeout(function () {      
                    // spinnerService.hide('html5spinner'); 
                    
                    // }, 250);  
                    // $scope.user.downloadPhoto2 = ObjS.data.result.url;
                })  
                break;

                case 'appPhoto3': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $scope.promoteAppGame.appPhoto3 = ObjS.data.result.url;
                    // $timeout(function () {      
                    // spinnerService.hide('html5spinner'); 
                    
                    // }, 250);  
                    //$scope.user.downloadPhoto3 = ObjS.data.result.url;
                })  
                break;

                case 'appPhoto4': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $scope.promoteAppGame.appPhoto4 = ObjS.data.result.url;
                    // $timeout(function () {      
                    // spinnerService.hide('html5spinner'); 
                    
                    // }, 250);  
                    //$scope.user.downloadPhoto4 = ObjS.data.result.url;

                })  
                break;

                case 'giftImage': 
                uploadimgServeice.user(file).then(function(ObjS) {
                    $scope.createAds.giftImage = ObjS.data.result.url;
                    // $timeout(function () {      
                    // spinnerService.hide('html5spinner'); 
                    
                    // }, 250); 
                    //$scope.user.giftImage = ObjS.data.result.url;

                })  
                break;

                

                default: 
                toastr.error("Somthing wents to wroung")
                
            }
            } else {

                if(type == 'mp3'){

                uploadimgServeice.user(file).then(function(ObjS) {
                    $scope.createAds.audioUrl = ObjS.data.result.url;
                    console.log("$scope.createAds.audioUrl",$scope.createAds.audioUrl);
                    // $timeout(function () {      
                    // spinnerService.hide('html5spinner'); 
                    
                    // }, 250); 
                    //$scope.user.giftImage = ObjS.data.result.url;

                })  
         
                }else{
                    uploadimgServeice.user(file).then(function(ObjS) {
                        $scope.createAds.vedioUrl = ObjS.data.result.url;
                    console.log("$scope.createAds.url",$scope.createAds.vedioUrl);
                    // $timeout(function () {      
                    // spinnerService.hide('html5spinner');   
                    
                    //     }, 250);
                })

                }

                 
                
            }          
       }else{
           toastr.error("Only image supported.")
       }        
   }




    function daysInMonth(month,year) {
            return new Date(year, month, 0).getDate();
        } 

  $scope.expDate = function(date) {
        var currentDate = new Date()
        var year = currentDate.getFullYear();
        var month = 1 + currentDate.getMonth();
        var noOfDaysOne = daysInMonth(month, year);
        var noOfDaysTwo = daysInMonth(month + 1, year);
        var noOfDaysThree = daysInMonth(month + 2, year);
        var one_day = 86400000;
        var currentDateNumber = new Date().getTime();

        switch (date) {
            case '':
                 $scope.couponExpiryDate = 'NEVER';
                break;

            case '1 Week':
                $scope.couponExpiryDate = 86400000 * 7;
                break;

            case '2 Weeks':

                $scope.couponExpiryDate = 86400000 * 14;
                break;

            case '3 Weeks':

                $scope.couponExpiryDate = 86400000 * 21;
                break;

            case '1 Month':

                $scope.couponExpiryDate = 86400000 * 30;
                break;

            case '2 Months':

                $scope.couponExpiryDate = 86400000 * 60;
                break;

            case '3 Months':

                $scope.couponExpiryDate = 86400000 * 90;
                break;

            default:
                toastr.error("Something Wents to wrong")

        }
    }


    $scope.updateAdd = function() {
        $scope.adId = $stateParams.id;
        $scope.userId = adminIdss;
        if($scope.createAds.giftType == 'coupon'){
            if($scope.createAds.adContentType == 'video'){
                modifyData = {
                    userId: adminIdss,
                    pageId: $scope.createAds._id,
                    pageName: $scope.createAds.pageName,
                    category: $scope.createAds.category,
                    subCategory: $scope.createAds.subCategory,
                    adsType: $scope.createAds.giftType,
                    coverImage: $scope.createAds.coverImage,
                    adContentType: $scope.createAds.adContentType,
                    numberOfWinners: $scope.createAds.numberOfWinners,
                    allAreWinners: $scope.createAds.allAreWinners,
                    giftDescription: $scope.createAds.giftDescription,
                    viewerLength: $scope.createAds.viewers,
                    hiddenGifts: $scope.addCode,
                    couponLength: $scope.createAds.numberOfWinners,
                    uploadGiftImage:$scope.createAds.gifyDescImage,
                    gender: $scope.createAds.gender,
                    ageFrom: $scope.createAds.ageFrom,
                    ageTo: $scope.createAds.ageTo,
                    couponBuyersLength: $scope.createAds.viewers,
                    sellCoupon: $scope.createAds.cellThisCoupon,
                    whoWillSeeYourAdd: {
                    country: $scope.createAds.country,
                    city: $scope.createAds.city
                    },
                    couponExpiryDate: $scope.couponExpiryDate,
                    appName:$scope.createAds.appName,
                    googleLink: $scope.createAds.googleLink,
                    appStoreLink: $scope.createAds.appStoreLink,
                    windowsStoreLink: $scope.createAds.windowsStoreLink,
                    appIcon: $scope.createAds.appIcon,
                    linkDescription: $scope.createAds.linkDescription,
                    dawnloadPagePhoto: $scope.dawnloadPagePhoto,
                    promoteApp: $scope.promoteApp,
                    video: $scope.createAds.vedioUrl,
                    couponExpiryInString:$scope.couponExpiryInString
                }

                
                userService.editAds($scope.adId,$scope.userId,modifyData).success(function(res) {
                    console.log("ressssssss",JSON.stringify(res))
                    if (res.responseCode == 200) {
                        toastr.success(res.responseMessage)
                        $state.go('header.manageAds')
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })

            }else if($scope.createAds.adContentType == 'slideshow'){
                modifyData = {
                    userId: adminIdss,
                    pageId: $scope.createAds._id,
                    pageName: $scope.createAds.pageName,
                    category: $scope.createAds.category,
                    subCategory: $scope.createAds.subCategory,
                    adsType: $scope.createAds.giftType,
                    slideShow:$scope.slideshowPhoto,
                    adContentType: $scope.createAds.adContentType,
                    numberOfWinners: $scope.createAds.numberOfWinners,
                    allAreWinners: $scope.createAds.allAreWinners,
                    giftDescription: $scope.createAds.giftDescription,
                    viewerLength: $scope.createAds.viewers,
                    hiddenGifts: $scope.addCode,
                    couponLength: $scope.createAds.numberOfWinners,
                    uploadGiftImage:$scope.createAds.gifyDescImage,
                    gender: $scope.createAds.gender,
                    ageFrom: $scope.createAds.ageFrom,
                    ageTo: $scope.createAds.ageTo,
                    couponBuyersLength: $scope.createAds.viewers,
                    sellCoupon: $scope.createAds.cellThisCoupon,
                    whoWillSeeYourAdd: {
                    country: $scope.createAds.country,
                    city: $scope.createAds.city
                    },
                    couponExpiryDate: $scope.couponExpiryDate,
                    appName:$scope.createAds.appName,
                    googleLink: $scope.createAds.googlePlayLink,
                    appStoreLink: $scope.createAds.appStoreLink,
                    windowsStoreLink: $scope.createAds.windowStoreLink,
                    appIcon: $scope.createAds.appIcon,
                    linkDescription: $scope.createAds.linkDescription,
                    dawnloadPagePhoto: $scope.dawnloadPagePhoto,
                    promoteApp: $scope.promoteApp,
                    musicFileName: $scope.createAds.audioUrl,
                    couponExpiryInString:$scope.couponExpiryInString
                }

                console.log("modifyData",JSON.stringify(modifyData))
                userService.editAds(modifyData).success(function(res) {
                    console.log("ressssssss",JSON.stringify(res))
                    if (res.responseCode == 200) {
                        toastr.success(res.responseMessage)
                        $state.go('header.manageAds')
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
            }

        }else if($scope.createAds.giftType == 'cash'){
             if($scope.createAds.adContentType == 'video'){
                modifyData = {
                    userId: adminIdss,
                    pageId: pageDetails._id,
                    pageName: pageDetails.pageName,
                    category: pageDetails.category,
                    subCategory: pageDetails.subCategory,
                    adsType: $scope.createAds.giftType,
                    coverImage: $scope.createAds.advertismentCover,
                    adContentType: $scope.createAds.adContentType,
                    numberOfWinners: $scope.createAds.numberOfWinners,
                    viewerLength: $scope.createAds.viewers,
                    gender: $scope.createAds.gender,
                    ageFrom: $scope.createAds.ageFrom,
                    ageTo: $scope.createAds.ageTo,
                    couponBuyersLength: $scope.createAds.viewers,
                    whoWillSeeYourAdd: {
                    country: $scope.createAds.country,
                    city: $scope.createAds.city
                    },
                    appName:$scope.createAds.appName,
                    googleLink: $scope.createAds.googlePlayLink,
                    appStoreLink: $scope.createAds.appStoreLink,
                    windowsStoreLink: $scope.createAds.windowStoreLink,
                    appIcon: $scope.createAds.appIcon,
                    linkDescription: $scope.createAds.linkDescription,
                    dawnloadPagePhoto: $scope.dawnloadPagePhoto,
                    promoteApp: $scope.promoteApp,
                    video: $scope.createAds.vedioUrl,
                    brolixFees:$scope.createAds.brolixFees,
                    cashAdPrize: $scope.createAds.viewersOne,
                    couponExpiryInString:$scope.couponExpiryInString
                }

                console.log("modifyData111",JSON.stringify(modifyData))
                userService.editAds(modifyData).success(function(res) {
                    console.log("ressssssss",JSON.stringify(res))
                    if (res.responseCode == 200) {
                        toastr.success(res.responseMessage)
                        $state.go('header.manageAds')
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })


            }else if($scope.createAds.adContentType == 'slideshow'){
                modifyData = {
                    userId: adminIdss,
                    pageId: pageDetails._id,
                    pageName: pageDetails.pageName,
                    category: pageDetails.category,
                    subCategory: pageDetails.subCategory,
                    adsType: $scope.createAds.giftType,
                    slideShow:$scope.slideshowPhoto,
                    adContentType: $scope.createAds.adContentType,
                    numberOfWinners: $scope.createAds.numberOfWinners,
                    allAreWinners: $scope.createAds.allAreWinners,
                    giftDescription: $scope.createAds.giftDescription,
                    viewerLength: $scope.createAds.viewers,
                    hiddenGifts: $scope.addCode,
                    couponLength: $scope.createAds.numberOfWinners,
                    uploadGiftImage:$scope.createAds.gifyDescImage,
                    gender: $scope.createAds.gender,
                    ageFrom: $scope.createAds.ageFrom,
                    ageTo: $scope.createAds.ageTo,
                    couponBuyersLength: $scope.createAds.viewers,
                    sellCoupon: $scope.createAds.cellThisCoupon,
                    whoWillSeeYourAdd: {
                    country: $scope.createAds.country,
                    city: $scope.createAds.city
                    },
                    couponExpiryDate: $scope.couponExpiryDate,
                    appName:$scope.createAds.appName,
                    googleLink: $scope.createAds.googlePlayLink,
                    appStoreLink: $scope.createAds.appStoreLink,
                    windowsStoreLink: $scope.createAds.windowStoreLink,
                    appIcon: $scope.createAds.appIcon,
                    linkDescription: $scope.createAds.linkDescription,
                    dawnloadPagePhoto: $scope.dawnloadPagePhoto,
                    promoteApp: $scope.promoteApp,
                    musicFileName: $scope.createAds.audioUrl,
                    brolixFees:$scope.createAds.brolixFees,
                    cashAdPrize: $scope.createAds.viewersOne,
                    couponExpiryInString:$scope.couponExpiryInString
                }

                console.log("modifyData",JSON.stringify(modifyData))
                userService.editAds(modifyData).success(function(res) {
                    console.log("ressssssss",JSON.stringify(res))
                    if (res.responseCode == 200) {
                        toastr.success(res.responseMessage)
                        $state.go('header.manageAds')
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                
            }

        }
    }

})