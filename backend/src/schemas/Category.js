const mongoose= require('mongoose')

const category= mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    icon:{
        type:String
    },
    created_at:{
        type:Date,
        default:Date.now()
    },
    updated_at:{
        type:Date,
        default:Date.now()
    }
})