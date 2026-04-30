const express = require("express")
const server = express();
const cors = require("cors")

const products = require("./data.json")
server.use(cors({
     origin: "http://localhost:5173"
}))
server.get("/products", (req, res) => {
    try{

        res.json(products)
        console.log("Data Sent")
    }
    catch(err){
        res.json([{id:1,name:null,descipton:null,thumbnail:null}])
         console.log(err)
    }
});

server.listen(3000,()=> console.log("Server is Running"))

