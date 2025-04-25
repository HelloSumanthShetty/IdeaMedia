
const mongoose=require("mongoose")
const postschema=new mongoose.Schema({
  //in this user id is stored 
  //after telling schema to store objectid ref connect both database 
  //it can extract info using .population()
  //aslo like is a array so when used population(likes) it will give use all the user that have like the post
user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
},
  date:{
   type:Date,
   default:Date.now
  },
  content:String,
  likes:{
type:Number,
default:0
  },
likedby:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
}]
})

module.exports=mongoose.model("post",postschema) 