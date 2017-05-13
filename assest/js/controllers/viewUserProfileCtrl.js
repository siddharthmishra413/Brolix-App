app.controller('viewUserProfileCtrl', function($scope, $window, userService, $state, toastr, $stateParams) {
    $(window).scrollTop(0, 0);
    $scope.class = true;
    $scope.$emit('headerStatus', 'Manage User');
    $scope.$emit('SideMenu', 'Manage User');
    $scope.myForm = {};
    var id = $stateParams.id;
    console.log("Idssssss====>>>"+id)
    if(id == ''){
       toastr.error("Please select user.")
       $state.go('header.manageUsers')
   }else {

    userService.viewProfile(id).success(function(res) {
        if (res.responseCode == 200) {
            $scope.viewUserProfile = res.result;
            var updateDate = new Date($scope.viewUserProfile.dob);
            $scope.viewUserProfile.dob = moment(updateDate).format('MM/DD/YYYY');
            console.log("datatatat",JSON.stringify(res.result));
        } else {
            toastr.error(res.responseMessage)
        }
    })
    }
})


  