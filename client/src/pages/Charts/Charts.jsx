import React from "react";

import { Row, Col } from "reactstrap";

import Widget from '../../components/Widget/Widget';

import s from "./Charts.module.scss";
import { chartData } from "./mock";

import * as d3 from "d3v4";
import * as d3v3 from "d3";
import { Dropdown, DropdownButton, Button } from 'react-bootstrap';
import marketingData from './marketing_data2.csv';
import countryCount from './country_counts.csv';

class Charts extends React.Component {
  constructor(){
    super()
    this.changeXSubCategory = this.changeXSubCategory.bind(this);
    this.drawScatterPlot=this.drawScatterPlot.bind(this)
    // this.changeCountry=this.changeCountry.bind(this);
    // this.fetchAPIData=this.fetchAPIData.bind(this);
    
  }
  xMap={
    education:"Education",
    marital_status:"Marital Status",
    income_groups:"Income Groups",
    age_group:"Age Groups"
  }
  yMap={
    all:"All",
    wine:"Wine",
    fruits:"Fruits",
    meat:"Meat",
    sweet:"Sweets",
    gold:"Gold Products",
    fish:"Fish Products"
    
  }
  state = {
    cd: chartData,
    initEchartsOptions: {
      renderer: "canvas",
    },
    countryId:"all",
    barX:"education",
    barY:"all",
    xSubCategory:"",
    dataSet:"",
    scatterPlotDataSet:""
    
  };
  componentDidMount() {
    this.fetchAPIData();
    this.fetchScatterPlotData();
  }

   objToQueryString(obj) {
    const keyValuePairs = [];
    for (const key in obj) {
      keyValuePairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
    }
    return keyValuePairs.join('&');
  }

  fetchAPIData(){
    const apiUrl = 'http://127.0.0.1:5000/getData';
    const queryString = this.objToQueryString({
      countryId: this.state.countryId,
      barX:this.state.barX,
      barY:this.state.barY,
      xSubCategory:this.state.xSubCategory
  });    
    fetch(apiUrl+`?${queryString}`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({dataSet:data})
      })
      .then(()=>{
        this.setState({xSubCategory:this.state.dataSet["bar"][0]["label"]},()=>{
          this.drawPieChart();
        })
        
        // this.drawScatterPlot();
    this.drawWorldMap();
    this.drawBarChart();
    this.drawPCP()
      })
  }

  fetchScatterPlotData(){
    const apiUrl = 'http://127.0.0.1:5000/getScatterPlotData';
    const queryString = this.objToQueryString({
      countryId: this.state.countryId,
      barX:this.state.barX,
      barY:this.state.barY,
      xSubCategory:this.state.xSubCategory
  });
      
    fetch(apiUrl+`?${queryString}`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({scatterPlotDataSet:data})
      })
      .then(()=>{
        this.drawScatterPlot();
      });
  }

  changeCountry(id){
    this.setState({countryId:id},()=>{
      this.fetchAPIData();
      this.fetchScatterPlotData();
    });
    
  }

  

  changeXaxis(xCategory){
    
    this.setState({barX:xCategory})
  }

  changeYaxis(yCategory){
    this.setState({barY:yCategory})
  }

changeXSubCategory(d){
  this.setState({xSubCategory:d["label"]},()=>{
    this.drawPieChart();
  })
  console.log("function called")
  
}

  drawPCP(){
    document.getElementById("pcp-holder").innerHTML = "";
    // set the dimensions and margins of the graph
var margin = {top: 30, right: 90, bottom: 10, left: 70},
width = 900 - margin.left - margin.right,
height = 300 - margin.top - margin.bottom;
var data=this.state.dataSet["pcp"]
var color = d3v3.scale.ordinal()
                .domain(["0", "1", "2", "3"])
                .range(["#440154ff", "#21908dff", "#fde725ff", "#fae325ff"])

            var dimensions = [{
                    name: "Marital Status",
                    scale: d3v3.scale.ordinal().rangePoints([0, height]),
                    type: "string"
                },{
                  name: "Education",
                  scale: d3v3.scale.ordinal().rangePoints([0, height]),
                  type: "string"
              }, {
                    name: "Income",
                    scale: d3v3.scale.linear().range([height, 0]),
                    type: "number"
                },

                {
                    name: "Age",
                    scale: d3v3.scale.linear().range([height, 0]),
                    type: "number"
                }, {
                    name: "Wine",
                    scale: d3v3.scale.linear().range([height, 0]),
                    type: "number"
                }, {
                    name: "Fruit",
                    scale: d3v3.scale.linear().range([height, 0]),
                    type: "number"
                }, {
                    name: "Meat",
                    scale: d3v3.scale.linear().range([height, 0]),
                    type: "number"
                }, {
                    name: "Fish",
                    scale: d3v3.scale.linear().range([height, 0]),
                    type: "number"
                }, {
                    name: "Gold",
                    scale: d3v3.scale.linear().range([height, 0]),
                    type: "number"
                }
            ];

            var x = d3v3.scale.ordinal().domain(dimensions.map(function(d) {
                    return d.name;
                })).rangePoints([0, width]),
                y = {},
                dragging = {};

            var line = d3v3.svg.line(),
                axis = d3v3.svg.axis().orient("left"),
                background,
                foreground;

            var svg = d3v3.select("#pcp-holder").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



            //Create the dimensions depending on attribute "type" (number|string)
            //The x-scale calculates the position by attribute dimensions[x].name
            dimensions.forEach(function(dimension) {
                dimension.scale.domain(dimension.type === "number" ?
                d3v3.extent(data, function(d) {
                        return +d[dimension.name];
                    }) :
                    data.map(function(d) {
                        return d[dimension.name];
                    }).sort());
            });

            // Add grey background lines for context.
            background = svg.append("g")
                .attr("class", "background")
                .selectAll("path")
                .data(data)
                .enter().append("path")
                .attr("d", path);

            // background = svg.append("g")
            //     .attr("class", "background")
            //     .selectAll("path")
            //     .data(data)
            //     .enter().append("path")
            //     .attr("class", function(d) {
            //         return "line " + d["ClusterId"]
            //     }) // 2 class for each line: 'line' and the group name
            //     .attr("d", path)
            //     .style("fill", "none")
            //     .style("stroke", function(d) {
            //         return (color(d["ClusterId"]))
            //     })
            //     .style("opacity", 0.5);

            // Add blue foreground lines for focus.
            // foreground = svg.append("g")
            //     .attr("class", "foreground")
            //     .selectAll("path")
            //     .data(data)
            //     .enter().append("path")
            //     .attr("d", path);


            // Add blue foreground lines for focus.
            foreground = svg.append("g")
                .attr("class", "background")
                .selectAll("path")
                .data(data)
                .enter().append("path")
                .attr("class", function(d) {
                    return "line " + d["ClusterId"]
                }) // 2 class for each line: 'line' and the group name
                .attr("d", path)
                .style("fill", "none")
                .style("stroke", function(d) {
                    return (color(d["ClusterId"]))
                })
                .style("opacity", 0.1);


            // Add a group element for each dimension.
            var g = svg.selectAll(".dimension")
                .data(dimensions)
                .enter().append("g")
                .attr("class", "dimension")
                .attr("transform", function(d) {
                    return "translate(" + x(d.name) + ")";
                })
                .call(d3v3.behavior.drag()
                    .origin(function(d) {
                        return {
                            x: x(d.name)
                        };
                    })
                    .on("dragstart", function(d) {
                        dragging[d.name] = x(d.name);
                        background.attr("visibility", "hidden");
                    })
                    .on("drag", function(d) {
                        dragging[d.name] = Math.min(width, Math.max(0, d3v3.event.x));
                        foreground.attr("d", path);
                        dimensions.sort(function(a, b) {
                            return position(a) - position(b);
                        });
                        x.domain(dimensions.map(function(d) {
                            return d.name;
                        }));
                        g.attr("transform", function(d) {
                            return "translate(" + position(d) + ")";
                        })
                    })
                    .on("dragend", function(d) {
                        delete dragging[d.name];
                        transition(d3v3.select(this)).attr("transform", "translate(" + x(d.name) + ")");
                        transition(foreground).attr("d", path);
                        background
                            .attr("d", path)
                            .transition()
                            .delay(500)
                            .duration(0)
                            .attr("visibility", null);
                    })
                );

            // Add an axis and title.
            g.append("g")
                .attr("class", "axis")
                .each(function(d) {
                  d3v3.select(this).call(axis.scale(d.scale));
                })
                .append("text")
                .style("text-anchor", "middle")
                .attr("class", "axis-label")
                .attr("y", -19)
                .text(function(d) {
                    return d.name;
                });

            // Add and store a brush for each axis.
            g.append("g")
                .attr("class", "brush")
                .each(function(d) {
                    d3v3.select(this).call(d.scale.brush = d3v3.svg.brush().y(d.scale).on("brushstart", brushstart).on("brush", brush));
                })
                .selectAll("rect")
                .attr("x", -8)
                .attr("width", 16);


            function position(d) {
                var v = dragging[d.name];
                return v == null ? x(d.name) : v;
            }

            function transition(g) {
                return g.transition().duration(500);
            }

            // Returns the path for a given data point.
            function path(d) {
                //return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
                return line(dimensions.map(function(dimension) {
                    var v = dragging[dimension.name];
                    var tx = v == null ? x(dimension.name) : v;
                    return [tx, dimension.scale(d[dimension.name])];
                }));
            }

            function brushstart() {
                d3v3.event.sourceEvent.stopPropagation();
            }

            // // Handles a brush event, toggling the display of foreground lines.
            function brush() {
                var actives = dimensions.filter(function(p) {
                        return !p.scale.brush.empty();
                    }),
                    extents = actives.map(function(p) {
                        return p.scale.brush.extent();
                    });

                foreground.style("display", function(d) {
                    return actives.every(function(p, i) {
                        if (p.type === "number") {
                            return extents[i][0] <= parseFloat(d[p.name]) && parseFloat(d[p.name]) <= extents[i][1];
                        } else {
                            return extents[i][0] <= p.scale(d[p.name]) && p.scale(d[p.name]) <= extents[i][1];
                        }
                    }) ? null : "none";
                });
            }



  }


  
  drawBarChart(){

    d3.functor = function functor(v) {
      return typeof v === "function" ? v : function() {
          return v;
      };
  };
  
  d3.tip = function() {
  
      var direction = d3_tip_direction,
          offset = d3_tip_offset,
          html = d3_tip_html,
          node = initNode(),
          svg = null,
          point = null,
          target = null
  
      function tip(vis) {
          svg = getSVGNode(vis)
          point = svg.createSVGPoint()
          document.body.appendChild(node)
      }
  
      // Public - show the tooltip on the screen
      //
      // Returns a tip
      tip.show = function() {
          var args = Array.prototype.slice.call(arguments)
          if (args[args.length - 1] instanceof SVGElement) target = args.pop()
  
          var content = html.apply(this, args),
              poffset = offset.apply(this, args),
              dir = direction.apply(this, args),
              nodel = getNodeEl(),
              i = directions.length,
              coords,
              scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
              scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft
  
          nodel.html(content)
              .style('position', 'absolute')
              .style('opacity', 1)
              .style('pointer-events', 'all')
  
          while (i--) nodel.classed(directions[i], false)
          coords = direction_callbacks[dir].apply(this)
          nodel.classed(dir, true)
              .style('top', (coords.top + poffset[0]) + scrollTop + 'px')
              .style('left', (coords.left + poffset[1]) + scrollLeft + 'px')
  
          return tip
      }
  
      // Public - hide the tooltip
      //
      // Returns a tip
      tip.hide = function() {
          var nodel = getNodeEl()
          nodel
              .style('opacity', 0)
              .style('pointer-events', 'none')
          return tip
      }
  
      // Public: Proxy attr calls to the d3 tip container.  Sets or gets attribute value.
      //
      // n - name of the attribute
      // v - value of the attribute
      //
      // Returns tip or attribute value
      tip.attr = function(n, v) {
          if (arguments.length < 2 && typeof n === 'string') {
              return getNodeEl().attr(n)
          } else {
              var args = Array.prototype.slice.call(arguments)
              d3.selection.prototype.attr.apply(getNodeEl(), args)
          }
  
          return tip
      }
  
      // Public: Proxy style calls to the d3 tip container.  Sets or gets a style value.
      //
      // n - name of the property
      // v - value of the property
      //
      // Returns tip or style property value
      tip.style = function(n, v) {
          // debugger;
          if (arguments.length < 2 && typeof n === 'string') {
              return getNodeEl().style(n)
          } else {
              var args = Array.prototype.slice.call(arguments);
              if (args.length === 1) {
                  var styles = args[0];
                  Object.keys(styles).forEach(function(key) {
                      return d3.selection.prototype.style.apply(getNodeEl(), [key, styles[key]]);
                  });
              }
          }
  
          return tip
      }
  
      // Public: Set or get the direction of the tooltip
      //
      // v - One of n(north), s(south), e(east), or w(west), nw(northwest),
      //     sw(southwest), ne(northeast) or se(southeast)
      //
      // Returns tip or direction
      tip.direction = function(v) {
          if (!arguments.length) return direction
          direction = v == null ? v : d3.functor(v)
  
          return tip
      }
  
      // Public: Sets or gets the offset of the tip
      //
      // v - Array of [x, y] offset
      //
      // Returns offset or
      tip.offset = function(v) {
          if (!arguments.length) return offset
          offset = v == null ? v : d3.functor(v)
  
          return tip
      }
  
      // Public: sets or gets the html value of the tooltip
      //
      // v - String value of the tip
      //
      // Returns html value or tip
      tip.html = function(v) {
          if (!arguments.length) return html
          html = v == null ? v : d3.functor(v)
  
          return tip
      }
  
      // Public: destroys the tooltip and removes it from the DOM
      //
      // Returns a tip
      tip.destroy = function() {
          if (node) {
              getNodeEl().remove();
              node = null;
          }
          return tip;
      }
  
      function d3_tip_direction() { return 'n' }
  
      function d3_tip_offset() { return [0, 0] }
  
      function d3_tip_html() { return ' ' }
  
      var direction_callbacks = {
          n: direction_n,
          s: direction_s,
          e: direction_e,
          w: direction_w,
          nw: direction_nw,
          ne: direction_ne,
          sw: direction_sw,
          se: direction_se
      };
  
      var directions = Object.keys(direction_callbacks);
  
      function direction_n() {
          var bbox = getScreenBBox()
          return {
              top: bbox.n.y - node.offsetHeight,
              left: bbox.n.x - node.offsetWidth / 2
          }
      }
  
      function direction_s() {
          var bbox = getScreenBBox()
          return {
              top: bbox.s.y,
              left: bbox.s.x - node.offsetWidth / 2
          }
      }
  
      function direction_e() {
          var bbox = getScreenBBox()
          return {
              top: bbox.e.y - node.offsetHeight / 2,
              left: bbox.e.x
          }
      }
  
      function direction_w() {
          var bbox = getScreenBBox()
          return {
              top: bbox.w.y - node.offsetHeight / 2,
              left: bbox.w.x - node.offsetWidth
          }
      }
  
      function direction_nw() {
          var bbox = getScreenBBox()
          return {
              top: bbox.nw.y - node.offsetHeight,
              left: bbox.nw.x - node.offsetWidth
          }
      }
  
      function direction_ne() {
          var bbox = getScreenBBox()
          return {
              top: bbox.ne.y - node.offsetHeight,
              left: bbox.ne.x
          }
      }
  
      function direction_sw() {
          var bbox = getScreenBBox()
          return {
              top: bbox.sw.y,
              left: bbox.sw.x - node.offsetWidth
          }
      }
  
      function direction_se() {
          var bbox = getScreenBBox()
          return {
              top: bbox.se.y,
              left: bbox.e.x
          }
      }
  
      function initNode() {
          var node = d3.select(document.createElement('div'))
          node
              .style('position', 'absolute')
              .style('top', 0)
              .style('opacity', 0)
              .style('pointer-events', 'none')
              .style('box-sizing', 'border-box')
  
          return node.node()
      }
  
      function getSVGNode(el) {
          el = el.node()
          if (el.tagName.toLowerCase() === 'svg')
              return el
  
          return el.ownerSVGElement
      }
  
      function getNodeEl() {
          if (node === null) {
              node = initNode();
              // re-add node to DOM
              document.body.appendChild(node);
          };
          return d3.select(node);
      }
  
      // Private - gets the screen coordinates of a shape
      //
      // Given a shape on the screen, will return an SVGPoint for the directions
      // n(north), s(south), e(east), w(west), ne(northeast), se(southeast), nw(northwest),
      // sw(southwest).
      //
      //    +-+-+
      //    |   |
      //    +   +
      //    |   |
      //    +-+-+
      //
      // Returns an Object {n, s, e, w, nw, sw, ne, se}
      function getScreenBBox() {
          var targetel = target || d3.event.target;
  
          while ('undefined' === typeof targetel.getScreenCTM && 'undefined' === targetel.parentNode) {
              targetel = targetel.parentNode;
          }
  
          var bbox = {},
              matrix = targetel.getScreenCTM(),
              tbbox = targetel.getBBox(),
              width = tbbox.width,
              height = tbbox.height,
              x = tbbox.x,
              y = tbbox.y
  
          point.x = x
          point.y = y
          bbox.nw = point.matrixTransform(matrix)
          point.x += width
          bbox.ne = point.matrixTransform(matrix)
          point.y += height
          bbox.se = point.matrixTransform(matrix)
          point.x -= width
          bbox.sw = point.matrixTransform(matrix)
          point.y -= height / 2
          bbox.w = point.matrixTransform(matrix)
          point.x += width
          bbox.e = point.matrixTransform(matrix)
          point.x -= width / 2
          point.y -= height / 2
          bbox.n = point.matrixTransform(matrix)
          point.y += height
          bbox.s = point.matrixTransform(matrix)
  
          return bbox
      }
  
      return tip
  };

    document.getElementById("bar-chart-holder").innerHTML = "";
      var margin = {
          top: 20,
          right: 70,
          bottom: 60,
          left: 50
        },
        width = 500 - margin.left - margin.right,
        height = 268 - margin.top - margin.bottom;
        var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) {
            return "<strong>Count:</strong> <span style='color:red'>" + d["count"] + "</span>";
          })
      // append the svg object to the body of the page
      var svg = d3.select("#bar-chart-holder")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
    
    
      svg.call(tip);
      console.log(this.state.barX)
       
    
        // count how much each city occurs in list and store in countObj
        // this.state.dataset.forEach(function(d) {
        //     var feature_val = d[feature];
        //     if(countObj[feature_val] === undefined) {
        //         countObj[feature_val] = 0;
        //     } else {
        //         countObj[feature_val] = countObj[feature_val] + 1;
        //     }
        // });
        // now store the count in each data member
        // this.state.dataset.forEach(function(d) {
        //     var feature_val = d["label"];
        //     d.count = d["count"];
        // });
        this.state.dataSet["bar"].sort(function(b, a) {
           return a["label"] - b["label"];
         });
        // X axis
        var x = d3.scaleBand()
          .range([0, width])
          .domain(this.state.dataSet["bar"].map(function(d) {
            
            return d["label"];
          }))
          .padding(0.2);
        var svg_x_scale=svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));
          svg_x_scale.selectAll("text")
          .attr("transform", "translate(20,0)rotate(0)")
          .style("text-anchor", "end");
          svg_x_scale.append("text")
            .attr("y", 50)
            .attr("x", width/2)
            .attr("text-anchor", "middle")
            //.attr("class", "x label")
            .attr("stroke", "black")
            .style("font-size", "15px")
            .text(this.xMap[this.state.barX]);
    
    
        // Add Y axis
        var y = d3.scaleLinear()
          .domain([0, d3.max(this.state.dataSet["bar"], function(d) {
            return d["count"];
          })])
          .range([height, 0]);
        svg.append("g")
          .call(d3.axisLeft(y))
          .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 30)
                .attr("dy", "-5.1em")
                .attr("text-anchor", "end")
                .attr("stroke", "black")
                .attr("font-size", "15px")
                .text("Average");
    
    
        // Bars
        svg.selectAll("mybar")
          .data(this.state.dataSet["bar"])
          .enter()
          .append("rect")
          .attr("x", function(d) {
            return x(d["label"]);
          })
          .attr("y", function(d) {
            return y(0);
          })
          .attr("width", x.bandwidth())
          .attr("height", function(d) {
            return height - y(0);
          })
          .attr("fill", "#32bbed")
          .on("click", this.changeXSubCategory)
        //   .on("click", function(d) {
        //     // console.log(this.state.barX)
        //     // sendDiValue(d["Component"].slice(-1))
        //         console.log(d)
        //         this.changeXSubCategory();
        // })
          .on('mouseover', tip.show)
       .on('mouseout', tip.hide);
    // Animation
    svg.selectAll("rect")
    .transition()
    .duration(600)
    .attr("y", function(d) { return y(d["count"]); })
    .attr("height", function(d) { return height - y(d["count"]); })
    .delay(function(d,i){console.log(i) ; return(i*100)})
     
  }



  
  drawWorldMap(){
// The svg



d3.functor = function functor(v) {
  return typeof v === "function" ? v : function() {
      return v;
  };
};

d3.tip = function() {

  var direction = d3_tip_direction,
      offset = d3_tip_offset,
      html = d3_tip_html,
      node = initNode(),
      svg = null,
      point = null,
      target = null

  function tip(vis) {
      svg = getSVGNode(vis)
      point = svg.createSVGPoint()
      document.body.appendChild(node)
  }

  // Public - show the tooltip on the screen
  //
  // Returns a tip
  tip.show = function() {
      var args = Array.prototype.slice.call(arguments)
      if (args[args.length - 1] instanceof SVGElement) target = args.pop()

      var content = html.apply(this, args),
          poffset = offset.apply(this, args),
          dir = direction.apply(this, args),
          nodel = getNodeEl(),
          i = directions.length,
          coords,
          scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
          scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft

      nodel.html(content)
          .style('position', 'absolute')
          .style('opacity', 1)
          .style('pointer-events', 'all')

      while (i--) nodel.classed(directions[i], false)
      coords = direction_callbacks[dir].apply(this)
      nodel.classed(dir, true)
          .style('top', (coords.top + poffset[0]) + scrollTop + 'px')
          .style('left', (coords.left + poffset[1]) + scrollLeft + 'px')

      return tip
  }

  // Public - hide the tooltip
  //
  // Returns a tip
  tip.hide = function() {
      var nodel = getNodeEl()
      nodel
          .style('opacity', 0)
          .style('pointer-events', 'none')
      return tip
  }

  // Public: Proxy attr calls to the d3 tip container.  Sets or gets attribute value.
  //
  // n - name of the attribute
  // v - value of the attribute
  //
  // Returns tip or attribute value
  tip.attr = function(n, v) {
      if (arguments.length < 2 && typeof n === 'string') {
          return getNodeEl().attr(n)
      } else {
          var args = Array.prototype.slice.call(arguments)
          d3.selection.prototype.attr.apply(getNodeEl(), args)
      }

      return tip
  }

  // Public: Proxy style calls to the d3 tip container.  Sets or gets a style value.
  //
  // n - name of the property
  // v - value of the property
  //
  // Returns tip or style property value
  tip.style = function(n, v) {
      // debugger;
      if (arguments.length < 2 && typeof n === 'string') {
          return getNodeEl().style(n)
      } else {
          var args = Array.prototype.slice.call(arguments);
          if (args.length === 1) {
              var styles = args[0];
              Object.keys(styles).forEach(function(key) {
                  return d3.selection.prototype.style.apply(getNodeEl(), [key, styles[key]]);
              });
          }
      }

      return tip
  }

  // Public: Set or get the direction of the tooltip
  //
  // v - One of n(north), s(south), e(east), or w(west), nw(northwest),
  //     sw(southwest), ne(northeast) or se(southeast)
  //
  // Returns tip or direction
  tip.direction = function(v) {
      if (!arguments.length) return direction
      direction = v == null ? v : d3.functor(v)

      return tip
  }

  // Public: Sets or gets the offset of the tip
  //
  // v - Array of [x, y] offset
  //
  // Returns offset or
  tip.offset = function(v) {
      if (!arguments.length) return offset
      offset = v == null ? v : d3.functor(v)

      return tip
  }

  // Public: sets or gets the html value of the tooltip
  //
  // v - String value of the tip
  //
  // Returns html value or tip
  tip.html = function(v) {
      if (!arguments.length) return html
      html = v == null ? v : d3.functor(v)

      return tip
  }

  // Public: destroys the tooltip and removes it from the DOM
  //
  // Returns a tip
  tip.destroy = function() {
      if (node) {
          getNodeEl().remove();
          node = null;
      }
      return tip;
  }

  function d3_tip_direction() { return 'n' }

  function d3_tip_offset() { return [0, 0] }

  function d3_tip_html() { return ' ' }

  var direction_callbacks = {
      n: direction_n,
      s: direction_s,
      e: direction_e,
      w: direction_w,
      nw: direction_nw,
      ne: direction_ne,
      sw: direction_sw,
      se: direction_se
  };

  var directions = Object.keys(direction_callbacks);

  function direction_n() {
      var bbox = getScreenBBox()
      return {
          top: bbox.n.y - node.offsetHeight,
          left: bbox.n.x - node.offsetWidth / 2
      }
  }

  function direction_s() {
      var bbox = getScreenBBox()
      return {
          top: bbox.s.y,
          left: bbox.s.x - node.offsetWidth / 2
      }
  }

  function direction_e() {
      var bbox = getScreenBBox()
      return {
          top: bbox.e.y - node.offsetHeight / 2,
          left: bbox.e.x
      }
  }

  function direction_w() {
      var bbox = getScreenBBox()
      return {
          top: bbox.w.y - node.offsetHeight / 2,
          left: bbox.w.x - node.offsetWidth
      }
  }

  function direction_nw() {
      var bbox = getScreenBBox()
      return {
          top: bbox.nw.y - node.offsetHeight,
          left: bbox.nw.x - node.offsetWidth
      }
  }

  function direction_ne() {
      var bbox = getScreenBBox()
      return {
          top: bbox.ne.y - node.offsetHeight,
          left: bbox.ne.x
      }
  }

  function direction_sw() {
      var bbox = getScreenBBox()
      return {
          top: bbox.sw.y,
          left: bbox.sw.x - node.offsetWidth
      }
  }

  function direction_se() {
      var bbox = getScreenBBox()
      return {
          top: bbox.se.y,
          left: bbox.e.x
      }
  }

  function initNode() {
      var node = d3.select(document.createElement('div'))
      node
          .style('position', 'absolute')
          .style('top', 0)
          .style('opacity', 0)
          .style('pointer-events', 'none')
          .style('box-sizing', 'border-box')

      return node.node()
  }

  function getSVGNode(el) {
      el = el.node()
      if (el.tagName.toLowerCase() === 'svg')
          return el

      return el.ownerSVGElement
  }

  function getNodeEl() {
      if (node === null) {
          node = initNode();
          // re-add node to DOM
          document.body.appendChild(node);
      };
      return d3.select(node);
  }

  // Private - gets the screen coordinates of a shape
  //
  // Given a shape on the screen, will return an SVGPoint for the directions
  // n(north), s(south), e(east), w(west), ne(northeast), se(southeast), nw(northwest),
  // sw(southwest).
  //
  //    +-+-+
  //    |   |
  //    +   +
  //    |   |
  //    +-+-+
  //
  // Returns an Object {n, s, e, w, nw, sw, ne, se}
  function getScreenBBox() {
      var targetel = target || d3.event.target;

      while ('undefined' === typeof targetel.getScreenCTM && 'undefined' === targetel.parentNode) {
          targetel = targetel.parentNode;
      }

      var bbox = {},
          matrix = targetel.getScreenCTM(),
          tbbox = targetel.getBBox(),
          width = tbbox.width,
          height = tbbox.height,
          x = tbbox.x,
          y = tbbox.y

      point.x = x
      point.y = y
      bbox.nw = point.matrixTransform(matrix)
      point.x += width
      bbox.ne = point.matrixTransform(matrix)
      point.y += height
      bbox.se = point.matrixTransform(matrix)
      point.x -= width
      bbox.sw = point.matrixTransform(matrix)
      point.y -= height / 2
      bbox.w = point.matrixTransform(matrix)
      point.x += width
      bbox.e = point.matrixTransform(matrix)
      point.x -= width / 2
      point.y -= height / 2
      bbox.n = point.matrixTransform(matrix)
      point.y += height
      bbox.s = point.matrixTransform(matrix)

      return bbox
  }

  return tip
};


var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
          return "<span style='color:yellow'>" + d["properties"]["name"] + "</span>";
        })


var svg = d3.select("#world-map-svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

  svg.call(tip);












// Map and projection
var path = d3.geoPath();
var projection = d3.geoMercator()
  .scale(70)
  .center([0,20])
  .translate([width / 2, height / 2]);

// Data and color scale
var data = d3.map();
var colorScale = d3.scaleThreshold()
  .domain([0,3,109,120,147,159,263,337,1095])
  .range(["#eff3ff", "#bdd7e7", "#6baed6", "#3182bd", "#08519c"]);

// Load external data and boot
d3.queue()
  .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
  .defer(d3.csv, countryCount, function(d) { 
    
    data.set(d.Country, +d.Count); })
  .await((error, topo) =>{

    let mouseOver = function(d) {
      d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", .5)
      d3.select(this)
        .transition()
        .duration(200)
        .style("opacity", 1)
        .style("stroke", "black")
        tip.show(d);
    }
  
    let mouseLeave = function(d) {
      d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", .8)
      d3.select(this)
        .transition()
        .duration(200)
        .style("stroke", "transparent")

        tip.hide(d)
    }

    // Draw the map
    svg.append("g")
      .selectAll("path")
      .data(topo.features)
      .enter()
      .append("path")
        // draw each country
        .attr("d", d3.geoPath()
          .projection(projection)
        )
        // set the color of each country
        .attr("fill", function (d) {
          d.total = data.get(d.id) || 0;
          return colorScale(d.total);
        })
        .style("stroke", "transparent")
        .attr("class", function(d){ return "Country" } )
        .style("opacity", .8)
        .on("mouseover", mouseOver )
        .on("mouseleave", mouseLeave )
        .on("click", (d)=> {
          // console.log("country is "+d.properties.name);
          this.changeCountry(d.id)
      })
      });
  }

  drawScatterPlot(){
    document.getElementById("scatter-plot-holder").innerHTML = "";
    // set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 40, left: 60},
width = 460 - margin.left - margin.right,
height = 300 - margin.top - margin.bottom;
// append the svg object to the body of the page
var svg = d3.select("#scatter-plot-holder")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")")

//Read the data
// d3.csv(marketingData, function(data) {

// Add X axis
var x;
if(this.state.barX=='education'||this.state.barX=='marital_status'){
  x = d3.scalePoint() // or scaleBand()
  .domain([0,0])
  .range([ 0, width ]);
  svg.append("g")
  .attr("class", "myXaxis")   // Note that here we give a class to the X axis, to be able to call it later and modify it
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))
  .attr("opacity", "0")
}
else{
  x = d3.scaleLinear() 
  .domain([0,0])
  .range([ 0, width ]);
  svg.append("g")
  .attr("class", "myXaxis")   // Note that here we give a class to the X axis, to be able to call it later and modify it
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))
  .attr("opacity", "0")
}


// text label for the x axis
svg.append("text")
.attr("transform",
    "translate(" + (width / 2) + " ," +
    (height + margin.top + 27) + ")")
.style("text-anchor", "middle")
.text(this.xMap[this.state.barX]);

// Add Y axis
var y = d3.scaleLinear()
.domain([0, d3.max(this.state.scatterPlotDataSet["scatter"], function(d) {
  return d["yVal"]
})])
.range([ height, 0]);
svg.append("g")
.call(d3.axisLeft(y));

// text label for the y axis
svg.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left)
.attr("x", 0 - (height / 2))
.attr("dy", "1em")
.style("text-anchor", "middle")
.text(this.yMap[this.state.barY]);


// create a tooltip
var Tooltip = d3.select("#scatter-plot-holder")
.append("div")
.style("opacity", 0)
.attr("class", "tooltip")
.style("background-color", "white")
.style("border", "solid")
.style("border-width", "2px")
.style("border-radius", "5px")
.style("padding", "5px")

// Three function that change the tooltip when user hover / move / leave a cell
var mouseover = function(d) {
  Tooltip
    .style("opacity", 1)
}
var mousemove = function(d) {
  Tooltip
    .html("X: "+d["xVal"]+"\n"+"Y: " + d["yVal"])
    .style("left", (d3.mouse(this)[0]+70) + "px")
    .style("top", (d3.mouse(this)[1]) + "px")
}
var mouseleave = function(d) {
  Tooltip
    .style("opacity", 0)
}


// Add dots
svg.append('g')
.selectAll("dot")
.data(this.state.scatterPlotDataSet["scatter"])
.enter()
.append("circle")
  .attr("cx", function (d) { return x(d["xVal"]); } )
  .attr("cy", function (d) { return y(d["yVal"]); } )
  .attr("r", 1.5)
  .style("fill", "#32bbed")
  .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

// new X axis

  if(this.state.barX=='education'||this.state.barX=='marital_status'){
    x.domain(this.state.scatterPlotDataSet["scatter"].map(function(d) { return d["xVal"] }));
  }
  else{
    x.domain([0, d3.max(this.state.scatterPlotDataSet["scatter"], function(d) {
      return d["xVal"]
    })])
  }
svg.select(".myXaxis")
.transition()
.duration(200)
.attr("opacity", "1")
.call(d3.axisBottom(x));

svg.selectAll("circle")
.transition()
.delay(function(d,i){return(i*0.5)})
.duration(500)
.attr("cx", function (d) { return x(d["xVal"]); } )
.attr("cy", function (d) { return y(d["yVal"]); } )

  }



  drawPieChart(){
    document.getElementById("chart").innerHTML = "";
    console.log("new pie data is ")
    console.log(this.state.dataSet["pie"][this.state.xSubCategory])
    var dataset=this.state.dataSet["pie"][this.state.xSubCategory]
    console.log("dataset is ")
    console.log(dataset)
    // console.log("dataset is ")
    // console.log(this.state.dataSet["pie"][this.state.xSubCategory])
    // console.log("pie is")
    // console.log(this.state.dataSet["pie"][this.state.xSubCategory])
    // var dataset = [
    //   {label: "Divorced", count: 332.216981},
    //   {label: "Married", count: 296.050691},
    //   {label: "Single", count: 271.928571},
    //   {label: "Together", count: 338.700730},
    //   {label: "Widow", count: 389.930233}
    // ];
 

// chart dimensions
var width = 500;
var height = 300;

// a circle chart needs a radius
var radius = Math.min(width, height) / 2;

// legend dimensions
var legendRectSize = 15; // defines the size of the colored squares in legend
var legendSpacing = 4; // defines spacing between squares

// define color scale
var color = d3.scaleOrdinal(d3.schemeCategory20c);
// more color scales: https://bl.ocks.org/pstuffa/3393ff2711a53975040077b7453781a9

var svg = d3.select('#chart') // select element in the DOM with id 'chart'
  .append('svg') // append an svg element to the element we've selected
  .attr('width', width) // set the width of the svg element we just added
  .attr('height', height) // set the height of the svg element we just added
  .append('g') // append 'g' element to the svg element
  .attr('transform', 'translate(' + (width / 3) + ',' + (height / 2) + ')'); // our reference is now to the 'g' element. centerting the 'g' element to the svg element

var arc = d3.arc()
  .innerRadius(0) // none for pie chart
  .outerRadius(radius); // size of overall chart

var pie = d3.pie() // start and end angles of the segments
  .value(function(d) { return d.count; }) // how to extract the numerical data from each entry in our dataset
  .sort(null); // by default, data sorts in oescending value. this will mess with our animation so we set it to null

// define tooltip
var tooltip = d3.select('#chart') // select element in the DOM with id 'chart'
  .append('div') // append a div element to the element we've selected                                    
  .attr('class', 'tooltip-pie'); // add class 'tooltip' on the divs we just selected

tooltip.append('div') // add divs to the tooltip defined above                            
  .attr('class', 'label'); // add class 'label' on the selection                         

tooltip.append('div') // add divs to the tooltip defined above                     
  .attr('class', 'count'); // add class 'count' on the selection                  

tooltip.append('div') // add divs to the tooltip defined above  
  .attr('class', 'percent'); // add class 'percent' on the selection

// Confused? see below:

// <div id="chart">
//   <div class="tooltip">
//     <div class="label">
//     </div>
//     <div class="count">
//     </div>
//     <div class="percent">
//     </div>
//   </div>
// </div>

dataset.forEach(function(d) {
  d.count = +d.count; // calculate count as we iterate through the data
  d.enabled = true; // add enabled property to track which entries are checked
});

// creating the chart
var path = svg.selectAll('path') // select all path elements inside the svg. specifically the 'g' element. they don't exist yet but they will be created below
  .data(pie(dataset)) //associate dataset wit he path elements we're about to create. must pass through the pie function. it magically knows how to extract values and bakes it into the pie
  .enter() //creates placeholder nodes for each of the values
  .append('path') // replace placeholders with path elements
  .attr('d', arc) // define d attribute with arc function above
  .attr('fill', function(d) { return color(d.data.label); }) // use color scale to define fill of each label in dataset
  // .each(function(d) { this._current - d; }); // creates a smooth animation for each track

// mouse event handlers are attached to path so they need to come after its definition
path.on('mouseover', function(d) {  // when mouse enters div      
 var total = d3.sum(dataset.map(function(d) { // calculate the total number of tickets in the dataset         
  return (d.enabled) ? d.count : 0; // checking to see if the entry is enabled. if it isn't, we return 0 and cause other percentages to increase                                      
  }));                                                      
 var percent = Math.round(1000 * d.data.count / total) / 10; // calculate percent
 tooltip.select('.label').html(d.data.label); // set current label           
 tooltip.select('.count').html('$' + d.data.count); // set current count            
 tooltip.select('.percent').html(percent + '%'); // set percent calculated above          
 tooltip.style('display', 'block'); // set display                     
});                                                           

path.on('mouseout', function() { // when mouse leaves div                        
  tooltip.style('display', 'none'); // hide tooltip for that element
 });

path.on('mousemove', function(d) { // when mouse moves                  
  tooltip.style('top', (d3.event.layerY + 10) + 'px') // always 10px below the cursor
    .style('left', (d3.event.layerX + 10) + 'px'); // always 10px to the right of the mouse
  });

// define legend
var legend = svg.selectAll('.legend') // selecting elements with class 'legend'
  .data(color.domain()) // refers to an array of labels from our dataset
  .enter() // creates placeholder
  .append('g') // replace placeholders with g elements
  .attr('class', 'legend') // each g is given a legend class
  .attr('transform', function(d, i) {                   
    var height = legendRectSize + legendSpacing; // height of element is the height of the colored square plus the spacing      
    var offset =  height * color.domain().length / 2; // vertical offset of the entire legend = height of a single element & half the total number of elements  
    var horz = 11 * legendRectSize; // the legend is shifted to the left to make room for the text
    var vert = i * height - offset; // the top of the element is hifted up or down from the center using the offset defiend earlier and the index of the current element 'i'               
      return 'translate(' + horz + ',' + vert + ')'; //return translation       
   });

// adding colored squares to legend
legend.append('rect') // append rectangle squares to legend                                   
  .attr('width', legendRectSize) // width of rect size is defined above                        
  .attr('height', legendRectSize) // height of rect size is defined above                      
  .style('fill', color) // each fill is passed a color
  .style('stroke', color) // each stroke is passed a color
  .on('click', function(label) {
    var rect = d3.select(this); // this refers to the colored squared just clicked
    var enabled = true; // set enabled true to default
    var totalEnabled = d3.sum(dataset.map(function(d) { // can't disable all options
      return (d.enabled) ? 1 : 0; // return 1 for each enabled entry. and summing it up
    }));

    if (rect.attr('class') === 'disabled') { // if class is disabled
      rect.attr('class', ''); // remove class disabled
    } else { // else
      if (totalEnabled < 2) return; // if less than two labels are flagged, exit
      rect.attr('class', 'disabled'); // otherwise flag the square disabled
      enabled = false; // set enabled to false
    }

    pie.value(function(d) { 
      if (d.label === label) d.enabled = enabled; // if entry label matches legend label
        return (d.enabled) ? d.count : 0; // update enabled property and return count or 0 based on the entry's status
    });

    path = path.data(pie(dataset)); // update pie with new data

    path.transition() // transition of redrawn pie
      .duration(750) // 
      .attrTween('d', function(d) { // 'd' specifies the d attribute that we'll be animating
        var interpolate = d3.interpolate(this._current, d); // this = current path element
        this._current = interpolate(0); // interpolate between current value and the new value of 'd'
        return function(t) {
          return arc(interpolate(t));
        };
      });
  });
var reverseMap={
  "AmntWines":"Wine",
  "AmntFruits":"Fruits",
  "AmntMeatProducts":"Meat Products",
  "AmntFishProducts":"Fish Products",
  "AmntSweetProducts":"Sweets",
 "AmntGoldProds":"Gold Products",
 "AmntAll":"Total"
}
// adding text to legend
legend.append('text')                                    
  .attr('x', legendRectSize + legendSpacing)
  .attr('y', legendRectSize - legendSpacing)
  .text(function(d) { return reverseMap[d]; }); // return label
  }


  render() {
    const { cd, initEchartsOptions } = this.state;
    return (
      <div className={s.root}>
        <div>
          <Row>
          <Col lg={4} xs={12}>
              
              <Widget
                title={<p style={{ fontWeight: 700 }}>Select Country</p>}
                customDropDown
              >
                <svg id="world-map-svg" width="400" height="300"></svg>
                
              </Widget>
            </Col>

            <Col lg={4} xs={12}>
               
                  <Widget
                    title={<p style={{ fontWeight: 700 }}>{this.yMap[this.state.barY]} Expenditure Average</p>}
                    customDropDown
                  >
                    
                     <Row>             
                    <Col lg={4}>
   
                      <DropdownButton id="dropdown-item-button" title={this.xMap[this.state.barX]}>
                    <Dropdown.Item as="button" onClick={()=>{this.changeXaxis('education')}}>Education</Dropdown.Item>
                    <Dropdown.Item as="button" onClick={()=>{this.changeXaxis('marital_status')}}>Marital Status</Dropdown.Item>
                    <Dropdown.Item as="button" onClick={()=>{this.changeXaxis('income_groups')}}>Income groups</Dropdown.Item>
                    <Dropdown.Item as="button" onClick={()=>{this.changeXaxis('age_group')}}>Age group</Dropdown.Item>
                  </DropdownButton>
                  </Col>

                  <Col lg={4}>
   
                      <DropdownButton id="dropdown-item-button" title={this.yMap[this.state.barY]}>
                      <Dropdown.Item as="button" onClick={()=>{this.changeYaxis('all')}}>All</Dropdown.Item>
                    <Dropdown.Item as="button" onClick={()=>{this.changeYaxis('wine')}}>Wine Expenditure</Dropdown.Item>
                    <Dropdown.Item as="button" onClick={()=>{this.changeYaxis('fruits')}}>Fruits Expenditure</Dropdown.Item>
                    <Dropdown.Item as="button" onClick={()=>{this.changeYaxis('meat')}}>Meat Expenditure</Dropdown.Item>
                    <Dropdown.Item as="button" onClick={()=>{this.changeYaxis('fish')}}>Fish Products</Dropdown.Item>
                    <Dropdown.Item as="button" onClick={()=>{this.changeYaxis('sweet')}}>Sweets</Dropdown.Item>
                    <Dropdown.Item as="button" onClick={()=>{this.changeYaxis('gold')}}>Gold Products</Dropdown.Item>
                  </DropdownButton>
                  </Col>
                  <Col lg={4}>
                  <Button variant="primary" size="md" active onClick={()=>{this.fetchAPIData();this.fetchScatterPlotData()}}>
                    Submit
                  </Button>
                  </Col>
                  </Row> 
                  <div id="bar-chart-holder">
                  </div>
                </Widget>
                </Col>

            <Col lg={4} xs={12}>
              
              <Widget
                title={<p style={{ fontWeight: 700 }}>{this.xMap[this.state.barX]}/{this.state.xSubCategory}</p>}
                customDropDown
              >
                <div id="chart"></div>
                
              </Widget>
            </Col>
            
            
              <Row>
                <Col lg={5} xs={12}>
                 
                  <Widget
                    title={<p style={{ fontWeight: 700 }}>Scatter Plot</p>}
                    customDropDown
                  >
                    <div id="scatter-plot-holder"></div>
                  </Widget>
                </Col>
                
              
            
            <Col lg={7} xs={12}>
          
              <Widget
              title={<p style={{ fontWeight: 700 }}>PCP Plot</p>}
              customDropDown
            >
              <div id='pcp-holder'></div>
            </Widget>
            </Col>
            </Row>
          </Row>
        </div>
      </div>
    );
  }
}

export default Charts;
