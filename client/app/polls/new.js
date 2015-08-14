'use strict';

angular.module('basejumpApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/new', {
        templateUrl: 'app/polls/new.html',
        controller: 'NewPollCtrl'
      });
  })
  
  .controller('NewPollCtrl', function ($scope, Auth, bands, $location) {
    var poll = {
      name: null,
      options: [],
    };
    $scope.poll = poll;
    $scope.errors = {};

    bands(2).then(bands => {
      poll.options = bands.map(mapToOption(true));
    });
    
    $scope.addOption = event => {
      event.preventDefault();
      bands(1).then(bands => {
        poll.options = poll.options.concat( bands.map(mapToOption(false)) );
      });
    };
    
    $scope.submit = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.createUser({
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Account created, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };
  });

function mapToOption(required) {
  return function (placeholder) {
    return {
      placeholder,
      value: null,
      required: required || false,
    };
  };
}