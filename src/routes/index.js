const express = require('express')
const controllers = require('../controllers')
const jwt = require('jsonwebtoken')
var path = require('path');

const router = express.Router()
//const app = express();

//Authentication Middleware
const authenticateJWT = (req,res,next) => {
    //req.headers.authorization
    const authHeader = req.cookies.accessToken

    if(authHeader) {
        //const token = authHeader.split(' ')[1]
        const token = authHeader
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if(err) {
                return res.sendStatus(403)
            }
            req.user = user
            next()
        })

    } else {
        res.sendStatus(401)
    }
}

//app.use(express.static(path.join(__dirname, 'build')));

//router.get('/*', (req,res) => {
  //res.sendFile(path.join(__dirname, '../../build', 'index.html'))
//})
//AUTH
//
router.get('/users/auth', controllers.authController.checkAuth)


//USERS
router.post('/users/create', controllers.userController.createUser)
router.get('/users/confirm/:code', controllers.userController.confirmUser)
router.post('/users/login', controllers.userController.loginUser)
router.get('/users/logout', authenticateJWT, controllers.userController.logoutUser)
router.post('/users/sendMessage', controllers.userController.sendMessage)

//BOOKINGS
router.post('/bookings/search', authenticateJWT, controllers.bookingController.searchRooms)
router.get('/bookings/room/:id', authenticateJWT, controllers.bookingController.getRoomData)
router.post('/bookings/saveBooking', authenticateJWT, controllers.bookingController.saveBooking)
router.get('/bookings/getBookingsByUserId/:id', authenticateJWT, controllers.bookingController.getBookingsByUserId)
router.get('/bookings/getBookingById/:id', authenticateJWT, controllers.bookingController.getBookingById)

//USER
router.get('/user/data', authenticateJWT, controllers.userController.getUserData)
router.post('/user/editProfile', authenticateJWT, controllers.userController.editProfile)
router.get('/user/cancelBooking/:id', authenticateJWT, controllers.userController.cancelBooking )
router.delete('/user/removeAccount/:id', authenticateJWT, controllers.userController.removeAccount )

module.exports = router
