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
    upload = multer({ dest: "uploads/" })

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
    collection: 'posts'
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
    res.render("home")
})

app.get('/profile/picture', function(req,res,next) {
    User.findById( req.user._id, function(err,user) {
        if (err) return next(err);
        res.contentType(user.image.contentType);
        res.send(user.image.data);
    });
  });

app.get("/profile", isLoggedIn, function(req, res) {
    Post.find({'author.username': req.user.username}, function(err, posts) {
        if (err) {
            return res.redirect("/profile")
        }
        res.render("profile", {posts: posts})
    })
})

app.get("/profile/notifications", function(req, res) {
    res.send("notifications")
})

app.post("/new-post", function(req, res) {
    var content = req.body.content
    var song = req.body.song
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


app.use(IndexRoutes)


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
app.listen(process.env.PORT || 8000, process.env.IP);