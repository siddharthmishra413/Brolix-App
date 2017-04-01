app.controller('editCardCtrl', function($scope, $window, userService,spinnerService,$timeout, uploadimgServeice, $state, toastr, $stateParams, $http) {
    $(window).scrollTop(0, 0);
    $scope.$emit('headerStatus', 'Manage Cards');
    $scope.$emit('SideMenu', 'Manage Cards');
    $scope.allCards = {};
    $scope.active_upgrade_card=true;
    $scope.user = {};
    $scope.myForm = {};
    $scope.cardType = 'upgrade_card';
    $scope.cardDetails = {};

    userService.viewcard($scope.cardType).success(function(res) {
      console.log("resssssssssssssss",res)
        $scope.UpgradeCard = res.data;
        console.log("$scope.UpgradeCard",JSON.stringify($scope.UpgradeCard));
        $scope.user.photo = '';
        $scope.cardDetails.photo = '';
    })

    $scope.changeImage = function(input) {
        spinnerService.show('html5spinner'); 
        var file = input.files[0];
        var ext = file.name.split('.').pop();
        if(ext=="jpg" || ext=="jpeg" || ext=="bmp" || ext=="gif" || ext=="png"){
            $scope.imageName = file.name;
            uploadimgServeice.user(file).then(function(ObjS) {
                 $timeout(function () {      
                spinnerService.hide('html5spinner');     
            $scope.myForm.photo = ObjS.data.result.url;
            $scope.user.photo = ObjS.data.result.url;
            }, 250); 
            console.log("pjototot",$scope.user.photo);
        })
        }else{
            toastr.error("Only image supported.")
        }        
    }

    $scope.showCardDetails = function(id){
      $scope.user.photo = '';
      console.log("iddddddddd",id)
      userService.showCardDetails(id).success(function(res){
        $scope.cardDetails = res.data;
        console.log("$scope.cardDetails",$scope.cardDetails)
      })

    }

    $scope.active_tab=function(active_card){
      console.log("active_card",active_card)
        if(active_card=='upgrade_card'){
        $scope.active_upgrade_card=true;
         $scope.active_luck_card=false;
         $scope.user.photo = '';
        $scope.cardDetails.photo = '';
      }else if(active_card=='luck_card'){
        $scope.user.photo = '';
        $scope.cardDetails.photo = '';
        $scope.active_upgrade_card=false;
        $scope.active_luck_card=true;
        userService.viewcard(active_card).success(function(res) {
        console.log("asassasa",res)
        $scope.LuckCard = res.data;
    })
      }
      else{
        toastr.error("somthing wents to roung")
      }
    }

    $scope.updateCard = function(type,id,photo) { 
      var data = {};
      console.log("row data",type,id,photo)
      if($scope.user.photo==null || $scope.user.photo==undefined || $scope.user.photo==''){
        console.log("1")
        if(type=='upgrade_card'){
            var data = {
                cardId:id,
                type:type,
                viewers:$scope.cardDetails.viewers,
                price:$scope.cardDetails.price,
                photo:photo
            }
            console.log("data 1",data);
            userService.editCards(data).success(function(res) {
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
                cardId:id,
                type:type,
                chances:$scope.cardDetails.chances,
                brolix:$scope.cardDetails.brolix,
                photo:photo
            }
            userService.editCards(data).success(function(res) {
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
    }else{
        console.log("2s")
        if(type=='upgrade_card'){
            var data = {
                cardId:id,
                type:type,
                viewers:$scope.cardDetails.viewers,
                price:$scope.cardDetails.price,
                photo:$scope.user.photo
            }
            console.log("data 1",data);
            userService.editCards(data).success(function(res) {
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
                cardId:id,
                type:type,
                chances:$scope.cardDetails.chances,
                brolix:$scope.cardDetails.brolix,
                photo:$scope.user.photo
            }
            userService.editCards(data).success(function(res) {
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
}

})