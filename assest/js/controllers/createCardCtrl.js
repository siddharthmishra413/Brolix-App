app.controller('createCardCtrl', function($scope,$timeout, $state, $window, userService, spinnerService, uploadimgServeice, $http, toastr) {
    $(window).scrollTop(0, 0);
    $scope.$emit('headerStatus', 'Manage Cards');
    $scope.$emit('SideMenu', 'Manage Cards');
    $scope.createCard = {};
    $scope.user = {};
    $scope.myForm = {};
    $scope.active_upgrade_card=true;

    $scope.createCard.image='../dist/image/cover.jpg';
    $scope.createCard.viewers='';
    $scope.createCard.price='';
    $scope.createCard.image2='../dist/image/cover.jpg';
    $scope.createCard.chances='';
    $scope.createCard.brolix='';

    $scope.active_tab=function(active_card){
        if(active_card=='upgrade_card'){
        $scope.active_upgrade_card=true;
         $scope.active_luck_card=false;
      }else{
         $scope.active_upgrade_card=false;
            $scope.active_luck_card=true;
      }
    }
 
    $scope.changeImage = function(input,type) {
        
      spinnerService.show('html5spinner');  
       var file = input.files[0];
       var ext = file.name.split('.').pop();
       if(ext=="jpg" || ext=="jpeg" || ext=="bmp" || ext=="gif" || ext=="png"){
           $scope.imageName = file.name;
          switch (type)
            {
                case 'image': 

                uploadimgServeice.user(file).then(function(ObjS) {
                    $timeout(function () {      
                spinnerService.hide('html5spinner');     
                    $scope.createCard.image = ObjS.data.result.url;
                      }, 250);  
                    // $scope.user.photo1 = ObjS.data.result.url;
                    console.log("image",$scope.createCard.image)
                })  
                break;

                case 'image2': 

                uploadimgServeice.user(file).then(function(ObjS) {
                      $timeout(function () {      
                spinnerService.hide('html5spinner'); 
                    $scope.createCard.image2 = ObjS.data.result.url;
                      }, 250); 
                    // $scope.user.photo2 = ObjS.data.result.url;
                    console.log("image",$scope.createCard.image2)
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
                photo:$scope.user.photo
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
                chances:$scope.createCard.chances,
                brolix:$scope.createCard.brolix,
                photo:$scope.user.photo
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