'use strict';

angular.module('basejumpApp')
  .factory('Bands', ['$http', function ($http) {
    return count => $http.get('/api/bands', { params: { count }}).then(res => res.data);
  }]);
