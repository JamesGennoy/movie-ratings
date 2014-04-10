var movieTitle = $('h1.title');
var movies = {};
movieFinder.searchMovies(movieTitle.html(), function(data){
  movies = data;
  if (movies.movies.length === 1) {
    movieTitle.after(movieFinder.buildForNetflix(movies.movies[0]));
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
