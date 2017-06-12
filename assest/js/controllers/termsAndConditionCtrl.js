app.controller('termsAndConditionCtrl', function ($scope, $stateParams, $window, ckeditorService, userService, $rootScope, $state, toastr, $http, $timeout) {
    $(window).scrollTop(0, 0);
    $scope.$emit('headerStatus', 'Admin Tools');
    $scope.$emit('SideMenu', 'Admin Tools');
    $scope.myFrom = {};
    $scope.show = 1;

    CKEDITOR.replace( 'editorPage',{
      toolbar :
      [
         ['tokens','Styles', 'Format', 'Bold', 'Italic'],['Undo','Redo']
      ],

      extraPlugins: 'tokens'
   }   
);


    // CKEDITOR.replace( 'editor', {
    // toolbarGroups: [
    //     { name: 'mode' },
    //     { name: 'basicstyles' }
    // ],    
    // on: {
    //     pluginsLoaded: function() {
    //         var editor = this,
    //             config = editor.config;
            
    //         editor.ui.addRichCombo( 'my-combo', {
    //             label: 'My Dropdown Label',
    //             title: 'My Dropdown Title',
    //             toolbar: 'basicstyles,0',
        
    //             panel: {               
    //                 css: [ CKEDITOR.skin.getPath( 'editor' ) ].concat( config.contentsCss ),
    //                 multiSelect: false,
    //                 attributes: { 'aria-label': 'My Dropdown Title' }
    //             },

    //             init: function() {    
    //                 this.startGroup( 'My Dropdown Group #1' );
    //                 this.add( 'foo', 'Foo!' );
    //                 this.add( 'bar', 'Bar!' );                    
                    
    //                 this.startGroup( 'My Dropdown Group #2' );
    //                 this.add( 'ping', 'Ping!' );
    //                 this.add( 'pong', 'Pong!' );                    
                    
    //             },

    //             onClick: function( value ) {
    //                 editor.focus();
    //                 editor.fire( 'saveSnapshot' );
                   
    //                 editor.insertHtml( value );
                
    //                 editor.fire( 'saveSnapshot' );
    //             }
    //         } );        
    //     }        
    // }
    // } );

    userService.upgradeCardViewersList().success(function(res) {
        console.log("res",res)
        if (res.responseCode == 200) {
            $rootScope.viewerss = res.result;
            console.log("root",$rootScope.viewerss)
            $scope.dashBordFilterViewer = res.result;
        } else {
            toastr.error(res.responseMessage);
        }
    })

    // userService.viewAllTerms().success(function (res) {
    //     console.log("reee",JSON.stringify(res))

    //         if (res.responseCode == 200) {
    //             $scope.signUpTerms = res.result.filter(function (obj) {
    //                 return obj.type == 'signUpCondition';
    //             });
    //             $scope.myFrom.termssignUpCondition = $scope.signUpTerms[0].termsConditionContent;
    //             console.log($scope.myFrom.termssignUpCondition)

                
    //         } else {
    //             toastr.error(res.responseMessage);
    //         }
    //     })






    $scope.getdata = function () {
        userService.viewAllTerms().success(function (res) {
        console.log("reee",JSON.stringify(res))

            if (res.responseCode == 200) {
                $scope.signUpTerms = res.result.filter(function (obj) {
                    return obj.type == 'signUpCondition';
                });
                $scope.myFrom.termssignUpCondition = $scope.signUpTerms[0].termsConditionContent;
                console.log($scope.myFrom.termssignUpCondition)

                $scope.cashAdTerms = res.result.filter(function (obj) {
                    return obj.type == 'cashAdCondition';
                });
                $scope.myFrom.termscashAdCondition = $scope.cashAdTerms[0].termsConditionContent;

                $scope.couponAdTerms = res.result.filter(function (obj) {
                    return obj.type == 'couponAdCondition';
                });

                $scope.myFrom.termscouponAdCondition = $scope.couponAdTerms[0].termsConditionContent;

                $scope.couponAdTerms = res.result.filter(function (obj) {
                    return obj.type == 'couponGiftInfo';
                });

                $scope.myFrom.termscouponGiftCondition = $scope.couponAdTerms[0].termsConditionContent;

                 $scope.cashGiftInfoTerms = res.result.filter(function (obj) {
                    return obj.type == 'cashGiftInfo';
                });

                $scope.myFrom.termscashGiftCondition = $scope.cashGiftInfoTerms[0].termsConditionContent;

                $scope.hiddenGiftTerms = res.result.filter(function (obj) {
                return obj.type == 'hiddenGiftInfo';
                });

                $scope.myFrom.termshiddenGiftCondition = $scope.hiddenGiftTerms[0].termsConditionContent;

                $scope.createPageTerms = res.result.filter(function (obj) {
                return obj.type == 'createPage';
                });

                $scope.myFrom.termscreatePageCondition = $scope.createPageTerms[0].termsConditionContent;
                console.log("$scope.myFrom.termscreatePageCondition",$scope.myFrom.termscreatePageCondition)
            } else {
                toastr.error(res.responseMessage);
            }
        })
    }



    $scope.click = function (type) {
        $scope.type = type;
        console.log("type", $scope.type);
        switch ($scope.type) {
            case 'signUpCondition':
                data = {
                        termsConditionContent: $scope.myFrom.termssignUpCondition,
                    }
                userService.editTermsCondition(type, data).success(function (res) {
                    if (res.responseCode == 200) {
                        toastr.success(res.responseMessage);
                       // $state.reload();
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;
            case 'cashAdCondition':
                data = {
                        termsConditionContent: $scope.myFrom.termscashAdCondition,
                    }
                userService.editTermsCondition(type, data).success(function (res) {
                    if (res.responseCode == 200) {
                        toastr.success(res.responseMessage);
                       // $state.reload();
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;
            case 'couponAdCondition':
                data = {
                        termsConditionContent: $scope.myFrom.termscouponAdCondition,
                    }
                userService.editTermsCondition(type, data).success(function (res) {
                    if (res.responseCode == 200) {
                        toastr.success(res.responseMessage);
                      //  $state.reload();
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;

            case 'couponGiftInfo':
            data = {
                    termsConditionContent: $scope.myFrom.termscouponGiftCondition,
                }
            userService.editTermsCondition(type, data).success(function (res) {
                if (res.responseCode == 200) {
                    toastr.success(res.responseMessage);
                  //  $state.reload();
                } else {
                    toastr.error(res.responseMessage);
                }
            })
            break;

            case 'cashGiftInfo':
                data = {
                        termsConditionContent: $scope.myFrom.termscashGiftCondition,
                    }
                userService.editTermsCondition(type, data).success(function (res) {
                    if (res.responseCode == 200) {
                        toastr.success(res.responseMessage);
                      //  $state.reload();
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;

            case 'hiddenGiftInfo':
                data = {
                        termsConditionContent: $scope.myFrom.termshiddenGiftCondition,
                    }
                userService.editTermsCondition(type, data).success(function (res) {
                    if (res.responseCode == 200) {
                        toastr.success(res.responseMessage);
                      //  $state.reload();
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;
            case 'createPage':
                data = {
                        termsConditionContent: $scope.myFrom.termscreatePageCondition,
                        pageCost:$rootScope.pageCost,
                    }
                    console.log("data",data)
                userService.editTermsCondition(type, data).success(function (res) {
                    if (res.responseCode == 200) {
                        toastr.success(res.responseMessage);
                      //  $state.reload();
                    } else {
                        toastr.error(res.responseMessage);
                    }
                })
                break;
            default:
                toastr.error("Something Wents to wroung");
        }
    }


//     $scope.restTerms = function (type) {
//     userService.viewRestTerms(type).success(function (res) {
//         if (res.responseCode == 200) {
//             $scope.myFrom.termsContent = res.result[0].termsConditionContent;
//         } else {
//             toastr.error(res.responseMessage);
//         }
//     })
// }

// $scope.updateRestTerms = function (type) {
//     var data = {
//         termsConditionContent: $scope.myFrom.termsContent
//     }
//     userService.editRestTerms(type, data).success(function (res) {
//         if (res.responseCode == 200) {
//             toastr.success(res.responseMessage);
//         } else {
//             toastr.error(res.responseMessage);
//         }
//     })
// }
})