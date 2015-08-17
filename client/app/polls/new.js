'use strict';

angular.module('basejumpApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/new', {
        templateUrl: 'app/polls/new.html',
        controller: 'NewPollCtrl'
      });
  })
  
  .controller('NewPollCtrl', function ($scope, $location, Auth, bands, polls) {
    var poll = {
      name: null,
      options: [],
    };
    $scope.poll = poll;
    $scope.errors = {};

    // Get 2 bands for the initial options
    bands(2).then(bands => {
      console.log(bands);
      poll.options = bands.map(mapToOption);
    });
    
    $scope.addOption = event => {
      event.preventDefault();
      // Get an extra random band for each new option added
      bands(1).then(bands => {
        poll.options = poll.options.concat( bands.map(mapToOption) );
      });
    };
    
    $scope.optionIsRequired = function(index) {
      let values = poll.options.reduce((values, option) => {
        return option.value ? values.concat(option.value) : values;
      }, []);
      let numberRequired = 2 - values.length;
      let required = poll.options.reduce((required, option, i) => {
        if (numberRequired > 0 && !option.value) {
          required.push(i);
          numberRequired--;
        }
        return required;
      }, []);
      return required.indexOf(index) !== -1;
    }
    
    $scope.removeOption = function(index) {
      poll.options.splice(index, 1);
    }
    
    $scope.submit = function(form) {
      $scope.submitted = true;
      console.log(form);

      if (form.$valid) {
        let data = {
          name: poll.name,
          options: poll.options.map(option => option.value),
        };
        polls.create(data).then(url => $location.path(url)).catch(err => {
          $scope.errors.onSave = err;
        });
      }
    };
  });

function mapToOption(placeholder) {
  return {
    placeholder,
    value: null,
  };
}