var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .rangeRound([height, 0]);

var color = d3.scale.range(["#19374C", "#A4B48C", "#C86A28", "#C86A28", "#C86A28", "#A4B48C", "#19374C", "#A4B48C", "#A4B48C"]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(0);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/data.csv", function(error, data) {
  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Year"; }));

  data.forEach(function(d) {
    var y0 = 0;
    d.commodities = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
    d.total = d.commodities[d.commodities.length - 1].y1;
  });

  data.sort(function(a, b) { return b.total - a.total; });

  x.domain(data.map(function(d) { return d.Year; }));
  y.domain([0, d3.max(data, function(d) { return d.total; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      //.attr("transform", "rotate(-90)")
      .attr("y", -20)
      .attr("x", 70)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Metric tons");

  var state = svg.selectAll(".state")
      .data(data)
    .enter().append("g")
      .attr("transform", function(d) { return "translate(" + x(d.Year) + ",0)"; });

  state.selectAll("rect")
      .data(function(d) { return d.commodities; })
    .enter().append("rect")
      .attr("class", function(d){ return "bar " + convertToSlug(d.name)})
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.y1); })
      .attr("height", function(d) { return y(d.y0) - y(d.y1); })
      .style("fill", function(d) { return color(d.name); })
      //adding hover stuff here
      .on('mouseover', function(d){
          var classes = $(this).attr('class').replace(/ /g,'.'); //this finds the class of what you've hovered on
          d3.selectAll('.'+classes).style({'stroke': 'black', 'stroke-width': 2}) //matches all of the things w/ the hovered class and gives them a stroke
        })
      .on('mouseout', function(d){
          var classes = $(this).attr('class').replace(/ /g,'.'); //re-finds the class, since we're in a new function
          d3.selectAll('.'+classes).style({'stroke': 'none', 'stroke-width': 0}); //removes the stroke.
        });
      
  var legend = svg.selectAll(".legend")
      .data(color.domain().slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

});

function convertToSlug(Text)
{
    return Text
        .toLowerCase()
        .replace(/[^\w ]+/g,'')
        .replace(/ +/g,'-')
        ;
}
