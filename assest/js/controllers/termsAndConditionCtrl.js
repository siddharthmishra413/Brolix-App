app.controller('termsAndConditionCtrl', function ($scope, $stateParams, $window, signUpCondition, cashAdCondition, couponAdCondition,
couponGiftInfo, cashGiftInfo, hiddenGiftInfo, sellThisCouponInfo, createPage, userService, $rootScope, $state, toastr, $http, $timeout) {
    $(window).scrollTop(0, 0);
    $scope.$emit('headerStatus', 'Admin Tools');
    $scope.$emit('SideMenu', 'Admin Tools');
    $scope.myFrom = {};
    $scope.show = 1;



	// adminService.terms_and_policy('terms').then(function(success){ 
	// console.log(success);           
	// if(success.data.response_code==200){  
	//   $scope.terms={}; 
	//   $scope.id= success.data.result._id;                   
	//       $scope.terms.user_terms_condition=success.data.result.user_terms_condition;
	//       $scope.terms.vendor_terms_condition=success.data.result.vendor_terms_condition;
	//       var flag = $stateParams.true =="0"?true:false;
	//       TermsEditor.cEditor(flag);
	//       PrivacyEditor.cEditor(flag);
	//       CKEDITOR.config.readOnly = $stateParams.true=="1"?true:false;
	//    }else {
	//     $.notify(success.data.response_message,'danger');
	//    }
	// })


//     app.controller('show_edit_TermsCtrl', function ($scope ,adminService,TermsEditor,PrivacyEditor,$state,$stateParams) {
//   console.log("value"+$stateParams.true)
//   $scope.$emit('headerStatus', 'termsAndCondition'); 


//   $scope.data={};
//       adminService.terms_and_policy('terms').then(function(success){ 
//       console.log(success);           
//       if(success.data.response_code==200){  
//           $scope.terms={}; 
//           $scope.id= success.data.result._id;                   
//               $scope.terms.user_terms_condition=success.data.result.user_terms_condition;
//               $scope.terms.vendor_terms_condition=success.data.result.vendor_terms_condition;
//               var flag = $stateParams.true =="0"?true:false;
//               TermsEditor.cEditor(flag);
//               PrivacyEditor.cEditor(flag);
//               CKEDITOR.config.readOnly = $stateParams.true=="1"?true:false;
//            }else {
//             $.notify(success.data.response_message,'danger');
//            }
//        })

    
//    $scope.saveUserTerms = function(){
//     console.log("enter");
//     $scope.data.user_terms_condition = CKEDITOR.instances.termsEditor.getData();
//               adminService.update_terms_policy($scope.id,$scope.data).then(function(success){ 
//                 console.log(success);
//                if(success.data.response_code==200){
//                  $state.transitionTo('header.termsAndCondition',{ true :"1" } , { 'reload' : true });
//                    //$state.go('header.termsAndCondition');
                 
//                  }else{
//                    $.notify('Something went wrong.','danger');
//                  }
//               })
//    } 
//     $scope.saveVendorTerms = function(){
//     $scope.data.vendor_terms_condition = CKEDITOR.instances.privacyEditor.getData();
//      adminService.update_terms_policy($scope.id,$scope.data).then(function(success){ 
//          if(success.data.response_code==200){
//           $state.transitionTo('header.termsAndCondition',{ true:"1" } , { 'reload' : true });
//           // $state.go('header.termsAndCondition');
//            //toastr.success('Data updated');
//          }else{
//            $.notify('Something went wrong.','danger');
//          }
              
//       })
//    } 

// });
//     CKEDITOR.replace( 'editorPage',{
//       toolbar :
//       [
//          ['tokens','Styles', 'Format', 'Bold', 'Italic'],['Undo','Redo']
//       ],

//       extraPlugins: 'tokens'
//    }   
// );


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
        console.log("res",JSON.stringify(res))
        if (res.responseCode == 200) {
            $rootScope.viewerss = res.result;
            console.log("root",$rootScope.viewerss)
            $scope.dashBordFilterViewer = res.result;
        } else {
            toastr.error(res.responseMessage);
        }
    })

    userService.viewAllTerms().success(function (res) {
        console.log("reee",JSON.stringify(res))

            if (res.responseCode == 200) {
                $scope.signUpTerms = res.result.filter(function (obj) {
                    return obj.type == 'signUpCondition';
                });
                $scope.myFrom.termssignUpCondition = $scope.signUpTerms[0].termsConditionContent;
                signUpCondition.cEditor(true);

                console.log($scope.myFrom.termssignUpCondition)

                
            } else {
                toastr.error(res.responseMessage);
            }
        })






    $scope.getdata = function (type) {
        userService.viewAllTerms().success(function (res) {
        console.log("reee",JSON.stringify(res))

        if (res.responseCode == 200) {

        switch (type)
            {
                case 'signUpCondition': 
					$scope.signUpTerms = res.result.filter(function (obj) {
						return obj.type == 'signUpCondition';
					});
					$scope.myFrom.termssignUpCondition = $scope.signUpTerms[0].termsConditionContent;
					signUpCondition.cEditor(true);

                break;

                case 'cashAdCondition':
	                $scope.cashAdTerms = res.result.filter(function (obj) {
	                    return obj.type == 'cashAdCondition';
	                });
	                $scope.myFrom.termscashAdCondition = $scope.cashAdTerms[0].termsConditionContent;
	                cashAdCondition.cEditor(true); 

                break;

                case 'couponAdCondition':
					$scope.couponAdTerms = res.result.filter(function (obj) {
						return obj.type == 'couponAdCondition';
					});

					$scope.myFrom.termscouponAdCondition = $scope.couponAdTerms[0].termsConditionContent;
					couponAdCondition.cEditor(true);
   
                break;

                case 'couponGiftInfo':
                $scope.couponAdTerms = res.result.filter(function (obj) {
                    return obj.type == 'couponGiftInfo';
                });

                $scope.myFrom.termscouponGiftCondition = $scope.couponAdTerms[0].termsConditionContent;
                couponGiftInfo.cEditor(true);
                	

                break;

                case 'cashGiftInfo':
                $scope.cashGiftInfoTerms = res.result.filter(function (obj) {
                    return obj.type == 'cashGiftInfo';
                });

                $scope.myFrom.termscashGiftCondition = $scope.cashGiftInfoTerms[0].termsConditionContent;
                cashGiftInfo.cEditor(true);

                    
                break;

                case 'hiddenGiftInfo':
                $scope.hiddenGiftTerms = res.result.filter(function (obj) {
                return obj.type == 'hiddenGiftInfo';
                });

                $scope.myFrom.termshiddenGiftCondition = $scope.hiddenGiftTerms[0].termsConditionContent;
                hiddenGiftInfo.cEditor(true); 
                    
                break;

                case 'sellThisCoupon':
                $scope.sellThisCouponTerms = res.result.filter(function (obj) {
                return obj.type == 'sellThisCoupon';
                });

                $scope.myFrom.termssellThisCouponCondition = $scope.sellThisCouponTerms[0].termsConditionContent;
                sellThisCouponInfo.cEditor(true); 
                    
                break;

                case 'createPage':
                $scope.createPageTerms = res.result.filter(function (obj) {
                return obj.type == 'createPage';
                });

                $scope.myFrom.termscreatePageCondition = $scope.createPageTerms[0].termsConditionContent;
                createPage.cEditor(true); 
                    
                break;

                default: 
                
            }
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
            	$scope.myFrom.termssignUpCondition = CKEDITOR.instances.singUpEditor.getData();
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
            	$scope.myFrom.termscashAdCondition = CKEDITOR.instances.cashEditor.getData();
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
            	$scope.myFrom.termscouponAdCondition = CKEDITOR.instances.couponEditor.getData();
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
            	$scope.myFrom.termscouponGiftCondition = CKEDITOR.instances.couponGiftEditor.getData();
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
            	$scope.myFrom.termscashGiftCondition = CKEDITOR.instances.cashGiftEditor.getData();
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
            	$scope.myFrom.termshiddenGiftCondition = CKEDITOR.instances.hiddeenGiftEditor.getData();
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

            case 'sellThisCoupon':
            console.log("1")
                $scope.myFrom.termssellThisCouponCondition = CKEDITOR.instances.sellThisCouponEditor.getData();
                data = {
                        termsConditionContent: $scope.myFrom.termssellThisCouponCondition,
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
            	$scope.myFrom.termscreatePageCondition = CKEDITOR.instances.createPageEditor.getData();
                data = {
                        termsConditionContent: $scope.myFrom.termscreatePageCondition,
                        pageCost:$rootScope.pageCost,
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