var app = angular.module('MyApp', ['ui.router','ngCookies','blockUI','angularUtils.directives.dirPagination'])


app.config(function ($stateProvider, $urlRouterProvider,$httpProvider) {
    //$httpProvider.interceptors.push('httpModifier');
    $stateProvider
    .state('menu', {
        url: '/menu',
        controller: 'menuCtrl',
        templateUrl: 'templates/menu.html'        
    })

    .state('login', {
        url: '/login',
        controller: 'loginCtrl',
        templateUrl: 'templates/login.html'        
    })

    .state('manageAdminTools', {
        url: '/manageAdminTools',
        controller: 'manageAdminToolsCtrl',
        templateUrl: 'templates/manageAdminTools.html'        
    })

    .state('manageAds', {
        url: '/manageAds',
        controller: 'manageAdsCtrl',
        templateUrl: 'templates/manageAds.html'        
    })

    .state('createAds', {
        url: '/createAds',
        controller: 'createAdsCtrl',
        templateUrl: 'templates/createAds.html'        
    })

    .state('editAds', {
        url: '/editAds',
        controller: 'editAdsCtrl',
        templateUrl: 'templates/editAds.html'        
    })

    .state('manageCards', {
        url: '/manageCards',
        controller: 'manageCardsCtrl',
        templateUrl: 'templates/manageCards.html'        
    })

    .state('manageGifts', {
        url: '/manageGifts',
        controller: 'manageGiftsCtrl',
        templateUrl: 'templates/manageGifts.html'        
    })

    .state('managePages', {
        url: '/managePages',
        controller: 'managePagesCtrl',
        templateUrl: 'templates/managePages.html'        
    })

    .state('managePayments', {
        url: '/managePayments',
        controller: 'managePaymentsCtrl',
        templateUrl: 'templates/managePayments.html'        
    })

    .state('manageUsers', {
        url: '/manageUsers',
        controller: 'manageUsersCtrl',
        templateUrl: 'templates/manageUsers.html'        
    })


    $urlRouterProvider.otherwise('/login');

})
