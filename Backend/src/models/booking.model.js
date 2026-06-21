const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    eventId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "event",
        required: true
    },
    status:{
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    paymentStatus:{
        type: String,
        enum: ['not_paid', 'paid'],
        default: 'not_paid'
    },
    amount: {
        type: Number,
        required: true
    }
}, {timestamps: true})

const bookingModel = mongoose.model("booking", bookingSchema)

module.exports = bookingModel