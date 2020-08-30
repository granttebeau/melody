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
                var song = result.songSearch.split(",")
                document.querySelector("#edit-song").value = song
            })
        
        document.querySelector(".edit-window").classList.remove("d-none")
        var elements = document.querySelectorAll("body > *:not(.edit-window")
        elements.forEach(element => {
            element.style.filter = "blur(6px) brightness(95%)"
            element.style.pointerEvents = "none"
        })
        disableScrolling()
    })
})

function disableScrolling(){
    var x = window.scrollX;
    var y = window.scrollY;
    window.onscroll=function(){window.scrollTo(x, y);};
}

document.querySelector("#edit-window-exit").addEventListener("click", () => {
    document.querySelector(".edit-window").classList.add("d-none")
    var elements = document.querySelectorAll("body > *:not(.edit-window")
    elements.forEach(element => {
        element.style.filter = ""
        element.style.pointerEvents = ""
    })
    window.onscroll=function(){};
})