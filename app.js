var express = require("express"),
    app = express(),
    bp = require('body-parser'),
    methodOverride = require("method-override"),
    session = require('express-session'),
    MongoDBStore = require('connect-mongodb-session')(session),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    fs = require("fs"),
    multer = require("multer"),
    upload = multer({ dest: "uploads/" })

var User = require("./models/user")


var url = process.env.DATABASEURL || "mongodb://localhost/melody"
mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })
app.set("view engine", "ejs")
app.use(bp.urlencoded({extended: true}))
app.use(express.static(__dirname + "/public"))
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

app.get("/", isLoggedIn, function(req, res) {
    res.render("home")
})



app.get('/login', function(req, res) {
    res.render("auth/login")
})

app.get('/register', function(req, res) {
    res.render("auth/register")
})

app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}), function(req, res) { 
})

app.post("/register", upload.single('image'), function(req, res) {
    var username = req.body.username
    var password = req.body.password
    var bio = req.body.bio
    var fullName = req.body.fullName
    var image = req.file


    User.register(new User({username: username, bio: bio, fullName: fullName, image: image}), password, function(err, user) {
        if (err) {
            console.log(err)
            return res.render('auth/register')
        }
        user.image.data = fs.readFileSync(image.path)
        user.image.contentType = 'image/jpeg'
        user.save()
        passport.authenticate("local")(req, res, function() {
            res.redirect('/')
        })
    })
})

app.get('/profile/picture', function(req,res,next) {
    User.findById( req.user._id, function(err,user) {
        if (err) return next(err);
        res.contentType(user.image.contentType);
        res.send(user.image.data);
    });
  });

app.get("/landing", function(req, res) {
    res.render("landing")
})

app.get("/logout", function(req, res) {
    req.logout()
    res.redirect("/")
})

app.get("/profile", isLoggedIn, function(req, res) {
    res.render("profile")
})

app.get("/profile/notifications", function(req, res) {
    res.send("notifications")
})


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/landing")
}
app.listen(process.env.PORT || 3000, process.env.IP);