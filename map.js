var width = $( document ).width()-100;
    height = $( document ).height()-100;

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

var url = 'admin1_12-3_2.geojson'

// var url = "http://enjalot.github.io/wwsd/data/world/world-110m.geojson";
var url2 = "admin0.geojson"

var admin0 = svg.append("svg:g");
var admin1  = svg.append("svg:g");

var projection = d3.geoMercator()
.scale([800])
// .center([5246215,7377071])
.translate([width/2-800, height/2+800]);

var path = d3.geoPath()
.projection(projection)


d3.json(url, function (error, admin1data) {

    if (error) console.log(error);

    // console.log("geojson", countries, places);

    admin1.selectAll("path")
        .data(admin1data.features)
        .enter().append("path")
        .attr("d", path)
        .attr('class','graypath')
        .on("mouseover", function (d) {
            console.log("just had a mouseover", d3.select(d));
            d3.select(this)
                .classed("active", true)
                console.log(d.properties["post-Soviet-attr-table_pct russian speakers"])
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .classed("active", false)
        })

    // svg.selectAll("circle")
    //     .data(places.features)
    //     .enter().append("circle")
    //     .attr('r', 5)
    //     .attr('cx', function (d) { return projection(d.geometry.coordinates)[0] })
    //     .attr('cy', function (d) { return projection(d.geometry.coordinates)[1] })
    //     .on("mouseover", function (d) {
    //         console.log("just had a mouseover", d3.select(d));
    //         d3.select(this)
    //             .classed("active", true)
    //     })
    //     .on("mouseout", function (d) {
    //         d3.select(this)
    //             .classed("active", false)
    //     })

    })
    d3.json(url2, function (error, admin0data) {

    admin0.selectAll("path")
    .data(admin0data.features)
    .enter().insert("path")
    .attr("d", path)
    .attr('class','bgpath')

});

var zoom = d3.zoom()
.scaleExtent([1, 8])
.on('zoom', function() {
    svg.selectAll('path')
     .attr('transform', d3.event.transform);
});

svg.call(zoom);




