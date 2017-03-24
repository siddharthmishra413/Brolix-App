app.controller('manageGiftsCtrl', function ($scope, $window, userService, $state, toastr) {
$(window).scrollTop(0,0);
$scope.$emit('headerStatus', 'Manage Gifts');
$scope.$emit('SideMenu', 'Manage Gifts');
$scope.array = [];

userService.totalBrolixGift().success(function(res){
	if(res.responseCode == 200){
		$scope.totalBrolixGiftsCount = res.total_brolix_gift;
		$scope.totalBrolixGifts = res.data;
		console.log("res",res);
		for(i=0;i<res.data.length;i++){
			$scope.array.push(res.data[i]._id);
		}
			console.log("arrrrayyyyyy",$scope.array);
			console.log("$scope.totalBrolixGifts",JSON.stringify($scope.totalBrolixGifts));
	}else{
		toastr.error(res.responseMessage);
	}
})

$scope.contactWinners = function(){
	consolelog("iddddddddddd",id);
}

$scope.top_50_balanc = function(type){
	if(type=='balances'){
		$("#top_50_balance").modal('show');
	}else if(type=='coupons'){
		$("#top_50_couponsProviders").modal('show');
	}else{
		$("#top_50_cashProviders").modal('show');
	} 	
}

})