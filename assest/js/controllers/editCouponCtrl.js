app.controller('editCouponCtrl', function($scope, uploadimgServeice, $window, toastr, $state, userService) {
    $(window).scrollTop(0, 0);
    $scope.$emit('headerStatus', 'Admin Tools');
    $scope.$emit('SideMenu', 'Admin Tools');
    $scope.coupon_id = localStorage.couponId;
    //console.log(JSON.stringify( $scope.coupon_id))
    userService.viewCoupon($scope.coupon_id).then(function(success) {
        //console.log("Coupon>>>>>>>>",success)
        $scope.couponData = success.data.result;
        $scope.user.pageName = $scope.couponData.pageName;
        $scope.user.photo = $scope.couponData.coverImage;
        var updateDate = new Date($scope.couponData.couponExpiryDate);
        $scope.user.expDate = moment(updateDate).format('MM/DD/YYYY');
        //console.log($scope.user.expDate)
        $scope.user.description = $scope.couponData.giftDescription;
    }, function(err) {
        console.log(err);
        toastr.error('Connection error.');
    })
    //   $scope.myForm={};
    $scope.pageDetail = [];
    userService.getPage().then(function(success) {
        $scope.pageDetail = success.data.result;
        //console.log("Page>>>>>>>>>>"+JSON.stringify($scope.pageDetail))
    }, function(err) {
        console.log(err);
        toastr.error('Connection error.');
    })

    $scope.changeImage = function(input) {
        var file = input.files[0];
        var ext = file.name.split('.').pop();
        if (ext == "jpg" || ext == "jpeg" || ext == "bmp" || ext == "gif" || ext == "png") {
            $scope.imageName = file.name;
            uploadimgServeice.user(file).then(function(ObjS) {
                $scope.user.photo = ObjS.data.result.url;
                $scope.user.photo = ObjS.data.result.url;
                console.log("pjototot", $scope.user.photo);
            })
        } else {
            toastr.error("Only image supported.")
        }
    }
    $scope.upadteCoupon = function(info) {
        var id = localStorage.couponId;
        $scope.user = {};
        var data = {
            "pageName": info.pageName,
            "coverImage": $scope.user.photo,
            "couponExpiryDate": info.expDate,
            "giftDescription": info.description
        }
        userService.editCoupon(id, data).success(function(res) {
            console.log("res", JSON.stringify(res));
            if (res.responseCode == 200) {
                $state.go('header.adminCoupons');
                toastr.success(res.responseMessage);
            } else {
                toastr.error(res.responseMessage);
            }
        })
    }

});