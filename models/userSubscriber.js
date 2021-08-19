const mongoose=require("mongoose")

const subSchema=new mongoose.Schema({
    channel:{
        type:String,
        
        
    },
   uid:{
        type:String,
        require:true,
    }
   
})
const subTable=new mongoose.model('subscriber',subSchema)
module.exports=subTable