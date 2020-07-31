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

router.get('/register/:id', function(req, res) {
    User.findById(req.params.id, function(err, user) {
        if (err) {
            return res.redirect("/register")
        }
        res.render("landing/add-information", {user: user})
    })
})

router.post("/register", function(req, res) {
    console.log(req.params)
    var username = req.body.username
    var password = req.body.password
    var fullName = req.body.fullName

    console.log(username)
    console.log(password)
    console.log(fullName)

    User.register(new User({username: username, fullName: fullName, following: []}), password, function(err, user) {
        if (err) {
            console.log(err)
            return res.render('landing/landing-register')
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect('/register/' + user._id)
        })
    })
})

router.post('/register/:id', upload.single('image'), function(req, res) {
    var image = req.file
    var bio = req.body.bio
    User.findById(req.params.id, function(err, user) {2
        if (err) {
            return res.redirect("/register")
        }
        user.bio = bio
        user.image.data = fs.readFileSync(image.path)
        user.image.contentType = 'image/jpeg'
        user.save()
        req.logout()
        res.redirect("/")
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