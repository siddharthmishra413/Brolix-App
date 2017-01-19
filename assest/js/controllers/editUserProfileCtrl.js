app.controller('editUserProfileCtrl', function($scope, $window, userService, $state, toastr, $stateParams, $http) {
    $(window).scrollTop(0, 0);
    $scope.class = true;
    $scope.$emit('headerStatus', 'Manage User');
    $scope.$emit('SideMenu', 'Manage User');
    $scope.myForm = {};
    $scope.viewUserProfile = {};
    var id = $stateParams.id;
    console.log("Id====>>>"+id)
    userService.countrys().success(function(res) {
        $scope.country = res.result;
    }).error(function(status, data) {

    })
    $scope.catId = function() {
        console.log($scope.viewUserProfile.country);
        var country = $scope.viewUserProfile.country
        $http.get('/admin/getAllStates/' + country.code + '/ISO2').success(function(res) {
            $scope.allstates = res.result;
        }, function(err) {});
    }

    if(id == ''){
     toastr.error("Please select user.")
     $state.go('header.manageUsers')
 }else {
    userService.userProfile(id).success(function(res) {
        if (res.responseCode == 200) {
            $scope.viewUserProfile = res.result;
            var updateDate = new Date($scope.viewUserProfile.dob);
            $scope.viewUserProfile.dob = moment(updateDate).format('MM/DD/YYYY');
        } else {
            toastr.error(res.responseMessage)
        }
    })
}


$scope.updateUser = function() {
    $scope.viewUserProfile.country = $scope.viewUserProfile.country.name;
    userService.editUserProfile(id,$scope.viewUserProfile).success(function(res) {
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