const Bootcamp = require('../models/BootcampModel')
// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @accees Public

exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find()
    res
      .status(200)
      .json({ success: true, count: bootcamps.length, data: bootcamps })
  } catch (err) {
    res.status(400).json({ success: false })
  }
}

// @desc Get single bootcamps
// @route GET /api/v1/bootcamps/:id
// @accees Public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id)
    res.status(200).json({ success: true, data: bootcamp })
  } catch (err) {
    res.status(400).json({ success: false })
  }
}

// @desc Create new bootcamp
// @route POST /api/v1/bootcamps
// @accees Private
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body)
    res.status(201).json({ success: true, data: bootcamp })
  } catch (err) {
    res.status(400).json({ success: false })
  }
}

// @desc Update a bootcamp
// @route PUT /api/v1/bootcamps/:id
// @accees Private
exports.updateBootcamp = async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id)

  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  res.status(200).json({ success: true, data: bootcamp })
}

// @desc Delete  bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @accees Public
exports.deleteBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ succes: true, msg: `Delete bootcamp ${req.params.id}` })
}
