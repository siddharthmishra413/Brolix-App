app.service('adminServices',function(){
this.userDetail="null"; 
this.eventDetail="null";  

});
//var baseurl = "http://172.16.6.171"

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




app.service('userService',function($http){

	return{
	  signup: function(data) {
      return $http.post('/signup', data);
    },

    forgotPassword: function(data) {
      return $http.post('http://172.16.6.171:8082/user/forgotPassword', data);
    },

    login: function(data) {
      return $http.post('/admin/login', data);
    },
    adminProfile: function() {
      return $http.get('/admin/adminProfile');
    },
    addUser: function(data) {
      return $http.post('http://172.16.6.171:8082/admin/addNewUser', data);
    },
    totalUser: function() {
      return $http.get('http://172.16.6.171:8082/admin/showAllUser');
    },
    showAllPersonalUser: function() {
      return $http.get('http://172.16.6.171:8082/admin/showAllPersonalUser');
    },
    showAllBusinessUser: function() {
      return $http.get('http://172.16.6.171:8082/admin/showAllBusinessUser');
    },
    totalWinners: function() {
      return $http.get('http://172.16.6.171:8082/admin/winners');
    },
    countrys: function() {
      return $http.get('/admin/countrys');
    },
    userProfile: function(id) {
      return $http.get('http://172.16.6.171:8082/admin/userProfile/'+id);
    },
    editUserProfile: function(id, data) {
      return $http.put('http://172.16.6.171:8082/admin/editUserProfile/'+ id, data);
    },
    
    showAllCashWinners: function() {
      return $http.get('http://172.16.6.171:8082/admin/cashWinners');
    },
    showAllCouponWinners: function() {
      return $http.get('http://172.16.6.171:8082/admin/couponWinners');
    },
    showAllBlockUser: function() {
      return $http.get('http://172.16.6.171:8082/admin/showAllBlockUser');
    },

    /*-------------------------Manage Cards---------------------*/

    totalSoldUpgradeCard: function() {
      return $http.get('http://172.16.6.171:8082/admin/totalSoldUpgradeCard');
    },
    totalIncomeInCashFromUpgradeCard: function() {
      return $http.get('http://172.16.6.171:8082/admin/totalIncomeInCashFromUpgradeCard');
    },
    usedUpgradeCard: function() {
      return $http.get('http://172.16.6.171:8082/admin/usedUpgradeCard');
    },
    unUsedUpgradeCard: function() {
      return $http.get('http://172.16.6.171:8082/admin/unUsedUpgradeCard');
    },
    totalSoldLuckCard: function() {
      return $http.get('http://172.16.6.171:8082/admin/totalSoldLuckCard');
    },
    totalIncomeInBrolixFromLuckCard: function() {
      return $http.get('http://172.16.6.171:8082/admin/totalIncomeInBrolixFromLuckCard');
    },
    usedLuckCard: function() {
      return $http.get('http://172.16.6.171:8082/admin/usedLuckCard');
    },
    unUsedLuckCard: function() {
      return $http.get('http://172.16.6.171:8082/admin/unUsedLuckCard');
    },

    /*-------------------------Manage ADS---------------------*/

    totalAds: function(id) {
      return $http.get('http://172.16.6.171:8082/admin/totalAds');
    },
    totalActiveAds: function(id) {
      return $http.get('http://172.16.6.171:8082/admin/totalActiveAds');
    },
    totalExpiredAds: function(id) {
      return $http.get('http://172.16.6.171:8082/admin/totalExpiredAds');
    },
    videoAds: function(id) {
      return $http.get('http://172.16.6.171:8082/admin/videoAds');
    },
    slideshowAds: function(id) {
      return $http.get('http://172.16.6.171:8082/admin/slideshowAds');
    },
    adUpgradedByDollor: function(id) {
      return $http.get('http://172.16.6.171:8082/admin/adUpgradedByDollor');
    },
    adUpgradedByBrolix: function(id) {
      return $http.get('http://172.16.6.171:8082/admin/adUpgradedByBrolix');
    },
    showReportedAd: function(id) {
      return $http.get('http://172.16.6.171:8082/admin/showReportedAd');
    },



    /*------------------------Manage Pages---------------------*/

    totalPages: function() {
      return $http.get('http://172.16.6.171:8082/admin/totalPages');
    },

    allAdminPages: function() {
      return $http.get('http://172.16.6.171:8082/admin/PagesAdmins');
    },

    showAllBlockedPage: function() {
      return $http.get('http://172.16.6.171:8082/admin/showAllBlockedPage');
    },

    createPage: function(data) {
      return $http.post('http://172.16.6.171:8082/page/createPage', data);
    },

    // showPageDetails: function(data) {
    //   return $http.post('http://172.16.6.41:8082/page/showPageDetails', data);
    // },


    viewPage: function(id) {
      return $http.get('http://172.16.6.171:8082/admin/viewPage/'+id);
    },

    /*------------------------All Countries---------------------*/

    // allCountriesfind: function() {
    //   return $http.get('/admin/allCountriesfind');
    // },

    allstatefind: function(data) {
      return $http.post('/admin/allstatefind', data);
    },

    sendMassageAllUser: function(data) {
      return $http.post('/admin/messageBroadcast', data);
    },

    sendBrolixAndCashAllUser: function(data) {
      return $http.post('/admin/sendCashBrolix', data);
    },

    BlockUser: function(userId) {
      return $http.get('http://172.16.6.171:8082/admin/blockUser/'+userId);
    },

    UnBlockUser: function(userId) {
      return $http.get('http://172.16.6.171:8082/admin/unblockUser/'+userId);
    },

    viewCoupon: function(id){
      return $http.get('http://ec2-52-76-162-65.ap-southeast-1.compute.amazonaws.com:8082/admin/sendcardAndcoupan/'+id);
    },

    unPublishedPage: function () {
      return $http.get('http://172.16.6.171:8082/admin/unPublishedPage');  
    },

    showAllRemovedPage: function () {
      return $http.get('http://172.16.6.171:8082/admin/showAllRemovedPage');  
    },

    removePage: function (pageId) {
      return $http.get('http://172.16.6.171:8082/admin/removePage/'+pageId);
    },

     bloackUnblockPage: function(data) {
      return $http.post('http://ec2-52-76-162-65.ap-southeast-1.compute.amazonaws.com:8082/admin/createCards', data);
    },

    showAllBlockedPage: function(){
      return $http.get('http://ec2-52-76-162-65.ap-southeast-1.compute.amazonaws.com:8082/admin/showAllBlockedPage');
    },

    addcard: function(data) {
      return $http.post('http://ec2-52-76-162-65.ap-southeast-1.compute.amazonaws.com:8082/admin/createCards', data);
    },

    viewcard: function(type) {
      return $http.get('http://ec2-52-76-162-65.ap-southeast-1.compute.amazonaws.com:8082/admin/viewCards/'+type);
    },

    showCardDetails: function(id){
      return $http.get('http://ec2-52-76-162-65.ap-southeast-1.compute.amazonaws.com:8082/admin/showCardDetails/'+id);
    },

    editCards: function(data){
      return $http.post('http://ec2-52-76-162-65.ap-southeast-1.compute.amazonaws.com:8082/admin/editCards', data);
    },

    removeCard: function(id){
      return $http.get('http://ec2-52-76-162-65.ap-southeast-1.compute.amazonaws.com:8082/admin/removeCard/'+id);
    },

    createOffer: function(data){
      return $http.post('http://ec2-52-76-162-65.ap-southeast-1.compute.amazonaws.com:8082/admin/createOfferOnCard', data);
    },

    showOfferOnCards: function(data){
      return $http.post('http://ec2-52-76-162-65.ap-southeast-1.compute.amazonaws.com:8082/admin/showOfferOnCards', data);
    },

    /*filter MangeUser section*/

    userfilter: function(data){
      return $http.post('http://ec2-52-76-162-65.ap-southeast-1.compute.amazonaws.com:1310/admin/userfilter', data);
    },
    // /*------ManageGiftSection-------*/

    // totalBrolixGift: function(){
    //   return $http.get('http://172.16.6.171:8082/admin/totalBrolixGift');
    // },

    /*------ManageGiftSection-------*/

    totalBrolixGift: function () {
      return $http.get('http://172.16.6.171:8082/admin/totalBrolixGift');  
    },

    totalCouponsGifts: function() {
      return $http.get('http://172.16.6.171:8082/admin/totalCouponGifts');
    },
 
    totalCashGifts: function() {
       return $http.get('http://172.16.6.171:8082/admin/totalCashGifts');
    },

    totalHiddenGifts: function() {
      return $http.get('http://172.16.6.171:8082/admin/totalHiddenGifts');
    },
    
    totalExchangedCoupon: function() {
      return $http.get('http://172.16.6.171:8082/admin/totalExchangedCoupon');
    },
    
    totalSentCash: function() {
      return $http.get('http://172.16.6.171:8082/admin/totalSentCash');
    },
    
    totalSentCoupon: function() {
      return $http.get('http://172.16.6.171:8082/admin/totalSentCoupon');
    },
     
    topFiftyBalances: function() {
      return $http.get('http://172.16.6.171:8082/admin/topFiftyBalances');
    },

    topFiftyCouponProvider: function() {
       return $http.get('http://172.16.6.171:8082/admin/topFiftyCouponProviders');
    },
    
    topFiftyCashProvider: function() {
      return $http.get('http://172.16.6.171:8082/admin/topFiftyCashProviders');
    },
    
    couponGiftAd: function(id) {
      return $http.get('http://172.16.6.171:8082/admin/adInfo/'+id);
    },

  



     /*-------ManagePage Section----------*/

     showUserPage: function(id){
      return $http.get('http://172.16.6.171:8082/admin/showUserPage/'+id);
    },

    showAdds: function(id){
      return $http.get('http://172.16.6.171:8082/admin/adsOnPage/'+id);
    },

    showPageWinner: function(id){
      return $http.get('http://172.16.6.171:8082/admin/winnersOnPage/'+id);
    },

    showAdminPages: function(id){
      return $http.get('http://172.16.6.171:8082/admin/pageAdminsDetail/'+id);
    },

    zipcodFunction: function(data){
      return $http.post('/admin/zipcodFunction', data);
    },

    //******************** Manage Payment Section ******************************

     SoldUpgradeCard: function(){
      return $http.get('http://172.16.6.171:8082/admin/totalSoldUpgradeCard');
    },
      userInfo: function(id){
      return $http.get('http://172.16.6.171:8082/admin/userInfo/'+id);
    },
     SoldLuckCard: function(){
      return $http.get('http://172.16.6.171:8082/admin/totalSoldLuckCard');admin/luckCardUsedAd
    },
      luckCardUsedAd: function(data){
      return $http.post('http://172.16.6.171:8082/admin/luckCardUsedAd',data);
    },
    luckCardUsedAd: function(data){
      return $http.post('http://172.16.6.171:8082/admin/luckCardUsedAd',data);
    },
    upgradeCardUsedAd: function(data){
      return $http.post('http://172.16.6.171:8082/admin/upgradeCardUsedAd',data);
    },
    upgradeCardPayment: function(id){
      return $http.get('http://172.16.6.171:8082/admin/paymentHistoryUpgradeCard/'+id);
    },
    luckCardPayment: function(id){
      return $http.get('http://172.16.6.171:8082/admin/paymentHistoryLuckCard/'+id);
    },
    cashGift: function(){
      return $http.get('http://172.16.6.171:8082/admin/cashGift');
    },
    soldCoupons: function(){
      return $http.get('http://172.16.6.171:8082/admin/soldCoupon');
    },
     pageInfo: function(id){
      return $http.get('http://172.16.6.171:8082/admin/pageInfo/'+id);
    }, 
    top_50_dollarsBuyers: function(){
      return $http.get('http://172.16.6.171:8082/admin/topFiftyUpgradeCardBuyers');
    },
    top_50_brolixBuyers: function(){
      return $http.get('http://172.16.6.171:8082/admin/topFiftyLuckCardBuyers');
    },
    top_50_Ads: function(){
      return $http.get('http://172.16.6.171:8082/admin/topFiftyAds');
    },
    totalDollarsPrice: function(){
      return $http.get('http://172.16.6.171:8082/admin/totalCashPrice');
    },
    totalBrolixPrice: function(){
      return $http.get('http://172.16.6.171:8082/admin/totalBrolixPrice');
    },
    adInfo: function(id){
      return $http.get('http://172.16.6.171:8082/admin/adInfo/'+id);
    },
    pageCount: function(id){
      return $http.get('http://172.16.6.171:8082/admin/showUserPage/'+id);
    },

    /*Admin Tool Section*/

    createSystemUser: function(data){
      return $http.post('http://172.16.6.171:8082/admin/createSystemUser', data);
    },

    listOfSystemAdmin: function(data){
      return $http.get('http://172.16.6.171:8082/admin/listOfSystemAdmin');
    },

    removeSystemAdmin: function(id){
      return $http.get('http://172.16.6.171:8082/admin/removeSystemAdmin/'+id);
    },

    viewProfile: function(id){
      return $http.get('http://172.16.6.171:8082/admin/viewProfile/'+id);
    },

    editSystemAdmin: function(id,data){
      return $http.put('http://172.16.6.171:8082/admin/editSystemAdmin/'+id, data);
    },

    showReport: function(data){
      return $http.get('http://172.16.6.171:8082/report/showReport');
    },

    createTerms: function(data){
      return $http.post('http://172.16.6.171:8082/terms/createTerms', data);
    },

    viewAllTerms: function(data){
      return $http.get('http://172.16.6.171:8082/terms/viewAllTerms');
    },

    editTermsCondition: function(type, data) {
      return $http.put('http://172.16.6.171:8082/terms/editTermsCondition/'+ type, data);
    },

    addCoupon: function(data){
      return $http.post('http://172.16.6.171:8082/admin/addNewCoupon', data);
    },
    getPage: function(){
      return $http.get('http://172.16.6.171:8082/admin/showPageName');
    },
    allCoupons: function(){
      return $http.get('http://172.16.6.171:8082/admin/showListOFCoupon');
    },
    viewCoupon: function(id){
      return $http.get('http://172.16.6.171:8082/admin/viewCoupon/'+id);
    },
    editCoupon: function(id,data){
      return $http.put('http://172.16.6.171:8082/admin/editCoupon/'+id,data);
    },
    postCoupon: function(id,data){
      return $http.put('http://172.16.6.171:8082/admin/postCouponToStore/'+id, data);
    },
     removeCoupon: function(id){
      return $http.post('http://172.16.6.171:8082/admin/removeCoupon/',id);
    }


  }

});