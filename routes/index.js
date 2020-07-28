var express = require("express")
var router = express.Router({mergeParams: true})

var multer = require("multer"),
    upload = multer({ dest: "uploads/" }),
    fs = require("fs")

var User = require("../models/user")

var passport = require("passport") 


router.get("/", isNotLoggedIn, function(req, res) {
    res.render("landing/landing")
})

router.get('/register', function(req, res) {
    res.render("landing/landing-register")
})

router.post("/register", upload.single('image'), function(req, res) {
    var username = req.body.username
    var password = req.body.password
    var bio = req.body.bio
    var fullName = req.body.fullName
    var image = req.file


    User.register(new User({username: username, bio: bio, fullName: fullName, image: image}), password, function(err, user) {
        if (err) {
            console.log(err)
            return res.render('landing/landing-register')
        }
        user.image.data = fs.readFileSync(image.path)
        user.image.contentType = 'image/jpeg'
        user.save()
        passport.authenticate("local")(req, res, function() {
            res.redirect('/')
        })
    })
})



router.post("/login", passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/"
}), function(req, res) { 
})

router.get("/logout", function(req, res) {
    req.logout()
    res.redirect("/")
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/")
}

function isNotLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/profile");
    }
    next()
}

module.exports = router