var movieTitle = $('h1.title');
var year = $('span.year').html();
var movies = {};
movieFinder.searchForNetflix(movieTitle.html(), year, function(data){
  movies = data;
  if (movies && movies.length > 0) {
    movieTitle.after(movieFinder.buildForNetflix(movies[0]));
  }
});
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.method == "getData") {
    sendResponse({
      type: 'movies',
      data: movies
    });
  } else { 
    sendResponse({});
  }
});
