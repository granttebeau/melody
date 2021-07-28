var express = require("express")
var router = express.Router({mergeParams: true})

var multer = require("multer"),
    upload = multer({ dest: "uploads/" }),
    fs = require("fs"),
    bcrypt = require("bcryptjs"),
    keys = require("../config/keys");
    jwt = require("jsonwebtoken");

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

router.post("/register", (req, res) => {
    User.findOne({ username: req.body.username }).then(user => {
        if (user) {
            return res.status(400).json({ email: "Username already exists" });
        }
        else {
            const newUser = new User({
                username: req.body.username,
                fullName: req.body.name,
                following: [],
                password: req.body.password
            });
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                })
            })
        }
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

router.post("/login", passport.authenticate('local'), (req, res) => {
    let username = req.body.username,
        password = req.body.password;

        
    User.findOne({ username: username}).then(user => {
        if (!user) {
            return res.status(404).json({ emailnotfound: "Username not found" });
        }
        const payload = {
            username: user.username,
            fullName: user.fullName,
            following: user.following,
            followers: user.followers
        }
        jwt.sign(payload, keys.secretOrKey, { expiresIn: 31556926 }, (err, token) => {
            res.json({
                success: true,
                token: token
            })
        })
    }).catch(error => {
        console.log(error);
        res.json({success: false, message: error.message}).send(400);
    })
})
// router.use('/login', passport.authenticate('local'), (req, res) => {
//     console.log(req);
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'application/json');
//     res.send({token: "token123"});
//   });

router.post("/logout", function(req, res) {
    req.logout()
    res.status(200).send({success: 'logged out'})
})



module.exports = router