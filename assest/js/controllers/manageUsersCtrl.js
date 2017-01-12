app.controller('manageUsersCtrl', function($scope, $window, userService, $state) {
    $(window).scrollTop(0, 0);
    $scope.class = true;
    $scope.$emit('headerStatus', 'Manage User');
    $scope.$emit('SideMenu', 'Manage User');
    console.log("manageUsersCtrl");
    $scope.tab = 'totalUsers';

    userService.adminProfile().success(function(res) {
        if (res.responseCode == 404) {
            bootbox.alert(res.responseMessage);
            $state.go('login')
        } else {
            $scope.user = res.result;
        }
    })

    userService.totalUser().success(function(res) {
        $scope.totalUser = res.result;
        //console.log(JSON.stringify($scope.totalUser[0]))
    })

    $scope.getValue = function(x){
       console.log(JSON.stringify(x));
    }

    userService.totalWinners().success(function(res) {
        $scope.totalWinners = res.result;
    })


})
