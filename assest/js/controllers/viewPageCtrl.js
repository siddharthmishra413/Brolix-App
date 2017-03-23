app.controller('viewPageCtrl', function($scope, $window, userService, $state, toastr, $stateParams, $http) {
    $(window).scrollTop(0, 0);
    $scope.class = true;
    $scope.$emit('headerStatus', 'Manage Pages');
    $scope.$emit('SideMenu', 'Manage Pages');
    $scope.myForm = {};
    $scope.viewUserProfile = {};
    $scope.coverImage = "../dist/image/cover.jpg";
    $scope.pageImage = "../dist/image/user-image.jpeg";
    $scope.id = $stateParams.id;
    //console.log("Id====>>>" + $scope.id)

    if ($scope.id == '') {
        toastr.error("Please first select.")
        $state.go('header.managePages')
    } else {
        userService.viewPage($scope.id).success(function(res) {
            //console.log("idddddddddddd",$scope.id)
            if (res.responseCode == 200) {
                $scope.viewPageDetails = res.result;
                console.log("data" + $scope.viewPageDetails);

                // var updateDate = new Date($scope.viewUserProfile.dob);
                // $scope.viewUserProfile.dob = moment(updateDate).format('MM/DD/YYYY');
            } else {
                toastr.error(res.responseMessage)
            }
        })
    }

})
