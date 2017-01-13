app.controller('viewUserProfileCtrl', function($scope, $window, userService, $state, toastr, $stateParams) {
    $(window).scrollTop(0, 0);
    $scope.class = true;
    $scope.$emit('headerStatus', 'Manage User');
    $scope.$emit('SideMenu', 'Manage User');
    console.log("viewUserProfileCtrl");
    $scope.myForm = {};
    var id = $stateParams.id;
  console.log("Id====>>>"+id)


    userService.userProfile(id).success(function(res) {
        if (res.responseCode == 200) {
            $scope.viewUserProfile = res.result;
        } else {
            toastr.error(res.responseMessage)
        }
})


})