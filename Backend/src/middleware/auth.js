const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model")

// User authentication (whether user is logged in or not)
const protect = async (req, res, next) =>{
    const token = req.headers.authorization && req.headers.authorization.startsWith('Bearer') ? req.headers.authorization.split(' ')[1] : null;

    if(token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.user = await userModel.findById(decoded.id).select('-password');

            if(!req.user){
                return res.status(401).json({message: "Not authorized, no token"})
            }

            next()
        } catch (error) {
            return res.status(401).json({message: "Not authorized, no token"})
            console.log("Something went wrong", error)
        }
    }
    else{
        return res.status(401).json({message: "Not authorized, no token"})
    }
}

// To check whether the user is admin or not
const admin =  (req, res, next) =>{
    if(req.user && req.user.role === "admin"){
        next()
    }
    else{
        return res.status(401).json({message: "Not authorized, admin access required"})
    }
}

module.exports = {protect, admin}