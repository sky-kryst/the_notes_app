const AppError = require('./appError')

const check = (A, b) => {
  let B
  A.forEach(el => {
    if (el._id === b) {
      B = true
    }
  })
  return B || false
}

exports.canView = (post, req, next) => {
  if (
    post.creator._id !== req.body.user &&
    !check(post.collaborator, req.body.user) &&
    !check(post.consumer, req.body.user)
  ) {
    return next(
      new AppError(
        'If you like this note, you can ask for permission to view the this note!',
        403
      )
    )
  }
}

exports.canEdit = (post, req, next) => {
  if (
    post.creator._id !== req.body.user &&
    !check(post.collaborator, req.body.user)
  ) {
    next(
      new AppError(
        'You are not authorized for this action. Try sending a request!',
        403
      )
    )
  }
}

exports.canDelete = (post, req, next) => {
  if (post.creator !== req.body.user) {
    return next(
      new AppError(
        "Sorry! You can only delete notes that you haven't created.",
        403
      )
    )
  }
}
