const express = require('express')
const noteController = require('../Controller/noteController')
const authController = require('../Controller/authController')

const router = express.Router({ mergeParams: true })

router
  .route('/')
  .get(noteController.viewAllNotes)
  .post(noteController.setUserIdToNote, noteController.createANote)

router.use(noteController.setUserIdToNote).use(authController.protect)
router.route('/response/:response').patch(noteController.respondRequest)
router.route('/request').patch(noteController.sendRequest)
router
  .route('/:noteId/permission/:permission')
  .get(noteController.checkPermission)
router.route('/:noteId/like').patch(noteController.updateLikes)
router
  .route('/:noteId')
  .get(noteController.viewANote)
  .patch(noteController.updateANote)
  .delete(noteController.deleteANote)

module.exports = router
