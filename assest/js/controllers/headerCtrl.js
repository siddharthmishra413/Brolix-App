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
        //console.log("userDetails--->",JSON.stringify($scope.user))

        localStorage.loginData=res.result._id;
        $scope.userId = res.result._id; 
        localStorage.setItem('userId',$scope.userId);
        $scope.image = $scope.user.image;
        $scope.type = res.result.type;
        $scope.userPermissions = res.result.permissions;
              var data=[];
       angular.forEach($scope.userPermissions,function(value,key) {
          data.push(value);
       }) 
        //console.log("userPermissions--->",JSON.stringify(data))

            $scope.manageUser = false;
            $scope.managePages = false;
            $scope.manageAds = false;
            $scope.manageCards = false;
            $scope.manageGifts = false;
            $scope.managePayments = false;
            $scope.adminTool = false;
            $scope.addSystemUser = false;
          
        
        for (var i = 0; i<=data.length; i++) {
          if(data[i] == "manageUser")
            {
           $scope.manageUser = true;
            }
           if(data[i] == "managePages")
           {
           $scope.managePages = true;
           }
           if(data[i] == "manageAds")
            {
           $scope.manageAds = true;
            }
           if(data[i] == "manageCards")
           {
           $scope.manageCards = true;
           }
           if(data[i] == "manageGifts")
            {
           $scope.manageGifts = true;
            }
           if(data[i] == "managePayments")
           {
           $scope.managePayments = true;
           }
           if(data[i] == "adminTool")
           {
           $scope.adminTool = true;
           }
        }

          if($scope.type == "ADMIN")
            {
              $scope.addSystemUser = true;
            }else {
              $scope.addSystemUser = false;
            }
    	}
    }).error(function(status, data) {

})
    
     $scope.logout = function() {
        $state.go('login')
    }

})
