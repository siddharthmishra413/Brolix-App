app.controller('manageCardsCtrl', function ($scope,$window) {
$(window).scrollTop(0,0);
 $scope.$emit('headerStatus', 'Manage Cards');
 $scope.$emit('SideMenu', 'Manage Cards');
})