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
 $scope.arrayLink = [];
 $scope.arrayPage = [];
 $scope.adminsIdd;
 $scope.subCategory = [];
 // $scope.arrayPage = [];
 var arr =[];
 var cond = [];
 $scope.pageAdminss = [];
 $scope.pageId = [];

 $scope.SocialMedia = ['Facebook','Twitter','Instagram','Linkedin'];
 console.log("pageAdmin")

 userService.pageAdmin().success(function(res) {
  console.log("dsfsdfsdfsd")
    console.log(JSON.stringify(res))
        if (res.responseCode == 200){
            $scope.pagesAdmin= res.result;
            console.log("resresres",JSON.stringify($scope.pagesAdmin))
        }else{
          toastr.error("Something went wrong")
        } 

    })
var a = localStorage.getItem('em');;
    console.log("Em =>"+a)
    var req = {
      email : a
    }

 userService.adminProfile(req).success(function(res) {
        if (res.responseCode == 200) {
            $scope.userId = res.result._id; 
            localStorage.setItem('userId',$scope.userId);
        } else {
        	toastr.error(res.responseMessage);
            $state.go('login')
            
        }
        console.log("resss",$scope.userId);
    })
  

 // userService.adminProfile().success(function(res) {
 //        if (res.responseCode == 404) {
 //            toastr.error(res.responseMessage);
 //            $state.go('login')
 //        } else if(res.responseCode == 200) {
 //            $scope.adminsIdd = res.result._id;
 //            console.log("resss",$scope.adminsIdd);
 //        }else{
 //        	toastr.error(res.responseMessage);
 //        }
 //    })

$scope.checkBoxArray=[];
 $scope.saveData = function(data){
  //console.log(data)
  console.log("value:  "+$scope.checkBoxArray.indexOf(data))
if(($scope.checkBoxArray.indexOf(data)) == -1)
{
 $scope.checkBoxArray.push(data);
}
else
{
var checkBoxArray1 = [];
for(var i=0;i<$scope.checkBoxArray.length;i++)
  if($scope.checkBoxArray[i]!= data)
checkBoxArray1.push($scope.checkBoxArray[i]);

$scope.checkBoxArray = []
for(var i=0;i<checkBoxArray1.length;i++)
$scope.checkBoxArray.push(checkBoxArray1[i]);

}
  console.log("$scope.checkBoxArray:   "+$scope.checkBoxArray);
}





 $scope.addSocialMedia = function(addSocialMedia,addSocialLink){
  $scope.myForm.link = "";
 	console.log("addSocialMedia",addSocialMedia);
 	
 	var flag = false;
 	if(addSocialMedia == "" || addSocialMedia ==null || addSocialMedia == undefined || addSocialLink==""||addSocialLink==null || addSocialLink==undefined){
 		toastr.error("Please Type social media link");
 	}else{
 		console.log("000")
 		if($scope.array.length == 0||$scope.arrayLink.length == 0){
 			console.log("111");
 			$scope.array.push(addSocialMedia);
      $scope.arrayLink.push(addSocialLink);
 		}else{
 			console.log("array",$scope.array);
 			for(var i=0; i<$scope.array.length; i++){
 				if($scope.array[i] == addSocialMedia){
 					flag = true;
 					break;
 				}
 			}
      for(var i=0; i<$scope.arrayLink.length; i++){
        if($scope.arrayLink[i] == addSocialLink){
          flag = true;
          break;
        }
      }
 			if(flag){
 				toastr.error("You have already chosen this social media");
 			}else{
 				console.log("jjjjj");
 				$scope.array.push(addSocialMedia);
        $scope.arrayLink.push(addSocialLink);
        console.log("here we have every thng :    "+$scope.array,$scope.arrayLink)
 			}
 		}

 	}
 }

 $scope.removeSocialMedia = function(removeSocialMedia,addSocialLink){
 	console.log("removeSocialMedia",removeSocialMedia)
 	var a = $scope.array.indexOf(removeSocialMedia);
  var b = $scope.arrayLink.indexOf(addSocialLink);
 	$scope.array.splice(a);
  $scope.arrayLink.splice(b);
 	console.log("a",a)
    // $scope.array.splice(removeSocialMedia,1);
    console.log("arrrrr",$scope.array);
    console.log("arrrrrLink",$scope.arrayLink);
 }


  

   userService.listOfCategory().success(function(res) {
    console.log(JSON.stringify(res))
        if (res.responseCode == 200){
            $scope.category= res.result;
            console.log("category",JSON.stringify(res))
        }else{
        	toastr.error("Something went wrong")
        } 

    })


   $scope.subCategoryDataa = function(){
    // alert("ddd");
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

   // $scope.subCategoryData = function(){
   // 	console.log("bbb",$scope.myForm.mainCategory);
   // 	var data ={};
   // 	data = {
			// subCat:$scope.myForm.mainCategory
   //  	}
   //  	userService.subCategoryData(data).success(function(res) {
   //      console.log(JSON.stringify(res))
   //          if (res.responseCode == 200){
   //              $scope.subCategoryData= res.result;
   //              //console.log("subCategoryData",JSON.stringify(subCategoryData))
   //          }else{
   //          	toastr.error("Something went wrong")
   //          } 
   //      })
   //  }

$scope.addNewPage = function(addNewPage){
   if(addNewPage){
	console.log("ssssss",JSON.stringify(addNewPage));
	var adminInfo=JSON.parse(addNewPage);
	console.log("id",adminInfo)

	// var name = adminInfo.firstName + adminInfo.lastName;
	 var flag = false;
	 console.log("firstName",adminInfo.firstName)
 	if(adminInfo.firstName == "" || adminInfo.firstName ==null || adminInfo.firstName == undefined){
 		toastr.error("Please select at least on admin");
 	}else{
 		console.log("000")
 		if($scope.pageAdminss.length == 0){
 			console.log("111");
 			$scope.pageAdminss.push(adminInfo);
 			//$scope.pageId.push(adminInfo._id);
 			console.log("$scope.pageAdmin",$scope.pageAdminss)
 			//console.log("$scope.pageId",$scope.pageId)
 			// $scope.pageId.push(addNewPage._id);
 		}else{
 			console.log("pageAdmin",$scope.pageAdminss);
 			for(var i=0; i<$scope.pageAdminss.length; i++){
 				if($scope.pageAdminss[i].firstName == adminInfo.firstName){
 					flag = true;
 					break;
 				}
 			}
 			if(flag){
 				toastr.error("You have already chosen this admin");
 			}else{
 				console.log("jjjjj");
 				$scope.pageAdminss.push(adminInfo);
 				//$scope.pageId.push(adminInfo._id);
 			}
 		}

 	}
    console.log("final arr",JSON.stringify($scope.pageAdminss))
 }
  else{
    toastr.error("Please select admin")
  }
 	//console.log("final arr",$scope.pageId)
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
    }else if(type=='Back1'){
        $scope.Step1=true;
        $scope.Step2=false;
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
		// spinnerService.show('html5spinner'); 
    console.log("input =>"+input +"key =>"+key) 
		var file = input.files[0];
		var ext = file.name.split('.').pop();
		if(ext=="jpg" || ext=="jpeg" || ext=="bmp" || ext=="gif" || ext=="png"){
		$scope.imageName = file.name;

		uploadimgServeice.user(file).then(function(ObjS) {
            console.log("Res=>"+ObjS);
            if(key == 'userImage'){
              $scope.myForm.userphoto = ObjS.data.result.url;
            }
            else{
              $scope.myForm.pagephoto = ObjS.data.result.url;
            }
		        console.log("image1",$scope.myForm.pagephoto)
            console.log("image2",$scope.user.pagephoto)
		    })

		}else{
		toastr.error("Only image supported.")
		}        
	}

    // $scope.changeImage = function(input,key) {
    //    0 var file = input.files[0];
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
    $scope.cancel=function(){
      $state.go('header.managePages');
    }

$scope.submitt = function(){
	var adminIdss = localStorage.getItem('userId');
	console.log("adminIdss",adminIdss)
	var id = [];
	for(var i=0; i<$scope.pageAdminss.length;i++){
		id.push($scope.pageAdminss[i]._id);
	}

	var datas ={
	    page :id
	  }
	Object.getOwnPropertyNames(datas).forEach(function(key, idx, array) {
	       if ( key == 'page') {
	          
	               for (data in datas[key]) {
	                   cond.push({ userId: datas[key][data] , type :"add"})
	               }
	               console.log("cond data--->>",JSON.stringify(cond));    
	       } 
	   });


		console.log("allllllll data",JSON.stringify($scope.myForm));
		  var data={
	           "type": "ADMIN",
	           "userId":adminIdss,
	           "pageType": "Business",
	           "pageName": $scope.myForm.pageName,
	           "category": $scope.myForm.mainCategory,
	           "subCategory": $scope.checkBoxArray,
	           "pageDiscription": $scope.myForm.description,
	           "email": $scope.myForm.email,
	           "phoneNumber": $scope.myForm.phon,
	           "location": [$scope.myForm.lattitude,$scope.myForm.longitude],
	           "website":$scope.myForm.website,
	           "country":$scope.myForm.country,
	           "state":$scope.myForm.state,
	           "city":$scope.myForm.city, 
	           "pageImage":$scope.myForm.userphoto,
	           "coverImage":$scope.myForm.pagephoto,
	           "socialMedia":$scope.arrayLink, 
	           "adAdmin":cond   
	    }
	   
	    console.log("allllllll data",JSON.stringify(data));
	    createPageService.createPage(data).then(function(success) {
	     console.log("resssss",success)
	           if (success.data.responseCode == 200){
	              $scope.createPageData = success.result;
	              toastr.success("successfully Created");
	              $state.go('header.managePages');
	           }else{
	           	toastr.error(success.data.responseMessage);
	           } 
	   })
	}
	  
})