$(document).ready(function() {
  chrome.tabs.query({active:true, windowId: chrome.windows.WINDOW_ID_CURRENT}, function(tab) {
    chrome.tabs.sendMessage(tab[0].id, {method: "getData"}, function(response) {
      if (response !== undefined) {
        if (response.type === 'title') {
          movieFinder.searchForPopup(response.data, function(data){
            $('#contents').append(movieFinder.buildForPopup(data));
          });
        } else if (response.type === 'movies'){
          $('#contents').append(movieFinder.buildForPopup(response.data));
        }
      }
    });
  });
});
