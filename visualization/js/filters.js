function init(){
    var RatingDivTop = parseInt(d3.select("#CategoryDiv").style("height")) + 10;
    var AreaStatsTop = parseInt(RatingDivTop) + parseInt(d3.select("#RatingDiv").style("height")) + 10;
    var HeatmapTop = parseInt(AreaStatsTop) + parseInt(d3.select("#AreaStatsDiv").style("height")) + 10;
    d3.select("#RatingDiv").style("top",RatingDivTop+"px");
    d3.select("#AreaStatsDiv").style("top",AreaStatsTop+"px");
    d3.select("#HeatMapDiv").style("top",HeatmapTop+"px");
}

function updatePos(){
    var RatingDivTop = parseInt(d3.select("#CategoryDiv").style("height")) + 10;
    var AreaStatsTop = parseInt(RatingDivTop) + parseInt(d3.select("#RatingDiv").style("height")) + 10;
    var HeatmapTop = parseInt(AreaStatsTop) + parseInt(d3.select("#AreaStatsDiv").style("height")) + 10;
    d3.select("#RatingDiv").transition()
        .duration(800)
        .style("top",RatingDivTop+"px");
    d3.select("#AreaStatsDiv").transition()
        .duration(800)
        .style("top",AreaStatsTop+"px");
    d3.select("#HeatMapDiv").transition()
        .duration(800)
        .style("top",HeatmapTop+"px");
}

function calculateDistance(lat1,lon1,lat2,lon2){
    if (typeof(Number.prototype.toRadians) === "undefined") {
        Number.prototype.toRadians = function() {
            return this * Math.PI / 180;
        }
    }
    var R = 6371000; // metres
    var φ1 = lat1.toRadians();
    var φ2 = lat2.toRadians();
    var Δφ = (lat2-lat1).toRadians();
    var Δλ = (lon2-lon1).toRadians();

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;
    return d;
};

function drawDonutChart(svg, data){
    var width = 680,
        height = 320,
        radius = Math.min(width, height) / 2.5;

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) {
            return d.value;
        });

    var arc = d3.svg.arc()
        .outerRadius(radius * 0.8)
        .innerRadius(radius * 0.4);

    var outerArc = d3.svg.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9);

    svg.attr("transform", "translate(" + width / 2 + "," + height / 2.5 + ")");

    var key = function(d){ return d.data.label; };

    var color = d3.scale.category20()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    change(data);

    function mergeWithFirstEqualZero(first, second){
        var secondSet = d3.set(); second.forEach(function(d) { secondSet.add(d.label); });

        var onlyFirst = first
            .filter(function(d){ return !secondSet.has(d.label) })
            .map(function(d) { return {label: d.label, value: 0}; });
        return d3.merge([ second, onlyFirst ])
            .sort(function(a,b) {
                return d3.ascending(a.label, b.label);
            });
    }

    function change(data) {
        var duration = 1000;
        var data0 = svg.select(".slices").selectAll("path.slice")
            .data().map(function(d) { return d.data });
        if (data0.length == 0) data0 = data;
        var was = mergeWithFirstEqualZero(data, data0);
        var is = mergeWithFirstEqualZero(data0, data);

        /* ------- SLICE ARCS -------*/

        var slice = svg.select(".slices").selectAll("path.slice")
            .data(pie(was), key);

        slice.enter()
            .insert("path")
            .attr("class", "slice")
            .style("fill", function(d) { return color(d.data.label); })
            .each(function(d) {
                this._current = d;
            });

        slice = svg.select(".slices").selectAll("path.slice")
            .data(pie(is), key);

        slice
            .transition().duration(duration)
            .attrTween("d", function(d) {
                var interpolate = d3.interpolate(this._current, d);
                var _this = this;
                return function(t) {
                    _this._current = interpolate(t);
                    return arc(_this._current);
                };
            });

        slice = svg.select(".slices").selectAll("path.slice")
            .data(pie(data), key);

        slice
            .exit().transition().delay(duration).duration(0)
            .remove();

        /* ------- TEXT LABELS -------*/

        var text = svg.select(".labels").selectAll("text")
            .data(pie(was), key);

        text.enter()
            .append("text")
            .attr("dy", ".35em")
            .style("opacity", 0)
            .text(function(d) {
                return d.data.label;
            })
            .each(function(d) {
                this._current = d;
            });

        function midAngle(d){
            return d.startAngle + (d.endAngle - d.startAngle)/2;
        }

        text = svg.select(".labels").selectAll("text")
            .data(pie(is), key);

        text.transition().duration(duration)
            .style("opacity", function(d) {
                return d.data.value == 0 ? 0 : 1;
            })
            .attrTween("transform", function(d) {
                var interpolate = d3.interpolate(this._current, d);
                var _this = this;
                return function(t) {
                    var d2 = interpolate(t);
                    _this._current = d2;
                    var pos = outerArc.centroid(d2);
                    pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                    return "translate("+ pos +")";
                };
            })
            .styleTween("text-anchor", function(d){
                var interpolate = d3.interpolate(this._current, d);
                return function(t) {
                    var d2 = interpolate(t);
                    return midAngle(d2) < Math.PI ? "start":"end";
                };
            });

        text = svg.select(".labels").selectAll("text")
            .data(pie(data), key);

        text
            .exit().transition().delay(duration)
            .remove();

        /* ------- SLICE TO TEXT POLYLINES -------*/

        var polyline = svg.select(".lines").selectAll("polyline")
            .data(pie(was), key);

        polyline.enter()
            .append("polyline")
            .style("opacity", 0)
            .each(function(d) {
                this._current = d;
            });

        polyline = svg.select(".lines").selectAll("polyline")
            .data(pie(is), key);

        polyline.transition().duration(duration)
            .style("opacity", function(d) {
                return d.data.value == 0 ? 0 : .5;
            })
            .attrTween("points", function(d){
                this._current = this._current;
                var interpolate = d3.interpolate(this._current, d);
                var _this = this;
                return function(t) {
                    var d2 = interpolate(t);
                    _this._current = d2;
                    var pos = outerArc.centroid(d2);
                    pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                    return [arc.centroid(d2), outerArc.centroid(d2), pos];
                };
            });

        polyline = svg.select(".lines").selectAll("polyline")
            .data(pie(data), key);

        polyline
            .exit().transition().delay(duration)
            .remove();
    };
}

function initCategoryStatistics(lat, lng, r){
    var data = [{label: "Restaurants", value: 0},
        {label: "Shopping", value: 0},
        {label: "Beauty & Spas", value: 0},
        {label: "Nightlife", value: 0},
        {label: "Bars", value: 0},
        {label: "Automotive", value: 0},
        {label: "Fashion", value: 0},
        {label: "Health & Medical", value: 0},
        {label: "Others", value: 0}];
    allData.forEach(function(d) {
        var dis = calculateDistance(lat, lng, d.latitude, d.longitude);
        if(dis <= r){
            var others = true;
            if(d.categories.indexOf("Restaurants") != -1){
                data[0].value++;
                others = false;
            }
            if(d.categories.indexOf("Shopping") != -1){
                data[1].value++;
                others = false;
            }
            if(d.categories.indexOf("Beauty & Spas") != -1){
                data[2].value++;
                others = false;
            }
            if(d.categories.indexOf("Nightlife") != -1){
                data[3].value++;
                others = false;
            }
            if(d.categories.indexOf("Bars") != -1){
                data[4].value++;
                others = false;
            }
            if(d.categories.indexOf("Automotive") != -1){
                data[5].value++;
                others = false;
            }
            if(d.categories.indexOf("Fashion") != -1){
                data[6].value++;
                others = false;
            }
            if(d.categories.indexOf("Health & Medical") != -1){
                data[7].value++;
                others = false;
            }
            if(others){
                data[8].value++;
            }
        }
    });

    var sum = 0;
    data.forEach(function (d) {
        sum += parseInt(d.value);
    });
    if(sum != 0){
        var svg = d3.select("#category-statistics")
            .append("svg")
            .attr("class", "donutSvg")
            .append("g")

        svg.append("g")
            .attr("class", "slices");
        svg.append("g")
            .attr("class", "labels");
        svg.append("g")
            .attr("class", "lines");

        drawDonutChart(svg, data);
    }
    else{
        d3.select("#category-statistics").text("No business in this area!");
    }
};

function initRatingStatistics(lat, lng, r){
    var data = [{label: "1.0", value: 0},
        {label: "1.5", value: 0},
        {label: "2.0", value: 0},
        {label: "2.5", value: 0},
        {label: "3.0", value: 0},
        {label: "3.5", value: 0},
        {label: "4.0", value: 0},
        {label: "4.5", value: 0},
        {label: "5.0", value: 0}];
    allData.forEach(function(d) {
        var dis = calculateDistance(lat, lng, d.latitude, d.longitude);
        if(dis <= r){
            if(parseFloat(d.stars) == 1.0){
                data[0].value++;
            }
            if(parseFloat(d.stars) == 1.5){
                data[1].value++;
            }
            if(parseFloat(d.stars) == 2.0){
                data[2].value++;
            }
            if(parseFloat(d.stars) == 2.5){
                data[3].value++;
            }
            if(parseFloat(d.stars) == 3.0){
                data[4].value++;
            }
            if(parseFloat(d.stars) == 3.5){
                data[5].value++;
            }
            if(parseFloat(d.stars) == 4.0){
                data[6].value++;
            }
            if(parseFloat(d.stars) == 4.5){
                data[7].value++;
            }
            if(parseFloat(d.stars) == 5.0){
                data[8].value++;
            }
        }
    });

    var sum = 0;
    data.forEach(function (d) {
        sum += parseInt(d.value);
    });
    if(sum != 0){
        var svg = d3.select("#rating-statistics")
            .append("svg")
            .attr("class", "donutSvg")
            .append("g")

        svg.append("g")
            .attr("class", "slices");
        svg.append("g")
            .attr("class", "labels");
        svg.append("g")
            .attr("class", "lines");

        drawDonutChart(svg, data);
    }
    else{
        d3.select("#rating-statistics").text("No business in this area!");
    }
};

var category = "";
var radioValue = 0;
var circleMove;
var circleOnClick;
var radius;

function updateCircles(){
    circles.forEach(function (d) {
        if((category == "" && parseInt(d[0].stars) >= parseInt(radioValue)) || d[0].categories.indexOf(category) != -1 && parseInt(d[0].stars) >= parseInt(radioValue)){
            d[1].addTo(circleGroup);
        }
        else{
            circleGroup.removeLayer(d[1]);
        }
    });
    info.update();
    HeatMapClick();
}

init();

d3.select("#Categories")
    .on("click", function(d) {
        if(d3.select(this).property("checked")){
            var subDiv = d3.select("#CategoryDiv").append("div")
                .attr("id", "CategorySubDiv")
                .style("opacity",0);

            var innerhtml = '<div class="subLabel" id="CategoryRadio">' +
                '<input type="radio" id="Restaurants" name="Categories"><label for="Restaurants">Restaurants</label><br>' +
                '<input type="radio" id="Shopping" name="Categories"><label for="Shopping">Shopping</label>' +
                '<input type="radio" id="BeautySpas" name="Categories"><label for="BeautySpas">Beauty & Spas</label>' +
                '<input type="radio" id="Nightlife" name="Categories"><label for="Nightlife">Nightlife</label>' +
                '<input type="radio" id="Bars" name="Categories"><label for="Bars">Bars</label>' +
                '<input type="radio" id="Automotive" name="Categories"><label for="Automotive">Automotive</label>' +
                '<input type="radio" id="Fashion" name="Categories"><label for="Fashion">Fashion</label>' +
                '<input type="radio" id="HealthMedical" name="Categories"><label for="HealthMedical">Health & Medical</label>' +
                '<input type="radio" id="Reset" name="Categories"><label for="Reset">Reset</label>' +
                '</div>';
            subDiv.html(innerhtml);
            $( "#CategoryRadio" ).buttonset().find("label").width(150);
            updatePos();
            subDiv.transition().delay(400).duration(400).style("opacity",1);

            d3.select("#Restaurants").on("click", function (d) {
                category = "Restaurants";
                updateCircles();
            });
            d3.select("#Shopping").on("click", function (d) {
                category = "Shopping";
                updateCircles();
            });
            d3.select("#BeautySpas").on("click", function (d) {
                category = "Beauty & Spas";
                updateCircles();
            });
            d3.select("#Nightlife").on("click", function (d) {
                category = "Nightlife";
                updateCircles();
            });
            d3.select("#Bars").on("click", function (d) {
                category = "Bars";
                updateCircles();
            });
            d3.select("#Automotive").on("click", function (d) {
                category = "Automotive";
                updateCircles();
            });
            d3.select("#Fashion").on("click", function (d) {
                category = "Fashion";
                updateCircles();
            });
            d3.select("#HealthMedical").on("click", function (d) {
                category = "Health & Medical";
                updateCircles();
            });
            d3.select("#Reset").on("click", function (d) {
                category = "";
                updateCircles();
            });
        }
        else{
            d3.select("#CategorySubDiv").transition().duration(300).style("opacity",0).each("end",function(){
                d3.select(this).remove();
                updatePos();
                category = "";
                updateCircles();
            });
        }
    });

d3.select("#Ratings")
    .on("click", function (d) {
        if(d3.select(this).property("checked")){
            var subDiv = d3.select("#RatingDiv").append("div")
                .attr("id", "RatingSubDiv")
                .style("opacity",0);

            var innerhtml = "<span class='star-rating'>" +
                "<input type='radio' class='stars' name='rating' value='1'><i></i>" +
                "<input type='radio' class='stars' name='rating' value='2'><i></i>" +
                "<input type='radio' class='stars' name='rating' value='3'><i></i>" +
                "<input type='radio' class='stars' name='rating' value='4'><i></i>" +
                "<input type='radio' class='stars' name='rating' value='5'><i></i>";
            subDiv.html(innerhtml);

            updatePos();
            subDiv.transition().delay(400).duration(400).style("opacity",1);

            $('.stars').change(
                function(){
                    radioValue = parseInt(this.value);
                    updateCircles();
                }
            );
        }
        else{
            d3.select("#RatingSubDiv").transition().duration(300).style("opacity",0).each("end",function(){
                d3.select(this).remove();
                updatePos();
                radioValue = 0;
                updateCircles();
            });
        }
    });

d3.select("#AreaStats")
    .on("click", function (d) {
        if(d3.select(this).property("checked")){
            var subDiv = d3.select("#AreaStatsDiv").append("div")
                .attr("id", "AreaStatsSubDiv")
                .style("opacity",0)
                .style("height","40px");
            var slider = subDiv.append("div")
                .attr("id", "slider");
            radius = 100;
            circleMove = L.circle([0,0], radius, {
                color: "yellow",
                opacity: 0.3,
                fillColor: "yellow",
                fillOpacity: 0.3
            }).addTo(map);
            circleOnClick = L.circle([0,0], radius, {
                color: "yellow",
                opacity: 0.3,
                fillColor: "yellow",
                fillOpacity: 0.3
            });
            $( "#slider" ).slider({
                change:function() {
                    var value = $( "#slider").slider("value");
                    radius = 100 + parseInt(value)*parseInt(value)*3;
                    circleMove.setRadius(radius);
                    circleMove.redraw();
                    circleOnClick.setRadius(radius);
                    circleOnClick.redraw();
                    info.update();
                }
            }).height(10);
            slider.style("position","relative").style("top","10px").style("left","10px");


            updatePos();
            subDiv.transition().delay(400).duration(400).style("opacity",1);

            info.update();
            map.on("mousemove", function mouseMoveEvent(e){
                circleMove.setLatLng([e.latlng.lat, e.latlng.lng]);
                circleMove.redraw();
            });
            map.on("click", function mouseClickEvent(e){
                circleOnClick.setRadius(radius);
                circleOnClick.setLatLng(circleMove.getLatLng());
                circleOnClick.addTo(map);
                var innerhtml = '<i class="fa fa-times" id="closeButton"></i>' +
                    '<h3>Statistics</h3>' +
                    '<div id="AreaStatsTabs">' +
                    '<ul>'+
                    '<li><a href="#AreaStatsTabs-1">View by categories</a></li>' +
                    '<li><a href="#AreaStatsTabs-2">View by ratings</a></li>' +
                    '</ul>' +
                    '<div id="AreaStatsTabs-1"><div id="category-statistics"></div></div>' +
                    '<div id="AreaStatsTabs-2"><div id="rating-statistics"></div></div>' +
                    '</div>';
                d3.select("#popUp").classed("hidden", false);
                d3.select("#popUp").transition().duration(500)
                    .style("width", "660px").style("height", "400px")
                    .style("left", "150px").style("top", "100px").each("end", function () {
                        d3.select("#popUp").html(innerhtml);
                        initCloseButton();
                        $( "#AreaStatsTabs" ).tabs();
                        initCategoryStatistics(e.latlng.lat, e.latlng.lng, radius);
                        initRatingStatistics(e.latlng.lat, e.latlng.lng, radius);
                    });
            });
        }
        else{
            d3.select("#AreaStatsSubDiv").transition().duration(300).style("opacity",0).each("end",function(){
                d3.select(this).remove();
                updatePos();
                map.removeLayer(circleMove);
                map.removeLayer(circleOnClick);
                map.off("mousemove");
                map.off("click");
                info.update();
            });
        }
    });

function HeatMapClick(){
    if(d3.select("#HeatMap").property("checked")){
        map.removeLayer(heatmapLayer);
        HeatMapData.data = [];
        allData.forEach(function (d) {
            if((category == "" && parseInt(d.stars) >= parseInt(radioValue)) || d.categories.indexOf(category) != -1 && parseInt(d.stars) >= parseInt(radioValue)){
                HeatMapData.data.push({lat: d.latitude, lng: d.longitude, count: 1});
            }
        });
        heatmapLayer.setData(HeatMapData);
        map.addLayer(heatmapLayer);
    }
    else{
        HeatMapData.data = [];
        map.removeLayer(heatmapLayer);
    }
}

d3.select("#HeatMap")
    .on("click", HeatMapClick);
