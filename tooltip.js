//Handling tooltip creation and behavior
export function createTooltip(tooltipDiv) {
    const tooltip = d3.select(tooltipDiv)
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "rgba(255, 255, 255, 0.9)")
        .style("padding", "10px")
        .style("border-radius", "5px")
        .style("pointer-event", "none");

    //Specifying tooltip data content and format
    function showTooltip(event, item) {
        const name = `${item["Name"]}`;
        const nationality = `${item["Nationality"]}`;
        const year = `Year: ${item["Year"]}`
        const time = `Time: ${item["Time"]}`
        const doping = `${item["Doping"]}`
        //Creating a condition to show info in different ways if the doping variable is empty or not
        const tooltipText = doping !== "" ? `${name}: ${nationality}<br>${year}, ${time}<br><br>${doping}` : `${name}: ${nationality}<br>${year}, ${time}`;
        console.log(tooltipText);
        
        //Determining the tooltip's position respecting the mouse pointer
        tooltip.html(tooltipText)
            .attr("data-year", item["Year"])
            .style("left", (event.pageX + 40) + "px")
            .style("top", (event.pageY - 30) + "px")    
            .style("visibility", "visible");
    };

    //Creating a function to hide the tooltip when hovering out
    function hideTooltip() {
        tooltip.style("visibility", "hidden");
    };

    //Returning the functions for external uses
    return { showTooltip, hideTooltip }
};