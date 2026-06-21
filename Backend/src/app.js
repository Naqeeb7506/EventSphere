const express = require("express")
const cors = require("cors")
const authRoute = require("./routes/auth.routes")
const eventsRoute = require("./routes/event.route")
const bookingsRoute = require("./routes/booking.route")

const app = express()

// Routes
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use("/api/auth", authRoute)
app.use("/api/events", eventsRoute)
app.use("/api/bookings", bookingsRoute)

module.exports = app
