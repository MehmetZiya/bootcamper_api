const NodeGeocoder = require('node-geocoder')

const options = {
  provider: 'mapquest',
  httpAdapter: 'https',
  apiKey: 'UNg1HjDScGBocPhvlHMLZATgtXteSNaN',
  formatter: null,
}

const geocoder = NodeGeocoder(options)

module.exports = geocoder
