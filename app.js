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
    axios = require("axios")

var User = require("./models/user"),
    Post = require("./models/post")

var IndexRoutes = require("./routes/index")

// var url = "mongodb://localhost/melody"
var url = "mongodb+srv://public:0vRokIdC25tC532f@melody.1dhd4.mongodb.net/Melody?retryWrites=true&w=majority"
mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })
app.set("view engine", "ejs")

app.use(bp.json())
app.use(bp.urlencoded({extended: true}))


app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"))


const store = new MongoDBStore({
    // uri: "mongodb://localhost/melody",
    uri: "mongodb+srv://public:0vRokIdC25tC532f@melody.1dhd4.mongodb.net/Melody?retryWrites=true&w=majority",
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
    User.findById(req.user._id, function(err, user) {
        if (err) return next(err);
        var following = user.following.map(item => item.username)
        following.push(user.username)
        Post.find({"author.username": {$in : following}}, function(err, posts) {
            if (err) console.log(err);
            res.render("home", {posts: posts})
        })
    })
    // Post.find({}, function(err, posts) {
    //     if (err) {
    //         return res.redirect("/home")
    //     }
    //     res.render("home", {posts: posts})
    // })
})

app.post('/search', async function(req, res, next) {
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

app.get("/search", function(req, res, next) {
    res.render("search")
})


app.get('/profile/picture', function(req,res,next) {
    User.findById(req.user._id, function(err,user) {
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
            console.log("FIRST" + err)
            return res.redirect("/home")
        }
        if (user) {
            User.findById(req.user._id, function(err, currentUser) {
                if (err) {
                    console.log("SECOND")
                    return res.redirect("/home")
                }
                var arr = currentUser.following.filter(function(i) {
                    return i.user.equals(user._id)
                })
                let f = arr.length > 0 
                // console.log(currentUser.following)
                Post.find({'author.username': user.username}, function(err, posts) {
                    if (err) {
                        console.log("THIRD")
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

app.get("/profile/notifications", function(req, res) {
    res.send("notifications")
})

app.post("/new-post", function(req, res) {
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
            
        
            var qs = createQueryString(song)
            axios.get("https://api.spotify.com/v1/search" + qs, op).then((response) => {
                songLink = "https://open.spotify.com/embed/track/" + response.data.tracks.items[0].id
                var post = new Post({
                    content: content,
                    song: songLink,
                    date: Date.now(),
                    author: {
                        id: req.user._id,
                        username: req.user.username
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
        var post = new Post({
            content: content,
            song: songLink,
            date: Date.now(),
            author: {
                id: req.user._id,
                username: req.user.username
            }
        })
        post.save()
        res.redirect(req.get('referer'));
    }

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

app.get("/delete-post/:id", function(req, res) {
    Post.findByIdAndDelete(req.params.id, function(err) {
        if (err) {
            console.log(err)
            return res.redirect("/profile")
        }
        res.redirect(req.get('referer'));
    })
})



app.use(IndexRoutes)


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/")
}
function createQueryString(song) {
    var songArr = song.split("")
    var str = ""
    if (song.length == 0) {
      return ""
    }
    songArr.forEach(letter => {
      if (letter === " ") {
        str += "+"
      }
      else if (letter === '"') {
        str += "%22"
      }
      else if (letter === "'") {
        str += "%27"
      }
      else {
        str += letter
      }
    });
    return "?q=" + str + "&type=track"
  }
  

app.listen(process.env.PORT || 8000, process.env.IP);