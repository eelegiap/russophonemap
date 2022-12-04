// Define the div for the tooltip
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var width = $(document).width() - 00;
height = $(document).height() - 200;

var center = [width / 2, height / 2];

var projection = d3.geo.mercator()
    // .center([0, 10]);
    .scale([800])
    .translate([width / 2 - 750, height / 2 + 800]);

var svg = d3.select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var path = d3.geo.path()
    .projection(projection);

var g = svg.append("g");
var admin1 = g.append("g");
var admin0 = g.append("g");

var pct = d3.format(",.1%")


d3.json("admin1_12-3_2.json", function (error, topology) {
    console.log(Object.keys(topology.objects))
    admin1.selectAll("path")
        .data(topojson.object(topology, topology.objects['admin1_12-3_2']).geometries)
        .enter()
        .append("path")
        .attr("d", path)
        .style('fill', d => d3.interpolateReds(d.properties["post-Soviet-attr-table_pct russian speakers"]))
        .on("mouseover", function (d) {
            // console.log("just had a mouseover", d.properties);
            d3.select(this)
                .style('fill', 'lightblue')
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
});

d3.json("admin0_12-4.json", function (error, topology) {
    // var newgem
    // console.log(topology.objects['admin0'].geometries["1"].properties['REGION_UN'])
    admin0.selectAll("path")
        .data(topojson.object(topology, topology.objects['admin0_12-4']).geometries)
        .enter()
        .append("path")
        .attr("d", path)
        .attr('class', 'backgroundPath')
        .on('mouseover', function (d) {
            console.log(d)
        })
});

var zoom = d3.behavior.zoom()
    .scaleExtent([1, 8])
    .on("zoom", function () {
        g.attr("transform", "translate(" + d3.event.translate.join(",") + ") scale(" + d3.event.scale + ")");
        g.selectAll("path")
            .attr("d", path.projection(projection));

        svg.selectAll("circle")
            .attr("transform", "translate(" + d3.event.translate.join(",") + ") scale(" + d3.event.scale + ")")
            .transition()
            .attr("r", 5 / d3.event.scale);
        d3.select("#map-zoomer").node().value = zoom.scale();
    });
svg.call(zoom);

d3.select('#zoom-in').on('click', function () {
    var scale = zoom.scale(), extent = zoom.scaleExtent(), translate = zoom.translate();
    var x = translate[0], y = translate[1];
    var factor = 1.5;

    var target_scale = scale * factor;

    if (scale === extent[1]) {
        return false;
    }
    var clamped_target_scale = Math.max(extent[0], Math.min(extent[1], target_scale));
    if (clamped_target_scale != target_scale) {
        target_scale = clamped_target_scale;
        factor = target_scale / scale;
    }
    x = (x - center[0]) * factor + center[0];
    y = (y - center[1]) * factor + center[1];

    zoom.scale(target_scale).translate([x, y]);

    g.transition().attr("transform", "translate(" + zoom.translate().join(",") + ") scale(" + zoom.scale() + ")");
    g.selectAll("path")
        .attr("d", path.projection(projection));

    svg.selectAll("circle")
        .transition()
        .attr("transform", "translate(" + zoom.translate().join(",") + ") scale(" + zoom.scale() + ")")
        .attr("r", 5 / zoom.scale());

    d3.select("#map-zoomer").node().value = zoom.scale();
});

d3.select('#zoom-out').on('click', function () {
    var scale = zoom.scale(), extent = zoom.scaleExtent(), translate = zoom.translate();
    var x = translate[0], y = translate[1];
    var factor = 1 / 1.5;

    var target_scale = scale * factor;

    if (scale === extent[0]) {
        return false;
    }
    var clamped_target_scale = Math.max(extent[0], Math.min(extent[1], target_scale));
    if (clamped_target_scale != target_scale) {
        target_scale = clamped_target_scale;
        factor = target_scale / scale;
    }
    x = (x - center[0]) * factor + center[0];
    y = (y - center[1]) * factor + center[1];

    zoom.scale(target_scale).translate([x, y]);

    g.transition()
        .attr("transform", "translate(" + zoom.translate().join(",") + ") scale(" + zoom.scale() + ")");
    g.selectAll("path")
        .attr("d", path.projection(projection));

    svg.selectAll("circle")
        .transition()
        .attr("transform", "translate(" + zoom.translate().join(",") + ") scale(" + zoom.scale() + ")")
        .attr("r", 5 / zoom.scale());
    d3.select("#map-zoomer").node().value = zoom.scale();
});

d3.select('#reset').on('click', function () {
    zoom.translate([0, 0]);
    zoom.scale(1);
    g.transition().attr("transform", "translate(" + zoom.translate().join(",") + ") scale(" + zoom.scale() + ")");
    g.selectAll("path")
        .attr("d", path.projection(projection))

    svg.selectAll("circle")
        .transition()
        .attr("transform", "translate(" + zoom.translate().join(",") + ") scale(" + zoom.scale() + ")")
        .transition()
        .attr("r", 5 / zoom.scale());
    d3.select("#map-zoomer").node().value = zoom.scale();
});

d3.select('#map-zoomer').on("change", function () {
    var scale = zoom.scale(), extent = zoom.scaleExtent(), translate = zoom.translate();
    var x = translate[0], y = translate[1];
    var target_scale = +this.value;
    var factor = target_scale / scale;

    var clamped_target_scale = Math.max(extent[0], Math.min(extent[1], target_scale));
    if (clamped_target_scale != target_scale) {
        target_scale = clamped_target_scale;
        factor = target_scale / scale;
    }
    x = (x - center[0]) * factor + center[0];
    y = (y - center[1]) * factor + center[1];

    zoom.scale(target_scale).translate([x, y]);

    g.transition()
        .attr("transform", "translate(" + zoom.translate().join(",") + ") scale(" + zoom.scale() + ")");
    g.selectAll("path")
        .attr("d", path.projection(projection));

    svg.selectAll("circle")
        .transition()
        .attr("transform", "translate(" + zoom.translate().join(",") + ") scale(" + zoom.scale() + ")")
        .attr("r", 5 / zoom.scale());
});