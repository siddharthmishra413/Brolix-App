app.controller('loginCtrl', function ($scope,$window,$state) {
$(window).scrollTop(0,0);
console.log("loginCtrl");
$scope.myFrom = {};

$scope.login = function () {
	alert("Login successfully")
	$state.go('header.manageUsers')

}

})