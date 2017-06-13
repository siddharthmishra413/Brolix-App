app.controller('createAdsCtrl', function($scope, $state, $window, userService, uploadimgServeice, $http, toastr, $timeout, spinnerService) {
    $(window).scrollTop(0, 0);
    $scope.$emit('headerStatus', 'Manage Ads');
    $scope.$emit('SideMenu', 'Manage Ads');
    $scope.createAds = {};
    $scope.promoteAppGame = {};
    $scope.addCode = [];
    $scope.promoteAppValidation = [];
    $scope.count = true;
    $scope.appPhotoArray = [];
    $scope.conditionOne = false;
    $scope.conditionTwo = false;
    $scope.conditionThree = false;
    $scope.promoteApp = false;
    $scope.dawnloadPagePhoto = [];
    $scope.slideshowPhoto = [];
console.log("length:    ",$scope.dawnloadPagePhoto.length);
    $scope.downloadPhotoss = function(image){
        console.log("image------------>",image)
        $scope.dawnloadPagePhoto.push(image)
        console.log("$scope.dawnloadPagePhoto",$scope.dawnloadPagePhoto)
        console.log("length:    ",$scope.dawnloadPagePhoto.length);
        $scope.promoteApp = true;
    }

    $scope.slideshowPhotoFun = function(image){
        console.log("image------------>",image)
        $scope.slideshowPhoto.push(image)
        console.log("$scope.slideshowPhoto",$scope.slideshowPhoto)
    }

    //var promoteAppVali = ($scope.conditionOne == true && $scope.conditionTwo == true && $scope.conditionThree == true);

    userService.freeViewersPerCouponAds().success(function(res) {
        console.log("res",JSON.stringify(res))
        if (res.responseCode == 200) {
            $scope.createAds.viewers = res.result[0].value;
            console.log("$scope.createAds.viewers",$scope.createAds.viewers)
        } else {
            toastr.error(res.responseMessage);
        }

    })

    userService.freeViewersPerCashAds().success(function(res) {
        console.log("res",JSON.stringify(res))
        if (res.responseCode == 200) {
            $scope.createAds.viewersOne = res.result[0].value;
            console.log($scope.createAds.viewersOne)
        } else {
            toastr.error(res.responseMessage);
        }

    })

    userService.adminProfile().success(function(res) {
        if (res.responseCode == 200) {
            $scope.userId = res.result._id;
            localStorage.setItem('adminId', $scope.userId);
        } else {
            toastr.error(res.responseMessage);
            $state.go('login')
        }

    })

    $scope.promoteAppValidation = function(){
        if($scope.createAds.appName == null || $scope.createAds.appName == '' || $scope.createAds.appName == undefined){
            $scope.conditionOne = false;
        }else if(createAds.appIcon == './dist/image/user-image.jpeg'){
            $scope.conditionTwo = false;
        }else if($scope.appPhotoArray.length == 0){
            $scope.conditionThree = false;
        }
    }

    $scope.promoteAppValidation();




    $scope.appPhotoDownload = function(key){
        if(key == null || key == '' || key == undefined){
           toastr.error("Something wrong")
        }else{
            $scope.appPhotoArray.push(key);
            console.log($scope.appPhotoArray)
        }
    }


    
    $scope.validation = function() {
        if ($scope.createAds.googlePlayLink || $scope.createAds.appStoreLink || $scope.createAds.windowStoreLink) {
            $scope.count = false;
        } else {
            $scope.count = true;
        }
    }
    $scope.ImageValidation = function() {
        //console.log("1")
    }

    $scope.addcode = function(code) {
        if ($scope.addCode.length < $scope.createAds.numberOfWinners) {
            $scope.addCode.push(code);
            $scope.createAds.hiddenCode = "";
        } else {
            toastr.error("You are not allowed to add more coupons")
        }
    }

    $scope.openTerms = function(type) {

        switch (type) {
            case 'hiddenGiftTerms':
                $("#hiddenGiftTerms").modal('show');
                break;
            case 'cellThisCouponTerms':
                $("#cellThisCouponTerms").modal('show');
                break;
            case 'close':
                $("#hiddenGiftTerms").modal('hide');
                break;

            case 'cellThisCouponTerms':
                $("#cellThisCouponTerms").modal('show');
                break;
            case 'couponTerms':
                $("#couponTerms").modal('show');
                break;
            case 'cashTerms':
                $("#cashTerms").modal('show');
                break;
            default:
                toastr.error("something wents to wrong")

        }
    }

    userService.adminProfile().success(function(res) {
        if (res.responseCode == 200) {
            $scope.userId = res.result._id;
            localStorage.setItem('adminId', $scope.userId);
        } else {
            toastr.error(res.responseMessage);
            $state.go('login')
        }

    })

    var adminIdss = localStorage.getItem('adminId');

    userService.getPage().then(function(success) {
        $scope.pageDetail = success.data.result;
    }, function(err) {
        toastr.error('Connection error.');
    })

    $scope.Step1 = true;
    $scope.Step2 = false;
    $scope.Step3 = false;
    $scope.vedioStep4 = false;
    $scope.Step5 = false;
    $scope.Step6 = false;
    $scope.slideStep4 = false;
    $scope.promoteApp = false;
    $scope.cashStep5 = false;

    $scope.click = function(type) {
        if (type == 'Step2') {
            $scope.Step1 = false;
            $scope.Step2 = true;
            $scope.Step3 = false;
            $scope.vedioStep4 = false;
            $scope.Step5 = false;
            $scope.Step6 = false;
            $scope.slideStep4 = false;
            $scope.promoteApp = false;
            $scope.cashStep5 = false;
        } else if (type == 'Back2') {
            $scope.Step1 = true;
            $scope.Step2 = false;
            $scope.Step3 = false;
            $scope.vedioStep4 = false;
            $scope.Step5 = false;
            $scope.Step6 = false;
            $scope.slideStep4 = false;
            $scope.promoteApp = false;
            $scope.cashStep5 = false;
        } else if (type == 'Step3') {
            $scope.Step1 = false;
            $scope.Step2 = false;
            $scope.Step3 = true;
            $scope.vedioStep4 = false;
            $scope.Step5 = false;
            $scope.Step6 = false;
            $scope.slideStep4 = false;
            $scope.promoteApp = false;
            $scope.cashStep5 = false;
        } else if (type == 'Back3') {
            $scope.Step1 = false;
            $scope.Step2 = true;
            $scope.Step3 = false;
            $scope.vedioStep4 = false;
            $scope.Step5 = false;
            $scope.Step6 = false;
            $scope.slideStep4 = false;
            $scope.promoteApp = false;
            $scope.cashStep5 = false;
        } else if (type == 'video') {
            $scope.Step1 = false;
            $scope.Step2 = false;
            $scope.Step3 = false;
            $scope.vedioStep4 = true;
            $scope.Step5 = false;
            $scope.Step6 = false;
            $scope.slideStep4 = false;
            $scope.promoteApp = false;
            $scope.cashStep5 = false;
        } else if (type == 'Back4') {
            $scope.Step1 = false;
            $scope.Step2 = false;
            $scope.Step3 = true;
            $scope.vedioStep4 = false;
            $scope.Step5 = false;
            $scope.Step6 = false;
            $scope.slideStep4 = false;
            $scope.promoteApp = false;
            $scope.cashStep5 = false;
        } else if (type == 'Step5') {
            if ($scope.createAds.giftType == 'coupon') {
                $scope.Step1 = false;
                $scope.Step2 = false;
                $scope.Step3 = false;
                $scope.vedioStep4 = false;
                $scope.Step5 = true;
                $scope.Step6 = false;
                $scope.slideStep4 = false;
                $scope.promoteApp = false;
                $scope.cashStep5 = false;
                $scope.cashStep5 = false;
            } else if ($scope.createAds.giftType == 'cash') {
                $scope.Step1 = false;
                $scope.Step2 = false;
                $scope.Step3 = false;
                $scope.vedioStep4 = false;
                $scope.Step5 = false;
                $scope.Step6 = false;
                $scope.slideStep4 = false;
                $scope.promoteApp = false;
                $scope.cashStep5 = true;
            }

        } else if (type == 'Back5') {
            if ($scope.createAds.adContentType == 'video') {
                $scope.Step1 = false;
                $scope.Step2 = false;
                $scope.Step3 = false;
                $scope.vedioStep4 = true;
                $scope.Step5 = false;
                $scope.Step6 = false;
                $scope.slideStep4 = false;
                $scope.promoteApp = false;
                $scope.cashStep5 = false;
            } else if ($scope.createAds.adContentType == 'slideshow') {
                $scope.Step1 = false;
                $scope.Step2 = false;
                $scope.Step3 = false;
                $scope.vedioStep4 = false;
                $scope.Step5 = false;
                $scope.Step6 = false;
                $scope.slideStep4 = true;
                $scope.promoteApp = false;
                $scope.cashStep5 = false;
            } else {
                toastr.error('Something wents to wrong')
            }
        } else if (type == 'slide') {
            $scope.Step1 = false;
            $scope.Step2 = false;
            $scope.Step3 = false;
            $scope.vedioStep4 = false;
            $scope.Step5 = false;
            $scope.Step6 = false;
            $scope.slideStep4 = true;
            $scope.promoteApp = false;
            $scope.cashStep5 = false;
        } else if (type == 'Step6') {
            $scope.Step1 = false;
            $scope.Step2 = false;
            $scope.Step3 = false;
            $scope.vedioStep4 = false;
            $scope.Step5 = false;
            $scope.Step6 = true;
            $scope.slideStep4 = false;
            $scope.promoteApp = false;
            $scope.cashStep5 = false;
        } else if (type == 'Back6') {
            if ($scope.createAds.giftType == 'coupon') {
                $scope.Step1 = false;
                $scope.Step2 = false;
                $scope.Step3 = false;
                $scope.vedioStep4 = false;
                $scope.Step5 = true;
                $scope.Step6 = false;
                $scope.slideStep4 = false;
                $scope.promoteApp = false;
                $scope.cashStep5 = false;
            } else if ($scope.createAds.giftType == 'cash') {
                $scope.Step1 = false;
                $scope.Step2 = false;
                $scope.Step3 = false;
                $scope.vedioStep4 = false;
                $scope.Step5 = false;
                $scope.Step6 = false;
                $scope.slideStep4 = false;
                $scope.promoteApp = false;
                $scope.cashStep5 = true;
            }

        } else if (type == 'promoteApp') {
            $scope.Step1 = false;
            $scope.Step2 = false;
            $scope.Step3 = false;
            $scope.vedioStep4 = false;
            $scope.Step5 = false;
            $scope.Step6 = false;
            $scope.slideStep4 = false;
            $scope.promoteApp = true;
            $scope.cashStep5 = false;
        } else if (type == 'promoteAppBack') {
            if ($scope.createAds.adContentType == 'video') {
                $scope.Step1 = false;
                $scope.Step2 = false;
                $scope.Step3 = false;
                $scope.vedioStep4 = true;
                $scope.Step5 = false;
                $scope.Step6 = false;
                $scope.slideStep4 = false;
                $scope.promoteApp = false;
                $scope.cashStep5 = false;
            } else if ($scope.createAds.adContentType == 'slideshow') {
                $scope.Step1 = false;
                $scope.Step2 = false;
                $scope.Step3 = false;
                $scope.vedioStep4 = false;
                $scope.Step5 = false;
                $scope.Step6 = false;
                $scope.slideStep4 = true;
                $scope.promoteApp = false;
                $scope.cashStep5 = false;
            } else {
                toastr.error("somthing wents to wrong")
            }


        } else {
            toastr.error("something wents to wrong")
        }

    }


    $scope.changeImage = function(input, type) {
        console.log("type",type)
        spinnerService.show('html5spinner');
        var file = input.files[0];
        var ext = file.name.split('.').pop();
        if (ext == "mp3" || ext == "jpg" || ext == "jpeg" || ext == "bmp" || ext == "gif" || ext == "png" || ext == "3gp" || ext == "mp4" || ext == "flv" || ext == "avi" || ext == "wmv") {
            $scope.imageName = file.name;
            console.log("$scope.imageName", $scope.imageName)
            $scope.createAds.type = file.type;
            if (file.type.split('/')[0] == 'image') {
                switch (type) {

                    case 'advertismentCover':
                        uploadimgServeice.user(file).then(function(ObjS) {
                            $timeout(function() {
                                spinnerService.hide('html5spinner');
                                $scope.createAds.advertismentCover = ObjS.data.result.url;
                                console.log("createAds.advertismentCover",$scope.createAds.advertismentCover)
                            }, 250);
                        })
                        break;

                    case 'appPhoto1':
                        uploadimgServeice.user(file).then(function(ObjS) {
                            $timeout(function() {
                                spinnerService.hide('html5spinner');
                                $scope.createAds.appPhoto1 = ObjS.data.result.url;
                                $scope.downloadPhotoss($scope.createAds.appPhoto1);

                            }, 250);
                        })
                        break;

                    case 'appPhoto2':
                        uploadimgServeice.user(file).then(function(ObjS) {
                            $timeout(function() {
                                spinnerService.hide('html5spinner');
                                $scope.createAds.appPhoto2 = ObjS.data.result.url;
                                $scope.downloadPhotoss($scope.createAds.appPhoto2);
                            }, 250);
                        })
                        break;

                    case 'appPhoto3':
                        uploadimgServeice.user(file).then(function(ObjS) {
                            $timeout(function() {
                                spinnerService.hide('html5spinner');
                                $scope.createAds.appPhoto3 = ObjS.data.result.url;
                                $scope.downloadPhotoss($scope.createAds.appPhoto3);
                            }, 250);
                        })
                        break;

                    case 'appPhoto4':
                        uploadimgServeice.user(file).then(function(ObjS) {
                            $timeout(function() {
                                spinnerService.hide('html5spinner');
                                $scope.createAds.appPhoto4 = ObjS.data.result.url;
                                $scope.downloadPhotoss($scope.createAds.appPhoto4);
                            }, 250);
                        })
                        break;

                    case 'appPhoto5':
                        uploadimgServeice.user(file).then(function(ObjS) {
                            $timeout(function() {
                                spinnerService.hide('html5spinner');
                                $scope.createAds.appPhoto5 = ObjS.data.result.url;
                                $scope.downloadPhotoss($scope.createAds.appPhoto5);
                            }, 250);
                        })
                        break;

                    case 'appPhoto6':
                        uploadimgServeice.user(file).then(function(ObjS) {
                            $timeout(function() {
                                spinnerService.hide('html5spinner');
                                $scope.createAds.appPhoto6 = ObjS.data.result.url;
                                $scope.downloadPhotoss($scope.createAds.appPhoto6);
                            }, 250);
                        })
                        break;

                    case 'appIcon':
                        uploadimgServeice.user(file).then(function(ObjS) {
                            $timeout(function() {
                                spinnerService.hide('html5spinner');
                                $scope.createAds.appIcon = ObjS.data.result.url;
                                console.log($scope.createAds.appIcon,$scope.createAds.appIcon)
                            }, 250);
                        })
                        break;

                    case 'slidePhoto1':
                    console.log("xvxcvxc")
                        uploadimgServeice.user(file).then(function(ObjS) {
                            $timeout(function() {
                                spinnerService.hide('html5spinner');
                                $scope.createAds.slidePhoto1 = ObjS.data.result.url;
                                $scope.slideshowPhotoFun($scope.createAds.slidePhoto1);
                            }, 250);
                        })
                        break;

                    case 'slidePhoto2':
                        uploadimgServeice.user(file).then(function(ObjS) {
                            $timeout(function() {
                                spinnerService.hide('html5spinner');
                                $scope.createAds.slidePhoto2 = ObjS.data.result.url;
                                $scope.slideshowPhotoFun($scope.createAds.slidePhoto2);
                            }, 250);
                        })
                        break;

                    case 'slidePhoto3':
                        uploadimgServeice.user(file).then(function(ObjS) {
                            $timeout(function() {
                                spinnerService.hide('html5spinner');
                                $scope.createAds.slidePhoto3 = ObjS.data.result.url;
                                $scope.slideshowPhotoFun($scope.createAds.slidePhoto3);
                            }, 250);
                        })
                        break;

                    case 'slidePhoto4':
                        uploadimgServeice.user(file).then(function(ObjS) {
                            $timeout(function() {
                                spinnerService.hide('html5spinner');
                                $scope.createAds.slidePhoto4 = ObjS.data.result.url;
                                $scope.slideshowPhotoFun($scope.createAds.slidePhoto4);
                            }, 250);
                        })
                        break;

                    case 'slidePhoto5':
                        uploadimgServeice.user(file).then(function(ObjS) {
                            $timeout(function() {
                                spinnerService.hide('html5spinner');
                                $scope.createAds.slidePhoto5 = ObjS.data.result.url;
                                $scope.slideshowPhotoFun($scope.createAds.slidePhoto5);
                            }, 250);
                        })
                        break;

                    case 'slidePhoto6':
                        uploadimgServeice.user(file).then(function(ObjS) {
                            $timeout(function() {
                                spinnerService.hide('html5spinner');
                                $scope.createAds.slidePhoto6 = ObjS.data.result.url;
                                $scope.slideshowPhotoFun($scope.createAds.slidePhoto6);
                            }, 250);
                        })
                        break;

                    case 'giftDesImage':
                        uploadimgServeice.user(file).then(function(ObjS) {
                            $timeout(function() {
                                spinnerService.hide('html5spinner');
                                $scope.createAds.gifyDescImage = ObjS.data.result.url;
                            }, 250);
                        })
                        break;

                    case 'adCover':
                        uploadimgServeice.user(file).then(function(ObjS) {
                            $timeout(function() {
                                spinnerService.hide('html5spinner');
                                $scope.createAds.adCover = ObjS.data.result.url;
                            }, 250);
                        })
                        break;



                    case 'appPhoto1':
                        uploadimgServeice.user(file).then(function(ObjS) {
                            $timeout(function() {
                                spinnerService.hide('html5spinner');
                                $scope.promoteAppGame.appPhoto1 = ObjS.data.result.url;
                            }, 250);
                        })
                        break;
                    case 'appPhoto2':
                        uploadimgServeice.user(file).then(function(ObjS) {
                            $timeout(function() {
                                spinnerService.hide('html5spinner');
                                $scope.promoteAppGame.appPhoto2 = ObjS.data.result.url;
                            }, 250);
                        })
                        break;

                    case 'appPhoto3':
                        uploadimgServeice.user(file).then(function(ObjS) {
                            $timeout(function() {
                                spinnerService.hide('html5spinner');
                                $scope.promoteAppGame.appPhoto3 = ObjS.data.result.url;
                            }, 250);
                        })
                        break;

                    case 'appPhoto4':
                        uploadimgServeice.user(file).then(function(ObjS) {
                            $timeout(function() {
                                spinnerService.hide('html5spinner');
                                $scope.promoteAppGame.appPhoto4 = ObjS.data.result.url;
                            }, 250);
                        })
                        break;

                    case 'giftImage':
                        uploadimgServeice.user(file).then(function(ObjS) {
                            $timeout(function() {
                                spinnerService.hide('html5spinner');
                                $scope.createAds.giftImage = ObjS.data.result.url;
                            }, 250);
                        })
                        break;

                    default:
                        toastr.error("Somthing wents to wroung")

                }
            } else {

                if (type == 'mp3') {

                    uploadimgServeice.user(file).then(function(ObjS) {
                        $timeout(function() {
                            spinnerService.hide('html5spinner');
                            $scope.createAds.audioUrl = ObjS.data.result.url;
                        }, 250);
                    })

                } else {
                    uploadimgServeice.user(file).then(function(ObjS) {
                        $timeout(function() {
                            spinnerService.hide('html5spinner');
                            $scope.createAds.vedioUrl = ObjS.data.result.url;
                        }, 250);
                    })
                }
            }
        } else {
            toastr.error("Only image supported.")
        }
    }

    userService.countryListData().success(function(res) {
        $scope.countriesList = res.result;
    })

    $scope.changeCountry = function() {
        var obj = {};
        obj = {
            country: $scope.createAds.country,
        }
        userService.cityListData(obj).success(function(res) {
            console.log("ddd", JSON.stringify(res))
            $scope.cityList = res.result;
        })


    }
    

    function daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

    $scope.expDate = function(date) {
        var currentDate = new Date()
        var year = currentDate.getFullYear();
        var month = 1 + currentDate.getMonth();
        var noOfDaysOne = daysInMonth(month, year);
        var noOfDaysTwo = daysInMonth(month + 1, year);
        var noOfDaysThree = daysInMonth(month + 2, year);
        var one_day = 86400000;
        var currentDateNumber = new Date().getTime();

        switch (date) {
            case '':
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


    $scope.submit = function() {


        pageDetails = JSON.parse($scope.createAds.pageName);
        if($scope.createAds.giftType == 'coupon'){
            if($scope.createAds.adContentType == 'video'){
                modifyData = {
                    userId: adminIdss,
                    pageId: pageDetails._id,
                    pageName: pageDetails.pageName,
                    category: pageDetails.category,
                    subCategory: pageDetails.subCategory,
                    adsType: $scope.createAds.giftType,
                    coverImage: $scope.createAds.advertismentCover,
                    adContentType: $scope.createAds.adContentType,
                    numberOfWinners: $scope.createAds.numberOfWinners,
                    allAreWinners: $scope.createAds.allAreWinners,
                    giftDescription: $scope.createAds.giftDescription,
                    viewerLength: $scope.createAds.viewers,
                    hiddenGifts: $scope.addCode,
                    couponLength: $scope.createAds.numberOfWinners,
                    uploadGiftImage:$scope.createAds.gifyDescImage,
                    gender: $scope.createAds.gender,
                    ageFrom: $scope.createAds.ageFrom,
                    ageTo: $scope.createAds.ageTo,
                    couponBuyersLength: $scope.createAds.viewers,
                    sellCoupon: $scope.createAds.cellThisCoupon,
                    whoWillSeeYourAdd: {
                    country: $scope.createAds.country,
                    city: $scope.createAds.city
                    },
                    couponExpiryDate: $scope.couponExpiryDate,
                    appName:$scope.createAds.appName,
                    googleLink: $scope.createAds.googlePlayLink,
                    appStoreLink: $scope.createAds.appStoreLink,
                    windowsStoreLink: $scope.createAds.windowStoreLink,
                    appIcon: $scope.createAds.appIcon,
                    linkDescription: $scope.createAds.linkDescription,
                    dawnloadPagePhoto: $scope.dawnloadPagePhoto,
                    promoteApp: $scope.promoteApp,
                    video: $scope.createAds.vedioUrl,
                }

                console.log("modifyData",JSON.stringify(modifyData))
                userService.createAds(modifyData).success(function(res) {
                    console.log("ressssssss",JSON.stringify(res))
                    if (res.responseCode == 200) {
                        toastr.success(res.responseMessage)
                        $state.go('header.manageAds')
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })

            }else if($scope.createAds.adContentType == 'slideshow'){
                modifyData = {
                    userId: adminIdss,
                    pageId: pageDetails._id,
                    pageName: pageDetails.pageName,
                    category: pageDetails.category,
                    subCategory: pageDetails.subCategory,
                    adsType: $scope.createAds.giftType,
                    slideShow:$scope.slideshowPhoto,
                    adContentType: $scope.createAds.adContentType,
                    numberOfWinners: $scope.createAds.numberOfWinners,
                    allAreWinners: $scope.createAds.allAreWinners,
                    giftDescription: $scope.createAds.giftDescription,
                    viewerLength: $scope.createAds.viewers,
                    hiddenGifts: $scope.addCode,
                    couponLength: $scope.createAds.numberOfWinners,
                    uploadGiftImage:$scope.createAds.gifyDescImage,
                    gender: $scope.createAds.gender,
                    ageFrom: $scope.createAds.ageFrom,
                    ageTo: $scope.createAds.ageTo,
                    couponBuyersLength: $scope.createAds.viewers,
                    sellCoupon: $scope.createAds.cellThisCoupon,
                    whoWillSeeYourAdd: {
                    country: $scope.createAds.country,
                    city: $scope.createAds.city
                    },
                    couponExpiryDate: $scope.couponExpiryDate,
                    appName:$scope.createAds.appName,
                    googleLink: $scope.createAds.googlePlayLink,
                    appStoreLink: $scope.createAds.appStoreLink,
                    windowsStoreLink: $scope.createAds.windowStoreLink,
                    appIcon: $scope.createAds.appIcon,
                    linkDescription: $scope.createAds.linkDescription,
                    dawnloadPagePhoto: $scope.dawnloadPagePhoto,
                    promoteApp: $scope.promoteApp,
                    musicFileName: $scope.createAds.audioUrl,
                }

                console.log("modifyData",JSON.stringify(modifyData))
                userService.createAds(modifyData).success(function(res) {
                    console.log("ressssssss",JSON.stringify(res))
                    if (res.responseCode == 200) {
                        toastr.success(res.responseMessage)
                        $state.go('header.manageAds')
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
            }

        }else if($scope.createAds.giftType == 'cash'){
             if($scope.createAds.adContentType == 'video'){
                modifyData = {
                    userId: adminIdss,
                    pageId: pageDetails._id,
                    pageName: pageDetails.pageName,
                    category: pageDetails.category,
                    subCategory: pageDetails.subCategory,
                    adsType: $scope.createAds.giftType,
                    coverImage: $scope.createAds.advertismentCover,
                    adContentType: $scope.createAds.adContentType,
                    numberOfWinners: $scope.createAds.numberOfWinners,
                    viewerLength: $scope.createAds.viewers,
                    gender: $scope.createAds.gender,
                    ageFrom: $scope.createAds.ageFrom,
                    ageTo: $scope.createAds.ageTo,
                    couponBuyersLength: $scope.createAds.viewers,
                    whoWillSeeYourAdd: {
                    country: $scope.createAds.country,
                    city: $scope.createAds.city
                    },
                    appName:$scope.createAds.appName,
                    googleLink: $scope.createAds.googlePlayLink,
                    appStoreLink: $scope.createAds.appStoreLink,
                    windowsStoreLink: $scope.createAds.windowStoreLink,
                    appIcon: $scope.createAds.appIcon,
                    linkDescription: $scope.createAds.linkDescription,
                    dawnloadPagePhoto: $scope.dawnloadPagePhoto,
                    promoteApp: $scope.promoteApp,
                    video: $scope.createAds.vedioUrl,
                    brolixFees:$scope.createAds.brolixFees,
                    cashAdPrize: $scope.createAds.viewersOne,
                }

                console.log("modifyData111",JSON.stringify(modifyData))
                userService.createAds(modifyData).success(function(res) {
                    console.log("ressssssss",JSON.stringify(res))
                    if (res.responseCode == 200) {
                        toastr.success(res.responseMessage)
                        $state.go('header.manageAds')
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })


            }else if($scope.createAds.adContentType == 'slideshow'){
                modifyData = {
                    userId: adminIdss,
                    pageId: pageDetails._id,
                    pageName: pageDetails.pageName,
                    category: pageDetails.category,
                    subCategory: pageDetails.subCategory,
                    adsType: $scope.createAds.giftType,
                    slideShow:$scope.slideshowPhoto,
                    adContentType: $scope.createAds.adContentType,
                    numberOfWinners: $scope.createAds.numberOfWinners,
                    allAreWinners: $scope.createAds.allAreWinners,
                    giftDescription: $scope.createAds.giftDescription,
                    viewerLength: $scope.createAds.viewers,
                    hiddenGifts: $scope.addCode,
                    couponLength: $scope.createAds.numberOfWinners,
                    uploadGiftImage:$scope.createAds.gifyDescImage,
                    gender: $scope.createAds.gender,
                    ageFrom: $scope.createAds.ageFrom,
                    ageTo: $scope.createAds.ageTo,
                    couponBuyersLength: $scope.createAds.viewers,
                    sellCoupon: $scope.createAds.cellThisCoupon,
                    whoWillSeeYourAdd: {
                    country: $scope.createAds.country,
                    city: $scope.createAds.city
                    },
                    couponExpiryDate: $scope.couponExpiryDate,
                    appName:$scope.createAds.appName,
                    googleLink: $scope.createAds.googlePlayLink,
                    appStoreLink: $scope.createAds.appStoreLink,
                    windowsStoreLink: $scope.createAds.windowStoreLink,
                    appIcon: $scope.createAds.appIcon,
                    linkDescription: $scope.createAds.linkDescription,
                    dawnloadPagePhoto: $scope.dawnloadPagePhoto,
                    promoteApp: $scope.promoteApp,
                    musicFileName: $scope.createAds.audioUrl,
                    brolixFees:$scope.createAds.brolixFees,
                    cashAdPrize: $scope.createAds.viewersOne,
                }

                console.log("modifyData",JSON.stringify(modifyData))
                userService.createAds(modifyData).success(function(res) {
                    console.log("ressssssss",JSON.stringify(res))
                    if (res.responseCode == 200) {
                        toastr.success(res.responseMessage)
                        $state.go('header.manageAds')
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                
            }

        }
    }
        
        // var whoWillSeeYourAddArray = [];
    //     var slideShow = [$scope.createAds.slidePhoto1, $scope.createAds.slidePhoto2, $scope.createAds.slidePhoto3, $scope.createAds.slidePhoto4, $scope.createAds.slidePhoto5, $scope.createAds.slidePhoto6];
    //     var appPhoto = [];
    //     appPhoto = [$scope.createAds.appPhoto1, $scope.createAds.appPhoto2, $scope.createAds.appPhoto3, $scope.createAds.appPhoto4, $scope.createAds.appPhoto5, $scope.createAds.appPhoto6];
    //     var promoteAppBoolean = appPhoto.length == 0 ? false : true;
    //     var coverimage = $scope.createAds.adContentType == 'slideshow' ? $scope.createAds.slidePhoto1 : $scope.createAds.advertismentCover;
    //     //console.log("ddadaaradfatya0",JSON.stringify(data));
    //     var modifyData = {};
    //     modifyData = {
    //         userId: adminIdss,
    //         pageId: pageDetails._id,
    //         pageName: pageDetails.pageName,
    //         category: pageDetails.category,
    //         subCategory: pageDetails.subCategory,
    //         adsType: $scope.createAds.giftType,
    //         coverImage: coverimage,
    //         adContentType: $scope.createAds.adContentType,
    //         numberOfWinners: $scope.createAds.winner,
    //         giftDescription: $scope.createAds.giftDescription,
    //         viewerLength: $scope.createAds.viewers,
    //         hiddenGifts: $scope.addCode,
    //         couponLength: $scope.createAds.winner,
    //         gender: $scope.createAds.gender,
    //         ageFrom: $scope.createAds.ageFrom,
    //         ageTo: $scope.createAds.ageTo,
    //         couponBuyersLength: $scope.createAds.viewers,
    //         sellCoupon: $scope.createAds.cellThisCoupon,
    //         whoWillSeeYourAdd: {
    //             country: $scope.createAds.country,
    //             state: $scope.createAds.state,
    //             city: $scope.createAds.city
    //         },
    //         couponExpiryDate: $scope.couponExpiryDate,
    //         googleLink: $scope.createAds.googlePlayLink,
    //         appStoreLink: $scope.createAds.appStoreLink,
    //         windowsStoreLink: $scope.createAds.windowStoreLink,
    //         appIcon: $scope.createAds.appIcon,
    //         linkDescription: $scope.createAds.linkDescription,
    //         dawnloadPagePhoto: [$scope.createAds.appPhoto1, $scope.createAds.appPhoto2, $scope.createAds.appPhoto3, $scope.createAds.appPhoto4, $scope.createAds.appPhoto5, $scope.createAds.appPhoto6],
    //         promoteApp: promoteAppBoolean,
    //         video: $scope.createAds.vedioUrl,
    //         musicFileName: $scope.createAds.audioUrl,
    //         slideShow: slideShow,
    //         brolixFees: $scope.createAds.brolixFees,
    //         cashAdPrize: $scope.createAds.viewersOne,

    //     }
    //     //console.log("All data -->>"+JSON.stringify(modifyData));
    //     // userService.createAds(modifyData).success(function(res) {
    //     //     console.log("ressssssss",JSON.stringify(res))
    //     // if (res.responseCode == 200) {
    //     //     toastr.success(res.responseMessage)
    //     // } else {
    //     //     toastr.error(res.responseMessage);
    //     //     // $state.go('login')

    //     // }
    //     // console.log("resss",$scope.userId);
    //     // })

})