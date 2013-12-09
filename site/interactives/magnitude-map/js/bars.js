
var margin = {top: 20, right: 20, bottom: 30, left: 75},
    width = 450 - margin.left - margin.right,
    height = 130 - margin.top - margin.bottom;
    //barHeight = 20,
    //height = barHeight * data.length;
    

var x = d3.scale.linear()
    .rangeRound([0, width]);

var y = d3.scale.ordinal()
    .rangeRoundBands([0, height], 0.1);

var color1 = d3.scale.category20c();
              //.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var color2 = d3.scale.category10();
              //.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("top")
    .ticks(4, '%')
    .innerTickSize(-height)
    .outerTickSize(0);


var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");


var chart1 = d3.select("#processors").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("data/processors.tsv", function(error, data) {
  color1.domain(d3.keys(data[0]).filter(function(key) { return key !== "Processors"; }));

  data.forEach(function(d) {
    var y0 = 0;
    d.companies = color1.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
    d.total = d.companies[d.companies.length - 1].y1;
  });

  data.sort(function(a, b) { return b.total - a.total; });

  y.domain(data.map(function(d) { return d.Processors; }));
  x.domain([0, d3.max(data, function(d) { return 1/*d.total*/; })]);

  chart1.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0,0)")
      .call(xAxis);

  chart1.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  var state = chart1.selectAll(".state")
      .data(data)
    .enter().append("g")
      .attr("transform", function(d) { return "translate(0, " + y(d.Processors) + ")"; });

  state.selectAll("rect")
      .data(function(d) { return d.companies; })
    .enter().append("rect")
      .attr("class", function(d){ return "bar" + convertToSlug(d.name)})
      .attr("height", y.rangeBand())
      .attr("x", function(d) { return x(d.y0); })
      .attr("width", function(d) { return x(d.y1) - x(d.y0); })
      .style("fill", function(d) { return color1(d.name); })

  chart1.append("g")
    .attr("class", "axis")
    .call(xAxis)
  .select(".tick line")
    .style("stroke", "#000");

});


var chart2 = d3.select("#shippers").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("data/shippers.tsv", function(error, data) {
  color2.domain(d3.keys(data[0]).filter(function(key) { return key !== "Shippers"; }));

  data.forEach(function(d) {
    var y0 = 0;
    d.companies = color2.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
    d.total = d.companies[d.companies.length - 1].y1;
  });

  data.sort(function(a, b) { return b.total - a.total; });

  y.domain(data.map(function(d) { return d.Shippers; }));
  x.domain([0, d3.max(data, function(d) { return 1/*d.total*/; })]);

  chart2.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0,0)")
      .call(xAxis);

  chart2.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  var state = chart2.selectAll(".state")
      .data(data)
    .enter().append("g")
      .attr("transform", function(d) { return "translate(0, " + y(d.Shippers) + ")"; });

  state.selectAll("rect")
      .data(function(d) { return d.companies; })
    .enter().append("rect")
      .attr("class", function(d){ return "bar" + convertToSlug(d.name)})
      .attr("height", y.rangeBand())
      .attr("x", function(d) { return x(d.y0); })
      .attr("width", function(d) { return x(d.y1) - x(d.y0); })
      .style("fill", function(d) { return color2(d.name); })

  chart2.append("g")
    .attr("class", "axis")
    .call(xAxis)
  .select(".tick line")
    .style("stroke", "#000");

});

function convertToSlug(Text)
{
    return Text
        .toLowerCase()
        .replace(/[^\w ]+/g,'')
        .replace(/ +/g,'-')
        ;
}
