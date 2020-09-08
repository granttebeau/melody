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

            var popular = posts.map(post => post.songTitle)
            // console.log(middleware.mode(postsByID))
            res.render("home", {posts: posts, popular: popular})
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

// renders the search page
router.get("/search", function(req, res, next) {
    res.render("search")
})


module.exports = router