const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "72h" }
  );
};

// Send User Response
const sendUserResponse = (res, statusCode, message, user) => {
  const token = generateToken(user);

  return res.status(statusCode).json({
    success: true,
    message,
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      picture: user.picture || null,
      googleAuth: user.googleAuth || false,
    },
  });
};

// ================= REGISTER =================
const RegisterUser = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    // Existing User Check
    const existUser = await userModel.findOne({ email });

    if (existUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
      picture: null,
      googleAuth: false,
    });

    return sendUserResponse(
      res,
      201,
      "Registration successful",
      newUser
    );

  } catch (err) {
    console.error("Register Error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ================= LOGIN =================
const LoginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    email = email.trim().toLowerCase();
    password = password.trim();

    // Find User
    const existUser = await userModel.findOne({ email });

    // User Not Found
    if (!existUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Google Auth Check
    if (existUser.googleAuth && !existUser.password) {
      return res.status(400).json({
        success: false,
        message: "Please login with Google",
      });
    }

    // Compare Password
    const isMatch = await bcrypt.compare(
      password,
      existUser.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    return sendUserResponse(
      res,
      200,
      "Login successful",
      existUser
    );

  } catch (err) {
    console.error("Login Error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ================= GOOGLE AUTH =================
const GoogleUser = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
    }

    // Verify Google Token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
console.log(process.env.GOOGLE_CLIENT_ID)
    const payload = ticket.getPayload();

    const {
      name,
      email,
      picture,
      sub: googleId,
      email_verified,
    } = payload;

    // Email Verification Check
    if (!email_verified) {
      return res.status(400).json({
        success: false,
        message: "Google email not verified",
      });
    }

    const lowerEmail = email.toLowerCase();

    // Existing User
    let user = await userModel.findOne({
      email: lowerEmail,
    });

    // Prevent Account Merge
    if (user && !user.googleAuth) {
      return res.status(400).json({
        success: false,
        message:
          "This email is already registered with email/password",
      });
    }

    // Create New User
    if (!user) {
      user = await userModel.create({
        name: name.trim(),
        email: lowerEmail,
        picture,
        googleId,
        googleAuth: true,
        password: null,
      });
    }

    return sendUserResponse(
      res,
      200,
      "Google authentication successful",
      user
    );

  } catch (err) {
    console.error("Google Auth Error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Google authentication failed",
    });
  }
};

module.exports = {
  RegisterUser,
  LoginUser,
  GoogleUser,
};