// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @accees Public

exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ succes: true, msg: 'Show all bootcamps' })
}

// @desc Get single bootcamps
// @route GET /api/v1/bootcamps/:id
// @accees Public
exports.getBootcamp = (req, res, next) => {
  res.status(200).json({ succes: true, msg: `Show bootcamp ${req.params.id}` })
}

// @desc Create new bootcamp
// @route POST /api/v1/bootcamps
// @accees Private
exports.createBootcamp = (req, res, next) => {
  res.status(201).json({ succes: true, msg: `Create new bootcamp` })
}

// @desc Update a bootcamp
// @route PUT /api/v1/bootcamps/:id
// @accees Private
exports.updateBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ succes: true, msg: `Update bootcamp ${req.params.id}` })
}

// @desc Delete  bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @accees Public
exports.deleteBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ succes: true, msg: `Delete bootcamp ${req.params.id}` })
}
