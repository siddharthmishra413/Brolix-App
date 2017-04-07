app.controller('removeCardCtrl', function($scope, $window, userService, $state, toastr, $stateParams, $http) {
    $(window).scrollTop(0, 0);
    $scope.$emit('headerStatus', 'Manage Cards');
    $scope.$emit('SideMenu', 'Manage Cards');
    $scope.allCards = {};
    $scope.active_upgrade_card=true;
    $scope.cardType = 'upgrade_card';


    userService.viewcard($scope.cardType).success(function(res) {
      console.log("resssssssssssssss",res)
        $scope.UpgradeCard = res.data;
        console.log("UpgradeCard",$scope.UpgradeCard);
    })

    $scope.addcardId = function(id){
      userService.removeCard(id).success(function(res){
        if(res.responseCode ==  200) {
          toastr.success('Card Removed Successfully');
          $state.reload();
        }else{
          toastr.error(res.responseMessage);
          $state.reload();
        }
      })

    }

    // userService.viewcard($scope.cardType).success(function(res){
    //   if($scope.cardType=="upgrade_card"){
    //     $scope.UpgradeCard = res.data;
    //     console.log("UpgradeCard",$scope.UpgradeCard);
    //   }
    //   else{
    //     $scope.LuckCard = res.data;
    //     console.log("LuckCard",$scope.LuckCard);
    //   }
    // })

   // if (id == '') {
   //     toastr.error("Please select user.")
   //     $state.go('header.manageUsers')
   // } else {
   //     userService.userProfile(id).success(function(res) {
   //         if (res.responseCode == 200) {
   //             $scope.viewUserProfile = res.result;
   //             var updateDate = new Date($scope.viewUserProfile.dob);
   //             $scope.viewUserProfile.dob = moment(updateDate).format('MM/DD/YYYY');
   //             console.log("fsdfsdfsdfs",$scope.viewUserProfile)
   //         } else {
   //             toastr.error(res.responseMessage)
   //         }
   //     })
   // }

    $scope.active_tab=function(active_card){
        if(active_card=='upgrade_card'){
        $scope.active_upgrade_card=true;
         $scope.active_luck_card=false;
      }else{
        userService.viewcard(active_card).success(function(res) {
        console.log("resssssssssssssss",res)
        $scope.LuckCard = res.data;
        console.log("LuckCard",$scope.LuckCard);
    })
         $scope.active_upgrade_card=false;
            $scope.active_luck_card=true;
      }
    }

   // $scope.updateUser = function() {
   //     $scope.viewUserProfile.country = $scope.viewUserProfile.country.name;
   //     console.log(JSON.stringify($scope.viewUserProfile));
   //     userService.editUserProfile(id, $scope.viewUserProfile).success(function(res) {
   //         if (res.responseCode == 200) {
   //             toastr.success(res.responseMessage);
   //             $state.go('header.manageUsers')
   //         } else {
   //             toastr.error(res.responseMessage);
   //         }
   //     }).error(function(status, data) {

   //     })
   // }


})