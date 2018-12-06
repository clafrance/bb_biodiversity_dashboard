function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  let url = `/metadata/${sample}`;

  d3.json(url).then(function(data) {

    // console.log(data);

    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    var div = panel.append("div");
    Object.entries(data).forEach(function([key, value]) {
      keyUpper = key.toUpperCase()
      if (keyUpper != "WFREQ") {
        div.append("p").text(`${keyUpper}: ${value}`);
      };
    });

  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);
  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

  let url = `/samples/${sample}`;

  d3.json(url).then (function(sample_data) {
    // console.log(data);
    // console.log(data.otu_ids);
    console.log(sample_data);
    const sample1 = sample_data;
    console.log(sample1);

    // Bubble Chart using the date from samples/sample route

    var trace1 = {
      x: sample_data.otu_ids,
      y: sample_data.sample_values,
      type: "scatter",
      mode: "markers",
      text: sample_data.otu_labels,
      // hoverinfo:"x+y",
      marker: {
        size: sample_data.sample_values,
        color: sample_data.otu_ids
      }
    };

    var data = [trace1];

    var layout = {
      xaxis: {
        title: "OTU ID"
      },
      yaxis: {
        autorange: true,
        title: "Sample Values"
      },

      showlegend: false
    };

    Plotly.newPlot("bubble", data, layout);


    // Pie Chart

    // Sort the sample values in descending order, and get top 10

    var sample_values = sample_data.sample_values.map(value => value);
    var otu_ids = sample_data.otu_ids.map(value => value);
    var otu_labels = sample_data.otu_labels.map(value => value);

    var sample_values_sorted = sample_data.sample_values.map(value => value);
    var otu_ids_sorted = [];
    var otu_labels_sorted = [];

    // sample_values_sorted.sort(function compareFunction(firstNum, secondNum) {
    //   return secondNum - firstNum;
    // });

    // sample_values_sorted = sample_values_sorted.slice(0, 10);

    sample_values_sorted = sample_values_sorted.sort(function compareFunction(firstNum, secondNum) {
      return secondNum - firstNum;
    }).slice(0, 10);


    // Get the otu_ids and otu_labels for the top 10 sample values
    for (var i=0; i<sample_values_sorted.length; i++) {
      var index_of_sample_value = sample_values.indexOf(sample_values_sorted[i]);

      var otu_id = otu_ids[index_of_sample_value];
      var otu_label = otu_labels[index_of_sample_value];

      otu_ids_sorted.push(otu_ids[index_of_sample_value]);
      otu_labels_sorted.push(otu_labels[index_of_sample_value]);

      // console.log("index: " + index_of_sample_value);
      // console.log("sample_value: " + sample_values_sorted[i]);
      // console.log("otu_is: " + otu_id);
      // console.log("sample Values: " + sample_values);
      // console.log("length:" + otu_ids.length);
      // console.log("otu ids: " + otu_ids);
      // console.log("");

      sample_values.splice(index_of_sample_value, 1 );
      otu_ids.splice(index_of_sample_value, 1 );
      otu_labels.splice(index_of_sample_value, 1 );
    };

    console.log(sample_values_sorted);
    console.log(otu_ids_sorted);

    data = [{
      values: sample_values_sorted,
      labels: otu_ids_sorted,
      text: otu_labels_sorted,
      type: "pie"
    }];

    var 
    layout = {
      autosize: false,
      height: 450,
      width: 450,
      margin: {
        l: 50,
        r: 0,
        b: 0,
        t: 0,
        pad: 4
      }
    };

    Plotly.plot("pie", data, layout);
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
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();








function sortData (data) {
    // User JSON parse() and stringify() to break references.
    var sample_values = data.sample_values;

    // By default array sort is as strings, so for numbers
    // we must supply a compare function.
    sample_values.sort(function (a, b) {
        if (a > b) {
            return -1;
        }
        if (a < b) {
            return 1;
        }
        return 0;
    });
    
    // We use this to gather names for the sorted ids.
    var names = [];
    // Iterate over the sorted ids.
    ids.forEach(function (id, index) {
        // Get the index of the id in the object to sort.
        var objIdsIndex = objectToSort.ids.indexOf(id);

        // Get the corresponding name for the id.
        var nameAtIndex = objectToSort.names[objIdsIndex];

        // Put the name at the same index as the sorted ids.
        names.push(nameAtIndex);                
    });
    // Replace the ids and names of the object to sort with
    // the sorted its and the names we put in the same order.
    objectToSort.ids = ids;
    objectToSort.names = names;
}
