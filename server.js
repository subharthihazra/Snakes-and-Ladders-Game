require('dotenv').config()
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser');


// static assets
app.use(express.static('./public'))
// parse form data
app.use(express.urlencoded({ extended: false }))
// parse json
app.use(express.json())
// parse cookie
app.use(cookieParser());
//set view engine to ejs
app.set("view engine", "ejs")
//use express routers
const routers = require("./utils/router");
app.use("/", routers);

//include socket.io connections
require("./utils/socket");

PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log("Server Listening at post 5000 ...")
})