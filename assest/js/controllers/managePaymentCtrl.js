app.controller('managePaymentCtrl', function ($scope,$window) {
$(window).scrollTop(0,0);
console.log("managePaymentCtrl");
$scope.$emit('headerStatus', 'Manage Paymant');
  $scope.$emit('SideMenu', 'Manage Paymant');

})