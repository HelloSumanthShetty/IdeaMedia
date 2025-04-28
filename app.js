const connectdb = require("./db/connect")
const bcrypt = require('bcrypt')
require('express-async-errors')
//const path=require('path')
const path = require('path')
const express = require("express")
const errorhandler = require("./middleware/error-handler")
require('dotenv').config()
const cookieparse = require('cookie-parser')
const router = require("./routes/user")
const notfound = require("./middleware/not-found")
const verifytoken = require("./middleware/verifytoken")
const user = require('./model/user')
const customeAPIError = require("./errors/customeAPIError")
const app = express()
const post = require("./model/post")

// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "view", "index.html"));
// });
app.use(express.static(path.join(__dirname, "view")))
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "view", "index.html"))
})
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "view", "login.html"))
})
app.use(cookieparse())
//make sure to use cookieparse it will always tell 
app.get("/profile", verifytoken, async (req, res) => {
    res.sendFile(path.join(__dirname, "view", "profile.html"))

})
app.get("/getall_detail", verifytoken, async (req, res) => {
    const posts = await user.find({}).limit(7).select("username posts").populate({ path: 'posts', options: { sort: { date: -1 } }, select: ("content likes date") })
    const globalposts = [];
   
    posts.forEach(userif => {
        userif.posts.forEach(info =>
 globalposts.push({
                username:userif.username,
                _id:info._id,
                content: info.content,
                likes: info.likes,
                date: info.date

            })

        )
    }) 


 
    res.json({
        
        posts: globalposts

    })
})

app.get("/profile_detail", verifytoken, async (req, res) => {

    const result = await user
        .findOne({ email: req.userses.email })
        .populate("posts")

    console.log({ profile_detail: result.username })
    res.status(200).json({
        username: result.username,
        email: result.email,
        posts: result.posts,

    })


})
app.get("/logout", (req, res) => {
    //cookie name is universal
    res.clearCookie("tokens", {
        httpOnly: true,
        secure: false,
        sameSite: "strict"
    })

    return res.redirect("/login")
})

app.use(express.json())

//tell the normal HTML form sends data, please understand it and put it nicely into req.body." 
//also only works for form 
app.use(express.urlencoded({ extended: true }))

app.use("/api", router)
app.use(notfound)

app.use(errorhandler)



const port = 3000
const start = async () => {
    app.listen(port, console.log(`server is listening at ${port}`))
    await connectdb(process.env.MONGO_URL)
}
start()
