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
        console.log(song)
        song.style.width = song.parentElement.width
    })
})

document.querySelectorAll(".dropdown-arrow")