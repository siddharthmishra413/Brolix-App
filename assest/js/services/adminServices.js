app.service('adminServices',function(){
this.userDetail="null"; 
this.eventDetail="null";  

});
var baseurl = 'http://ec2-52-76-162-65.ap-southeast-1.compute.amazonaws.com:8082';
var locaurl = 'http://172.16.16.159:8082';

app.service('uploadimgServeice', function($http, $q) {
    this.user = function(file) {
        var fd = new FormData();
        fd.append('file', file);

        var deferred = $q.defer();
        $http.post('/admin/uploadImage', fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            })
            .then(function(objS) {
                deferred.resolve(objS);
                // console.log("Image=====>>>"+JSON.stringify(objS));
            }, function(objE) {
                deferred.reject("server Error");

            });
        return deferred.promise;

    }
})

app.service('createPageService',function($http, $q){
 this.createPage = function(data) {
            var deff = $q.defer();
            $http({
                    method: "POST",
                    url: baseurl+'/admin/createPage',
                    data: data,
                    headers: {
                        "Content-Type": "application/json"
                        }
                })
                .then(function(objS) {
                    console.log("Data",JSON.stringify(objS.data));
                    deff.resolve(objS);
                }, function(objE) {
                    deff.reject("server Error");
                });
            return deff.promise;
        }
})

http://172.16.6.171:8082/admin/editPage/5832e29349df9c04411e252d




app.service('userService',function($http){

	return{

    editPage: function(id,data){
      return $http.put(baseurl+'/admin/editPage/'+id, data);
    },

	  signup: function(data) {
      return $http.post(baseurl+'/signup', data);
    },

    forgotPassword: function(data) {
      return $http.post(baseurl+'/user/forgotPassword', data);
    },
     changePass: function(data) {
      return $http.post(baseurl+'/user/changePassword',data);
    },

    login: function(data) {
      return $http.post(baseurl+'/admin/login', data);
    },
    adminProfile: function() {
      return $http.get(baseurl+'/admin/adminProfile');
    },
    editAdminProfile: function(id,data) {
      return $http.put(baseurl+'/admin/editAdminProfile/'+id, data);
    },
    addUser: function(data) {
      return $http.post(baseurl+'/admin/addNewUser', data);
    },
    totalUser: function(pageNo) {
     return $http.get(baseurl+'/admin/showAllUser/'+pageNo);
    },
    showAllPersonalUser: function(pageNo) {
     return $http.get(baseurl+'/admin/showAllPersonalUser/'+pageNo);
    },
    showAllBusinessUser: function(pageNo) {
      return $http.get(baseurl+'/admin/showAllBusinessUser/'+pageNo);
    },
    totalWinners: function(pageNo) {
      return $http.get(baseurl+'/admin/winners/'+pageNo);
    },
    countrys: function() {
      return $http.get(baseurl+'/admin/countrys');
    },
    // userProfile: function(id) {
    //   return $http.get(baseurl+'/admin/userProfile/'+id);
    // },
    editUserProfile: function(id, data) {
      return $http.put(baseurl+'/admin/editUserProfile/'+ id, data);
    },
    
    showAllCashWinners: function(pageNo) {
      return $http.get(baseurl+'/admin/cashWinners/'+pageNo);
    },
    showAllCouponWinners: function(pageNo) {
      return $http.get(baseurl+'/admin/couponWinners/'+pageNo);
    },
    showAllBlockUser: function(pageNo) {
      return $http.get(baseurl+'/admin/showAllBlockUser/'+pageNo);
    },
     showAllLiveUsers: function(pageNo) {
     return $http.get(baseurl+'/admin/liveUser/'+pageNo);
   },
    showListOFCoupon: function() {
      return $http.get(baseurl+'/admin/showListOFCoupon');
    },


    /*-------------------------Manage Cards---------------------*/

    totalSoldUpgradeCard: function(pageNo) {
      return $http.get(baseurl+'/admin/totalSoldUpgradeCard/'+pageNo);
    },
    totalIncomeInCashFromUpgradeCard: function(pageNo) {
      return $http.get(baseurl+'/admin/totalIncomeInCashFromUpgradeCard/'+pageNo);
    },
    usedUpgradeCard: function(pageNo) {
      return $http.get(baseurl+'/admin/usedUpgradeCard/'+pageNo);
    },
    unUsedUpgradeCard: function(pageNo) {
      return $http.get(baseurl+'/admin/unUsedUpgradeCard/'+pageNo);
    },
    totalSoldLuckCard: function(pageNo) {
      return $http.get(baseurl+'/admin/totalSoldLuckCard/'+pageNo);
    },
    totalIncomeInBrolixFromLuckCard: function(pageNo) {
      return $http.get(baseurl+'/admin/totalIncomeInBrolixFromLuckCard/'+pageNo);
    },
    usedLuckCard: function(pageNo) {
      return $http.get(baseurl+'/admin/usedLuckCard/'+pageNo);
    },
    unUsedLuckCard: function(pageNo) {
      return $http.get(baseurl+'/admin/unUsedLuckCard/'+pageNo);
    },
    cardFilter: function(data){
     return $http.post(baseurl+'/admin/luckUpgradeCardfilter', data);
   },

    /*-------------------------Manage ADS---------------------*/


    createAds: function(data){
      return $http.post(baseurl+'/ads/createAds', data);
    },

    totalAds: function(page) {
     return $http.get(baseurl+'/admin/totalAds/'+page);
     },
     totalActiveAds: function(page) {
       return $http.get(baseurl+'/admin/totalActiveAds/'+page);
     },
     totalExpiredAds: function(page) {
       return $http.get(baseurl+'/admin/totalExpiredAds/'+page);
     },
     videoAds: function(page) {
       return $http.get(baseurl+'/admin/videoAds/'+page);
     },

    slideshowAds: function(page) {
     return $http.get(baseurl+'/admin/slideshowAds/'+page);
    },
    adUpgradedByDollor: function(pageNo) {
      return $http.get(baseurl+'/admin/adUpgradedByDollor/'+pageNo);
    },
    adUpgradedByBrolix: function(pageNo) {
      return $http.get(baseurl+'/admin/adUpgradedByBrolix/'+pageNo);
    },
    showReportedAd: function(pageNo) {
      return $http.get(baseurl+'/admin/showReportedAd/'+pageNo);
    },
    adsWithLinks: function(pageNo) {
      return $http.get(baseurl+'/admin/adsWithLinks/'+pageNo);
    },
    topFiftyAds: function(pageNo) {
      return $http.get(baseurl+'/admin/topFiftyAds');
    },
    pageInfo: function(id) {
      return $http.get(baseurl+'/admin/pageInfo/'+id);
    },

    adInfo: function(id) {
     return $http.get(baseurl+'/admin/adInfo/' +id);
    },

    soldCoupon: function(id) {
     return $http.get(baseurl+'/admin/soldCoupon'+id);
    },

    showReportOnAd: function(id) {
     return $http.get(baseurl+'/admin/showReportOnAd/'+id);
    },

    listOfAds: function() {
     return $http.get(baseurl+'/admin/listOfAds/');
    },
    
    adsfilter: function(data){
      return $http.post(baseurl+'/admin/adsfilter', data);
    },

    adsDetail: function(id) {
      return $http.get(locaurl+'/admin/adsDetail/'+id);
    },

    //http://172.16.16.159:8082/admin/adsDetail/58eb50626b7bf95c7b1a47de


    //Url : http://localhost:8082/admin/adsWithLinks



    /*------------------------Manage Pages---------------------*/

    totalPages: function(pageNo) {
      return $http.get(baseurl+'/admin/totalPages/'+pageNo);
    },

    allAdminPages: function() {
      return $http.get(baseurl+'/admin/PagesAdmins');
    },

    showAllBlockedPage: function() {
      return $http.get(baseurl+'/admin/showAllBlockedPage');
    },

    // createPage: function(data) {
    //   return $http.post(baseurl+'/page/createPage', data);
    // },
    pageAdmin: function() {
      console.log("llalala")
      return $http.get(baseurl+'/admin/adAdminUserList');
    },
    editPage: function(id,data) {
     console.log(id)
     return $http.put(baseurl+'/admin/editPage/'+id,data);
   },

    listOfCategory: function() {
      return $http.get(baseurl+'/admin/listOfCategory');
    },

    subCategoryData: function(data) {
      console.log("dataaabb",data)
      return $http.post(baseurl+'/admin/subCategoryData', data);
    },

    //http://localhost:8082/page/listOfCategory


    viewPage: function(id) {
      return $http.get(baseurl+'/admin/viewPage/'+id);
    },

    pagefilter: function(data) {
      return $http.post(baseurl+'/admin/pagefilter', data);
    },

    //Url : http://ec2-52-76-162-65.ap-southeast-1.compute.amazonaws.com:1310/admin/pagefilter

    /*------------------------All Countries---------------------*/

    // allCountriesfind: function() {
    //   return $http.get('/admin/allCountriesfind');
    // },

    allstatefind: function(data) {
      return $http.post(baseurl+'/admin/allstatefind', data);
    },

    sendMassageAllUser: function(data) {
      return $http.post(baseurl+'/admin/messageBroadcast', data);
    },

    sendBrolixAndCashAllUser: function(data) {
      return $http.post(baseurl+'/admin/sendCashBrolix', data);
    },

    sendCouponTOUSers: function(data) {
      return $http.post(baseurl+'/admin/sendCouponTOUSers', data);
    },

    sendUpgradeCardTOUsers: function(data) {
      return $http.post(baseurl+'/admin/sendUpgradeCardTOUsers', data);
    },

    sendLuckCardTOUsers: function(data) {
      return $http.post(baseurl+'/admin/sendLuckCardTOUsers', data);
    },

    BlockUser: function(userId) {
      return $http.get(baseurl+'/admin/blockUser/'+userId);
    },

    UnBlockUser: function(userId) {
      return $http.get(baseurl+'/admin/unblockUser/'+userId);
    },

    viewCoupon: function(id){
      return $http.get(baseurl+'/admin/sendcardAndcoupan/'+id);
    },

    unPublishedPage: function (pageNo) {
      return $http.get(baseurl+'/admin/unPublishedPage/'+pageNo);  
    },

    showAllRemovedPage: function (pageNo) {
      return $http.get(baseurl+'/admin/showAllRemovedPage/'+pageNo);  
    },

    removePage: function (pageId) {
      return $http.get(baseurl+'/admin/removePage/'+pageId);
    },

    blockPage: function(pageId) {
      return $http.get(baseurl+'/admin/blockPage/'+pageId);
    },
    unblockPage: function(pageId) {
      return $http.get(baseurl+'/admin/unblockPage/'+pageId);
    },
    showAllBlockedPage: function(pageNo){
      return $http.get(baseurl+'/admin/showAllBlockedPage/'+pageNo);
    },

    addcard: function(data) {
      return $http.post(baseurl+'/admin/createCards', data);
    },

    viewcard: function(type) {
      return $http.get(baseurl+'/admin/viewCards/'+type);
    },

    showCardDetails: function(id){
      return $http.get(baseurl+'/admin/showCardDetails/'+id);
    },

    editCards: function(data){
      return $http.post(baseurl+'/admin/editCards', data);
    },

    removeCard: function(id){
      return $http.get(baseurl+'/admin/removeCard/'+id);
    },

    createOffer: function(data){
      return $http.post(baseurl+'/admin/createOfferOnCard', data);
    },

    showOfferOnCards: function(data){
      return $http.post(baseurl+'/admin/showOfferOnCards', data);
    },

    /*filter MangeUser section*/

    userfilter: function(data){
      return $http.post(baseurl+'/admin/userfilter', data);
    },
    // /*------ManageGiftSection-------*/

    // totalBrolixGift: function(){
    //   return $http.get('http://172.16.6.171:8082/admin/totalBrolixGift');
    // },

    /*------ManageGiftSection-------*/

    totalBrolixGift: function () {
      return $http.get(baseurl+'/admin/totalBrolixGift');  
    },

    totalCouponsGifts: function(pageNo) {
      return $http.get(baseurl+'/admin/totalCouponGifts/'+pageNo);
    },
 
    totalCashGifts: function(pageNo) {
       return $http.get(baseurl+'/admin/totalCashGifts/'+pageNo);
    },

    totalHiddenGifts: function(pageNo) {
      return $http.get(baseurl+'/admin/totalHiddenGifts/'+pageNo);
    },
    
    totalExchangedCoupon: function(pageNo) {
      return $http.get(baseurl+'/admin/totalExchangedCoupon/'+pageNo);
    },
    
    totalSentCash: function(pageNo) {
      return $http.get(baseurl+'/admin/totalSentCash/'+pageNo);
    },
    
    totalSentCoupon: function(pageNo) {
     return $http.get(baseurl+'/admin/totalSentCoupon/'+pageNo);
   },
     
    topFiftyBalances: function() {
      return $http.get(baseurl+'/admin/topFiftyBalances');
    },

    topFiftyCouponProvider: function() {
       return $http.get(baseurl+'/admin/topFiftyCouponProviders');
    },
    
    topFiftyCashProvider: function() {
      return $http.get(baseurl+'/admin/topFiftyCashProviders');
    },
    
    couponGiftAd: function(id) {
      return $http.get(baseurl+'/admin/adInfo/'+id);
    },
     giftFilter: function(data){
     return $http.post(baseurl+'/admin/giftsFilter', data);
   },

  



     /*-------ManagePage Section----------*/

     showUserPage: function(id){
      return $http.get(baseurl+'/admin/showUserAllPages/'+id);
    },

    showAdds: function(id){
      return $http.get(baseurl+'/admin/adsOnPage/'+id);
    },

    showPageWinner: function(id){
      return $http.get(baseurl+'/admin/winnersOnPage/'+id);
    },

    showAdminPages: function(id){
      return $http.get(baseurl+'/admin/pageAdminsDetail/'+id);
    },

    zipcodFunction: function(data){
      return $http.post('/admin/zipcodFunction', data);
    },

    //******************** Manage Payment Section ******************************

     SoldUpgradeCard: function(pageNo){
      return $http.get(baseurl+'/admin/totalSoldUpgradeCard/'+pageNo);
    },
      userInfo: function(id){
      return $http.get(baseurl+'/admin/userInfo/'+id);
    },
     SoldLuckCard: function(pageNo){
      return $http.get(baseurl+'/admin/totalSoldLuckCard/'+pageNo);
    },
      luckCardUsedAd: function(data){
      return $http.post(baseurl+'/admin/luckCardUsedAd',data);
    },
    luckCardUsedAd: function(data){
      return $http.post(baseurl+'/admin/luckCardUsedAd',data);
    },
    upgradeCardUsedAd: function(data){
      return $http.post(baseurl+'/admin/upgradeCardUsedAd',data);
    },
    upgradeCardPayment: function(id){
      return $http.get(baseurl+'/admin/paymentHistoryUpgradeCard/'+id);
    },
    luckCardPayment: function(id){
      return $http.get(baseurl+'/admin/paymentHistoryLuckCard/'+id);
    },
    cashGift: function(pageNo){
      return $http.get(baseurl+'/admin/cashGift/'+pageNo);
    },
    soldCoupons: function(pageNo){
      return $http.get(baseurl+'/admin/soldCoupon/'+pageNo);
    },
     pageInfo: function(id){
      return $http.get(baseurl+'/admin/pageInfo/'+id);
    }, 
    top_50_dollarsBuyers: function(pageNo){
      return $http.get(baseurl+'/admin/topFiftyUpgradeCardBuyers/'+pageNo);
    },
    top_50_brolixBuyers: function(){
      return $http.get(baseurl+'/admin/topFiftyLuckCardBuyers');
    },
    top_50_Ads: function(){
      return $http.get(baseurl+'/admin/topFiftyAds');
    },
    totalDollarsPrice: function(){
      return $http.get(baseurl+'/admin/totalCashPrice');
    },
    totalBrolixPrice: function(){
      return $http.get(baseurl+'/admin/totalBrolixPrice');
    },
    adInfo: function(id){
      return $http.get(baseurl+'/admin/adInfo/'+id);
    },
    pageCount: function(id){
      return $http.get(baseurl+'/admin/showUserPage/'+id);
    },
    filterDollars: function(data){
    return $http.post(baseurl+'/admin/dollorPaymentFilter',data);
   },
    filterBrolix: function(data){
    return $http.post(baseurl+'/admin/brolixPaymentFilter',data);
   },
   paymentPaypal: function(data){
   return $http.post('http://172.16.16.159:8082/admin/paymentHistory',data);
    },

    /*Admin Tool Section*/

    createSystemUser: function(data){
      return $http.post(baseurl+'/admin/createSystemUser', data);
    },

    listOfSystemAdmin: function(pageNo){
      return $http.get(baseurl+'/admin/listOfSystemAdmin/'+pageNo);
    },

    removeSystemAdmin: function(id){
      return $http.get(baseurl+'/admin/removeSystemAdmin/'+id);
    },

    viewProfile: function(id){
      return $http.get(baseurl+'/admin/viewProfile/'+id);
    },

    editSystemAdmin: function(id,data){
      return $http.put(baseurl+'/admin/editSystemAdmin/'+id, data);
    },

    showReport: function(data){
      return $http.get(baseurl+'/report/showReport');
    },

    createTerms: function(data){
      return $http.post(baseurl+'/terms/createTerms', data);
    },

    viewAllTerms: function(data){
      return $http.get(baseurl+'/terms/viewAllTerms');
    },

    editTermsCondition: function(type, data) {
      return $http.put(baseurl+'/terms/editTermsCondition/'+ type, data);
    },

    addCoupon: function(data){
      return $http.post(baseurl+'/admin/addNewCoupon', data);
    },
    getPage: function(){
      return $http.get(baseurl+'/admin/showPageName');
    },
    allCoupons: function(pageNo){
      return $http.get(baseurl+'/admin/showListOFCoupon/'+pageNo);
    },
    viewCoupon: function(id){
      return $http.get(baseurl+'/admin/viewCoupon/'+id);
    },
    editCoupon: function(id,data){
      return $http.put(baseurl+'/admin/editCoupon/'+id,data);
    },
    postCoupon: function(id,data){
      return $http.put(baseurl+'/admin/postCouponToStore/'+id, data);
    },
     removeCoupon: function(id){
      return $http.post(baseurl+'/admin/removeCoupon/',id);
    },
    viewAllBrolixAndDollors: function(){
      return $http.get(baseurl+'/tool/viewAllBrolixAndDollors');
    },
    brolixPerFreeCouponAds: function(type,data){
      return $http.put(baseurl+'/tool/editBrolixAndDollors/'+type, data);
    },
    checkPermission: function(data){
     return $http.post(baseurl+'/admin/checkPermission', data)
   },
   notificationToAdmin: function(){
      return $http.get(baseurl+'/admin/notificationToAdmin');
    },
  }

});

  




 
   