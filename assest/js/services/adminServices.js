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
    login: function(data) {
      return $http.post('/admin/login', data);
    },
    adminProfile: function() {
      return $http.get('/admin/adminProfile');
    },
    addUser: function(data) {
      return $http.post('/admin/addNewUser', data);
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
      return $http.get('/admin/userProfile/'+id);
    },
    editUserProfile: function(id, data) {
      return $http.put('/admin/editUserProfile/'+ id, data);
    },
    
    showAllCashWinners: function() {
      return $http.get('/admin/cashWinners');
    },
    showAllCouponWinners: function() {
      return $http.get('/admin/couponWinners');
    },
    showAllBlockUser: function() {
      return $http.get('/admin/showAllBlockUser');
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
      return $http.get('/admin/blockUser/'+userId);
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
    /*------ManageGiftSection-------*/

    totalBrolixGift: function(){
      return $http.get('http://172.16.6.171:8082/admin/totalBrolixGift');
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

  }

});