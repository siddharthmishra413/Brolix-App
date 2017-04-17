app.controller('deafultBrolixAndDollarsCtrl', function($scope, $window, userService, $state, toastr, $http, $timeout) {
    $(window).scrollTop(0, 0);
    $scope.$emit('headerStatus', 'Admin Tools');
    $scope.$emit('SideMenu', 'Admin Tools');
    console.log("brolixAndDollarsCtrl");

    // userService.viewAllBrolixAndDollors().success(function(res) {
    // console.log("resssss",res);        
    //     if (res.responseCode == 200){
    //         $scope.freeViewersPerCouponAds = res.result[8].value;
    //         $scope.freeViewersPerCashAds = res.result[9].value;
    //         console.log("freeViewersPerCouponAds",JSON.stringify(freeViewersPerCouponAds));
    //         console.log("freeViewersPerCashAds",JSON.stringify(freeViewersPerCashAds));
    //     } else {
    //         toastr.error(res.responseMessage);
    //     }
    // })

    userService.viewAllBrolixAndDollors().success(function(res) {
    console.log("resssss",res);        
        if (res.responseCode == 200){
            $scope.freeViewersPerCouponAds = res.result[8].value;
            $scope.freeViewersPerCashAds = res.result[9].value;
            console.log("freeViewersPerCouponAds",JSON.stringify(freeViewersPerCouponAds));
            console.log("freeViewersPerCashAds",JSON.stringify(freeViewersPerCashAds));
            console.log("res",JSON.stringify(res.result));
        } else {
            toastr.error(res.responseMessage);
        }
    })

    $scope.editBrolixAndDollors =  function(type){
        console.log("brolixAndDollarsCtrl");
        console.log("type",type)
        var data = {};

        switch (type)
            {
                case 'freeViewersPerCouponAds': 
                    
                    data = {
                        value:$scope.freeViewersPerCouponAds
                    }
                    console.log("data",data)
                    userService.brolixPerFreeCouponAds(type,data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Update freeViewersPerCouponAds Successfully");
                            $state.reload(); 
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'freeViewersPerCashAds': 
                    
                    data = {
                        value:$scope.freeViewersPerCashAds
                    }
                    userService.brolixPerFreeCouponAds(type,data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Update freeViewersPerCashAds Successfully");
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