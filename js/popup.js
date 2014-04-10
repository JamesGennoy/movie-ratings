$(document).ready(function() {
  chrome.tabs.query({active:true, windowId: chrome.windows.WINDOW_ID_CURRENT}, function(tab) {
    chrome.tabs.sendMessage(tab[0].id, {method: "getData"}, function(response) {
      if (response !== undefined) {
        if (response.type === 'title') {
          movieFinder.searchMovies(response.data, function(data){
            movieFinder.showMovies(data);
          });
        } else if (response.type === 'movies'){
          movieFinder.showMovies(response.data);
        }
      }
    });
  });
});
