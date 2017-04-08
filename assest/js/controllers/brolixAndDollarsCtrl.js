app.controller('brolixAndDollarsCtrl', function($scope, $window, userService, $state, toastr, $http, $timeout) {
    $(window).scrollTop(0, 0);
    $scope.$emit('headerStatus', 'Admin Tools');
    $scope.$emit('SideMenu', 'Admin Tools');
    console.log("brolixAndDollarsCtrl");

    userService.viewAllBrolixAndDollors().success(function(res) {
    console.log("resssss",res);        
        if (res.responseCode == 200){
            $scope.brolixPerFreeCouponAds = res.result[0].value;
            $scope.brolixPerFreeCashAds = res.result[1].value;
            $scope.brolixPerUpgradedCashAds = res.result[2].value;
            $scope.brolixForInvitation = res.result[3].value;
            $scope.viewerPriceForCashAds = res.result[4].value;
            $scope.brolixFeeForCashAds = res.result[5].value;
            $scope.storeCouponPriceForFreeAds = res.result[6].value;
            $scope.storeCouponPriceForUpgradedAds = res.result[7].value;
            $scope.freeViewersPerCouponAds = res.result[8].value;
            $scope.freeViewersPerCashAds = res.result[9].value;
            console.log("res",JSON.stringify(res.result));
        } else {
            toastr.error(res.responseMessage);
        }
    })

    $scope.editBrolixAndDollors =  function(type){
        console.log("type",type)
        var data = {};

        switch (type)
            {
                case 'brolixPerFreeCouponAds': 
                    
                    data = {
                        value:$scope.brolixPerFreeCouponAds
                    }
                    console.log("data",data)
                    userService.brolixPerFreeCouponAds(type,data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Update brolixPerFreeCouponAds Successfully");
                            $state.reload(); 
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'brolixPerFreeCashAds': 
                    
                    data = {
                        value:$scope.brolixPerFreeCashAds
                    }
                    userService.brolixPerFreeCouponAds(type,data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Update brolixPerFreeCashAds Successfully");
                            $state.reload(); 
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'brolixPerUpgradedCashAds': 
                    
                    data = {
                        value:$scope.brolixPerUpgradedCashAds
                    }
                    userService.brolixPerFreeCouponAds(type,data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Update brolixPerUpgradedCashAds Successfully");
                            $state.reload(); 
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'brolixForInvitation': 
                    
                    data = {
                        value:$scope.brolixForInvitation
                    }
                    userService.brolixPerFreeCouponAds(type,data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Update brolixForInvitation Successfully");
                            $state.reload(); 
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'viewerPriceForCashAds': 
                    
                    data = {
                        value:$scope.viewerPriceForCashAds
                    }
                    userService.brolixPerFreeCouponAds(type,data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Update viewerPriceForCashAds Successfully");
                            $state.reload(); 
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'brolixFeeForCashAds': 
                    
                    data = {
                        value:$scope.brolixFeeForCashAds
                    }
                    userService.brolixPerFreeCouponAds(type,data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Update brolixFeeForCashAds Successfully");
                            $state.reload(); 
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'storeCouponPriceForFreeAds': 
                    
                    data = {
                        value:$scope.storeCouponPriceForFreeAds
                    }
                    userService.brolixPerFreeCouponAds(type,data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Update storeCouponPriceForFreeAds Successfully");
                            $state.reload(); 
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'storeCouponPriceForUpgradedAds': 
                    
                    data = {
                        value:$scope.storeCouponPriceForUpgradedAds
                    }
                    userService.brolixPerFreeCouponAds(type,data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Update storeCouponPriceForUpgradedAds Successfully");
                            $state.reload(); 
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                default: 
                toastr.error("Something wents to wroung");
                
            }


    }
})