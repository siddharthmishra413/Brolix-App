app.controller('headerCtrl', function ($scope,$window,$state) {
$(window).scrollTop(0,0);
console.log("headerCtrl");

$scope.logout = function() {
	$state.go('login')
}

})