app.controller('addSystemUserCtrl', function($scope, $window, userService, $state, toastr, $http, $timeout) {
    $(window).scrollTop(0, 0);
    $scope.$emit('headerStatus', 'Admin Tools');
    $scope.$emit('SideMenu', 'Admin Tools');
    $scope.myFrom={permissions:{}};
    $scope.Systemuser=false;
    $scope.tableData=true;
    $scope.permissions = [];

    userService.listOfSystemAdmin($scope.currentSystemAdmin).success(function(res) { 
            if (res.responseCode == 200){          
                   $scope.allSystemUser= res.result;
               } 
               else {
                toastr.error(res.responseMessage);
                }
          })


    $scope.showtable = function() {
        $scope.Systemuser=true;
        $scope.tableData=false;
    }

    $scope.addSystemUser = function() {
        console.log("alll data ",$scope.myFrom)
        var data=[];
       angular.forEach($scope.myFrom.permissions,function(value,key){
          data.push(key);
       })
       $scope.myFrom.permissions=data;
       console.log("data",$scope.myFrom);
       userService.createSystemUser($scope.myFrom).success(function(res) {
        //console.log("res",res)
            if (res.responseCode == 404) {
                console.log("1")
                toastr.error(res.responseMessage);
                $state.go('login')
            }else if(res.responseCode == 200) {
                console.log("2")
                toastr.success(res.responseMessage);
                $state.reload();
            }else if(res.responseCode == 400){
                console.log("3")
                toastr.error(res.responseMessage);
            }else{
                console.log("4")
                toastr.error(res.responseMessage);
            }
        })
        //console.log("all Data",$scope.myFrom);
    }


    $scope.Remove_User = function (id) {
        console.log("id", id)
        BootstrapDialog.show({
        title: 'Remove User',
        message: 'Are you sure want to Remove this User',
        buttons: [{
            label: 'Yes',
            action: function(dialog) {
                userService.removeSystemAdmin(id).success(function(res) {        
                    if (res.responseCode == 200){
                        dialog.close();
                        toastr.success("System User remove Successfully");
                        $state.reload();
                    } else if(res.responseCode == 404){
                        toastr.error(res.responseMessage);
                    }
                })    
            }
        }, {
            label: 'No',
            action: function(dialog) {
                dialog.close();
                // toastr.success("User Blocked");
            }
        }]
    });
}

    $scope.cancel = function() {
        $scope.myFrom = '';
    }

})