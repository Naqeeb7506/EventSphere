const mongoose = require("mongoose")
const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const { sendOtpEmail } = require("../utils/email")
const otpModel = require("../models/otp.model")
const jwt = require("jsonwebtoken")


// generate token
const generateToken = (id, role) =>{
    return jwt.sign({id, role}, process.env.JWT_SECRET, {expiresIn: "7d"})
}

async function getUsers(req, res) {
    try {
        const users = await userModel.find()

         return res.status(200).json({
            message: "Users fetched successfully",
            users
        })
    } catch (error) {
        console.log("Failed to get users", error)
        return res.status(500).json({
            message: "Something went wrong."
        })
    }
}

async function deleteUser(req, res) {
    try {
        const {id} = req.params

        const deleteUser = await userModel.findByIdAndDelete(id)

        if(!deleteUser){
            return res.status(404).json({
                message: "User does not exist."
            })
        }

        return res.status(200).json({
            message: "User deleted successfully",
            deleteUser
        })
    } catch (error) {
        console.log("Failed to delete user", error)
        return res.status(500).json({
            message: "Failed to delete user"
        })
    }
}

async function registerUser(req, res) {
    const {name, email, password, role, isVerified} = req.body

    const user = await userModel.findOne({email})

    if(user){
        return res.status(409).json({message: "User already exists."})
    }

    try {
        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = await userModel.create({
            name, 
            email, 
            password: hashPassword, 
            role,
            isVerified: false
        })

        

        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        console.log(`OTP for ${email}: ${otp}`)

        await otpModel.create({email, otp, action:"account_verification"})

        await sendOtpEmail(email, otp, 'account_verification')

        return res.status(201).json({
            message: "User registered successfully. Please check your email for OTP to verify your account",
            newUser
        })

        
    } catch (error) {
        console.log("Failed to register user", error)
        return res.status(500).json({
            message: "Something went wrong."
        })
    }
}

async function loginUser(req, res) {
    const {email, password} = req.body

    const user = await userModel.findOne({email})

    if(!user){
        return res.status(400).json({
            message: "Invalid Credentials"
        })
    }

    const verifyPassword = await bcrypt.compare(password, user.password)
    if(!verifyPassword){
        return res.status(400).json({
            message: "Invalid Credentials"
        })
    }

    if(!user.isVerified && user.role === 'user'){
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await otpModel.deleteMany({email, action: 'account_verification'})
        await otpModel.create({email, otp, action: 'account_verification'})
        await sendOtpEmail(email, otp, 'account_verification')
        return res.status(403).json({
            message: "Account not verified. A new OTP has been sent to your email.",
            needsVerification: true
        })
    }

    res.json({
        message: "Login Sucessful",
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role)
    })
}

async function verifyOtp(req, res) {
    try {
        const {email, otp} = req.body || {}

        if(!email || !otp){
            return res.status(400).json({
                message: "Email and OTP are required."
            })
        }

        const otpRecord = await otpModel.findOne({email, otp, action: "account_verification"})

        if(!otpRecord){
            return res.status(400).json({message: "Invalid OTP"})
        }

        const user = await userModel.findOneAndUpdate(
            {email},
            {isVerified: true},
            {new: true}
        )

        if(!user){
            return res.status(404).json({
                message: "User not found."
            })
        }

        await otpModel.deleteMany({email, action: "account_verification"})

        return res.json({
            message: "Account verified successfully. You can now log in.",
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role)
        })
    } catch (error) {
        console.log("Failed to verify OTP", error)
        return res.status(500).json({
            message: "Failed to verify OTP"
        })
    }
}

module.exports = {getUsers, registerUser, deleteUser, loginUser, verifyOtp}
