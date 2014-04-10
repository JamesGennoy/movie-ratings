var movieFinder = (function() {
  
  function _constructMovieDiv (movie) {
    return '<p>' + movie.title + ' ('+ movie.year + ') - ' + movie.ratings.critics_score + '%</p>';
  };
  return {
    buildForNetflix: function(movie) {
      return '<p>Rotten Tomatoes: ' + movie.ratings.critics_score + '%</p>';
    },
    searchMovies: function(title, callback) {
      var url = 'http://api.rottentomatoes.com/api/public/v1.0/movies.json?' +
        'apikey=8yufrh8fdusxj9k5yqxqhafs&' +
        'q=' + encodeURIComponent(title) + '&' +
        'page_limit=10&' +
        'page=1';
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          var resp;
          try {
            resp = JSON.parse(xhr.responseText);
          } catch (e) {
            resp = '';
          }
          callback(resp);
        }
      }
      xhr.send();
    },
    showMovies: function(d) {
      var movies = d.movies;
      for (var i = 0; i < movies.length; i++) {
        $('#contents').append(_constructMovieDiv(movies[i]));
      }
    }
  }
}());