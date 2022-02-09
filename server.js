const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const errorHandler = require('./middleware/error')
const connectDB = require('./config/db')

//MiddleWare Files
// const logger = require('./middleware/logger')

//Route Files
const bootcamps = require('./routes/bootcampRoutes')
const courses = require('./routes/courseRoutes')

dotenv.config({ path: './config/config.env' })

//Connect Database
connectDB()

const app = express()

//Body parser
app.use(express.json())

//Middlewares
// app.use(logger) custom logger middleware
if (process.env.NODE_ENV === 'DEVELOPMENT') {
  app.use(morgan('dev'))
}

//Routes
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.magenta
      .bold.italic
  )
)
