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
    console.log("Id====>>>" + $scope.id)

    if ($scope.id == '') {
        toastr.error("Please first select.")
        $state.go('header.managePages')
    } else {

        userService.viewPage($scope.id).success(function(res) {
            if (res.responseCode == 200) {
                $scope.viewPageDetails = res.result;
                console.log("admin array",JSON.stringify($scope.viewPageDetails.pageImage))
                console.log("admin array",JSON.stringify($scope.viewPageDetails.coverImage))
                console.log("all the data",JSON.stringify(res.result));

                $scope.myForm.pagephoto = $scope.viewPageDetails.pageImage;
                $scope.myForm.userphoto=$scope.viewPageDetails.coverImage;
                for(i=0;i<$scope.viewPageDetails.socialMedia.length;i++){
                  $scope.myForm.socialMedia=$scope.viewPageDetails.socialMedia[i];
                }
                
                console.log("$scope.viewPageDetails$scope.viewPageDetails",JSON.stringify($scope.viewPageDetails))
                var geocoder = new google.maps.Geocoder();
                var latitude = $scope.viewPageDetails.location[0];
                var longitude = $scope.viewPageDetails.location[1];
                console.log(JSON.stringify(latitude+" "+longitude));
                var latLng = new google.maps.LatLng(latitude,longitude);
                geocoder.geocode({       
                        latLng: latLng     
                        }, 
                        function(responses) 
                        {     
                           if (responses && responses.length > 0) 
                           {        
                               $scope.myForm.address=responses[0].formatted_address; 
                               $scope.myForm.latitude=latitude;
                               $scope.myForm.longitude=longitude;
                               console.log("$scope.myForm.latitude=latitude",$scope.myForm.latitude);
                               console.log("$scope.myForm.$scope.myForm.longitude",$scope.myForm.longitude);
                               

                               for(i=0;i<responses[0].address_components.length;i++)
                                  {
                                    if(responses[0].address_components[i].types[0]=="country")
                                    {
                                      $scope.myForm.country =  responses[0].address_components[i].long_name;
                                    }
                                    if(responses[0].address_components[i].types[0]=="administrative_area_level_1")
                                    {
                                      $scope.myForm.state =  responses[0].address_components[i].long_name;
                                    }
                                    if(responses[0].address_components[i].types[0]=="administrative_area_level_2")
                                    {
                                      $scope.myForm.city =  responses[0].address_components[i].long_name;
                                    }
                                  }
                               $scope.$apply();  
                           } 
                           else 
                           {       
                             alert('Not getting Any address for given latitude and longitude.');     
                           }   
                        }
                );
            } else {
                toastr.error(res.responseMessage)
            }
        })
        // userService.viewPage($scope.id).success(function(res) {
        //     if (res.responseCode == 200) {
        //          $scope.viewPageDetails = res.result;
        //          console.log("page details",JSON.stringify($scope.viewPageDetails));
                // for(i=0;i<$scope.viewPageDetails.socialMedia.length;i++){
                //     $scope.socialMedia=$scope.viewPageDetails.socialMedia[i];
                // }
                // console.log(JSON.stringify($scope.socialMedia))
                // $scope.user.pagephoto = $scope.viewPageDetails.pageImage;
                // $scope.user.userphoto=$scope.viewPageDetails.coverImage;
                // console.log(JSON.stringify($scope.viewPageDetails ))
                // var geocoder = new google.maps.Geocoder();
                // var latitude = $scope.viewPageDetails.location[0];
                // var longitude = $scope.viewPageDetails.location[1];
                // console.log(JSON.stringify(latitude+" "+longitude));
                // var latLng = new google.maps.LatLng(latitude,longitude);
                // geocoder.geocode({       
                //         latLng: latLng     
                //         }, 
                //         function(responses) 
                //         {     
                //            if (responses && responses.length > 0) 
                //            {        
                //                $scope.myForm.address=responses[0].formatted_address; 
                //                $scope.$apply();  
                //            } 
                //            else 
                //            {       
                //              alert('Not getting Any address for given latitude and longitude.');     
                //            }   
                //         }
                // );
        //     } else {
        //         toastr.error(res.responseMessage)
        //     }
        // })
    }

})
