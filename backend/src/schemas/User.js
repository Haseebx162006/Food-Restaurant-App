const mongoose= require('mongoose')
const bcrypt= require('bcrypt')
exports.userSchema= mongoose.Schema({
    name:{
        type:String,
        required:[true,"name is required"]
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        lowercase:true
    },
    password:{
        type: String,
        required:[true,"password is required"]
    },
    created_at:{
        type:Date,
        default:Date.now()
    },
    role:{
        type:String,
        enum:["admin","customer"],
        default:"customer"
    }
})
userSchema.pre("save", async function (){
    if(!this.isModified("password")){
        return 
    }
    const salt = await bcrypt.genSalt(10)
    this.password= await bcrypt.hash(this.password,salt)
})

userSchema.methods.matchpassword= async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password)
}

module.exports=mongoose.model("user",userSchema)