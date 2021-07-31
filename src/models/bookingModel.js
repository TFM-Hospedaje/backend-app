const mongoose = require('mongoose')

const Schema = mongoose.Schema

const BookingModel = new Schema({
    idRoom: String,
    idUser: String,
    dateI: String,
    dateF: String
})

const Booking = mongoose.model('Booking', BookingModel)

module.exports = Booking