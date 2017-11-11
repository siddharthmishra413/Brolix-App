app.controller('editCouponCtrl', function($scope,  $timeout, uploadimgServeice, $window, toastr, $state, userService, spinnerService) {
    $(window).scrollTop(0, 0);
    $scope.$emit('headerStatus', 'Admin Tools');
    $scope.$emit('SideMenu', 'Admin Tools');
    $scope.pageInfo = {};
    $scope.coupon_id = localStorage.couponId;
    //console.log(JSON.stringify( $scope.coupon_id))


    $scope.expDate = function(date) {
        console.log(date)
        $scope.couponExpiryInString = date;
        console.log("date",date)

        switch (date) {
            case 'NEVER':
                 $scope.couponExpiryDate = 'NEVER';
                break;

            case '1 Week':
                $scope.couponExpiryDate = 86400000 * 7;
                break;

            case '2 Weeks':

                $scope.couponExpiryDate = 86400000 * 14;
                break;

            case '3 Weeks':

                $scope.couponExpiryDate = 86400000 * 21;
                break;

            case '1 Month':

                $scope.couponExpiryDate = 86400000 * 30;
                break;

            case '2 Months':

                $scope.couponExpiryDate = 86400000 * 60;
                break;

            case '3 Months':

                $scope.couponExpiryDate = 86400000 * 90;
                break;

            default:
                toastr.error("Something Wents to wrong")

        }
    }

    $scope.cancel = function() {
        $state.go('header.addSystemUser')
        $scope.user = {};
    }
    userService.viewCoupon($scope.coupon_id).then(function(success) {
        console.log("Coupon>>>>>>>>",success)
        $scope.couponData = success.data.result;
        console.log("pageName",$scope.couponData.pageName)
        $scope.pageInfo = $scope.couponData.pageName;
        // $scope.user.pageName = $scope.couponData.pageName;
        // $scope.user.photo = $scope.couponData.coverImage;
        // var updateDate = new Date($scope.couponData.couponExpiryDate);
        // $scope.user.expDate = moment(updateDate).format('MM/DD/YYYY');
        // //console.log($scope.user.expDate)
        // $scope.user.description = $scope.couponData.giftDescription;
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

    $scope.changeImage = function(input, key) {
        console.log("key", key)
        if(key == 'pageImage') {
            var file = input.files[0];
            var ext = file.name.split('.').pop();
            if (ext == "jpg" || ext == "jpeg" || ext == "bmp" || ext == "gif" || ext == "png") {
                $scope.imageName = file.name;
                uploadimgServeice.user(file).then(function(ObjS) {
                    // $timeout(function() {
                    //     spinnerService.hide('html5spinner');
                        
                    // }, 250);
                    $scope.user.photo = ObjS.data.result.url;
                    console.log("$scope.user.photo",$scope.user.photo)
                })
            } else {
                toastr.error("Only image supported.")
            }
        } else if (key == 'giftDesImage') {
            var file = input.files[0];
            var ext = file.name.split('.').pop();
            if (ext == "jpg" || ext == "jpeg" || ext == "bmp" || ext == "gif" || ext == "png") {
                $scope.imageName = file.name;
                uploadimgServeice.user(file).then(function(ObjS) {
                    $scope.user.giftImage = ObjS.data.result.url;
                    console.log("$scope.user.giftImage",$scope.user.giftImage)
                    // $timeout(function() {
                    //     spinnerService.hide('html5spinner');
                    //     $scope.user.giftImage = ObjS.data.result.url;
                    //     console.log("$scope.user.giftImage",$scope.user.giftImage)
                    // }, 250);
                })
            } else {
                toastr.error("Only image supported.")
            }

        } else {
            toastr.error("something wents to wroung");
        }

    }

    // $scope.changeImage = function(input) {
    //     var file = input.files[0];
    //     var ext = file.name.split('.').pop();
    //     if (ext == "jpg" || ext == "jpeg" || ext == "bmp" || ext == "gif" || ext == "png") {
    //         $scope.imageName = file.name;
    //         uploadimgServeice.user(file).then(function(ObjS) {
    //             $scope.user.photo = ObjS.data.result.url;
    //             $scope.user.photo = ObjS.data.result.url;
    //             console.log("pjototot", $scope.user.photo);
    //         })
    //     } else {
    //         toastr.error("Only image supported.")
    //     }
    // }
    $scope.upadteCoupon = function(info) {
        console.log("$scope.pageInfo",$scope.pageInfo)
        var id = localStorage.couponId;
        var couponData = JSON.parse($scope.pageInfo);
        console.log("data =>",JSON.stringify(couponData))
        
        var data = {

            "pageId": couponData._id,
            "pageName": couponData.pageName,
            "coverImage": $scope.user.photo,
            "couponExpiryDate": $scope.couponExpiryDate,
            "giftDescription": $scope.couponData.giftDescription,
            "uploadGiftImage":$scope.user.giftImage,
            "couponExpiryInString":$scope.couponExpiryInString
        }
        console.log("data",JSON.stringify(data))
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