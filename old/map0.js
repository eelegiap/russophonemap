var width = $(document).width() - 100;
height = $(document).height() - 100;

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

var url = 'admin1_12-3_2.geojson'

// var url = "http://enjalot.github.io/wwsd/data/world/world-110m.geojson";
var url2 = "admin0.geojson"

var admin1 = svg.append("svg:g");
var admin0 = svg.append("svg:g")

var projection = d3.geoMercator()
    .scale([800])
    // .center([5246215,7377071])
    .translate([width / 2 - 850, height / 2 + 800]);

var path = d3.geoPath()
    .projection(projection)

var pct = d3.format(",.1%")
// d3.interpolateReds()

// Define the div for the tooltip
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


    
d3.json(url, function (error, admin1data) {

    if (error) console.log(error);

    // console.log("geojson", countries, places);

    admin1.selectAll("path")
        .data(admin1data.features)
        .enter().append("path")
        .attr("d", path)
        .attr('class', 'graypath')
        .style('fill', d => d3.interpolateReds(d.properties["post-Soviet-attr-table_pct russian speakers"]))
        .on("mouseover", function (d) {
            // console.log("just had a mouseover", d.properties);
            d3.select(this)
                .style('fill','lightblue')
            // d3.select(this)
                // .classed("active", true)
            // console.log(d.properties["post-Soviet-attr-table_pct russian speakers"])
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(`<b>Name</b>: ${d.properties.name}<br>
            <b>Country</b>: ${d.properties.admin}<br>
            <b>% Native Russophone</b>: ${pct(d.properties["post-Soviet-attr-table_pct russian speakers"])}`)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
            d3.select(this)
            .style('fill', d => d3.interpolateReds(d.properties["post-Soviet-attr-table_pct russian speakers"]))
            // d3.select(this)
            //     .classed("active", false)
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })

})
d3.json(url2, function (error, admin0data) {

    admin0.selectAll("path")
        .data(admin0data.features)
        .enter().insert("path")
        .attr("d", path)
        .attr('class', 'bgpath')
        
});



