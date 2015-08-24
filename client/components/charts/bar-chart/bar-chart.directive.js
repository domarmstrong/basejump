'use strict';

angular.module('basejumpApp')
  .directive('lineChart', function () {
    return {
      restrict: 'E',
      link (scope, element, attributes) {
        element.css({
          height: 500,
          width: '100%',
          display: 'block',
        })
        var data = {
            labels: ["January"],
            datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: [0]
                },
            ]
        };
        var options = {
            multiTooltipTemplate: "<%= datasetLabel %> - <%= value %>",
        };
 
        function render() {
          let chartData = data;
          if (attributes.chart) {
            chartData = JSON.parse(attributes.chart);
            chartData.datasets.forEach(getColors);
          }
          //
          //console.log(JSON.stringify(data));
          //data.datasets.forEach(dataset => {
          //  data.labels.forEach((label, i) => {
          //    chart.addData([dataset.data[i]], label);
          //  });
          //});
          console.log(chartData);
          let canvas = document.createElement('canvas');
          canvas.setAttribute('height', 500);
          canvas.setAttribute('width', 800);
          let ctx = canvas.getContext('2d');
          element.append(canvas);
          var chart = new Chart(ctx).Line(chartData, options);
          console.log('attrs2', canvas.getAttribute('height'));
          console.log('attrs2', canvas.getAttribute('width'));
        }
        
        attributes.$observe('chart', render);
        render();
      }
    };
  });
  
  
function getColors(dataset, i) {
  dataset.fillColor = "rgba(220,220,220,0.2)";
  dataset.strokeColor = "rgba(220,220,220,1)";
  dataset.pointColor = "rgba(220,220,220,1)";
  dataset.pointStrokeColor = "#fff";
  dataset.pointHighlightFill = "#fff";
  dataset.pointHighlightStroke = "rgba(220,220,220,1)";
}
