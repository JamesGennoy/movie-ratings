var imdbID = '';
var movies = {};
var movieTitleElement = $('h1.title');
var title = movieTitleElement.html().trim();
var year = $('span.year').html().trim();
movieFinder.searchForNetflix(title, year, function(data){
    movies = data;
    if (movies && movies.length > 0) {
        movieTitleElement.after(movieFinder.buildForNetflix(movies[0]));
        imdbID = movies[0].imdbID;
    }
});
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getData") {
        sendResponse({
            title: title,
            year: year,
            id: imdbID,
            data: movies
        });
    } else { 
        sendResponse({});
    }
});
