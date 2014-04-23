chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getData") {
        sendResponse({
            title: window.getSelection().toString().trim()
        });
    } else { 
        sendResponse({});
    }
});