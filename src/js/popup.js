$(document).ready(function() {
   $(".container").hide();
   //
   getCurrentLocation(function(value) {
     if (!value) throw err

     if (value) {
       updateBadge(value)
       getWeather(value, 'New York');
     }
   })

  // setTimeout(function(){
  //   $(".sk-cube-grid").hide();
  //   // $(".container").show();
  //   $(".out-of-service").show();
  // },3000);

});

function updateBadge(position) {

	var lat = position.coords.latitude;
	var lon = position.coords.longitude;

  var baseApiUri = "https://api.darksky.net/forecast/";
  var apiKey = "65add8d78a15cb6f9b38a2065fadbe4f";
  var coords = lat + "," + lon;

  getCookie("temperature", function(error, value) {
    if (value) {
      chrome.browserAction.setBadgeText({
        text: value.toString()
      });
    } else {
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
         setCookie("temperature", temperature.toString(), 3600);
         chrome.browserAction.setBadgeText({
           text: temperature.toString()
         });
       }
     });
   }
 });
}

function getWeather(position, city) {

    var lat = position.coords.latitude;
    var lon = position.coords.longitude;

  getCookie("forecast", function(error, value) {
    console.log("Get cookie : " + value);
    console.log("Value" + !value);

    if(value !== undefined && value !== null)
    {
      // console.log("Get cookie value :" + JSON.parse(forecastCookie));
      prepareDOM(JSON.parse(value));

      getCityState(lat, lon, function (value) {
        $(".weather-location").html('<i class="icon ion-location"></i> ' + value);
      })
      $(".sk-cube-grid").hide();
      $(".container").show();
    }
    else {

      // Forming the query for Dark Sky weather forecasting API
      // https://api.darksky.net/forecast/[key]/[latitude],[longitude]
      var baseApiUri = "https://api.darksky.net/forecast/";
      var apiKey = "65add8d78a15cb6f9b38a2065fadbe4f";
      var coords = lat + "," + lon;

      $.ajax({
        type: "GET",
        url: baseApiUri + apiKey + "/" + coords,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function(){
          $(".sk-cube-grid").show();
        },
        success: function(result){
          // console.log(result);
          setCookie("forecast", JSON.stringify(result), 3600);
          // setCookie("forecastCurrently", JSON.stringify(result.currently), 3600);
          // setCookie("forecastDaily", JSON.stringify(result.daily.data), 3600);
          getCityState(lat, lon, function (value) {
            $(".weather-location").html('<i class="icon ion-location"></i> ' + value);
          })
          prepareDOM(result);
        },
        complete: function(){
          $(".sk-cube-grid").hide();
          $(".container").show();
        }
      });

    }
  })
};

function prepareDOM (result) {
  var currentWeather = result.currently;
  var weatherIcon = $(getWeatherIcon(currentWeather.icon)).attr('title', currentWeather.summary);
  // console.log(weatherIcon[0].outerHTML);
  var currentDate = convertDateFromTimestamp(currentWeather.time);

  $(".weather-date").html('<i class="icon ion-calendar"></i> ' + currentDate.toDateString());
  $(".weather-value").html(celsiusFromFahrenheit(currentWeather.temperature) + '° C');
  $(".weather-icon").html(weatherIcon[0].outerHTML);
  $(".weather-text").html(currentWeather.summary);
  $(".forecast ul").html("");

  var forecastWeathers = result.daily.data;
  for (var i=0; i < forecastWeathers.length; i++){
    if (i == 0)
      continue;
    if (i == 6)
      break;

    var forecastWeather = forecastWeathers[i];
    var forecastDate = convertDateFromTimestamp(forecastWeather.time);
    var forecastDay= getDayName(forecastDate);
    weatherIcon = $(setWeatherIcon(forecastWeather.icon)).attr('title', forecastWeather.summary);
    $(".forecast ul").append("<li><div>" +
      "<span>"+ weatherIcon[0].outerHTML + "</span>" +
      "<span>" + forecastDay + "</span>" +
      "<span>" + celsiusFromFahrenheit(forecastWeather.temperatureMin) + " / " + celsiusFromFahrenheit(forecastWeather.temperatureMax) + " °C</span>" +
    "</div></li>")
  }
}

function setCookie (name, value, expiration) {
  console.log((new Date().getTime()/1000) + expiration)
  chrome.cookies.set({
    "name" : name,
    "url" : "http://developer.chrome.com/extensions/cookies.html",
    "value": value,
    "expirationDate": (new Date().getTime()/1000) + + expiration
  }, function (cookie) {
    console.log("Set cookie name :" + name + " - value :" + JSON.stringify(cookie));
    // console.log(chrome.extension.lastError);
    // console.log(chrome.runtime.lastError);
  });
}

function getCookie (name, callback) {
   chrome.cookies.get({
    "name": name,
    "url" : "http://developer.chrome.com/extensions/cookies.html",
  }, function (cookie) {
    callback(undefined, cookie && cookie.value)
  })
}

function getCurrentLocation (callback) {
	navigator.geolocation.getCurrentPosition(function(location) {
    callback(location)
	});
}

function getCityState (latitude, longitude, callback){
  var locationUrl = 'https://maps.googleapis.com/maps/api/geocode/json?sensor=true&latlng=' + latitude + ',' + longitude;

  $.get(locationUrl, function(data) {
    // console.log(data);

    var locationName = 'Unknown location...';

    var state, city;
    var result = data.results[0];

    if (result && result.address_components) {
      for (var i = 0; i < result.address_components.length; i++) {
        var ac = result.address_components[i];
        if (ac.types.indexOf('locality') >= 0) city = ac.long_name;
        if (ac.types.indexOf('administrative_area_level_1') >= 0) state = ac.short_name;
      }
      locationName = (city ? city : '') + (city && state ? ', ' : '') + (state ? state : '');
      callback(locationName)
    }
  });
}

function convertDateFromTimestamp(timestamp)
{
  var date = new Date(timestamp * 1000);
  return date;
}

function getDayName(date)
{
  var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var day = days[ date.getDay() ];
  return day;
}

function celsiusFromFahrenheit(fahrenheit)
{
  var c = Math.round((Number(fahrenheit) - 32.0) * 5.0/9.0) // convert to Celsius
  return c;
}

function getWeatherIcon(iconText){
  var icon = "";
  switch(iconText) {
    case 'clear-day':
      icon = '<i class="wi wi-day-sunny"></i>';
    break;
    case 'clear-night':
      icon = '<i class="wi wi-night-clear"></i>';
    break;
    case 'rain':
      icon = '<i class="wi wi-rain"></i>';
    break;
    case 'snow':
      icon = '<i class="wi wi-snow"></i>';
    break;
    case 'sleet':
      icon = '<i class="wi wi-sleet"></i>';
    break;
    case 'wind':
      icon = '<i class="wi wi-windy"></i>';
    break;
    case 'fog':
      icon = '<i class="wi wi-fog"></i>';
    break;
    case 'cloudy':
      icon = '<i class="wi wi-cloudy"></i>';
    break;
    case 'partly-cloudy-day':
      icon = '<i class="wi wi-day-cloudy"></i>';
    break;
    case 'partly-cloudy-night':
      icon = '<i class="wi-night-partly-cloudy"></i>';
    break;
    case 'hail':
      icon = '<i class="wi wi-hail"></i>';
    break;
    case 'tornado':
      icon = '<i class="wi wi-tornado"></i>';
    break;
    case 'thunderstorm':
      icon = '<i class="wi wi-thunderstorm"></i>';
    break;
  }
  return icon;
}

function setWeatherIcon(condid) {
  var icon;
  switch(condid) {
    case '0': icon  = '<i class="wi wi-tornado"></i>';
    break;
    case '1': icon  = '<i class="wi wi-storm-showers"></i>';
    break;
    case '2': icon  = '<i class="wi wi-tornado"></i>';
    break;
    case '3': icon  = '<i class="wi wi-thunderstorm"></i>';
    break;
    case '4': icon  = '<i class="wi wi-thunderstorm"></i>';
    break;
    case '5': icon  = '<i class="wi wi-snow"></i>';
    break;
    case '6': icon  = '<i class="wi wi-rain-mix"></i>';
    break;
    case '7': icon  = '<i class="wi wi-rain-mix"></i>';
    break;
    case '8': icon  = '<i class="wi wi-sprinkle"></i>';
    break;
    case '9': icon  = '<i class="wi wi-sprinkle"></i>';
    break;
    case '10': icon  = '<i class="wi wi-hail"></i>';
    break;
    case '11': icon  = '<i class="wi wi-showers"></i>';
    break;
    case '12': icon  = '<i class="wi wi-showers"></i>';
    break;
    case '13': icon  = '<i class="wi wi-snow"></i>';
    break;
    case '14': icon  = '<i class="wi wi-storm-showers"></i>';
    break;
    case '15': icon  = '<i class="wi wi-snow"></i>';
    break;
    case '16': icon  = '<i class="wi wi-snow"></i>';
    break;
    case '17': icon  = '<i class="wi wi-hail"></i>';
    break;
    case '18': icon  = '<i class="wi wi-hail"></i>';
    break;
    case '19': icon  = '<i class="wi wi-cloudy-gusts"></i>';
    break;
    case '20': icon  = '<i class="wi wi-fog"></i>';
    break;
    case '21': icon  = '<i class="wi wi-fog"></i>';
    break;
    case '22': icon  = '<i class="wi wi-fog"></i>';
    break;
    case '23': icon  = '<i class="wi wi-cloudy-gusts"></i>';
    break;
    case '24': icon  = '<i class="wi wi-cloudy-windy"></i>';
    break;
    case '25': icon  = '<i class="wi wi-thermometer"></i>';
    break;
    case '26': icon  = '<i class="wi wi-cloudy"></i>';
    break;
    case '27': icon  = '<i class="wi wi-night-cloudy"></i>';
    break;
    case '28': icon  = '<i class="wi wi-day-cloudy"></i>';
    break;
    case '29': icon  = '<i class="wi wi-night-cloudy"></i>';
    break;
    case '30': icon  = '<i class="wi wi-day-cloudy"></i>';
    break;
    case '31': icon  = '<i class="wi wi-night-clear"></i>';
    break;
    case '32': icon  = '<i class="wi wi-day-sunny"></i>';
    break;
    case '33': icon  = '<i class="wi wi-night-clear"></i>';
    break;
    case '34': icon  = '<i class="wi wi-day-sunny-overcast"></i>';
    break;
    case '35': icon  = '<i class="wi wi-hail"></i>';
    break;
    case '36': icon  = '<i class="wi wi-day-sunny"></i>';
    break;
    case '37': icon  = '<i class="wi wi-thunderstorm"></i>';
    break;
    case '38': icon  = '<i class="wi wi-thunderstorm"></i>';
    break;
    case '39': icon  = '<i class="wi wi-thunderstorm"></i>';
    break;
    case '40': icon  = '<i class="wi wi-storm-showers"></i>';
    break;
    case '41': icon  = '<i class="wi wi-snow"></i>';
    break;
    case '42': icon  = '<i class="wi wi-snow"></i>';
    break;
    case '43': icon  = '<i class="wi wi-snow"></i>';
    break;
    case '44': icon  = '<i class="wi wi-cloudy"></i>';
    break;
    case '45': icon  = '<i class="wi wi-lightning"></i>';
    break;
    case '46': icon  = '<i class="wi wi-snow"></i>';
    break;
    case '47': icon  = '<i class="wi wi-thunderstorm"></i>';
    break;
    case '3200': icon  =  '<i class="wi wi-cloud"></i>';
    break;
    default: icon  =  '<i class="wi wi-cloud"></i>';
    break;
  }

  return icon;
};
