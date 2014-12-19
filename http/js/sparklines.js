// function to generate time-series
// sparklines using an API endpoint from
// HDX.
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
        type: 'area-spline',
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
          show: false
        }
      }
    });

  });


};

buildHDXResourceUrl = function(id) {
  base = 'https://data.hdx.rwlabs.org/api/action/datastore_search?resource_id='
  resource_id = id
  l = ';limit=2000'
  url = base + resource_id + l;
  return(url)
};

// executing function
// building query url
url = buildHDXResourceUrl('b8b5670f-ce85-4c50-bb30-aa6003e29f2e');

// generating sparklines
generateSparkline(url, 'Total Persons of Concern', '#total-persons');
generateSparkline(url, 'Persons awaiting registration', '#persons-awaiting-registration');
generateSparkline(url, 'Registered Syrian Refugees', '#registered-refugees');