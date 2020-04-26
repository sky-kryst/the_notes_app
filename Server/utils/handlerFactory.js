const catchAsync = require('./catchAsync')
const AppError = require('./appError')
const APIFeatures = require('./apiFeatures')
// const postPermissions = require('./postPermissions')
const Note = require('../Model/noteModel')
const User = require('../Model/userModel')

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    let doc = await Model.findById(req.params.noteId)

    if (!doc) {
      return next(new AppError('No document found with that ID', 404))
    }

    if (Model === Note) {
      // notePermissions.canDelete(doc, req)
      if (String(doc.creator._id) !== req.body.user)
        return next(
          new AppError(
            'Sorry! You can only delete notes that you haven created.',
            400
          )
        )
      const id = String(doc._id)
      await User.updateMany(
        { createdPosts: { $in: id } },
        { $pull: { createdPosts: id } }
      )
      await User.updateMany(
        { collaboratedPosts: { $in: id } },
        { $pull: { collaboratedPosts: id } }
      )
      await User.updateMany(
        { consumedPosts: { $in: id } },
        { $pull: { consumedPosts: id } }
      )
    }

    doc = await Model.findByIdAndDelete(req.params.noteId)

    res.status(204).json({
      status: 'success',
      data: true,
    })
  })

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const id = Model === Note ? req.params.noteId : req.params.userId

    let doc = await Model.findById(id)

    if (!doc) {
      return next(new AppError('No document found with that ID', 404))
    }

    doc = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    })
  })

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(
      Object.assign(
        {
          ...req.body,
          createdAt: Date.now(),
        },
        { creator: req.params.userId }
      )
    )

    const user = await User.findById(req.params.userId)
    const creator = String(doc._id)
    await user.updateOne({ $addToSet: { createdPosts: creator } })

    res.status(201).json({
      status: 'success',
      data: doc,
    })
  })

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(
      Model === Note ? req.params.noteId : req.params.userId
    )
    if (popOptions) query = query.populate(popOptions)
    const doc = await query

    if (!doc) {
      return next(new AppError('No document found with that ID', 404))
    }

    res.status(200).json({
      status: 'success',
      data: doc,
    })
  })

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    let doc
    if (Model === Note) {
      let filter = {}
      if (req.params.noteId) filter = { _id: req.params.noteId }
      const features = new APIFeatures(
        Model.find(filter).select(
          '+title +body +likesCount +creator +collaborator +consumer +likes'
        ),
        req.query
      )
        .filter()
        .sort()
        .limitFields()
        .paginate()

      doc = await features.query

      /* doc = doc.map(el => {
        let { title, body, _id, likesCount, creator, collaborator, request, consumer, likes } = el
        body.length>55? body = `${body.slice(0, 55)}...`:null
        if (title && title.length > 20) {
          title=`${title.slice(0, 20)}...`
        } else if (!title || typeof title === 'undefined') {
          title= '...'
        }
        return {_id,title,body,likesCount, creator, collaborator, request, consumer, likes }
      }) */
    } else {
      const features = new APIFeatures(Model.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate()

      doc = await features.query
    }

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: doc,
    })
  })
