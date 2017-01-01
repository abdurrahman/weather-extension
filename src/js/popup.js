
$(document).ready(function(){

  $(".container").hide();
  // var location = getCurrentLocation();
  // console.log("Location is : " + location);

  getWeather('New York', 'New York');

});

function getWeather(position, city) {
	//var lat = position.coords.latitude;
	//var lon = position.coords.longitude;

	// Forming the query for Yahoo's weather forecasting API with YQL
	// http://developer.yahoo.com/weather/

	var wsql = 'select * from weather.forecast where u="C" and woeid in (select woeid from geo.places(1) where text="' + city + '")',
		weatherYQL = 'https://query.yahooapis.com/v1/public/yql?q='+encodeURIComponent(wsql)+'&format=json&callback=?';

    // Make a weather API request (it is JSONP, so CORS is not an issue):
    $.getJSON(weatherYQL, function(r){
      if(r.query.count == 1){
        // Create the weather items in the #scroller UL

        var item = r.query.results.channel.item.condition;
        var weatherIcon = $(setWeatherIcon(item.code)).attr('title', item.text);

        $(".weather-date").html('<i class="icon ion-calendar"></i> ' + item.date.replace('\d+$','').replace('EET', ''));
        $(".weather-value").html(item.temp + '° C');
        $(".weather-icon").html(weatherIcon[0].outerHTML);
        $(".weather-text").html(item.text);
        $(".weather-location").html('<i class="icon ion-location"></i> ' + position);
        $(".forecast ul").html("");

        for (var i=0; i < r.query.results.channel.item.forecast.length; i++){
          if (i == 0)
            continue;
          if (i == 6)
            break;

          item = r.query.results.channel.item.forecast[i];
          weatherIcon = $(setWeatherIcon(item.code)).attr('title', item.text);
          $(".forecast ul").append("<li><div>" +
            "<span>"+ weatherIcon[0].outerHTML + "</span>" +
            "<span>" + item.day + "</span>" +
            "<span>" + item.low + " / " + item.high + " °C</span>" +
          "</div></li>")
        }
          $(".container").show();
      }
      else {
        $(".container").hide();
        $(".out-of-service").show();
      }
      $(".sk-cube-grid").hide();
    }).done(function(r) {
      console.log(r.query);

    });
};

var getCurrentLocation = function(){
	navigator.geolocation.getCurrentPosition(function(location) {
		var latitude = location.coords.latitude;
		var longitude = location.coords.longitude;
    var locationName = getCityState(latitude, longitude);
    return locationName;
	});
};

var getCityState = function(latitude, longitude){
  var locationUrl = 'https://maps.googleapis.com/maps/api/geocode/json?sensor=true&latlng=' + latitude + ',' + longitude;
  $.get(locationUrl, function(data){
    console.log(data);
    var state, city;
    var result = data.results[0];
    var locationName = 'Unknown location...';
    if (result && result.address_components) {
      for (var i = 0; i < result.address_components.length; i++) {
        var ac = result.address_components[i];
        if (ac.types.indexOf('locality') >= 0) city = ac.long_name;
        if (ac.types.indexOf('administrative_area_level_1') >= 0) state = ac.short_name;
      }
      locationName = (city ? city : '') + (city && state ? ', ' : '') + (state ? state : '');
    }else {
      latitude = 41.0336472;
      longitude = 28.863523;
    }
    console.log(locationName);
    return locationName;
  });
};

function setWeatherIcon(condid) {

  switch(condid) {
    case '0': var icon  = '<i class="wi wi-tornado"></i>';
    break;
    case '1': var icon  = '<i class="wi wi-storm-showers"></i>';
    break;
    case '2': var icon  = '<i class="wi wi-tornado"></i>';
    break;
    case '3': var icon  = '<i class="wi wi-thunderstorm"></i>';
    break;
    case '4': var icon  = '<i class="wi wi-thunderstorm"></i>';
    break;
    case '5': var icon  = '<i class="wi wi-snow"></i>';
    break;
    case '6': var icon  = '<i class="wi wi-rain-mix"></i>';
    break;
    case '7': var icon  = '<i class="wi wi-rain-mix"></i>';
    break;
    case '8': var icon  = '<i class="wi wi-sprinkle"></i>';
    break;
    case '9': var icon  = '<i class="wi wi-sprinkle"></i>';
    break;
    case '10': var icon  = '<i class="wi wi-hail"></i>';
    break;
    case '11': var icon  = '<i class="wi wi-showers"></i>';
    break;
    case '12': var icon  = '<i class="wi wi-showers"></i>';
    break;
    case '13': var icon  = '<i class="wi wi-snow"></i>';
    break;
    case '14': var icon  = '<i class="wi wi-storm-showers"></i>';
    break;
    case '15': var icon  = '<i class="wi wi-snow"></i>';
    break;
    case '16': var icon  = '<i class="wi wi-snow"></i>';
    break;
    case '17': var icon  = '<i class="wi wi-hail"></i>';
    break;
    case '18': var icon  = '<i class="wi wi-hail"></i>';
    break;
    case '19': var icon  = '<i class="wi wi-cloudy-gusts"></i>';
    break;
    case '20': var icon  = '<i class="wi wi-fog"></i>';
    break;
    case '21': var icon  = '<i class="wi wi-fog"></i>';
    break;
    case '22': var icon  = '<i class="wi wi-fog"></i>';
    break;
    case '23': var icon  = '<i class="wi wi-cloudy-gusts"></i>';
    break;
    case '24': var icon  = '<i class="wi wi-cloudy-windy"></i>';
    break;
    case '25': var icon  = '<i class="wi wi-thermometer"></i>';
    break;
    case '26': var icon  = '<i class="wi wi-cloudy"></i>';
    break;
    case '27': var icon  = '<i class="wi wi-night-cloudy"></i>';
    break;
    case '28': var icon  = '<i class="wi wi-day-cloudy"></i>';
    break;
    case '29': var icon  = '<i class="wi wi-night-cloudy"></i>';
    break;
    case '30': var icon  = '<i class="wi wi-day-cloudy"></i>';
    break;
    case '31': var icon  = '<i class="wi wi-night-clear"></i>';
    break;
    case '32': var icon  = '<i class="wi wi-day-sunny"></i>';
    break;
    case '33': var icon  = '<i class="wi wi-night-clear"></i>';
    break;
    case '34': var icon  = '<i class="wi wi-day-sunny-overcast"></i>';
    break;
    case '35': var icon  = '<i class="wi wi-hail"></i>';
    break;
    case '36': var icon  = '<i class="wi wi-day-sunny"></i>';
    break;
    case '37': var icon  = '<i class="wi wi-thunderstorm"></i>';
    break;
    case '38': var icon  = '<i class="wi wi-thunderstorm"></i>';
    break;
    case '39': var icon  = '<i class="wi wi-thunderstorm"></i>';
    break;
    case '40': var icon  = '<i class="wi wi-storm-showers"></i>';
    break;
    case '41': var icon  = '<i class="wi wi-snow"></i>';
    break;
    case '42': var icon  = '<i class="wi wi-snow"></i>';
    break;
    case '43': var icon  = '<i class="wi wi-snow"></i>';
    break;
    case '44': var icon  = '<i class="wi wi-cloudy"></i>';
    break;
    case '45': var icon  = '<i class="wi wi-lightning"></i>';
    break;
    case '46': var icon  = '<i class="wi wi-snow"></i>';
    break;
    case '47': var icon  = '<i class="wi wi-thunderstorm"></i>';
    break;
    case '3200': var icon  =  '<i class="wi wi-cloud"></i>';
    break;
    default: var icon  =  '<i class="wi wi-cloud"></i>';
    break;
  }

  return icon;
};
