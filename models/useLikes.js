const mongoose=require("mongoose")

const likeSchema=new mongoose.Schema({
    channel:{
        type:String,       
        
    },
    thumbimg:{
        type:String, 
    },
    title:{
        type:String, 
    },
    
    vid:{
        type:String, 
    },
   uid:{
        type:String,
       
    },
    date:{
        type: Date,
        default: new Date(),
    }
   
})
const likeTable=new mongoose.model('likevideo',likeSchema)
module.exports=likeTable