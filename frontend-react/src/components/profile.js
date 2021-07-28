import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect, useDispatch } from "react-redux";
import { logoutUser } from "../actions/authActions";
import { useHistory, useLocation } from "react-router-dom";
import { getUserProfile } from "../actions/profileActions";
import PostForm from './postForm';
import PostList from "./postList";

let Profile = (props) => {
  let history = useHistory();
  let dispatch = useDispatch();
  let location = useLocation();
  useEffect(() => {
    dispatch(getUserProfile(location.pathname.split("/")[2]));
  }, []);
  let onLogoutClick = (e) => {
    e.preventDefault();
    dispatch(logoutUser());
    history.push("/");
  };
  let onEditClick = (e) => {
    e.preventDefault();
  };
  const { profile } = props;
  const { user } = props.auth;

  return (
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-4 text-center p-3">
          <div id="profile">
            <div class="profile-pic-container">
              <img src="/profile/picture" alt={"profile picture for " + user.fullName} class="rounded-circle profile-pic" />
            </div>
            <h1 class="mt-3"> {user.fullName}</h1>
            <h3>@{user.username}</h3>
            <p class="lead">{user.bio}</p>
            <p class="lead">Following: {user.following.length} </p>
            <p class="lead">Followers: {user.followers.length} </p>
            <button
              onClick={onEditClick}
              class="btn btn-primary"
              style={{ marginBottom: "20px" }}
            >
              Edit profile
            </button>{" "}
            <br />
            <button
              onClick={onLogoutClick}
              class="btn btn-primary"
              style={{ color: "white" }}
            >
              Log out
            </button>
          </div>
        </div>
        <div class="col-12 col-lg-6">
          <PostForm/>
          
          {profile.userPosts.length === 0 && <h4 class="text-center my-5">No posts yet...</h4>}
          {profile.userPosts.length > 0 && <PostList posts={profile.userPosts}/>}
            {/* {profile.userPosts.length > 0 && profile.userPosts.map((song, ind) => {
              return (
                <ul className="posts">
                  <li className="post" id={song.id} key={ind}>
                <Post post={song}/>
              </li>
                </ul>
              )
            })} */}
        </div>
      </div>
    </div>
  );
};
Profile.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  userPosts: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});
export default connect(mapStateToProps, { logoutUser })(Profile);
//https://open.spotify.com/embed/track/0b2IVjeD268pYd7VUhmtKI