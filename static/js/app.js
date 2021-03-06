// Read in test subject ID data
function init(){
    d3.json("samples.json").then(function(data) {
        console.log(data);

        let subjectIDs = data.names;
        console.log(subjectIDs);

        //Put test subject names in dropdown menu
        let ddmenu = d3.select("#selDataset");
        for (subjectID of subjectIDs) {
            ddmenu.append("option").text(subjectID).property("value", subjectID);
        };
        
        //Set first/default ID
        let firstID = subjectIDs[0];
        optionChanged(firstID);
    });   
};
    

// Create charts based on ID
function charts(ID) {
    //Read in sample data
    d3.json("samples.json").then(function(data) {
        console.log(data);

        let sample_data = data.samples;
        console.log(sample_data);

        //Filter data by ID number
        let filteredSample = sample_data.filter(patient => patient.id === ID)[0];
        console.log(filteredSample);

        //Find sample_values for specific test subject
        let patient_values = filteredSample.sample_values;
        console.log(patient_values);

        //Find otu_ids for specific test subject
        let patient_otu_ids = filteredSample.otu_ids;
        console.log(patient_otu_ids);
        
        //Find otu_labels for specific test subject
        let patient_labels = filteredSample.otu_labels;
        console.log(patient_labels);

        //Data for horizontal bar chart
        let hbar = [
            {
            x: patient_values.slice(0, 10).reverse(),
            y: patient_otu_ids.slice(0, 10).reverse().map(otu => `OTU ${otu}`),
            text: patient_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h",
            }
        ];

        //Layout for bar chart
        let layout = {
            title: "Top 10 Bacteria in Subject Belly Button",
        };

        //Render the plot to the bar id tag
        Plotly.newPlot("bar", hbar, layout);

        //Create bubble chart
        //Data for the bubble chart
        let bubble = [
            {
                x: patient_otu_ids,
                y: patient_values,
                text: patient_labels,
                mode: "markers",
                marker: {
                    size: patient_values,
                    color: patient_otu_ids,
                }
            }
        ];

        //Layout for the bubble chart
        let bubble_layout = {
            title: "Belly Button Bacteria per Sample",
            xaxis: {
                title: "OTU IDs",
            }
        };

        //Render the chart to the bubble id tag
        Plotly.newPlot("bubble", bubble, bubble_layout)
    });

    //Bonus
    //Read in demographic data
    d3.json("samples.json").then(function(data) {
        console.log(data);

        let demographic = data.metadata;
        console.log(demographic);

        //Filter demographic data by ID number
        let filteredDemographic = demographic.filter(patient => patient.id ==ID)[0];
        console.log(filteredDemographic);

        //Find washing frequency for specific test subject
        let washFreq = filteredDemographic.wfreq;

        //Data for gauge chart
        let gaugeData = [
            {
                domain: {x: [0, 1], y: [0, 1]},
                value: washFreq,
                title: "Washes per Week",
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    axis: { 
                        range: [0,8],
                        tickwidth: 1, 
                        ticks: "",
                        tickmode: "array",
                        ticktext: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9"],
                        tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                    },
                    bar: {
                        color: "white",
                        thickness: 0.1,
                    },
                    steps: [
                        {range:[0, 1], color:"rgb(229, 238, 235)"},
                        {range:[1, 2], color:"rgb(199, 231, 220)"},
                        {range:[2, 3], color:"rgb(170, 216, 200)"},
                        {range:[3, 4], color:"rgb(144, 201, 181)"},
                        {range:[4, 5], color:"rgb(116, 180, 158)"},
                        {range:[5, 6], color:"rgb(81, 170, 139)"},
                        {range:[6, 7], color:"rgb(94, 201, 169)"},
                        {range:[7, 8], color:"#227457"},
                        {range:[8, 9], color:"rgb(10, 68, 48)"},
                    ],
                },
            }
        ];

        //Layout for the gauge chart
        let gauge_layout = { 
            title: "Belly Button Washing Frequency",
            width: 600, height: 500,
        };

        //Render the chart to the gauge id tag
        Plotly.newPlot("gauge", gaugeData, gauge_layout);
    });
};

function demographic(ID){
    //Put demographic information in chart
    let demo = d3.select("#sample-metadata");

    //Read in demographic data
    d3.json("samples.json").then(function(data) {
        console.log(data);

        let demographic = data.metadata;
        console.log(demographic);

        //Filter demographic data by ID number
        let filteredDemographic = demographic.filter(patient => patient.id ==ID)[0];
        console.log(filteredDemographic);

        //Read each key:value pair in filtered data as its own array
        let rows = Object.entries(filteredDemographic);
        console.log(rows);

        //Loop through each pair and append to demographic table
        for (row of rows) {
            demo.append("p").text(`${row[0]}: ${row[1]}`)
        };
    });
};

function optionChanged(value) {
    console.log(value);
    let ID = value;

    //Remove previous demographic data
    d3.select("#sample-metadata").text("");

    //Call chart and demographic functions with new ID
    charts(ID);
    demographic(ID);
};

init();

