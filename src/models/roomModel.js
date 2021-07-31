const mongoose = require('mongoose')

const Schema = mongoose.Schema

const RoomModel = new Schema({
    name: String,
    people: Number,
    beds: Number,
    bathroom: String,
    network: Boolean,
    smokers: Boolean,
    prize: Number,
    photos: [String]
})

const Room = mongoose.model('Room', RoomModel)

module.exports = Room