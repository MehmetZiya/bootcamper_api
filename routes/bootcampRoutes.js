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

//Include other resource router
const courseRouter = require('./courseRoutes')

const router = express.Router()

router.use('/:bootcampId/courses', courseRouter)

router.route('/').get(getBootcamps).post(createBootcamp)
router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp)
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)
router.route('/:id/photo').put(photoUpload)

module.exports = router
