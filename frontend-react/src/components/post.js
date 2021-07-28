import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

TimeAgo.addDefaultLocale(en)

// Create formatter (English).
const timeAgo = new TimeAgo('en-US')

let Post = (props) => {
  console.log(props);
  let { post } = props;
       // {/* <a href={"/profile/" + post.author.username}><img class="float-left profile-pic-tile" src={"/profile/" + post.author.id + "/picture"} alt="profile pic"/></a> */}
    console.log(post);
  return (
    <div>
      <p class="lead" style={{margin: '2px 0 6px 4px'}}>
        <a href={"/profile/" + post.author.username} class="name">
          <b>{post.author.name}</b>
        </a>
        <a href={"/profile/" + post.author.username} class="username">
          @{post.author.username}
        </a>
        <span class="date" style={{fontSize: '.7em'}}>
          {timeAgo.format(post.date)}
        </span>
      </p>

      <p class="post-text-content">
        <span class="post-content">{post.content}</span>
      </p>
      <div class="spotify-embeds">
        <div class="spotify-embed">
          <iframe
            title={"Spotify Embed: " + post.song}
            class="rounded song-tile"
            src={post.song}
            frameBorder="0"
            allowtransparency="true"
            allow="encrypted-media"
          ></iframe>
        </div>
      </div>
    </div>
  );
};
Post.propTypes = {
  post: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({});
export default connect(mapStateToProps)(Post);
