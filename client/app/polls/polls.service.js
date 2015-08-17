'use strict';

angular.module('basejumpApp')
  .factory('polls', ['$http', function ($http) {
    return {
      create (data) {
        return $http.post('/api/polls/create', data).then(res => res.data);
      },
      getPollsForUser (id) {
        return $http.get('/api/polls', { params: { userId: id }}).then(res => res.data);
      },
      getPoll (id) {
        return $http.get('/api/polls', { params: { _id: id }}).then(res => res.data);
      },
      deletePoll (id) {
        return $http.delete('/api/polls/' + id).then(res => res.data);
      }
    };
  }]);