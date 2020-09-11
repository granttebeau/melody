

function setSearchBar() {
    var newWidth = document.querySelector(".search-span")
    document.querySelector(".search-display-items").style.width = newWidth
    if (window.innerWidth < 768) {
        document.querySelector(".search-span").style.display = "none"
        document.querySelector("#search-link").href = "/search"
    }
    else {
        document.querySelector(".search-span").style.display = "inline-block"
        document.querySelector("#search-link").removeAttribute('href')
    }
  }


window.addEventListener("resize", function() {
    setSearchBar()
})

window.addEventListener("load", () => {
    setSearchBar()
})

window.addEventListener("click", function(event) {
    var searchBar = document.querySelector("#search-input")
    var searchResults = document.querySelector(".search-display-items")

    var isClickInside = searchBar.contains(event.target) || searchResults.contains(event.target)
    if (!isClickInside) {
        document.querySelector(".search-display-items").classList.add("d-none")
    } 
})

document.querySelector("#search-input").addEventListener("input", function() {
    if (this.value === "") {
        for (var i = 1; i < 10; i += 2) {
            document.querySelector(".search-display-items").childNodes[i].childNodes[0].textContent = ""
        }
        document.querySelector(".search-display-items").classList.add("d-none")
    }
    else {
        document.querySelector(".search-display-items").classList.remove("d-none")
        var items = {
            text: this.value,
        }
        fetch("/search", {
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
            var listItems = document.querySelector(".search-display-items")
            for (var i = 1; i < 10; i += 2) {
                document.querySelector(".search-display-items").childNodes[i].childNodes[0].textContent = ""
            }
            for (var i = 1; i < num * 2; i += 2) {
                var item = listItems.childNodes[i]
                item.classList.remove("d-none")
                item.childNodes[0].textContent = result[i - Math.ceil(i / 2)].username
                if (res.id === result[i - Math.ceil(i / 2)]._id) {
                    item.href = "/profile"
                }
                else {
                    item.href = "/profile/" + result[i - Math.ceil(i / 2)]._id
                }
            }
            for (var i = 1; i < 10; i += 2) {
                if (listItems.childNodes[i].childNodes[0].textContent === "") {
                    listItems.childNodes[i].classList.add("d-none")
                }
            }
            document.querySelector("#sixth-text").textContent = this.value
            var searchValue = document.querySelector("#search-sixth-link")
            searchValue.href = "/search/" + this.value
        }).catch(error => {
            console.log(error)
        })
    }
})

document.querySelector("#search-input").addEventListener("click", function() {
    if (this.value === "") {
        console.log(document.querySelector(".search-display-items"))
    }
})

