require(
	['typecast', 'frame', 'model', 'socket.io',
	    'css!/base/bootstrap/bootstrap.min.css',
        'css!stylist/style.css', 'dc'
	],
	function(type, Frame, Model, io, lscache, moment) {

	brainData = {
			eSense: {
				attention: 0,
				meditation: 0
			},
			eegPower: {
				delta: 0,
				theta: 0,
				lowAlpha: 0,
				highAlpha: 0,
				lowBeta: 0,
				highBeta: 0,
				lowGamma: 0,
				highGamma: 0
			}
			// ,
			// poorSignalLevel: 0,
			// blinkStrength: 0
			// }
		};

	var socket = io.connect();

	socket.on('connect', function (data) {
		console.log("web socket connected");
	});

	socket.on('mindEvent', function (datatest) {
		brainData = datatest
	});

	$('body').append('<div id="screen"></div>');

    // var data = d3.range(n).map(test);

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 1200 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var now = new Date;
var interval = 1000;

var color = d3.scale.category20();

// data
var data = [
            [
             {date:now, value: 0, id:"delta", color: "red"}
            ],
            [
              {date:now, value: 0, id:"theta", color: "#BADA55"}
            ],
            [
             {date:now, value: 0, id:"lowAlpha", color: "blue"}
            ],
            [
             {date:now, value: 0, id:"highAlpha", color: "green"}
            ],
            [
             {date:now, value: 0, id:"lowBeta", color: "purple"}
            ],
            [
             {date:now, value: 0, id:"highBeta", color: "#BADA55"}
            ],
            [
             {date:now, value: 0, id:"lowGamma", color: "#BADA55"}
            ],
            [
             {date:now, value: 0, id:"highGamma", color: "#BADA55"}
            ],
            [
             {date:now, value: 0, id:"all", color: "white"}
            ]
           ];


    // [0,1,2,3,4,5,6,7].map(function(index) {
    //     color.domain(d3.keys(data[0]).filter(function(key) {
    //         return key == "id"
    //     })
    //     )
    // })

// add ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// add default scale of the axes
x.domain([new Date(+(now)-(10*1000)), new Date(+(now)+(4*1000))]);
y.domain([0, 1]);

var xAxis = d3.svg.axis().scale(x)
    // add ticks (axis and vertical line)
    .tickSize(-height).tickPadding(6).ticks(5).orient("bottom")

var yAxis = d3.svg.axis().scale(y)
    // add ticks (axis and vertical line)
    .tickSize(-width).tickPadding(6).ticks(5).orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.value); });

var zoom = d3.behavior.zoom().x(x)
            .scaleExtent([0.005, 5]) // allow zooming in/out
            .on("zoom", draw);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(zoom);

// needed for the transition
svg.append("defs").append("clipPath")
.attr("id", "clip")
.append("rect")
.attr("width", width)
.attr("height", height);

// needed for zooming and dragging
var rect = svg.append("rect").attr("width", width).attr("height", height);

// avoid data lines to overlap with axis
var svgBox = svg.append("svg").attr("width", width).attr("height", height)
                .attr("viewBox", "0 0 " + width + " " + height);

var lines = svgBox.selectAll("g").data(data);

//for each array, create a 'g' line container
var aLineContainer = lines.enter().append("g");
aLineContainer.append("path")
    .attr("class", "line")

// add x axis to chart
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")

// add y axis to chart
svg.append("g")
    .attr("class", "y axis")
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Strength");

// show scatter points and tooltips. so far its only on first point
var formatTime = d3.time.format("%e %B");
var div = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);
aLineContainer.selectAll(".dot")
.data( function(d, i) { return d; } )  // Our nested data we call, its grouped funny im sorry
.enter()
  .append("circle")
  .attr("class", "dot")
  .attr("r", 3.5)
  .on("mouseover", function(d) {
            div.transition()
               .duration(100)
               .style("opacity", .9);
            div.html(formatTime(d.date) + "<br/>"  + d.value + "<br/>"  + d.id)
               .style("left", (d3.event.pageX) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
            })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

// transistion for paths selected
svg.append("g").attr("clip-path", "url(#clip)");

var currentDate = now;
function update() {
  console.log("updating");

  currentDate = new Date(+(currentDate)+interval);

  if(brainData.eSense != undefined){
      var allValues = brainData.eegPower.delta + brainData.eegPower.theta + brainData.eegPower.lowAlpha + brainData.eegPower.highAlpha + brainData.eegPower.lowBeta
      var all_values = allValues / 5
      var newData = [
                 {date:currentDate, value: brainData.eegPower.delta, id:"delta"},
                 {date:currentDate, value: brainData.eegPower.theta, id:"theta"},
                 {date:currentDate, value: brainData.eegPower.lowAlpha, id:"lowAlpha"},
                 {date:currentDate, value: brainData.eegPower.highAlpha, id:"highAlpha"},
                 {date:currentDate, value: brainData.eegPower.lowBeta, id:"lowBeta"},
                 {date:currentDate, value: brainData.eegPower.highBeta, id:"highBeta"},
                 {date:currentDate, value: brainData.eegPower.lowGamma, id:"lowGamma"},
                 {date:currentDate, value: brainData.eegPower.highGamma, id:"highGamma"},
                 {date: currentDate, value: 0, id:"all"}
                ];
            }else{
              var all_values = (Math.random(1,10) + Math.random(1,10) + Math.random(1,10) + Math.random(1,10) + Math.random(1,10))/5
                var newData = [
                 {date:currentDate, value: Math.random(1,10), id:"delta"},
                 {date:currentDate, value: Math.random(1,10), id:"theta"},
                 {date:currentDate, value: Math.random(1,10), id:"lowAlpha"},
                 {date:currentDate, value: Math.random(1,10), id:"highAlpha"},
                 {date:currentDate, value: Math.random(1,10), id:"lowBeta"},
                 {date:currentDate, value: 0, id:"highBeta"},
                 {date:currentDate, value: 0, id:"lowGamma"},
                 {date:currentDate, value: 0, id:"highGamma"},
                 {date: currentDate, value: all_values, id: "all"}
                ];
            }

  var lowestXDomain      = x.domain()[0];
  var highestXDomain     = x.domain()[1];
  var currentHighestDate = d3.max(data[0], function(d) { return d.date });
  var shiftRight         = false;

  // is current highest date currently being showed?
  if (lowestXDomain <= currentHighestDate && currentHighestDate <= highestXDomain) {
    var newHighestDate = d3.max(newData, function(d) { return d.date });
    // if new highest date is out of the domain, update the domain
    if (highestXDomain < newHighestDate) {
      shiftRight = true;
//      svg.select("g.y.axis").transition().duration(300).ease("linear").call(yAxis);
    }
  }

  // only perform animated transition when needed or we will have problems when dragging/zooming
  d3.transition().ease("linear").duration((shiftRight ? interval : 1)).each(function() {

    if (shiftRight) {
      x.domain([new Date(+(lowestXDomain)+(interval)), newHighestDate]);
    }

    // update domains
    y.domain([0, d3.max(data.map(function(d) { return d3.max(d, function(dm) { return dm.value; }); } )) * 1.1]);
  //  xAxis.scale(x);
  //  yAxis.scale(y);

    draw();

  });

  newData.forEach(function(d, i) {
    data[i].push(d);
  });

  aLineContainer
   .attr("d", line)
   .attr("transform", null)

  if (shiftRight) {
    aLineContainer.transition()
        .ease("linear")
        .duration(interval)
//        .attr("transform", "translate(" + x(-1) + ")")
  }
}


    // window.setInterval(function() {
    //   update();
    // }, interval);
var loading = false;
console.log(document.getElementById("start"))
document.getElementById("start").onclick = function(e){
  e.preventDefault();
  if(!loading){
    window.setInterval(function() {
      update();
    }, interval);
    loading = true
  } else {
    loading = false
  }
}

draw();

function draw() {
  svg.select("g.x.axis").call(xAxis);
  svg.select("g.y.axis").transition().duration(300).ease("linear").call(yAxis);

  if(loading){
      // svg.select("g.y.axis").transition().duration(0).call(yAxis);
      // svg.select("g.x.axis").transition().duration(0);
      d3.transition("none").duration(0)
      var graph_lines = svg.selectAll("path.line").attr("d", line);

      graph_lines.attr("stroke", function(d){
        return d[0].color
      });

      graph_lines.attr("stroke-width", function(d){
        if(d[0].id === "all"){
          width = 5 + "px"
        } else {
          width = 1.5 + 'px'
        }
        return d[0].strokeWidth = width
      })

      aLineContainer.selectAll("circle.dot").attr("cx", line.x()).attr("cy", line.y());

  }

//  d3.select("#footer span").text("U.S. Commercial Flights, " + x.domain().map(format).join("-"));
}

});

