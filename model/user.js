
const mongoose=require("mongoose")
const schema=new mongoose.Schema({
    age:{
        type:Number,
        default:13
    },
    username:{
        type:String,
        required:[true,"please enter the name"],
        trim:true,
        maxlength:[20,"please enter char below 20"]
    },
    email:{
        type:String,
    }, 
    password:{
        type:String,
        required:[true,"please enter password"]
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "post"
      }]
// type: mongoose.Schema.Types.ObjectId Means “this field holds an ObjectId” (the native MongoDB ID type).      
//That posts field is you telling Mongoose “a User can have many Posts—and I want to store references to those Posts here.
})

module.exports=mongoose.model("user",schema) 