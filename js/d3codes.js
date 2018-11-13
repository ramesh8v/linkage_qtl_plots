/**
 * Created by ramesh8v on 3/23/2017.
 */

var margin = {top: 20, right: 50, bottom: 60, left: 100};
   var width = 900 - margin.left - margin.right,
    height = 750 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, (width-15)], .4);

var y = d3.scale.linear()
    .range([0, height]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(0);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10)
    .tickFormat(d3.format('s'));

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var top_margin = margin.top+20;

d3.tsv("./scri_data/3101_JR_combined.txt", type, function(error, data) {
  if (error) throw error;
  console.log(data);

  var chromeLength = {};
  for (i=0; i<data.length; i++){
    var temp = data[i];
    if(!chromeLength[temp.chrome]){chromeLength[temp.chrome] = temp.Position}
    chromeLength[temp.chrome] = Math.max(temp.Position, chromeLength[temp.chrome])
  }
  var chromeLengthArray = [];
  var chromes = Object.keys(chromeLength);
  for(i=0; i<chromes.length; i++){
    chromeLengthArray.push({'chrome': chromes[i], "chrLength":chromeLength[chromes[i]]})
  }
  console.log(chromeLengthArray);

  x.domain(data.map(function(d) { return d.chrome; }));
  y.domain([0, d3.max(data, function(d) { return d.Position; })]);
  svg.append("g")
      .attr("class", "x axis")
      .call(xAxis)
        .attr("font", 10);

  svg.append("g")
      .attr("transform", "translate(0 ," + top_margin + ")")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .attr("font", '10px')
      .attr("style", "shape-rendering:crispEdges");

 svg.append("g")
      .attr("transform", "translate(0 ," + top_margin + ")")
      .selectAll(".bar")
      .data(chromeLengthArray)
      .enter().append("a")
      .append("rect")
      .attr("x", function(d) { return x(d.chrome); })
      .attr("width", x.rangeBand())
      .attr("stroke-width", 0)
      .attr("stroke", "black")
      .attr("y", function(d) { return y(-2); })
      .attr("height", function(d) { return y(d.chrLength+4); })
      .attr("rx", 20)
      .attr("fill", "#B2BABB");

    svg.append("g")
        .attr("transform", "translate(0 ," + top_margin + ")")
        .selectAll(".markline")
        .data(data)
        .enter()
        .append("line")
        .style("stroke", "#17202A")  // colour the line
        .attr("x1", function(d){return x(d.chrome)})     // x position of the first end of the line
        .attr("y1", function(d){return y(d.Position)})      // y position of the first end of the line
        .attr("x2", function(d){return x(d.chrome)+x.rangeBand()})     // x position of the second end of the line
        .attr("y2", function(d){return y(d.Position)});
});

function type(d) {
  d.Position = +d.Position;
  return d;
}



