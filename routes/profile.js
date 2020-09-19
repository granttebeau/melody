var express = require("express")
var router = express.Router({mergeParams: true})

var User = require("../models/user")
var Post = require("../models/post")
var middleware = require("../middleware/index")

// sends the user's profile picture- used to display profile pictures on posts/the profile page
router.get("/profile/picture", function(req, res, next) {
    User.findById(req.user._id, function(err, user) {
        if (err) return next(err);
        res.contentType(user.image.contentType)
        res.send(user.image.data)
    })
})

// sends a different user's profile picture- used to display profile pictures on posts/the profile page
router.get('/profile/:id/picture', function(req,res,next) {
    User.findById(req.params.id, function(err,user) {
        if (err) return next(err);
        res.contentType(user.image.contentType);
        res.send(user.image.data);
    });
});

// renders the profile page of the current user
router.get("/profile", middleware.isLoggedIn, function(req, res) {
    Post.find({'author.username': req.user.username}, function(err, posts) {
        if (err) {
            return res.redirect("/profile")
        }
        res.render("profile", {posts: posts})
    })
})

// renders the profile page of another user
router.get("/profile/:id", middleware.isLoggedIn, function(req, res) {
    User.findById(req.params.id, function(err, user) {
        if (err) {
            return res.redirect("/home")
        }
        if (user) {
            User.findById(req.user._id, function(err, currentUser) {
                if (err) {
                    return res.redirect("/home")
                }
                var arr = currentUser.following.filter(function(i) {
                    return i.user.equals(user._id)
                })
                let f = arr.length > 0 
                Post.find({'author.username': user.username}, function(err, posts) {
                    if (err) {
                        return res.redirect("/home")
                    }
                    res.render("other-profile", {posts: posts, profile: user, f: f})
                })
            })
        } 
        else {
            res.redirect("/home")
        }
        
    })
})

// handles the follow/unfollow functionality
router.get("/follow/:id", function(req, res) {
    User.findById(req.user._id, function(err, currentUser) {
        if (err) {
            return res.redirect("/profile")
        }
        User.findById(req.params.id, function(err, user) {
            if (err) {
                return res.redirect("/profile/" + req.params.id)
            }
            var curUserArr = currentUser.following.filter(function(i) {
                return i.user.equals(user._id)
            })

            var newUserObj = {
                user: user,
                username: user.username
            }
            if (curUserArr.length > 0) {
                currentUser.following.splice(currentUser.following.indexOf(newUserObj), 1);
            }
            else {
                currentUser.following.push(newUserObj)
            }

            var userArr = user.followers.filter(function(i) {
                return i._id.equals(currentUser._id)
            })
            if (userArr.length > 0) {
                user.followers.splice(user.followers.indexOf(currentUser), 1);
            }
            else {
                user.followers.push(currentUser)
            }
            currentUser.save()
            user.save()
            res.redirect("/profile/" + req.params.id)
        })
    })
})

// renders the notifications page
router.get("/profile/notifications", function(req, res) {
    res.send("notifications")
})

module.exports = router