chrome.app.runtime.onLaunched.addListener(function(){
  chrome.app.window.create('../html/popup.html', {
    'outerBounds': {
      'width': 500,
      'height': 250
    }
  });
});
// chrome.browserAction.setBadgeText({text: String(15)});
// chrome.browserAction.onClicked.addListener(function(tab){
	// chrome.tabs.create({ url: chrome.extension.getUrl('../html/popup.html')});
// });