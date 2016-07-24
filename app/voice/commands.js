import Spotify from '../music/spotify';

var spotify = new Spotify();

var commands = {
  'play *song': spotify.search
}

export default commands;
