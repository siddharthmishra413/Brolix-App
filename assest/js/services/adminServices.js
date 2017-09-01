app.service('adminServices', function() {
    this.userDetail = "null";
    this.eventDetail = "null";

});
var baseurl = 'http://ec2-52-76-162-65.ap-southeast-1.compute.amazonaws.com:8082';
var locaurl = 'http://172.16.16.159:8082';

app.service('uploadimgServeice', function($http, $q) {
    this.user = function(file) {
        var fd = new FormData();
        fd.append('file', file);
        console.log("fd");
         console.log(fd);

        var deferred = $q.defer();
        $http.post('/admin/uploadImage', fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            })
            .then(function(objS) {
                deferred.resolve(objS);
            }, function(objE) {
                deferred.reject("server Error");

            });
        return deferred.promise;

    }
})

var enable_tools = [{
        name: 'document',
        groups: ['mode', 'document', 'doctools']
    },
    {
        name: 'clipboard',
        groups: ['clipboard', 'undo']
    },
    {
        name: 'editing',
        groups: ['find', 'selection', 'spellchecker']
    },
    {
        name: 'forms'
    },
    '/',
    {
        name: 'basicstyles',
        groups: ['basicstyles', 'cleanup']
    },
    {
        name: 'paragraph',
        groups: ['list', 'indent', 'blocks', 'align', 'bidi']
    },
    {
        name: 'links'
    },
    {
        name: 'insert'
    },
    '/',
    {
        name: 'styles'
    },
    {
        name: 'colors'
    },
    {
        name: 'tools'
    },
    {
        name: 'others'
    },
    {
        name: 'about'
    }
];

var enable_toolsOne = [{
        name: 'document',
        groups: ['mode', 'document', 'doctools']
    },
    {
        name: 'clipboard',
        groups: ['clipboard', 'undo']
    },
    {
        name: 'editing',
        groups: ['find', 'selection', 'spellchecker']
    },
    {
        name: 'forms'
    },
    '/',
    {
        name: 'basicstyles',
        groups: ['basicstyles', 'cleanup']
    },
    {
        name: 'paragraph',
        groups: ['list', 'indent', 'blocks', 'align', 'bidi']
    },
    {
        name: 'links'
    },
    {
        name: 'insert'
    },
    '/',
    {
        name: 'styles'
    },
    {
        name: 'colors'
    },
    {
        name: 'tools'
    },
    {
        name: 'others'
    },
    {
        name: 'about'
    },
    {
        name: 'tokens'
    }
];




app.service('signUpCondition', function() {
    var self = this;
    this.cEditor = function(flag) {
        console.log(flag);

        CKEDITOR.replace('singUpEditor', {
            width: '100%',
            height: 270,
            toolbarGroups: flag == false ? [] : enable_tools,
            removeButtons: 'Underline,Strike,Subscript,Superscript,Anchor,Styles,Specialchar'
        });
    }
});

app.service('cashAdCondition', function() {
    var self = this;
    this.cEditor = function(flag) {
        console.log(flag);

        CKEDITOR.replace('cashEditor', {
            width: '100%',
            height: 270,
            toolbarGroups: flag == false ? [] : enable_tools,
            removeButtons: 'Underline,Strike,Subscript,Superscript,Anchor,Styles,Specialchar'
        });
    }
});

app.service('couponAdCondition', function() {
    var self = this;
    this.cEditor = function(flag) {
        console.log(flag);

        CKEDITOR.replace('couponEditor', {
            width: '100%',
            height: 270,
            toolbarGroups: flag == false ? [] : enable_tools,
            removeButtons: 'Underline,Strike,Subscript,Superscript,Anchor,Styles,Specialchar'
        });
    }
});

app.service('couponGiftInfo', function() {
    var self = this;
    this.cEditor = function(flag) {
        console.log(flag);

        CKEDITOR.replace('couponGiftEditor', {
            width: '100%',
            height: 270,
            toolbarGroups: flag == false ? [] : enable_tools,
            removeButtons: 'Underline,Strike,Subscript,Superscript,Anchor,Styles,Specialchar'
        });
    }
});

app.service('cashGiftInfo', function() {
    var self = this;
    this.cEditor = function(flag) {
        console.log(flag);

        CKEDITOR.replace('cashGiftEditor', {
            width: '100%',
            height: 270,
            toolbarGroups: flag == false ? [] : enable_tools,
            removeButtons: 'Underline,Strike,Subscript,Superscript,Anchor,Styles,Specialchar'
        });
    }
});

app.service('hiddenGiftInfo', function() {
    var self = this;
    this.cEditor = function(flag) {
        console.log(flag);

        CKEDITOR.replace('hiddeenGiftEditor', {
            width: '100%',
            height: 270,
            toolbarGroups: flag == false ? [] : enable_tools,
            removeButtons: 'Underline,Strike,Subscript,Superscript,Anchor,Styles,Specialchar'
        });
    }
});

app.service('sellThisCouponInfo', function() {
    var self = this;
    this.cEditor = function(flag) {
        console.log(flag);

        CKEDITOR.replace('sellThisCouponEditor', {
            width: '100%',
            height: 270,
            toolbarGroups: flag == false ? [] : enable_tools,
            removeButtons: 'Underline,Strike,Subscript,Superscript,Anchor,Styles,Specialchar'
        });
    }
});

app.service('createPage', function($rootScope) {
    var self = this;
    CKEDITOR.plugins.add('tokens', {
    requires: ['richcombo'],
    init: function(editor) {
        var config = editor.config,
            lang = editor.lang.format;
        var tags = $rootScope.viewerss;
        editor.ui.addRichCombo('tokens', {
            label: "Page Price",
            title: "Page Price",
            voiceLabel: "Page Price",
            className: 'cke_format',
            multiSelect: false,
            init: function() {
                for (var this_tag in tags) {
                    this.add(tags[this_tag]);
                }
            },
            onClick: function(value) {
                editor.focus();
                editor.fire('saveSnapshot');
                var val = editor.insertHtml(value);
                console.log("val", value)
                $rootScope.pageCost = value;
                editor.fire('saveSnapshot');
            }
        });
    }
});
    this.cEditor = function(flag) {
        console.log(flag);
        

        CKEDITOR.replace('createPageEditor', {
            width: '100%',
            height: 270,
            toolbarGroups: enable_toolsOne,
            extraPlugins: 'tokens',
            removeButtons: 'Underline,Strike,Subscript,Superscript,Anchor,Styles,Specialchar'
        });
    }
});


app.service('createPageService', function($http, $q) {
    this.createPage = function(data) {
        var deff = $q.defer();
        $http({
                method: "POST",
                url: baseurl + '/admin/createPage',
                data: data,
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(function(objS) {
                console.log("Data", JSON.stringify(objS.data));
                deff.resolve(objS);
            }, function(objE) {
                deff.reject("server Error");
            });
        return deff.promise;
    }
})

//http://172.16.6.171:8082/admin/editPage/5832e29349df9c04411e252d



app.service('userService', function($http) {

    return {

        editPage: function(id, data) {
            return $http.put(baseurl + '/admin/editPage/' + id, data);
        },

        signup: function(data) {
            return $http.post(baseurl + '/signup', data);
        },

        forgotPassword: function(data) {
            return $http.post(baseurl + '/user/forgotPassword', data);
        },
        changePass: function(data) {
            return $http.post(baseurl + '/user/changePassword', data);
        },

        login: function(data) {
            return $http.post(baseurl + '/admin/login', data);
        },
        adminProfile: function() {
            return $http.get(baseurl + '/admin/adminProfile');
        },
        editAdminProfile: function(id, data) {
            return $http.put(baseurl + '/admin/editAdminProfile/' + id, data);
        },
        addUser: function(data) {
            return $http.post(baseurl + '/admin/addNewUser', data);
        },
        totalUser: function() {
            return $http.get(baseurl + '/admin/showAllUser');
        },
        showAllPersonalUser: function() {
            return $http.get(baseurl + '/admin/showAllPersonalUser');
        },
        showAllBusinessUser: function() {
            return $http.get(baseurl + '/admin/showAllBusinessUser');
        },
        totalWinners: function() {
            return $http.get(baseurl + '/admin/winners');
        },

        // userProfile: function(id) {
        //   return $http.get(baseurl+'/admin/userProfile/'+id);
        // },
        editUserProfile: function(id, data) {
            return $http.put(baseurl + '/admin/editUserProfile/' + id, data);
        },
        editAds: function(adId, userId, data) {
            console.log("adId",adId);
            console.log("userId",userId);
            console.log("data",JSON.stringify(data));

            return $http.put(baseurl + '/ads/editAd/' + adId + '/' + userId, data);
        },
        showAllCashWinners: function() {
            return $http.get(baseurl + '/admin/cashWinners');
        },
        showAllCouponWinners: function() {
            return $http.get(baseurl + '/admin/couponWinners');
        },
        showAllBlockUser: function() {
            return $http.get(baseurl + '/admin/showAllBlockUser');
        },
        showAllLiveUsers: function() {
            return $http.get(baseurl + '/admin/liveUser');
        },
        showListOFCouponWithoutPagination: function() {
            return $http.get(baseurl + '/admin/showListOFCouponWithoutPagination');
        },
        countryListData: function() {
            return $http.get(baseurl + '/admin/countryListData');
        },
        cityListData: function(data) {
            return $http.post(baseurl + '/admin/cityListData', data);
        },


        /*-------------------------Manage Cards---------------------*/
        luckCardViewersList: function() {
            return $http.get(baseurl + '/admin/luckCardViewersList');
        },
        upgradeCardViewersList: function() {
            return $http.get(baseurl + '/admin/upgradeCardViewersList');
        },
        upgradeCardPriceList: function() {
            return $http.get(baseurl + '/admin/upgradeCardPriceList');
        },
        totalSoldUpgradeCard: function() {
            return $http.get(baseurl + '/admin/totalSoldUpgradeCard');
        },
        totalIncomeInCashFromUpgradeCard: function() {
            return $http.get(baseurl + '/admin/totalIncomeInCashFromUpgradeCard');
        },
        usedUpgradeCard: function() {
            return $http.get(baseurl + '/admin/usedUpgradeCard');
        },
        unUsedUpgradeCard: function() {
            return $http.get(baseurl + '/admin/unUsedUpgradeCard');
        },
        totalSoldLuckCard: function() {
            return $http.get(baseurl + '/admin/totalSoldLuckCard');
        },
        totalIncomeInBrolixFromLuckCard: function() {
            return $http.get(baseurl + '/admin/totalIncomeInBrolixFromLuckCard');
        },
        usedLuckCard: function() {
            return $http.get(baseurl + '/admin/usedLuckCard');
        },
        unUsedLuckCard: function() {
            return $http.get(baseurl + '/admin/unUsedLuckCard');
        },
        cardFilter: function(data) {
            return $http.post(baseurl + '/admin/luckUpgradeCardfilter', data);
        },
        getOfferList: function(data) {
            return $http.post(baseurl + '/admin/getOfferList', data);
        },
        removeOfferonCards: function(data) {
            console.log("data", data)
            return $http.post(baseurl + '/admin/removeOfferonCards', data);
        },
        editOfferonCards: function(data) {
            console.log("data", JSON.stringify(data))
            return $http.post(baseurl + '/admin/editOfferonCards', data);
        },
        showOneOfferDetail: function(data) {
            return $http.post(baseurl + '/admin/showOneOfferDetail', data);
        },
        // getOfferList : function(data){
        //  console.log("data",data)
        //   return $http.post(baseurl+'/admin/getOfferList ', data);
        // },

        /*-------------------------Manage ADS---------------------*/

        removeAds: function(adId) {
            return $http.get(baseurl + '/admin/removeAds/' + adId);
        },
        homepageAds: function(data) {
          console.log("data",JSON.stringify(data))
            return $http.post(baseurl + '/ads/homepageAds', data);
        },

        createAds: function(data) {
          // console.log("data",JSON.stringify(data))
            return $http.post(baseurl + '/ads/createAds', data);
        },

        totalAds: function() {
            return $http.get(baseurl + '/admin/totalAds');
        },
        totalActiveAds: function() {
            return $http.get(baseurl + '/admin/totalActiveAds');
        },
        totalExpiredAds: function() {
            return $http.get(baseurl + '/admin/totalExpiredAds');
        },
        videoAds: function() {
            return $http.get(baseurl + '/admin/videoAds');
        },

        slideshowAds: function() {
            return $http.get(baseurl + '/admin/slideshowAds');
        },
        adUpgradedByDollor: function() {
            return $http.get(baseurl + '/admin/adUpgradedByDollor');
        },
        adUpgradedByBrolix: function() {
            return $http.get(baseurl + '/admin/adUpgradedByBrolix');
        },

        showReportedAdInAds: function() {
            return $http.get(baseurl + '/admin/showReportedAd');
        },
        showReportedAd: function() {
            return $http.get(baseurl + '/admin/showAllReports');
        },
        adsWithLinks: function() {
            return $http.get(baseurl + '/admin/adsWithLinks');
        },
        topFiftyAds: function() {
            return $http.get(baseurl + '/admin/topFiftyAds');
        },
        pageInfo: function(id) {
            return $http.get(baseurl + '/admin/pageInfo/' + id);
        },

        adInfo: function(id) {
            return $http.get(baseurl + '/admin/adInfo/' + id);
        },

        soldCoupon: function(id) {
            return $http.get(baseurl + '/admin/soldCoupon' + id);
        },

        showReportOnAd: function(id) {
            return $http.get(baseurl + '/admin/showReportOnAd/' + id);
        },

        listOfAds: function() {
            return $http.get(baseurl + '/admin/listOfAds');
        },

        adsfilter: function(data) {
            return $http.post(baseurl + '/admin/adsfilter', data);
        },

        adsDetail: function(id) {
            return $http.get(locaurl + '/admin/adsDetail/' + id);
        },

        freeViewersPerCashAds: function() {
            return $http.get(baseurl + '/tool/viewBrolixAndDollors/freeViewersPerCashAds');
        },

        freeViewersPerCouponAds: function() {
            return $http.get(baseurl + '/tool/viewBrolixAndDollors/freeViewersPerCouponAds');
        },

        //http://172.16.16.159:8082/admin/adsDetail/58eb50626b7bf95c7b1a47de


        //Url : http://localhost:8082/admin/adsWithLinks



        /*------------------------Manage Pages---------------------*/

        addAdmin: function(id,data) {
            console.log("dataaabb", data)
            console.log("id", id)
            return $http.put(baseurl + '/page/adAdmin/'+ id, data);
        },

        removeAdmin: function(id,data) {
            console.log("dataaabb", data)
            console.log("id", id)
            return $http.put(baseurl + '/page/adAdmin/'+ id, data);
        },

        // removeAdmin: function(data) {
        //     console.log("dataaabb", data)
        //     return $http.post(baseurl + '/page/adAdmin/', data);
        // },

        totalPages: function() {
            return $http.get(baseurl + '/admin/totalPages');
        },

        allAdminPages: function() {
            return $http.get(baseurl + '/admin/PagesAdmins');
        },

        showAllBlockedPage: function() {
            return $http.get(baseurl + '/admin/showAllBlockedPage');
        },

        // createPage: function(data) {
        //   return $http.post(baseurl+'/page/createPage', data);
        // },
        pageAdmin: function() {
            console.log("llalala")
            return $http.get(baseurl + '/admin/adAdminUserList');
        },
        editPage: function(id, data) {
            console.log(id)
            return $http.put(baseurl + '/admin/editPage/' + id, data);
        },

        listOfCategory: function() {
            return $http.get(baseurl + '/admin/listOfCategory');
        },

        subCategoryData: function(data) {
            console.log("dataaabb", data)
            return $http.post(baseurl + '/admin/subCategoryData', data);
        },

        //http://localhost:8082/page/listOfCategory


        viewPage: function(id) {
            return $http.get(baseurl + '/admin/viewPage/' + id);
        },

        pagefilter: function(data) {
            return $http.post(baseurl + '/admin/pagefilter', data);
        },

        //Url : http://ec2-52-76-162-65.ap-southeast-1.compute.amazonaws.com:1310/admin/pagefilter

        /*------------------------All Countries---------------------*/

        // allCountriesfind: function() {
        //   return $http.get('/admin/allCountriesfind');
        // },

        allstatefind: function(data) {
            return $http.post(baseurl + '/admin/allstatefind', data);
        },

        sendMassageAllUser: function(data) {
            return $http.post(baseurl + '/admin/messageBroadcast', data);
        },

        sendBrolixAndCashAllUser: function(data) {
            return $http.post(baseurl + '/admin/sendCashBrolix', data);
        },

        sendCouponTOUSers: function(data) {
            return $http.post(baseurl + '/admin/sendCouponTOUSers', data);
        },

        sendUpgradeCardTOUsers: function(data) {
            return $http.post(baseurl + '/admin/sendUpgradeCardTOUsers', data);
        },

        sendLuckCardTOUsers: function(data) {
            return $http.post(baseurl + '/admin/sendLuckCardTOUsers', data);
        },

        BlockUser: function(userId) {
            return $http.get(baseurl + '/admin/blockUser/' + userId);
        },

        UnBlockUser: function(userId) {
            return $http.get(baseurl + '/admin/unblockUser/' + userId);
        },

        viewCoupon: function(id) {
            return $http.get(baseurl + '/admin/sendcardAndcoupan/' + id);
        },

        unPublishedPage: function() {
            return $http.get(baseurl + '/admin/unPublishedPage');
        },

        showAllRemovedPage: function() {
            return $http.get(baseurl + '/admin/showAllRemovedPage');
        },

        removePage: function(pageId) {
            return $http.get(baseurl + '/admin/removePage/' + pageId);
        },

        blockPage: function(pageId) {
            return $http.get(baseurl + '/admin/blockPage/' + pageId);
        },
        unblockPage: function(pageId) {
            return $http.get(baseurl + '/admin/unblockPage/' + pageId);
        },
        showAllBlockedPage: function() {
            return $http.get(baseurl + '/admin/showAllBlockedPage');
        },

        removePageRequest: function() {
            return $http.get(baseurl + '/admin/removePageRequest');
        },

        addcard: function(data) {
            return $http.post(baseurl + '/admin/createCards', data);
        },

        approvalStatus: function(data) {
            return $http.post(baseurl + '/admin/approvalStatus', data);
        },

        viewcard: function(type) {
            return $http.get(baseurl + '/admin/viewCards/' + type+'/en');
        },

        showCardDetails: function(id) {
            return $http.get(baseurl + '/admin/showCardDetails/' + id);
        },

        editCards: function(data) {
            return $http.post(baseurl + '/admin/editCards', data);
        },

        removeCard: function(id) {
            return $http.get(baseurl + '/admin/removeCard/' + id);
        },

        createOffer: function(data) {
            return $http.post(baseurl + '/admin/createOfferOnCard', data);
        },

        showOfferOnCards: function(data) {
            return $http.post(baseurl + '/admin/showOfferOnCards', data);
        },

        showOfferCountOnCards: function(data) {
            return $http.post(baseurl + '/admin/showOfferCountOnCards', data);
        },

        /*filter MangeUser section*/

        userfilter: function(data) {
            return $http.post(baseurl + '/admin/userfilter', data);
        },
        // /*------ManageGiftSection-------*/

        // totalBrolixGift: function(){
        //   return $http.get('http://172.16.6.171:8082/admin/totalBrolixGift');
        // },

        /*------ManageGiftSection-------*/

        totalBrolixGift: function() {
            return $http.get(baseurl + '/admin/totalBrolixGift');
        },

        totalCouponsGifts: function() {
            return $http.get(baseurl + '/admin/totalCouponGifts');
        },

        totalCashGifts: function() {
            return $http.get(baseurl + '/admin/totalCashGifts');
        },

        totalHiddenGifts: function() {
            return $http.get(baseurl + '/admin/totalHiddenGifts');
        },

        totalExchangedCoupon: function() {
            return $http.get(baseurl + '/admin/totalExchangedCoupon');
        },

        totalSentCash: function() {
            return $http.get(baseurl + '/admin/totalSentCash');
        },

        totalSentCoupon: function() {
            return $http.get(baseurl + '/admin/totalSentCoupon');
        },

        topFiftyBalances: function() {
            return $http.get(baseurl + '/admin/topFiftyBalances');
        },

        topFiftyCouponProvider: function() {
            return $http.get(baseurl + '/admin/topFiftyCouponProviders');
        },

        topFiftyCashProvider: function() {
            return $http.get(baseurl + '/admin/topFiftyCashProviders');
        },

        couponGiftAd: function(id) {
            return $http.get(baseurl + '/admin/adInfo/' + id);
        },
        giftFilter: function(data) {
            return $http.post(baseurl + '/admin/giftsFilter', data);
        },
        userCouponStatus: function() {
            return $http.get(baseurl + '/admin/userCouponStatus');
        },
        userCashStatus: function() {
            return $http.get(baseurl + '/admin/userCashStatus');
        },




        /*-------ManagePage Section----------*/

        showUserPage: function(id) {
            return $http.get(baseurl + '/admin/showUserAllPages/' + id);
        },

        showAdds: function(id) {
            return $http.get(baseurl + '/admin/adsOnPage/' + id);
        },

        showPageWinner: function(id) {
            return $http.get(baseurl + '/admin/winnersOnPage/' + id);
        },

        showAdminPages: function(id) {
            return $http.get(baseurl + '/admin/pageAdminsDetail/' + id);
        },

        zipcodFunction: function(data) {
            return $http.post('/admin/zipcodFunction', data);
        },
        //http://ec2-52-76-162-65.ap-southeast-1.compute.amazonaws.com:8082/admin/showOfferOnCards/1 

        //******************** Manage Payment Section ******************************

        SoldUpgradeCard: function() {
            return $http.get(baseurl + '/admin/totalSoldUpgradeCard');
        },
        userInfo: function(id) {
            return $http.get(baseurl + '/admin/userInfo/' + id);
        },
        SoldLuckCard: function() {
            return $http.get(baseurl + '/admin/totalSoldLuckCard');
        },
        luckCardUsedAd: function(data) {
            return $http.post(baseurl + '/admin/luckCardUsedAd', data);
        },
        luckCardUsedAd: function(data) {
            return $http.post(baseurl + '/admin/luckCardUsedAd', data);
        },
        upgradeCardUsedAd: function(data) {
            return $http.post(baseurl + '/admin/upgradeCardUsedAd', data);
        },
        upgradeCardPayment: function(id) {
            return $http.get(baseurl + '/admin/paymentHistoryUpgradeCard/' + id);
        },
        luckCardPayment: function(id) {
            return $http.get(baseurl + '/admin/paymentHistoryLuckCard/' + id);
        },
        cashGift: function() {
            return $http.get(baseurl + '/admin/cashGift');
        },
        soldCoupons: function() {
            return $http.get(baseurl + '/admin/soldCoupon');
        },
        pageInfo: function(id) {
            return $http.get(baseurl + '/admin/pageInfo/' + id);
        },
        top_50_dollarsBuyers: function() {
            return $http.get(baseurl + '/admin/topFiftyUpgradeCardBuyers');
        },
        top_50_brolixBuyers: function() {
            return $http.get(baseurl + '/admin/topFiftyLuckCardBuyers');
        },
        top_50_Ads: function() {
            return $http.get(baseurl + '/admin/topFiftyAds');
        },
        totalDollarsPrice: function() {
            return $http.get(baseurl + '/admin/totalCashPrice');
        },
        totalBrolixPrice: function() {
            return $http.get(baseurl + '/admin/totalBrolixPrice');
        },
        adInfo: function(id) {
            return $http.get(baseurl + '/admin/adInfo/' + id);
        },
        pageCount: function(id) {
            return $http.get(baseurl + '/admin/showUserPage/' + id);
        },
        filterDollars: function(data) {
            return $http.post(baseurl + '/admin/dollorPaymentFilter', data);
        },
        filterBrolix: function(data) {
            return $http.post(baseurl + '/admin/brolixPaymentFilter', data);
        },
        paymentPaypal: function(data) {
            return $http.post('http://172.16.16.159:8082/admin/paymentHistory', data);
        },

        /*Admin Tool Section*/

        createSystemUser: function(data) {
            return $http.post(baseurl + '/admin/createSystemUser', data);
        },

        listOfSystemAdmin: function() {
            return $http.get(baseurl + '/admin/listOfSystemAdmin');
        },

        removeSystemAdmin: function(id) {
            return $http.get(baseurl + '/admin/removeSystemAdmin/' + id);
        },

        viewProfile: function(id) {
            return $http.get(baseurl + '/admin/viewProfile/' + id);
        },

        editSystemAdmin: function(id, data) {
            return $http.put(baseurl + '/admin/editSystemAdmin/' + id, data);
        },

        showReport: function(data) {
            return $http.get(baseurl + '/report/showReport');
        },

        createTerms: function(data) {
            return $http.post(baseurl + '/terms/createTerms', data);
        },

        viewAllTerms: function(data) {
            return $http.get(baseurl + '/terms/viewAllTerms');
        },

        viewRestTerms: function(type) {
            return $http.get(baseurl + '/terms/viewTermsCondition/' + type);
        },

        editRestTerms: function(type, data) {
            return $http.put(baseurl + '/terms/editTermsCondition/' + type, data);
        },

        editTermsCondition: function(type, data) {
            console.log("data",JSON.stringify(data))
            console.log("type",JSON.stringify(type))

            return $http.put(baseurl + '/terms/editTermsCondition/' + type, data);
        },

        addCoupon: function(data) {
            return $http.post(baseurl + '/admin/addNewCoupon', data);
        },
        getPage: function() {
            return $http.get(baseurl + '/admin/showPageName');
        },
        allCoupons: function() {
            return $http.get(baseurl + '/admin/showListOFCoupon');
        },
        viewCoupon: function(id) {
            return $http.get(baseurl + '/admin/viewCoupon/' + id);
        },
        editCoupon: function(id, data) {
            return $http.put(baseurl + '/admin/editCoupon/' + id, data);
        },
        postCoupon: function(id, data) {
            return $http.put(baseurl + '/admin/postCouponToStore/' + id, data);
        },
        removeCoupon: function(id) {
            return $http.post(baseurl + '/admin/removeCoupon/', id);
        },
        viewAllBrolixAndDollors: function() {
            return $http.get(baseurl + '/tool/viewAllBrolixAndDollors');
        },
        brolixPerFreeCouponAds: function(type, data) {
            return $http.put(baseurl + '/tool/editBrolixAndDollors/' + type, data);
        },
        checkPermission: function(data) {
            return $http.post(baseurl + '/admin/checkPermission', data)
        },
        notificationToAdmin: function() {
            return $http.get(baseurl + '/admin/notificationToAdmin');
        },
    }

});