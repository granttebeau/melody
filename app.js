
var express = require("express"),
    app = express(),
    bp = require('body-parser'),
    methodOverride = require("method-override"),
    session = require('express-session'),
    MongoDBStore = require('connect-mongodb-session')(session),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    path = require("path")

var User = require("./models/user")

// initialize the routes
var IndexRoutes = require("./routes/index")
var ProfileRoutes = require("./routes/profile")
var PostRoutes = require("./routes/post")
var HomeRoutes = require("./routes/home")

// sets up the MongoDB
var url = "mongodb://localhost/melody"
// var url = "mongodb+srv://public:0vRokIdC25tC532f@melody.1dhd4.mongodb.net/Melody?retryWrites=true&w=majority"
mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })

// various app configurations: 

// allows ejs files to be called just by title
app.set("view engine", "ejs") 

// allows form information to be passed into the app.js file:
app.use(bp.json())
app.use(bp.urlencoded({extended: true}))

// configures the public folder to be accessed throughout the folder
app.use(express.static(path.join(__dirname, 'public')));

// used with the PUT method to update/edit a post
app.use(methodOverride("_method"))

// configuring the local/public MongoDB to be used with the session
const store = new MongoDBStore({
    uri: "mongodb://localhost/melody",
    // uri: "mongodb+srv://public:0vRokIdC25tC532f@melody.1dhd4.mongodb.net/Melody?retryWrites=true&w=majority",
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


// configuring passport, used to authenticate passwords
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
mongoose.set('useFindAndModify', false);


// setting the local variable for the user
app.use(function(req, res, next){
    res.locals.user = req.user;
    next();
 });


 // use each of the routes, defined above
app.use(IndexRoutes)
app.use(ProfileRoutes)
app.use(PostRoutes)
app.use(HomeRoutes)


app.listen(process.env.PORT || 8000, process.env.IP);