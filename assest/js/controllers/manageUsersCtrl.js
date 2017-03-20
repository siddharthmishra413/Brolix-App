app.controller('manageUsersCtrl', function($scope, $window, userService, $state, toastr, $http) {
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
    $scope.active_upgrade_card=true;
    $scope.cardType = 'upgrade_card';
    $scope.dashBordFilter = {};

    $scope.showPageDetails = function(id){
        console.log("id---------",id);
        userService.showUserPage(id).success(function(res) {        
            $scope.allshowUserPage = res.result;
            $("#pageDetails").modal('show');
            console.log("$scope.allshowUserPage",JSON.stringify($scope.allshowUserPage))
        })
    }


    $scope.addcardId = function(id){
        $scope.cardId = id;

      // userService.removeCard(id).success(function(res){
      //   if(res.responseCode ==  200) {
      //     toastr.success(res.responseMessage);
      //     $state.reload();
      //   }else{
      //     toastr.error(res.responseMessage);
      //     $state.reload();
      //   }
      // })

    }


    userService.viewcard($scope.cardType).success(function(res) {
      //console.log("resssssssssssssss",res)
        $scope.UpgradeCard = res.data;
        //console.log("UpgradeCard",$scope.UpgradeCard);
    })

    $scope.export = function(){
        html2canvas(document.getElementById('manageUserTable'), {
            onrendered: function (canvas) {
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
        //$state.reload();
        localStorage.setItem('userTypeName',val);
    }


    $scope.slectCountry = function(qq){
        console.log("dashBordFilter.country----------",$scope.dashBordFilter.country);
        userService.allstatefind($scope.dashBordFilter.country).success(function(res) {
        $scope.allstatefind = res.result;
    })
    }

/******************contory or state function*****************/

    userService.countrys().success(function(res) {
         $scope.allCountriesfind = res.result;
    }).error(function(status, data) {

    })

    $scope.catId = function() {
        //console.log($scope.dashBordFilter.country);
        var country = $scope.dashBordFilter.country
        $http.get('/admin/getAllStates/' + country.code + '/ISO2').success(function(res) {
            console.log(res);
            $scope.allstates = res.result;
        }, function(err) {});
    }

/************************************************************/
   
    //*******************Total Winners****************
    userService.totalWinners().success(function(res) {
        $scope.totalWinners = res.result;
        $scope.totalWinnersCount = res.result.length;
        //console.log("$scope.totalWinners--------------",JSON.stringify($scope.totalWinners));
    })
    
    userService.adminProfile().success(function(res) {
        if (res.responseCode == 404) {
            toastr.error(res.responseMessage);
            $state.go('login')
        } else {
            $scope.user = res.result;
        }
    })
    //*******************Total User****************
    userService.totalUser().success(function(res) {
        if (res.responseCode == 200){
            $scope.totalUser = res.result;
            $scope.totalUserCount = res.result.length;
        } else {
            toastr.error(res.responseMessage);
        }
        
    })
    //*******************Personal User****************
    userService.showAllPersonalUser().success(function(res) {        
        if (res.responseCode == 200){
            $scope.personalUser = res.result;
            $scope.personalUserCount = res.result.length;
        } else {
            toastr.error(res.responseMessage);
        }
    })

    //*******************Business User****************
    userService.showAllBusinessUser().success(function(res) {        
        if (res.responseCode == 200){
            $scope.businessUser = res.result;
            $scope.businessUserCount = res.result.length;
        } else {
            toastr.error(res.responseMessage);
        }
    })

    //*******************Cash Winners****************
    userService.showAllCashWinners().success(function(res) {        
        if (res.responseCode == 200){
            $scope.cashWinners = res.result;
            $scope.cashWinnersCount = res.result.length;
        } else {
            toastr.error(res.responseMessage);
        }
    })

    //*******************Coupon Winners****************
    userService.showAllCouponWinners().success(function(res) {        
        if (res.responseCode == 200){
            $scope.couponWinners = res.result;
            $scope.couponWinnersCount = res.result.length;
        } else {
            toastr.error(res.responseMessage);
        }
    })

     //*******************Show AllBlockUser****************
    userService.showAllBlockUser().success(function(res) { 
        if (res.responseCode == 200){
            $scope.allblockUser = res.result;
            $scope.allblockUserCount = res.result.length;
        } else {
            toastr.error(res.responseMessage);
        }
    })

    $scope.active_tab=function(active_card){
        if(active_card=='upgrade_card'){
        $scope.active_upgrade_card=true;
         $scope.active_luck_card=false;
      }else{
        userService.viewcard(active_card).success(function(res) {
        console.log("resssssssssssssss",res)
        $scope.LuckCard = res.data;
        console.log("LuckCard",$scope.LuckCard);
    })
         $scope.active_upgrade_card=false;
            $scope.active_luck_card=true;
      }
    }

    /*Open Modal To send message to Multiple User*/

    $scope.total_user_message = function (modal) {

        $scope.modalId = modal;
        $scope.modelData = modal;
        if($scope.modalId == '' || $scope.modalId == undefined || $scope.modalId == null){
        toastr.error("Please select user.")
        $state.go('header.manageUsers')
        }else {
            $("#sendMessageModelAllUser").modal('show');
        }
    }

    /*Send Message and close all modal*/

    $scope.send_massage = function(){
         var array =[];
         var data = {};
         switch ($scope.modelData)
            {
                case 'totalUser': 
                    for (var i = 0; i < $scope.totalUser.length; i++) {
                        array.push($scope.totalUser[i]._id)
                    }
                    data = {
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                    userService.sendMassageAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Message Send Successfully to All User");
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
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                    userService.sendMassageAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Message Send Successfully to All Personal User");
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
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                    userService.sendMassageAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Message Send Successfully to All Business User");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide'); 
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'LiveUser': 
                    for (var i = 0; i < $scope.LiveUser.length; i++) {
                        array.push($scope.LiveUser[i]._id)
                    }
                    data = {
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                    userService.sendMassageAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Message Send Successfully to All Live User");
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
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                    userService.sendMassageAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Message Send Successfully to All Winners User");
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
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                    userService.sendMassageAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Message Send Successfully to All CashWinners User");
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
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                    userService.sendMassageAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Message Send Successfully to All CouponWinners User");
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
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                    userService.sendMassageAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
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
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                    userService.sendMassageAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Message Send Successfully to User");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide'); 
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
            }

    }

    /*Open Modal To send Brolix to Multiple User*/

    $scope.total_user_brolix = function (modal) {
        $scope.modalId = modal;
        $scope.modelBrolix = modal;
        if($scope.modalId == '' || $scope.modalId == undefined || $scope.modalId == null){
        toastr.error("Please select user.")
        $state.go('header.manageUsers')
        }else {
            $("#sendbrolixModelAllUser").modal('show');
        } 
    }

     /*Send Brolix and close all modal*/

    $scope.send_brolix = function(modal){
        var array =[];
        var data = {};

        switch ($scope.modelBrolix)
            {
                case 'totalUser': 
                    for (var i = 0; i < $scope.totalUser.length; i++) {
                        array.push($scope.totalUser[i]._id)
                    }
                    data = {
                        Brolix:$scope.sendBrolix.brolix,
                        Id:array
                    }
                    userService.sendBrolixAndCashAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Brolix Send successfully to All User");
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
                        Brolix:$scope.sendBrolix.brolix,
                        Id:array
                    }
                    userService.sendBrolixAndCashAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Brolix Send successfully all Personal User");
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
                        Brolix:$scope.sendBrolix.brolix,
                        Id:array
                    }
                    userService.sendBrolixAndCashAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Brolix Send successfully to all Business User");
                            $("#sendbrolixModelAllUser").modal('hide');
                            $scope.sendBrolix = '';
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'LiveUser': 
                    for (var i = 0; i < $scope.LiveUser.length; i++) {
                        array.push($scope.LiveUser[i]._id)
                    }
                    data = {
                        Brolix:$scope.sendBrolix.brolix,
                        Id:array
                    }
                    userService.sendBrolixAndCashAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Brolix Send successfully to all Live User");
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
                        Brolix:$scope.sendBrolix.brolix,
                        Id:array
                    }
                    userService.sendBrolixAndCashAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Brolix Send successfully to all Winners User");
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
                        Brolix:$scope.sendBrolix.brolix,
                        Id:array
                    }
                    userService.sendBrolixAndCashAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Brolix Send successfully to all CashWinners User");
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
                        Brolix:$scope.sendBrolix.brolix,
                        Id:array
                    }
                    userService.sendBrolixAndCashAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Brolix Send successfully to all CouponWinners User");
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
                        Brolix:$scope.sendBrolix.brolix,
                        Id:array
                    }
                    userService.sendBrolixAndCashAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Brolix Send successfully to all Blocked User");
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
                        Brolix:$scope.sendBrolix.brolix,
                        Id:array
                    }
                    userService.sendBrolixAndCashAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Brolix Send successfully to User");
                            $("#sendbrolixModelAllUser").modal('hide');
                            $scope.sendBrolix = '';
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
            }
    }


    /*Open Modal To send cash to Multiple User*/

    $scope.total_user_cash = function (modal) {

        $scope.modalId = modal;
        $scope.modelCash = modal;
        if($scope.modalId == '' || $scope.modalId == undefined || $scope.modalId == null){
        toastr.error("Please select user.")
        $state.go('header.manageUsers')
        }else {
            $("#sendcashModelAllUser").modal('show');
        } 
    }


     /*Send Brolix and close all modal*/

    $scope.send_cashall = function(modal){
         
        var array =[];
        var data = {};
        switch ($scope.modelCash)
            {
                case 'totalUser': 
                    for (var i = 0; i < $scope.totalUser.length; i++) {
                        array.push($scope.totalUser[i]._id)
                    }
                    data = {
                        Cash:$scope.sendCash.Cash,
                        Id:array
                    }
                    userService.sendBrolixAndCashAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Cash Send successfully to All User");
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
                        Cash:$scope.sendCash.Cash,
                        Id:array
                    }
                    userService.sendBrolixAndCashAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Cash Send successfully to All Personal User");
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
                        Cash:$scope.sendCash.Cash,
                        Id:array
                    }
                    userService.sendBrolixAndCashAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Cash Send successfully to All Business User");
                            $scope.sendCash = '';
                            $("#sendcashModelAllUser").modal('hide'); 
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'LiveUser': 
                    for (var i = 0; i < $scope.LiveUser.length; i++) {
                        array.push($scope.LiveUser[i]._id)
                    }
                    data = {
                        Cash:$scope.sendCash.Cash,
                        Id:array
                    }
                    userService.sendBrolixAndCashAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Cash Send successfully to All Live User");
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
                        Cash:$scope.sendCash.Cash,
                        Id:array
                    }
                    userService.sendBrolixAndCashAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Cash Send successfully to All Winners User");
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
                        Cash:$scope.sendCash.Cash,
                        Id:array
                    }
                    userService.sendBrolixAndCashAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Cash Send successfully to All CashWinners User");
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
                        Cash:$scope.sendCash.Cash,
                        Id:array
                    }
                    userService.sendBrolixAndCashAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Cash Send successfully to All CouponWinners User");
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
                        Cash:$scope.sendCash.Cash,
                        Id:array
                    }
                    userService.sendBrolixAndCashAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Cash Send successfully to All Blocked User");
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
                        Cash:$scope.sendCash.Cash,
                        Id:array
                    }
                    userService.sendBrolixAndCashAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Cash Send successfully to User");
                            $scope.sendCash = '';
                            $("#sendcashModelAllUser").modal('hide');
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
            }
        
    }

    $scope.Block_User = function (id) {
        $scope.BlockId = id;
        var userId = $scope.BlockId;
        console.log("Blockid",userId);
        if ($scope.BlockId == '' || $scope.BlockId == undefined || $scope.BlockId == null) {
        toastr.error("Please select user.")
        $state.go('header.manageUsers')
        }else {
        BootstrapDialog.show({
            title: 'Block User',
            message: 'Are you sure want to block this User',
            buttons: [{
                label: 'Yes',
                action: function(dialog) {
                    userService.BlockUser(userId).success(function(res) {        
                        if (res.responseCode == 200){
                            dialog.close();
                            toastr.success("User Blocked");
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })    
                }
            }, {
                label: 'No',
                action: function(dialog) {
                    dialog.close();
                    // toastr.success("User Blocked");
                }
            }]
        });
    }
    }


    $scope.view_coupons = function (id) {
        $scope.couponId = id;
        $("#ViewCoupon").modal('show');
    }


$scope.total_user_card = function (modal) {
        console.log("model",modal);
        $scope.modalId = modal;
        $scope.modelData = modal;
        if($scope.modalId == '' || $scope.modalId == undefined || $scope.modalId == null){
        toastr.error("Please select user.")
        $state.go('header.manageUsers')
        }else {
            $("#showAllCard").modal('show');
        }
    }

$scope.sendCard = function(cardId){
         var array =[];
         var data = {};
         $scope.cardId = cardId;
         switch ($scope.modelData)
            {
                case 'totalUser': 
                    for (var i = 0; i < $scope.totalUser.length; i++) {
                        array.push($scope.totalUser[i]._id)
                    }
                    data = {
                        cardId:$scope.cardId,
                        Id:array
                    }
                    console.log("dataIn",data)
                    // userService.sendMassageAllUser(data).success(function(res) {        
                    //     if (res.responseCode == 200){
                    //         toastr.success("Message Send Successfully to All User");
                    //         $scope.sendMessage = '';
                    //         $("#sendMessageModelAllUser").modal('hide'); 
                    //     } else {
                    //         toastr.error(res.responseMessage);
                    //     }
                    // })
                break;

                case 'PersonalUser': 
                    for (var i = 0; i < $scope.personalUser.length; i++) {
                        array.push($scope.personalUser[i]._id)
                    }
                    data = {
                        cardId:$scope.cardId,
                        Id:array
                    }
                    console.log("dataIn",data)
                    // userService.sendMassageAllUser(data).success(function(res) {        
                    //     if (res.responseCode == 200){
                    //         toastr.success("Message Send Successfully to All Personal User");
                    //         $scope.sendMessage = '';
                    //         $("#sendMessageModelAllUser").modal('hide'); 
                    //     } else {
                    //         toastr.error(res.responseMessage);
                    //     }
                    // })
                break;

                case 'BusinessUser': 
                    for (var i = 0; i < $scope.businessUser.length; i++) {
                        array.push($scope.businessUser[i]._id)
                    }
                    data = {
                        cardId:$scope.cardId,
                        Id:array
                    }
                    console.log("dataIn",data)
                    // userService.sendMassageAllUser(data).success(function(res) {        
                    //     if (res.responseCode == 200){
                    //         toastr.success("Message Send Successfully to All Business User");
                    //         $scope.sendMessage = '';
                    //         $("#sendMessageModelAllUser").modal('hide'); 
                    //     } else {
                    //         toastr.error(res.responseMessage);
                    //     }
                    // })
                break;

                case 'LiveUser': 
                    for (var i = 0; i < $scope.LiveUser.length; i++) {
                        array.push($scope.LiveUser[i]._id)
                    }
                    data = {
                        cardId:$scope.cardId,
                        Id:array
                    }
                    console.log("dataIn",data)
                    // userService.sendMassageAllUser(data).success(function(res) {        
                    //     if (res.responseCode == 200){
                    //         toastr.success("Message Send Successfully to All Live User");
                    //         $scope.sendMessage = '';
                    //         $("#sendMessageModelAllUser").modal('hide'); 
                    //     } else {
                    //         toastr.error(res.responseMessage);
                    //     }
                    // })
                break;

                case 'WinnersUser': 
                    for (var i = 0; i < $scope.totalWinners.length; i++) {
                        array.push($scope.totalWinners[i]._id)
                    }
                    data = {
                        cardId:$scope.cardId,
                        Id:array
                    }
                    console.log("dataIn",data)
                    // userService.sendMassageAllUser(data).success(function(res) {        
                    //     if (res.responseCode == 200){
                    //         toastr.success("Message Send Successfully to All Winners User");
                    //         $scope.sendMessage = '';
                    //         $("#sendMessageModelAllUser").modal('hide'); 
                    //     } else {
                    //         toastr.error(res.responseMessage);
                    //     }
                    // })
                break;

                case 'CashWinnersUser': 
                    for (var i = 0; i < $scope.cashWinners.length; i++) {
                        array.push($scope.cashWinners[i]._id)
                    }
                    data = {
                        cardId:$scope.cardId,
                        Id:array
                    }
                    console.log("dataIn",data)
                    // userService.sendMassageAllUser(data).success(function(res) {        
                    //     if (res.responseCode == 200){
                    //         toastr.success("Message Send Successfully to All CashWinners User");
                    //         $scope.sendMessage = '';
                    //         $("#sendMessageModelAllUser").modal('hide'); 
                    //     } else {
                    //         toastr.error(res.responseMessage);
                    //     }
                    // })
                break;

                case 'CouponWinnersUser': 
                    for (var i = 0; i < $scope.couponWinners.length; i++) {
                        array.push($scope.couponWinners[i]._id)
                    }
                    data = {
                        cardId:$scope.cardId,
                        Id:array
                    }
                    console.log("dataIn",data)
                    // userService.sendMassageAllUser(data).success(function(res) {        
                    //     if (res.responseCode == 200){
                    //         toastr.success("Message Send Successfully to All CouponWinners User");
                    //         $scope.sendMessage = '';
                    //         $("#sendMessageModelAllUser").modal('hide'); 
                    //     } else {
                    //         toastr.error(res.responseMessage);
                    //     }
                    // })
                break;

                case 'BlockedUser': 
                    for (var i = 0; i < $scope.allblockUser.length; i++) {
                        array.push($scope.allblockUser[i]._id)
                    }
                    data = {
                        cardId:$scope.cardId,
                        Id:array
                    }
                    console.log("dataIn",data)
                    // userService.sendMassageAllUser(data).success(function(res) {        
                    //     if (res.responseCode == 200){
                    //         toastr.success("Message Send Successfully to All Blocked User");
                    //         $scope.sendMessage = '';
                    //         $("#sendMessageModelAllUser").modal('hide'); 
                    //     } else {
                    //         toastr.error(res.responseMessage);
                    //     }
                    // })
                break;

                default: 
                array.push($scope.modalId)
                    data = {
                        cardId:$scope.cardId,
                        Id:array
                    }
                    console.log("dataIn",data)
                    // userService.sendMassageAllUser(data).success(function(res) {        
                    //     if (res.responseCode == 200){
                    //         toastr.success("Message Send Successfully to User");
                    //         $scope.sendMessage = '';
                    //         $("#sendMessageModelAllUser").modal('hide'); 
                    //     } else {
                    //         toastr.error(res.responseMessage);
                    //     }
                    // })
            }

    }

    /*----------DashBoardFilter----------*/


$scope.dashBordFilter = function(){

    var type = localStorage.getItem('userTypeName');
    $scope.dobTo =$scope.dashBordFilter.dobTo==undefined?undefined : new Date().getTime($scope.dashBordFilter.dobTo);
    $scope.dobFrom =$scope.dashBordFilter.dobFrom==undefined?undefined : new Date().getTime($scope.dashBordFilter.dobFrom);
    $scope.country =$scope.dashBordFilter.country==undefined?undefined : $scope.dashBordFilter.country.name;
    console.log("date",$scope.dashBordFilter.country);
    var data = {};
        data = {
            userType:localStorage.getItem('userTypeName'),
            country:$scope.country,
            state:$scope.dashBordFilter.state,
            city:$scope.dashBordFilter.cities,
            gender:$scope.dashBordFilter.gender,
            ageTo:$scope.dashBordFilter.ageTo,
            ageFrom:$scope.dashBordFilter.ageFrom,
            joinTo:$scope.dobTo,
            joinFrom:$scope.dobFrom,
        }
        console.log("datatata",data)

    switch (type)
            {
                case 'totalUsers':
                console.log("1"); 
                    userService.userfilter(data).success(function(res){
                        $scope.totalUser = res.data;
                        console.log("ressssssss1",JSON.stringify($scope.totalUser));
                    })
                    
                break;

                case 'personalUsers': 
                console.log("2");
                    userService.userfilter(data).success(function(res){
                        $scope.personalUser = res.data;
                        console.log("ressssssss2",JSON.stringify($scope.personalUser));
                    })
                    
                break;

                case 'businessUsers': 
                console.log("3");
                    userService.userfilter(data).success(function(res){
                        $scope.businessUser = res.data;
                        console.log("ressssssss3",JSON.stringify($scope.businessUser));
                    })
                    
                break;

                case 'liveUsers': 
                console.log("4");
                    userService.userfilter(data).success(function(res){
                        $scope.liveUser = res.data;
                        console.log("ressssssss4",JSON.stringify($scope.liveUser));
                    })
                    
                break;

                case 'totalWinners': 
                console.log("5");
                    userService.userfilter(data).success(function(res){
                        $scope.totalWinners = res.data;
                        console.log("ressssssss5",JSON.stringify($scope.totalWinners));
                    })
                    
                break;

                case 'cashWinners':
                console.log("6"); 
                    userService.userfilter(data).success(function(res){
                        $scope.cashWinners = res.data;
                        console.log("ressssssss6",JSON.stringify($scope.cashWinners));
                    })
                    
                break;

                case 'couponWinners': 
                console.log("7");
                    userService.userfilter(data).success(function(res){
                        $scope.couponWinners = res.data;
                        console.log("ressssssss7",JSON.stringify($scope.couponWinners));
                    })
                    
                break;

                case 'blockedUsers': 
                console.log("8");
                    userService.userfilter(data).success(function(res){
                        $scope.blockedUsers = res.data;
                        console.log("ressssssss8",JSON.stringify($scope.blockedUsers));
                    })
                    
                break;
                
                default: 
                toastr.error("somthing wents to wroung");
            }

    }






})




