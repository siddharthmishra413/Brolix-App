app.controller('editAdsCtrl', function ($scope, $window, userService,spinnerService,$timeout, uploadimgServeice, $state, toastr, $stateParams, $http) {
$(window).scrollTop(0,0);
$scope.class = true;
$scope.$emit('headerStatus', 'Manage Ads');
$scope.$emit('SideMenu', 'Manage Ads');
$scope.createAds = {};
$scope.cityFirst = true;
$scope.citySecond = false;
$scope.dawnloadPagePhoto = [];
$scope.selectedMusic = '';
$scope.promoteApp = false;

$scope.slideshowPhotoFun = function(image){
        console.log("image------------>",image)
        $scope.slideshowPhoto.push(image)
        console.log("$scope.slideshowPhoto",$scope.slideshowPhoto)
    }

$scope.downloadPhotoss = function(image){
        console.log("image------------>",image)
        $scope.dawnloadPagePhoto.push(image)
        console.log("$scope.dawnloadPagePhoto",$scope.dawnloadPagePhoto)
        console.log("length:    ",$scope.dawnloadPagePhoto.length);
        $scope.promoteApp = true;
    }
$scope.rmGiftImg =function(){
        $scope.createAds.gifyDescImage = '';
        $scope.showCam = false;
        console.log("gift =>"+$scope.createAds.gifyDescImage)
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

$scope.cardImSel = function(coverIm){
        console.log("Selected =>"+coverIm)
        if(coverIm == '1'){
            $scope.card_img = '1';
            $scope.coverImg = $scope.createAds.slidePhoto1;
        }
        else if(coverIm == '2'){
            $scope.card_img = '2';
            $scope.coverImg = $scope.createAds.slidePhoto2;
        }
        else if(coverIm == '3'){
            $scope.card_img = '3';
            $scope.coverImg = $scope.createAds.slidePhoto3;
        }
        else if(coverIm == '4'){
            $scope.card_img = '4';
            $scope.coverImg = $scope.createAds.slidePhoto4;
        }
        else if(coverIm == '5'){
            $scope.card_img = '5';
            $scope.coverImg = $scope.createAds.slidePhoto5;
        }
        else if(coverIm == '6'){
            $scope.card_img = '6';
            $scope.coverImg = $scope.createAds.slidePhoto6;
        }
        else{
            $scope.card_img = '';
            $scope.coverImg = '';
        }
        console.log("cover image=>"+$scope.coverImg)

    }

// userService.musicList().success(function(res) {
//     console.log("ressssssss",JSON.stringify(res))
//     if (res.responseCode == 200) {
//         $scope.music = res.result;
//         // toastr.success(res.responseMessage)
//         for(var i=0;i<$scope.music.length;i++){
//             if($scope.selectedMusic == $scope.music[i].fileUrl){
//                $scope.musicSelected = $scope.music[i].fileName;
//                 console.log('musicSelected =>'+$scope.musicSelected) 
//             } 
//         }
//     } else {
//         toastr.error(res.responseMessage);
//     }
// }) 



console.log("id:"+$stateParams.id);
$scope.slideshowPhoto = [];
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
        $scope.createAds.viewers = res.result.viewerLenght;
        $scope.createAds.couponExpiryDate = res.result.couponExpiryInString;
        $scope.createAds.country = res.result.whoWillSeeYourAdd.country;
        $scope.createAds.city = res.result.whoWillSeeYourAdd.city;
        $scope.createAds.ageFrom = res.result.ageFrom;
        $scope.createAds.ageTo = res.result.ageTo;
        $scope.createAds.winner = res.result.numberOfWinners;
        $scope.createAds.allAreWinners = JSON.stringify(res.result.allAreWinners);
        $scope.createAds.cellThisCoupon = JSON.stringify(res.result.sellCoupon);
        $scope.slideshowPhoto = res.result.slideShow;
        $scope.createAds.gifyDescImage = res.result.uploadGiftImage;
        if($scope.createAds.gifyDescImage != null || $scope.createAds.gifyDescImage != '' || $scope.createAds.gifyDescImage !=undefined)
           $scope.showCam = true; 
        $scope.selectedMusic = res.result.musicFileName;
        userService.musicList().success(function(res) {
            console.log("ressssssss",JSON.stringify(res))
            if (res.responseCode == 200) {
                $scope.mmm = res.result;
                for(var i=0;i<$scope.mmm.length;i++){
                    if($scope.selectedMusic == $scope.mmm[i].fileUrl){
                       $scope.musicSelected = $scope.mmm[i].fileName;
                        console.log('musicSelected =>'+$scope.musicSelected) 
                    } 
                }
                // toastr.success(res.responseMessage)
            } else {
                toastr.error(res.responseMessage);
            }
        }) 
        for(i=0;i<res.result.slideShow.length; i++){
            if(res.result.coverImage == res.result.slideShow[i])
              {
                var cov = i+1;
                $scope.card_img = JSON.stringify(cov);
                $scope.coverImg =res.result.coverImage;
              }
              else{
                $scope.coverImg = res.result.coverImage;
              }

        }
        // $scope.cover = res.result.coverImage;


        console.log("slidesahow",res.result.slideShow)
        console.log("res.result.dawnloadPagePhoto.length",res.result.slideShow.length)
        console.log("res.result.dawnloadPagePhoto.length",res.result.slideShow)

        if(res.result.slideShow.length == 0){
         console.log("ooo")
        }else if(res.result.slideShow.length == 1){
            $scope.createAds.slidePhoto1 = res.result.slideShow[0];
        }else if(res.result.slideShow.length == 2){
            $scope.createAds.slidePhoto1 = res.result.slideShow[0];
            $scope.createAds.slidePhoto2 = res.result.slideShow[1];
        }else if(res.result.slideShow.length == 3){
            $scope.createAds.slidePhoto1 = res.result.slideShow[0];
            $scope.createAds.slidePhoto2 = res.result.slideShow[1];
            $scope.createAds.slidePhoto3 = res.result.slideShow[2];
        }else if(res.result.slideShow.length == 4){
            $scope.createAds.slidePhoto1 = res.result.slideShow[0];
            $scope.createAds.slidePhoto2 = res.result.slideShow[1];
            $scope.createAds.slidePhoto3 = res.result.slideShow[2];
            $scope.createAds.slidePhoto4 = res.result.slideShow[3];
        }else if(res.result.slideShow.length == 5){
            $scope.createAds.slidePhoto1 = res.result.slideShow[0];
            $scope.createAds.slidePhoto2 = res.result.slideShow[1];
            $scope.createAds.slidePhoto3 = res.result.slideShow[2];
            $scope.createAds.slidePhoto4 = res.result.slideShow[3];
            $scope.createAds.slidePhoto5 = res.result.slideShow[4];
        }else if(res.result.slideShow.length == 6){
            console.log("l")
            $scope.createAds.slidePhoto1 = res.result.slideShow[0];
            console.log("$scope.createAds.slidePhoto1",$scope.createAds.slidePhoto1);
            $scope.createAds.slidePhoto2 = res.result.slideShow[1];
            $scope.createAds.slidePhoto3 = res.result.slideShow[2];
            $scope.createAds.slidePhoto4 = res.result.slideShow[3];
            $scope.createAds.slidePhoto5 = res.result.slideShow[4];
            $scope.createAds.slidePhoto6 = res.result.slideShow[5];
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

 $scope.chooseMusic =function(){
         $("#musicList").modal('show');
         userService.musicList().success(function(res) {
                    console.log("ressssssss",JSON.stringify(res))
                    if (res.responseCode == 200) {
                        $scope.music = res.result;
                        // toastr.success(res.responseMessage)
                    } else {
                        toastr.error(res.responseMessage);
                    }
        }) 
    }

    $scope.musicUrl = '';
    $scope.submitMusic =function(musicName){
        $scope.musicUrl = musicName;
        console.log("Music Name=>"+$scope.musicUrl)
    }
    $scope.subMusic = function(){
        console.log("Music Name=>"+$scope.musicUrl)
        $scope.selectedMusic = $scope.musicUrl;
        for(var i=0;i<$scope.music.length;i++){
            if($scope.selectedMusic == $scope.music[i].fileUrl){
               $scope.musicSelected = $scope.music[i].fileName;
                console.log('musicSelected =>'+$scope.musicSelected) 
            } 
        }
        
        if($scope.musicUrl == ''||$scope.musicUrl == null || $scope.musicUrl == undefined){
            toastr.error("Please Select music.");
        }
        else
            $("#musicList").modal('hide');
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
var a = localStorage.getItem('em');;
    console.log("Em =>"+a)
    var req = {
      email : a
    }

userService.adminProfile(req).success(function(res) {
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
        $scope.Step7 = false;
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
        $scope.Step7 = false;
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
            $scope.Step7 = false;
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
            $scope.Step7 = false;
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
            $scope.Step7 = false;
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
            $scope.Step7 = false;
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
        $scope.Step7 = false;
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
        $scope.Step7 = false;
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
            $scope.Step7 = false;
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
            $scope.Step7 = false;
            $scope.slideStep4 = false;
            $scope.promoteApp = false;
            $scope.cashStep5 = true;
            //console.log("createAds.pageName",JSON.stringify($scope.createAds))

        }

    }else if (type == 'Step7') {
            $scope.Step1 = false;
            $scope.Step2 = false;
            $scope.Step3 = false;
            $scope.vedioStep4 = false;
            $scope.Step5 = false;
            $scope.Step6 = false;
            $scope.Step7 = true;
            $scope.slideStep4 = false;
            $scope.promoteApp = false;
            $scope.cashStep5 = false;
        }
        else if (type == 'Back7') {
            if ($scope.createAds.giftType == 'coupon') {
                $scope.Step1 = false;
                $scope.Step2 = false;
                $scope.Step3 = false;
                $scope.vedioStep4 = false;
                $scope.Step7 = false;
                $scope.Step5 = false;
                $scope.Step6 = true;
                $scope.slideStep4 = false;
                $scope.promoteApp = false;
                $scope.cashStep5 = false;
            } else if ($scope.createAds.giftType == 'cash') {
                $scope.Step1 = false;
                $scope.Step2 = false;
                $scope.Step3 = false;
                $scope.vedioStep4 = false;
                $scope.Step7 = false;
                $scope.Step5 = false;
                $scope.Step6 = false;
                $scope.slideStep4 = false;
                $scope.promoteApp = false;
                $scope.cashStep5 = true;
            }

        } 
        else if(type == 'promoteApp'){
        $scope.Step1 = false;
        $scope.Step2 = false;
        $scope.Step3 = false;
        $scope.vedioStep4 = false;
        $scope.Step7 = false;
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
            $scope.Step7 = false;
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
            $scope.Step7 = false;
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


// $scope.changeImage = function(input,type) {
//     console.log("type",type)

//      //spinnerService.show('html5spinner');  
//        var file = input.files[0];
//        //console.log("input type",input.files[0])
//        var ext = file.name.split('.').pop();
//        if (ext == "mp3" || ext == "jpg" || ext == "jpeg" || ext == "bmp" || ext == "gif" || ext == "png" || ext == "3gp" || ext == "mp4" || ext == "flv" || ext == "avi" || ext == "wmv") {
//            $scope.imageName = file.name;
//            //console.log("$scope.imageName",$scope.imageName)
//            $scope.createAds.type = file.type;
//            //console.log("$scope.createAds.type",$scope.createAds.type)
//            if(file.type.split('/')[0]=='image') {
//                 switch (type)
//             {
                
//                 case 'advertismentCover': 
//                 uploadimgServeice.user(file).then(function(ObjS) {
//                      $timeout(function () {      
//                 //.hide('html5spinner');   
//                     $scope.createAds.advertismentCover = ObjS.data.result.url;
                    
//                         }, 250);  
//                     // $scope.user.photo1 = ObjS.data.result.url;
//                     console.log("advertismentCover",$scope.createAds.advertismentCover)
//                 })  
//                 break;

//                 case 'appPhoto1': 
//                 uploadimgServeice.user(file).then(function(ObjS) {
//                     $scope.createAds.appPhoto1 = ObjS.data.result.url;
//                     $scope.downloadPhotoss($scope.createAds.appPhoto1);
//                 //      $timeout(function () {      
//                 // spinnerService.hide('html5spinner');   
                    
                    
//                 //         }, 250);  
//                     // $scope.user.photo1 = ObjS.data.result.url;
//                     console.log("image",$scope.createAds.photo1)
//                 })  
//                 break;

//                 case 'appPhoto2': 
//                 uploadimgServeice.user(file).then(function(ObjS) {
//                     $scope.createAds.appPhoto2 = ObjS.data.result.url;
//                     $scope.downloadPhotoss($scope.createAds.appPhoto2);
//                     // $timeout(function () {      
//                     // spinnerService.hide('html5spinner'); 
                    
//                     // }, 250);  
//                     // $scope.user.photo2 = ObjS.data.result.url;
//                     console.log("image",$scope.createAds.photo2)
//                 })  
//                 break;

//                 case 'appPhoto3': 
//                 uploadimgServeice.user(file).then(function(ObjS) {
//                     $scope.createAds.appPhoto3 = ObjS.data.result.url;
//                     $scope.downloadPhotoss($scope.createAds.appPhoto3);
//                     // $timeout(function () {      
//                     // spinnerService.hide('html5spinner'); 
                    
//                     // }, 250); 
//                     // $scope.user.photo3 = ObjS.data.result.url;
//                 })  
//                 break;

//                 case 'appPhoto4': 
//                 uploadimgServeice.user(file).then(function(ObjS) {
//                     $scope.createAds.appPhoto4 = ObjS.data.result.url;
//                     $scope.downloadPhotoss($scope.createAds.appPhoto4);
//                     // $timeout(function () {      
//                     // spinnerService.hide('html5spinner');
                    
//                     //     }, 250);  
//                     // $scope.user.photo4 = ObjS.data.result.url;
//                 })  
//                 break;

//                 case 'appPhoto5': 
//                 uploadimgServeice.user(file).then(function(ObjS) {
//                     $scope.createAds.appPhoto5 = ObjS.data.result.url;
//                     $scope.downloadPhotoss($scope.createAds.appPhoto5);
//                     // $timeout(function () {      
//                     // spinnerService.hide('html5spinner'); 
                    
//                     // }, 250);  
//                     // $scope.user.photo5 = ObjS.data.result.url;
//                 })  
//                 break;

//                 case 'appPhoto6': 
//                 uploadimgServeice.user(file).then(function(ObjS) {
//                     $scope.createAds.appPhoto6 = ObjS.data.result.url;
//                     $scope.downloadPhotoss($scope.createAds.appPhoto6);
//                     // $timeout(function () {      
//                     // spinnerService.hide('html5spinner'); 
                    
//                     // }, 250);  
//                     // $scope.user.photo6 = ObjS.data.result.url;

//                 })  
//                 break;

//                 case 'appIcon': 
//                 uploadimgServeice.user(file).then(function(ObjS) {
//                     $scope.createAds.appIcon = ObjS.data.result.url;
//                     // $timeout(function () {      
//                     // spinnerService.hide('html5spinner'); 
                    
//                     // }, 250);  
//                     // $scope.user.appIcon = ObjS.data.result.url;
//                 })  
//                 break;

//                 case 'slidePhoto1':
//                     console.log("xvxcvxc")
//                     uploadimgServeice.user(file).then(function(ObjS) {
//                     console.log(ObjS);
//                     $scope.createAds.slidePhoto1 = ObjS.data.result.url;
//                     console.log('scope.createAds.slidePhoto1----->>> '+$scope.createAds.slidePhoto1)
//                     $scope.slideshowPhotoFun($scope.createAds.slidePhoto1);
//                     // $timeout(function () {      
//                     // spinnerService.hide('html5spinner'); 
                    
//                     // }, 250);  
//                     // $scope.user.photo6 = ObjS.data.result.url;

//                 })  
//                 break;

//                 case 'slidePhoto2': 
//                 uploadimgServeice.user(file).then(function(ObjS) {
//                     $scope.createAds.slidePhoto2 = ObjS.data.result.url;
//                     // $timeout(function () {      
//                     // spinnerService.hide('html5spinner'); 
                    
//                     // }, 250);  
//                     // $scope.user.photo6 = ObjS.data.result.url;

//                 })  
//                 break;

//                 case 'slidePhoto3': 
//                 uploadimgServeice.user(file).then(function(ObjS) {
//                     $scope.createAds.slidePhoto3 = ObjS.data.result.url;
//                     // $timeout(function () {      
//                     // spinnerService.hide('html5spinner'); 
                    
//                     // }, 250);  
//                     // $scope.user.photo6 = ObjS.data.result.url;

//                 })  
//                 break;

//                 case 'slidePhoto4': 
//                 uploadimgServeice.user(file).then(function(ObjS) {
//                     $scope.createAds.slidePhoto4 = ObjS.data.result.url;
//                     // $timeout(function () {      
//                     // spinnerService.hide('html5spinner'); 
                    
//                     // }, 250);  
//                     // $scope.user.photo6 = ObjS.data.result.url;

//                 })  
//                 break;

//                 case 'slidePhoto5': 
//                 uploadimgServeice.user(file).then(function(ObjS) {
//                     $scope.createAds.slidePhoto5 = ObjS.data.result.url;
//                     // $timeout(function () {      
//                     // spinnerService.hide('html5spinner'); 
                    
//                     // }, 250);  
//                     // $scope.user.photo6 = ObjS.data.result.url;

//                 })  
//                 break;

//                 case 'slidePhoto6': 
//                 uploadimgServeice.user(file).then(function(ObjS) {
//                     $scope.createAds.slidePhoto6 = ObjS.data.result.url;
//                     // $timeout(function () {      
//                     // spinnerService.hide('html5spinner'); 
                    
//                     // }, 250);  
//                     // $scope.user.photo6 = ObjS.data.result.url;

//                 })  
//                 break;

//                 case 'adCover': 
//                 uploadimgServeice.user(file).then(function(ObjS) {
//                     $scope.createAds.adCover = ObjS.data.result.url;
//                     // $timeout(function () {      
//                     // spinnerService.hide('html5spinner'); 
                    
//                     // }, 250);  
//                     console.log('adsType Image in video-->>>'+$scope.createAds.adCover)
//                     console.log(JSON.stringify($scope.createAds.adCover))
//                 })  
//                 break;

                

//                 case 'appPhoto1': 
//                 uploadimgServeice.user(file).then(function(ObjS) {
//                      $scope.promoteAppGame.appPhoto1 = ObjS.data.result.url;
//                     // $timeout(function () {      
//                     // spinnerService.hide('html5spinner'); 
                  
//                     // }, 250);  
//                     // $scope.user.downloadPhoto1 = ObjS.data.result.url;

//                 })  
//                 break;
//                 case 'appPhoto2': 
//                 uploadimgServeice.user(file).then(function(ObjS) {
//                     $scope.promoteAppGame.appPhoto2 = ObjS.data.result.url;
//                     // $timeout(function () {      
//                     // spinnerService.hide('html5spinner'); 
                    
//                     // }, 250);  
//                     // $scope.user.downloadPhoto2 = ObjS.data.result.url;
//                 })  
//                 break;

//                 case 'appPhoto3': 
//                 uploadimgServeice.user(file).then(function(ObjS) {
//                     $scope.promoteAppGame.appPhoto3 = ObjS.data.result.url;
//                     // $timeout(function () {      
//                     // spinnerService.hide('html5spinner'); 
                    
//                     // }, 250);  
//                     //$scope.user.downloadPhoto3 = ObjS.data.result.url;
//                 })  
//                 break;

//                 case 'appPhoto4': 
//                 uploadimgServeice.user(file).then(function(ObjS) {
//                     $scope.promoteAppGame.appPhoto4 = ObjS.data.result.url;
//                     // $timeout(function () {      
//                     // spinnerService.hide('html5spinner'); 
                    
//                     // }, 250);  
//                     //$scope.user.downloadPhoto4 = ObjS.data.result.url;

//                 })  
//                 break;

//                 case 'giftImage': 
//                 uploadimgServeice.user(file).then(function(ObjS) {
//                     $scope.createAds.giftImage = ObjS.data.result.url;
//                     // $timeout(function () {      
//                     // spinnerService.hide('html5spinner'); 
                    
//                     // }, 250); 
//                     //$scope.user.giftImage = ObjS.data.result.url;

//                 })  
//                 break;

                

//                 default: 
//                 toastr.error("Somthing wents to wroung")
                
//             }
//             } else {

//                 if(type == 'mp3'){

//                 uploadimgServeice.user(file).then(function(ObjS) {
//                     $scope.createAds.audioUrl = ObjS.data.result.url;
//                     console.log("$scope.createAds.audioUrl",$scope.createAds.audioUrl);
//                     // $timeout(function () {      
//                     // spinnerService.hide('html5spinner'); 
                    
//                     // }, 250); 
//                     //$scope.user.giftImage = ObjS.data.result.url;

//                 })  
         
//                 }else{
//                     uploadimgServeice.user(file).then(function(ObjS) {
//                         $scope.createAds.vedioUrl = ObjS.data.result.url;
//                     console.log("$scope.createAds.url",$scope.createAds.vedioUrl);
//                     // $timeout(function () {      
//                     // spinnerService.hide('html5spinner');   
                    
//                     //     }, 250);
//                 })

//                 }

                 
                
//             }          
//        }else{
//            toastr.error("Only image supported.")
//        }        
//    }

 $scope.changeImage = function(input, type) {
        console.log("type",type)
        // spinnerService.show('html5spinner');
        var file = input.files[0];
        var ext = file.name.split('.').pop();
        if (ext == "mp3" || ext == "jpg" || ext == "jpeg" || ext == "bmp" || ext == "gif" || ext == "png" || ext == "3gp" || ext == "mp4" || ext == "flv" || ext == "avi" || ext == "wmv") {
            $scope.imageName = file.name;
            console.log("$scope.imageName", $scope.imageName)
            $scope.createAds.type = file.type;
            if (file.type.split('/')[0] == 'image') {
                switch (type) {

                    case 'advertismentCover':
                        uploadimgServeice.user(file).then(function(ObjS) {
                            $scope.createAds.advertismentCover = ObjS.data.result.url;
                            console.log("createAds.advertismentCover",$scope.createAds.advertismentCover)
                            // $timeout(function() {
                            //     spinnerService.hide('html5spinner');
                                
                            // }, 250);
                        })
                        break;

                    case 'appPhoto1':
                        uploadimgServeice.user(file).then(function(ObjS) {
                            $scope.createAds.appPhoto1 = ObjS.data.result.url;
                                $scope.downloadPhotoss($scope.createAds.appPhoto1);
                            // $timeout(function() {
                            //     spinnerService.hide('html5spinner');
                                

                            // }, 250);
                        })
                        break;

                    case 'appPhoto2':
                        uploadimgServeice.user(file).then(function(ObjS) {
                            $scope.createAds.appPhoto2 = ObjS.data.result.url;
                                $scope.downloadPhotoss($scope.createAds.appPhoto2);
                            // $timeout(function() {
                            //     spinnerService.hide('html5spinner');
                                
                            // }, 250);
                        })
                        break;

                    case 'appPhoto3':
                        uploadimgServeice.user(file).then(function(ObjS) {
                            $scope.createAds.appPhoto3 = ObjS.data.result.url;
                                $scope.downloadPhotoss($scope.createAds.appPhoto3);
                            // $timeout(function() {
                            //     spinnerService.hide('html5spinner');
                                
                            // }, 250);
                        })
                        break;

                    case 'appPhoto4':
                        uploadimgServeice.user(file).then(function(ObjS) {
                            $scope.createAds.appPhoto4 = ObjS.data.result.url;
                                $scope.downloadPhotoss($scope.createAds.appPhoto4);
                            // $timeout(function() {
                            //     spinnerService.hide('html5spinner');
                                
                            // }, 250);
                        })
                        break;

                    case 'appPhoto5':
                        uploadimgServeice.user(file).then(function(ObjS) {
                            $scope.createAds.appPhoto5 = ObjS.data.result.url;
                                $scope.downloadPhotoss($scope.createAds.appPhoto5);
                            // $timeout(function() {
                            //     spinnerService.hide('html5spinner');
                                
                            // }, 250);
                        })
                        break;

                    case 'appPhoto6':
                        uploadimgServeice.user(file).then(function(ObjS) {
                            $scope.createAds.appPhoto6 = ObjS.data.result.url;
                                $scope.downloadPhotoss($scope.createAds.appPhoto6);
                            // $timeout(function() {
                            //     spinnerService.hide('html5spinner');
                                
                            // }, 250);
                        })
                        break;

                    case 'appIcon':
                        uploadimgServeice.user(file).then(function(ObjS) {
                            $scope.createAds.appIcon = ObjS.data.result.url;
                                console.log($scope.createAds.appIcon,$scope.createAds.appIcon)
                            // $timeout(function() {
                            //     spinnerService.hide('html5spinner');
                                
                            // }, 250);
                        })
                        break;

                    case 'slidePhoto1':
                    console.log("xvxcvxc")
                        uploadimgServeice.user(file).then(function(ObjS) {
                            console.log(ObjS);
                            $scope.createAds.slidePhoto1 = ObjS.data.result.url;
                            console.log('scope.createAds.slidePhoto1----->>> '+$scope.createAds.slidePhoto1)
                                $scope.slideshowPhotoFun($scope.createAds.slidePhoto1);
                                $scope.card_img = '1';
                                console.log("selected cover =>"+$scope.card_img)
                                $scope.cardImSel('1');
                            // $timeout(function() {
                            //     spinnerService.hide('html5spinner');
                                
                            // }, 250);
                        })
                        break;

                    case 'slidePhoto2':
                        uploadimgServeice.user(file).then(function(ObjS) {
                            $scope.createAds.slidePhoto2 = ObjS.data.result.url;
                                $scope.slideshowPhotoFun($scope.createAds.slidePhoto2);
                                $scope.card_img = '2';
                                console.log("selected cover =>"+$scope.card_img)
                                $scope.cardImSel('2');
                            // $timeout(function() {
                            //     spinnerService.hide('html5spinner');
                                
                            // }, 250);
                        })
                        break;

                    case 'slidePhoto3':
                        uploadimgServeice.user(file).then(function(ObjS) {
                            $scope.createAds.slidePhoto3 = ObjS.data.result.url;
                                $scope.slideshowPhotoFun($scope.createAds.slidePhoto3);
                                $scope.card_img = '3';
                                console.log("selected cover =>"+$scope.card_img)
                                $scope.cardImSel('3');
                            // $timeout(function() {
                            //     spinnerService.hide('html5spinner');
                                
                            // }, 250);
                        })
                        break;

                    case 'slidePhoto4':
                        uploadimgServeice.user(file).then(function(ObjS) {
                            $scope.createAds.slidePhoto4 = ObjS.data.result.url;
                                $scope.slideshowPhotoFun($scope.createAds.slidePhoto4);
                                $scope.card_img = '4';
                                console.log("selected cover =>"+$scope.card_img)
                                $scope.cardImSel('4');
                            // $timeout(function() {
                            //     spinnerService.hide('html5spinner');
                                
                            // }, 250);
                        })
                        break;

                    case 'slidePhoto5':
                        uploadimgServeice.user(file).then(function(ObjS) {
                            $scope.createAds.slidePhoto5 = ObjS.data.result.url;
                                $scope.slideshowPhotoFun($scope.createAds.slidePhoto5);
                                $scope.card_img = '5';
                                console.log("selected cover =>"+$scope.card_img)
                                $scope.cardImSel('5');
                            // $timeout(function() {
                            //     spinnerService.hide('html5spinner');
                                
                            // }, 250);
                        })
                        break;

                    case 'slidePhoto6':
                        uploadimgServeice.user(file).then(function(ObjS) {
                            $scope.createAds.slidePhoto6 = ObjS.data.result.url;
                                $scope.slideshowPhotoFun($scope.createAds.slidePhoto6);
                                $scope.card_img = '6';
                                console.log("selected cover =>"+$scope.card_img)
                                $scope.cardImSel('6');
                            // $timeout(function() {
                            //     spinnerService.hide('html5spinner');
                                
                            // }, 250);
                        })
                        break;

                    case 'giftDesImage':
                        uploadimgServeice.user(file).then(function(ObjS) {
                             $scope.createAds.gifyDescImage = ObjS.data.result.url;
                             $scope.showCam = true;
                             console.log("gift =>"+$scope.createAds.gifyDescImage)
                            // $timeout(function() {
                            //     spinnerService.hide('html5spinner');
                               
                            // }, 250);
                        })
                        break;

                    case 'adCover':
                        uploadimgServeice.user(file).then(function(ObjS) {
                            $scope.createAds.adCover = ObjS.data.result.url;
                            // $timeout(function() {
                            //     spinnerService.hide('html5spinner');
                                
                            // }, 250);
                        })
                        break;



                    case 'appPhoto1':
                        uploadimgServeice.user(file).then(function(ObjS) {
                            $scope.promoteAppGame.appPhoto1 = ObjS.data.result.url;
                            // $timeout(function() {
                            //     spinnerService.hide('html5spinner');
                                
                            // }, 250);
                        })
                        break;
                    case 'appPhoto2':
                        uploadimgServeice.user(file).then(function(ObjS) {
                            $scope.promoteAppGame.appPhoto2 = ObjS.data.result.url;
                            // $timeout(function() {
                            //     spinnerService.hide('html5spinner');
                                
                            // }, 250);
                        })
                        break;

                    case 'appPhoto3':
                        uploadimgServeice.user(file).then(function(ObjS) {
                            $scope.promoteAppGame.appPhoto3 = ObjS.data.result.url;
                            // $timeout(function() {
                            //     spinnerService.hide('html5spinner');
                                
                            // }, 250);
                        })
                        break;

                    case 'appPhoto4':
                        uploadimgServeice.user(file).then(function(ObjS) {
                            $scope.promoteAppGame.appPhoto4 = ObjS.data.result.url;
                            // $timeout(function() {
                            //     spinnerService.hide('html5spinner');
                                
                            // }, 250);
                        })
                        break;

                    case 'giftImage':
                        uploadimgServeice.user(file).then(function(ObjS) {
                            $scope.createAds.giftImage = ObjS.data.result.url;
                            // $timeout(function() {
                            //     spinnerService.hide('html5spinner');
                                
                            // }, 250);
                        })
                        break;

                    default:
                        toastr.error("Somthing wents to wroung")

                }
            } else {

                if (type == 'mp3') {

                    uploadimgServeice.user(file).then(function(ObjS) {
                        $scope.createAds.audioUrl = ObjS.data.result.url;
                        // $timeout(function() {
                        //     spinnerService.hide('html5spinner');
                            
                        // }, 250);
                    })

                } else {
                    uploadimgServeice.user(file).then(function(ObjS) {
                        $scope.createAds.vedioUrl = ObjS.data.result.url;
                        // $timeout(function() {
                        //     spinnerService.hide('html5spinner');
                            
                        // }, 250);
                    })
                }
            }
        } else {
            toastr.error("Only image supported.")
        }
    }





    function daysInMonth(month,year) {
            return new Date(year, month, 0).getDate();
        } 
    $scope.couponExpiryDate = 'NEVER';
    if($scope.couponExpiryDate == 'NEVER')
    $scope.couponExp = 'Lifetime';

  $scope.expDate = function(date) {
    
     $scope.couponExpiryInString = date;
        var currentDate = new Date()
        var year = currentDate.getFullYear();
        var month = 1 + currentDate.getMonth();
        var noOfDaysOne = daysInMonth(month, year);
        var noOfDaysTwo = daysInMonth(month + 1, year);
        var noOfDaysThree = daysInMonth(month + 2, year);
        var one_day = 86400000;
        var currentDateNumber = new Date().getTime();

        switch (date) {
            case 'Never':
                 $scope.couponExpiryDate = 'NEVER';
                 $scope.couponExp = 'Lifetime';
                break;

            case '1 Week':
                $scope.couponExpiryDate = 86400000 * 7;
                $scope.couponExp = '1Week';
                break;

            case '2 Weeks':

                $scope.couponExpiryDate = 86400000 * 14;
                $scope.couponExp = '2Weeks';
                break;

            case '3 Weeks':

                $scope.couponExpiryDate = 86400000 * 21;
                $scope.couponExp = '3Weeks';
                break;

            case '1 Month':

                $scope.couponExpiryDate = 86400000 * 30;
                $scope.couponExp = '1Month';
                break;

            case '2 Months':

                $scope.couponExpiryDate = 86400000 * 60;
                $scope.couponExp = '2Months';
                break;

            case '3 Months':

                $scope.couponExpiryDate = 86400000 * 90;
                $scope.couponExp = '3Months';
                break;

            default:
                toastr.error("Something wents wrong")

        }
    }


    $scope.updateAdd = function() {
        $scope.adId = $stateParams.id;
        $scope.userId = adminIdss;
        if($scope.createAds.giftType == 'coupon'){
            if($scope.createAds.adContentType == 'video'){
                modifyData = {
                    
                    adOwnerId:$scope.createAds.adOwnerId,
                    userId: $scope.createAds.userId,
                    pageId: $scope.createAds.pageId,
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
                    
                    
                    adOwnerId:$scope.createAds.adOwnerId,
                    userId: $scope.createAds.userId,
                    pageId: $scope.createAds.pageId,
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
                    coverImage : $scope.coverImg,
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
                    musicFileName: $scope.selectedMusic,
                    couponExpiryInString:$scope.couponExpiryInString
                }

                 console.log("modifyData",JSON.stringify(modifyData));
                console.log("adId ==>>>",JSON.stringify($scope.adId));
                console.log("userId ==>>",JSON.stringify($scope.userId));

                userService.editAds($scope.adId,$scope.userId,modifyData).success(function(res) {
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
                    
                    
                    adOwnerId:$scope.createAds.adOwnerId,
                    userId: $scope.createAds.userId,
                    pageId: $scope.createAds.pageId,
                    pageName: $scope.createAds.pageName,
                    category: $scope.createAds.category,
                    subCategory: $scope.createAds.subCategory,

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
                    winnerPrice: $scope.createAds.winnerPrice,
                    linkDescription: $scope.createAds.linkDescription,
                    dawnloadPagePhoto: $scope.dawnloadPagePhoto,
                    promoteApp: $scope.promoteApp,
                    video: $scope.createAds.vedioUrl,
                    brolixFees:$scope.createAds.brolixFees,
                    cashAdPrize: $scope.createAds.viewersOne,
                    couponExpiryInString:$scope.couponExpiryInString
                }

                console.log("modifyData111",JSON.stringify(modifyData))
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
                    
                    adOwnerId:$scope.createAds.adOwnerId,
                    userId: $scope.createAds.userId,
                    pageId: $scope.createAds.pageId,
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
                    coverImage : $scope.coverImg,
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
                    winnerPrice: $scope.createAds.winnerPrice,
                    windowsStoreLink: $scope.createAds.windowStoreLink,
                    appIcon: $scope.createAds.appIcon,
                    linkDescription: $scope.createAds.linkDescription,
                    dawnloadPagePhoto: $scope.dawnloadPagePhoto,
                    promoteApp: $scope.promoteApp,
                    musicFileName: $scope.selectedMusic,
                    brolixFees:$scope.createAds.brolixFees,
                    cashAdPrize: $scope.createAds.viewersOne,
                    couponExpiryInString:$scope.couponExpiryInString
                }

                console.log("modifyData",JSON.stringify(modifyData))
                userService.editAds($scope.adId,$scope.userId,modifyData).success(function(res) {
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