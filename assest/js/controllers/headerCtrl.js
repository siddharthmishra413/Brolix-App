app.controller('headerCtrl', function ($scope,$window,$state) {
$(window).scrollTop(0,0);
//console.log("headerCtrl");
$scope.$on('headerStatus', function (event, data) {
    $scope.header=data;
  });
$scope.$on('SideMenu', function (event, data) {
    $scope.menu=data;
  });

$scope.logout = function() {
	$state.go('login')
}

})