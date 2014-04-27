
//maximums for each chart set
var costTonMax = 2100;
var recipientTonMax = 180;
var costRecipientMax = 170;

// recycleable vars

var label1 = "cost per ton";
var label2 = "recipients per ton";
var label3 = "cost per recipient";

var title1 = "Africa";
var title2 = "Asia";
var title3 = "Americas";

var color1 = "#78c679";
var color2 = "#238443";
var color3 = "#004529";

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 300 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;



//one of these for each country and each row
charts("africaCT", '#CTafrica', costTonMax, label1, title1, color1);
charts("asiaCT", '#CTasia', costTonMax, label1, title2, color2);
charts("americasCT", '#CTamericas', costTonMax, label1, title3, color3);

//run chart function with specific max for each row

charts("africaRT", '#RTafrica', recipientTonMax, label2, title1, color1);
charts("asiaRT", '#RTasia', recipientTonMax, label2, title2, color2);
charts("americasRT", '#RTamericas', recipientTonMax, label2, title3, color3);

charts("africaCR", '#CRafrica', costRecipientMax, label3, title1, color1);
charts("asiaCR", '#CRasia', costRecipientMax, label3, title2, color2);
charts("americasCR", '#CRamericas', costRecipientMax, label3, title3, color3);


// 'region' is the part of the world, 'id' is used to call the chart within the page, 'max' is the maximum value for that row of charts and 'label' is the y axis label

function charts(region, id, max, label, title, color){

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var x2 = d3.scale.ordinal()
  .rangeBands([0, width], 0);

var y = d3.scale.linear()
    .range([height, 0]);
  
var xFormat = d3.time.format('%y');

var xAxis = d3.svg.axis()
    .scale(x)
    .tickFormat(function(d) {
      var z = d.toString();
      var a = z.split("");
      return "'"+a[2]+a[3];
    })
    .orient("bottom");
    
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(5);

// writing a tooltip
/*var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Cost per ton of food:</strong> <span style='color:red'>" + d[region] + "</span>";
  })
*/
  //specifying where to put it
  var svg = d3.select(id).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  d3.tsv("data/data.tsv", type, function(error, data) {
    x.domain(data.map(function(d) { return +d.year})); //same for all
    x2.domain(data.map(function(d) { return 200; }));
    y.domain([0, max]); // var for max for set

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
		.attr("fill", "#7c7c7c")
        .text(label);

    // svg.append("text")
    //     .attr("x", width - 65)             
    //     .attr("y", 12)
    //     .attr("class", "title")  
    //     .text(title);


    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", function(d){return "bar y" + d.year;})
        .attr('data-value', function(d){return d[region]})
        .attr("x", function(d) { return x(d.year); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d[region]); })
        .attr("height", function(d) { return height - y(d[region]); })
		.attr("fill", color)
        //.on('mouseover', tip.show)
        //.on('mouseout', tip.hide)
        //adding hover stuff here
        .on('mouseover', function(d){
          var classes = $(this).attr('class').replace(/ /g,'.'); //this finds the class of what you've hovered on
          d3.selectAll('.'+classes).style({'stroke': '#7c7c7c', 'stroke-width': 1}) //matches all of the things w/ the hovered class and gives them a stroke
								   .classed('active', true)
        })
        .on('mouseout', function(d){
          var classes = $(this).attr('class').replace(/ /g,'.'); //re-finds the class, since we're in a new function
          d3.selectAll('.'+classes).style({'stroke': 'none', 'stroke-width': 0}) //removes the stroke. 
			                       .classed('active', false)      
		
		})	
          
		  
		 /* var dataSum = d3.sum(data, function(d) { return d[region]; });
          var dataAvg = dataSum / data.length;
 

          var line = d3.svg.line()
          .x(function(d, i) { 
            // return x(i) + i;
            return x2(i) +i; 
          })
          .y(function(d, i) { return y(50); }); 
        
          svg.append("path")
              .datum(data)
              .attr("class", "line")
              .attr("d", line);

        */

      });

}

function type(d) {
  d.region = +d.region; //coerces values to number
  return d;
}


