import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect, useDispatch } from "react-redux";
import PostForm from './postForm';
import { getHomePage } from "../actions/homeActions";
import PostList from "./postList";


let Home = (props) => {
    const {home} = props.home;
    const dispatch = useDispatch();
    useEffect(() => {
      dispatch(getHomePage());
    }, [])

    console.log(home);
    return (
      <div class="container">
        <div class="row justify-content-center">
            <div class="col-12 col-lg-4 mb-5">
            <div id="home-screen-content">
    <h3>What your friends are listening to:</h3>
      <ul>
        {!home.popular && <h4 className="text-center my-5">loading...</h4>}
        {!!home.popular> 0 && home.popular.map((song, ind) =><li className="popular-post" key={ind}>{ind + 1}, {song}</li> )}

      </ul>
  </div>
            </div>
            <div class="col-12 col-lg-6">
                <PostForm />
                {/* <PostList posts={home}/> */}
                {home.homePagePosts.length === 0 && <h4 class="text-center my-5">No posts yet...</h4>}
          
                {home.homePagePosts.length > 0 && <PostList posts={home.homePagePosts} /> }
            </div>
        </div>
    </div>
    );
}
Home.propTypes = {
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  home: state
});
export default connect(mapStateToProps)(Home);
