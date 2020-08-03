var express = require("express"),
    app = express(),
    bp = require('body-parser'),
    methodOverride = require("method-override"),
    session = require('express-session'),
    MongoDBStore = require('connect-mongodb-session')(session),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    path = require("path"),
    multer = require("multer"),
    upload = multer({ dest: "uploads/" }),
    axios = require("axios"),
    querystring = require("querystring")

var User = require("./models/user"),
    Post = require("./models/post")

var IndexRoutes = require("./routes/index")


var url = process.env.DATABASEURL || "mongodb://localhost/melody"
mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })
app.set("view engine", "ejs")

app.use(bp.json())
app.use(bp.urlencoded({extended: true}))


app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"))


const store = new MongoDBStore({
    uri: "mongodb://localhost/melody",
    collection: 'users'
});
app.use(session({
    secret: 'this is my super secret session key',
    resave: false,
    saveUninitialized: true,
    store: store,
    unset: 'destroy',
    name: 'session cookie name'
  }));

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
mongoose.set('useFindAndModify', false);

app.use(function(req, res, next){
    res.locals.user = req.user;
    next();
 });

app.get("/home", isLoggedIn, function(req, res) {
    Post.find({}, function(err, posts) {
        if (err) {
            return res.redirect("/home")
        }
        res.render("home", {posts: posts})
    })
})

app.get('/profile/picture', function(req,res,next) {
    User.findById( req.user._id, function(err,user) {
        if (err) return next(err);
        res.contentType(user.image.contentType);
        res.send(user.image.data);
    });
  });

app.get('/profile/:id/picture', function(req,res,next) {
    User.findById( req.params.id, function(err,user) {
        if (err) return next(err);
        res.contentType(user.image.contentType);
        res.send(user.image.data);
    });
});


app.get("/follow/:id", function(req, res) {
    User.findById(req.user._id, function(err, currentUser) {
        if (err) {
            return res.redirect("/profile")
        }
        User.findById(req.params.id, function(err, user) {
            if (err) {
                return res.redirect("/profile/" + req.params.id)
            }
 
            var curUserArr = currentUser.following.filter(function(i) {
                return i.equals(user)
            })
            if (curUserArr.length > 0) {
                currentUser.following.splice(currentUser.following.indexOf(user), 1);
            }
            else {
                currentUser.following.push(user)
            }

            var userArr = user.followers.filter(function(i) {
                return i.equals(currentUser)
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

app.get("/profile", isLoggedIn, function(req, res) {
    Post.find({'author.username': req.user.username}, function(err, posts) {
        if (err) {
            return res.redirect("/profile")
        }
        res.render("profile", {posts: posts})
    })
})

app.get("/profile/:id", isLoggedIn, function(req, res) {
    User.findById(req.params.id, function(err, user) {
        if (err) {
            res.redirect("/home")
        }
        User.findById(req.user._id, function(err, currentUser) {
            if (err) {
                res.redirect("/home")
            }
            var arr = currentUser.following.filter(function(i) {
                return i.equals(user)
            })
            let f
            arr.length > 0 ? f = true : f = false
            Post.find({'author.username': user.username}, function(err, posts) {
                if (err) {
                    res.redirect("/home")
                }
                res.render("other-profile", {posts: posts, profile: user, f: f})
            })
        })
    })
})

app.get("/profile/notifications", function(req, res) {
    res.send("notifications")
})

app.post("/new-post/profile", function(req, res) {
    var content = req.body.content
    var song = req.body.songlink
    var post = new Post({
        content: content,
        song: song,
        date: Date.now(),
        author: {
            id: req.user._id,
            username: req.user.username
        }
    })
    post.save()
    res.redirect("/profile")
})

app.post("/new-post/home", function(req, res) {
    var content = req.body.content
    var song = req.body.songlink
    var post = new Post({
        content: content,
        song: song,
        date: Date.now(),
        author: {
            id: req.user._id,
            username: req.user.username
        }
    })
    post.save()
    res.redirect("/home")
})

app.get("/delete-post/:id/profile", function(req, res) {
    Post.findByIdAndDelete(req.params.id, function(err) {
        if (err) {
            console.log(err)
            return res.redirect("/profile")
        }
        res.redirect("/profile")
    })
})
app.get("/delete-post/:id/home", function(req, res) {
    Post.findByIdAndDelete(req.params.id, function(err) {
        if (err) {
            console.log(err)
            return res.redirect("/home")
        }
        res.redirect("/home")
    })
})


app.use(IndexRoutes)


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/")
}
function containsId(following, id) {
    var followers = following.filter(user => {
        user._id.equals(id)
    })
    return followers.length > 1
}

app.listen(process.env.PORT || 8000, process.env.IP);