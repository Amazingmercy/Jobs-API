const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const secretKey = process.env.JWT_SECRET_KEY


const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Name should be provided'],
        maxlength: 25,
        minlength: 3,
    },
    email:{
        type: String,
        required: [true, 'Email should be provided'],
        match: [/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/, 'Provide a Valid email please'],
        unique: true,
    },
    password:{
        type: String,
        required: [true, 'Name should be provided'],
        minlength: 3,
    }, 

})

UserSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
next()
})

UserSchema.methods.createJWT = function () {
    const payload = {
        userId:this._id,
    }

    return jwt.sign(payload, secretKey, {expiresIn: process.env.JWT_LIFE})

}


UserSchema.methods.comparePassword = async function(userPassword){
    const isMatch = await bcrypt.compare(userPassword, this.password)
    return isMatch
}

module.exports = mongoose.model('User', UserSchema)