const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const uniqueValidator = require('mongoose-unique-validator')

// * for any hikes favourited by the user 

const favoriteHikesSchema = new mongoose.Schema({
  hike: { type: mongoose.Schema.ObjectId, ref: 'Hike', required: true }
})

// * for any hikes completed by the user - will also show up on hike page

const completedHikesSchema = new mongoose.Schema({
  hike: { type: mongoose.Schema.ObjectId, ref: 'Hike', required: true }
})

// const groupsJoinedSchema = new mongoose.Schema({
//   group: { type: mongoose.Schema.ObjectId, ref: 'Group', required: true }
// })


const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, maxlength: 50 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String },
  bio: { type: String },
  profileImage: { type: String },
  favoritedHikes: [favoriteHikesSchema], 
  completedHikes: [completedHikesSchema]
  // groupsJoined: [groupsJoinedSchema]
}
)

// * for images added by users on the Hike page
userSchema
  .virtual('joinedGroups', {
    ref: 'Group',
    localField: '_id',
    foreignField: 'members.user'
  })

userSchema
  .virtual('eventsGoing', {
    ref: 'Group',
    localField: '_id',
    foreignField: 'events.participants'
  })


userSchema
  .virtual('imagesAddedtoHike', {
    ref: 'Hike',
    localField: '_id',
    foreignField: 'imagesUser'
  })

// * for Hikes created by users


userSchema
  .virtual('createdHikes', {
    ref: 'Hike',
    localField: '_id',
    foreignField: 'user'
  })


// * ensure passwod does not show up on  user details

userSchema
  .set('toJSON', {
    virtuals: true,
    transform(doc, json) {
      delete json.password
      return json
    }
  })

//* validate password when logging in

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}


// * virtual field for passwordConfirmation
userSchema
  .virtual('passwordConfirmation')
  .set(function (passwordConfirmation) {
    this._passwordConfimation = passwordConfirmation
  })

// * check password is equal to passwordConfirmation

userSchema
  .pre('validate', function (next) {
    if (this.isModified('password') && this._passwordConfimation !== this.password) {
      this.invalidate('passwordConfirmation', 'does not match')
    }
    next()
  })


userSchema
  .pre('save', function (next) { // * <--- will run before the model is saved
    if (this.isModified('password')) {
      this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8)) // * hash the password before it is sent to the database
    }
    next()
  })

userSchema.plugin(uniqueValidator)
module.exports = mongoose.model('User', userSchema)