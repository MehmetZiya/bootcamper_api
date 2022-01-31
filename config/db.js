const { cyan } = require('colors')
const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const connDB = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB Connected: ${connDB.connection.host}`.cyan.underline)
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

module.exports = connectDB
