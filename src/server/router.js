const express = require("express")
const Group = require("./models/groups.js")
const bcrypt = require("bcrypt")
const User = require("./models/users")
const jwt = require("jsonwebtoken")
const gravatar = require("gravatar")
const {registrationValidation, loginValidation, groupValidation} = require("./validation")
const ogs = require("open-graph-scraper")

const router = express.Router()

router.get("/", (req, res) => {
    res.send("Home Page")
})

router.get("/groups", (req, res) => {
    Group.find().sort({popularity: "descending"}).limit(50)
    .then(groups => res.json(groups))
    .catch(err => console.log(err))
})

function verifyJWT(req, res, next) {
    // removes 'Bearer` from token
    const token = req.headers["x-access-token"]?.split(' ')[1]

    if (token) {
        jwt.verify(token, process.env.PASSPORTSECRET, (err, decoded) => {
            if (err) return res.json({isLoggedIn: false, message: "Failed To Authenticate"})
            req.user = {};
            req.user.id = decoded.id
            req.user.username = decoded.username
            req.user.pfp = decoded.pfp
            next()
        })
    } else {
        res.json({message: "Incorrect Token Given", isLoggedIn: false})
    }
}

router.get("/isUserAuth", verifyJWT, (req, res) => {
    return res.json({isLoggedIn: true, username: req.user.username})
})

router.get("/creategroup", (req, res) => {
    res.send("Create A New Group")
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

            const group = new Group({
                groupName: req.body.groupName,
                courses: courses,
                routeId: routifiedGroupName
            })
        
            await group.save()

            User.updateOne(
                {username: currentUser.username},
                {$push: {createdGroups: {groupName: req.body.groupName, url: "/g/" + routifiedGroupName}}},
                updateRes => updateRes
            )

            return res.json({message: "Success", groupURL: routifiedGroupName})
        } catch (err) {
            res.json({message: "Invalid URL provided"})
        }
    }

    // checks if group with same name has already been created
    Group.find( {groupName: req.body.groupName} )
        .then(response => response.length 
            ? res.json({message: "This name has already been used"})
            : createGroup()
        )
    })

router.get("/g/:groupId", (req, res) => {
    Group.find({routeId: req.params.groupId})
    .then(result => res.json(result))
    .catch(err => res.json({message: err}))
})

router.get("/searchfilter", (req, res) => {
    res.send("Search")
})

router.post("/searchfilter", (req, res) => {
    const searchTerm = req.body.searchTerm;
    Group.find( {groupName: {"$regex": ""+searchTerm, "$options": "i"}})
    .then(groups => res.json(groups))
    .catch(err => console.log(err))
})

router.get("/login", (req, res) => {
    res.send("login")
})

router.post("/login", (req, res) => {
    
    const userLoggingIn = req.body;

    if (!userLoggingIn) return res.json({message: "Server Error"})

    const validationError = loginValidation(userLoggingIn).error

    if (validationError) {
        return res.json({message: validationError.details[0].message})
    } else {
        User.findOne({username: userLoggingIn.username.toLowerCase()})
        .then(dbUser => {
            if (!dbUser) {
                return res.json({message: "Invalid Username or Password"})
            }
            bcrypt.compare(userLoggingIn.password, dbUser.password)
            .then(isCorrect => {
                if (isCorrect) {
                    const payload = {
                        id: dbUser._id,
                        username: dbUser.username,
                        pfp: dbUser.pfp
                    }
                    jwt.sign(
                        payload, 
                        process.env.PASSPORTSECRET,
                        {expiresIn: 86400},
                        (err, token) => {
                            return res.json({message: "Success", token: "Bearer " + token})
                        }
                    )
                } else {
                    return res.json({message: "Invalid Username or Password"})
                }
            })

        })
    }
})

router.get("/register", (req, res) => {
    res.send("register")
})

router.post("/register", async (req, res) => {
    const user = req.body;

    const takenUsername = await User.findOne({username: user.username.toLowerCase()})
    const takenEmail = await User.findOne({email: user.email.toLowerCase()})

    const validationError = registrationValidation(user).error

    if (validationError) {
        return res.json({message: validationError.details[0].message})
    } else if (takenUsername || takenEmail) {
        return res.json({message: "Username or email has already been taken"})
    } else {
        user.password = await bcrypt.hash(req.body.password, 10)

        const dbUser = new User({
            username: user.username.toLowerCase(),
            email: user.email.toLowerCase(),
            password: user.password,
            pfp: gravatar.url(user.email.toLowerCase(),  {s: '100', r: 'x', d: 'retro'}, true),
            bio: user.username.toLowerCase() + " has not set a bio yet",
            createdGroups: [],
        })

        dbUser.save()
        return res.json({message: "Success"})
    }
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

router.get("/u/:userId", verifyJWT, (req, res) => {
    const username = req.params.userId;

    User.findOne({username: username})
    .then(dbUser => res.json({
        username: dbUser.username, 
        canEdit: dbUser.username == req.user.username, 
        pfp: dbUser.pfp,
        bio: dbUser.bio,
        createdGroups: dbUser.createdGroups,
    }))
    .catch(err => res.json({
        username: "User Not Found", 
        canEdit: false, 
        pfp: "",
        bio: ""
    }))
})

router.get("/updateUserInfo", (req, res) => {
    res.json("updating user information...")
})

router.post("/updateUserInfo", verifyJWT, (req, res) => {
    User.updateOne(
        {username: req.user.username},
        {$set: {bio: req.body.newBio}},
        (updateRes) => updateRes
    )
})

router.post("/addComment", verifyJWT, (req, res) => {

    const commentDetails = {text: req.body.text, author: req.user.username, authorPfp: req.user.pfp}

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


router.get("*", (req, res) => {
    return res.json("Page not found")
})

module.exports = router;