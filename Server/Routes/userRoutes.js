const express = require('express')
const userController = require('../Controller/userController')
const authController = require('../Controller/authController')
const noteRoutes = require('./noteRoutes')

const router = express.Router()

router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.get('/logout', authController.logout)

router.post('/forgotPassword', authController.forgotPassword)
router.patch('/resetPassword/:token', authController.resetPassword)

router.route('/').get(userController.getAllUsers)

// router.route('/:userId').get(userController.getAUser)

router.use(authController.protect)

router.get('/me', userController.getMe, userController.getAUser)
router.patch('/updateMe', userController.updateMe)
router.delete('/deleteMe', userController.deleteMe)

router
  .route('/:userId')
  .get(userController.getAUser)
  .patch(userController.updateAUser)
  .delete(userController.deleteAUser)

router.patch('/:userId/updateMyPassword', authController.updatePassword)

router.use('/:userId/note', noteRoutes)

module.exports = router
