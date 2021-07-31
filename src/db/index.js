const mongoose = require('mongoose')
//mongodb://localhost:27017/tfm

mongoose.connect('mongodb+srv://Carlos:Qox91289@cluster0.zn0ou.mongodb.net/tfm')
.then((db) => console.log('DB Connected Sucessfully!'))
.catch((err) => console.log('Error during entablishing connection!'))
