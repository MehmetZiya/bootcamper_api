const express = require('express')
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  photoUpload,
} = require('../controllers/bootcampControllers')
const Bootcamp = require('../models/BootcampModel')

//Include other resource router
const courseRouter = require('./courseRoutes')

const router = express.Router()

const advancedResults = require('../middleware/advancedResults')
const { protect, authorize } = require('../middleware/auth')

router.use('/:bootcampId/courses', courseRouter)

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protect, authorize('publisher', 'admin'), createBootcamp)
router
  .route('/:id')
  .get(getBootcamp)
  .put(protect, authorize('publisher', 'admin'), updateBootcamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootcamp)
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)
router
  .route('/:id/photo')
  .put(protect, authorize('publisher', 'admin'), photoUpload)

module.exports = router
