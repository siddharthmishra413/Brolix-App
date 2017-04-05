app.controller('addUserCtrl', function($scope, $state, $window, userService, $http, toastr, $timeout) {
    $(window).scrollTop(0, 0);
    $scope.$emit('headerStatus', 'Manage User');
    $scope.$emit('SideMenu', 'Manage User');

    $scope.myFrom = {};

    $scope.addUser = function() {
        $scope.myFrom.type = "USER";
        console.log("mmmmmm111111",$scope.myFrom)
        console.log("dob>>>>>>>>>",JSON.stringify($scope.myFrom.dob))
        userService.addUser($scope.myFrom).success(function(res) {
            console.log("myform data",$scope.myFrom);
            if (res.responseCode == 200) {
            console.log(JSON.stringify(res))
            toastr.success(res.responseMessage);
            $state.go('header.manageUsers')
            } else {
                toastr.error(res.responseMessage);
            }
        }).error(function(status, data) {

        })
    }

    $scope.cancel = function() {
        $scope.myFrom = '';
        $scope.userFrom.firstName.$dirty = false;
        $scope.userFrom.firstName.$invalid = false;
        $scope.userFrom.firstName.$error.required = false;
        $scope.userFrom.lastName.$dirty = false;
        $scope.userFrom.lastName.$invalid = false;
        $scope.userFrom.lastName.$error.required = false;
        $scope.userFrom.dob.$dirty = false;
        $scope.userFrom.dob.$invalid = false;
        $scope.userFrom.dob.$error.required = false;
        $scope.userFrom.email.$dirty = false;
        $scope.userFrom.email.$invalid = false;
        $scope.userFrom.email.$error.required = false;
        $scope.userFrom.city.$dirty = false;
        $scope.userFrom.city.$invalid = false;
        $scope.userFrom.city.$error.required = false;
        $scope.userFrom.mobileNumber.$dirty = false;
        $scope.userFrom.mobileNumber.$invalid = false;
        $scope.userFrom.mobileNumber.$error.required = false;
        $scope.userFrom.country.$dirty = false;
        $scope.userFrom.country.$invalid = false;
        $scope.userFrom.country.$error.required = false;
    }

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
        //console.log("data1",$scope.countriesList)
      },100)
      
      
    });
  var countryCode;
    $scope.changeCountry = function(){
      for(var i=0;i<$scope.countriesList.length;i++){
        //console.log("$scope.dashBordFilter.country",$scope.dashBordFilter.country)
        if($scope.countriesList[i].name==$scope.myFrom.country){
          countryCode=$scope.countriesList[i].code;
          //console.log(countryCode)
          break;
        }
      }
      var url="http://battuta.medunes.net/api/region/"+countryCode+"/all/?key="+BATTUTA_KEY+"&callback=?";
      $.getJSON(url,function(regions)
      {
        //console.log('state list:   '+JSON.stringify(regions))
            $timeout(function(){
             $scope.stateList = regions;
             //console.log("data2",$scope.stateList)
            },100)
      });
    }

    $scope.changeState = function(){
      //console.log('detail -> '+countryCode+' city name -> '+$scope.dashBordFilter.state)
      var url="http://battuta.medunes.net/api/city/"+countryCode+"/search/?region="+$scope.myFrom.state+"&key="+BATTUTA_KEY+"&callback=?";
      $.getJSON(url,function(cities)
      {
        // console.log('city list:   '+JSON.stringify(cities))
            $timeout(function(){
             $scope.cityList = cities;
             console.log("data3",$scope.cityList)
            },100)
      })
    }
    //-------------------------------END OF SELECT CASCADING-------------------------//
})
