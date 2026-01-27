const generate_token= require('../utils/token')
const User= require('../schemas/User')
const { use } = require('react')
exports.signUp= async (req,res) => {
    try {
            const{name, email , password}= req.body
    //checking for name validation

    if(!name || typeof name!=="string"){
         return res.status(401).json({
            message:"Invalid Signup credentials"
        })
    }

    // checking for email validation 
    if(!email || typeof email !== "string"){
        return res.status(401).json({
            message:"Invalid Signup credentials"
        })
    }
    if(!email.includes("@")){
         return res.status(401).json({
            message:"Invalid Signup credentials"
        })
    }

    // checking for password validaiton

    if(!password || typeof password !== "string"){
         return res.status(401).json({
            message:"Invalid Signup credentials"
        })
    }

    if(password.length<6){
         return res.status(401).json({
            message:"Invalid Signup credentials. password should be greater than 5 words"
        })
    }
    // frontend--router--authcontroller-signup--validation--userexists--usercreate--tokengeneration

    const user_exists= await User.findOne({email})

    if(user_exists){
         return res.status(401).json({
            message:"Invalid Signup credentials. User Exists already"
        })
    }

    const user= await User.userSchema({
        name,email,password
    })

    token= generate_token(user._id)


    return res.status(201).json({
      success: true,
      token
    })
    } catch (error) {
        res.status(401).json({
            message:"Error in the first try catch block"
        })
    }

}

exports.login = async (req,res) => {
    try {
        const {email, password}= req.body

    } catch (error) {
        res.status(401).json({
            msg:"Error in the login try catch block"
        })
    }
     if(!email || typeof email !== "string"){
        return res.status(401).json({
            message:"Invalid Signup credentials"
        })
    }
    if(!email.includes("@")){
         return res.status(401).json({
            message:"Invalid Signup credentials"
        })
    }

    // checking for password validaiton

    if(!password || typeof password !== "string"){
         return res.status(401).json({
            message:"Invalid Signup credentials"
        })
    }

    if(password.length<6){
         return res.status(401).json({
            message:"Invalid Signup credentials. password should be greater than 5 words"
        })
    }

    const userExists= await User.findOne({email})
    if(!userExists){
        return res.status(404).json({
            message:"USer does not exists. Please Signup"
        })
    }
    

    const match= User.matchpassword(password)

    if(!match){
         return res.status(401).json({
            message:"Password doesnot match"
        })
    }

    token= generate_token(userExists._id)
    
     return res.status(201).json({
      success: true,
      token
    })
}