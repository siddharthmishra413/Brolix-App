app.controller('manageAdsCtrl', function ($scope,$window,userService) {
$(window).scrollTop(0,0);
 $scope.$emit('headerStatus', 'Manage Ads');
 $scope.$emit('SideMenu', 'Manage Ads');
 $scope.tab = 'totalads';

userService.totalAds().success(function(res) {
		if(res.responseCode == 409){
			$state.go('login')
		}else {
			$scope.totalAds = res.result;
			$scope.totalAdscount = res.count;
			//console.log(JSON.stringify(res))
		}
	}).error(function(status, data) {

})


userService.totalActiveAds().success(function(res) {
    	if(res.responseCode == 409){
    		$state.go('login')
    	}else {
    		$scope.totalActiveAds = res.result;
    		$scope.totalActiveAdscount = res.count;
    		console.log("jjjjjjj",JSON.stringify(res))
    	}
    }).error(function(status, data) {

}) 

userService.totalExpiredAds().success(function(res) {
    	if(res.responseCode == 409){
    		$state.go('login')
    	}else {
    		$scope.totalExpiredAds = res.result;
    		$scope.totalExpiredAdscount = res.count;
    		//console.log(JSON.stringify($scope.totalExpiredAds))
    	}
    }).error(function(status, data) {

})

userService.videoAds().success(function(res) {
    	if(res.responseCode == 409){
    		$state.go('login')
    	}else {
    		$scope.videoAds = res.result;
    		$scope.videoAdscount = res.count;
    		// console.log("aaa",JSON.stringify(res.result))
    	}
    }).error(function(status, data) {

})

userService.slideshowAds().success(function(res) {
    	if(res.responseCode == 409){
    		$state.go('login')
    	}else {
    		$scope.slideshowAds = res.result;
    		$scope.slideshowAdscount = res.count;
    		// console.log("bbb",JSON.stringify(res.result))
    	}
    }).error(function(status, data) {

}) 

userService.adUpgradedByDollor().success(function(res) {
        if(res.responseCode == 409){
            $state.go('login')
        }else {
            $scope.adUpgradedByDollor = res.result;
            $scope.adUpgradedByDollorcount = res.count;
            console.log("bbb",JSON.stringify(res))
        }
    }).error(function(status, data) {

})  

userService.adUpgradedByBrolix().success(function(res) {
        if(res.responseCode == 409){
            $state.go('login')
        }else {
            $scope.adUpgradedByBrolix = res.result;
            $scope.adUpgradedByBrolixcount = res.count;
            console.log("bbb",JSON.stringify(res))
        }
    }).error(function(status, data) {

}) 

userService.showReportedAd().success(function(res) {
        if(res.responseCode == 409){
            $state.go('login')
        }else {
            $scope.showReportedAd = res.result;
            $scope.showReportedAdcount = res.count;
            console.log("bbb",JSON.stringify(res))
        }
    }).error(function(status, data) {

}) 



})