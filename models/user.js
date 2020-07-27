var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose"),
    fs = require("fs"),
    multer = require('multer')

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    fullName: String,
    bio: String,
    image: { data: Buffer, contentType: String }
})

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", userSchema)