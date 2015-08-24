'use strict';

angular.module('basejumpApp')
  .factory('Polls', ['$http', function ($http) {
    return {
      create (data) {
        return $http.post('/api/polls/create', data).then(res => res.data);
      },
      getPollsForUser (id) {
        return $http.get('/api/polls', { params: { userId: id }}).then(res => res.data);
      },
      getPollByUrl (url) {
        return $http.get('/api/polls', { params: { url }}).then(res => getOne(res.data));
      },
      getPoll (id) {
        return $http.get('/api/polls', { params: { _id: id }}).then(res => getOne(res.data));
      },
      deletePoll (id) {
        return $http.delete('/api/polls/' + id).then(res => res.data);
      },
      vote (id, optionId) {
        return $http.post('/api/polls/vote/' + id, { optionId });
      }
    };
  }]);
  
function getOne(arr) {
  if (arr.length !== 1) {
    let err = new Error('Not found');
    err.status = 404;
    throw err;
  }
  return arr[0];
}