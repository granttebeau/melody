import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Post from "./post";

let PostList = (props) => {
  return (
    <div>
      {props.posts.map((song, ind) => {
        return (
          <ul className="posts">
            <li className="post" id={song.id} key={ind}>
              <Post post={song} />
            </li>
          </ul>
        );
      })}
    </div>
  );
};
PostList.propTypes = {
  posts: PropTypes.array.isRequired,
};
const mapStateToProps = (state) => ({});
export default connect(mapStateToProps)(PostList);
