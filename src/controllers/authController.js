const checkAuth = (req,res) => {
    try {
        req.cookies.accessToken === undefined
        ?
        res.send({status: "success",data:false,code:500})
        :
        res.send({status: "success",data:true,code:200})
    } catch(err) {
        res.send({
            status:"failed",
            data: err,
            code: 500
        })
    }
    
}


module.exports = {
    checkAuth
}