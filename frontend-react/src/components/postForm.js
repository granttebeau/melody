import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect, useDispatch } from "react-redux";
import SongSearch from "./songSearch";
import axios from "axios";
import { getUserProfile } from "../actions/profileActions";
import { useLocation } from "react-router-dom";

let PostForm = (props) => {
    let [songDescription, setSongDescription] = useState('');
    let [songUrl, setSongUrl] = useState('');
    let [songTitle, setSongTitle] = useState('');
    let dispatch = useDispatch();
    let location = useLocation();
    let songDescriptionChange = e => {
        setSongDescription(e.target.value);
    }

    let postSong = async (e) => {
        e.preventDefault();
        let songInfo = {
          content: songDescription,
          song: songTitle,
          songUrl: songUrl
        }
        await axios.post('/new-post', songInfo);
        dispatch(getUserProfile(location.pathname.split("/")[2]));
    }

    let passSongUrl = (title, url) => {
      setSongUrl(url);
      setSongTitle(title);
    }

  return (
    <div>
      <form onSubmit={postSong} class="post-form">
        <div class="form-group">
          <input
            class="form-control"
            type="text"
            placeholder="What song's on your mind?"
            id="songDescription"
            onChange={songDescriptionChange}
            value={songDescription}
            required
          />
        </div>
        <SongSearch passSongUrl={passSongUrl}/>
        <input type="hidden" name="songlink" value="" required />
        <p class="lead error-message display-none">
          Must select a song from the dropdown menu
        </p>
        <div class="form-group">
          <input type="submit" onClick={postSong} class="btn btn-primary btn-block" />
        </div>
      </form>
    </div>
  );
};
PostForm.propTypes = {
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps)(PostForm);
