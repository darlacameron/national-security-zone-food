(function($) {
	'use strict';

var data,
	years = d3.set(comm_data.map(function(v) { return v.year; } )).values(),
	DUR = 600,
	svg,
	yScale,
	xScale;

var xSlider,
	handle;

data = years.map(function(year, i) {
	var vals = [],
		totals = { total: 0 };

	comm_data.forEach(function(dp, i) {
		var y = dp.year.toString(),
			region = dp.region.split('/')[0].toLowerCase();

		// if (y === year && typeof dp.mal !== 'undefined' && dp.pounds !== 'NA' && dp.country !== 'Russia') {
		if (y === year && typeof dp.mal !== 'undefined' && dp.pounds !== 'NA') {
			dp.pounds = parseFloat(dp.pounds);
			dp.mal = parseFloat(dp.mal);
			dp.slug = convertToSlug(dp.country);
			vals.push(dp);

			if (typeof totals[region] === 'undefined') {
				totals[region] = 0;
			}

			totals[region] += dp.pounds;
			totals.total += dp.pounds
		}
	});

	return {
		year: year,
		africa: totals.africa,
		asia: totals.asia,
		europe: totals.europe,
		sam: totals.americas,
		total: totals.total,
		values: vals
	};

});

// console.log(data)


// // get mins and maxes
// var vals = [];

// for (var i = 0; i < data.length - 1; i += 1) {
// 	vals.push(d3.max(data[i].values, function (d) {
// 			return (d['mal']);
// 		}))
// }

// console.log(d3.max(vals))




var year = 0,
	curr_data = data[year];

var init = function() {
	$('.tooltip').hide();
	makeChart();
	makeSlider();
	drawCircles();
};

var makeChart = function() {
	var W = 800,
		H = 500,
		margin = {top: 20, right: 20, bottom: 30, left: 50},
		w = W - margin.left - margin.right,
		h = H - margin.top - margin.bottom;

	var thousFormat = d3.format('s'),
		perFormat = d3.format('%');

	xScale = d3.scale.linear()
		// .domain([5, 77])
		// .domain([0, 82]) // old correct one
		.domain([0, 82])
		.range([0, w]);

	yScale = d3.scale.linear()
		// .domain([44090, 10731551758]) // with russia
		// .domain([44090, 2150829830]) // old correct one
		// .domain([44090, 3226244745])
		// .domain([44090, 4301659660])
		.domain([44090, 2150829830]) // with new 2013 mins and maxes
		.range([h, 0]); //pixel output

	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient('bottom')
		.tickFormat(function(d) {
			d = d + '%';
			return d;
		})
		.tickSize(0)
		.tickPadding(12);

	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient('left')
		.tickFormat(function (d) {
	      	d = addCommas(d / 100000);
	      	return d;
	    })
	    .tickSize(-w)
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

	// svg.append('g')
	// 	.call(d3.svg.axis()
	// 		.scale(yScale)
	// 		.orient("left")
	// 		.ticks(5)
	// 		.tickSize(-w,0,0)
	// 		.tickFormat("")
 //    )
};

var drawCircles = function() {
	curr_data = data[year];

	var circle = svg.selectAll('.circle')
		.data(curr_data.values, function(d) { return d.slug; })

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
			} else if (d.region === 'Americas') {
				return 'circle sam';
			}
		})
		.attr('cx', 0).attr('cy', yScale(-20000000000))
		.on('mouseover', function(d) {
			// console.log(d.country, d.pounds);
			var pounds = roundAddCommas(d.pounds);
			d3.select('.tooltip h2').text(d.country);
			d3.select('.tooltip .pounds span').text(pounds);
			d3.select('.tooltip .mal span').text(d.mal);

			var mouse = d3.event;
			positionTooltip(mouse);
		})
		.on('mouseout', function(d){
			$('.tooltip').hide()
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

	setKey();
	showAnnotation();
};

var positionTooltip = function(coords){
	var mouseX = coords.pageX;
    var mouseY = coords.pageY;
	var screenWidth = $(window).width();
    var screenHeight = $(window).height();

    var top;
    var left;

    if (mouseX > (screenWidth/2)) {
    	left = mouseX - 195;
    }
    else {
    	left = mouseX + 10;
    }
    if (mouseY > (screenHeight/2)) {
    	top = mouseY - 100;
    }
    else {
    	top = mouseY - 10;
    }
    
    $('.tooltip').css({'top':top, 'left':left}).show()

//	$('.tooltip').css({'top':coords.pageY - 10, 'left':coords.pageX + 10}).show()
};

var setKey = function() {
	var total = curr_data.total,
		africa = (curr_data.africa / total) * 100,
		asia = (curr_data.asia / total) * 100,
		europe = (curr_data.europe / total) * 100,
		sam = (curr_data.sam / total) * 100;

	$('.key-row .africa').animate({'width': africa + '%'}, DUR);
	$('.key-row .asia').animate({'width': asia + '%'}, DUR);
	$('.key-row .europe').animate({'width': europe + '%'}, DUR);
	$('.key-row .sam').animate({'width': sam + '%'}, DUR);
};

var showAnnotation = function() {
	var currYear = curr_data.year;
	$('.annotation').fadeOut();
	$('.annoArrows').fadeOut();

	if (currYear === '1993') {
		$('#Rus1').fadeIn();
		$('#Rus1Arrows').fadeIn();
	} else if (currYear === '1999') {
		$('#Rus2').fadeIn();
		$('#Rus2Arrows').fadeIn();
	} else if (currYear === '2003') {
		$('#Eth').fadeIn();
		$('#EthArrows').fadeIn();
	} else if (currYear === '2005') {
		$('#Eri').fadeIn();
		$('#EriArrows').fadeIn();
	} else if (currYear === '2006') {
		$('#Eur').fadeIn();
		$('#EurArrows').fadeIn();
	} else if (currYear === '2010') {
		$('#Bur').fadeIn();
		$('#BurArrows').fadeIn();
	}
};


$('#next').on('click', function() {
	if (year === data.length - 1) {
		year = 0;
	} else {
		year += 1;
	}

	drawCircles();

	setBrush(curr_data.year);
});

$('#prev').on('click', function() {
	if (year === 0) {
		year = data.length - 1;
	} else {
		year -= 1;
	}

	drawCircles();

	setBrush(curr_data.year);
});			

var makeSlider = function() {
	var W = 400,
		H = 70,
		margin = {top: 10, right: 20, bottom: 10, left: 20},
	    w = W - margin.left - margin.right,
	    h = H - margin.bottom - margin.top;

	var timeFormat = d3.format('0000');

	xSlider = d3.scale.linear()
	    .domain(d3.extent(years))
	    .range([0, w])
	    .clamp(true);

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

	handle = slider.append('circle')
	    .attr('class', 'slider-handle')
	    .attr('transform', 'translate(0,' + h / 2 + ')')
	    .attr('r', 9);

	var starter = 2009,
		sliderStarted = false;

	function brushed() {
		var value = brush.extent()[0];

		if (d3.event.sourceEvent) {
			value = xSlider.invert(d3.mouse(this)[0]);
			brush.extent([value, value]);
		}

		var diff = 1,
			nearestYear = value;

		years.forEach(function(year, i) {
			var year = parseFloat(year),
				thisDiff = Math.abs(year - value);

			if (thisDiff < diff) {
				diff = thisDiff;
				nearestYear = year;
			}
		});

		setBrush(nearestYear);

		if (sliderStarted) {
			if (nearestYear.toString() !== data[year].year) {
				year = years.indexOf(nearestYear.toString());
				drawCircles();
			}
		}

		sliderStarted = true;
	}
};

var setBrush = function(x) {
	handle.attr('cx', xSlider(x));
};


/* helper functions */

var addCommas = function(num) {
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

var roundAddCommas = function(num) {
	var n = Math.round(num / 100000) / 10;
	return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' million';
};

function convertToSlug(Text) {
	return Text
	    .toLowerCase()
	    .replace(/[^\w ]+/g,'')
	    .replace(/ +/g,'-');
}



init();

})(jQuery);
