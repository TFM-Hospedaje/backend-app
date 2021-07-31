const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserModel = new Schema({
    email: String,
    username: String,
    password: String,
    code: String,
    active : {
        type: Boolean,
        default: false
    } 
})

const User = mongoose.model('User', UserModel)

module.exports = User


