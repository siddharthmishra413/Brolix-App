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
    
    viewPage: function(id) {
      return $http.get('/admin/viewPage/'+id);
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
    totalSoldUpgradeCard: function() {
      return $http.get('/admin/totalSoldUpgradeCard');
    },
    totalIncomeInCashFromUpgradeCard: function() {
      return $http.get('/admin/totalIncomeInCashFromUpgradeCard');
    },
    usedUpgradeCard: function() {
      return $http.get('/admin/usedUpgradeCard');
    },
    unUsedUpgradeCard: function() {
      return $http.get('/admin/unUsedUpgradeCard');
    },
    totalSoldLuckCard: function() {
      return $http.get('/admin/totalSoldLuckCard');
    },
    totalIncomeInBrolixFromLuckCard: function() {
      return $http.get('/admin/totalIncomeInBrolixFromLuckCard');
    },
    usedLuckCard: function() {
      return $http.get('/admin/usedLuckCard');
    },
    unUsedLuckCard: function() {
      return $http.get('/admin/unUsedLuckCard');
    },

    /*-------------------------Manage ADS---------------------*/

    totalAds: function(id) {
      return $http.get('/admin/totalAds');
    },
    totalActiveAds: function(id) {
      return $http.get('/admin/totalActiveAds');
    },
    totalExpiredAds: function(id) {
      return $http.get('/admin/totalExpiredAds');
    },
    videoAds: function(id) {
      return $http.get('/admin/videoAds');
    },
    slideshowAds: function(id) {
      return $http.get('/admin/slideshowAds');
    },

    /*------------------------Manage Pages---------------------*/

    totalPages: function() {
      return $http.get('http://172.16.6.171:8082/admin/totalPages');
    },

    showAllBlockedPage: function() {
      return $http.get('/admin/showAllBlockedPage');
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
      return $http.get('http://ec2-52-76-162-65.ap-southeast-1.compute.amazonaws.com:1310/admin/totalBrolixGift');
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
    }

  }

});