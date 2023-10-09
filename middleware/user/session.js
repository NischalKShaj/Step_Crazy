// session for user

const session = require("express-session");

module.exports = session({
    secret : ["secretkey","ufieufeifd","ahffjdsaj"],
    resave:false,
    saveUninitialized:true,
})
