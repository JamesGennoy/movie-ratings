var movieFinder = (function() {

    function _searchMovies(title, callback) {
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
                console.log(resp);
                callback(resp);
            }
        }
        xhr.send();
    }

    return {
        buildForNetflix: function(movie) {
            return '<p>Rotten Tomatoes: ' + movie.ratings.critics_score + '%</p>';
        },
        buildForPopup: function(movies) {
            var contents = '';
            for (var i = 0; i < movies.length; i++) {
                contents = contents.concat('<p>' + movies[i].title + ' (' + movies[i].year + ') - ' + movies[i].ratings.critics_score + '%</p>');
            }
            return contents;
        },
        searchForNetflix: function(title, year, callback) {
            title = title.trim();
            _searchMovies(title, function(data) {
                var _movies = [];
                for (var i = 0; i < data.movies.length; i++) {
                    if (data.movies[i].year == year && data.movies[i].title == title) {
                        _movies.splice(0, 0, data.movies[i]);
                    } else {
                        _movies.push(data.movies[i]);
                    }
                }
                callback(_movies);
            });
        },
        searchForPopup: function(title, callback) {
            title = title.trim();
            _searchMovies(title, function(data) {
                callback(data.movies);
            });
        }        
    }
}());
