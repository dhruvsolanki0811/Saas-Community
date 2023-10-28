const express = require('express');
const {protect} =require('../middleware/auth')

const {
    createMember,removeMember
} = require('../controller/member');


const router = express.Router();

router.route('').post(protect,createMember)
router.route('/:id').delete(protect,removeMember)

module.exports=router