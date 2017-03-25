app.controller('addNewPagesCtrl', function ($scope, $state, $window, userService, uploadimgServeice, $http, toastr) {
$(window).scrollTop(0,0);
$scope.$emit('headerStatus', 'Manage Pages');
 $scope.$emit('SideMenu', 'Manage Pages');
 $scope.myForm = {};
 $scope.Step1 = true;
 $scope.Step2 = false;
 $scope.Step3 = false;
 $scope.Step4 = false;

 $scope.addSocialMedia = function(addSocialMedia){
  var array = [];
  array.push(JSON.parse(localStorage.getItem(addSocialMedia)));
  var data = localStorage.setItem(addSocialMedia, JSON.stringify(array));
  console.log("fffffff",data)
 /* $scope.array.item.push(addSocialMedia);*/
  // array.concate(addSocialMedia);
  console.log("arrrrr",array);
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
    $scope.submitt = function(){
        var data = {};
        $scope.myForm.location = $scope.location;
        data = $scope.myForm;
        console.log("all data",JSON.stringify(data));

        userService.createPage(data).success(function(res) {
        if (res.responseCode == 200){
            $scope.createPageData = res.result;
            toastr.success(res.responseMessage);
        } else {
            toastr.error(res.responseMessage);
        }
        
    })
    }



      //  Location on googleMap
  var geocoder;
  var map;
  var marker;
  $scope.IsVisible = false;

  $scope.codeAddress = function () {
    $scope.IsVisible = $scope.IsVisible ? false : true;
    geocoder = new google.maps.Geocoder();

    var address = document.getElementById('city_country').value;
    geocoder.geocode({ 'address': address }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        map = new google.maps.Map(document.getElementById('mapCanvas'), {
          zoom: 8,
          streetViewControl: false,
          mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            mapTypeIds: [google.maps.MapTypeId.HYBRID, google.maps.MapTypeId.ROADMAP]
          },
          center: results[0].geometry.location,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        map.setCenter(results[0].geometry.location);
        marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location,
          draggable: true,
          title: 'My Title'
        });
        updateMarkerPosition(results[0].geometry.location);
        geocodePosition(results[0].geometry.location);

        // Add dragging event listeners.

        google.maps.event.addListener(marker, 'dragend', function () {
          updateMarkerStatus('Drag ended');
          geocodePosition(marker.getPosition());
          map.panTo(marker.getPosition());
        });
      }
    });
  }

  function geocodePosition(pos) {
    geocoder.geocode({
      latLng: pos
    }, function (responses) {
      if (responses && responses.length > 0) {
        updateMarkerAddress(responses[0].formatted_address);
      }
      else {
        updateMarkerAddress('Cannot determine address at this location.');
      }
    });
  }

  function updateMarkerStatus(str) {
  }

  function updateMarkerPosition(latLng) {
  }

  function updateMarkerAddress(str) {
    document.getElementById('city_country').value = str;
    $scope.location=str;
    console.log(document.getElementById('city_country').value);
  }
      
})