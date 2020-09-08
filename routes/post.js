var express = require("express")
var router = express.Router({mergeParams: true})

var Post = require("../models/post")
var middleware = require("../middleware/index")
var axios = require("axios")

// gets a post by id, and returns the data
// used for the edit post popup
router.get("/post-info/:id", function(req, res) {
    Post.findById(req.params.id, function(err, post) {
        if (err) console.log(err)
        res.send(post)
    })
})

// gets a post by id and updates it based on the given criteria
router.put("/update-post/:id", function(req, res, next) {
    var content = req.body.content
    var song = req.body.song
    let songLink = req.body.editsonglink
    var id = req.params.id
    if (songLink === "") {
        const options = {
            headers: {
                'Content-Type':'application/x-www-form-urlencoded',
                'Authorization': 'Basic ZjEyMDdhYjNhODcwNDk5MmIyMjZiMTI1ODdhYTdjMDI6NGY3YWMxMWI1NTk5NDFiNmExZmMxMTI4MWQ4NDljZTA',}
          };
        axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', options).then((response) => {
 
            var at = response.data.access_token
            var op = {
                headers: {
                    'Content-Type':'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + at,}
                };
            
        
            var qs = middleware.createQueryString(song)
            axios.get("https://api.spotify.com/v1/search" + qs, op).then((response) => {
                songLink = "https://open.spotify.com/embed/track/" + response.data.tracks.items[0].id
                Post.findById(id, function(err, post) {
                    if (err) console.log(err)
                    post.content = content
                    post.songSearch = song
                    post.song = songLink
                    
                    post.save()
                    res.redirect(req.get('referer'));
                })
            }).catch(function (error) {
                console.log(error)
                return
            })
            }).catch(function (error) {
                console.log(error)
                return
        })

    }
    else {
        Post.findById(id, function(err, post) {
            if (err) console.log(err)
            post.content = content
            post.songSearch = song
            post.song = songLink
            
            post.save()
            res.redirect(req.get('referer'));
        })
    }

})

// creates a new post based on the given criteria
router.post("/new-post", function(req, res) {
    var content = req.body.content
    var song = req.body.song
    let songLink = req.body.songlink
    if (songLink === "") {
        const options = {
            headers: {
                'Content-Type':'application/x-www-form-urlencoded',
                'Authorization': 'Basic ZjEyMDdhYjNhODcwNDk5MmIyMjZiMTI1ODdhYTdjMDI6NGY3YWMxMWI1NTk5NDFiNmExZmMxMTI4MWQ4NDljZTA',}
          };
        axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', options).then((response) => {
 
            var at = response.data.access_token
            var op = {
                headers: {
                    'Content-Type':'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + at,}
                };
            
        
            var qs = middleware.createQueryString(song)
            axios.get("https://api.spotify.com/v1/search" + qs, op).then((response) => {
                songLink = "https://open.spotify.com/embed/track/" + response.data.tracks.items[0].id
                var songName = response.data.tracks.items[0].name
                var post = new Post({
                    content: content,
                    songSearch: song,
                    songTitle: songName,
                    song: songLink,
                    date: Date.now(),
                    author: {
                        id: req.user._id,
                        username: req.user.username,
                        name: req.user.fullName
                    }
                })
                post.save()
                res.redirect(req.get('referer'));
            }).catch(function (error) {
                console.log(error)
                return
            })
            }).catch(function (error) {
                console.log(error)
                return
        })

    }
    else {
        var songName = req.body.song.split(",")[0]
        var post = new Post({
            content: content,
            song: songLink,
            songSearch: song,
            songTitle: songName,
            date: Date.now(),
            author: {
                id: req.user._id,
                username: req.user.username,
                name: req.user.fullName
            }
        })
        post.save()
        res.redirect(req.get('referer'));
    }

})

// finds and deletes a post by id
router.get("/delete-post/:id", function(req, res) {
    Post.findByIdAndDelete(req.params.id, function(err) {
        if (err) {
            console.log(err)
            return res.redirect("/profile")
        }
        res.redirect(req.get('referer'));
    })
})


module.exports = router