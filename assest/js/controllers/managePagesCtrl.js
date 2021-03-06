app.controller('managePagesCtrl', function($scope, $window, $state, userService, toastr, $http, $timeout) {
    $(window).scrollTop(0, 0);
    $scope.class = false;
    $scope.$emit('headerStatus', 'Manage Pages');
    $scope.$emit('SideMenu', 'Manage Pages');
    $scope.tab = 'totalPages';
    $scope.myForm = {};
    $scope.sendMessage = {};
    $scope.active_upgrade_card = true;
    $scope.cardType = 'upgrade_card';
    localStorage.setItem('pageTypeName','totalPages');
    
    
    

    $scope.dateValidation = function(dtaa) {
        var dta = dtaa;
        var timestamp = new Date(dtaa).getTime();
        var nextday = timestamp + 8.64e+7;
        $scope.minDatee = new Date(nextday).toDateString();
    }

    userService.totalPages().success(function(res) {
        if (res.responseCode == 200) {
            console.log("res",JSON.stringify(res));
            $scope.totalPages = res.result;
            $scope.totalPagesCount = res.result.length;
        } else {
            $scope.totalPagesCount = 0;
            // toastr.error(res.responseMessage);
        }
    })

    userService.unPublishedPage().success(function(res) {
        if (res.responseCode == 200) {
            $scope.unPublishedPage = res.result;
            $scope.unPublishedPageCount = res.result.length;
        } else {
            $scope.unPublishedPageCount = 0;
            //toastr.error(res.responseMessage);
        }
    })

    userService.showAllBlockedPage().success(function(res) {
        console.log("ress",res)
        if (res.responseCode == 200) {
            $scope.showAllBlockedPage = res.result;
            $scope.showAllBlockedPageCount = res.result.length;
        } else {
            $scope.showAllBlockedPageCount = 0;
            //toastr.error(res.responseMessage);
        }
    })

    userService.showAllRemovedPage().success(function(res) {
        console.log("ress",res)
        if (res.responseCode == 200) {
            $scope.showAllRemovedPage = res.result;
            $scope.showAllRemovedPageCount = res.result.length;
        } else {
            $scope.showAllRemovedPageCount = 0;
            //toastr.error(res.responseMessage);
        }
    })

    userService.removePageRequest().success(function(res) {
        if (res.responseCode == 200) {
            $scope.removePageRequest = res.result;
            $scope.removePageRequestCount = res.result.length;
        } else {
            $scope.removePageRequestCount = 0;
            // toastr.error(res.responseMessage);
        }
    })

    userService.allAdminPages().success(function(res) {
        if (res.responseCode == 200) {
            $scope.allAdminPages = res.result;
            $scope.allAdminPagesCount = res.count;
        } else {
            $scope.allAdminPagesCount = 0;
            //toastr.error(res.responseMessage);
        }
    })

    userService.countryListData().success(function(res) {
        $scope.countriesList = res.result;
    })

    $scope.changeCountry = function() {
        var obj = {};
        obj = {
            country: $scope.dashBordFilter.country,
        }
        userService.cityListData(obj).success(function(res) {
            $scope.cityList = res.result;
        })
    }

    userService.listOfCategory().success(function(res) {
        if (res.responseCode == 200) {
            $scope.category = res.result;
        } else {
            toastr.error("Something went wrong")
        }
    })


    $scope.total_user_cash = function(modal) {
        $("#sendcashModelAllUser").modal('show');
    }

    $scope.send_cashall = function(modal) {
        var array = [];
        var data = {};
        for (var i = 0; i < $scope.allAdminPages.length; i++) {
            array.push($scope.allAdminPages[i]._id)
        }
        data = {
            Cash: $scope.sendCash.Cash,
            Id: array
        }
        userService.sendBrolixAndCashAllUser(data).success(function(res) {
            if (res.responseCode == 200) {
                toastr.success("Cash send successfully to all user");
                $scope.sendCash = '';
                $("#sendcashModelAllUser").modal('hide');
            } else {
                toastr.error(res.responseMessage);
            }
        })
    }

    $scope.pageRequest = function(pageId,status){
        let obj = {};
        if(pageId == null || pageId == undefined || pageId == ""){
            toastr.error("Page id not get")
        }else{
            obj = {
            pageId:pageId,
            status:status,
        }
        if(status == 'ACCEPTED'){
            BootstrapDialog.show({
                title: 'Block Page',
                message: 'Are you sure want to Accept this request',
                buttons: [{
                    label: 'Yes',
                    action: function(dialog) {
                        userService.approvalStatus(obj).success(function(res) {
                            if (res.responseCode == 200) {
                                dialog.close();
                            toastr.success(res.responseMessage);
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

        }else{
            BootstrapDialog.show({
                title: 'Block Page',
                message: 'Are you sure want to Reject this request',
                buttons: [{
                    label: 'Yes',
                    action: function(dialog) {
                        userService.approvalStatus(obj).success(function(res) {
                            if (res.responseCode == 200) {
                                dialog.close();
                            toastr.success(res.responseMessage);
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
        
        
        }
    }

    $scope.pageTypeName = function(val) {
        localStorage.setItem('pageTypeName', val);
        $scope.dashBordFilter.country = "";
        $scope.dashBordFilter.city = "";
        $scope.dashBordFilter.categories = "";
        $scope.dashBordFilter.dobTo = "";
        $scope.dashBordFilter.dobFrom = "";

        switch (val) {
            case 'totalPages':
                userService.totalPages().success(function(res) {
                    if (res.responseCode == 200) {
                        $scope.totalPages = res.result;
                        $scope.totalPagesCount = res.result.length;
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;

            case 'unpublishedPages':
                userService.unPublishedPage().success(function(res) {
                    if (res.responseCode == 200) {
                        $scope.unPublishedPage = res.result;
                        $scope.unPublishedPageCount = res.result.length;
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;

            case 'removedPages':
                userService.showAllRemovedPage($scope.currentRemovedPages).success(function(res) {
                    if (res.responseCode == 200) {
                        $scope.showAllRemovedPage = res.result;
                        $scope.showAllRemovedPageCount = res.result.length;
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;

            case 'blockedPages':
                userService.showAllBlockedPage().success(function(res) {
                    if (res.responseCode == 200) {
                        $scope.showAllBlockedPage = res.result;
                        $scope.showAllBlockedPageCount = res.result.length;
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;
            case 'removePagerequest':
                userService.removePageRequest().success(function(res) {
                    console.log("resll",JSON.stringify(res))
                    if (res.responseCode == 200) {
                        $scope.removePageRequest = res.result;
                        $scope.removePageRequestCount = res.result.length;
                    } else {
                        $scope.removePageRequestCount = 0;
                        // toastr.error(res.responseMessage);
                    }
                })
                break;

            default:
                toastr.error("somthing wents to wroung");
        }

    }

    $scope.dashBordFilter = function() {

        var type = localStorage.getItem('pageTypeName');
        console.log("type", type)
        var data = {};
        data = {
            pageType: localStorage.getItem('pageTypeName'),
            country: $scope.dashBordFilter.country,
            state: $scope.dashBordFilter.state,
            city: $scope.dashBordFilter.city,
            category: $scope.dashBordFilter.categories,
            joinTo: new Date($scope.dashBordFilter.dobTo).getTime(),
            joinFrom: new Date($scope.dashBordFilter.dobFrom).getTime(),
        }
        console.log("datatata", JSON.stringify(data))

        switch (type) {
            case 'totalPages':
                userService.pagefilter(data).success(function(res) {
                    console.log("res",JSON.stringify(res.data.length))
                    if (res.responseCode == 200) {

                        $scope.totalPages = res.data;
                        $scope.totalPagesCount = res.data.length;
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })

                break;

            case 'unpublishedPages':
                userService.pagefilter(data).success(function(res) {
                    if (res.responseCode == 200) {
                        $scope.unPublishedPage = res.data;
                        $scope.unPublishedPageCount = res.data.length;
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })

                break;

            case 'removedPages':
                userService.pagefilter(data).success(function(res) {
                    console.log("res", JSON.stringify(res))
                    if (res.responseCode == 200) {
                        $scope.showAllRemovedPage = res.data;
                        $scope.showAllRemovedPageCount = res.data.length;
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })

                break;

            case 'blockedPages':
                //console.log("4");
                userService.pagefilter(data).success(function(res) {
                    if (res.responseCode == 200) {
                        $scope.showAllBlockedPage = res.data;
                        $scope.showAllBlockedPageCount = res.data.length;
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })

                break;

            case 'removePagerequest':
                //console.log("4");
                userService.pagefilter(data).success(function(res) {
                    if (res.responseCode == 200) {
                        $scope.removePageRequest = res.result;
                        $scope.removePageRequestCount = res.result.length;
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })

                break;

            default:
                toastr.error("Somthing wents to wroung");
        }

    }

    $scope.export = function() {
        console.log("clicked")
        html2canvas(document.getElementById('managePageTable'), {
            onrendered: function(canvas) {
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

    $scope.sendMessagePage = function(modal) {
        $scope.modalId = modal;
        $scope.modelData = modal;
        if ($scope.modalId == '' || $scope.modalId == undefined || $scope.modalId == null) {
            toastr.error("Please select user.")
            $state.go('header.managePages')
        } else {
            $("#sendMessageModelAllUser").modal('show');
        }
    }

    $scope.send_massage = function() {
        var array = [];
        var data = {};
        switch ($scope.modelData) {
            case 'totalPages':
                for (var i = 0; i < $scope.totalPages.length; i++) {
                    array.push($scope.totalPages[i]._id)
                }
                data = {
                    Message: $scope.sendMessage.massage,
                    Id: array
                }
                userService.sendMassageAllUser(data).success(function(res) {
                    if (res.responseCode == 200) {
                        toastr.success("Message send successfully to all page owner");
                       // toastr.success("Number of User ", array.length);
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
                    Message: $scope.sendMessage.massage,
                    Id: array
                }
                userService.sendMassageAllUser(data).success(function(res) {
                    if (res.responseCode == 200) {
                        toastr.success("Message send successfully to all unpublished page owner");
                        $scope.sendMessage = '';
                        $("#sendMessageModelAllUser").modal('hide');
                        toastr.success("Number of User ", array.length);
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;

                // case 'pagesAdmins': 
                //     for (var i = 0; i < $scope.allAdminPages.length; i++) {
                //         array.push($scope.allAdminPages[i]._id)
                //     }
                //     data = {
                //         Message:$scope.sendMessage.massage,
                //         Id:array
                //     }
                //     userService.sendMassageAllUser(data).success(function(res) {        
                //         if (res.responseCode == 200){
                //             toastr.success("Message Send Successfully to All UnPublished Page Owner");
                //             $scope.sendMessage = '';
                //             $("#sendMessageModelAllUser").modal('hide');
                //             toastr.success("Number of User ",array.length); 
                //         } else {
                //             toastr.error(res.responseMessage);

                //         }
                //     })
                // break;

            default:
                array.push($scope.modalId)
                data = {
                    Message: $scope.sendMessage.massage,
                    Id: array
                }
                console.log("singleClick", data)
                userService.sendMassageAllUser(data).success(function(res) {
                    if (res.responseCode == 200) {
                        toastr.success("Message send successfully to user");
                        $scope.sendMessage = '';
                        $("#sendMessageModelAllUser").modal('hide');
                        toastr.success("Number of User ", array.length);
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
        }
    }

    $scope.blockPage = function(id) {
        $scope.BlockId = id;
        var userId = $scope.BlockId;
        if ($scope.BlockId == '' || $scope.BlockId == undefined || $scope.BlockId == null) {
            toastr.error("Please select user.")
            $state.go('header.managePages')
        } else {
            BootstrapDialog.show({
                title: 'Block Page',
                message: 'Are you sure want to block this page',
                buttons: [{
                    label: 'Yes',
                    action: function(dialog) {
                        userService.blockPage(userId).success(function(res) {
                            if (res.responseCode == 200) {
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
                    }
                }]
            });
        }
    }

    $scope.unblockPage = function(id) {
        $scope.BlockId = id;
        var userId = $scope.BlockId;
        //console.log("Blockid",userId);
        if ($scope.BlockId == '' || $scope.BlockId == undefined || $scope.BlockId == null) {
            toastr.error("Please select user.")
            $state.go('header.managePages')
        } else {
            BootstrapDialog.show({
                title: 'Block Page',
                message: 'Are you sure want to block this page',
                buttons: [{
                    label: 'Yes',
                    action: function(dialog) {
                        userService.unblockPage(userId).success(function(res) {
                            if (res.responseCode == 200) {
                                dialog.close();
                                toastr.success(res.responseMessage);
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
    }

     $scope.Remove_User = function(id) {
        $scope.RemoveId = id;
        console.log('$scope.RemoveId'+ $scope.RemoveId)
        var userId = $scope.RemoveId;
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
                        console.log("action =>")
                    userService.removePage(userId).success(function(res) {
                            console.log("response =>"+JSON.stringify(res))
                            if (res.responseCode == 200) {
                                // alert(1)
                                console.log("response 200=>"+JSON.stringify(res))
                                dialog.close();
                                $state.reload();
                                toastr.success("Page removed Successfully");
                                console.log("dialog close=>"+JSON.stringify(res))
                                 
                            } else {
                                // alert(2)
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
    }

   // $scope.Remove_User = function(id) {
   //           $scope.RemoveId = id;
   //        var userId = $scope.RemoveId;
   //        console.log('$scope.RemoveId--->'+ userId)
   //     userService.removePage(userId).success(function(res) {
   //                          console.log("response =>"+JSON.stringify(res))
   //                          if (res.responseCode == 200) {
   //                              // alert(1)
   //                              console.log("response 200=>"+JSON.stringify(res))
   //                              dialog.close();
   //                              $state.reload();
   //                              toastr.success("Page removed Successfully");
   //                              console.log("dialog close=>"+JSON.stringify(res))
                                 
   //                          } else {
   //                              alert(2)
   //                              toastr.error(res.responseMessage);
   //                          }
   //                      }).error(function(res) {
   //                          console.log('error')
   //                      })
   // }
   
    /*show Adds*/

    $scope.showAdds = function(id) {
        userService.showAdds(id).success(function(res) {
            console.log("resssssss", JSON.stringify(res))
            if (res.responseCode == 200) {
                $scope.allAddsOnPage = res.result;
                $("#adsDetails").modal('show');
            } else {
                toastr.error(res.responseMessage);
            }
        })
    }


    /*ownerDetails*/

    // $scope.ownerDetails = function(id){
    // userService.userInfo(id).success(function(res) { 
    //     //console.log("resssssssss",JSON.stringify(res))
    //          $("#ownerDetails").modal('show');
    //         // if (res.responseCode == 200){

    //         //    } 
    //         //    else {
    //         //     toastr.error(res.responseMessage);
    //         //     }
    //       })


    // }

    /*show winners*/

    $scope.showWinners = function(id) {
        console.log("iddddd", id);
        userService.showPageWinner(id).success(function(res) {
            if (res.responseCode == 200) {
                $scope.allWinnerOnPage = res.result;
                $scope.allshowUserPage = res.result;
                console.log("res", JSON.stringify(res.result));
                $("#pageWinnerDetails").modal('show');

            } else {
                toastr.error(res.responseMessage);
            }
            // console.log("res",res);
        })
    }

    /*show Admin Pages*/

    $scope.showAdminPages = function(id) {
        console.log("iddddd", id);
        userService.showAdminPages(id).success(function(res) {
            console.log("ssdsd", JSON.stringify(res))
            if (res.responseCode == 200) {
                $scope.allAdminOnPages = res.result;
                //console.log("res----------------",JSON.stringify(res.result));
                $("#pageAdminDetails").modal('show');

            } else {
                toastr.error(res.responseMessage);
            }
        })
    }
})

app.filter("pagesFilter", function() {
    return function(items, nameValue) {
        // console.log("items:   "+JSON.stringify(items));
        //  console.log("serach key:     "+nameValue);
        if (!nameValue) {
            return retArray = items;
        }
        var retArray = [];
        for (let i = 0; i < items.length; i++) {
            console.log("item[i].pageName:      " + items[i].pageName);
            if (items[i].pageName == null || items[i].pageName == 'undefined' || items[i].pageName == null) {
                console.log("no data ");
            } else if (items[i].pageName.toString().substr(0, nameValue.length) == nameValue.toString() || items[i].pageName.toLowerCase().substr(0, nameValue.length) == nameValue.toLowerCase()) {
                retArray.push(items[i]);
            }

        }
        return retArray
    }
})


app.filter("adminFilterOne", function() {
    return function(items, nameValue) {
        console.log("items:   "+JSON.stringify(items));
        console.log("serach key:     "+nameValue);
        if (!nameValue) {
            return retArray = items;
        }
        var retArrayy = [];
        for (let i = 0; i < items.length; i++) {
            //console.log("item[i].pageName:      " + JSON.stringify(items[i]);
            if (items[i].firstName == null || items[i].firstName == 'undefined' || items[i].firstName == null) {
                console.log("no data ");
            } else if ((items[i].firstName+' '+items[i].lastName).toString().substr(0, nameValue.length) == nameValue.toString() || (items[i].firstName+' '+items[i].lastName).toLowerCase().substr(0, nameValue.length) == nameValue.toLowerCase()) {
                retArrayy.push(items[i]);
            }

        }
        return retArrayy
    }
})

app.filter("adFilter", function() {         //2017-06-21
    return function(items, nameValue) {
        console.log("items:   "+JSON.stringify(items));
        console.log("serach key:     "+nameValue);
        if (!nameValue) {
            return retArraadd = items;
        }
         var retArraadd = [];
        for (let i = 0; i < items.length; i++) {
            //console.log("item[i].pageName:      " + JSON.stringify(items[i]);
            if (items[i].createdAt == null || items[i].createdAt == 'undefined' || items[i].createdAt == null) {
                console.log("no data ");
            } else if (items[i].createdAt.toString().substr(0, nameValue.length) == nameValue.toString() || items[i].createdAt.toLowerCase().substr(0, nameValue.length) == nameValue.toLowerCase()) {
                retArraadd.push(items[i]);
            }

        }
        return retArraadd
    }
})