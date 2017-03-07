angular.module('tierlist.search', [])

.controller('SearchController', function($scope, $http) {
  $scope.title = 'Tier L157 Scraper';

  $scope.searchForGame = function(query) {
    $http.post('/scrape', { data: query })
    .then((successCallback, errorCallback)=> {
      console.log(successCallback);
    });
  };
});