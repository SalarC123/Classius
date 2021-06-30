const express = require('express')
const bcrypt = require("bcrypt")
const User = require("../models/users")
const verifyJWT = require("../verifyJWT")
const jwt = require("jsonwebtoken")
const gravatar = require("gravatar")
const {registrationValidation, loginValidation } = require("../validation")

const router = express.Router()

router.get("/isUserAuth", verifyJWT, (req, res) => {
    return res.json({isLoggedIn: true, username: req.user.username})
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

router.post("/register", async (req, res) => {
    const user = req.body;

    const takenUsername = await User.findOne({username: user.username.toLowerCase()})

    const validationError = registrationValidation(user).error

    if (validationError) {
        return res.json({message: validationError.details[0].message})
    } else if (takenUsername) {
        return res.json({message: "Username has already been taken"})
    } else {
        user.password = await bcrypt.hash(req.body.password, 10)

        const dbUser = new User({
            username: user.username.toLowerCase(),
            password: user.password,
            pfp: gravatar.url(user.username.toLowerCase(),  {s: '100', r: 'x', d: 'retro'}, true),
            bio: user.username.toLowerCase() + " has not set a bio yet",
            createdGroups: [],
        })

        dbUser.save()
        return res.json({message: "Success"})
    }
})

module.exports = router