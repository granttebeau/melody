const options = {
  headers: {
      'Content-Type':'application/x-www-form-urlencoded',
      'Authorization': 'Basic ZjEyMDdhYjNhODcwNDk5MmIyMjZiMTI1ODdhYTdjMDI6NGY3YWMxMWI1NTk5NDFiNmExZmMxMTI4MWQ4NDljZTA',}
};

var postSong = document.querySelector("input.song")
var postList = document.querySelector(".song-display-items")
var postFirst = document.querySelector(".first")
var postSecond = document.querySelector(".second")
var postThird = document.querySelector(".third")
var postFourth = document.querySelector(".fourth")
var postFifth = document.querySelector(".fifth")
var postListSongs = [postFirst, postSecond, postThird, postFourth, postFifth]
var postSongLink = document.querySelector("input[name='songlink']")

var editSong = document.querySelector("input.edit-song")
var editList = document.querySelector(".song-edit-display-items")
var editFirst = document.querySelector(".edit-first")
var editSecond = document.querySelector(".edit-second")
var editThird = document.querySelector(".edit-third")
var editFourth = document.querySelector(".edit-fourth")
var editFifth = document.querySelector(".edit-fifth")
var editListSongs = [editFirst, editSecond, editThird, editFourth, editFifth]
var editSongLink = document.querySelector("input[name='editsonglink']")

window.addEventListener("click", function(event) {
  var isClickInside = postSong.contains(event.target) || editSong.contains(event.target) || postList.contains(event.target)
  if (!isClickInside) {
      postList.classList.add("display-none")
      editList.classList.add("display-none")
  }
  // } else {
  //     if (editSong.value !== '') {
  //       editList.classList.remove("display-none")
  //     }
  //     if (postSong.value !== '') {
  //       postList.classList.remove("display-none")
  //     }
  // }
})

var spotifyFunction = function (song, songLink, first, second, third, fourth, fifth, list) {
  axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', options).then((response) => {
    var at = response.data.access_token
    var op = {
        headers: {
            'Content-Type':'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + at,}
      };
    

    var qs = createQueryString(song.value)
    if (qs === "") {
      if (song == editSong) {
      }
      return list.classList.add("display-none")
    }
    axios.get("https://api.spotify.com/v1/search" + qs, op).then((response) => {
      list.classList.remove("display-none")
      first.textContent = response.data.tracks.items[0].name + ", " + response.data.tracks.items[0].artists[0].name
      first.addEventListener("click", function() {
        songLink.value = "https://open.spotify.com/embed/track/" + response.data.tracks.items[0].id
      })

      second.textContent = response.data.tracks.items[1].name + ", " + response.data.tracks.items[1].artists[0].name
      second.addEventListener("click", function() {
        songLink.value = "https://open.spotify.com/embed/track/" + response.data.tracks.items[1].id
      })

      third.textContent = response.data.tracks.items[2].name + ", " + response.data.tracks.items[2].artists[0].name
      third.addEventListener("click", function() {
        songLink.value = "https://open.spotify.com/embed/track/" + response.data.tracks.items[2].id
      })

      fourth.textContent = response.data.tracks.items[3].name + ", " + response.data.tracks.items[3].artists[0].name
      fourth.addEventListener("click", function() {
        songLink.value = "https://open.spotify.com/embed/track/" + response.data.tracks.items[3].id
      })
      fifth.textContent = response.data.tracks.items[4].name + ", " + response.data.tracks.items[4].artists[0].name
      fifth.addEventListener("click", function() {
        songLink.value = "https://open.spotify.com/embed/track/" + response.data.tracks.items[4].id
      })
    }).catch(function (error) {
      console.log(error)
    })
  
  }).catch(function (error) {
    console.log(error)
  })
}

postSong.addEventListener("input", () => {
  spotifyFunction(postSong, postSongLink, postFirst, postSecond, postThird, postFourth, postFifth, postList)
})

editSong.addEventListener("input", () => {
  spotifyFunction(editSong, editSongLink, editFirst, editSecond, editThird, editFourth, editFifth, editList)
})

editSong.addEventListener("click", () => {
  if (editSong.value === '') {
    editList.classList.add("display-none")
  }
})

function changeValue(element, song, list) {
  song.value = element.textContent
  list.classList.add("display-none")
  if (song == editSong) {
  }2
}

postListSongs.forEach(song => {
  song.addEventListener("click", function() {
    changeValue(this, postSong, postList)
  })
})

editListSongs.forEach(song => {
  song.addEventListener("click", function() {
    changeValue(this, editSong, editList)
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