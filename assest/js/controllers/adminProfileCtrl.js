app.controller('adminProfileCtrl',function($scope, $window, userService, $timeout, uploadimgServeice, spinnerService, $state, toastr, $http) {
     
$(window).scrollTop(0,0);

$scope.class = true;
$scope.$emit('headerStatus', 'Manage User');
$scope.$emit('SideMenu', 'Manage User');
 $scope.myFrom = {};
 $scope.myForm = {};
 $scope.Step1 = true;
 $scope.Step2 = false;

userService.adminProfile().success(function(res) {
    	if(res.responseCode == 404){
    		//bootbox.alert(res.responseMessage);
    		$state.go('login')
    	}else {
    		$scope.myFrom = res.result;
            $scope.adminId = $scope.myFrom._id;
            console.log(res);
    	}
    }).error(function(status, data) {

})

$scope.changeImage = function(input,type) {
  spinnerService.show('html5spinner');  
   var file = input.files[0];
   var ext = file.name.split('.').pop();
   if(ext=="jpg" || ext=="jpeg" || ext=="bmp" || ext=="gif" || ext=="png"){
       $scope.imageName = file.name;

       uploadimgServeice.user(file).then(function(ObjS) {
                $timeout(function () {      
            spinnerService.hide('html5spinner');     
                $scope.myFrom.image = ObjS.data.result.url;
                  }, 250);  
                // $scope.user.photo1 = ObjS.data.result.url;
                console.log("image1",$scope.myFrom.image)
            })

   }else{
       toastr.error("Only image supported.")
   }        
}
 
 $scope.click = function(type) {
 	if(type=='Step1'){
 		$scope.Step1=false;
	 	$scope.Step2=true;
 	}else{
	 	toastr.error("Something Wents to wrong")
	 }	
 }
    
    $scope.changePass = function() {
      var data = {
      	userid:$scope.adminId,
        oldpass:$scope.myForm.oldpassword,  
        newpass:$scope.myForm.password,   
      }
        console.log(data);  
       userService.changePass(data).then(function(success){    
       console.log(JSON.stringify(success)) 
        if(success.data.response_code==200){
          console.log(success.data.response_message);
          $state.go('header.manageUsers');
          toastr.success(success.data.response_message);  
        }else{
        console.log(success.data.response_message);
         toastr.error(success.data.response_message);  
        }
        console.log((success));
      },function(err){
       console.log("err----->"+err)
         toastr.error('Connection error.');  
      });   
    }
    
    $scope.editProfile = function() {
      var data = {
           firstName:$scope.myFrom.firstName,
           lastName:$scope.myFrom.lastName,
           image:$scope.myFrom.image
         }
         var adminid = $scope.adminId;
        console.log("ssssss",adminid,data);  
       userService.editAdminProfile(adminid,data).then(function(success){    
        if(success.data.responseCode==200){
          $state.go('header.manageUsers');
          toastr.success(success.data.responseMessage);  
        }else{
         toastr.error(success.data.responseMessage);  
        }
      },function(err){
       console.log("err----->"+err)
         toastr.error('Connection error.');  
      });   
    }
});