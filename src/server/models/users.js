const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    pfp: String,
    bio: String,
    createdGroups: Array,
}, {timestamps: true})

const User = mongoose.model("User", userSchema)

module.exports = User;