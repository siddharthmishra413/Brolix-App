app.controller('managePagesCtrl', function ($scope,$window,$state,userService,toastr,$http,$timeout) {
$(window).scrollTop(0,0);
$scope.class = false;
 $scope.$emit('headerStatus', 'Manage Pages');
 $scope.$emit('SideMenu', 'Manage Pages');
 $scope.tab = 'totalPages';
 $scope.myForm = {};
 $scope.sendMessage = {};
 $scope.active_upgrade_card=true;
 $scope.cardType = 'upgrade_card';
 localStorage.setItem('pageTypeName','totalPages');


 userService.countryListData().success(function(res) {
      //console.log("ddd",JSON.stringify(res))
      $scope.countriesList = res.result;
    })
 
    $scope.changeCountry = function(){
      var obj = {};
      obj = {
        country:$scope.dashBordFilter.country,
      }
      userService.cityListData(obj).success(function(res) {
      //console.log("ddd",JSON.stringify(res))
      $scope.cityList = res.result;
    })
}


 userService.listOfCategory().success(function(res) {
    //console.log(JSON.stringify(res))
        if (res.responseCode == 200){
            $scope.category= res.result;
            //console.log("category",JSON.stringify(res))
        }else{
            toastr.error("Something went wrong")
        } 

    })



//  userService.showListOFCouponWithoutPagination().success(function(res) {
//   //console.log("resssssssssssssss",res)
//     $scope.allCoupons = res.result;
//     //console.log("allCoupons",$scope.allCoupons);
// })




 $scope.total_user_cash = function (modal) {
    $("#sendcashModelAllUser").modal('show'); 
}

$scope.send_cashall = function(modal){ 
var array =[];
var data = {};
for (var i = 0; i < $scope.allAdminPages.length; i++) {
        array.push($scope.allAdminPages[i]._id)
    }
    data = {
        Cash:$scope.sendCash.Cash,
        Id:array
    }
    //console.log("data",data)
    userService.sendBrolixAndCashAllUser(data).success(function(res) {        
        if (res.responseCode == 200){
            toastr.success("Cash Send successfully to All User");
            $scope.sendCash = '';
            $("#sendcashModelAllUser").modal('hide'); 
        } else {
            toastr.error(res.responseMessage);
        }
    })
}

/*-----------------------------------------*/


/*----------send Brolix------------------*/

//  $scope.total_user_brolix = function (modal) {
//         $("#sendbrolixModelAllUser").modal('show'); 
//     }


// $scope.send_brolix = function(modal){
// var array =[];
// var data = {};

// for (var i = 0; i < $scope.allAdminPages.length; i++) {
//         array.push($scope.allAdminPages[i]._id)
//     }
//     data = {
//         Brolix:$scope.sendBrolix.brolix,
//         Id:array
//     }
//     console.log("seccccccccccccccccccc",data)
//     userService.sendBrolixAndCashAllUser(data).success(function(res) {        
//         if (res.responseCode == 200){
//             toastr.success("Brolix Send successfully to All User");
//             $scope.sendBrolix = '';
//             $("#sendbrolixModelAllUser").modal('hide'); 
//         } else {
//             toastr.error(res.responseMessage);
//         }
//     })
// }
/*----------------------------------------*/


/*------------------Send Card------------------*/
//  $scope.total_user_card = function () {
//         $("#showAllCard").modal('show');
//     }

// $scope.sendCard = function(id){
//  console.log("id",id);
//  $scope.cardID = id;
//  var array =[];
//  var data = {};

//  for (var i = 0; i < $scope.allAdminPages.length; i++) {
//         array.push($scope.allAdminPages[i]._id)
//     }
//     data = {
//         cardId:$scope.cardID,
//         Id:array
//     }
//     console.log("dataIn",data)
//     // userService.sendMassageAllUser(data).success(function(res) {        
//     //     if (res.responseCode == 200){
//     //         toastr.success("Message Send Successfully to All User");
//     //         $scope.sendMessage = '';
//     //         $("#sendMessageModelAllUser").modal('hide'); 
//     //     } else {
//     //         toastr.error(res.responseMessage);
//     //     }
//     // })
// }

// $scope.total_user_coupons = function (modal) {
//     $("#showAllCoupons").modal('show');
// }

// $scope.sendCoupons = function(couponId){
//  var array =[];
//  var data = {};
//  for (var i = 0; i < $scope.allAdminPages.length; i++) {
//         array.push($scope.allAdminPages[i]._id)
//     }
//     data = {
//         couponId:$scope.couponId,
//         Id:array
//     }
//     console.log("dataIn",data)
//     userService.sendCouponTOUSers(data).success(function(res) {        
//         if (res.responseCode == 200){
//             toastr.success("Send Coupon to All User");
//             $scope.sendMessage = '';
//             $("#sendMessageModelAllUser").modal('hide'); 
//         } else {
//             toastr.error(res.responseMessage);
//         }
//     })
// }

// userService.viewcard($scope.cardType).success(function(res) {
//       //console.log("resssssssssssssss",res)
//         $scope.UpgradeCard = res.data;
//         //console.log("UpgradeCard",$scope.UpgradeCard);
//     })


// $scope.active_tab=function(active_card){
//         if(active_card=='upgrade_card'){
//         $scope.active_upgrade_card=true;
//          $scope.active_luck_card=false;
//       }else{
//         userService.viewcard(active_card).success(function(res) {
//         console.log("resssssssssssssss",res)
//         $scope.LuckCard = res.data;
//         console.log("LuckCard",$scope.LuckCard);
//     })
//          $scope.active_upgrade_card=false;
//             $scope.active_luck_card=true;
//       }
//     }


/*----------------------------------------------------*/

 $scope.pageTypeName = function(val) {
    localStorage.setItem('pageTypeName',val);

    $scope.currentTotalPages = 1;
     $scope.nextTotalPagesDetail();
    
     $scope.currentunPublishedPage = 1;
     $scope.nextunPublishedPageDetail();

     $scope.currentBlockedPage = 1;
     $scope.nextBlockedPageDetail();

     $scope.currentRemovedPages = 1;
     $scope.nextRemovedPagesDetail();
 }

// userService.countrys().success(function(res) {
//      $scope.allCountriesfind = res.result;
//     }).error(function(status, data) {
// })

userService.allAdminPages().success(function(res) {
    $scope.allAdminPages = res.result;
     $scope.allAdminPagesCount = res.count;
     //console.log("ffffffff",res)
     
    }).error(function(status, data) {
})

// $scope.catId = function() {
//     //console.log($scope.dashBordFilter.country);
//     var country = $scope.dashBordFilter.country
//     $http.get('/admin/getAllStates/' + country.code + '/ISO2').success(function(res) {
//         //console.log(res);
//         $scope.allstates = res.result;
//     }, function(err) {});
// }

// $scope.slectCountry = function(qq){
//         //console.log("dashBordFilter.country----------",$scope.dashBordFilter.country);
//         userService.allstatefind($scope.dashBordFilter.country).success(function(res) {
//         $scope.allstatefind = res.result;
//     })
// }

$scope.dashBordFilter = function(){

    var type = localStorage.getItem('pageTypeName');
    console.log("type",type)
    //console.log("date",$scope.dashBordFilter.country);
    var data = {};
        data = {
            pageType:localStorage.getItem('pageTypeName'),
            country:$scope.dashBordFilter.country,
            state:$scope.dashBordFilter.state,
            city:$scope.dashBordFilter.city,
            category:$scope.dashBordFilter.categories,
            joinTo:$scope.dashBordFilter.dobTo,
            joinFrom:$scope.dashBordFilter.dobFrom,
        }
        console.log("datatata",JSON.stringify(data))

    switch (type)
            {
                case 'totalPages':
                console.log("13434")
                    userService.pagefilter(data).success(function(res){
                      console.log("res",JSON.stringify(res))
                      if (res.responseCode == 200){
                           $scope.totalPages = res.data;
                           $scope.totalPagesCount = res.data.length;
                       } 
                       else {
                        toastr.error(res.responseMessage);
                        }
                // console.log("1"); 
                //     userService.pagefilter(data).success(function(res){
                //         $scope.totalUser = res.data;
                //         console.log("ressssssss1",res);
                })
                    
                break;

                case 'unpublishedPages':
                console.log("cccccvvvvv")

                    userService.pagefilter(data).success(function(res){
                      console.log("res",JSON.stringify(res))
                      if (res.responseCode == 200){
                           $scope.unPublishedPage= res.data;
                           $scope.unPublishedPageCount = res.data.length;
                       } 
                       else {
                        toastr.error(res.responseMessage);
                        }
                    })
                    
                break;

                case 'removedPages': 
                //console.log("3");
                    $scope.currentPage = 1;
                    userService.pagefilter(data).success(function(res){
                      console.log("res",JSON.stringify(res))
                      if (res.responseCode == 200){
                           $scope.showAllRemovedPage= res.data;
                           $scope.showAllRemovedPageCount = res.data.length;
                       } 
                       else {
                        toastr.error(res.responseMessage);
                        }
                        //console.log("ressssssss3",JSON.stringify($scope.businessUser));
                    })
                    
                break;

                case 'blockedPages': 
                //console.log("4");
                    userService.pagefilter(data).success(function(res){
                      console.log("res",JSON.stringify(res))
                              if (res.responseCode == 200){
                           $scope.showAllBlockedPage = res.data;
                           $scope.showAllBlockedPageCount = res.data.length;
                       } 
                       else {
                        toastr.error(res.responseMessage);
                        }

                    })
                    
                break;

                default: 
                toastr.error("somthing wents to wroung");
            }

    }


 $scope.export = function(){
    html2canvas(document.getElementById('managePageTable'), {
        onrendered: function (canvas) {
            var data = canvas.toDataURL();
            var docDefinition = {
                content: [{
                    image: data,
                    width: 500,
                }]
            };
            pdfMake.createPdf(docDefinition).download("Report.pdf");
        }
    });
 }

     $scope.clicktab =function(){
        //console.log("dasdad");
     }


     $scope.sendMessagePage = function (modal) {

        $scope.modalId = modal;
        $scope.modelData = modal;
        if($scope.modalId == '' || $scope.modalId == undefined || $scope.modalId == null){
        toastr.error("Please select user.")
        $state.go('header.managePages')
        }else {
            $("#sendMessageModelAllUser").modal('show');
        }
    }

// totalPages unPublishedPage pagesAdmins
    $scope.send_massage = function(){
         var array =[];
         var data = {};
         //console.log("222222",$scope.modelData);
         switch ($scope.modelData)
            {
                case 'totalPages': 
                    for (var i = 0; i < $scope.totalPages.length; i++) {
                        array.push($scope.totalPages[i]._id)
                    }
                    data = {
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                    //console.log("dadadata",data);
                    userService.sendMassageAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Message Send Successfully to All Page Owner");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide'); 
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'unPublishedPage': 
                    for (var i = 0; i < $scope.unPublishedPage.length; i++) {
                        array.push($scope.unPublishedPage[i]._id)
                    }
                    data = {
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                    userService.sendMassageAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Message Send Successfully to All UnPublished Page Owner");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide'); 
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                case 'pagesAdmins': 
                    for (var i = 0; i < $scope.allAdminPages.length; i++) {
                        array.push($scope.allAdminPages[i]._id)
                    }
                    data = {
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                    //console.log("luuuuuuuuuuuuuu",data)
                    userService.sendMassageAllUser(data).success(function(res) {        
                        if (res.responseCode == 200){
                            toastr.success("Message Send Successfully to All UnPublished Page Owner");
                            $scope.sendMessage = '';
                            $("#sendMessageModelAllUser").modal('hide'); 
                        } else {
                            toastr.error(res.responseMessage);
                        }
                    })
                break;

                default: 
                array.push($scope.modalId)
                    data = {
                        Message:$scope.sendMessage.massage,
                        Id:array
                    }
                   // console.log("sadaaaaaaa",data)
                    // userService.sendMassageAllUser(data).success(function(res) {        
                    //     if (res.responseCode == 200){
                    //         toastr.success("Message Send Successfully to User");
                    //         $scope.sendMessage = '';
                             $("#sendMessageModelAllUser").modal('hide'); 
                    //     } else {
                    //         toastr.error(res.responseMessage);
                    //     }
                    // })
            }

    }

    // $scope.blockPage = function (id) {
    //     var data = {};
    //     $scope.BlockId = id;
    //     if ($scope.BlockId == '' || $scope.BlockId == undefined || $scope.BlockId == null) {
    //     toastr.error("Please select user.")
    //     $state.go('header.managePages')
    //     }else {
    //     BootstrapDialog.show({
    //         title: 'Block User',
    //         message: 'Are you sure want to block this Page',
    //         buttons: [{
    //             label: 'Blocked',
    //             action: function(dialog) {
    //                 toastr.success("User Blocked");

    //                 // var data = {};
                    
    //                 // data{
    //                 //     pageId:$scope.BlockId,
    //                 //     status:'Blocked'
    //                 // }
    //                 // console.log("aaaaaaaaaaaaaa",data);
    //                 // userService.BlockUser(data).success(function(res) {        
    //                 //     if (res.responseCode == 200){
    //                 //         dialog.close();
    //                 //         toastr.success("User Blocked");
    //                 //     } else {
    //                 //         toastr.error(res.responseMessage);
    //                 //     }
    //                 // }) 
                    
    //             }
    //         }, {
    //             label: 'UnBlocked',
    //             action: function(dialog) {
    //                 toastr.success("User UnBlocked");

    //                 // var data = {};

    //                 // data{
    //                 //     pageId:$scope.BlockId,
    //                 //     status:'UnBlocked'
    //                 // }
    //                 // console.log("bbbbbbbbbbbb",data);
    //                 // userService.BlockUser(data).success(function(res) {        
    //                 //     if (res.responseCode == 200){
    //                 //         dialog.close();
    //                 //         toastr.success("User Blocked");
    //                 //     } else {
    //                 //         toastr.error(res.responseMessage);
    //                 //     }
    //                 // })
    //                 dialog.close();
    //                 // toastr.success("User Blocked");
    //             }
    //         }]
    //     });
    // }
    // }

    $scope.blockPage = function (id) {
        $scope.BlockId = id;
        var userId = $scope.BlockId;
        //console.log("Blockid",userId);
        if ($scope.BlockId == '' || $scope.BlockId == undefined || $scope.BlockId == null) {
        toastr.error("Please select user.")
        $state.go('header.managePages')
        }else {
        BootstrapDialog.show({
            title: 'Block Page',
            message: 'Are you sure want to block this page',
            buttons: [{
                label: 'Yes',
                action: function(dialog) {
                    userService.blockPage(userId).success(function(res) {        
                        if (res.responseCode == 200){
                            dialog.close();
                            toastr.success("Page Blocked");
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
                    // toastr.success("User Blocked");
                }
            }]
        });
    }
    }

    $scope.unblockPage = function (id) {
        $scope.BlockId = id;
        var userId = $scope.BlockId;
        //console.log("Blockid",userId);
        if ($scope.BlockId == '' || $scope.BlockId == undefined || $scope.BlockId == null) {
        toastr.error("Please select user.")
        $state.go('header.managePages')
        }else {
        BootstrapDialog.show({
            title: 'Block Page',
            message: 'Are you sure want to block this page',
            buttons: [{
                label: 'Yes',
                action: function(dialog) {
                    userService.unblockPage(userId).success(function(res) {        
                        if (res.responseCode == 200){
                            dialog.close();
                            toastr.success("Page Blocked");
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
                    // toastr.success("User Blocked");
                }
            }]
        });
    }
    }






    // $scope.blockUnblockPage = function(id){

    //     var data = {};

    //     data = {
    //         pageId:$scope.pageID,
    //         status:$scope.status
    //     }
    //     userService.blockUnblockPage(data).success(function(res){
    //         if(res.responseCode == 200){
    //             console.log("result",result);
    //             toastr.success(res.responseMessage);
    //         }else {
    //             toastr.error(res.responseMessage);
    //         }

    //     })
    // }

    $scope.currentTotalPages = 1;
     $scope.nextTotalPagesDetail = function(){
         userService.totalPages().success(function(res) { 
             //console.log("val",JSON.stringify(res))
            
            if (res.responseCode == 200){
                   // $scope.noOfPagesTotalPages = res.result.pages;
                   // $scope.pageTotalPages= res.result.page;
                   $scope.totalPages = res.result;
                   //console.log("$scope.totalPages",JSON.stringify($scope.totalPages));
                   $scope.totalPagesCount = res.result.length;
               } 
               else {
                toastr.error(res.responseMessage);
                }
          })
     }
     $scope.nextTotalPagesDetail();
     $scope.nextTotalPages = function(){
        $scope.currentTotalPages++;
        $scope.nextTotalPagesDetail();
     }
     $scope.preTotalPages= function(){
        $scope.currentTotalPages--;
        $scope.nextTotalPagesDetail();
     }
  

 // userService.totalPages().success(function(res) {
 //    if (res.responseCode == 200){
 //            $scope.totalPages = res.result;
 //            //console.log("totalllllpage",JSON.stringify($scope.totalPages));
 //        } else {
 //            toastr.error(res.responseMessage);
 //        }        
 //    })

 $scope.currentBlockedPage = 1;
     $scope.nextBlockedPageDetail = function(){
         userService.showAllBlockedPage($scope.currentBlockedPage).success(function(res) { 
            // console.log("val",JSON.stringify(res))
            if (res.responseCode == 200){

                   $scope.showAllBlockedPage = res.result;
                   $scope.showAllBlockedPageCount = res.result.length;
               } 
               else {
                toastr.error(res.responseMessage);
                }
          })
     }
     $scope.nextBlockedPageDetail();
     $scope.nextBlockedPage = function(){
        $scope.currentBlockedPage++;
        $scope.nextBlockedPageDetail();
     }
     $scope.preBlockedPage= function(){
        $scope.currentBlockedPage--;
        $scope.nextBlockedPageDetail();
     }


    // userService.showAllBlockedPage().success(function(res) {
    // if (res.responseCode == 200){
    //         $scope.showAllBlockedPage = res.result;
    //         $scope.showAllBlockedPageCount = res.count;
    //         //console.log("showAllBlockedPage",JSON.stringify($scope.showAllBlockedPageCount))
    //         } else {
    //             //console.log("zxzxzxzxz",JSON.stringify($scope.showAllBlockedPage))
    //         toastr.error(res.responseMessage);
    //     }        
    // })


    $scope.currentunPublishedPage = 1;
     $scope.nextunPublishedPageDetail = function(){
         userService.unPublishedPage().success(function(res) { 
             // console.log("val",JSON.stringify(res))
            if (res.responseCode == 200){
                   $scope.unPublishedPage= res.result;
                   $scope.unPublishedPageCount = res.result.length;
               } 
               else {
                toastr.error(res.responseMessage);
                }
          })
     }
     $scope.nextunPublishedPageDetail();
     $scope.nextunPublishedPage = function(){
        $scope.currentunPublishedPage++;
        $scope.nextunPublishedPageDetail();
     }
     $scope.preunPublishedPage= function(){
        $scope.currentunPublishedPage--;
        $scope.nextunPublishedPageDetail();
     }

    // userService.unPublishedPage().success(function(res){
    //     if (res.responseCode == 200){
    //         $scope.unPublishedPage = res.data;
    //         //console.log("zxzxzxzxz",JSON.stringify($scope.unPublishedPage))
    //         } else {
    //         toastr.error(res.responseMessage);
    //     } 
    // })

    $scope.currentRemovedPages = 1;
     $scope.nextRemovedPagesDetail = function(){
         userService.showAllRemovedPage($scope.currentRemovedPages).success(function(res) { 
             // console.log("val",JSON.stringify(res))
            if (res.responseCode == 200){
                   $scope.showAllRemovedPage= res.result;
                   //console.log(JSON.stringify($scope.showAllRemovedPage))
                   $scope.showAllRemovedPageCount = res.result.length;
               } 
               else {
                toastr.error(res.responseMessage);
                }
          })
     }
     $scope.nextRemovedPagesDetail();
     $scope.nextRemovedPages = function(){
        $scope.currentRemovedPages++;
        $scope.nextRemovedPagesDetail();
     }
     $scope.preRemovedPages= function(){
        $scope.currentRemovedPages--;
        $scope.nextRemovedPagesDetail();
     }

    // userService.showAllRemovedPage().success(function(res){
    //     console.log("aaaaaaaaaaa",JSON.stringify(res))
    //     if (res.responseCode == 200){
    //         $scope.showAllRemovedPage = res.result;
    //         $scope.showAllRemovedPageCount = res.count;
    //         //console.log("lllllllllllll",JSON.stringify(res))
    //         } else {
    //         //toastr.error(res.responseMessage);
    //         $scope.showAllRemovedPage = res.count;
           
    //     } 
    // })


    $scope.Remove_User = function (id) {
        $scope.RemoveId = id;
        var userId = $scope.RemoveId;
        //console.log("Blockidvcbc");

        if ($scope.RemoveId == '' || $scope.RemoveId == undefined || $scope.RemoveId == null) {
       toastr.error("Please select user.")
       $state.go('header.managePages')
    } else {
    BootstrapDialog.show({
        title: 'Remove User',
        message: 'Are you sure want to Remove this User',
        buttons: [{
            label: 'Yes',
            action: function(dialog) {
                userService.removePage(userId).success(function(res) {        
                    if (res.responseCode == 200){
                        dialog.close();
                        toastr.success("Page removed Successfully");
                        $state.reload();
                    } else if(res.responseCode == 404){
                        toastr.error(res.responseMessage);
                    }
                })    
            }
        }, {
            label: 'No',
            action: function(dialog) {
                dialog.close();
                // toastr.success("User Blocked");
            }
        }]
    });
    }
}
/*show Adds*/

$scope.showAdds = function(id){
    console.log("llllllllllll",id);
    userService.showAdds(id).success(function(res){
        console.log("resssssss",JSON.stringify(res))
        if(res.responseCode == 200){
            $scope.allAddsOnPage=res.result;
            //console.log("res",JSON.stringify(res));
            $("#adsDetails").modal('show');

        }else{
           toastr.error(res.responseMessage);
        }
    })
}


/*ownerDetails*/

$scope.ownerDetails = function(id){
    //console.log("iddddd",id)


userService.userInfo(id).success(function(res) { 
    //console.log("resssssssss",JSON.stringify(res))
         $("#ownerDetails").modal('show');
        // if (res.responseCode == 200){
            
        //    } 
        //    else {
        //     toastr.error(res.responseMessage);
        //     }
      })


}

/*show winners*/

$scope.showWinners = function(id){
    console.log("iddddd",id);
    userService.showPageWinner(id).success(function(res){
        if(res.responseCode == 200){
            $scope.allWinnerOnPage=res.result;
            $scope.allshowUserPage = res.result;
            console.log("res",JSON.stringify(res.result));
            $("#pageWinnerDetails").modal('show');

        }else{
           toastr.error(res.responseMessage);
        }
       // console.log("res",res);
    })
}

/*show Admin Pages*/

$scope.showAdminPages = function(id){
    console.log("iddddd",id);
    userService.showAdminPages(id).success(function(res){
      console.log("ssdsd",JSON.stringify(res))
        if(res.responseCode == 200){
            $scope.allAdminOnPages=res.result;
            //console.log("res----------------",JSON.stringify(res.result));
            $("#pageAdminDetails").modal('show');

        }else{
           toastr.error(res.responseMessage);
        }
    })
   }
})

app.filter("pagesFilter",function() {
     return function(items,nameValue)
     {
       console.log("items:   "+JSON.stringify(items));
        console.log("serach key:     "+nameValue);
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



