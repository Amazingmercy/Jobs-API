const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const {UnAuthenticatedError} = require('../errors')
const secretKey = process.env.JWT_SECRET_KEY


const authenticate = async(req, res, next) => {
    const token = req.headers.authorization
    if(!token){
        throw new UnAuthenticatedError('user is not logged in')
    }

    //const decodedToken = token.split(' ')[1]
    const payload = jwt.verify(token.replace("Bearer ", ""), secretKey);
    
    try{
        //const payload = jwt.verify(decodedToken, secretKey)
        req.user = payload
        next()
    } catch (error){

    }

    
}


module.exports = authenticate