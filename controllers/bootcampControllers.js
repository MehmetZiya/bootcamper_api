const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Bootcamp = require('../models/BootcampModel')
const geocoder = require('../utils/geocoder')

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @accees Public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query
  const reqQuery = { ...req.query }
  const removeField = ['select', 'sort', 'page', 'limit']
  removeField.forEach((param) => delete reqQuery[param])
  let queryStr = JSON.stringify(reqQuery)

  //create operators like ( $gt, $lte etc) MongoDB documentation
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)

  query = Bootcamp.find(JSON.parse(queryStr)).populate('courses')

  //Select fields return only selected data
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ')
    query = query.select(fields)
  }

  //Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt')
  }

  //Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 25
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await Bootcamp.countDocuments()
  query = query.skip(startIndex).limit(limit)

  const bootcamps = await query

  //Pagination result
  const pagination = {}
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    }
  }
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  })
})

// @desc Get single bootcamps
// @route GET /api/v1/bootcamps/:id
// @accees Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    )
  }
  res.status(200).json({ success: true, data: bootcamp })
})

// @desc Create new bootcamp
// @route POST /api/v1/bootcamps
// @accees Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body)
  res.status(201).json({ success: true, data: bootcamp })
})

// @desc Update a bootcamp
// @route PUT /api/v1/bootcamps/:id
// @accees Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    )
  }
  res.status(200).json({ success: true, data: bootcamp })
})

// @desc Delete  bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @accees Public
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  //const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
  //before delete bootcamp, delete courses belongs to bootcam
  const bootcamp = await Bootcamp.findById(req.params.id)
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    )
  }
  bootcamp.remove()
  res.status(200).json({ success: true, data: {} })
})

// @desc Get Bootcamps within a radius
// @route GET /api/v1/bootcamps/raduis/:zipcode/:distance
// @accees Public
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params

  //Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode)
  const lat = loc[0].latitude
  const lng = loc[0].longitude

  //calculate radius using radians
  //divide dist by radius of Earth (3,663 mi)/ 6378 km
  const radius = distance / 6378

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] },
    },
  })
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  })
})
