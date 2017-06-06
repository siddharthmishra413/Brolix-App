app.controller('homepageAdsCtrl', function($scope, $window, userService,spinnerService,$timeout, uploadimgServeice, $state, toastr, $stateParams, $http) {
    $(window).scrollTop(0, 0);
    $scope.$emit('headerStatus', 'Manage Ads');
    $scope.$emit('SideMenu', 'Manage Ads');
    $scope.allCards = {};
    $scope.active_coupons_types=true;
    $scope.user = {};
    $scope.myForm = {};
    //$scope.cardType = 'coupons_types';
    $scope.cardDetails = {};

    userService.listOfAds().success(function(res) {
      console.log("resssssssssssssss",JSON.stringify(res))
      $scope.couponAds = res.couponType;
      $scope.cashType = res.cashType;
      console.log("$scope.cashType",$scope.cashType)
      console.log("$scope.couponAds",$scope.couponAds)
        // $scope.UpgradeCard = res.data;
        // console.log("$scope.UpgradeCard",JSON.stringify($scope.UpgradeCard));
        // $scope.user.photo = '';
        // $scope.cardDetails.photo = '';
    })

    

    $scope.showAdsDetails = function(id){
      $scope.user.photo = '';
      console.log("iddddddddd",id)
      userService.adsDetail('58eb50626b7bf95c7b1a47de').success(function(res){
        console.log("res",JSON.stringify(res))
        $scope.adsDetails = res.result;
        console.log("$scope.adsDetails",$scope.adsDetails)
      })

    }

    $scope.active_tab=function(active_card){
      console.log("coupons_types",active_card)
        if(active_card=='coupons_types'){
        $scope.active_coupons_types=true;
        $scope.active_cash_types=false;
        $scope.user.photo = '';
        $scope.cardDetails.photo = '';
      }else if(active_card=='cash_types'){
        $scope.user.photo = '';
        $scope.cardDetails.photo = '';
        $scope.active_coupons_types=false;
        $scope.active_cash_types=true;
    //     userService.viewcard(active_card).success(function(res) {
    //     console.log("datatatatatata",res)
    //     $scope.cashType = res.data;
    //     console.log("$scope.LuckCard",$scope.cashType)
    // })
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