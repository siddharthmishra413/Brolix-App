app.controller('headerCtrl', function($scope, $window, $state, userService) {
    $(window).scrollTop(0, 0);
    //console.log("headerCtrl");
     $scope.image = "../dist/image/left-img.png"
    $scope.$on('headerStatus', function(event, data) {
        $scope.header = data;
    });
    $scope.$on('SideMenu', function(event, data) {
        $scope.menu = data;
    });

    userService.adminProfile().success(function(res) {
    	if(res.responseCode == 404){
    		//bootbox.alert(res.responseMessage);
    		$state.go('login')
    	}else {
    		$scope.user = res.result;
    		$scope.image = $scope.user.image
    		console.log(JSON.stringify($scope.user))
    	}
    }).error(function(status, data) {

})

    $scope.logout = function() {
        $state.go('login')
    }

})
