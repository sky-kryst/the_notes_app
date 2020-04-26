class AppError extends Error {
  constructor(message, statusCode, type, doc) {
    super(message)

    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    ;(this.isOperational = true), (this.type = type)
    this.doc = doc

    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = AppError
