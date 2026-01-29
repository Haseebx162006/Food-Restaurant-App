const mongoose= require('mongoose')

const menuItem=mongoose.Schema({
    name:{
        type:String,
        required: [true,"Every category should have a name"],
    },
    price:{
        type:Number,
        required: true,
        default: 0
    },
    category:{
        type:String,
        required:true,
    },
    description:{
        type: String,
        required:true
    },
    image: {
        type:String,
    },
    availability: {
        type:Boolean,
        required: true
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

module.exports=mongoose.model("menuitem",menuItem)