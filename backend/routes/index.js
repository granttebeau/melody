var express = require("express")
var router = express.Router({mergeParams: true})

var multer = require("multer"),
    upload = multer({ dest: "uploads/" }),
    fs = require("fs")

var User = require("../models/user")

var passport = require("passport")

router.get('/register/:id', function(req, res) {
    User.findById(req.params.id, function(err, user) {
        if (err) {
            return res.status(400).send({ error: err.message });
        }
        return res.status(200).send(user)
    })
})

router.post("/register", function(req, res) {
    var username = req.body.username
    var password = req.body.password
    var fullName = req.body.fullName

    User.register(new User({username: username, fullName: fullName, following: []}), password, function(err, user) {
        if (err) {
            return res.status(400).send({ error: err.message });
        }
        passport.authenticate("local")(req, res, function() {
            return res.status(200).send(user)
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
        return res.status(200).send({message: 'Updated profile'})
    })
})

router.post('/login', passport.authenticate('local'), (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, status: 'You are successfully logged in!'});
  });


router.post("/logout", function(req, res) {
    req.logout()
    res.status(200).send({success: 'logged out'})
})



module.exports = router