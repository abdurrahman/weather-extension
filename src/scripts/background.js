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
    getCurrentLocation(function(position) {
     if (!position) throw err

     if (position) {
       onUpdateBadge(position);
     }
   });
    console.log("Got an alarm!", alarm);
});
chrome.alarms.clear('onUpdateBadge');
chrome.alarms.create('onUpdateBadge', { periodInMinutes: 60});
