app.controller('manageUsersCtrl', function($scope, $window, userService, $state) {
    $(window).scrollTop(0, 0);
    $scope.class = true;
    $scope.$emit('headerStatus', 'Manage User');
    $scope.$emit('SideMenu', 'Manage User');
    console.log("manageUsersCtrl");

    userService.adminProfile().success(function(res) {
    	if(res.responseCode == 404){
    		bootbox.alert(res.responseMessage);
    		$state.go('login')
    	}else {
    		$scope.user = res.result;
    		//console.log(JSON.stringify($scope.user))
    	}
    }).error(function(status, data) {

})

})
