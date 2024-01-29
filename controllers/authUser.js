const User = require('../models/userModel')
const {StatusCodes} = require('http-status-codes')
const { BadRequestError, UnAuthenticatedError} = require('../errors')



const register = async(req, res) => {
    const user = await User.create({...req.body})
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({token})
}


const login = async(req, res) => {
    const {email, password} = req.body
    if(!email || !password){
        throw new BadRequestError('Enter Email and password')
    }

    const user = await User.findOne({email})

    if(!user){
        throw new UnAuthenticatedError('Invalid Email')
    }

    const validPassword = await user.comparePassword(password)
    if(!validPassword){
        throw new UnAuthenticatedError('Invalid password')
    }

    const token = user.createJWT()
    res.status(StatusCodes.OK).json({token})
}


module.exports = {
    register,
    login
}