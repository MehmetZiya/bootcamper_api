const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const fileupload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')
const errorHandler = require('./middleware/error')
const connectDB = require('./config/db')

//MiddleWare Files
// const logger = require('./middleware/logger')

//Route Files
const bootcamps = require('./routes/bootcampRoutes')
const courses = require('./routes/courseRoutes')
const auth = require('./routes/authRoutes')
const users = require('./routes/userRoutes')
const reviews = require('./routes/reviewRoutes')

dotenv.config({ path: './config/config.env' })

//Connect Database
connectDB()

const app = express()

//Body parser
app.use(express.json())

//Cookie parser
app.use(cookieParser())
//Middlewares

if (process.env.NODE_ENV === 'DEVELOPMENT') {
  app.use(morgan('dev'))
}
//file uploading
app.use(fileupload())
//set static folder
app.use(express.static(path.join(__dirname, 'puplic')))

// Sanitize Data
app.use(mongoSanitize())

// Set security headers
app.use(helmet())

// Prevent XSS attacks
app.use(xss())

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
})
app.use(limiter)

// Prevent http param pollution
app.use(hpp())

// Enable CORS
app.use(cors())

//Routes
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', users)
app.use('/api/v1/reviews', reviews)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.magenta
      .bold.italic
  )
)
