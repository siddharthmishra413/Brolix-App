app.controller('editOffersCtrl', function($scope, $state, $window, userService, $state, toastr, $stateParams, $http ){
    $(window).scrollTop(0, 0);
    $scope.$emit('headerStatus', 'Manage Cards');
    $scope.$emit('SideMenu', 'Manage Cards');
    $scope.myForm = {};
    $scope.first = true;
    $scope.second = false;
    $scope.third = false;
    var offerTime;
    var offerCreateTime;

    $scope.type = $stateParams.type;
    $scope.idDetails = $stateParams.id;

        if ($scope.type == '' || $scope.type == undefined || $scope.type == null) {
            toastr.error("Please select user.")
            $state.go('header.manageCards')
        }else{
          console.log("1")
            var cardOfferType = JSON.parse($scope.idDetails);
            $scope.cardType = localStorage.getItem('cardType')
            $scope.offerData = {};
                if($scope.type == 'discount'){
                    $scope.offerData = {
                    cardType:$scope.cardType,
                    buyCard:cardOfferType.buyCard,
                    offerType:$scope.type,
                }
            }else if($scope.type == 'buyGet'){
              console.log("2")
                $scope.offerData = {
                    cardType:$scope.cardType,
                    buyCard:cardOfferType.buyCard,
                    freeCard:cardOfferType.freeCard,
                    offerType:$scope.type,
                }
            }
            userService.getOfferList($scope.offerData).success(function(res) {
                if (res.responseCode == 200) {
                  $scope.myForm = res.result[0];
                  $scope.previousBuyCard = res.result[0].offer.buyCard;
                  $scope.previousFreeCard = res.result[0].offer.freeCard;
                  offerTime = new Date(res.result[0].offer.offerTime).getTime();
                  console.log("offerTime",offerTime)

                  offerCreateTime = new Date(res.result[0].offer.createdAt).getTime();
                  console.log("offerCreateTime",offerCreateTime)
                  var hoursMiliSecond = offerTime - offerCreateTime;
                  $scope.myForm.offerTimes = parseInt(hoursMiliSecond*2.77778e-7)
                } else if (res.responseCode == 404) {
                    toastr.error(res.responseMessage);
                }
            })
        }

        $scope.updateoffer = function(){
            var date = new Date().getTime();
            date = date + $scope.myForm.offerTimes*60*60*1000;

            if($scope.type == 'discount'){
                $scope.offerDataUpdated = {
                buyCard:$scope.previousBuyCard,
                offerType:$scope.myForm.offer.offerType,
                offerTime:date,
                type:$scope.myForm.type,
                updatebuyCard:$scope.myForm.offer.buyCard,
            }
                console.log("$scope.offerData Discount",$scope.offerDataUpdated)
            }else if($scope.type == 'buyGet'){
                $scope.offerDataUpdated = {
                buyCard:$scope.previousBuyCard,
                offerType:$scope.myForm.offer.offerType,
                offerTime:date,
                type:$scope.myForm.type,
                updatebuyCard:$scope.myForm.offer.buyCard,
                updatefreeCard:$scope.myForm.offer.freeCard,
                freeCard:$scope.previousFreeCard,
                }
            }
            console.log("$scope.offerData Discount",$scope.offerDataUpdated)
            userService.editOfferonCards($scope.offerDataUpdated).success(function(res) {
                if (res.responseCode == 200) {
                  toastr.success(res.responseMessage);
                  $state.go('header.manageCards')
                } else if (res.responseCode == 404) {
                    toastr.error(res.responseMessage);
                }
            })
            console.log("$scope.offerData Discount",$scope.offerDataUpdated)
        }

    $scope.cancle = function(){
        $state.go('header.manageCards');
    }

   
})




 