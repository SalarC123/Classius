const express = require("express")
const Group = require("./models/groups.js")
const bcrypt = require("bcrypt")
const User = require("./models/users")
const jwt = require("jsonwebtoken")
const gravatar = require("gravatar")
const {registrationValidation, loginValidation} = require("./validation")
const ogs = require("open-graph-scraper")


const router = express.Router()

router.get("/", (req, res) => {
    res.send("Home Page")
})

router.get("/groups", (req, res) => {
    Group.find()
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

router.post("/creategroup", async (req, res) => {

    //CHECK WHICH USER CREATED THE GROUP AND ADD IT 
    // TO THEIR PROFILE (ADD POSTS TO USER SCHEMA)

    const courses = []

    for (courseURL of req.body.courses) {
        let ogData = {url: courseURL, likeCount: 0, likers: []};

        const res = await ogs({url: courseURL})
        const data = await res.result

        ogData.ogTitle = data.ogTitle
        ogData.ogImage = data.ogImage.url
        ogData.ogDesc = data.ogDescription
        ogData.ogSiteName = data.ogSiteName
        
        courses.push(ogData)
    }
    
    // creates group from Group model and saves it to the database
    async function createGroup() {
        const group = new Group({
            groupName: req.body.groupName,
            courses: courses,
            routeId: routify(req.body.groupName)
        })
    
        await group.save()
        return res.json({message: "Success", groupURL: routify(req.body.groupName)})
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
            bio: user.username.toLowerCase() + " has not set a bio yet"
        })

        dbUser.save()
        return res.json({message: "Success"})
    }
})

router.post("/updateLikes", verifyJWT, (req, res) => {
    const currentUser = req.user

    const groupName = req.body.groupName
    const courseUrl = req.body.course.url

    Group.find(
        {groupName: groupName, "courses.url": courseUrl},
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
            {groupName: groupName, "courses.url": courseUrl},
            {$inc: {"courses.$.likeCount": num}, [`$${modifyListType}`]: {"courses.$.likers": currentUser.username}},
            (updateRes) => updateRes
        )
    }
})

router.get("/u/:userId", verifyJWT,(req, res) => {
    const username = req.params.userId;

    User.findOne({username: username})
    .then(dbUser => res.json({
        username: dbUser.username, 
        canEdit: dbUser.username == req.user.username, 
        pfp: dbUser.pfp,
        bio: dbUser.bio
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


router.get("*", (req, res) => {
    return res.json("Page not found")
})

module.exports = router;