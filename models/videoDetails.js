const mongoose=require("mongoose")

const videoschema=new mongoose.Schema({
    channel:{
        type:String,
        require:true,
        trim:true,
       
    },
    profile_image:{
        type:String,
    },
    title:{
        type:String,
        trim:true,
        require:true

    },
    channelthumb:{
        type:String,
        trim:true,
        require:true
    },
    channelvideo:{
        type:String,
        trim:true,
        require:true
    },
    
    tags: {
        type:String,
        trim:true
    },
    
    likes: {
        type: Number,
        default: 0,
    },
    views:{
        type: Number,
        default: 0,
    },
    userid:{
        type:String,
        require:true,
    },
    createdAt: {
        type: Date,
        default: new Date(),
    }
})
const videoTable=new mongoose.model('video',videoschema)
module.exports=videoTable