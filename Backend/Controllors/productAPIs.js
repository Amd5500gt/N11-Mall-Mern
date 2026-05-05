const data = require("../productData/data.json")
const demodata = require("../productData/demodata.json")


const products = async (req, res) => {
    try{

        res.json(data)
    }


  catch (err) {
    return res.status(500).json({
      message: "Server error"
    });
  }
}

module.exports = products