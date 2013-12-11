var counter = 0,
	animating = false;

var width = 960,
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

var startUp = function() {
	makeMap();
	makeCircles();
	highlightStep();
	writeText();
}

function makeMap() {
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
	});
};

function makeCircles(){
	var $steps = $('#steps');

	$.each(process_text, function(i, dp) {
		var $circle = $('<div class="circle step-' + i + '">');
		$steps.append($circle);
	});
}

$('#next').on('click', function() {
	if (animating) {
		return;
	}

	if (counter === pathPoints.length - 1) {
		counter = 0;
		d3.selectAll('.points').remove();
	} else {
		counter += 1;
		drawLine(counter);
		animatePath('next');
	}

	highlightStep();
	writeText();
	progress();
});

$('#prev').on('click', function() {
	if (animating) {
		return;
	}

	if (counter === 0) {
		counter = pathPoints.length - 1;
		var last = pathPoints.length - 1;
		for (var i = 0; i < last; i +=1) {
			drawLine(i);
		}
		drawLine(last);
		animatePath('next');
	} else {
		$('#point-' + counter).remove();

		drawLine(counter);
		animatePath('prev');

		counter -= 1;
	}

	highlightStep();
	writeText();
	progress();
});

function highlightStep() {
	$('.step-active').removeClass('step-active');
	$('.step-' + counter).addClass('step-active');
}

function drawLine(index) {
	path = svg.append('path')
		.attr('class', 'points')
		.attr('id', 'point-' + index)
		.attr('d', pathFunc(pathPoints[index]));
}

function animatePath(direction) {
	animating = true;

	var totalLength = path.node().getTotalLength(),
		beginning,
		end;

	if (direction === 'next') {
		beginning = totalLength;
		end = 0;
	} else {
		beginning = 0;
		end = totalLength;
	}

	path.attr("stroke-dasharray", totalLength + " " + totalLength)
	    .attr("stroke-dashoffset", beginning)
	    .transition()
	    .duration(1000)
	    .ease("linear")
	    .attr("stroke-dashoffset", end)
	    .each('end', function() {
	    	animating = false;
	    });
}

function writeText() {
	$('#headline').text(process_text[counter].headline);
	$('#location').text(process_text[counter].location);
	// $('#days').text(process_text[counter].days);

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

	if (counter === 0 || counter === 1) {
		$('#zero-days').show()
		$('#days').hide()
	} else {
		$('#zero-days').hide()
		$('#days').show()
	}
	
};



function convertToSlug(Text)
	{
    return Text
        .toLowerCase()
        .replace(/[^\w ]+/g,'')
        .replace(/ +/g,'-')
        ;
	}




startUp();







