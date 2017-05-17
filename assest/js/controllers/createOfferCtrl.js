app.controller('createOfferCtrl', function($scope, $state, $window, userService, $state, toastr, $stateParams, $http ){
    $(window).scrollTop(0, 0);
    $scope.$emit('headerStatus', 'Manage Cards');
    $scope.$emit('SideMenu', 'Manage Cards');
    $scope.myForm = {};
    $scope.first = true;
    $scope.second = false;
    $scope.third = false;

    $scope.cancle = function(){
        $state.go('header.manageCards');
    }

    $scope.checkVal = function(){
        if($scope.myForm.cardType == null){
            toastr.error("Please select Card Type");
        }else{
            toastr.success("You Chose "+$scope.myForm.cardType);
        }
    }


    $scope.createOffer = function(type){
        //console.log("ddddddddd",$scope.myForm.cardType)
        if(type=='upgradeCard'){
            $scope.first = false;
            $scope.second = true;
            $scope.third = false;
            userService.viewcard('upgrade_card').success(function(res){
                //console.log("darartara",$scope.myForm);
                $scope.UpgradeCard = res.data;
                //console.log("$scope.UpgradeCard$scope.UpgradeCard",$scope.UpgradeCard)
            })  
        }else if(type=='luckCard'){
            $scope.first = false;
            $scope.second = false;
            $scope.third = true;
            userService.viewcard('luck_card').success(function(res){
                //console.log("darartara",$scope.myForm);
                $scope.UpgradeCard = res.data;
                //console.log("$scope.UpgradeCard$scope.UpgradeCard",$scope.UpgradeCard)
            })
        }
        else{
            toastr.error("Something Wents to wrong")
        }   
    }

    $scope.createOfferNext = function(id){
        $scope.myForm.id = id;
        var date = new Date().getTime();
        date = date + $scope.myForm.offerTime*60*60*1000;
        // var utcDate = new Date(date).toUTCString();
        
        $scope.myForm.offerTime = date;
        
        console.log("$scope.myForm",$scope.myForm);
        userService.createOffer($scope.myForm).success(function(res){
            //console.log("dataaaaaaaaaa",res.data)
            if (res.responseCode == 200){
                $state.go('header.manageCards')
                toastr.success(res.responseMessage);
            } else if(res.responseCode == 400) {
                toastr.error(res.responseMessage);
                $state.go('login')
            }
            else {
            toastr.error(res.responseMessage);
            $state.go('login')
            }

        })
        
    }

    $scope.showCardDetails = function(id){
      // $scope.user.photo = '';
      //console.log("iddddddddd",id)
      userService.showCardDetails(id).success(function(res){
        $scope.cardDetails = res.data;
        //console.log("$scope.cardDetails",$scope.cardDetails)
      })

    }
})

app.filter("filterOnView",function() {
     return function(items,nameValue) {
      console.log(items+"<--values-->"+nameValue)
       if (!nameValue) {
         return retArray = items;
         }
         var retArray = [];
           for(var i=0;i<items.length;i++)
                {
                  var digit = items[i].viewers.toString()[1];
                  console.log("result:   "+digit.search(nameValue))
                if (items[i].viewers == nameValue) {
                    retArray.push(items[i]);
                }
           }
           return retArray;
        }
 });
   app.filter("filterOnLuck",function() {
     return function(items,nameValue) {
      console.log(items+"<--values-->"+nameValue)
       if (!nameValue) {
         return retArray = items;
         }
         var retArray = [];
           for(var i=0;i<items.length;i++)
                {
                if (items[i].chances == nameValue) {
                    retArray.push(items[i]);
                }
           }
           return retArray;
        }
 });



 