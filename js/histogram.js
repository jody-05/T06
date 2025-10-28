const drawHistogram = (data) => {
    // set the dimensions and margins of the chart area
    const svg = d3.select("#histogram")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)

    // create an inner chart group with margins
    const innerChart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const maxEng = d3.max(data, d => d.energyConsumption);
    binGenerator.domain([0, maxEng]);
    const bins = binGenerator(data);
    const binsMaxLength = d3.max(bins, d => d.length);  // get the maximum length of the bins
    
    // define scales (from shared constants)
    xScale
        .domain([0, maxEng])
        .range([0, innerWidth]);

    yScale
        .domain([0, binsMaxLength])
        .range([innerHeight, 0])
        .nice();    // use the nice() method to round the y-axis values

    // draw the bars of the histogram
    innerChart
        .selectAll("rect")
        .data(bins)
        .join("rect")
            .attr("x", d => xScale(d.x0))
            .attr("y", d => yScale(d.length))
            .attr("width", d => xScale(d.x1) - xScale(d.x0))
            .attr("height", d => innerHeight - yScale(d.length))
            .attr("fill", barColor)
            .attr("stroke", bodyBackgroundColor)
            .attr("stroke-width", 2);
    
    // add axes
    const bottomAxis = d3.axisBottom(xScale);

    // add the x-axis to the bottom of the chart relative to the inner chart
    innerChart
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(bottomAxis);

    // add the x-axis label
    svg
        .append("text")
        .text("Labeled Energy Consumption (kWh/year)")
        .attr("text-anchor", "end")
        .attr("x", width - 20)
        .attr("y", height - 5)
        .attr("class", "axis-label");

    const leftAxis = d3.axisLeft(yScale);

    // add the y-axis to the bottom of the chart relative to the inner chart
    innerChart
        .append("g")
        .attr("class", "y-axis")
        .call(leftAxis);

    svg
        .append("text")
        .text("Frequency")
        .attr("x", 30)
        .attr("y", 20)
        .attr("class", "axis-label");
}