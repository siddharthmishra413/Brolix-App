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
			//console.log(JSON.stringify($scope.totalAds))
		}
	}).error(function(status, data) {

})


userService.totalActiveAds().success(function(res) {
    	if(res.responseCode == 409){
    		$state.go('login')
    	}else {
    		$scope.totalActiveAds = res.result;
    		$scope.totalActiveAdscount = res.count;
    		//console.log(JSON.stringify($scope.totalActiveAdscount))
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
    		//console.log(JSON.stringify($scope.videoAds))
    	}
    }).error(function(status, data) {

})

userService.slideshowAds().success(function(res) {
    	if(res.responseCode == 409){
    		$state.go('login')
    	}else {
    		$scope.slideshowAds = res.result;
    		$scope.slideshowAdscount = res.count;
    		//console.log(JSON.stringify($scope.slideshowAds))
    	}
    }).error(function(status, data) {

})   




})