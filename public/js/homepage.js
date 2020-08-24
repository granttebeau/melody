function styleHomePage() {
    if (window.innerWidth < 992) {
        document.querySelector("#home-screen-content").classList.remove("home-screen-content")
    }
    else {
        document.querySelector("#home-screen-content").classList.add("home-screen-content")
    }
  }

window.addEventListener("resize", () => {
    styleHomePage()
})
window.addEventListener("load", () => {
    styleHomePage()
})