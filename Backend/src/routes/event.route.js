const express = require("express")
const {protect, admin} = require("../middleware/auth")
const eventController = require("../controllers/event.controller")

const router = express.Router()

//Get all events
router.get("/", eventController.getEvents) 

//Get all event by ID
router.get("/:id", eventController.getEventById) 

// Create Event (Admin only)
router.post("/", protect, admin, eventController.createEvent)

// Update Event (Admin only)
router.put("/:id", protect, admin, eventController.updateEvent)

// Delet event (admin only)
router.delete("/:id", protect, admin, eventController.deleteEvent)

module.exports = router