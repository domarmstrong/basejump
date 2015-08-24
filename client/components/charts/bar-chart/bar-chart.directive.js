'use strict';

angular.module('basejumpApp')
  .directive('lineChart', function () {
    return {
      restrict: 'E',
      template: `<svg class="chart line-chart"></svg>`,
      link (scope, element, attributes) {
        let data2 = {
          label: 'bar',
          data: [
            { "year": "2000", "sale": "152" },
            { "year": "2002", "sale": "189" },
            { "year": "2004", "sale": "179" },
            { "year": "2006", "sale": "230" },
            { "year": "2008", "sale": "134" },
            { "year": "2010", "sale": "100" },
          ]
        };
        let data3 = {
          label: 'baz',
          data: [
            { "year": "2000", "sale": "162" },
            { "year": "2002", "sale": "139" },
            { "year": "2004", "sale": "199" },
            { "year": "2006", "sale": "220" },
            { "year": "2008", "sale": "134" },
            { "year": "2010", "sale": "110" },
          ]
        };
        let datasets = [
          {
            label: 'foo',
            data: [
              { "year": "2000", "sale": "202" },
              { "year": "2001", "sale": "215" },
              { "year": "2002", "sale": "179" },
              { "year": "2003", "sale": "199" },
              { "year": "2003", "sale": "134" },
              { "year": "2010", "sale": "176" },
            ],
          },
        ];

        // assign a random color to each dataset
        // TODO: better colors
        let colors = ['red', 'green', 'blue', 'yellow', 'orange'];
        colors.sort((a,b) => Math.round(Math.random()) ? 1 : -1);

        let svg = element.find('svg').get(0),
          WIDTH = element.width(),
          HEIGHT = attributes.height || 500,
          MARGINS = {
            top: 20,
            right: 20,
            bottom: 20,
            left: 50
          },
          UNIQUEKEY = attributes.uniqueKey || 'label',
          XKEY = attributes.xkey || 'year',
          YKEY = attributes.ykey || 'sale';

        let vis = d3.select(svg)
          .attr('height', HEIGHT);

        function getMinMax(datasets, key) {
          return datasets.reduce((values, dataset) => {
            let min = d3.min(dataset.data, d => d[key]);
            let max = d3.max(dataset.data, d => d[key]);
            if (min < values.min) values.min = min;
            if (max > values.max) values.max = max;
            return values;
          }, {min: Infinity, max: 0});
        }

        function updateScales(datasets) {
          let xDomain = getMinMax(datasets, XKEY);
          let yDomain = getMinMax(datasets, YKEY);
          let xScale = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([xDomain.min, xDomain.max]);
          let yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([yDomain.min, yDomain.max]);
          let xAxis = d3.svg.axis().scale(xScale);
          let yAxis = d3.svg.axis().scale(yScale).orient("left");
          return { xScale, yScale, xAxis, yAxis };
        }

        let initialized = false;
        function initialize() {
          // Create initial x and y axis
          vis.append("svg:g")
            .attr("class","x-axis axis")
            .attr("transform", `translate(0,${HEIGHT - MARGINS.bottom})`);

          vis.append("svg:g")
            .attr("class","y-axis axis")
            .attr("transform", `translate(${MARGINS.left},0)`);

          initialized = true;
        }

        function render() {
          let { xScale, yScale, xAxis, yAxis } = updateScales(datasets);

          if (! initialized) initialize();

          console.log('render', datasets.length);

          // Renders lines flat along the xAxis to start
          let lineCreate = d3.svg.line()
            .x(d => xScale(d[XKEY]))
            .y(d => HEIGHT - MARGINS.left)
            .interpolate('basis');

          // Renders lines correctly
          let lineGen = d3.svg.line()
            .x(d => xScale(d[XKEY]))
            .y(d => yScale(d[YKEY]))
            .interpolate('basis');

          // Get the allocated color
          datasets.forEach((dataset, i) => dataset.color = colors[i]);

          // Create selection
          let lines = vis.selectAll('.line').data(datasets);

          // On enter
          let bottomLeft = `${MARGINS.left},${HEIGHT-MARGINS.bottom}`;
          let bottomRight = `${WIDTH - MARGINS.right},${HEIGHT-MARGINS.bottom}`;
          lines.enter()
            .append('svg:path')
            .attr('class', 'line')
            .attr('stroke', d => d.color)
            .attr('stroke-width', 2)
            .attr('fill', 'none')
            .style('opacity', 0)
            .attr('d', d => lineCreate(d.data));

          // apply to all
          // Animate line into position
          lines
            .transition().duration(750)
            .style('opacity', 1)
            .attr('d', d => lineGen(d.data));

          // On exit
          lines.exit().remove();

          vis.selectAll("g.x-axis")
            .transition().duration(500).ease("sin-in-out")
            .call(xAxis);
          vis.selectAll("g.y-axis")
            .transition().duration(500).ease("sin-in-out")
            .call(yAxis);
        }

        //attributes.$observe('chart', render);
        render();

        setTimeout(() => { datasets.push(data2); render() }, 1000);
        setTimeout(() => { datasets.push(data3); render() }, 2000);
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
