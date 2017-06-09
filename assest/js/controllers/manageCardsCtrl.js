app.controller('manageCardsCtrl', function($scope, $window, userService, $state, toastr, $timeout) {
    $(window).scrollTop(0, 0);
    $scope.class = true;
    $scope.$emit('headerStatus', 'Manage Cards');
    $scope.$emit('SideMenu', 'Manage Cards');
    $scope.tab = 'SoldUpgradeCard';
    $scope.myForm = {};
    var upgrade_card = {};
    var luck_card = {};
    $scope.cardDetailsOnOffer = {};
    $scope.dashBordFilter = {};
    localStorage.setItem('cardTypeName', 'totalSoldCards');

    $scope.removeOffers = function(id, key, type) {
        if (id == '' || id == undefined || id == null) {
            toastr.error("Please select user.")
            $state.go('header.manageCards')
        } else {

            var cardOfferType = JSON.parse(id);
            $scope.cardType = key
            $scope.offerData = {};
            if ($scope.cardType == 'discount') {
                $scope.offerData = {
                    cardType: type,
                    buyCard: cardOfferType.buyCard,
                    offerType: $scope.cardType,
                }
            } else if ($scope.cardType == 'buyGet') {
                $scope.offerData = {
                    cardType: type,
                    buyCard: cardOfferType.buyCard,
                    freeCard: cardOfferType.freeCard,
                    offerType: $scope.cardType,
                }
            }
            userService.getOfferList($scope.offerData).success(function(res) {
                if (res.responseCode == 200) {
                    for (let i = 0; i < res.result.length; i++) {
                        let offerTime = new Date(res.result[i].offer.offerTime).getTime();
                        let offerCreateTime = new Date(res.result[i].offer.createdAt).getTime();
                        let hoursMiliSecond = offerTime - offerCreateTime;
                        let offerthour = parseInt(hoursMiliSecond * 2.77778e-7)
                        res.result[i].offer.offerTime = offerthour;
                    }
                    if (res.result[0].type == 'upgrade_card') {
                        $scope.upgradecardOnOffersRemove = res.result;
                        if (res.result[0].offer.offerType == 'discount') {
                            $("#upgradeOfferOnCarddRemoveDis").modal('show');
                        } else if (res.result[0].offer.offerType == 'buyGet') {
                            $("#upgradeOfferOnCarddRemoveBuy").modal('show');
                        }

                    } else if (res.result[0].type == 'luck_card') {
                        $scope.luckOfferOnCarddRemove = res.result;
                        if (res.result[0].offer.offerType == 'discount') {
                            $("#luckOfferOnCarddRemoveDis").modal('show');
                        } else if (res.result[0].offer.offerType == 'buyGet') {
                            $("#luckOfferOnCarddRemoveBuy").modal('show');
                        }
                    }
                }
            })
        }
    }

    $scope.removeOffer = function(cardId, offerId) {
        if (cardId == null || cardId == undefined || cardId == "") {
            toastr.error("Something wrong");
        } else {
            let obj = {
                cardId: cardId,
                offerId: offerId
            }
            $("#upgradeOfferOnCarddRemoveDis").modal('hide');
            $("#upgradeOfferOnCarddRemoveBuy").modal('hide');
            $("#luckOfferOnCarddRemoveDis").modal('hide');
            $("#luckOfferOnCarddRemoveBuy").modal('hide');
            BootstrapDialog.show({
                title: 'Remove Offer',
                message: 'Are you sure want to Remove this offer',
                buttons: [{
                    label: 'Yes',
                    action: function(dialog) {
                        userService.removeOfferonCards(obj).success(function(res) {
                            if (res.responseCode == 200) {
                                dialog.close();
                                toastr.success(res.responseMessage);
                                $state.reload();

                            } else if (res.responseCode == 404) {
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

    $scope.dateValidation = function(dtaa) {
        var dta = dtaa;
        var timestamp = new Date(dtaa).getTime();
        var nextday = timestamp + 8.64e+7;
        $scope.minDatee = new Date(nextday).toDateString();
    }

    userService.upgradeCardViewersList().success(function(res) {
        if (res.responseCode == 200) {
            $scope.dashBordFilterViewer = res.result;
        } else {
            toastr.error(res.responseMessage);
        }
    })

    userService.luckCardViewersList().success(function(res) {
        if (res.responseCode == 200) {
            $scope.dashBordFilterChances = res.result;
        } else {
            toastr.error(res.responseMessage);
        }
    })

    userService.totalSoldUpgradeCard().success(function(res) {
        if (res.responseCode == 200) {
            $scope.totalSoldUpgradeCard = res.result;
            $scope.totalSoldUpgradeCardCount = res.count;
        } else {
            $scope.totalSoldUpgradeCardCount = 0;
        }
    })

    userService.totalIncomeInCashFromUpgradeCard().success(function(res) {
        if (res.responseCode == 200) {
            $scope.totalIncomeInCashFromUpgradeCard = res.result;
            $scope.totalIncomeFromUpgradeCard = res.totalIncome;

        } else if (res.responseCode == 400) {
            $scope.totalIncomeFromUpgradeCard = 0;
        } else {
            toastr.error(res.responseMessage);
        }
    })

    userService.usedUpgradeCard().success(function(res) {
        if (res.responseCode == 200) {
            $scope.usedUpgradeCard = res.result;
            $scope.usedUpgradeCardcount = res.total;
        } else {
            $scope.usedUpgradeCardcount = 0;
        }
    })

    userService.unUsedUpgradeCard().success(function(res) {
        if (res.responseCode == 200) {
            $scope.unUsedUpgradeCard = res.result;
            $scope.unUsedUpgradeCardcount = res.total;
        } else {
            $scope.unUsedUpgradeCardcount = 0;
        }
    })

    userService.totalSoldLuckCard().success(function(res) {

        if (res.responseCode == 200) {
            $scope.totalSoldLuckCard = res.result;
            $scope.totalSoldLuckCardcount = res.count;
        } else {
            $scope.totalSoldLuckCardcount = 0;
        }
    })

    userService.totalIncomeInBrolixFromLuckCard().success(function(res) {
        if (res.responseCode == 200) {
            $scope.totalIncomeInBrolixFromLuckCard = res.result;
            $scope.totalIncomeLuck = res.totalIncome;
        } else {
            $scope.totalIncomeLuck = 0;
        }
    })
    userService.usedLuckCard().success(function(res) {
        if (res.responseCode == 200) {
            $scope.usedLuckCard = res.result;
            $scope.usedLuckCardcount = res.total;
        } else {
            $scope.usedLuckCardcount = 0;
        }
    })
    userService.unUsedLuckCard().success(function(res) {
        if (res.responseCode == 200) {
            $scope.unUsedLuckCard = res.result;
            $scope.unUsedLuckCardcount = res.total;
        } else {
            $scope.unUsedLuckCardcount = 0;
        }
    })

    $scope.key = "Discount";

    userService.countryListData().success(function(res) {
        $scope.countriesList = res.result;
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

    upgrade_card = {
        cardType: 'upgrade_card'
    }
    userService.showOfferCountOnCards(upgrade_card).success(function(res) {
        if (res.responseCode == 200) {
            $scope.upgradeCardOffersCount = res.result;
        } else {
            $scope.upgradeCardOffersCount = 0;
        }
    })

    luck_card = {
        cardType: 'luck_card'
    }
    userService.showOfferCountOnCards(luck_card).success(function(res) {
        if (res.responseCode == 200) {
            $scope.luckCardOffersCount = res.result;
        } else {
            $scope.luckCardOffersCount = 0;
        }
    })


    $scope.cardOnOfferUpgradeDis = function(id, type) {
        cardDetailsOnOffer = {
            cardType: "upgrade_card",
            offerType: type,
            buyCard: id
        }
        userService.getOfferList(cardDetailsOnOffer).success(function(res) {
            if (res.responseCode == 200) {
                console.log("lllllllllll", JSON.stringify(res))
                $scope.upgradecardOnOffers = res.result;
                $("#upgradeOfferOnCardd").modal('show');
            } else {}
        })
    }

    $scope.cardOnOfferUpgradeBuy = function(buyCard, freeCard, type) {
        cardDetailsOnOffer = {
            cardType: "upgrade_card",
            offerType: type,
            buyCard: buyCard,
            freeCard: freeCard
        }
        userService.getOfferList(cardDetailsOnOffer).success(function(res) {
            if (res.responseCode == 200) {
                $scope.upgradecardOnOffers = res.result;
                $("#upgradeOfferOnCardd").modal('show');
            } else {}
        })

    }


    $scope.cardOnOfferLuckDis = function(id, type) {
        cardDetailsOnOffer = {
            cardType: "luck_card",
            offerType: type,
            buyCard: id
        }
        userService.getOfferList(cardDetailsOnOffer).success(function(res) {
            if (res.responseCode == 200) {
                $scope.luckCardOnOffers = res.result;
                $("#luckOfferOnCardd").modal('show');
            } else {
                toastr.error(res.responseMessage);
            }
        })
    }

    $scope.cardOnOfferLuckBuy = function(buyCard, freeCard, type) {
        cardDetailsOnOffer = {
            cardType: "luck_card",
            offerType: type,
            buyCard: buyCard,
            freeCard: freeCard
        }
        userService.getOfferList(cardDetailsOnOffer).success(function(res) {
            if (res.responseCode == 200) {
                console.log("res", JSON.stringify(res))
                $scope.luckCardOnOffers = res.result;
                $("#luckOfferOnCardd").modal('show');
            } else {
                toastr.error(res.responseMessage);
            }
        })

    }


    $scope.showOfferUpgrade = function(key) {
        localStorage.setItem('cardType', 'upgrade_card');
        if (key == 'buyGet') {
            console.log("yes")
            upgrade_card = {
                cardType: 'upgrade_card',
                offerType: 'buyGet'
            }
            userService.showOfferOnCards(upgrade_card).success(function(res) {
                console.log("ressss", JSON.stringify(res))
                if (res.responseCode == 200) {
                    $scope.totalSoldUpgradeCardDiscountBuyGet = res.result;
                    $scope.totalSoldUpgradeCardCountDiscountBuyGet = res.total;
                } else {
                    $scope.totalSoldUpgradeCardCount = 0;
                }
            })
        } else {
            upgrade_card = {
                cardType: 'upgrade_card',
                offerType: 'discount'
            }
            userService.showOfferOnCards(upgrade_card).success(function(res) {
                console.log("ressss", JSON.stringify(res))
                if (res.responseCode == 200) {
                    $scope.totalSoldUpgradeCardDiscount = res.result;
                    $scope.totalSoldUpgradeCardCountDiscount = res.total;
                } else {
                    $scope.totalSoldUpgradeCardCount = 0;
                }
            })
        }
    }

    $scope.showOfferLuck = function(key) {
        localStorage.setItem('cardType', 'luck_card');
        $scope.key = "Discount";
        if (key == 'buyGet') {
            luck_card = {
                cardType: 'luck_card',
                offerType: 'buyGet'
            }
            userService.showOfferOnCards(luck_card).success(function(res) {
                if (res.responseCode == 200) {
                    $scope.totalSoldLuckCardDiscountBuyGet = res.result;
                    $scope.totalSoldLuckCardCountDiscountBuyGet = res.total;
                } else {
                    $scope.totalSoldUpgradeCardCount = 0;
                }
            })
        } else {
            luck_card = {
                cardType: 'luck_card',
                offerType: 'discount'
            }
            userService.showOfferOnCards(luck_card).success(function(res) {
                if (res.responseCode == 200) {
                    $scope.totalSoldLuckCardDiscount = res.result;
                    $scope.totalSoldLuckCardCountDiscount = res.total;
                } else {
                    $scope.totalSoldUpgradeCardCount = 0;
                }
            })
        }
    }

    // $scope.preOfferUpgradeDiscount = function(){
    //     $scope.currentPageNoUpdis--;
    //     $scope.showOfferUpgrade();

    // }

    // $scope.nextOfferUpgradeDiscount = function(){
    //     $scope.currentPageNoUpdis++;
    //     $scope.showOfferUpgrade();
    // }


    // $scope.preOfferUpgradeBuyGet = function(){
    //     $scope.currentPageNoUpbuy--;
    //     $scope.showOfferUpgrade('buyGet');

    // }

    // $scope.nextOfferUpgradeBuyGet = function(){
    //     $scope.currentPageNoUpbuy++;
    //     $scope.showOfferUpgrade('buyGet');
    // }

    // $scope.preOfferLuckCardDiscount = function(){
    //     $scope.currentPageNoLuckdis--;
    //     $scope.showOfferLuck();

    // }

    // $scope.nextOfferLuckCardDiscount = function(){
    //     $scope.currentPageNoLuckdis++;
    //     $scope.showOfferLuck();
    // }

    // $scope.preOfferLuckcardBuyGet = function(){
    //     $scope.currentPageNoLuckbuy--;
    //     $scope.showOfferLuck('buyGet');

    // }

    // $scope.nextOfferLuckcardBuyGet = function(){
    //     $scope.currentPageNoLuckbuy++;
    //     $scope.showOfferLuck('buyGet');
    // }




    $scope.getdata = function(data) {
        if (data == 'Discount') {
            localStorage.setItem('offerType', 'Discount');
        } else if (data == 'BuyAndGet') {
            localStorage.setItem('offerType', 'BuyAndGet');
        }

        console.log("data", data)
        $scope.key = data;
    }




    $scope.total_user_message = function(modal) {

        $scope.modalId = modal;
        $scope.sendMessage.massage = '';
        $("#sendMessageModelAllUser").modal('show');
    }

    /*Send Message and close all modal*/

    $scope.send_massage = function() {
        var array = [];
        var data = {};
        //console.log(" $scope.modalId", $scope.modalId)
        switch ($scope.modalId) {
            case 'SoldUpgradeCard':
                for (var i = 0; i < $scope.totalSoldUpgradeCard.length; i++) {
                    array.push($scope.totalSoldUpgradeCard[i]._id)
                }
                data = {
                    Message: $scope.sendMessage.massage,
                    Id: array
                }

                userService.sendMassageAllUser(data).success(function(res) {
                    if (res.responseCode == 200) {
                        toastr.success("Message Send Successfully to All User");
                        $scope.sendMessage = '';
                        $("#sendMessageModelAllUser").modal('hide');
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;

            case 'SoldULuckCard':
                for (var i = 0; i < $scope.totalSoldLuckCard.length; i++) {
                    array.push($scope.totalSoldLuckCard[i]._id)
                }
                data = {
                    Message: $scope.sendMessage.massage,
                    Id: array
                }
                userService.sendMassageAllUser(data).success(function(res) {
                    if (res.responseCode == 200) {
                        toastr.success("Message Send Successfully to All Winners User");
                        $scope.sendMessage = '';
                        $("#sendMessageModelAllUser").modal('hide');
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;

                // case 'totalincomeUpgrade': 
                //     for (var i = 0; i < $scope.totalSoldUpgradeCard.length; i++) {
                //         array.push($scope.totalSoldUpgradeCard[i]._id)
                //     }
                //     data = {
                //         Message:$scope.sendMessage.massage,
                //         Id:array
                //     }
                //     userService.sendMassageAllUser(data).success(function(res) {        
                //         if (res.responseCode == 200){
                //             toastr.success("Message Send Successfully to All Personal User");
                //             $scope.sendMessage = '';
                //             $("#sendMessageModelAllUser").modal('hide'); 
                //         } else {
                //             toastr.error(res.responseMessage);
                //         }
                //     })
                // break;

                // case 'usedUpgradeCard': 
                //     for (var i = 0; i < $scope.usedUpgradeCard.length; i++) {
                //         array.push($scope.usedUpgradeCard[i]._id)
                //     }
                //     data = {
                //         Message:$scope.sendMessage.massage,
                //         Id:array
                //     }
                //     userService.sendMassageAllUser(data).success(function(res) {        
                //         if (res.responseCode == 200){
                //             toastr.success("Message Send Successfully to All Business User");
                //             $scope.sendMessage = '';
                //             $("#sendMessageModelAllUser").modal('hide'); 
                //         } else {
                //             toastr.error(res.responseMessage);
                //         }
                //     })
                // break;

                // case 'unUsedUpgradeCard': 
                //     for (var i = 0; i < $scope.unUsedUpgradeCard.length; i++) {
                //         array.push($scope.unUsedUpgradeCard[i]._id)
                //     }
                //     data = {
                //         Message:$scope.sendMessage.massage,
                //         Id:array
                //     }
                //     userService.sendMassageAllUser(data).success(function(res) {        
                //         if (res.responseCode == 200){
                //             toastr.success("Message Send Successfully to All Live User");
                //             $scope.sendMessage = '';
                //             $("#sendMessageModelAllUser").modal('hide'); 
                //         } else {
                //             toastr.error(res.responseMessage);
                //         }
                //     })
                // break;

                // case 'totalincomeLuck': 
                //     for (var i = 0; i < $scope.totalSoldLuckCard.length; i++) {
                //         array.push($scope.totalSoldLuckCard[i]._id)
                //     }
                //     data = {
                //         Message:$scope.sendMessage.massage,
                //         Id:array
                //     }
                //     userService.sendMassageAllUser(data).success(function(res) {        
                //         if (res.responseCode == 200){
                //             toastr.success("Message Send Successfully to All CashWinners User");
                //             $scope.sendMessage = '';
                //             $("#sendMessageModelAllUser").modal('hide'); 
                //         } else {
                //             toastr.error(res.responseMessage);
                //         }
                //     })
                // break;

                // case 'usedLuckCard': 
                //     for (var i = 0; i < $scope.usedLuckCard.length; i++) {
                //         array.push($scope.usedLuckCard[i]._id)
                //     }
                //     data = {
                //         Message:$scope.sendMessage.massage,
                //         Id:array
                //     }
                //     console.log("90-----------------------",data)
                //     userService.sendMassageAllUser(data).success(function(res) {        
                //         if (res.responseCode == 200){
                //             toastr.success("Message Send Successfully to All CouponWinners User");
                //             $scope.sendMessage = '';
                //             $("#sendMessageModelAllUser").modal('hide'); 
                //         } else {
                //             toastr.error(res.responseMessage);
                //         }
                //     })
                // break;

                // case 'unUsedLuckCard': 
                //     for (var i = 0; i < $scope.unUsedLuckCard.length; i++) {
                //         array.push($scope.unUsedLuckCard[i]._id)
                //     }
                //     data = {
                //         Message:$scope.sendMessage.massage,
                //         Id:array
                //     }
                //     userService.sendMassageAllUser(data).success(function(res) {        
                //         if (res.responseCode == 200){
                //             toastr.success("Message Send Successfully to All Blocked User");
                //             $scope.sendMessage = '';
                //             $("#sendMessageModelAllUser").modal('hide'); 
                //         } else {
                //             toastr.error(res.responseMessage);
                //         }
                //     })
                // break;

            default:
                toastr.error("Something Wents to wrong");
        }

    }


    $scope.export = function() {
        html2canvas(document.getElementById('manageCardTable'), {
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

    $scope.export1 = function() {
        html2canvas(document.getElementById('manageCardTable1'), {
            onrendered: function(canvas) {
                var data = canvas.toDataURL();
                var docDefinition = {
                    content: [{
                        image: data,
                        width: 500,
                    }]
                };
                pdfMake.createPdf(docDefinition).download("test1.pdf");
            }
        });
    }




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


    $scope.userInfo = function(id) {
        // console.log("idddddddddd",id)
        userService.userInfo(id).success(function(res) {
            // console.log("res", JSON.stringify(res))
            if (res.responseCode == 200) {
                $scope.userDetail = res.result
                $("#userInfof").modal('show');
            } else {
                toastr.error(res.responseMessage);

            }

        })
    }

    $scope.pageCount = function(id) {
        console.log("iddddss", JSON.stringify(id))
        $scope.page = [];
        userService.pageCount(id).success(function(res) {
            console.log("res", JSON.stringify(res))
            if (res.responseCode == 200) {
                $scope.page = res.result;
                $("#Pagess").modal('show');
                console.log("$scope.res", JSON.stringify($scope.page))
            } else {
                toastr.error(res.responseMessage);

            }

        })


        // userService.pageCount(id).then(function(success) { 

        //     if(success.data.responseCode == 200) {
        //             for(i=0;i<success.data.result.length;i++){
        //                 $scope.page.push(success.data.result[0]);
        //             }
        //              console.log("pages>>>>>>"+JSON.stringify($scope.page))
        //              $("#Pages").modal('show');
        //          }
        //          else{
        //             toastr.error(success.data.responseMessage)
        //          }
        //         },function(err){
        //             console.log(err);
        //              toastr.error('Connection error.');
        //     }) 
    }

    $scope.upgradeCardUsedAd = function(id) {
        console.log(JSON.stringify(id))
        var data = {
            "upgradeId": id
        }

        userService.upgradeCardUsedAd(data).then(function(success) {
            console.log("first", success)
            if (success.data.responseCode == 200) {
                $scope.usedAd = success.data.result;
                $("#luckCardUsedAd").modal('show');
            } else {
                toastr.error(success.data.responseMessage)
            }
        }, function(err) {
            // console.log(err);
            toastr.error('Connection error.');
        })
    }


    $scope.luckCardUsedAd = function(id) {
        var data = {
            "luckId": id
        }

        userService.luckCardUsedAd(data).then(function(success) {
            //console.log("second", JSON.stringify(success))
            if (success.data.responseCode == 200) {
                $scope.usedAd = success.data.result;
                $scope.img = $scope.usedAd[0].coverImage;
                $("#luckCardUsedAd").modal('show');
            } else {
                toastr.error(success.data.responseMessage)
            }
        }, function(err) {
            //console.log(err);
            toastr.error('Connection error.');
        })
    }

    $scope.cardTypeName = function(val) {
        localStorage.setItem('cardTypeName', val);
        $scope.key = '';
        $scope.dashBordFilter.country = "";
        $scope.dashBordFilter.city = "";
        $scope.dashBordFilter.upgradeCard = "";
        $scope.dashBordFilter.luckCard = "";
        $scope.dashBordFilter.dobTo = "";
        $scope.dashBordFilter.dobFrom = "";

        switch (val) {
            case 'totalSoldCards':
                userService.totalSoldUpgradeCard().success(function(res) {
                    console.log("resssss", JSON.stringify(res.count))
                    if (res.responseCode == 200) {
                        $scope.totalSoldUpgradeCard = res.result;
                        $scope.totalSoldUpgradeCardCount = res.count;
                    } else {
                        $scope.totalSoldUpgradeCardCount = 0;
                    }
                })
                break;

            case 'totalIncome$':
                // console.log("2");
                userService.totalIncomeInCashFromUpgradeCard().success(function(res) {
                    if (res.responseCode == 200) {
                        $scope.totalIncomeInCashFromUpgradeCard = res.result;
                        $scope.totalIncomeFromUpgradeCard = res.totalIncome;
                    } else if (res.responseCode == 400) {
                        $scope.totalIncomeFromUpgradeCard = 0;
                        //toastr.error(res.responseMessage);
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })

                break;

            case 'usedCards':
                //console.log("3");
                userService.usedUpgradeCard().success(function(res) {
                    if (res.responseCode == 200) {
                        $scope.usedUpgradeCard = res.result;
                        $scope.usedUpgradeCardcount = res.total;
                    } else {
                        $scope.usedUpgradeCardcount = 0;
                        //toastr.error(res.responseMessage);
                    }
                })

                break;

            case 'unusedCards':
                //console.log("4");
                userService.unUsedUpgradeCard().success(function(res) {
                    if (res.responseCode == 200) {
                        $scope.unUsedUpgradeCard = res.result;
                        $scope.unUsedUpgradeCardcount = res.total;
                    } else {
                        $scope.unUsedUpgradeCardcount = 0;
                        //toastr.error(res.responseMessage);
                    }
                    //console.log("ressssssss4",JSON.stringify($scope.unUsedUpgradeCard));
                })

                break;

            case 'totalSoldLuckCards':
                // console.log("5");
                userService.totalSoldLuckCard().success(function(res) {
                    if (res.responseCode == 200) {
                        $scope.totalSoldLuckCard = res.result;
                        $scope.totalSoldLuckCardcount = res.count;
                    } else {
                        $scope.totalSoldLuckCardcount = 0;
                        //toastr.error(res.responseMessage);
                    }
                })

                break;

            case 'totalIncome$LuckCards':
                // console.log("6"); 
                userService.totalIncomeInBrolixFromLuckCard().success(function(res) {
                    if (res.responseCode == 200) {
                        $scope.totalIncomeInBrolixFromLuckCard = res.result;
                        $scope.totalIncomeLuck = res.totalIncome;
                    } else {
                        $scope.totalIncomeLuck = 0;
                        //toastr.error(res.responseMessage);
                    }
                })

                break;

            case 'usedCardsLuckCards':
                //console.log("7");
                userService.usedLuckCard().success(function(res) {
                    if (res.responseCode == 200) {
                        $scope.usedLuckCard = res.result;
                        $scope.usedLuckCardcount = res.total;
                    } else {
                        $scope.usedLuckCardcount = 0;
                        //toastr.error(res.responseMessage);
                    }
                })

                break;

            case 'unusedCardsLuckCards':
                // console.log("8");
                userService.unUsedLuckCard().success(function(res) {
                    if (res.responseCode == 200) {
                        $scope.unUsedLuckCard = res.result;
                        $scope.unUsedLuckCardcount = res.total;
                    } else {
                        $scope.unUsedLuckCardcount = 0;
                        //toastr.error(res.responseMessage);
                    }
                })

                break;

            default:
                toastr.error("something went to wrong");
        }



    }


    $scope.dashBordFilter = function() {

        var type = localStorage.getItem('cardTypeName');
        //console

        var data = {};
        data = {
            cardType: localStorage.getItem('cardTypeName'),
            country: $scope.dashBordFilter.country,
            state: $scope.dashBordFilter.state,
            city: $scope.dashBordFilter.city,
            upgradeType: $scope.dashBordFilter.upgradeCard,
            luckCardType: $scope.dashBordFilter.luckCard,
            joinTo: new Date($scope.dashBordFilter.dobTo).getTime(),
            joinFrom: new Date($scope.dashBordFilter.dobFrom).getTime(),
        }
        console.log("datatata", JSON.stringify(data))

        switch (type) {
            case 'totalSoldCards':
                userService.cardFilter(data).success(function(res) {
                    console.log("resssss", JSON.stringify(res.total))
                    if (res.responseCode == 200) {
                        $scope.totalSoldUpgradeCard = res.result;
                        $scope.totalSoldUpgradeCardCount = res.total;
                    } else {
                        $scope.totalSoldUpgradeCardCount = 0;
                    }
                })
                break;

            case 'totalIncome$':
                // console.log("2");
                userService.cardFilter(data).success(function(res) {
                    console.log("resssss", JSON.stringify(res.total))
                    if (res.responseCode == 200) {
                        $scope.totalIncomeInCashFromUpgradeCard = res.result;
                        $scope.totalIncomeFromUpgradeCard = res.total;
                    } else if (res.responseCode == 400) {
                        $scope.totalIncomeFromUpgradeCard = 0;
                        //toastr.error(res.responseMessage);
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })

                break;

            case 'usedCards':
                //console.log("3");
                userService.cardFilter(data).success(function(res) {
                    console.log("resssss", JSON.stringify(res.total))

                    if (res.responseCode == 200) {
                        $scope.usedUpgradeCard = res.result;
                        $scope.usedUpgradeCardcount = res.total;
                    } else {
                        $scope.usedUpgradeCardcount = 0;
                        //toastr.error(res.responseMessage);
                    }
                })

                break;

            case 'unusedCards':
                //console.log("4");
                userService.cardFilter(data).success(function(res) {
                    console.log("resssss", JSON.stringify(res.total))
                    if (res.responseCode == 200) {
                        $scope.unUsedUpgradeCard = res.result;
                        $scope.unUsedUpgradeCardcount = res.total;
                    } else {
                        $scope.unUsedUpgradeCardcount = 0;
                        //toastr.error(res.responseMessage);
                    }
                    //console.log("ressssssss4",JSON.stringify($scope.unUsedUpgradeCard));
                })

                break;

            case 'totalSoldLuckCards':
                // console.log("5");
                userService.cardFilter(data).success(function(res) {
                    console.log("resssss", JSON.stringify(res.total))
                    if (res.responseCode == 200) {
                        $scope.totalSoldLuckCard = res.result;
                        $scope.totalSoldLuckCardcount = res.total;
                    } else {
                        $scope.totalSoldLuckCardcount = 0;
                        //toastr.error(res.responseMessage);
                    }
                })

                break;

            case 'totalIncome$LuckCards':
                // console.log("6"); 
                userService.cardFilter(data).success(function(res) {
                    console.log("resssss", JSON.stringify(res.total))
                    if (res.responseCode == 200) {
                        $scope.totalIncomeInBrolixFromLuckCard = res.result;
                        $scope.totalIncomeLuck = res.total;
                    } else {
                        $scope.totalIncomeLuck = 0;
                        //toastr.error(res.responseMessage);
                    }
                })

                break;

            case 'usedCardsLuckCards':
                //console.log("7");
                userService.cardFilter(data).success(function(res) {
                    console.log("resssss", JSON.stringify(res.total))
                    if (res.responseCode == 200) {
                        $scope.usedLuckCard = res.result;
                        $scope.usedLuckCardcount = res.total;
                    } else {
                        $scope.usedLuckCardcount = 0;
                        //toastr.error(res.responseMessage);
                    }
                })

                break;

            case 'unusedCardsLuckCards':
                // console.log("8");
                userService.cardFilter(data).success(function(res) {
                    console.log("resssss", JSON.stringify(res.total))
                    if (res.responseCode == 200) {
                        $scope.unUsedLuckCard = res.result;
                        $scope.unUsedLuckCardcount = res.total;
                    } else {
                        $scope.unUsedLuckCardcount = 0;
                        //toastr.error(res.responseMessage);
                    }
                })

                break;

            default:
                toastr.error("something went to wrong");
        }

    }

})


/*----------ManageCardsCustomFilter----------*/

app.filter("cardsFilter", function() {

    var fullName = [];

    return function(items, nameValue) {
        //console.log(JSON.stringify(items))
        //console.log(nameValue)
        if (!nameValue) {
            return retArray = items;
        }
        var retArray = [];
        for (var i = 0; i < items.length; i++) {
            fullName.push(items[i].firstName + ' ' + items[i].lastName);
            if (fullName[i].toLowerCase().substr(0, nameValue.length) == nameValue.toLowerCase()) {
                retArray.push(items[i])
            }
        }

        return retArray;

    }
})

app.filter("manageCardsFilter", function() {

    var name = [];

    return function(items, nameValue) {
        // console.log(JSON.stringify(items))
        // console.log(nameValue)
        if (!nameValue) {
            return retArray = items;
        }
        var retArrayy = [];
        for (var i = 0; i < items.length; i++) {
            name.push(items[i].firstName + ' ' + items[i].lastName);
            if (name[i].toLowerCase().substr(0, nameValue.length) == nameValue.toLowerCase()) {
                retArrayy.push(items[i])
            }
        }

        return retArrayy;

    }
});