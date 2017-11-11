app.controller('viewCouponCtrl', function($scope,userService,uploadimgServeice, $window,toastr) {
    $(window).scrollTop(0, 0);
    $scope.$emit('headerStatus', 'Admin Tools');
    $scope.$emit('SideMenu', 'Admin Tools');
    $scope.coupon_id=localStorage.viewCouponId;
    userService.viewCoupon($scope.coupon_id).then(function(success) { 
        console.log("success",success)
                 $scope.couponData=success.data.result;
                 $scope.user.photo=success.data.result.coverImage;
                 $scope.couponData.uploadGiftImage = $scope.couponData.uploadGiftImage;
                 // $scope.expDate = new Date($scope.couponData.couponExpiryDate);
             },function(err){
                 toastr.error('Connection error.');
    }) 
  //   $scope.myForm={};
    $scope.pageDetail=[];
     userService.getPage().then(function(success) { 
                    $scope.pageDetail=success.data.result;
                },function(err){
                    console.log(err);
                     toastr.error('Connection error.');
            }) 

});