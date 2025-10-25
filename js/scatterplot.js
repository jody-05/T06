const drawScatterPlot = (data) => {
    // set the dimensions and margins of the chart area
    const svg = d3.select("#scatterplot")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)  // responsive SVG

    // create an inner chart group with margins
    innerChartS = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xExtent = d3.extent(data, d => d.star);
    const yExtent = d3.extent(data, d => d.screenSize);

    const xScaleS = d3.scaleLinear()
        .domain([xExtent[0] - 0.5, xExtent[1] + 0.5])
        .range([0, innerWidth]);

    const yScaleS = d3.scaleLinear()
        .domain([yExtent[0], yExtent[1]])
        .range([innerHeight, 0])
        .nice()

    colorScale 
        .domain(data.map(d => d.screenTech))    // get unique screenTech values
        .range(d3.schemeCategory10);    // use a predefined color scheme

    innerChartS.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => xScaleS(d.star))
        .attr("cy", d => yScaleS(d.screenSize))
        .attr("r", 4)
        .attr("fill", d => colorScale(d.screenTech))
        .attr("opacity", 0.5);

    // Add axes
    const bottomAxis = d3.axisBottom(xScaleS);
    innerChartS.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(bottomAxis);

    svg.append("text")
        .text("Star Rating")
        .attr("text-anchor", "end")
        .attr("x", width - 20)
        .attr("y", height - 5)
        .attr("class", "axis-label");

    const leftAxis = d3.axisLeft(yScaleS);
    innerChartS.append("g")
        .call(leftAxis);

    svg.append("text")
        .text("Screen size (inches)")
        .attr("x", 30)
        .attr("y", 20)
        .attr("class", "axis-label");

    // Add a legend on the right-hand side
    const legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${width - 140}, ${margin.top})`);

    const uniqueTechs = Array.from(new Set(data.map(d => d.screenTech)));
    uniqueTechs.forEach((tech, i) => {
        const g = legend.append('g').attr('transform', `translate(0, ${i * 22})`);
        g.append('rect')
            .attr('width', 12)
            .attr('height', 12)
            .attr('fill', colorScale(tech));
        g.append('text')
            .attr('x', 18)
            .attr('y', 10)
            .text(tech)
            .attr('class', 'axis-label');
    });
}