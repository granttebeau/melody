var dates = document.querySelectorAll(".date")
    dates.forEach(date => {
        var d = date.textContent
        date.textContent = timeSince(Date.now() - d)
        setInterval(() => {
            date.textContent = timeSince(Date.now() - d)
        }, 5000);
    })
function timeSince(date) {
    var time = Math.floor(date / 1000)
    
    if (time < 60) return time + "s"

    time = Math.floor(time / 60) 

    if (time < 60) return time + "min"

    time = Math.floor(time / 60)

    if (time < 24) return time + "hr"

    time = Math.floor(time / 24) 

    if (time < 7) return time + "d"
    time = Math.floor(time / 7)

    if (time < 30) return time + "w"

    time = Math.floor(time / 30) 

    if (time < 52) return time + "m"

    return time + "yr"
}

window.addEventListener("resize", function() {
    document.querySelectorAll('iframe').forEach(song => {
        song.style.width = song.parentElement.width
    })
})

document.querySelectorAll(".post-dropdown-arrow ").forEach(arrow => {
    arrow.addEventListener("click", function() {
        if (arrow.classList.contains("fa-angle-down")) {
            arrow.classList.remove("fa-angle-down")
            arrow.classList.add("fa-angle-up")
            var parent = arrow.parentElement
            var dropdown = parent.querySelector("ul")
            dropdown.classList.remove("display-none")
        }
        else {
            arrow.classList.add("fa-angle-down")
            arrow.classList.remove("fa-angle-up")
            var parent = arrow.parentElement
            var dropdown = parent.querySelector("ul")
            dropdown.classList.add("display-none")
        }
    })
})

var dropdowns = document.querySelectorAll(".post-dropdown")

dropdowns.forEach(dd => {
    var arrow = dd.childNodes[1]
    var dropdown = dd.childNodes[3]
    window.addEventListener("click", function(event) {

        var isClickInside = arrow.contains(event.target) || dropdown.contains(event.target)
        if (!isClickInside) {
            if (arrow.classList.contains("fa-angle-up")) {
                arrow.classList.toggle("fa-angle-down")
                arrow.classList.toggle("fa-angle-up")
            }
            dropdown.classList.add("d-none")
        } else {
            dropdown.classList.remove("d-none")
        }
    })
})
