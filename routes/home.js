var express = require("express")
var router = express.Router({mergeParams: true})

var User = require("../models/user")
var Post = require("../models/post")
var middleware = require("../middleware/index")

// renders the home page with posts in chronological order
router.get("/home", middleware.isLoggedIn, function(req, res) {
    User.findById(req.user._id, function(err, user) {
        if (err) return next(err);
        var following = user.following.map(item => item.username)
        following.push(user.username)
        Post.find({"author.username": {$in : following}}, function(err, posts) {
            if (err) console.log(err);
            var songs = 0;
            var popular = posts.map(post => post.songTitle)
            var popularFive = []
            let song = 0
            while (songs < 5) {
                song = middleware.mode(popular)
                if (song) {
                    popularFive.push(song)
                }
                popular = popular.filter(s => s !== song)
                if (popular.length === 0) {
                    songs = 5
                }
                songs ++
            }
            res.render("home", {posts: posts, popular: popularFive})
        })
    })
})

// searches for users by username, and sends the list
router.post('/search', async function(req, res, next) {
    var text = req.body.text
    User.find({'username':  { $regex: text, $options: "i" }}, function(err, users) {
        if (err) return next(err);
        var content = {
            users: users,
            id: req.user._id
        }
        res.send(content)
    })
})

// searches for users by username, and sends the list
router.post('/search-page/user', async function(req, res, next) {
    var text = req.body.text
    User.find({'username':  { $regex: text, $options: "i" }}, function(err, users) {
        if (err) return next(err);
        var content = {
            users: users,
            id: req.user._id
        }
        res.send(content)
    })
})

// searches for posts by content, and sends the list
router.post('/search-page/post', async function(req, res, next) {
    var text = req.body.text
    Post.find({'content':  { $regex: text, $options: "i" }}, function(err, posts) {
        if (err) return next(err);
        var content = {
            posts: posts,
            id: req.user._id
        }
        res.send(content)
    })
})

// searches for posts by song, and sends the list
router.post('/search-page/song', async function(req, res, next) {
    var text = req.body.text
    Post.find({'songTitle':  { $regex: text, $options: "i" }}, function(err, posts) {
        if (err) return next(err);
        var content = {
            posts: posts,
            id: req.user._id
        }
        res.send(content)
    })
})

// renders the search page
router.get("/search/:search", function(req, res, next) {
    var search = req.params.search
    return res.render("search", {search: search})
})

// renders the search page
router.get("/search", function(req, res, next) {
    res.render("search", {search: false})
})

router.get("/search/user", function(req, res, next) {
    
})


module.exports = router