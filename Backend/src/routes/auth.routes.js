const express = require("express")
const authController = require("../controllers/auth.controller")

const router = express.Router()

router.get("/users", authController.getUsers)
router.post("/register", authController.registerUser)
router.delete("/deleteUser/:id", authController.deleteUser)
router.post("/login", authController.loginUser)
router.post("/verify-otp", authController.verifyOtp)


module.exports = router