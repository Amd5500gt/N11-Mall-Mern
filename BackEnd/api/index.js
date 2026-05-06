const app = require("../index");
const cors = require("cors");
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://your-frontend.vercel.app"
  ]
}));
module.exports = (req, res) => {
  return app(req, res);
};