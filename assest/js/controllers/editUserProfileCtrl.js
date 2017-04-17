app.controller('editUserProfileCtrl', function($scope, $window, userService, $state, toastr, $stateParams, $http ,$timeout) {
   $(window).scrollTop(0, 0);
   $scope.class = true;
   $scope.$emit('headerStatus', 'Manage User');
   $scope.$emit('SideMenu', 'Manage User');
   $scope.myForm = {};
   $scope.viewUserProfile = {};
   
   var id = $stateParams.id;
   console.log("Id====>>>" + id)

//-------------------------------SELECT CASCADING COUNTRY, STATE & CITY FILTER-------------------------//
    var currentCities=[];
    $scope.currentCountry= '';
var BATTUTA_KEY="00000000000000000000000000000000"
    // Populate country select box from battuta API
  url="http://battuta.medunes.net/api/country/all/?key="+BATTUTA_KEY+"&callback=?";
    $.getJSON(url,function(countries)
    {
      $timeout(function(){
        $scope.countriesList=countries;
        console.log("data1",$scope.countriesList)
      },100)
      
      
    });
  var countryCode;
    $scope.changeCountry = function(){

      console.log("viewUserProfile.country",$scope.viewUserProfile.country);
      for(var i=0;i<$scope.countriesList.length;i++){
        //console.log("$scope.dashBordFilter.country",$scope.dashBordFilter.country)
        //console.log($scope.countriesList[i].name)
        if($scope.countriesList[i].name==$scope.viewUserProfile.country){
          countryCode=$scope.countriesList[i].code;
          console.log(countryCode)
          break;
        }
      }
      var url="http://battuta.medunes.net/api/region/"+countryCode+"/all/?key="+BATTUTA_KEY+"&callback=?";
      $.getJSON(url,function(regions)
      {
        //console.log('state list:   '+JSON.stringify(regions))
            $timeout(function(){
             $scope.stateList = regions;
             $scope.stateList.unshift({region:'Select State'})
             $scope.viewUserProfile.statedfd = $scope.stateList[0];;
             console.log("data2",JSON.stringify($scope.stateList))
            },100)
      });
    }

    $scope.changeState = function() {
      console.log('detail -> ',viewUserProfile.state)
      var url="http://battuta.medunes.net/api/city/"+countryCode+"/search/?region="+$scope.viewUserProfile.state+"&key="+BATTUTA_KEY+"&callback=?";
      console.log($scope.viewUserProfile.statedfd)
      $.getJSON(url,function(cities)
      {
        // console.log('city list:   '+JSON.stringify(cities))
            $timeout(function(){
             $scope.cityList = cities;
             console.log("data3",$scope.cityList)
            },100)
      })
    }
   if (id == '') {
       toastr.error("Please select user.")
       $state.go('header.manageUsers')
   } else {
       userService.viewProfile(id).success(function(res) {
           if (res.responseCode == 200) {
               $scope.viewUserProfile = res.result;
               console.log("al ldta",JSON.stringify(res.result));
               $scope.viewUserProfile.country = res.result.country;
               $scope.viewUserProfile.state = res.result.state;
               console.log("res.result.country",res.result.country);
               console.log("$scope.viewUserProfile.state",$scope.viewUserProfile.state);
               // console.log(JSON.stringify($scope.viewUserProfile.state)) 
               var updateDate = new Date($scope.viewUserProfile.dob);
               $scope.viewUserProfile.dob = moment(updateDate).format('MM/DD/YYYY');
               $scope.viewUserProfile.coufgdntry=$scope.viewUserProfile.country;
               $scope.viewUserProfile.statedfd=$scope.viewUserProfile.state;
               console.log("$scope.viewUserProfile.statedfd",$scope.viewUserProfile.statedfd);
               // console.log('state->   '+$scope.viewUserProfile.statedfd);
               // $scope.viewUserProfile.citysds=$scope.viewUserProfile.city;
               // console.log("rinku---",JSON.stringify($scope.viewUserProfile))
           } else {
               toastr.error(res.responseMessage)
           }
       })
   }


   $scope.updateUser = function() {
      // console.log(JSON.stringify($scope.viewUserProfile));
       userService.editUserProfile(id, $scope.viewUserProfile).success(function(res) {
           if (res.responseCode == 200) {
               toastr.success(res.responseMessage);
               $state.go('header.manageUsers')
           } else {
               toastr.error(res.responseMessage);
           }
       }).error(function(status, data) {

       })
   }


})