// app.controller('editPagesCtrl', function($scope, $window, userService, $state, toastr, $stateParams, $http) {
//    $(window).scrollTop(0, 0);
//    $scope.class = true;
//    $scope.$emit('headerStatus', 'Manage User');
//    $scope.$emit('SideMenu', 'Manage User');
//    $scope.myForm = {};
//    $scope.viewPage = {};
//    var id = $stateParams.id;
//    console.log("Id====>>>" + id)
//    userService.countrys().success(function(res) {
//        $scope.country = res.result;
//    }).error(function(status, data) {

//    })
//    $scope.catId = function() {
//        console.log($scope.viewUserProfile.country);
//        var country = $scope.viewUserProfile.country
//        $http.get('/admin/getAllStates/' + country.code + '/ISO2').success(function(res) {
//            $scope.allstates = res.result;
//        }, function(err) {});
//    }

//    if ($scope.id == '') {
//         toastr.error("Please first select.")
//         $state.go('header.managePages')
//     } else {
//         userService.viewPage($scope.id).success(function(res) {
//             if (res.responseCode == 200) {
//                 $scope.viewPageDetails = res.result;
//                 console.log("$scope.viewPageDetails",$scope.viewPageDetails);
//                 // var updateDate = new Date($scope.viewUserProfile.dob);
//                 // $scope.viewUserProfile.dob = moment(updateDate).format('MM/DD/YYYY');
//             } else {
//                 toastr.error(res.responseMessage)
//             }
//         })
//     }


//    $scope.updateUser = function() {
//        $scope.viewUserProfile.country = $scope.viewUserProfile.country.name;
//        console.log(JSON.stringify($scope.viewUserProfile));
//        userService.editUserProfile(id, $scope.viewUserProfile).success(function(res) {
//            if (res.responseCode == 200) {
//                toastr.success(res.responseMessage);
//                $state.go('header.manageUsers')
//            } else {
//                toastr.error(res.responseMessage);
//            }
//        }).error(function(status, data) {

//        })
//    }


// })


app.controller('editPagesCtrl', function($scope, $window, userService, $state, toastr, $stateParams, $http) {
    $(window).scrollTop(0, 0);
    $scope.class = true;
    $scope.$emit('headerStatus', 'Manage Pages');
    $scope.$emit('SideMenu', 'Manage Pages');
    $scope.myForm = {};
    $scope.viewUserProfile = {};
    $scope.coverImage = "../dist/image/cover.jpg";
    $scope.pageImage = "../dist/image/user-image.jpeg";
    $scope.id = $stateParams.id;
    console.log("Id====>>>" + $scope.id)

    if ($scope.id == '') {
        toastr.error("Please first select.")
        $state.go('header.managePages')
    } else {
        userService.viewPage($scope.id).success(function(res) {
            if (res.responseCode == 200) {
                $scope.viewPageDetails = res.result;
                console.log("$scope.viewPageDetails$scope.viewPageDetails",$scope.viewPageDetails)
                // var updateDate = new Date($scope.viewUserProfile.dob);
                // $scope.viewUserProfile.dob = moment(updateDate).format('MM/DD/YYYY');
            } else {
                toastr.error(res.responseMessage)
            }
        })
    }

})
