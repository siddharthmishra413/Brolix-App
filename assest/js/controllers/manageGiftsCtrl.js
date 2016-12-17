app.controller('manageGiftsCtrl', function ($scope,$window) {
$(window).scrollTop(0,0);
console.log("manageGiftsCtrl");
$scope.$emit('headerStatus', 'Manage Gifts');
 $scope.$emit('SideMenu', 'Manage Gifts');

})