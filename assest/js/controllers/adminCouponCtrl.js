app.controller('adminCouponCtrl', function($scope, spinnerService, $timeout, uploadimgServeice, userService, $window, userService, toastr, $state) {
    $(window).scrollTop(0, 0);
    $scope.$emit('headerStatus', 'Admin Tools');
    $scope.$emit('SideMenu', 'Admin Tools');
    $scope.couponDeatil = true;
    $scope.addNewCoupon = false;
    $scope.user = {};
    $scope.mydata = {};
    $scope.minDate = new Date().toDateString();
    $scope.user.photo = 'http://res.cloudinary.com/dfrspfd4g/image/upload/v1503655905/uk0wjh6hi4ihc2wsv4xy.png';
    $scope.user.giftImage = 'http://res.cloudinary.com/dfrspfd4g/image/upload/v1503656038/m1w8dqdpqnhkduxtaukw.png';

    var a = localStorage.getItem('em');;
    console.log("Em =>"+a)
    var req = {
      email : a
    }
    userService.adminProfile(req).success(function(res) {
        if (res.responseCode == 200) {
            console.log("sss",JSON.stringify(res))
            localStorage.setItem('userId', res.result._id);
            
        } else {
            //toastr.error(res.responseMessage);
        }
    })


    
   //  $scope.flag = true;
   // $scope.valid = function(data,key) {
   //     var x,y;
       
   //     if(key == 'availableCoupon'){
   //         x=data;
   //         if (isNaN(x) || x < 1 ) {
   //          $scope.flag = true;
            
   //      toastr.error("Input not valid");
   //      } else {
   //          $scope.flag = false;
   //      }
   //     }else if (key == 'couponPrice'){
   //         y=data;
   //         if (isNaN(y) || y < 1 ) {
   //          $scope.flag = true;
            
   //      toastr.error("Input not valid");
   //      } else {
   //          $scope.flag = false;
   //      }
   //     }
        
   //  }
    $scope.addCouponFun = function() {
        $scope.couponDeatil = false;
        $scope.addNewCoupon = true;
    }

    userService.allCoupons($scope.currentAllCoupons).success(function(res) {
        if (res.responseCode == 200) {
            console.log("sss",JSON.stringify(res))
            $scope.Detail = res.result;
        } else {
            //toastr.error(res.responseMessage);
        }
    })

    userService.getPage().success(function(res) {
        if (res.responseCode == 200) {
            console.log("pages =>"+JSON.stringify(res.result));
            $scope.pageDetail = res.result;
        } else {
            //toastr.error(res.responseMessage);
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
                    $scope.user.photo = ObjS.data.result.url;
                        console.log("$scope.user.photo",$scope.user.photo)
                    // $timeout(function() {
                    //     spinnerService.hide('html5spinner');
                        
                    // }, 250);
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
                        console.log("$scope.user.photo",$scope.user.giftImage)
                    // $timeout(function() {
                    //     spinnerService.hide('html5spinner');
                        
                    // }, 250);
                })
            } else {
                toastr.error("Only image supported.")
            }

        } else {
            toastr.error("Something wents to wroung");
        }

    }

    $scope.expDate = function(date) {
        console.log(date)
        $scope.couponExpiryInString = date;
        // var currentDate = new Date()
        // var year = currentDate.getFullYear();
        // var month = 1 + currentDate.getMonth();
        // var noOfDaysOne = daysInMonth(month, year);
        // var noOfDaysTwo = daysInMonth(month + 1, year);
        // var noOfDaysThree = daysInMonth(month + 2, year);
        // var one_day = 86400000;
        // var currentDateNumber = new Date().getTime();
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
                toastr.error("Something wents to wrong")

        }
    }




    $scope.addCoupon = function(info) {
        var couponData = JSON.parse(info.pageName);
        // console.log("info",JSON.stringify(couponData))
        $scope.expDate = new Date(info.expDate).getTime()
        var userId = localStorage.getItem('userId');

        


        var data = {
            "userId": userId,
            "pageId": couponData._id,
            "pageName": couponData.pageName,
            "coverImage": $scope.user.photo,
            "couponExpiryDate": $scope.couponExpiryDate,
            "giftDescription": info.description,
            "uploadGiftImage":$scope.user.giftImage,
            "couponExpiryInString":$scope.couponExpiryInString

        }
        console.log("Add coupon data =>",data)
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
                        toastr.success('Deleted successfully')
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
        $state.go('header.manageAdminTools')
        // $scope.user = {};
    }
    $scope.postCoupon = function(post_id) {
        //console.log(JSON.stringify(post_id))
        $("#post").modal('show');
        $scope.submit = function() {
            var data = {
                "couponSellPrice": $scope.mydata.couponPrice,
                "couponBuyersLength": $scope.mydata.availableCoupon
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