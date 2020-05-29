const router = require('express').Router()
const hikes = require('../controllers/hikes')
const auth = require('../controllers/auth')
const groups = require('../controllers/groups')
const users = require('../controllers/users')
const secureRoute = require('../lib/secureRoute')


// * Hikes
router.route('/hikes')
  .get(hikes.index)
  .post(secureRoute, hikes.create)

router.route('/hikes/:id')
  .get(hikes.show)
  .put(secureRoute, hikes.update)
  .delete(secureRoute, hikes.delete)

router.route('/hikes/:id/reviews')
  .post(secureRoute, hikes.createReview)

router.route('/hikes/:id/reviews/:reviewId')
  .delete(secureRoute, hikes.deleteReview)

router.route('/hikes/:id/images')
  .post(secureRoute, hikes.createImage)

router.route('/hikes/:id/images/:imageId')
  .delete(secureRoute, hikes.deleteImage)


// * Groups
router.route('/groups')
  .get(groups.index)
  .post(secureRoute, groups.create)

router.route('/groups/:id')
  .get(groups.show)
  .put(secureRoute, groups.update)
  .delete(secureRoute, groups.delete)

// useraddedimages
router.route('/groups/:id/user-images')
  .post(secureRoute, groups.createGroupImage)

router.route('/groups/:id/user-images/:userAddedImageId')
  .get(secureRoute, groups.showGroupImage)
  .delete(secureRoute, groups.deleteGroupImage)

// threads
router.route('/groups/:id/threads')
  .post(secureRoute, groups.createThread)

router.route('/groups/:id/threads/:threadId')
  .delete(secureRoute, groups.deleteThread)

// messages (in thread)
router.route('/groups/:id/threads/:threadId/messages')
  .post(secureRoute, groups.createMessage)

router.route('/groups/:id/threads/:threadId/messages/:messageId')
  .delete(secureRoute, groups.deleteMessage)

router.route('/groups/:id/threads/:threadId/messages/:messageId/likes')
  .put(secureRoute, groups.likeMessage)


// events
router.route('/groups/:id/events')
  .post(secureRoute, groups.createEvent)

router.route('/groups/:id/events/:eventId')
  .get(secureRoute, groups.showEvent)
  .put(secureRoute, groups.updateEvent)
  .delete(secureRoute, groups.deleteEvent)


// event participants
router.route('/groups/:id/events/:eventId/participants')
  .put(secureRoute, groups.addParticipant)

router.route('/groups/:id/events/:eventId/participants/:parId')
  .get(secureRoute, groups.getParticipants)
  .delete(secureRoute, groups.deleteParticipant)


// members
router.route('/groups/:id/members')
  .post(secureRoute, groups.createMember)

router.route('/groups/:id/members/:memberId')
  .delete(secureRoute, groups.deleteMember)



//* auth
router.route('/register')
  .post(auth.register)

router.route('/login')
  .post(auth.login)


// * Users
router.route('/profiles')
  .get(secureRoute, users.userIndex)

router.route('/profiles/:id')
  .get(secureRoute, users.userShow)
  .put(secureRoute, users.userUpdate)

router.route('/profiles/:id/favorites')
  .post(secureRoute, users.createFavHike)

router.route('/profiles/:id/favorites/:favId')
  .delete(secureRoute, users.deleteFavHike)

router.route('/profiles/:id/completed')
  .post(secureRoute, users.createCompHike)

router.route('/profiles/:id/completed/:compId')
  .delete(secureRoute, users.deleteCompHike)


module.exports = router