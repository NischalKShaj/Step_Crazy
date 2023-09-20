// requiring the modules for the project
const express  = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const multer = require('multer')

// requiring the local modules for the project
const routerHome = require('./routes/userRoutes/home')
const userDb = require('./models/user/userDatabase')

// setting the express() as app
const app = express();

// setting up the port number
const port = 4000;

// connecting mongodb server
mongoose.connect("mongodb://localhost:27017/stepCrazyUser")
.then(()=>{
    console.log("Connection Success....");
})
.catch(()=>{
    console.log("Connection error....");
})

// setting up the ejs page
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'views'))



// setting up the routes
app.use('/',routerHome)



// running the project in the specified port number
app.listen(port,()=>{
    console.log(`Server started at the port ${port}`);
})