import { React, Component } from "react";

import {appendScript} from '../js/utils';

export default class Sidetab extends Component {
    
    componentDidMount() {
    }

    render() {
        return (
            <div id="home-screen-content">
                <h3>What your friends are listening to:</h3>
                {/* <ul>
                    <% for (var i = 0; i < popular.length; i++) { %>
                        <li class="popular-post"><%= i + 1 %>. <%= popular[i] %></li>
                    <% } %>
                </ul> */}
            </div>
        );
    }
}
