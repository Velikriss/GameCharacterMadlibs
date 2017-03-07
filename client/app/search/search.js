angular.module('tierlist.search', [])

.controller('SearchController', function($scope, $http) {
  
  $scope.characters = [];
  $scope.charImages = [];
  $scope.game = {};
  $scope.game.title = 'Waiting for game . . .';

  $scope.searchForGame = function(query) {
    $http.post('/scrape', { data: query })
    .then((successCallback, errorCallback)=> {
      console.log(successCallback);
      return successCallback;
    })
    .then(gameData => {
      $scope.characters = [];
      $scope.game.title = gameData.data.name;
      $scope.game.image = gameData.data.image.medium_url;
      var i = 0;
      gameData.data.characters.forEach(character => {
        //$scope.charImages.push(gameData.data.images[i].icon_url);
        $scope.characters.push(character);
        $scope.title += character.name + ' ';
      });
      $scope.searchForTierList($scope.game.title, $scope.characters);
    })  
  };

  $scope.searchForTierList = function(game, characters) {
    console.log('called how many times?');
    $http.post('/tiers', { data : 
      {
        title: game, 
        characters: characters
      } 
    })
    .then((successCallback, errorCallback) => {
      console.log(successCallback.data);

    });

  };
});

