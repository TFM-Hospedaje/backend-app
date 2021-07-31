const models = require('../models')
const nodemailer = require('nodemailer')

const searchRooms = async (req,res) => {
    try {
        if(req.body.banos === 'indiferente') {
            let rooms = await models.roomModel.find({people:req.body.personas})
            const books = await models.bookingModel.find({'$or' : [
                    {dateI : {$lte: req.body.fechaIni},dateF:{$gte: req.body.fechaIni}},
                    {dateI : {$lte: req.body.fechaFin},dateF:{$gte: req.body.fechaFin}},
                    {dateI : {$gte: req.body.fechaIni},dateF:{$lte: req.body.fechaFin}}
            ]})
    
            const booksIds = books.map(book => book.idRoom)
            const result = rooms.filter(room => !(booksIds.includes(`${room._id}`)))
            
            
            res.send({
                status: 'success',
                data : [...result],
                code: 200
            })
        } else {
            let rooms =  await models.roomModel.find({people:req.body.personas,bathroom:req.body.banos})
            const books = await models.bookingModel.find({'$or' : [
                {dateI : {$lte: req.body.fechaIni},dateF:{$gte: req.body.fechaIni}},
                {dateI : {$lte: req.body.fechaFin},dateF:{$gte: req.body.fechaFin}},
                {dateI : {$gte: req.body.fechaIni},dateF:{$lte: req.body.fechaFin}}
            ]})
            
            const booksIds = books.map(book => book.idRoom)
            const result = rooms.filter(room => !(booksIds.includes(`${room._id}`)))
    
            res.send({
                status: 'success',
                data: [...result],
                code: 200
            })
        }
    } catch(err) {
        res.send({
            status: "failed",
            data: err,
            code: 500
        })
    }
}

const getRoomData = async(req,res) => {
    try {
        const room = await models.roomModel.findById(req.params.id)
        res.send({
            status: 'sucess',
            data: room,
            code: 200
        })
    } catch(err) {
        res.send({
            status: "failed",
            data: err,
            code: 500
        })
    }
}

const saveBooking = async (req,res) => {
    
    try {
        const regexMobile = /^(\+34|0034|34)?[6789]\d{8}$/
        console.log(req.body.idRoom)
        if(req.body.user.nombre !== '' && req.body.user.apellidos !== '' && req.body.telefono !== '') {
            const booking = await models.bookingModel.find({idRoom: req.body.idRoom, idUser: req.body.idUsuario, dateI: req.body.fechaInicio, dateF: req.body.fechaFin})
            if(booking.length === 0) {
                const room = await models.roomModel.findById(req.body.idRoom)

                if(regexMobile.test(req.body.user.telefono)) {
                    const booking = new models.bookingModel({
                        idRoom: req.body.idRoom,
                        idUser: req.body.idUsuario,
                        dateI: req.body.fechaInicio,
                        dateF: req.body.fechaFin
                    })
                    booking.save()
                    
                    const transporter = nodemailer.createTransport({
                        port:465,
                        host: "smtp.gmail.com",
                            auth: {
                                user: 'hospedajemenendezpelayo@gmail.com',
                                pass: 'Qox91289',
                            },
                        secure: true
                    })

                    const mailData = {
                        from: 'hospedajemenendezpelayo@gmail.com',
                        to: 'hospedajemenendezpelayo@gmail.com',
                        subject: `Reserva de ${req.body.user.nombre} ${req.body.user.apellidos} - ${room.name}`,
                        html: `El usuario <strong>${req.body.user.nombre} ${req.body.user.apellidos}</strong> con número de teléfono <strong>${req.body.user.telefono}</strong> ha reservado la habitación <strong>${room.name}</strong> durante las fechas <strong>${req.body.fechaInicio}</strong> y <strong>${req.body.fechaFin}</strong>. También puedes contactar con él a través de su email ${req.body.user.email} `,
                    }
                    

                    transporter.sendMail(mailData, (error,info) => {
                        if(error) {
                            res.send({
                                status: "failed",
                                data: 'Error enviando el mensaje',
                                code: 500
                            })

                        }
                        const response = {
                            status: "success",
                            data: 'La reserva se ha tramitado con éxito',
                            code: 200,
                        }
                        res.send(response)
                    })
                } else {
                    res.send({
                        status: 'failed',
                        data: 'Introduce un número de teléfono válido',
                        code: 500
                    })
                }
            } else {
                res.send({
                    status: 'failed',
                    data: 'Ya existe una reserva con estas características en el sistema',
                    code: 500
                })
            }
        } else {
            res.send({
                status: 'failed',
                data: 'Rellena los campos requeridos para completar la reserva',
                code: 500
            })
        }
    } catch(err) {
        res.send({
            status: "failed",
            data: err,
            code: 500
        })
    }
    
}

const getBookingsByUserId = async(req,res) => {
    try {
        let date = new Date()
        const books = await models.bookingModel.find({idUser: req.params.id, dateI:{$gte: date.toISOString().split('T')[0]}})
        res.send({
            status: 'sucess',
            data: books,
            code: 200
        })
    }catch(err) {
        res.send({
            status: 'failed',
            data: 'Error obteniendo los bookings del usuario',
            code: 200
        })
    }
}

const getBookingById = async(req,res) => {
    try {
        const booking = await models.bookingModel.findById(req.params.id)
        res.send({
            status: 'sucess',
            data: booking,
            code: 200
        })
    }catch(err) {
        res.send({
            status: 'failed',
            data: 'Error obteniendo los bookings del usuario',
            code: 200
        })
    }
}

module.exports = {
    searchRooms,
    getRoomData,
    saveBooking,
    getBookingsByUserId,
    getBookingById
}