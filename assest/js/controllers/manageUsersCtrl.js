app.controller('manageUsersCtrl', function($scope, $window, userService, $state, toastr, $stateParams) {
    $(window).scrollTop(0, 0);
    $scope.class = true;
    $scope.$emit('headerStatus', 'Manage User');
    $scope.$emit('SideMenu', 'Manage User');
    console.log("manageUsersCtrl");
    $scope.tab = 'totalUsers';
    $scope.myForm = {};
    var id = $stateParams._id;
  console.log("Id====>>>"+id)
    //*******************Total Winners****************
    userService.totalWinners().success(function(res) {
        $scope.totalWinners = res.result;
    })
    userService.adminProfile().success(function(res) {
        if (res.responseCode == 404) {
            toastr.success(res.responseMessage);
            $state.go('login')
        } else {
            $scope.user = res.result;
        }
    })
    //*******************Total User****************
    userService.totalUser().success(function(res) {
        $scope.totalUser = res.result;
    })



})
