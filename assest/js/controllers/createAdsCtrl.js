app.controller('createAdsCtrl', function ($scope, $state, $window, userService, uploadimgServeice, $http, toastr,$timeout, spinnerService) {
$(window).scrollTop(0,0);
$scope.$emit('headerStatus', 'Manage Ads');
$scope.$emit('SideMenu', 'Manage Ads');
$scope.createAds = {};
$scope.promoteAppGame = {};
$scope.createAds.advertismentCover='../dist/image/cover.jpg';

userService.getPage().then(function(success) { 
        $scope.pageDetail=success.data.result;
        console.log("Page>>>>>>>>>>"+JSON.stringify($scope.pageDetail))
    },function(err){
        console.log(err);
         toastr.error('Connection error.');
}) 

 
 $scope.createAds.photo1='./dist/image/user-image.jpeg';
 $scope.createAds.photo2='./dist/image/user-image.jpeg';
 $scope.createAds.photo3='./dist/image/user-image.jpeg';
 $scope.createAds.photo4='./dist/image/user-image.jpeg';
 $scope.createAds.photo5='./dist/image/user-image.jpeg';
 $scope.createAds.photo6='./dist/image/user-image.jpeg';

 $scope.StepFirst = true;
 $scope.Step1 = false;
 $scope.Step2 = false;
 $scope.Step3 = false;
 $scope.Step4 = false;
 $scope.Step5 = false;
 $scope.Step6 = false;
 $scope.Step7 = false;
 $scope.Step8 = false;
 $scope.cashStep1 = false;
 $scope.cashStep2 = false
 $scope.cashStep3 = false;
 $scope.cashStep4 = false;
 $scope.cashStep5 = false;
 $scope.cashStep6 = false;
 $scope.cashStep7 = false;
 $scope.cashStep8 = false;
 $scope.cashStep9 = false;

 
 $scope.click = function(type){
     //console.log(type)
    if(type=='StepFirst'){
        $scope.StepFirst = false;
        $scope.Step1 = true;
        $scope.Step2 = false;
        $scope.Step3 = false;
        $scope.Step4 = false;
        $scope.Step5 = false;
        $scope.Step6 = false;
        $scope.Step7 = false;
        $scope.Step8 = false;
        $scope.cashStep1 = false;
        $scope.cashStep2 = false
        $scope.cashStep3 = false;
        $scope.cashStep4 = false;
        $scope.cashStep5 = false;
        $scope.cashStep6 = false;
        $scope.cashStep7 = false;
        $scope.cashStep8 = false;
        $scope.cashStep9 = false;
        console.log("createAds",JSON.stringify($scope.createAds))
        
    }
     else if(type=='giftTypeStepA'){
         console.log('giftType-->>>'+$scope.createAds.giftType)
        $scope.StepFirst = false;
        $scope.Step1 = false;
        $scope.Step2 = true
        $scope.Step3 = false;
        $scope.Step4 = false;
        $scope.Step5 = false;
        $scope.Step6 = false;
        $scope.Step7 = false;
        $scope.Step8 = false;
        $scope.cashStep1 = false;
        $scope.cashStep2 = false
        $scope.cashStep3 = false;
        $scope.cashStep4 = false;
        $scope.cashStep5 = false;
        $scope.cashStep6 = false;
        $scope.cashStep7 = false;
        $scope.cashStep8 = false;
        $scope.cashStep9 = false;
        console.log("createAds",JSON.stringify($scope.createAds))
    }else if(type=='adsTypeStep2'){
          //console.log('adsType  fgsfdsfds-->>>'+$scope.createAds.adsType)
           
         
        $scope.Step1 = false;
        $scope.Step2 = false
        $scope.Step3 = true;
        $scope.Step4 = false;
        $scope.Step5 = false;
        $scope.Step6 = false;
        $scope.Step7 = false;
        $scope.Step8 = false;
        $scope.cashStep1 = false;
        $scope.cashStep2 = false
        $scope.cashStep3 = false;
        $scope.cashStep4 = false;
        $scope.cashStep5 = false;
        $scope.cashStep6 = false;
        $scope.cashStep7 = false;
        $scope.cashStep8 = false;
        $scope.cashStep9 = false;
        console.log("createAds",JSON.stringify($scope.createAds))
    }else if(type=='adsTypeStep3'){
          console.log('adsType-->>>'+$scope.createAds.adsType)
        $scope.StepFirst = false;
        $scope.Step1 = false;
        $scope.Step2 = false;
        $scope.Step3 = false;
        $scope.Step4 = true;
        $scope.Step5 = false;
        $scope.Step6 = false;
        $scope.Step7 = false;
        $scope.Step8 = false;
        $scope.cashStep1 = false;
        $scope.cashStep2 = false
        $scope.cashStep3 = false;
        $scope.cashStep4 = false;
        $scope.cashStep5 = false;
        $scope.cashStep6 = false;
        $scope.cashStep7 = false;
        $scope.cashStep8 = false;
        $scope.cashStep9 = false;
        console.log("createAds",JSON.stringify($scope.createAds))
     }
     else if(type=='Step4'){
        $scope.StepFirst = false;
        $scope.Step1 = false;
        $scope.Step2 = false
        $scope.Step3 = false;
        $scope.Step4 = false;
        $scope.Step5 = true;
        $scope.Step6 = false;
        $scope.Step7 = false;
        $scope.Step8 = false;
        $scope.cashStep1 = false;
        $scope.cashStep2 = false
        $scope.cashStep3 = false;
        $scope.cashStep4 = false;
        $scope.cashStep5 = false;
        $scope.cashStep6 = false;
        $scope.cashStep7 = false;
        $scope.cashStep8 = false;
        $scope.cashStep9 = false;
        console.log("createAds",JSON.stringify($scope.createAds))

    }
    else if(type=='Step5'){
        $scope.StepFirst = false;
        $scope.Step1 = false;
        $scope.Step2 = false;
        $scope.Step3 = false;
        $scope.Step4 = false;
        $scope.Step5 = false;
        $scope.Step6 = true;
        $scope.Step7 = false;
        $scope.Step8 = false;
        $scope.cashStep1 = false;
        $scope.cashStep2 = false
        $scope.cashStep3 = false;
        $scope.cashStep4 = false;
        $scope.cashStep5 = false;
        $scope.cashStep6 = false;
        $scope.cashStep7 = false;
        $scope.cashStep8 = false;
        $scope.cashStep9 = false;
        console.log("promoteAppGame",$scope.promoteAppGame)
        console.log("createAds",JSON.stringify($scope.createAds))


     }
     else if(type=='Step6'){
        $scope.StepFirst = false;
        $scope.Step1 = false;
        $scope.Step2 = false
        $scope.Step3 = false;
        $scope.Step4 = false;
        $scope.Step5 = false;
        $scope.Step6 = false;
        $scope.Step7 = true;
        $scope.Step8 = false;
        $scope.cashStep1 = false;
        $scope.cashStep2 = false
        $scope.cashStep3 = false;
        $scope.cashStep4 = false;
        $scope.cashStep5 = false;
        $scope.cashStep6 = false;
        $scope.cashStep7 = false;
        $scope.cashStep8 = false;
        $scope.cashStep9 = false;
        console.log("createAds",JSON.stringify($scope.createAds))

    }
      else if(type=='Step7'){
        $scope.StepFirst = false;
        $scope.Step1 = false;
        $scope.Step2 = false
        $scope.Step3 = false;
        $scope.Step4 = false;
        $scope.Step5 = false;
        $scope.Step6 = false;
        $scope.Step7 = false;
        $scope.Step8 = true;
        $scope.cashStep1 = false;
        $scope.cashStep2 = false
        $scope.cashStep3 = false;
        $scope.cashStep4 = false;
        $scope.cashStep5 = false;
        $scope.cashStep6 = false;
        $scope.cashStep7 = false;
        $scope.cashStep8 = false;
        $scope.cashStep9 = false;
        console.log("createAds",JSON.stringify($scope.createAds))

    }
      else if(type=='giftTypeStepB'){
           console.log('giftType-->>>'+$scope.createAds.giftType)
        $scope.StepFirst = false;
        $scope.Step1 = false;
        $scope.Step2 = false
        $scope.Step3 = false;
        $scope.Step4 = false;
        $scope.Step5 = false;
        $scope.Step6 = false;
        $scope.Step7 = false;
        $scope.Step8 = false;
        $scope.cashStep1 = false;
        $scope.cashStep2 = true
        $scope.cashStep3 = false;
        $scope.cashStep4 = false;
        $scope.cashStep5 = false;
        $scope.cashStep6 = false;
        $scope.cashStep7 = false;
        $scope.cashStep8 = false;
        $scope.cashStep9 = false;

    }
     else if(type=='adsTypeCashStep2'){
         console.log('giftType-->>>'+$scope.createAds.giftType)
        $scope.StepFirst = false;
        $scope.Step1 = false;
        $scope.Step2 = false
        $scope.Step3 = false;
        $scope.Step4 = false;
        $scope.Step5 = false;
        $scope.Step6 = false;
        $scope.Step7 = false;
        $scope.Step8 = false;
        $scope.cashStep1 = false;
        $scope.cashStep2 = false
        $scope.cashStep3 = true;
        $scope.cashStep4 = false;
        $scope.cashStep5 = false;
        $scope.cashStep6 = false;
        $scope.cashStep7 = false;
        $scope.cashStep8 = false;
        $scope.cashStep9 = false;

    }
     else if(type=='adsTypeCashStep3'){
         console.log('giftType-->>>'+$scope.createAds.giftType)
        $scope.StepFirst = false;
        $scope.Step1 = false;
        $scope.Step2 = false
        $scope.Step3 = false;
        $scope.Step4 = false;
        $scope.Step5 = false;
        $scope.Step6 = false;
        $scope.Step7 = false;
        $scope.Step8 = false;
        $scope.cashStep1 = false;
        $scope.cashStep2 = false
        $scope.cashStep3 = false;
        $scope.cashStep4 = true;
        $scope.cashStep5 = false;
        $scope.cashStep6 = false;
        $scope.cashStep7 = false;
        $scope.cashStep8 = false;
        $scope.cashStep9 = false;

    }
     else if(type=='cashStep4'){
        $scope.StepFirst = false;
        $scope.Step1 = false;
        $scope.Step2 = false
        $scope.Step3 = false;
        $scope.Step4 = false;
        $scope.Step5 = false;
        $scope.Step6 = false;
        $scope.Step7 = false;
        $scope.Step8 = false;
        $scope.cashStep1 = false;
        $scope.cashStep2 = false
        $scope.cashStep3 = false;
        $scope.cashStep4 = false;
        $scope.cashStep5 = true;
        $scope.cashStep6 = false;
        $scope.cashStep7 = false;
        $scope.cashStep8 = false;
        $scope.cashStep9 = false;

    }
     else if(type=='cashStep5'){
        $scope.StepFirst = false;
        $scope.Step1 = false;
        $scope.Step2 = false
        $scope.Step3 = false;
        $scope.Step4 = false;
        $scope.Step5 = false;
        $scope.Step6 = false;
        $scope.Step7 = false;
        $scope.Step8 = false;
        $scope.cashStep1 = false;
        $scope.cashStep2 = false
        $scope.cashStep3 = false;
        $scope.cashStep4 = false;
        $scope.cashStep5 = false;
        $scope.cashStep6 = true;
        $scope.cashStep7 = false;
        $scope.cashStep8 = false;

    }
     else if(type=='cashStep6'){
        $scope.StepFirst = false;
        $scope.Step1 = false;
        $scope.Step2 = false
        $scope.Step3 = false;
        $scope.Step4 = false;
        $scope.Step5 = false;
        $scope.Step6 = false;
        $scope.Step7 = false;
        $scope.Step8 = false;
        $scope.cashStep1 = false;
        $scope.cashStep2 = false
        $scope.cashStep3 = false;
        $scope.cashStep4 = false;
        $scope.cashStep5 = false;
        $scope.cashStep6 = false;
        $scope.cashStep7 = true;
        $scope.cashStep8 = false;
        $scope.cashStep9 = false;

    }
     else if(type=='cashStep7'){
        $scope.StepFirst = false;
        $scope.Step1 = false;
        $scope.Step2 = false
        $scope.Step3 = false;
        $scope.Step4 = false;
        $scope.Step5 = false;
        $scope.Step6 = false;
        $scope.Step7 = false;
        $scope.Step8 = false;
        $scope.cashStep1 = false;
        $scope.cashStep2 = false
        $scope.cashStep3 = false;
        $scope.cashStep4 = false;
        $scope.cashStep5 = false;
        $scope.cashStep6 = false;
        $scope.cashStep7 = false;
        $scope.cashStep8 = true;
        $scope.cashStep9 = false;

    }
      else if(type=='cashStep8'){
        $scope.StepFirst = false;
        $scope.Step1 = false;
        $scope.Step2 = false
        $scope.Step3 = false;
        $scope.Step4 = false;
        $scope.Step5 = false;
        $scope.Step6 = false;
        $scope.Step7 = false;
        $scope.Step8 = false;
        $scope.cashStep1 = false;
        $scope.cashStep2 = false
        $scope.cashStep3 = false;
        $scope.cashStep4 = false;
        $scope.cashStep5 = false;
        $scope.cashStep6 = false;
        $scope.cashStep7 = false;
        $scope.cashStep8 = false;
        $scope.cashStep9 = true;

    }

    else{
        toastr.error("Somthing Wents to wroung")
     }  
 }

//  $scope.uploadVideo = function() {
//     var file = $scope.filevideo;
//  console.log("video" , $scope.filevideo)
//     if (file != undefined || file != '') {
//     //   $scope.videoName = file.name;
//       userService.uploads(file).success(function(res) {
//         $scope.videoURL = res.fileName;
//         $scope.thumbnail = res.thumbnail;
//         file = '';
//         $scope.filevideo = '';
//       }).error(function(status, data) {});
//     }
//   }
// $scope.uploadVideo = function() {
//     console.log("file111",$scope.filevideo);
//     var file = $scope.filevideo;
  
  
  
// }

/*function uploadVideo() {
    console.log("file111",$scope.filevideo);
    var file = $scope.filevideo;
    // if (file != undefined || file != '') {
    //   $scope.videoName = file.name;
    // //   UserService.uploadVideo(file).success(function(res) {
    // //     $scope.videoURL = res.fileName;
    // //     $scope.thumbnail = res.thumbnail;
    // //     file = '';
    // //     $scope.filevideo = '';
    // //   }).error(function(status, data) {});
    // }
}*/

//   $scope.uploadAudio = function() {
//     var file = $scope.fileaudio;
//     if (file != undefined || file != '') {
//     //   $scope.audioName = file.name;
//       userService.uploads(file).success(function(res) {
//         $scope.audioURL = res.result.url;
//         $scope.fileaudio = '';
//         file = '';
//       }).error(function(status, data) {});
//     }
//   }



// $scope.changeVideo = function(input) {
//         console.log("input---- ", input);
//         var file = input.files[0];
//         var ext = file.name.split('.').pop();
//         // console.log(ext)
//         if (ext == "jpg" || ext == "jpeg" || ext == "bmp" || ext == "gif" || ext == "png" || ext == "3gp" || ext == "mp4" || ext == "flv" || ext == "avi" || ext == "wmv") {
//             // console.log(file.name)
//             $scope.myForm.type = file.type;
//             $scope.Name = file.name;
//             if(file.type.split('/')[0]=='image') {
//                 uploadimgServeice.user(file).then(function(ObjS) {
//                     $scope.myForm.url = ObjS.data.result.url
//                     console.log(JSON.stringify(ObjS.data.result.url));
//                 })
//             } else {
//                 videoServeice.user(file).then(function(ObjS) {
//                     $scope.myForm.url = ObjS.data.fileName;
//                     console.log($scope.myForm.url);
//                 })
//             }
//         } else {
//             toastr.error("Only image and video supported.")
//         }
//     }
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
                    $scope.createAds.url = ObjS.data.result.url;
                    console.log("$scope.createAds.url",$scope.createAds.url);
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


   $scope.submit = function(data){
       console.log("All data -->>"+JSON.stringify(data));
   }
})