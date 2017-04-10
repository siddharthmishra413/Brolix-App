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
            console.log("$scope.user",$scope.user)
            $scope.user1= res.result.permissions;
            localStorage.loginData=res.result._id;
            console.log("dataaa",JSON.stringify(localStorage.loginData))
    		$scope.image = $scope.user.image
    	}
    }).error(function(status, data) {

})

     $scope.checkPermission = function(type) {

        
        $scope.type = type;
        console.log("permissionSection---->>",$scope.type);


        switch ($scope.type)
            {
                case 'manageUsers': 
                        var data = {
                                    "userId": localStorage.loginData,
                                    "permission": $scope.user1,
                                    }

                            console.log("checkpermission--->"+JSON.stringify(data))
                            userService.checkPermission(data).success(function(res) {
                                console.log(res);
                                if(res.responseCode == 404){
                                  toastr.error(res.responseMessage)
                                }else {
                                        
                                        if(res.responseMessage != "You are allowed to go.")
                                        {
                                            alert('Not allowed');
                                        }
                                            
                                           }
                                    }).error(function(status, data) {
                                  })
                                                    
                       break;

                case 'managePages': 
                        var data = {
                                    "userId": localStorage.loginData,
                                    "permission": $scope.user1,
                                    }

                            console.log("checkpermission--->"+JSON.stringify(data))
                            userService.checkPermission(data).success(function(res) {
                                console.log(res);
                                if(res.responseCode == 404){
                                  toastr.error(res.responseMessage)
                                }else {
                                         
                                     if(res.responseMessage != "You are allowed to go.")
                                            {
                                                alert('Not allowed');
                                            }else if(res.responseMessage == "You are allowed to go.")
                                            {
                                                alert('allowed');
                                            }
                                                
                                      }
                                    }).error(function(status, data) {
                                  })
                                                    
                       break;

                case 'manageAds': 
                        var data = {
                                    "userId": localStorage.loginData,
                                    "permission": $scope.user1,
                                    }

                            console.log("checkpermission--->"+JSON.stringify(data))
                            userService.checkPermission(data).success(function(res) {
                                console.log(res);
                                if(res.responseCode == 404){
                                  toastr.error(res.responseMessage)
                                }else {
                                         
                                     if(res.responseMessage != "You are allowed to go.")
                                            {
                                                alert('Not allowed');
                                            }else if(res.responseMessage == "You are allowed to go.")
                                            {
                                                alert('allowed');
                                            }
                                                
                                      }
                                    }).error(function(status, data) {
                                  })
                        break;

                case 'manageCards': 
                         var data = {
                                    "userId": localStorage.loginData,
                                    "permission": $scope.user1,
                                    }

                            console.log("checkpermission--->"+JSON.stringify(data))
                            userService.checkPermission(data).success(function(res) {
                                console.log(res);
                                if(res.responseCode == 404){
                                  toastr.error(res.responseMessage)
                                }else {
                                         
                                     if(res.responseMessage != "You are allowed to go.")
                                            {
                                                alert('Not allowed');
                                            }else if(res.responseMessage == "You are allowed to go.")
                                            {
                                                alert('allowed');
                                            }
                                                
                                      }
                                    }).error(function(status, data) {
                                  })
                          break;

                case 'manageGifts': 
                        var data = {
                                    "userId": localStorage.loginData,
                                    "permission": $scope.user1,
                                    }

                            console.log("checkpermission--->"+JSON.stringify(data))
                            userService.checkPermission(data).success(function(res) {
                                console.log(res);
                                if(res.responseCode == 404){
                                  toastr.error(res.responseMessage)
                                }else {
                                         
                                     if(res.responseMessage != "You are allowed to go.")
                                            {
                                                alert('Not allowed');
                                            }else if(res.responseMessage == "You are allowed to go.")
                                            {
                                                alert('allowed');
                                            }
                                                
                                      }
                                    }).error(function(status, data) {
                                  })
                                                    
                       break;

                case 'managePayment': 
                        var data = {
                                    "userId": localStorage.loginData,
                                    "permission": $scope.user1,
                                    }

                            console.log("checkpermission--->"+JSON.stringify(data))
                            userService.checkPermission(data).success(function(res) {
                                console.log(res);
                                if(res.responseCode == 404){
                                  toastr.error(res.responseMessage)
                                }else {
                                         
                                     if(res.responseMessage != "You are allowed to go.")
                                            {
                                                alert('Not allowed');
                                            }else if(res.responseMessage == "You are allowed to go.")
                                            {
                                                alert('allowed');
                                            }
                                                
                                      }
                                    }).error(function(status, data) {
                                  })
                                                    
                       break;

                case 'adminTools': 
                         var data = {
                                    "userId": localStorage.loginData,
                                    "permission": $scope.user1,
                                    }

                            console.log("checkpermission--->"+JSON.stringify(data))
                            userService.checkPermission(data).success(function(res) {
                                console.log(res);
                                if(res.responseCode == 404){
                                  toastr.error(res.responseMessage)
                                }else {
                                         
                                     if(res.responseMessage != "You are allowed to go.")
                                            {
                                                alert('Not allowed');
                                            }else if(res.responseMessage == "You are allowed to go.")
                                            {
                                                alert('allowed');
                                            }
                                                
                                      }
                                    }).error(function(status, data) {
                                  })
                                                    
                       break;

                default: 

                     toastr.error("Something Wents to wrong");
                
            }
 }
    

    $scope.logout = function() {
        $state.go('login')
    }

})
