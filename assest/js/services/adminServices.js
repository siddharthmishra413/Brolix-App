app.service('adminServices',function(){
this.userDetail="null"; 
this.eventDetail="null";  

});
var baseurl = 'http://ec2-52-76-162-65.ap-southeast-1.compute.amazonaws.com:8082';

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




app.service('userService',function($http){

	return{
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
    totalUser: function() {
      return $http.get(baseurl+'/admin/showAllUser');
    },
    showAllPersonalUser: function() {
      return $http.get(baseurl+'/admin/showAllPersonalUser');
    },
    showAllBusinessUser: function() {
      return $http.get(baseurl+'/admin/showAllBusinessUser');
    },
    totalWinners: function() {
      return $http.get(baseurl+'/admin/winners');
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
    
    showAllCashWinners: function() {
      return $http.get(baseurl+'/admin/cashWinners');
    },
    showAllCouponWinners: function() {
      return $http.get(baseurl+'/admin/couponWinners');
    },
    showAllBlockUser: function() {
      return $http.get(baseurl+'/admin/showAllBlockUser');
    },
    showListOFCoupon: function() {
      return $http.get(baseurl+'/admin/showListOFCoupon');
    },


    /*-------------------------Manage Cards---------------------*/

    totalSoldUpgradeCard: function() {
      return $http.get(baseurl+'/admin/totalSoldUpgradeCard');
    },
    totalIncomeInCashFromUpgradeCard: function() {
      return $http.get(baseurl+'/admin/totalIncomeInCashFromUpgradeCard');
    },
    usedUpgradeCard: function() {
      return $http.get(baseurl+'/admin/usedUpgradeCard');
    },
    unUsedUpgradeCard: function() {
      return $http.get(baseurl+'/admin/unUsedUpgradeCard');
    },
    totalSoldLuckCard: function() {
      return $http.get(baseurl+'/admin/totalSoldLuckCard');
    },
    totalIncomeInBrolixFromLuckCard: function() {
      return $http.get(baseurl+'/admin/totalIncomeInBrolixFromLuckCard');
    },
    usedLuckCard: function() {
      return $http.get(baseurl+'/admin/usedLuckCard');
    },
    unUsedLuckCard: function() {
      return $http.get(baseurl+'/admin/unUsedLuckCard');
    },
    cardFilter: function(data){
     return $http.post(baseurl+'/admin/luckUpgradeCardfilter', data);
   },

    /*-------------------------Manage ADS---------------------*/

    totalAds: function(id) {
      return $http.get(baseurl+'/admin/totalAds');
    },
    totalActiveAds: function(id) {
      return $http.get(baseurl+'/admin/totalActiveAds');
    },
    totalExpiredAds: function(id) {
      return $http.get(baseurl+'/admin/totalExpiredAds');
    },
    videoAds: function(id) {
      return $http.get(baseurl+'/admin/videoAds');
    },
    slideshowAds: function(id) {
      return $http.get(baseurl+'/admin/slideshowAds');
    },
    adUpgradedByDollor: function(id) {
      return $http.get(baseurl+'/admin/adUpgradedByDollor');
    },
    adUpgradedByBrolix: function(id) {
      return $http.get(baseurl+'/admin/adUpgradedByBrolix');
    },
    showReportedAd: function(id) {
      return $http.get(baseurl+'/admin/showReportedAd');
    },
    adsWithLinks: function(id) {
      return $http.get(baseurl+'/admin/adsWithLinks');
    },
    topFiftyAds: function(id) {
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
    adsfilter: function(data){
      return $http.post(baseurl+'/admin/adsfilter', data);
    },

    //Url : http://localhost:8082/admin/adsWithLinks



    /*------------------------Manage Pages---------------------*/

    totalPages: function() {
      return $http.get(baseurl+'/admin/totalPages');
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
      return $http.get(baseurl+'/admin/adAdminUserList');
    },
    editPage: function(id,data) {
     console.log(id)
     return $http.put(baseurl+'/admin/editPage/'+id,data);
   },

    // showPageDetails: function(data) {
    //   return $http.post('http://172.16.6.41:8082/page/showPageDetails', data);
    // },


    viewPage: function(id) {
      return $http.get(baseurl+'/admin/viewPage/'+id);
    },

    pagefilter: function(data) {
      return $http.post(baseurl+'/page/pagefilter', data);
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

    unPublishedPage: function () {
      return $http.get(baseurl+'/admin/unPublishedPage');  
    },

    showAllRemovedPage: function () {
      return $http.get(baseurl+'/admin/showAllRemovedPage');  
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
    showAllBlockedPage: function(){
      return $http.get(baseurl+'/admin/showAllBlockedPage');
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

    totalCouponsGifts: function() {
      return $http.get(baseurl+'/admin/totalCouponGifts');
    },
 
    totalCashGifts: function() {
       return $http.get(baseurl+'/admin/totalCashGifts');
    },

    totalHiddenGifts: function() {
      return $http.get(baseurl+'/admin/totalHiddenGifts');
    },
    
    totalExchangedCoupon: function() {
      return $http.get(baseurl+'/admin/totalExchangedCoupon');
    },
    
    totalSentCash: function() {
      return $http.get(baseurl+'/admin/totalSentCash');
    },
    
    totalSentCoupon: function() {
      return $http.get(baseurl+'/admin/totalSentCoupon');
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
      return $http.get(baseurl+'/admin/showUserPage/'+id);
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

     SoldUpgradeCard: function(){
      return $http.get(baseurl+'/admin/totalSoldUpgradeCard');
    },
      userInfo: function(id){
      return $http.get(baseurl+'/admin/userInfo/'+id);
    },
     SoldLuckCard: function(){
      return $http.get(baseurl+'/admin/totalSoldLuckCard');
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
    cashGift: function(){
      return $http.get(baseurl+'/admin/cashGift');
    },
    soldCoupons: function(){
      return $http.get(baseurl+'/admin/soldCoupon');
    },
     pageInfo: function(id){
      return $http.get(baseurl+'/admin/pageInfo/'+id);
    }, 
    top_50_dollarsBuyers: function(){
      return $http.get(baseurl+'/admin/topFiftyUpgradeCardBuyers');
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

    /*Admin Tool Section*/

    createSystemUser: function(data){
      return $http.post(baseurl+'/admin/createSystemUser', data);
    },

    listOfSystemAdmin: function(data){
      return $http.get(baseurl+'/admin/listOfSystemAdmin');
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
    allCoupons: function(){
      return $http.get(baseurl+'/admin/showListOFCoupon');
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
    }


  }

});


 
   