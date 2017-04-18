
app.controller('editPagesCtrl', function($scope, $window, userService, $state, toastr, $stateParams,uploadimgServeice, $http) {
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
    $scope.Step1 = true;
 $scope.Step2 = false;
 $scope.Step3 = false;
 $scope.Step4 = false;
 $scope.array = [];
 $scope.arrayPage = [];
 $scope.SocialMedia = ['Gmail','Facebook','Twitter'];
 var cond = [];
 //$scope.adAdminArray = [];


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


 userService.adminProfile().success(function(res) {
        if (res.responseCode == 200) {
            $scope.userId = res.result._id; 
            localStorage.setItem('userIdEdit',$scope.userId);
        } else {
          toastr.error(res.responseMessage);
            $state.go('login')
            
        }
        console.log("resss",$scope.userId);
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

// $scope.viewPageDetails.socialMedia
 $scope.addSocialMedia = function(addSocialMedia){
  console.log("addSocialMedia",addSocialMedia);
  
  var flag = false;
  if(addSocialMedia == "" || addSocialMedia ==null || addSocialMedia == undefined){
    toastr.error("Please select social media");
  }else{
    console.log("000")
    if($scope.viewPageDetails.socialMedia.length == 0){
      console.log("111");
      $scope.viewPageDetails.socialMedia.push(addSocialMedia);
    }else{
      console.log("array",$scope.viewPageDetails.socialMedia);
      for(var i=0; i<$scope.viewPageDetails.socialMedia.length; i++){
        if($scope.viewPageDetails.socialMedia[i] == addSocialMedia){
          flag = true;
          break;
        }
      }
      if(flag){
        toastr.error("You have already chosen this social media");
      }else{
        console.log("jjjjj");
        $scope.viewPageDetails.socialMedia.push(addSocialMedia);
      }
    }

  }
 }
$scope.removeSocialMedia = function(removeSocialMedia){
    console.log("removeSocialMedia",removeSocialMedia)

  for(var i=0;i<$scope.viewPageDetails.socialMedia.length;i++){
    if($scope.viewPageDetails.socialMedia[i] == removeSocialMedia){
      console.log("dadadad",JSON.stringify($scope.viewPageDetails.adAdmin[i]))
      $scope.viewPageDetails.socialMedia.splice(i,1);
    }
  }

  // var a = $scope.viewPageDetails.socialMedia.indexOf(removeSocialMedia);
  // $scope.viewPageDetails.socialMedia.splice(a);
  // console.log("a",a)
    // $scope.array.splice(removeSocialMedia,1);
    console.log("arrrrr",$scope.viewPageDetails.socialMedia);
    
 }

 $scope.addNewPage = function(addNewPage){
  if(addNewPage){
      //console.log("ssssss",JSON.stringify(addNewPage));
  var adminInfo=JSON.parse(addNewPage);
  //console.log("id",adminInfo)
  //console.log("al dta",JSON.stringify($scope.viewPageDetails.adAdmin));

   var flag = false;
   //console.log("firstName1",adminInfo.firstName)
   

  if(adminInfo.firstName == "" || adminInfo.firstName ==null || adminInfo.firstName == undefined){
    toastr.error("Please select at least on admin");
  }else{
    //console.log("000",$scope.viewPageDetails.adAdmin.length)
    if($scope.viewPageDetails.adAdmin.length == 0){

      //console.log("111",$scope.viewPageDetails.adAdmin.length);
      var obj = {
        userId:{
          _id:adminInfo._id,
          firstName:adminInfo.firstName,
          lastName:adminInfo.lastName
        }
      };
      $scope.viewPageDetails.adAdmin.push(obj);
      //console.log("adAdmin",$scope.viewPageDetails.adAdmin)
     
    }else{
     
      for(var i=0; i<$scope.viewPageDetails.adAdmin.length; i++){
        //console.log("admin FirstName",$scope.viewPageDetails.adAdmin[i].userId.firstName)
        //console.log("adminInfo FirstName",adminInfo.firstName)

        if($scope.viewPageDetails.adAdmin[i].userId.firstName == adminInfo.firstName){
          flag = true;
          break;
        }
      }
      if(flag){
        toastr.error("You have already chosen this admin");
      }else{
        //console.log("jjjjj");
        var obj = {
        userId:{
          _id:adminInfo._id,
          firstName:adminInfo.firstName,
          lastName:adminInfo.lastName
        }};

      $scope.viewPageDetails.adAdmin.push(obj);
       // console.log("adAdmin",$scope.viewPageDetails.adAdmin)
      }
    }

  }
  console.log("final arr",JSON.stringify($scope.viewPageDetails.adAdmin))
  //console.log("final arr",$scope.pageId)
  }else{
    toastr.error("Please select admin")
 }
}

 $scope.removeNewPage = function(removeNewPage){
  //console.log("removeSocialMedia",JSON.stringify(removeNewPage))
  for(var i=0;i<$scope.viewPageDetails.adAdmin.length;i++){
    if($scope.viewPageDetails.adAdmin[i].userId._id == removeNewPage.userId._id){
      console.log("dadadad",JSON.stringify($scope.viewPageDetails.adAdmin[i]))
      $scope.viewPageDetails.adAdmin.splice(i,1);
    }
  }
    //console.log("arrrrr",$scope.viewPageDetails.adAdmin);
 }


 $scope.subCategoryData = function(){
    //console.log("bbb",$scope.viewPageDetails.category);
    var data ={};
    data = {
      subCat:$scope.viewPageDetails.category
      }
      userService.subCategoryData(data).success(function(res) {
        //console.log(JSON.stringify(res))
            if (res.responseCode == 200){
                $scope.subCategoryData= res.result;
                console.log("subCategoryData",JSON.stringify($scope.subCategoryData))
            }else{
              toastr.error("Something went wrong")
            } 

        })

    }

 // $scope.addSocialMedia = function(addSocialMedia){
 //    if(addSocialMedia == "" || addSocialMedia ==null || addSocialMedia == undefined){
 //        $scope.array=[];
 //    }
 //    else{
 //      $scope.array.push(addSocialMedia);
 //      console.log("arrrrr",$scope.array)
 //    }
 // }
 // $scope.removeSocialMedia = function(removeSocialMedia){
 //    $scope.array.splice(removeSocialMedia,1);
 //    console.log("arrrrr",$scope.array);
    
 // }
 userService.pageAdmin().success(function(res) {
    console.log(JSON.stringify(res))
        if (res.responseCode == 200){
            $scope.pageAdmin= res.result;
        } 

    })


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

    $scope.initFun=function(){

      var inputFrom = document.getElementById('from');
      console.log("inputFrom",inputFrom)
      var autocompleteFrom = new google.maps.places.Autocomplete(inputFrom);
      google.maps.event.addListener(autocompleteFrom, 'place_changed', function() {
              var place = autocompleteFrom.getPlace();
              $scope.myForm.latitude = place.geometry.location.lat();
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
    if ($scope.id == '') {
        toastr.error("Please first select.")
        $state.go('header.managePages')
    } else {
        userService.viewPage($scope.id).success(function(res) {
            if (res.responseCode == 200) {
                $scope.viewPageDetails = res.result;
                console.log("admin array",JSON.stringify($scope.viewPageDetails))
                console.log("all the data",JSON.stringify(res.result));

                $scope.myForm.pagephoto = $scope.viewPageDetails.pageImage;
                $scope.myForm.userphoto=$scope.viewPageDetails.coverImage;
                for(i=0;i<$scope.viewPageDetails.socialMedia.length;i++){
                  $scope.myForm.socialMedia=$scope.viewPageDetails.socialMedia[i];
                }
                
                console.log("$scope.viewPageDetails$scope.viewPageDetails",JSON.stringify($scope.viewPageDetails))
                var geocoder = new google.maps.Geocoder();
                var latitude = $scope.viewPageDetails.location[0];
                var longitude = $scope.viewPageDetails.location[1];
                console.log(JSON.stringify(latitude+" "+longitude));
                var latLng = new google.maps.LatLng(latitude,longitude);
                geocoder.geocode({       
                        latLng: latLng     
                        }, 
                        function(responses) 
                        {     
                           if (responses && responses.length > 0) 
                           {        
                               $scope.myForm.address=responses[0].formatted_address; 
                               $scope.myForm.latitude=latitude;
                               $scope.myForm.longitude=longitude;
                               console.log("$scope.myForm.latitude=latitude",$scope.myForm.latitude);
                               console.log("$scope.myForm.$scope.myForm.longitude",$scope.myForm.longitude);
                               

                               for(i=0;i<responses[0].address_components.length;i++)
                                  {
                                    if(responses[0].address_components[i].types[0]=="country")
                                    {
                                      $scope.myForm.country =  responses[0].address_components[i].long_name;
                                    }
                                    if(responses[0].address_components[i].types[0]=="administrative_area_level_1")
                                    {
                                      $scope.myForm.state =  responses[0].address_components[i].long_name;
                                    }
                                    if(responses[0].address_components[i].types[0]=="administrative_area_level_2")
                                    {
                                      $scope.myForm.city =  responses[0].address_components[i].long_name;
                                    }
                                  }
                               $scope.$apply();  
                           } 
                           else 
                           {       
                             alert('Not getting Any address for given latitude and longitude.');     
                           }   
                        }
                );
            } else {
                toastr.error(res.responseMessage)
            }
        })
    }
    $scope.cancel=function(val){
          if(val == 'Step1'){
            $scope.viewPageDetails={};
            $scope.myForm.address="";
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
    // $scope.update=function(){
    //   var Info = {};
    //     var address = $scope.myForm.address;
    //     console.log(address)
    //     Info = $scope.viewPageDetails;
    //     var adminInfo=JSON.parse($scope.myForm.pageAdmin);
    //     console.log(adminInfo._id);
    //     var id=localStorage.loginData;
    //     console.log("all var",JSON.stringify(id));
    //     var data={
    //            "type": "ADMIN",
    //            "adminId":id ,
    //            "pageType": "Business",
    //            "pageName": Info.pageName,
    //            "category": Info.category,
    //            "subCategory": Info.subCategory,
    //            "pageDiscription": Info.description,
    //            "email": Info.email,
    //            "phoneNumber": Info.phon,
    //            "location": [$scope.myForm.lattitude,$scope.myForm.longitude],
    //            "website":Info.website,
    //            "country":$scope.myForm.country,
    //            "state":$scope.myForm.state,
    //            "city":$scope.myForm.city, 
    //            "pageImage":$scope.myForm.pagephoto,
    //            "coverImage": $scope.myForm.userphoto,
    //            "socialMedia":[$scope.myForm.socialMedia],
    //            "adAdmin":[{"userId":adminInfo._id,"type":"add"}]   
    //     }
    //     console.log(JSON.stringify(data))
    //     userService.editPage(id,data).success(function(res) {
    //       if(res.responseCode == 200){
    //         toastr.success(res.responseMessage);
    //       console.log(res)
    //       $state.go('header.managePages');
    //       }
    //       else{
    //         toastr.error(res.responseMessage);
    //       }
    //     });
    // }

  $scope.submitt = function(){
  var userIdEdit = localStorage.getItem('userIdEdit');
  // console.log("adminIdss",adminIdss)
  var id = [];
  for(var i=0; i<$scope.viewPageDetails.adAdmin.length;i++){
    id.push($scope.viewPageDetails.adAdmin[i].userId._id);
  }
  console.log("Id array",id)

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


    //console.log("allllllll data",JSON.stringify($scope.myForm));
      var data={
             "type": "ADMIN",
             "userId":userIdEdit,
             "pageType": "Business",
             "pageName": $scope.myForm.pageName,
             "category": $scope.myForm.mainCategory,
             "subCategory": $scope.myForm.subCategory,
             "pageDiscription": $scope.myForm.description,
             "email": $scope.myForm.email,
             "phoneNumber": $scope.myForm.phon,
             "location": [$scope.myForm.latitude,$scope.myForm.longitude],
             "website":$scope.myForm.website,
             "country":$scope.myForm.country,
             "state":$scope.myForm.state,
             "city":$scope.myForm.city, 
             "pageImage":$scope.myForm.userphoto,
             "coverImage": $scope.myForm.pagephoto,
             "socialMedia":$scope.viewPageDetails.socialMedia, 
             "adAdmin":cond   
      }
     
      console.log("allllllll data",JSON.stringify(data));
      userService.editPage($scope.viewPageDetails._id,data).then(function(success) {
        console.log(JSON.stringify(success))
             if (success.data.responseCode == 200){
                $scope.createPageData = success.result;
                toastr.success("successfully Created");
                $state.go('header.managePages');
             }else{
              toastr.error(success.responseMessage);
             } 
     })
  }

})
