var TimeKnots = {
    draw: function(id, events, options) {
        // remove any exisitng elements
        d3.select(id).html("");

        var TODAY = Date.now();
        var cfg = {
            width: 600,
            height: 200,
            radius: 10,
            lineWidth: 4,
            color: "#999",
            background: "#FFF",
            dateFormat: "%Y/%m/%d %H:%M:%S",
            horizontalLayout: true,
            showLabels: false,
            labelFormat: "%Y/%m/%d %H:%M:%S",
            addNow: false,
            seriesColor: d3.scale.category20(),
            dateDimension: true
        };

        //default configuration overrid
        if (options != undefined) {
            for (var i in options) {
                cfg[i] = options[i];
            }
        }
        if (cfg.addNow != false) {
            events.push({
                date: new Date(),
                name: cfg.addNowLabel || "Today"
            });
        }
        var svg = d3.select(id).append('svg').attr("width", cfg.width).attr("height", cfg.height);
        //Calculate times in terms of timestamps
        if (!cfg.dateDimension) {
            var timestamps = events.map(function(d) {
                return d.value
            }); //new Date(d.date).getTime()});
            var maxValue = d3.max(timestamps);
            var minValue = d3.min(timestamps);
        } else {
            var timestamps = events.map(function(d) {
                return Date.parse(d.date);
            }); //new Date(d.date).getTime()});
            var maxValue = d3.max(timestamps);
            var minValue = d3.min(timestamps);
        }
        var margin = (d3.max(events.map(function(d) {
            return d.radius
        })) || cfg.radius) * 1.5 + cfg.lineWidth;
        var step = (cfg.horizontalLayout) ? ((cfg.width - 2 * margin) / (maxValue - minValue)) : ((cfg.height - 2 * margin) / (maxValue - minValue));
        var series = [];
        if (maxValue == minValue) {
            step = 0;
            if (cfg.horizontalLayout) {
                margin = cfg.width / 2
            } else {
                margin = cfg.height / 2
            }
        }
        linePrevious = {
            x1: null,
            x2: null,
            y1: null,
            y2: null
        }

        TIMELINE_LEFT_MARGIN = 130;
        TEXT_LEFT_MARGIN = 110;
        DATE_LEFT_MARGIN = 100;

        svg.selectAll("line")
            .data(events).enter().append("line")
            .attr("class", "timeline-line")
            .attr("x1", function(d) {
                var ret;
                if (cfg.horizontalLayout) {
                    var datum = (cfg.dateDimension) ? new Date(d.date).getTime() : d.value;
                    ret = Math.floor(step * (datum - minValue) + margin) - TIMELINE_LEFT_MARGIN
                } else {
                    ret = Math.floor(cfg.width / 2) - TIMELINE_LEFT_MARGIN
                }
                linePrevious.x1 = ret
                return ret
            })
            .attr("x2", function(d) {
                if (linePrevious.x1 != null) {
                    return linePrevious.x1
                }
                if (cfg.horizontalLayout) {
                    var datum = (cfg.dateDimension) ? new Date(d.date).getTime() : d.value;
                    ret = Math.floor(step * (datum - minValue))
                }
                return Math.floor(cfg.width / 2) - TIMELINE_LEFT_MARGIN
            })
            .attr("y1", function(d) {
                var ret;
                if (cfg.horizontalLayout) {
                    ret = Math.floor(cfg.height / 2)
                } else {
                    var datum = (cfg.dateDimension) ? new Date(d.date).getTime() : d.value;
                    ret = Math.floor(step * (datum - minValue)) + margin
                }
                linePrevious.y1 = ret
                return ret
            })
            .attr("y2", function(d) {
                if (linePrevious.y1 != null) {
                    return linePrevious.y1
                }
                if (cfg.horizontalLayout) {
                    return Math.floor(cfg.height / 2)
                }
                var datum = (cfg.dateDimension) ? new Date(d.date).getTime() : d.value;
                return Math.floor(step * (datum - minValue))
            })
            .style("stroke", function(d) {
                if (d.color != undefined) {
                    return d.color
                }
                if (d.series != undefined) {
                    if (series.indexOf(d.series) < 0) {
                        series.push(d.series);
                    }
                    return cfg.seriesColor(series.indexOf(d.series));
                }
                return cfg.color
            })
            .style("stroke-width", cfg.lineWidth);

        svg.selectAll("circle")
            .data(events).enter()
            .append("circle")
            .attr("class", "timeline-event")
            .attr("r", function(d) {
                if (d.radius != undefined) {
                    return d.radius
                }
                return cfg.radius
            })
            .style("stroke", function(d) {
                if (d.color != undefined) {
                    return d.color
                }
                if (d.series != undefined) {
                    if (series.indexOf(d.series) < 0) {
                        series.push(d.series);
                    }
                    console.log(d.series, series, series.indexOf(d.series));
                    return cfg.seriesColor(series.indexOf(d.series));
                }
                return cfg.color
            })
            .style("stroke-width", function(d) {
                if (d.lineWidth != undefined) {
                    return d.lineWidth
                }
                return cfg.lineWidth
            })
            .style("fill", function(d) {
                if (d.background != undefined) {
                    return d.background
                }
                return cfg.background
            })
            .attr("cy", function(d) {
                if (cfg.horizontalLayout) {
                    return Math.floor(cfg.height / 2)
                }
                var datum = (cfg.dateDimension) ? new Date(d.date).getTime() : d.value;
                return Math.floor(step * (datum - minValue) + margin)
            })
            .attr("cx", function(d) {
                if (cfg.horizontalLayout) {
                    var datum = (cfg.dateDimension) ? new Date(d.date).getTime() : d.value;
                    var x = Math.floor(step * (datum - minValue) + margin);
                    return x;
                }
                return Math.floor(cfg.width / 2) - TIMELINE_LEFT_MARGIN
            });

        svg.selectAll("text")
            .data(events).enter()
            .append('text').attr("class", "event-description")
            .html(function(d){
                return d.name;
            })
            .attr("x", function(d) {
                return Math.floor(cfg.width / 2) - TEXT_LEFT_MARGIN
            })
            .attr("y", function(d) {
                var datum = (cfg.dateDimension) ? new Date(d.date).getTime() : d.value;
                var y = Math.floor(step * (datum - minValue) + margin);
                return TimeKnots.checkAndFixCollision(svg, ".event-description", y, this);
            })
            .attr("text-anchor", "center")
            .style("opacity", function(d) {
                if (d.opacity != undefined) {
                    return d.opacity
                }
                return 1
            });

        svg.selectAll("p")
            .data(events).enter()
            .append('text').attr("class", "event-description-date")
            .html(function(d){
                if (moment(d.date).isSame(TODAY, 'day') && d.name !== "TODAY") {
                    return "TODAY";
                }
                return moment(new Date(d.date)).format("MMM D");
            })
            .attr("x", function(d) {
                return Math.floor(cfg.width / 2)  + DATE_LEFT_MARGIN
            })
            .attr("y", function(d) {
                var datum = (cfg.dateDimension) ? new Date(d.date).getTime() : d.value;
                var y = Math.floor(step * (datum - minValue) + margin); 
                return TimeKnots.checkAndFixCollision(svg, ".event-description-date", y, this);
            })
            .attr("text-anchor", "right")
            .style("opacity", function(d) {
                if (d.opacity != undefined) {
                    return d.opacity
                }
                return 1
            });
    },
    checkAndFixCollision: function(svg, id, y, that) {
        svg.selectAll(id).each(function() {
            if (this != that) {
                if (this.getAttribute('y') != null && (this.getAttribute('y') >= (y-10) && this.getAttribute('y') <= (y+10))) {
                    y += 15 - 0.05*(this.getAttribute('y') - y);
                    return y;
                }
            }
        });
        return y;
    }
}

