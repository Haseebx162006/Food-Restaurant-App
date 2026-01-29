const jwt= require('jsonwebtoken')


const generate_token= async (id) => {
    try {
        return await jwt.sign({id},process.env.SECRET_KEY,{
            expiresIn:"7d"
        })
    } catch (error) {
        console.log("Failed to generate token")
    }
}

module.exports= generate_token