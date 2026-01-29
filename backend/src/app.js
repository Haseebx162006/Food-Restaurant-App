const express= require('express')
const app= express()
const auth_routes= require('./routes/auth_routes')



app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/api/auth",auth_routes)
app.get('/', (req,res)=>{
    res.send("Helloooo kya hal ha theak ho")
})


module.exports= app