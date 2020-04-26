const crypto = require('crypto')
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'The user must have a first name'],
      minlength: 1,
      maxlength: 15,
    },
    lastName: {
      type: String,
      required: [true, 'The user must have a last name'],
      minlength: 1,
      maxlength: 15,
    },
    username: {
      type: String,
      required: [true, 'The user needs a username'],
      unique: [true, 'Sorry, this username has already been taken!'],
      validate: {
        validator: function() {
          return validator.isAlphanumeric(this.username)
        },
        message: 'Username must contain A-Z / a-z or 0-9',
      },
      minlength: 1,
      maxlength: 15,
    },
    email: {
      type: String,
      required: [true, 'The user needs to insert an email'],
      unique: [true, 'Sorry someone has already registered through this email'],
      validate: {
        validator: function() {
          return validator.isEmail(this.email)
        },
        message: 'Please provide a valid email',
      },
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      maxlength: 15,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function(el) {
          return el === this.password
        },
        message: 'Passwords are not the same!',
      },
    },
    photo: {
      type: String,
      default: 'default.jpg',
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    createdPosts: [
      {
        ref: 'Note',
        type: mongoose.Schema.ObjectId,
      },
    ],
    collaboratedPosts: [
      {
        ref: 'Note',
        type: mongoose.Schema.ObjectId,
      },
    ],
    consumedPosts: [
      {
        ref: 'Note',
        type: mongoose.Schema.ObjectId,
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Virtual populate

/* userSchema.virtual('consumedPosts', {
  ref: 'Note',
  foreignField: 'consumer',
  localField: '_id',
}) */

// QUERY MIDDLEWARE

userSchema.pre(/^find/, function(next) {
  const options = '-__v -collaborator -consumer -creator -body -id'
  this.populate({
    path: 'createdPosts',
    select: options,
  })
    .populate({
      path: 'collaboratedPosts',
      select: options,
    })
    .populate({
      path: 'consumedPosts',
      select: options,
    })
  next()
})

//Instance Methods

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    )

    return JWTTimestamp < changedTimestamp
  }

  return false
}

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex')

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000

  return resetToken
}

// DOCUMENT MIDDLEWARE

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 12)

  this.passwordConfirm = undefined
  next()
})

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next()

  this.passwordChangedAt = Date.now() - 1000
  next()
})

userSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } })
  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
