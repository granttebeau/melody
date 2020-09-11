



window.addEventListener("click", function(event) {
    var searchBar = document.querySelector("#search-page-input")
    var searchResults = document.querySelector(".search-page-display-items")

    var isClickInside = searchBar.contains(event.target) || searchResults.contains(event.target)
    if (!isClickInside) {
        document.querySelector(".search-page-display-items").classList.add("d-none")
    }
})

window.addEventListener("load", function() {
    handleSearch()
})

document.querySelector("#search-page-input").addEventListener("input", function() {
    handleSearch()
})

function handleSearch() {
    var input = document.querySelector("#search-page-input")
    if (input.value === "") {
        var listItems = document.querySelector(".search-page-display-items")
        while (listItems.firstChild) {
            console.log('removed')
            listItems.removeChild(listItems.firstChild)
        }
    }
    else {
        document.querySelector(".search-page-display-items").classList.remove("d-none")
        var items = {
            text: input.value,
        }
        searchPage(items)
    }
}

function searchPage(items) {
    fetch("/search-page", {
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
        var result = res.users
        var num = result.length
        var listItems = document.querySelector(".search-page-display-items")
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
    }).catch(error => {
        console.log(error)
    })
}

