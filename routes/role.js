const express = require('express');

const {
createRole,getRoles
} = require('../controller/role');


const router = express.Router();

router.route('').post(createRole).get(getRoles)
module.exports=router