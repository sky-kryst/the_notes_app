const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      maxlength: 80,
    },
    body: {
      type: String,
      required: [true],
      minlength: 1,
    },
    createdAt: Date,
    likesCount: {
      type: Number,
      default: 0,
      required: true,
    },
    likes: [mongoose.Schema.ObjectId],
    requests: [
      {
        userId: mongoose.Schema.ObjectId,
        noteId: mongoose.Schema.ObjectId,
        reqType: {
          type: String,
          enum: {
            values: ['edit', 'view'],
            message: 'Request must be for viewing or editing the document',
          },
        },
        accepted: {
          type: Boolean,
          default: false,
        },
      },
    ],
    creator: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    collaborator: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    consumer: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

noteSchema.pre(/^find/, function(next) {
  const options =
    '-__v -createdPosts -collaboratedPosts -consumedPosts -id -passwordChangedAt -photo'
  this.populate({
    path: 'creator',
    select: options,
  })
    .populate({
      path: 'collaborator',
      select: options,
    })
    .populate({
      path: 'consumer',
      select: options,
    })
  next()
})

noteSchema.methods.clearRequest = function(userId) {
  let index
  for (let l in this.request) {
    let { id, type } = l
    if (id === userId) return (index = this.request.indexOf(l))
  }
  this.request = this.request.filter(el => this.request.indexOf(el) === index)
  this.save()
}

const Note = mongoose.model('Note', noteSchema)

module.exports = Note
