var HeatMapData = {
    max: 4,
    data: []
};

var baseLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'examples.map-20v6611k'
});

var cfg = {
    // radius should be small ONLY if scaleRadius is true (or small radius is intended)
    // if scaleRadius is false it will be the constant radius used in pixels
    "radius": 0.005,
    "maxOpacity": .8,
    // scales the radius based on map zoom
    "scaleRadius": true,
    // if set to false the heatmap uses the global maximum for colorization
    // if activated: uses the data maximum within the current map boundaries
    //   (there will always be a red spot with useLocalExtremas true)
    "useLocalExtrema": false,
    // which field name in your data represents the latitude - default "lat"
    latField: 'lat',
    // which field name in your data represents the longitude - default "lng"
    lngField: 'lng',
    // which field name in your data represents the data value - default "value"
    valueField: 'count'
};

var heatmapLayer = new HeatmapOverlay(cfg);

var map = L.map('map-canvas', {center: new L.LatLng(43.1, -89.4),
    zoom: 10,
    layers: [baseLayer,heatmapLayer]});

var circleGroup = L.layerGroup();

var circles = [];

var allData;

function initCloseButton(){
    d3.select("#closeButton").on("mouseover", function () {
        d3.select(this).attr("class", "fa fa-times-circle");
    });
    d3.select("#closeButton").on("mouseout", function () {
        d3.select(this).attr("class", "fa fa-times");
    });
    d3.select("#closeButton").on("click", function () {
        d3.select("#popUp").html("");
        d3.select("#popUp").transition().duration(500)
            .style("width","0px").style("height","0px")
            .style("left","480px").style("top","300px").each("end", function () {
                d3.select("#popUp").classed("hidden", true);
            });
    });
};

function initCategoryGroup(object){
    object.categories.forEach(function (d) {
        var item = d3.select("#category-group").append("div")
            .attr("class", "category-group-items");
        item.append("i")
            .attr("class", "fa fa-check");
        item.append("span")
            .text(d);
    });

    var obj = object.attributes;
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            if(prop == "Parking" || prop == "Good For" || prop == "Ambience"){
                var subobj = obj[prop];
                for (var p in subobj){
                    if(subobj.hasOwnProperty(p)){
                        if(subobj[p] == true){
                            var item = d3.select("#attribute-group").append("div")
                                .attr("class", "attribute-group-items");
                            item.append("i")
                                .attr("class", "fa fa-check")
                                .text(prop + ": " + p);
                        }
                        else{
                            var item = d3.select("#attribute-group").append("div")
                                .attr("class", "attribute-group-items");
                            item.append("i")
                                .attr("class", "fa fa-times cross")
                                .text(prop + ": " + p);
                        }
                    }
                }
            }
            if(obj[prop] == true){
                var item = d3.select("#attribute-group").append("div")
                    .attr("class", "attribute-group-items");
                item.append("i")
                    .attr("class", "fa fa-check")
                    .text(prop);
            }
            else if(obj[prop] == false){
                var item = d3.select("#attribute-group").append("div")
                    .attr("class", "attribute-group-items");
                item.append("i")
                    .attr("class", "fa fa-times cross")
                    .text(prop);
            }
        }
    }
};


function initScatterPlot(d){


    if(!d.hasOwnProperty("review")){
        d3.select("#review-scatter-plot").text("No review!");
    }
    else {
        var data = d.review;
        try {
            data = MG.convert.date(data, 'date');
        }
        catch(err){

        }
        data.forEach(function (d) {
            if (d.SA > 0)
                d.polarity = 1;
            else
                d.polarity = -1;
        });
        MG.data_graphic({
            data: data,
            chart_type: 'point',
            mouseover: function (d, i) {
                d3.select('#review-text-display')
                    .html(d.point.text);
            },
            point_size: function (f) {
                return 4 + Math.abs(f.SA) * 16;
            },
            max_y: 1,
            min_y: -1,
            width: 600,
            height: 200,
            right: 40,
            color_accessor: 'polarity',
            color_type: 'category',
            target: document.getElementById('review-scatter-plot'),
            x_accessor: 'date',
            y_accessor: 'SA'
        });
    }
}

function initRecommend(d, rankBy){
    var arr = userAct(d,allData,rankBy);
    var count = 1;
    if(arr.length == 0){
        d3.select("#recommend").html("No recommended business!");
        return;
    }
    arr.forEach(function (d) {
        if(count <= 8) {
            d3.select("#recommend").html(d3.select("#recommend").html() + '<p id=' + 'c' + count + '>' + count + ". " + d.name + '</p>');
            count++;
        }
    });
    d3.select("#c1").on("click", function () {
        d3.select("#popUp").html("");
        circleClickFunc(arr[0]);
        map.setView([arr[0].latitude, arr[0].longitude], 18);
    });
    d3.select("#c2").on("click", function () {
        d3.select("#popUp").html("");
        circleClickFunc(arr[1]);
        map.setView([arr[1].latitude, arr[1].longitude], 18);
    });
    d3.select("#c3").on("click", function () {
        d3.select("#popUp").html("");
        circleClickFunc(arr[2]);
        map.setView([arr[2].latitude, arr[2].longitude], 18);
    });
    d3.select("#c4").on("click", function () {
        d3.select("#popUp").html("");
        circleClickFunc(arr[3]);
        map.setView([arr[3].latitude, arr[3].longitude], 18);
    });
    d3.select("#c5").on("click", function () {
        d3.select("#popUp").html("");
        circleClickFunc(arr[4]);
        map.setView([arr[4].latitude, arr[4].longitude], 18);
    });
    d3.select("#c6").on("click", function () {
        d3.select("#popUp").html("");
        circleClickFunc(arr[5]);
        map.setView([arr[5].latitude, arr[5].longitude], 18);
    });
    d3.select("#c7").on("click", function () {
        d3.select("#popUp").html("");
        circleClickFunc(arr[6]);
        map.setView([arr[6].latitude, arr[6].longitude], 18);
    });
    d3.select("#c8").on("click", function () {
        d3.select("#popUp").html("");
        circleClickFunc(arr[7]);
        map.setView([arr[7].latitude, arr[7].longitude], 18);
    });
    d3.select("#c1").on("mouseover", function () {
        d3.select(this).style("opacity",0.5);
    });
    d3.select("#c1").on("mouseout", function () {
        d3.select(this).style("opacity",1);
    });
    d3.select("#c2").on("mouseover", function () {
        d3.select(this).style("opacity",0.5);
    });
    d3.select("#c2").on("mouseout", function () {
        d3.select(this).style("opacity",1);
    });
    d3.select("#c3").on("mouseover", function () {
        d3.select(this).style("opacity",0.5);
    });
    d3.select("#c3").on("mouseout", function () {
        d3.select(this).style("opacity",1);
    });
    d3.select("#c4").on("mouseover", function () {
        d3.select(this).style("opacity",0.5);
    });
    d3.select("#c4").on("mouseout", function () {
        d3.select(this).style("opacity",1);
    });
    d3.select("#c5").on("mouseover", function () {
        d3.select(this).style("opacity",0.5);
    });
    d3.select("#c5").on("mouseout", function () {
        d3.select(this).style("opacity",1);
    });
    d3.select("#c6").on("mouseover", function () {
        d3.select(this).style("opacity",0.5);
    });
    d3.select("#c6").on("mouseout", function () {
        d3.select(this).style("opacity",1);
    });
    d3.select("#c7").on("mouseover", function () {
        d3.select(this).style("opacity",0.5);
    });
    d3.select("#c7").on("mouseout", function () {
        d3.select(this).style("opacity",1);
    });
    d3.select("#c8").on("mouseover", function () {
        d3.select(this).style("opacity",0.5);
    });
    d3.select("#c8").on("mouseout", function () {
        d3.select(this).style("opacity",1);
    });
}

map.spin(true);

function getColor(d) {
    return d == 1.0 ? '#ffffd9' :
        d == 1.5  ? '#edf8b1' :
            d == 2.0  ? '#c7e9b4' :
                d == 2.5  ? '#7fcdbb' :
                    d == 3.0   ? '#41b6c4' :
                        d == 3.5   ? '#1d91c0' :
                            d == 4.0   ? '#225ea8' :
                                d == 4.5   ? '#253494' :
                                    '#081d58';
}

function circleClickFunc(d){
    d3.select("#popUp").classed("hidden", false);
    var innerhtml = '<i class="fa fa-times" id="closeButton"></i>' +
        '<h3>' + d.name + '</h3>' +
        '<span>' + d.full_address + '</span>' +
        '<div id="tabs">' +
            '<ul>'+
            '<li><a href="#tabs-1">Details</a></li>' +
            '<li><a href="#tabs-2">Check-in info</a></li>' +
            '<li><a href="#tabs-3">Reviews</a></li>' +
            '<li><a href="#tabs-4">Recommend</a></li>' +
            '</ul>' +
            '<div id="tabs-1"><div id="detail-group"><div id="category-group"><h4>Categories</h4></div><div id="attribute-group"><h4>Attributes<h4></div></div></div>' +
            '<div id="tabs-2"><svg role="heatmap" class="heatmap"></svg></div>' +
            '<div id="tabs-3">'+
                '<div id="review-legend">'+
                    '<span><svg width="50" height="20"><circle cx="40" cy="10" r="8" fill=#F7D1AE /></svg><font size="2">Positive Reivew</font></span>'+
                    '<span><svg width="30" height="20"><circle cx="20" cy="10" r="8" fill=#B5D1E5 /></svg><font size="2">Negative Review</font></span>'+
                '</div>'+
                '<div id="review-scatter-plot"></div><div id="review-text-display"></div>'+
            '</div>' +
            '<div id="tabs-4">' +
            '<form style="margin-top: 1em;">' +
                '<div id="radioset">' +
                '<input type="radio" id="radio1" name="radio" checked="checked"><label for="radio1">Prior to similarity</label>' +
                '<input type="radio" id="radio2" name="radio"><label for="radio2">Prior to rating</label>' +
                '<input type="radio" id="radio3" name="radio"><label for="radio3">Prior to distance</label>' +
                '</div>' +
                '</form>' +
            '<div id="recommend">' +
            '</div></div>' +
        '</div>';
    d3.select("#popUp").transition().duration(500)
        .style("width", "660px").style("height", "400px")
        .style("left", "150px").style("top", "100px").each("end", function () {
            d3.select("#popUp").html(innerhtml);
            initCloseButton();
            $( "#tabs" ).tabs();
            initCategoryGroup(d);
            initHeatmap(d);
            initScatterPlot(d);
            initRecommend(d,"similarity");
            $( "#radioset" ).buttonset();
            d3.select("#radio1").on("click", function () {
                d3.select("#recommend").html("");
                initRecommend(d,"similarity");
            });
            d3.select("#radio2").on("click", function () {
                d3.select("#recommend").html("");
                initRecommend(d,"rating");
            });
            d3.select("#radio3").on("click", function () {
                d3.select("#recommend").html("");
                initRecommend(d,"distance");
            });
        });
}

d3.json("data/wiBRC_edited-1.json", function(error, data) {
    allData = data;
    data.forEach(function(d) {
        var circle = L.circle([d.latitude, d.longitude], 10, {
            color: getColor(d.stars),
            opacity: 0.7,
            fillColor: getColor(d.stars),
            fillOpacity: 0.7
        });
        var innerhtml = "<div id='CategoryDiv'>" +
            "<form>" +
            "<label class='filters_checkbox' for='Categories'>" +
            "<input type='checkbox' name='filters' value='Categories' id='Categories' />" +
            "Categories" +
            "</label>" +
            "</form>" +
            "</div>";
        circle.on("click", function () {
            circleClickFunc(d);
        });
        circle.on('mouseover', function () {
            this.setStyle({opacity: 0.3, fillOpacity: 0.3});
        });
        circle.on('mouseout', function () {
            this.setStyle({opacity: 0.7, fillOpacity: 0.7});
        });
        circle.addTo(circleGroup);
        circles.push([d, circle]);
    });
    circleGroup.addTo(map);
    info.update();
    map.spin(false);


    var props = {};
    allData.forEach(function (d) {
        var obj = d.attributes;
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                if(props[prop] === undefined){
                    props[prop] = 1;
                }
                else{
                    props[prop]++;
                }
            }
        }
    });
    console.log(props);

});

var info = L.control({position: 'topright'});

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
}

info.update = function () {
    if(d3.select("#AreaStats").property("checked")){
        this._div.innerHTML = '<span>Radius: ' + radius + 'm(' + (radius * 0.000621371).toFixed(2) + 'mile)</span>';
    }
    else{
        var count = 0;
        circleGroup.eachLayer(function () {
            count++;
        });
        this._div.innerHTML = '<span>Current businesses: ' + count + '</span>';
    }
};

info.addTo(map);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'legend'),
        grades = [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];

    div.innerHTML += 'Rating(1 ~ 5)<Br>'
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i]) +'"></i> ' +
            parseFloat(grades[i]).toFixed(1) + '<Br>';
    }

    return div;
};

legend.addTo(map);