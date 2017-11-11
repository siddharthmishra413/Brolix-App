app.controller('createOfferCtrl', function($scope, $state, $window, userService, $state, toastr, $stateParams, $http ){
    $(window).scrollTop(0, 0);
    $scope.$emit('headerStatus', 'Manage Cards');
    $scope.$emit('SideMenu', 'Manage Cards');
    $scope.myForm = {};
    $scope.first = true;
    $scope.second = false;
    $scope.third = false;
    $scope.createOfferArray = [];

    $scope.cancle = function(){
        $state.go('header.manageCards');
    }
    $scope.ttogle = function () {
      console.log("sss")
      $("#login_Box_Div").toggle();
      $(this).toggleClass('class1')
    }

    // $('#buttonLogin').on('click', function(e){
      
    // });

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
        BootstrapDialog.show({
        title: 'Apply Offer',
        message: 'Are you sure want to Apply this Offer',
        buttons: [{
            label: 'Yes',
            action: function(dialog) {
                userService.createOffer($scope.myForm).success(function(res){
                  //console.log("dataaaaaaaaaa",res.data)
                  if (res.responseCode == 200){
                      dialog.close();
                      $state.go('header.manageCards')
                      toastr.success(res.responseMessage);
                  } else if(res.responseCode == 400) {
                      toastr.error(res.responseMessage);
                      $state.go('login')
                  }
                  else {
                      toastr.error(res.responseMessage);
                  }

              })    
            }
        }, {
            label: 'No',
            action: function(dialog) {
                dialog.close();
            }
        }]
      });   
    }

    $scope.showCardDetails = function(id){
      // $scope.user.photo = '';
      console.log("iddddddddd",id)
      
      $scope.createOfferArray.push(id);

      // userService.showCardDetails(id).success(function(res){
      //   $scope.cardDetails = res.data;
      // })

      console.log($scope.createOfferArray);

    }
})

app.filter("filterOnView",function() {
     return function(items,nameValue) {
      //console.log(items+"<--values-->"+nameValue)
       if (!nameValue) {
         return retArray = items;
         }
         var retArray = [];
           for(var i=0;i<items.length;i++)
                {
                  var digit = items[i].viewers.toString();
                   var digit2 = nameValue.toString();
                  //console.log("result:   "+digit)
                  //console.log("result2:   "+digit2)
                if (digit.search(digit2)>=0) {
                    retArray.push(items[i]);
                }
           }
           return retArray;
        }
 });
   app.filter("filterOnLuck",function() {
     return function(items,nameValue) {
      //console.log(items+"<--values-->"+nameValue)
       if (!nameValue) {
         return retArray = items;
         }
         var retArray = [];
           for(var i=0;i<items.length;i++)
                {
                // if (items[i].chances == nameValue) {
                //     retArray.push(items[i]);
                // }
                var digit = items[i].chances.toString();
                   var digit2 = nameValue.toString();
                  //console.log("result:   "+digit)
                  //console.log("result2:   "+digit2)
                if (digit.search(digit2)>=0) {
                    retArray.push(items[i]);
                }
           }
           return retArray;
        }
 });



 