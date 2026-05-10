const userModel = require("../Models/userModel");

const Address = async (req, res) => {
    try {
  
        const user = await userModel.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            address: user.address || {}
        })
    
    } catch (err) {
        console.log(err);
        return res.status(500).json(
            {
                success: false, message: "Failed to fetch address"
            });
    }

}
const updateAddress = async (req, res) => {
    try {
        const { name, phone, addressLine1, city, state, pincode } = req.body;
        const user = await userModel.findById(req.user.id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const newAddress  = {
            name,
            phone,
            addressLine1,
            city,
            state,
            pincode
        }
    
        user.address = newAddress
        
         await user.save()
          return res.status(200).json({
            message :"Address saved",
            success: true,
            address: newAddress
          })
    } catch (err) {
console.log(err);
 return res.status(500).json(
    { 
        success: false,
         message: "Failed to save address" 
        });
    }

}
module.exports = {Address, updateAddress}