app.controller('adminReportsCtrl', function($scope, $window, userService, $state, toastr, $http, $timeout) {
    $(window).scrollTop(0, 0);
    $scope.$emit('headerStatus', 'Admin Tools');
    $scope.$emit('SideMenu', 'Admin Tools');
    $scope.key = 'user';
    $scope.getdata = function(data)
    {
        $scope.key = data;
    }
    $scope.openMessage = function(message){
        $scope.reportMessage = message;
        $("#adInfo").modal('show');
    }
    

    userService.showReportedAd().success(function(res) {
        console.log("val", JSON.stringify(res))
        if (res.responseCode == 404) {
            toastr.error(res.responseMessage);
            $state.go('login')
        } else if (res.responseCode == 200) {
            $scope.allReportsAdsType = res.userType;
            $scope.allReportsuserType = res.AdsType;
        } else if (res.responseCode == 400) {
            toastr.error(res.responseMessage);
        } else {
            toastr.error(res.responseMessage);
        }
    })

})
app.filter("customUserReports", function() {
  return function(items, nameValue) {
    console.log("name =>"+nameValue+","+"items"+JSON.stringify(items))
    if (!nameValue) {
      return retArray = items;
    }
    //console.log("no search: "+JSON.stringify(items));
    var retArray = [];
    for (var i = 0; i < items.length; i++) {
        var userNameFilter = items[i].userId.firstName +" "+ items[i].userId.lastName;
        console.log("user name =>"+userNameFilter)
      if (userNameFilter.toLowerCase().substr(0, nameValue.length) == nameValue.toLowerCase()) {
        retArray.push(items[i]);
      }
    }
    return retArray;
  }
});



app.filter("customAd", function() {
  return function(items, nameValue) {
    console.log("name =>"+nameValue+","+"items"+JSON.stringify(items))
    if (!nameValue) {
      return retArray = items;
    }
    //console.log("no search: "+JSON.stringify(items));
    var retArray = [];
    for (var i = 0; i < items.length; i++) {
        var userNameFilter = items[i].userId.firstName +" "+ items[i].userId.lastName;
        console.log("user name =>"+userNameFilter)
      if (userNameFilter.toLowerCase().substr(0, nameValue.length) == nameValue.toLowerCase()) {
        retArray.push(items[i]);
      }
    }
    return retArray;
  }
});