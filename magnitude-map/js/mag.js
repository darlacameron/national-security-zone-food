(function($) {
	'use strict';

var init = function() {

};

// var vendors = [];


// console.log(mag_data)

// mag_data.forEach(function(dp, i) {
// 	// return [ dp['vend long'], dp['vend lat'] ];
// 	// return {
// 	// 	type: 'Point',
// 	// 	coordinates: [ dp['vend long'], dp['vend lat'] ]
// 	// }

// 	if ( (parseFloat(dp['vend long']) > 0 || parseFloat(dp['vend long']) < 0) && (dp['vend lat'] > 0 || dp['vend lat'] < 0)) {
// 		vendors.push([ parseFloat(dp['vend long']), parseFloat(dp['vend lat'])]);
// 	}
// });

// var totalDays = mag_data.forEach(function(dp, i) {
// 	var start = dp['Commodity Order Date'].split('/'),
// 		end = dp['Commodity Order Date'].split('/');
// });

// var vendors = mag_data.map(function(dp, i) {
// 	return [ parseFloat(dp['vend long']), parseFloat(dp['vend lat']) ];
// });

// var drops = mag_data.map(function(dp, i) {
// 	return [ parseFloat(dp['point long']), parseFloat(dp['point lat']) ];
// });

// var ports = mag_data.map(function(dp, i) {
// 	return [ parseFloat(dp['port long']), parseFloat(dp['port lat']) ];
// });

var vendors = [],
	drops = [],
	ports = [];

mag_data.forEach(function(dp, i) {
	var vendor = [ parseFloat(dp['vend long']), parseFloat(dp['vend lat']) ],
		drop = [ parseFloat(dp['point long']), parseFloat(dp['point lat']) ],
		port = [ parseFloat(dp['port long']), parseFloat(dp['port lat']) ];

	var dupeV = false,
		dupeD = false,
		dupeP = false;

	vendors.forEach(function(v) {
		if (vendor[0] == v[0] && vendor[1] == v[1]) {
			dupeV = true;
		}
	});

	if (dupeV === false) {
		vendors.push(vendor);
	}

	drops.forEach(function(v) {
		if (drop[0] == v[0] && drop[1] == v[1]) {
			dupeD = true;
		}
	});

	if (dupeD === false) {
		drops.push(drop);
	}

	ports.forEach(function(v) {
		if (port[0] == v[0] && port[1] == v[1]) {
			dupeP = true;
		}
	});

	if (dupeP === false) {
		ports.push(port);
	}
});

console.log(vendors.length, drops.length, ports.length)

var width = 900,
	height = 500;

var projection = d3.geo.albersUsa(),
	pathFunc = d3.geo.path().projection(projection);

var svg = d3.select("#map").append("svg")
	.attr("width", width)
	.attr("height", height)
	.append('g');

d3.json("data/us-topo.json", function(error, us) {
  	
  	var states = topojson.feature(us, us.objects['states-geo']).features,
		statesMesh = topojson.mesh(us, us.objects['states-geo'], function(a, b) { return a !== b; });

    svg.selectAll(".state")
	    .data(states)
	    .enter().append("path")
	    .attr('class', 'state')
	    // .attr("class", function(d) { return "country " + convertToSlug(d.properties.name); })
	    .attr("d", pathFunc);

	svg.append('path')
	    .datum(statesMesh)
	    // .attr("class", function(d) { return "state " + convertToSlug(d.properties.name); })
	    .attr('class', 'boundary')
	    .attr("d", pathFunc);

	svg.selectAll('.vendor')
		.data(vendors)
		.enter().append('circle')
		.attr('r', 4)
		.attr('class', 'vendor')
		.attr('cx', function(d) {
			// if (d[0] === null) {
			// 	d[0] = 0;
			// }
			// console.log(d)
			var proj = projection(d);
			// if (proj[0] === null) {
			// 	proj[0] = 0;
			// }

			if (proj === null) {
				return projection([0,0]);
			} else {
				return proj[0];
			}
			
		})
		.attr('cy', function(d) {
			var proj = projection(d);
			if (proj === null) {
				return projection([0,0]);
			} else {
				return proj[1];
			}
		});

	svg.selectAll('.drop')
		.data(drops)
		.enter().append('circle')
		.attr('r', 4)
		.attr('class', 'drop')
		.attr('cx', function(d) {
			var proj = projection(d);
			if (proj === null) {
				return projection([0,0]);
			} else {
				return proj[0];
			}
			
		})
		.attr('cy', function(d) {
			var proj = projection(d);
			if (proj === null) {
				return projection([0,0]);
			} else {
				return proj[1];
			}
		});

	svg.selectAll('.port')
		.data(ports)
		.enter().append('circle')
		.attr('r', 2)
		.attr('class', 'port')
		.attr('cx', function(d) {
			var proj = projection(d);
			if (proj === null) {
				return projection([0,0]);
			} else {
				return proj[0];
			}
			
		})
		.attr('cy', function(d) {
			var proj = projection(d);
			if (proj === null) {
				return projection([0,0]);
			} else {
				return proj[1];
			}
		});

	for (var i = 0; i < drops.length; i += 1) {
		svg.append('path')
			.attr('d', function(d) {
				return pathFunc([])
			})
	}
});






init();

})(jQuery);
