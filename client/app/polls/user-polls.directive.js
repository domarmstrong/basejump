'use strict';

angular.module('basejumpApp')
  .factory('polls', ['$http', function ($http) {
    return {
      getPollsForUser (id) {
        return $http.get('/api/polls/user/' + id).then(res => res.data);
      },
      getPoll (id) {
        return $http.get('/api/polls/poll/' + id).then(res => res.data);
      }
    };
  }])
  
  .controller('UserPollsCtrl', ['$scope', 'polls', 'Auth', function ($scope, polls, Auth) {
    let userId = Auth.getCurrentUser()._id;
    $scope.polls = null;
    // get all polls for current user
    polls.getPollsForUser(userId).then(polls => $scope.polls = polls);
  }])
  
  .directive('userPolls', function () {
    return {
      restrict: 'E',
      template: `
        <div class="user-polls" ng-controller="UserPollsCtrl">
          <div ng-show="polls && !polls.length" class="alert alert-danger">You do not currently have any polls</div>
          
          <div ng-show="polls && polls.length" ng-repeat="poll in polls">
            {{ poll }}
          </div>
        </div>
      `
    };
  });
