var mongoose = require("mongoose")

var postSchema = new mongoose.Schema({
    content: String,
    song: String,
    date: Date
})


module.exports = mongoose.model("Post", postSchema)