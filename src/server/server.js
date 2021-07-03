if (process.env.NODE_ENV != 'production') require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const cors = require('cors')
const groupRoutes = require("./routes/groupRoutes")
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const path = require("path")

const app = express()

app.use(cors())
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '.../build')))
}

// use bodyparser middleware to receive form data
const urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json(), urlencodedParser)

app.use("/", groupRoutes)
app.use("/", authRoutes)
app.use("/", userRoutes)

// connects to mongoDB database
const dbURI = process.env.MONGODB_URI
mongoose.connect(dbURI, { useNewUrlParser:true, useUnifiedTopology:true })
    .then((res) => {
        // only listen for requests once database data has loaded
        app.listen(process.env.PORT || 5000, () => console.log("Server is up on port " + (process.env.PORT || 5000)))
    })
    .catch(err => console.log(err))