'use strict';

angular.module('basejumpApp')
  .directive('appFeature', function() {
    return {
      restrict: 'E',
      transclude: true,
      template: function(el, attr) {
        return `
      <div class="feature col-md-4 col-lg-4 col-sm-6">
      <i class="fa ${attr.icon}" />
      <h2>${attr.title}</h2>
      <p ng-transclude></p>
      </div>
    `;
      }
    };
  });


angular.module('basejumpApp')
  .directive('appFooter', function() {
    return {
    restrict: 'E',
    template: `
      <footer class="footer">
        <div class="container">
          <p>Dom Armstrong | <a href="https://github.com/domarmstrong">@github</a></p>
        </div>
      </footer>
    `
    };
  });
