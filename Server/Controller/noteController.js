const Notes = require('../Model/noteModel')
const catchAsync = require('../utils/catchAsync')
const HandlerFactory = require('../utils/handlerFactory')
const User = require('../Model/userModel')
const AppError = require('../utils/appError')
const mongoose = require('mongoose')

const check = (A, b) => {
  let B
  for (i = 0; i < A.length; i++) {
    if (String(A[i]._id) === b) {
      B = true
      break
    }
  }
  return B || false
}
exports.setUserIdToNote = (req, res, next) => {
  if (!req.body.user) req.body.user = req.params.userId
  next()
}
exports.viewAllNotes = HandlerFactory.getAll(Notes)
exports.viewANote = HandlerFactory.getOne(Notes)
exports.createANote = HandlerFactory.createOne(Notes)
exports.updateANote = HandlerFactory.updateOne(Notes)
exports.deleteANote = HandlerFactory.deleteOne(Notes)
exports.updateLikes = catchAsync(async (req, res, next) => {
  const note = await Notes.findById(req.params.noteId)

  const likes = note.likes.length

  if (note.likes.includes(req.params.userId)) {
    await note.updateOne({
      $pull: { likes: req.params.userId },
      $set: { likesCount: likes - 1 },
    })
  } else {
    await note.updateOne({
      $addToSet: { likes: req.params.userId },
      $set: { likesCount: likes + 1 },
    })
  }

  res.status(200).json({
    status: 'success',
    data: true,
  })
})
exports.checkPermission = catchAsync(async (req, res, next) => {
  const note = await Notes.findById(req.params.noteId)
  const per = req.params.permission

  if (per === 'view') {
    if (
      String(note.creator._id) !== req.body.user &&
      !check(note.collaborator, req.body.user) &&
      !check(note.consumer, req.body.user)
    )
      return next(
        new AppError(
          `You are not authorized for this action. Try sending a ${per} request!`,
          403,
          per,
          String(note._id)
        )
      )
  } else if (per === 'edit') {
    if (
      String(note.creator._id) !== req.body.user &&
      !check(note.collaborator, req.body.user)
    )
      return next(
        new AppError(
          `You are not authorized for this action. Try sending a ${per} request!`,
          403,
          per,
          String(note._id)
        )
      )
  }

  res.status(200).json({
    status: 'success',
    data: true,
  })
})
exports.sendRequest = catchAsync(async (req, res, next) => {
  await Notes.findByIdAndUpdate(req.body.noteId, {
    $addToSet: {
      requests: {
        userId: req.params.userId,
        noteId: req.body.noteId,
        reqType: req.body.type,
      },
    },
  })

  res.status(200).json({
    status: 'success',
    data: true,
  })
})
exports.respondRequest = catchAsync(async (req, res, next) => {
  const note = await Notes.findById(req.body.noteId)
  if (req.params.response === 'true') {
    if (req.body.reqType === 'edit') {
      await note.updateOne({
        $addToSet: { collaborator: req.body.userId, consumer: req.body.userId },
      })
      await User.findByIdAndUpdate(req.body.userId, {
        $addToSet: {
          collaboratedPosts: req.body.noteId,
          consumedPosts: req.body.noteId,
        },
      })
    } else if (req.body.reqType === 'view') {
      await note.updateOne({ $addToSet: { consumer: req.body.userId } })
      await User.findByIdAndUpdate(req.body.userId, {
        $addToSet: { consumedPosts: req.body.noteId },
      })
    }
    note.requests.filter(
      l =>
        String(l.userId) === req.body.userId &&
        String(l.noteId) === req.body.noteId &&
        l.reqType === req.body.reqType
    )[0].accepted = true
    await note.save()
  } else {
    await note.updateOne({
      $pull: {
        requests: {
          userId: req.body.userId,
          reqType: req.body.reqType,
          noteId: req.body.noteId,
        },
      },
    })
  }

  res.status(200).json({
    status: 'success',
    data: true,
  })
})
