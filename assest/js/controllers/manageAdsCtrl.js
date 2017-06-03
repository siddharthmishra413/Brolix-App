app.controller('manageAdsCtrl', function($scope, $window, userService, $timeout, toastr, $state) {
  $(window).scrollTop(0, 0);
  $scope.$emit('headerStatus', 'Manage Ads');
  $scope.$emit('SideMenu', 'Manage Ads');
  $scope.tab = 'totalads';
  $scope.dashBordFilter = {};
  $scope.sendMessage = {};
  $scope.myForm = {};
  localStorage.setItem('adsTypeName', 'totalAds');
  userService.totalAds().success(function(res) {
    if (res.responseCode == 200) {
      $scope.totalAds = res.result;
      $scope.totalAdscount = res.result.length;
    } else {
      $scope.totalAdscount = 0;
    }
  })
  userService.totalActiveAds().success(function(res) {
    console.log("resss",JSON.stringify(res))
    if (res.responseCode == 200) {
      $scope.totalActiveAds = res.result;
      $scope.totalActiveAdscount = res.result.length;
    } else {
      $scope.totalActiveAdscount = 0;
    }
  })
  userService.totalExpiredAds().success(function(res) {
    if (res.responseCode == 200) {
      $scope.totalExpiredAds = res.result;
      $scope.totalExpiredAdscount = res.result.length;
    } else {
      $scope.totalExpiredAdscount = 0;
    }
  })
  userService.showReportedAdInAds().success(function(res) {
    console.log("res", JSON.stringify(res.coode));
    if (res.responseCode == 200) {
      $scope.showReportedAd = res.result;
      $scope.showReportedAdcount = res.result.length;
    } else {
      $scope.showReportedAdcount = 0;
    }
  })
  userService.adsWithLinks().success(function(res) {
    if (res.responseCode == 200) {
      $scope.adsWithLinks = res.result;
      $scope.adsWithLinkscount = res.result.length;
    } else {
      $scope.adsWithLinkscount = 0;
    }
  })
  userService.videoAds().success(function(res) {
    if (res.responseCode == 200) {
      $scope.videoAds = res.result;
      $scope.videoAdscount = res.result.length;
    } else {
      $scope.videoAdscount = 0;
    }
  })
  userService.slideshowAds().success(function(res) {
    if (res.responseCode == 200) {
      $scope.slideshowAds = res.result;
      $scope.slideshowAdscount = res.result.length;
    } else {
      $scope.slideshowAdscount = 0;
    }
  })
  userService.adUpgradedByDollor().success(function(res) {
    if (res.responseCode == 200) {
      $scope.adUpgradedByDollor = res.result;
      $scope.adUpgradedByDollorcount = res.result.length;
    } else {
      $scope.adUpgradedByDollorcount = 0;
    }
  })
  userService.adUpgradedByBrolix().success(function(res) {
    if (res.responseCode == 200) {
      $scope.adUpgradedByBrolix = res.result;
      $scope.adUpgradedByBrolixcount = res.result.length;
    } else {
      $scope.adUpgradedByBrolixcount = 0;
    }
  })
  userService.topFiftyAds().success(function(res) {
    if (res.responseCode == 200) {
      $scope.topFiftyAds = res.result;
      $scope.topFiftyAdscount = res.count;
    } else {
      toastr.error(res.responseMessage);
    }
  })
  $scope.removeAds = function(id) {
    //console.log("hhh",id)
    $scope.RemoveId = id;
    var adsId = $scope.RemoveId;
    //console.log("Blockidvcbc");
    //console.log("$scope.RemoveId",$scope.RemoveId)
    if ($scope.RemoveId == '' || $scope.RemoveId == undefined || $scope.RemoveId == null) {
      toastr.error("Please select user.")
      $state.go('header.manageAds')
    } else {
      BootstrapDialog.show({
        title: 'Remove User',
        message: 'Are you sure want to Remove this Add',
        buttons: [{
          label: 'Yes',
          action: function(dialog) {
            userService.removeAds(adsId).success(function(res) {
              if (res.responseCode == 200) {
                dialog.close();
                toastr.success("Page removed Successfully");
                $state.reload();
              } else if (res.responseCode == 404) {
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
  $scope.sendMessagePage = function(modal) {
    //console.log($scope.myForm.checkId);
    $scope.modalId = modal;
    $scope.modelData = modal;
    $("#sendMessageModelAllUser").modal('show');
  }
  $scope.contactOwner = function(modal) {
    $scope.modalId = modal;
    $scope.modelData = modal;
    if ($scope.myForm.checkId == '' || $scope.myForm.checkId == undefined || $scope.myForm.checkId == null) {
      toastr.error("Please select user.")
    } else {
      $("#sendMessageModelOwners").modal('show');
    }
  }
  $scope.send_messageOwners = function(id) {
    //console.log($scope.myForm.checkId);
    if ($scope.sendMessage.massage == '' || $scope.sendMessage.massage == undefined || $scope.sendMessage.massage == null) {
      toastr.error('Please enter your message');
      return;
    }
    userService.sendMassageAllUser(id).success(function(res) {
      if (res.responseCode == 200) {
        toastr.success("Message sent successfully to Owner");
        $scope.sendMessage = '';
        $("#sendMessageModelOwners").modal('hide');
      } else {
        toastr.error(res.responseMessage);
      }
    })
  }
  $scope.showPageDetails = function(id) {
    //console.log("id---------"+id);
    userService.pageInfo(id).success(function(res) {
      console.log("Show(res.result)", JSON.stringify(res.result))
      $scope.allpageInfo = res.result;
      $("#pageDetails").modal('show');
      //console.log("$scope.allpageInfo",JSON.stringify($scope.allpageInfo))
    })
  }
  $scope.adInfo = function() {
    //console.log($scope.myForm.checkId)
    if ($scope.myForm.checkId == '' || $scope.myForm.checkId == undefined || $scope.myForm.checkId == null) {
      toastr.error("Please select user.")
    } else {
      userService.adInfo($scope.myForm.checkId).then(function(success) {
        //console.log(JSON.stringify($scope.userDetail))
        $scope.userDetail = success.data.result;
        $("#adInfo").modal('show');
        //console.log("adInfo>>>>>>>>>>>>>"+JSON.stringify(success))
      }, function(err) {
        //console.log(err);
        toastr.error('Connection error.');
      })
    }
  }
  $scope.adInfoSoldCoupon = function(id) {
    userService.adInfo(id).then(function(success) {
      //console.log(JSON.stringify($scope.userDetail))
      $scope.userDetail = success.data.result;
      $("#adInfo").modal('show');
      //console.log("adInfo>>>>>>>>>>>>>"+JSON.stringify(success))
    }, function(err) {
      //console.log(err);
      toastr.error('Connection error.');
    })
  }
  $scope.reportOnAd = function(id) {
    //console.log("reportOnAdId>>>"+JSON.stringify(id))
    userService.showReportOnAd($scope.myForm.checkId).then(function(success) {
      $scope.userDetail = success.data.result;
      if (success.data.responseCode == 404) {
        toastr.error(success.data.responseMessage);
      } else if (success.data.responseCode == 200) {
        $("#adReport").modal('show');
      } else {
        toastr.error(success.data.responseMessage);
      }
      //console.log("reportOnAd>>>>>>>>>>>>>"+JSON.stringify(success))
    }, function(err) {
      //console.log(err);
      toastr.error('Connection error.');
    })
  }
  /*-------------------------Message send to all contact Admins---------------------*/
  $scope.send_massage = function() {
    if ($scope.sendMessage.massage == '' || $scope.sendMessage.massage == undefined || $scope.sendMessage.massage == null) {
      toastr.error('Please enter your message');
      return;
    }
    var array = [];
    var data = {};
    switch ($scope.modelData) {
      case 'totalads':
        for (var i = 0; i < $scope.totalads.length; i++) {
          array.push($scope.totalads[i]._id)
        }
        data = {
          Message: $scope.sendMessage.massage,
          Id: array
        }
        if ($scope.sendMessage.massage == '' || $scope.sendMessage.massage == undefined || $scope.sendMessage.massage == null) {
          toastr.error('Please enter your message');
          return;
        }
        userService.sendMassageAllUser(data).success(function(res) {
          if (res.responseCode == 200) {
            toastr.success("Message sent successfully to Admins");
            $scope.sendMessage = '';
            $("#sendMessageModelAllUser").modal('hide');
          } else {
            toastr.error(res.responseMessage);
          }
        })
        break;
      case 'totalActiveAds':
        for (var i = 0; i < $scope.totalActiveAds.length; i++) {
          array.push($scope.totalActiveAds[i]._id)
        }
        data = {
          Message: $scope.sendMessage.massage,
          Id: array
        }
        userService.sendMassageAllUser(data).success(function(res) {
          if (res.responseCode == 200) {
            toastr.success("Message sent successfully to  Admins");
            $scope.sendMessage = '';
            $("#sendMessageModelAllUser").modal('hide');
          } else {
            toastr.error(res.responseMessage);
          }
        })
        break;
      case 'totalExpiredAds':
        for (var i = 0; i < $scope.totalExpiredAds.length; i++) {
          array.push($scope.totalExpiredAds[i]._id)
        }
        data = {
          Message: $scope.sendMessage.massage,
          Id: array
        }
        userService.sendMassageAllUser(data).success(function(res) {
          if (res.responseCode == 200) {
            toastr.success("Message sent successfully to Admins");
            $scope.sendMessage = '';
            $("#sendMessageModelAllUser").modal('hide');
          } else {
            toastr.error(res.responseMessage);
          }
        })
        break;
      case 'videoAds':
        for (var i = 0; i < $scope.videoAds.length; i++) {
          array.push($scope.videoAds[i]._id)
        }
        data = {
          Message: $scope.sendMessage.massage,
          Id: array
        }
        userService.sendMassageAllUser(data).success(function(res) {
          if (res.responseCode == 200) {
            toastr.success("Message sent successfully to  Admins");
            $scope.sendMessage = '';
            $("#sendMessageModelAllUser").modal('hide');
          } else {
            toastr.error(res.responseMessage);
          }
        })
        break;
      case 'slideshowAds':
        for (var i = 0; i < $scope.slideshowAds.length; i++) {
          array.push($scope.slideshowAds[i]._id)
        }
        data = {
          Message: $scope.sendMessage.massage,
          Id: array
        }
        userService.sendMassageAllUser(data).success(function(res) {
          if (res.responseCode == 200) {
            toastr.success("Message sent successfully to Admins");
            $scope.sendMessage = '';
            $("#sendMessageModelAllUser").modal('hide');
          } else {
            toastr.error(res.responseMessage);
          }
        })
        break;
      case 'adUpgradedByDollor':
        for (var i = 0; i < $scope.adUpgradedByDollor.length; i++) {
          array.push($scope.adUpgradedByDollor[i]._id)
        }
        data = {
          Message: $scope.sendMessage.massage,
          Id: array
        }
        userService.sendMassageAllUser(data).success(function(res) {
          if (res.responseCode == 200) {
            toastr.success("Message sent successfully to Admins");
            $scope.sendMessage = '';
            $("#sendMessageModelAllUser").modal('hide');
          } else {
            toastr.error(res.responseMessage);
          }
        })
        break;
      case 'adUpgradedByBrolix':
        for (var i = 0; i < $scope.adUpgradedByBrolix.length; i++) {
          array.push($scope.adUpgradedByBrolix[i]._id)
        }
        data = {
          Message: $scope.sendMessage.massage,
          Id: array
        }
        userService.sendMassageAllUser(data).success(function(res) {
          if (res.responseCode == 200) {
            toastr.success("Message sent successfully to Admins");
            $scope.sendMessage = '';
            $("#sendMessageModelAllUser").modal('hide');
          } else {
            toastr.error(res.responseMessage);
          }
        })
        break;
      case 'showReportedAd':
        for (var i = 0; i < $scope.showReportedAd.length; i++) {
          array.push($scope.showReportedAd[i]._id)
        }
        data = {
          Message: $scope.sendMessage.massage,
          Id: array
        }
        userService.sendMassageAllUser(data).success(function(res) {
          if (res.responseCode == 200) {
            toastr.success("Message sent successfully to Admins");
            $scope.sendMessage = '';
            $("#sendMessageModelAllUser").modal('hide');
          } else {
            toastr.error(res.responseMessage);
          }
        })
        break;
      case 'adsWithLinks':
        for (var i = 0; i < $scope.adsWithLinks.length; i++) {
          array.push($scope.adsWithLinks[i]._id)
        }
        data = {
          Message: $scope.sendMessage.massage,
          Id: array
        }
        userService.sendMassageAllUser(data).success(function(res) {
          if (res.responseCode == 200) {
            toastr.success("Message sent successfully  Admins");
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
          Message: $scope.sendMessage.massage,
          Id: array
        }
        userService.sendMassageAllUser(data).success(function(res) {
          if (res.responseCode == 200) {
            toastr.success("Message sent successfully to Admins");
            $scope.sendMessage = '';
            $("#sendMessageModelAllUser").modal('hide');
          } else {
            toastr.error(res.responseMessage);
          }
        })
    }
  }
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
  $scope.export = function() {
    var type = localStorage.getItem('adsTypeName');
    html2canvas(document.getElementById('manageAdsTable'), {
      onrendered: function(canvas) {
        var data = canvas.toDataURL();
        var docDefinition = {
          content: [{
            image: data,
            width: 500,
          }]
        };
        pdfMake.createPdf(docDefinition).download(type + '.pdf');
      }
    });
  }
  $scope.adsTypeName = function(val) {
    localStorage.setItem('adsTypeName', val);
    $scope.dashBordFilter.country = "";
    $scope.dashBordFilter.city = "";
    $scope.dashBordFilter.dobTo = "";
    $scope.dashBordFilter.dobFrom = "";
    switch (val) {
      case 'totalAds':
        console.log("1");
        userService.totalAds().success(function(res) {
        //  console.log("res", res.result.length);
          if (res.responseCode == 200) {
            $scope.totalAds = res.result;
            $scope.totalAdscount = res.result.length;
          } else {
            $scope.totalAdscount = 0;
          }
        })
        break;
      case 'totalActiveAds':
        console.log("2");
        userService.totalActiveAds().success(function(res) {
       //   console.log("res", res.result.length);
          if (res.responseCode == 200) {
            $scope.totalActiveAds = res.result;
            $scope.totalActiveAdscount = res.result.length;
          } else {
            $scope.totalActiveAdscount = 0;
          }
        })
        break;
      case 'totalExpiredAds':
        console.log("3");
        userService.totalExpiredAds().success(function(res) {
        //  console.log("res", res.result.length);
          if (res.responseCode == 200) {
            $scope.totalExpiredAds = res.result;
            $scope.totalExpiredAdscount = res.result.length;
          } else {
            $scope.totalExpiredAdscount = 0;
          }
        })
        break;
      case 'showReportedAd':
        console.log("4");
        userService.showReportedAdInAds().success(function(res) {
          console.log("refis", JSON.stringify(res.result));
          if (res.responseCode == 200) {
            $scope.showReportedAd = res.result;
            $scope.showReportedAdcount = res.result.length;
          } else {
            $scope.showReportedAdcount = 0;
          }
        })
        break;
      case 'adsWithLinks':
        console.log("5");
        userService.adsWithLinks().success(function(res) {
          if (res.responseCode == 200) {
            $scope.adsWithLinks = res.result;
            $scope.adsWithLinkscount = res.result.length;
          } else {
            $scope.adsWithLinkscount = 0;
          }
        })
        break;
      case 'videoAds':
        console.log("6");
        userService.videoAds().success(function(res) {
        //  console.log("res", res.result.length);
          if (res.responseCode == 200) {
            $scope.videoAds = res.result;
            $scope.videoAdscount = res.result.length;
          } else {
            $scope.videoAdscount = 0;
          }
        })
        break;
      case 'slideShowAds':
        console.log("7");
        userService.slideshowAds().success(function(res) {
          console.log("res", res.result.length);
          if (res.responseCode == 200) {
            $scope.slideshowAds = res.result;
            $scope.slideshowAdscount = res.result.length;
          } else {
            $scope.slideshowAdscount = 0;
          }
        })
        break;
      case 'adUpgradedByDollor':
        console.log("9");
        userService.adUpgradedByDollor().success(function(res) {
         // console.log("res", res.result.length);
          if (res.responseCode == 200) {
            $scope.adUpgradedByDollor = res.result;
            $scope.adUpgradedByDollorcount = res.result.length;
          } else {
            $scope.adUpgradedByDollorcount = 0;
          }
        })
        break;
      case 'adUpgradedByBrolix':
        console.log("10");
        userService.adUpgradedByBrolix().success(function(res) {
        //  console.log("res", res.result.length);
          if (res.responseCode == 200) {
            $scope.adUpgradedByBrolix = res.result;
            $scope.adUpgradedByBrolixcount = res.result.length;
          } else {
            $scope.adUpgradedByBrolixcount = 0;
          }
        })
        break;
      case 'topFiftyAds':
        console.log("11");
        userService.topFiftyAds().success(function(res) {
       //   console.log("res", res.result.length);
          if (res.responseCode == 200) {
            $scope.topFiftyAds = res.result;
            $scope.topFiftyAdscount = res.result.length;
          } else {
            $scope.topFiftyAdscount = 0;
          }
        })
        break;
      default:
        toastr.error("somthing wents to wroung");
    }
  }
  //activeAds, expiredAds, reportedAds,  adsWithLinks, videoAds, slideShowAds, upgradedAdsBy$, upgradedAdsByB
  $scope.dashBordFilter = function() {
    var type = localStorage.getItem('adsTypeName');
    var data = {};
    data = {
      adsType: localStorage.getItem('adsTypeName'),
      country: $scope.dashBordFilter.country,
      state: $scope.dashBordFilter.state,
      city: $scope.dashBordFilter.city,
      joinTo: new Date($scope.dashBordFilter.dobTo).getTime(),
      joinFrom: new Date($scope.dashBordFilter.dobFrom).getTime()
    }
    console.log("data", JSON.stringify(data));
    if (type == undefined || type == null || type == "") {
      toastr.error("First you click on show Ads button")
    } else {
      console.log("switch type:   " + type);
      switch (type) {
        case 'totalAds':
          console.log("1");
          console.log("data", JSON.stringify(data));
          userService.adsfilter(data).success(function(res) {
            console.log("res", res.result.length);
            if (res.responseCode == 200) {
              $scope.totalAds = res.result;
              $scope.totalAdscount = res.result.length;
            } else {
              $scope.totalAdscount = 0;
            }
          })
          break;
        case 'totalActiveAds':
          console.log("2");
          userService.adsfilter(data).success(function(res) {
            console.log("res", res.result.length);
            if (res.responseCode == 200) {
              $scope.totalActiveAds = res.result;
              $scope.totalActiveAdscount = res.result.length;
            } else {
              $scope.totalActiveAdscount = 0;
            }
          })
          break;
        case 'totalExpiredAds':
          console.log("3");
          userService.adsfilter(data).success(function(res) {
            console.log("res", res.result.length);
            if (res.responseCode == 200) {
              $scope.totalExpiredAds = res.result;
              $scope.totalExpiredAdscount = res.result.length;
            } else {
              $scope.totalExpiredAdscount = 0;
            }
          })
          break;
        case 'showReportedAd':
          console.log("4");
          userService.adsfilter(data).success(function(res) {
            console.log("res", res.result.length);
            if (res.responseCode == 200) {
              $scope.showReportedAd = res.result;
              $scope.showReportedAdcount = res.result.length;
            } else {
              $scope.showReportedAdcount = 0;
            }
          })
          break;
        case 'adsWithLinks':
          console.log("5");
          userService.adsfilter(data).success(function(res) {
            console.log("res", res.result.length);
            if (res.responseCode == 200) {
              $scope.adsWithLinks = res.result;
              $scope.adsWithLinkscount = res.result.length;
            } else {
              $scope.adsWithLinkscount = 0;
            }
          })
          break;
        case 'videoAds':
          console.log("6");
          userService.adsfilter(data).success(function(res) {
            console.log("res", res.result.length);
            if (res.responseCode == 200) {
              $scope.videoAds = res.result;
              $scope.videoAdscount = res.result.length;
            } else {
              $scope.videoAdscount = 0;
            }
          })
          break;
        case 'slideShowAds':
          console.log("7");
          userService.adsfilter(data).success(function(res) {
            console.log("res", res.result.length);
            if (res.responseCode == 200) {
              $scope.slideshowAds = res.result;
              $scope.slideshowAdscount = res.result.length;
            } else {
              $scope.slideshowAdscount = 0;
            }
          })
          break;
        case 'adUpgradedByDollor':
          console.log("9");
          userService.adsfilter(data).success(function(res) {
            console.log("res", res.result.length);
            if (res.responseCode == 200) {
              $scope.adUpgradedByDollor = res.result;
              $scope.adUpgradedByDollorcount = res.result.length;
            } else {
              $scope.adUpgradedByDollorcount = 0;
            }
          })
          break;
        case 'adUpgradedByBrolix':
          console.log("10");
          userService.adsfilter(data).success(function(res) {
            console.log("res", res.result.length);
            if (res.responseCode == 200) {
              $scope.adUpgradedByBrolix = res.result;
              $scope.adUpgradedByBrolixcount = res.result.length;
            } else {
              $scope.adUpgradedByBrolixcount = 0;
            }
          })
          break;
        case 'topFiftyAds':
          console.log("11");
          userService.adsfilter(data).success(function(res) {
            console.log("res", res.result.length);
            if (res.responseCode == 200) {
              $scope.topFiftyAds = res.result;
              $scope.topFiftyAdscount = res.result.length;
            } else {
              $scope.topFiftyAdscount = 0;
            }
          })
          break;
        default:
          toastr.error("somthing wents to wroung");
      }
    }
  }
})
// app.filter("manageAdsFilter", function() {
//   return function(items, nameValue) {
//     //console.log(JSON.stringify(items))
//     //console.log(nameValue)
//     if (!nameValue) {
//       return retArray = items;
//     }
//     //console.log("item:   "+JSON.stringify(items));
//     var retArray = [];
//     if(items!=''||items!=undefined||items!=null)
//     {
//       console.log("with in undefine")
//     }
//     else{
//     for (var i = 0;i<items.length; i++) {
//       if (items[i].pageName.toLowerCase().substr(0, nameValue.length) == nameValue.toLowerCase()) {
//         retArray.push(items[i]);
//       }
//     }
//     return retArray
// }
//   }
// })
// app.filter("manageAdsFilter", function() {
//   return function(items, nameValue) {
//     console.log(items + "<--values-->" + nameValue)
//     if (!nameValue) {
//       return retArray = items;
//     }
//     var retArray = [];
//     for (var i = 0; i < items.length; i++) {
//       if (items[i].pageName == nameValue) {
//         retArray.push(items[i]);
//       }
//     }
//     return retArray;
//   }
// });

app.filter("manageAdsFilter", function() {
  return function(items, nameValue) {
    if (!nameValue) {
      return retArray = items;
    }
    var retArray = [];
    for (var i = 0; i < items.length; i++) {
      if (items[i].pageName.toLowerCase().substr(0, nameValue.length) == nameValue.toLowerCase()) {
        retArray.push(items[i]);
      }
    }
    return retArray;
  }
});
