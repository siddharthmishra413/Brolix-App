app.controller('manageUsersCtrl', function($scope, $window, userService, $state, toastr, $http, $timeout) {
    $(window).scrollTop(0, 0);
    $scope.class = true;
    $scope.$emit('headerStatus', 'Manage User');
    $scope.$emit('SideMenu', 'Manage User');
    $scope.tab = 'totalUsers';
    $scope.myForm = {};
    $scope.sendMessage = {};
    $scope.sendBrolix = {};
    $scope.sendCash = {};
    $scope.countrieName = {};
    $scope.stateName = {};
    $scope.active_upgrade_card = true;
    $scope.cardType = 'upgrade_card';
    $scope.dashBordFilter = {};
    $scope.ageLimit = [];
    $scope.ageLimits = [];
    localStorage.setItem('userTypeName', 'totalUsers');

    $scope.dateValidation = function(dtaa) {
        var dta = dtaa;
        var timestamp = new Date(dtaa).getTime();
        var nextday = timestamp + 8.64e+7;
        $scope.minDatee = new Date(nextday).toDateString();
    }


    userService.totalUser().success(function(res) {
        if (res.responseCode == 200) {
            $scope.totalUser = res.result;
            $scope.totalUserCount = res.result.length;
        } else {
            $scope.totalUserCount = 0;
        }
    })
    userService.showAllPersonalUser().success(function(res) {
        if (res.responseCode == 200) {
            $scope.personalUser = res.result;
            $scope.personalUserCount = res.result.length;
        } else {
            $scope.personalUserCount = 0;
        }
    })
    userService.showAllBusinessUser().success(function(res) {
        if (res.responseCode == 200) {
            $scope.businessUser = res.result;
            $scope.businessUserCount = res.result.length;
        } else {
            $scope.businessUserCount = 0;
        }
    })
    userService.showAllLiveUsers().success(function(res) {
        if (res.responseCode == 200) {
            $scope.liveUser = res.result;
            $scope.LiveUserCount = res.result.length;
        } else {
            $scope.LiveUserCount = 0;
        }
    })
    userService.totalWinners().success(function(res) {
        if (res.responseCode == 200) {
            $scope.totalWinnersCount = res.result;
        } else {
            $scope.totalWinnersCount = 0;
        }
    })
    userService.showAllCashWinners().success(function(res) {
        if (res.responseCode == 200) {
            $scope.cashWinners = res.result;
            $scope.cashWinnersCount = res.result.length;
        } else {
            $scope.cashWinnersCount = 0;
        }
    })
    userService.showAllCouponWinners().success(function(res) {
        if (res.responseCode == 200) {
            $scope.couponWinners = res.result;
            $scope.couponWinnersCount = res.result.length;
        } else {
            $scope.couponWinnersCount = 0;
        }
    })
    userService.showAllBlockUser().success(function(res) {
        if (res.responseCode == 200) {
            $scope.allblockUser = res.result;
            $scope.allblockUserCount = res.result.length;
        } else {
            $scope.allblockUserCount = 0;
        }
    })
    for (var i = 15; i < 99; i++) {
        $scope.ageLimit.push(i);
    }
    $scope.ageFunction = function(age) {
        var agefromLimited = parseInt(age) + 1;
        for (var i = agefromLimited; i < 99; i++) {
            $scope.ageLimits.push(i);
        }
    }
    userService.countryListData().success(function(res) {
        $scope.countries = res.result;
    })
    $scope.changeCountry = function() {
        var obj = {};
        obj = {
            country: $scope.dashBordFilter.country,
        }
        userService.cityListData(obj).success(function(res) {
            $scope.cityList = res.result;
        })
    }
    $scope.showPageDetails = function(id) {
        userService.showUserPage(id).success(function(res) {
            if (res.responseCode == 200) {
                $scope.allshowUserPage = res.result;
                $("#pageDetails").modal('show');
            } else {
                toastr.error(res.responseMessage);
            }
        })
    }
    
    
    $scope.export = function() {
        html2canvas(document.getElementById('manageUserTable'), {
            onrendered: function(canvas) {
                var data = canvas.toDataURL();
                var docDefinition = {
                    content: [{
                        image: data,
                        width: 500,
                    }]
                };
                pdfMake.createPdf(docDefinition).download("test.pdf");
            }
        });
    }
    $scope.userTypeName = function(val) {
        localStorage.setItem('userTypeName', val);
        $scope.dashBordFilter.country = "";
        $scope.dashBordFilter.city = "";
        $scope.dashBordFilter.gender = "";
        $scope.dashBordFilter.dobTo = "";
        $scope.dashBordFilter.dobFrom = "";
        $scope.dashBordFilter.ageTo = "";
        $scope.dashBordFilter.ageFrom = "";
        switch (val) {
            case 'totalUsers':
                userService.totalUser().success(function(res) {
                    if (res.responseCode == 200) {
                        $scope.totalUser = res.result;
                        $scope.totalUserCount = res.result.length;
                    } else {
                        $scope.totalUserCount = 0;
                        toastr.error(res.responseMessage);
                    }
                })
                break;

            case 'personalUsers':
                userService.showAllPersonalUser().success(function(res) {
                    if (res.responseCode == 200) {
                        $scope.personalUser = res.result;
                        $scope.personalUserCount = res.result.length;
                    } else {
                        $scope.personalUserCount = 0;
                        toastr.error(res.responseMessage);
                    }
                })
                break;

            case 'businessUsers':
                userService.showAllBusinessUser().success(function(res) {
                    if (res.responseCode == 200) {
                        $scope.businessUser = res.result;
                        $scope.businessUserCount = res.result.length;
                    } else {
                        $scope.businessUserCount = 0;
                        //toastr.error(res.responseMessage);
                    }
                })
                break;

            case 'liveUsers':
                userService.showAllLiveUsers().success(function(res) {
                    if (res.responseCode == 200) {
                        $scope.liveUser = res.result;
                        $scope.LiveUserCount = res.result.length;
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;

            case 'blockedUsers':
                userService.showAllBlockUser().success(function(res) {
                    if (res.responseCode == 200) {
                        $scope.allblockUser = res.result;
                        $scope.allblockUserCount = res.result.length;
                    } else {
                        $scope.allblockUserCount = 0;
                        //toastr.error(res.responseMessage);
                    }
                })
                break;

            default:
                toastr.error("Somthing wents to wroung");
        }


    }

    var a = localStorage.getItem('em');;
    console.log("Em =>"+a)
    var req = {
      email : a
    }

    userService.adminProfile(req).success(function(res) {
        if (res.responseCode == 404) {
            toastr.error(res.responseMessage);
            $state.go('login')
        } else {
            $scope.user = res.result;
        }
    })
    $scope.active_tab = function(active_card) {
        if (active_card == 'upgrade_card') {
            $scope.active_upgrade_card = true;
            $scope.active_luck_card = false;
        } else {
            userService.viewcard(active_card).success(function(res) {
                $scope.LuckCard = res.data;
            })
            $scope.active_upgrade_card = false;
            $scope.active_luck_card = true;
        }
    }
    $scope.total_user_message = function(modal) {
        $scope.modalId = modal;
        $scope.modelData = modal;
        if ($scope.modalId == '' || $scope.modalId == undefined || $scope.modalId == null) {
            toastr.error("Please select user.")
            $state.go('header.manageUsers')
        } else {
            $("#sendMessageModelAllUser").modal('show');
        }
    }
    $scope.send_massage = function() {
        var array = [];
        var data = {};
        switch ($scope.modelData) {
            case 'totalUser':
                for (var i = 0; i < $scope.totalUser.length; i++) {
                    array.push($scope.totalUser[i]._id)
                }
                data = {
                    Message: $scope.sendMessage.massage,
                    Id: array
                }
                userService.sendMassageAllUser(data).success(function(res) {
                    if (res.responseCode == 200) {
                        toastr.success("Message send successfully to all user");
                        $scope.sendMessage = '';
                        $("#sendMessageModelAllUser").modal('hide');
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;
            case 'PersonalUser':
                for (var i = 0; i < $scope.personalUser.length; i++) {
                    array.push($scope.personalUser[i]._id)
                }
                data = {
                    Message: $scope.sendMessage.massage,
                    Id: array
                }
                userService.sendMassageAllUser(data).success(function(res) {
                    if (res.responseCode == 200) {
                        toastr.success("Message send successfully to all personal user");
                        $scope.sendMessage = '';
                        $("#sendMessageModelAllUser").modal('hide');
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;
            case 'BusinessUser':
                for (var i = 0; i < $scope.businessUser.length; i++) {
                    array.push($scope.businessUser[i]._id)
                }
                data = {
                    Message: $scope.sendMessage.massage,
                    Id: array
                }
                userService.sendMassageAllUser(data).success(function(res) {
                    if (res.responseCode == 200) {
                        toastr.success("Message send successfully to all business user");
                        $scope.sendMessage = '';
                        $("#sendMessageModelAllUser").modal('hide');
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;
            case 'LiveUser':
                for (var i = 0; i < $scope.liveUser.length; i++) {
                    array.push($scope.liveUser[i]._id)
                }
                data = {
                    Message: $scope.sendMessage.massage,
                    Id: array
                }
                userService.sendMassageAllUser(data).success(function(res) {
                    if (res.responseCode == 200) {
                        toastr.success("Message send Successfully to all live user");
                        $scope.sendMessage = '';
                        $("#sendMessageModelAllUser").modal('hide');
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;
            case 'WinnersUser':
                for (var i = 0; i < $scope.totalWinners.length; i++) {
                    array.push($scope.totalWinners[i]._id)
                }
                data = {
                    Message: $scope.sendMessage.massage,
                    Id: array
                }
                userService.sendMassageAllUser(data).success(function(res) {
                    if (res.responseCode == 200) {
                        toastr.success("Message send successfully to all winners user");
                        $scope.sendMessage = '';
                        $("#sendMessageModelAllUser").modal('hide');
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;
            case 'CashWinnersUser':
                for (var i = 0; i < $scope.cashWinners.length; i++) {
                    array.push($scope.cashWinners[i]._id)
                }
                data = {
                    Message: $scope.sendMessage.massage,
                    Id: array
                }
                userService.sendMassageAllUser(data).success(function(res) {
                    if (res.responseCode == 200) {
                        toastr.success("Message send successfully to all cashWinners user");
                        $scope.sendMessage = '';
                        $("#sendMessageModelAllUser").modal('hide');
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;
            case 'CouponWinnersUser':
                for (var i = 0; i < $scope.couponWinners.length; i++) {
                    array.push($scope.couponWinners[i]._id)
                }
                data = {
                    Message: $scope.sendMessage.massage,
                    Id: array
                }
                userService.sendMassageAllUser(data).success(function(res) {
                    if (res.responseCode == 200) {
                        toastr.success("Message send successfully to all couponWinners user");
                        $scope.sendMessage = '';
                        $("#sendMessageModelAllUser").modal('hide');
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;
            case 'BlockedUser':
                for (var i = 0; i < $scope.allblockUser.length; i++) {
                    array.push($scope.allblockUser[i]._id)
                }
                data = {
                    Message: $scope.sendMessage.massage,
                    Id: array
                }
                userService.sendMassageAllUser(data).success(function(res) {
                    if (res.responseCode == 200) {
                        toastr.success("Message Send Successfully to All Blocked User");
                        $scope.sendMessage = '';
                        $("#sendMessageModelAllUser").modal('hide');
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;
            default:
                array.push($scope.modalId)
                data = {
                    Message: $scope.sendMessage.massage,
                    Id: array
                }
                userService.sendMassageAllUser(data).success(function(res) {
                    if (res.responseCode == 200) {
                        toastr.success("Message send successfully to user");
                        $scope.sendMessage = '';
                        $("#sendMessageModelAllUser").modal('hide');
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
        }
    }
    /*Open Modal To send Brolix to Multiple User*/
    $scope.total_user_brolix = function(modal) {
        $scope.modalId = modal;
        $scope.modelBrolix = modal;
        if ($scope.modalId == '' || $scope.modalId == undefined || $scope.modalId == null) {
            toastr.error("Please select user.")
            $state.go('header.manageUsers')
        } else {
            $("#sendbrolixModelAllUser").modal('show');
        }
    }
    /*Send Brolix and close all modal*/
    $scope.send_brolix = function(modal) {
        var array = [];
        var data = {};
        switch ($scope.modelBrolix) {
            case 'totalUser':
                for (var i = 0; i < $scope.totalUser.length; i++) {
                    array.push($scope.totalUser[i]._id)
                }

                data = {
                    Brolix: $scope.sendBrolix.brolix,
                    Id: array
                }
                console.log("totalUser",JSON.stringify(data))
                userService.sendBrolixAndCashAllUser(data).success(function(res) {
                    if (res.responseCode == 200) {
                        toastr.success("Brolix send successfully to all user");
                        $scope.sendBrolix = '';
                        $("#sendbrolixModelAllUser").modal('hide');
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;
            case 'PersonalUser':
                for (var i = 0; i < $scope.personalUser.length; i++) {
                    array.push($scope.personalUser[i]._id)
                }
                data = {
                    Brolix: $scope.sendBrolix.brolix,
                    Id: array
                }
                console.log("totalUser",JSON.stringify(data))
                userService.sendBrolixAndCashAllUser(data).success(function(res) {
                    if (res.responseCode == 200) {
                        toastr.success("Brolix send successfully all personal user");
                        $scope.sendBrolix = '';
                        $("#sendbrolixModelAllUser").modal('hide');
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;
            case 'BusinessUser':
                for (var i = 0; i < $scope.businessUser.length; i++) {
                    array.push($scope.businessUser[i]._id)
                }
                data = {
                    Brolix: $scope.sendBrolix.brolix,
                    Id: array
                }
                console.log("totalUser",JSON.stringify(data))
                userService.sendBrolixAndCashAllUser(data).success(function(res) {
                    if (res.responseCode == 200) {
                        toastr.success("Brolix send successfully to all business user");
                        $("#sendbrolixModelAllUser").modal('hide');
                        $scope.sendBrolix = '';
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;
            case 'LiveUser':
                for (var i = 0; i < $scope.liveUser.length; i++) {
                    array.push($scope.liveUser[i]._id)
                }
                data = {
                    Brolix: $scope.sendBrolix.brolix,
                    Id: array
                }
                console.log("totalUser",JSON.stringify(data))
                userService.sendBrolixAndCashAllUser(data).success(function(res) {
                    if (res.responseCode == 200) {
                        toastr.success("Brolix send successfully to all live user");
                        $("#sendbrolixModelAllUser").modal('hide');
                        $scope.sendBrolix = '';
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;
            case 'WinnersUser':
                for (var i = 0; i < $scope.totalWinners.length; i++) {
                    array.push($scope.totalWinners[i]._id)
                }
                data = {
                    Brolix: $scope.sendBrolix.brolix,
                    Id: array
                }
                userService.sendBrolixAndCashAllUser(data).success(function(res) {
                    if (res.responseCode == 200) {
                        toastr.success("Brolix send successfully to all winners user");
                        $("#sendbrolixModelAllUser").modal('hide');
                        $scope.sendBrolix = '';
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;
            case 'CashWinnersUser':
                for (var i = 0; i < $scope.cashWinners.length; i++) {
                    array.push($scope.cashWinners[i]._id)
                }
                data = {
                    Brolix: $scope.sendBrolix.brolix,
                    Id: array
                }
                userService.sendBrolixAndCashAllUser(data).success(function(res) {
                    if (res.responseCode == 200) {
                        toastr.success("Brolix send successfully to all cashWinners user");
                        $("#sendbrolixModelAllUser").modal('hide');
                        $scope.sendBrolix = '';
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;
            case 'CouponWinnersUser':
                for (var i = 0; i < $scope.couponWinners.length; i++) {
                    array.push($scope.couponWinners[i]._id)
                }
                data = {
                    Brolix: $scope.sendBrolix.brolix,
                    Id: array
                }
                userService.sendBrolixAndCashAllUser(data).success(function(res) {
                    if (res.responseCode == 200) {
                        toastr.success("Brolix send successfully to all couponWinners user");
                        $("#sendbrolixModelAllUser").modal('hide');
                        $scope.sendBrolix = '';
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;
            case 'BlockedUser':
                for (var i = 0; i < $scope.allblockUser.length; i++) {
                    array.push($scope.allblockUser[i]._id)
                }
                data = {
                    Brolix: $scope.sendBrolix.brolix,
                    Id: array
                }
                userService.sendBrolixAndCashAllUser(data).success(function(res) {
                    if (res.responseCode == 200) {
                        toastr.success("Brolix send successfully to all blocked user");
                        $("#sendbrolixModelAllUser").modal('hide');
                        $scope.sendBrolix = '';
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;
            default:
                array.push($scope.modalId)
                data = {
                    Brolix: $scope.sendBrolix.brolix,
                    Id: array
                }
                userService.sendBrolixAndCashAllUser(data).success(function(res) {
                    if (res.responseCode == 200) {
                        toastr.success("Brolix send successfully to user");
                        $("#sendbrolixModelAllUser").modal('hide');
                        $scope.sendBrolix = '';
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
        }
    }
    $scope.total_user_cash = function(modal) {
        $scope.modalId = modal;
        $scope.modelCash = modal;
        if ($scope.modalId == '' || $scope.modalId == undefined || $scope.modalId == null) {
            toastr.error("Please select user.")
            $state.go('header.manageUsers')
        } else {
            $("#sendcashModelAllUser").modal('show');
        }
    }
    /*Send Brolix and close all modal*/
    $scope.send_cashall = function(modal) {
        var array = [];
        var data = {};
        switch ($scope.modelCash) {
            case 'totalUser':
                for (var i = 0; i < $scope.totalUser.length; i++) {
                    array.push($scope.totalUser[i]._id)
                }
                data = {
                    Cash: $scope.sendCash.Cash,
                    Id: array
                }
                userService.sendBrolixAndCashAllUser(data).success(function(res) {
                    if (res.responseCode == 200) {
                        toastr.success("Cash send successfully to all user");
                        $scope.sendCash = '';
                        $("#sendcashModelAllUser").modal('hide');
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;
            case 'PersonalUser':
                for (var i = 0; i < $scope.personalUser.length; i++) {
                    array.push($scope.personalUser[i]._id)
                }
                data = {
                    Cash: $scope.sendCash.Cash,
                    Id: array
                }
                userService.sendBrolixAndCashAllUser(data).success(function(res) {
                    if (res.responseCode == 200) {
                        toastr.success("Cash send successfully to all personal user");
                        $scope.sendCash = '';
                        $("#sendcashModelAllUser").modal('hide');
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;
            case 'BusinessUser':
                for (var i = 0; i < $scope.businessUser.length; i++) {
                    array.push($scope.businessUser[i]._id)
                }
                data = {
                    Cash: $scope.sendCash.Cash,
                    Id: array
                }
                userService.sendBrolixAndCashAllUser(data).success(function(res) {
                    if (res.responseCode == 200) {
                        toastr.success("Cash send successfully to all business user");
                        $scope.sendCash = '';
                        $("#sendcashModelAllUser").modal('hide');
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;
            case 'LiveUser':
                for (var i = 0; i < $scope.liveUser.length; i++) {
                    array.push($scope.liveUser[i]._id)
                }
                data = {
                    Cash: $scope.sendCash.Cash,
                    Id: array
                }
                userService.sendBrolixAndCashAllUser(data).success(function(res) {
                    if (res.responseCode == 200) {
                        toastr.success("Cash send successfully to all live user");
                        $scope.sendCash = '';
                        $("#sendcashModelAllUser").modal('hide');
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;
            case 'WinnersUser':
                for (var i = 0; i < $scope.totalWinners.length; i++) {
                    array.push($scope.totalWinners[i]._id)
                }
                data = {
                    Cash: $scope.sendCash.Cash,
                    Id: array
                }
                userService.sendBrolixAndCashAllUser(data).success(function(res) {
                    if (res.responseCode == 200) {
                        toastr.success("Cash send successfully to all winners user");
                        $scope.sendCash = '';
                        $("#sendcashModelAllUser").modal('hide');
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;
            case 'CashWinnersUser':
                for (var i = 0; i < $scope.cashWinners.length; i++) {
                    array.push($scope.cashWinners[i]._id)
                }
                data = {
                    Cash: $scope.sendCash.Cash,
                    Id: array
                }
                userService.sendBrolixAndCashAllUser(data).success(function(res) {
                    if (res.responseCode == 200) {
                        toastr.success("Cash send successfully to all cashWinners user");
                        $scope.sendCash = '';
                        $("#sendcashModelAllUser").modal('hide');
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;
            case 'CouponWinnersUser':
                for (var i = 0; i < $scope.couponWinners.length; i++) {
                    array.push($scope.couponWinners[i]._id)
                }
                data = {
                    Cash: $scope.sendCash.Cash,
                    Id: array
                }
                userService.sendBrolixAndCashAllUser(data).success(function(res) {
                    if (res.responseCode == 200) {
                        toastr.success("Cash send successfully to all couponWinners user");
                        $scope.sendCash = '';
                        $("#sendcashModelAllUser").modal('hide');
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;
            case 'BlockedUser':
                for (var i = 0; i < $scope.allblockUser.length; i++) {
                    array.push($scope.allblockUser[i]._id)
                }
                data = {
                    Cash: $scope.sendCash.Cash,
                    Id: array
                }
                userService.sendBrolixAndCashAllUser(data).success(function(res) {
                    if (res.responseCode == 200) {
                        toastr.success("Cash send successfully to all blocked user");
                        $scope.sendCash = '';
                        $("#sendcashModelAllUser").modal('hide');
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;
            default:
                array.push($scope.modalId)
                data = {
                    Cash: $scope.sendCash.Cash,
                    Id: array
                }
                userService.sendBrolixAndCashAllUser(data).success(function(res) {
                    if (res.responseCode == 200) {
                        toastr.success("Cash send successfully to user");
                        $scope.sendCash = '';
                        $("#sendcashModelAllUser").modal('hide');
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
        }
    }
    // $scope.viewUsersProfile = function(id){
    //     if (id == '' || id == undefined || id == null) {
    //         toastr.error("Please select user.")
    //         // $state.go('header.manageUsers')
    //     }
    //     else{
    //         $state.go('header.viewUserProfile')
    //     }
    // }
    $scope.Block_User = function(id) {
        $scope.BlockId = id;
        var userId = $scope.BlockId;
        if ($scope.BlockId == '' || $scope.BlockId == undefined || $scope.BlockId == null) {
            toastr.error("Please select user.")
            $state.go('header.manageUsers')
        } else {
            BootstrapDialog.show({
                title: 'Block user',
                message: 'Are you sure want to block this user',
                buttons: [{
                    label: 'Yes',
                    action: function(dialog) {
                        userService.BlockUser(userId).success(function(res) {
                            if (res.responseCode == 200) {
                                dialog.close();
                                toastr.success("User Blocked");
                                $state.reload();
                            } else {
                                toastr.error(res.responseMessage);
                            }
                        })
                    }
                }, {
                    label: 'No',
                    action: function(dialog) {
                        dialog.close();
                    }
                }]
            });
        }
    }
    $scope.UnBlock_User = function(id) {
        $scope.BlockId = id;
        var userId = $scope.BlockId;
        if ($scope.BlockId == '' || $scope.BlockId == undefined || $scope.BlockId == null) {
            toastr.error("Please select user.")
            $state.go('header.manageUsers')
        } else {
            BootstrapDialog.show({
                title: 'Block User',
                message: 'Are you sure want to Unblock this User',
                buttons: [{
                    label: 'Yes',
                    action: function(dialog) {
                        userService.UnBlockUser(userId).success(function(res) {
                            if (res.responseCode == 200) {
                                dialog.close();
                                toastr.success("User unblocked");
                                $state.reload();
                            } else {
                                toastr.error(res.responseMessage);
                            }
                        })
                    }
                }, {
                    label: 'No',
                    action: function(dialog) {
                        dialog.close();
                    }
                }]
            });
        }
    }
    $scope.view_coupons = function(id) {
        $scope.couponId = id;
        $("#allCouponsDetails").modal('show');
    }
    $scope.total_user_card = function(modal) {
        $scope.modalId = modal;
        $scope.modelData = modal;
        if ($scope.modalId == '' || $scope.modalId == undefined || $scope.modalId == null) {
            toastr.error("Please select user.")
            $state.go('header.manageUsers')
        } else {
            $("#showAllCard").modal('show');
            userService.viewcard($scope.cardType).success(function(res) {
        if (res.responseCode == 200) {
            $scope.UpgradeCard = res.data;
        } else {}
    })
        }
    }
    $scope.sendCard = function(cardId, type) {
        var array = [];
        var data = {};
        $scope.cardId = cardId;
        var userType = localStorage.getItem('userTypeName');
        if (type == 'upgrade') {
            $("#showAllCard").modal('hide');
            switch ($scope.modelData) {
                case 'totalUser':
                    for (var i = 0; i < $scope.totalUser.length; i++) {
                        array.push($scope.totalUser[i]._id)
                    }
                    data = {
                        cardId: $scope.cardId,
                        Id: array
                    }
                    BootstrapDialog.show({
                        title: 'Send Card',
                        message: 'Are you sure want to send Card Users',
                        buttons: [{
                            label: 'Yes',
                            action: function(dialog) {
                                userService.sendUpgradeCardTOUsers(data).success(function(res) {
                                    if (res.responseCode == 200) {
                                        toastr.success("Upgrade card send successfully to all user");
                                        $scope.sendMessage = '';
                                        $("#showAllCard").modal('hide');
                                        dialog.close();
                                    } else {
                                        toastr.error(res.responseMessage);
                                    }
                                })
                            }
                        }, {
                            label: 'No',
                            action: function(dialog) {
                                dialog.close();
                            }
                        }]
                    });
                    break;
                case 'PersonalUser':
                    for (var i = 0; i < $scope.personalUser.length; i++) {
                        array.push($scope.personalUser[i]._id)
                    }
                    data = {
                        cardId: $scope.cardId,
                        Id: array
                    }
                    BootstrapDialog.show({
                        title: 'Send Card',
                        message: 'Are you sure want to send Card Users',
                        buttons: [{
                            label: 'Yes',
                            action: function(dialog) {
                                userService.sendUpgradeCardTOUsers(data).success(function(res) {
                                    if (res.responseCode == 200) {
                                        toastr.success("Upgrade card send successfully to all personal user");
                                        $scope.sendMessage = '';
                                        $("#showAllCard").modal('hide');
                                        dialog.close();
                                    } else {
                                        toastr.error(res.responseMessage);
                                    }
                                })
                            }
                        }, {
                            label: 'No',
                            action: function(dialog) {
                                dialog.close();
                            }
                        }]
                    });
                    break;
                case 'BusinessUser':
                    for (var i = 0; i < $scope.businessUser.length; i++) {
                        array.push($scope.businessUser[i]._id)
                    }
                    data = {
                        cardId: $scope.cardId,
                        Id: array
                    }
                    BootstrapDialog.show({
                        title: 'Send Card',
                        message: 'Are you sure want to send Card Users',
                        buttons: [{
                            label: 'Yes',
                            action: function(dialog) {
                                userService.sendUpgradeCardTOUsers(data).success(function(res) {
                                    if (res.responseCode == 200) {
                                        toastr.success("Upgrade card send successfully to all business user");
                                        $scope.sendMessage = '';
                                        $("#showAllCard").modal('hide');
                                        dialog.close();
                                        $state.reload();
                                    } else {
                                        toastr.error(res.responseMessage);
                                    }
                                })
                            }
                        }, {
                            label: 'No',
                            action: function(dialog) {
                                dialog.close();
                            }
                        }]
                    });
                    break;
                case 'LiveUser':
                    for (var i = 0; i < $scope.liveUser.length; i++) {
                        array.push($scope.liveUser[i]._id)
                    }
                    data = {
                        cardId: $scope.cardId,
                        Id: array
                    }
                    BootstrapDialog.show({
                        title: 'Send Card',
                        message: 'Are you sure want to send Card Users',
                        buttons: [{
                            label: 'Yes',
                            action: function(dialog) {
                                userService.sendUpgradeCardTOUsers(data).success(function(res) {
                                    if (res.responseCode == 200) {
                                        toastr.success("Upgrade card send successfully to all live user");
                                        $scope.sendMessage = '';
                                        $("#showAllCard").modal('hide');
                                        dialog.close();
                                        $state.reload();
                                    } else {
                                        toastr.error(res.responseMessage);
                                    }
                                })
                            }
                        }, {
                            label: 'No',
                            action: function(dialog) {
                                dialog.close();
                            }
                        }]
                    });
                    break;
                default:
                    array.push($scope.modalId)
                    data = {
                        cardId: $scope.cardId,
                        Id: array
                    }
                    BootstrapDialog.show({
                        title: 'Send Card',
                        message: 'Are you sure want to send Card Users',
                        buttons: [{
                            label: 'Yes',
                            action: function(dialog) {
                                //$("#showAllCoupons").modal('hide');
                                userService.sendUpgradeCardTOUsers(data).success(function(res) {
                                    if (res.responseCode == 200) {
                                        toastr.success("Upgrade card send successfully to user");
                                        $scope.sendMessage = '';
                                        $("#showAllCard").modal('hide');
                                        dialog.close();
                                        $state.reload();
                                    } else {
                                        toastr.error(res.responseMessage);
                                    }
                                })
                            }
                        }, {
                            label: 'No',
                            action: function(dialog) {
                                dialog.close();
                            }
                        }]
                    });
            }
        } else if (type == 'luck') {
            $("#showAllCard").modal('hide');
            switch ($scope.modelData) {
                case 'totalUser':
                    for (var i = 0; i < $scope.totalUser.length; i++) {
                        array.push($scope.totalUser[i]._id)
                    }
                    data = {
                        cardId: $scope.cardId,
                        Id: array
                    }
                    BootstrapDialog.show({
                        title: 'Send Card',
                        message: 'Are you sure want to send Card Users',
                        buttons: [{
                            label: 'Yes',
                            action: function(dialog) {
                                userService.sendLuckCardTOUsers(data).success(function(res) {
                                    if (res.responseCode == 200) {
                                        toastr.success("LuckCard send successfully to all user");
                                        $("#showAllCard").modal('hide');
                                        dialog.close();
                                    } else {
                                        toastr.error(res.responseMessage);
                                    }
                                })
                            }
                        }, {
                            label: 'No',
                            action: function(dialog) {
                                dialog.close();
                            }
                        }]
                    });
                    break;
                case 'PersonalUser':
                    for (var i = 0; i < $scope.personalUser.length; i++) {
                        array.push($scope.personalUser[i]._id)
                    }
                    data = {
                        cardId: $scope.cardId,
                        Id: array
                    }
                    BootstrapDialog.show({
                        title: 'Send Card',
                        message: 'Are you sure want to send Card Users',
                        buttons: [{
                            label: 'Yes',
                            action: function(dialog) {
                                userService.sendLuckCardTOUsers(data).success(function(res) {
                                    if (res.responseCode == 200) {
                                        toastr.success("LuckCard send successfully to all personal user");
                                        $("#showAllCard").modal('hide');
                                        dialog.close();
                                    } else {
                                        toastr.error(res.responseMessage);
                                    }
                                })
                            }
                        }, {
                            label: 'No',
                            action: function(dialog) {
                                dialog.close();
                            }
                        }]
                    });
                    break;
                case 'BusinessUser':
                    for (var i = 0; i < $scope.businessUser.length; i++) {
                        array.push($scope.businessUser[i]._id)
                    }
                    data = {
                        cardId: $scope.cardId,
                        Id: array
                    }
                    BootstrapDialog.show({
                        title: 'Send Card',
                        message: 'Are you sure want to send Card Users',
                        buttons: [{
                            label: 'Yes',
                            action: function(dialog) {
                                userService.sendLuckCardTOUsers(data).success(function(res) {
                                    if (res.responseCode == 200) {
                                        toastr.success("LuckCard send successfully to all business user");
                                        $("#showAllCard").modal('hide');
                                        dialog.close();
                                    } else {
                                        toastr.error(res.responseMessage);
                                    }
                                })
                            }
                        }, {
                            label: 'No',
                            action: function(dialog) {
                                dialog.close();
                            }
                        }]
                    });
                    break;
                case 'LiveUser':
                    for (var i = 0; i < $scope.liveUser.length; i++) {
                        array.push($scope.liveUser[i]._id)
                    }
                    data = {
                        cardId: $scope.cardId,
                        Id: array
                    }
                    BootstrapDialog.show({
                        title: 'Send Card',
                        message: 'Are you sure want to send Card Users',
                        buttons: [{
                            label: 'Yes',
                            action: function(dialog) {
                                userService.sendLuckCardTOUsers(data).success(function(res) {
                                    if (res.responseCode == 200) {
                                        toastr.success("LuckCard send successfully to all live user");
                                        $("#showAllCard").modal('hide');
                                        dialog.close();
                                    } else {
                                        toastr.error(res.responseMessage);
                                    }
                                })
                            }
                        }, {
                            label: 'No',
                            action: function(dialog) {
                                dialog.close();
                            }
                        }]
                    });
                    break;
                case 'WinnersUser':
                    for (var i = 0; i < $scope.totalWinners.length; i++) {
                        array.push($scope.totalWinners[i]._id)
                    }
                    data = {
                        cardId: $scope.cardId,
                        Id: array
                    }
                    userService.sendLuckCardTOUsers(data).success(function(res) {
                        if (res.responseCode == 200) {
                            toastr.success("LuckCard send successfully to all winners user");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                    break;
                case 'CashWinnersUser':
                    for (var i = 0; i < $scope.cashWinners.length; i++) {
                        array.push($scope.cashWinners[i]._id)
                    }
                    data = {
                        cardId: $scope.cardId,
                        Id: array
                    }
                    userService.sendLuckCardTOUsers(data).success(function(res) {
                        if (res.responseCode == 200) {
                            toastr.success("LuckCard send successfully to all cashWinners user");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                    break;
                case 'CouponWinnersUser':
                    for (var i = 0; i < $scope.couponWinners.length; i++) {
                        array.push($scope.couponWinners[i]._id)
                    }
                    data = {
                        cardId: $scope.cardId,
                        Id: array
                    }
                    userService.sendLuckCardTOUsers(data).success(function(res) {
                        if (res.responseCode == 200) {
                            toastr.success("LuckCard send successfully to all couponWinners user");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                    break;
                case 'BlockedUser':
                    for (var i = 0; i < $scope.allblockUser.length; i++) {
                        array.push($scope.allblockUser[i]._id)
                    }
                    data = {
                        cardId: $scope.cardId,
                        Id: array
                    }
                    BootstrapDialog.show({
                        title: 'Send Card',
                        message: 'Are you sure want to send Card Users',
                        buttons: [{
                            label: 'Yes',
                            action: function(dialog) {
                                userService.sendLuckCardTOUsers(data).success(function(res) {
                                    if (res.responseCode == 200) {
                                        toastr.success("LuckCard send successfully to all blocked user");
                                        $("#showAllCard").modal('hide');
                                        dialog.close();
                                    } else {
                                        toastr.error(res.responseMessage);
                                    }
                                })
                            }
                        }, {
                            label: 'No',
                            action: function(dialog) {
                                dialog.close();
                            }
                        }]
                    });
                    break;
                default:
                    array.push($scope.modalId)
                    data = {
                        cardId: $scope.cardId,
                        Id: array
                    }
                    BootstrapDialog.show({
                        title: 'Send Card',
                        message: 'Are you sure want to send Card Users',
                        buttons: [{
                            label: 'Yes',
                            action: function(dialog) {
                                userService.sendLuckCardTOUsers(data).success(function(res) {
                                    if (res.responseCode == 200) {
                                        toastr.success("LuckCard send successfully to user");
                                        $("#showAllCard").modal('hide');
                                        dialog.close();
                                    } else {
                                        toastr.error(res.responseMessage);
                                    }
                                })
                            }
                        }, {
                            label: 'No',
                            action: function(dialog) {
                                dialog.close();
                            }
                        }]
                    });
            }
        } else {
            toastr.error("Somwthing wents to wroung")
        }
    }
    /*----------DashBoardFilter----------*/
    $scope.dashBordFilter = function() {
        var type = localStorage.getItem('userTypeName');
        var data = {};
        data = {
            userType: localStorage.getItem('userTypeName'),
            country: $scope.dashBordFilter.country,
            state: $scope.dashBordFilter.state,
            city: $scope.dashBordFilter.city,
            gender: $scope.dashBordFilter.gender,
            ageTo: $scope.dashBordFilter.ageTo,
            ageFrom: $scope.dashBordFilter.ageFrom,
            joinTo: new Date($scope.dashBordFilter.dobTo).getTime(),
            joinFrom: new Date($scope.dashBordFilter.dobFrom).getTime(),
        }
        // console.log("datatata", JSON.stringify(data))
        switch (type) {
            case 'totalUsers':
                userService.userfilter(data).success(function(res) {
                    if (res.responseCode == 200) {
                        $scope.totalUser = res.data;
                        $scope.totalUserCount = res.data.length;
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;
            case 'personalUsers':
                userService.userfilter(data).success(function(res) {
                    if (res.responseCode == 200) {
                        $scope.personalUser = res.data;
                        $scope.personalUserCount = res.data.length;
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;
            case 'businessUsers':
                userService.userfilter(data).success(function(res) {
                    if (res.responseCode == 200) {
                        $scope.businessUser = res.data;
                        $scope.businessUserCount = res.data.length;
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;
            case 'liveUsers':
                userService.userfilter(data).success(function(res) {
                    if (res.responseCode == 200) {
                        $scope.liveUser = res.data;
                        $scope.LiveUserCount = res.data.length;
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;
            case 'blockedUsers':
                userService.userfilter(data).success(function(res) {
                    if (res.responseCode == 200) {
                        $scope.allblockUser = res.data;
                        $scope.allblockUserCount = res.data.length;
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;
            default:
                toastr.error("somthing wents to wroung");
        }
    }
    $scope.total_user_coupons = function(modal) {
        $scope.modalIdcoupon = modal;
        $scope.modelDatacoupon = modal;
        if ($scope.modalIdcoupon == '' || $scope.modalIdcoupon == undefined || $scope.modalIdcoupon == null) {
            toastr.error("Please select user.")
            $state.go('header.manageUsers')
        } else {
            userService.showListOFCouponWithoutPagination().success(function(res) {
                if (res.responseCode == 200) {
                    $scope.allCoupons = res.result;
                    console.log("$scope.allCoupons",JSON.stringify($scope.allCoupons))
                } else {
                    toastr.error(res.responseMessage)
                }
            })
            $("#showAllCoupons").modal('show');
        }
    }
    $scope.sendCoupons = function(couponId) {
        var array = [];
        var data = {};
        $scope.couponId = couponId;
        var type = localStorage.getItem('userTypeName');
        $("#showAllCoupons").modal('hide');
        switch ($scope.modelDatacoupon) {
            case 'totalUser':
                for (var i = 0; i < $scope.totalUser.length; i++) {
                    array.push($scope.totalUser[i]._id)
                }
                data = {
                    couponId: $scope.couponId,
                    Id: array
                }
                BootstrapDialog.show({
                    title: 'Send Coupon',
                    message: 'Are you sure want to send coupon ??',
                    buttons: [{
                        label: 'Yes',
                        action: function(dialog) {
                            userService.sendCouponTOUSers(data).success(function(res) {
                                if (res.responseCode == 200) {
                                    toastr.success(res.responseMessage);
                                    $scope.sendMessage = '';
                                    dialog.close();
                                    $state.reload();
                                } else {
                                    toastr.error(res.responseMessage);
                                }
                            })
                        }
                    }, {
                        label: 'No',
                        action: function(dialog) {
                            dialog.close();
                        }
                    }]
                });
                break;
            case 'PersonalUser':
                for (var i = 0; i < $scope.personalUser.length; i++) {
                    array.push($scope.personalUser[i]._id)
                }
                data = {
                    couponId: $scope.couponId,
                    Id: array
                }
                BootstrapDialog.show({
                    title: 'Send Coupon',
                    message: 'Are you sure want to send coupon ??',
                    buttons: [{
                        label: 'Yes',
                        action: function(dialog) {
                            userService.sendCouponTOUSers(data).success(function(res) {
                                if (res.responseCode == 200) {
                                    toastr.success(res.responseMessage);
                                    $scope.sendMessage = '';
                                    dialog.close();
                                    $state.reload();
                                } else {
                                    toastr.error(res.responseMessage);
                                }
                            })
                        }
                    }, {
                        label: 'No',
                        action: function(dialog) {
                            dialog.close();
                        }
                    }]
                });
                break;
            case 'BusinessUser':
                for (var i = 0; i < $scope.businessUser.length; i++) {
                    array.push($scope.businessUser[i]._id)
                }
                data = {
                    couponId: $scope.couponId,
                    Id: array
                }
                BootstrapDialog.show({
                    title: 'Send Coupon',
                    message: 'Are you sure want to send coupon ??',
                    buttons: [{
                        label: 'Yes',
                        action: function(dialog) {
                            userService.sendCouponTOUSers(data).success(function(res) {
                                if (res.responseCode == 200) {
                                    toastr.success(res.responseMessage);
                                    $scope.sendMessage = '';
                                    dialog.close();
                                    $state.reload();
                                } else {
                                    toastr.error(res.responseMessage);
                                }
                            })
                        }
                    }, {
                        label: 'No',
                        action: function(dialog) {
                            dialog.close();
                        }
                    }]
                });
                break;
            case 'LiveUser':
                for (var i = 0; i < $scope.liveUser.length; i++) {
                    array.push($scope.liveUser[i]._id)
                }
                data = {
                    couponId: $scope.couponId,
                    Id: array
                }
                BootstrapDialog.show({
                    title: 'Send Coupon',
                    message: 'Are you sure want to send coupon ??',
                    buttons: [{
                        label: 'Yes',
                        action: function(dialog) {
                            userService.sendCouponTOUSers(data).success(function(res) {
                                if (res.responseCode == 200) {
                                    toastr.success(res.responseMessage);
                                    $scope.sendMessage = '';
                                    dialog.close();
                                    $state.reload();
                                } else {
                                    toastr.error(res.responseMessage);
                                }
                            })
                        }
                    }, {
                        label: 'No',
                        action: function(dialog) {
                            dialog.close();
                        }
                    }]
                });
                break;
            default:
                array.push($scope.modalIdcoupon)
                data = {
                    couponId: $scope.couponId,
                    Id: array
                }
                BootstrapDialog.show({
                    title: 'Send Coupon',
                    message: 'Are you sure want to send coupon ??',
                    buttons: [{
                        label: 'Yes',
                        action: function(dialog) {
                            userService.sendCouponTOUSers(data).success(function(res) {
                                if (res.responseCode == 200) {
                                    toastr.success(res.responseMessage);
                                    $scope.sendMessage = '';
                                    $("#sendMessageModelAllUser").modal('hide');
                                    dialog.close();
                                    $state.reload();
                                } else {
                                    toastr.error(res.responseMessage);
                                }
                            })
                        }
                    }, {
                        label: 'No',
                        action: function(dialog) {
                            dialog.close();
                        }
                    }]
                });
        }
    }
});
app.filter("customFilterUserss", function() {
    return function(items, nameValue) {
        if (!nameValue) {
            return retArray = items;
        }
        var retArray = [];
        var no = "";
        for (var i = 0; i < items.length; i++) {
            no = items[i].mobileNumber.toString();
            if (items[i].firstName.toLowerCase().substr(0, nameValue.length) == nameValue.toLowerCase() || no.substr(0, nameValue.length) == nameValue) {
                retArray.push(items[i]);
            }
        }
        return retArray;
    }
});
app.filter("filter", function() {
    return function(items, nameValue) {
        if (!nameValue) {
            return retArray = items;
        }
        var retArray = [];
        for (var i = 0; i < items.length; i++) {
            if (items[i].pageName.toLowerCase().substr(0, nameValue.length) == nameValue.toLowerCase()) {
                retArray.push(items[i]);
            }
        }
        return retArray;
    }
});
app.filter("customSearchFilter", function() {
    return function(items, value) {
        if (!value) {
            return retArray = items;
        }
        var retArray = [];
        for (var i = 0; i < items.length; i++) {
            if (items[i].pageName.toLowerCase().substr(0, value.length) == value.toLowerCase()) {
                retArray.push(items[i]);
            }
        }
        return retArray;
    }
});
app.filter("filterOnView", function() {
    return function(items, nameValue) {
        if (!nameValue) {
            return retArray = items;
        }
        var retArray = [];
        for (var i = 0; i < items.length; i++) {
            if (items[i].viewers == nameValue) {
                retArray.push(items[i]);
            }
        }
        return retArray;
    }
});
app.filter("filterOnLuck", function() {
    return function(items, nameValue) {
        if (!nameValue) {
            return retArray = items;
        }
        var retArray = [];
        for (var i = 0; i < items.length; i++) {
            if (items[i].chances == nameValue) {
                retArray.push(items[i]);
            }
        }
        return retArray;
    }
});