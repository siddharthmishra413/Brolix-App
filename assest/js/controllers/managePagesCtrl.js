app.controller('managePagesCtrl', function ($scope,$window,userService,toastr) {
$(window).scrollTop(0,0);
$scope.class = false;
 $scope.$emit('headerStatus', 'Manage Pages');
 $scope.$emit('SideMenu', 'Manage Pages');
 $scope.tab = 'totalPages';
 $scope.myForm = {};


 userService.totalPages().success(function(res) {
 	if (res.responseCode == 200){
            $scope.totalPages = res.result;
        } else {
            toastr.error(res.responseMessage);
        }        
    })
})