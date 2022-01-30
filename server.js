const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const connectDB = require('./config/db')

//MiddleWare Files
// const logger = require('./middleware/logger')

//Route Files
const bootcamps = require('./routes/bootcamps')

dotenv.config({ path: './config/config.env' })

//Connect Database
connectDB()

const app = express()

//Middlewares
// app.use(logger) custom logger middleware
if (process.env.NODE_ENV === 'DEVELOPMENT') {
  app.use(morgan('dev'))
}

//Routes
app.use('/api/v1/bootcamps', bootcamps)

app.get('/', (req, res) => {
  res.send('Hello from express')
})

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.magenta
      .bold.italic
  )
)
