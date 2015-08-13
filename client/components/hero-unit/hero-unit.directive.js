'use strict';

angular.module('basejumpApp')
  .directive('heroUnit', function () {
    return {
      restrict: 'E',
      transclude: true,
      template: `
        <header class="hero-unit" id="banner">
          <div class="container" ng-transclude></div>
        </header>
      `
    };
  });
