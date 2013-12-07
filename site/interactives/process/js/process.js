var counter = 0,
	animating = false;

var width = 900,
	height = 500;

var projection = d3.geo.mercator()
	.center([-12.949707, 26.358221])
	.scale(310);

var pathFunc = d3.geo.path().projection(projection),
	path;

var svg = d3.select("#map").append("svg")
	.attr("width", width)
	.attr("height", height)
	.append('g');

d3.json("data/world-us-lakes-topo.json", function(error, world) {
  	
  	var subunits = topojson.feature(world, world.objects.subunits).features,
	  	subunitsMesh = topojson.mesh(world, world.objects.subunits, function(a, b) { return a !== b; }),
	  	states = topojson.feature(world, world.objects.states).features,
		statesMesh = topojson.mesh(world, world.objects.states, function(a, b) { return a !== b; }),
		lakes = topojson.feature(world, world.objects.lakes).features;


    svg.selectAll(".subunit")
	      .data(subunits)
	      .enter().append("path")
	      .attr("class", function(d) { return "country " + convertToSlug(d.properties.name); })
	      .attr("d", pathFunc);

	svg.selectAll(".states")
	      .data(states)
	      .enter().append("path")
	      .attr("class", function(d) { return "state " + convertToSlug(d.properties.name); })
	      .attr("d", pathFunc);

	svg.selectAll(".lakes")
	      .data(lakes)
	      .enter().append("path")
	      .attr("class", function(d) { return "lake " + convertToSlug(d.properties.name); })
	      .attr("d", pathFunc);

    svg.append("path")
        .datum(subunitsMesh)
        .attr("class", "boundary")
        .attr("d", pathFunc);

    svg.append("path")
        .datum(statesMesh)
        .attr("class", "boundary")
        .attr("d", pathFunc);

    highlightStep();
	writeText();
});

var highlightStep = function() {
	$('.step-active').removeClass('step-active');
	$('.step-' + counter).addClass('step-active');
};

// function drawLine(direction) {
// 	if (counter === 0) {
// 		d3.selectAll('.points').remove();
// 	} else {
// 		animating = true;

// 		var path = svg.append('path')
// 			.attr('class', 'points')
// 			.attr('id', 'point-' + counter)
// 			.attr('d', pathFunc(pathPoints[counter]));

// 		var totalLength = path.node().getTotalLength();

// 		if (direction === 'next') {
// 			animatePath(path, totalLength, totalLength, 0);
// 		} else {
// 			animatePath(path, totalLength, 0, totalLength);
// 		}
		
// 	}
// }

function drawLine(index) {
	path = svg.append('path')
		.attr('class', 'points')
		.attr('id', 'point-' + index)
		.attr('d', pathFunc(pathPoints[index]));
}

var animatePath = function() {
	animating = true;

	var totalLength = path.node().getTotalLength();

	path.attr("stroke-dasharray", totalLength + " " + totalLength)
	    .attr("stroke-dashoffset", totalLength)
	    .transition()
	    .duration(1000)
	    .ease("linear")
	    .attr("stroke-dashoffset", 0)
	    .each('end', function() {
	    	animating = false;
	    });
};

function writeText() {
	$('#headline').text(process_text[counter].headline);
	$('#location').text(process_text[counter].location);
	$('#days').text(process_text[counter].days);

	var $body = $('#body');
	$body.text('');
	$.each(process_text[counter].body, function(i, sentence) {
		var $sentence = $('<div class="body">');
		$sentence.text(sentence);
		$body.append($sentence);
	});
}

var progress = function() {
	var total = 115,
		width = (process_text[counter].days / total) * 100;

	$('#progress-bar #bar-fill').animate({'width': width + '%'}, 1000);
	$('#days').text(process_text[counter].days);
};

$('#next').on('click', function() {
	if (animating) {
		return;
	}

	if (counter === pathPoints.length - 1) {
		counter = 0;
	} else {
		counter += 1;
	}
	
	highlightStep();
	drawLine(counter);
	animatePath();
	writeText();
	progress();
});

$('#prev').on('click', function() {
	if (animating) {
		return;
	}

		

	if (counter === 0) {
		// var days = d3.range(pathPoints.length);
		// days.forEach(function(day, i) {
		// 	drawLine()
		// });

		counter = pathPoints.length - 1;
	} else {
		$('#point-' + counter).remove();
		drawLine('prev');
		counter -= 1;
	}

	highlightStep();
	writeText();
	progress();
});

function convertToSlug(Text)
	{
    return Text
        .toLowerCase()
        .replace(/[^\w ]+/g,'')
        .replace(/ +/g,'-')
        ;
	}

function makeCircles(){
	var $steps = $('#steps');

	$.each(process_text, function(i, dp) {
		var $circle = $('<div class="circle step-' + i + '">');
		$steps.append($circle);
	});
}
makeCircles();










