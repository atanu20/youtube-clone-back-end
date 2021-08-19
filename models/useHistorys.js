const mongoose=require("mongoose")

const hisSchema=new mongoose.Schema({
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
const hisTable=new mongoose.model('videohistory',hisSchema)
module.exports=hisTable