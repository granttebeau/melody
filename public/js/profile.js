function styleProfilePage() {
    if (window.innerWidth < 992) {
        document.querySelector("#profile").classList.remove("profile")
    }
    else {
        document.querySelector("#profile").classList.add("profile")
    }
  }
window.addEventListener("load", () => {
    styleProfilePage()
})


window.addEventListener("resize", () => {
    styleProfilePage()
})

window.onscroll = function() {
    console.log("HELLO")
}

