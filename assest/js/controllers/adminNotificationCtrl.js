app.controller('adminNotificationCtrl', function ($scope, $state, $window, userService, uploadimgServeice, $http, toastr,$timeout, spinnerService) {
$(window).scrollTop(0,0);
$scope.$emit('headerStatus', 'Admin Tools');
$scope.$emit('SideMenu', 'Admin Tools');

$scope.key = 'user';
//var data = '';
$scope.getdata = function(data)
{
	$scope.key = data;
}

 userService.notificationToAdmin().success(function(res) {        
    if (res.responseCode == 200){
    	console.log("res",res);
    	$scope.userResult = res.result.userResult;
    	$scope.adsResult = res.result.adsResult;
    	$scope.pageResult = res.result.pageResult;

        console.log("reaaaaaaaaaaaa",JSON.stringify(res))
    } else {
        toastr.error(res.responseMessage);
    }
})


})


app.filter("customFilterUser", function() {
  return function(items, nameValue) {
    if (!nameValue) {
      return retArray = items;
    }
    console.log("no search: "+JSON.stringify(items));
    var retArray = [];
    for (var i = 0; i < items.length; i++) {
      if (items[i].firstName.toLowerCase().substr(0, nameValue.length) == nameValue.toLowerCase()) {
        retArray.push(items[i]);
      }
    }
    return retArray;
  }
});



app.filter("pagesFilter",function() {
     return function(items,nameValue)
     {
       // console.log("items:   "+JSON.stringify(items));
       //  console.log("serach key:     "+nameValue);
       if (!nameValue) {
         return retArray = items;
            }
         var retArray = [];
           for(var i=0;i<items.length;i++) 
               {
               console.log("item[i].pageName:      " +items[i].pageName);
             if(items[i].pageName == null || items[i].pageName == 'undefined' || items[i].pageName == null)
              {
                console.log("no data ");
             }else if(items[i].pageName.toString().substr(0,nameValue.length) == nameValue.toString() || items[i].pageName.toLowerCase().substr(0,nameValue.length) == nameValue.toLowerCase()) {
                retArray.push(items[i]);
               }
           
       }
           return retArray
     }
 })