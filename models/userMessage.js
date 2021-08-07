const mongoose=require("mongoose")

const Msgschema=new mongoose.Schema({
    name:{
        type:String,
        require:true,
        trim:true,
       
    },
    profile_image:{
        type:String,
        require:true,
    },
    videoid:{
        type:String,
        require:true
    },
    message:{
        type:String,
        require:true,
        trim:true
    },
    usid:{
        type:String,
        require:true,
    },
    createdAt: {
        type: Date,
        default: new Date(),
    }
})
const msgTable=new mongoose.model('message',Msgschema)
module.exports=msgTable