const Hike = require('../models/hike')
const { notFound, unauthorized } = require('../lib/errorMessages')



// show all hikes
//* /hikes

async function hikesIndex(req, res, next) {
  try {
    const hikes = await Hike.find().populate('user')
    if (!hikes) throw new Error(notFound)
    res.status(200).json(hikes)
  } catch (err) {
    next(err)
  }
}



// create a new hike if you are a registered and logged in user
//* /hikes

async function hikesCreate(req, res, next) {
  try {
    req.body.user = req.currentUser
    const createdHike = await Hike.create(req.body)
    res.status(201).json(createdHike)
  } catch (err) {
    next(err)
  }
}



// show a single hike by its ID
//* /hikes/:id

async function hikesShow(req, res,next) {
  const hikeId = req.params.id
  try {
    const hike = await Hike.findById(hikeId)
      .populate('user')
      .populate('reviews.user')
      .populate('imagesUser.user')
    if (!hike) throw new Error(notFound)
    res.status(200).json(hike)
  } catch (err) {
    next(err)
  }
}



// edit a single hike found by its id if you are a registered and logged in user and you created the hike
//* /hikes/:id

async function hikesUpdate(req, res, next) {
  const hikeId = req.params.id
  try {
    const hike = await Hike.findById(hikeId)
    if (!hike) throw new Error(notFound)
    if (!hike.user.equals(req.currentUser._id)) throw new Error(unauthorized)
    Object.assign(hike, req.body)
    await hike.save()
    res.status(202).json(hike)
  } catch (err) {
    next(err)
  }
}



// delete a single hike found by its id if you are the user that created the hike
//* /hikes/:id

async function hikesDelete(req, res, next) {
  const hikeId = req.params.id
  try {
    const hikeToDelete = await Hike.findById(hikeId)
    if (!hikeToDelete) throw new Error(notFound)
    if (!hikeToDelete.user.equals(req.currentUser._id)) throw new Error(unauthorized)
    await hikeToDelete.remove()
    res.sendStatus(204)
  } catch (err) {
    next(err)
  }
}



// add a review to the hike if you are a registered and logged in user
//* /hikes/:id/review

async function hikesReviewCreate(req, res, next) {
  try {
    req.body.user = req.currentUser
    const hikeId = req.params.id
    const hike = await Hike.findById(hikeId).populate('user')
    if (!hike) throw new Error(notFound)
    hike.reviews.unshift(req.body)
    await hike.save()
    res.status(201).json(hike)
  } catch (err) {
    next(err)
  }
}



// delete a review if you are the creator of the review
//* /hikes/:id/review/:reviewId

async function hikesReviewDelete(req, res, next) {
  try {
    const hikeId = req.params.id
    const reviewId = req.params.reviewId
    const hike = await Hike.findById(hikeId)
    if (!hike) throw new Error(notFound)

    const reviewToRemove = hike.reviews.id(reviewId)
    if (!reviewToRemove) throw new Error(notFound)
    if (!reviewToRemove.user.equals(req.currentUser._id)) throw new Error(unauthorized)
    await reviewToRemove.remove()
    await hike.save()
    res.status(204).json(hike)
  } catch (err) {
    next(err)
  }
}



// add an image to the hike if you are a registered and logged in user
//* /hikes/:id/user-images/

async function hikesUserImageCreate(req, res, next) {
  try {
    const hikeId = req.params.id
    const hike = await Hike.findById(hikeId)
    if (!hike) throw new Error(notFound)
    hike.images.push(req.body.images)
    await hike.save()
    res.status(201).json(hike)
  } catch (err) {
    next(err)
  }
}



// delete an image if you are the creator of the image
//* /hikes/:id/user-images/:imageId

async function hikesUserImageDelete(req, res, next) {
  try {
    const hikeId = req.params.id
    const imageId = req.params.imageId
    const hike = await Hike.findById(hikeId)
    if (!hike) throw new Error(notFound)

    const imageToRemove = hike.images.id(imageId)
    if (!imageToRemove) throw new Error(notFound)
    if (!imageToRemove.user.equals(req.currentUser._id)) throw new Error(unauthorized)
    await imageToRemove.remove()
    await hike.save()
    res.status(204).json(hike)
  } catch (err) {
    next(err)
  }
}


//exporting controllers for use in the router

module.exports = {
  index: hikesIndex,
  create: hikesCreate,
  show: hikesShow,
  update: hikesUpdate,
  delete: hikesDelete,
  createReview: hikesReviewCreate,
  deleteReview: hikesReviewDelete,
  createImage: hikesUserImageCreate,
  deleteImage: hikesUserImageDelete
}