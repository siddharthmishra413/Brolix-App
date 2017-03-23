app.controller('addUserCtrl', function($scope, $state, $window, userService, $http, toastr) {
    $(window).scrollTop(0, 0);
    $scope.$emit('headerStatus', 'Manage User');
    $scope.$emit('SideMenu', 'Manage User');

    $scope.myFrom = {};

    // userService.countrys().success(function(res) {
    //     $scope.country = res.result;
    // }).error(function(status, data) {

    // })
  
    // $scope.getzipCode = function() {
    //     console.log("")
    //     var data = {};
    //     data = {
    //         lat:$scope.lat,
    //         lng:$scope.lng
    //     }
    //     console.log("data",data)

    // userService.zipcodFunction(data).success(function(res) {
    //     $scope.getzipCode = res.result;
    //     console.log("res------",res.result)
    // }).error(function(status, data) {

    // })

    // }





    // $scope.catId = function() {
    //     console.log($scope.myFrom.country);
    //     var country = $scope.myFrom.country
    //     $http.get('/admin/getAllStates/' + country.code + '/ISO2').success(function(res) {
    //         console.log(res);
    //         $scope.allstates = res.result;
    //     }, function(err) {});
    // }


    $scope.addUser = function() {
        $scope.myFrom.type = "USER";
        $scope.myFrom.country = $scope.country;
        $scope.myFrom.city = $scope.city;
        $scope.myFrom.state = $scope.state;
        console.log("mmmmmm111111",$scope.myFrom)
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


    var currentCities=[];
    $scope.currentCountry= '';

// This is a demo API key that can only be used for a short period of time, and will be unavailable soon. You should rather request your API key (free)  from http://battuta.medunes.net/
var BATTUTA_KEY="00000000000000000000000000000000"
    // Populate country select box from battuta API
  url="http://battuta.medunes.net/api/country/all/?key="+BATTUTA_KEY+"&callback=?";
    $.getJSON(url,function(countries)
    {
      $scope.countryList = countries;
      console.log("$scope.countryList",JSON.stringify($scope.countryList))
      //$('#country').material_select();
      //loop through countries..
      $.each(countries,function(key,country)
      {
          $("<option></option>")
                  .attr("value",country.code)
                  .append(country.name)
                        .appendTo($("#country"));

      });
      // trigger "change" to fire the #state section update process
    //   $("#country").material_select('update');
    //   $("#country").trigger("change");


    });

    $("#country").on("change",function()
    {

      countryCode=$("#country").val();
      $scope.currentCountry = countryCode;
      // Populate country select box from battuta API
      url="http://battuta.medunes.net/api/region/"
      +countryCode
      +"/all/?key="+BATTUTA_KEY+"&callback=?";
      $.getJSON(url,function(regions)
      {
        //console.log('regions:   '+JSON.stringify(regions))
        $scope.stateList = regions;
        console.log("$scope.stateList",$scope.stateList)
        // $("#region option").remove();
        //loop through regions..
        // $.each(regions,function(key,region)
        // {
        //     $("<option></option>")
        //             .attr("value",region.region)
        //             .append(region.region)
        //                   .appendTo($("#region"));
        // });
        // trigger "change" to fire the #state section update process
        // $("#region").material_select('update');
        // $("#region").trigger("change");

      });

    });
    $("#region").on("change",function()
    {

      // Populate country select box from battuta API

      //countryCode=$("#country").val();
    region=$("#region").val();
    // alert($scope.currentCountry+'\n'+region)
      url="http://battuta.medunes.net/api/city/"
      +$scope.currentCountry
      +"/search/?region="
      +region
      +"&key="
      +BATTUTA_KEY
      +"&callback=?";

      $.getJSON(url,function(cities)

      {
          //console.log('cities:   '+JSON.stringify(cities))
        currentCities=cities;
        console.log("cities",cities)
          var i=0;
          $("#city option").remove();

        //loop through regions..
        $.each(cities,function(key,city)
        {
            $("<option></option>")
                    .attr("value",i++)
                    .append(city.city)
                    .appendTo($("#city"));
        });
        // trigger "change" to fire the #state section update process
        // $("#city").material_select('update');
        // $("#city").trigger("change");

      });

    });
    $("#city").on("change",function()
    {
      currentIndex=$("#city").val();
      currentCity=currentCities[currentIndex];
      city=currentCity.city;
      region=currentCity.region;
      country=currentCity.country;
      // $scope.city=currentCity.city;
      // $scope.region=currentCity.region;
      // $scope.country=currentCity.country;

      console.log("lat,long",city,region,country)

    });

})