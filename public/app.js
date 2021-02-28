var app = angular.module('thinkbridgeApp', ['ui.router', 'ngFileUpload'])

app.config(function($stateProvider, $urlRouterProvider){
    
    $stateProvider.state('dashboard', {
        url : '/dashboard',
        controller : 'dashboardController',
        templateUrl : 'views/dashboard.html'
    })
    .state('item',{
        url : '/item',
        controller : 'itemController',
        templateUrl : 'views/item.html',
        params: {
            itemId: null
        }
    })
    
    $urlRouterProvider.otherwise('dashboard');
})

