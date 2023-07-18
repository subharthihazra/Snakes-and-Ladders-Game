require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const cookieParser = require('cookie-parser');
// const connectDB = require("./utils/connectDB");


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
require("./utils/socket")(server);


const start = async () => {
    try {
      // connectDB
      // await connectDB(process.env.MONGO_URI);

      PORT = process.env.PORT || 9001
      server.listen(PORT, () => {
          console.log(`Server Listening at post ${PORT} ...`)
      })
      
      
    } catch (error) {
      console.log(error);
    }
  };
  
start();

module.exports = app;