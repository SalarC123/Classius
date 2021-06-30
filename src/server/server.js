if (process.env.NODE_ENV != 'production') require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const cors = require('cors')
const groupRoutes = require("./routes/groupRoutes")
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")

const app = express()

app.use(cors())

// use bodyparser middleware to receive form data
const urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json(), urlencodedParser)

app.use("/", groupRoutes)
app.use("/", authRoutes)
app.use("/", userRoutes)

// connects to mongoDB database
const dbURI = `mongodb+srv://${process.env.MONGOUSERNAME}:${process.env.MONGOPASSWORD}@classius.zc7oh.mongodb.net/Classius?retryWrites=true&w=majority`
mongoose.connect(dbURI, { useNewUrlParser:true, useUnifiedTopology:true })
    .then((res) => {
        // only listen for requests once database data has loaded
        app.listen(process.env.SERVERPORT, () => console.log("Server is up on port " + process.env.SERVERPORT))
    })
    .catch(err => console.log(err))