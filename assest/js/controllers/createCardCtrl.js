app.controller('createCardCtrl', function($scope, $state, $window, userService, uploadimgServeice, $http, toastr, $timeout, spinnerService) {
    $(window).scrollTop(0, 0);
    $scope.$emit('headerStatus', 'Manage Cards');
    $scope.$emit('SideMenu', 'Manage Cards');
    $scope.createCard = {};
    $scope.user = {};
    $scope.myForm = {};
    $scope.active_upgrade_card=true;

$scope.createCard.image='http://res.cloudinary.com/dfrspfd4g/image/upload/v1500640275/t2lzgz0tmoriwjd5ymcv.png';
$scope.createCard.image2='http://res.cloudinary.com/dfrspfd4g/image/upload/v1500640526/wnsk2mrt3kwitnzgaqiw.png';

    $scope.active_tab=function(active_card){
        if(active_card=='upgrade_card'){
        $scope.active_upgrade_card=true;
         $scope.active_luck_card=false;
      }else{
         $scope.active_upgrade_card=false;
            $scope.active_luck_card=true;
      }
    }
    $scope.Reset = function(type){

        if(type=='upgrade'){
            $scope.createCard.viewers = "";
            $scope.createCard.price = "";
            $scope.createCard.image = 'http://res.cloudinary.com/dfrspfd4g/image/upload/v1500640275/t2lzgz0tmoriwjd5ymcv.png';
        }
        else{
            $scope.createCard.chance = "";
            $scope.createCard.brolix = "";
            $scope.createCard.image2 = 'http://res.cloudinary.com/dfrspfd4g/image/upload/v1500640526/wnsk2mrt3kwitnzgaqiw.png';

        }

        

    }
 
    $scope.changeImage = function(input,type) {
      // spinnerService.show('html5spinner');  
       var file = input.files[0];
       var ext = file.name.split('.').pop();
       if(ext=="jpg" || ext=="jpeg" || ext=="bmp" || ext=="gif" || ext=="png"){
           $scope.imageName = file.name;
          switch (type)
            {
                case 'image': 

                uploadimgServeice.user(file).then(function(ObjS) {
                  console.log("image1",ObjS.data.result.url)  
                  $scope.createCard.image = ObjS.data.result.url;
                //     $timeout(function () {      
                // spinnerService.hide('html5spinner');     
                    
                //       }, 250);  
                    // $scope.user.photo1 = ObjS.data.result.url;
                    console.log("image1",$scope.createCard.image)
                })  
                break;

                case 'image2': 

                uploadimgServeice.user(file).then(function(ObjS) {
                    console.log("image2",ObjS.data.result.url)
                    $scope.createCard.image2 = ObjS.data.result.url;
                //       $timeout(function () {      
                // spinnerService.hide('html5spinner'); 
                    
                //       }, 250); 
                    // $scope.user.photo2 = ObjS.data.result.url;
                    console.log("image2",ObjS.data.result.url)
                })  
                break;

                default: 
                toastr.error("Somthing wents to wroung")
                
            }
       }else{
           toastr.error("Only image supported.")
       }        
   }
  

    $scope.addCard = function(type) { 
        if(type=='upgrade_card'){
            var data = {
                type:type,
                viewers:$scope.createCard.viewers,
                price:$scope.createCard.price,
                photo:$scope.createCard.image
            }
          
            userService.addcard(data).success(function(res) {
                if (res.responseCode == 200) {
                    console.log(JSON.stringify(res))
                    toastr.success(res.responseMessage);
                    $state.go('header.manageCards')
                } else {
                    toastr.error(res.responseMessage);
                }
                }).error(function(status, data) {
            })
                console.log("datatatatatt1111",data)
            }
            else{
            var data = {
                type:type,
                chances:$scope.createCard.chance,
                brolix:$scope.createCard.brolix,
                photo:$scope.createCard.image2
            }
        
            userService.addcard(data).success(function(res) {
                if (res.responseCode == 200) {
                console.log(JSON.stringify(res))
                toastr.success(res.responseMessage);
                $state.go('header.manageCards')
                } else {
                    toastr.error(res.responseMessage);
                }
            }).error(function(status, data) {
            })
                console.log("datatatatatt2222",data) 
        }
    } 
})