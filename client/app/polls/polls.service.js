'use strict';

angular.module('basejumpApp')
  .factory('polls', ['$http', function ($http) {
    return {
      create (data) {
        return $http.post('/api/polls/create', data).then(res => res.data);
      },
      getPollsForUser (id) {
        return $http.get('/api/polls/user/' + id).then(res => res.data);
      },
      getPoll (id) {
        return $http.get('/api/polls/poll/' + id).then(res => res.data);
      }
    };
  }]);