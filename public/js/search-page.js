



window.addEventListener("click", function(event) {
    var searchBar = document.querySelector("#search-page-input")
    var searchResults = document.querySelector(".search-page-display-items")

    var isClickInside = searchBar.contains(event.target) || searchResults.contains(event.target)
    if (!isClickInside) {
        document.querySelector(".search-page-display-items").classList.add("d-none")
    }
})

document.querySelector("#search-page-input").addEventListener("input", function() {
    if (this.value === "") {
        var listItems = document.querySelector(".search-page-display-items")
        while (listItems.firstChild) {
            console.log('removed')
            listItems.removeChild(listItems.firstChild)
        }
    }
    else {
        document.querySelector(".search-page-display-items").classList.remove("d-none")
        var items = {
            text: this.value,
        }
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
                console.log(profilePic)
                // profilePic.src = result[i].image
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
            // for (var i = 1; i < 10; i += 2) {
            //     document.querySelector(".search-page-display-items").childNodes[i].childNodes[0].textContent = ""
            // }
            // for (var i = 1; i < num * 2; i += 2) {
            //     var item = listItems.childNodes[i]
            //     item.classList.remove("d-none")
            //     item.childNodes[0].textContent = result[i - Math.ceil(i / 2)].username
            //     if (res.id === result[i - Math.ceil(i / 2)]._id) {
            //         item.href = "/profile"
            //     }
            //     else {
            //         item.href = "/profile/" + result[i - Math.ceil(i / 2)]._id
            //     }
            // }
            // for (var i = 1; i < 10; i += 2) {
            //     if (listItems.childNodes[i].childNodes[0].textContent === "") {
            //         console.log(listItems.childNodes[i])
            //         listItems.childNodes[i].classList.add("d-none")
            //     }
            // }
        }).catch(error => {
            console.log(error)
        })
    }
})
