app.controller('addNewPagesCtrl', function ($scope,$window) {
$(window).scrollTop(0,0);
$scope.$emit('headerStatus', 'Manage Pages');
 $scope.$emit('SideMenu', 'Manage Pages');
console.log("addNewPagesCtrl");

})