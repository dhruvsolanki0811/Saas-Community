const express = require('express');
const {protect} =require('../middleware/auth')
const {
    createCommunity,getCommunities
} = require('../controller/community');

const router = express.Router();

router
  .route('')
  .post(protect,createCommunity).get(getCommunities);

  module.exports = router;