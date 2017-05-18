'use strict';
var app = angular.module('MyApp', ['ui.router', 'ngCookies', 'toastr', 'angularSpinners', '720kb.datepicker'])


app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
    //$httpProvider.interceptors.push('httpModifier');
    $stateProvider
        .state('header', {
            url: '/header',
            controller: 'headerCtrl',
            templateUrl: 'templates/header.html',
            abstract: true
        })

    .state('login', {
        url: '/login',
        controller: 'loginCtrl',
        templateUrl: 'templates/login.html'
    })
      .state('header.adminProfile', {
            url: '/adminProfile',
            controller: 'adminProfileCtrl',
            templateUrl: 'templates/adminProfile.html'
        })

    .state('forgotPassword', {
        url: '/forgotPassword',
        controller: 'forgotPasswordCtrl',
        templateUrl: 'templates/forgotPassword.html'
    })

    .state('header.manageUsers', {
        url: '/manageUsers',
        controller: 'manageUsersCtrl',
        templateUrl: 'templates/manageUsers.html'
    })


    .state('header.addUser', {
            url: '/addUser',
            controller: 'addUserCtrl',
            templateUrl: 'templates/addUser.html'
        })
        .state('header.viewUserProfile', {
            url: '/viewUserProfile/:id',
            controller: 'viewUserProfileCtrl',
            templateUrl: 'templates/viewUserProfile.html'
        })
        .state('header.editUserProfile', {
            url: '/editUserProfile/:id',
            controller: 'editUserProfileCtrl',
            templateUrl: 'templates/editUserProfile.html'
        })

    .state('header.managePages', {
        url: '/managePages',
        controller: 'managePagesCtrl',
        templateUrl: 'templates/managePages.html'
    })

    .state('header.addNewPages', {
            url: '/addNewPages',
            controller: 'addNewPagesCtrl',
            templateUrl: 'templates/addNewPages.html'
        })
     .state('header.viewPage', {
            url: '/viewPage/:id',
            controller: 'viewPageCtrl',
            templateUrl: 'templates/viewPage.html'
        })  

     .state('header.viewImageUpload', {
            url: '/viewImageUpload/:id',
            controller: 'viewPageCtrl',
            templateUrl: 'templates/viewImageUpload.html'
        })  

    .state('header.editPage', {
            url: '/editPage/:id',
            controller: 'editPagesCtrl',
            templateUrl: 'templates/editPage.html'
        })
        .state('header.editPageSocialMedia', {
            url: '/editPageSocialMedia',
            //controller: 'editpageSocialMediaCtrl',
            templateUrl: 'templates/editPageSocialMedia.html'
        })
        .state('header.editPageAdmins', {
            url: '/editPageAdmins',
            //controller: 'editPagesCtrl',
            templateUrl: 'templates/editPageAdmins.html'
        })
        .state('header.editPageUpload', {
            url: '/editPageUpload',
            //controller: 'editPagesCtrl',
            templateUrl: 'templates/editPageUpload.html'
        })

    .state('header.manageAds', {
        url: '/manageAds',
        controller: 'manageAdsCtrl',
        templateUrl: 'templates/manageAds.html'
    })

    .state('header.createAds', {
        url: '/createAds',
        controller: 'createAdsCtrl',
        templateUrl: 'templates/createAds.html'
    })

    .state('header.editAds', {
        url: '/editAds/:id',
        controller: 'editAdsCtrl',
        templateUrl: 'templates/editAds.html'
    })

    .state('header.manageCards', {
        url: '/manageCards',
        controller: 'manageCardsCtrl',
        templateUrl: 'templates/manageCards.html'
    })
        .state('header.createCard', {
            url: '/createCard',
            controller: 'createCardCtrl',
            templateUrl: 'templates/createCard.html'
        })

        .state('header.editCard', {
            url: '/editCard',
            controller: 'editCardCtrl',
            templateUrl: 'templates/editCard.html'
        })
        .state('header.removeCard', {
            url: '/removeCard',
            controller: 'removeCardCtrl',
            templateUrl: 'templates/removeCard.html'
        })
        .state('header.createOffer', {
            url: '/createOffer',
            controller: 'createOfferCtrl',
            templateUrl: 'templates/createOffer.html'
        })
        
    .state('header.manageGifts', {
        url: '/manageGifts',
        controller: 'manageGiftsCtrl',
        templateUrl: 'templates/manageGifts.html'
    })

    .state('header.managePayments', {
        url: '/managePayments',
        controller: 'managePaymentCtrl',
        templateUrl: 'templates/managePayments.html'
    })

    .state('header.manageAdminTools', {
        url: '/manageAdminTools',
        controller: 'manageAdminToolsCtrl',
        templateUrl: 'templates/manageAdminTools.html'
    })

  .state('header.addSystemUser', {
        url: '/addSystemUser',
        controller: 'addSystemUserCtrl',
        templateUrl: 'templates/addSystemUser.html'
    })

  
  .state('header.editSystemUser', {
            url: '/editSystemUser/:id',
            controller: 'editSystemUserCtrl',
            templateUrl: 'templates/editSystemUser.html'
        })
  .state('header.adminReports', {
            url: '/adminReports',
            controller: 'adminReportsCtrl',
            templateUrl: 'templates/adminReports.html'
        })
  .state('header.termsAndCondition', {
            url: '/termsAndCondition',
            controller: 'termsAndConditionCtrl',
            templateUrl: 'templates/termsAndCondition.html'
        })
  .state('header.brolixAndDollars', {
            url: '/brolixAndDollars',
            controller: 'brolixAndDollarsCtrl',
            templateUrl: 'templates/brolixAndDollars.html'
        })
  .state('header.deafultBrolixAndDollars', {
            url: '/deafultBrolixAndDollars',
            controller: 'deafultBrolixAndDollarsCtrl',
            templateUrl: 'templates/deafultBrolixAndDollars.html'
        })
  .state('header.adminNotification', {
            url: '/adminNotification',
            controller: 'adminNotificationCtrl',
            templateUrl: 'templates/adminNotification.html'
        })
    .state('header.homepageAds', {
            url: '/homepageAds',
            controller: 'homepageAdsCtrl',
            templateUrl: 'templates/homepageAds.html'
        })

  /*addCoupons-section*/

  .state('header.adminCoupons', {
            url: '/adminCoupons',
            controller: 'adminCouponCtrl',
            templateUrl: 'templates/adminCoupons.html'
        })
  .state('header.editCoupon', {
        url: '/editCoupon',
        controller: 'editCouponCtrl',
        templateUrl: 'templates/editCoupon.html'
    })
  .state('header.viewCoupon', {
        url: '/viewCoupon',
        controller: 'viewCouponCtrl',
        templateUrl: 'templates/viewCoupon.html'
    })


    $urlRouterProvider.otherwise('/login');

})


app.factory('BearerAuthInterceptor', function ($window, $q) {
    return {
        request: function(config) {
            config.headers = config.headers || {};
            if ($window.localStorage.getItem('token')) {
              // may also use sessionStorage
                config.headers.Authorization = 'Bearer ' + $window.localStorage.getItem('token');
            }
            //console.log(config)
            return config || $q.when(config);
        },
        response: function(response) {
            if (response.status === 401) {
                //  Redirect user to login page / signup Page.
            }
            return response || $q.when(response);
        }
    };
});

// Register the previously created AuthInterceptor.
app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('BearerAuthInterceptor');
});

// app.run(function($rootScope, $location, $window, $state) {
//     $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams, userService, $scope) {
//         userService.adminProfile().success(function(res) {
//             console.log(res);
//             if (res.responseCode == 404) {
//                 //bootbox.alert(res.responseMessage);
//                 $state.go('login')
//             } else {
//                 $scope.user = res.result;
//                 $scope.image = $scope.user.image
//             }
//         }).error(function(status, data) {

//         })
//     });
// });
