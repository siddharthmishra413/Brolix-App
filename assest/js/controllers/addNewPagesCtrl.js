app.controller('addNewPagesCtrl', function ($scope, $state, $window, userService, uploadimgServeice, $http, toastr) {
$(window).scrollTop(0,0);
$scope.$emit('headerStatus', 'Manage Pages');
 $scope.$emit('SideMenu', 'Manage Pages');
 $scope.myForm = {};
 $scope.Step1 = true;
 $scope.Step2 = false;
 $scope.Step3 = false;
 $scope.Step4 = false;
 $scope.click = function(type){
 	if(type=='Step1'){
 		$scope.Step1=false;
	 	$scope.Step2=true;
	 	$scope.Step3 = false;
	 	$scope.Step4 = false;
 	}else if(type=='Step2'){
 		$scope.Step1=false;
	 	$scope.Step2=false
	 	$scope.Step3 = true;
	 	$scope.Step4 = false;
 	}else if(type=='Step3'){
 		$scope.Step1=false;
	 	$scope.Step2=false;
	 	$scope.Step3 = false;
	 	$scope.Step4 = true;
	 }else{
	 	toastr.error("Somthing Wents to wroung")
	 }	
 }

 	$scope.changeImage = function(input,key) {
        var file = input.files[0];
        var ext = file.name.split('.').pop();
        if(ext=="jpg" || ext=="jpeg" || ext=="bmp" || ext=="gif" || ext=="png"){
            $scope.imageName = file.name;
            uploadimgServeice.user(file).then(function(ObjS) {
            	if(key=='pageImage'){
            		$scope.myForm.pagephoto = ObjS.data.result.url;
            		$scope.user.pagephoto = ObjS.data.result.url;
            	}else{
            		$scope.myForm.userphoto = ObjS.data.result.url;
            		$scope.user.userphoto = ObjS.data.result.url;
            	}  
        })
        }else{
            toastr.error("Only image supported.")
        }        
    }
    
})