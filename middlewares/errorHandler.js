const { StatusCodes } = require('http-status-codes')

const errorHandler = (err, req, res, next) => {

    let customError = {
        //set default
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || 'Internal server Error, Try Again Later!'
    }
    
    // if (err instanceof CustomAPIError) {
    //     return res.status(err.statusCode).json({ msg: err.message })
    // }

    //Working on Duplicate user
    if(err.code && err.code === 11000){
        customError.message = `${Object.keys(err.keyValue)} already registered!`,
        customError.statusCode = StatusCodes.BAD_REQUEST
    }

    //Working on validation error
    if(err.name === 'ValidationError'){
        console.log(err)
        customError.message = Object.values(err.errors).map((item) => item.message).join(' ,'),
        customError.statusCode = StatusCodes.BAD_REQUEST
    }

    //Working on cast error [Incomplete Input syntax]
    if(err.name === 'CastError'){
        customError.message = `No item found with id: ${err.value}`
        customError.statusCode = StatusCodes.NOT_FOUND
    }


    return res.status(customError.statusCode).json({message: customError.message})
}



module.exports = errorHandler
