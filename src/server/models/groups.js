//schema
    // multiple documents (groupName: name, courses: [])
    // courses will hold documents representing the courses (url, ogTitle, ogDesc, ogImage)

const mongoose = require("mongoose")

const courseSchema = mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    likeCount: {
        default: 0,
        type: Number
    },
    likers: Array,
}, {timestamps: true});

const groupSchema = mongoose.Schema({
    groupName: {
        type: String,
        required: true
    },
    courses: [courseSchema],
    routeId: String,
}, {timestamps: true});

const Group = mongoose.model("Group", groupSchema)

module.exports = Group;