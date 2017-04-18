app.controller('editSystemUserCtrl', function($scope, $stateParams, $window, userService, $state, toastr, $http, $timeout) {
    $(window).scrollTop(0, 0);
    $scope.$emit('headerStatus', 'Admin Tools');
    $scope.$emit('SideMenu', 'Admin Tools');
    $scope.myFrom={permissions:{}};
    $scope.Systemuser=false;
    $scope.tableData=true;
    $scope.permissions = [];
    $scope.id = $stateParams.id;
    console.log("$scope.id;",$stateParams.id);

    if ($scope.id == '') {
        toastr.error("Please first select.")
        $state.go('header.addSystemUser')
    } else {
        userService.viewProfile($scope.id).success(function(res) {
            if (res.responseCode == 200) {
                $scope.myFrom = res.result;
                var data = {};
                angular.forEach($scope.myFrom.permissions,function(value,key){
                    data[value]=true;
                    console.log("asda",value,key)
                })
                $scope.myFrom.permissions=data;

                console.log("$scope.viewPageDetails$scope.viewPageDetails",JSON.stringify($scope.myFrom))
                // var updateDate = new Date($scope.viewUserProfile.dob);
                // $scope.viewUserProfile.dob = moment(updateDate).format('MM/DD/YYYY');
            } else {
                toastr.error(res.responseMessage)
            }
        })
    }


    $scope.updateSystemUser = function() {
        //console.log("1")
        var data=[];
       angular.forEach($scope.myFrom.permissions,function(value,key){
         if(value==true){
            data.push(key);
         }
          

       })
       $scope.myFrom.permissions = data;
        console.log("all",JSON.stringify($scope.myFrom));
       // console.log("data",JSON.stringify($scope.myFrom),$stateParams.id);
       userService.editSystemAdmin($stateParams.id,$scope.myFrom).success(function(res) {
        console.log("res",res)
            if (res.responseCode == 404) {
                toastr.error(res.responseMessage);
                $state.go('login')
            }else if(res.responseCode == 200) {
                toastr.success(res.responseMessage);
                $state.go('header.addSystemUser')
                // $state.go('header.addSystemUser')
            }else if(res.responseCode == 400){
                toastr.error(res.responseMessage);
            }else{
                toastr.error(res.responseMessage);
            }
        })
        console.log("all Data",$scope.myFrom);
    }

    $scope.cancel = function() {
        $scope.myFrom = '';
    }

})


