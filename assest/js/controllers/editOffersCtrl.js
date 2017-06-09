app.controller('editOffersCtrl', function($scope, $state, $window, userService, $state, toastr, $stateParams, $http) {
    $(window).scrollTop(0, 0);
    $scope.$emit('headerStatus', 'Manage Cards');
    $scope.$emit('SideMenu', 'Manage Cards');
    $scope.myForm = {};
    $scope.first = true;
    $scope.second = false;
    $scope.third = false;
    $scope.active_upgrade_card = true;
    var offerTime;
    var offerCreateTime;

    $scope.showAdsDetails = function(cardId, offerId) {
        $scope.user.photo = '';
        $scope.dataOfferDetail = {
            cardId: cardId,
            offerId: offerId
        }
        userService.showOneOfferDetail($scope.dataOfferDetail).success(function(res) {
            if (res.responseCode == 200) {
                $scope.cardDetails = res.result[0];
                offerTime = new Date(res.result[0].offer.offerTime).getTime();
                offerCreateTime = new Date(res.result[0].offer.createdAt).getTime();
                var hoursMiliSecond = offerTime - offerCreateTime;
                $scope.cardDetails.offerTimes = parseInt(hoursMiliSecond * 2.77778e-7)

            } else if (res.responseCode == 404) {
                toastr.error(res.responseMessage);
            }
        })

    }

    $scope.type = $stateParams.type;
    $scope.idDetails = $stateParams.id;

    if ($scope.idDetails == '' || $scope.idDetails == undefined || $scope.idDetails == null) {
        toastr.error("Please select user.")
        $state.go('header.manageCards')
    } else {
        var cardOfferType = JSON.parse($scope.idDetails);
        $scope.cardType = localStorage.getItem('cardType')
        $scope.offerData = {};
        if ($scope.type == 'discount') {
            $scope.offerData = {
                cardType: $scope.cardType,
                buyCard: cardOfferType.buyCard,
                offerType: $scope.type,
            }
        } else if ($scope.type == 'buyGet') {
            $scope.offerData = {
                cardType: $scope.cardType,
                buyCard: cardOfferType.buyCard,
                freeCard: cardOfferType.freeCard,
                offerType: $scope.type,
            }
        }

        userService.getOfferList($scope.offerData).success(function(res) {
            if (res.responseCode == 200) {
                $scope.allCard = res.result;
                $scope.myForm = res.result[0];
                $scope.previousBuyCard = res.result[0].offer.buyCard;
                $scope.previousFreeCard = res.result[0].offer.freeCard;
                offerTime = new Date(res.result[0].offer.offerTime).getTime();
                offerCreateTime = new Date(res.result[0].offer.createdAt).getTime();
                var hoursMiliSecond = offerTime - offerCreateTime;
                $scope.myForm.offerTimes = parseInt(hoursMiliSecond * 2.77778e-7)
            } else if (res.responseCode == 404) {
                toastr.error(res.responseMessage);
            }
        })
    }

    $scope.updateoffer = function() {
        var date = new Date().getTime();
        var modifyDate = date + $scope.cardDetails.offerTimes * 60 * 60 * 1000;
        if ($scope.cardDetails.offer.offerType == 'discount') {
            $scope.offerDataUpdated = {
                cardId: $scope.cardDetails._id,
                offerId: $scope.cardDetails.offer._id,
                offerType: $scope.cardDetails.offer.offerType,
                buyCard: $scope.cardDetails.offer.buyCard,
                offerTime: modifyDate,
                createdAt: date,
            }
            console.log("$scope.offerData Discount", $scope.offerDataUpdated)
        } else if ($scope.cardDetails.offer.offerType == 'buyGet') {
            $scope.offerDataUpdated = {
                cardId: $scope.cardDetails._id,
                offerId: $scope.cardDetails.offer._id,
                offerType: $scope.cardDetails.offer.offerType,
                buyCard: $scope.cardDetails.offer.buyCard,
                freeCard: $scope.cardDetails.offer.freeCard,
                offerTime: modifyDate,
                createdAt: date,
            }
        }
        console.log("$scope.offerData Discount", $scope.offerDataUpdated)
        userService.editOfferonCards($scope.offerDataUpdated).success(function(res) {
            if (res.responseCode == 200) {
                toastr.success(res.responseMessage);
                $state.go('header.manageCards')
            } else if (res.responseCode == 404) {
                toastr.error(res.responseMessage);
            }
        })
        console.log("$scope.offerData Discount", $scope.offerDataUpdated)
    }

    $scope.cancle = function() {
        $state.go('header.manageCards');
    }
})