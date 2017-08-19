
var convertDateFromTimestamp = function (timestamp) {
    var date = new Date(timestamp * 1000);
    return date;
};

var getDayName = function (date) {
    var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    var day = days[ date.getDay() ];
    return day;
};

var celsiusFromFahrenheit = function (fahrenheit) {
    // convert to Celsius
    var c = Math.round((Number(fahrenheit) - 32.0) * 5.0/9.0)
    return c;
}

var getCurrentLocation = function(callback){
    navigator.geolocation.getCurrentPosition(function(location){
      callback(location);
    });
};

var getLocationName = function (latitude, longitude, callback){
    // debugger;
    var locationUrl = "https://maps.googleapis.com/maps/api/geocode/json?sensor=true&latlng=" + latitude + "," + longitude;

    $.get(locationUrl, function(data) {
    //   console.log(data);
    //   debugger;
      var locationName = "Unknown location...";

      var state, city;
      var result = data.results[0];

      if (result && result.address_components) {
        for (var i = 0; i < result.address_components.length; i++) {
          var ac = result.address_components[i];
          if (ac.types.indexOf('administrative_area_level_2') >= 0) city = ac.long_name;
          if (ac.types.indexOf('administrative_area_level_1') >= 0) state = ac.short_name;
        }
        locationName = (city ? city : '') + (city && state ? ', ' : '') + (state ? state : '');
        callback(locationName)
      }
    });
};

// Under the constructer
// Forming the query for Dark Sky weather forecasting API
// https://api.darksky.net/forecast/[key]/[latitude],[longitude]?lang=[lang]&units=[units]
var getWeatherFromApi = function(apiUrl, coords, lang, units, callback){
    
    chrome.storage.local.get('forecast', function(res){
      console.log("Storage Result:", res);    
      if(res){
        // setBadgeText(units, result.currently.temperature);
        console.log("forecast in storage")
        callback(res.forecast);
      } else {

        var forecastUrl = apiUrl + "/" +coords + "?";
        //?lang=tr&units=ca
        if(lang) forecastUrl += "lang=" + lang + "&";
        if(units) forecastUrl += "units" + units + "&";

        $.ajax({
            type: "GET",
            url: forecastUrl,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            contentType: "application/json; charset=utf-8",
            dataType: "jsonp",
            success: function(result) {
                console.log("forecast not yet in storage")
                chrome.storage.local.set({ forecast: result});
                callback(result);
                // setBadgeText(units,result.currently.temperature);
            }
        });
      }  
    });
}