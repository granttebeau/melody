import { React, Component } from "react";

import {appendScript} from '../js/utils';

export default class Navbar extends Component {
    
    componentDidMount() {
        appendScript('/js/search.js')
    }

    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-light fixed-top">
                <div className="container">
                    <a className="navbar-brand logo" href="/home">Melody</a>
                    <ul className="navbar-nav ml-auto navbar-right">
                        <li className="nav-item active">
                        <a className="nav-link" href="/home"><i className="fas fa-home"></i></a>
                        <div className="underline"></div>
                        </li>
                        <li className="nav-item">
                        <a className="nav-link" href="/profile"><i className="fas fa-user"></i></a>
                        <div className="underline"></div>
                        </li>
                        <li className="nav-item">
                        <a className="nav-link" href="/profile/notifications"><i className="fas fa-music"></i></a>
                        <div className="underline"></div>
                        </li>
                        <li className="nav-item form-inline search-form">
                        <span className="search-span">
                            <input className="form-control rounded m-0 mr-0 mr-md-1" id="search-input" type="search" placeholder="Search users" aria-label="Search" />
                        
                            <ul className="search-display-items rounded-bottom d-none">
                                <a><li className="search-first"></li></a>
                                <a><li className="search-second"></li></a>
                                <a><li className="search-third"></li></a>
                                <a><li className="search-fourth"></li></a>
                                <a><li className="search-fifth"></li></a>
                                <a href="/search/" id="search-sixth-link"><li className="search-sixth"><i className="fas fa-search"></i> Search for "<span id="sixth-text"></span>" </li></a>
                            </ul>
                            
                        </span>
                        <a id="search-link"><i className="fas fa-search"></i></a>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}
