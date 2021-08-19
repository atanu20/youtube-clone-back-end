const mongoose=require("mongoose")

const profileschema=new mongoose.Schema({
    channel:{
        type:String,
        require:true,
        trim:true,
        unique:true
    },
    profile_image:{
        type:String,
        require:true,
    },
    subscriber:{
        type: Number,
        default: 0
    },
    user_id:{
        type:String,
        require:true,
    }
})
const profileTable=new mongoose.model('profile',profileschema)
module.exports=profileTable