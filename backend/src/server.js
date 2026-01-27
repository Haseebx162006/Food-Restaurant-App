require('dotenv').config()
const app= require('./app')
const db= require('./configs/database')
db()

app.listen(process.env.PORT || 5000, ()=>{
    console.log("Server connected Sucessfully")
})