app.controller('manageUsersCtrl', function ($scope,$window) {
$(window).scrollTop(0,0);
$scope.class = true;
 $scope.$emit('headerStatus', 'Manage User');
  $scope.$emit('SideMenu', 'Manage User');
console.log("manageUsersCtrl");

})