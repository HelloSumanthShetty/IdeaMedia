const customeAPIError=require("../errors/customeAPIError")
const jwt=require("jsonwebtoken")
require('dotenv').config()
const verifytoken=(req,res,next)=>{
    const tokens=req.cookies.tokens;
    console.log(tokens)
    try{
    if(!tokens){
       return res.redirect("/login") 

    }
        const userverfy=jwt.verify(tokens,process.env.JWT_SECRET)
   console.log(userverfy)
        req.userses=userverfy;
         
    //   console.log(req.userses)
      next()
     }
     //req,users
//     user.id, user.username, user.email for identity

// user.role or user.permissions for authorization
    catch(error){
        throw new customeAPIError("cookie has expired",401)
    }
}
module.exports=verifytoken 