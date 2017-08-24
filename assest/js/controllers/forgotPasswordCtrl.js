app.controller('forgotPasswordCtrl',function($scope, $state, $window, userService,toastr) {
    $(window).scrollTop(0,0);
     $scope.myForm = {};
         
          $scope.cancel = function() {
            $state.go('login');
           $scope.myFrom = '';
                 }

          $scope.forgotPassword = function () {
            console.log("myForm.email",$scope.myFrom.email)
                localStorage.userEmail=$scope.myFrom.email;
                var data = {
                  "email":localStorage.userEmail
                        } 
                        console.log("req--",data)

                userService.forgotPassword(data).success(function(res) {
                  console.log("data",JSON.stringify(res))
                if (res.responseCode == 200) {
                toastr.success(res.responseMessage);
                $state.go('login');
                } else {
                toastr.error(res.responseMessage);
                }
                })
      }
  })

