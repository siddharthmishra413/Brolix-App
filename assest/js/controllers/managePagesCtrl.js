app.controller('managePagesCtrl', function ($scope,$window,$state,userService,toastr,$http) {
$(window).scrollTop(0,0);
$scope.class = false;
 $scope.$emit('headerStatus', 'Manage Pages');
 $scope.$emit('SideMenu', 'Manage Pages');
 $scope.tab = 'totalPages';
 $scope.myForm = {};
 $scope.sendMessage = {};


 $scope.userTypeName = function(val) {
    localStorage.setItem('userTypeName',val);
 }

userService.countrys().success(function(res) {
     $scope.allCountriesfind = res.result;
    }).error(function(status, data) {
})

$scope.catId = function() {
    //console.log($scope.dashBordFilter.country);
    var country = $scope.dashBordFilter.country
    $http.get('/admin/getAllStates/' + country.code + '/ISO2').success(function(res) {
        console.log(res);
        $scope.allstates = res.result;
    }, function(err) {});
}

$scope.slectCountry = function(qq){
        console.log("dashBordFilter.country----------",$scope.dashBordFilter.country);
        userService.allstatefind($scope.dashBordFilter.country).success(function(res) {
        $scope.allstatefind = res.result;
    })
}

$scope.dashBordFilter = function(){

    var type = localStorage.getItem('userTypeName');
    $scope.dobTo =$scope.dashBordFilter.dobTo==undefined?undefined : new Date().getTime($scope.dashBordFilter.dobTo);
    $scope.dobFrom =$scope.dashBordFilter.dobFrom==undefined?undefined : new Date().getTime($scope.dashBordFilter.dobFrom);
    $scope.country =$scope.dashBordFilter.country==undefined?undefined : $scope.dashBordFilter.country.name;
    console.log("date",$scope.dashBordFilter.country);
    var data = {};
        data = {
            userType:localStorage.getItem('userTypeName'),
            country:$scope.country,
            state:$scope.dashBordFilter.state,
            city:$scope.dashBordFilter.cities,
            categories:$scope.dashBordFilter.categories,
            joinTo:$scope.dobTo,
            joinFrom:$scope.dobFrom,
        }
        console.log("datatata",data)

    switch (type)
            {
                case 'totalPages':
                console.log("1"); 
                    userService.userfilter(data).success(function(res){
                        $scope.totalUser = res.data;
                        console.log("ressssssss1",JSON.stringify($scope.totalUser));
                    })
                    
                break;

                case 'unPublishedPage': 
                console.log("2");
                    userService.userfilter(data).success(function(res){
                        $scope.personalUser = res.data;
                        console.log("ressssssss2",JSON.stringify($scope.personalUser));
                    })
                    
                break;

                case 'removedPage': 
                console.log("3");
                    userService.userfilter(data).success(function(res){
                        $scope.businessUser = res.data;
                        console.log("ressssssss3",JSON.stringify($scope.businessUser));
                    })
                    
                break;

                case 'blockedPage': 
                console.log("4");
                    userService.userfilter(data).success(function(res){
                        $scope.liveUser = res.data;
                        console.log("ressssssss4",JSON.stringify($scope.liveUser));
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
            pdfMake.createPdf(docDefinition).download("test.pdf");
        }
    });
 }

     $scope.clicktab =function(){
        //console.log("dasdad");
     }


     $scope.sendMessagePage = function (modal) {

        $scope.modalId = modal;
        $scope.modelData = modal;
       //console.log("111111",$scope.modelData);
        if($scope.modalId == '' || $scope.modalId == undefined || $scope.modalId == null){
        toastr.error("Please select user.")
        $state.go('header.managePages')
        }else {
            $("#sendMessageModelAllUser").modal('show');
        }
    }


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
                    // for (var i = 0; i < $scope.unPublishedPage.length; i++) {
                    //     array.push($scope.unPublishedPage[i]._id)
                    // }
                    data = {
                        Message:$scope.sendMessage.massage,
                        //Id:array
                    }
                    //console.log("sssss",data)
                    // userService.sendMassageAllUser(data).success(function(res) {        
                    //     if (res.responseCode == 200){
                    //         toastr.success("Message Send Successfully to All UnPublished Page Owner");
                    //         $scope.sendMessage = '';
                             $("#sendMessageModelAllUser").modal('hide'); 
                    //     } else {
                    //         toastr.error(res.responseMessage);
                    //     }
                    // })
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

    $scope.blockUnblockPage = function (id) {
        var data = {};
        $scope.BlockId = id;
        if ($scope.BlockId == '' || $scope.BlockId == undefined || $scope.BlockId == null) {
        toastr.error("Please select user.")
        $state.go('header.managePages')
        }else {
        BootstrapDialog.show({
            title: 'Block User',
            message: 'Are you sure want to block this User',
            buttons: [{
                label: 'Blocked',
                action: function(dialog) {
                    toastr.success("User Blocked");

                    // var data = {};
                    
                    // data{
                    //     pageId:$scope.BlockId,
                    //     status:'Blocked'
                    // }
                    // console.log("aaaaaaaaaaaaaa",data);
                    // userService.BlockUser(data).success(function(res) {        
                    //     if (res.responseCode == 200){
                    //         dialog.close();
                    //         toastr.success("User Blocked");
                    //     } else {
                    //         toastr.error(res.responseMessage);
                    //     }
                    // }) 
                    
                }
            }, {
                label: 'UnBlocked',
                action: function(dialog) {
                    toastr.success("User UnBlocked");

                    // var data = {};

                    // data{
                    //     pageId:$scope.BlockId,
                    //     status:'UnBlocked'
                    // }
                    // console.log("bbbbbbbbbbbb",data);
                    // userService.BlockUser(data).success(function(res) {        
                    //     if (res.responseCode == 200){
                    //         dialog.close();
                    //         toastr.success("User Blocked");
                    //     } else {
                    //         toastr.error(res.responseMessage);
                    //     }
                    // })
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

//******************** Total Pages***************

    $scope.currentTotalPages = 1;
     $scope.nextTotalPagesDetail = function(){
         userService.totalPages($scope.currentTotalPages).success(function(res) { 
            // console.log("val",JSON.stringify(res))
            if (res.responseCode == 200){
                   $scope.noOfPagesTotalPages = res.result.pages;
                   $scope.pageTotalPages= res.result.page;
                   $scope.totalPages = res.result.docs;
                   $scope.totalPagesCount = res.result.total;
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
  

    userService.showAllBlockedPage().success(function(res) {
 	if (res.responseCode == 200){
            $scope.showAllBlockedPage = res.result;
            $scope.showAllBlockedPageCount = res.count;
            //console.log("showAllBlockedPage",JSON.stringify($scope.showAllBlockedPageCount))
            } else {
            	//console.log("zxzxzxzxz",JSON.stringify($scope.showAllBlockedPage))
            toastr.error(res.responseMessage);
        }        
    })

    userService.unPublishedPage().success(function(res){
        // console.log("val",JSON.stringify(res))
        if (res.responseCode == 200){
            $scope.unPublishedPage = res.data;
            //console.log("zxzxzxzxz",JSON.stringify($scope.unPublishedPage))
            } else {
            toastr.error(res.responseMessage);
        } 
    })

//************ All Removed Pages*****************
      $scope.currentRemovedPages = 1;
     $scope.nextRemovedPagesDetail = function(){
         userService.totalPages($scope.currentRemovedPages).success(function(res) { 
             console.log("val",JSON.stringify(res))
            if (res.responseCode == 200){
                   $scope.noOfPagesRemovedPages = res.result.pages;
                   $scope.pageRemovedPages= res.result.page;
                   $scope.showAllRemovedPage= res.result.docs;
                   $scope.showAllRemovedPageCount = res.result.total;
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
    //     console.log("val",JSON.stringify(res))
    //     if (res.responseCode == 200){
    //         $scope.showAllRemovedPage = res.result;
    //         $scope.showAllRemovedPageCount = res.count;
    //         console.log("lllllllllllll",JSON.stringify($scope.showAllRemovedPageCount))
    //         } else {
    //         //toastr.error(res.responseMessage);
    //         $scope.showAllRemovedPage = res.count;
    //        // console.log("zxzxzxzxz",JSON.stringify($scope.showAllRemovedPage))
    //     } 
    // })


    $scope.Remove_User = function (id) {
        $scope.RemoveId = id;
        var userId = $scope.RemoveId;
        console.log("Blockidvcbc");

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
    console.log("iddddd",id);
    userService.showAdds(id).success(function(res){
        if(res.responseCode == 200){
            $scope.allAddsOnPage=res.result;
            console.log("res",JSON.stringify(res));
            $("#adsDetails").modal('show');

        }else{
           toastr.error(res.responseMessage);
        }
    })
}


/*ownerDetails*/

$scope.ownerDetails = function(id){
    console.log("id",id);

}

/*show winners*/

$scope.showWinners = function(id){
    console.log("iddddd",id);
    userService.showPageWinner(id).success(function(res){
        if(res.responseCode == 200){
            $scope.allWinnerOnPage=res.result;
            console.log("res",JSON.stringify(res.result));
            $("#pageWinnerDetails").modal('show');

        }else{
           toastr.error(res.responseMessage);
        }
        console.log("res",res);
    })
}

/*show Admin Pages*/

$scope.showAdminPages = function(id){
    console.log("iddddd",id);
    userService.showAdminPages(id).success(function(res){
        if(res.responseCode == 200){
            $scope.allAdminOnPages=res.result;
            console.log("res----------------",JSON.stringify(res.result));
            $("#pageAdminDetails").modal('show');

        }else{
           toastr.error(res.responseMessage);
        }
    })
}


})