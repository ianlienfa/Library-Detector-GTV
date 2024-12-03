import $ from "jquery";
function dummy_query(){
    // Selects elements with the class "dummy-class" and logs their text content to the console
    // $('.dummy-class').each(function() {
    //     console.log($(this).text());
    // });
    // const count = $('.count-me').length;
    // console.log(`There are ${count} elements with the class "count-me".`);
    // const isVisible = $('#dummy-element').is(':visible');
    // console.log(`Is #dummy-element visible? ${isVisible}`);
    // $('.dummy-input').each(function() {
    //     console.log($(this).val());
    // });
    // const firstItem = $('.first-item').first();
    // console.log(firstItem.text());
    console.log("statically loaded jquery", $().jquery);
    return $;
  }
window.dummy_query = dummy_query;
// window.$ = $;  


// function draw(container){
    // // Declare the chart
    // return import('d3')
    // .then(({ default: d3 }) => {        
    //     const width = 640;
    //     const height = 400;
    //     const marginTop = 20;
    //     const marginRight = 20;
    //     const marginBottom = 30;
    //     const marginLeft = 40;
    
    //     // Declare the x (horizontal position) scale.
    //     const x = d3.scaleUtc()
    //         .domain([new Date("2023-01-01"), new Date("2024-01-01")])
    //         .range([marginLeft, width - marginRight]);
    
    //     // Declare the y (vertical position) scale.
    //     const y = d3.scaleLinear()
    //         .domain([0, 100])
    //         .range([height - marginBottom, marginTop]);
    
    //     // Create the SVG container.
    //     const svg = d3.create("svg")
    //         .attr("width", width)
    //         .attr("height", height);
    
    //     // Add the x-axis.
    //     svg.append("g")
    //         .attr("transform", `translate(0,${height - marginBottom})`)
    //         .call(d3.axisBottom(x));
    
    //     // Add the y-axis.
    //     svg.append("g")
    //         .attr("transform", `translate(${marginLeft},0)`)
    //         .call(d3.axisLeft(y));
    
    //     // Append the SVG element.
    //     container.append(svg.node());
    // })
    // .catch((error) => 'An error occurred while loading the component');

    // return d3;
// }

// window.draw = draw; 


