const post = require("../model/post")
const bcrypt = require("bcrypt")
const user = require("../model/user")
const jwt = require('jsonwebtoken')
const path = require('path')
const customeAPIError = require('../errors/customeAPIError')

const verifytoken = require("../middleware/verifytoken")

require("dotenv").config()
const getall = async (req, res) => {
    try {

        const result = await user.find({})

        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)

    }
}

// const user_exist= async function(email){
//     const result= await user.find({})
//     let users=false;
//     result.push(result)
//     for(let i=0;i<result.length;i++){
//         if(result[i].email==email){
//             return users=true;
//         }

//     }
//     return users
// }


const createnew = async (req, res) => {
    //by default, Express does not catch promise rejections. Your throw becomes an unhandled promise rejection unless you either there use trycatch to handle ther error
    //also when using throw block make sure not use in synchronose fucntion no try and catch is used
    try {
        const { username, password, age, email } = req.body;
        console.log({ username, password, email })

        const userexist = await user.findOne({ email })
        console.log(email)
        console.log(userexist)
        //always remeber userexit is an object
        //if(userexit==email) x
        if (userexist) {

            throw new customeAPIError("user is already in db", 500)
            //    return res.status(400).json("user not found")    
        }
        //   if(await user_exist(email)){
        //     return res.json("user already exist in db")
        //   }

        const hashfun = await bcrypt.hash(password, 9)
        console.log(hashfun)
        const result = await user.create({ age, username, email, password: hashfun })
        const shh = process.env.JWT_SECRET
        console.log(shh)
        const tokens = jwt.sign({ userid: result._id, username: result.username, email: result.email }, shh, { expiresIn: '1h' })

        console.log(tokens)

        res.cookie("tokens", tokens, {
            httpOnly: true,
            secure: false, // set to true in production with HTTPS

            maxAge: 3600000 // 1 hour
        })

        res.redirect(('/profile'))

    } catch (error) {
        res.json(error.message)

    }
}


const loginuser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const users = await user.findOne({ email })
        if (!users) {
            return res.status(400).json("user not found")
        }
        const ismatch = await bcrypt.compare(password, users.password)
        if (!ismatch) {
            throw new customeAPIError("no user found", 401)
        }

        const tokens = jwt.sign({ userid: users._id, username: users.username, email: users.email }, process.env.JWT_SECRET, { expiresIn: '1h' })
        console.log(tokens)
        res.cookie("tokens", tokens, {
            httpOnly: true,
            secure: false,
            maxAge: 3600000
        })
        //res.status(200).json(users)
        res.redirect("/profile")
    } catch (error) {
        res.json(error.message)
    }
}
const exp = (req, res) => {
    res.json("this is not protected")
}
const createpost = async (req, res) => {
    const { content } = req.body;
    const result = await user.findOne({ email: req.userses.email })
    // console.log("createpost 1")
    //to extract the id
    const creating = await post.create({
        user: result._id,
        content: content
    })
    // console.log("creating post 2" + creating._id)

    result.posts.push(creating._id)
    await result.save()
    //to modify the changes we need .save()
    res.redirect('/profile')
}

const deletePost = async (req, res) => {
    // try {
    //     const postId = req.params.id;

    //     const postinfo = await post.findById(postId);

    //     if (!postinfo) {
    //      throw new customeAPIError("the post is not available or has been deleted",404);
    //     }

      
    //     if (postinfo.user.toString() !== req.userses.userid) {
    //         return res.status(403).json({ error: "Unauthorized action" });
    //     }

    //     // Remove post
    //     await post.findByIdAndDelete(postId);

    //     // Also remove reference from User.posts
    //     await user.findByIdAndUpdate(postinfo.user, { 
    //         $pull: { posts: postId }
    //     });

    //     res.json({ success: true, message: "Post deleted successfully" });
    // } catch (error) {
    //     res.status(500).json({ error: error.message });
    // }
    try {
        const thepost=req.params.id
        const postinfo=await post.findById(thepost)
        if(!postinfo){
            throw new customeAPIError("The post not found",404)
        }
        
        if(!postinfo.user.toString()==req.userses.userid){
            throw new customeAPIError("unautherized attement",403)
        }
        await post.findByIdAndDelete(postinfo)
await user.findByIdAndUpdate(req.userses.userId,{
    $pull:{post:thepost}
})
res.json({
    success:true,
    msg:"the post has been successfully deleted"
})
    } catch (error) {
        res.status(500).json(
        error.message
        )
    }
}

const editPost = async (req, res) => {
    // try {
    //     const postId = req.params.id;
    //     const { content } = req.body;

    //     const postinfo = await post.findById(postId);

    //     if (!postinfo) {
    //         return res.status(404).json({ error: "Post not found" });
    //     }

    //     // Only the owner can edit
    //     if (postinfo.user.toString() !== req.userses.userid) {
    //         return res.status(403).json({ error: "Unauthorized action" });
    //     }

    //     postinfo.content = content;
    //     await postinfo.save();

    //     res.json({ success: true, message: "Post updated successfully" });
    // } catch (error) {
    //     res.status(500).json({ error: error.message });
    // }
    try {
       const postid=req.params.id
    const userinfo=req.userses.userid;
    const postinfo=await post.findById(postid)
    if(!postinfo){
        throw new customeAPIError("the post has not been found",404)
    }
    if(postinfo.user.toString()!==userinfo){
    throw new customeAPIError("sorry you are not autherized",403)
    }
    const result=await post.findByIdAndUpdate(postid,req.body,{
        runValidators:true,
        new:true
    })

res.status(200).json(
    result
)
    } catch (error) {
        res.status(500).json(error.message)
        
    }
}
const deleteAccount = async (req, res) => {
 
    try {
        useracc=req.userses.userid
        const finduser=await user.findById(useracc)
        if(!finduser){
            throw new customeAPIError("the user don't exit",404)
        }
        await  post.deleteMany({user:useracc})
        await user.findByIdAndDelete(useracc)
        res.clearCookie("tokens")
        res.status(200).json({
            success:true,
            msg:"your account has been deleted"
        })
       } catch (error) {
        res.status(500).json(error.message)
       }
}



const likes = async (req, res) => {
    
        const id = req.params.id;
         console.log("thsid:" + id)
        
        // console.log("hello")
       const userinfo = req.userses.userid
  //   const userin=await user.findOne({userId})
       
    //     const userid = await user.findOne({ _id:userId });           
    //     const userinfo = userid._id
    //    console.log("new id"+userinfo,"new if"+userId)

    // console.log(userinfo)
        const postinfo = await post.findById(id)
         console.log("id:" + postinfo)
    
        const findif = postinfo.likedby.findIndex(id => id.toString() === userinfo.toString());
        let islikedbycurrentuser=false;

        // console.log("hey" + findif)
        if (findif === -1) {
            // User hasn't liked yet → like
            postinfo.likedby.push(userinfo);
            postinfo.likes += 1;
            islikedbycurrentuser=true;
        } else {
            // User already liked → unlike
            postinfo.likedby.splice(findif, 1);
            postinfo.likes -= 1;
            islikedbycurrentuser=false
        }
      //  console.log("user " + userid)
        //it a modification make sure to save it 
        await postinfo.save()

        //send the likes to the frontend 
        res.json({
            success:true,
            likes: postinfo.likes,
            likedby:postinfo.likedby,
         islikedbycurrentuser:islikedbycurrentuser
        })

    }
    



// const likes = async (req, res) => { 
//     //find the  post the user is liked
//     const id = req.params.id;
//     console.log(id)
//     //by who is it liked
//     console.log("hello")
//     const userid = await post.findOne({id:req.userses._id});
//     console.log("user "+userid)
//     //retreive the post that has been liked
//     const postinfo = await post.findById(id)
//     console.log("id:"+id)
//     //find if the userid has already liked
//     const findif = postinfo.likedby.indexOf(userid)
//     console.log("hey"+findif)
//     if (findif === -1) {
//         //if there is no likes
//         //also keep in mind this only works if there is no like or no likes
//         postinfo.likedby.push(userid)
//         postinfo.likes += 1


//     }
//     else {
//         //slice removethe
//         postinfo.likedby.splice(findif, 1);
//         postinfo.likes -= 1
//     }
//     console.log("user "+userid)
//     //it a modification make sure to save it 
//     await postinfo.save()

//     //send the likes to the frontend
//     res.josn({
//         msg:"successs",
//         likes:post.likes
//     })

// }

module.exports = {
    getall,
    createnew,
    deletePost,
    createpost,
    loginuser,
    exp,
    likes,
    deleteAccount,
    editPost
}