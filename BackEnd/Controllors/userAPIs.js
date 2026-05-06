const userModel = require("../Models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
const RegisterUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const lowerEmail = email.toLowerCase()
        const existUser = await userModel.findOne({ email:lowerEmail })
        if (existUser) {
            return res.status(409).json(
                { message: "Email already exists",
                 success: false }
            )
        }
        const newUser = new userModel({ name, email: lowerEmail, password })
        newUser.password = await bcrypt.hash(password, 10);
        await newUser.save();
        res.status(201)
            .json({
                message: "Register Success",
                success: true
            })

    } catch (err) {
      return  res.status(500)
            .json({
                message: "Internel server error",
                success: false
            })
    }
}

const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields required",
        success: false
      });
    }

    const existUser = await userModel.findOne({
      email: email.toLowerCase()
    });

    if (!existUser) {
      return res.status(400).json({
        message: "User doesn't exist",
        success: false
      });
    }

    const isMatch = await bcrypt.compare(password, existUser.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Wrong password",
        success: false
      });
    }

    const token = jwt.sign(
      { email: existUser.email, id: existUser._id },
      process.env.jwt_secret,
      { expiresIn: "72h" }
    );

    res.status(200).json({
      message: "Login Success",
      success: true,
      token,
      id:existUser._id,
      name: existUser.name,
      email: existUser.email
    });

  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};

const GoogleUser = async (req,res) =>{
    try{
      const { credentail } = req.body;
      const ticket = await client.verifyIdToken({
        idToken: credentail,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const playload = ticket.getPayload();
      const { name,email, picture } = playload

      let user = await userModel.findOne({email});
    
      //// Create User
      if(!user) {
        user  = await userModel.create({
          name,
          email,
          picture,
          googleAuth: true
        });

      }

      //JWT token
       const token = jwt.sign(
        { userId : user._id },
        process.env.jwt_secret,
        {expiresIn: "72h"}    
       );


       res.status(200).json({
      message: "Login Success",
      success: true,
      token,
      id: user.id,
      name: user.name,
      email: user.email
       })
    
  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: "Google Login Failed"
    });

  }

};




module.exports = {
    RegisterUser,
    LoginUser,
    GoogleUser
}