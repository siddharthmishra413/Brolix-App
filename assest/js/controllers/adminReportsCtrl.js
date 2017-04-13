app.controller('adminReportsCtrl', function($scope, $window, userService, $state, toastr, $http, $timeout) {
    $(window).scrollTop(0, 0);
    $scope.$emit('headerStatus', 'Admin Tools');
    $scope.$emit('SideMenu', 'Admin Tools');

    $scope.currentShowReportedAd = 1;
         $scope.nextShowReportedAdDetail = function(){
             userService.showReportedAd($scope.currentShowReportedAd).success(function(res) { 
                 console.log("val",JSON.stringify(res))
                if (res.responseCode == 404) {
                    toastr.error(res.responseMessage);
                    $state.go('login')
                 }
                    else if (res.responseCode == 200){
                       $scope.noOfPagesShowReportedAd = res.result.pages;
                       $scope.pageShowReportedAd= res.result.page;
                       $scope.allReports = res.result.docs;
                   } 
                   else if(res.responseCode == 400){
                        toastr.error(res.responseMessage);
                    }else{
                        toastr.error(res.responseMessage);
                    }
              })
    }
     $scope.nextShowReportedAdDetail();
     $scope.nextShowReportedAd = function(){
        $scope.currentShowReportedAd++;
        $scope.nextShowReportedAdDetail();
     }
     $scope.preShowReportedAd= function(){
        $scope.currentShowReportedAd--;
        $scope.nextShowReportedAdDetail();
     }
    // userService.showReportedAd().success(function(res) {
    //     console.log(JSON.stringify(res))
    //         if (res.responseCode == 404) {
    //             toastr.error(res.responseMessage);
    //             $state.go('login')
    //         }else if(res.responseCode == 200) {
    //             $scope.allReports= res.result;
    //             console.log("asassa12",JSON.stringify($scope.allReports))
    //         }else if(res.responseCode == 400){
    //             toastr.error(res.responseMessage);
    //         }else{
    //             toastr.error(res.responseMessage);
    //         }
    //     })

})