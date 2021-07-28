var express = require("express")
var router = express.Router({mergeParams: true})

var User = require("../models/user")
var Post = require("../models/post")
var middleware = require("../middleware/index")
var TimeAgo = require('javascript-time-ago');
var en = require('javascript-time-ago/locale/en');

TimeAgo.addDefaultLocale(en)

// Create formatter (English).
const timeAgo = new TimeAgo('en-US')

// sends the user's profile picture- used to display profile pictures on posts/the profile page
router.get("/profile/picture", function(req, res, next) {
    User.findById(req.session.user._id, function(err, user) {
        if (err) return res.status(400).send(err)
        res.status(200).send({});
        // let {contentType, data} = user.image;
        // console.log(user);
        // return res.status(200).contentType(contentType).send(data);
    })
})

// sends a different user's profile picture- used to display profile pictures on posts/the profile page
router.get('/profile/:id/picture', function(req,res,next) {
    User.findById(req.params.id, function(err,user) {
        if (err) return res.status(400).send(err)
        let {contentType, data} = user.image;
        return res.status(200).contentType(contentType).send(data);
    });
});

// renders the profile page of the current user
router.get("/profile/:username", middleware.isLoggedIn, function(req, res) {
    Post.find({'author.username': req.params.username}, function(err, posts) {
        if (err) {
            return res.status(400).send(err)
        }
        return res.status(200).send(posts); 
    })
})


router.post("/edit-profile", middleware.isLoggedIn, function(req, res) {
    User.findById(req.user._id, function(err, user) {
        if (err) {
            return res.status(400).send(err)
        }
        user.fullName = req.body.fullName;
        user.username = req.body.username;
        user.bio = req.body.bio;
        user.save();
        Post.find({'author.username': req.user.username}, function(err, posts) {
            if (err) {
                return res.status(400).send(err)
            }
            posts.forEach(post => {
                post.author.username = req.body.username;
                post.author.name = req.body.fullName;
                post.save();
            })
            return res.status(200).send({success: "profile updated"}); 
        })
    })
})

// renders the profile page of another user
// router.get("/profile/:id", middleware.isLoggedIn, function(req, res) {
//     User.findById(req.params.id, function(err, user) {
//         if (err) {
//             return res.status(400).send(err)
//         }
//         if (user) {
//             User.findById(req.user._id, function(err, currentUser) {
//                 if (err) {
//                     return res.status(400).send(err)
//                 }
//                 var arr = currentUser.following.filter(function(i) {
//                     return i.user.equals(user._id)
//                 })
//                 let f = arr.length > 0 
//                 Post.find({'author.username': user.username}, function(err, posts) {
//                     if (err) {
//                         return res.status(400).send(err)
//                     }
//                     return res.status(200).send({posts: posts, profile: user, f: f}); 
//                 })
//             })
//         } 
//         else {
//             return res.status(404).send(err)
//         }
        
//     })
// })

// handles the follow/unfollow functionality
router.get("/follow/:id", function(req, res) {
    User.findById(req.user._id, function(err, currentUser) {
        if (err) {
            return res.status(400).send(err)
        }
        User.findById(req.params.id, function(err, user) {
            if (err) {
                return res.status(400).send(err)
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
            return res.status(200).send("follow/unfollow completed"); 
            res.redirect("/profile/" + req.params.id)
        })
    })
})

module.exports = router