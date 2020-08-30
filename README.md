# Melody

<img src="./public/images/logo.png" width="50%">

A music-based social media app built using the Spotify API. See what your friends are listening to, post your favorite songs from your favorite artists, and find new music today!

Still currently in development.

## Motivation

I felt like it was somewhat of a taboo to post music on your Instagram/Snap story, but I wanted a way to both post my music and find new songs to listen to. Thus, Melody was created. 


## Installation

Clone the application and run ``` npm install ``` in the project directory.

You'll have to make sure that the Mongo database is correctly set up in the app- to do so, make sure that the url variable on line 20 is set to the public database, not the local database, like so: 

``` var url = "mongodb+srv://public:0vRokIdC25tC532f@melody.1dhd4.mongodb.net/Melody?retryWrites=true&w=majority" ```

Similar with the uri parameter in the store variable on line 32: 

``` 
const store = new MongoDBStore({
    // uri: "mongodb://localhost/melody",
    uri: "mongodb+srv://public:0vRokIdC25tC532f@melody.1dhd4.mongodb.net/Melody?retryWrites=true&w=majority",
    collection: 'users'
});
```

To start the application, run ``` node app.js ```, and go to [http://localhost:8000](http://localhost:8000/). The app is connected to a Mongo database, so feel free to sign up and test the app out! To start out, search my username (@granttebeau) in the search bar and give me a follow!

## How to Use

The application flow is similar to that of a normal social media application. To select a song to post, type in the name of the song and either select an option from the dropdown menu or click post and the song will be on your post.
The navbar consists of links for the home feed, your profile, notifications (the music notes- still in development), and a search bar (still in development).

## Tech/framework used

<b>Built with</b>
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [Node.js](https://github.com/nodejs/node)
- [Express](https://github.com/expressjs/express)
- [MongoDB with Mongoose](https://www.npmjs.com/package/mongoose)
- [Axios](https://www.npmjs.com/package/axios)


## License 
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

