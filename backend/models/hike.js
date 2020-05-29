const mongoose = require('mongoose')

// user can add images to the hike page
// const userImagesSchema = new mongoose.Schema({
//   image: { type: String, required: true },
//   user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }
// })
// user can review the hike and rate from 1-5
const reviewSchema = new mongoose.Schema({
  text: { type: String, required: true, maxlength: 1000 },
  rating: { type: Number, required: true, min: 1, max: 5 },
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
})

//user can rate the hike from 1 to 5
// const ratingSchema = new mongoose.Schema({
//   rating: { type: Number, required: true, min: 1, max: 5 },
//   user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }
// })


//general hike profile
const hikeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  country: { type: String, required: true },
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  difficulty: { type: Array, required: true, default: undefined },
  distance: { type: String, required: true },
  timeToComplete: { type: String, required: true },
  images: { type: Array, required: true, default: undefined },
  // imagesUser: [userImagesSchema],
  reviews: [reviewSchema],
  // ratings: [ratingSchema],
  seasons: { type: Array, required: true, default: undefined },
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
})


//obtaining the list of users that have completed this hike
hikeSchema
  .virtual('usersCompleted', {
    ref: 'User',
    localField: '_id',
    foreignField: 'completedHikes'
  })

hikeSchema
  .virtual('usersFavorited', {
    ref: 'User',
    localField: '_id',
    foreignField: 'favoritedHikes'
  })

hikeSchema.plugin(require('mongoose-unique-validator'))

module.exports = mongoose.model('Hike', hikeSchema)