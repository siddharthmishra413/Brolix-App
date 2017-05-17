app.controller('removeCardCtrl', function($scope, $window, userService, $state, toastr, $stateParams, $http) {
  $(window).scrollTop(0, 0);
  $scope.$emit('headerStatus', 'Manage Cards');
  $scope.$emit('SideMenu', 'Manage Cards');
  $scope.allCards = {};
  $scope.active_upgrade_card=true;
  $scope.cardType = 'upgrade_card';

  userService.viewcard($scope.cardType).success(function(res) {
    if (res.responseCode == 200){
      $scope.UpgradeCard = res.data;
    }else{
      toastr.error(res.responseMessage);
    }
  })

  $scope.addcardId = function(id){
    BootstrapDialog.show({
      title: 'Remove Card',
      message: 'Are you sure want to remove this Card',
      buttons: [{
          label: 'Yes',
          action: function(dialog) {
              userService.removeCard(id).success(function(res) {        
                  if (res.responseCode == 200){
                      dialog.close();
                      toastr.success("Card Removed Successfully");
                      $state.reload();
                  } else {
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

  $scope.active_tab=function(active_card){
    if(active_card=='upgrade_card'){
      $scope.active_upgrade_card=true;
      $scope.active_luck_card=false;
    }else{
        userService.viewcard(active_card).success(function(res) {
        $scope.LuckCard = res.data;
      })
      $scope.active_upgrade_card=false;
      $scope.active_luck_card=true;
    }
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


