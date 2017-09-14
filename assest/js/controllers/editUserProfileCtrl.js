app.controller('editUserProfileCtrl', function($scope, $window, userService, $state, toastr, $stateParams, $http, $timeout) {
    $(window).scrollTop(0, 0);
    $scope.class = true;
    $scope.$emit('headerStatus', 'Manage User');
    $scope.$emit('SideMenu', 'Manage User');
    $scope.myForm = {};
    $scope.viewUserProfile = {};
    $scope.cityFirst = true;
    $scope.citySecond = false;
    var id = $stateParams.id;
    $scope.minDate = new Date().toDateString();

    userService.countryListData().success(function(res) {
        $scope.countriesList = res.result;
    })

    // $scope.changeCountry = function() {
    //     var obj = {};
    //     obj = {
    //         country: $scope.dashBordFilter.country,
    //     }
    //     userService.cityListData(obj).success(function(res) {
    //         $scope.cityList = res.result;
    //     })
    // }

    $scope.changeCountry = function() {
        $scope.cityFirst = false;
        $scope.citySecond = true;
        var obj = {};
        obj = {
            country: $scope.viewUserProfile.country,
        }
        userService.cityListData(obj).success(function(res) {
            console.log("res",res)
            $scope.cityList = res.result;
        })
    }

    if (id == '') {
        toastr.error("Please select user.")
        $state.go('header.manageUsers')
    } else {
        userService.viewProfile(id).success(function(res) {
            if (res.responseCode == 200) {
                $scope.viewUserProfile = res.result;
                console.log("$scope.viewUserProfile",$scope.viewUserProfile.gender)
                $scope.viewUserProfile.country = res.result.country;
                $scope.viewUserProfile.state = res.result.state;
                var updateDate = new Date($scope.viewUserProfile.dob);
                $scope.viewUserProfile.dob = moment(updateDate).format('MM/DD/YYYY');
                $scope.viewUserProfile.coufgdntry = $scope.viewUserProfile.country;
                $scope.viewUserProfile.statedfd = $scope.viewUserProfile.state;
            } else {
                toastr.error(res.responseMessage)
            }
        })
    }

    $scope.updateUser = function() {
        userService.editUserProfile(id, $scope.viewUserProfile).success(function(res) {
            if (res.responseCode == 200) {
                toastr.success(res.responseMessage);
                $state.go('header.manageUsers')
            } else {
                toastr.error(res.responseMessage);
            }
        }).error(function(status, data) {
        })
    }
})