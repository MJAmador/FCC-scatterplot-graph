import { createTooltip } from "./tooltip.js";

const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
const req = new XMLHttpRequest();

let values = [];

let xScale;
let yScale;

const width = 900;
const height = 650;
const padding = 50;

const svg = d3.select("svg");

//Determining the size of the svg container
const drawCanvas = () => {
    svg.attr("width", width);
    svg.attr("height", height);
};

//Defining the space where the data values will be positioned within the svg container
const generateScales = () => {
    xScale = d3.scaleLinear()
        .domain([d3.min(values, (d) => d["Year"] - 1), d3.max(values, (d) => d["Year"] + 1)])
        .range([padding * 1.5, width - padding]);

    //Transforming time in seconds into a milliseconds because D3's time scales work with time values in milliseconds
    const timesArray = values.map(item => {
        return new Date(item["Seconds"] * 1000);
    });

    yScale = d3.scaleLinear()
        .domain([d3.max(timesArray), d3.min(timesArray)])
        .range([height - padding, padding * 2]) 
};

//Creating the actual axes based on the scales defined in "generateScales" function
const generateAxes = () => {
    let xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format("d")) //Converting d3 format to a "d" (decimal) format and therefore rounding the number, so the years will no be shown with commas

    let yAxis = d3.axisLeft(yScale)
        .tickFormat(d3.timeFormat("%M:%S")) //Converting d3 timeFormat (milliseconds) into a "%M:%S" (minutes : seconds) format 
    
    //Placing the xAxis on the svg
    svg.append("g")
        .call(xAxis)
        .attr("id", "x-axis")
        .attr("transform", "translate(0, " + (height - padding) + ")")

    //Placing the yAxis on the svg
    svg.append("g")
        .call(yAxis)
        .attr("id", "y-axis")
        .attr("transform", "translate(" + (padding * 1.5)+ ", 0)")
};

const tooltip = createTooltip("#tooltip");

//Creating each dot that corresponds to every item in the info array
const drawDots = () => {
    svg.selectAll("circle")
    .data(values)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", "5")
    .attr("fill", (d) => d["Doping"] !== "" ? "darkorange" : "green") //Changing the color of each dot depending if there's a "Doping" string present
    .attr("data-xvalue", (d) => d["Year"]) //Using it to associate specific data points with each circle (year info), useful in tooltip implementation
    .attr("data-yvalue", (d) => new Date(d["Seconds"] * 1000)) //Using it to associate specific data points with each circle (time info), useful in tooltip implementation
    .attr("cx", (d) => xScale(d["Year"])) //Aligning each data-xvalue dot with the corresponding value on the x-axis
    .attr("cy", (d) => yScale(new Date(d["Seconds"] * 1000))) //Aligning each data-yvalue dot with the corresponding value on the y-axis
    .on("mouseover", (event, item) => {
        tooltip.showTooltip(event, item);
    })
    .on("mouseout", () => {
        tooltip.hideTooltip();
    })
};


req.open("GET", url, true);
req.onload = () => {
    values = JSON.parse(req.responseText);

    drawCanvas();
    generateScales();
    drawDots();
    generateAxes();
};
req.send();
