
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

 $scope.addSocialMedia = function(addSocialMedia){
    if(addSocialMedia == "" || addSocialMedia ==null || addSocialMedia == undefined){
        $scope.array=[];
    }
    else{
      $scope.array.push(addSocialMedia);
      console.log("arrrrr",$scope.array)
    }
 }
 $scope.removeSocialMedia = function(removeSocialMedia){
    $scope.array.splice(removeSocialMedia,1);
    console.log("arrrrr",$scope.array);
    
 }
 userService.pageAdmin().success(function(res) {
    console.log(JSON.stringify(res))
        if (res.responseCode == 200){
            $scope.pageAdmin= res.result;
        } 

    })
$scope.addNewPage = function(addNewPage){
  console.log(addNewPage)
  var d=JSON.parse(addNewPage);
    if(addNewPage == "" || addNewPage ==null || addNewPage == undefined){
        $scope.arrayPage=[];
    }
    else{
      $scope.arrayPage.push(d);
      console.log("arrrrr",JSON.stringify($scope.arrayPage))
    }
 }
 $scope.removeNewPage = function(removeNewPage){
    $scope.arrayPage.splice(removeNewPage,1);
    console.log("arrrrr",$scope.arrayPage);
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
    if ($scope.id == '') {
        toastr.error("Please first select.")
        $state.go('header.managePages')
    } else {
        userService.viewPage($scope.id).success(function(res) {
            if (res.responseCode == 200) {
                $scope.viewPageDetails = res.result;
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
    $scope.update=function(){
      var Info = {};
        var address = $scope.myForm.address;
        console.log(address)
        Info = $scope.viewPageDetails;
        var adminInfo=JSON.parse($scope.myForm.pageAdmin);
        console.log(adminInfo._id);
        var id=localStorage.loginData;
        console.log("all var",JSON.stringify(id));
        var data={
               "type": "ADMIN",
               "adminId":id ,
               "pageType": "Business",
               "pageName": Info.pageName,
               "category": Info.category,
               "subCategory": Info.subCategory,
               "pageDiscription": Info.description,
               "email": Info.email,
               "phoneNumber": Info.phon,
               "location": [$scope.myForm.lattitude,$scope.myForm.longitude],
               "website":Info.website,
               "country":$scope.myForm.country,
               "state":$scope.myForm.state,
               "city":$scope.myForm.city, 
               "pageImage":$scope.myForm.pagephoto,
               "coverImage": $scope.myForm.userphoto,
               "socialMedia":[$scope.myForm.socialMedia],
               "adAdmin":[{"userId":adminInfo._id,"type":"add"}]   
        }
        console.log(JSON.stringify(data))
        userService.editPage(id,data).success(function(res) {
          if(res.responseCode == 200){
            toastr.success(res.responseMessage);
          console.log(res)
          $state.go('header.managePages');
          }
          else{
            toastr.error(res.responseMessage);
          }
        });
    }

})
