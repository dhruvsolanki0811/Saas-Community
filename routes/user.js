const express = require('express');

const {
    createUser,login,logout,getMe
  } = require('../controller/user');
const {protect} =require('../middleware/auth')
const User = require('../model/User');

const router = express.Router();

router
  .route('/signup')
  .post(createUser);

router.route('/signin').post(login)
router.route('/logout').get( logout)
router.route('/me').get(protect,getMe)


  module.exports = router;