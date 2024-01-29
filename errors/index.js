const CustomAPIError = require('./customAPI')
const UnAuthenticatedError = require('./unAuthenticatedError')
const NotFoundError = require('./notFound')
const BadRequestError = require('./badRequest')



module.exports = {
    CustomAPIError,
    UnAuthenticatedError,
    NotFoundError,
    BadRequestError
}