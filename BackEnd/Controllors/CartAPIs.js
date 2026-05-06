const userModel = require("../Models/userModel");
const { products } = require("../productData/data.json");

// Add To Cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    // Check product exists
    const product = products.find(
      (p) => p.id === Number(productId)
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Find user
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check existing cart item
    const existingCartItem = user.cart.find(
      (item) => item.productId === Number(productId)
    );

    if (existingCartItem) {
      existingCartItem.quantity += Number(quantity);
    } else {
      user.cart.push({
        productId: Number(productId),
        quantity: Number(quantity),
      });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Product added to cart",
    });

  } catch (err) {
    console.log("Add To Cart Error:", err);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Go To Cart
const goToCart = async (req, res) => {
  try {

    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const cartData = user.cart.map((item) => {

      const product = products.find(
        (p) => p.id === item.productId
      );

      return {
        ...product,
        quantity: item.quantity,
      };
    });

    res.status(200).json({
      success: true,
      cart: cartData,
    });

  } catch (err) {
    console.log("Go To Cart Error:", err);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Remove From Cart
const removeFromCart = async (req, res) => {
  try {

    const { productId } = req.body;

    await userModel.findByIdAndUpdate(
      req.user.id,
      {
        $pull: {
          cart: {
            productId: Number(productId),
          },
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Removed from cart",
    });

  } catch (err) {
    console.log("Remove Cart Error:", err);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  addToCart,
  goToCart,
  removeFromCart,
};