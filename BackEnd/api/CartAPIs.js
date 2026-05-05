const userModel = require("../Models/userModel")
const {products} = require("../productData/data.json")

const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body; // Accept quantity with default 1

    const product = products.find(p => p.id === Number(productId));

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false
      });
    }
      
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: `User not found ${userId}`,
        success: false
      });
    }

    const existingCartItem = user.cart.find(
      item => item.productId === Number(productId)
    );

    if (existingCartItem) {
      existingCartItem.quantity += quantity; // Use the quantity from request
    } else {
      user.cart.push({ productId: Number(productId), quantity: quantity }); // Use the quantity from request
    }

    await user.save();

    res.status(200).json({
      message: "Product added to cart",
      success: true
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};
// Simplified addWithQuantity (if backend supports quantity)
const addWithQuantity = async (item) => {
  if (!isLogged) {
    toast.error("Please login to add items to cart");
    return;
  }

  try {
    const res = await fetch("http://localhost:8080/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ 
        productId: item.id,
        quantity: item.quantity // Send quantity to backend
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to add to cart");
    }

    // Refresh cart from backend
    await fetchCart();
    toast.success(`Added ${item.title} to cart`);
    
  } catch (err) {
    console.error("Error adding to cart:", err);
    toast.error(err.message || "Failed to add to cart");
  }
};
{/*  Go To  Cart */}

const goToCart = async (req,res) => {
    try{
        const user = await userModel.findById(req.user.id)
        
       const cartData = user.cart.map(item =>{
            const product = products.find(p => p.id === item.productId)

            return{
                ...product,
                quantity: item.quantity
            };
        });
        res.json(cartData)

    } catch(err){
        res.status(500).json({message:err.message})
    }
}

{/* Remove from  Cart */}

const removeFromCart = async (req, res) => { 
  const {productId} = req.body
  await userModel.findByIdAndUpdate(req.user.id,{
    $pull :{
        cart : {productId}
    }
  });
  res.json({message:"Removed From Cart"})
}

module.exports = {addToCart,goToCart,removeFromCart}