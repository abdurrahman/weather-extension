'use strict';


$(function() {
   $(".container").hide();

  //  $.getJSON('/config.json', function(res){
  //     console.log(res)
  //  });
   getCurrentLocation(function(position) {
     if (!position) throw err

     if (position) {
      // console.log(position.coords);       
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;

      getLocationName(lat, lon, function(cityName){
        console.log(cityName); 
        var coords = lat + "," + lon;
        weatherExtension.getWeather(coords, cityName);
      })
     }
   })

  // setTimeout(function(){
  //   $(".sk-cube-grid").hide();
  //   // $(".container").show();
  //   $(".out-of-service").show();
  // },3000);

});

var weatherExtension = (function(){

  var getWeatherIcon = function (iconText){
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

  var setWeatherIcon = function (condid) {
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

  var prepareDOM = function(result) {
    var currentWeather = result.currently;
    var weatherIcon = $(getWeatherIcon(currentWeather.icon)).attr('title', currentWeather.summary);
    // console.log(weatherIcon[0].outerHTML);
    var currentDate = convertDateFromTimestamp(currentWeather.time);
    
    var units = localStorage._units;

    $(".weather-date").html('<i class="icon ion-calendar"></i> ' + currentDate.toDateString());

    var weatherValue = "";
    if(units && units == "c")
      weatherValue = celsiusFromFahrenheit(currentWeather.temperature) + '° C';
    else
      weatherValue = currentWeather.temperature + '° F';

    $(".weather-value").html(weatherValue);
    $(".weather-icon").html(weatherIcon[0].outerHTML);
    $(".weather-text").html(currentWeather.summary);
    $(".forecast ul").html("");
    
    var forecastWeathers = result.daily.data;
    if(units && units == "c")
      forecastWeathers.map(function(temp,index){
        temp.temperatureMin = Math.round((Number(temp.temperatureMin) - 32.0) * 5.0/9.0);
        temp.temperatureMax = Math.round((Number(temp.temperatureMax) - 32.0) * 5.0/9.0);
      })
   
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
        "<span>" + forecastWeather.temperatureMin + " / " + forecastWeather.temperatureMax + " °C</span>" +
      "</div></li>")
    }
  };

  var getWeather = function (coords, locationName) {

    $.getJSON('/config.json', function(config){
      var forecastUrl = config.weatherApi + config.apiKey + "/" + coords + "?lang=tr"

      getWeatherFromApi(config.weatherApi + config.apiKey, coords,"tr","", function(result){
        if (!result) throw err

        if(result){
          //setCookie("forecast", JSON.stringify(result), 3600);
          //setCookie("forecastCurrently", JSON.stringify(result.currently), 3600);
          //setCookie("forecastDaily", JSON.stringify(result.daily.data), 3600);
          $(".weather-location").html('<i class="icon ion-location"></i> ' + locationName);
          prepareDOM(result);
          $(".sk-cube-grid").hide();
          $(".container").show();
        }
      });
      
        // $.ajax({
        //   type: "GET",
        //   url: forecastUrl,
        //   contentType: "application/json; charset=utf-8",
        //   dataType: "json",
        //   beforeSend: function(){
        //     $(".sk-cube-grid").show();
        //   },
        //   success: function(result){
        //     console.log(result);
            
        //     $(".weather-location").html('<i class="icon ion-location"></i> ' + locationName);
        //     prepareDOM(result);
        //   },
        //   complete: function(){
        //     $(".sk-cube-grid").hide();
        //     $(".container").show();
        //   }
        // });

     });
  };

  return {
    getWeather: getWeather
  }
})();
