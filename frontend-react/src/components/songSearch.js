import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";

let SongSearch = (props) => {
    let [song, setSong] = useState('');
    let [suggestSongs, setSuggestSongs] = useState(false);
    let [suggestedSongs, setSuggestedSongs] = useState([]);
    
    let songChange = async (e) => {
        if (e.target.value === '') {
            setSong('');
            setSuggestSongs(false);
            setSuggestedSongs([]);
            return;
        }
        setSong(e.target.value);
        // let song = await axios.get('/get-song');
        // console.log(song);
        let songs = await axios.post('/songs', {song: e.target.value});
        setSuggestedSongs(songs.data);
        setSuggestSongs(songs.data.length > 0);
        console.log(suggestedSongs);
    }

    let selectSong = (song) => {
        setSong(song.title + ', ' + song.artist);
        setSuggestedSongs([]);
        setSuggestSongs(false);
        props.passSongUrl(song.title, song.href);
    }

  return (
        <div class="form-group">
          <input
            class="form-control song"
            autocomplete="off"
            placeholder="Search for your song"
            id="song"
            onChange={songChange}
            value={song}
            required
            list="songs-list"
          />
          <ul class="song-display-items rounded-bottom" style={{display: suggestSongs ? 'block' : 'none'}}>
              {suggestedSongs.map((song, ind) => {
                  return (
                      <li key={ind} onClick={() => selectSong(song)}>{song.title}, {song.artist}</li>
                  )
              })}
            
          </ul>
        </div>
  );
};
SongSearch.propTypes = {
    passSongUrl: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
});
export default connect(mapStateToProps)(SongSearch);
