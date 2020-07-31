var mongoose = require("mongoose")

var postSchema = new mongoose.Schema({
    content: String,
    song: String,
    date: Number,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
})


module.exports = mongoose.model("Post", postSchema)