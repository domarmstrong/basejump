'use strict';

angular.module('basejumpApp')
  .controller('UserPollsCtrl', ['$scope', 'polls', 'Auth', function ($scope, polls, Auth) {
    $scope.polls = null; // array after data is fetched
    getPolls();
    
    function getPolls() {
      Auth.getCurrentUser().$promise.then(user => {
        // get all polls for current user
        return polls.getPollsForUser(user._id).then(polls => $scope.polls = polls);
      })
    }
    
    function findPoll(id) {
      return $scope.polls.find(poll => poll._id === id);
    }
    
    $scope.getVotes = function (id) {
      return findPoll(id).options.reduce((votes, option) => votes + option.votes.length, 0);
    };
    
    $scope.getPollUrl = function (id) {
      return `${window.location.origin}/${findPoll(id).url}`;
    }
    
    let popoverOpen = false;
    $scope.showUrlPopover = function (event, id) {
      if (popoverOpen) return;
      
      let button = $(event.delegateTarget);
      event.stopPropagation();
      button.popover('show');
      popoverOpen = true;
      
      let win = $(window);
      let eventName = `mousedown.popover`;
      win.on(eventName, e => {
        if ($(e.target).closest('.popover').length) {
          return;
        }
        popoverOpen = false;
        button.popover('hide');
        win.off(eventName);
      });
    }
    
    $scope.deletePoll = function (id) {
      polls.deletePoll(id).then(getPolls);
    }
  }])
  
  .directive('userPolls', function () {
    return {
      restrict: 'E',
      template: `
        <div class="user-polls" ng-controller="UserPollsCtrl">
          <div ng-show="polls && !polls.length" class="alert alert-danger">You do not currently have any polls</div>
          
          <div ng-show="polls && polls.length" ng-repeat="poll in polls" class="panel panel-default">
            <div class="panel-body">
              <span class="date label label-info">Created: {{ poll.created | date : 'dd/MM/yy'}}</span>
              <span class="vote-count label label-primary">Votes: {{ getVotes(poll._id) }}</span>
              <span>{{ poll.name }}</span>
              <div class="buttons pull-right">
                <button class="btn btn-primary"><i class="fa fa-eye"></i></button>
                <button class="btn btn-success share-button"
                  data-placement="left"
                  data-content="{{getPollUrl(poll._id)}}"
                  data-trigget="manual"
                  ng-click="showUrlPopover($event, poll._id)">
                    <i class="fa fa-share-alt"></i>
                </button>
                <button class="btn btn-danger" ng-click="deletePoll(poll._id)"><i class="fa fa-remove"></i></button>
              </div>
            </div>
          </div>
        </div>
      `
    };
  });
