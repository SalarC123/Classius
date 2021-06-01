require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const Group = require("./models/groups")
const metaExtract = require("meta-extractor")
var cors = require('cors')

const app = express()
app.use(cors())

// connects to mongoDB database
const dbURI = `mongodb+srv://${process.env.MONGOUSERNAME}:${process.env.MONGOPASSWORD}@classius.zc7oh.mongodb.net/Classius?retryWrites=true&w=majority`
mongoose.connect(dbURI, { useNewUrlParser:true, useUnifiedTopology:true })
    .then((res) => {
        // only listen for requests once database data has loaded
        app.listen(process.env.PORT, () => console.log("Server is up on port " + process.env.PORT))
    })
    .catch(err => console.log(err))


// use bodyparser middleware to receive form data
const urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json(), urlencodedParser)


// routes
app.get("/courses", (req, res) => {
    Group.find()
    .then(groups => res.json(groups))
    .catch(err => console.log(err))
})

app.get("/creategroup", (req, res) => {
    res.send("Create A New Group")
})

app.post("/creategroup", (req, res) => {
    // creates group from Group model and saves it to the database
    function createGroup() {
        const group = new Group({
            groupName: req.body.groupName,
            courses: req.body.courses,
        })
    
        group.save()
    }

    // checks if group with same name has already been created
    Group.find( {groupName: req.body.groupName} )
        .then(res => res.length 
            ? console.log('this post has already been created')
            : createGroup()
        )
})