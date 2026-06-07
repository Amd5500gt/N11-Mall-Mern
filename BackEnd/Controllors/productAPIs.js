const data = require("../productData/data.json")
const demodata = require("../productData/demodata.json")

const products = async (req, res) => {
  try {
    const email = req.user?.email;

    // Special user
    if (email === "jkhusshi95@gmail.com") {

      const specialProduct = data.products.find(
        p => p.id === 999
      );

      return res.json({
        success: true,
        products: specialProduct ? [specialProduct] : [],
        total: specialProduct ? 1 : 0
      });
    }

    // Normal users
    return res.json(data);

  } catch (err) {
    return res.status(500).json({
      message: "Server error"
    });
  }
};
 const productPage =(req, res) => {
     const id = req.params.id;
  // maan le products array hai
  const product = data.products.find(p => p.id === Number(id));

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);

}

module.exports = {products, productPage }