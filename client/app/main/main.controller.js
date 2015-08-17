'use strict';

angular.module('basejumpApp')
  .controller('MainCtrl', function ($scope, $location, $http, Auth) {
    $scope.isLoggedIn = Auth.isLoggedIn;
  });
