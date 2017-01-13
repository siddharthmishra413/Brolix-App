app.controller('loginCtrl', function($scope, $window, $state, userService, $cookieStore, toastr) {
    $(window).scrollTop(0, 0);
    console.log("loginCtrl");
    $scope.myFrom = {};

    $scope.login = function(user, rem) {
        if (rem) {
            localStorage.setItem('isRemeber', true);
            $cookieStore.put('Credential', user);

        } else {
            localStorage.setItem('isRemeber', false);
        }
        userService.login($scope.myFrom).success(function(res) {
            if (res.responseCode == 200) {
                console.log("Login successfully" + JSON.stringify(res))
                //toastr.success(res.responseMessage);
                $state.go('header.manageUsers')
            } else if (res.responseCode == 404) {
                toastr.error(res.responseMessage);
            }

        }).error(function(status, data) {

        })


    }

})
