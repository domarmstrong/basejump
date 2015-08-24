'use strict';

angular.module('basejumpApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/:user/:pollname', {
        templateUrl: 'app/polls/poll.html',
        controller: 'PollCtrl'
      });
  })
  
  .controller('PollCtrl', function ($scope, $location, Auth, Polls) {
    $scope.poll = null;
    $scope.selectedId = null;
    $scope.notFound = false;
    $scope.hasVoted = false;
    getPoll();
    
    function getPoll() {
      return Polls.getPollByUrl($location.url()).then(poll => {
        $scope.poll = poll
        $scope.hasVoted = userHasVoted(poll);
      }).catch(err => {
        if (err.status === 404) {
          $scope.notFound = true;
        }
        throw err;
      });
    }
    
    function userHasVoted(poll) {
      let userId = Auth.getCurrentUser()._id;
      return poll.options.reduce((hasVoted, option) => {
        if (hasVoted) return true;
        return option.votes.some(vote => userId === vote.userId);
      }, false);
    }
    
    $scope.getVotes = function (id) {
      return findPoll(id).options.reduce((votes, option) => votes + option.votes.length, 0);
    };
    
    $scope.submit = function (form) {
      if (form.$valid) {
        Polls.vote($scope.poll._id, $scope.selectedId).then(getPoll);
      }
    };
    
    $scope.getChartData = function () {
      console.log('update value');
      let poll = $scope.poll;
      if (! poll) return '';
      
      let months = {};
      poll.options.map(option => {
        let total = 0;
        let data = [];
        let current = null;
        
        option.votes.sort((a, b) => {
          return a.datetime > b.datetime ? 1 : -1;
        }).forEach(vote => {
          //console.log(option.value, vote);
          total++;
        });
      });
      return JSON.stringify({
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19, 86, 27, 90]
        }
    ]
});
    }
  });
