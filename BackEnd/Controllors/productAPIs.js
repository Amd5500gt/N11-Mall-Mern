const data = require("../productData/data.json")
const demodata = require("../productData/demodata.json")
const myproduct = require("../productData/myproduct.json")

const products = async (req, res) => {
    try{  const email = req.user?.email;
 if(email ==="jkhusshi95@gmail.com"){
 return res.json(myproduct)
 }

      return  res.json(data)
    }
  catch (err) {
    return res.status(500).json({
      message: "Server error"
    });
  }

}
 const productPage =(req, res) => {
   const email = req.user?.email;
 if(email ==="jkhusshi95@gmail.com"){
  const product = myproduct.products.find(p => p.id === Number(id))

 return res.json(product)
 }

  const id = req.params.id;
 
  // maan le products array hai
  const product = data.products.find(p => p.id === Number(id));

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);

}

module.exports = {products, productPage }