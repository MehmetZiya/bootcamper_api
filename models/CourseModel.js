const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, ' Please add a course title'],
  },
  description: {
    type: String,
    required: [true, ' Please add a course desctiptions'],
  },
  weeks: {
    type: String,
    required: [true, 'Please add number of weeks'],
  },
  tuition: {
    type: Number,
    required: [true, 'Please add a tuition cost'],
  },
  minimumSkill: {
    type: String,
    required: [true, 'Please add a minimum skill'],
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true,
  },
})

CourseSchema.statics.getAverageCost = async function (bootcampId) {
  console.log('Calculating avg cost'.blue)
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' },
      },
    },
  ])
  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost),
    })
  } catch (err) {}
}

//Call getAverageCost after save
CourseSchema.post('save', function () {
  this.constructor.getAverageCost(this.bootcamp)
})

//Call getAverageCost after save
CourseSchema.pre('remove', function () {})
module.exports = mongoose.model('Course', CourseSchema)