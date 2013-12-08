(function($) {
	'use strict';
	//var d;

var init = function() {

};


var width = 900,
	height = 500;

var projection = d3.geo.albersUsa(),
	pathFunc = d3.geo.path().projection(projection);

var svg = d3.select("#map").append("svg")
	.attr("width", width)
	.attr("height", height)
	.append('g');

d3.json("data/combined-topo.json", function(error, us) {
  	
  	console.log(us);
  	var states = topojson.feature(us, us.objects['states-geo']).features,
		statesMesh = topojson.mesh(us, us.objects['states-geo'], function(a, b) { return a !== b; });

	var lines = topojson.feature(us, us.objects['lines-geo']).features,
		ports = topojson.feature(us, us.objects['ports-geo']).features;
	
	//console.log(lines,ports)

    svg.selectAll(".state")
	    .data(states)
	    .enter().append("path")
	    //.attr('class', 'state')
	    .attr("class", function(d) { return "state " + convertToSlug(d.properties.name); })
	    .attr("d", pathFunc);

	svg.append('path')
	    .datum(statesMesh)
	    // .attr("class", function(d) { return "state " + convertToSlug(d.properties.name); })
	    .attr('class', 'boundary')
	    .attr("d", pathFunc);

	svg.selectAll(".line")
	    .data(lines)
	    .enter().append("path")
	    .attr('class', 'line')
	    .attr("class", function(d) { return "line " + convertToSlug(d.properties.vendor); })
	    .attr("d", pathFunc);

	svg.selectAll(".port")
	    .data(ports)
	    .enter().append("path")
	    .attr('class', 'port')
	    .attr('data-total', function(d){ return d.properties['Total payments']})
	    .attr("d", pathFunc);

	
			var proj = projection(d);
			// if (proj[0] === null) {
			// 	proj[0] = 0;
			// }

			if (proj === null) {
				return projection([0,0]);
			} else {
				return proj[0];
			}
			
		});
		
//});

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
