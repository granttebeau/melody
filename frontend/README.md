# Melody

<img src="./public/images/logo.png" width="50%">

A music-based social media app built using the Spotify API. See what your friends are listening to, post your favorite songs from your favorite artists, and find new music today!

Still currently in development.

## Motivation

I felt like it was somewhat of a taboo to post music on your Instagram/Snap story, but I wanted a way to both post my music and find new songs to listen to. Thus, Melody was created. 


## Installation

Clone the application and run ``` npm install ``` in the project directory.

You'll have to make sure that the Mongo database is correctly set up in the app.js file- to do so, make sure that the url variable for the Mongo database on line 20 is not commented out and the variable for the local database is, like so: 

``` 
19: // var url = "mongodb://localhost/melody"
20: var url = "mongodb+srv://public:0vRokIdC25tC532f@melody.1dhd4.mongodb.net/Melody?retryWrites=true&w=majority"
```

Similar with the uri parameter in the store variable on line 32: 

``` 
32: const store = new MongoDBStore({
33:     // uri: "mongodb://localhost/melody",
34:     uri: "mongodb+srv://public:0vRokIdC25tC532f@melody.1dhd4.mongodb.net/Melody?retryWrites=true&w=majority",
35:     collection: 'users'
36: });
```

To start the application, run ``` node app.js ```, and go to [http://localhost:8000](http://localhost:8000/). The app is connected to a Mongo database, so feel free to sign up and test the app out! To start out, search my username (@granttebeau) in the search bar and give me a follow!

## How to Use

The application flow is similar to that of a normal social media application. To select a song to post, type in the name of the song and either select an option from the dropdown menu or click post and the song will be on your post.
The navbar consists of links for the home feed, your profile, notifications (the music notes- still in development), and a search bar.

## Tech/framework used

<b>Built with</b>
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [Node.js](https://github.com/nodejs/node)
- [Express](https://github.com/expressjs/express)
- [MongoDB](https://www.npmjs.com/package/mongoose)


## License 
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

