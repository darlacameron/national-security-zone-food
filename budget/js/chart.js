(function ($) {

var data = {};

var container = [];

// console.log (UN);

// console.log (UN[0].Country);

// console.log (food);

$.each(UN, function (i, v) {
	var UNCountry = v.Country;
	$.each(food, function (j, w) {
		var foodCountry = w.country;
		if (UNCountry === foodCountry) {
			// console.log('match',foodCountry, UNCountry);
			container.push (UNCountry);
		
		}
	});
	
});

// console.log (data);
console.log (container.length);
console.log (container);

})(jQuery);

/*

// SETUP VARIABLES, CAN CHANGE THESE TO RESIZE CHART
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.csv("../data/test-data.csv", function(error, data) {
  data.forEach(function(d) {
  		console.log(d)
  })
});

*/

