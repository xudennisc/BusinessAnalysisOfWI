function parseInt2Date(x){
    var hour = parseInt(x) % 24;
    var day = parseInt(parseInt(x) / 24);
    return hour + "-" + day;
};

function initHeatmap(object){
  //UI configuration
  var itemSize = 18,
    cellSize = itemSize-1,
    width = 800,
    height = 800,

    margin = {top:20,right:20,bottom:20,left:25};

  //formats
  var hourFormat = d3.time.format('%H'),
    dayFormat = d3.time.format('%j'),
    timeFormat = d3.time.format('%Y-%m-%dT%X'),
    monthDayFormat = d3.time.format('%m.%d');

  //data vars for rendering
  var dateExtent = null,
    data = [],
    dayOffset = 0,
    colorCalibration = ['#aafaf6', '#8bE0fe', '#61AEfd', '#436Df4', '#4f3Ed5', '#42019e'],
    dailyValueExtent = {};

  //axises and scales
  var axisWidth = 0 ,
    axisHeight = itemSize*24,
    xAxisScale = d3.time.scale(),
    xAxis = d3.svg.axis()
      .orient('left')
      .ticks(7)
      .tickFormat(function (d) {
            var str = d.toString();
            return str.substring(0,3);
        }),
    yAxisScale = d3.scale.linear()
      .range([0,axisHeight])
      .domain([0,24]),
    yAxis = d3.svg.axis()
      .orient('top')
      .ticks(12)
      .tickFormat(d3.format('02d'))
      .scale(yAxisScale);


  initCalibration();

  var svg = d3.select('[role="heatmap"]');
  var heatmap = svg
    .attr('width',width)
    .attr('height',height)
  .append('g')
    .attr('width',width-margin.left-margin.right)
    .attr('height',height-margin.top-margin.bottom)
    .attr('transform','translate('+margin.left+','+margin.top+')');
  var rect = null;

    //data
    var checkin_info = object.checkin_info;
    var maxCount = 0;
    for(var i=0;i<24*7;i++){
        var date = parseInt2Date(i);
        var t = new Date(1425279600000+i*3600*1000)
        if(checkin_info[date] != null){
            data.push({date: t, count: checkin_info[date]});
            if(checkin_info[date] > maxCount)
                maxCount = checkin_info[date];
        }
        else{
            data.push({date: t, count: 0});
        }
    }

    data.forEach(function(valueObj){
        var day = valueObj['day'] = monthDayFormat(valueObj['date']);
        var dayData = dailyValueExtent[day] = (dailyValueExtent[day] || [1000,-1]);
        var pmValue = valueObj['count'];
        dayData[0] = d3.min([dayData[0],pmValue]);
        dayData[1] = d3.max([dayData[1],pmValue]);
    });

    dateExtent = d3.extent(data,function(d){
        return d.date;
    });

    axisWidth = itemSize*(dayFormat(dateExtent[1])-dayFormat(dateExtent[0])+1);

    //render axises
    xAxis.scale(xAxisScale.range([0,axisWidth]).domain([dateExtent[0],dateExtent[1]]));
    svg.append('g')
        .attr('transform','translate('+margin.left*1.25+','+margin.top+')')
        .attr('class','x axis')
        .call(xAxis)
        .append('text')
        .text('Hour')
        .attr('transform','translate('+axisHeight+',-10)');

    svg.append('g')
        .attr('transform','translate('+margin.left+','+margin.top+')')
        .attr('class','y axis')
        .call(yAxis)
        .append('text')
        .text('Day')
        .attr('transform','translate(-10,'+axisWidth*1.2+') rotate(-90)');

    //render heatmap rects
    dayOffset = dayFormat(dateExtent[0]);
    var last = null;
    rect = heatmap.selectAll('rect')
        .data(data)
        .enter().append('rect')
        .attr('width',cellSize)
        .attr('height',cellSize)
        .attr('y',function(d){
            return itemSize*(dayFormat(d.date)-dayOffset);
        })
        .attr('x',function(d){
            return hourFormat(d.date)*itemSize;
        })
        .attr('fill','#ffffff')
        .on("click", function (d) {
            if(last != null){
                last.style("stroke","none");
            }
            last = d3.select(this);
            rect.style("opacity","1.0");
            d3.select(this).style("stoke","black");
            heatmap.selectAll("[y='" + itemSize * (dayFormat(d.date) - dayOffset) + "']").style("opacity","0.5");
            heatmap.selectAll("[x='" + hourFormat(d.date) * itemSize + "']").style("opacity","0.5");
        });

    rect.append('title')
        .text(function(d){
            return d.count;
        });

    renderColor();

  function initCalibration(){
    d3.select('[role="calibration"] [role="example"]').select('svg')
      .selectAll('rect').data(colorCalibration).enter()
    .append('rect')
      .attr('width',cellSize)
      .attr('height',cellSize)
      .attr('x',function(d,i){
        return i*itemSize;
      })
      .attr('fill',function(d){
        return d;
      });

    //bind click event
    d3.selectAll('[role="calibration"] [name="displayType"]').on('click',function(){
      renderColor();
    });
  }

  function renderColor(){
      rect
          .filter(function(d){
              return (d.count>=0);
          })
          .transition()
          .delay(function(d){
              return (dayFormat(d.date)-dayOffset)*15;
          })
          .duration(500)
          .attrTween('fill',function(d,i,a){
              //choose color dynamicly
              var colorIndex = d3.scale.quantize()
                  .range([0,1,2,3,4,5])
                  .domain([0,maxCount]);

              return d3.interpolate(a,colorCalibration[colorIndex(d.count)]);
          });
  }

  //extend frame height in `http://bl.ocks.org/`
  d3.select(self.frameElement).style("height", "600px");  
};
