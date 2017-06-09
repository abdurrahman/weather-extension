
var getCookie = function (name, callback){
    chrome.cookies.get({
      "name": name,
      "url" : "http://developer.chrome.com/extensions/cookies.html",
    }, function (cookie) {
      callback(undefined, cookie && cookie.value)
    });
};

var setCookie = function(name, value, expiration){
    console.log((new Date().getTime()/1000) + expiration);
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
};

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
    var c = Math.round((Number(fahrenheit) - 32.0) * 5.0/9.0) // convert to Celsius
    return c;
}

var getCurrentLocation = function(callback){
    navigator.geolocation.getCurrentPosition(function(location){
      callback(location);
    });
};