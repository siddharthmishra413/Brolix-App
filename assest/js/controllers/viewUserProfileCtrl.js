app.controller('viewUserProfileCtrl', function($scope, $window, userService, $state, toastr, $stateParams) {
    $(window).scrollTop(0, 0);
    $scope.class = true;
    $scope.$emit('headerStatus', 'Manage User');
    $scope.$emit('SideMenu', 'Manage User');
    $scope.myForm = {};
    var id = $stateParams.id;
    console.log("Id====>>>"+id)
    if(id == ''){
       toastr.error("Please select user.")
       $state.go('header.manageUsers')
   }else {
    userService.userProfile(id).success(function(res) {
        if (res.responseCode == 200) {
            $scope.viewUserProfile = res.result;
            console.log(JSON.stringify($scope.viewUserProfile));
        } else {
            toastr.error(res.responseMessage)
        }
    })
    }
})


  