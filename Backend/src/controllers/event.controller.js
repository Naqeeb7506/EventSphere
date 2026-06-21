const eventModel = require("../models/event.model")

// get all events
async function getEvents(req, res) {
    try {
        const filters = {}

        if(req.query.search){
            filters.title = { $regex: req.query.search, $options: "i" }
        }
        if(req.query.category){
            filters.category = req.query.category
        }
        if(req.query.location){
            filters.location = req.query.location
        }
        if(req.query.ticketPrice){
            filters.ticketPrice = req.query.ticketPrice
        }

        const events = await eventModel.find(filters)

        return res.status(200).json({
            message: "Events fetched successfully",
            events
        })
    } catch (error) {
        return res.status(400).json({message: "Failed to fetch events"})
        console.log("Failed to fetch events", error)
    }
}

//get event by id
async function getEventById(req, res) {
    try {
        const {id} = req.params

        const event = await eventModel.findById(id)

        if(!event){
            return res.status(400).json({
                message: "Failed to fetch event"
            })
            console.log("Failed to fetch event", error)
        }

        return res.status(200).json({
            message: "Event fetched successfully",
            event
        })
    } catch (error) {
        return res.status(400).json({
                message: "Failed to fetch event"
            })
        console.log("Failed to fetch event", error)
    }
}

//create event
async function createEvent(req, res) {
    const {title, description, date, location, category, totalSeats, ticketPrice, imageUrl} = req.body

    try {
        const event = await eventModel.create({
            title,
            description,
            date,
            location,
            category,
            totalSeats,
            availableSeats: totalSeats,
            ticketPrice,
            imageUrl,
            createdBy: req.user._id
        })

        return res.status(201).json({
            message: "Event created successfully",
            event
        })

    } catch (error) {
        console.log("Failed to create event", error)

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: "Invalid event data",
                error: error.message
            })
        }

        return res.status(500).json({
            message: "Failed to create event",
            error: error.message
        })
    }    
}

//update event
async function updateEvent(req, res) {
    const {title, description, date, location, category, totalSeats, ticketPrice, imageUrl} = req.body

    try {

        const {id} = req.params

        const event = await eventModel.findByIdAndUpdate(id,{
            title,
            description,
            date,
            location,
            category,
            totalSeats,
            ticketPrice,
            imageUrl
        }, {new: true})

        if(!event){
            return res.status(400).json({
                message: "Event not found."
            })
        }

        return res.status(200).json({
            message: "Event updated successfully",
            event
        })

    } catch (error) {
        return res.status(500).json({
            message: "Failed to update event"
        })
        console.log("Failed to update event", error)
    }    
}

// delete event

async function deleteEvent(req, res) {
    try {
        const {id} = req.params

        const deleteEvent = await eventModel.findByIdAndDelete(id)

        if(!deleteEvent){
            return res.status(400).json({message: "Event not found"})
        }

        return res.status(200).json({
            message: "Event deleted successfully",
            deleteEvent
        })
    } catch (error) {
        return res.status(500).json({
            message: "Failed to delete event"
        })
        console.log("Failed to delete event", error)
    }
}


module.exports = {getEvents, getEventById, createEvent, updateEvent, deleteEvent}
