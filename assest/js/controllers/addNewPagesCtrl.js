app.controller('addNewPagesCtrl', function ($scope, spinnerService, $timeout, $state,createPageService, $window, userService, uploadimgServeice, $http, toastr) {
$(window).scrollTop(0,0);
$scope.$emit('headerStatus', 'Manage Pages');
 $scope.$emit('SideMenu', 'Manage Pages');
 $scope.myForm = {};
 $scope.Step1 = true;
 $scope.Step2 = false;
 $scope.Step3 = false;
 $scope.Step4 = false;
 $scope.array = [];
 $scope.arrayPage = [];
 // $scope.arrayPage = [];
 var arr =[];
 $scope.pageAdminss = [];

 $scope.SocialMedia = ['Gmail','Facebook','Twitter'];

 $scope.addSocialMedia = function(addSocialMedia){
 	console.log("addSocialMedia",addSocialMedia);
 	
 	var flag = false;
 	if(addSocialMedia == "" || addSocialMedia ==null || addSocialMedia == undefined){
 		toastr.error("Please select social media");
 	}else{
 		console.log("000")
 		if($scope.array.length == 0){
 			console.log("111");
 			$scope.array.push(addSocialMedia);
 		}else{
 			console.log("array",$scope.array);
 			for(var i=0; i<$scope.array.length; i++){
 				if($scope.array[i] == addSocialMedia){
 					flag = true;
 					break;
 				}
 			}
 			if(flag){
 				toastr.error("You have already chosen this social media");
 			}else{
 				console.log("jjjjj");
 				$scope.array.push(addSocialMedia);
 			}
 		}

 	}
 }

 $scope.removeSocialMedia = function(removeSocialMedia){
 	console.log("removeSocialMedia",removeSocialMedia)
 	var a = $scope.array.indexOf(removeSocialMedia);
 	$scope.array.splice(a);
 	console.log("a",a)
    // $scope.array.splice(removeSocialMedia,1);
    console.log("arrrrr",$scope.array);
    
 }


  userService.pageAdmin().success(function(res) {
    //console.log(JSON.stringify(res))
        if (res.responseCode == 200){
            $scope.pageAdmin= res.result;
            console.log("resresres",JSON.stringify(res))
        }else{
        	toastr.error("Something went wrong")
        } 

    })

   userService.listOfCategory().success(function(res) {
    console.log(JSON.stringify(res))
        if (res.responseCode == 200){
            $scope.category= res.result;
            console.log("category",JSON.stringify(res))
        }else{
        	toastr.error("Something went wrong")
        } 

    })

   $scope.subCategoryData = function(){
   	console.log("bbb",$scope.myForm.mainCategory);
   	var data ={};
   	data = {
			subCat:$scope.myForm.mainCategory
	}
	userService.subCategoryData(data).success(function(res) {
    console.log(JSON.stringify(res))
        if (res.responseCode == 200){
            $scope.subCategoryData= res.result;
            //console.log("subCategoryData",JSON.stringify(subCategoryData))
        }else{
        	toastr.error("Something went wrong")
        } 

    })

   }

$scope.addNewPage = function(addNewPage){
	console.log("ssssss",JSON.stringify(addNewPage));
	var adminInfo=JSON.parse(addNewPage);
	console.log("adminInfo",adminInfo.firstName,adminInfo.lastName)
	var name = adminInfo.firstName + adminInfo.lastName;
	var flag = false;
 	if(name == "" || name ==null || name == undefined){
 		toastr.error("Please select at least on admin");
 	}else{
 		console.log("000")
 		if($scope.pageAdminss.length == 0){
 			console.log("111");
 			$scope.pageAdminss.push(name);
 			console.log("$scope.pageAdmin",$scope.pageAdminss)
 		}else{
 			console.log("pageAdmin",$scope.pageAdminss);
 			for(var i=0; i<$scope.pageAdminss.length; i++){
 				if($scope.pageAdminss[i] == name){
 					flag = true;
 					break;
 				}
 			}
 			if(flag){
 				toastr.error("You have already chosen this admin");
 			}else{
 				console.log("jjjjj");
 				$scope.pageAdminss.push(name);
 			}
 		}

 	}
 	console.log("final arr",$scope.pageAdminss)
 }

 $scope.removeNewPage = function(removeNewPage){
 	console.log("removeSocialMedia",removeNewPage)
 	var a = $scope.pageAdminss.indexOf(removeNewPage);
 	$scope.pageAdminss.splice(a);
 	console.log("a",a)
    // $scope.array.splice(removeSocialMedia,1);
    console.log("arrrrr",$scope.pageAdminss);
 }

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
        toastr.error("Somthing Went wrong")
     }  
 }
	$scope.changeImage = function(input,key) {
		spinnerService.show('html5spinner');  
		var file = input.files[0];
		var ext = file.name.split('.').pop();
		if(ext=="jpg" || ext=="jpeg" || ext=="bmp" || ext=="gif" || ext=="png"){
		$scope.imageName = file.name;

		uploadimgServeice.user(file).then(function(ObjS) {
		        $timeout(function () {      
		    spinnerService.hide('html5spinner');     
		        if(key=='pageImage'){
                    $scope.myForm.pagephoto = ObjS.data.result.url;
                    $scope.user.pagephoto = ObjS.data.result.url;
                }else{
                    $scope.myForm.userphoto = ObjS.data.result.url;
                    $scope.user.userphoto = ObjS.data.result.url;
                }
		          }, 250);  
		        // $scope.user.photo1 = ObjS.data.result.url;
		        //console.log("image1",$scope.myFrom.image)
		    })

		}else{
		toastr.error("Only image supported.")
		}        
	}

    // $scope.changeImage = function(input,key) {
    //     var file = input.files[0];
    //     var ext = file.name.split('.').pop();
    //     if(ext=="jpg" || ext=="jpeg" || ext=="bmp" || ext=="gif" || ext=="png"){
    //         $scope.imageName = file.name;
    //         uploadimgServeice.user(file).then(function(ObjS) {
                  
    //     })
    //     }else{
    //         toastr.error("Only image supported.")
    //     }        
    // }


  $scope.initFun=function(){
   var inputFrom = document.getElementById('from');
      var autocompleteFrom = new google.maps.places.Autocomplete(inputFrom);
      google.maps.event.addListener(autocompleteFrom, 'place_changed', function() {
              var place = autocompleteFrom.getPlace();
              $scope.myForm.lattitude = place.geometry.location.lat();
              $scope.myForm.longitude = place.geometry.location.lng();
              $scope.myForm.address = place.formatted_address;
             
              console.log(place.address_components.length);

              for(i=0;i<place.address_components.length;i++)
              {
                if(place.address_components[i].types[0]=="country")
                {
                  $scope.myForm.country =  place.address_components[i].long_name;
                }
                if(place.address_components[i].types[0]=="administrative_area_level_1")
                {
                  $scope.myForm.state =  place.address_components[i].long_name;
                }
                if(place.address_components[i].types[0]=="administrative_area_level_2")
                {
                  $scope.myForm.city =  place.address_components[i].long_name;
                }
              }
              console.log(JSON.stringify($scope.myForm.country))
              console.log(JSON.stringify($scope.myForm.state))
              console.log(JSON.stringify($scope.myForm.city))
              $scope.$apply("myForm");
      });         
}
    $scope.cancel=function(val){
      if(val == 'Step1'){
        $scope.myForm={};
      }
      // else if(val == 'Step2'){
      //   $scope.myForm.pagephoto="";
      //   $scope.myForm.userphoto="";
      // }
      else if(val == 'Step3'){
        $scope.myForm.socialMedia="";
      }
      else if(val == 'Step4'){
        $scope.myForm.pageAdmin="";
      }
      
    }
    $scope.submitt = function(){
    	console.log("allllllll data",JSON.stringify($scope.myForm));
    	  var data={
               "type": "ADMIN",
               "adminId":"12121212" ,
               "pageType": "Business",
               "pageName": $scope.myForm.pageName,
               "category": $scope.myForm.mainCategory,
               "subCategory": $scope.myForm.subCategory,
               "pageDiscription": $scope.myForm.description,
               "email": $scope.myForm.email,
               "phoneNumber": $scope.myForm.phon,
               "location": [$scope.myForm.lattitude,$scope.myForm.longitude],
               "website":$scope.myForm.website,
               "country":$scope.myForm.country,
               "state":$scope.myForm.state,
               "city":$scope.myForm.city, 
               "pageImage":$scope.myForm.userphoto,
               "coverImage": $scope.myForm.pagephoto,
               "socialMedia":$scope.pageAdminss,
               // "adAdmin":[{"userId":adminInfo._id,"type":"add"}] 
               "adAdmin":[{"userId":"343434","type":"add"}]   
        }
        console.log("allllllll data",JSON.stringify(data));
       //  var Info = {};
       //  var address = $scope.myForm.address;
       //  console.log("allllllll data",JSON.parse($scope.myForm));
       //  console.log(address)
       //  Info = $scope.myForm;
       //  var adminInfo=JSON.parse($scope.myForm.pageAdmin);
       //  console.log(adminInfo._id);
       //  var id=localStorage.loginData;
       //  console.log("all var",JSON.stringify(id));
       //  var data={
       //         "type": "ADMIN",
       //         "adminId":id ,
       //         "pageType": "Business",
       //         "pageName": Info.pageName,
       //         "category": Info.mainCategory,
       //         "subCategory": Info.subCategory,
       //         "pageDiscription": Info.description,
       //         "email": Info.email,
       //         "phoneNumber": Info.phon,
       //         "location": [$scope.myForm.lattitude,$scope.myForm.longitude],
       //         "website":Info.website,
       //         "country":$scope.myForm.country,
       //         "state":$scope.myForm.state,
       //         "city":$scope.myForm.city, 
       //         "pageImage":Info.pagephoto,
       //         "coverImage": Info.userphoto,
       //         "socialMedia":[$scope.myForm.socialMedia],
       //         "adAdmin":[{"userId":adminInfo._id,"type":"add"}]   
       //  }
       //  console.log(JSON.stringify(data))
       //  createPageService.createPage(data).then(function(success) {
       //    console.log(JSON.stringify(success))
       //         if (success.data.responseCode == 200){
       //            $scope.createPageData = success.result;
       //            toastr.success("successfully Created");
       //            $state.go('header.managePages');
       //         } 
       // })
    }
      
})