var express = require("express");
var router = express.Router({ mergeParams: true });

var Post = require("../models/post");
var User = require("../models/user");
var middleware = require("../middleware/index");
var axios = require("axios");


// gets a post by id, and returns the data
// used for the edit post popup
router.get("/post-info/:id", function (req, res) {
  Post.findById(req.params.id, function (err, post) {
    if (err) return res.status(400).send(err);
    return res.status(200).send(post);
  });
});

// gets a post by id and displays it
router.get("/post/:id", function (req, res) {
  Post.findById(req.params.id, function (err, post) {
    if (err) return res.status(400).send(err);
    User.findById(req.user._id, function (err, user) {
      if (err) return res.status(400).send(err);
      var following = user.following.map((item) => item.username);
      following.push(user.username);
      Post.find(
        { "author.username": { $in: following } },
        function (err, posts) {
          if (err) return res.status(400).send(err);
          var songs = 0;
          var popular = posts.map((post) => post.songTitle);
          var popularFive = [];
          let song = 0;
          while (songs < 5) {
            song = middleware.mode(popular);
            if (song) {
              popularFive.push(song);
            }
            popular = popular.filter((s) => s !== song);
            if (popular.length === 0) {
              songs = 5;
            }
            songs++;
          }
          return res
            .status(200)
            .send({ post: post, popular: popularFive, user: user });
        }
      );
    });
  });
});

// gets a post by id and updates it based on the given criteria
router.put("/update-post/:id", function (req, res, next) {
  var content = req.body.content;
  var song = req.body.song;
  let songLink = req.body.editsonglink;
  var id = req.params.id;
  if (songLink === "") {
    const options = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic ZjEyMDdhYjNhODcwNDk5MmIyMjZiMTI1ODdhYTdjMDI6NGY3YWMxMWI1NTk5NDFiNmExZmMxMTI4MWQ4NDljZTA",
      },
    };
    axios
      .post(
        "https://accounts.spotify.com/api/token",
        "grant_type=client_credentials",
        options
      )
      .then((response) => {
        var at = response.data.access_token;
        var op = {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Bearer " + at,
          },
        };

        var qs = middleware.createQueryString(song);
        axios
          .get("https://api.spotify.com/v1/search" + qs, op)
          .then((response) => {
            songLink =
              "https://open.spotify.com/embed/track/" +
              response.data.tracks.items[0].id;
            Post.findById(id, function (err, post) {
              if (err) return res.status(400).send(err);
              post.content = content;
              post.songSearch = song;
              post.song = songLink;

              post.save();
              return res.status(200).send({ success: "post updated" });
            });
          })
          .catch(function (err) {
            return res.status(400).send(err);
          });
      })
      .catch(function (err) {
        return res.status(400).send(err);
      });
  } else {
    Post.findById(id, function (err, post) {
      if (err) return res.status(400).send(err);
      post.content = content;
      post.songSearch = song;
      post.song = songLink;

      post.save();
      return res.status(200).send({ success: "post updated" });
    });
  }
});

let createQueryString = (song) => {
    var songArr = song.split("")
    var str = ""
    if (song.length == 0) {
      return ""
    }
    songArr.forEach(letter => {
      if (letter === " ") {
        str += "+"
      }
      else if (letter === '"') {
        str += "%22"
      }
      else if (letter === "'") {
        str += "%27"
      }
      else {
        str += letter
      }
    });
    return "?q=" + str + "&type=track"
  }

router.post("/songs", async (req, res) => {
  const tokenOptions = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic ZjEyMDdhYjNhODcwNDk5MmIyMjZiMTI1ODdhYTdjMDI6NGY3YWMxMWI1NTk5NDFiNmExZmMxMTI4MWQ4NDljZTA",
    },
  };
  let token = await axios.post(
    "https://accounts.spotify.com/api/token",
    "grant_type=client_credentials",
    tokenOptions
  );
  const apiOptions = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Bearer " + token.data.access_token,
    },
  };
  const queryString = createQueryString(req.body.song);

  let songs = await axios.get("https://api.spotify.com/v1/search" + queryString, apiOptions);

  let tracks = songs.data.tracks.items.splice(0, 5).map((track) => {
      return {
        artist: track.artists[0].name, 
        title: track.name,
        href: track.external_urls.spotify
      }
  })
  res.status(200).send(tracks);
});

// creates a new post based on the given criteria
router.post("/new-post", function (req, res) {
  var content = req.body.content;
  var song = req.body.song;
  let songLink = req.body.songUrl;
  if (songLink === "") {
    const options = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic ZjEyMDdhYjNhODcwNDk5MmIyMjZiMTI1ODdhYTdjMDI6NGY3YWMxMWI1NTk5NDFiNmExZmMxMTI4MWQ4NDljZTA",
      },
    };
    axios
      .post(
        "https://accounts.spotify.com/api/token",
        "grant_type=client_credentials",
        options
      )
      .then((response) => {
        var at = response.data.access_token;
        var op = {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Bearer " + at,
          },
        };

        var qs = middleware.createQueryString(song);
        axios
          .get("https://api.spotify.com/v1/search" + qs, op)
          .then((response) => {
            songLink =
              "https://open.spotify.com/embed/track/" +
              response.data.tracks.items[0].id;
            var songName = response.data.tracks.items[0].name;
            var post = new Post({
              content: content,
              songSearch: song,
              songTitle: songName,
              song: songLink,
              date: Date.now(),
              author: {
                id: req.user._id,
                username: req.user.username,
                name: req.user.fullName,
              },
            });
            post.save();
            return res.status(200).send({ success: "created post" });
          })
          .catch(function (err) {
            return res.status(400).send(err);
          });
      })
      .catch(function (err) {
        return res.status(400).send(err);
      });
  } else {
    var songList = req.body.song.split(")");
    let songName = "";
    songList.length === 1
      ? (songName = songList[0])
      : (songName = songList[0] + ")");
    if (songName.split(",").length === 2) {
      songName = songName.split(",")[0];
    }

    let embedSongLink = songLink.split('.com');
    embedSongLink = embedSongLink[0] + '.com/embed' + embedSongLink[1];
    var post = new Post({
      content: content,
      song: embedSongLink,
      songSearch: song,
      songTitle: songName,
      date: Date.now(),
      author: {
        id: req.user.id,
        username: req.user.username,
        name: req.user.fullName,
      },
    });
    post.save();
    return res.status(200).send({ success: "created post" });
  }
});

// finds and deletes a post by id
router.get("/delete-post/:id", function (req, res) {
  Post.findByIdAndDelete(req.params.id, function (err) {
    if (err) {
      return res.status(400).send(err);
    }
    return res.status(200).send({ success: "post deleted" });
  });
});

module.exports = router;
