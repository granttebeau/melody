
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
bcrypt = require('bcrypt');

var User = require("./models/user")

// initialize the routes
var IndexRoutes = require("./routes/index")
var ProfileRoutes = require("./routes/profile")
var PostRoutes = require("./routes/post")
var HomeRoutes = require("./routes/home")


var cors = require('cors');
app.use(cors());

// sets up the MongoDB
var url = require("./config/keys").mongoURI;
// var url = "mongodb+srv://public:0vRokIdC25tC532f@melody.1dhd4.mongodb.net/Melody?retryWrites=true&w=majority"
mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })

// allows form information to be passed into the app.js file:
app.use(bp.json())
app.use(bp.urlencoded({extended: true}))

// configures the public folder to be accessed throughout the folder
app.use(express.static(path.join(__dirname, 'public')));

// used with the PUT method to update/edit a post
app.use(methodOverride("_method"))

// configuring the local/public MongoDB to be used with the session
const store = new MongoDBStore({
    uri: url,
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

// passport.use(new LocalStrategy(User.authenticate()))
passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        bcrypt.compare(password, user.password).then(matched => {
            if (matched) {
                return done(null, user);
            }
            else {
                return done(null, false, { message: 'Incorrect password.' }); 
            }
        })
        // if (!user.validPassword(password)) {
        //   return done(null, false, { message: 'Incorrect password.' });
        // }
        // return done(null, user);
      });
    }
  ));
// passport.serializeUser((user, done) => {
//     done(null, user.username);
// })
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
// passport.deserializeUser((username, done) => {
//     User.find({'username': username}, (err, user) => {
//         done(err, user);
//     })
// })

require("./config/passport")(passport);

mongoose.set('useFindAndModify', false);


// setting the local variable for the user
app.use(function(req, res, next){
    res.locals.user = req.user;
    next();
});


// use each of the routes, defined above
app.use(IndexRoutes)
app.use(HomeRoutes)
app.use(ProfileRoutes)
app.use(PostRoutes)

// renders the home page with posts in chronological order if random url is entered
// app.get("/*", function(req, res) {
//     // res.redirect("home")  
//     res.send('what it do baby');  
// })


app.listen(process.env.PORT || 4200, process.env.IP);