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
    const {id}= req.params
    const {name, description, price, category, image, availiabilty}= req.body 
       if (name && typeof name !== 'string') {
            return res.status(400).json({ msg: "Name must be a string" });
        }
        if (description && typeof description !== 'string') {
            return res.status(400).json({ msg: "Description must be a string" });
        }
        if (price !== undefined && typeof price !== 'number') {
            return res.status(400).json({ msg: "Price must be a number" });
        }
        if (category && typeof category !== 'string') {
            return res.status(400).json({ msg: "Category must be a string" });
        }
        if (availiabilty !== undefined && typeof availiabilty !== 'boolean') {
            return res.status(400).json({ msg: "Availability must be a boolean" });
        }
        if (image  && typeof image !== 'string') {
            return res.status(400).json({ msg: "Availability must be a boolean" });
        }

        const menuItem= await MenuItem.findByIdAndUpdate(
            id,
            {
                name,price,description,category,availiabilty
            },
            {
                new:true,
                runValidators:true
            }
        )
         if (!menuItem) {
            return res.status(404).json({ msg: "Menu item not found" });
        }

        res.status(200).json({
            success: true,
            data: menuItem
        });

}


// deleting the item

const deleteItm = async(req,res)=>{
    const {id} = req.params

    const menuItem= await MenuItem.findByIdAndDelete(id)

    if(!menuItem){
        res.status(404).json({
            msg:"Error not found!"
        })
    }

}