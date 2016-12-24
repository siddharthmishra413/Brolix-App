'use strict';
var app = angular.module('MyApp', ['ui.router','ngCookies'])


app.config(function ($stateProvider, $urlRouterProvider,$httpProvider) {
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

    .state('header.manageUsers', {
        url: '/manageUsers',
        controller: 'manageUsersCtrl',
        templateUrl: 'templates/manageUsers.html'        
    })

    .state('header.managePages', {
        url: '/managePages',
        controller: 'managePagesCtrl',
        templateUrl: 'templates/managePages.html'        
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

    .state('editAds', {
        url: '/editAds',
        controller: 'editAdsCtrl',
        templateUrl: 'templates/editAds.html'        
    })

    .state('header.manageCards', {
        url: '/manageCards',
        controller: 'manageCardsCtrl',
        templateUrl: 'templates/manageCards.html'        
    })

    .state('header.manageGifts', {
        url: '/manageGifts',
        controller: 'manageGiftsCtrl',
        templateUrl: 'templates/manageGifts.html'        
    })

    .state('header.managePayments', {
        url: '/managePayments',
        controller: 'managePaymentCtrl',
        templateUrl: 'templates/managePayment.html'        
    })

    .state('manageAdminTools', {
        url: '/manageAdminTools',
        controller: 'manageAdminToolsCtrl',
        templateUrl: 'templates/manageAdminTools.html'        
    })


    $urlRouterProvider.otherwise('/login');

})
