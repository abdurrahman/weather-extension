'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
  getCurrentLocation(function(position) {
     if (!position) throw err

     if (position) {
       onUpdateBadge(position);
     }
   })
});

window.onUpdateBadge = function (position) {
  var lat = position.coords.latitude;
  var lon = position.coords.longitude;

  $.getJSON('/config.json', function(config){

    var baseApiUri = config.weatherApi;
    var apiKey = config.apiKey;
    var coords = lat + "," + lon;
    var units = localStorage._units;
    //console.log(units);

    getWeatherFromApi(config.weatherApi + config.apiKey, coords,"tr","ca", function(result){
        if (!result) throw err

        if(result){
            setBadgeText(units,result.currently.temperature);
        }
    });


    // chrome.storage.local.get('forecast', function(res){
    //   debugger;
    //   console.log(res);
    //   if(res && res.currently){
    //     setBadgeText(units, result.currently.temperature);
    //   } else {
    //     $.ajax({
    //       type: "GET",
    //       url: baseApiUri + apiKey + "/" + coords + "?lang=tr&units=ca",
    //       headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded'
    //       },
    //       contentType: "application/json; charset=utf-8",
    //       dataType: "jsonp",
    //       success: function(result) {
    //         debugger;
    //         console.log(result);
    //         chrome.storage.local.set({ forecast: result});
    //         setBadgeText(units,result.currently.temperature);
    //       }
    //     });
    //   }  
    // });
  });
};

var setBadgeText = function(units, temperature){
  if (units == undefined) units = "c"; 
  // var temperature = result.currently.temperature;
  if (units == "c")
    temperature = celsiusFromFahrenheit(temperature);
  chrome.browserAction.setBadgeText({
    text: Math.round(temperature).toString() + "°"
  });
};

chrome.alarms.onAlarm.addListener(function(alarm){
    getCurrentLocation(function(value) {
     if (!value) throw err

     if (value) {
       onUpdateBadge(value);
     }
   });
    console.log("Got an alarm!", alarm);
});
chrome.alarms.clear('onUpdateBadge');
chrome.alarms.create('onUpdateBadge', { periodInMinutes: 1});
