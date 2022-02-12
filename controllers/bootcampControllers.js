const path = require('path')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Bootcamp = require('../models/BootcampModel')
const geocoder = require('../utils/geocoder')

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @accees Public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
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
  // Add user to req,body
  req.body.user = req.user.id

  // Check for published bootcamp
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id })

  // If the user is not an admin, they can only add one bootcamp
  if (publishedBootcamp && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already published a bootcamp`,
        400
      )
    )
  }
  const bootcamp = await Bootcamp.create(req.body)
  res.status(201).json({ success: true, data: bootcamp })
})

// @desc Update a bootcamp
// @route PUT /api/v1/bootcamps/:id
// @accees Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id)
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    )
  }
  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to delete this bootcamp`,
        401
      )
    )
  }
  bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
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
  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this bootcamp`,
        401
      )
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

// @desc UPload photo for bootcamp
// @route PUT /api/v1/bootcamps/:id/photo
// @accees Private
exports.photoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    )
  }
  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this bootcamp`,
        401
      )
    )
  }
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a photo`, 404))
  }
  const file = req.files.file

  //Check file extension
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload a .jpg/.jpeg/.png file`, 404))
  }

  //Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(`Max file size is ${process.env.MAX_FILE_UPLOAD}!`, 404)
    )
  }
  //Create custom file name
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err)
      return next(new ErrorResponse(`Upload error!`, 500))
    }
    await Bootcamp.findByIdAndUpdate(req.param.id, { photo: file.name })
    res.status(200).json({
      succes: true,
      data: file.name,
    })
  })
})
