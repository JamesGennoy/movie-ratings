var movieFinder = (function() {

    function _findMovieById(imdbID, callback) {
        var url = 'http://www.omdbapi.com/?' +
            'i=' + imdbID +
            '&tomatoes=true';
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
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
        xhr.send(null);
    }

    function _searchMovies(title, year, callback) {
        var url = 'http://www.omdbapi.com/?' +
            's=' + encodeURIComponent(title) +
            '&y=' + year;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
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
        xhr.send(null);
    }
    
    function _findMovieByTitle(title, year, callback) {
        var url = 'http://www.omdbapi.com/?' +
            't=' + encodeURIComponent(title) +
            '&y=' + year +
            '&tomatoes=true';
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
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
        };
        xhr.send(null);
    }

    return {
        buildForNetflix: function(movie) {
            var c = '';
            if (movie.tomatoMeter >= 60) { 
                c = c.concat('<p class="rotten-fresh">' + movie.tomatoMeter + '%</p>');
            } else {
                c = c.concat('<p class="rotten-splat">' + movie.tomatoMeter + '%</p>');
            }
            c = c.concat('<p class="imdb">' + movie.imdbRating + '</p>');
            c = c.concat('<p class="metacritic">' + movie.Metascore + '</p>');
            return c;
        },
        buildForPopup: function(movies) {
            var c = '';
            var movie = {};
            for (var i = 0; i < movies.length; i++) {
                movie = movies[i];
                c = c.concat('<div class="popup-item">');
                c = c.concat('<div class="popup-item-left">');
                if (movie.Poster && movie.Poster != 'N/A') {
                    c = c.concat('<img class="movie-poster" src="' + movie.Poster + '"></img>');
                } else {
                    c = c.concat('<img class="movie-poster" src="defaultPoster.png"></img>');
                }
                c = c.concat('</div><div class="popup-item-right">');
                c = c.concat('<h2><a href="http://www.imdb.com/title/' + movie.imdbID + '" target="_blank">' + movie.Title + '</a> (' + movie.Year + ')</h2>');
                if (movie.tomatoMeter && movie.tomatoMeter != 'N/A') {
                    if (movie.tomatoMeter >= 60) { 
                        c = c.concat('<span class="rotten-fresh">' + movie.tomatoMeter + '%</span>');
                    } else {
                        c = c.concat('<span class="rotten-splat">' + movie.tomatoMeter + '%</span>');
                    }
                }
                if (movie.imdbRating && movie.imdbRating != 'N/A') {
                    c = c.concat('<span class="imdb">' + movie.imdbRating + '</span>');
                }
                if (movie.Metascore && movie.Metascore != 'N/A') {
                    c = c.concat('<span class="metacritic">' + movie.Metascore + '</span>');
                }
                c = c.concat('</div>');
                c = c.concat('</div>');
            }
            return c;
        },
        searchForNetflix: function(title, year, callback) {
            _findMovieByTitle(title, year, function(data) {
                if (data && data.Response) {
                    var _movies = [];
                    _movies.push(data);
                    callback(_movies);
                } else {
                    _searchMovies(title, year, function(data){
                        var _movies = [];
                        for (var i = 0; i < data.Search.length; i++) {
                            _findMovieById(data.Search[i].imdbID, function(data){
                                if (data.Year == year && data.Title == title) {
                                    _movies.splice(0, 0, data);
                                } else {
                                    _movies.push(data);
                                }
                            });
                        }
                        callback(_movies);
                    });
                }
            });
        },
        searchForPopup: function(title, callback) {
            _findMovieByTitle(title, '', function(data) {
                if (data && data.Response) {
                    var _movies = [];
                    _movies.push(data);
                    callback(_movies);
                } else {
                    _searchMovies(title, '', function(data){
                        var _movies = [];
                        if (data && data.Search && data.Search.length > 0) {
                            _findMovieById(data.Search[0].imdbID, function(data){
                                _movies.push(data);
                            });
                        }
                        callback(_movies);
                    });
                }
            });
        },
        searchMoreMovies: function(title, year, id, callback) {
            _searchMovies(title, year, function(data){
                var _movies = [];
                for (var i = 0; i < data.Search.length; i++) {
                    if (data.Search[i].imdbID != id) {
                        _findMovieById(data.Search[i].imdbID, function(data){
                            _movies.push(data);
                        });
                    }
                }
                callback(_movies);
            });
        }
    }
}());
