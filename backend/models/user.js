var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose")

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    fullName: String,
    bio: String,
    image: { data: Buffer, contentType: String },
    following: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    }],
    followers: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }]
})

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", userSchema)