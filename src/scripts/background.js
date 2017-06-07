'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

chrome.tabs.onUpdated.addListener(function (tabId) {
  chrome.pageAction.show(tabId);
});

console.log('\'Allo \'Allo! Event Page for Page Action');

//chrome.app.runtime.onLaunched.addListener(function(){
  // chrome.app.window.create('../html/popup.html', {
  //   'outerBounds': {
  //     'width': 500,
  //     'height': 250
  //   }
  // });
//});
