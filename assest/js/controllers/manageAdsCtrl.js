app.controller('manageAdsCtrl', function ($scope,$window) {
$(window).scrollTop(0,0);
console.log("manageAdsCtrl");
 $scope.$emit('headerStatus', 'Manage Ads');
 $scope.$emit('SideMenu', 'Manage Ads');

})