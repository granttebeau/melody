const options = {
  headers: {
      'Content-Type':'application/x-www-form-urlencoded',
      'Authorization': 'Basic ZjEyMDdhYjNhODcwNDk5MmIyMjZiMTI1ODdhYTdjMDI6NGY3YWMxMWI1NTk5NDFiNmExZmMxMTI4MWQ4NDljZTA',}
};

var song = document.querySelector("input.song")
var list = document.querySelector(".song-display-items")
var first = document.querySelector(".first")
var second = document.querySelector(".second")
var third = document.querySelector(".third")
var fourth = document.querySelector(".fourth")
var fifth = document.querySelector(".fifth")
var listSongs = [first, second, third, fourth, fifth]
var songLink = document.querySelector("input[type='hidden']")
var clicked = false



song.addEventListener("input", function() {
  axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', options).then((response) => {
 
    var at = response.data.access_token
    var op = {
        headers: {
            'Content-Type':'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + at,}
      };
    

    var qs = createQueryString(song.value)
    if (qs === "") {
      return list.classList.add("display-none")
    }
    axios.get("https://api.spotify.com/v1/search" + qs, op).then((response) => {
        if (song.value == '') {
          list.classList.add("display-none")
        }
        else {
          list.classList.remove("display-none")
          first.textContent = response.data.tracks.items[0].name + ", " + response.data.tracks.items[0].artists[0].name
          first.addEventListener("click", function() {
            songLink.value = "https://open.spotify.com/embed/track/" + response.data.tracks.items[0].id
            console.log(songLink.value)
            clicked = true
          })

          second.textContent = response.data.tracks.items[1].name + ", " + response.data.tracks.items[1].artists[0].name
          second.addEventListener("click", function() {
            songLink.value = "https://open.spotify.com/embed/track/" + response.data.tracks.items[1].id
            console.log(songLink.value)
            clicked = true
          })

          third.textContent = response.data.tracks.items[2].name + ", " + response.data.tracks.items[2].artists[0].name
          third.addEventListener("click", function() {
            songLink.value = "https://open.spotify.com/embed/track/" + response.data.tracks.items[2].id
            console.log(songLink.value)
            clicked = true
          })

          fourth.textContent = response.data.tracks.items[3].name + ", " + response.data.tracks.items[3].artists[0].name
          fourth.addEventListener("click", function() {
            songLink.value = "https://open.spotify.com/embed/track/" + response.data.tracks.items[3].id
            console.log(songLink.value)
            clicked = true
          })
          fifth.textContent = response.data.tracks.items[4].name + ", " + response.data.tracks.items[4].artists[0].name
          fifth.addEventListener("click", function() {
            songLink.value = "https://open.spotify.com/embed/track/" + response.data.tracks.items[4].id
            console.log(songLink.value)
            clicked = true
          })
        }
    }).catch(function (error) {
      console.log(error)
    })
  
  }).catch(function (error) {
    console.log(error)
  })
  
})

function changeValue(element) {
    song.value = element.textContent
    list.classList.add("display-none")
}


document.querySelector(".post-form").addEventListener("submit", function() {
  if (!clicked) {
    returnToPreviousPage()
    return false
  }
  else {
    return true
  }
})

listSongs.forEach(song => {
  song.addEventListener("click", function() {
    changeValue(this)
  })
})

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
