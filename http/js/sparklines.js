// function to generate time-series
// sparklines using an API endpoint from
// HDX. this function depends on:
// -- c3.js
// -- d3.js
// -- datacollection.js (you can use jsonpath.js instead)
generateSparkline = function(url, indicator_name, div_id) {

  d3.json(url, function(error, json) {
    if (error) return console.warn(error);

    // filtering the data
    var data, values, dates, ind_data;
    data = new DataCollection(json.result.records);
    values = data.query().filter({ module_name: indicator_name }).values('value');
    dates = data.query().filter({ module_name: indicator_name }).values('updated_at');

    // converting strings to date objects
    var format = d3.time.format("%Y-%m-%dT%H:%M:%S");
    var date_time = [];
    function getDate(element) {
       date_time.push(format.parse(String(element)));
    };

    dates.forEach(getDate)

    chart_data = { date: date_time, value: values };

    c3.generate({
      bindto: div_id,
      data: {
        x: 'date',
        x_format : '%Y-%m-%dT%H:%M:%S',
        json: chart_data,
        type: 'area',
        labels: false,
        selection: {
          enabled: false,
          grouped: false,
          multiple: false,
        },
      },
      point: {
        show: false
      },
      legend: {
        show: false
      },
      axis : {
        x : {
          show: false,
          type : 'timeseries',
          tick : {
            format : "%e %b %y"
          }
        },
        y: {
          show: false,
          max: 3300000,
          min: 100000,
        }
      }
    });

  });


};

// simple function to build a datastore url
// endpoint from a resource on HDX / CKAN.
// the only necessary parameter is a resource id.
buildHDXResourceUrl = function(id) {
  base = 'https://data.hdx.rwlabs.org/api/action/datastore_search?resource_id='  // base url
  resource_id = id  // resource id
  l = ';limit=2000'  // limit of the response (example limit)
  url = base + resource_id + l;  // contatenate it all
  return(url)
};

// executing function
// building query url
url = buildHDXResourceUrl('b8b5670f-ce85-4c50-bb30-aa6003e29f2e');

// generating sparklines
// each function calls the api endpoint
// from a resource independently.
// this causes a performance issue,
// but demonstrates how each call can be made independendtly.
generateSparkline(url, 'Total Persons of Concern', '#total-persons');
generateSparkline(url, 'Persons awaiting registration', '#persons-awaiting-registration');
generateSparkline(url, 'Registered Syrian Refugees', '#registered-refugees');