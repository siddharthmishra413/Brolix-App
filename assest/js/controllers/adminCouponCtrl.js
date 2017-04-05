app.controller('adminCouponCtrl', function ($scope,uploadimgServeice,userService, $window,userService,toastr,$state) {
$(window).scrollTop(0,0);
$scope.$emit('headerStatus', 'Admin Tools');
$scope.$emit('SideMenu', 'Admin Tools');
$scope.couponDeatil=true;
$scope.addNewCoupon=false;
$scope.addCouponFun=function(){
	$scope.couponDeatil=false;
	$scope.addNewCoupon=true;
}
    $scope.Detail=[];
   	 userService.allCoupons().then(function(success) { 
   	 				$scope.Detail=success.data.result;
					console.log("List>>>>>>>>>>"+JSON.stringify($scope.Detail))
        		},function(err){
			        console.log(err);
			         toastr.error('Connection error.');
		    })

	$scope.user={};
    $scope.pageDetail=[];
   	 userService.getPage().then(function(success) { 
   	 				$scope.pageDetail=success.data.result;
					console.log("Page>>>>>>>>>>"+JSON.stringify($scope.pageDetail))
        		},function(err){
			        console.log(err);
			         toastr.error('Connection error.');
		    }) 
		
    $scope.changeImage = function(input) {
        var file = input.files[0];
        var ext = file.name.split('.').pop();
        if(ext=="jpg" || ext=="jpeg" || ext=="bmp" || ext=="gif" || ext=="png"){
            $scope.imageName = file.name;
            uploadimgServeice.user(file).then(function(ObjS) {
            $scope.user.photo = ObjS.data.result.url;
            $scope.user.photo = ObjS.data.result.url;
            console.log("pjototot",$scope.user.photo);
        })
        }else{
            toastr.error("Only image supported.")
        }        
    }

    $scope.addCoupon=function(info){
    	console.log(info)
		var data = {
					"pageId":$scope.pageDetail._id,
					"pageName":info.pageName,
					"coverImage":$scope.user.photo,
					"couponExpiryDate":info.expDate,
					"giftDescription":info.description
					}
		userService.addCoupon(data).then(function(success) { 
					console.log(JSON.stringify(success))
					$state.reload();
        		},function(err){
			        console.log(err);
			         toastr.error('Connection error.');
		    }) 
	}
	$scope.removeCoupon=function(id){
        BootstrapDialog.show({  title: '', message: 'Do you want to delete this Coupon ?',
            buttons: [{ label: 'NO',action: function(dialogItself) {
                    dialogItself.close();
                }
            }, {
                label: 'Yes',
                action: function(dialogItself) {
	                    var data = {
							"CouponId":id
						}
					userService.removeCoupon(data).then(function(success) { 
								console.log(JSON.stringify(success))
								toastr.success('Deleted Successfully')
								$state.reload();
			        		},function(err){
						        console.log(err);
						        toastr.error('Connection error.');
					    })  
                    dialogItself.close();
                }
            }]
        });
  }

  	 $scope.viewCoupon=function(view_id)
  	 {
  	 	localStorage.viewCouponId=view_id;
  	 	console.log(JSON.stringify(localStorage.couponId));
  	 }

  	$scope.editCoupon=function(id){
  		console.log("adminedit-->>"+JSON.stringify(id))
  		localStorage.couponId=id;
  		console.log(JSON.stringify(localStorage.couponId));
  	}
    $scope.cancel=function(){
      $scope.user={};
    }
	 $scope.postCoupon=function(post_id)
  	 {
  	 	console.log(JSON.stringify(post_id))
  	 	$("#post").modal('show');
      $scope.submit=function(){
          var data={
                  "couponSellPrice":$scope.couponPrice,
                  "couponBuyersLength":$scope.availableCoupon
          }
          userService.postCoupon(post_id,data).then(function(success) { 
              console.log(JSON.stringify(success))
              toastr.success('Coupon Created Successfully');
                  $state.reload();
                },function(err){
                  console.log(err);
                   toastr.error('Connection error.');
            }) 
        }
  	 }
	
})