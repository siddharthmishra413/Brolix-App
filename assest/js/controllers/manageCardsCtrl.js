app.controller('manageCardsCtrl', function($scope, $window, userService, $state, toastr) {
    $(window).scrollTop(0, 0);
    $scope.class = true;
    $scope.$emit('headerStatus', 'Manage Cards');
    $scope.$emit('SideMenu', 'Manage Cards');
    $scope.myForm = {};
    var upgrade_card = {};
    var luck_card = {};


    upgrade_card = {
            cardType:'upgrade_card'
        }

    luck_card = {
        cardType:'luck_card'
    }


    userService.showOfferOnCards(upgrade_card).success(function(res){
        if(res.responseCode == 200){
            var resultUpgradeCardDiscount = res.data.filter(function( obj ) {
              return obj.offer.offerType == 'discount';
            });
            $scope.resultUpgradeCardDiscount = resultUpgradeCardDiscount;            
            var resultUpgradeCardBuyGet = res.data.filter(function( obj ) {
              return obj.offer.offerType == 'buyGet';
            });
            $scope.resultUpgradeCardBuyGet=resultUpgradeCardBuyGet;
        }
        else{
            toastr.error(res.responseMessage);
        }

    })

    userService.showOfferOnCards(luck_card).success(function(res){
        if(res.responseCode == 200){
            var resultLuckCardDiscount = res.data.filter(function( obj ) {
              return obj.offer.offerType == 'discount';
            });
            $scope.resultLuckCardDiscount = resultLuckCardDiscount;            
            var resultLuckCardBuyGet = res.data.filter(function( obj ) {
              return obj.offer.offerType == 'buyGet';
            });
            $scope.resultLuckCardBuyGet=resultLuckCardBuyGet;
        }
        else{
            toastr.error(res.responseMessage);
        }

    })
   
    
    //*******************Total Winners****************
    // userService.totalWinners().success(function(res) {
    //     $scope.totalWinners = res.result;
    // })
    // $scope.showOffer = function(type){
    //     var data = {};
    //     data = {
    //         cardType:type
    //     }
    //     console.log("datatatatat",data)
    //     userService.showOfferOnCards(data).success(function(res){
    //     if(res.responseCode == 200){
    //         $scope.totalOffer = res.data;
    //         if(type=="upgrade_card"){
    //          $scope.table1 = true;
    //          $scope.table2 = false; 
    //         }else{
    //           $scope.table2 = true;
    //           $scope.table1 = false;  
    //         }
    //     }
    //     else{
    //         toastr.error(res.responseMessage);
    //     }

    // })

    // }
   
    //*******************Total Sold UpgradeCard****************
    userService.totalSoldUpgradeCard().success(function(res) {
        if (res.responseCode == 200){
            $scope.totalSoldUpgradeCard = res.result;
            //console.log("totalSoldUpgradeCardtotalSoldUpgradeCard",JSON.stringify($scope.totalSoldUpgradeCard));
        } else {
            toastr.error(res.responseMessage);
        }
        
    })
   
   userService.totalIncomeInCashFromUpgradeCard().success(function(res) {
        if (res.responseCode == 200){
            $scope.totalIncomeInCashFromUpgradeCard = res.result;
            $scope.totalIncomeFromUpgradeCard = res.totalIncome;
            $scope.totalcount = res.count;
           //console.log("totalIncomeInCashFromUpgradeCard",JSON.stringify($scope.totalIncomeInCashFromUpgradeCard));
           //console.log("totalIncome",JSON.stringify($scope.totalIncomeInCashFromUpgradeCard));
           //console.log("totalIncomeInCashFromUpgradeCard",JSON.stringify($scope.totalIncomeInCashFromUpgradeCard));
        } else {
            toastr.error(res.responseMessage);
        }
        
    })

   userService.usedUpgradeCard().success(function(res) {
        if (res.responseCode == 200){
            $scope.usedUpgradeCard = res.result;
            // $scope.totalIncome = res.totalIncome;
            $scope.usedUpgradeCardcount = res.count;
           //console.log("usedUpgradeCard",JSON.stringify($scope.usedUpgradeCard));
        } else {
            toastr.error(res.responseMessage);
        }
        
    })

    userService.unUsedUpgradeCard().success(function(res) {
        if (res.responseCode == 200){
            $scope.unUsedUpgradeCard = res.result;
            // $scope.totalIncome = res.totalIncome;
             $scope.unUsedUpgradeCardcount = res.count;
           //console.log("unUsedUpgradeCard",JSON.stringify($scope.unUsedUpgradeCard));
        } else {
            toastr.error(res.responseMessage);
        }
        
    })

    //*******************Total Sold LuckCard****************

    userService.totalSoldLuckCard().success(function(res) {
        if (res.responseCode == 200){
            $scope.totalSoldLuckCard = res.result;
            // $scope.totalIncome = res.totalIncome;
             $scope.totalSoldLuckCardcount = res.count;
           //console.log("totalIncomeInCashFromUpgradeCard",JSON.stringify($scope.totalSoldLuckCardcount));
        } else {
            toastr.error(res.responseMessage);
        }
        
    })

    userService.totalIncomeInBrolixFromLuckCard().success(function(res) {
        if (res.responseCode == 200){
            $scope.totalIncomeInBrolixFromLuckCard = res.result;
             $scope.totalIncomeLuck = res.totalIncome;
             $scope.totalIncomeInBrolixFromLuckCardcount = res.count;

        } else {
            toastr.error(res.responseMessage);
        }
        
    })

    userService.usedLuckCard().success(function(res) {
        if (res.responseCode == 200){
            $scope.usedLuckCard = res.result;
            $scope.usedLuckCardcount = res.count;
           //console.log("totalIncomeInCashFromUpgradeCard",JSON.stringify($scope.totalIncome));
        } else {
            toastr.error(res.responseMessage);
        }
        
    })

    userService.unUsedLuckCard().success(function(res) {
        if (res.responseCode == 200){
            $scope.unUsedLuckCard = res.result;
            $scope.unUsedLuckCardcount = res.count;
           //console.log("totalIncomeInCashFromUpgradeCard",JSON.stringify($scope.totalIncome));
        } else {
            toastr.error(res.responseMessage);
        }
        
    })
})
