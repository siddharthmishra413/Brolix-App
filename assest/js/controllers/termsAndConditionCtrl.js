app.controller('termsAndConditionCtrl', function($scope, $stateParams, $window, userService, $state, toastr, $http, $timeout) {
    $(window).scrollTop(0, 0);
    $scope.$emit('headerStatus', 'Admin Tools');
    $scope.$emit('SideMenu', 'Admin Tools');
    $scope.myFrom = {};


    userService.viewAllTerms().success(function(res) {        
        if (res.responseCode == 200){

        	$scope.signUpTerms = res.result.filter(function( obj ) {
              return obj.type == 'signUpCondition';
            });
            $scope.myFrom.termssignUpCondition = $scope.signUpTerms[0].termsConditionContent;

            $scope.cashAdTerms = res.result.filter(function( obj ) {
              return obj.type == 'cashAdCondition';
            });
            $scope.myFrom.termscashAdCondition = $scope.cashAdTerms[0].termsConditionContent;

            $scope.couponAdTerms = res.result.filter(function( obj ) {
              return obj.type == 'couponAdCondition';
            });

            $scope.myFrom.termscouponAdCondition = $scope.couponAdTerms[0].termsConditionContent;

        } else {
            toastr.error(res.responseMessage);
        }
    })

    $scope.click = function(type){

    	
    	$scope.type = type;
    	console.log("type",$scope.type);


    	switch ($scope.type)
            {
                case 'signUpCondition': 
                    data = {
                        termsConditionContent:$scope.myFrom.termssignUpCondition,
                    }
                    // console.log("data------------",data)
                    // console.log("type------------",type)
                    userService.editTermsCondition(type,data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success(res.responseMessage);
                            $state.reload();
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })

                break;

                case 'cashAdCondition': 
                    data = {
                        termsConditionContent:$scope.myFrom.termscashAdCondition,
                    }
                    // console.log("data------------",data)
                    // console.log("type------------",type)
                    userService.editTermsCondition(type,data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success(res.responseMessage);
                            $state.reload();
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'couponAdCondition': 
                    data = {
                        termsConditionContent:$scope.myFrom.termscouponAdCondition,
                    }
                    // console.log("data------------",data)
                    // console.log("type------------",type)
                    userService.editTermsCondition(type,data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success(res.responseMessage);
                            $state.reload();
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                default: 

                     toastr.error("Something Wents to wroung");
                
            }


    }
    




})


