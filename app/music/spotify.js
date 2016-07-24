import $ from 'jquery'


var Spotify = function() {}

Spotify.prototype.search = function(song){
  $.ajax({
    url: 'https://api.spotify.com/v1/search',
    data: {
      q: song,
      type: 'playlist,artist,track'
    },
    success: function(data) {
      var audio = new Audio(data.tracks.items[0].preview_url);
      audio.play();
    },
    error: function(data) {
      console.log('Error searching for spotify song: ', data);
    }
  })
};



export default Spotify;
