app.controller('adminProfileCtrl',function($scope, $window, userService, $timeout, uploadimgServeice, spinnerService, $state, toastr, $http) {
     
$(window).scrollTop(0,0);

$scope.class = true;
$scope.$emit('headerStatus', 'Manage User');
$scope.$emit('SideMenu', 'Manage User');
 $scope.myFrom = {};
 $scope.myForm = {};
 $scope.Step1 = true;
 $scope.Step2 = false;
 $scope.myFrom.image = 'http://res.cloudinary.com/dfrspfd4g/image/upload/v1503658623/tziupdwsii6uzhwzxk2q.png';

userService.adminProfile().success(function(res) {
  console.log(res);
    	if(res.responseCode == 404){
    		//bootbox.alert(res.responseMessage);
    		$state.go('login')
    	}else {
    		$scope.myFrom = res.result;
            $scope.adminId = $scope.myFrom._id;
            console.log("admin data",JSON.stringify(res));
    	}
    }).error(function(status, data) {

})

$scope.changeImage = function(input,type) {
  //spinnerService.show('html5spinner');  
   var file = input.files[0];
   var ext = file.name.split('.').pop();
   if(ext=="jpg" || ext=="jpeg" || ext=="bmp" || ext=="gif" || ext=="png"){
       $scope.imageName = file.name;

       uploadimgServeice.user(file).then(function(ObjS) {
        $scope.myFrom.image = ObjS.data.result.url;
            //     $timeout(function () {      
            // spinnerService.hide('html5spinner');     
                
            //       }, 250);  
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
        "userId":$scope.adminId,
        "oldpass":$scope.myForm.oldpassword,  
        "newpass":$scope.myForm.password,   
      }
        console.log(data);  
       userService.changePass(data).then(function(ObjS){    
       //console.log(JSON.stringify(ObjS)) 
        if(ObjS.data.responseCode==200){
          $state.go('login');
          toastr.success(ObjS.data.responseMessage);  
        }else{
          console.log("dsds")
         toastr.error(ObjS.data.response_message);  
        }
      },function(err){
       console.log("err----->"+err)
         toastr.error('Connection error.');  
      });   
    }
    
    $scope.editProfile = function() {
      var id=$scope.adminId;
      var data = {
           "firstName":$scope.myFrom.firstName,
           "lastName":$scope.myFrom.lastName, 
           "image":$scope.myFrom.image           
          }
        console.log("ccccccc",data);  
       userService.editAdminProfile(id,data).then(function(ObjS) {    
       // console.log("llllllllll",JSON.stringify(ObjS)) 
        if(ObjS.data.responseCode==200){
          toastr.success(ObjS.data.responseMessage);
          $state.reload();  
        }else{
         toastr.error(ObjS.responseMessage);  
        }
      },function(err){
       console.log("err----->"+err)
         toastr.error('Connection error.');  
      });   
    }
});