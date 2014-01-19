(function($) {
  'use strict';


var init = function() {
  // showAnnotation();
};

var margin = {top: 0, right: 50, bottom: 30, left: 200},
    width = 960 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var y0 = d3.scale.ordinal()
    .rangeRoundBands([height, 0], 0.2);

var y1 = d3.scale.linear();

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.1, 0);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    //.tickFormat(formatDate);

var nest = d3.nest()
    .key(function(d) { return d.commodity; });

var stack = d3.layout.stack()
    .values(function(d) { return d.values; })
    .x(function(d) { return d.year; })
    .y(function(d) { return d.metricTon; })
    .out(function(d, y0) { d.valueOffset = y0; });

//var color = d3.scale.category10();

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("data/data.tsv", function(error, data) {

  data.forEach(function(d) {
     d.metricTon = +d.metricTon;
  });

  var dataByGroup = nest.entries(data);

  stack(dataByGroup);
  x.domain(dataByGroup[0].values.map(function(d) { return d.year; }));
  y0.domain(dataByGroup.map(function(d) { return d.key; }));
  y1.domain([0, d3.max(data, function(d) { return d.metricTon; })]).range([y0.rangeBand(), 0]);

  var group = svg.selectAll(".group")
      .data(dataByGroup)
    .enter().append("g")
      .attr("class", "group")
      .attr("transform", function(d) { return "translate(0," + y0(d.key) + ")"; });

   group.append("text")
      .attr("class", "label")
      .attr("x", -6)
      .attr("y", function(d) { return y1(d.values[0].metricTon / 2); })
      .attr("dy", ".35em")
      .text(function(d) { return d.key; })
      .style({'opacity': '1'});

  group.selectAll("rect")
      .data(function(d) { return d.values; })
    .enter().append("rect")
      //.style("fill", function(d) { return color(d.commodity); })
      .attr("x", function(d) { return x(d.year); })
      .attr("y", function(d) { return y1(d.metricTon); })
      .attr("width", x.rangeBand())
      .attr("class", function(d){ return "bar " + convertToSlug(d.commodity)})
      .attr("height", function(d) { return y0.rangeBand() - y1(d.metricTon); });

  group.filter(function(d, i) { return !i; }).append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + y0.rangeBand() + ")")
      .call(xAxis);

  d3.selectAll("input").on("change", change);

  var timeout = setTimeout(function() {
    d3.select("input[value=\"stacked\"]").property("checked", true).each(change);}, 2000);

  function change() {
    clearTimeout(timeout);
    if (this.value === "multiples") transitionMultiples();
    else transitionStacked();
  }

  function transitionMultiples() {
    var t = svg.transition().duration(750).ease("bounce").duration(1500),
        g = t.selectAll(".group").attr("transform", function(d) { return "translate(0," + y0(d.key) + ")"; });
    g.selectAll("rect").attr("y", function(d) { return y1(d.metricTon); });
    g.select(".label")//.attr("y", function(d) { return y1(d.values[0].metricTon / 2); })
                      .style({'opacity': '0.8'});
     hideAnnotation();
  }

  function transitionStacked() {
    var t = svg.transition().duration(750),
        g = t.selectAll(".group").attr("transform", "translate(0," + y0(y0.domain()[0]) + ")");
    g.selectAll("rect").attr("y", function(d) { return y1(d.metricTon + d.valueOffset); });
    g.select(".label")//.attr("y", function(d) { return y1(d.values[0].metricTon / 2 + d.values[0].valueOffset); })
                      .style({'opacity': '0'});
     showAnnotation();
  }
});


var showAnnotation = function() {
  $('#annotation').fadeIn(1000);
};

var hideAnnotation = function () {
  $('#annotation').fadeOut(200);
};

function convertToSlug(Text)
{
    return Text
        .toLowerCase()
        .replace(/[^\w ]+/g,'')
        .replace(/ +/g,'-')
        ;
}

init();

})(jQuery);