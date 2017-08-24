app.controller('headerCtrl', function($scope, $window, $state, userService) {
    $(window).scrollTop(0, 0);
    //console.log("headerCtrl");
    $scope.image = "http://res.cloudinary.com/dfrspfd4g/image/upload/v1503549944/jfkrhpoqqaqkrbvw27st.png"
    $scope.$on('headerStatus', function(event, data) {
        $scope.header = data;
    });
    $scope.$on('SideMenu', function(event, data) {
        $scope.menu = data;
    });

    userService.adminProfile().success(function(res) {
    	if(res.responseCode == 404){
    		$state.go('login')
    	}else if(res.responseCode == 200){

    		$scope.user = res.result;
        //console.log("userDetails--->",JSON.stringify($scope.user))

        localStorage.loginData=res.result._id;
        $scope.userId = res.result._id; 
        localStorage.setItem('userId',$scope.userId);
        $scope.image1 = $scope.user.image;
        console.log("$scope.image",$scope.image)
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
    	}else{
        $state.go('login')

      }
    }).error(function(status, data) {

})

    
     $scope.logout = function() {
      BootstrapDialog.show({
        title: 'Log out',
        message: 'Are you sure want to log out',
        buttons: [{
            label: 'Yes',
            action: function(dialog) {
              dialog.close();
              localStorage.removeItem('token');
              $state.go('login')
            }
        }, {
            label: 'No',
            action: function(dialog) {
                dialog.close();
            }
        }]
    });
    }
})
