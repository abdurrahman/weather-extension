'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
  getCurrentLocation(function(value) {
     if (!value) throw err

     if (value) {
       onUpdateBadge(value);
     }
   })
});

chrome.tabs.onUpdated.addListener(function (tabId) {
  chrome.pageAction.show(tabId);
});

var onUpdateBadge = function (position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;

    var baseApiUri = "https://api.darksky.net/forecast/";
    var apiKey = "65add8d78a15cb6f9b38a2065fadbe4f";
    var coords = lat + "," + lon;

    // getCookie("temperature", function(error, value) {
    //   if (value) {
    //     chrome.browserAction.setBadgeText({
    //       text: value.toString()
    //     });
    //   } else {
      $.ajax({
          type: "GET",
          url: baseApiUri + apiKey + "/" + coords,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          contentType: "application/json; charset=utf-8",
          dataType: "jsonp",
          success: function(result) {
            var temperature = celsiusFromFahrenheit(result.currently.temperature);
            // console.log(temperature);
            //setCookie("temperature", temperature.toString(), 3600);
            chrome.browserAction.setBadgeText({
              text: temperature.toString()
            });
          }
        });
    //   }
    // });
};