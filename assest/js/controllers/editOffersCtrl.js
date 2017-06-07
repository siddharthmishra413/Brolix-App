app.controller('createOfferCtrl', function($scope, $state, $window, userService, $state, toastr, $stateParams, $http ){
    $(window).scrollTop(0, 0);
    $scope.$emit('headerStatus', 'Manage Cards');
    $scope.$emit('SideMenu', 'Manage Cards');
    $scope.myForm = {};
    $scope.first = true;
    $scope.second = false;
    $scope.third = false;
    



    $scope.type = $stateParams.type;
    $scope.idDetails = $stateParams.id;
    console.log("type===",$scope.type,$scope.idDetails)

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
      //console.log("iddddddddd",id)
      userService.showCardDetails(id).success(function(res){
        $scope.cardDetails = res.data;
        //console.log("$scope.cardDetails",$scope.cardDetails)
      })

    }
})




 