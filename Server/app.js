const express = require('express')
const cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
// const hpp = require('hpp')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controller/errorController')
const userRouter = require('./Routes/userRoutes')
const noteRouter = require('./Routes/noteRoutes')
const path = require('path')
const cors = require('cors')
const compression = require('compression')

const app = express()
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://192.168.56.1:8080'],
    credentials: true,
    allowedHeaders: ['Content-Length', 'Content-Type', 'Authorization'],
  })
)

// app.options('*', cors())

app.use(helmet())

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
})

app.use('/api', limiter)

app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser())

app.use(mongoSanitize())

app.use(xss())

/* app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
) */

app.use(compression())

// 3) ROUTES

app.use('/api/v1/user', userRouter)
app.use('/api/v1/note', noteRouter)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../client/build'))
  app.get('*', req, res =>
    res.sendFile(path.resolve('../client/build.index.html'))
  )
}

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler)

module.exports = app
