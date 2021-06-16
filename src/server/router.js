const express = require("express")
const Group = require("./models/groups.js")
const bcrypt = require("bcrypt")
const User = require("./models/users")
const jwt = require("jsonwebtoken")

const router = express.Router()

router.get("/", (req, res) => {
    res.send("Home Page")
})

router.get("/courses", (req, res) => {
    Group.find()
    .then(groups => res.json(groups))
    .catch(err => console.log(err))
})

function verifyJWT(req, res, next) {
    const token = req.headers["x-access-token"].split(' ')[1]

    if (token) {
        jwt.verify(token, process.env.PASSPORTSECRET, (err, decoded) => {
            if (err) return res.json({isLoggedIn: false, message: "Failed To Authenticate"})
            req.user = {};
            req.user.id = decoded.id
            req.user.username = decoded.username
            next()
        })
    } else {
        res.json({message: "Incorrect Token Given", isLoggedIn: false})
    }
}

router.get("/isUserAuth", verifyJWT, (req, res) => {
    res.json({isLoggedIn: true, username: req.user.username})
})

router.get("/creategroup", (req, res) => {
    res.send("Create A New Group")
})


function routify(text) {
    // replaces spaces with dashes
    const lowerCaseText = text.toLowerCase()
    return lowerCaseText.replace(/ /g, "-")
}

router.post("/creategroup", (req, res) => {
    
    // creates group from Group model and saves it to the database
    function createGroup() {
        const group = new Group({
            groupName: req.body.groupName,
            courses: req.body.courses,
            routeId: routify(req.body.groupName)
        })
    
        group.save()
        res.json({message: "Created"})
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

router.get("/login", (req, res) => {
    res.send("login")
})

router.post("/login", (req, res) => {
    const userLoggingIn = req.body;

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
})

router.get("/register", (req, res) => {
    res.send("register")
})

router.post("/register", async (req, res) => {
    const user = req.body;

    const takenUsername = await User.findOne({username: user.username.toLowerCase()})
    const takenEmail = await User.findOne({email: user.email.toLowerCase()})

    if (takenUsername || takenEmail) {
        res.json({message: "Username or email has already been taken"})
    } else {
        user.password = await bcrypt.hash(req.body.password, 10)

        const dbUser = new User({
            username: user.username.toLowerCase(),
            email: user.email.toLowerCase(),
            password: user.password
        })

        dbUser.save()
        res.json({message: "Success"})
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


router.get("*", (req, res) => {
    res.json("Page not found")
})

module.exports = router;