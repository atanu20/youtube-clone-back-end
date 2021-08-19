const express=require('express')
const mongoose = require('mongoose');
const cors=require('cors')
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const fileUpload=require("express-fileupload");
const fs = require('fs');
const path = require('path');
const random = require('random')
const saltRounds = 10;
var router = express.Router();
const PORT =process.env.PORT || 8000;
require("./db/config")
const userDetailsTable=require('./models/userDetails')
const profileTable=require('./models/userProfile')
const videoTable=require('./models/videoDetails')
const subTable=require('./models/userSubscriber')
const msgTable=require('./models/userMessage')
const hisTable=require('./models/useHistorys')
const likeTable=require('./models/useLikes')
const app=express()
app.use(cors({
    origin: "*"
}))
app.use(express.json())
app.use(fileUpload())

app.use("/profile", express.static(path.join(__dirname, "public/profile")));
router.get("/",(req,res)=>{
    res.send("hii")
})
router.post("/register", async (req,res)=>{
   
    try{
        const exist=await userDetailsTable.findOne({email:req.body.email})
        if(exist)
        {
            res.send({msg:"email already exist"})
        }
        else{
            const password=req.body.password;
            bcrypt.hash(password,saltRounds,async (err,hash)=>{
                const usedet=new userDetailsTable({username:(Math.random() + 1).toString(36).substring(7),name:req.body.name,email:req.body.email,password:hash})
              const resu= await usedet.save();
            res.status(201).send({status:true,msg:"registe done"})
            })

            
        }
        

    }catch(err){
        console.log(err)
    }
})

const verifyJwt=(req,res,next)=>{
    const token=req.headers["x-access-token"]

    if(!token)
    {
        res.send({login:false,msg:"need token"});
    }
    else{
        jwt.verify(token,'youtubeclone',(err,decoded)=>{
            if(err)
            {
                res.send({login:false,msg:"need to token"});
            }
            else{
                req.userID=decoded.id;
                next();
            }
        })
    }
}

router.get("/isAuth",verifyJwt,(req,res)=>{
    res.send({login:true,msg:"done"});
})



router.post("/login",async(req,res)=>{
   try{
    const email=req.body.email;
    const password=req.body.password;
    const exist=await userDetailsTable.findOne({email:email})
    
    if(exist)
    {
    
        bcrypt.compare(password, exist.password,  (errr,response)=>{
            if(response)
            {
               
               const id=exist._id;
            //    console.log(id)
               const token=jwt.sign({id},"youtubeclone",{
                   expiresIn:60*60*24,
               })
               res.status(200).send({login:true,token:token,username:exist.username,name:exist.name,userID:exist._id,userEmail:exist.email})
                // res.send({login:true,username:exist.username})

            }
            else{
             res.send({login:false,msg:"Wrong Password"});
            
            }
        })
        
    }else{
        res.send({login:false,msg:"invalid email"})
    }


   }catch(err){
    console.log(err)
   }
})

router.post("/profile",async (req,res)=>{
    

    try{
         const exist=await profileTable.findOne({channel:req.body.channel})
        if(exist){
            res.send({msg:"This channel already exist"})
        }
        else{
                  
                
                const usedet=new profileTable({channel:req.body.channel,profile_image:req.body.profileimg,user_id:req.body.user_id})
                const resu= await usedet.save();
            //   res.status(201).send({msg:"Profile done"})   
            res.json({submit:true,msg:"done"})
               
         
        }
        

    }catch(err){
        console.log(err)
    }

})
router.get("/profiledata/:id",async(req,res)=>{
    const id=req.params.id
    try{
        const exist=await profileTable.find({user_id:id})
        // console.log(exist)
        if(exist)
        {
            res.send(exist)
        }else{
            res.send({status:false})
        }

    }catch(err)
    {
        console.log(err)
    }

})
router.post("/addvideo",async(req,res)=>{
    try{
        // videoTable
        const usedet=new videoTable({channel:req.body.channel,profile_image:req.body.profile_image,title:req.body.title,channelthumb:req.body.urlthumb,channelvideo:req.body.url,tags:req.body.tag,userid:req.body.userid})
        const resu= await usedet.save();
        res.json({submit:true,msg:"done"})

    }catch(err)
    {
        console.log(err)
    }
})
router.get('/getidvideo/:id',async(req,res)=>{
    const id=req.params.id
    try{
        const exist=await videoTable.find({_id:id})
        // console.log(exist)
        if(exist)
        {
            res.send(exist)
        }else{
            res.send({status:false})
        }

    } catch(err){
        console.log(err)
    }
})
router.get('/getvideo/:id',async(req,res)=>{
    const id=req.params.id
    try{
        const exist=await videoTable.find({userid:id})
        // console.log(exist)
        if(exist)
        {
            res.send(exist)
        }else{
            res.send({status:false})
        }

    } catch(err){
        console.log(err)
    }
   
})

router.get("/videomsg/:vid",async(req,res)=>{
    
    try{
        const vid=req.params.vid
        const exist=await msgTable.find({videoid:vid})
        
        
            res.send(exist)
       

    } catch(err){
        console.log(err)
    }
})

router.get('/getallvideo',async(req,res)=>{
    try{
        const exist=await videoTable.find()
        // console.log(exist)
        if(exist)
        {
            res.send(exist)
        }else{
            res.send({status:false})
        }
    }catch(err)
    {
        console.log(err)
    }
})

router.post('/subscribe',async(req,res)=>{
    try{
        const channel=req.body.channel
        const post = await profileTable.findOne({channel:channel});
        // console.log(post)
     const updatedPost = await profileTable.findByIdAndUpdate({_id:post._id}, { subscriber: post.subscriber + 1 }, { new: true });
    
    
        const usedet=new subTable({channel:req.body.channel,uid:req.body.userid})
        const resu= await usedet.save();
        res.json({submit:true,msg:"done"})

    }catch(err)
    {
        console.log(err)
    }
    
})


router.post('/checksubscribe',async(req,res)=>{
    try{
        const channel=req.body.channel
        const uid=req.body.uid
        
        const post = await subTable.findOne({channel:channel,uid:uid});
        // console.log(post)
        if(post)
        {
            res.json({status:true})
        }
        else{
            res.json({status:false})
        }
       
       

    }catch(err)
    {
        console.log(err)
    }
    
})


router.post('/dolike',async(req,res)=>{
    try{
        const videoid=req.body.videoid
        
        const post = await videoTable.findOne({_id:videoid});
     const updatedPost = await videoTable.findByIdAndUpdate({_id:videoid}, { likes: post.likes + 1 }, { new: true });
    
    
       
        res.json({submit:true,msg:"done"})

    }catch(err)
    {
        console.log(err)
    }
    
})

router.get('/postidviews/:vid',async(req,res)=>{
    try{
        const videoid=req.params.vid
        
        const post = await videoTable.findOne({_id:videoid});
     const updatedPost = await videoTable.findByIdAndUpdate({_id:videoid}, { views: post.views + 1 }, { new: true });
    
    
       
        res.json({submit:true,msg:"done"})
    }catch(err)
    {
        console.log(err)
    }
})
router.post('/checktotalsub',async(req,res)=>{
    try{
        const channel=req.body.channel
        
        const post = await profileTable.findOne({channel:channel});
        if(post)
        {
            res.send(post)
        }
    }
    catch(err){
        console.log(err)
    }
})
router.get("/getmychannel/:myid",async(req,res)=>{
    try{
        const myid=req.params.myid
        const post = await profileTable.findOne({user_id:myid});
        if(post)
        {
            res.send(post)
        }

    }
    catch(err){
        console.log(err)
    }
})








//         const ress=await userDetailsTable.aggregate([
//             {
//                 $match:{'_id':myid}
//             },
//             {
//                 $loopup:{
//                     from:"profiles",
//                     localField:"_id",
//                     foreignField:"user_id",
//                     as : "user_all_det"
//                 }
//             },
//             {
//                 $project:{
//                         "name":1,
//                         "profile_image":1
//                   }
//             }
//         ])
//    console.log(ress)



router.get('/myalldata/:myid',async(req,res)=>{
    try{
        const myid=req.params.myid
        const userdetails=await userDetailsTable.findOne({_id:myid});
        const profiles=await profileTable.findOne({user_id:myid});
       if(profiles)
       {
        res.send({name:userdetails.name,profile_image:profiles.profile_image})
       }else{
        res.send({name:userdetails.name,profile_image:""})
       }
       

    }
    catch(err){
        console.log(err)
    }
})


router.post("/postmsg",async(req,res)=>{
    try{
        // msgTable
        
        const usedet=new msgTable({name:req.body.name,profile_image:req.body.profile_image,videoid:req.body.videoid,message:req.body.message,usid:req.body.usid})
        const resu= await usedet.save();
        res.json({submit:true,msg:"done"})
    }
    catch(err){
        console.log(err)
    }

})

router.get('/mymsgdata/:vvid',async(req,res)=>{
    try{
        const vvid=req.params.vvid
        const post = await msgTable.find({videoid:vvid});
        res.send(post)
        // if(post)
        // {
        //     res.send(post)
        // }
        // else{
        //     res.send({status:false})
        // }
    }
    catch(err){
        console.log(err)
    }
})





router.post("/savehistory",async(req,res)=>{
    try{
        // hisTable
        const vid=req.body.vid
        const post = await videoTable.findOne({_id:vid});
        // console.log(post)
        const usedet=new hisTable({channel:post.channel,thumbimg:post.channelthumb,title:post.title,vid:vid,uid:req.body.uid})
        const resu= await usedet.save();
        res.json({submit:true,msg:"done"})

    }
    catch(err){
        console.log(err)
    }
})

router.get("/gethistory/:uid",async(req,res)=>{
    try{
        // hisTable
        const uid=req.params.uid
        const post = await hisTable.find({uid:uid});
        res.send(post)
    }
    catch(err){
        console.log(err)
    }
})

router.get("/getlikes/:uid",async(req,res)=>{
    try{
        // likeTable
        const uid=req.params.uid
        const post = await likeTable.find({uid:uid});
        res.send(post)
    }
    catch(err){
        console.log(err)
    }
})


router.post("/savelike",async(req,res)=>{
    try{
        // hisTable
        const vid=req.body.vid
        const post = await videoTable.findOne({_id:vid});
        // console.log(post)
        const usedet=new likeTable({channel:post.channel,thumbimg:post.channelthumb,title:post.title,vid:vid,uid:req.body.uid})
        const resu= await usedet.save();
        res.json({submit:true,msg:"done"})

    }
    catch(err){
        console.log(err)
    }
})

router.post('/checklike',async(req,res)=>{
    try{
        const vid=req.body.vid
        const uid=req.body.uid
        
        const post = await likeTable.findOne({vid:vid,uid:uid});
        // console.log(post)
        if(post)
        {
            res.json({status:true})
        }
        else{
            res.json({status:false})
        }
       
       

    }catch(err)
    {
        console.log(err)
    }
    
})


router.get("/search/:text",async(req,res)=>{
    try{
        // likeTable
        let text=req.params.text
        // const data= `/${text}/i`
        //   console.log(text)
        
        // const post = await videoTable.find({title:{
        //   $regex: new RegExp(text,'i')
        // }});

        const post=await videoTable.find({ $or: [ { 
            title:{
                  $regex: new RegExp(text,'i')
                }
         }, { 
            tags:{
                $regex: new RegExp(text,'i')
              }

          } ] }).limit(20)

        res.send(post)
    }
    catch(err){
        console.log(err)
    }
})


app.use(router)

app.listen(PORT,()=>{
    console.log(`App running on ${PORT}`)
})