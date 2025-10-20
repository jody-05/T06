const populateFilters = (data) => {
    d3.select("#filters_screen")
        .selectAll(".filter")
        .data(filters_screen)
        .join("button")
            .attr("class", d => `filter ${d.isActive ? "active" : ""}`)
            .text(d => d.label)
            .on("click", (e, d) => {
                console.log("Clicked filter:", e);
                console.log("Clicked filter data:", d);

                if(!d.isActive){
                    // make sure button clicked is not already active
                    filters_screen.forEach(filter => {
                        filter.isActive = d.id === filter.id ? true : false;
                    });

                    // update the filter buttons based on which one was clicked
                    d3.selectAll("#filters_screen .filter")
                        .classed("active", filter => filter.id === d.id ? true : false);

                    updateHistogram(d.id, data);
                }
            });
};

const updateHistogram = (filterId, data) => {
    const filteredData = filterId === "all"
        ? data
        : data.filter(tv => tv.screenTech === filterId);

    const bins = binGenerator(filteredData);

    const binsMaxLength = d3.max(bins, d => d.length);

    yScale
        .domain([0, binsMaxLength])
        .nice();

    const svg = d3.select("#histogram svg");
    const innerChart = svg.select("g");

    // JOIN new data
    const bars = innerChart.selectAll("rect")
        .data(bins, d => d.x0); // Use x0 as a key for better joins

    // EXIT
    bars.exit().remove();

    // UPDATE
    bars
        .transition()
        .duration(500)
        .attr("x", d => xScale(d.x0))
        .attr("y", d => yScale(d.length))
        .attr("width", d => xScale(d.x1) - xScale(d.x0))
        .attr("height", d => innerHeight - yScale(d.length));

    // ENTER
    bars.enter()
        .append("rect")
        .attr("x", d => xScale(d.x0))
        .attr("y", d => yScale(d.length))
        .attr("width", d => xScale(d.x1) - xScale(d.x0))
        .attr("height", d => innerHeight - yScale(d.length))
        .attr("fill", barColor)
        .attr("stroke", bodyBackgroundColor)
        .attr("stroke-width", 2);

    // UPDATE axes
    const yAxis = d3.axisLeft(yScale);
    innerChart.select("g.y-axis").call(yAxis);
};
