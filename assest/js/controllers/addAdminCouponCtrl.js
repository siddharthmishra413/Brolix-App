app.controller('addAdminCouponCtrl', function($scope, $window, userService, $state, toastr, $http, $timeout) {
    $(window).scrollTop(0, 0);
    $scope.$emit('headerStatus', 'Admin Tools');
    $scope.$emit('SideMenu', 'Admin Tools');
    $scope.myForm={};
    // $scope.Systemuser=false;
    // $scope.tableData=true;

    // $scope.addSystemuser = function() {

    //     $scope.Systemuser=true;
    //     $scope.tableData=false;


    // }

    // $scope.addSystemUser = function(data) {
    //    console.log(data);
    // }

    // $scope.cancel = function() {
    //     $scope.myFrom = '';
    // }

})