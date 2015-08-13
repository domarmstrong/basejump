'use strict';

angular.module('basejumpApp')
  .controller('MainCtrl', function ($scope, $http, Auth) {
    $scope.awesomeThings = [];

    $scope.isLoggedIn = Auth.isLoggedIn;
    
    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };
  });
