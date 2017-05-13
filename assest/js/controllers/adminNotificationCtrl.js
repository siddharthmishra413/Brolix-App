app.controller('adminNotificationCtrl', function ($scope, $state, $window, userService, uploadimgServeice, $http, toastr,$timeout, spinnerService) {
$(window).scrollTop(0,0);
$scope.$emit('headerStatus', 'Admin Tools');
$scope.$emit('SideMenu', 'Admin Tools');

$scope.key = 'user';
//var data = '';
$scope.getdata = function(data)
{
	$scope.key = data;
}

 userService.notificationToAdmin().success(function(res) {        
    if (res.responseCode == 200){
    	$scope.userResult = res.result.userResult;
    	$scope.adsResult = res.result.adsResult;
    	$scope.pageResult = res.result.pageResult;

        console.log("reaaaaaaaaaaaa",JSON.stringify(res))
    } else {
        toastr.error(res.responseMessage);
    }
})


})