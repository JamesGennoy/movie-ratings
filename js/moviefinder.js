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
                console.log(resp);
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
                console.log(resp);
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
                console.log(resp);
                callback(resp);
            }
        }
        xhr.send(null);
    }

    return {
        buildForNetflix: function(movie) {
            return '<p>Rotten Tomatoes: ' + movie.tomatoMeter + '%</p>' +
                '<p>IMDB: ' + movie.imdbRating + '</p>' +
                '<p>Metacritic: ' + movie.Metascore + '</p>';
        },
        buildForPopup: function(movies) {
            var contents = '';
            for (var i = 0; i < movies.length; i++) {
                contents = contents.concat('<p>' + movies[i].Title + ' (' + movies[i].Year + ') - ' + movies[i].tomatoMeter + '% - ' + movies[i].imdbRating + ' - ' + movies[i].Metascore + '</p>');
            }
            return contents;
        },
        searchForNetflix: function(title, year, callback) {
            title = title.trim();
            _findMovieByTitle(title, year, function(data) {
                if (data && data.Response) {
                    var _movies = [];
                    _movies.push(data);
                    callback(_movies);
                } else {
                    _searchMovies(title, year, function(data){
                        var _movies = [];
                        for (var i = 0; i < data.Search.length; i++) {
                            _getMovieDetails(data.Search[i].imdbID, function(data){
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
            title = title.trim();
            _findMovieByTitle(title, '', function(data) {
                if (data && data.Response) {
                    var _movies = [];
                    _movies.push(data);
                    callback(_movies);
                } else {
                    _searchMovies(title, '', function(data){
                        var _movies = [];
                        for (var i = 0; i < data.Search.length; i++) {
                            _getMovieDetails(data.Search[i].imdbID, function(data){
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
        }        
    }
}());
