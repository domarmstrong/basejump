'use strict';

angular.module('basejumpApp')
  .factory('bands', ['$http', function ($http) {
    return count => $http.get('/api/bands', { params: { count }}).then(res => res.data);
  }]);
