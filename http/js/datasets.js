// functions to get datasets from HDX
// based on a country (group).
fetchDatasets = function(url, div_id) {

  d3.json(url, function(error, json) {
    if (error) return console.warn(error);

    // filtering the data
    var data = json.result.packages;

    // container for the datastes
    var containerBegin = '<div ckass="col-md-3">'
    var containerEnd = '</div>';

    // iterating over the id list and creating
    // a box in the html canvas
    for (i = 0; i < data.length; i++) {

	    // dataset name
	    var packageName = data[i].title;
	    var packageNameContainer = '<h4>' + packageName + '</h4>';

	    // dataset description
	    var packageDescription = data[i].notes;
	    var pacakageDescriptionContainer = '<p>' + packageDescription + '</p>';

	    // dataset link
	    var packageLink = 'http://data.hdx.rwlabs.org/dataset/' + data[i].name;
	    var packageLinkContainer = '<a href="' + packageLink + '" class="btn btn-primary">Visit dataset</a>';

	     // generating the cards
	    var doc = document.getElementById('dataset-container');
	    doc.innerHTML += containerBegin + packageNameContainer + pacakageDescriptionContainer + packageLinkContainer + containerEnd;
	  };

  });

};

// simple function to build a group url
// endpoint from HDX. the only parameter
// is an iso 3 letter code.
buildHDXGroupUrl = function(iso) {
  base = 'https://data.hdx.rwlabs.org/api/action/group_show?id='  // base url
  group_id = iso;  // iso 3 letter code
  url = base + group_id;  // query url
  return(url)
};

// executing function
// building query url
url = buildHDXGroupUrl('syr');

// generating sparklines
fetchDatasets(url, '#datasets-container');