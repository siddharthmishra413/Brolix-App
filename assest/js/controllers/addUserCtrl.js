app.controller('addUserCtrl', function($scope, $state, $window, userService, $http, toastr) {
    $(window).scrollTop(0, 0);
    $scope.$emit('headerStatus', 'Manage User');
    $scope.$emit('SideMenu', 'Manage User');

    $scope.myFrom = {};

    userService.countrys().success(function(res) {
        $scope.country = res.result;
    }).error(function(status, data) {

    })

    $scope.catId = function() {
        console.log($scope.myFrom.country);
        var country = $scope.myFrom.country
        $http.get('/admin/getAllStates/' + country.code + '/ISO2').success(function(res) {
            $scope.allstates = res.result;
        }, function(err) {});
    }


    $scope.addUser = function() {
        $scope.myFrom.type = "USER";
        $scope.myFrom.country = $scope.myFrom.country.name;
        userService.addUser($scope.myFrom).success(function(res) {
            if (res.responseCode == 200) {
            console.log(JSON.stringify(res))
            toastr.success(res.responseMessage);
            $state.go('header.manageUsers')
            } else {
                toastr.error(res.responseMessage);
            }
        }).error(function(status, data) {

        })
    }

    $scope.cancel = function() {
        $scope.myFrom = '';
        $scope.userFrom.firstName.$dirty = false;
        $scope.userFrom.firstName.$invalid = false;
        $scope.userFrom.firstName.$error.required = false;
        $scope.userFrom.lastName.$dirty = false;
        $scope.userFrom.lastName.$invalid = false;
        $scope.userFrom.lastName.$error.required = false;
        $scope.userFrom.dob.$dirty = false;
        $scope.userFrom.dob.$invalid = false;
        $scope.userFrom.dob.$error.required = false;
        $scope.userFrom.email.$dirty = false;
        $scope.userFrom.email.$invalid = false;
        $scope.userFrom.email.$error.required = false;
        $scope.userFrom.city.$dirty = false;
        $scope.userFrom.city.$invalid = false;
        $scope.userFrom.city.$error.required = false;
        $scope.userFrom.mobileNumber.$dirty = false;
        $scope.userFrom.mobileNumber.$invalid = false;
        $scope.userFrom.mobileNumber.$error.required = false;
        $scope.userFrom.country.$dirty = false;
        $scope.userFrom.country.$invalid = false;
        $scope.userFrom.country.$error.required = false;
    }

})