app.controller('manageCardsCtrl', function ($scope,$window) {
$(window).scrollTop(0,0);
console.log("manageCardsCtrl");
 $scope.$emit('headerStatus', 'Manage Cards');
 $scope.$emit('SideMenu', 'Manage Cards');
})