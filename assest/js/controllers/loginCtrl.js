app.controller('loginCtrl', function($scope, $window, $state, userService, $cookieStore, toastr) {
    $(window).scrollTop(0, 0);
    console.log("loginCtrl");
    $scope.myFrom = {};
    $scope.myFrom.email = $cookieStore.get('Email');
    $scope.myFrom.password = $cookieStore.get('Password');
    if ($scope.myFrom.email == '' || $scope.myFrom.email == null || $scope.myFrom.email === undefined) {
        $scope.myFrom.rebMe = false;
    } else {
        $scope.myFrom.rebMe = true;
    }
    $scope.rebMe = function() {
        if ($scope.myFrom.rebMe == true) {
            $cookieStore.put("Email", $scope.myFrom.email);
            $cookieStore.put("Password", $scope.myFrom.password);
            $scope.myFrom.rebMe = true;
        } else {
            $cookieStore.remove('Email');
            $cookieStore.remove('Password');
        }
    }

    $scope.login = function() {
        userService.login($scope.myFrom).success(function(res) {
            if (res.responseCode == 200) {
                //console.log("Login successfully" + JSON.stringify(res.token));
                localStorage.setItem('token',res.token);
                //toastr.success(res.responseMessage);
                $state.go('header.manageUsers')
            } else if (res.responseCode == 404) {
                toastr.error(res.responseMessage);
            }

        }).error(function(status, data) {

        })


    }

})
