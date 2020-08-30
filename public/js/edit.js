var edit = document.querySelectorAll(".edit-post")

edit.forEach(post => {
    post.addEventListener("click", () => {
        var query = "/post-info/" + post.id
        console.log(query)
        fetch(query, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
              },
            }).then(async function(r) {
                var res = await r.json();
                return res
            }).then(result => {
                document.querySelector("#edit-text").value = result.content
                document.querySelector("#edit-song").value = result.songSearch
            })
        
        document.querySelector(".edit-window").classList.remove("d-none")
        var elements = document.querySelectorAll("body > *:not(.edit-window")
        elements.forEach(element => {
            element.style.filter = "blur(6px) brightness(95%)"
        })
    })
})

document.querySelector("#edit-window-exit").addEventListener("click", () => {
    document.querySelector(".edit-window").classList.add("d-none")
    var elements = document.querySelectorAll("body > *:not(.edit-window")
    elements.forEach(element => {
        element.style.filter = "blur(0px) brightness(100%)"
    })
})