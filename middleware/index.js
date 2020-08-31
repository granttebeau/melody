var middlewareObj = {}

middlewareObj.isLoggedIn = isLoggedIn
middlewareObj.isNotLoggedIn = isNotLoggedIn
middlewareObj.createQueryString = createQueryString

// if the user is logged in, the middleware function will render the profile page
// used to display landing page
function isNotLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/profile");
    }
    next()
}


// checks if the user is logged in, else renders login page
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
}

// creates the query string used with the Spotify API calls
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


module.exports = middlewareObj