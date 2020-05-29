const User = require('../models/user')
const { notFound, unauthorized } = require('../lib/errorMessages')


// * for URL: /profiles -- everyone can see

async function userIndex(req, res, next) {
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (err) {
    next(err)
  }
}


//* for URL: profiles/:id --

async function userShow(req, res, next) {
  const userId = req.params.id
  try {
    const user = await (await User.findById(userId).populate('completedHikes.hike').populate('favoritedHikes.hike').populate('joinedGroups')).populate('eventsGoing')
    if (user.joinedGroups) {
      user.joinedGroups = user.joinedGroups.flatMap(item => item._id).reduce((arr, curr) => {
        if (arr.length === 0) {
          arr.push(curr)
        }
        if (!arr.find(item => item._id === curr._id)) {
          arr.push(curr)
        }
        return arr
      }, [])

    }
    // if (user.eventsGoing) {
    //   user.eventsGoing = user.eventsGoing.flatMap(item => item._id).reduce((arr, curr) => {
    //     if (arr.length === 0) {
    //       arr.push(curr)
    //     }
    //     if (!arr.find(item => item._id === curr._id)) {
    //       arr.push(curr)
    //     }
    //     return arr
    //   }, []) 
    // }

    if (!user) throw new Error(notFound)
    res.status(200).json(user)
  } catch (err) {
    next(err)
  }
}


// * To update user (to be used with SecureRoute) 

async function userUpdate(req, res, next) {
  const userId = req.params.id
  try {
    const userToUpdate = await User.findById(userId)
    if (!userToUpdate) throw new Error(notFound)


    if (!userToUpdate.equals(req.currentUser._id)) throw new Error(unauthorized)

    Object.assign(userToUpdate, req.body)
    await userToUpdate.save()

    res.status(202).json(userToUpdate)
  } catch (err) {
    next(err)
  }
}

// * URL: /profiles/:id/favourites

async function userFavoriteHikeCreate(req, res, next) {
  try {
    req.body.user = req.currentUser
    const userId = req.params.id

    const user = await User.findById(userId)
    if (!user) throw new Error(notFound)

    if (user.favoritedHikes.some( hike =>  hike.hike.equals(req.body.hike))) throw new Error('Already added') 

    user.favoritedHikes.push(req.body)
    await user.save()

    res.status(201).json(user)
  } catch (err) {
    next(err)
  }
}

//* DELETE URL: /profiles/:id/favorites/:favId

async function userFavoriteHikeDelete(req, res, next) {
  try {
    const userId = req.params.id
    const favId = req.params.favId
    console.log(favId)

    const user = await User.findById(userId)
    if (!user) throw new Error(notFound)

    const favHikeToRemove = user.favoritedHikes.id(favId)
    if (!favHikeToRemove) throw new Error(notFound)

    console.log('this')

    if (!user.equals(req.currentUser._id)) throw new Error(unauthorized)

    await favHikeToRemove.remove()
    await user.save()
    res.status(204).json(user)
  } catch (err) {
    next(err)
  }
}


// * URL: /profiles/:id/completed

async function userCompletedHikeCreate(req, res, next) {
  try {
    req.body.user = req.currentUser
    const userId = req.params.id

    const user = await User.findById(userId)
    if (!user) throw new Error(notFound)

    if (user.completedHikes.some( hike =>  hike.hike.equals(req.body.hike))) throw new Error('Already added') 

    user.completedHikes.push(req.body)
    await user.save()

    res.status(201).json(user)
  } catch (err) {
    next(err)
  }
}

//* DELETE URL: /profiles/:id/completed/:compId

async function userCompletedHikeDelete(req, res, next) {
  try {
    const userId = req.params.id
    const compId = req.params.compId

    const user = await User.findById(userId)
    if (!user) throw new Error(notFound)

    const compHikeToRemove = user.completedHikes.id(compId)
    if (!compHikeToRemove) throw new Error(notFound)


    if (!user.equals(req.currentUser._id)) throw new Error(unauthorized)

    await compHikeToRemove.remove()
    await user.save()
    res.status(201).json(user)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  userIndex: userIndex,
  userShow: userShow,
  userUpdate: userUpdate,
  createFavHike: userFavoriteHikeCreate,
  deleteFavHike: userFavoriteHikeDelete,
  createCompHike: userCompletedHikeCreate,
  deleteCompHike: userCompletedHikeDelete
}