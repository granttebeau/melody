function styleHomePage() {
    if (window.innerWidth < 992) {
        document.querySelector("#home-screen-content").classList.remove("home-screen-content")
    }
    else {
        document.querySelector("#home-screen-content").classList.remove("home-screen-content")
    }
  }

window.addEventListener("resize", () => {
    styleHomePage()
})