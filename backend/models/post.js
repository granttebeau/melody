var mongoose = require("mongoose")

var postSchema = new mongoose.Schema({
    content: String,
    songSearch: String,
    songTitle: String,
    song: String,
    date: Number,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
        name: String
    }
})


module.exports = mongoose.model("Post", postSchema)