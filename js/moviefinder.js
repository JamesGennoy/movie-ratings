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
            var contents = '';
            if (movie.tomatoMeter >= 60) { 
                contents = contents.concat('<p class="rotten-fresh">' + movie.tomatoMeter + '%</p>');
            } else {
                contents = contents.concat('<p class="rotten-splat">' + movie.tomatoMeter + '%</p>');
            }
            contents = contents.concat('<p class="imdb">' + movie.imdbRating + '</p>');
            contents = contents.concat('<p class="metacritic">' + movie.Metascore + '</p>');
            return contents;
        },
        buildForPopup: function(movies) {
            var contents = '';
            for (var i = 0; i < movies.length; i++) {var movies = {};
                contents = contents.concat('<p>' + movies[i].Title + ' (' + movies[i].Year + ') - ' + movies[i].tomatoMeter + '% - ' + movies[i].imdbRating + ' - ' + movies[i].Metascore + '</p>');
            }
            return contents;
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
