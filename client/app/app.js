angular.module('tierlist', [
  'tierlist.search',
  'tierlist.services',
  'ui.router'
])
.config(function ($httpProvider, $stateProvider, $urlRouterProvider) {
  
    $urlRouterProvider.otherwise('/search');
    $stateProvider
      .state('search', {
        templateUrl: 'app/search/search.html',
        url: '/search',
        controller: 'SearchController'
      });


    // We add our $httpInterceptor into the array
    // of interceptors. Think of it like middleware for your ajax calls
})
.run(function ($rootScope, $location, Auth) {
  // here inside the run phase of angular, our services and controllers
  // have just been registered and our app is ready
  // however, we want to make sure the user is authorized
  // we listen for when angular is trying to change routes
  // when it does change routes, we then look for the token in localstorage
  // and send that token to the server to see if it is a real user or hasn't expired
  // if it's not valid, we then redirect back to signin/signup
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    //might be useful
    });
});
