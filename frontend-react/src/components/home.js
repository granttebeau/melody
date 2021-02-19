import { React, Component } from "react";

import {appendScript} from '../js/utils';
import PostForm from "./postform";

import Sidetab from './sidetab';

import axios from 'axios';

export default class Home extends Component {

    state = {
        posts: [],
        popular: []
    }
    
    componentDidMount() {
        appendScript('/js/homepage.js');
        appendScript('https://unpkg.com/axios/dist/axios.min.js');
        appendScript('/js/spotify.js');
        appendScript('/js/script.js');
        this.getHomeInfo();
    }

    getHomeInfo() {
        const url = 'http://localhost:3000/home';
        console.log(url);
        axios.get(url)
            .then(res => {
                console.log(res);
            })
    }

    render() {
        return (
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-12 col-lg-4 mb-5">
                        <Sidetab/>
                        {/* <%- include("partials/side-tab", {popular: popular}) %> */}
                    </div>
                    <div class="col-12 col-lg-6">
                        <PostForm />
                        {/* <%- include("partials/post-form") %> */}
                        {/* <%- include("partials/post-list", {post: posts, user: user}) %> */}
                    </div>
                </div>
            </div>
        );
    }
}
