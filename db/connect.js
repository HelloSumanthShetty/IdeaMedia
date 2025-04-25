const mongoose = require('mongoose');

const connectDB=async (url)=>{
 console.log("connecting to the DB...")
 const db=await mongoose.connect(url)
 console.log("connected")
}
module.exports=connectDB