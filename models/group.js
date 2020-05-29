const mongoose = require('mongoose')

const participantSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
})

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true }, 
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  description: { type: String, required: true },
  hike: { type: mongoose.Schema.ObjectId, ref: 'Hike' },
  participants: [ participantSchema ],
  createdMember: { type: mongoose.Schema.ObjectId, ref: 'User' }
}, {
  timestamps: true
})

const messageLikesSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User' }
})

const groupMessageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  from: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  to: { type: mongoose.Schema.ObjectId, ref: 'User' },
  likes: [ messageLikesSchema ]
}, {
  timestamps: true
})

const groupThreadSchema = new mongoose.Schema({
  thread: [ groupMessageSchema ]
}, {
  timestamps: true
})

const userAddedImageSchema = new mongoose.Schema({
  images: { type: String, required: true },
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  to: { type: String }
}, {
  timestamps: true
})

const groupMemberSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
})

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  createdMember: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  members: [ groupMemberSchema ],
  headerImage: { type: String, required: true }, 
  description: { type: String, required: true, maxlength: 500 },
  userAddedImages: [ userAddedImageSchema ],
  threads: [ groupThreadSchema ],
  events: [ eventSchema ]
}, {
  timestamps: true
})


groupSchema.plugin(require('mongoose-unique-validator'))
module.exports = mongoose.model('Group', groupSchema)