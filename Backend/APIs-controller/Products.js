
const products = require("../productData/data.json")


const  productData = (req,res) =>{
    try{
        res.json(products)
        console.log("Data Sent")
    }
    catch(err){
        res.json([])
         console.log(err)
    }
}

module.exports = productData