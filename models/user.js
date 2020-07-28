var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose")

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    fullName: String,
    bio: String,
    image: { data: Buffer, contentType: String }
})

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", userSchema)