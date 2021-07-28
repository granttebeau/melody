import React, { Component } from "react";
class Navbar extends Component {
  render() {
    return (
      <div className="navbar-fixed">
         <nav class="navbar navbar-expand-lg navbar-light fixed-top">
      <div class="container">
        <a class="navbar-brand logo" href="/">Melody</a>
          <ul class="navbar-nav ml-auto navbar-right">
            <li class="nav-item active">
              <a class="nav-link" href="/"><i class="fas fa-home"></i></a>
              <div class="underline"></div>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/profile/granttebeau"><i class="fas fa-user"></i></a>
              <div class="underline"></div>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/profile/notifications"><i class="fas fa-music"></i></a>
              <div class="underline"></div>
            </li>
            <li class="nav-item form-inline search-form">
              <span class="search-span">
                <input class="form-control rounded m-0 mr-0 mr-md-1" id="search-input" type="search" placeholder="Search users" aria-label="Search"/>
             
                  <ul class="search-display-items rounded-bottom d-none">
                    {/* <a><li class="search-first"></li></a>
                    <a><li class="search-second"></li></a>
                    <a><li class="search-third"></li></a>
                    <a><li class="search-fourth"></li></a>
                    <a><li class="search-fifth"></li></a> */}
                    <a href="/search/" id="search-sixth-link"><li class="search-sixth"><i class="fas fa-search"></i> Search for "<span id="sixth-text"></span>" </li></a>
                </ul>
                
              </span>
              <a id="search-link"><i class="fas fa-search"></i></a>
            </li>
          </ul>
      </div>
      </nav>

      </div>
    );
  }
}
export default Navbar;