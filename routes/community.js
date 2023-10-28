const express = require('express');
const {protect} =require('../middleware/auth')
const {
    createCommunity,getCommunities,getCommunitiesMembers,getOwnedCommunities, getJoinedCommunities
} = require('../controller/community');

const router = express.Router();

router
  .route('')
  .post(protect,createCommunity).get(getCommunities);

  router.route('/:id/members').get(getCommunitiesMembers)

router.route('/me/owner').get(protect,getOwnedCommunities)
router.route('/me/member').get(protect,getJoinedCommunities)

  module.exports = router;