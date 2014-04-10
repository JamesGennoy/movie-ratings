chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.method == "getData") {
    sendResponse({
      type: 'title',
      data: window.getSelection().toString()
    });
  } else { 
    sendResponse({});
  }
});