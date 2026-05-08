const userModel = require("../Models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// Email/Password Registration
const RegisterUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        
        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            })
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long",
                success: false
            })
        }

        const lowerEmail = email.toLowerCase()
        
        // Check if user already exists
        const existUser = await userModel.findOne({ email: lowerEmail })
        if (existUser) {
            return res.status(409).json({
                message: "Email already exists. Please Login",
                success: false
            })
        }

        // Create new user
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new userModel({ 
            name, 
            email: lowerEmail, 
            password: hashedPassword,
            picture : null,
            googleAuth: false // Explicitly mark as email registration
        })
        
        await newUser.save()
     
          const token = jwt.sign(
            { userId: newUser._id.toString() , email: newUser.email },
            process.env.jwt_secret,
            { expiresIn: "72h" }
        )

        res.status(200).json({
            message: "Login successful!",
            success: true,
            token,
            data: {
                id: newUser._id.toString(),
                name: newUser.name,
                email: newUser.email,
                picture: newUser.picture || null
            }    
              })
      

    } catch (err) {
        console.error("Registration error:", err)
        res.status(500).json({
            message: "Internal server error. Please try again later.",
            success: false
        })
    }
}

// Email/Password Login
const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                success: false
            })
        }

        const existUser = await userModel.findOne({
            email: email.toLowerCase()
        })

        if (!existUser) {
            return res.status(404).json({
                message: "User not found. Please register first.",
                success: false
            })
        }

        // Check if user registered with Google
        if (existUser.googleAuth && !existUser.password) {
            return res.status(400).json({
                message: "This email is registered with Google. Please sign in with Google.",
                success: false
            })
        }

        const isMatch = await bcrypt.compare(password, existUser.password)

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid password. Please try again.",
                success: false
            })
        }

        const token = jwt.sign(
            { userId: existUser._id.toString(), email: existUser.email },
            process.env.jwt_secret,
            { expiresIn: "72h" }
        )

        res.status(200).json({
            message: "Login successful!",
            success: true,
            token,
            user: {
                id: existUser._id.toString(),
                name: existUser.name,
                email: existUser.email,
                picture: existUser.picture || null
            }
            
        })

    } catch (err) {
        console.error("Login error:", err)
        res.status(500).json({
            message: "Internal server error. Please try again later.",
            success: false
        })
    }
}

// Google Registration & Login (Combined)
const GoogleUser = async (req, res) => {
    try {
        const { credential } = req.body
        
        if (!credential) {
            return res.status(400).json({
                success: false,
                message: "Google credential is required"
            })
        }

        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        })

        const payload = ticket.getPayload()
        const { name, email, picture, sub: googleId } = payload

        // Check if user exists
        let user = await userModel.findOne({ email: email.toLowerCase() })
        
        if (!user) {
            // Create new user with Google auth
            user = await userModel.create({
                name: name,
                email: email.toLowerCase(),
                picture: picture,
                googleId: googleId,
                googleAuth: true,
                password: null // No password for Google auth users
            })
        } else {
            // If user exists but doesn't have Google auth, update their info
            if (!user.googleAuth) {
                user.googleAuth = true
                user.googleId = googleId
                user.picture = picture
                await user.save()
            }
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user._id.toString(), 
                email: user.email,
                googleAuth: user.googleAuth 
            },
            process.env.jwt_secret,
            { expiresIn: "72h" }
        )

        res.status(200).json({
            message: user.googleAuth && user.createdAt !== user.updatedAt ? 
                     "Login successful with Google!" : 
                     "Registration and login successful with Google!",
            success: true, 
            token,
            data: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                picture: user.picture
            }
        })

    } catch (err) {
        console.error("Google auth error:", err)
        res.status(500).json({
            success: false,
            message: "Google authentication failed. Please try again."
        })
    }
}

module.exports = {
    RegisterUser,
    LoginUser,
    GoogleUser
}