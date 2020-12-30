import mongoose from 'mongoose'

const Attendee = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  reception: {
    isGoing: { type: Boolean },
    attendees: { type: Number },
  },
  diner: {
    isGoing: { type: Boolean },
    attendees: { type: Number },
  },
  party: {
    isGoing: { type: Boolean },
    attendees: { type: Number },
  },
  email: {
    type: String,
  }
})

export default mongoose.model('Attendee', Attendee)