chrome.app.runtime.onLaunched.addListener(function(){
  chrome.app.window.create('../html/popup.html', {
    'outerBounds': {
      'width': 400,
      'height': 500
    }
  });
});
