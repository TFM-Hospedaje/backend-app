const models = require('../models')
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const createUser = async (req,res) => {
    try {
        const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const regexPass = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
        if(regexEmail.test(req.body.email.toLowerCase())) {

            const username = await models.userModel.findOne({username: req.body.username}) 
            const email = await models.userModel.findOne({email: req.body.email})

            if(username === null && email === null) {
                if(regexPass.test(req.body.password) && regexPass.test(req.body.repeatPassword)) {    
                    if(req.body.password === req.body.repeatPassword) {
                        const saltRounds = 10
                        bcrypt.hash(req.body.password,saltRounds, function(err,hash) {
                            const password = hash
                        
                            const newUser = {
                                email : req.body.email,
                                username: req.body.username,
                                password: password,
                                code: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
                            }
                    
                            const user = new models.userModel(newUser)
                            user.save()
                        

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
                                to: req.body.email,
                                subject: 'Confirmación de cuenta',
                                text: 'Bienvenido al Hospedaje Menéndez Pelayo',
                                html: `<p>Para confirmar tu cuenta, pulsa en <strong><a href="https://app-hospedaje.herokuapp.com/users/confirm/${user.code}">este enlace</a></strong></p>`
                            }

                            transporter.sendMail(mailData, (error,info) => {
                                if(error) {
                                    return console.log(error)
                                }
                                const response = {
                                    status: "success",
                                    data: {user},
                                    code: 200
                                }
                                res.send(response)
                            })
                        })
                        
                    } else {
                        const response = {
                            status: "failed",
                            data: "Las contraseñas no coinciden",
                            code: 500
                        }
                        res.send(response)
                    }
                } else {
                    const response = {
                        status: "failed",
                        data: 'La contraseña debe contener mínimo 8 caracteres, una letra y un número',
                        code: 500
                    }
                    res.send(response)
                }
            } else {
                const response = {
                    status: "failed",
                    data: "Ya existe un usuario con ese email o ese nombre",
                    code: 500
                }
                res.send(response)
            }
        } else {
            const response = {
                status: "failed",
                data: "Email con formato inválido",
                code: 500
            }
            res.send(response)
        }
    } catch(err) {
        res.send({
            status: "failed",
            data: err,
            code: 500
        })
    }
    
}

const confirmUser = async (req,res) => {
    try {
        const user = await models.userModel.findOne({code: req.params.code})

        user.code = null
        user.active = true
        user.save()

        const accessToken = jwt.sign({user},process.env.ACCESS_TOKEN_SECRET)
        
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: true,
            sameSite: true
        })

        res.cookie('id', user._id, {
            maxAge: 24 * 60 * 60 * 1000,
            secure: true,
            sameSite: true
        })
        
        res.redirect('https://app-hospedaje.herokuapp.com/')
        //res.redirect('/')
    } catch(err) {
        res.send({
            status: "failed",
            data: err,
            code: 500
        })
    }
    
}

const loginUser = async (req,res) => {
    try {
        const user = await models.userModel.findOne({username: req.body.username})
        if(user) {
            if(user.active) {
                bcrypt.compare(req.body.password, user.password, function(err, result) {
                    if(result) {
                        const accessToken = jwt.sign({user},process.env.ACCESS_TOKEN_SECRET)
                        const response = {
                            status: "success",
                            data: {accessToken},
                            code: 200
                        }
                        res.cookie('accessToken', accessToken, {
                            httpOnly: true,
                            maxAge: 24 * 60 * 60 * 1000,
                            secure: true,
                            sameSite: true
                        })

                        res.cookie('id', user._id, {
                            maxAge: 24 * 60 * 60 * 1000,
                            secure: true,
                            sameSite: true
                        })

                        res.send(response)
                    } else {
                        const response = {
                            status: "failed",
                            data: "Credenciales incorrectos",
                            code: 500
                        }
                        res.send(response)
                    }
                })
            } else {
                const response = {
                    status: "failed",
                    data: "Esta cuenta no está activa",
                    code: 500
                }
                res.send(response)
            }
        } else {
            const response = {
                status: "failed",
                data: "El usuario no se encuentra en el sistema",
                code: 500
            }
            res.send(response)
        }

    } catch( err) {
        res.send({
            status: "failed",
            data: err,
            code: 500
        })
    }
    
}

const logoutUser = (req,res) => {
    try {
        res.clearCookie('accessToken')
        res.clearCookie('id')
        const response = {
            status: "success",
            data: false,
            code: 200
        }
        res.send(response)
    } catch(err) {
        res.send({
            status: "failed",
            data: err,
            code: 500
        })
    }
    
}

const sendMessage = (req,res) => {
    try {
        if(req.body.name === '' || req.body.email === '' || req.body.message === '') {
            res.send({
                status: "failed",
                data: "Rellena los campos obligatorios",
                code: 500
            })
        } else {
            const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if(regexEmail.test(req.body.email.toLowerCase())) {
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
                    subject: `Mensaje de ${req.body.name} - ${req.body.email}`,
                    text: req.body.message,
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
                        data: 'Mensaje enviado con éxito',
                        code: 200
                    }
                    res.send(response)
                })
            } else {
                res.send({
                    status: 'failed',
                    data: "El campo email no es válido",
                    code: 500
                })
            }
        }
    } catch(err) {
        res.send({
            status: "failed",
            data: err,
            code: 500
        })
    }
}

const getUserData = async(req,res) => {
    try {
        const user = await models.userModel.findById(req.cookies.id)
        res.send({
            status: 'success',
            data: user,
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

const editProfile = async(req,res) => {
    try {
        if(req.body.username === '' || req.body.password === '' || req.body.repeatPassword === '') {
            res.send({
                status: 'failed',
                data: 'Rellena los campos obligatorios',
                code: 500
            })
        } else {
            const user = await models.userModel.findById(req.body._id)
            const regexPass = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
            if(regexPass.test(req.body.password) && regexPass.test(req.body.repeatPassword)) {
                if(req.body.password === req.body.repeatPassword) {
                    const saltRounds = 10
                    bcrypt.hash(req.body.password,saltRounds, function (err,hash){
                        const pass = hash
                        if(user) {
                            user.username = req.body.username
                            user.password = pass
                            user.save()
                            res.send({
                                status: 'success',
                                data: 'La información se ha editado correctamente',
                                code: 200
                            })
                        } else {
                            res.send({
                                status: 'failed',
                                data: 'No se ha podido encontrar el usuario',
                                code: 500
                            })
                        }
                    })
                } else {
                    res.send({
                        status: 'failed',
                        data: 'Las contraseñas no coinciden',
                        code: 500
                    })
                }
            } else {
                res.send({
                    status: "failed",
                    data: 'La contraseña debe contener mínimo 8 caracteres, una letra y un número',
                    code: 500
                })
            }
        }
    }catch(err) {
        res.send({
            status: 'failed',
            data: 'No se ha podido editar el perfil',
            code: 500
        })
    }
}

const cancelBooking = async(req,res) => {
    try {
        await models.bookingModel.findByIdAndDelete(req.params.id)
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
                    subject: `Reserva cancelada`,
                    text: `La reserva con id ${req.params.id} ha sido cancelada`,
                }
    
                transporter.sendMail(mailData, (error,info) => {
                    if(error) {
                        res.send({
                            status: "failed",
                            data: 'Error cancelando la reserva',
                            code: 500
                        })
    
                    }
                    const response = {
                        status: "success",
                        data: 'Reserva cancelada con éxito',
                        code: 200
                    }
                    res.send(response)
                })
        
    } catch(err) {
        res.send({
            status: "failed",
            data: err,
            code: 500
        })
    }

}

const removeAccount = async(req,res) => {
    try {
        await models.userModel.findByIdAndDelete(req.params.id)
        res.clearCookie('accessToken')
        res.clearCookie('id')
        const response = {
            status: "success",
            data: false,
            code: 200
        }
        res.send(response)

    } catch(err) {
        res.send({
            status: "failed",
            data: 'No se ha podido borrar la cuenta',
            code: 500
        })
    }
}
module.exports = {
    createUser,
    confirmUser,
    loginUser,
    logoutUser,
    sendMessage,
    getUserData,
    editProfile,
    cancelBooking,
    removeAccount
}