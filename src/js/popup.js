
$(document).ready(function(){

  $(".container").hide();
  // navigator.geolocation.getCurrentPosition(success, error);
  //
  // function success(position) {
  //     console.log(position.coords.latitude)
  //     console.log(position.coords.longitude)
  //
  //     var GEOCODING = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + '%2C' + position.coords.longitude + '&language=en';
  //
  //     $.getJSON(GEOCODING).done(function(location) {
  //         console.log(location)
  //     })
  //
  // }

  // function error(err) {
  //     console.log(err)
  // }

  setTimeout(function(){

    $(".sk-cube-grid").hide();
    $(".container").show();

  },5000);

  $.getJSON('https://geoip-db.com/json/geoip.php?jsonp=?')
     .done (function(location)
     {

       var country = location.country_name;
       var state = location.state;
       var city = location.city;
       var postal = location.postal;
       var latitude = location.latitude;
       var longitude = location.longitude;
       var ip = location.IPv4;

       var location = city + ' - ' + state + ', ' + country;

       locationSuccess(location, city);
     });
});

function locationSuccess(position, city) {
	//var lat = position.coords.latitude;
	//var lon = position.coords.longitude;

	// Forming the query for Yahoo's weather forecasting API with YQL
	// http://developer.yahoo.com/weather/

	var wsql = 'select * from weather.forecast where u="C" and woeid in (select woeid from geo.places(1) where text="' + city + '")',
		weatherYQL = 'http://query.yahooapis.com/v1/public/yql?q='+encodeURIComponent(wsql)+'&format=json&callback=?';

    // Make a weather API request (it is JSONP, so CORS is not an issue):
    $.getJSON(weatherYQL, function(r){
      console.log(r.query);
      if(r.query.count == 1){
        // Create the weather items in the #scroller UL

        var item = r.query.results.channel.item.condition;
        $(".weather-date").html('<i class="icon ion-calendar"></i> ' + item.date.replace('\d+$','').replace('EET', ''));
        $(".weather-value").html('<b>' + item.temp + '° C</b>');
        $(".weather-icon").html(setWeatherIcon(item.code));
        $(".weather-text").html(item.text);
        $(".weather-location").html('<i class="icon ion-location"></i> ' + position);

        for (var i=0;i< r.query.results.channel.item.forecast.length;i++){
          if (i == 6) {
            break;
          }
          item = r.query.results.channel.item.forecast[i];
          $(".forecast ul").append('<li>' + item.day + ' <b>' + item.low + ' ° C / '+ item.high +'° C</b><br /><b>' + setWeatherIcon(item.code) + '</b></li>');
        }
      }
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