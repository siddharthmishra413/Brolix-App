app.controller('forgotPasswordCtrl',function($scope, $state, $window, userService,toastr) {
    $(window).scrollTop(0,0);
     $scope.myForm = {};
         
          $scope.cancel = function() {
           $scope.myFrom = '';
                 }

          $scope.forgotPassword = function () {
                localStorage.userEmail=$scope.myForm.email;
                var data = {
                  "email":localStorage.userEmail
                        } 
                userService.forgotPassword(data).then(function (ObjS) {
                  console.log("success data--->"+(JSON.stringify(ObjS)));
                  if(ObjS.responseCode == 200) {
                    toastr.success(ObjS.data.responseMessage);
                    $state.go('login');
                  }else {
                  toastr.error(ObjS.data.responseMessage);
                  }  
                }, function (ObjE) {
                 //toastr.error(ObjS.data.responseMessage);
                    console.log("Error : " + (ObjE));
           })
      }
  })

