app.controller('viewCouponCtrl', function($scope,userService,uploadimgServeice, $window,toastr) {
    $(window).scrollTop(0, 0);
    $scope.$emit('headerStatus', 'Admin Tools');
    $scope.$emit('SideMenu', 'Admin Tools');
    $scope.coupon_id=localStorage.viewCouponId;
    console.log(JSON.stringify( $scope.coupon_id))
    userService.viewCoupon($scope.coupon_id).then(function(success) { 
                 console.log("Coupon>>>>>>>>"+JSON.stringify(success))
                 $scope.couponData=success.data.result;
                 $scope.user.photo=$scope.couponData.coverImage;
                 $scope.expDate = new Date($scope.couponData.couponExpiryDate);
                 console.log($scope.expDate)
             },function(err){
                 console.log(err);
                 toastr.error('Connection error.');
    }) 
  //   $scope.myForm={};
    $scope.pageDetail=[];
   	 userService.getPage().then(function(success) { 
   	 				$scope.pageDetail=success.data.result;
					console.log("Page>>>>>>>>>>"+JSON.stringify($scope.pageDetail))
        		},function(err){
			        console.log(err);
			         toastr.error('Connection error.');
		    }) 

});