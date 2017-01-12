app.controller('addUserCtrl', function($scope, $window, userService) {
    $(window).scrollTop(0, 0);
    $scope.$emit('headerStatus', 'Manage User');
    $scope.$emit('SideMenu', 'Manage User');

    $scope.myFrom = {};

    $scope.addUser = function() {
    	$scope.myFrom.type = "USER";
    	userService.addUser($scope.myFrom).success(function(res) {
    		console.log(JSON.stringify(res))
            $state.go('header.manageUsers')
        }).error(function(status, data) {

        })
    }

    $scope.cancel = function () {
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