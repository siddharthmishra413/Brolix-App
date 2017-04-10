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
    		$state.go('login')
    	}else {

    		$scope.user = res.result;
        $scope.userPermissions = res.result.permissions;
              var data=[];
       angular.forEach($scope.userPermissions,function(value,key){
          data.push(value);
       })
            localStorage.loginData=res.result._id;
            console.log("userPermissions",JSON.stringify(data))
    		$scope.image = $scope.user.image
    	}
    }).error(function(status, data) {

})
    
    
    

    $scope.logout = function() {
        $state.go('login')
    }

})
