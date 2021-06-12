//schema
    // multiple documents (groupName: name, courses: [])
    // courses will hold documents representing the courses (url, ogTitle, ogDesc, ogImage)

const mongoose = require("mongoose")

const groupSchema = mongoose.Schema({
    groupName: {
        type: String,
        required: true
    },
    courses: Array,
    routeId: String,
}, {timestamps: true});

const Group = mongoose.model("Group", groupSchema)

module.exports = Group;