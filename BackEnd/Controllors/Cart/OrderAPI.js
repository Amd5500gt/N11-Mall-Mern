const orderModel = require("../../Models/orderModel")
const userModel = require("../../Models/userModel")


const createOrder = async(req,res) =>{
   try{


const {order} = req.body;

const newOrder = await orderModel.create({
    user:req.user._id,
    order,
})

// push to user

await userModel.findByIdAndUpdate(
    req.user._id,
{
    $push :{
        orders : newOrder._id
    },
}
);

 res.status(201).json({
    success: true,
    message:"Order Created",
    order: newOrder
 });
 } catch(err){
    console.log(err)
    res.status(500).json({
        success:false,
        message:"Something went wrong"
    });
 }
}


const getOrders = async(req,res) => {
       try{
          
        const orders = await orderModel.find({user:req.user._id}).sort({createdAt : -1})
         res.status(200).json({
            success: true,
            totalOrders: orders.length,
            orders
         })
       }catch(err){
        console.log(err)
        res.status(500).json({
            success: false,
            message:"Something went wrong",
        });
       }
};


module.exports = {createOrder,getOrders}