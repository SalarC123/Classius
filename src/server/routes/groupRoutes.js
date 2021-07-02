const express = require('express')
const Group = require("../models/groups.js")
const verifyJWT = require("../verifyJWT")
const ogs = require("open-graph-scraper")
const User = require("../models/users")
const ProfanityOptions = require("@2toad/profanity").ProfanityOptions
const Profanity = require("@2toad/profanity").Profanity
const groupValidation = require("../validation").groupValidation
const fs = require("fs")
const {v1: uuidv1} = require("uuid")

const options = new ProfanityOptions();
options.grawlix = '*****'
const profanity = new Profanity(options)

const router = express.Router()

router.get("/groups", (req, res) => {
    Group.find().sort({popularity: "descending"}).limit(50)
    .then(groups => res.json(groups))
    .catch(err => console.log(err))
})

function routify(text) {
    // replaces spaces with dashes
    const lowerCaseText = text.toLowerCase()
    return lowerCaseText.replace(/ /g, "-")
}

router.post("/creategroup", verifyJWT, async (req, res) => {
    
    const currentUser = req.user;
    const routifiedGroupName = routify(req.body.groupName)

    const validationError = groupValidation(req.body).error

    if (validationError) {
        return res.json({message: validationError.details[0].message})
    }

    // creates group from Group model and saves it to the database
    async function createGroup() {
        try {
            const courses = []

            // fetch open graph data 
            for (courseURL of req.body.courses) {
                let ogData = {url: courseURL, likeCount: 0, likers: [], comments: []};

                const res = await ogs({url: courseURL})
                const data = await res.result
                
                if (!data.success || !data.ogTitle) continue;

                ogData.ogTitle = data.ogTitle
                ogData.ogImage = data.ogImage?.url
                ogData.ogDesc = data.ogDescription
                ogData.ogSiteName = data.ogSiteName
                
                courses.push(ogData)
            }

            // add this group to the user's "created groups" list on their profile
            User.updateOne(
                {username: currentUser.username},
                {$push: {createdGroups: {groupName: req.body.groupName, url: "/g/" + routifiedGroupName}}},
                updateRes => updateRes
            )

            const group = new Group({
                groupName: req.body.groupName,
                courses: courses,
                routeId: routifiedGroupName
            })
        
            await group.save()

            return res.json({message: "Success", groupURL: routifiedGroupName})
        } catch (err) {
            res.json({message: "Server Error (your URLs might be invalid)"})
        }
    }

    // checks if group with same name has already been created
    Group.find( {groupName: req.body.groupName} )
        .then(response => response.length 
            ? res.json({message: "This name has already been used"})
            : createGroup()
        )
    }
)

router.get("/g/:groupId", (req, res) => {
    Group.find({routeId: req.params.groupId})
    .then(result => res.json(result))
    .catch(err => res.json({message: err}))
})

router.post("/searchfilter", (req, res) => {
    const searchTerm = req.body.searchTerm;
    Group.find( {groupName: {"$regex": ""+searchTerm, "$options": "i"}})
    .then(groups => res.json(groups))
    .catch(err => console.log(err))
})

router.post("/updateLikes", verifyJWT, (req, res) => {
    const currentUser = req.user

    const groupName = req.body.groupName
    const courseURL = req.body.course.url

    Group.find(
        {groupName: groupName, "courses.url": courseURL},
        {"courses.$": 1},
    )
    .then(response => response[0].courses[0].likers)
    .then(likers => {
        likers.includes(currentUser.username) 
        ? updateLikeCount(-1, "pull")
        : updateLikeCount(1, "push")
    })

    function updateLikeCount(num, modifyListType) {
        Group.updateOne(
            {groupName: groupName, "courses.url": courseURL},
            {$inc: {"courses.$.likeCount": num}, [`$${modifyListType}`]: {"courses.$.likers": currentUser.username}},
            (updateRes) => updateRes
        )

        // update popularity level of each group
        if (modifyListType == "push") {
            Group.updateOne(
                {groupName: groupName},
                {$inc: {popularity: 1}},
                updateRes => updateRes
            )
        } else {
            Group.updateOne(
                {groupName: groupName},
                {$inc: {popularity: -1}},
                updateRes => updateRes
            )
        }
    }
})

router.post("/setHeartColors", verifyJWT, async (req, res) => {
    const heartColors = []
    const currentUser = req.user

    const group = await Group.find({routeId: req.body.groupId})
    for (course of group[0].courses) {
        course.likers.includes(currentUser.username)
        ? heartColors.push("red")
        : heartColors.push("none")
    }
    
    return res.json(heartColors)
})

router.post("/addComment", verifyJWT, async (req, res) => {

    // check if user has reached the comment limit
    const userList = await Group.aggregate([
        { $match: {groupName: req.body.groupName}},
        { $unwind: "$courses" },
        { $unwind: "$courses.comments" },
        { $match: {'courses.comments.author': {$eq: req.user.username}}},
    
        { $group: {
            _id: "$courses.comments.author",
            count: { $sum: 1 }
        }}
    ])
    const user = userList[0];
    if (user?.count >= 200 ) {
        return res.json({message: req.user.username + " has reached the comment limit of 200 comments per course bundle"})
    }


    let comment = req.body.text;
    comment = profanity.censor(comment);

    const commentDetails = {
        text: comment, 
        author: req.user.username, 
        authorPfp: req.user.pfp,
        id: uuidv1(),
    }

    Group.findOneAndUpdate(
        {groupName: req.body.groupName, "courses.url": req.body.courseURL},
        {"$push": {"courses.$.comments": commentDetails}},
        {new:true, useFindAndModify: false},
        (err, group) => {
            if (err) console.log(err)

            return res.json(group)
        }
    )
})

const logger = fs.createWriteStream('feedback.txt', {
    flags: "a"
})

router.post("/sendFeedback", (req, res) => {
    logger.write(req.body.feedback)
    logger.write("\n --------------- \n")
})


module.exports = router