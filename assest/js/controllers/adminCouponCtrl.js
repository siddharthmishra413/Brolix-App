app.controller('adminCouponCtrl', function($scope, spinnerService, $timeout, uploadimgServeice, userService, $window, userService, toastr, $state) {
    $(window).scrollTop(0, 0);
    $scope.$emit('headerStatus', 'Admin Tools');
    $scope.$emit('SideMenu', 'Admin Tools');
    $scope.couponDeatil = true;
    $scope.addNewCoupon = false;
    $scope.user = {};
    $scope.addCouponFun = function() {
        $scope.couponDeatil = false;
        $scope.addNewCoupon = true;
    }

    userService.allCoupons($scope.currentAllCoupons).success(function(res) {
        if (res.responseCode == 200) {
            $scope.Detail = res.result;
        } else {
            toastr.error(res.responseMessage);
        }
    })

    userService.getPage().success(function(res) {
        if (res.responseCode == 200) {
            $scope.pageDetail = res.result;
        } else {
            toastr.error(res.responseMessage);
        }
    })

    $scope.changeImage = function(input, key) {
        console.log("key", key)
        if(key == 'pageImage') {
            var file = input.files[0];
            var ext = file.name.split('.').pop();
            if (ext == "jpg" || ext == "jpeg" || ext == "bmp" || ext == "gif" || ext == "png") {
                $scope.imageName = file.name;
                uploadimgServeice.user(file).then(function(ObjS) {
                    $timeout(function() {
                        spinnerService.hide('html5spinner');
                        $scope.user.photo = ObjS.data.result.url;
                    }, 250);
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
                    $timeout(function() {
                        spinnerService.hide('html5spinner');
                        $scope.user.giftImage = ObjS.data.result.url;
                    }, 250);
                })
            } else {
                toastr.error("Only image supported.")
            }

        } else {
            toastr.error("something wents to wroung");
        }

    }




    $scope.addCoupon = function(info) {
        var couponData = JSON.parse(info.pageName);
        //console.log("info",JSON.stringify(couponData))
        //console.log("info",$scope.user.pageName)

        var data = {
            "pageId": couponData._id,
            "pageName": couponData.pageName,
            "coverImage": $scope.user.photo,
            "couponExpiryDate": info.expDate,
            "giftDescription": info.description,
            "giftDescriptionImage":$scope.user.giftImage

        }
        console.log("data",data)
        userService.addCoupon(data).then(function(success) {
            if (success.data.responseCode == 200) {
                toastr.success(success.data.responseMessage);
                $state.reload();
            }
        }, function(err) {
            toastr.error('Connection error.');
        })
    }
    $scope.removeCoupon = function(id) {
        BootstrapDialog.show({
            title: '',
            message: 'Do you want to delete this Coupon ?',
            buttons: [{
                label: 'NO',
                action: function(dialogItself) {
                    dialogItself.close();
                }
            }, {
                label: 'Yes',
                action: function(dialogItself) {
                    var data = {
                        "CouponId": id
                    }
                    userService.removeCoupon(data).then(function(success) {
                        //console.log(JSON.stringify(success))
                        toastr.success('Deleted Successfully')
                        $state.reload();
                    }, function(err) {
                        //console.log(err);
                        toastr.error('Connection error.');
                    })
                    dialogItself.close();
                }
            }]
        });
    }

    $scope.viewCoupon = function(view_id) {
        localStorage.viewCouponId = view_id;
        //console.log(JSON.stringify(localStorage.couponId));
    }

    $scope.editCoupon = function(id) {
        //console.log("adminedit-->>"+JSON.stringify(id))
        localStorage.couponId = id;
        //console.log(JSON.stringify(localStorage.couponId));
    }
    $scope.cancel = function() {
        $state.go('header.addSystemUser')
        $scope.user = {};
    }
    $scope.postCoupon = function(post_id) {
        //console.log(JSON.stringify(post_id))
        $("#post").modal('show');
        $scope.submit = function() {
            var data = {
                "couponSellPrice": $scope.couponPrice,
                "couponBuyersLength": $scope.availableCoupon
            }
            userService.postCoupon(post_id, data).then(function(success) {
                //console.log("success",JSON.stringify(success))
                if (success.data.responseCode == 200) {
                    toastr.success(success.data.responseMessage);
                    $("#post").modal('hide');
                    $state.reload();
                }
            }, function(err) {
                //console.log(err);
                toastr.error('Connection error.');
            })
        }
    }

})