function _buildPopup(movies, title, year, id) {
    $('#waiting').hide();
    $('#contents').append(movieFinder.buildForPopup(movies));
    $('#searchMore').click(function(){
        $('#searchMore').hide();
        $('#waiting').show();
        movieFinder.searchMoreMovies(title, year, id, function(data){
            $('#contents').append(movieFinder.buildForPopup(data));
            $('#waiting').hide();
        });
    });
    $('#searchMore').show();
}

$(document).ready(function() {
    chrome.tabs.query({active:true, windowId: chrome.windows.WINDOW_ID_CURRENT}, function(tab) {
        chrome.tabs.sendMessage(tab[0].id, {method: "getData"}, function(response) {
            if (response !== undefined) {
                if (response.data !== undefined) {
                    _buildPopup(response.data, response.title, response.year, response.id);
                } else {
                    movieFinder.searchForPopup(response.title, function(data){
                        _buildPopup(data, response.title, '', data.imdbId);
                    });
                }
            }
        });
    });
});
