function buildMetadata(sample) {
  var metaURL = `metadata/${sample}`;
  console.log(metaURL);
  // The following function that builds the metadata panel
  // Plot the default route once the page loads
  d3.json(metaURL).then(function(sample_metadata) {
      console.log(sample_metadata);
      let metaData = d3.select('#sample-metadata');
      metaData.html(" ");
      Object.entries(sample_metadata).forEach(([key, value]) => {
        // Log the key and value
        console.log(`Key: ${key} and Value ${value}`);
        var row = metaData.append("tr");
        row.append("td").text(`${key}: ${value}`);
    
      
    
    });
    
  });
  
 //build Charts   

function buildCharts(sample) {
  var dataURL = `samples/${sample}`;

  // Use `d3.json` to fetch the sample data for the plots

    // Build a Bubble Chart using the sample data
    d3.json(dataURL).then(function(data) {
      console.log(data);
      let xValues = data.otu_ids;
      console.log(xValues);
      let yValues = data.sample_values;
      console.log(yValues);
      let textValues= data.otu_labels;
      console.log(textValues);
      let bubbleTrace = {
        x: xValues,
        y: yValues,
        text: textValues,
        mode: 'markers',
        marker: {
          color: xValues,
          size: yValues}
      };
      bubbleData = [bubbleTrace];
      Plotly.newPlot("bubble", bubbleData);
    });
  
    // Build Pie Chart
   
    
    d3.json(dataURL).then(function(data) {
      console.log(data);
      let sampleValues = data.sample_values.slice(0,10);
      console.log(sampleValues);
      let otuValues = data.otu_ids.slice(0,10);
      console.log(otuValues);
      let labelValues= data.otu_labels.slice(0,10);
      console.log(labelValues);
      pieTrace = {
        values: sampleValues,
        labels: otuValues,
        hovertext: labelValues,
        type: 'pie'
      };
      pieData = [pieTrace];
      Plotly.newPlot("pie", pieData);
    });
  }
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    console.log(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
