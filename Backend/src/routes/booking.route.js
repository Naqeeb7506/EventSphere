const express = require("express")
const {protect, admin} = require("../middleware/auth")
const bookingController = require("../controllers/booking.controller")

const router = express.Router()

router.post("/", protect, bookingController.bookEvent)

router.post("/send-otp", protect, bookingController.sendBookingOtp)

router.get("/mybookings", protect, bookingController.getMyBookings)

router.put("/:id/confirm", protect, admin, bookingController.confirmBooking)

router.delete("/:id", protect, bookingController.cancelBooking)

module.exports = router
