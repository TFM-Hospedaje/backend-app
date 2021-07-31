const express = require('express')

const cors = require('cors')
var env = require('node-env-file')
const path = require('path')
const router = require('./routes')
const cookieParser = require('cookie-parser')
//const jwt = require('express-jwt')

const app = express();
require('./db')

//Settings.
env(path.join(__dirname,'.env'))
app.set('port', process.env.PORT || 3500)

//Middleware.
app.use(cookieParser())

app.use(cors())


app.use(express.json())
app.use(express.urlencoded({extended:false}))

//Routes.
app.use(express.static(path.join(__dirname, '/../build')));
app.use(router)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/../build/index.html'));
  });


//Listen
app.listen(app.get('port'), () => {
    console.log(`Server listening on port ${app.get('port')}`)
})
