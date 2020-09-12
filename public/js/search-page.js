



window.addEventListener("click", function(event) {
    var searchBar = document.querySelector("#search-page-input")
    var searchResults = document.querySelector(".search-page-display-items-user")

    var isClickInside = searchBar.contains(event.target) || searchResults.contains(event.target)
    if (!isClickInside) {
        document.querySelector(".search-page-display-items-user").classList.add("d-none")
    }
})

window.addEventListener("load", function() {
    handleSearch()
})

document.querySelector("#search-page-input").addEventListener("input", function() {
    handleSearch()
})

document.querySelector("#user-search").addEventListener("click", function() {
    handleSearch()
})

document.querySelector("#post-search").addEventListener("click", function() {
    handleSearch()
})

function getSearchParameter() {
    if (document.querySelector("#user-search").checked) {
        return "user"
    }
    else {
        return "post"
    }
}

function handleSearch() {
    var input = document.querySelector("#search-page-input")
    if (input.value === "") {
        var listItems = document.querySelector(".search-page-display-items-user")
        while (listItems.firstChild) {
            listItems.removeChild(listItems.firstChild)
        }
        var listItems = document.querySelector(".search-page-display-items-post")
        while (listItems.firstChild) {
            listItems.removeChild(listItems.firstChild)
        }
    }
    else {
        document.querySelector(".search-page-display-items-user").classList.remove("d-none")
        var items = {
            text: input.value,
        }
        searchPage(items)
    }
}

function searchPage(items) {
    var parameter = getSearchParameter() 
    fetch("/search-page/" + parameter, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
          },
        body: JSON.stringify(items),
    })
    .then(async function(r) {
        var res = await r.json();
        return res
      }).then(res => {
          if (parameter === "user") {
            document.querySelector(".search-page-display-items-user").classList.remove("d-none")
            document.querySelector(".search-page-display-items-post").classList.add("d-none")
            var result = res.users
            var num = result.length
            var listItems = document.querySelector(".search-page-display-items-user")
            while (listItems.firstChild) {
                listItems.removeChild(listItems.firstChild)
            }
            for (var i = 0; i < num; i++) {
                var a = document.createElement("A");
                res.id === result[i]._id ? a.href = "/profile" : a.href = "/profile/" + result[i]._id
                var li = document.createElement("LI"); 
    
                var profilePic = document.createElement("IMG")
                res.id === result[i]._id ? profilePic.src = "/profile/picture" : profilePic.src = "/profile/" + result[i]._id + "/picture"
                profilePic.alt = result[i].username
                profilePic.classList.add("search-page-image")
            
                var text = document.createElement("DIV")
                text.classList.add("search-page-username")
    
                var username = document.createElement("P")
                username.classList.add("username")
                username.textContent = result[i].username
    
                var bio = document.createElement("P")
                result[i].bio.length > 30 ? bio.textContent = result[i].bio.slice(0, 30) + "..." : bio.textContent = result[i].bio
    
                
                text.appendChild(username)
                text.appendChild(bio)
                li.appendChild(profilePic)
                li.appendChild(text)
                a.appendChild(li)
                listItems.appendChild(a)
            }
          }
          else if (parameter === "post") {
            document.querySelector(".search-page-display-items-user").classList.add("d-none")
            document.querySelector(".search-page-display-items-post").classList.remove("d-none")
            var result = res.posts
            var num = result.length
            var listItems = document.querySelector(".search-page-display-items-post")
            while (listItems.firstChild) {
                alert("HELLO")
                listItems.removeChild(listItems.firstChild)
            }
            for (var i = 0; i < num; i++) {
                var a = document.createElement("A");
                res.id === result[i].author.id ? a.href = "/profile" : a.href = "/profile/" + result[i].author.id
                var li = document.createElement("LI"); 
            
                var text = document.createElement("DIV")
                text.classList.add("search-page-username")
    
                var username = document.createElement("P")
                username.classList.add("username")
                username.textContent = result[i].author.username + ":"

                var content = document.createElement("P")
                result[i].content.length > 30 ? content.textContent = result[i].content.slice(0, 30) + "..." : content.textContent = result[i].content
                
                text.appendChild(username)
                text.appendChild(content)
                li.appendChild(text)
                a.appendChild(li)
                listItems.appendChild(a)
            }
          }
    }).catch(error => {
        console.log(error)
    })
}

