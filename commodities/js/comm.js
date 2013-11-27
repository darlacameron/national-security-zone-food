(function($) {
	'use strict';

var data,
	years = d3.set(comm_data.map(function(v) { return v.year; } )).values(),
	DUR = 1000,
	svg,
	yScale,
	xScale;

var data = years.map(function(year, i) {
	var vals = [];

	comm_data.forEach(function(dp, i) {
		var y = dp.year.toString();

		// if (y === year && typeof dp.mal !== 'undefined' && dp.pounds !== 'NA' && dp.country !== 'Russia') {
		if (y === year && typeof dp.mal !== 'undefined' && dp.pounds !== 'NA') {
			dp.pounds = parseFloat(dp.pounds);
			dp.mal = parseFloat(dp.mal);
			vals.push(dp);
		}
	});

	return {
		year: year,
		values: vals
	};

});

var year = data.length - 1,
	curr_data = data[year];

console.log(curr_data)

var init = function() {
	makeChart();
	makeSlider();
	drawCircles();
};

var makeChart = function() {
	var W = 900,
		H = 600,
		margin = {top: 20, right: 20, bottom: 20, left: 40},
		w = W - margin.left - margin.right,
		h = H - margin.top - margin.bottom;

	var thousFormat = d3.format('s');

	xScale = d3.scale.linear()
		.domain([5, 77])
		.range([0, w]);

	yScale = d3.scale.linear()
		// .domain([44090, 10731551758]) // with russia
		.domain([44090, 2150829830])
		.range([h, 0]); //pixel output

	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient('bottom')
		.tickSize(0)
		.tickPadding(12);

	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient('left')
		.tickFormat(function (d) {
	      if ((d / 1000000) >= 1) {
	        d = d / 1000000;
	      }
	      return d;
	    })
	    .tickSize(0)
	    .tickPadding(12);

	svg = d3.select('#chart')
		.append('svg')
		.attr('width', W)
		.attr('height', H)
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
		.attr('height', h + margin.bottom);

	svg.append('g')
		.attr('class', 'x axis')
		.attr('transform', 'translate(0,' + h + ')')
		.call(xAxis);

	svg.append('g')
		.attr('class', 'y axis')
		.attr('transform', 'translate(0,' + 0 + ')')
		.call(yAxis);
};

var drawCircles = function() {
	var circle = svg.selectAll('.circle')
		.data(curr_data.values, function(d) { return d.country; })

	circle.enter()
		.append('circle')
		.attr('r', 5)
		.attr('class', function(d) {
			if (d.region === 'Asia') {
				return 'circle asia';
			} else if (d.region === 'Africa') {
				return 'circle africa';
			} else if (d.region === 'Europe') {
				return 'circle europe';
			} else if (d.region === 'Central/South America/Caribbean') {
				return 'circle sam';
			}
		})
		.attr('cx', 0).attr('cy', yScale(-20000000000))
		.on('mouseover', function(d) {
			console.log(d.country, d.pounds);
		});

	circle.transition()
		.duration(DUR)
		.attr('cx', function(d) {
			return xScale(d['mal']);
		})
		.attr('cy', function(d) {
			return yScale(d['pounds']);
		});
		
	circle.exit()
		.transition()
		.duration(DUR)
		.attr('cx', 0)
		.attr('cy', yScale(-20000000000))
		.remove();
};




$('#next').on('click', function() {
	year += 1;
	curr_data = data[year];

	$(this).find('span').text(curr_data.year);

	drawCircles();
});


var makeSlider = function() {
	var W = 800,
		H = 200,
		margin = {top: 10, right: 20, bottom: 10, left: 20},
	    w = W - margin.left - margin.right,
	    h = H - margin.bottom - margin.top;

	var timeFormat = d3.format('0000');

	var xSlider = d3.scale.linear()
	    .domain(d3.extent(years))
	    .range([0, w])
	    .clamp(true);

	// var xSlider = d3.scale.ordinal()
	// 	.domain(years)
	// 	.rangePoints([0, w]);

	var brush = d3.svg.brush()
	    .x(xSlider)
	    .extent([0, 0])
	    .on('brush', brushed);

	var svgS = d3.select('#slider').append('svg')
	    .attr('width', W)
	    .attr('height', H)
	  	.append('g')
	    .attr('transform', 'translate(' + margin.left + ',' + (margin.top) + ')');

	svgS.append('g')
	    .attr('class', 'x slider-axis')
	    .attr('transform', 'translate(0,' + h / 2 + ')')
	    .call(d3.svg.axis()
	      .scale(xSlider)
	      .orient("bottom")
	      // .tickValues(years)
	      .tickSize(0)
	      .tickFormat(timeFormat)
	      .tickPadding(12))
	  	.select('.domain')
	  	.select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
	    .attr('class', 'slider-halo');

	var slider = svgS.append('g')
	    .attr('class', 'slider-slider')
	    .call(brush);

	slider.selectAll('.extent, .resize')
	    .remove();

	slider.select('.background')
	    .attr('height', h);

	var handle = slider.append('circle')
	    .attr('class', 'slider-handle')
	    .attr('transform', 'translate(0,' + h / 2 + ')')
	    .attr('r', 9);

	var starter = 2009;

	slider
	    .call(brush.event)
	  	.transition() // gratuitous intro!
	    .duration(750)
	    .call(brush.extent([starter, starter]))
	    .call(brush.event);

	function brushed() {
		var value = brush.extent()[0];

		// console.log(d3.mouse(this))

		if (d3.event.sourceEvent) { // not a programmatic event
			value = xSlider.invert(d3.mouse(this)[0]);
			// value = (d3.mouse(this)[0]);
			brush.extent([value, value]);
		}

		// handle.attr('cx', xSlider(value));
		// console.log(value)

		var diff = 1,
			yr = value;

		years.forEach(function(year, i) {
			var year = parseFloat(year),
				f = Math.abs(year - value);

			if (diff > f) {
				diff = f;
				yr = year;
			}
		});

		handle.attr('cx', xSlider(yr));

		if (year !== yr.toString()) {
			// year = years.indexOf(yr.toString());
			// curr_data = data[year];
			// drawCircles();
		}

	}
};













init();

})(jQuery);
