'use strict';

angular.module('basejumpApp')
  .controller('UserPollsCtrl', ['$scope', 'polls', 'Auth', function ($scope, polls, Auth) {
    $scope.polls = null; // []
    
    Auth.getCurrentUser().$promise.then(user => {
      // get all polls for current user
      return polls.getPollsForUser(user._id).then(polls => $scope.polls = polls);
    })
    
    $scope.getVotes = function (id) {
      let poll = $scope.polls.find(poll => poll._id === id);
      return poll.options.reduce((votes, option) => votes + option.votes.length, 0);
    };
  }])
  
  .directive('userPolls', function () {
    return {
      restrict: 'E',
      template: `
        <div class="user-polls" ng-controller="UserPollsCtrl">
          <div ng-show="polls && !polls.length" class="alert alert-danger">You do not currently have any polls</div>
          
          <div ng-show="polls && polls.length" ng-repeat="poll in polls" class="panel panel-default">
            <div class="panel-body">
              <span class="vote-count label label-primary">Votes: {{ getVotes(poll._id) }}</span>
              <span>{{ poll.name }}</span>
              <div class="buttons pull-right">
                <button class="btn btn-primary"><i class="fa fa-eye"></i></button>
                <button class="btn btn-success"><i class="fa fa-share-alt"></i></button>
                <button class="btn btn-danger"><i class="fa fa-remove"></i></button>
              </div>
            </div>
          </div>
        </div>
      `
    };
  });
