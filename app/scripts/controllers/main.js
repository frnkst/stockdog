'use strict';

angular.module('stockDogApp')
  .controller('MainCtrl', function ($scope, $location, WatchlistService) {
    // [1] Populate watchlists for dynamic nav links
    $scope.watchlists = WatchlistService.query();

    // [2] Using the $location.path() function as a $watch expression
    $scope.$watch(function() {
      return $location.path();
    }, function (path) {
      // Fixme: Doesn't work yet
      if(_.includes(path, 'watchlist')) { 
        $scope.activeView = 'watchlist'; 
      } else {
        $scope.activeView = 'dashboard';
      }
      // Temp. Delete this line below again
      $scope.activeView = 'watchlist';
    });
  });  
  