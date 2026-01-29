const MenuItem= require('../schemas/MenuItem')

exports.createMenuItem= async (req,res) => {
    const {name , description , price , category,image, availiabilty}= req.body
    
    // validation
    if(!name || typeof name !=='string'){
        res.status(400).json({
            msg:"Error in name!"
        })
    }
    if(!description || typeof description !=='string'){
        res.status(400).json({
            msg:"Error in description!"
        })
    }
    if(!price || typeof price !=='number'){ 
        res.status(400).json({
            msg:"Error in price!"
        })
    }
    if(!category || typeof category !=='string'){
        res.status(400).json({
            msg:"Error in category!"
        })
    }
    if(availiabilty===undefined || typeof availiabilty !=='boolean'){
        res.status(400).json({
            msg:"Error in availiabilty!"
        })
    } 
     const menuitem= await MenuItem.create({name,description,price,category,image,availiabilty})
    if(!menuitem){
          res.status(400).json({
            msg:"Error in Menuitem!"
        })
    }
    return res.status(201).json({
            success: true,
            data: menuitem
        });
   
}

// update menuItem
const updateMenuItem= async(req,res)=>{
    
}