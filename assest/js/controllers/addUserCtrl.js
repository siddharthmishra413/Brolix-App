app.controller('addUserCtrl', function($scope, $state, $window, userService, $http, toastr, $timeout) {
    $(window).scrollTop(0, 0);
    $scope.$emit('headerStatus', 'Manage User');
    $scope.$emit('SideMenu', 'Manage User');
    $scope.minDate = new Date().toDateString();
    $scope.myFrom = {};
    $scope.myFrom.gender = "Male";
    userService.countryListData().success(function(res) {
        $scope.countries = res.result;
    })

    $('#output').on('click', function(e){
        $("#toggle").toggle();
        $(this).toggleClass('success')
    });

    $scope.changeCountry = function() {
        var obj = {};
        obj = {
            country: $scope.myFrom.country,
        }
        userService.cityListData(obj).success(function(res) {
            $scope.cityList = res.result;
        })
    }

    $scope.addUser = function() {
        $scope.myFrom.isVerified = "TRUE";
        $scope.myFrom.type = "USER";
        console.log("$scope.myFrom",$scope.myFrom)
        userService.addUser($scope.myFrom).success(function(res) {
            if (res.responseCode == 200) {
                toastr.success(res.responseMessage);
                $state.go('header.manageUsers')
            } else {
                toastr.error(res.responseMessage);
            }
        }).error(function(status, data) {})
    }

    $scope.cancel = function() {
        $state.go('header.manageUsers');
    }
})