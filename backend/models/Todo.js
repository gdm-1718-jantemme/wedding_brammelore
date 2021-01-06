import mongoose from 'mongoose'

const Todo = mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  }
})

export default mongoose.model('Todo', Todo)