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
  $scope.Step1 = true;
  $scope.Step2 = false;
  $scope.Step3 = false;
  $scope.Step4 = false;
  $scope.array = [];
  $scope.arrayPage = [];
  $scope.SocialMedia = ['Gmail','Facebook','Twitter'];
  var cond = [];

userService.pageAdmin().success(function(res) {
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
})

userService.listOfCategory().success(function(res) {
  if (res.responseCode == 200){
    $scope.category= res.result;
  }else{
    toastr.error("Something went wrong")
  } 
})


$scope.subCategoryData = function(){
  $scope.caty = false;
  $scope.subCaty = true;
  var data ={};
  data = {
    subCat:$scope.viewPageDetails.category
  }
  userService.subCategoryData(data).success(function(res) {
      if (res.responseCode == 200){
        $scope.subCategoryData= res.result;
      }else{
        toastr.error("Something went wrong")
      } 
    })
  }

$scope.checkBoxArray=[];
$scope.saveData = function(data){
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
}





// $scope.viewPageDetails.socialMedia
 $scope.addSocialMedia = function(addSocialMedia,addSocialLink){
  console.log("addSocialLink",addSocialLink);
  
  var flag = false;
  if(addSocialLink == "" || addSocialLink ==null || addSocialLink == undefined){
    toastr.error("Please select social media");
  }else{
    console.log("000")
    if($scope.viewPageDetails.socialMedia.length == 0){
      console.log("111");
      $scope.viewPageDetails.socialMedia.push(addSocialLink);
    }else{
      console.log("array",$scope.viewPageDetails.socialMedia);
      for(var i=0; i<$scope.viewPageDetails.socialMedia.length; i++){
        if($scope.viewPageDetails.socialMedia[i] == addSocialLink){
          flag = true;
          break;
        }
      }
      if(flag){
        toastr.error("You have already chosen this social media");
      }else{
        console.log("jjjjj");
        $scope.viewPageDetails.socialMedia.push(addSocialLink);
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
  let addAdminObj ={};
  if(addNewPage){
    var adminInfo=JSON.parse(addNewPage);
    var flag = false;
    if(adminInfo.firstName == "" || adminInfo.firstName ==null || adminInfo.firstName == undefined){
      toastr.error("Please select at least on admin");
    }else{
      console.log("LENTH:   ",JSON.stringify($scope.viewPageDetails.adAdmin))
      if(!$scope.viewPageDetails.adAdmin.firstName){
        var obj = {
          userId:{
            _id:adminInfo._id,
            firstName:adminInfo.firstName,
            lastName:adminInfo.lastName
          }
        };
        addAdminObj = {
          userId:adminInfo._id,
          type:"ADMIN",
          add:"add"
          } 
        userService.addAdmin($scope.id,addAdminObj).success(function(res) {
          console.log(JSON.stringify(res))
            if (res.responseCode == 200){
                $scope.viewPageDetails.adAdmin.push(obj);
                toastr.success(res.responseMessage)
            }else{
              toastr.error(res.responseMessage)
            } 
          })
        //console.log(push);

      }else{
        for(var i=0; i<$scope.viewPageDetails.adAdmin.length; i++){
          if($scope.viewPageDetails.adAdmin[i].userId.firstName == adminInfo.firstName){
            flag = true;
            break;
          }
        }
        if(flag){
          toastr.error("You have already chosen this admin");
        }else{
          var obj = {
          userId:{
            _id:adminInfo._id,
            firstName:adminInfo.firstName,
            lastName:adminInfo.lastName
          }};

          addAdminObj = {
          userId:adminInfo._id,
          type:"ADMIN",
          add:"add"
          } 

        userService.addAdmin($scope.id,addAdminObj).success(function(res) {
          console.log(JSON.stringify(res))
            if (res.responseCode == 200){
                toastr.success(res.responseMessage)
                $scope.viewPageDetails.adAdmin.push(obj);
            }else{
              toastr.error(res.responseMessage)
            } 
          })
        }
      }

    }
  }else{
    toastr.error("Please select admin")
 }
}

 $scope.removeNewPage = function(RemoveNewPagess){
  let addAdminObj ={};
  for(var i=0;i<$scope.viewPageDetails.adAdmin.length;i++){
    if($scope.viewPageDetails.adAdmin[i].userId._id == RemoveNewPagess.userId._id){
      console.log("dadadad",JSON.stringify($scope.viewPageDetails.adAdmin[i]))
      $scope.viewPageDetails.adAdmin.splice(i,1);
      addAdminObj = {
        userId:RemoveNewPagess.userId._id,
        type:"ADMIN",
        add:"remove"
      } 
      userService.removeAdmin($scope.id,addAdminObj).success(function(res) {
        if (res.responseCode == 200){
          
          toastr.success(res.responseMessage)
        }else{
          toastr.error(res.responseMessage)
        } 
      })
    }
  }
 }
 
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
    }else if(type=='Back1'){
        $scope.Step1 = true;
        $scope.Step2 = false;
        $scope.Step3 = false;
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
                    $scope.myForm.userphoto = ObjS.data.result.url;
                    $scope.user.userphoto = ObjS.data.result.url;
                }else{
                    $scope.myForm.pagephoto = ObjS.data.result.url;
                    $scope.user.pagephoto = ObjS.data.result.url;
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


$scope.caty = true;
$scope.subCaty = false;


    if ($scope.id == '') {
        toastr.error("Please first select.")
        $state.go('header.managePages')
    } else {
        userService.viewPage($scope.id).success(function(res) {
          console.log("ressssss",JSON.stringify(res))
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

    console.log("$scope.viewPageDetails.category:---->    "+$scope.viewPageDetails)
    $scope.cancel=function(){
      $state.go('header.managePages');
    }

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

if($scope.checkBoxArray.length<1)
$scope.subCategoryFinal = $scope.myForm.subCategory;
else
$scope.subCategoryFinal = $scope.checkBoxArray;
    //console.log("allllllll data",JSON.stringify($scope.myForm));
      var data={
             "type": "ADMIN",
             "userId":userIdEdit,
             "pageType": "Business",
             "pageName": $scope.viewPageDetails.pageName,
             "category": $scope.viewPageDetails.category,
             "subCategory": $scope.subCategoryFinal,
             "pageDiscription": $scope.viewPageDetails.pageDiscription,
             "email": $scope.viewPageDetails.email,
             "phoneNumber": $scope.viewPageDetails.phoneNumber,
             "location": [$scope.myForm.latitude,$scope.myForm.longitude],
             "website":$scope.viewPageDetails.website,
             "country":$scope.myForm.country,
             "state":$scope.myForm.state,
             "city":$scope.myForm.city, 
             "pageImage":$scope.myForm.pagephoto,
             "coverImage": $scope.myForm.userphoto,
             "socialMedia":$scope.viewPageDetails.socialMedia, 
             "adAdmin":cond   
      }
     
      console.log("allllllll data",data);
      userService.editPage($scope.viewPageDetails._id,data).then(function(success) {
        console.log("resssss",success)
             if (success.data.responseCode == 200){
                $scope.createPageData = success.result;
                toastr.success("Page Updated successfully");
                $state.go('header.managePages');
             }else{
              toastr.error(success.responseMessage);
             } 
     })
  }

})
