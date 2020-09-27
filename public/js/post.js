var posts = document.querySelectorAll("li.post");


for (var i = 0; i < posts.length; i++) {
    var post = posts[i];
    var children = post.childNodes;
    children.forEach(child => {
        var str = ".post-dropdown";
        if (child === document.querySelectorAll(str).item(i)) {
            child.addEventListener("click", () => {

            })
        }
        else {
            child.addEventListener("click", () => {
                window.location = '/post/' + post.id;
            })
        }
    })
}
